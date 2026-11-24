// @vitest-environment happy-dom
// Unit tests for admin-users.js: pure helpers, table filters and client/server paging,
// detail panel content and account editing, extension hooks (columns, facts, sections),
// New user creation panel, inline-confirmed deletion and restore with own-account guard,
// race cancellation, admin-console frame integration, and contract registration.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Window } from 'happy-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAdminConsole } from '../../src/js/admin-console.js';
import {
    attachAdminUsers,
    createAdminUsers,
    createAdminUsersScreen,
    DEFAULT_USER_REALMS,
    DEFAULT_USER_SIZE,
    DEFAULT_USER_SIZES,
    DEFAULT_USER_STATUSES,
    formatUserTime,
    isUserMarked,
    NEW_USER_ROUTE_ID,
    normalizeUsersResult,
    userDisplayName
} from '../../src/js/admin-users.js';
import { setSpriteUrl } from '../../src/js/icon.js';

const SPRITE = '/vendor/design/looks/neutral/icons.svg';

/**
 * Create a manually settled deferred promise for async state tests.
 * @returns {{promise: Promise<unknown>, resolve: (value?: unknown) => void, reject: (reason?: unknown) => void}}
 *   deferred handle
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
 * @returns {Promise<void>} resolves after microtask turns
 */
async function flushMicrotasks() {
    for (let i = 0; i < 16; i += 1) {
        await Promise.resolve();
    }
}

/**
 * Create an isolated mock location and history pair for URL hash assertions.
 * @param {string} [initialHash] initial `location.hash`, e.g. `'#/users'`
 * @returns {{location: {pathname: string, search: string, hash: string}, history: {state: unknown, calls: Array, replaceState: Function}}}
 *   navigation stubs
 */
function createNav(initialHash = '#/users') {
    const location = { pathname: '/admin/', search: '', hash: initialHash };
    const calls = [];
    const history = {
        state: null,
        calls,
        replaceState(state, title, url) {
            calls.push({ state, title, url });
            const hashIndex = String(url).indexOf('#');
            location.hash = hashIndex >= 0 ? String(url).slice(hashIndex) : '';
        }
    };
    return { location, history };
}

const SAMPLE_USERS = [
    {
        id: 1,
        name: 'Alex North',
        email: 'alex.north@example.test',
        realms: ['owner', 'admin'],
        'creation-time': '2026-01-05T09:30:00Z',
        'last-activity-time': '2026-11-17T07:40:00Z',
        'expiry-time': null
    },
    {
        id: 34,
        name: 'Samira Patel',
        email: 'samira.patel@example.test',
        realms: ['owner'],
        'creation-time': '2026-09-01T10:00:00Z',
        'last-activity-time': '2026-11-16T08:15:00Z',
        'expiry-time': null
    },
    {
        id: 36,
        name: 'Jordan Kim',
        email: 'jordan.kim@example.test',
        realms: ['owner', 'test'],
        'creation-time': '2026-09-20T14:05:00Z',
        'last-activity-time': null,
        'expiry-time': '2026-12-01T00:00:00Z'
    },
    {
        id: 41,
        name: '',
        email: 'morgan.lee@example.test',
        realms: ['test'],
        'creation-time': '2026-10-02T11:45:00Z',
        'last-activity-time': '2026-11-12T09:03:00Z',
        'deletion-time': '2026-12-05T12:00:00Z'
    },
    {
        id: 47,
        name: 'Taylor Brooks',
        email: 'taylor.brooks@example.test',
        realms: ['owner'],
        'creation-time': '2026-10-14T08:20:00Z',
        'last-activity-time': '2026-11-15T19:05:00Z',
        'expiry-time': null
    }
];

/**
 * Create an in-memory Users data adapter backed by a cloned copy of `initialUsers`.
 * @param {object[]} [initialUsers] starting user records
 * @param {object} [overrides] optional method overrides
 * @returns {{users: object[], adapter: object, calls: object}} adapter and spy trackers
 */
function createMockAdapter(initialUsers = SAMPLE_USERS, overrides = {}) {
    let users = initialUsers.map((user) => ({ ...user, realms: [...(user.realms ?? [])] }));
    let nextId = 100;
    const calls = {
        fetchUsers: [],
        fetchUser: [],
        updateUser: [],
        createUser: [],
        markUserForDeletion: [],
        restoreUser: [],
        deleteUser: [],
        exportUserData: []
    };

    const adapter = {
        async fetchUsers(args) {
            calls.fetchUsers.push(args);
            return users.map((user) => ({ ...user, realms: [...(user.realms ?? [])] }));
        },
        async fetchUser(id, args) {
            calls.fetchUser.push({ id, args });
            const found = users.find((user) => String(user.id) === String(id));
            if (!found) {
                throw new Error('User not found');
            }
            return { ...found, realms: [...(found.realms ?? [])] };
        },
        async updateUser(id, body, args) {
            calls.updateUser.push({ id, body, args });
            const index = users.findIndex((user) => String(user.id) === String(id));
            if (index < 0) {
                throw new Error('User not found');
            }
            users[index] = {
                ...users[index],
                ...body,
                realms: body.realms ? [...body.realms] : users[index].realms
            };
            return { ...users[index] };
        },
        async createUser(body, args) {
            calls.createUser.push({ body, args });
            const created = {
                id: nextId,
                name: body.name ?? '',
                email: body.email,
                realms: ['owner'],
                'creation-time': '2026-11-24T10:00:00Z',
                'last-activity-time': null,
                'expiry-time': null
            };
            nextId += 1;
            users = [...users, created];
            return { ...created };
        },
        async markUserForDeletion(id, args) {
            calls.markUserForDeletion.push({ id, args });
            const index = users.findIndex((user) => String(user.id) === String(id));
            users[index] = { ...users[index], 'expiry-time': '2026-12-10T00:00:00Z' };
            return { ...users[index] };
        },
        async restoreUser(id, args) {
            calls.restoreUser.push({ id, args });
            const index = users.findIndex((user) => String(user.id) === String(id));
            users[index] = { ...users[index], 'expiry-time': null, 'deletion-time': null, deleted: false };
            return { ...users[index] };
        },
        async deleteUser(id, args) {
            calls.deleteUser.push({ id, args });
            users = users.filter((user) => String(user.id) !== String(id));
        },
        ...overrides
    };

    return {
        get users() {
            return users;
        },
        set users(next) {
            users = next;
        },
        adapter,
        calls
    };
}

describe('admin-users', () => {
    let win;
    let doc;
    let host;
    let panel;

    beforeEach(() => {
        win = new Window({ url: 'https://example.test/admin/#/users' });
        doc = win.document;
        host = doc.createElement('div');
        panel = doc.createElement('aside');
        panel.className = 'app__side-panel';
        panel.hidden = true;
        doc.body.append(host, panel);
        setSpriteUrl(SPRITE);
    });

    afterEach(() => {
        win.close();
        vi.restoreAllMocks();
    });

    describe('pure helpers and defaults', () => {
        it('exports expected default constants', () => {
            expect(DEFAULT_USER_REALMS).toEqual(['owner', 'admin', 'test']);
            expect(DEFAULT_USER_STATUSES.map(([value]) => value)).toEqual(['', 'active', 'marked']);
            expect(DEFAULT_USER_SIZES).toEqual([20, 50, 100]);
            expect(DEFAULT_USER_SIZE).toBe(20);
            expect(NEW_USER_ROUTE_ID).toBe('new');
        });

        it('detects marked-for-deletion users across expiry-time, deletion-time, and deleted shapes', () => {
            expect(isUserMarked({ 'expiry-time': '2026-12-01T00:00:00Z' })).toBe(true);
            expect(isUserMarked({ 'deletion-time': '2026-12-01T00:00:00Z' })).toBe(true);
            expect(isUserMarked({ deleted: true })).toBe(true);
            expect(isUserMarked({ 'expiry-time': null, 'deletion-time': null })).toBe(false);
            expect(isUserMarked(null)).toBe(false);
        });

        it('resolves display names with trimmed fallback to email', () => {
            expect(userDisplayName({ name: ' Samira Patel ', email: 'samira@example.test' })).toBe('Samira Patel');
            expect(userDisplayName({ name: '   ', email: 'morgan@example.test' })).toBe('morgan@example.test');
            expect(userDisplayName({ email: 'only@example.test' })).toBe('only@example.test');
            expect(userDisplayName(null)).toBe('');
        });

        it('formats timestamps and preserves fallback or unparseable strings', () => {
            expect(formatUserTime(null, 'Never')).toBe('Never');
            expect(formatUserTime('', '—')).toBe('—');
            expect(formatUserTime('not-a-date')).toBe('not-a-date');
            expect(formatUserTime('2026-11-24T09:15:30Z')).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
        });

        it('normalizes user arrays, page envelopes, and wrapped user lists', () => {
            expect(normalizeUsersResult([{ id: 1 }])).toEqual({ users: [{ id: 1 }], envelope: null });
            const env = { elements: [{ id: 2 }], 'start-bookmark': 'a', 'end-bookmark': 'b' };
            expect(normalizeUsersResult(env)).toEqual({ users: [{ id: 2 }], envelope: env });
            expect(normalizeUsersResult({ users: [{ id: 3 }] })).toEqual({ users: [{ id: 3 }], envelope: null });
            expect(normalizeUsersResult(null)).toEqual({ users: [], envelope: null });
        });
    });

    describe('table filters, paging, and load states', () => {
        it('loads users, filters by query, realm, and status, and clears filters from empty state', async () => {
            const { adapter } = createMockAdapter();
            const nav = createNav('#/users');
            const ctrl = attachAdminUsers(host, {
                document: doc,
                window: win,
                location: nav.location,
                history: nav.history,
                panel,
                adapter,
                currentUserId: 1
            });
            await flushMicrotasks();

            expect(host.hasAttribute('data-admin-users')).toBe(true);
            const rows = () => [...host.querySelectorAll('[data-admin-users-row]')];
            expect(rows()).toHaveLength(5);
            // Semantic row header holds the link with fallback to email for unnamed user #41.
            expect(host.querySelector('[data-admin-users-link="41"]').textContent).toBe('morgan.lee@example.test');
            expect(host.querySelector('[data-admin-users-link="34"]').closest('th[scope="row"]')).toBeTruthy();

            // Search by exact ID matches user 34.
            const searchInput = host.querySelector('[data-admin-users-filter="q"]');
            searchInput.value = '34';
            searchInput.dispatchEvent(new win.Event('input', { bubbles: true }));
            expect(rows().map((row) => row.dataset.userId)).toEqual(['34']);
            expect(nav.location.hash).toBe('#/users?q=34');

            // Search by email substring.
            searchInput.value = 'north';
            searchInput.dispatchEvent(new win.Event('input', { bubbles: true }));
            expect(rows().map((row) => row.dataset.userId)).toEqual(['1']);

            // Clear search, filter by realm = test.
            searchInput.value = '';
            searchInput.dispatchEvent(new win.Event('input', { bubbles: true }));
            const realmSelect = host.querySelector('[data-admin-users-filter="realm"]');
            realmSelect.value = 'test';
            realmSelect.dispatchEvent(new win.Event('change', { bubbles: true }));
            expect(rows().map((row) => row.dataset.userId)).toEqual(['36', '41']);

            // Combine with status = active -> no rows -> filtered empty state with Clear filters button.
            const statusSelect = host.querySelector('[data-admin-users-filter="status"]');
            statusSelect.value = 'active';
            statusSelect.dispatchEvent(new win.Event('change', { bubbles: true }));
            expect(rows()).toHaveLength(0);
            expect(host.querySelector('[data-admin-users-empty="filtered"]')).toBeTruthy();

            // Clicking Clear filters resets all controls and restores all 5 users.
            host.querySelector('[data-admin-users-action="clear-filters"]').click();
            expect(rows()).toHaveLength(5);
            expect(searchInput.value).toBe('');
            expect(realmSelect.value).toBe('');
            expect(statusSelect.value).toBe('');
            expect(nav.location.hash).toBe('#/users');

            // Status = marked matches both expiry-time (36) and deletion-time (41).
            statusSelect.value = 'marked';
            statusSelect.dispatchEvent(new win.Event('change', { bubbles: true }));
            expect(rows().map((row) => row.dataset.userId)).toEqual(['36', '41']);

            ctrl.destroy();
        });

        it('paginates client-side, persists page and size in hash, and restores from initial hash', async () => {
            const { adapter } = createMockAdapter();
            const nav = createNav('#/users?size=2&page=2');
            const ctrl = attachAdminUsers(host, {
                document: doc,
                window: win,
                location: nav.location,
                history: nav.history,
                panel,
                adapter,
                sizes: [2, 4, 20],
                defaultSize: 4
            });
            await flushMicrotasks();

            const ids = () => [...host.querySelectorAll('[data-admin-users-row]')].map((row) => row.dataset.userId);
            expect(ids()).toEqual(['36', '41']);
            expect(host.querySelector('[data-table-state-text]').textContent).toContain('Page 2 of 3');

            // Advance to page 3 via pager button.
            host.querySelector('[data-table-state-action="next"]').click();
            expect(ids()).toEqual(['47']);
            expect(nav.location.hash).toBe('#/users?size=2&page=3');
            expect(host.querySelector('[data-table-state-action="next"]').disabled).toBe(true);

            // Change size resets to page 1.
            const sizeSelect = host.querySelector('[data-admin-users-size]');
            sizeSelect.value = '4';
            sizeSelect.dispatchEvent(new win.Event('change', { bubbles: true }));
            expect(ids()).toEqual(['1', '34', '36', '41']);
            expect(nav.location.hash).toBe('#/users');

            ctrl.destroy();
        });

        it('supports server bookmark paging mode with Page envelopes', async () => {
            const calls = [];
            const adapter = {
                async fetchUsers({ direction, params }) {
                    calls.push({ direction, query: params.toString() });
                    if (direction === 'next') {
                        return {
                            elements: [SAMPLE_USERS[2]],
                            'start-bookmark': 'bm-2',
                            'end-bookmark': null
                        };
                    }
                    return {
                        elements: SAMPLE_USERS.slice(0, 2),
                        'start-bookmark': null,
                        'end-bookmark': 'bm-1'
                    };
                }
            };
            const nav = createNav('#/users');
            const ctrl = attachAdminUsers(host, {
                document: doc,
                window: win,
                location: nav.location,
                history: nav.history,
                panel,
                adapter,
                mode: 'server',
                sizes: [2, 20],
                defaultSize: 2
            });
            await flushMicrotasks();

            expect(calls).toHaveLength(1);
            expect(calls[0].direction).toBe('first');
            expect(calls[0].query).toContain('page=first');
            expect(calls[0].query).toContain('page-size=2');
            expect(host.querySelectorAll('[data-admin-users-row]')).toHaveLength(2);
            expect(host.querySelector('[data-table-state-action="prev"]').disabled).toBe(true);
            expect(host.querySelector('[data-table-state-action="next"]').disabled).toBe(false);

            host.querySelector('[data-table-state-action="next"]').click();
            await flushMicrotasks();
            expect(calls).toHaveLength(2);
            expect(calls[1].direction).toBe('next');
            expect(calls[1].query).toContain('page-bookmark=bm-1');
            expect([...host.querySelectorAll('[data-admin-users-row]')].map((row) => row.dataset.userId)).toEqual(['36']);
            expect(host.querySelector('[data-table-state-action="next"]').disabled).toBe(true);

            ctrl.destroy();
        });

        it('shows empty state when no accounts exist, Retry on failure, and Sign in on 401', async () => {
            let mode = 'empty';
            const onSignIn = vi.fn();
            const adapter = {
                async fetchUsers() {
                    if (mode === 'empty') {
                        return [];
                    }
                    if (mode === 'fail') {
                        mode = 'ok';
                        throw new Error('Database offline');
                    }
                    if (mode === '401') {
                        throw Object.assign(new Error('Expired'), { status: 401 });
                    }
                    return [SAMPLE_USERS[0]];
                }
            };
            const ctrl = createAdminUsers(doc, { window: win, panel, adapter, onSignIn });
            await flushMicrotasks();
            expect(ctrl.element.querySelector('[data-admin-users-empty="none"]')).toBeTruthy();

            mode = 'fail';
            await ctrl.refresh();
            expect(ctrl.element.querySelector('[data-data-loader-error="failed"]')).toBeTruthy();
            ctrl.element.querySelector('[data-data-loader-action="retry"]').click();
            await flushMicrotasks();
            expect(ctrl.element.querySelectorAll('[data-admin-users-row]')).toHaveLength(1);

            mode = '401';
            await ctrl.refresh();
            expect(ctrl.element.querySelector('[data-data-loader-error="unauthorized"]')).toBeTruthy();
            ctrl.element.querySelector('[data-data-loader-action="sign-in"]').click();
            expect(onSignIn).toHaveBeenCalledTimes(1);

            ctrl.destroy();
        });
    });

    describe('detail panel content, editing, export, and race safety', () => {
        it('opens detail panel, marks selected row, focuses title, saves account changes, and returns focus on close', async () => {
            const { adapter, calls } = createMockAdapter();
            const navigated = [];
            const nav = createNav('#/users');
            const ctrl = attachAdminUsers(host, {
                document: doc,
                window: win,
                location: nav.location,
                history: nav.history,
                panel,
                adapter,
                currentUserId: 1,
                navigate: (hash) => {
                    navigated.push(hash);
                    nav.location.hash = hash;
                    const id = hash.split('?')[0].split('/')[2] ?? null;
                    ctrl.update({ name: 'users', id });
                }
            });
            await flushMicrotasks();

            ctrl.openUser('34');
            await flushMicrotasks();

            expect(panel.hidden).toBe(false);
            const title = panel.querySelector('[data-admin-users-panel-title]');
            expect(title.textContent).toBe('Samira Patel');
            expect(doc.activeElement).toBe(title);
            expect(host.querySelector('[data-admin-users-row][data-user-id="34"]').getAttribute('aria-selected')).toBe('true');

            // Facts section renders ID, Realms, Status, Created, Last active.
            expect(panel.querySelector('[data-fact="id"]').textContent).toBe('34');
            expect(panel.querySelector('[data-fact="status"]').textContent).toBe('Active');

            // Validation rejects blank name or invalid email without calling updateUser.
            const nameInput = panel.querySelector('[data-admin-users-input="name"]');
            const emailInput = panel.querySelector('[data-admin-users-input="email"]');
            nameInput.value = '   ';
            emailInput.value = 'invalid-email';
            panel.querySelector('[data-admin-users-action="save"]').click();
            await flushMicrotasks();
            expect(calls.updateUser).toHaveLength(0);
            expect(nameInput.getAttribute('aria-invalid')).toBe('true');
            expect(emailInput.getAttribute('aria-invalid')).toBe('true');

            // Valid update saves name, unchanged email omitted, and updated realms.
            nameInput.value = 'Samira P. Updated';
            emailInput.value = 'samira.patel@example.test';
            panel.querySelector('[data-admin-users-realm="test"]').checked = true;
            panel.querySelector('[data-admin-users-action="save"]').click();
            await flushMicrotasks();

            expect(calls.updateUser).toHaveLength(1);
            expect(calls.updateUser[0].id).toBe('34');
            expect(calls.updateUser[0].body).toEqual({
                name: 'Samira P. Updated',
                realms: ['owner', 'test']
            });
            expect(panel.querySelector('[data-admin-users-status="account"]').textContent).toBe('Changes saved.');
            expect(host.querySelector('[data-admin-users-link="34"]').textContent).toBe('Samira P. Updated');

            // Changing email includes email in payload and shows confirmation notice.
            const emailInput2 = panel.querySelector('[data-admin-users-input="email"]');
            emailInput2.value = 'samira.new@example.test';
            panel.querySelector('[data-admin-users-action="save"]').click();
            await flushMicrotasks();
            expect(calls.updateUser).toHaveLength(2);
            expect(calls.updateUser[1].body.email).toBe('samira.new@example.test');
            expect(panel.querySelector('[data-admin-users-status="account"]').textContent).toContain('samira.new@example.test');

            // Closing panel hides it, clears aria-selected, and restores focus to row link.
            panel.querySelector('[data-admin-users-action="close"]').click();
            expect(panel.hidden).toBe(true);
            expect(navigated.at(-1)).toBe('#/users');
            expect(host.querySelector('[data-admin-users-row][aria-selected="true"]')).toBeNull();
            expect(doc.activeElement).toBe(host.querySelector('[data-admin-users-link="34"]'));

            ctrl.destroy();
        });

        it('guards own admin realm and destructive actions, and exports account data when configured', async () => {
            const exported = [];
            const urlStub = {
                createObjectURL: vi.fn(() => 'blob:mock-export'),
                revokeObjectURL: vi.fn()
            };
            const { adapter } = createMockAdapter(SAMPLE_USERS, {
                async exportUserData(id) {
                    exported.push(id);
                    return { id, email: 'alex.north@example.test' };
                }
            });
            const ctrl = attachAdminUsers(host, {
                document: doc,
                window: win,
                panel,
                adapter,
                currentUserId: 1,
                downloadOptions: { url: urlStub, revokeDelay: 0 }
            });
            await flushMicrotasks();

            ctrl.openUser('1');
            await flushMicrotasks();

            expect(panel.querySelector('[data-admin-users-realm="admin"]').disabled).toBe(true);
            expect(panel.querySelector('[data-admin-users-section="account"]').textContent).toContain('cannot remove the admin realm');
            expect(panel.querySelector('[data-admin-users-action="mark-delete"]').disabled).toBe(true);
            expect(panel.querySelector('[data-admin-users-action="delete"]').disabled).toBe(true);
            expect(panel.querySelector('[data-admin-users-section="danger"]').textContent).toContain('cannot mark or delete your own account');

            panel.querySelector('[data-admin-users-action="export"]').click();
            await flushMicrotasks();
            expect(exported).toEqual(['1']);
            expect(urlStub.createObjectURL).toHaveBeenCalledTimes(1);
            expect(panel.querySelector('[data-admin-users-status="facts"]').textContent).toBe('Account data exported.');

            ctrl.destroy();
        });

        it('drops stale panel fetches when another user is selected first and surfaces panel load errors', async () => {
            const slow = deferred();
            const fast = deferred();
            let fail = false;
            const { adapter } = createMockAdapter(SAMPLE_USERS, {
                fetchUser(id) {
                    if (fail) {
                        return Promise.reject(new Error('Gateway timeout'));
                    }
                    return id === '34' ? slow.promise : fast.promise;
                }
            });
            const ctrl = attachAdminUsers(host, { document: doc, window: win, panel, adapter });
            await flushMicrotasks();

            ctrl.openUser('34');
            ctrl.openUser('47');
            fast.resolve(SAMPLE_USERS[4]);
            await flushMicrotasks();
            expect(panel.querySelector('[data-admin-users-panel-title]').textContent).toBe('Taylor Brooks');

            // Late resolution for user 34 must not overwrite user 47.
            slow.resolve(SAMPLE_USERS[1]);
            await flushMicrotasks();
            expect(panel.querySelector('[data-admin-users-panel-title]').textContent).toBe('Taylor Brooks');

            // Load failure renders error banner with Retry.
            fail = true;
            ctrl.openUser('1');
            await flushMicrotasks();
            expect(panel.querySelector('.banner--danger').textContent).toContain('Gateway timeout');

            ctrl.destroy();
        });
    });

    describe('extension hooks', () => {
        it('adds custom table columns, extra facts, and detail panel sections with act() reloads and cleanup', async () => {
            const cleanup = vi.fn();
            const resetPassword = vi.fn(async () => ({ ok: true }));
            const { adapter } = createMockAdapter(SAMPLE_USERS, {
                async fetchUser(id) {
                    const user = SAMPLE_USERS.find((item) => String(item.id) === String(id));
                    return {
                        user: { ...user },
                        credentials: [{ id: 'c-1', type: 'password' }],
                        grants: [{ 'application-id': 9, name: 'ToDo' }]
                    };
                }
            });
            const ctrl = attachAdminUsers(host, {
                document: doc,
                window: win,
                panel,
                adapter,
                currentUserId: 1,
                extraColumns: [
                    {
                        key: 'auth-id',
                        label: 'Auth ID',
                        numeric: true,
                        position: 'before-status',
                        cell: (user) => `auth-${user.id}`
                    }
                ],
                extraFacts: ({ data }) => [
                    { term: 'Credentials', value: String(data.credentials.length), key: 'credentials-count' },
                    { term: 'Grants', value: String(data.grants.length), key: 'grants-count' }
                ],
                extraSections: ({ data, dom, block, act, registerCleanup }) => {
                    registerCleanup(cleanup);
                    return [
                        block('password', 'Password', [
                            dom.h('p', null, `Has password: ${data.credentials.length > 0 ? 'yes' : 'no'}`),
                            dom.button('Reset password', () => act('password', resetPassword, 'Password reset.', 'The password was not saved'), {
                                'data-ext-reset': ''
                            })
                        ]),
                        {
                            key: 'grants',
                            heading: 'Application access',
                            position: 'after-facts',
                            content: dom.h('p', { 'data-ext-grants': '' }, data.grants.map((g) => g.name).join(', '))
                        }
                    ];
                }
            });
            await flushMicrotasks();

            const headers = [...host.querySelectorAll('thead th')].map((th) => th.textContent.trim());
            expect(headers).toEqual(['ID', 'Name', 'Email', 'Realms', 'Last active', 'Auth ID', 'Status']);
            const row34Cells = [...host.querySelectorAll('[data-admin-users-row][data-user-id="34"] > *')];
            expect(row34Cells[5].textContent).toBe('auth-34');
            expect(row34Cells[5].classList.contains('table__numeric')).toBe(true);

            ctrl.openUser('34');
            await flushMicrotasks();

            // Check section order: account -> password -> facts -> grants -> danger.
            const sectionKeys = [...panel.querySelectorAll('[data-admin-users-section]')].map((el) => el.dataset.adminUsersSection);
            expect(sectionKeys).toEqual(['account', 'password', 'facts', 'grants', 'danger']);
            expect(panel.querySelector('[data-fact="credentials-count"]').textContent).toBe('1');
            expect(panel.querySelector('[data-fact="grants-count"]').textContent).toBe('1');
            expect(panel.querySelector('[data-ext-grants]').textContent).toBe('ToDo');

            // Triggering act() inside extension section runs action, reloads panel, and announces status.
            panel.querySelector('[data-ext-reset]').click();
            await flushMicrotasks();
            expect(resetPassword).toHaveBeenCalledTimes(1);
            expect(panel.querySelector('[data-admin-users-status="password"]').textContent).toBe('Password reset.');
            // Previous panel render's cleanup ran before re-rendering.
            expect(cleanup).toHaveBeenCalledTimes(1);

            ctrl.closePanel();
            expect(cleanup).toHaveBeenCalledTimes(2);
            ctrl.destroy();
        });
    });

    describe('New user creation panel', () => {
        it('validates email, creates a new user, reloads table, and navigates to the created user', async () => {
            const { adapter, calls } = createMockAdapter();
            const nav = createNav('#/users');
            const navigated = [];
            const ctrl = attachAdminUsers(host, {
                document: doc,
                window: win,
                location: nav.location,
                history: nav.history,
                panel,
                adapter,
                navigate: (hash) => {
                    navigated.push(hash);
                    nav.location.hash = hash;
                    const id = hash.split('?')[0].split('/')[2] ?? null;
                    ctrl.update({ name: 'users', id });
                }
            });
            await flushMicrotasks();

            host.querySelector('[data-admin-users-action="new"]').click();
            await flushMicrotasks();

            expect(navigated.at(-1)).toBe('#/users/new');
            expect(panel.hidden).toBe(false);
            expect(panel.querySelector('[data-admin-users-panel-title]').textContent).toBe('New user');

            // Submitting an invalid email fails validation and focuses email input.
            const emailInput = panel.querySelector('[data-admin-users-input="email"]');
            emailInput.value = 'not-an-email';
            panel.querySelector('[data-admin-users-action="create"]').click();
            await flushMicrotasks();
            expect(calls.createUser).toHaveLength(0);
            expect(emailInput.getAttribute('aria-invalid')).toBe('true');

            // Submitting valid inputs creates user, reloads table, and opens created user's panel.
            emailInput.value = 'dana.cho@example.test';
            panel.querySelector('[data-admin-users-input="name"]').value = 'Dana Cho';
            panel.querySelector('[data-admin-users-input="password"]').value = 's3cret-pass';
            panel.querySelector('[data-admin-users-input="welcome"]').checked = false;
            panel.querySelector('[data-admin-users-action="create"]').click();
            await flushMicrotasks();

            expect(calls.createUser).toHaveLength(1);
            expect(calls.createUser[0].body).toEqual({
                email: 'dana.cho@example.test',
                name: 'Dana Cho',
                password: 's3cret-pass',
                'send-welcome-email': false
            });
            expect(navigated.at(-1)).toBe('#/users/100');
            expect(host.querySelector('[data-admin-users-link="100"]').textContent).toBe('Dana Cho');
            expect(panel.querySelector('[data-admin-users-panel-title]').textContent).toBe('Dana Cho');

            ctrl.destroy();
        });

        it('omits New user button when adapter.createUser is absent and shows create error banner on failure', async () => {
            const { adapter } = createMockAdapter(SAMPLE_USERS, { createUser: undefined });
            const ctrlNoCreate = attachAdminUsers(host, { document: doc, window: win, panel, adapter });
            await flushMicrotasks();
            expect(host.querySelector('[data-admin-users-action="new"]')).toBeNull();
            ctrlNoCreate.destroy();

            const failHost = doc.createElement('div');
            doc.body.append(failHost);
            const { adapter: failAdapter } = createMockAdapter(SAMPLE_USERS, {
                createUser: async () => {
                    throw new Error('Email already registered');
                }
            });
            const ctrlFail = attachAdminUsers(failHost, { document: doc, window: win, panel, adapter: failAdapter });
            await flushMicrotasks();
            ctrlFail.openCreate();
            panel.querySelector('[data-admin-users-input="email"]').value = 'dup@example.test';
            panel.querySelector('[data-admin-users-action="create"]').click();
            await flushMicrotasks();
            expect(panel.querySelector('[data-admin-users-banner="create"] .banner--danger').textContent).toContain('Email already registered');
            ctrlFail.destroy();
        });
    });

    describe('inline-confirmed deletion and restore', () => {
        it('asks via inline confirmation to mark for deletion, restore, and delete permanently', async () => {
            const { adapter, calls } = createMockAdapter();
            const nav = createNav('#/users');
            const ctrl = attachAdminUsers(host, {
                document: doc,
                window: win,
                location: nav.location,
                history: nav.history,
                panel,
                adapter,
                currentUserId: 1,
                navigate: (hash) => {
                    nav.location.hash = hash;
                    const id = hash.split('?')[0].split('/')[2] ?? null;
                    ctrl.update({ name: 'users', id });
                }
            });
            await flushMicrotasks();

            ctrl.openUser('34');
            await flushMicrotasks();

            // 1. Mark for deletion uses inline confirmation in danger zone.
            const markSlot = panel.querySelector('[data-admin-users-action="mark-delete"]').closest('[data-inline-confirm-slot]');
            expect(markSlot).toBeTruthy();
            markSlot.querySelector('[data-inline-confirm-trigger]').click();
            const markConfirm = markSlot.querySelector('[data-inline-confirm]');
            expect(markConfirm.hidden).toBe(false);

            // Cancelling keeps the account active.
            markConfirm.querySelector('[data-inline-confirm-answer="no"]').click();
            expect(calls.markUserForDeletion).toHaveLength(0);
            expect(markConfirm.hidden).toBe(true);

            // Confirming marks account and swaps action to Restore account.
            markSlot.querySelector('[data-inline-confirm-trigger]').click();
            markConfirm.querySelector('[data-inline-confirm-answer="yes"]').click();
            await flushMicrotasks();

            expect(calls.markUserForDeletion).toHaveLength(1);
            expect(calls.markUserForDeletion[0].id).toBe('34');
            expect(panel.querySelector('[data-admin-users-status="danger"]').textContent).toBe('Account marked for deletion.');
            expect(panel.querySelector('[data-fact="scheduled-purge"]')).toBeTruthy();
            expect(host.querySelector('[data-admin-users-row][data-user-id="34"]').textContent).toContain('Marked for deletion');

            // 2. Restore account also asks through inline confirmation in danger zone.
            const restoreSlot = panel.querySelector('[data-admin-users-action="restore"]').closest('[data-inline-confirm-slot]');
            expect(restoreSlot).toBeTruthy();
            restoreSlot.querySelector('[data-inline-confirm-trigger]').click();
            const restoreConfirm = restoreSlot.querySelector('[data-inline-confirm]');
            expect(restoreConfirm.hidden).toBe(false);
            restoreConfirm.querySelector('[data-inline-confirm-answer="yes"]').click();
            await flushMicrotasks();

            expect(calls.restoreUser).toHaveLength(1);
            expect(calls.restoreUser[0].id).toBe('34');
            expect(panel.querySelector('[data-admin-users-status="danger"]').textContent).toBe('Account restored.');
            expect(panel.querySelector('[data-admin-users-action="mark-delete"]')).toBeTruthy();
            expect(host.querySelector('[data-admin-users-row][data-user-id="34"]').textContent).toContain('Active');

            // 3. Delete permanently asks through inline confirmation, removes row, and closes panel.
            const deleteSlot = panel.querySelector('[data-admin-users-action="delete"]').closest('[data-inline-confirm-slot]');
            expect(deleteSlot).toBeTruthy();
            deleteSlot.querySelector('[data-inline-confirm-trigger]').click();
            deleteSlot.querySelector('[data-inline-confirm-answer="yes"]').click();
            await flushMicrotasks();

            expect(calls.deleteUser).toHaveLength(1);
            expect(calls.deleteUser[0].id).toBe('34');
            expect(panel.hidden).toBe(true);
            expect(host.querySelector('[data-admin-users-row][data-user-id="34"]')).toBeNull();
            expect(host.querySelectorAll('[data-admin-users-row]')).toHaveLength(4);

            ctrl.destroy();
        });
    });

    describe('admin-console frame integration and contract', () => {
        it('mounts via createAdminUsersScreen in createAdminConsole and handles same-screen detail routes without remounting', async () => {
            const { adapter, calls } = createMockAdapter();
            const consoleHost = doc.createElement('div');
            doc.body.append(consoleHost);

            const frame = createAdminConsole(consoleHost, {
                document: doc,
                window: win,
                title: 'Admin Console',
                account: { id: 1, name: 'Alex North', email: 'alex.north@example.test', realms: ['admin'] },
                screens: [createAdminUsersScreen({ adapter })]
            });
            frame.showShell();
            await flushMicrotasks();

            expect(consoleHost.querySelector('[data-admin-users]')).toBeTruthy();
            expect(calls.fetchUsers).toHaveLength(1);

            // Navigating to #/users/34 opens the side panel without refetching the full user list.
            win.location.hash = '#/users/34';
            win.dispatchEvent(new win.HashChangeEvent('hashchange'));
            await flushMicrotasks();

            const shellPanel = consoleHost.querySelector('[data-admin-console-panel]');
            expect(shellPanel.hidden).toBe(false);
            expect(shellPanel.querySelector('[data-admin-users-panel-title]').textContent).toBe('Samira Patel');
            expect(calls.fetchUsers).toHaveLength(1);

            // Closing the panel through the router returns focus to the user's link despite table-state hashchange.
            shellPanel.querySelector('[data-admin-users-action="close"]').click();
            win.dispatchEvent(new win.HashChangeEvent('hashchange'));
            await flushMicrotasks();
            expect(shellPanel.hidden).toBe(true);
            expect(doc.activeElement).toBe(consoleHost.querySelector('[data-admin-users-link="34"]'));

            frame.destroy();
        });

        it('rejects missing fetchUsers adapter and registers admin-users in contract.json', () => {
            expect(() => createAdminUsersScreen({})).toThrow(TypeError);
            const contractPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../src/contract.json');
            const contract = JSON.parse(readFileSync(contractPath, 'utf8'));
            expect(contract.components).toContain('admin-users');
        });
    });
});
