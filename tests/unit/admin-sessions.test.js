// @vitest-environment happy-dom
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAdminConsole } from '../../src/js/admin-console.js';
import { setSpriteUrl } from '../../src/js/icon.js';
import {
    attachAdminSessions,
    createAdminSessions,
    createAdminSessionsScreen,
    DEFAULT_TOKEN_SIZES,
    DEFAULT_TOKEN_STATES,
    DEFAULT_TOKEN_TYPES,
    formatSessionTime,
    isOwnToken,
    isTokenExpired,
    normalizeTokensResult,
    tokenUserEmail,
    tokenUserName
} from '../../src/js/admin-sessions.js';

const NOW = Date.parse('2026-11-24T12:00:00Z');

const SAMPLE_TOKENS = [
    {
        id: 901,
        user: { name: 'Alex North', email: 'alex.north@example.test' },
        type: 'session',
        'creation-time': '2026-11-24T08:00:00Z',
        'expiry-time': '2026-11-25T08:00:00Z'
    },
    {
        id: 902,
        user: { name: 'Samira Patel', email: 'samira.patel@example.test' },
        type: 'session',
        'creation-time': '2026-11-24T09:10:00Z',
        'expiry-time': '2026-11-25T09:10:00Z'
    },
    {
        id: 903,
        user: { name: 'Taylor Brooks', email: 'taylor.brooks@example.test' },
        type: 'one-time-code',
        'creation-time': '2026-11-24T10:15:00Z',
        'expiry-time': null
    },
    {
        id: 904,
        user: { name: '   ', email: 'casey.rivera@example.test' },
        type: 'authorization',
        'creation-time': '2026-11-23T11:00:00Z',
        'expiry-time': '2026-11-24T10:00:00Z'
    },
    {
        id: 905,
        user: null,
        type: 'change-request',
        'creation-time': '2026-11-20T07:00:00Z',
        'expiry-time': '2026-11-21T07:00:00Z'
    }
];

function cloneTokens(list = SAMPLE_TOKENS) {
    return list.map((token) => ({
        ...token,
        user: token.user ? { ...token.user } : token.user
    }));
}

async function flush() {
    for (let index = 0; index < 6; index += 1) {
        await Promise.resolve();
    }
}

let host;
const activeControllers = [];

function track(controller) {
    activeControllers.push(controller);
    return controller;
}

beforeEach(() => {
    setSpriteUrl('/looks/neutral/icons.svg');
    window.history.replaceState(null, '', '/admin.html#/sessions');
    host = document.createElement('div');
    document.body.append(host);
});

afterEach(() => {
    while (activeControllers.length > 0) {
        activeControllers.pop().destroy();
    }
    document.body.replaceChildren();
    vi.restoreAllMocks();
});

describe('admin-sessions helpers', () => {
    it('detects expired tokens from explicit flags or expiry timestamps', () => {
        expect(isTokenExpired({ 'expiry-time': '2026-11-24T11:59:59Z' }, NOW)).toBe(true);
        expect(isTokenExpired({ 'expiry-time': '2026-11-24T12:00:00Z' }, NOW)).toBe(true);
        expect(isTokenExpired({ 'expiry-time': '2026-11-24T12:00:01Z' }, NOW)).toBe(false);
        expect(isTokenExpired({ 'expiry-time': null }, NOW)).toBe(false);
        expect(isTokenExpired({ expired: true, 'expiry-time': '2099-01-01T00:00:00Z' }, NOW)).toBe(true);
        expect(isTokenExpired({ expired: false, 'expiry-time': '2020-01-01T00:00:00Z' }, NOW)).toBe(false);
    });

    it('detects the console own token by current flag or matching token ID', () => {
        expect(isOwnToken({ id: 901 }, 901)).toBe(true);
        expect(isOwnToken({ id: 901 }, '901')).toBe(true);
        expect(isOwnToken({ id: 902 }, 901)).toBe(false);
        expect(isOwnToken({ id: 902, current: true }, 901)).toBe(true);
        expect(isOwnToken({ id: 902 }, null)).toBe(false);
    });

    it('extracts user name and email across nested and flat token shapes', () => {
        expect(tokenUserName({ user: { name: 'Alex North', email: 'alex@example.test' } })).toBe('Alex North');
        expect(tokenUserName({ user: { name: '  ', email: 'alex@example.test' } })).toBe('alex@example.test');
        expect(tokenUserName({ 'user-name': 'Samira Patel', 'user-email': 'samira@example.test' })).toBe('Samira Patel');
        expect(tokenUserName({ 'user-email': 'samira@example.test' })).toBe('samira@example.test');
        expect(tokenUserName({ user: null })).toBe('—');
        expect(tokenUserEmail({ user: { email: 'alex@example.test' } })).toBe('alex@example.test');
        expect(tokenUserEmail({ 'user-email': 'samira@example.test' })).toBe('samira@example.test');
        expect(tokenUserEmail({})).toBe('');
    });

    it('formats timestamps and normalizes plain arrays and Page envelopes', () => {
        expect(formatSessionTime(null, 'Never')).toBe('Never');
        expect(formatSessionTime('not-a-date')).toBe('not-a-date');
        expect(formatSessionTime('2026-11-24T08:05:09Z')).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);

        const arr = normalizeTokensResult([{ id: 1 }]);
        expect(arr).toEqual({ tokens: [{ id: 1 }], envelope: null });

        const env = { elements: [{ id: 2 }], 'start-bookmark': null, 'end-bookmark': 'b2' };
        expect(normalizeTokensResult(env)).toEqual({ tokens: [{ id: 2 }], envelope: env });

        expect(normalizeTokensResult({ tokens: [{ id: 3 }] })).toEqual({ tokens: [{ id: 3 }], envelope: null });
        expect(normalizeTokensResult(null)).toEqual({ tokens: [], envelope: null });
        expect(DEFAULT_TOKEN_TYPES).toContain('session');
        expect(DEFAULT_TOKEN_STATES.map(([value]) => value)).toEqual(['', 'active', 'expired']);
        expect(DEFAULT_TOKEN_SIZES).toEqual([20, 50, 100]);
    });

    it('rejects missing root or missing adapter.fetchTokens', () => {
        expect(() => attachAdminSessions(null, { adapter: { fetchTokens: () => [] } })).toThrow(TypeError);
        expect(() => attachAdminSessions(host, {})).toThrow(TypeError);
        expect(() => createAdminSessionsScreen({})).toThrow(TypeError);
    });
});

describe('own-session protection', () => {
    it('disables selection and revocation for the current console token and blocks programmatic revoke', async () => {
        const revokeToken = vi.fn(async () => {});
        const controller = track(attachAdminSessions(host, {
            now: () => NOW,
            currentTokenId: () => 901,
            adapter: {
                fetchTokens: async () => cloneTokens(),
                revokeToken
            }
        }));
        await flush();

        const ownRow = host.querySelector('[data-admin-sessions-row][data-token-id="901"]');
        expect(ownRow).not.toBeNull();
        const ownCheckbox = ownRow.querySelector('[data-selection-item]');
        expect(ownCheckbox.disabled).toBe(true);
        expect(ownCheckbox.getAttribute('aria-label')).toBe('Your current session cannot be selected');

        expect(ownRow.querySelector('[data-admin-sessions-own]').textContent).toBe('Your session');
        const ownRevokeBtn = ownRow.querySelector('[data-admin-sessions-action="revoke"]');
        expect(ownRevokeBtn.disabled).toBe(true);
        expect(ownRow.querySelector('[data-inline-confirm-slot]')).toBeNull();

        // Select-all selects every other row and skips the own session.
        const selectAll = host.querySelector('[data-selection-all]');
        selectAll.click();
        expect(controller.getSelectedIds()).toEqual(['902', '903', '904', '905']);
        expect(ownCheckbox.checked).toBe(false);

        // Programmatic revoke refuses the own token without touching the adapter.
        const refused = await controller.revoke(['901']);
        expect(refused).toBe(false);
        expect(revokeToken).not.toHaveBeenCalled();
    });

    it('also protects tokens marked with current: true', async () => {
        const revokeToken = vi.fn(async () => {});
        track(attachAdminSessions(host, {
            now: () => NOW,
            adapter: {
                fetchTokens: async () => [
                    { id: 10, 'user-name': 'Admin', 'user-email': 'admin@example.test', current: true, expired: false },
                    { id: 11, 'user-name': 'Guest', 'user-email': 'guest@example.test', current: false, expired: true }
                ],
                revokeToken
            }
        }));
        await flush();

        const ownRow = host.querySelector('[data-admin-sessions-row][data-token-id="10"]');
        expect(ownRow.querySelector('[data-selection-item]').disabled).toBe(true);
        expect(ownRow.querySelector('[data-admin-sessions-action="revoke"]').disabled).toBe(true);
        expect(ownRow.querySelector('[data-admin-sessions-own]').textContent).toBe('Your session');
    });
});

describe('single, bulk, and expired revocation', () => {
    it('revokes a single token after inline confirmation and reloads quietly', async () => {
        let store = cloneTokens();
        const revokeToken = vi.fn(async (id) => {
            store = store.filter((item) => String(item.id) !== String(id));
        });
        track(attachAdminSessions(host, {
            now: () => NOW,
            currentTokenId: 901,
            adapter: {
                fetchTokens: async () => cloneTokens(store),
                revokeToken
            }
        }));
        await flush();

        const row902 = host.querySelector('[data-admin-sessions-row][data-token-id="902"]');
        row902.querySelector('[data-admin-sessions-action="revoke"]').click();
        const confirm = row902.querySelector('[data-inline-confirm]');
        expect(confirm.hidden).toBe(false);
        expect(confirm.textContent).toContain('Revoke token 902 of Samira Patel?');

        // Canceling keeps the token intact.
        confirm.querySelector('[data-inline-confirm-answer="no"]').click();
        expect(confirm.hidden).toBe(true);
        expect(revokeToken).not.toHaveBeenCalled();

        // Confirming revokes and refreshes.
        row902.querySelector('[data-admin-sessions-action="revoke"]').click();
        confirm.querySelector('[data-inline-confirm-answer="yes"]').click();
        await flush();

        expect(revokeToken).toHaveBeenCalledTimes(1);
        expect(revokeToken.mock.calls[0][0]).toBe('902');
        expect(host.querySelector('[data-admin-sessions-row][data-token-id="902"]')).toBeNull();
        expect(host.querySelector('[data-admin-sessions-notice]').textContent).toBe('Token 902 revoked.');
    });

    it('supports bulk selection via selection.js, inline confirmation, and partial failure reporting', async () => {
        let store = cloneTokens();
        const revokeToken = vi.fn(async (id) => {
            if (String(id) === '903') {
                throw new Error('Database busy');
            }
            store = store.filter((item) => String(item.id) !== String(id));
        });
        const controller = track(attachAdminSessions(host, {
            now: () => NOW,
            currentTokenId: 901,
            adapter: {
                fetchTokens: async () => cloneTokens(store),
                revokeToken
            }
        }));
        await flush();

        const fieldset = host.querySelector('fieldset.selection.selection--table[data-selection-root]');
        expect(fieldset).not.toBeNull();
        const bar = fieldset.querySelector('[data-selection-bar]');
        expect(bar.hidden).toBe(true);

        const box902 = host.querySelector('[data-admin-sessions-row][data-token-id="902"] [data-selection-item]');
        const box903 = host.querySelector('[data-admin-sessions-row][data-token-id="903"] [data-selection-item]');
        box902.click();
        box903.click();

        expect(bar.hidden).toBe(false);
        expect(fieldset.querySelector('[data-selection-count]').textContent).toBe('2 selected');
        expect(controller.getSelectedIds()).toEqual(['902', '903']);

        bar.querySelector('[data-admin-sessions-action="revoke-selected"]').click();
        const confirm = bar.querySelector('[data-inline-confirm]');
        expect(confirm.hidden).toBe(false);
        expect(confirm.textContent).toContain('Revoke 2 selected tokens?');

        confirm.querySelector('[data-inline-confirm-answer="yes"]').click();
        await flush();

        expect(revokeToken).toHaveBeenCalledTimes(2);
        expect(host.querySelector('[data-admin-sessions-row][data-token-id="902"]')).toBeNull();
        expect(host.querySelector('[data-admin-sessions-row][data-token-id="903"]')).not.toBeNull();
        const banner = host.querySelector('[data-admin-sessions-banner]');
        expect(banner.textContent).toContain('Revoked 1 of 2 tokens.');
        expect(banner.textContent).toContain('Token 903 failed: Database busy');
    });

    it('uses adapter.revokeTokens batch handler when supplied', async () => {
        let store = cloneTokens();
        const revokeTokens = vi.fn(async (ids) => {
            store = store.filter((item) => !ids.includes(String(item.id)));
        });
        track(attachAdminSessions(host, {
            now: () => NOW,
            currentTokenId: 901,
            adapter: {
                fetchTokens: async () => cloneTokens(store),
                revokeTokens
            }
        }));
        await flush();

        host.querySelector('[data-admin-sessions-row][data-token-id="902"] [data-selection-item]').click();
        host.querySelector('[data-admin-sessions-row][data-token-id="903"] [data-selection-item]').click();
        const bar = host.querySelector('[data-selection-bar]');
        bar.querySelector('[data-admin-sessions-action="revoke-selected"]').click();
        bar.querySelector('[data-inline-confirm-answer="yes"]').click();
        await flush();

        expect(revokeTokens).toHaveBeenCalledTimes(1);
        expect(revokeTokens.mock.calls[0][0]).toEqual(['902', '903']);
        expect(host.querySelector('[data-admin-sessions-notice]').textContent).toBe('2 tokens revoked.');
        expect(host.querySelectorAll('[data-admin-sessions-row]')).toHaveLength(3);
    });

    it('removes expired tokens via inline confirmation and disables the trigger when none remain', async () => {
        let store = cloneTokens();
        const revokeExpired = vi.fn(async () => {
            store = store.filter((item) => !isTokenExpired(item, NOW));
        });
        const controller = track(attachAdminSessions(host, {
            now: () => NOW,
            currentTokenId: 901,
            adapter: {
                fetchTokens: async () => cloneTokens(store),
                revokeExpired
            }
        }));
        await flush();

        const removeBtn = host.querySelector('[data-admin-sessions-action="remove-expired"]');
        expect(removeBtn).not.toBeNull();
        expect(removeBtn.disabled).toBe(false);
        expect(controller.getExpiredCount()).toBe(2);

        removeBtn.click();
        const toolbar = host.querySelector('[data-admin-sessions-toolbar]');
        const confirm = toolbar.querySelector('[data-inline-confirm]');
        expect(confirm.hidden).toBe(false);
        expect(confirm.textContent).toContain('Remove 2 expired tokens? Active sessions stay signed in.');

        confirm.querySelector('[data-inline-confirm-answer="yes"]').click();
        await flush();

        expect(revokeExpired).toHaveBeenCalledTimes(1);
        expect(host.querySelector('[data-admin-sessions-notice]').textContent).toBe('Expired tokens removed.');
        expect(controller.getExpiredCount()).toBe(0);
        expect(removeBtn.disabled).toBe(true);
        expect(host.querySelectorAll('[data-admin-sessions-row]')).toHaveLength(3);
    });

    it('omits the Remove expired button when adapter.revokeExpired is not provided', async () => {
        track(attachAdminSessions(host, {
            now: () => NOW,
            adapter: { fetchTokens: async () => cloneTokens() }
        }));
        await flush();

        expect(host.querySelector('[data-admin-sessions-action="remove-expired"]')).toBeNull();
    });
});

describe('filters, paging, empty states, errors, and console integration', () => {
    it('filters by query, type, and state, persists in URL hash, pages in memory, and clears filters', async () => {
        const controller = track(attachAdminSessions(host, {
            now: () => NOW,
            currentTokenId: 901,
            sizes: [2, 5, 10],
            defaultSize: 2,
            adapter: {
                fetchTokens: async () => cloneTokens()
            }
        }));
        await flush();

        // First page shows 2 of 5 tokens.
        expect(host.querySelectorAll('[data-admin-sessions-row]')).toHaveLength(2);
        expect(host.querySelector('[data-table-state-text]').textContent).toContain('Page 1 of 3');

        // Navigate to page 2.
        host.querySelector('[data-table-state-action="next"]').click();
        expect(host.querySelectorAll('[data-admin-sessions-row]')).toHaveLength(2);
        expect(window.location.hash).toBe('#/sessions?page=2');

        // Filter by exact token ID.
        const search = host.querySelector('[data-admin-sessions-filter="q"]');
        search.value = '903';
        search.dispatchEvent(new Event('input', { bubbles: true }));
        expect(host.querySelectorAll('[data-admin-sessions-row]')).toHaveLength(1);
        expect(host.querySelector('[data-admin-sessions-row]').dataset.tokenId).toBe('903');
        expect(window.location.hash).toBe('#/sessions?q=903');

        // Filter by state = expired with cleared q.
        search.value = '';
        search.dispatchEvent(new Event('input', { bubbles: true }));
        const stateSelect = host.querySelector('[data-admin-sessions-filter="state"]');
        stateSelect.value = 'expired';
        stateSelect.dispatchEvent(new Event('change', { bubbles: true }));
        expect(controller.getFilteredTokens().map((token) => token.id)).toEqual([904, 905]);
        expect(window.location.hash).toBe('#/sessions?state=expired');

        // Filter by type that yields zero matches and click Clear filters.
        const typeSelect = host.querySelector('[data-admin-sessions-filter="type"]');
        typeSelect.value = 'one-time-code';
        typeSelect.dispatchEvent(new Event('change', { bubbles: true }));
        const emptyFiltered = host.querySelector('[data-admin-sessions-empty="filtered"]');
        expect(emptyFiltered).not.toBeNull();
        emptyFiltered.querySelector('[data-admin-sessions-action="clear-filters"]').click();
        expect(controller.getFilteredTokens()).toHaveLength(5);
        expect(window.location.hash).toBe('#/sessions');
    });

    it('supports server bookmark paging mode for Page envelopes', async () => {
        const fetchTokens = vi.fn(async ({ direction }) => {
            if (direction === 'next') {
                return {
                    elements: [{ id: 202, 'user-name': 'Page Two', 'user-email': 'p2@example.test', expired: false }],
                    'start-bookmark': 'b1',
                    'end-bookmark': null
                };
            }
            return {
                elements: [{ id: 201, 'user-name': 'Page One', 'user-email': 'p1@example.test', expired: false }],
                'start-bookmark': null,
                'end-bookmark': 'b1'
            };
        });
        track(attachAdminSessions(host, {
            mode: 'server',
            showTypeFilter: false,
            showStateFilter: false,
            adapter: { fetchTokens }
        }));
        await flush();

        expect(host.querySelector('[data-admin-sessions-row]').dataset.tokenId).toBe('201');
        host.querySelector('[data-table-state-action="next"]').click();
        await flush();
        expect(fetchTokens).toHaveBeenCalledTimes(2);
        expect(fetchTokens.mock.calls[1][0].direction).toBe('next');
        expect(fetchTokens.mock.calls[1][0].params.get('page-bookmark')).toBe('b1');
        expect(host.querySelector('[data-admin-sessions-row]').dataset.tokenId).toBe('202');
    });

    it('renders empty state, retry on failure, sign-in on 401, and supports extraColumns', async () => {
        let attempt = 0;
        const onSignIn = vi.fn();
        const controller = track(createAdminSessions(document, {
            now: () => NOW,
            onSignIn,
            extraColumns: [{
                key: 'client',
                label: 'Client',
                position: 'before-action',
                cell: (token) => token.client ?? 'Web'
            }],
            adapter: {
                fetchTokens: async () => {
                    attempt += 1;
                    if (attempt === 1) {
                        throw new Error('Backend down');
                    }
                    if (attempt === 2) {
                        throw Object.assign(new Error('Expired'), { status: 401 });
                    }
                    if (attempt === 3) {
                        return [];
                    }
                    return [{ id: 77, user: { name: 'Alex', email: 'a@example.test' }, type: 'session', client: 'CLI' }];
                }
            }
        }));
        host.append(controller.element);
        await flush();

        // Attempt 1: error banner with Retry.
        expect(controller.element.querySelector('[data-data-loader-error="failed"]')).not.toBeNull();
        controller.element.querySelector('[data-data-loader-action="retry"]').click();
        await flush();

        // Attempt 2: 401 banner with Sign in.
        expect(controller.element.querySelector('[data-data-loader-error="unauthorized"]')).not.toBeNull();
        controller.element.querySelector('[data-data-loader-action="sign-in"]').click();
        expect(onSignIn).toHaveBeenCalledTimes(1);

        // Attempt 3: empty list state.
        await controller.refresh();
        await flush();
        expect(controller.element.querySelector('[data-admin-sessions-empty="none"]')).not.toBeNull();

        // Attempt 4: extraColumns rendered.
        await controller.refresh();
        await flush();
        expect([...controller.element.querySelectorAll('thead th')].map((th) => th.textContent.trim())).toContain('Client');
        expect(controller.element.querySelector('[data-admin-sessions-row]').textContent).toContain('CLI');
    });

    it('mounts cleanly in admin-console.js and reads session id from frame context', async () => {
        const consoleFrame = track(createAdminConsole(host, {
            title: 'Admin Console',
            account: { id: 1, name: 'Alex North', email: 'alex.north@example.test' },
            session: { id: 901 },
            defaultScreen: 'sessions',
            screens: [
                createAdminSessionsScreen({
                    now: () => NOW,
                    adapter: {
                        fetchTokens: async () => cloneTokens(),
                        revokeToken: async () => {}
                    }
                })
            ]
        }));
        consoleFrame.showShell();
        await flush();

        expect(host.querySelector('[data-admin-sessions]')).not.toBeNull();
        const ownRow = host.querySelector('[data-admin-sessions-row][data-token-id="901"]');
        expect(ownRow.querySelector('[data-selection-item]').disabled).toBe(true);
        expect(ownRow.querySelector('[data-admin-sessions-own]').textContent).toBe('Your session');
    });

    it('reports single-revoke, 401, and expired-cleanup errors, supports allowBulk: false, and cleans up on abort', async () => {
        const onSignIn = vi.fn();
        const abortController = new AbortController();
        const controller = track(attachAdminSessions(host, {
            now: () => NOW,
            currentTokenId: 901,
            onSignIn,
            signal: abortController.signal,
            adapter: {
                fetchTokens: async () => cloneTokens(),
                revokeToken: async (id) => {
                    if (String(id) === '902') {
                        throw new Error('Server refused');
                    }
                    throw Object.assign(new Error('Token expired'), { status: 401 });
                },
                revokeExpired: async () => {
                    throw new Error('Cleanup locked');
                }
            }
        }));
        await flush();

        // Single revoke failure shows error banner.
        await controller.revoke(['902']);
        await flush();
        expect(host.querySelector('[data-admin-sessions-banner]').textContent).toContain('Token 902 was not revoked: Server refused.');

        // 401 revoke failure renders a Sign in action.
        await controller.revoke(['903']);
        await flush();
        const signInBtn = host.querySelector('[data-admin-sessions-action="sign-in"]');
        expect(signInBtn).not.toBeNull();
        signInBtn.click();
        expect(onSignIn).toHaveBeenCalledTimes(1);

        // Expired cleanup failure shows error banner.
        await controller.removeExpired();
        await flush();
        expect(host.querySelector('[data-admin-sessions-banner]').textContent).toContain('Expired tokens were not removed: Cleanup locked.');

        // Aborting the lifecycle signal destroys the screen cleanly.
        abortController.abort();
        expect(host.hasAttribute('data-admin-sessions')).toBe(false);

        // allowBulk: false omits checkboxes and bulk bar.
        const secondHost = document.createElement('div');
        document.body.append(secondHost);
        track(attachAdminSessions(secondHost, {
            now: () => NOW,
            allowBulk: false,
            adapter: {
                fetchTokens: async () => cloneTokens(),
                revokeToken: async () => {}
            }
        }));
        await flush();
        expect(secondHost.querySelector('[data-selection-root]')).toBeNull();
        expect(secondHost.querySelector('[data-selection-item]')).toBeNull();
        expect(secondHost.querySelectorAll('[data-admin-sessions-row]')).toHaveLength(5);
    });
});
