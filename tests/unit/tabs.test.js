// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it } from 'vitest';
import { attachTabs } from '../../src/js/tabs.js';

let root;
let tabs;
let panels;
let controller;
beforeEach(() => {
    document.body.innerHTML = `<div data-tabs-root><div data-tabs-list role="tablist" aria-label="Settings">
        ${['General', 'Unavailable', 'Sharing'].map((name, index) => `<button type="button" data-tabs-tab role="tab" id="t${index}" aria-controls="p${index}" aria-selected="${index === 0}" ${index === 1 ? 'disabled' : ''}>${name}</button>`).join('')}
        </div>${[0, 1, 2].map(index => `<div data-tabs-panel role="tabpanel" id="p${index}" aria-labelledby="t${index}" tabindex="0">Panel ${index}</div>`).join('')}</div>`;
    root = document.querySelector('[data-tabs-root]');
    tabs = [...root.querySelectorAll('[data-tabs-tab]')];
    panels = [...root.querySelectorAll('[data-tabs-panel]')];
});
afterEach(() => {
    controller?.destroy();
    controller = null;
    document.body.replaceChildren();
});

it('keeps roles and links while initializing selection and roving focus', () => {
    controller = attachTabs(root);
    expect(tabs.map(tab => tab.tabIndex)).toEqual([0, -1, -1]);
    expect(panels.map(panel => panel.hidden)).toEqual([false, true, true]);
    expect(tabs[0].getAttribute('role')).toBe('tab');
    expect(panels[0].getAttribute('aria-labelledby')).toBe(tabs[0].id);
});

it('selects by pointer and when focus moves to an enabled tab', () => {
    controller = attachTabs(root);
    tabs[2].click();
    expect(tabs.map(tab => tab.getAttribute('aria-selected'))).toEqual(['false', 'false', 'true']);
    expect(panels.map(panel => panel.hidden)).toEqual([true, true, false]);
    tabs[0].focus();
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
});

it('wraps arrow navigation, skips disabled tabs, and supports Home and End', () => {
    controller = attachTabs(root);
    tabs[0].focus();
    for (const [key, index] of [['ArrowRight', 2], ['ArrowRight', 0], ['ArrowLeft', 2], ['Home', 0], ['End', 2]]) {
        document.activeElement.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));
        expect(document.activeElement).toBe(tabs[index]);
        expect(tabs[index].getAttribute('aria-selected')).toBe('true');
        expect(panels[index].hidden).toBe(false);
    }
    for (const key of ['ArrowUp', 'ArrowDown', 'Tab']) {
        const event = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
        tabs[2].dispatchEvent(event);
        expect(event.defaultPrevented).toBe(false);
    }
});

it('normalizes missing or disabled initial selection', () => {
    tabs[0].setAttribute('aria-selected', 'false');
    tabs[1].setAttribute('aria-selected', 'true');
    controller = attachTabs(root);
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
    expect(tabs[1].getAttribute('aria-selected')).toBe('false');
});

it('restores authored attributes and removes listeners on repeated destruction', () => {
    const original = root.innerHTML;
    controller = attachTabs(root);
    tabs[2].click();
    controller.destroy();
    controller.destroy();
    expect(root.innerHTML).toBe(original);
    tabs[2].click();
    expect(root.innerHTML).toBe(original);
});

it('rejects missing or external panels before changing markup', () => {
    panels[2].remove();
    const original = root.innerHTML;
    expect(() => attachTabs(root)).toThrow(/panel/i);
    expect(root.innerHTML).toBe(original);
});

it('does not handle nested tabset events', () => {
    panels[0].innerHTML = `<div data-tabs-root><button data-tabs-tab role="tab">Nested</button></div>`;
    controller = attachTabs(root);
    const nested = panels[0].querySelector('button');
    nested.dispatchEvent(new KeyboardEvent('keydown', { key: 'End', bubbles: true, cancelable: true }));
    nested.click();
    expect(tabs[0].getAttribute('aria-selected')).toBe('true');
});
