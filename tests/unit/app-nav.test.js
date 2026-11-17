// @vitest-environment happy-dom
// Covers the navigation toggle of the app shell (ADR-0004): wide open, rail, and hidden states, and the narrow drawer.
import { afterEach, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { attachAppNav } from '../../src/js/app-nav.js';
import { installPopoverShim, isShowing, lightDismiss, nextTask } from './popover-shim.js';

/**
 * A stand-in for the `(width >= 64rem)` media query list.
 * @param {boolean} matches whether the wide layout applies
 * @returns {{matches: boolean, set: (value: boolean) => void, addEventListener: Function, removeEventListener: Function, count: () => number}}
 *   the fake list
 */
function fakeMedia(matches) {
    const listeners = new Set();
    return {
        matches,
        set(value) {
            this.matches = value;
            for (const listener of listeners) {
                listener({ matches: value });
            }
        },
        addEventListener: (type, listener) => listeners.add(listener),
        removeEventListener: (type, listener) => listeners.delete(listener),
        count: () => listeners.size
    };
}

describe('attachAppNav', () => {
    let toggle;
    let sidebar;
    let controller;

    beforeAll(() => {
        installPopoverShim();
    });

    beforeEach(() => {
        document.body.innerHTML = `
            <header class="app__top-bar">
                <button class="app__nav-toggle icon-button" type="button" popovertarget="app-nav" aria-controls="app-nav" aria-expanded="true" aria-label="Navigation">menu</button>
                <a class="app__brand" href="#main">Brand</a>
                <button type="button" id="other">Other</button>
            </header>
            <nav class="app__sidebar" id="app-nav" aria-label="Main" popover>
                <ul class="app__nav-list">
                    <li><a class="app__nav-item" href="#one">One</a></li>
                    <li><a class="app__nav-item" href="#two" aria-current="page">Two</a></li>
                </ul>
            </nav>
            <main id="main" tabindex="-1">Main</main>`;
        toggle = document.querySelector('.app__nav-toggle');
        sidebar = document.getElementById('app-nav');
    });

    afterEach(() => {
        controller?.destroy();
        controller = null;
        if (isShowing(sidebar)) {
            lightDismiss(sidebar);
        }
    });

    describe('on wide screens', () => {
        it('starts open, with an accurate state and label', () => {
            controller = attachAppNav(toggle, sidebar, { media: fakeMedia(true) });
            expect(controller.state()).toBe('open');
            expect(toggle.getAttribute('aria-expanded')).toBe('true');
            expect(toggle.getAttribute('aria-label')).toBe('Collapse navigation');
            expect(sidebar.hidden).toBe(false);
        });

        it('starts in the state the markup declares', () => {
            toggle.setAttribute('aria-expanded', 'false');
            controller = attachAppNav(toggle, sidebar, { media: fakeMedia(true) });
            expect(controller.state()).toBe('rail');
            controller.destroy();
            sidebar.hidden = true;
            controller = attachAppNav(toggle, sidebar, { media: fakeMedia(true) });
            expect(controller.state()).toBe('hidden');
        });

        it('cycles open, rail, and hidden on each click and keeps the drawer closed', () => {
            const changes = [];
            controller = attachAppNav(toggle, sidebar, { media: fakeMedia(true), onChange: (state) => changes.push(state) });
            const seen = [];
            for (let index = 0; index < 3; index += 1) {
                const event = new MouseEvent('click', { bubbles: true, cancelable: true });
                toggle.dispatchEvent(event);
                expect(event.defaultPrevented).toBe(true);
                seen.push([controller.state(), toggle.getAttribute('aria-expanded'), toggle.getAttribute('aria-label'), sidebar.hidden]);
            }
            expect(seen).toEqual([
                ['rail', 'false', 'Hide navigation', false],
                ['hidden', 'false', 'Show navigation', true],
                ['open', 'true', 'Collapse navigation', false]
            ]);
            expect(changes).toEqual(['rail', 'hidden', 'open']);
            expect(isShowing(sidebar)).toBe(false);
        });

        it('sets a state directly and rejects unknown states', () => {
            controller = attachAppNav(toggle, sidebar, { media: fakeMedia(true) });
            controller.setState('hidden');
            expect(sidebar.hidden).toBe(true);
            expect(() => controller.setState('wide')).toThrow(/open, rail, or hidden/);
        });

        it('uses caller labels', () => {
            const labels = { collapse: 'Réduire', hide: 'Masquer', show: 'Afficher', open: 'Ouvrir', close: 'Fermer' };
            controller = attachAppNav(toggle, sidebar, { media: fakeMedia(true), labels });
            expect(toggle.getAttribute('aria-label')).toBe('Réduire');
            toggle.click();
            expect(toggle.getAttribute('aria-label')).toBe('Masquer');
        });
    });

    describe('on narrow screens', () => {
        it('starts with the drawer closed, even when the markup says expanded', () => {
            controller = attachAppNav(toggle, sidebar, { media: fakeMedia(false) });
            expect(toggle.getAttribute('aria-expanded')).toBe('false');
            expect(toggle.getAttribute('aria-label')).toBe('Open navigation');
            expect(isShowing(sidebar)).toBe(false);
        });

        it('opens the drawer and focuses the current entry, then closes it and returns focus', async () => {
            controller = attachAppNav(toggle, sidebar, { media: fakeMedia(false) });
            toggle.focus();
            const event = new MouseEvent('click', { bubbles: true, cancelable: true });
            toggle.dispatchEvent(event);
            expect(event.defaultPrevented).toBe(true);
            expect(isShowing(sidebar)).toBe(true);
            expect(controller.isDrawerOpen()).toBe(true);
            expect(toggle.getAttribute('aria-expanded')).toBe('true');
            expect(toggle.getAttribute('aria-label')).toBe('Close navigation');
            expect(document.activeElement).toBe(sidebar.querySelector('[aria-current="page"]'));
            toggle.click();
            expect(isShowing(sidebar)).toBe(false);
            expect(toggle.getAttribute('aria-expanded')).toBe('false');
            expect(document.activeElement).toBe(toggle);
            await nextTask();
            expect(controller.state()).toBe('open');
        });

        it('closes on Escape and returns focus to the toggle', () => {
            controller = attachAppNav(toggle, sidebar, { media: fakeMedia(false) });
            toggle.click();
            const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
            document.activeElement.dispatchEvent(event);
            expect(event.defaultPrevented).toBe(true);
            expect(isShowing(sidebar)).toBe(false);
            expect(document.activeElement).toBe(toggle);
        });

        it('follows a light dismiss without taking focus from the clicked control', async () => {
            controller = attachAppNav(toggle, sidebar, { media: fakeMedia(false) });
            toggle.click();
            const other = document.getElementById('other');
            other.focus();
            lightDismiss(sidebar);
            await nextTask();
            expect(controller.isDrawerOpen()).toBe(false);
            expect(toggle.getAttribute('aria-expanded')).toBe('false');
            expect(document.activeElement).toBe(other);
        });

        it('returns focus to the toggle after a light dismiss that left focus inside the drawer', async () => {
            controller = attachAppNav(toggle, sidebar, { media: fakeMedia(false) });
            toggle.click();
            lightDismiss(sidebar);
            await nextTask();
            expect(document.activeElement).toBe(toggle);
        });

        it('closes after a navigation link is followed, leaving focus to the link target', async () => {
            controller = attachAppNav(toggle, sidebar, { media: fakeMedia(false) });
            toggle.click();
            const link = sidebar.querySelector('a[href="#one"]');
            link.addEventListener('click', (event) => event.preventDefault());
            link.click();
            expect(isShowing(sidebar)).toBe(false);
            expect(toggle.getAttribute('aria-expanded')).toBe('false');
            await nextTask();
            expect(document.activeElement).not.toBe(toggle);
        });

        it('shows a sidebar hidden on wide screens, and hides it again when the layout widens', () => {
            const media = fakeMedia(true);
            controller = attachAppNav(toggle, sidebar, { media });
            controller.setState('hidden');
            media.set(false);
            expect(sidebar.hidden).toBe(false);
            toggle.click();
            expect(isShowing(sidebar)).toBe(true);
            media.set(true);
            expect(isShowing(sidebar)).toBe(false);
            expect(sidebar.hidden).toBe(true);
            expect(toggle.getAttribute('aria-expanded')).toBe('false');
            expect(toggle.getAttribute('aria-label')).toBe('Show navigation');
        });
    });

    it('stops listening on destroy', () => {
        const media = fakeMedia(true);
        controller = attachAppNav(toggle, sidebar, { media });
        expect(media.count()).toBe(1);
        controller.destroy();
        controller = null;
        expect(media.count()).toBe(0);
        toggle.click();
        expect(sidebar.hidden).toBe(false);
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
    });
});
