// @vitest-environment happy-dom
// Covers pull-to-refresh in the installed app shell (ADR-0004): the gesture, threshold, indicator, and inactive cases.
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setSpriteUrl } from '../../src/js/icon.js';
import { attachPullRefresh } from '../../src/js/pull-refresh.js';

// Vite rewrites `new URL(path, import.meta.url)` under happy-dom, so the root comes from the file path.
const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

/**
 * A stand-in for the `(display-mode: standalone)` media query list.
 * @param {boolean} matches whether the app runs installed
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

/**
 * Dispatch a touch event with the given finger positions.
 * @param {Element} target touched element
 * @param {string} type touch event type
 * @param {number[]} ys client y of each finger still down
 * @returns {Event} the dispatched event
 */
function touch(target, type, ys = []) {
    const event = new Event(type, { bubbles: true, cancelable: true });
    Object.defineProperty(event, 'touches', { value: ys.map((clientY) => ({ clientY })) });
    target.dispatchEvent(event);
    return event;
}

/**
 * Touch at y 100 and drag down by a distance, in steps, optionally lifting the finger.
 * @param {Element} target touched element
 * @param {number} distance dragged distance in px
 * @param {boolean} [release] lift the finger at the end
 * @returns {Event[]} the move events
 */
function pull(target, distance, release = true) {
    touch(target, 'touchstart', [100]);
    const moves = [1, 2, 3, 4].map((step) => touch(target, 'touchmove', [100 + (distance * step) / 4]));
    if (release) {
        touch(target, 'touchend');
    }
    return moves;
}

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

describe('attachPullRefresh', () => {
    let main;
    let overlays;
    let controller;

    beforeEach(() => {
        setSpriteUrl('icons.svg');
        // The document's shared live regions stay attached between tests, as on a page.
        document.body.insertAdjacentHTML('beforeend', `
            <main class="app__main"><p id="text">Text</p><div id="list"><p id="row">Row</p></div></main>
            <dialog open><p id="in-dialog">Dialog</p></dialog>
            <div class="app__overlays"></div>`);
        main = document.querySelector('.app__main');
        overlays = document.querySelector('.app__overlays');
    });

    afterEach(() => {
        controller?.destroy();
        controller = null;
        for (const element of [...document.body.children].filter((child) => !child.hasAttribute('data-live-region'))) {
            element.remove();
        }
    });

    it('marks the root while installed and adds a hidden decorative indicator with the refresh glyph', () => {
        controller = attachPullRefresh(document.body, { container: overlays, media: fakeMedia(true), onRefresh: () => {} });
        expect(document.documentElement.hasAttribute('data-pull-refresh')).toBe(true);
        const indicator = overlays.querySelector(':scope > div.app__pull-indicator');
        expect(indicator).not.toBeNull();
        expect(indicator.hidden).toBe(true);
        expect(indicator.getAttribute('aria-hidden')).toBe('true');
        expect(indicator.className).toBe('app__pull-indicator');
        expect(indicator.querySelector('svg.icon use').getAttribute('href')).toBe('icons.svg#icon-sync-syncing');
    });

    it('moves the indicator by half the drag, arms it at the threshold, and refreshes once on release', async () => {
        const onRefresh = vi.fn(() => Promise.resolve());
        controller = attachPullRefresh(document.body, { container: overlays, media: fakeMedia(true), onRefresh });
        const indicator = overlays.querySelector('.app__pull-indicator');
        const moves = pull(document.getElementById('text'), 100, false);
        expect(moves.every((event) => event.defaultPrevented)).toBe(true);
        expect(indicator.hidden).toBe(false);
        expect(indicator.dataset.state).toBe('pulling');
        expect(indicator.style.getPropertyValue('--_app-pull-travel')).toBe('50px');
        expect(Number(indicator.style.getPropertyValue('--_app-pull-progress'))).toBeCloseTo(50 / 64);
        touch(main, 'touchstart', [100]);
        touch(main, 'touchmove', [400]);
        expect(indicator.style.getPropertyValue('--_app-pull-travel')).toBe('96px');
        expect(indicator.dataset.state).toBe('armed');
        expect(indicator.style.getPropertyValue('--_app-pull-progress')).toBe('1');
        touch(main, 'touchend');
        expect(onRefresh).toHaveBeenCalledTimes(1);
        expect(indicator.dataset.state).toBe('refreshing');
        expect(indicator.hidden).toBe(false);
        await wait(200);
        expect(indicator.dataset.state).toBe('refreshing');
        await wait(350);
        expect(indicator.hidden).toBe(true);
        expect(onRefresh).toHaveBeenCalledTimes(1);
    });

    it('spins until a slow refresh settles, and ignores pulls meanwhile', async () => {
        let finish;
        const onRefresh = vi.fn(() => new Promise((resolve) => {
            finish = resolve;
        }));
        controller = attachPullRefresh(document.body, { container: overlays, media: fakeMedia(true), onRefresh });
        const indicator = overlays.querySelector('.app__pull-indicator');
        pull(main, 200);
        await wait(500);
        expect(indicator.dataset.state).toBe('refreshing');
        pull(main, 200);
        expect(onRefresh).toHaveBeenCalledTimes(1);
        finish();
        await wait(10);
        expect(indicator.hidden).toBe(true);
    });

    it('announces the refresh through the live region, with a custom label', async () => {
        controller = attachPullRefresh(document.body, { media: fakeMedia(true), onRefresh: () => {}, labels: { refreshing: 'Aktualisieren' } });
        pull(main, 200);
        await wait(150);
        expect(document.querySelector('[data-live-region="polite"]').textContent).toBe('Aktualisieren');
    });

    it('lets a short pull go without refreshing', async () => {
        const onRefresh = vi.fn();
        controller = attachPullRefresh(document.body, { container: overlays, media: fakeMedia(true), onRefresh });
        pull(main, 120);
        expect(overlays.querySelector('.app__pull-indicator').hidden).toBe(true);
        await wait(10);
        expect(onRefresh).not.toHaveBeenCalled();
    });

    it('drops a pull that turns upward, leaving the move to the browser', () => {
        const onRefresh = vi.fn();
        controller = attachPullRefresh(document.body, { media: fakeMedia(true), onRefresh });
        touch(main, 'touchstart', [100]);
        expect(touch(main, 'touchmove', [80]).defaultPrevented).toBe(false);
        expect(touch(main, 'touchmove', [300]).defaultPrevented).toBe(false);
        touch(main, 'touchend');
        expect(onRefresh).not.toHaveBeenCalled();
    });

    it('keeps a pull through a move that returns to the start height', () => {
        const onRefresh = vi.fn();
        controller = attachPullRefresh(document.body, { media: fakeMedia(true), onRefresh });
        touch(main, 'touchstart', [100]);
        touch(main, 'touchmove', [100]);
        touch(main, 'touchmove', [160]);
        touch(main, 'touchmove', [100]);
        expect(touch(main, 'touchmove', [300]).defaultPrevented).toBe(true);
        touch(main, 'touchend');
        expect(onRefresh).toHaveBeenCalledTimes(1);
    });

    it('lets the indicator go when a second finger lands mid-pull', () => {
        const onRefresh = vi.fn();
        controller = attachPullRefresh(document.body, { container: overlays, media: fakeMedia(true), onRefresh });
        const indicator = overlays.querySelector('.app__pull-indicator');
        pull(main, 200, false);
        expect(indicator.hidden).toBe(false);
        touch(main, 'touchstart', [300, 320]);
        expect(indicator.hidden).toBe(true);
        touch(main, 'touchend');
        expect(onRefresh).not.toHaveBeenCalled();
    });

    it('starts a pull on a text node, as WebKit reports touches on text', () => {
        const onRefresh = vi.fn();
        controller = attachPullRefresh(document.body, { media: fakeMedia(true), onRefresh });
        pull(document.getElementById('text').firstChild, 200);
        expect(onRefresh).toHaveBeenCalledTimes(1);
    });

    it('cancels an armed pull when the system takes the touch', () => {
        const onRefresh = vi.fn();
        controller = attachPullRefresh(document.body, { container: overlays, media: fakeMedia(true), onRefresh });
        pull(main, 200, false);
        touch(main, 'touchcancel');
        expect(overlays.querySelector('.app__pull-indicator').hidden).toBe(true);
        expect(onRefresh).not.toHaveBeenCalled();
    });

    it('ignores two-finger touches', () => {
        const onRefresh = vi.fn();
        controller = attachPullRefresh(document.body, { media: fakeMedia(true), onRefresh });
        touch(main, 'touchstart', [100, 120]);
        expect(touch(main, 'touchmove', [300, 320]).defaultPrevented).toBe(false);
        touch(main, 'touchend');
        expect(onRefresh).not.toHaveBeenCalled();
    });

    it('ignores pulls while the page is scrolled down', () => {
        const onRefresh = vi.fn();
        controller = attachPullRefresh(document.body, { media: fakeMedia(true), onRefresh });
        const spy = vi.spyOn(window, 'scrollY', 'get').mockReturnValue(40);
        try {
            const moves = pull(main, 200);
            expect(moves.some((event) => event.defaultPrevented)).toBe(false);
        }
        finally {
            spy.mockRestore();
        }
        expect(onRefresh).not.toHaveBeenCalled();
    });

    it('ignores pulls inside a scrolled container, such as the main area of the main scroll mode', () => {
        const onRefresh = vi.fn();
        controller = attachPullRefresh(document.body, { media: fakeMedia(true), onRefresh });
        Object.defineProperty(document.getElementById('list'), 'scrollTop', { value: 30, configurable: true });
        pull(document.getElementById('row'), 200);
        expect(onRefresh).not.toHaveBeenCalled();
        pull(document.getElementById('text'), 200);
        expect(onRefresh).toHaveBeenCalledTimes(1);
    });

    it('ignores pulls inside an open dialog or popover', () => {
        const onRefresh = vi.fn();
        controller = attachPullRefresh(document.body, { media: fakeMedia(true), onRefresh });
        pull(document.getElementById('in-dialog'), 200);
        const popover = document.createElement('div');
        popover.setAttribute('popover', 'auto');
        popover.innerHTML = '<p id="in-popover">Popover</p>';
        document.body.append(popover);
        vi.spyOn(popover, 'matches').mockImplementation((selector) => selector === ':popover-open');
        pull(document.getElementById('in-popover'), 200);
        expect(onRefresh).not.toHaveBeenCalled();
    });

    it('stays off in a browser tab, and follows a display mode change', () => {
        const onRefresh = vi.fn();
        const media = fakeMedia(false);
        controller = attachPullRefresh(document.body, { media, onRefresh });
        expect(document.documentElement.hasAttribute('data-pull-refresh')).toBe(false);
        const moves = pull(main, 200);
        expect(moves.some((event) => event.defaultPrevented)).toBe(false);
        expect(onRefresh).not.toHaveBeenCalled();
        media.set(true);
        expect(document.documentElement.hasAttribute('data-pull-refresh')).toBe(true);
        pull(main, 200);
        expect(onRefresh).toHaveBeenCalledTimes(1);
        media.set(false);
        expect(document.documentElement.hasAttribute('data-pull-refresh')).toBe(false);
    });

    it('defaults the media to the standalone display mode query', () => {
        const spy = vi.spyOn(window, 'matchMedia').mockReturnValue(fakeMedia(true));
        try {
            controller = attachPullRefresh(document.body, { onRefresh: () => {} });
            expect(spy).toHaveBeenCalledWith('(display-mode: standalone)');
            expect(document.body.querySelector(':scope > .app__pull-indicator')).not.toBeNull();
        }
        finally {
            spy.mockRestore();
        }
    });

    it('removes its listeners, the root attribute, and the indicator on destroy', () => {
        const onRefresh = vi.fn();
        const media = fakeMedia(true);
        controller = attachPullRefresh(document.body, { container: overlays, media, onRefresh });
        controller.destroy();
        controller = null;
        expect(media.count()).toBe(0);
        expect(document.documentElement.hasAttribute('data-pull-refresh')).toBe(false);
        expect(overlays.querySelector('.app__pull-indicator')).toBeNull();
        const moves = pull(main, 200);
        expect(moves.some((event) => event.defaultPrevented)).toBe(false);
        expect(onRefresh).not.toHaveBeenCalled();
    });
});

describe('pull-to-refresh shell styles', () => {
    const css = readFileSync(join(root, 'src', 'css', 'shell.css'), 'utf8');

    /**
     * Return the declarations of the first rule with exactly this selector.
     * @param {string} selector rule selector
     * @returns {string} the rule body
     */
    function rule(selector) {
        const start = css.indexOf(`${selector} {`);
        expect(start, selector).toBeGreaterThanOrEqual(0);
        return css.slice(start, css.indexOf('}', start));
    }

    it('keeps the installed page from its native overscroll reload', () => {
        expect(rule('html[data-pull-refresh]')).toContain('overscroll-behavior-y: contain;');
    });

    it('fixes the round indicator below the top bar, moved and faded by its private properties', () => {
        const body = rule('.app__pull-indicator');
        for (const declaration of ['position: fixed;', 'var(--_app-top-offset)', 'inline-size: var(--target-min);', 'block-size: var(--target-min);',
            'border-radius: var(--radius-round);', 'background-color: var(--color-surface);', 'box-shadow: var(--elevation-1);',
            'opacity: var(--_app-pull-progress, 0);', 'var(--_app-pull-travel, 0px)', 'pointer-events: none;']) {
            expect(body).toContain(declaration);
        }
        expect(rule('.app__pull-indicator[hidden]')).toContain('display: none;');
    });

    it('spins while refreshing, except under reduced motion', () => {
        expect(rule(".app__pull-indicator[data-state='refreshing'] .icon")).toContain('var(--duration-spin)');
        const reduced = css.slice(css.lastIndexOf('@media (prefers-reduced-motion: reduce)'));
        expect(reduced).toMatch(/\.app__pull-indicator\[data-state='refreshing'\] \.icon\s*\{\s*animation: none;/);
    });
});
