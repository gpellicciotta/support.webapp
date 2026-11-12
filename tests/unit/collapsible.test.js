// @vitest-environment happy-dom
// Covers the aria-expanded rows of todos.webapp src/js/views/view-controls.js at commit 0cf4981.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { attachCollapsible } from '../../src/js/collapsible.js';

describe('attachCollapsible', () => {
    let root;
    let toggle;
    let panel;
    let controller;

    beforeEach(() => {
        document.body.innerHTML = `
            <div class="collapsible" data-collapsible>
                <button class="collapsible__toggle" type="button" aria-expanded="false" aria-controls="done">Done (2)</button>
                <div class="collapsible__panel" id="done" hidden>Two tasks</div>
            </div>`;
        root = document.querySelector('[data-collapsible]');
        toggle = root.querySelector('button');
        panel = document.getElementById('done');
    });

    afterEach(() => {
        controller?.destroy();
        controller = null;
    });

    it('starts in the state the markup declares', () => {
        controller = attachCollapsible(root);
        expect(controller.isExpanded()).toBe(false);
        expect(panel.hidden).toBe(true);
    });

    it('shows the panel when the markup declares it expanded', () => {
        toggle.setAttribute('aria-expanded', 'true');
        controller = attachCollapsible(root);
        expect(controller.isExpanded()).toBe(true);
        expect(panel.hidden).toBe(false);
    });

    it('toggles on clicks, which buttons also receive from Enter and Space', () => {
        const onToggle = vi.fn();
        controller = attachCollapsible(root, { onToggle });
        toggle.click();
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
        expect(panel.hidden).toBe(false);
        toggle.click();
        expect(toggle.getAttribute('aria-expanded')).toBe('false');
        expect(panel.hidden).toBe(true);
        expect(onToggle.mock.calls).toEqual([[true], [false]]);
    });

    it('expands and collapses through the controller without repeating a state', () => {
        const onToggle = vi.fn();
        controller = attachCollapsible(root, { onToggle });
        controller.expand();
        controller.expand();
        expect(panel.hidden).toBe(false);
        controller.toggle();
        expect(panel.hidden).toBe(true);
        controller.collapse();
        expect(onToggle.mock.calls).toEqual([[true], [false]]);
    });

    it('expands when find in page reveals a panel hidden until found', () => {
        panel.setAttribute('hidden', 'until-found');
        controller = attachCollapsible(root);
        panel.dispatchEvent(new Event('beforematch'));
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
        expect(panel.hidden).toBe(false);
        controller.collapse();
        expect(panel.getAttribute('hidden')).toBe('until-found');
    });

    it('stops listening on destroy', () => {
        controller = attachCollapsible(root);
        controller.destroy();
        controller = null;
        toggle.click();
        expect(toggle.getAttribute('aria-expanded')).toBe('false');
        expect(panel.hidden).toBe(true);
    });

    it('rejects markup without a toggle that controls a panel', () => {
        toggle.removeAttribute('aria-controls');
        expect(() => attachCollapsible(root)).toThrow(/aria-controls/);
    });
});
