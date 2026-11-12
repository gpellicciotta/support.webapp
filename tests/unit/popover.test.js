// @vitest-environment happy-dom
// Ported from todos.webapp tests/unit/menu.test.js at commit 0cf4981.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { anchorPanel } from '../../src/js/anchor.js';
import { attachPopover } from '../../src/js/popover.js';
import { installPopoverShim, isShowing, lightDismiss, nextTask } from './popover-shim.js';

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
        installPopoverShim();
        document.body.innerHTML = `
            <button id="trigger" type="button">Status</button>
            <div id="panel" class="popover" role="group" hidden>
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

    it('turns the panel into a closed auto popover invoked by the trigger', () => {
        expect(panel.getAttribute('popover')).toBe('auto');
        expect(panel.hidden).toBe(false);
        expect(isShowing(panel)).toBe(false);
        expect(trigger.popoverTargetElement).toBe(panel);
    });

    it('keeps a popover value and a popovertarget link from the markup', () => {
        controller.destroy();
        document.body.innerHTML = `
            <button id="trigger" type="button" popovertarget="panel">Status</button>
            <div id="panel" class="popover" popover="manual"><button type="button">Clear</button></div>`;
        trigger = document.getElementById('trigger');
        panel = document.getElementById('panel');
        controller = attachPopover(trigger, panel, { anchor: false });
        expect(panel.getAttribute('popover')).toBe('manual');
        expect(trigger.popoverTargetElement).toBeNull();
        controller.destroy();
        expect(trigger.getAttribute('popovertarget')).toBe('panel');
        expect(panel.getAttribute('popover')).toBe('manual');
    });

    it('opens on a trigger click and focuses the first control', () => {
        expect(isShowing(panel)).toBe(false);
        const event = new MouseEvent('click', { bubbles: true, cancelable: true });
        trigger.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(isShowing(panel)).toBe(true);
        expect(trigger.getAttribute('aria-expanded')).toBe('true');
        expect(document.activeElement).toBe(document.getElementById('first'));
    });

    it('stays open on clicks inside the panel', () => {
        click(trigger);
        click(document.getElementById('clear'));
        expect(controller.isOpen()).toBe(true);
        expect(isShowing(panel)).toBe(true);
    });

    it('closes on Escape and returns focus to the trigger', () => {
        click(trigger);
        const event = press(document.getElementById('first'), 'Escape');
        expect(event.defaultPrevented).toBe(true);
        expect(isShowing(panel)).toBe(false);
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(trigger);
        expect(onClose).toHaveBeenCalledWith('escape');
    });

    it('follows a light dismiss of the platform and returns focus to the trigger', async () => {
        click(trigger);
        document.activeElement.blur();
        lightDismiss(panel);
        await nextTask();
        expect(controller.isOpen()).toBe(false);
        expect(trigger.getAttribute('aria-expanded')).toBe('false');
        expect(document.activeElement).toBe(trigger);
        expect(onClose).toHaveBeenCalledWith('outside');
    });

    it('ignores the toggle events of its own changes', async () => {
        click(trigger);
        click(trigger);
        click(trigger);
        await nextTask();
        expect(controller.isOpen()).toBe(true);
        expect(isShowing(panel)).toBe(true);
        expect(onClose).toHaveBeenCalledTimes(1);
    });

    it('links the trigger to the panel and toggles on trigger clicks', () => {
        expect(trigger.getAttribute('aria-controls')).toBe('panel');
        click(trigger);
        click(trigger);
        expect(isShowing(panel)).toBe(false);
        expect(onClose).toHaveBeenCalledWith('toggle');
    });

    it('closes without moving focus when focus leaves the panel and its trigger', () => {
        click(trigger);
        const text = document.getElementById('text');
        text.tabIndex = 0;
        panel.dispatchEvent(new FocusEvent('focusout', { bubbles: true, relatedTarget: text }));
        text.focus();
        expect(isShowing(panel)).toBe(false);
        expect(document.activeElement).toBe(text);
        expect(onClose).toHaveBeenCalledWith('blur');
    });

    it('skips disabled controls when it picks the first control', () => {
        document.getElementById('first').disabled = true;
        click(trigger);
        expect(document.activeElement).toBe(document.getElementById('clear'));
    });

    it('anchors the open popover at its trigger', () => {
        controller.destroy();
        controller = attachPopover(trigger, panel);
        trigger.getBoundingClientRect = () => ({ left: 16, right: 60, top: 16, bottom: 60, width: 44, height: 44 });
        panel.getBoundingClientRect = () => ({ width: 192, height: 100 });
        click(trigger);
        expect(isShowing(panel)).toBe(true);
        expect(panel.style.position).toBe('fixed');
        expect(panel.style.right).toBe('auto');
        expect(panel.style.bottom).toBe('auto');
        expect(Number.parseFloat(panel.style.top)).toBe(64);
        expect(Number.parseFloat(panel.style.left)).toBe(16);
        expect(panel.style.right).toBe('auto');
        expect(panel.style.bottom).toBe('auto');
    });

    it('removes its attributes and listeners on destroy, leaving the panel a closed popover', () => {
        controller.destroy();
        expect(trigger.hasAttribute('aria-expanded')).toBe(false);
        expect(trigger.hasAttribute('aria-controls')).toBe(false);
        expect(trigger.popoverTargetElement).toBeNull();
        expect(panel.hasAttribute('popover')).toBe(true);
        click(trigger);
        expect(isShowing(panel)).toBe(false);
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
        expect(panel.style.right).toBe('auto');
        expect(panel.style.bottom).toBe('auto');
        expect(Number.parseFloat(panel.style.top)).toBe(64);
        const bottom = window.innerHeight - 10;
        trigger.getBoundingClientRect = () => ({ left: 16, right: 60, top: bottom - 44, bottom, width: 44, height: 44 });
        anchorPanel(panel, trigger);
        expect(Number.parseFloat(panel.style.top)).toBe(bottom - 44 - 4 - 100);
    });
});
