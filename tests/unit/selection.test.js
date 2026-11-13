// @vitest-environment happy-dom
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { attachSelection } from '../../src/js/selection.js';

let root;
let items;
let controller;
beforeEach(() => {
    document.body.innerHTML = `<fieldset data-selection-root><legend>Tasks</legend>
        <input type="checkbox" data-selection-all>
        ${[0, 1, 2, 3].map(i => `<label><input type="checkbox" data-selection-item value="${i}" ${i === 1 ? 'disabled' : ''}>Task ${i}</label>`).join('')}
        <p data-selection-count role="status"></p>
        <div data-selection-bar hidden><button data-selection-clear>Clear</button><button data-selection-action="archive">Archive</button></div>
        </fieldset>`;
    root = document.querySelector('[data-selection-root]');
    items = [...root.querySelectorAll('[data-selection-item]')];
});
afterEach(() => {
    controller?.destroy();
    controller = null;
    document.body.replaceChildren();
});

it('initializes authored selection, announces counts, and reflects mixed and all states', () => {
    items[0].checked = true;
    controller = attachSelection(root);
    const all = root.querySelector('[data-selection-all]');
    expect(all.indeterminate).toBe(true);
    expect(root.querySelector('[data-selection-count]').textContent).toBe('1 selected');
    expect(root.querySelector('[data-selection-bar]').hidden).toBe(false);
    all.click();
    expect(items.map(item => item.checked)).toEqual([true, false, true, true]);
    expect(all.checked).toBe(true);
    expect(all.indeterminate).toBe(false);
    all.click();
    expect(controller.selectedValues).toEqual([]);
    expect(root.querySelector('[data-selection-bar]').hidden).toBe(true);
});

it('selects and deselects ranges in both directions while skipping disabled rows', () => {
    controller = attachSelection(root);
    items[0].click();
    items[3].dispatchEvent(new MouseEvent('click', { bubbles: true, shiftKey: true }));
    expect(controller.selectedValues).toEqual(['0', '2', '3']);
    items[3].click();
    items[0].dispatchEvent(new MouseEvent('click', { bubbles: true, shiftKey: true }));
    expect(controller.selectedValues).toEqual([]);
});

it('handles Shift+Space once and leaves ordinary Space and Tab to native controls', () => {
    controller = attachSelection(root);
    items[0].click();
    const event = new KeyboardEvent('keydown', { key: ' ', shiftKey: true, bubbles: true, cancelable: true });
    items[3].dispatchEvent(event);
    expect(event.defaultPrevented).toBe(true);
    expect(controller.selectedValues).toEqual(['0', '2', '3']);
    for (const key of [' ', 'Tab', 'ArrowDown']) {
        const native = new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true });
        items[0].dispatchEvent(native);
        expect(native.defaultPrevented).toBe(false);
    }
});

it('dispatches bulk actions with values and clears without losing focus', () => {
    const onAction = vi.fn();
    root.addEventListener('selection:action', onAction);
    controller = attachSelection(root, { formatCount: count => `${count} chosen` });
    items[2].click();
    root.querySelector('[data-selection-action]').click();
    expect(onAction.mock.calls[0][0].detail).toEqual({ action: 'archive', values: ['2'] });
    const clear = root.querySelector('[data-selection-clear]');
    clear.focus();
    clear.click();
    expect(document.activeElement).toBe(root.querySelector('[data-selection-all]'));
    expect(root.querySelector('[data-selection-count]').textContent).toBe('0 chosen');
});

it('refreshes after row changes and restores enhancement state on idempotent destroy', () => {
    controller = attachSelection(root);
    items[0].click();
    items[0].closest('label').remove();
    controller.refresh();
    expect(controller.selectedValues).toEqual([]);
    controller.destroy();
    controller.destroy();
    items[2].click();
    expect(root.querySelector('[data-selection-count]').textContent).toBe('');
    expect(root.querySelector('[data-selection-bar]').hidden).toBe(true);
});

it('moves focus to the group when the focused master becomes unavailable', () => {
    root.tabIndex = -1;
    controller = attachSelection(root);
    const all = root.querySelector('[data-selection-all]');
    all.focus();
    for (const item of items) {
        item.closest('label').hidden = true;
    }
    controller.refresh();
    expect(all.disabled).toBe(true);
    expect(all.indeterminate).toBe(false);
    expect(document.activeElement).toBe(root);
});
