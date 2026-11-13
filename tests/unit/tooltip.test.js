// @vitest-environment happy-dom
import { afterEach, expect, it, vi } from 'vitest';
import { attachTooltip, createTooltip } from '../../src/js/tooltip.js';

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
