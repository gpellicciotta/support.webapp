// @vitest-environment happy-dom
// Unit tests for admin-changelog.js: adapter loading (array and envelope shapes), paging ten at a time,
// empty/failure/401 states, concurrency, admin-console frame integration, and contract entry.
import { readFileSync } from 'node:fs';
import { Window } from 'happy-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import {
    attachAdminChangelog,
    createAdminChangelog,
    createAdminChangelogScreen,
    DEFAULT_PAGE_SIZE,
    normalizeReleasesResult
} from '../../src/js/admin-changelog.js';
import { createAdminConsole } from '../../src/js/admin-console.js';
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
 * Flush pending microtasks without relying on timers.
 * @returns {Promise<void>} resolves after several microtask turns
 */
async function flushMicrotasks() {
    for (let i = 0; i < 6; i += 1) {
        await Promise.resolve();
    }
}

/**
 * Build a sample list of parsed releases, newest first.
 * @param {number} count number of releases to generate
 * @returns {object[]} parsed release objects
 */
function makeAuthReleases(count) {
    return Array.from({ length: count }, (_, index) => {
        const number = count - index;
        if (index === 0) {
            return {
                version: `1.${number}.0`,
                isPreRelease: true,
                tag: 'in development',
                isLatest: false,
                entries: [
                    {
                        rawText: 'Modules: **[breaking]** Added `admin-changelog` in [components.md](docs/specs/components.md).',
                        text: 'Added `admin-changelog` in [components.md](docs/specs/components.md).',
                        category: 'feature',
                        isUserFacing: true,
                        isBreaking: true
                    },
                    {
                        rawText: 'Docs: Updated upgrade notes.',
                        text: 'Updated upgrade notes.',
                        category: 'internal',
                        isUserFacing: false,
                        isBreaking: false
                    }
                ]
            };
        }
        if (index === 1) {
            return {
                version: `1.${number}.0`,
                isPreRelease: false,
                tag: 'released: 2026-11-23',
                isLatest: true,
                entries: [
                    {
                        rawText: 'Modules: Added `admin-sessions` screen.',
                        text: 'Added `admin-sessions` screen.',
                        category: 'feature',
                        isUserFacing: true,
                        isBreaking: false
                    }
                ]
            };
        }
        if (index === 2) {
            return {
                version: `1.${number}.0`,
                isPreRelease: false,
                tag: '2026-11-18',
                isLatest: false,
                entries: [
                    {
                        rawText: 'Shell: Refined sidebar spacing.',
                        text: 'Refined sidebar spacing.',
                        category: 'ux',
                        isUserFacing: true,
                        isBreaking: false
                    }
                ]
            };
        }
        if (index === 3) {
            return {
                version: `1.${number}.0`,
                isPreRelease: false,
                tag: 'released: 2026-11-10 • broken',
                isLatest: false,
                entries: [
                    {
                        rawText: 'CLI: Reverted broken lockfile write.',
                        text: 'Reverted broken lockfile write.',
                        category: 'fix',
                        isUserFacing: true,
                        isBreaking: false
                    }
                ]
            };
        }
        return {
            version: `1.${number}.0`,
            isPreRelease: false,
            tag: `released: 2026-10-${String(Math.max(1, 28 - index)).padStart(2, '0')}`,
            isLatest: false,
            entries: [
                {
                    rawText: `Components: Delivered release ${number} updates.`,
                    text: `Delivered release ${number} updates.`,
                    category: 'feature',
                    isUserFacing: true,
                    isBreaking: false
                }
            ]
        };
    });
}

/**
 * Build a sample `/changelog` envelope `{ releases: [...] }`.
 * @param {number} count number of releases to generate
 * @returns {{releases: object[]}} changelog envelope
 */
function makeTodoEnvelope(count) {
    return {
        releases: Array.from({ length: count }, (_, index) => ({
            version: `2.${count - index}.0`,
            status: index === 0 ? 'in-development' : (index === 1 ? 'released' : 'frozen'),
            date: index === 0 ? null : `2026-11-${String(Math.max(1, 24 - index)).padStart(2, '0')}`,
            entries: [
                { category: 'API', text: `Served \`/changelog\` item ${count - index}.` }
            ]
        }))
    };
}

describe('admin-changelog', () => {
    let controller;

    beforeEach(() => {
        document.body.innerHTML = '';
        setSpriteUrl(SPRITE);
    });

    afterEach(() => {
        controller?.destroy();
        controller = null;
    });

    describe('pure helpers and validation', () => {
        it('exports DEFAULT_PAGE_SIZE of 10 and normalizes arrays and envelopes', () => {
            expect(DEFAULT_PAGE_SIZE).toBe(10);

            const list = [{ version: '1.0.0', entries: [] }];
            const fromArray = normalizeReleasesResult(list);
            expect(fromArray).toEqual(list);
            expect(fromArray).not.toBe(list);

            expect(normalizeReleasesResult({ releases: list })).toEqual(list);
            expect(normalizeReleasesResult({ items: list })).toEqual(list);
            expect(normalizeReleasesResult(null)).toEqual([]);
            expect(normalizeReleasesResult(undefined)).toEqual([]);
            expect(normalizeReleasesResult('invalid')).toEqual([]);
            expect(normalizeReleasesResult({})).toEqual([]);
        });

        it('rejects missing root element or missing adapter.fetchReleases', () => {
            expect(() => attachAdminChangelog(null, { adapter: { fetchReleases: async () => [] } })).toThrow(TypeError);
            const root = document.createElement('div');
            expect(() => attachAdminChangelog(root, {})).toThrow(TypeError);
            expect(() => attachAdminChangelog(root, { adapter: {} })).toThrow(TypeError);
            expect(() => createAdminChangelogScreen({})).toThrow(TypeError);
        });
    });

    describe('adapter loading and rendering', () => {
        it('shows loading status while fetching and renders parsed releases grouped by area with statuses', async () => {
            const pending = deferred();
            const fetchReleases = vi.fn(() => pending.promise);
            const root = document.createElement('div');
            document.body.append(root);

            controller = attachAdminChangelog(root, { adapter: { fetchReleases } });

            expect(root.hasAttribute('data-admin-changelog')).toBe(true);
            const status = root.querySelector('[data-data-loader-status]');
            expect(status?.getAttribute('role')).toBe('status');
            expect(status?.textContent).toBe('Loading changelog…');
            expect(fetchReleases).toHaveBeenCalledTimes(1);

            pending.resolve(makeAuthReleases(4));
            await flushMicrotasks();

            expect(root.querySelector('[data-data-loader-status]')).toBeNull();
            expect(root.querySelector('[data-release-notes]')).not.toBeNull();
            expect(root.querySelector('[data-release-notes-filters]')).toBeNull();
            const blocks = [...root.querySelectorAll('[data-release-notes-release]')];
            expect(blocks).toHaveLength(4);
            // Open sections (non-collapsible) by default with <h2> headings and <h3> area groups.
            expect(blocks[0].tagName).toBe('SECTION');
            expect(blocks[0].querySelector('h2')?.textContent).toBe('v1.4.0-pre');
            expect([...blocks[0].querySelectorAll('[data-release-notes-area] h3')].map((el) => el.textContent)).toEqual(['Modules', 'Docs']);
            expect(blocks[0].querySelector('[data-release-notes-breaking]')?.textContent).toBe('Breaking');
            expect(blocks[0].querySelector('code')?.textContent).toBe('admin-changelog');
            expect(blocks[0].querySelector('a')).toBeNull();
            expect(blocks[0].textContent).toContain('in components.md.');

            const statuses = blocks.map((el) => el.querySelector('[data-release-notes-status]')?.getAttribute('data-release-notes-status'));
            expect(statuses).toEqual(['in-development', 'released', 'frozen', 'broken']);
            expect(controller.getReleases()).toHaveLength(4);
            expect(controller.getReleaseNotes()).not.toBeNull();
        });

        it('renders changelog envelopes and empty state when no releases are returned', async () => {
            const root = document.createElement('div');
            document.body.append(root);

            let response = makeTodoEnvelope(2);
            controller = attachAdminChangelog(root, {
                adapter: { fetchReleases: async () => response }
            });
            await flushMicrotasks();

            const blocks = [...root.querySelectorAll('[data-release-notes-release]')];
            expect(blocks).toHaveLength(2);
            expect(blocks[0].querySelector('[data-release-notes-status]')?.getAttribute('data-release-notes-status')).toBe('in-development');
            expect(blocks[0].querySelector('[data-release-notes-area] h3')?.textContent).toBe('API');
            expect(blocks[0].querySelector('code')?.textContent).toBe('/changelog');
            expect(blocks[1].querySelector('[data-release-notes-status]')?.getAttribute('data-release-notes-status')).toBe('released');

            response = { releases: [] };
            const rendered = await controller.refresh();
            expect(rendered).toBe(true);
            const empty = root.querySelector('[data-admin-changelog-empty]');
            expect(empty).not.toBeNull();
            expect(empty?.classList.contains('empty-state')).toBe(true);
            expect(empty?.textContent).toContain('The changelog has no releases.');
            expect(root.querySelector('[data-release-notes]')).toBeNull();
            expect(controller.getReleases()).toEqual([]);
            expect(controller.getReleaseNotes()).toBeNull();
        });

        it('supports autoLoad: false, release-notes overrides, and extraSections extension hook', async () => {
            const fetchReleases = vi.fn(async () => makeAuthReleases(3));
            const root = document.createElement('div');
            document.body.append(root);

            controller = attachAdminChangelog(root, {
                adapter: { fetchReleases },
                autoLoad: false,
                collapsible: true,
                showFilter: true,
                extraSections: (releases, { dom }) => dom.h('p', { 'data-extra-summary': '' }, `${releases.length} total`)
            });

            expect(fetchReleases).not.toHaveBeenCalled();
            expect(controller.getFilter()).toBeNull();

            await controller.refresh();
            expect(fetchReleases).toHaveBeenCalledTimes(1);
            expect(root.querySelector('[data-release-notes-filters]')).not.toBeNull();
            expect(controller.getFilter()).toBe('user');
            expect(root.querySelector('[data-extra-summary]')?.textContent).toBe('3 total');

            controller.setFilter('all');
            expect(controller.getFilter()).toBe('all');

            controller.expandAll();
            const toggles = [...root.querySelectorAll('[data-release-notes-release] > button[aria-controls]')];
            expect(toggles.every((btn) => btn.getAttribute('aria-expanded') === 'true')).toBe(true);

            controller.collapseAll();
            expect(toggles.every((btn) => btn.getAttribute('aria-expanded') === 'false')).toBe(true);
        });
    });

    describe('paging ten at a time', () => {
        it('shows 10 releases initially, reveals older pages via Show older, and resets paging on refresh', async () => {
            const root = document.createElement('div');
            document.body.append(root);

            controller = attachAdminChangelog(root, {
                adapter: { fetchReleases: async () => makeAuthReleases(21) }
            });
            await flushMicrotasks();

            expect(root.querySelectorAll('[data-release-notes-release]')).toHaveLength(10);
            let more = root.querySelector('[data-release-notes-more]');
            expect(more?.textContent).toBe('Show 10 older releases');

            more.click();
            expect(root.querySelectorAll('[data-release-notes-release]')).toHaveLength(20);
            more = root.querySelector('[data-release-notes-more]');
            expect(more?.textContent).toBe('Show 1 older release');

            controller.showMore();
            expect(root.querySelectorAll('[data-release-notes-release]')).toHaveLength(21);
            expect(root.querySelector('[data-release-notes-more]')).toBeNull();

            // Refresh resets back to the first page of 10 releases.
            await controller.refresh();
            expect(root.querySelectorAll('[data-release-notes-release]')).toHaveLength(10);
            expect(root.querySelector('[data-release-notes-more]')?.textContent).toBe('Show 10 older releases');
        });
    });

    describe('failure, 401, concurrency, and lifecycle', () => {
        it('renders a Retry error banner on failure and recovers on click', async () => {
            const root = document.createElement('div');
            document.body.append(root);
            const fetchReleases = vi.fn()
                .mockRejectedValueOnce(new Error('Changelog file unavailable'))
                .mockResolvedValueOnce(makeAuthReleases(2));

            controller = attachAdminChangelog(root, { adapter: { fetchReleases } });
            await flushMicrotasks();

            const banner = root.querySelector('[data-data-loader-error="failed"]');
            expect(banner?.getAttribute('role')).toBe('alert');
            expect(banner?.textContent).toContain('Changelog could not be loaded: Changelog file unavailable.');

            banner.querySelector('[data-data-loader-action="retry"]')?.click();
            await flushMicrotasks();

            expect(root.querySelector('[data-data-loader-error]')).toBeNull();
            expect(root.querySelectorAll('[data-release-notes-release]')).toHaveLength(2);
            expect(fetchReleases).toHaveBeenCalledTimes(2);
        });

        it('renders a Sign in banner on 401 and calls onSignIn', async () => {
            const root = document.createElement('div');
            document.body.append(root);
            const onSignIn = vi.fn();

            controller = attachAdminChangelog(root, {
                adapter: {
                    fetchReleases: async () => {
                        throw Object.assign(new Error('Session expired'), { status: 401 });
                    }
                },
                onSignIn
            });
            await flushMicrotasks();

            const banner = root.querySelector('[data-data-loader-error="unauthorized"]');
            expect(banner?.getAttribute('role')).toBe('alert');
            expect(banner?.textContent).toContain('Sign in again.');

            banner.querySelector('[data-data-loader-action="sign-in"]')?.click();
            expect(onSignIn).toHaveBeenCalledTimes(1);
        });

        it('aborts superseded fetches so newest call wins and supports quiet refresh', async () => {
            const first = deferred();
            const second = deferred();
            const signals = [];
            const fetchReleases = vi.fn(({ signal }) => {
                signals.push(signal);
                return signals.length === 1 ? first.promise : second.promise;
            });
            const root = document.createElement('div');
            document.body.append(root);

            controller = attachAdminChangelog(root, { adapter: { fetchReleases } });
            const secondPromise = controller.refresh();

            expect(signals[0]?.aborted).toBe(true);
            expect(signals[1]?.aborted).toBe(false);

            second.resolve(makeAuthReleases(2));
            await expect(secondPromise).resolves.toBe(true);
            expect(root.querySelectorAll('[data-release-notes-release]')).toHaveLength(2);

            // Late resolution from the aborted first call must not overwrite the second render.
            first.resolve(makeAuthReleases(5));
            await flushMicrotasks();
            expect(root.querySelectorAll('[data-release-notes-release]')).toHaveLength(2);

            // Quiet refresh keeps rendered content visible under aria-busy while fetching.
            const third = deferred();
            fetchReleases.mockImplementationOnce(() => third.promise);
            const quietPromise = controller.refresh({ quiet: true });
            const body = root.querySelector('[data-admin-changelog-body]');
            expect(body?.getAttribute('aria-busy')).toBe('true');
            expect(root.querySelectorAll('[data-release-notes-release]')).toHaveLength(2);

            third.resolve(makeAuthReleases(3));
            await expect(quietPromise).resolves.toBe(true);
            expect(body?.hasAttribute('aria-busy')).toBe(false);
            expect(root.querySelectorAll('[data-release-notes-release]')).toHaveLength(3);
        });

        it('disposes cleanly on destroy and external signal abort and works in an injected document', async () => {
            const win = new Window();
            const doc = win.document;
            const pending = deferred();
            let observedSignal = null;
            const external = new AbortController();

            const injected = createAdminChangelog(doc, {
                adapter: {
                    fetchReleases: ({ signal }) => {
                        observedSignal = signal;
                        return pending.promise;
                    }
                },
                signal: external.signal
            });
            doc.body.append(injected.element);
            expect(injected.element.ownerDocument).toBe(doc);

            external.abort();
            expect(observedSignal?.aborted).toBe(true);
            await expect(injected.refresh()).resolves.toBe(false);

            pending.resolve(makeAuthReleases(2));
            await flushMicrotasks();
            expect(injected.element.querySelectorAll('[data-release-notes-release]')).toHaveLength(0);
            win.close();
        });
    });

    describe('admin-console frame integration and contract', () => {
        it('mounts via createAdminChangelogScreen inside createAdminConsole and disposes on navigation', async () => {
            const host = document.createElement('div');
            document.body.append(host);
            let aborted = false;
            const onSignIn = vi.fn();
            const location = { hash: '#/changelog', pathname: '/admin', search: '' };
            const view = new EventTarget();
            view.location = location;
            view.history = { state: null, replaceState: vi.fn() };

            const consoleFrame = createAdminConsole(host, {
                document,
                window: view,
                location,
                history: view.history,
                title: 'Admin Console',
                onSignIn,
                screens: [
                    createAdminChangelogScreen({
                        adapter: {
                            fetchReleases: async ({ signal }) => {
                                signal?.addEventListener('abort', () => {
                                    aborted = true;
                                });
                                return makeAuthReleases(12);
                            }
                        }
                    }),
                    {
                        name: 'other',
                        title: 'Other',
                        mount: (el, ctx) => ctx.dom.setChildren(el, ctx.dom.h('p', null, 'Other screen'))
                    }
                ]
            });

            try {
                await consoleFrame.start();
                await flushMicrotasks();

                expect(host.querySelector('[data-admin-console-title]')?.textContent).toBe('Changelog');
                expect(host.querySelector('[data-admin-console-nav="changelog"]')?.getAttribute('aria-current')).toBe('page');
                expect(host.querySelectorAll('[data-release-notes-release]')).toHaveLength(10);
                expect(host.querySelector('[data-release-notes-more]')?.textContent).toBe('Show 2 older releases');

                location.hash = '#/other';
                view.dispatchEvent(new Event('hashchange'));
                await flushMicrotasks();
                expect(aborted).toBe(true);
                expect(host.querySelector('[data-admin-console-title]')?.textContent).toBe('Other');
            }
            finally {
                consoleFrame.destroy();
            }
        });

        it('registers admin-changelog in src/contract.json', () => {
            const contract = JSON.parse(readFileSync('src/contract.json', 'utf8'));
            expect(contract.components).toContain('admin-changelog');
        });
    });
});
