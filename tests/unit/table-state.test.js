// @vitest-environment happy-dom
// Unit tests for table-state.js: hash query round trips, client slicing, server page params, pager, and DOM attachment.
import { readFileSync } from 'node:fs';
import { Window } from 'happy-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    attachTableState,
    createPager,
    createTableState,
    formatHashQuery,
    offsetParams,
    pageOf,
    pageParams,
    readHashQuery,
    writeHashQuery
} from '../../src/js/table-state.js';

/**
 * Build an isolated mock location and history pair that tracks replaceState and pushState calls.
 * @param {string} [initialUrl] starting URL path, search, and hash
 * @returns {{window: object, location: object, history: object, replaceCalls: Array<unknown[]>, pushCalls: Array<unknown[]>, hashChanges: number}}
 *   isolated browser environment
 */
function createMockBrowser(initialUrl = '/admin/#/users') {
    const parsed = new URL(initialUrl, 'https://example.test');
    const replaceCalls = [];
    const pushCalls = [];
    let hashChanges = 0;

    const location = {
        get pathname() {
            return parsed.pathname;
        },
        get search() {
            return parsed.search;
        },
        get hash() {
            return parsed.hash;
        },
        set hash(value) {
            parsed.hash = value;
            hashChanges += 1;
        },
        get href() {
            return parsed.href;
        }
    };

    const history = {
        length: 1,
        state: null,
        replaceState(state, title, url) {
            replaceCalls.push([state, title, url]);
            this.state = state;
            if (url !== undefined && url !== null) {
                const next = new URL(String(url), parsed.origin);
                parsed.pathname = next.pathname;
                parsed.search = next.search;
                parsed.hash = next.hash;
            }
        },
        pushState(state, title, url) {
            pushCalls.push([state, title, url]);
            this.length += 1;
            this.state = state;
            if (url !== undefined && url !== null) {
                const next = new URL(String(url), parsed.origin);
                parsed.pathname = next.pathname;
                parsed.search = next.search;
                parsed.hash = next.hash;
            }
        }
    };

    const listeners = new Map();
    const view = {
        location,
        history,
        addEventListener(type, fn) {
            listeners.set(type, [...(listeners.get(type) ?? []), fn]);
        },
        removeEventListener(type, fn) {
            listeners.set(type, (listeners.get(type) ?? []).filter((item) => item !== fn));
        },
        dispatchEvent(event) {
            for (const fn of listeners.get(event.type) ?? []) {
                fn(event);
            }
        }
    };

    return {
        window: view,
        location,
        history,
        replaceCalls,
        pushCalls,
        get hashChanges() {
            return hashChanges;
        },
        navigateHash(nextHash) {
            parsed.hash = nextHash;
            hashChanges += 1;
            view.dispatchEvent(new Event('hashchange'));
        }
    };
}

describe('table-state', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
    });

    describe('contract and hooks', () => {
        it('registers table-state in contract.json and never queries elements by CSS class', () => {
            const contract = JSON.parse(readFileSync('src/contract.json', 'utf8'));
            expect(contract.components).toContain('table-state');
            const source = readFileSync('src/js/table-state.js', 'utf8');
            expect(source).not.toMatch(/querySelector(?:All)?\(['"`]\./);
        });
    });

    describe('hash query helpers', () => {
        it('reads query parameters from hash routes and bare hashes while preserving equals signs', () => {
            expect(readHashQuery({ hash: '#/users?q=alice&page=2&token=abc==' }).get('q')).toBe('alice');
            expect(readHashQuery({ hash: '#/users?q=alice&page=2&token=abc==' }).get('page')).toBe('2');
            expect(readHashQuery({ hash: '#/users?q=alice&page=2&token=abc==' }).get('token')).toBe('abc==');
            expect(readHashQuery({ hash: '#?status=active' }).get('status')).toBe('active');
            expect([...readHashQuery({ hash: '#/users' }).entries()]).toEqual([]);
            expect([...readHashQuery({ hash: '' }).entries()]).toEqual([]);
        });

        it('drops empty, null, and undefined values when formatting queries', () => {
            expect(formatHashQuery({ q: 'alice', status: '', page: 2, realm: null, extra: undefined })).toBe('?q=alice&page=2');
            expect(formatHashQuery({ q: '', status: null, extra: undefined })).toBe('');
        });

        it('writes hash query via history.replaceState without adding history entries or firing hashchange', () => {
            const env = createMockBrowser('/admin/?look=neutral#/users');
            writeHashQuery({ q: 'alex', status: '', page: 2 }, env);

            expect(env.pushCalls).toEqual([]);
            expect(env.replaceCalls).toHaveLength(1);
            expect(env.history.length).toBe(1);
            expect(env.hashChanges).toBe(0);
            expect(env.location.pathname).toBe('/admin/');
            expect(env.location.search).toBe('?look=neutral');
            expect(env.location.hash).toBe('#/users?q=alex&page=2');

            writeHashQuery({ q: '', page: '' }, env);
            expect(env.location.hash).toBe('#/users');
            expect(env.history.length).toBe(1);
        });

        it('prefixes # when writing to a page that started with an empty hash, and removes bare # when cleared', () => {
            const env = createMockBrowser('/demo/shell-admin-console.html?look=warm');
            writeHashQuery({ status: 'active', page: 2 }, env);

            expect(env.location.search).toBe('?look=warm');
            expect(env.location.hash).toBe('#?status=active&page=2');
            expect(readHashQuery(env.location).get('status')).toBe('active');
            expect(readHashQuery(env.location).get('page')).toBe('2');

            writeHashQuery({ status: '', page: '' }, env);
            expect(env.location.hash).toBe('');
            expect(env.location.search).toBe('?look=warm');
        });
    });

    describe('client paging with pageOf', () => {
        const rows = Array.from({ length: 10 }, (_, index) => ({ id: index + 1 }));

        it('cuts the requested page and reports range metadata', () => {
            expect(pageOf(rows, 2, 4)).toEqual({
                rows: [{ id: 5 }, { id: 6 }, { id: 7 }, { id: 8 }],
                page: 2,
                pages: 3,
                size: 4,
                total: 10,
                from: 5,
                to: 8
            });
            expect(pageOf(rows, 3, 4)).toEqual({
                rows: [{ id: 9 }, { id: 10 }],
                page: 3,
                pages: 3,
                size: 4,
                total: 10,
                from: 9,
                to: 10
            });
        });

        it('clamps out-of-range, zero, negative, and non-numeric page numbers', () => {
            expect(pageOf(rows, 99, 4).page).toBe(3);
            expect(pageOf(rows, 0, 4).page).toBe(1);
            expect(pageOf(rows, -5, 4).page).toBe(1);
            expect(pageOf(rows, Number.NaN, 4).page).toBe(1);
            expect(pageOf([], 5, 4)).toEqual({
                rows: [],
                page: 1,
                pages: 1,
                size: 4,
                total: 0,
                from: 0,
                to: 0
            });
        });
    });

    describe('server paging with pageParams and offsetParams', () => {
        const envelope = {
            'start-bookmark': 'cursor-start',
            'end-bookmark': 'cursor-end',
            elements: [{ id: 1 }, { id: 2 }]
        };

        it('builds bookmark page parameters for first, prev, next, and last', () => {
            expect(pageParams('first', envelope, 20).toString()).toBe('page=first&page-size=20');
            expect(pageParams('next', envelope, 20).toString()).toBe('page=next&page-size=20&page-bookmark=cursor-end');
            expect(pageParams('prev', envelope, 20).toString()).toBe('page=prev&page-size=20&page-bookmark=cursor-start');
            expect(pageParams('last', envelope, 20).toString()).toBe('page=last&page-size=20');
        });

        it('omits null bookmarks, appends non-empty extra filters, and rejects unknown directions', () => {
            const boundary = { 'start-bookmark': null, 'end-bookmark': null };
            expect(pageParams('next', boundary, 50, { q: 'alex', empty: '' }).toString()).toBe('page=next&page-size=50&q=alex');
            expect(pageParams('prev', boundary, 50).toString()).toBe('page=prev&page-size=50');
            expect(() => pageParams('sideways', envelope, 20)).toThrow(RangeError);
        });

        it('builds offset and limit parameters for offset-based server endpoints', () => {
            expect(offsetParams(1, 25).toString()).toBe('limit=25&offset=0');
            expect(offsetParams(3, 25, { severity: 'error', q: '' }).toString()).toBe('limit=25&offset=50&severity=error');
            expect(offsetParams(0, 25).toString()).toBe('limit=25&offset=0');
        });
    });

    describe('createTableState controller', () => {
        it('restores valid filters, size, and page from the URL hash and drops invalid values', () => {
            const env = createMockBrowser('/admin/#/users?q=+alex+&status=active&realm=unknown&size=50&page=3');
            const state = createTableState({
                window: env.window,
                sizes: [20, 50, 100],
                defaultSize: 20,
                filters: {
                    q: { default: '', trim: true },
                    status: { default: '', values: ['active', 'marked'] },
                    realm: { default: '', values: ['owner', 'admin'] }
                }
            });

            expect(state.getState()).toMatchObject({
                filters: { q: 'alex', status: 'active', realm: '' },
                size: 50,
                page: 3
            });
            expect(state.query()).toBe('?q=alex&status=active&size=50&page=3');
            state.destroy();
        });

        it('resets page to 1 when filters or size change and drops defaults from the hash without history entries', () => {
            const env = createMockBrowser('/admin/#/users?status=active&size=50&page=3');
            const onChange = vi.fn();
            const state = createTableState({
                window: env.window,
                sizes: [20, 50, 100],
                defaultSize: 20,
                filters: { q: '', status: '' },
                onChange
            });

            state.setFilter('q', 'samira');
            expect(state.getState().page).toBe(1);
            expect(env.location.hash).toBe('#/users?q=samira&status=active&size=50');
            expect(env.history.length).toBe(1);
            expect(env.pushCalls).toEqual([]);

            state.setPage(2);
            expect(env.location.hash).toBe('#/users?q=samira&status=active&size=50&page=2');

            state.setSize(20);
            expect(state.getState().page).toBe(1);
            expect(env.location.hash).toBe('#/users?q=samira&status=active');

            state.resetFilters();
            expect(env.location.hash).toBe('#/users');
            expect(onChange).toHaveBeenCalledTimes(4);
            state.destroy();
        });

        it('clamps an out-of-range URL page during client slice() and syncs the clamped hash', () => {
            const env = createMockBrowser('/admin/#/users?q=a&page=99');
            const state = createTableState({
                window: env.window,
                sizes: [2, 4],
                defaultSize: 2,
                filters: { q: '' }
            });

            const rows = [{ id: 1 }, { id: 2 }, { id: 3 }];
            const cut = state.slice(rows);
            expect(cut.page).toBe(2);
            expect(cut.pages).toBe(2);
            expect(cut.rows).toEqual([{ id: 3 }]);
            expect(state.getState().page).toBe(2);
            expect(env.location.hash).toBe('#/users?q=a&page=2');
            expect(env.history.length).toBe(1);

            // Clamping down to page 1 drops the page parameter from the hash.
            const singleCut = state.slice([{ id: 1 }]);
            expect(singleCut.page).toBe(1);
            expect(env.location.hash).toBe('#/users?q=a');
            state.destroy();
        });

        it('tracks server envelopes, builds bookmark params, and wires a server pager', () => {
            const env = createMockBrowser('/admin/#/users');
            const onPage = vi.fn();
            const state = createTableState({
                window: env.window,
                document,
                mode: 'server',
                sizes: [20, 50],
                defaultSize: 20,
                onPage
            });

            expect(state.serverParams('first').toString()).toBe('page=first&page-size=20');

            const firstEnvelope = { 'start-bookmark': null, 'end-bookmark': 'b-1', elements: [{ id: 1 }, { id: 2 }] };
            state.applyEnvelope('first', firstEnvelope);
            expect(state.getState().pageNumber).toBe(1);
            expect(state.serverParams('next').toString()).toBe('page=next&page-size=20&page-bookmark=b-1');

            const pagerEl = state.createPager({ envelope: firstEnvelope, shown: 2, noun: 'user' });
            expect(pagerEl.getAttribute('aria-label')).toBe('Pages');
            expect(pagerEl.querySelector('[data-table-state-text]').textContent).toBe('Page 1 · 2 users shown');
            expect(pagerEl.querySelector('[data-table-state-action="first"]').disabled).toBe(true);
            expect(pagerEl.querySelector('[data-table-state-action="prev"]').disabled).toBe(true);
            expect(pagerEl.querySelector('[data-table-state-action="next"]').disabled).toBe(false);
            expect(pagerEl.querySelector('[data-table-state-action="last"]').disabled).toBe(false);

            pagerEl.querySelector('[data-table-state-action="next"]').click();
            expect(onPage).toHaveBeenCalledTimes(1);
            expect(onPage.mock.calls[0][0].direction).toBe('next');
            expect(onPage.mock.calls[0][0].params.toString()).toBe('page=next&page-size=20&page-bookmark=b-1');

            const lastEnvelope = { 'start-bookmark': 'b-1', 'end-bookmark': null, elements: [{ id: 3 }] };
            state.applyEnvelope('last', lastEnvelope);
            expect(state.getState().pageNumber).toBeNull();
            const lastPager = state.createPager({ envelope: lastEnvelope, shown: 1, noun: 'user' });
            expect(lastPager.querySelector('[data-table-state-text]').textContent).toBe('Last page · 1 user shown');
            expect(lastPager.querySelector('[data-table-state-action="next"]').disabled).toBe(true);
            expect(lastPager.querySelector('[data-table-state-action="last"]').disabled).toBe(true);
            state.destroy();
        });

        it('replays the request that produced the envelope on serverParams("current") after applyEnvelope', () => {
            const env = createMockBrowser('/admin/#/users');
            const state = createTableState({
                window: env.window,
                document,
                mode: 'server',
                sizes: [20, 50],
                defaultSize: 20
            });

            const env1 = { 'start-bookmark': null, 'end-bookmark': 'b-1', elements: [{ id: 1 }] };
            const env2 = { 'start-bookmark': 's-2', 'end-bookmark': 'b-2', elements: [{ id: 2 }] };
            const env1Again = { 'start-bookmark': null, 'end-bookmark': 'b-1', elements: [{ id: 1 }] };

            state.applyEnvelope('first', env1);
            expect(state.serverParams('current').toString()).toBe('page=first&page-size=20');

            // Moving to next without explicit params must save the bookmark from env1 (b-1), not env2 (b-2).
            state.applyEnvelope('next', env2);
            expect(state.getState().pageNumber).toBe(2);
            expect(state.serverParams('current').toString()).toBe('page=next&page-size=20&page-bookmark=b-1');
            expect(state.serverParams('next').toString()).toBe('page=next&page-size=20&page-bookmark=b-2');

            // Refreshing current keeps the same replay params and page number.
            state.applyEnvelope('current', env2);
            expect(state.getState().pageNumber).toBe(2);
            expect(state.serverParams('current').toString()).toBe('page=next&page-size=20&page-bookmark=b-1');

            // Moving prev saves env2's start-bookmark (s-2).
            state.applyEnvelope('prev', env1Again);
            expect(state.getState().pageNumber).toBe(1);
            expect(state.serverParams('current').toString()).toBe('page=prev&page-size=20&page-bookmark=s-2');

            // Changing page size drops stale replay params so current falls back to first at the new size.
            state.setSize(50);
            expect(state.serverParams('current').toString()).toBe('page=first&page-size=50');
            state.destroy();
        });

        it('does not write server bookmark page numbers to the hash and ignores stale page params on reload', () => {
            const env = createMockBrowser('/admin/#/users?q=alex&page=2');
            const state = createTableState({
                window: env.window,
                document,
                mode: 'server',
                sizes: [20, 50],
                defaultSize: 20,
                filters: { q: { default: '', trim: true } }
            });

            // Reloading with #?page=2 in server bookmark mode loads first page and labels it Page 1.
            expect(state.getState()).toMatchObject({ filters: { q: 'alex' }, page: 1, pageNumber: 1 });
            expect(state.serverParams('current').toString()).toBe('page=first&page-size=20');

            const env1 = { 'start-bookmark': null, 'end-bookmark': 'b-1', elements: [{ id: 1 }, { id: 2 }] };
            state.applyEnvelope('first', env1);
            const firstPager = state.createPager({ envelope: env1, shown: 2, noun: 'user' });
            expect(firstPager.querySelector('[data-table-state-text]').textContent).toBe('Page 1 · 2 users shown');

            // Advancing to page 2 updates the pager label without writing page=2 to the hash.
            const env2 = { 'start-bookmark': 's-2', 'end-bookmark': 'b-2', elements: [{ id: 3 }] };
            state.applyEnvelope('next', env2);
            expect(state.getState().pageNumber).toBe(2);
            expect(state.query()).toBe('?q=alex');
            expect(env.location.hash).not.toContain('page=2');
            const secondPager = state.createPager({ envelope: env2, shown: 1, noun: 'user' });
            expect(secondPager.querySelector('[data-table-state-text]').textContent).toBe('Page 2 · 1 user shown');

            // Changing a filter preserves the filter in the hash without any page param.
            state.setFilter('q', 'samira');
            expect(env.location.hash).toBe('#/users?q=samira');
            state.destroy();
        });
    });

    describe('createPager and attachTableState DOM wiring', () => {
        it('creates a client pager with normative markup and data hooks on an injected document', async () => {
            const win = new Window();
            try {
                const onPage = vi.fn();
                const cut = pageOf(Array.from({ length: 6 }, (_, i) => i), 2, 4);
                const nav = createPager(win.document, {
                    cut,
                    shown: 6,
                    loaded: 10,
                    noun: ['entry', 'entries'],
                    label: 'Log pages',
                    onPage
                });

                expect(nav.tagName).toBe('NAV');
                expect(nav.className).toBe('pager');
                expect(nav.getAttribute('aria-label')).toBe('Log pages');
                expect(nav.hasAttribute('data-table-state-pager')).toBe(true);
                expect(nav.querySelector('[data-table-state-text]').textContent).toBe('Page 2 of 2 · 5–6 of 6 entries (filtered from 10)');
                expect(nav.querySelector('[data-table-state-action="first"]').disabled).toBe(false);
                expect(nav.querySelector('[data-table-state-action="prev"]').disabled).toBe(false);
                expect(nav.querySelector('[data-table-state-action="next"]').disabled).toBe(true);
                expect(nav.querySelector('[data-table-state-action="last"]').disabled).toBe(true);

                nav.querySelector('[data-table-state-action="prev"]').click();
                expect(onPage).toHaveBeenCalledWith(1);
            }
            finally {
                await win.happyDOM.close();
            }
        });

        it('binds existing controls and pager via data-* hooks alone, restores URL state, and cleans up on destroy', () => {
            const env = createMockBrowser('/demo/shell-admin-console.html#?q=alex&status=active&size=2&page=2');
            const root = document.createElement('section');
            // Intentionally use non-standard class names to prove hooks never rely on CSS classes.
            root.innerHTML = `
                <input type="search" data-table-state-filter="q" class="custom-input">
                <select data-table-state-filter="status" class="custom-select">
                    <option value="">All</option>
                    <option value="active">Active</option>
                </select>
                <select data-table-state-size class="custom-size">
                    <option value="2">2</option>
                    <option value="4">4</option>
                </select>
                <nav data-table-state-pager aria-label="Accounts pages" class="custom-nav">
                    <p data-table-state-text class="custom-text"></p>
                    <div>
                        <button type="button" data-table-state-action="first">First</button>
                        <button type="button" data-table-state-action="prev">Previous</button>
                        <button type="button" data-table-state-action="next">Next</button>
                        <button type="button" data-table-state-action="last">Last</button>
                    </div>
                </nav>
            `;
            document.body.append(root);

            const onChange = vi.fn();
            const controller = attachTableState(root, {
                window: env.window,
                document,
                sizes: [2, 4],
                defaultSize: 4,
                filters: {
                    q: { default: '', trim: true },
                    status: { default: '', values: ['active'] }
                },
                onChange
            });

            const search = root.querySelector('[data-table-state-filter="q"]');
            const status = root.querySelector('[data-table-state-filter="status"]');
            const size = root.querySelector('[data-table-state-size]');
            expect(search.value).toBe('alex');
            expect(status.value).toBe('active');
            expect(size.value).toBe('2');

            const cut = controller.slice([{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }]);
            controller.updatePager({ cut, shown: 4, loaded: 6, noun: 'account' });
            expect(root.querySelector('[data-table-state-text]').textContent).toBe('Page 2 of 2 · 3–4 of 4 accounts (filtered from 6)');
            expect(root.querySelector('[data-table-state-action="first"]').disabled).toBe(false);
            expect(root.querySelector('[data-table-state-action="next"]').disabled).toBe(true);

            root.querySelector('[data-table-state-action="prev"]').click();
            expect(controller.getState().page).toBe(1);
            expect(env.location.hash).toBe('#?q=alex&status=active&size=2');

            controller.resetFilters();
            expect(search.value).toBe('');
            expect(status.value).toBe('');
            expect(env.location.hash).toBe('#?size=2');

            const countBeforeDestroy = onChange.mock.calls.length;
            controller.destroy();
            search.value = 'ignored';
            search.dispatchEvent(new Event('input', { bubbles: true }));
            expect(onChange.mock.calls.length).toBe(countBeforeDestroy);
        });

        it('syncs controls on same-route hashchange and ignores route changes to other hash prefixes', () => {
            const env = createMockBrowser('/admin/#/users?q=alex');
            const root = document.createElement('section');
            root.innerHTML = '<input type="search" data-table-state-filter="q">';
            document.body.append(root);
            const onChange = vi.fn();

            const controller = attachTableState(root, {
                window: env.window,
                document,
                filters: { q: { default: '', trim: true } },
                onChange
            });

            env.navigateHash('#/users?q=samira&page=3');
            expect(controller.getState()).toMatchObject({ filters: { q: 'samira' }, page: 3 });
            expect(root.querySelector('[data-table-state-filter="q"]').value).toBe('samira');
            expect(onChange).toHaveBeenCalledTimes(1);

            // Navigating to another screen route must not mutate this screen's state.
            env.navigateHash('#/logs?q=error');
            expect(controller.getState()).toMatchObject({ filters: { q: 'samira' }, page: 3 });
            expect(onChange).toHaveBeenCalledTimes(1);

            controller.destroy();
            env.navigateHash('#/users?q=after-destroy');
            expect(onChange).toHaveBeenCalledTimes(1);
        });

        it('supports debounced text inputs with immediate Enter, checkboxes, and attached server pagers', () => {
            vi.useFakeTimers();
            try {
                const env = createMockBrowser('/admin/#/events');
                const root = document.createElement('section');
                root.innerHTML = `
                    <input type="search" data-table-state-filter="q">
                    <input type="checkbox" data-table-state-filter="expired">
                    <nav data-table-state-pager aria-label="Events pages">
                        <p data-table-state-text></p>
                        <button type="button" data-table-state-action="first">First</button>
                        <button type="button" data-table-state-action="prev">Previous</button>
                        <button type="button" data-table-state-action="next">Next</button>
                        <button type="button" data-table-state-action="last">Last</button>
                    </nav>
                `;
                document.body.append(root);
                const onChange = vi.fn();
                const onPage = vi.fn();

                const controller = attachTableState(root, {
                    window: env.window,
                    document,
                    mode: 'server',
                    debounce: 300,
                    defaultSize: 25,
                    onChange,
                    onPage
                });

                const search = root.querySelector('[data-table-state-filter="q"]');
                const expired = root.querySelector('[data-table-state-filter="expired"]');

                search.value = 'timeout';
                search.dispatchEvent(new Event('input', { bubbles: true }));
                expect(onChange).not.toHaveBeenCalled();

                vi.advanceTimersByTime(300);
                expect(onChange).toHaveBeenCalledTimes(1);
                expect(env.location.hash).toBe('#/events?q=timeout');

                // Pressing Enter applies immediately without waiting for the debounce timer.
                search.value = 'login';
                search.dispatchEvent(new Event('input', { bubbles: true }));
                search.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
                expect(onChange).toHaveBeenCalledTimes(2);
                expect(env.location.hash).toBe('#/events?q=login');

                expired.checked = true;
                expired.dispatchEvent(new Event('change', { bubbles: true }));
                expect(controller.getFilter('expired')).toBe(true);
                expect(env.location.hash).toBe('#/events?q=login&expired=true');

                const envelope = { 'start-bookmark': null, 'end-bookmark': 'cur-2', elements: [{ id: 1 }] };
                controller.applyEnvelope('first', envelope);
                controller.updatePager({ envelope, shown: 1, noun: 'event' });
                expect(root.querySelector('[data-table-state-action="prev"]').disabled).toBe(true);
                expect(root.querySelector('[data-table-state-action="next"]').disabled).toBe(false);

                root.querySelector('[data-table-state-action="next"]').click();
                expect(onPage).toHaveBeenCalledTimes(1);
                expect(onPage.mock.calls[0][0].params.toString()).toBe('page=next&page-size=25&page-bookmark=cur-2');

                controller.destroy();
            }
            finally {
                vi.useRealTimers();
            }
        });
    });
});
