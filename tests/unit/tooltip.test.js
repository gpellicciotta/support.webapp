// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from 'vitest';
import { attachLabelTooltips, attachTooltip, createTooltip } from '../../src/js/tooltip.js';

let controller;
afterEach(() => {
    controller?.destroy(); document.body.replaceChildren(); vi.useRealTimers();
});

it('preserves descriptions and restores authored attributes on destroy', () => {
    document.body.innerHTML = '<button aria-describedby="hint" title="Native">Refresh</button><span id="tip">Forecast details</span>';
    const trigger = document.querySelector('button');
    const tip = document.querySelector('span');
    controller = attachTooltip(trigger, tip);
    expect(trigger.getAttribute('aria-describedby')).toBe('hint tip');
    expect(trigger.hasAttribute('title')).toBe(false);
    trigger.focus();
    expect(tip.hidden).toBe(false);
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(tip.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
    controller.destroy();
    expect(trigger.getAttribute('aria-describedby')).toBe('hint');
    expect(trigger.title).toBe('Native');
    trigger.blur(); trigger.focus();
    expect(tip.hidden).toBe(false); // Original, unhidden markup is restored.
});

it('keeps hover open across trigger and tooltip, then closes after leaving both', () => {
    vi.useFakeTimers();
    const trigger = document.createElement('button');
    document.body.append(trigger);
    controller = createTooltip(document, { trigger, text: '<b>Plain text</b>' });
    const tip = controller.element;
    expect(tip.textContent).toBe('<b>Plain text</b>');
    expect(tip.querySelector('b')).toBeNull();
    trigger.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'touch' }));
    expect(tip.hidden).toBe(true);
    trigger.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    expect(tip.hidden).toBe(false);
    trigger.dispatchEvent(new PointerEvent('pointerleave'));
    tip.dispatchEvent(new PointerEvent('pointerenter', { pointerType: 'mouse' }));
    vi.runAllTimers();
    expect(tip.hidden).toBe(false);
    tip.dispatchEvent(new PointerEvent('pointerleave'));
    vi.runAllTimers();
    expect(tip.hidden).toBe(true);
    controller.destroy();
    expect(tip.isConnected).toBe(false);
});

it('keeps a focused tooltip open when the pointer leaves and closes on blur', () => {
    vi.useFakeTimers();
    const trigger = document.createElement('button');
    document.body.append(trigger);
    controller = createTooltip(document, { trigger, text: 'Details' });
    trigger.focus();
    trigger.dispatchEvent(new PointerEvent('pointerleave'));
    vi.runAllTimers();
    expect(controller.isOpen()).toBe(true);
    trigger.blur();
    vi.runAllTimers();
    expect(controller.isOpen()).toBe(false);
});

it('generates unique references, avoids duplicates, and ignores disabled triggers', () => {
    document.body.innerHTML = '<span id="tooltip-1"></span><button disabled>Refresh</button>';
    const trigger = document.querySelector('button');
    controller = createTooltip(document, { trigger, text: 'Details' });
    expect(controller.element.id).toBe('tooltip-2');
    controller.open();
    expect(controller.isOpen()).toBe(false);
    trigger.disabled = false;
    controller.open(); controller.open();
    expect(controller.isOpen()).toBe(true);
    controller.close(); controller.close();
    expect(controller.isOpen()).toBe(false);
    const id = controller.element.id;
    controller.destroy();
    expect(trigger.hasAttribute('aria-describedby')).toBe(false);
    expect(document.getElementById(id)).toBeNull();
});

describe('attachLabelTooltips', () => {
    const hover = (node, pointerType = 'mouse') => node.dispatchEvent(new PointerEvent('pointerover', { bubbles: true, pointerType }));
    const leave = (node, relatedTarget = document.body) => node.dispatchEvent(new PointerEvent('pointerout', { bubbles: true, pointerType: 'mouse', relatedTarget }));
    const tip = () => document.querySelector('.tooltip--label');

    it('shows an icon button name on mouse hover, without describing the button twice', () => {
        document.body.innerHTML = '<button class="icon-button" aria-label="Refresh"><svg class="icon"></svg></button><p>Text</p>';
        const button = document.querySelector('button');
        controller = attachLabelTooltips(document);
        expect(tip().hidden).toBe(true);
        hover(button.querySelector('svg'), 'touch');
        expect(tip().hidden).toBe(true);
        hover(button.querySelector('svg'));
        expect(tip().hidden).toBe(false);
        expect(tip().textContent).toBe('Refresh');
        expect(tip().getAttribute('aria-hidden')).toBe('true');
        expect(button.hasAttribute('aria-describedby')).toBe(false);
        expect(tip().style.position).toBe('fixed');
        leave(button.querySelector('svg'), button);
        expect(tip().hidden).toBe(false);
        leave(button, document.querySelector('p'));
        expect(tip().hidden).toBe(true);
    });

    it('follows a name that changes while it shows', async () => {
        document.body.innerHTML = '<button class="icon-button" aria-label="Collapse navigation"></button>';
        const button = document.querySelector('button');
        controller = attachLabelTooltips(document.body);
        hover(button);
        button.setAttribute('aria-label', 'Hide navigation');
        await new Promise((resolve) => setTimeout(resolve));
        expect(tip().textContent).toBe('Hide navigation');
    });

    it('suspends a native title while it shows, and falls back to the title as the name', () => {
        document.body.innerHTML = '<a class="icon-button" href="#inbox" title="Notifications"></a>';
        const link = document.querySelector('a');
        controller = attachLabelTooltips(document.body);
        hover(link);
        expect(tip().textContent).toBe('Notifications');
        expect(link.hasAttribute('title')).toBe(false);
        leave(link);
        expect(link.title).toBe('Notifications');
    });

    it('shows on keyboard focus, and closes on blur and on Escape', () => {
        document.body.innerHTML = '<button class="icon-button" aria-label="Close"></button>';
        const button = document.querySelector('button');
        controller = attachLabelTooltips(document.body);
        button.focus();
        expect(tip().hidden).toBe(false);
        button.blur();
        expect(tip().hidden).toBe(true);
        button.focus();
        const event = new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true });
        button.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        expect(tip().hidden).toBe(true);
        expect(document.activeElement).toBe(button);
    });

    it('names a link by its text, only while the caller allows it', () => {
        document.body.innerHTML = '<nav><a class="item" href="#events"><svg></svg><span>System events</span><span class="badge">3<span class="visually-hidden"> unread</span></span></a></nav>';
        let rail = false;
        controller = attachLabelTooltips(document.querySelector('nav'), { selector: 'a[href]', when: () => rail, placement: 'inline-end' });
        const link = document.querySelector('a');
        hover(link);
        expect(tip().hidden).toBe(true);
        rail = true;
        hover(link.querySelector('span'));
        expect(tip().hidden).toBe(false);
        expect(tip().textContent).toBe('System events 3 unread');
    });

    it('closes after a click removes its control', async () => {
        document.body.innerHTML = '<button class="icon-button" aria-label="Close panel"></button>';
        const button = document.querySelector('button');
        button.addEventListener('click', () => button.remove());
        controller = attachLabelTooltips(document.body);
        hover(button);
        button.click();
        await new Promise((resolve) => setTimeout(resolve));
        expect(tip().hidden).toBe(true);
    });

    it('lets the innermost root name a control when roots overlap', () => {
        document.body.innerHTML = '<nav><button class="icon-button" aria-label="Inner"></button></nav>';
        const inner = attachLabelTooltips(document.querySelector('nav'));
        controller = attachLabelTooltips(document);
        hover(document.querySelector('button'));
        expect(inner.isOpen()).toBe(true);
        expect(controller.isOpen()).toBe(false);
        expect(document.querySelectorAll('.tooltip--label:not([hidden])')).toHaveLength(1);
        inner.destroy();
    });

    it('removes its tooltip and stops listening on destroy', () => {
        document.body.innerHTML = '<button class="icon-button" aria-label="Help"></button>';
        controller = attachLabelTooltips(document.body);
        controller.destroy();
        controller = null;
        expect(tip()).toBeNull();
        hover(document.querySelector('button'));
        expect(tip()).toBeNull();
    });
});
