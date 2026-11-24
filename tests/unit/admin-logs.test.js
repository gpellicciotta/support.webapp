// @vitest-environment happy-dom
// Unit tests for admin-logs.js: indent stripping, level and text filters, paging, URL hash persistence,
// empty states, data-loader failure/401 handling, admin-console frame integration, and contract entry.
import { readFileSync } from 'node:fs';
import { Window } from 'happy-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAdminConsole } from '../../src/js/admin-console.js';
import {
    attachAdminLogs,
    createAdminLogs,
    createAdminLogsScreen,
    DEFAULT_LOG_LEVELS,
    DEFAULT_LOG_SIZE,
    DEFAULT_LOG_SIZES,
    filterLogEntries,
    formatLogTime,
    normalizeLogEntries,
    stripIndent
} from '../../src/js/admin-logs.js';
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
 * Flush pending microtasks without advancing timers.
 * @returns {Promise<void>} resolves after several microtask turns
 */
async function flushMicrotasks() {
    for (let i = 0; i < 6; i += 1) {
        await Promise.resolve();
    }
}

/**
 * Create an isolated mock location and history pair for URL hash assertions.
 * @param {string} [initialHash] initial `location.hash`, e.g. `'#/logs'`
 * @returns {{location: {pathname: string, search: string, hash: string}, history: {state: unknown, calls: Array, replaceState: Function}}}
 *   navigation stubs
 */
function createNav(initialHash = '#/logs') {
    const location = { pathname: '/admin/', search: '', hash: initialHash };
    const calls = [];
    const history = {
        state: null,
        calls,
        replaceState(state, title, url) {
            calls.push({ state, title, url });
            const hashAt = String(url).indexOf('#');
            location.hash = hashAt >= 0 ? String(url).slice(hashAt) : '';
        }
    };
    return { location, history };
}

/**
 * Build sample newest-first log entries covering all levels and multiline stack traces.
 * @returns {Array<{time: string, level: string, name: string, message: string}>} sample log entries
 */
function sampleEntries() {
    return [
        {
            time: '2026-11-24T09:15:30Z',
            level: 'ERROR',
            name: 'org.example.auth.TokenService',
            message: '\n    Token signature rejected\n        at TokenService.verify(TokenService.java:84)\n        at AuthFilter.handle(AuthFilter.java:41)   \n'
        },
        {
            time: '2026-11-24T09:12:00Z',
            level: 'WARN',
            name: 'org.example.auth.RateLimiter',
            message: '  Rate limit threshold reached for client 10.0.0.4  '
        },
        {
            time: '2026-11-24T09:10:05Z',
            level: 'INFO',
            name: 'org.example.http.Server',
            message: 'Started listener on port 8080'
        },
        {
            time: '2026-11-24T09:08:11Z',
            level: 'DEBUG',
            name: 'org.example.db.Pool',
            message: 'Checked out connection #7'
        },
        {
            time: '2026-11-24T09:05:44Z',
            level: 'ERROR',
            name: 'org.example.db.Repository',
            message: '    Database timeout\n    retrying connection'
        }
    ];
}

describe('admin-logs', () => {
    let controller;

    beforeEach(() => {
        document.body.innerHTML = '';
        setSpriteUrl(SPRITE);
    });

    afterEach(() => {
        controller?.destroy();
        controller = null;
    });

    it('registers admin-logs in contract.json and exposes expected defaults', () => {
        const contract = JSON.parse(readFileSync('src/contract.json', 'utf8'));
        expect(contract.components).toContain('admin-logs');
        expect(DEFAULT_LOG_SIZES).toEqual([25, 50, 100]);
        expect(DEFAULT_LOG_SIZE).toBe(25);
        expect(DEFAULT_LOG_LEVELS.map(([value]) => value)).toEqual(['', 'error', 'warning', 'info', 'debug']);
    });

    describe('stripIndent', () => {
        it('strips shared leading indent while preserving relative stack-frame indentation and blank lines', () => {
            const raw = '\n\n    Failed to verify token\n        at verify (jwt.js:12)\n\n        at handle (http.js:44)   \n    ';
            expect(stripIndent(raw)).toBe('Failed to verify token\n    at verify (jwt.js:12)\n\n    at handle (http.js:44)');
        });

        it('normalizes CRLF line endings and strips tab indentation', () => {
            expect(stripIndent('\t\tLine 1\r\n\t\t\tIndented\r\n\t\tLine 3  \r\n')).toBe('Line 1\n\tIndented\nLine 3');
        });

        it('handles empty, null, undefined, and single-line messages safely', () => {
            expect(stripIndent(null)).toBe('');
            expect(stripIndent(undefined)).toBe('');
            expect(stripIndent('')).toBe('');
            expect(stripIndent('   \n\t  ')).toBe('');
            expect(stripIndent('   plain line   ')).toBe('plain line');
        });
    });

    describe('normalizeLogEntries, formatLogTime, and filterLogEntries', () => {
        it('normalizes Auth, ToDo, and plain array payloads while keeping newest-first order', () => {
            const entries = sampleEntries().slice(0, 2);
            expect(normalizeLogEntries({ 'log-entries': entries }).map((e) => e.name)).toEqual([
                'org.example.auth.TokenService',
                'org.example.auth.RateLimiter'
            ]);
            expect(normalizeLogEntries({ elements: entries }).length).toBe(2);
            expect(normalizeLogEntries({ entries }).length).toBe(2);
            expect(normalizeLogEntries({ logs: entries }).length).toBe(2);
            expect(normalizeLogEntries(entries).length).toBe(2);
            expect(normalizeLogEntries(null)).toEqual([]);

            const aliased = normalizeLogEntries([{
                timestamp: '2026-11-24T08:00:00Z',
                severity: 'danger',
                source: 'app.worker',
                message: 'Worker crashed'
            }]);
            expect(aliased[0]).toMatchObject({
                time: '2026-11-24T08:00:00Z',
                level: 'danger',
                severity: 'error',
                name: 'app.worker',
                message: 'Worker crashed'
            });
        });

        it('formats valid timestamps locally and falls back cleanly for missing or unparseable values', () => {
            expect(formatLogTime(null)).toBe('—');
            expect(formatLogTime('')).toBe('—');
            expect(formatLogTime(undefined, 'n/a')).toBe('n/a');
            expect(formatLogTime('not-a-date')).toBe('not-a-date');
            expect(formatLogTime('2026-11-24T09:15:30Z')).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
        });

        it('filters by text (message or source) and normalized level', () => {
            const entries = normalizeLogEntries(sampleEntries());
            expect(filterLogEntries(entries, { level: 'error' }).map((e) => e.name)).toEqual([
                'org.example.auth.TokenService',
                'org.example.db.Repository'
            ]);
            expect(filterLogEntries(entries, { level: 'warning' }).map((e) => e.name)).toEqual([
                'org.example.auth.RateLimiter'
            ]);
            expect(filterLogEntries(entries, { q: 'tokenservice' }).map((e) => e.name)).toEqual([
                'org.example.auth.TokenService'
            ]);
            expect(filterLogEntries(entries, { q: 'timeout', level: 'error' }).map((e) => e.name)).toEqual([
                'org.example.db.Repository'
            ]);
            expect(filterLogEntries(entries, { q: 'timeout', level: 'info' })).toEqual([]);
        });
    });

    it('rejects invalid container or missing adapter.fetchLogs', () => {
        expect(() => attachAdminLogs(null, { adapter: { fetchLogs: async () => [] } })).toThrow(TypeError);
        expect(() => attachAdminLogs(document.createElement('div'), {})).toThrow(TypeError);
        expect(() => createAdminLogs(document, {})).toThrow(TypeError);
        expect(() => createAdminLogsScreen({})).toThrow(TypeError);
    });

    it('renders newest-first entry cards with stripped messages, time chips, severity chips, and wrapped source names', async () => {
        const nav = createNav('#/logs');
        const fetchLogs = vi.fn(async () => ({ 'log-entries': sampleEntries() }));
        controller = createAdminLogs(document, {
            adapter: { fetchLogs },
            location: nav.location,
            history: nav.history
        });
        document.body.append(controller.element);
        await flushMicrotasks();

        expect(fetchLogs).toHaveBeenCalledTimes(1);
        expect(controller.element.hasAttribute('data-admin-logs')).toBe(true);

        const toolbar = controller.element.querySelector('[data-admin-logs-toolbar]');
        expect(toolbar.tagName).toBe('SEARCH');
        expect(toolbar.getAttribute('aria-label')).toBeTruthy();

        // Labels are explicitly associated with controls via for/id.
        const filterInput = controller.element.querySelector('[data-admin-logs-filter="q"]');
        const levelSelect = controller.element.querySelector('[data-admin-logs-filter="level"]');
        const sizeSelect = controller.element.querySelector('[data-admin-logs-size]');
        expect(toolbar.querySelector(`label[for="${filterInput.id}"]`)).not.toBeNull();
        expect(toolbar.querySelector(`label[for="${levelSelect.id}"]`)).not.toBeNull();
        expect(toolbar.querySelector(`label[for="${sizeSelect.id}"]`)).not.toBeNull();

        const list = controller.element.querySelector('[data-admin-logs-list]');
        expect(list.tagName).toBe('UL');
        expect(list.getAttribute('role')).toBe('list');
        expect(list.getAttribute('aria-label')).toBe('Recent server log entries, newest first');

        const items = [...controller.element.querySelectorAll('[data-admin-logs-item]')];
        expect(items).toHaveLength(5);

        // First card preserves stack-frame indentation without shared indent.
        const firstMsg = items[0].querySelector('[data-admin-logs-message]');
        expect(firstMsg.classList.contains('entry-list__message--code')).toBe(true);
        expect(firstMsg.textContent).toBe(
            'Token signature rejected\n    at TokenService.verify(TokenService.java:84)\n    at AuthFilter.handle(AuthFilter.java:41)'
        );

        // Time chip holds clock icon and <time datetime>.
        const timeChip = items[0].querySelector('[data-admin-logs-time]');
        expect(timeChip.querySelector('svg use').getAttribute('href')).toBe(`${SPRITE}#icon-clock`);
        expect(timeChip.querySelector('time').getAttribute('datetime')).toBe('2026-11-24T09:15:30Z');

        // Severity chip maps ERROR -> error / chip--danger, WARN -> warning / chip--warning.
        expect(items[0].querySelector('[data-severity="error"]')).not.toBeNull();
        expect(items[1].querySelector('[data-severity="warning"]')).not.toBeNull();

        // Source chip inserts <wbr> after dots so long class names wrap on mobile.
        const sourceChip = items[0].querySelector('[data-admin-logs-source]');
        expect(sourceChip.classList.contains('entry-list__code')).toBe(true);
        expect(sourceChip.textContent).toBe('org.example.auth.TokenService');
        expect(sourceChip.querySelectorAll('wbr')).toHaveLength(3);
    });

    it('filters by level and text in memory, updates the URL hash, and supports Clear filters', async () => {
        const nav = createNav('#/logs');
        const fetchLogs = vi.fn(async () => ({ 'log-entries': sampleEntries() }));
        controller = createAdminLogs(document, {
            adapter: { fetchLogs },
            location: nav.location,
            history: nav.history
        });
        document.body.append(controller.element);
        await flushMicrotasks();

        const filterInput = controller.element.querySelector('[data-admin-logs-filter="q"]');
        const levelSelect = controller.element.querySelector('[data-admin-logs-filter="level"]');

        // Level filter narrows cards without re-fetching and updates hash.
        levelSelect.value = 'error';
        levelSelect.dispatchEvent(new Event('change', { bubbles: true }));
        expect(fetchLogs).toHaveBeenCalledTimes(1);
        expect(controller.element.querySelectorAll('[data-admin-logs-item]')).toHaveLength(2);
        expect(nav.location.hash).toBe('#/logs?level=error');
        expect(controller.element.querySelector('[data-table-state-text]').textContent).toContain('(filtered from 5)');

        // Text filter narrows further.
        filterInput.value = 'Repository';
        filterInput.dispatchEvent(new Event('input', { bubbles: true }));
        expect(controller.element.querySelectorAll('[data-admin-logs-item]')).toHaveLength(1);
        expect(controller.element.querySelector('[data-admin-logs-source]').textContent).toBe('org.example.db.Repository');
        expect(nav.location.hash).toBe('#/logs?q=Repository&level=error');

        // Unmatched filter shows filtered empty state with Clear filters button and hides pager.
        filterInput.value = 'no-such-entry';
        filterInput.dispatchEvent(new Event('input', { bubbles: true }));
        const empty = controller.element.querySelector('[data-admin-logs-empty="filtered"]');
        expect(empty).not.toBeNull();
        expect(empty.textContent).toContain('No log entry matches these filters.');
        expect(controller.element.querySelector('[data-table-state-pager]').hidden).toBe(true);

        // Clicking Clear filters restores all entries, clears hash, and focuses filter input.
        empty.querySelector('[data-admin-logs-action="clear"]').click();
        expect(controller.element.querySelectorAll('[data-admin-logs-item]')).toHaveLength(5);
        expect(filterInput.value).toBe('');
        expect(levelSelect.value).toBe('');
        expect(nav.location.hash).toBe('#/logs');
        expect(document.activeElement).toBe(filterInput);
        expect(controller.element.querySelector('[data-table-state-pager]').hidden).toBe(false);
    });

    it('pages entries, persists page and size in the URL hash, and restores initial state from the URL', async () => {
        const nav = createNav('#/logs?level=info&page=99');
        const many = Array.from({ length: 7 }, (_, index) => ({
            time: `2026-11-24T09:${String(59 - index).padStart(2, '0')}:00Z`,
            level: index % 2 === 0 ? 'INFO' : 'ERROR',
            name: `svc.worker.${index + 1}`,
            message: `Event ${index + 1}`
        }));

        controller = createAdminLogs(document, {
            adapter: { fetchLogs: async () => ({ 'log-entries': many }) },
            sizes: [2, 4, 10],
            defaultSize: 2,
            location: nav.location,
            history: nav.history
        });
        document.body.append(controller.element);
        await flushMicrotasks();

        // Initial URL had level=info (4 matching entries -> 2 pages of 2) and page=99 -> clamped to page 2.
        const levelSelect = controller.element.querySelector('[data-admin-logs-filter="level"]');
        const pager = controller.element.querySelector('[data-table-state-pager]');
        const pagerText = pager.querySelector('[data-table-state-text]');
        const firstBtn = pager.querySelector('[data-table-state-action="first"]');
        const prevBtn = pager.querySelector('[data-table-state-action="prev"]');
        const nextBtn = pager.querySelector('[data-table-state-action="next"]');
        const lastBtn = pager.querySelector('[data-table-state-action="last"]');

        expect(levelSelect.value).toBe('info');
        expect(controller.element.querySelectorAll('[data-admin-logs-item]')).toHaveLength(2);
        expect(pagerText.textContent).toBe('Page 2 of 2 · 3–4 of 4 entries (filtered from 7)');
        expect(nav.location.hash).toBe('#/logs?level=info&page=2');
        expect(firstBtn.disabled).toBe(false);
        expect(prevBtn.disabled).toBe(false);
        expect(nextBtn.disabled).toBe(true);
        expect(lastBtn.disabled).toBe(true);

        // Navigate back to page 1.
        prevBtn.focus();
        prevBtn.click();
        expect(pagerText.textContent).toBe('Page 1 of 2 · 1–2 of 4 entries (filtered from 7)');
        expect(nav.location.hash).toBe('#/logs?level=info');
        expect(firstBtn.disabled).toBe(true);
        expect(prevBtn.disabled).toBe(true);
        expect(nextBtn.disabled).toBe(false);
        // Since prevBtn became disabled while focused, focus shifts to an enabled pager button.
        expect(document.activeElement).toBe(nextBtn);

        // Changing page size resets page and records non-default size in hash.
        const sizeSelect = controller.element.querySelector('[data-admin-logs-size]');
        sizeSelect.value = '4';
        sizeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        expect(controller.element.querySelectorAll('[data-admin-logs-item]')).toHaveLength(4);
        expect(nav.location.hash).toBe('#/logs?level=info&size=4');
    });

    it('renders the empty buffer state with no Clear filters button and hides the pager', async () => {
        const nav = createNav('#/logs');
        controller = createAdminLogs(document, {
            adapter: { fetchLogs: async () => ({ 'log-entries': [] }) },
            location: nav.location,
            history: nav.history
        });
        document.body.append(controller.element);
        await flushMicrotasks();

        const empty = controller.element.querySelector('[data-admin-logs-empty="buffer"]');
        expect(empty).not.toBeNull();
        expect(empty.textContent).toContain('The server has logged no entries since it started.');
        expect(empty.querySelector('button')).toBeNull();
        expect(controller.element.querySelector('[data-table-state-pager]').hidden).toBe(true);
    });

    it('shows loading, Retry on failure, Sign in on 401, and quiet refresh states via data-loader', async () => {
        const nav = createNav('#/logs');
        const onSignIn = vi.fn();
        const first = deferred();
        let mode = 'pending';
        const fetchLogs = vi.fn(() => {
            if (mode === 'pending') {
                return first.promise;
            }
            if (mode === 'fail') {
                return Promise.reject(new Error('Log buffer unavailable'));
            }
            if (mode === 'unauthorized') {
                return Promise.reject(Object.assign(new Error('Session expired'), { status: 401 }));
            }
            return Promise.resolve({ 'log-entries': sampleEntries().slice(0, 2) });
        });

        controller = createAdminLogs(document, {
            adapter: { fetchLogs },
            onSignIn,
            location: nav.location,
            history: nav.history
        });
        document.body.append(controller.element);

        // Initial loading state hides pager and announces polite status.
        expect(controller.element.querySelector('[data-data-loader-status]').textContent).toContain('Loading log entries');
        expect(controller.element.querySelector('[data-table-state-pager]').hidden).toBe(true);

        // Fail initial load -> alert banner with Retry.
        mode = 'ok';
        first.reject(new Error('Gateway timeout'));
        await flushMicrotasks();
        const failed = controller.element.querySelector('[data-data-loader-error="failed"]');
        expect(failed).not.toBeNull();
        expect(failed.getAttribute('role')).toBe('alert');
        expect(controller.element.querySelector('[data-table-state-pager]').hidden).toBe(true);

        // Clicking Retry recovers and renders cards.
        failed.querySelector('[data-data-loader-action="retry"]').click();
        await flushMicrotasks();
        expect(controller.element.querySelectorAll('[data-admin-logs-item]')).toHaveLength(2);
        expect(controller.element.querySelector('[data-table-state-pager]').hidden).toBe(false);

        // Quiet refresh keeps cards visible with aria-busy while pending, then hides pager on 401 failure.
        mode = 'unauthorized';
        await controller.refresh({ quiet: true });
        const authError = controller.element.querySelector('[data-data-loader-error="unauthorized"]');
        expect(authError).not.toBeNull();
        expect(controller.element.querySelector('[data-table-state-pager]').hidden).toBe(true);
        authError.querySelector('[data-data-loader-action="sign-in"]').click();
        expect(onSignIn).toHaveBeenCalledTimes(1);
    });

    it('mounts in createAdminConsole via createAdminLogsScreen and aborts on screen disposal', async () => {
        const win = new Window({ url: 'https://admin.example.test/#/logs?level=warning' });
        try {
            const pending = deferred();
            let observedSignal = null;
            const fetchLogs = vi.fn(({ signal }) => {
                observedSignal = signal;
                return pending.promise;
            });

            const consoleFrame = createAdminConsole(win.document, {
                window: win,
                title: 'Admin Console',
                screens: [
                    createAdminLogsScreen({ adapter: { fetchLogs } }),
                    { name: 'other', title: 'Other', mount: () => {} }
                ]
            });
            win.document.body.append(consoleFrame.element);
            consoleFrame.showShell({ name: 'Alex North' });

            expect(fetchLogs).toHaveBeenCalledTimes(1);
            expect(win.document.querySelector('[data-admin-logs-filter="level"]').value).toBe('warning');
            expect(observedSignal.aborted).toBe(false);

            pending.resolve({ 'log-entries': sampleEntries() });
            await flushMicrotasks();
            expect(win.document.querySelectorAll('[data-admin-logs-item]')).toHaveLength(1);
            expect(win.document.querySelector('[data-admin-logs-source]').textContent).toBe('org.example.auth.RateLimiter');

            // Switching screens disposes admin-logs and aborts its screenSignal.
            consoleFrame.navigate('#/other');
            win.dispatchEvent(new win.Event('hashchange'));
            expect(observedSignal.aborted).toBe(true);
            consoleFrame.destroy();
        }
        finally {
            await win.happyDOM.close();
        }
    });

    it('supports extraChips extension hook and falls back to em dash for missing source', async () => {
        const nav = createNav('#/logs');
        controller = createAdminLogs(document, {
            adapter: {
                fetchLogs: async () => [{ time: '2026-11-24T09:00:00Z', level: 'info', name: '', message: 'Ping' }]
            },
            extraChips: (entry, { dom }) => [dom.h('span', { class: 'chip', 'data-extra-chip': '' }, `len:${entry.message.length}`)],
            location: nav.location,
            history: nav.history
        });
        document.body.append(controller.element);
        await flushMicrotasks();

        expect(controller.element.querySelector('[data-admin-logs-source]').textContent).toBe('—');
        expect(controller.element.querySelector('[data-extra-chip]').textContent).toBe('len:4');
    });
});
