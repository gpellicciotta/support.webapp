// @vitest-environment happy-dom
// Covers the notices module (ADR-0003, ADR-0004): routing by type, banner cap, inbox picking, safe URLs, dismissal, overflow deduplication, and lifecycle.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setSpriteUrl } from '../../src/js/icon.js';
import { createToast } from '../../src/js/toast.js';
import {
    NOTIFICATION_ADDED_EVENT,
    NOTIFICATION_DELETED_EVENT,
    NOTIFICATIONS_CLEARED_EVENT,
    NOTIFICATIONS_UPDATED_EVENT,
    attachNotices,
    bannerRole,
    bannerVariant,
    createNotices,
    noticeKind,
    pickBanner,
    safeUrl
} from '../../src/js/notices.js';

const ANY_TIME = '2026-11-16T08:00:00Z';

let bannersEl;
let toastRegionEl;

beforeEach(() => {
    setSpriteUrl('icons.svg');
    document.body.innerHTML = '<div class="app__banners" data-notices-banners></div><div class="toast-region" role="region" aria-label="Notifications"></div>';
    bannersEl = document.querySelector('[data-notices-banners]');
    toastRegionEl = document.querySelector('.toast-region');
});

afterEach(() => {
    vi.useRealTimers();
});

describe('pure helpers', () => {
    it('routes errors and warnings to banners and other types to toasts', () => {
        expect(noticeKind({ type: 'error' })).toBe('banner');
        expect(noticeKind({ type: 'warning' })).toBe('banner');
        expect(noticeKind({ type: 'info' })).toBe('toast');
        expect(noticeKind({ type: 'success' })).toBe('toast');
        expect(noticeKind({})).toBe('toast');
        expect(noticeKind(null)).toBe('toast');
    });

    it('maps notification types onto banner variants and ARIA roles', () => {
        expect(bannerVariant('error')).toBe('banner--danger');
        expect(bannerVariant('warning')).toBe('banner--warning');
        expect(bannerVariant('success')).toBe('banner--success');
        expect(bannerVariant('info')).toBe('');
        expect(bannerVariant(undefined)).toBe('');

        expect(bannerRole('error')).toBe('alert');
        for (const type of ['warning', 'success', 'info', undefined]) {
            expect(bannerRole(type), String(type)).toBe('status');
        }
    });

    it('picks the most severe, then newest, live sticky inbox notification and counts all live ones', () => {
        const inbox = [
            { id: 1, type: 'info', banner: 1, 'creation-time': '2026-11-16T10:00:00Z' },
            { id: 2, type: 'error', banner: true, 'creation-time': '2026-11-16T08:00:00Z' },
            { id: 3, type: 'error', banner: '1', 'creation-time': '2026-11-16T09:00:00Z' },
            { id: 4, type: 'warning', banner: 1, 'creation-time': '2026-11-16T11:00:00Z' },
            { id: 5, type: 'error', banner: 0, 'creation-time': '2026-11-16T12:00:00Z' },
            { id: 6, type: 'error', banner: 1, 'creation-time': '2026-11-16T12:00:00Z', 'deletion-time': ANY_TIME },
            { id: 7, type: 'error', banner: true, creationTime: '2026-11-16T13:00:00Z', deletionTime: ANY_TIME }
        ];
        const picked = pickBanner(inbox);
        expect(picked).not.toBeNull();
        expect(picked.note.id).toBe(3);
        expect(picked.count).toBe(4);

        // Equal severity and creation time break ties by highest ID.
        const tied = pickBanner([
            { id: 10, type: 'warning', banner: true, creationTime: ANY_TIME },
            { id: 14, type: 'warning', banner: true, creationTime: ANY_TIME }
        ]);
        expect(tied.note.id).toBe(14);
        expect(tied.count).toBe(2);

        expect(pickBanner([{ id: 8, type: 'error', banner: 0 }])).toBeNull();
        expect(pickBanner([])).toBeNull();
        expect(pickBanner(undefined)).toBeNull();
    });

    it('accepts only same-origin paths and http(s) URLs in safeUrl', () => {
        expect(safeUrl('/notifications')).toBe('/notifications');
        expect(safeUrl('/help?topic=alerts#top')).toBe('/help?topic=alerts#top');
        expect(safeUrl('https://example.com/status')).toBe('https://example.com/status');
        expect(safeUrl('http://localhost:4173/docs')).toBe('http://localhost:4173/docs');

        for (const bad of ['//evil.example/phish', 'javascript:alert(1)', 'JAVASCRIPT:alert(1)', 'data:text/html,hi', 'relative/path', '#fragment', '', ' /space', null, undefined, 42]) {
            expect(safeUrl(bad), String(bad)).toBeNull();
        }
    });
});

describe('routing, banner cap, and escaping', () => {
    it('routes errors and warnings to banners and info/success notices to toasts', () => {
        const liveRegion = { announce: vi.fn(), destroy: vi.fn() };
        const toaster = createToast({ region: toastRegionEl, liveRegion });
        const notices = attachNotices(bannersEl, { toaster });

        notices.addNotification('Server unreachable.', 'error');
        notices.addNotification('Low disk space.', 'warning');
        notices.addNotification('Draft saved.', 'info');
        notices.addNotification('Export complete.', 'success');

        const banners = [...bannersEl.querySelectorAll('[data-notices-banner]')];
        expect(banners).toHaveLength(2);
        // Newest first: warning then error.
        expect(banners[0].className).toBe('banner banner--warning');
        expect(banners[0].getAttribute('role')).toBe('status');
        expect(banners[0].querySelector('.banner__text').textContent).toBe('Low disk space.');
        expect(banners[1].className).toBe('banner banner--danger');
        expect(banners[1].getAttribute('role')).toBe('alert');
        expect(banners[1].querySelector('.banner__text').textContent).toBe('Server unreachable.');

        const toastTexts = [...toastRegionEl.querySelectorAll('.toast__text')].map((el) => el.textContent);
        expect(toastTexts).toEqual(['Draft saved.', 'Export complete.']);

        notices.destroy();
        toaster.destroy();
    });

    it('caps visible app banners at three and reveals waiting banners as visible ones are dismissed', () => {
        const notices = attachNotices(bannersEl, { toastRegion: toastRegionEl });

        const id1 = notices.addNotification('Error 1', 'error');
        const id2 = notices.addNotification('Warning 2', 'warning');
        const id3 = notices.addNotification('Error 3', 'error');
        const id4 = notices.addNotification('Warning 4', 'warning');

        const texts = () => [...bannersEl.querySelectorAll('[data-notices-banner] .banner__text')].map((el) => el.textContent);
        expect(texts()).toEqual(['Warning 4', 'Error 3', 'Warning 2']);

        // Dismiss the newest visible banner via click; Error 1 moves in.
        bannersEl.querySelector(`[data-notices-id="${id4}"] [data-notices-dismiss]`).click();
        expect(texts()).toEqual(['Error 3', 'Warning 2', 'Error 1']);
        expect(notices.getNotifications().map((n) => n.id)).toEqual([id3, id2, id1]);

        notices.destroy();
    });

    it('renders the most severe sticky inbox banner with View all N alerts, escapes text, and drops unsafe action URLs', () => {
        const onNavigate = vi.fn();
        const notices = attachNotices(bannersEl, { toastRegion: toastRegionEl, inboxHref: '/notifications', onNavigate });

        notices.setInboxNotifications([
            { id: 1, type: 'info', title: 'Heads up', message: 'Minor update', banner: 1, 'creation-time': '2026-11-16T08:00:00Z' },
            {
                id: 2,
                type: 'error',
                title: 'Outage <1>',
                message: 'Use <b>backup</b>',
                banner: true,
                'creation-time': '2026-11-16T09:00:00Z',
                'action-url': '/help',
                'action-label': 'Read <more>'
            },
            { id: 3, type: 'warning', title: 'Bad link', message: 'Ignored', banner: '1', 'creation-time': '2026-11-16T10:00:00Z' }
        ]);

        const banner = bannersEl.querySelector('[data-notices-banner]');
        expect(banner.getAttribute('data-notices-source')).toBe('inbox');
        expect(banner.getAttribute('data-notices-id')).toBe('2');
        expect(banner.className).toBe('banner banner--danger');
        expect(banner.getAttribute('role')).toBe('alert');
        expect(banner.querySelector('b')).toBeNull();
        expect(banner.querySelector('.banner__text').textContent).toBe('Outage <1>: Use <b>backup</b>');

        const allLink = banner.querySelector('[data-notices-all]');
        expect(allLink.className).toBe('link-button');
        expect(allLink.getAttribute('href')).toBe('/notifications');
        expect(allLink.textContent).toBe('View all 3 alerts');

        const actionLink = banner.querySelector('[data-notices-action]');
        expect(actionLink.className).toBe('button button--quiet');
        expect(actionLink.getAttribute('href')).toBe('/help');
        expect(actionLink.textContent).toBe('Read <more>');

        allLink.click();
        actionLink.click();
        expect(onNavigate).toHaveBeenCalledTimes(2);
        expect(onNavigate.mock.calls[0][0]).toBe('/notifications');
        expect(onNavigate.mock.calls[1][0]).toBe('/help');

        // Unsafe URLs are omitted completely, and a single sticky alert omits View all.
        notices.setInboxNotifications([
            { id: 11, type: 'warning', message: 'Check link', banner: 1, 'action-url': 'javascript:alert(1)', 'action-label': 'Go' }
        ]);
        const single = bannersEl.querySelector('[data-notices-banner]');
        expect(single.querySelector('[data-notices-all]')).toBeNull();
        expect(single.querySelector('[data-notices-action]')).toBeNull();

        notices.destroy();
    });

    it('hides inbox banners while signed out and shows them once signed in', () => {
        let signedIn = false;
        const notices = attachNotices(bannersEl, { toastRegion: toastRegionEl, isSignedIn: () => signedIn });

        notices.setInboxNotifications([{ id: 5, type: 'warning', message: 'Maintenance', banner: true }]);
        expect(bannersEl.querySelectorAll('[data-notices-banner]')).toHaveLength(0);

        signedIn = true;
        notices.update();
        expect(bannersEl.querySelectorAll('[data-notices-banner]')).toHaveLength(1);

        notices.destroy();
    });
});

describe('dismissal, callbacks, and store events', () => {
    it('deletes an app notification when its toast expires or is dismissed, and dismisses the toast when deleted in code', () => {
        vi.useFakeTimers();
        const liveRegion = { announce: vi.fn(), destroy: vi.fn() };
        const toaster = createToast({ region: toastRegionEl, liveRegion, duration: 1000 });
        const notices = attachNotices(bannersEl, { toaster });
        const deleted = vi.fn();
        notices.addEventListener(NOTIFICATION_DELETED_EVENT, deleted);

        const id1 = notices.addNotification('Saved.', 'info');
        expect(toastRegionEl.querySelectorAll('.toast')).toHaveLength(1);

        vi.advanceTimersByTime(1000);
        expect(toastRegionEl.querySelectorAll('.toast')).toHaveLength(0);
        expect(notices.getNotifications()).toEqual([]);
        expect(deleted).toHaveBeenCalledTimes(1);
        expect(deleted.mock.calls[0][0].detail.notification.id).toBe(id1);

        const id2 = notices.addNotification('Syncing...', 'info');
        expect(toastRegionEl.querySelectorAll('.toast')).toHaveLength(1);
        expect(notices.deleteNotification(id2)).toBe(true);
        expect(notices.deleteNotification(id2)).toBe(false);
        expect(toastRegionEl.querySelectorAll('.toast')).toHaveLength(0);

        notices.destroy();
        toaster.destroy();
    });

    it('routes inbox banner dismissal through onDiscardInbox and refreshes when loadInbox is provided', async () => {
        const discarded = [];
        let inbox = [{ id: 21, type: 'warning', title: 'Maintenance', message: 'Saturday', banner: 1, 'creation-time': ANY_TIME }];
        const loadInbox = vi.fn(async () => inbox);
        const onDiscardInbox = vi.fn(async (id) => {
            discarded.push(id);
            inbox = [];
        });
        const notices = attachNotices(bannersEl, { toastRegion: toastRegionEl, onDiscardInbox, loadInbox });

        await notices.refreshInbox();
        expect(bannersEl.querySelectorAll('[data-notices-banner]')).toHaveLength(1);

        await notices.dismissBanner(21, 'inbox');
        expect(discarded).toEqual([21]);
        expect(onDiscardInbox).toHaveBeenCalledWith(21, expect.objectContaining({ id: 21 }));
        expect(loadInbox).toHaveBeenCalledTimes(2);
        expect(bannersEl.querySelectorAll('[data-notices-banner]')).toHaveLength(0);

        notices.destroy();
    });

    it('does not show a toast twice when pushing out an older toast triggers a nested update', () => {
        const liveRegion = { announce: vi.fn(), destroy: vi.fn() };
        const toaster = createToast({ region: toastRegionEl, liveRegion, max: 3 });
        const notices = attachNotices(bannersEl, { toaster });

        const id1 = notices.addNotification('First', 'info');
        notices.addNotification('Second', 'info');
        notices.addNotification('Third', 'info');
        notices.addNotification('Fourth', 'info');

        const visible = [...toastRegionEl.querySelectorAll('.toast__text')].map((el) => el.textContent);
        expect(visible).toEqual(['Second', 'Third', 'Fourth']);
        expect(notices.getNotifications().some((n) => n.id === id1)).toBe(false);
        expect(notices.getNotifications().map((n) => n.note)).toEqual(['Fourth', 'Third', 'Second']);

        notices.destroy();
        toaster.destroy();
    });

    it('supports persistent action toasts, download actions, clearNotifications, and inbox update deduplication', async () => {
        const liveRegion = { announce: vi.fn(), destroy: vi.fn() };
        const toaster = createToast({ region: toastRegionEl, liveRegion });
        const notices = attachNotices(bannersEl, { toaster });
        const added = vi.fn();
        const cleared = vi.fn();
        const updated = vi.fn();
        notices.addEventListener(NOTIFICATION_ADDED_EVENT, added);
        notices.addEventListener(NOTIFICATIONS_CLEARED_EVENT, cleared);
        notices.addEventListener(NOTIFICATIONS_UPDATED_EVENT, updated);

        const onClick = vi.fn();
        notices.addNotification('Update ready.', 'info', { action: { label: 'Reload', onClick } });
        const actionBtn = toastRegionEl.querySelector('[data-toast-action]');
        expect(actionBtn.textContent).toBe('Reload');
        expect(actionBtn.dataset.toastAction).toBe('other');
        actionBtn.click();
        expect(onClick).toHaveBeenCalledTimes(1);
        expect(notices.getNotifications()).toEqual([]);

        notices.addNotification('First error', 'error');
        notices.addNotification('Info note', 'info');
        expect(added).toHaveBeenCalledTimes(3);
        notices.clearNotifications();
        expect(cleared).toHaveBeenCalledTimes(1);
        expect(bannersEl.querySelectorAll('[data-notices-banner]')).toHaveLength(0);
        expect(toastRegionEl.querySelectorAll('.toast')).toHaveLength(0);

        const items = [{ id: 1, type: 'info', message: 'Unread', banner: 0, 'read-time': null }];
        notices.setInboxNotifications(items);
        notices.setInboxNotifications([{ ...items[0] }]);
        expect(updated).toHaveBeenCalledTimes(1);
        expect(notices.getUnreadCount()).toBe(1);

        notices.destroy();
        toaster.destroy();
    });

    it('supports store creation before attach and cleans up on detach and destroy', () => {
        const notices = createNotices();
        notices.addNotification('Queued error', 'error');
        expect(bannersEl.querySelectorAll('[data-notices-banner]')).toHaveLength(0);

        notices.attach(bannersEl, toastRegionEl);
        expect(bannersEl.querySelectorAll('[data-notices-banner]')).toHaveLength(1);

        notices.detach();
        notices.addNotification('After detach', 'error');
        expect(bannersEl.querySelectorAll('[data-notices-banner]')).toHaveLength(1);

        notices.destroy();
        expect(notices.getNotifications()).toEqual([]);
    });

    it('rejects invalid inputs to addNotification and deleteNotification', () => {
        const notices = createNotices();
        expect(() => notices.addNotification('')).toThrow(TypeError);
        expect(() => notices.addNotification(null)).toThrow(TypeError);
        expect(() => notices.deleteNotification(null)).toThrow(TypeError);
        expect(() => notices.deleteNotification({})).toThrow(TypeError);
        notices.destroy();
    });
});

describe('contract and naming compliance', () => {
    it('registers notices in contract.json and uses data-notices-* hooks without style-class selectors', () => {
        const contract = JSON.parse(readFileSync(resolve('src/contract.json'), 'utf8'));
        expect(contract.components).toContain('notices');

        const source = readFileSync(resolve('src/js/notices.js'), 'utf8');
        expect(source).toContain('data-notices-dismiss');
        expect(source).not.toMatch(/querySelector(?:All)?\([^)]*\.[a-z]/);
        expect(source).not.toMatch(/\.closest\([^)]*\.[a-z]/);
    });
});
