// @vitest-environment happy-dom
// Covers the inbox module (ADR-0003, ADR-0004): helpers, row markup per type and read state,
// 99+ unread button, bulk and row action events, escaping, notices store sync, and lifecycle.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setSpriteUrl } from '../../src/js/icon.js';
import { createNotices } from '../../src/js/notices.js';
import {
    INBOX_ACTION_EVENT,
    INBOX_NAVIGATE_EVENT,
    attachInbox,
    attachUnreadButton,
    createInbox,
    createUnreadButton,
    formatInboxSummary,
    formatUnreadCount,
    formatUnreadLabel,
    inboxTypeBadge,
    isUnread
} from '../../src/js/inbox.js';

const SAMPLE_TIME = '2026-11-23T18:00:00Z';

beforeEach(() => {
    setSpriteUrl('icons.svg');
    document.body.innerHTML = '';
});

describe('pure helpers', () => {
    it('detects unread live notifications across kebab-case and camelCase timestamps', () => {
        expect(isUnread({ id: 1 })).toBe(true);
        expect(isUnread({ id: 1, 'read-time': null })).toBe(true);
        expect(isUnread({ id: 1, 'read-time': SAMPLE_TIME })).toBe(false);
        expect(isUnread({ id: 1, readTime: SAMPLE_TIME })).toBe(false);
        expect(isUnread({ id: 1, 'deletion-time': SAMPLE_TIME })).toBe(false);
        expect(isUnread({ id: 1, deletionTime: SAMPLE_TIME })).toBe(false);
        expect(isUnread(null)).toBe(false);
    });

    it('maps notification types onto badge modifier classes', () => {
        expect(inboxTypeBadge('error')).toBe('badge--danger');
        expect(inboxTypeBadge('warning')).toBe('badge--warning');
        expect(inboxTypeBadge('success')).toBe('badge--success');
        expect(inboxTypeBadge('info')).toBe('');
        expect(inboxTypeBadge('custom')).toBe('');
        expect(inboxTypeBadge(undefined)).toBe('');
    });

    it('formats unread counts and accessible button labels capped at 99+', () => {
        expect(formatUnreadCount(0)).toBe('');
        expect(formatUnreadCount(-4)).toBe('');
        expect(formatUnreadCount(Number.NaN)).toBe('');
        expect(formatUnreadCount(1)).toBe('1');
        expect(formatUnreadCount(99)).toBe('99');
        expect(formatUnreadCount(100)).toBe('99+');
        expect(formatUnreadCount(250)).toBe('99+');

        expect(formatUnreadLabel(0)).toBe('Notifications');
        expect(formatUnreadLabel(-2)).toBe('Notifications');
        expect(formatUnreadLabel(1)).toBe('Notifications, 1 unread notification');
        expect(formatUnreadLabel(12)).toBe('Notifications, 12 unread notifications');
        expect(formatUnreadLabel(99)).toBe('Notifications, 99 unread notifications');
        expect(formatUnreadLabel(100)).toBe('Notifications, 99+ unread notifications');
        expect(formatUnreadLabel(420)).toBe('Notifications, 99+ unread notifications');
    });

    it('formats the inbox summary line for unread, all-read, and empty lists', () => {
        expect(formatInboxSummary(0, 0)).toBe('');
        expect(formatInboxSummary(3, 12)).toBe('3 unread · 12 total');
        expect(formatInboxSummary(0, 5)).toBe('5 total');
    });
});

describe('inbox rendering and states', () => {
    it('renders row markup per notification type and read state with chips, badges, and row actions', () => {
        const inbox = createInbox(document, {
            formatTime: () => '2026-11-23 18:00',
            formatRelativeTime: () => '2h ago',
            notifications: [
                {
                    id: 1,
                    type: 'error',
                    title: 'Outage',
                    message: 'Primary relay unreachable.',
                    source: 'system',
                    'creation-time': SAMPLE_TIME,
                    'action-url': '/status'
                },
                {
                    id: 2,
                    type: 'warning',
                    title: 'Storage',
                    message: 'Quota nearly full.',
                    source: 'billing',
                    creationTime: SAMPLE_TIME
                },
                {
                    id: 3,
                    type: 'success',
                    title: 'Export ready',
                    message: 'Your archive finished.',
                    'read-time': SAMPLE_TIME,
                    actionUrl: 'https://example.test/downloads/1',
                    actionLabel: 'Download'
                },
                {
                    id: 4,
                    type: 'info',
                    message: 'Maintenance starts at 22:00.',
                    readTime: SAMPLE_TIME
                }
            ]
        });
        document.body.append(inbox.element);

        const summary = inbox.element.querySelector('[data-inbox-summary]');
        expect(summary.hidden).toBe(false);
        expect(summary.textContent).toBe('2 unread · 4 total');
        expect(inbox.element.querySelector('[data-inbox-empty]').hidden).toBe(true);
        expect(inbox.element.querySelector('[data-inbox-selection]').hidden).toBe(false);
        expect(inbox.element.querySelector('[data-inbox-discard-all]').disabled).toBe(false);

        const rows = [...inbox.element.querySelectorAll('[data-inbox-item]')];
        expect(rows).toHaveLength(4);

        // Row 1: unread error with title, source, time, Open, Mark Read, Discard.
        expect(rows[0].dataset.inboxItem).toBe('1');
        expect(rows[0].dataset.inboxUnread).toBe('true');
        expect(rows[0].classList.contains('inbox__item--unread')).toBe(true);
        expect(rows[0].querySelector('.badge--danger').textContent).toBe('Error');
        expect(rows[0].querySelector('[data-inbox-unread-badge]').textContent).toBe('Unread');
        expect(rows[0].querySelector('[data-inbox-source]').textContent).toBe('system');
        expect(rows[0].querySelector('time').getAttribute('datetime')).toBe(SAMPLE_TIME);
        expect(rows[0].querySelector('time').textContent).toBe('2h ago');
        expect(rows[0].querySelector('time').closest('.chip').getAttribute('title')).toBe('2026-11-23 18:00');
        expect(rows[0].querySelector('[data-inbox-action="open"]').getAttribute('href')).toBe('/status');
        expect(rows[0].querySelector('[data-inbox-action="mark-read"]')).not.toBeNull();
        expect(rows[0].querySelector('[data-inbox-action="discard"]')).not.toBeNull();
        expect(rows[0].querySelector('label [data-selection-item]').value).toBe('1');

        // Row 2: unread warning without action-url.
        expect(rows[1].dataset.inboxUnread).toBe('true');
        expect(rows[1].querySelector('.badge--warning').textContent).toBe('Warning');
        expect(rows[1].querySelector('[data-inbox-action="open"]')).toBeNull();
        expect(rows[1].querySelector('[data-inbox-action="mark-read"]')).not.toBeNull();

        // Row 3: read success omits Unread badge and Mark Read button, keeps custom Open label.
        expect(rows[2].hasAttribute('data-inbox-unread')).toBe(false);
        expect(rows[2].classList.contains('inbox__item--unread')).toBe(false);
        expect(rows[2].querySelector('.badge--success').textContent).toBe('Success');
        expect(rows[2].querySelector('[data-inbox-unread-badge]')).toBeNull();
        expect(rows[2].querySelector('[data-inbox-action="mark-read"]')).toBeNull();
        expect(rows[2].querySelector('[data-inbox-action="open"]').textContent).toBe('Download');

        // Row 4: read info uses neutral badge and handles missing title/source/time.
        expect(rows[3].querySelector('.badge').className).toBe('badge');
        expect(rows[3].querySelector('.badge').textContent).toBe('Info');
        expect(rows[3].querySelector('[data-inbox-source]')).toBeNull();
        expect(rows[3].querySelector('time')).toBeNull();

        inbox.destroy();
    });

    it('switches cleanly between loading, empty, and populated states', () => {
        const inbox = createInbox(document, { loading: true });
        document.body.append(inbox.element);

        expect(inbox.element.querySelector('[data-inbox-loading]').hidden).toBe(false);
        expect(inbox.element.querySelector('[data-inbox-empty]').hidden).toBe(true);
        expect(inbox.element.querySelector('[data-inbox-selection]').hidden).toBe(true);
        expect(inbox.element.querySelector('[data-inbox-discard-all]').disabled).toBe(true);

        inbox.setNotifications([]);
        expect(inbox.element.querySelector('[data-inbox-loading]').hidden).toBe(true);
        expect(inbox.element.querySelector('[data-inbox-empty]').hidden).toBe(false);
        expect(inbox.element.querySelector('[data-inbox-selection]').hidden).toBe(true);
        expect(inbox.element.querySelector('[data-inbox-summary]').hidden).toBe(true);
        expect(inbox.element.querySelector('[data-inbox-discard-all]').disabled).toBe(true);

        inbox.setNotifications([{ id: 7, type: 'info', message: 'Read item', 'read-time': SAMPLE_TIME }]);
        expect(inbox.element.querySelector('[data-inbox-empty]').hidden).toBe(true);
        expect(inbox.element.querySelector('[data-inbox-selection]').hidden).toBe(false);
        expect(inbox.element.querySelector('[data-inbox-summary]').textContent).toBe('1 total');
        expect(inbox.element.querySelector('[data-inbox-discard-all]').disabled).toBe(false);

        inbox.destroy();
    });

    it('escapes untrusted text fields and drops unsafe action URLs', () => {
        const xss = '<img src=x onerror=alert(1)><script>window.pwn=1</script>';
        const inbox = createInbox(document, {
            notifications: [
                {
                    id: '"><svg onload=alert(1)>',
                    type: '<b>weird</b>',
                    title: xss,
                    message: xss,
                    source: xss,
                    'action-url': 'javascript:alert(1)',
                    'action-label': xss
                },
                {
                    id: 2,
                    type: 'info',
                    message: 'Protocol-relative link rejected',
                    'action-url': '//evil.example/phish'
                },
                {
                    id: 3,
                    type: 'info',
                    message: 'Safe link kept',
                    'action-url': '/account',
                    'action-label': '<b>Open</b>'
                }
            ]
        });
        document.body.append(inbox.element);

        expect(inbox.element.querySelectorAll('script, img')).toHaveLength(0);
        const rows = inbox.element.querySelectorAll('[data-inbox-item]');
        expect(rows[0].querySelector('.inbox__title').textContent).toBe(xss);
        expect(rows[0].querySelector('.inbox__message').textContent).toBe(xss);
        expect(rows[0].querySelector('[data-inbox-source]').textContent).toBe(xss);
        expect(rows[0].querySelector('[data-inbox-action="open"]')).toBeNull();
        expect(rows[1].querySelector('[data-inbox-action="open"]')).toBeNull();
        expect(rows[2].querySelector('[data-inbox-action="open"]').textContent).toBe('<b>Open</b>');
        expect(rows[2].querySelector('[data-inbox-action="open"]').getAttribute('href')).toBe('/account');

        inbox.destroy();
    });
});

describe('inbox action and navigation events', () => {
    it('emits bubbling bulk mark-read and discard events via selection.js, skipping already-read items on mark-read', () => {
        const events = [];
        const onAction = vi.fn();
        const inbox = createInbox(document, {
            onAction,
            notifications: [
                { id: 10, type: 'info', title: 'First', message: 'Unread one' },
                { id: 20, type: 'warning', title: 'Second', message: 'Unread two' },
                { id: 30, type: 'success', title: 'Third', message: 'Already read', 'read-time': SAMPLE_TIME }
            ]
        });
        document.body.append(inbox.element);
        document.body.addEventListener(INBOX_ACTION_EVENT, (event) => events.push(event.detail));

        const checkboxes = inbox.element.querySelectorAll('[data-selection-item]');
        checkboxes[0].click();
        checkboxes[2].click();
        expect(inbox.getSelectedIds()).toEqual([10, 30]);

        // Bulk Mark Read skips row 30 because it is already read.
        inbox.element.querySelector('[data-selection-action="mark-read"]').click();
        expect(events).toHaveLength(1);
        expect(events[0]).toMatchObject({ action: 'mark-read', ids: [10], scope: 'bulk' });
        expect(events[0].notifications.map((n) => n.id)).toEqual([10]);
        expect(onAction).toHaveBeenCalledTimes(1);

        // Bulk Discard includes every selected row, read or unread.
        inbox.element.querySelector('[data-selection-action="discard"]').click();
        expect(events).toHaveLength(2);
        expect(events[1]).toMatchObject({ action: 'discard', ids: [10, 30], scope: 'bulk' });

        inbox.clearSelection();
        expect(inbox.getSelectedIds()).toEqual([]);

        inbox.destroy();
    });

    it('emits row mark-read, row discard, discard-all, and same-origin navigate events', () => {
        const actions = [];
        const navCalls = [];
        const navEvents = [];
        const inbox = createInbox(document, {
            onNavigate: (href, context) => navCalls.push({ href, id: context.id }),
            notifications: [
                { id: 1, type: 'info', title: 'Alpha', message: 'Hello', 'action-url': '/help' },
                { id: 2, type: 'warning', title: 'Beta', message: 'World', 'action-url': 'https://example.test/docs' }
            ]
        });
        document.body.append(inbox.element);
        inbox.element.addEventListener(INBOX_ACTION_EVENT, (event) => actions.push(event.detail));
        inbox.element.addEventListener(INBOX_NAVIGATE_EVENT, (event) => navEvents.push(event.detail));

        const rows = inbox.element.querySelectorAll('[data-inbox-item]');
        rows[0].querySelector('[data-inbox-action="mark-read"]').click();
        rows[1].querySelector('[data-inbox-action="discard"]').click();
        inbox.element.querySelector('[data-inbox-discard-all]').click();

        expect(actions.map(({ action, ids, scope }) => ({ action, ids, scope }))).toEqual([
            { action: 'mark-read', ids: [1], scope: 'row' },
            { action: 'discard', ids: [2], scope: 'row' },
            { action: 'discard-all', ids: [1, 2], scope: 'all' }
        ]);

        // Unmodified click on same-origin Open link calls onNavigate and emits inbox:navigate.
        const sameOrigin = rows[0].querySelector('[data-inbox-action="open"]');
        const clickEvent = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
        sameOrigin.dispatchEvent(clickEvent);
        expect(clickEvent.defaultPrevented).toBe(true);
        expect(navCalls).toEqual([{ href: '/help', id: 1 }]);
        expect(navEvents).toEqual([{ href: '/help', id: 1, notification: expect.objectContaining({ id: 1 }) }]);

        // Modified click (Ctrl+click) leaves browser navigation alone.
        const modifiedEvent = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true, button: 0 });
        sameOrigin.dispatchEvent(modifiedEvent);
        expect(modifiedEvent.defaultPrevented).toBe(false);
        expect(navCalls).toHaveLength(1);

        // External https link is not intercepted by SPA onNavigate.
        const externalLink = rows[1].querySelector('[data-inbox-action="open"]');
        const externalEvent = new MouseEvent('click', { bubbles: true, cancelable: true, button: 0 });
        externalLink.dispatchEvent(externalEvent);
        expect(externalEvent.defaultPrevented).toBe(false);
        expect(navCalls).toHaveLength(1);

        inbox.destroy();
    });
});

describe('unread count button and T0290 notices store sync', () => {
    it('updates the badge and accessible name across 0, 1, 99, and 100+ counts and marks current route', () => {
        const button = createUnreadButton(document, { href: '/notifications', count: 0 });
        document.body.append(button.element);
        const badge = button.element.querySelector('[data-inbox-count]');

        expect(button.element.tagName).toBe('A');
        expect(button.element.getAttribute('href')).toBe('/notifications');
        expect(button.element.getAttribute('aria-label')).toBe('Notifications');
        expect(badge.hidden).toBe(true);
        expect(badge.getAttribute('aria-hidden')).toBe('true');

        button.setCount(1);
        expect(button.element.getAttribute('aria-label')).toBe('Notifications, 1 unread notification');
        expect(badge.hidden).toBe(false);
        expect(badge.textContent).toBe('1');

        button.setCount(99);
        expect(button.element.getAttribute('aria-label')).toBe('Notifications, 99 unread notifications');
        expect(badge.textContent).toBe('99');

        button.setCount(125);
        expect(button.element.getAttribute('aria-label')).toBe('Notifications, 99+ unread notifications');
        expect(badge.textContent).toBe('99+');

        button.setRoute('/notifications');
        expect(button.element.getAttribute('aria-current')).toBe('page');
        button.setRoute('/account');
        expect(button.element.hasAttribute('aria-current')).toBe(false);

        button.destroy();
    });

    it('synchronizes both the inbox and the unread button from the T0290 notices store until destroyed', () => {
        const notices = createNotices({ document });
        notices.setInboxNotifications([
            { id: 1, type: 'info', title: 'A', message: 'First' },
            { id: 2, type: 'warning', title: 'B', message: 'Second' },
            { id: 3, type: 'success', title: 'C', message: 'Third', 'read-time': SAMPLE_TIME }
        ]);

        const buttonEl = document.createElement('a');
        buttonEl.className = 'icon-button app__notifications-button';
        buttonEl.href = '/notifications';
        buttonEl.setAttribute('data-inbox-button', '');
        const countEl = document.createElement('span');
        countEl.className = 'badge badge--count app__notifications-count';
        countEl.setAttribute('data-inbox-count', '');
        countEl.setAttribute('aria-hidden', 'true');
        countEl.hidden = true;
        buttonEl.append(countEl);
        document.body.append(buttonEl);

        const unreadBtn = attachUnreadButton(buttonEl, { notices });
        const inbox = createInbox(document, { notices });
        document.body.append(inbox.element);

        expect(unreadBtn.getCount()).toBe(2);
        expect(countEl.textContent).toBe('2');
        expect(buttonEl.getAttribute('aria-label')).toBe('Notifications, 2 unread notifications');
        expect(inbox.element.querySelector('[data-inbox-summary]').textContent).toBe('2 unread · 3 total');

        notices.setInboxNotifications([
            { id: 1, type: 'info', title: 'A', message: 'First', 'read-time': SAMPLE_TIME },
            { id: 2, type: 'warning', title: 'B', message: 'Second', 'read-time': SAMPLE_TIME },
            { id: 3, type: 'success', title: 'C', message: 'Third', 'read-time': SAMPLE_TIME }
        ]);
        expect(unreadBtn.getCount()).toBe(0);
        expect(countEl.hidden).toBe(true);
        expect(buttonEl.getAttribute('aria-label')).toBe('Notifications');
        expect(inbox.element.querySelector('[data-inbox-summary]').textContent).toBe('3 total');

        unreadBtn.destroy();
        inbox.destroy();

        notices.setInboxNotifications([{ id: 4, type: 'error', title: 'D', message: 'After destroy' }]);
        expect(unreadBtn.getCount()).toBe(0);
        expect(inbox.getNotifications()).toHaveLength(3);
        notices.destroy();
    });

    it('attaches to pre-authored server-rendered inbox markup without requiring createInbox', () => {
        document.body.innerHTML = `
            <div class="inbox" data-inbox>
                <p class="view-header__text" data-inbox-summary role="status" hidden></p>
                <p class="loading__status" data-inbox-loading role="status" hidden>Loading…</p>
                <div class="empty-state" data-inbox-empty hidden><h2 class="empty-state__title">Empty</h2></div>
                <fieldset class="selection" data-selection-root data-inbox-selection tabindex="-1" hidden>
                    <legend class="visually-hidden">Notifications</legend>
                    <label class="selection__row"><input class="selection__control" type="checkbox" data-selection-all> Select all</label>
                    <ul class="list row__list inbox__list" role="list" data-inbox-list></ul>
                    <p class="selection__count inbox__count" data-selection-count role="status" aria-live="polite" aria-atomic="true">0 selected</p>
                    <div class="selection__bar" data-selection-bar role="group" aria-label="Bulk actions" hidden>
                        <button class="button button--secondary" type="button" data-selection-action="mark-read">Mark Read</button>
                        <button class="button button--danger" type="button" data-selection-action="discard">Discard</button>
                        <button class="button button--quiet" type="button" data-selection-clear>Clear Selection</button>
                    </div>
                </fieldset>
                <div class="inbox__footer">
                    <button class="button button--secondary button--danger" type="button" data-inbox-discard-all disabled>Discard All</button>
                </div>
            </div>
        `;
        const root = document.querySelector('[data-inbox]');
        const inbox = attachInbox(root, {
            notifications: [{ id: 5, type: 'info', title: 'Authored', message: 'Body' }]
        });
        expect(root.querySelector('[data-inbox-summary]').textContent).toBe('1 unread · 1 total');
        expect(root.querySelectorAll('[data-inbox-item]')).toHaveLength(1);
        inbox.destroy();
    });
});

describe('inbox stylesheets and contract', () => {
    it('defines shell unread button styles and lists inbox in contract.json', () => {
        const contract = JSON.parse(readFileSync(resolve('src/contract.json'), 'utf8'));
        expect(contract.components).toContain('inbox');

        const shell = readFileSync(resolve('src/css/shell.css'), 'utf8');
        expect(shell).toMatch(/\.app__notifications-button\b/);
        expect(shell).toMatch(/\.app__notifications-count\b/);

        const inboxCss = readFileSync(resolve('src/css/components/inbox.css'), 'utf8');
        expect(inboxCss).toMatch(/\.inbox__item--unread\b/);
        expect(inboxCss).toMatch(/\.inbox__select\b/);
        expect(inboxCss).toMatch(/\.inbox__footer\b/);
    });
});
