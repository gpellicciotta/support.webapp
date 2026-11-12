// @vitest-environment happy-dom
// Covers the behavior of todos.webapp src/js/ui/user-menu.js at commit 0cf4981, on the package menu module.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { attachAccountMenu, initialsOf } from '../../src/js/account-menu.js';
import { setSpriteUrl } from '../../src/js/icon.js';
import { installPopoverShim, isShowing } from './popover-shim.js';

/**
 * Dispatch a keyboard event on an element.
 * @param {Element} target element that receives the event
 * @param {string} key key value, such as `Escape`
 * @returns {KeyboardEvent} the dispatched event
 */
function press(target, key) {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
    target.dispatchEvent(event);
    return event;
}

describe('initialsOf', () => {
    it.each([
        ['Alex North', 'AN'],
        ['  ada   lovelace  byron ', 'AB'],
        ['Madonna', 'M'],
        ['ann@example.com', 'A'],
        ['élodie ørsted', 'ÉØ']
    ])('takes the initials of %j', (name, initials) => {
        expect(initialsOf(name)).toBe(initials);
    });

    it('gives no initials for a blank name', () => {
        expect(initialsOf('   ')).toBe('');
    });
});

describe('attachAccountMenu', () => {
    let root;
    let button;
    let menu;
    let controller;

    beforeEach(() => {
        installPopoverShim();
        setSpriteUrl('icons.svg');
        document.body.innerHTML = `
            <div class="account-menu" data-account-menu>
                <button class="account-menu__button" type="button" aria-label="Account"></button>
                <div class="menu account-menu__panel" id="account" role="menu" popover>
                    <p class="account-menu__name" id="account-name" data-account-menu-name aria-hidden="true"></p>
                    <a class="menu__item" role="menuitem" href="#/bin">Recycle bin</a>
                    <a class="menu__item" role="menuitem" href="#/settings">Settings</a>
                    <button class="menu__item" type="button" role="menuitem">Sign out</button>
                </div>
            </div>`;
        root = document.querySelector('[data-account-menu]');
        button = root.querySelector('button');
        menu = root.querySelector('[role="menu"]');
    });

    afterEach(() => {
        controller?.destroy();
        controller = null;
    });

    it('shows the initials of a signed-in account and names the button and the menu after it', () => {
        controller = attachAccountMenu(root, { account: { name: 'Alex North' }, anchor: false });
        const face = button.querySelector('.avatar');
        expect(face.classList.contains('avatar--initials')).toBe(true);
        expect(face.classList.contains('avatar--sm')).toBe(true);
        expect(face.getAttribute('aria-hidden')).toBe('true');
        expect(face.textContent).toBe('AN');
        expect(button.getAttribute('aria-label')).toBe('Alex North');
        expect(button.title).toBe('Alex North');
        expect(root.querySelector('[data-account-menu-name]').textContent).toBe('Alex North');
        expect(menu.getAttribute('aria-labelledby')).toBe('account-name');
        expect(button.getAttribute('aria-haspopup')).toBe('menu');
        expect(button.getAttribute('aria-expanded')).toBe('false');
    });

    it('falls back to the person icon when signed out or when the name has no letters', () => {
        controller = attachAccountMenu(root, { anchor: false });
        const face = button.querySelector('.avatar');
        expect(face.classList.contains('avatar--initials')).toBe(false);
        expect(face.querySelector('use').getAttribute('href')).toBe('icons.svg#icon-user');
        expect(button.getAttribute('aria-label')).toBe('Not signed in');
        controller.setAccount({ name: 'Alex North' });
        expect(button.querySelector('.avatar').textContent).toBe('AN');
        controller.setAccount({ name: ' ' });
        expect(button.querySelector('.avatar use')).not.toBeNull();
        expect(button.getAttribute('aria-label')).toBe('Not signed in');
    });

    it('takes the signed-out label from the options', () => {
        controller = attachAccountMenu(root, { anchor: false, signedOutLabel: 'Local user' });
        expect(button.getAttribute('aria-label')).toBe('Local user');
        expect(root.querySelector('[data-account-menu-name]').textContent).toBe('Local user');
    });

    it('marks the item of the current route and moves the mark when the route changes', () => {
        controller = attachAccountMenu(root, { account: { name: 'Alex North' }, route: '#/settings', anchor: false });
        const [bin, settings] = menu.querySelectorAll('a');
        expect(settings.getAttribute('aria-current')).toBe('page');
        expect(bin.hasAttribute('aria-current')).toBe(false);
        controller.setRoute('#/bin');
        expect(bin.getAttribute('aria-current')).toBe('page');
        expect(settings.hasAttribute('aria-current')).toBe(false);
        controller.setRoute('#/lists');
        expect(menu.querySelector('[aria-current]')).toBeNull();
    });

    it('opens by keyboard at the first item and closes on Escape with focus back on the button', () => {
        controller = attachAccountMenu(root, { account: { name: 'Alex North' }, anchor: false });
        button.focus();
        press(button, 'Enter');
        expect(isShowing(menu)).toBe(true);
        expect(button.getAttribute('aria-expanded')).toBe('true');
        expect(document.activeElement).toBe(menu.querySelector('a'));
        const escape = press(document.activeElement, 'Escape');
        expect(escape.defaultPrevented).toBe(true);
        expect(isShowing(menu)).toBe(false);
        expect(button.getAttribute('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(button);
    });

    it('follows a link chosen by keyboard once, through a click the app can cancel', () => {
        const onSelect = vi.fn((item, event) => event.preventDefault());
        controller = attachAccountMenu(root, { account: { name: 'Alex North' }, anchor: false, onSelect });
        const clicks = vi.fn();
        const settings = menu.querySelectorAll('a')[1];
        settings.addEventListener('click', clicks);
        press(button, 'Enter');
        press(document.activeElement, 'ArrowDown');
        expect(document.activeElement).toBe(settings);
        press(settings, 'Enter');
        expect(clicks).toHaveBeenCalledTimes(1);
        expect(onSelect).toHaveBeenCalledTimes(1);
        expect(onSelect.mock.calls[0][0]).toBe(settings);
        expect(onSelect.mock.calls[0][1].type).toBe('click');
        expect(isShowing(menu)).toBe(false);
    });

    it('reports a button item chosen by keyboard without a click', () => {
        const onSelect = vi.fn();
        controller = attachAccountMenu(root, { account: { name: 'Alex North' }, anchor: false, onSelect });
        press(button, 'ArrowUp');
        const signOut = menu.querySelector('button');
        expect(document.activeElement).toBe(signOut);
        press(signOut, 'Enter');
        expect(onSelect).toHaveBeenCalledTimes(1);
        expect(onSelect.mock.calls[0][1].type).toBe('keydown');
    });

    it('restores the markup on destroy', () => {
        controller = attachAccountMenu(root, { account: { name: 'Alex North' }, route: '#/bin', anchor: false });
        controller.destroy();
        controller = null;
        expect(button.hasAttribute('aria-haspopup')).toBe(false);
        expect(button.hasAttribute('aria-expanded')).toBe(false);
        expect(menu.hasAttribute('aria-labelledby')).toBe(false);
        expect(menu.querySelector('[aria-current]')).toBeNull();
    });
});
