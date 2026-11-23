// @vitest-environment happy-dom
// Covers the screen action bar renderer (ADR-0003, ADR-0004): buttons, links, disabled states, hints, empty removal, redraw, escaping, and RoutedView integration.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setSpriteUrl } from '../../src/js/icon.js';
import { ACTION_STATE_CHANGED_EVENT, attachScreenActionBar } from '../../src/js/screen-action-bar.js';
import { RoutedView } from '../../src/js/view.js';

/**
 * Create a lightweight app double that stores actions and dispatches state-change events.
 * @param {object[]} [initial] initial action objects
 * @returns {object} app double with `getAction`, `addAction`, `removeAction`, `setDisabled`, and event methods
 */
function makeApp(initial = []) {
    const actions = new Map(initial.map((action) => [action.id, { ...action }]));
    const target = new EventTarget();
    return {
        addAction(action) {
            actions.set(action.id, { disabled: false, ...action });
        },
        removeAction(id) {
            actions.delete(id);
        },
        getAction(id) {
            return actions.get(id);
        },
        setDisabled(id, disabled, reason) {
            const action = actions.get(id);
            if (!action) {
                return;
            }
            action.disabled = disabled;
            if (reason !== undefined) {
                action['disabled-reason'] = reason;
            }
            target.dispatchEvent(new CustomEvent(ACTION_STATE_CHANGED_EVENT, { detail: { action } }));
        },
        addEventListener(type, listener) {
            target.addEventListener(type, listener);
        },
        removeEventListener(type, listener) {
            target.removeEventListener(type, listener);
        }
    };
}

let root;
let overlays;

beforeEach(() => {
    setSpriteUrl('icons.svg');
    document.body.innerHTML = '<div id="shell" class="app"><main class="app__main"></main><div class="app__overlays" data-screen-action-bar-before></div></div>';
    root = document.getElementById('shell');
    overlays = root.querySelector('[data-screen-action-bar-before]');
});

describe('rendering buttons and links', () => {
    it('draws buttons and links in app__action-bar before the hook sibling', () => {
        const app = makeApp([
            { id: 'items.save', title: 'Save', description: 'Save changes' },
            { id: 'items.help', title: 'Help', description: 'Open guide', href: '/help' }
        ]);
        const bar = attachScreenActionBar(root, { app });

        bar.setScreenActions(['items.save', null, '', 'items.missing', 'items.help']);

        const el = bar.getElement();
        expect(el).not.toBeNull();
        expect(el.className).toBe('app__action-bar');
        expect(el.hasAttribute('data-screen-action-bar')).toBe(true);
        expect(el.nextElementSibling).toBe(overlays);

        const [button, link] = [...el.children];
        expect(button.tagName).toBe('BUTTON');
        expect(button.type).toBe('button');
        expect(button.className).toBe('button button--secondary');
        expect(button.dataset.action).toBe('items.save');
        expect(button.hasAttribute('data-screen-action-bar-item')).toBe(true);
        expect(button.textContent).toBe('Save');
        expect(button.disabled).toBe(false);
        expect(button.getAttribute('title')).toBe('Save changes');
        expect(button.getAttribute('aria-description')).toBe('Save changes');

        expect(link.tagName).toBe('A');
        expect(link.className).toBe('button button--secondary');
        expect(link.getAttribute('href')).toBe('/help');
        expect(link.dataset.action).toBe('items.help');
        expect(link.textContent).toBe('Help');
        expect(link.hasAttribute('aria-disabled')).toBe(false);
        expect(link.getAttribute('title')).toBe('Open guide');
        expect(link.getAttribute('aria-description')).toBe('Open guide');
    });

    it('renders direct action objects without an app registry and omits empty hints', () => {
        const bar = attachScreenActionBar(root, { before: overlays });
        bar.setScreenActions([{ id: 'direct.run', title: 'Run' }]);

        const button = bar.getElement().querySelector('[data-screen-action-bar-item]');
        expect(button.tagName).toBe('BUTTON');
        expect(button.textContent).toBe('Run');
        expect(button.hasAttribute('title')).toBe(false);
        expect(button.hasAttribute('aria-description')).toBe(false);
    });
});

describe('disabled state and hints', () => {
    it('sets native disabled on buttons and aria-disabled on links, showing disabled reasons as hints', () => {
        const app = makeApp([
            { id: 'items.publish', title: 'Publish', description: 'Publish now', disabled: true, 'disabled-reason': 'Fill required fields' },
            { id: 'items.export', title: 'Export', description: 'Download report', href: '/export', disabled: true, 'disabled-reason': 'Nothing to export' }
        ]);
        const onAction = vi.fn();
        const bar = attachScreenActionBar(root, { app, onAction });

        bar.setScreenActions(['items.publish', 'items.export']);
        const [button, link] = [...bar.getElement().children];

        expect(button.disabled).toBe(true);
        expect(button.hasAttribute('aria-disabled')).toBe(false);
        expect(button.getAttribute('title')).toBe('Fill required fields');
        expect(button.getAttribute('aria-description')).toBe('Fill required fields');

        expect(link.getAttribute('aria-disabled')).toBe('true');
        expect(link.hasAttribute('disabled')).toBe(false);
        expect(link.getAttribute('title')).toBe('Nothing to export');
        expect(link.getAttribute('aria-description')).toBe('Nothing to export');

        const parentClick = vi.fn();
        root.addEventListener('click', parentClick);
        const click = new MouseEvent('click', { bubbles: true, cancelable: true });
        link.dispatchEvent(click);
        expect(click.defaultPrevented).toBe(true);
        expect(parentClick).not.toHaveBeenCalled();
        expect(onAction).not.toHaveBeenCalled();
    });

    it('falls back to description when a disabled action has no disabled reason and hides stale reasons after re-enabling', () => {
        const app = makeApp([
            { id: 'items.sync', title: 'Sync', description: 'Sync with server', disabled: true }
        ]);
        const bar = attachScreenActionBar(root, { app });
        bar.setScreenActions(['items.sync']);

        expect(bar.getElement().firstElementChild.getAttribute('title')).toBe('Sync with server');

        app.setDisabled('items.sync', true, 'Offline');
        expect(bar.getElement().firstElementChild.getAttribute('title')).toBe('Offline');

        app.setDisabled('items.sync', false);
        const button = bar.getElement().firstElementChild;
        expect(button.disabled).toBe(false);
        expect(button.getAttribute('title')).toBe('Sync with server');
        expect(button.getAttribute('aria-description')).toBe('Sync with server');
    });

    it('calls onAction when an enabled control is clicked', () => {
        const onAction = vi.fn();
        const app = makeApp([{ id: 'items.save', title: 'Save' }]);
        const bar = attachScreenActionBar(root, { app, onAction });
        bar.setScreenActions(['items.save']);

        bar.getElement().firstElementChild.click();
        expect(onAction).toHaveBeenCalledTimes(1);
        expect(onAction.mock.calls[0][0].id).toBe('items.save');
    });
});

describe('removal when empty and redraw on change', () => {
    it('removes the bar when actions become empty and recreates it when actions return', () => {
        const app = makeApp([{ id: 'items.add', title: 'Add' }]);
        const bar = attachScreenActionBar(root, { app });

        bar.setScreenActions([]);
        expect(bar.getElement()).toBeNull();
        expect(root.querySelector('[data-screen-action-bar]')).toBeNull();

        bar.setScreenActions(['items.add']);
        expect(bar.getElement()).not.toBeNull();
        expect(root.querySelectorAll('[data-screen-action-bar]')).toHaveLength(1);

        bar.setScreenActions([]);
        expect(bar.getElement()).toBeNull();
        expect(root.querySelector('[data-screen-action-bar]')).toBeNull();

        bar.setScreenActions(['items.add']);
        expect(bar.getElement().nextElementSibling).toBe(overlays);
    });

    it('adopts an existing data-screen-action-bar element and removes it when cleared', () => {
        const existing = document.createElement('div');
        existing.className = 'app__action-bar';
        existing.setAttribute('data-screen-action-bar', '');
        existing.innerHTML = '<p>Static fallback</p>';
        root.insertBefore(existing, overlays);

        const app = makeApp([{ id: 'items.add', title: 'Add' }]);
        const bar = attachScreenActionBar(root, { app });
        bar.setScreenActions(['items.add']);
        expect(bar.getElement()).toBe(existing);
        expect(existing.children).toHaveLength(1);
        expect(existing.firstElementChild.textContent).toBe('Add');

        bar.setScreenActions([]);
        expect(existing.isConnected).toBe(false);
        expect(bar.getElement()).toBeNull();
    });

    it('redraws when the action state change event fires and preserves focus on the same action', () => {
        const app = makeApp([
            { id: 'items.link', title: 'Open', href: '/open', description: 'Open item', disabled: false }
        ]);
        const bar = attachScreenActionBar(root, { app });
        bar.setScreenActions(['items.link']);

        const firstLink = bar.getElement().firstElementChild;
        firstLink.focus();
        expect(document.activeElement).toBe(firstLink);

        app.setDisabled('items.link', true, 'Locked by another editor');
        const updatedLink = bar.getElement().firstElementChild;
        expect(updatedLink.getAttribute('aria-disabled')).toBe('true');
        expect(updatedLink.getAttribute('title')).toBe('Locked by another editor');
        expect(document.activeElement).toBe(updatedLink);
    });

    it('stops listening and removes the bar on destroy', () => {
        const app = makeApp([{ id: 'items.save', title: 'Save', disabled: false }]);
        const bar = attachScreenActionBar(root, { app });
        bar.setScreenActions(['items.save']);
        expect(bar.getElement()).not.toBeNull();

        bar.destroy();
        expect(bar.getElement()).toBeNull();
        expect(root.querySelector('[data-screen-action-bar]')).toBeNull();

        app.setDisabled('items.save', true, 'Changed after destroy');
        bar.setScreenActions(['items.save']);
        expect(bar.getElement()).toBeNull();
    });
});

describe('escaping and RoutedView integration', () => {
    it('escapes HTML in titles, hints, hrefs, and ids without injecting elements', () => {
        const bar = attachScreenActionBar(root);
        bar.setScreenActions([
            {
                id: 'bad" onclick="alert(1)',
                title: '<img src=x onerror=alert(1)> & "Save"',
                href: '/items?a=1&b="><script>alert(1)</script>',
                disabled: true,
                'disabled-reason': '<b>Blocked</b> & "locked"'
            }
        ]);

        const link = bar.getElement().firstElementChild;
        expect(bar.getElement().querySelector('img, script, b')).toBeNull();
        expect(link.textContent).toBe('<img src=x onerror=alert(1)> & "Save"');
        expect(link.getAttribute('title')).toBe('<b>Blocked</b> & "locked"');
        expect(link.getAttribute('href')).toBe('/items?a=1&b="><script>alert(1)</script>');
        expect(link.dataset.action).toBe('bad" onclick="alert(1)');
    });

    it('shows a RoutedView screen actions on attach and removes the bar on detach', () => {
        const app = makeApp();
        const bar = attachScreenActionBar(root, { app });
        app.setScreenActions = bar.setScreenActions;

        class DemoView extends RoutedView {
            getActions() {
                return [
                    { id: 'demo.save', title: 'Save', description: 'Save record' },
                    { id: 'demo.hidden', title: 'Hidden', 'context-bar': false },
                    { id: 'demo.link', title: 'Guide', href: '/guide' }
                ];
            }
        }

        const host = root.querySelector('main');
        const view = new DemoView('demo', app, 'Demo');
        view.attach(host);

        expect(bar.getElement()).not.toBeNull();
        expect([...bar.getElement().children].map((node) => node.textContent)).toEqual(['Save', 'Guide']);

        view.detach();
        expect(bar.getElement()).toBeNull();
        expect(root.querySelector('[data-screen-action-bar]')).toBeNull();
    });

    it('registers screen-action-bar in contract.json', () => {
        const contract = JSON.parse(readFileSync(resolve('src/contract.json'), 'utf8'));
        expect(contract.components).toContain('screen-action-bar');
    });
});
