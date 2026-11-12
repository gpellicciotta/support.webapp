// @vitest-environment happy-dom
import { beforeEach, expect, it, vi } from 'vitest';
import { attachInlineConfirm } from '../../src/js/inline-confirm.js';

let row;
let trigger;
let question;
beforeEach(() => {
    document.body.innerHTML = `<div><div data-inline-confirm-content><button data-inline-confirm-trigger>Delete</button></div>
        <div class="inline-confirm" data-inline-confirm hidden role="group" aria-label="Confirm delete" tabindex="-1">
        <p class="inline-confirm__question">Delete forever?</p>
        <button data-inline-confirm-answer="yes">Delete</button><button data-inline-confirm-answer="no">Keep</button></div></div>`;
    row = document.body.firstElementChild;
    trigger = row.querySelector('[data-inline-confirm-trigger]');
    question = row.querySelector('[data-inline-confirm]');
});

it('asks in place and restores the row and focus on Keep', () => {
    const onConfirm = vi.fn();
    attachInlineConfirm(row, { onConfirm });
    trigger.click();
    expect(question.hidden).toBe(false);
    expect(row.querySelector('[data-inline-confirm-content]').hidden).toBe(true);
    expect(document.activeElement).toBe(question);
    row.querySelector('[data-inline-confirm-answer="no"]').click();
    expect(question.hidden).toBe(true);
    expect(document.activeElement).toBe(trigger);
    expect(onConfirm).not.toHaveBeenCalled();
});

it('confirms once and removes listeners on destroy', () => {
    const onConfirm = vi.fn();
    const controller = attachInlineConfirm(row, { onConfirm });
    trigger.click();
    row.querySelector('[data-inline-confirm-answer="yes"]').click();
    expect(onConfirm).toHaveBeenCalledTimes(1);
    controller.destroy();
    trigger.click();
    expect(question.hidden).toBe(true);
});

it('cancels with Escape and supports repeated questions', () => {
    attachInlineConfirm(row);
    trigger.click();
    question.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    expect(question.hidden).toBe(true);
    trigger.click();
    expect(question.hidden).toBe(false);
});
