// @vitest-environment happy-dom
// Unit tests for admin-system-events.js: metadata formatting, normalization, adapter query parameters,
// client search, server offset paging, details toggle ARIA state, URL hash persistence, actor lookup,
// empty/error/401 states, admin-console frame integration, and contract entry.
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Window } from 'happy-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { createAdminConsole } from '../../src/js/admin-console.js';
import {
    attachAdminSystemEvents,
    createAdminSystemEvents,
    createAdminSystemEventsScreen,
    DEFAULT_DEBOUNCE_MS,
    DEFAULT_EVENT_LIMIT,
    DEFAULT_EVENT_LIMITS,
    DEFAULT_EVENT_SEVERITIES,
    DEFAULT_EVENT_TYPES,
    filterSystemEvents,
    formatEventTime,
    formatMetadata,
    normalizeSystemEvents
} from '../../src/js/admin-system-events.js';
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
    for (let i = 0; i < 12; i += 1) {
        await Promise.resolve();
    }
}

/**
 * Create an isolated mock location and history pair for URL hash assertions.
 * @param {string} [initialHash] initial `location.hash`, e.g. `'#/system-events'`
 * @returns {{location: {pathname: string, search: string, hash: string}, history: {state: unknown, calls: Array, replaceState: Function}}}
 *   navigation stubs
 */
function createNav(initialHash = '#/system-events') {
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
    { id: 10, email: 'alex@example.test', name: 'Alex North' },
    { id: 20, email: '', name: '  Samira Patel  ' },
    { id: 30, email: '', name: '' }
];

const SAMPLE_EVENTS = [
    {
        id: 101,
        'event-type': 'broadcast-published',
        severity: 'info',
        description: 'Published maintenance notice to all users.',
        'creation-time': '2026-11-24T09:15:30Z',
        'actor-user-id': 10,
        metadata: '{"broadcastId":42,"recipients":120}'
    },
    {
        id: 102,
        'event-type': 'user-locked',
        severity: 'error',
        description: 'Account Morgan Lee locked after repeated failures.',
        'creation-time': '2026-11-24T09:10:00Z',
        'actor-user-id': 20,
        metadata: { attempts: 5, ip: '203.0.113.8' }
    },
    {
        id: 103,
        'event-type': 'session-expired',
        severity: 'warning',
        description: 'Expired idle administrator session.',
        'creation-time': '2026-11-24T09:05:00Z',
        'actor-user-id': null,
        metadata: '{}'
    },
    {
        id: 104,
        'event-type': 'broadcast-retracted',
        severity: 'info',
        description: 'Retracted draft notice before delivery.',
        'creation-time': '2026-11-24T09:00:00Z',
        'actor-user-id': 99,
        metadata: null
    }
];

describe('admin-system-events helpers', () => {
    it('formats JSON strings, objects, non-JSON strings, and empty metadata', () => {
        expect(formatMetadata('{"a":1,"nested":{"b":true}}')).toBe('{\n  "a": 1,\n  "nested": {\n    "b": true\n  }\n}');
        expect(formatMetadata({ count: 3 })).toBe('{\n  "count": 3\n}');
        expect(formatMetadata('  plain text note  ')).toBe('plain text note');
        expect(formatMetadata(null)).toBeNull();
        expect(formatMetadata(undefined)).toBeNull();
        expect(formatMetadata('')).toBeNull();
        expect(formatMetadata('   ')).toBeNull();
        expect(formatMetadata('{}')).toBeNull();
        expect(formatMetadata('null')).toBeNull();
        expect(formatMetadata({})).toBeNull();
    });

    it('formats timestamps and preserves fallbacks', () => {
        expect(formatEventTime(null)).toBe('—');
        expect(formatEventTime('', 'n/a')).toBe('n/a');
        expect(formatEventTime('not-a-date')).toBe('not-a-date');
        expect(formatEventTime(new Date(2026, 10, 24, 9, 5, 3))).toBe('2026-11-24 09:05:03');
    });

    it('normalizes plain arrays and envelope payloads', () => {
        const authRows = normalizeSystemEvents(SAMPLE_EVENTS);
        expect(authRows).toHaveLength(4);
        expect(authRows[0]).toMatchObject({
            id: 101,
            eventType: 'broadcast-published',
            severity: 'info',
            description: 'Published maintenance notice to all users.',
            time: '2026-11-24T09:15:30Z',
            actorUserId: 10,
            actor: null
        });

        const todoRows = normalizeSystemEvents({
            elements: [
                {
                    id: 'evt-9',
                    'event-type': 'database-upgraded',
                    severity: 'WARNING',
                    message: 'Upgraded schema to v14.',
                    timestamp: '2026-11-24T08:00:00Z',
                    actor: 'system',
                    metadata: { from: 13, to: 14 }
                }
            ]
        });
        expect(todoRows).toHaveLength(1);
        expect(todoRows[0]).toMatchObject({
            id: 'evt-9',
            eventType: 'database-upgraded',
            severity: 'warning',
            description: 'Upgraded schema to v14.',
            time: '2026-11-24T08:00:00Z',
            actor: 'system'
        });

        expect(normalizeSystemEvents({ events: [SAMPLE_EVENTS[0]] })).toHaveLength(1);
        expect(normalizeSystemEvents({ 'system-events': [SAMPLE_EVENTS[0]] })).toHaveLength(1);
        expect(normalizeSystemEvents(null)).toEqual([]);
    });

    it('filters loaded events by type, description, actor, id, or custom filterText', () => {
        const events = normalizeSystemEvents(SAMPLE_EVENTS);
        const actorOf = (item) => (item.actorUserId === 10 ? 'alex@example.test' : 'system');

        expect(filterSystemEvents(events, '', { actorOf })).toHaveLength(4);
        expect(filterSystemEvents(events, 'morgan', { actorOf }).map((e) => e.id)).toEqual([102]);
        expect(filterSystemEvents(events, 'ALEX@EXAMPLE', { actorOf }).map((e) => e.id)).toEqual([101]);
        expect(filterSystemEvents(events, 'session-expired', { actorOf }).map((e) => e.id)).toEqual([103]);
        expect(filterSystemEvents(events, '104', { actorOf }).map((e) => e.id)).toEqual([104]);
        expect(filterSystemEvents(events, 'custom', { filterText: (item) => (item.id === 102 ? 'custom' : '') }).map((e) => e.id)).toEqual([102]);
    });

    it('exports expected default constants', () => {
        expect(DEFAULT_EVENT_TYPES).toEqual(['broadcast-published', 'broadcast-retracted']);
        expect(DEFAULT_EVENT_SEVERITIES.map(([value]) => value)).toEqual(['', 'info', 'warning', 'error']);
        expect(DEFAULT_EVENT_LIMITS).toEqual([25, 50, 100, 200]);
        expect(DEFAULT_EVENT_LIMIT).toBe(50);
        expect(DEFAULT_DEBOUNCE_MS).toBe(300);
    });
});

describe('attachAdminSystemEvents and createAdminSystemEvents', () => {
    let host;

    beforeEach(() => {
        setSpriteUrl(SPRITE);
        document.body.replaceChildren();
        host = document.createElement('div');
        document.body.append(host);
    });

    afterEach(() => {
        vi.useRealTimers();
    });

    it('validates required container and adapter.fetchEvents', () => {
        expect(() => attachAdminSystemEvents(null, { adapter: { fetchEvents: async () => [] } })).toThrow(TypeError);
        expect(() => attachAdminSystemEvents(host, {})).toThrow(TypeError);
        expect(() => createAdminSystemEventsScreen({})).toThrow(TypeError);
    });

    it('sends type, severity, limit, and offset to the adapter and persists filters in the URL hash', async () => {
        const nav = createNav('#/system-events?event-type=user-locked&severity=ERROR&limit=25');
        const fetchEvents = vi.fn(async () => SAMPLE_EVENTS.slice(0, 2));
        const fetchUsers = vi.fn(async () => SAMPLE_USERS);

        const controller = attachAdminSystemEvents(host, {
            location: nav.location,
            history: nav.history,
            debounce: 0,
            adapter: { fetchEvents, fetchUsers }
        });
        await flushMicrotasks();

        // Initial fetch receives hydrated server filters and offset 0.
        expect(fetchEvents).toHaveBeenCalledTimes(1);
        const firstCall = fetchEvents.mock.calls[0][0];
        expect(firstCall.eventType).toBe('user-locked');
        expect(firstCall.severity).toBe('error');
        expect(firstCall.limit).toBe(25);
        expect(firstCall.offset).toBe(0);
        expect(firstCall.params.get('event-type')).toBe('user-locked');
        expect(firstCall.params.get('severity')).toBe('error');
        expect(firstCall.params.get('limit')).toBe('25');
        expect(firstCall.params.get('offset')).toBe('0');
        expect(firstCall.signal).toBeInstanceOf(AbortSignal);

        // Unknown valid event-type from URL hash was added to the select and stays selected.
        const typeSelect = host.querySelector('[data-admin-system-events-filter="event-type"]');
        const severitySelect = host.querySelector('[data-admin-system-events-filter="severity"]');
        const limitSelect = host.querySelector('[data-admin-system-events-limit]');
        expect(typeSelect.value).toBe('user-locked');
        expect(severitySelect.value).toBe('error');
        expect(limitSelect.value).toBe('25');

        // Fresh event types returned by the server are merged into the select without duplicates.
        const optionValues = [...typeSelect.options].map((opt) => opt.value);
        expect(optionValues).toContain('broadcast-published');
        expect(optionValues).toContain('user-locked');
        expect(new Set(optionValues).size).toBe(optionValues.length);

        // Changing severity updates hash, resets offset, and queries adapter again.
        severitySelect.value = 'warning';
        severitySelect.dispatchEvent(new Event('change', { bubbles: true }));
        await flushMicrotasks();

        expect(fetchEvents).toHaveBeenCalledTimes(2);
        const secondCall = fetchEvents.mock.calls[1][0];
        expect(secondCall.severity).toBe('warning');
        expect(secondCall.eventType).toBe('user-locked');
        expect(secondCall.offset).toBe(0);
        expect(nav.location.hash).toBe('#/system-events?event-type=user-locked&severity=warning&limit=25');

        // Changing limit to default omits limit from URL hash and queries adapter.
        limitSelect.value = '50';
        limitSelect.dispatchEvent(new Event('change', { bubbles: true }));
        await flushMicrotasks();

        expect(fetchEvents).toHaveBeenCalledTimes(3);
        expect(fetchEvents.mock.calls[2][0].limit).toBe(50);
        expect(nav.location.hash).toBe('#/system-events?event-type=user-locked&severity=warning');

        // fetchUsers was called only once and cached across subsequent loads.
        expect(fetchUsers).toHaveBeenCalledTimes(1);

        controller.destroy();
    });

    it('rejects invalid event-type, severity, and limit values from URL hash', async () => {
        const nav = createNav('#/system-events?event-type=bad%20type!&severity=bogus&limit=999');
        const fetchEvents = vi.fn(async () => []);

        const controller = attachAdminSystemEvents(host, {
            location: nav.location,
            history: nav.history,
            debounce: 0,
            adapter: { fetchEvents }
        });
        await flushMicrotasks();

        const call = fetchEvents.mock.calls[0][0];
        expect(call.eventType).toBe('');
        expect(call.severity).toBe('');
        expect(call.limit).toBe(DEFAULT_EVENT_LIMIT);
        expect(call.params.has('event-type')).toBe(false);
        expect(call.params.has('severity')).toBe(false);

        controller.destroy();
    });

    it('filters loaded rows client-side on search without re-fetching, with debounce and Enter flush', async () => {
        vi.useFakeTimers();
        const nav = createNav('#/system-events');
        const fetchEvents = vi.fn(async () => SAMPLE_EVENTS);
        const fetchUsers = vi.fn(async () => SAMPLE_USERS);

        const controller = attachAdminSystemEvents(host, {
            location: nav.location,
            history: nav.history,
            debounce: 300,
            adapter: { fetchEvents, fetchUsers }
        });
        await flushMicrotasks();

        expect(fetchEvents).toHaveBeenCalledTimes(1);
        expect(host.querySelectorAll('[data-admin-system-events-item]')).toHaveLength(4);

        const searchInput = host.querySelector('[data-admin-system-events-filter="q"]');
        searchInput.value = 'alex@example.test';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));

        // Before debounce fires, all 4 rows remain rendered.
        expect(host.querySelectorAll('[data-admin-system-events-item]')).toHaveLength(4);

        // Pressing Enter flushes immediately without waiting for debounce and without calling adapter.
        searchInput.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true, cancelable: true }));
        expect(fetchEvents).toHaveBeenCalledTimes(1);
        expect(host.querySelectorAll('[data-admin-system-events-item]')).toHaveLength(1);
        expect(host.querySelector('[data-admin-system-events-message]').textContent).toContain('maintenance notice');
        expect(nav.location.hash).toBe('#/system-events?q=alex%40example.test');

        // Typing a second query waits for debounce timer, still zero extra adapter calls.
        searchInput.value = 'morgan';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        vi.advanceTimersByTime(300);
        expect(fetchEvents).toHaveBeenCalledTimes(1);
        expect(host.querySelectorAll('[data-admin-system-events-item]')).toHaveLength(1);
        expect(host.querySelector('[data-admin-system-events-item]').getAttribute('data-severity')).toBe('error');

        controller.destroy();
    });

    it('resolves actors from fetchUsers with graceful fallback on fetchUsers failure', async () => {
        const nav = createNav('#/system-events');
        const controller = attachAdminSystemEvents(host, {
            location: nav.location,
            history: nav.history,
            debounce: 0,
            adapter: {
                fetchEvents: async () => SAMPLE_EVENTS,
                fetchUsers: async () => SAMPLE_USERS
            }
        });
        await flushMicrotasks();

        const actors = [...host.querySelectorAll('[data-admin-system-events-actor]')].map((el) => el.textContent.trim());
        expect(actors).toEqual(['alex@example.test', 'Samira Patel', 'system', 'User #99']);
        controller.destroy();

        // When fetchUsers fails, actors degrade cleanly to User #id and system.
        const secondHost = document.createElement('div');
        document.body.append(secondHost);
        const fallback = attachAdminSystemEvents(secondHost, {
            location: createNav('#/system-events').location,
            history: createNav('#/system-events').history,
            debounce: 0,
            adapter: {
                fetchEvents: async () => SAMPLE_EVENTS,
                fetchUsers: async () => {
                    throw new Error('directory offline');
                }
            }
        });
        await flushMicrotasks();

        const fallbackActors = [...secondHost.querySelectorAll('[data-admin-system-events-actor]')].map((el) => el.textContent.trim());
        expect(fallbackActors).toEqual(['User #10', 'User #20', 'system', 'User #99']);
        fallback.destroy();
    });

    it('pages with server offset, updates pager controls, and restores focus on boundary disable', async () => {
        const nav = createNav('#/system-events');
        const page1 = SAMPLE_EVENTS.slice(0, 2);
        const page2 = SAMPLE_EVENTS.slice(2, 3);
        const fetchEvents = vi.fn(async ({ offset }) => (offset === 0 ? page1 : page2));

        const controller = attachAdminSystemEvents(host, {
            location: nav.location,
            history: nav.history,
            limits: [2, 4],
            defaultLimit: 2,
            debounce: 0,
            adapter: { fetchEvents }
        });
        await flushMicrotasks();

        const pager = host.querySelector('[data-table-state-pager]');
        const pagerText = pager.querySelector('[data-table-state-text]');
        const prevBtn = pager.querySelector('[data-table-state-action="prev"]');
        const nextBtn = pager.querySelector('[data-table-state-action="next"]');

        expect(pager.hidden).toBe(false);
        expect(pagerText.textContent).toBe('Rows 1–2');
        expect(prevBtn.disabled).toBe(true);
        expect(nextBtn.disabled).toBe(false);

        // Click Next -> fetches offset 2, updates pager text, disables Next, and moves focus to Previous.
        nextBtn.focus();
        nextBtn.click();
        await flushMicrotasks();

        expect(fetchEvents).toHaveBeenCalledTimes(2);
        expect(fetchEvents.mock.calls[1][0]).toMatchObject({ limit: 2, offset: 2 });
        expect(pagerText.textContent).toBe('Rows 3–3');
        expect(prevBtn.disabled).toBe(false);
        expect(nextBtn.disabled).toBe(true);
        expect(document.activeElement).toBe(prevBtn);

        // Client search on page 2 filters loaded rows without re-fetching or losing offset.
        const searchInput = host.querySelector('[data-admin-system-events-filter="q"]');
        searchInput.value = 'expired';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        expect(fetchEvents).toHaveBeenCalledTimes(2);
        expect(host.querySelectorAll('[data-admin-system-events-item]')).toHaveLength(1);

        // Clear search before navigating back to page 1 so page 1 rows render and focus moves to Next.
        searchInput.value = '';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        prevBtn.focus();
        prevBtn.click();
        await flushMicrotasks();

        expect(fetchEvents).toHaveBeenCalledTimes(3);
        expect(fetchEvents.mock.calls[2][0]).toMatchObject({ limit: 2, offset: 0 });
        expect(prevBtn.disabled).toBe(true);
        expect(nextBtn.disabled).toBe(false);
        expect(document.activeElement).toBe(nextBtn);

        controller.destroy();
    });

    it('toggles formatted JSON metadata details with correct ARIA state and disables empty toggles', async () => {
        const nav = createNav('#/system-events');
        const controller = attachAdminSystemEvents(host, {
            location: nav.location,
            history: nav.history,
            debounce: 0,
            adapter: { fetchEvents: async () => SAMPLE_EVENTS }
        });
        await flushMicrotasks();

        const items = host.querySelectorAll('[data-admin-system-events-item]');
        expect(items).toHaveLength(4);

        const firstToggle = items[0].querySelector('[data-admin-system-events-toggle]');
        const secondToggle = items[1].querySelector('[data-admin-system-events-toggle]');
        const emptyObjToggle = items[2].querySelector('[data-admin-system-events-toggle]');
        const nullToggle = items[3].querySelector('[data-admin-system-events-toggle]');

        // Toggle lives inside .entry-list__action so CSS chevron rotation applies.
        expect(firstToggle.closest('.entry-list__action')).not.toBeNull();
        expect(firstToggle.disabled).toBe(false);
        expect(firstToggle.getAttribute('aria-expanded')).toBe('false');
        expect(firstToggle.hasAttribute('aria-controls')).toBe(false);
        expect(firstToggle.getAttribute('aria-label')).toBe('Show details of event 101 broadcast-published');
        expect(items[0].querySelector('[data-admin-system-events-details]')).toBeNull();

        // Empty '{}' and null metadata disable their toggles with explanatory title.
        expect(emptyObjToggle.disabled).toBe(true);
        expect(emptyObjToggle.getAttribute('title')).toBe('No metadata');
        expect(nullToggle.disabled).toBe(true);
        expect(nullToggle.getAttribute('title')).toBe('No metadata');

        // Expanding inserts formatted JSON <pre> and links aria-controls + aria-expanded.
        firstToggle.click();
        const details = items[0].querySelector('[data-admin-system-events-details]');
        expect(details).not.toBeNull();
        expect(details.tagName).toBe('PRE');
        expect(details.className).toContain('entry-list__details');
        expect(details.textContent).toBe('{\n  "broadcastId": 42,\n  "recipients": 120\n}');
        expect(firstToggle.getAttribute('aria-expanded')).toBe('true');
        expect(firstToggle.getAttribute('aria-controls')).toBe(details.id);
        expect(firstToggle.getAttribute('aria-label')).toBe('Hide details of event 101 broadcast-published');

        // Expanding a second card keeps unique IDs and does not close the first.
        secondToggle.click();
        const secondDetails = items[1].querySelector('[data-admin-system-events-details]');
        expect(secondDetails).not.toBeNull();
        expect(secondDetails.id).not.toBe(details.id);
        expect(secondDetails.textContent).toBe('{\n  "attempts": 5,\n  "ip": "203.0.113.8"\n}');
        expect(items[0].querySelector('[data-admin-system-events-details]')).not.toBeNull();

        // Collapsing removes the <pre>, clears aria-controls, and resets aria-expanded and aria-label.
        firstToggle.click();
        expect(items[0].querySelector('[data-admin-system-events-details]')).toBeNull();
        expect(firstToggle.getAttribute('aria-expanded')).toBe('false');
        expect(firstToggle.hasAttribute('aria-controls')).toBe(false);
        expect(firstToggle.getAttribute('aria-label')).toBe('Show details of event 101 broadcast-published');

        controller.destroy();
    });

    it('renders unfiltered and filtered empty states and resets filters via Clear filters', async () => {
        const nav = createNav('#/system-events');
        let rows = [];
        const fetchEvents = vi.fn(async () => rows);

        const controller = attachAdminSystemEvents(host, {
            location: nav.location,
            history: nav.history,
            debounce: 0,
            adapter: { fetchEvents }
        });
        await flushMicrotasks();

        // Unfiltered empty response shows plain empty state without Clear filters and hides pager.
        expect(host.querySelector('[data-admin-system-events-empty="none"]')).not.toBeNull();
        expect(host.querySelector('[data-admin-system-events-action="clear"]')).toBeNull();
        expect(host.querySelector('[data-table-state-pager]').hidden).toBe(true);

        // Populate rows and refresh.
        rows = SAMPLE_EVENTS;
        await controller.refresh();
        expect(host.querySelectorAll('[data-admin-system-events-item]')).toHaveLength(4);

        // Unmatched search shows filtered empty state with Clear filters; clicking Clear restores rows without extra fetch.
        const searchInput = host.querySelector('[data-admin-system-events-filter="q"]');
        searchInput.value = 'no-match-xyz';
        searchInput.dispatchEvent(new Event('input', { bubbles: true }));
        expect(host.querySelector('[data-admin-system-events-empty="filtered"]')).not.toBeNull();
        expect(host.querySelector('[data-table-state-pager]').hidden).toBe(true);

        const callsBeforeClear = fetchEvents.mock.calls.length;
        host.querySelector('[data-admin-system-events-action="clear"]').click();
        expect(fetchEvents).toHaveBeenCalledTimes(callsBeforeClear);
        expect(host.querySelectorAll('[data-admin-system-events-item]')).toHaveLength(4);
        expect(nav.location.hash).toBe('#/system-events');

        // When a server filter is active, Clear filters resets it and re-fetches.
        const severitySelect = host.querySelector('[data-admin-system-events-filter="severity"]');
        rows = [];
        severitySelect.value = 'error';
        severitySelect.dispatchEvent(new Event('change', { bubbles: true }));
        await flushMicrotasks();
        expect(host.querySelector('[data-admin-system-events-empty="filtered"]')).not.toBeNull();

        rows = SAMPLE_EVENTS;
        host.querySelector('[data-admin-system-events-action="clear"]').click();
        await flushMicrotasks();
        expect(severitySelect.value).toBe('');
        expect(host.querySelectorAll('[data-admin-system-events-item]')).toHaveLength(4);

        controller.destroy();
    });

    it('handles fetch errors with Retry, 401 with Sign in, newest-wins races, and abort cleanup', async () => {
        const nav = createNav('#/system-events');
        const first = deferred();
        const second = deferred();
        let attempt = 0;
        const onSignIn = vi.fn();

        const controller = attachAdminSystemEvents(host, {
            location: nav.location,
            history: nav.history,
            debounce: 0,
            onSignIn,
            adapter: {
                fetchEvents: ({ signal }) => {
                    attempt += 1;
                    if (attempt === 1) {
                        return first.promise;
                    }
                    if (attempt === 2) {
                        return second.promise;
                    }
                    if (attempt === 3) {
                        return Promise.reject(Object.assign(new Error('Expired'), { status: 401 }));
                    }
                    if (signal?.aborted) {
                        return Promise.reject(new DOMException('Aborted', 'AbortError'));
                    }
                    return Promise.resolve(SAMPLE_EVENTS);
                }
            }
        });

        // Start a second load while the first is still pending: newest wins.
        const refreshPromise = controller.refresh();
        second.reject(new Error('Backend unreachable'));
        await refreshPromise;
        first.resolve(SAMPLE_EVENTS);
        await flushMicrotasks();

        const failedBanner = host.querySelector('[data-data-loader-error="failed"]');
        expect(failedBanner).not.toBeNull();
        expect(host.querySelector('[data-table-state-pager]').hidden).toBe(true);

        // Retry triggers attempt 3 (401 Unauthorized) -> renders Sign in action.
        failedBanner.querySelector('[data-data-loader-action="retry"]').click();
        await flushMicrotasks();

        const authBanner = host.querySelector('[data-data-loader-error="unauthorized"]');
        expect(authBanner).not.toBeNull();
        authBanner.querySelector('[data-data-loader-action="sign-in"]').click();
        expect(onSignIn).toHaveBeenCalledTimes(1);

        // Refresh recovers on attempt 4.
        await controller.refresh();
        expect(host.querySelectorAll('[data-admin-system-events-item]')).toHaveLength(4);

        controller.destroy();
    });

    it('supports createAdminSystemEvents with an injected document and extension hooks', async () => {
        const external = new Window({ url: 'https://example.test/admin/#/system-events' });
        const doc = external.document;
        const controller = createAdminSystemEvents(doc, {
            window: external,
            debounce: 0,
            extraChips: (event, { dom }) => dom.h('span', { class: 'chip', 'data-custom-chip': '' }, `id:${event.id}`),
            adapter: { fetchEvents: async () => SAMPLE_EVENTS.slice(0, 1) }
        });
        await flushMicrotasks();

        expect(controller.element.ownerDocument).toBe(doc);
        expect(controller.element.querySelector('[data-custom-chip]')?.textContent).toBe('id:101');
        expect(controller.getEvents()).toHaveLength(1);
        expect(controller.getFilteredEvents()).toHaveLength(1);
        expect(controller.getState().offset).toBe(0);

        controller.destroy();
        external.close();
    });

    it('mounts in the admin-console frame via createAdminSystemEventsScreen and disposes on route change', async () => {
        const navWindow = new Window({ url: 'https://example.test/admin/#/system-events' });
        try {
            const doc = navWindow.document;
            const signals = [];
            const fetchEvents = vi.fn(async ({ signal }) => {
                signals.push(signal);
                return SAMPLE_EVENTS;
            });

            const frame = createAdminConsole(doc, {
                window: navWindow,
                title: 'Admin Console',
                defaultScreen: 'system-events',
                screens: [
                    createAdminSystemEventsScreen({
                        debounce: 0,
                        adapter: { fetchEvents, fetchUsers: async () => SAMPLE_USERS }
                    }),
                    {
                        name: 'other',
                        title: 'Other',
                        mount: (view, ctx) => ctx.dom.setChildren(view, ctx.dom.h('p', null, 'Other screen'))
                    }
                ]
            });
            doc.body.append(frame.element);
            frame.showShell({ name: 'Alex North' });
            await flushMicrotasks();

            expect(doc.querySelector('[data-admin-console-title]').textContent).toBe('System events');
            expect(doc.querySelector('[data-admin-system-events]')).not.toBeNull();
            expect(doc.querySelectorAll('[data-admin-system-events-item]')).toHaveLength(4);
            expect(signals[0]?.aborted).toBe(false);

            // Navigating away aborts the screen signal and disposes the screen.
            frame.navigate('#/other');
            navWindow.dispatchEvent(new navWindow.Event('hashchange'));
            await flushMicrotasks();
            expect(signals[0]?.aborted).toBe(true);
            expect(doc.querySelector('[data-admin-system-events]')).toBeNull();

            frame.destroy();
        }
        finally {
            await navWindow.happyDOM.close();
        }
    });

    it('declares admin-system-events in src/contract.json', () => {
        const contractPath = resolve(dirname(fileURLToPath(import.meta.url)), '../../src/contract.json');
        const contract = JSON.parse(readFileSync(contractPath, 'utf8'));
        expect(contract.components).toContain('admin-system-events');
    });
});
