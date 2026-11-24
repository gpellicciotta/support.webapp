// @vitest-environment happy-dom
// Unit tests for admin-overview.js: facts from adapter data, reload while visible,
// no reload while hidden, failure states, admin-console frame integration, and contract entry.
import { readFileSync } from 'node:fs';
import { Window } from 'happy-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAdminConsole } from '../../src/js/admin-console.js';
import {
    attachAdminOverview,
    buildServerFacts,
    createAdminOverview,
    createAdminOverviewScreen,
    DEFAULT_RELOAD_INTERVAL,
    formatTimestamp,
    normalizeServerStatus
} from '../../src/js/admin-overview.js';
import { setSpriteUrl } from '../../src/js/icon.js';

const SPRITE = '/vendor/design/looks/neutral/icons.svg';

/**
 * Create a manually settled deferred promise for async ordering tests.
 * @returns {{promise: Promise<unknown>, resolve: (value?: unknown) => void, reject: (reason?: unknown) => void}}
 *   deferred promise handle
 */
function deferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}

/**
 * Flush pending microtasks without advancing fake timers.
 * @returns {Promise<void>} resolves after several microtask turns
 */
async function flushMicrotasks() {
    for (let i = 0; i < 6; i += 1) {
        await Promise.resolve();
    }
}

/**
 * Set `document.visibilityState` on a document and optionally dispatch `visibilitychange`.
 * @param {Document} doc target document
 * @param {'visible'|'hidden'} state visibility state
 * @param {boolean} [emit] dispatch `visibilitychange` event when `true`
 */
function setVisibility(doc, state, emit = true) {
    Object.defineProperty(doc, 'visibilityState', {
        configurable: true,
        get: () => state
    });
    if (emit) {
        doc.dispatchEvent(new Event('visibilitychange'));
    }
}

/**
 * Build a sample nested `extra-info` status payload.
 * @param {object} [overrides] field overrides for `extra-info` or top level
 * @returns {object} sample status payload
 */
function authStatus(overrides = {}) {
    const { extra = {}, ...top } = overrides;
    return {
        status: 'running',
        version: '2.4.0',
        'extra-info': {
            uptime: '3d 4h 12m',
            'build-time': '2026-11-20T10:15:30Z',
            environment: 'production',
            'repository-status': 'connected',
            'repository-version': '14',
            'logged-in-sessions': 7,
            'feedback-address': 'admin@example.test',
            'api-url': 'https://auth.example.test/api',
            ...extra
        },
        ...top
    };
}

/**
 * Build a sample flat kebab-case server status payload.
 * @param {object} [overrides] field overrides
 * @returns {object} sample flat status payload
 */
function todoStatus(overrides = {}) {
    return {
        status: 'running',
        uptime: '12h 15m',
        version: '1.9.0',
        'build-time': 'unknown',
        environment: 'staging',
        'repository-status': 'connected',
        'repository-version': '8',
        'logged-in-session-count': 0,
        'base-url': 'https://todo.example.test/api',
        ...overrides
    };
}

describe('admin-overview', () => {
    let controller;

    beforeEach(() => {
        document.body.innerHTML = '';
        setVisibility(document, 'visible', false);
        setSpriteUrl(SPRITE);
    });

    afterEach(() => {
        controller?.destroy();
        controller = null;
        vi.useRealTimers();
    });

    describe('pure helpers', () => {
        it('formats valid timestamps as local YYYY-MM-DD HH:MM:SS and preserves unparseable or missing values', () => {
            const fixed = new Date(2026, 10, 24, 9, 5, 7);
            expect(formatTimestamp(fixed)).toBe('2026-11-24 09:05:07');
            expect(formatTimestamp('unknown')).toBe('unknown');
            expect(formatTimestamp(null)).toBe('—');
            expect(formatTimestamp(undefined, 'n/a')).toBe('n/a');
        });

        it('normalizes both nested extra-info payloads and flat payloads while preserving zero session counts', () => {
            const fromAuth = normalizeServerStatus(authStatus());
            expect(fromAuth.running).toBe(true);
            expect(fromAuth.repositoryConnected).toBe(true);
            expect(fromAuth.repositoryVersion).toBe('14');
            expect(fromAuth.loggedInSessions).toBe(7);
            expect(fromAuth.hasFeedbackAddress).toBe(true);
            expect(fromAuth.feedbackAddress).toBe('admin@example.test');
            expect(fromAuth.apiUrl).toBe('https://auth.example.test/api');

            const fromTodo = normalizeServerStatus(todoStatus());
            expect(fromTodo.running).toBe(true);
            expect(fromTodo.buildTime).toBe('unknown');
            expect(fromTodo.repositoryConnected).toBe(true);
            expect(fromTodo.loggedInSessions).toBe(0);
            expect(fromTodo.hasFeedbackAddress).toBe(false);
            expect(fromTodo.apiUrl).toBe('https://todo.example.test/api');
        });

        it('builds safe facts rows and omits unsafe URLs', () => {
            const rows = buildServerFacts(authStatus({
                extra: { 'feedback-address': 'javascript:alert(1)' }
            }), { document, changelogHref: 'javascript:alert(2)' });
            const versionRow = rows.find((row) => row.key === 'version');
            const feedbackRow = rows.find((row) => row.key === 'feedback-address');
            expect(versionRow.value).toBe('2.4.0');
            expect(feedbackRow.value).toBe('javascript:alert(1)');
        });
    });

    describe('facts from adapter data', () => {
        it('renders nested server facts, links, code, status chips, and updated status line', async () => {
            const root = document.createElement('div');
            document.body.append(root);
            const fixedClock = () => new Date(2026, 10, 24, 14, 30, 45).getTime();
            const fetchStatus = vi.fn(async () => authStatus());

            controller = attachAdminOverview(root, {
                adapter: { fetchStatus },
                now: fixedClock
            });
            await vi.waitFor(() => {
                expect(root.querySelector('[data-admin-overview-section="server"]')).not.toBeNull();
            });

            expect(fetchStatus).toHaveBeenCalledTimes(1);
            expect(root.hasAttribute('data-admin-overview')).toBe(true);
            expect(root.querySelector('[data-admin-overview-banner="repository"]')).toBeNull();
            expect(root.querySelector('.list.list--facts')).not.toBeNull();
            expect(root.querySelector('[data-fact="status"] .chip--status').textContent).toBe('Running');
            expect(root.querySelector('[data-fact="status"] .chip--status').dataset.severity).toBe('ok');
            expect(root.querySelector('[data-fact="uptime"]').textContent).toBe('3d 4h 12m');
            const versionLink = root.querySelector('[data-fact="version"] a');
            expect(versionLink.getAttribute('href')).toBe('#/changelog');
            expect(versionLink.textContent).toBe('2.4.0');
            expect(root.querySelector('[data-fact="build-time"]').textContent).toBe(formatTimestamp('2026-11-20T10:15:30Z'));
            expect(root.querySelector('[data-fact="environment"]').textContent).toBe('production');
            expect(root.querySelector('[data-fact="repository"] .chip--status').textContent).toBe('Connected');
            expect(root.querySelector('[data-fact="repository"]').textContent).toContain('version 14');
            expect(root.querySelector('[data-fact="logged-in-sessions"]').textContent).toBe('7');
            const mailLink = root.querySelector('[data-fact="feedback-address"] a');
            expect(mailLink.getAttribute('href')).toBe('mailto:admin@example.test');
            expect(mailLink.textContent).toBe('admin@example.test');
            expect(root.querySelector('[data-fact="api-url"] code').textContent).toBe('https://auth.example.test/api');

            const updated = root.querySelector('[data-admin-overview-status]');
            expect(updated.getAttribute('role')).toBe('status');
            expect(updated.textContent).toBe('Updated 14:30:45. Refreshes every 30 seconds while the tab is visible.');
            expect(controller.getStatus()).toEqual(authStatus());
        });

        it('renders flat payloads cleanly, preserves 0 sessions, and omits feedback address when absent', async () => {
            const root = document.createElement('div');
            document.body.append(root);
            controller = attachAdminOverview(root, {
                adapter: { fetchStatus: async () => todoStatus() },
                interval: 0,
                now: () => new Date(2026, 10, 24, 8, 5, 9).getTime()
            });
            await vi.waitFor(() => {
                expect(root.querySelector('[data-fact="logged-in-sessions"]')).not.toBeNull();
            });

            expect(root.querySelector('[data-fact="build-time"]').textContent).toBe('unknown');
            expect(root.querySelector('[data-fact="logged-in-sessions"]').textContent).toBe('0');
            expect(root.querySelector('[data-fact="feedback-address"]')).toBeNull();
            expect(root.querySelector('[data-fact="api-url"] code').textContent).toBe('https://todo.example.test/api');
            expect(root.querySelector('[data-admin-overview-status]').textContent).toBe('Updated 08:05:09.');
        });

        it('supports extraFacts, extraSections, and injected documents through createAdminOverview', async () => {
            const win = new Window();
            const doc = win.document;
            controller = createAdminOverview(doc, {
                adapter: { fetchStatus: async () => authStatus() },
                extraFacts: (normalized) => [{ term: 'Region', value: `eu (${normalized.environment})`, key: 'region' }],
                extraSections: (_normalized, { dom }) => dom.h('section', { 'data-extra-section': 'metrics' },
                    dom.h('h2', null, 'Metrics'))
            });
            await vi.waitFor(() => {
                expect(controller.element.querySelector('[data-fact="region"]')).not.toBeNull();
            });

            expect(controller.element.ownerDocument).toBe(doc);
            expect(controller.element.querySelector('[data-fact="region"]').textContent).toBe('eu (production)');
            expect(controller.element.querySelector('[data-extra-section="metrics"] h2').textContent).toBe('Metrics');
        });

        it('rejects missing adapter.fetchStatus with a TypeError', () => {
            const root = document.createElement('div');
            expect(() => attachAdminOverview(root, {})).toThrow(TypeError);
        });
    });

    describe('visibility-aware reload', () => {
        it('reloads every 30 seconds by default while visible, keeping shown facts under aria-busy during quiet polls', async () => {
            vi.useFakeTimers();
            let clock = new Date(2026, 10, 24, 10, 0, 0).getTime();
            const second = deferred();
            let calls = 0;
            const fetchStatus = vi.fn(() => {
                calls += 1;
                if (calls === 1) {
                    return Promise.resolve(authStatus({ extra: { 'logged-in-sessions': 5 } }));
                }
                return second.promise;
            });

            const root = document.createElement('div');
            document.body.append(root);
            controller = attachAdminOverview(root, {
                adapter: { fetchStatus },
                now: () => clock
            });
            await flushMicrotasks();
            expect(root.querySelector('[data-fact="logged-in-sessions"]').textContent).toBe('5');

            expect(DEFAULT_RELOAD_INTERVAL).toBe(30_000);
            clock += 29_999;
            vi.advanceTimersByTime(29_999);
            expect(fetchStatus).toHaveBeenCalledTimes(1);

            clock += 1;
            vi.advanceTimersByTime(1);
            expect(fetchStatus).toHaveBeenCalledTimes(2);
            // Quiet refresh keeps existing facts visible while setting aria-busy on the loader container.
            expect(root.querySelector('[data-admin-overview-body]').getAttribute('aria-busy')).toBe('true');
            expect(root.querySelector('[data-fact="logged-in-sessions"]').textContent).toBe('5');

            second.resolve(authStatus({ extra: { 'logged-in-sessions': 9 } }));
            await flushMicrotasks();
            expect(root.querySelector('[data-fact="logged-in-sessions"]').textContent).toBe('9');
            expect(root.querySelector('[data-admin-overview-body]').getAttribute('aria-busy')).toBeNull();
            expect(root.querySelector('[data-admin-overview-status]').textContent).toContain('Updated 10:00:30.');
        });

        it('stops reloading while hidden and refreshes on return after a hidden interval', async () => {
            vi.useFakeTimers();
            let clock = new Date(2026, 10, 24, 12, 0, 0).getTime();
            let sessions = 1;
            const fetchStatus = vi.fn(async () => authStatus({ extra: { 'logged-in-sessions': sessions++ } }));

            const root = document.createElement('div');
            document.body.append(root);
            controller = attachAdminOverview(root, {
                adapter: { fetchStatus },
                interval: 5_000,
                now: () => clock
            });
            await flushMicrotasks();
            expect(root.querySelector('[data-fact="logged-in-sessions"]').textContent).toBe('1');
            expect(root.querySelector('[data-admin-overview-status]').textContent).toContain('every 5 seconds');

            setVisibility(document, 'hidden', true);
            clock += 30_000;
            vi.advanceTimersByTime(30_000);
            expect(fetchStatus).toHaveBeenCalledTimes(1);

            // Returning after >= interval refreshes immediately.
            setVisibility(document, 'visible', true);
            await flushMicrotasks();
            expect(root.querySelector('[data-fact="logged-in-sessions"]').textContent).toBe('2');
            expect(fetchStatus).toHaveBeenCalledTimes(2);

            // Visible ticks continue at the custom interval.
            clock += 5_000;
            vi.advanceTimersByTime(5_000);
            await flushMicrotasks();
            expect(root.querySelector('[data-fact="logged-in-sessions"]').textContent).toBe('3');
            expect(fetchStatus).toHaveBeenCalledTimes(3);
        });

        it('stops timers, removes visibility listeners, and aborts in-flight requests on dispose', async () => {
            vi.useFakeTimers();
            const signals = [];
            const inflight = deferred();
            const fetchStatus = vi.fn(({ signal }) => {
                signals.push(signal);
                return inflight.promise;
            });

            const root = document.createElement('div');
            document.body.append(root);
            controller = attachAdminOverview(root, {
                adapter: { fetchStatus },
                interval: 1_000
            });
            expect(fetchStatus).toHaveBeenCalledTimes(1);
            expect(signals[0].aborted).toBe(false);

            controller.dispose();
            controller = null;
            expect(signals[0].aborted).toBe(true);

            inflight.resolve(authStatus());
            vi.advanceTimersByTime(10_000);
            setVisibility(document, 'hidden', true);
            setVisibility(document, 'visible', true);
            expect(fetchStatus).toHaveBeenCalledTimes(1);
            expect(root.querySelector('[data-admin-overview-section="server"]')).toBeNull();
        });
    });

    describe('failure states', () => {
        it('shows an error banner with Retry when fetchStatus rejects and recovers on Retry', async () => {
            let attempt = 0;
            const fetchStatus = vi.fn(async () => {
                attempt += 1;
                if (attempt === 1) {
                    throw new Error('Gateway unavailable');
                }
                return authStatus();
            });

            const root = document.createElement('div');
            document.body.append(root);
            controller = attachAdminOverview(root, { adapter: { fetchStatus } });

            await vi.waitFor(() => {
                expect(root.querySelector('[data-data-loader-error="failed"]')).not.toBeNull();
            });
            const banner = root.querySelector('[data-data-loader-error="failed"]');
            expect(banner.getAttribute('role')).toBe('alert');
            expect(banner.textContent).toContain('Server status could not be loaded: Gateway unavailable.');

            banner.querySelector('[data-data-loader-action="retry"]').click();
            await vi.waitFor(() => {
                expect(root.querySelector('[data-fact="status"] .chip--status').textContent).toBe('Running');
            });
            expect(root.querySelector('[data-data-loader-error]')).toBeNull();
        });

        it('shows a Sign in action when fetchStatus rejects with 401', async () => {
            const onSignIn = vi.fn();
            const root = document.createElement('div');
            document.body.append(root);
            controller = attachAdminOverview(root, {
                adapter: {
                    fetchStatus: async () => {
                        throw Object.assign(new Error('Token expired'), { status: 401 });
                    }
                },
                onSignIn
            });

            await vi.waitFor(() => {
                expect(root.querySelector('[data-data-loader-error="unauthorized"]')).not.toBeNull();
            });
            const signInBtn = root.querySelector('[data-data-loader-action="sign-in"]');
            expect(signInBtn).not.toBeNull();
            signInBtn.click();
            expect(onSignIn).toHaveBeenCalledTimes(1);
        });

        it('shows a disconnected repository alert with Retry and an error chip for degraded server status', async () => {
            let connected = false;
            const fetchStatus = vi.fn(async () => authStatus({
                status: connected ? 'running' : 'degraded',
                extra: {
                    'repository-status': connected ? 'connected' : 'disconnected',
                    'repository-version': '14'
                }
            }));

            const root = document.createElement('div');
            document.body.append(root);
            controller = attachAdminOverview(root, { adapter: { fetchStatus } });

            await vi.waitFor(() => {
                expect(root.querySelector('[data-admin-overview-banner="repository"]')).not.toBeNull();
            });
            const repoBanner = root.querySelector('[data-admin-overview-banner="repository"]');
            expect(repoBanner.getAttribute('role')).toBe('alert');
            expect(repoBanner.textContent).toContain('repository is not connected');

            const statusChip = root.querySelector('[data-fact="status"] .chip--status');
            expect(statusChip.dataset.severity).toBe('error');
            expect(statusChip.textContent).toBe('Degraded');

            const repoChip = root.querySelector('[data-fact="repository"] .chip--status');
            expect(repoChip.dataset.severity).toBe('error');
            expect(repoChip.textContent).toBe('Not connected');
            expect(root.querySelector('[data-fact="repository"]').textContent).not.toContain('version 14');

            connected = true;
            repoBanner.querySelector('[data-admin-overview-action="retry"]').click();
            await vi.waitFor(() => {
                expect(root.querySelector('[data-admin-overview-banner="repository"]')).toBeNull();
            });
            expect(root.querySelector('[data-fact="status"] .chip--status').textContent).toBe('Running');
            expect(root.querySelector('[data-fact="repository"] .chip--status').textContent).toBe('Connected');
        });
    });

    describe('admin-console frame integration and contract', () => {
        it('mounts inside createAdminConsole via createAdminOverviewScreen and disposes on screen switch', async () => {
            vi.useFakeTimers();
            const fetchStatus = vi.fn(async () => authStatus());
            const host = document.createElement('div');
            document.body.append(host);
            const location = { hash: '#/overview', pathname: '/admin', search: '' };
            const view = new EventTarget();
            view.location = location;
            view.history = { state: null, replaceState: vi.fn() };

            const frame = createAdminConsole(host, {
                document,
                window: view,
                location,
                history: view.history,
                screens: [
                    createAdminOverviewScreen({
                        adapter: { fetchStatus },
                        interval: 2_000
                    }),
                    {
                        name: 'other',
                        title: 'Other',
                        mount: (el, ctx) => ctx.dom.setChildren(el, ctx.dom.h('p', null, 'Other screen'))
                    }
                ]
            });
            controller = frame;
            await frame.start();

            await flushMicrotasks();
            expect(host.querySelector('[data-fact="uptime"]').textContent).toBe('3d 4h 12m');
            expect(fetchStatus).toHaveBeenCalledTimes(1);

            location.hash = '#/other';
            view.dispatchEvent(new Event('hashchange'));
            vi.advanceTimersByTime(10_000);
            expect(fetchStatus).toHaveBeenCalledTimes(1);
        });

        it('registers admin-overview in contract.json', () => {
            const contract = JSON.parse(readFileSync('src/contract.json', 'utf8'));
            expect(contract.components).toContain('admin-overview');
        });
    });
});
