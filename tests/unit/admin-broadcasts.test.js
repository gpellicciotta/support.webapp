// @vitest-environment happy-dom
// Unit tests for admin-broadcasts.js: history reconstruction and normalization, audience and time
// formatting, live inbox/banner preview, recipient selection, form validation and publish payload,
// history filtering and pagination, inline-confirm retraction, error/401 states, frame integration,
// shell split layout, and contract registration.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Window } from 'happy-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAdminConsole } from '../../src/js/admin-console.js';
import {
    attachAdminBroadcasts,
    buildBroadcastHistory,
    createAdminBroadcasts,
    createAdminBroadcastsScreen,
    DEFAULT_ACTION_URL_MAX,
    DEFAULT_BROADCAST_AUDIENCES,
    DEFAULT_BROADCAST_STATUSES,
    DEFAULT_BROADCAST_TYPES,
    DEFAULT_HISTORY_STEP,
    DEFAULT_MESSAGE_MAX,
    DEFAULT_TITLE_MAX,
    filterBroadcastHistory,
    formatAudience,
    formatBroadcastTime,
    normalizeBroadcastHistory,
    toUtcTime
} from '../../src/js/admin-broadcasts.js';
import { setSpriteUrl } from '../../src/js/icon.js';

const SPRITE = '/vendor/design/looks/neutral/icons.svg';

/**
 * Create a manually settled deferred promise for async state tests.
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
 * @returns {Promise<void>} resolves after microtask turns
 */
async function flushMicrotasks() {
    for (let i = 0; i < 16; i += 1) {
        await Promise.resolve();
    }
}

/**
 * Create an isolated mock location and history pair for URL hash assertions.
 * @param {string} [initialHash] initial `location.hash`, e.g. `'#/broadcasts'`
 * @returns {{location: {pathname: string, search: string, hash: string}, history: {state: unknown, calls: Array, replaceState: Function}}}
 *   navigation stubs
 */
function createNav(initialHash = '#/broadcasts') {
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
    { id: 34, email: 'samira.patel@example.test', name: 'Samira Patel' },
    { id: 1, email: 'alex.north@example.test', name: 'Alex North' },
    { id: 36, email: 'jordan.kim@example.test', name: 'Jordan Kim', 'expiry-time': '2026-12-01T00:00:00Z' },
    { id: 41, email: 'morgan.lee@example.test', name: '' }
];

const SAMPLE_SYSTEM_EVENTS = [
    {
        id: 215,
        'event-type': 'broadcast-retracted',
        severity: 'info',
        description: 'Retracted broadcast 210',
        'creation-time': '2026-11-23T15:00:00Z',
        metadata: JSON.stringify({ 'retracted-event-id': 210 })
    },
    {
        id: 214,
        'event-type': 'broadcast-published',
        severity: 'warning',
        description: 'Fallback description',
        'creation-time': '2026-11-24T09:14:00Z',
        metadata: JSON.stringify({
            title: 'Scheduled maintenance',
            message: 'Sign-in restarts at 22:00 UTC for five minutes.',
            type: 'warning',
            banner: true,
            'action-url': '/help',
            'target-filter': { type: 'all' },
            'deletion-time': '2026-11-25T00:00:00Z'
        })
    },
    {
        id: 212,
        'event-type': 'user-locked',
        severity: 'error',
        description: 'Unrelated event',
        'creation-time': '2026-11-23T12:00:00Z',
        metadata: '{}'
    },
    {
        id: 210,
        'event-type': 'broadcast-published',
        severity: 'info',
        description: 'Old release announcement',
        'creation-time': '2026-11-22T10:00:00Z',
        metadata: {
            message: 'Release notes are ready.',
            type: 'info',
            banner: false,
            'target-filter': { type: 'role', 'role-name': 'admin' }
        }
    }
];

const SAMPLE_DIRECT_BROADCASTS = [
    {
        id: 52,
        title: 'Holiday hours',
        message: 'Support responds within 24 hours this week.',
        type: 'info',
        audience: 'all',
        banner: false,
        'recipient-count': 128,
        'created-at': '2026-11-24T08:00:00Z',
        status: 'active'
    },
    {
        id: 51,
        title: 'API outage resolved',
        message: 'All endpoints are back to normal.',
        type: 'success',
        'audience-type': 'role:owner',
        banner: true,
        'recipient-count': 14,
        'action-url': 'https://status.example.test',
        'created-at': '2026-11-23T14:30:00Z',
        status: 'retracted'
    }
];

describe('admin-broadcasts helpers', () => {
    it('exports standard broadcast defaults', () => {
        expect(DEFAULT_BROADCAST_TYPES).toEqual([
            ['info', 'Info'],
            ['warning', 'Warning'],
            ['error', 'Error']
        ]);
        expect(DEFAULT_BROADCAST_AUDIENCES.map(([value]) => value)).toEqual([
            'all',
            'role:owner',
            'role:admin',
            'role:test',
            'specific-users'
        ]);
        expect(DEFAULT_BROADCAST_STATUSES).toEqual([
            ['', 'All statuses'],
            ['active', 'Active'],
            ['retracted', 'Retracted']
        ]);
        expect(DEFAULT_TITLE_MAX).toBe(200);
        expect(DEFAULT_MESSAGE_MAX).toBe(1000);
        expect(DEFAULT_ACTION_URL_MAX).toBe(250);
        expect(DEFAULT_HISTORY_STEP).toBe(25);
    });

    it('reconstructs broadcast history from Auth system events and marks retracted entries', () => {
        const entries = buildBroadcastHistory(SAMPLE_SYSTEM_EVENTS);
        expect(entries).toHaveLength(2);
        expect(entries[0]).toMatchObject({
            id: 214,
            title: 'Scheduled maintenance',
            message: 'Sign-in restarts at 22:00 UTC for five minutes.',
            type: 'warning',
            banner: true,
            actionUrl: '/help',
            filter: { type: 'all' },
            published: '2026-11-24T09:14:00Z',
            expires: '2026-11-25T00:00:00Z',
            retracted: false
        });
        expect(entries[1]).toMatchObject({
            id: 210,
            title: null,
            message: 'Release notes are ready.',
            type: 'info',
            banner: false,
            filter: { type: 'role', 'role-name': 'admin' },
            retracted: true
        });
    });

    it('normalizes both Auth system-event payloads and ToDo direct broadcast lists', () => {
        expect(normalizeBroadcastHistory(SAMPLE_SYSTEM_EVENTS)).toHaveLength(2);
        expect(normalizeBroadcastHistory({ 'system-events': SAMPLE_SYSTEM_EVENTS })).toHaveLength(2);

        const direct = normalizeBroadcastHistory(SAMPLE_DIRECT_BROADCASTS);
        expect(direct).toHaveLength(2);
        expect(direct[0]).toMatchObject({
            id: 52,
            title: 'Holiday hours',
            type: 'info',
            banner: false,
            recipientCount: 128,
            retracted: false
        });
        expect(direct[1]).toMatchObject({
            id: 51,
            type: 'success',
            banner: true,
            actionUrl: 'https://status.example.test',
            recipientCount: 14,
            retracted: true
        });
        expect(normalizeBroadcastHistory({ broadcasts: SAMPLE_DIRECT_BROADCASTS })).toHaveLength(2);
        expect(normalizeBroadcastHistory(null)).toEqual([]);
    });

    it('formats structured target filters and string audiences', () => {
        expect(formatAudience({ type: 'all' })).toBe('Everyone');
        expect(formatAudience({ type: 'role', 'role-name': 'admin' })).toBe('Realm: admin');
        expect(formatAudience({ type: 'specific-users', 'user-ids': [1] })).toBe('1 account');
        expect(formatAudience({ type: 'specific-users', 'user-ids': [1, 2, 3] })).toBe('3 accounts');
        expect(formatAudience({ type: 'active-recently', days: 7 })).toBe('Active in the last 7 days');
        expect(formatAudience('all')).toBe('Everyone');
        expect(formatAudience('role:owner')).toBe('Role: owner');
    });

    it('converts datetime-local values to UTC ISO strings and formats broadcast times', () => {
        expect(toUtcTime('')).toBeNull();
        expect(toUtcTime('not-a-date')).toBeNull();
        expect(toUtcTime('2026-11-24T12:30:00Z')).toBe('2026-11-24T12:30:00Z');
        expect(formatBroadcastTime(null)).toBe('—');
        expect(formatBroadcastTime('2026-11-24T09:15:30Z')).toMatch(/^\d{4}-\d{2}-\d{2} \d{2}:\d{2}:\d{2}$/);
        expect(formatBroadcastTime('not-a-time')).toBe('not-a-time');
    });

    it('filters broadcast history by search query, type, and active/retracted status', () => {
        const entries = buildBroadcastHistory(SAMPLE_SYSTEM_EVENTS);
        expect(filterBroadcastHistory(entries, { q: '210' })).toHaveLength(1);
        expect(filterBroadcastHistory(entries, { q: 'maintenance' })).toHaveLength(1);
        expect(filterBroadcastHistory(entries, { type: 'warning' })).toHaveLength(1);
        expect(filterBroadcastHistory(entries, { status: 'retracted' }).map((e) => e.id)).toEqual([210]);
        expect(filterBroadcastHistory(entries, { status: 'active' }).map((e) => e.id)).toEqual([214]);
    });
});

describe('attachAdminBroadcasts', () => {
    let host;
    let controllers;

    beforeEach(() => {
        setSpriteUrl(SPRITE);
        host = document.createElement('div');
        document.body.append(host);
        controllers = [];
    });

    afterEach(() => {
        for (const controller of controllers) {
            controller.destroy();
        }
        controllers = [];
        host.remove();
        vi.restoreAllMocks();
    });

    function mountScreen(options = {}) {
        const nav = createNav(options.initialHash ?? '#/broadcasts');
        const adapter = options.adapter ?? {
            fetchHistory: vi.fn().mockResolvedValue(SAMPLE_SYSTEM_EVENTS),
            fetchUsers: vi.fn().mockResolvedValue(SAMPLE_USERS),
            publish: vi.fn().mockResolvedValue({ message: 'Broadcast published' }),
            retract: vi.fn().mockResolvedValue({ message: 'Broadcast retracted' })
        };
        const controller = attachAdminBroadcasts(host, {
            location: nav.location,
            history: nav.history,
            debounce: 0,
            ...options,
            adapter
        });
        controllers.push(controller);
        return { controller, adapter, nav };
    }

    it('rejects missing container or missing adapter functions', () => {
        expect(() => attachAdminBroadcasts(null, {})).toThrow(TypeError);
        expect(() => attachAdminBroadcasts(host, {})).toThrow(TypeError);
        expect(() => attachAdminBroadcasts(host, { adapter: { fetchHistory: async () => [] } })).toThrow(TypeError);
        expect(() => createAdminBroadcastsScreen({})).toThrow(TypeError);
    });

    it('updates live inbox row and banner previews from form values and sanitizes unsafe action URLs', async () => {
        mountScreen();
        await flushMicrotasks();

        const preview = host.querySelector('[data-admin-broadcasts-preview]');
        const inboxPreview = host.querySelector('[data-admin-broadcasts-preview-inbox]');
        const bannerWrap = host.querySelector('[data-admin-broadcasts-preview-banner]');
        const bannerBox = host.querySelector('[data-admin-broadcasts-preview-banner-box]');
        const titleInput = host.querySelector('[data-admin-broadcasts-input="title"]');
        const messageInput = host.querySelector('[data-admin-broadcasts-input="message"]');
        const bannerInput = host.querySelector('[data-admin-broadcasts-input="banner"]');
        const actionInput = host.querySelector('[data-admin-broadcasts-input="action-url"]');
        const warningRadio = host.querySelector('[data-admin-broadcasts-input="type"][value="warning"]');
        const errorRadio = host.querySelector('[data-admin-broadcasts-input="type"][value="error"]');

        // Non-banner defaults to inbox row preview with banner hidden.
        expect(preview.dataset.adminBroadcastsPreviewMode).toBe('inbox');
        expect(inboxPreview.hidden).toBe(false);
        expect(bannerWrap.hidden).toBe(true);
        expect(inboxPreview.textContent).toContain('Your message appears here.');

        // Typing updates inbox row title, message, and safe action URL.
        titleInput.value = 'Database upgrade';
        titleInput.dispatchEvent(new Event('input', { bubbles: true }));
        messageInput.value = 'Read-only mode starts at 02:00 UTC.';
        messageInput.dispatchEvent(new Event('input', { bubbles: true }));
        actionInput.value = '/status';
        actionInput.dispatchEvent(new Event('input', { bubbles: true }));

        expect(inboxPreview.textContent).toContain('Database upgrade');
        expect(inboxPreview.textContent).toContain('Read-only mode starts at 02:00 UTC.');
        expect(inboxPreview.querySelector('a')?.getAttribute('href')).toBe('/status');

        // Unsafe URL schemes are never placed in preview anchor hrefs.
        actionInput.value = 'javascript:alert(1)';
        actionInput.dispatchEvent(new Event('input', { bubbles: true }));
        expect(inboxPreview.querySelector('a')).toBeNull();

        // Checking banner reveals banner preview with matching variant and role.
        actionInput.value = 'https://status.example.test';
        actionInput.dispatchEvent(new Event('input', { bubbles: true }));
        warningRadio.checked = true;
        warningRadio.dispatchEvent(new Event('change', { bubbles: true }));
        bannerInput.checked = true;
        bannerInput.dispatchEvent(new Event('change', { bubbles: true }));

        expect(preview.dataset.adminBroadcastsPreviewMode).toBe('banner');
        expect(bannerWrap.hidden).toBe(false);
        expect(bannerBox.classList.contains('banner--warning')).toBe(true);
        expect(bannerBox.getAttribute('role')).toBe('status');
        expect(bannerBox.textContent).toContain('Database upgrade:');
        expect(bannerBox.textContent).toContain('Read-only mode starts at 02:00 UTC.');
        expect(bannerBox.querySelector('a')?.getAttribute('href')).toBe('https://status.example.test');

        // Error banner uses banner--danger and role="alert".
        errorRadio.checked = true;
        errorRadio.dispatchEvent(new Event('change', { bubbles: true }));
        expect(bannerBox.classList.contains('banner--danger')).toBe(true);
        expect(bannerBox.getAttribute('role')).toBe('alert');
    });

    it('loads active accounts lazily for Selected accounts, filters them, validates selection, and publishes user IDs', async () => {
        const { adapter } = mountScreen();
        await flushMicrotasks();

        const audienceSelect = host.querySelector('[data-admin-broadcasts-input="audience"]');
        const recipients = host.querySelector('[data-admin-broadcasts-recipients]');
        const messageInput = host.querySelector('[data-admin-broadcasts-input="message"]');
        const form = host.querySelector('[data-admin-broadcasts-form]');

        expect(recipients.hidden).toBe(true);
        expect(adapter.fetchUsers).not.toHaveBeenCalled();

        audienceSelect.value = 'specific-users';
        audienceSelect.dispatchEvent(new Event('change', { bubbles: true }));
        await flushMicrotasks();

        expect(recipients.hidden).toBe(false);
        expect(adapter.fetchUsers).toHaveBeenCalledTimes(1);

        // Expired account (Jordan Kim) is excluded; remaining 3 are sorted alphabetically.
        const items = [...recipients.querySelectorAll('[data-selection-item]')];
        expect(items.map((el) => el.value)).toEqual(['1', '41', '34']);

        // Submitting without selecting any recipient blocks publish and reveals inline error.
        messageInput.value = 'Direct notice';
        messageInput.dispatchEvent(new Event('input', { bubbles: true }));
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await flushMicrotasks();

        expect(adapter.publish).not.toHaveBeenCalled();
        const recipientError = recipients.querySelector('[data-admin-broadcasts-recipients-error]');
        expect(recipientError.hidden).toBe(false);

        // Filtering hides non-matching accounts; selecting a matching account clears error and submits.
        const filterInput = recipients.querySelector('[data-admin-broadcasts-recipient-filter]');
        filterInput.value = 'samira';
        filterInput.dispatchEvent(new Event('input', { bubbles: true }));
        const visibleRows = [...recipients.querySelectorAll('[data-admin-broadcasts-recipient-list] > li')].filter((li) => !li.hidden);
        expect(visibleRows).toHaveLength(1);

        const samiraBox = visibleRows[0].querySelector('[data-selection-item]');
        samiraBox.click();
        expect(recipientError.hidden).toBe(true);

        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await flushMicrotasks();

        expect(adapter.publish).toHaveBeenCalledTimes(1);
        expect(adapter.publish.mock.calls[0][0]).toEqual({
            message: 'Direct notice',
            type: 'info',
            banner: false,
            'target-filter': { type: 'specific-users', 'user-ids': [34] }
        });
    });

    it('validates empty message, builds full publish payload, resets the form on success, and supports audience format', async () => {
        const publishCall = deferred();
        const { adapter } = mountScreen({
            adapter: {
                fetchHistory: vi.fn().mockResolvedValue(SAMPLE_SYSTEM_EVENTS),
                fetchUsers: vi.fn().mockResolvedValue(SAMPLE_USERS),
                publish: vi.fn().mockReturnValue(publishCall.promise),
                retract: vi.fn().mockResolvedValue({})
            }
        });
        await flushMicrotasks();

        const form = host.querySelector('[data-admin-broadcasts-form]');
        const titleInput = host.querySelector('[data-admin-broadcasts-input="title"]');
        const messageInput = host.querySelector('[data-admin-broadcasts-input="message"]');
        const audienceSelect = host.querySelector('[data-admin-broadcasts-input="audience"]');
        const bannerInput = host.querySelector('[data-admin-broadcasts-input="banner"]');
        const actionInput = host.querySelector('[data-admin-broadcasts-input="action-url"]');
        const expiresInput = host.querySelector('[data-admin-broadcasts-input="expires"]');
        const publishButton = host.querySelector('[data-admin-broadcasts-action="publish"]');

        // Whitespace-only message fails validation without calling publish.
        messageInput.value = '   ';
        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await flushMicrotasks();
        expect(adapter.publish).not.toHaveBeenCalled();
        expect(messageInput.getAttribute('aria-invalid')).toBe('true');

        // Fill all fields and submit.
        titleInput.value = 'New release';
        messageInput.value = 'Version 2.5 is now live.';
        messageInput.dispatchEvent(new Event('input', { bubbles: true }));
        audienceSelect.value = 'role:admin';
        bannerInput.checked = true;
        actionInput.value = '/changelog';
        expiresInput.value = '2026-12-01T10:00';

        form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await flushMicrotasks();

        expect(publishButton.disabled).toBe(true);
        expect(adapter.publish).toHaveBeenCalledTimes(1);
        const sent = adapter.publish.mock.calls[0][0];
        expect(sent).toMatchObject({
            title: 'New release',
            message: 'Version 2.5 is now live.',
            type: 'info',
            banner: true,
            'action-url': '/changelog',
            'target-filter': { type: 'role', 'role-name': 'admin' }
        });
        expect(sent['deletion-time']).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/);

        publishCall.resolve({ message: 'Published to 12 accounts' });
        await flushMicrotasks();

        expect(publishButton.disabled).toBe(false);
        expect(titleInput.value).toBe('');
        expect(messageInput.value).toBe('');
        expect(bannerInput.checked).toBe(false);
        expect(host.querySelector('[data-admin-broadcasts-compose-status]').textContent).toContain('Published to 12 accounts');
        expect(adapter.fetchHistory).toHaveBeenCalledTimes(2);

        // Verify ToDo-style audience payload format on a second instance.
        const secondHost = document.createElement('div');
        document.body.append(secondHost);
        const secondPublish = vi.fn().mockResolvedValue({ 'recipient-count': 5 });
        const second = attachAdminBroadcasts(secondHost, {
            payloadFormat: 'audience',
            defaultBanner: true,
            showExpires: false,
            location: createNav().location,
            history: createNav().history,
            adapter: {
                fetchHistory: vi.fn().mockResolvedValue(SAMPLE_DIRECT_BROADCASTS),
                publish: secondPublish,
                retract: vi.fn().mockResolvedValue({})
            }
        });
        controllers.push(second);
        await flushMicrotasks();

        expect(secondHost.querySelector('[data-admin-broadcasts-input="expires"]')).toBeNull();
        const msg2 = secondHost.querySelector('[data-admin-broadcasts-input="message"]');
        msg2.value = 'ToDo notice';
        secondHost.querySelector('[data-admin-broadcasts-form]').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await flushMicrotasks();

        expect(secondPublish.mock.calls[0][0]).toEqual({
            message: 'ToDo notice',
            type: 'info',
            audience: 'all',
            banner: true
        });
        secondHost.remove();
    });

    it('renders history, filters via URL hash, pages with Show more, and retracts through inline confirmation', async () => {
        let events = [...SAMPLE_SYSTEM_EVENTS];
        const retract = vi.fn(async (id) => {
            events = [
                {
                    id: 999,
                    'event-type': 'broadcast-retracted',
                    severity: 'info',
                    description: `Retracted ${id}`,
                    'creation-time': '2026-11-24T10:00:00Z',
                    metadata: JSON.stringify({ 'retracted-event-id': id })
                },
                ...events
            ];
            return { message: `Broadcast ${id} retracted` };
        });
        const { nav } = mountScreen({
            adapter: {
                fetchHistory: vi.fn(async () => events),
                fetchUsers: vi.fn().mockResolvedValue(SAMPLE_USERS),
                publish: vi.fn().mockResolvedValue({}),
                retract
            }
        });
        await flushMicrotasks();

        // Both published broadcasts render; #214 is active with Retract button, #210 is Retracted.
        expect(host.querySelectorAll('[data-admin-broadcasts-row]')).toHaveLength(2);
        const activeRow = host.querySelector('[data-admin-broadcasts-row][data-broadcast-id="214"]');
        const retractedRow = host.querySelector('[data-admin-broadcasts-row][data-broadcast-id="210"]');
        expect(activeRow.querySelector('[data-inline-confirm-trigger]')).not.toBeNull();
        expect(retractedRow.querySelector('[data-admin-broadcasts-retracted]').textContent).toBe('Retracted');

        // Filtering persists in URL hash and Clear filters recovers all rows.
        const statusFilter = host.querySelector('[data-admin-broadcasts-filter="status"]');
        statusFilter.value = 'active';
        statusFilter.dispatchEvent(new Event('change', { bubbles: true }));
        expect(host.querySelectorAll('[data-admin-broadcasts-row]')).toHaveLength(1);
        expect(nav.location.hash).toBe('#/broadcasts?status=active');

        const searchFilter = host.querySelector('[data-admin-broadcasts-filter="q"]');
        searchFilter.value = 'no-match-xyz';
        searchFilter.dispatchEvent(new Event('input', { bubbles: true }));
        expect(host.querySelector('[data-admin-broadcasts-empty="filtered"]')).not.toBeNull();

        host.querySelector('[data-admin-broadcasts-action="clear"]').click();
        expect(host.querySelectorAll('[data-admin-broadcasts-row]')).toHaveLength(2);
        expect(nav.location.hash).toBe('#/broadcasts');

        // Retract asks through inline confirmation; Keep cancels without calling adapter.retract.
        const freshActiveRow = host.querySelector('[data-admin-broadcasts-row][data-broadcast-id="214"]');
        const trigger = freshActiveRow.querySelector('[data-inline-confirm-trigger]');
        const question = freshActiveRow.querySelector('[data-inline-confirm]');
        expect(question.hidden).toBe(true);
        trigger.click();
        expect(question.hidden).toBe(false);
        freshActiveRow.querySelector('[data-inline-confirm-answer="no"]').click();
        expect(question.hidden).toBe(true);
        expect(retract).not.toHaveBeenCalled();

        // Confirming Retract calls adapter.retract and refreshes the history row.
        trigger.click();
        freshActiveRow.querySelector('[data-inline-confirm-answer="yes"]').click();
        await flushMicrotasks();

        expect(retract).toHaveBeenCalledTimes(1);
        expect(retract.mock.calls[0][0]).toBe(214);
        expect(host.querySelector('[data-admin-broadcasts-history-status]').textContent).toContain('Broadcast 214 retracted');
        expect(host.querySelector('[data-admin-broadcasts-row][data-broadcast-id="214"] [data-admin-broadcasts-retracted]')).not.toBeNull();
    });

    it('handles empty history, fetch failures with Retry, 401 Sign in, and Show more pagination', async () => {
        const onSignIn = vi.fn();
        let attempt = 0;
        const many = Array.from({ length: 4 }, (_, index) => ({
            id: 100 - index,
            title: `Notice ${index + 1}`,
            message: `Body ${index + 1}`,
            type: 'info',
            audience: 'all',
            banner: false,
            'created-at': '2026-11-24T09:00:00Z',
            status: 'active'
        }));
        mountScreen({
            historyStep: 2,
            onSignIn,
            adapter: {
                fetchHistory: vi.fn(async () => {
                    attempt += 1;
                    if (attempt === 1) {
                        throw new Error('Audit store offline');
                    }
                    if (attempt === 2) {
                        throw Object.assign(new Error('Expired'), { status: 401 });
                    }
                    return many;
                }),
                publish: vi.fn().mockRejectedValue(Object.assign(new Error('Session expired'), { status: 401 })),
                retract: vi.fn().mockResolvedValue({})
            }
        });
        await flushMicrotasks();

        // First fetch fails -> Retry banner shown.
        const retryBtn = host.querySelector('[data-data-loader-action="retry"]');
        expect(retryBtn).not.toBeNull();
        retryBtn.click();
        await flushMicrotasks();

        // Second fetch returns 401 -> Sign in button invokes onSignIn.
        const signInBtn = host.querySelector('[data-data-loader-action="sign-in"]');
        expect(signInBtn).not.toBeNull();
        signInBtn.click();
        expect(onSignIn).toHaveBeenCalledTimes(1);

        // Publish 401 shows compose error banner with Sign in action.
        const messageInput = host.querySelector('[data-admin-broadcasts-input="message"]');
        messageInput.value = 'Retry notice';
        host.querySelector('[data-admin-broadcasts-form]').dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }));
        await flushMicrotasks();
        const composeBanner = host.querySelector('[data-admin-broadcasts-compose-banner]');
        expect(composeBanner.querySelector('[role="alert"]')).not.toBeNull();
        composeBanner.querySelector('button').click();
        expect(onSignIn).toHaveBeenCalledTimes(2);

        // Third fetch succeeds -> shows 2 rows + Show 2 more button.
        await controllers[0].refresh();
        await flushMicrotasks();
        expect(host.querySelectorAll('[data-admin-broadcasts-row]')).toHaveLength(2);
        const moreButton = host.querySelector('[data-admin-broadcasts-action="more"]');
        expect(moreButton.textContent).toContain('Show 2 more');
        moreButton.click();
        expect(host.querySelectorAll('[data-admin-broadcasts-row]')).toHaveLength(4);
        expect(host.querySelector('[data-admin-broadcasts-action="more"]')).toBeNull();
    });

    it('mounts in the admin-console frame, supports injected documents, registers in contract.json, and defines split CSS in shell.css', async () => {
        const win = new Window({ url: 'https://admin.example.test/#/broadcasts' });
        const doc = win.document;
        const created = createAdminBroadcasts(doc, {
            adapter: {
                fetchHistory: vi.fn().mockResolvedValue([]),
                publish: vi.fn().mockResolvedValue({}),
                retract: vi.fn().mockResolvedValue({})
            }
        });
        await flushMicrotasks();
        expect(created.element.ownerDocument).toBe(doc);
        expect(created.element.querySelector('[data-admin-broadcasts-empty="none"]')).not.toBeNull();
        created.destroy();
        win.close();

        const consoleHost = document.createElement('div');
        document.body.append(consoleHost);
        const nav = createNav('#/broadcasts');
        const screen = createAdminBroadcastsScreen({
            adapter: {
                fetchHistory: vi.fn().mockResolvedValue(SAMPLE_SYSTEM_EVENTS),
                fetchUsers: vi.fn().mockResolvedValue(SAMPLE_USERS),
                publish: vi.fn().mockResolvedValue({}),
                retract: vi.fn().mockResolvedValue({})
            }
        });
        const frame = createAdminConsole(consoleHost, {
            title: 'Admin Console',
            location: nav.location,
            history: nav.history,
            screens: [
                screen,
                { name: 'other', title: 'Other', mount: () => {} }
            ]
        });
        frame.showShell();
        await flushMicrotasks();

        expect(consoleHost.querySelector('[data-admin-console-title]').textContent).toBe('Broadcasts');
        expect(consoleHost.querySelector('[data-admin-broadcasts]')).not.toBeNull();
        expect(consoleHost.querySelectorAll('[data-admin-broadcasts-row]')).toHaveLength(2);

        frame.destroy();
        consoleHost.remove();

        const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
        const contract = JSON.parse(readFileSync(resolve(rootDir, 'src/contract.json'), 'utf8'));
        expect(contract.components).toContain('admin-broadcasts');

        const shellCss = readFileSync(resolve(rootDir, 'src/css/shell.css'), 'utf8');
        expect(shellCss).toMatch(/\.app__split\s*\{/);
        expect(shellCss).toMatch(/@media\s*\(width\s*>=\s*64rem\)[\s\S]*\.app__split\s*\{/);
    });
});
