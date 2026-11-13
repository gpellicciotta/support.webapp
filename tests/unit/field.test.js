import { Window } from 'happy-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { attachField, createField } from '../../src/js/field.js';
import { setSpriteUrl } from '../../src/js/icon.js';
import { createLiveRegion } from '../../src/js/live-region.js';

let window;
let doc;

beforeEach(() => {
    window = new Window();
    doc = window.document;
    setSpriteUrl('icons.svg');
});

afterEach(() => window.happyDOM.close());

const describedBy = (control) => (control.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean);
const glyph = (element) => element.querySelector('svg.icon use')?.getAttribute('href');

/**
 * Parse field markup into the document and return its root.
 * @param {string} html field markup
 * @returns {HTMLElement} the `.field` element
 */
function mount(html) {
    doc.body.innerHTML = html;
    return doc.body.querySelector('.field');
}

const SKELETON = `<div class="field" data-field>
  <label class="field__label" for="name">Name</label>
  <button class="field__help-toggle" type="button" aria-expanded="false" aria-controls="name-help" aria-label="Help for Name"></button>
  <p class="field__help" id="name-help" hidden>The counter name, shown on every screen.</p>
  <input class="field__control" id="name" name="name" maxlength="40" required aria-describedby="name-hint name-help">
  <p class="field__hint" id="name-hint">Up to 40 characters.</p>
  <p class="field__counter" id="name-counter"></p>
  <p class="field__status" id="name-status" hidden></p>
  <p class="field__error" id="name-error" hidden></p>
</div>`;

describe('createField', () => {
    it('keeps the todos.webapp result: a labeled control and a hidden error line', () => {
        const field = createField(doc, { label: 'Name', name: 'name' });
        expect(Object.keys(field)).toEqual(expect.arrayContaining(['element', 'control', 'setError']));
        expect(field.element.className).toBe('field');
        expect(field.element.hasAttribute('data-field')).toBe(true);
        const label = field.element.querySelector('label.field__label');
        expect(label.textContent).toBe('Name');
        expect(label.htmlFor).toBe(field.control.id);
        expect(field.control.tagName).toBe('INPUT');
        expect(field.control.type).toBe('text');
        expect(field.control.name).toBe('name');
        expect(field.control.className).toBe('field__control');
        const error = field.element.querySelector('.field__error');
        expect(error.id).toBe(`${field.control.id}-error`);
        expect(error.hidden).toBe(true);
        expect(field.control.hasAttribute('aria-describedby')).toBe(false);
    });

    it('builds unique ids, textareas, selects, and visually hidden labels', () => {
        const first = createField(doc, { label: 'Notes', name: 'notes', tag: 'textarea', hideLabel: true });
        const second = createField(doc, { label: 'Size', name: 'size', tag: 'select', choices: [{ value: 's', label: 'Small' }, { value: 'l', label: 'Large' }] });
        expect(first.control.id).not.toBe(second.control.id);
        expect(first.control.tagName).toBe('TEXTAREA');
        expect(first.element.querySelector('label').classList.contains('field__label--hidden')).toBe(true);
        expect(second.control.tagName).toBe('SELECT');
        expect([...second.control.options].map((option) => [option.value, option.textContent])).toEqual([['s', 'Small'], ['l', 'Large']]);
    });

    it('wires the hint, the help text, and the counter into aria-describedby in skeleton order', () => {
        const field = createField(doc, { label: 'Name', name: 'name', hint: 'Up to 40 characters.', help: 'Shown on every screen.', maxLength: 40 });
        const id = field.control.id;
        expect(describedBy(field.control)).toEqual([`${id}-hint`, `${id}-help`, `${id}-counter`]);
        expect(field.control.maxLength).toBe(40);
        const toggle = field.element.querySelector('button.field__help-toggle');
        expect(toggle.type).toBe('button');
        expect(toggle.getAttribute('aria-expanded')).toBe('false');
        expect(toggle.getAttribute('aria-controls')).toBe(`${id}-help`);
        expect(toggle.getAttribute('aria-label')).toBe('Help for Name');
        expect(glyph(toggle)).toBe('icons.svg#icon-help');
        expect(field.element.querySelector('.field__help').hidden).toBe(true);
        expect(field.element.querySelector('.field__counter').textContent).toBe('0 / 40');
    });

    it('sets an error with the alert icon, aria-invalid, an announcement, and keeps other described-by ids', () => {
        const announce = vi.fn();
        const field = createField(doc, { label: 'Name', name: 'name', hint: 'Hint.', announce });
        const id = field.control.id;
        field.setError('Enter a name.');
        const error = field.element.querySelector('.field__error');
        expect(error.hidden).toBe(false);
        expect(error.textContent).toBe('Enter a name.');
        expect(glyph(error)).toBe('icons.svg#icon-alert');
        expect(field.control.getAttribute('aria-invalid')).toBe('true');
        expect(describedBy(field.control)).toEqual([`${id}-hint`, `${id}-error`]);
        expect(announce).toHaveBeenCalledWith('Enter a name.');
        expect(field.error).toBe('Enter a name.');
        field.setError(null);
        expect(error.hidden).toBe(true);
        expect(error.textContent).toBe('');
        expect(field.control.hasAttribute('aria-invalid')).toBe(false);
        expect(describedBy(field.control)).toEqual([`${id}-hint`]);
        expect(field.error).toBe(null);
    });

    it('announces through a shared polite live region when no announcer is given', () => {
        vi.useFakeTimers();
        try {
            const liveRegion = createLiveRegion({ document: doc });
            const first = createField(doc, { label: 'A', name: 'a' });
            const second = createField(doc, { label: 'B', name: 'b' });
            doc.body.append(first.element, second.element);
            first.setError('Enter A.');
            second.setError('Enter B.');
            vi.runAllTimers();
            const regions = doc.querySelectorAll('[aria-live="polite"]');
            expect(regions).toHaveLength(1);
            expect(regions[0].textContent).toBe('Enter B.');
            expect(regions[0].dataset.liveRegion).toBe('polite');
            liveRegion.announce('Toast.');
            vi.runAllTimers();
            expect(regions[0].textContent).toBe('Toast.');
            liveRegion.destroy();
        }
        finally {
            vi.useRealTimers();
        }
    });
});

describe('attachField', () => {
    it('toggles the help text with its button and keeps it described while collapsed', () => {
        const element = mount(SKELETON);
        attachField(element, { document: doc });
        const toggle = element.querySelector('.field__help-toggle');
        const help = element.querySelector('.field__help');
        const control = element.querySelector('.field__control');
        expect(describedBy(control)).toContain('name-help');
        toggle.click();
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
        expect(help.hidden).toBe(false);
        toggle.click();
        expect(toggle.getAttribute('aria-expanded')).toBe('false');
        expect(help.hidden).toBe(true);
        expect(describedBy(control)).toContain('name-help');
    });

    it('updates the counter on input and describes the control with it', () => {
        const element = mount(SKELETON);
        attachField(element, { document: doc });
        const control = element.querySelector('.field__control');
        const counter = element.querySelector('.field__counter');
        expect(counter.textContent).toBe('0 / 40');
        expect(describedBy(control)).toEqual(['name-hint', 'name-help', 'name-counter']);
        control.value = 'Steps';
        control.dispatchEvent(new window.Event('input', { bubbles: true }));
        expect(counter.textContent).toBe('5 / 40');
    });

    it('shows the valid state with the check icon and the status line', () => {
        const element = mount(SKELETON);
        const field = attachField(element, { document: doc, announce: () => {} });
        const control = field.control;
        field.setError('Enter a name.');
        field.setValid('Name is free.');
        const status = element.querySelector('.field__status');
        expect(status.hidden).toBe(false);
        expect(status.textContent).toBe('Name is free.');
        expect(glyph(status)).toBe('icons.svg#icon-check');
        expect(control.hasAttribute('aria-invalid')).toBe(false);
        expect(element.querySelector('.field__error').hidden).toBe(true);
        expect(describedBy(control)).toEqual(['name-hint', 'name-help', 'name-counter', 'name-status']);
    });

    it('shows the pending state with aria-busy, a status line, and its icon', () => {
        const element = mount(SKELETON);
        const field = attachField(element, { document: doc, announce: () => {} });
        field.setPending('Checking the name.');
        const status = element.querySelector('.field__status');
        expect(element.getAttribute('aria-busy')).toBe('true');
        expect(status.textContent).toBe('Checking the name.');
        expect(glyph(status)).toBe('icons.svg#icon-more');
        field.setValid('Name is free.');
        expect(element.hasAttribute('aria-busy')).toBe(false);
        field.clear();
        expect(status.hidden).toBe(true);
        expect(describedBy(field.control)).toEqual(['name-hint', 'name-help', 'name-counter']);
    });

    it('validates on blur with native constraints and custom messages', async () => {
        const element = mount(SKELETON);
        const field = attachField(element, { document: doc, announce: () => {}, messages: { valueMissing: 'Enter a name.' } });
        field.control.dispatchEvent(new window.FocusEvent('blur'));
        await vi.waitFor(() => expect(field.error).toBe('Enter a name.'));
        expect(field.control.getAttribute('aria-invalid')).toBe('true');
    });

    it('runs a custom validator, revalidates on input once invalid, and passes when fixed', async () => {
        const element = mount(SKELETON);
        const validate = (value) => (value.includes(' ') ? 'Use one word.' : null);
        const field = attachField(element, { document: doc, announce: () => {}, validate });
        field.control.value = 'two words';
        expect(await field.validate()).toBe(false);
        expect(field.error).toBe('Use one word.');
        field.control.value = 'oneword';
        field.control.dispatchEvent(new window.Event('input', { bubbles: true }));
        await vi.waitFor(() => expect(field.error).toBe(null));
        expect(await field.validate()).toBe(true);
    });

    it('shows pending while an async validator runs, then the valid message', async () => {
        const element = mount(SKELETON);
        let resolve;
        const validate = () => new Promise((done) => {
            resolve = done;
        });
        const field = attachField(element, { document: doc, announce: () => {}, validate, pendingMessage: 'Checking.', validMessage: 'Name is free.' });
        field.control.value = 'Steps';
        const result = field.validate();
        expect(element.getAttribute('aria-busy')).toBe('true');
        expect(element.querySelector('.field__status').textContent).toBe('Checking.');
        resolve(null);
        expect(await result).toBe(true);
        expect(element.hasAttribute('aria-busy')).toBe(false);
        expect(element.querySelector('.field__status').textContent).toBe('Name is free.');
    });

    it('ignores a stale async result after a newer validation', async () => {
        const element = mount(SKELETON);
        const pending = [];
        const validate = (value) => new Promise((done) => pending.push(() => done(value === 'old' ? 'Taken.' : null)));
        const field = attachField(element, { document: doc, announce: () => {}, validate });
        field.control.value = 'old';
        const first = field.validate();
        field.control.value = 'new';
        const second = field.validate();
        pending[1]();
        expect(await second).toBe(true);
        pending[0]();
        expect(await first).toBe(true);
        expect(field.error).toBe(null);
    });

    it('stops listening after destroy', () => {
        const element = mount(SKELETON);
        const field = attachField(element, { document: doc });
        field.destroy();
        element.querySelector('.field__help-toggle').click();
        expect(element.querySelector('.field__help').hidden).toBe(true);
        field.control.value = 'abc';
        field.control.dispatchEvent(new window.Event('input', { bubbles: true }));
        expect(element.querySelector('.field__counter').textContent).toBe('0 / 40');
    });
});

describe('review round 1 regressions', () => {
    it('D2: a created field shows the pending and valid states in its status line', () => {
        const field = createField(doc, { label: 'Name', name: 'name', announce: () => {} });
        const status = field.element.querySelector('.field__status');
        expect(status).not.toBe(null);
        expect(status.hidden).toBe(true);
        expect(describedBy(field.control)).not.toContain(status.id);
        field.setPending('Checking.');
        expect(status.hidden).toBe(false);
        expect(status.textContent).toBe('Checking.');
        expect(glyph(status)).toBe('icons.svg#icon-more');
        expect(describedBy(field.control)).toContain(status.id);
        field.setValid('Available.');
        expect(status.textContent).toBe('Available.');
        expect(glyph(status)).toBe('icons.svg#icon-check');
        expect(describedBy(field.control)).toContain(status.id);
        expect(status.compareDocumentPosition(field.element.querySelector('.field__error')) & window.Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
    });

    it('D3: an edit during a pending check discards the old result and checks the current value', async () => {
        const element = mount(SKELETON);
        const pending = [];
        const validate = (value) => new Promise((done) => pending.push({ value, done }));
        const field = attachField(element, { document: doc, announce: () => {}, validate });
        field.control.value = 'old';
        const first = field.validate();
        field.control.value = 'new';
        field.control.dispatchEvent(new window.Event('input', { bubbles: true }));
        expect(element.hasAttribute('aria-busy')).toBe(false);
        expect(element.querySelector('.field__status').hidden).toBe(true);
        pending[0].done('Old value taken');
        await vi.waitFor(() => expect(pending).toHaveLength(2));
        expect(field.error).toBe(null);
        expect(pending[1].value).toBe('new');
        pending[1].done('New value taken');
        expect(await first).toBe(false);
        expect(field.error).toBe('New value taken');
    });

    it('D3: an edit after a passing check drops the stale valid status', async () => {
        const element = mount(SKELETON);
        const field = attachField(element, { document: doc, announce: () => {}, validate: async () => null, validMessage: 'Name is free.' });
        field.control.value = 'Steps';
        expect(await field.validate()).toBe(true);
        expect(element.querySelector('.field__status').hidden).toBe(false);
        field.control.value = 'Steps 2';
        field.control.dispatchEvent(new window.Event('input', { bubbles: true }));
        expect(element.querySelector('.field__status').hidden).toBe(true);
    });
});
