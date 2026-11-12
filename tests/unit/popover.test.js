// @vitest-environment happy-dom
// Ported from todos.webapp tests/unit/menu.test.js at commit 0cf4981.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { anchorPanel } from '../../src/js/anchor.js';
import { attachPopover } from '../../src/js/popover.js';

/**
 * Dispatch a keyboard event on an element.
 * @param {Element} target element that receives the event
 * @param {string} key key value, such as `ArrowDown`
 * @param {object} [init] extra event fields, such as `shiftKey`
 * @returns {KeyboardEvent} the dispatched event
 */
function press(target, key, init = {}) {
    const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true, ...init });
    target.dispatchEvent(event);
    return event;
}

/**
 * Dispatch a bubbling click on an element.
 * @param {Element} target element that receives the click
 */
function click(target) {
    target.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }));
}

describe('attachPopover', () => {
    let trigger;
    let panel;
    let onClose;
    let controller;

    beforeEach(() => {
        document.body.innerHTML = `
            <button id="trigger" type="button">Status</button>
            <div id="panel" class="popover" role="group">
                <label><input id="first" type="checkbox"> To do</label>
                <button id="clear" type="button">Clear</button>
            </div>
            <p id="text">Plain text</p>`;
        trigger = document.getElementById('trigger');
        panel = document.getElementById('panel');
        onClose = vi.fn();
        trigger.focus();
        controller = attachPopover(trigger, panel, { onClose, anchor: false });
    });

    afterEach(() => {
        controller.destroy();
    });

    it('opens on a trigger click and focuses the first control', () => {
        expect(panel.hidden).toBe(true);
        click(trigger);
        expect(panel.hidden).toBe(false);
        expect(trigger.getAttribute('aria-expanded')).toBe('true');
        expect(document.activeElement).toBe(document.getElementById('first'));
    });

    it('stays open on clicks inside the panel', () => {
        click(trigger);
        click(document.getElementById('clear'));
        expect(controller.isOpen()).toBe(true);
    });

    it('closes on Escape and returns focus to the trigger', () => {
        click(trigger);
        press(document.getElementById('first'), 'Escape');
        expect(panel.hidden).toBe(true);
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(trigger);
        expect(onClose).toHaveBeenCalledWith('escape');
    });

    it('closes on an outside click and returns focus to the trigger', () => {
        click(trigger);
        document.activeElement.blur();
        click(document.getElementById('text'));
        expect(panel.hidden).toBe(true);
        expect(document.activeElement).toBe(trigger);
        expect(onClose).toHaveBeenCalledWith('outside');
    });

    it('links the trigger to the panel and toggles on trigger clicks', () => {
        expect(trigger.getAttribute('aria-controls')).toBe('panel');
        click(trigger);
        click(trigger);
        expect(panel.hidden).toBe(true);
        expect(onClose).toHaveBeenCalledWith('toggle');
    });

    it('closes without moving focus when focus leaves the panel and its trigger', () => {
        click(trigger);
        const text = document.getElementById('text');
        text.tabIndex = 0;
        panel.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: text }));
        text.focus();
        expect(panel.hidden).toBe(true);
        expect(document.activeElement).toBe(text);
        expect(onClose).toHaveBeenCalledWith('blur');
    });

    it('skips disabled controls when it picks the first control', () => {
        document.getElementById('first').disabled = true;
        click(trigger);
        expect(document.activeElement).toBe(document.getElementById('clear'));
    });

    it('removes its attributes and listeners on destroy', () => {
        controller.destroy();
        expect(trigger.hasAttribute('aria-expanded')).toBe(false);
        expect(trigger.hasAttribute('aria-controls')).toBe(false);
        click(trigger);
        expect(panel.hidden).toBe(true);
    });
});

describe('anchorPanel', () => {
    /**
     * Place a 192 px panel under a 44 px trigger at the given offset.
     * @param {string} align the alignment option
     * @param {string} direction the trigger's writing direction
     * @returns {number} the panel's left position in pixels
     */
    function place(align, direction) {
        document.body.innerHTML = '<button id="trigger" type="button">User</button><div id="panel"></div>';
        const trigger = document.getElementById('trigger');
        const panel = document.getElementById('panel');
        trigger.style.direction = direction;
        trigger.getBoundingClientRect = () => ({ left: 600, right: 644, top: 16, bottom: 60, width: 44, height: 44 });
        panel.getBoundingClientRect = () => ({ width: 192, height: 100 });
        anchorPanel(panel, trigger, 4, align);
        return Number.parseFloat(panel.style.left);
    }

    it('lines up the start edges by default, and the end edges with align end', () => {
        expect(place('start', 'ltr')).toBe(600);
        expect(place('end', 'ltr')).toBe(644 - 192);
    });

    it('mirrors both alignments for a right-to-left trigger', () => {
        expect(place('start', 'rtl')).toBe(644 - 192);
        expect(place('end', 'rtl')).toBe(600);
    });

    it('keeps the panel inside the viewport', () => {
        document.body.innerHTML = '<button id="trigger" type="button">User</button><div id="panel"></div>';
        const trigger = document.getElementById('trigger');
        const panel = document.getElementById('panel');
        trigger.getBoundingClientRect = () => ({ left: window.innerWidth - 20, right: window.innerWidth + 24, top: 16, bottom: 60, width: 44, height: 44 });
        panel.getBoundingClientRect = () => ({ width: 192, height: 100 });
        anchorPanel(panel, trigger, 4, 'start');
        expect(Number.parseFloat(panel.style.left)).toBe(window.innerWidth - 192 - 4);
    });

    it('places the panel below the trigger, or above it when it lacks room below', () => {
        document.body.innerHTML = '<button id="trigger" type="button">User</button><div id="panel"></div>';
        const trigger = document.getElementById('trigger');
        const panel = document.getElementById('panel');
        panel.getBoundingClientRect = () => ({ width: 192, height: 100 });
        trigger.getBoundingClientRect = () => ({ left: 16, right: 60, top: 16, bottom: 60, width: 44, height: 44 });
        anchorPanel(panel, trigger);
        expect(panel.style.position).toBe('fixed');
        expect(Number.parseFloat(panel.style.top)).toBe(64);
        const bottom = window.innerHeight - 10;
        trigger.getBoundingClientRect = () => ({ left: 16, right: 60, top: bottom - 44, bottom, width: 44, height: 44 });
        anchorPanel(panel, trigger);
        expect(Number.parseFloat(panel.style.top)).toBe(bottom - 44 - 4 - 100);
    });
});
