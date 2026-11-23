// @vitest-environment happy-dom
// Covers the action registry (ADR-0003, ADR-0004): add/remove/get, enable/disable with reasons, toggle, run, events, click delegation, and RoutedView integration.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    ACTION_ADDED_EVENT,
    ACTION_REMOVED_EVENT,
    ACTION_RUN_EVENT,
    ACTION_STATE_CHANGED_EVENT,
    attachActionRegistry,
    createActionRegistry
} from '../../src/js/action-registry.js';
import { setSpriteUrl } from '../../src/js/icon.js';
import { attachScreenActionBar } from '../../src/js/screen-action-bar.js';
import { RoutedView } from '../../src/js/view.js';

beforeEach(() => {
    setSpriteUrl('icons.svg');
    document.body.innerHTML = '';
});

describe('add, get, and remove', () => {
    it('adds actions with normalized defaults, lists them, and emits action-added', () => {
        const registry = createActionRegistry();
        const added = vi.fn();
        registry.addEventListener(ACTION_ADDED_EVENT, added);

        const saved = registry.addAction({ id: 'save', title: 'Save', description: 'Save draft' });
        const silent = registry.addAction({ id: 'quiet', title: 'Quiet', disabled: true, 'disabled-reason': 'Read only' }, false);

        expect(saved.disabled).toBe(false);
        expect(saved['run-count']).toBe(0);
        expect(registry.getAction('save')).toBe(saved);
        expect(registry.getAction('quiet')).toBe(silent);
        expect(registry.getActions().map((action) => action.id)).toEqual(['save', 'quiet']);
        expect(added).toHaveBeenCalledTimes(1);
        expect(added.mock.calls[0][0].detail.action).toBe(saved);
    });

    it('loads initial actions from either an array or an id-keyed map without emitting', () => {
        const events = new EventTarget();
        const added = vi.fn();
        events.addEventListener(ACTION_ADDED_EVENT, added);

        const fromMap = createActionRegistry({
            events,
            actions: {
                'sign-out': { title: 'Sign Out', disabled: true },
                'navigate-home': { title: 'Home', href: '/' }
            }
        });
        expect(fromMap.getAction('sign-out')).toMatchObject({ id: 'sign-out', title: 'Sign Out', disabled: true, 'run-count': 0 });
        expect(fromMap.getAction('navigate-home')).toMatchObject({ id: 'navigate-home', href: '/', disabled: false });

        const fromArray = createActionRegistry({
            events,
            actions: [{ id: 'refresh', title: 'Refresh' }]
        });
        expect(fromArray.getAction('refresh')).toMatchObject({ id: 'refresh', disabled: false, 'run-count': 0 });
        expect(added).not.toHaveBeenCalled();
    });

    it('rejects invalid action descriptors and duplicate ids', () => {
        const registry = createActionRegistry();
        expect(() => registry.addAction(null)).toThrow();
        expect(() => registry.addAction({})).toThrow();
        expect(() => registry.addAction({ id: '' })).toThrow();

        registry.addAction({ id: 'export', title: 'Export' });
        expect(() => registry.addAction({ id: 'export', title: 'Duplicate' })).toThrow(/already exists/i);
    });

    it('resolves scoped view actions before global actions and removes actions with an event', () => {
        let scope = 'users';
        const registry = createActionRegistry({ getScope: () => scope });
        const removed = vi.fn();
        registry.addEventListener(ACTION_REMOVED_EVENT, removed);

        registry.addAction({ id: 'refresh', title: 'Global refresh' });
        registry.addAction({ id: 'users.refresh', title: 'Users refresh' });

        expect(registry.getAction('refresh').id).toBe('users.refresh');
        expect(registry.getAction('users.refresh').id).toBe('users.refresh');

        scope = 'logs';
        expect(registry.getAction('refresh').id).toBe('refresh');

        expect(registry.removeAction('users.refresh')).toBe(true);
        expect(registry.removeAction('users.refresh')).toBe(false);
        expect(registry.getAction('users.refresh')).toBeUndefined();
        expect(removed).toHaveBeenCalledTimes(1);
        expect(removed.mock.calls[0][0].detail.action.id).toBe('users.refresh');
    });
});

describe('enable, disable with reasons, and toggle', () => {
    it('disables with a reason, updates changed reasons, and skips duplicate state events', () => {
        const registry = createActionRegistry({
            actions: [{ id: 'publish', title: 'Publish', description: 'Publish item' }]
        });
        const changed = vi.fn();
        registry.addEventListener(ACTION_STATE_CHANGED_EVENT, changed);

        expect(registry.isActionEnabled('publish')).toBe(true);
        expect(registry.isActionEnabled('missing')).toBe(false);

        expect(registry.disableAction('publish', 'Fill required fields')).toBe(true);
        expect(registry.isActionEnabled('publish')).toBe(false);
        expect(registry.getAction('publish')['disabled-reason']).toBe('Fill required fields');
        expect(changed).toHaveBeenCalledTimes(1);

        // Same disabled state and same reason emits nothing.
        expect(registry.disableAction('publish', 'Fill required fields')).toBe(false);
        expect(changed).toHaveBeenCalledTimes(1);

        // Changing the disabled reason emits so hints redraw.
        expect(registry.disableAction('publish', 'Offline')).toBe(true);
        expect(registry.getAction('publish')['disabled-reason']).toBe('Offline');
        expect(changed).toHaveBeenCalledTimes(2);

        // Enabling clears the disabled reason and emits once; repeating is a no-op.
        expect(registry.enableAction('publish')).toBe(true);
        expect(registry.isActionEnabled('publish')).toBe(true);
        expect(registry.getAction('publish')['disabled-reason']).toBeUndefined();
        expect(changed).toHaveBeenCalledTimes(3);

        expect(registry.enableAction('publish')).toBe(false);
        expect(changed).toHaveBeenCalledTimes(3);
    });

    it('toggles enabled state, forwards an optional disable reason, and ignores missing actions', () => {
        const registry = createActionRegistry({
            actions: [{ id: 'sync', title: 'Sync' }]
        });
        const changed = vi.fn();
        registry.addEventListener(ACTION_STATE_CHANGED_EVENT, changed);

        expect(registry.toggleAction('sync', 'Paused by user')).toBe(false);
        expect(registry.isActionEnabled('sync')).toBe(false);
        expect(registry.getAction('sync')['disabled-reason']).toBe('Paused by user');

        expect(registry.toggleAction('sync')).toBe(true);
        expect(registry.isActionEnabled('sync')).toBe(true);
        expect(registry.getAction('sync')['disabled-reason']).toBeUndefined();

        expect(registry.toggleAction('missing')).toBe(false);
        expect(changed).toHaveBeenCalledTimes(2);
    });
});

describe('run and href navigation', () => {
    it('runs enabled handler actions, increments run-count, and dispatches action events', () => {
        const handler = vi.fn();
        const byId = vi.fn();
        const anyRun = vi.fn();
        const registry = createActionRegistry({
            actions: [{ id: 'export', title: 'Export', run: handler }]
        });
        registry.addEventListener('export', byId);
        registry.addEventListener(ACTION_RUN_EVENT, anyRun);

        expect(registry.runAction('export', { format: 'json' })).toBe(true);
        expect(handler).toHaveBeenCalledTimes(1);
        expect(handler.mock.calls[0][0]).toEqual({ format: 'json' });
        expect(registry.getAction('export')['run-count']).toBe(1);
        expect(byId).toHaveBeenCalledTimes(1);
        expect(byId.mock.calls[0][0].detail).toMatchObject({ data: { format: 'json' } });
        expect(anyRun).toHaveBeenCalledTimes(1);
        expect(anyRun.mock.calls[0][0].detail.action.id).toBe('export');
    });

    it('routes href actions through onNavigate so routing stays outside the registry', () => {
        const onNavigate = vi.fn();
        const registry = createActionRegistry({
            onNavigate,
            actions: [{ id: 'open-help', title: 'Help', href: '/help' }]
        });

        expect(registry.runAction('open-help', { source: 'menu' })).toBe(true);
        expect(onNavigate).toHaveBeenCalledTimes(1);
        expect(onNavigate.mock.calls[0][0]).toBe('/help');
        expect(onNavigate.mock.calls[0][1].id).toBe('open-help');
        expect(onNavigate.mock.calls[0][2]).toEqual({ source: 'menu' });
        expect(registry.getAction('open-help')['run-count']).toBe(1);
    });

    it('does nothing when running a disabled or unknown action', () => {
        const handler = vi.fn();
        const onNavigate = vi.fn();
        const byId = vi.fn();
        const registry = createActionRegistry({
            onNavigate,
            actions: [
                { id: 'delete', title: 'Delete', disabled: true, 'disabled-reason': 'Locked', run: handler },
                { id: 'admin', title: 'Admin', href: '/admin/', disabled: true, 'disabled-reason': 'Admins only' }
            ]
        });
        registry.addEventListener('delete', byId);

        expect(registry.runAction('delete')).toBe(false);
        expect(registry.runAction('admin')).toBe(false);
        expect(registry.runAction('missing')).toBe(false);
        expect(handler).not.toHaveBeenCalled();
        expect(onNavigate).not.toHaveBeenCalled();
        expect(byId).not.toHaveBeenCalled();
        expect(registry.getAction('delete')['run-count']).toBe(0);
    });
});

describe('click delegation on data-action elements', () => {
    it('runs registered actions from clicks on data-action elements and nested descendants', () => {
        document.body.innerHTML = `
            <div id="app">
                <button type="button" data-action="save" data-item-id="42"><span>Save</span></button>
                <a href="/guide" data-action="guide">Guide</a>
                <a href="/outside" data-action="unknown">Outside</a>
            </div>
        `;
        const root = document.getElementById('app');
        const saveSpy = vi.fn();
        const onNavigate = vi.fn();
        const registry = attachActionRegistry(root, {
            onNavigate,
            actions: [
                { id: 'save', title: 'Save', run: saveSpy },
                { id: 'guide', title: 'Guide', href: '/guide' }
            ]
        });

        // Click nested span inside data-action button.
        const span = root.querySelector('[data-action="save"] span');
        const saveClick = new MouseEvent('click', { bubbles: true, cancelable: true });
        span.dispatchEvent(saveClick);
        expect(saveClick.defaultPrevented).toBe(true);
        expect(saveSpy).toHaveBeenCalledTimes(1);
        expect(saveSpy.mock.calls[0][0]).toEqual({ action: 'save', itemId: '42' });

        // Click href link action with onNavigate prevents default navigation and invokes callback.
        const guideLink = root.querySelector('[data-action="guide"]');
        const guideClick = new MouseEvent('click', { bubbles: true, cancelable: true });
        guideLink.dispatchEvent(guideClick);
        expect(guideClick.defaultPrevented).toBe(true);
        expect(onNavigate).toHaveBeenCalledWith('/guide', expect.objectContaining({ id: 'guide' }), { action: 'guide' });

        // Modified click on an enabled link lets the browser open it natively.
        const newTabClick = new MouseEvent('click', { bubbles: true, cancelable: true, ctrlKey: true });
        guideLink.dispatchEvent(newTabClick);
        expect(newTabClick.defaultPrevented).toBe(false);
        expect(onNavigate).toHaveBeenCalledTimes(1);

        // Unknown data-action is left alone.
        const unknownLink = root.querySelector('[data-action="unknown"]');
        const unknownClick = new MouseEvent('click', { bubbles: true, cancelable: true });
        unknownLink.dispatchEvent(unknownClick);
        expect(unknownClick.defaultPrevented).toBe(false);

        registry.destroy();
    });

    it('blocks clicks on disabled actions and aria-disabled controls without running them', () => {
        document.body.innerHTML = `
            <div id="app">
                <a href="/publish" data-action="publish" aria-disabled="true">Publish</a>
                <button type="button" data-action="archive" aria-disabled="true">Archive</button>
            </div>
        `;
        const root = document.getElementById('app');
        const onNavigate = vi.fn();
        const archiveSpy = vi.fn();
        const registry = attachActionRegistry(root, {
            onNavigate,
            actions: [
                { id: 'publish', title: 'Publish', href: '/publish', disabled: true, 'disabled-reason': 'Draft incomplete' },
                { id: 'archive', title: 'Archive', run: archiveSpy }
            ]
        });

        const publishClick = new MouseEvent('click', { bubbles: true, cancelable: true });
        root.querySelector('[data-action="publish"]').dispatchEvent(publishClick);
        expect(publishClick.defaultPrevented).toBe(true);
        expect(onNavigate).not.toHaveBeenCalled();

        const archiveClick = new MouseEvent('click', { bubbles: true, cancelable: true });
        root.querySelector('[data-action="archive"]').dispatchEvent(archiveClick);
        expect(archiveClick.defaultPrevented).toBe(true);
        expect(archiveSpy).not.toHaveBeenCalled();

        registry.destroy();
    });

    it('stops delegating clicks and firing listeners after destroy', () => {
        document.body.innerHTML = '<div id="app"><button type="button" data-action="ping">Ping</button></div>';
        const root = document.getElementById('app');
        const spy = vi.fn();
        const listener = vi.fn();
        const registry = attachActionRegistry(root, {
            actions: [{ id: 'ping', title: 'Ping', run: spy }]
        });
        registry.addEventListener('ping', listener);

        registry.destroy();
        root.querySelector('[data-action="ping"]').click();
        expect(registry.runAction('ping')).toBe(false);
        expect(spy).not.toHaveBeenCalled();
        expect(listener).not.toHaveBeenCalled();
    });
});

describe('RoutedView, screen-action-bar, and contract integration', () => {
    it('wires a RoutedView to the screen action bar through the registry with live disabled reasons', () => {
        document.body.innerHTML = '<div id="shell" class="app"><main class="app__main"></main><div class="app__overlays" data-screen-action-bar-before></div></div>';
        const shell = document.getElementById('shell');
        const runExport = vi.fn();
        const onNavigate = vi.fn();
        const registry = attachActionRegistry(shell, { onNavigate });
        const app = {
            ...registry
        };
        const bar = attachScreenActionBar(shell, { app });
        app.setScreenActions = bar.setScreenActions;

        class ItemsView extends RoutedView {
            getActions() {
                return [
                    { id: 'items.export', title: 'Export', description: 'Export items', run: runExport },
                    { id: 'items.publish', title: 'Publish', description: 'Publish items', disabled: true, 'disabled-reason': 'Load items first', href: '/publish' }
                ];
            }
        }

        const view = new ItemsView('items', app, 'Items');
        view.attach(shell.querySelector('main'));

        const exportBtn = shell.querySelector('button[data-action="items.export"]');
        const publishLink = shell.querySelector('a[data-action="items.publish"]');
        expect(publishLink.getAttribute('aria-disabled')).toBe('true');
        expect(publishLink.getAttribute('title')).toBe('Load items first');

        exportBtn.click();
        expect(runExport).toHaveBeenCalledTimes(1);

        publishLink.click();
        expect(onNavigate).not.toHaveBeenCalled();

        registry.enableAction('items.publish');
        const enabledLink = shell.querySelector('a[data-action="items.publish"]');
        expect(enabledLink.hasAttribute('aria-disabled')).toBe(false);
        enabledLink.click();
        expect(onNavigate).toHaveBeenCalledWith('/publish', expect.objectContaining({ id: 'items.publish' }), { action: 'items.publish' });

        view.detach();
        expect(registry.getAction('items.export')).toBeUndefined();
        expect(bar.getElement()).toBeNull();
        bar.destroy();
        registry.destroy();
    });

    it('registers action-registry in contract.json', () => {
        const contract = JSON.parse(readFileSync(resolve('src/contract.json'), 'utf8'));
        expect(contract.components).toContain('action-registry');
    });
});
