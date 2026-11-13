import { Window } from 'happy-dom';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { attachForm } from '../../src/js/form.js';
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

const FORM = `<form class="form" data-form novalidate>
  <div class="error-summary" tabindex="-1" hidden></div>
  <div class="field" data-field>
    <label class="field__label" for="name">Name</label>
    <input class="field__control" id="name" name="name" required>
    <p class="field__error" id="name-error" hidden></p>
  </div>
  <div class="field" data-field>
    <label class="field__label" for="url">Address</label>
    <input class="field__control" id="url" name="url" type="text" required>
    <p class="field__error" id="url-error" hidden></p>
  </div>
  <div class="form__actions">
    <button class="button" type="submit">Save</button>
  </div>
</form>`;

/**
 * Parse the form markup and return its parts.
 * @returns {{form: HTMLFormElement, summary: HTMLElement, name: HTMLInputElement, url: HTMLInputElement, submit: HTMLButtonElement}} the parts
 */
function mount() {
    doc.body.innerHTML = FORM;
    const form = doc.querySelector('form');
    return {
        form,
        summary: form.querySelector('.error-summary'),
        name: form.querySelector('#name'),
        url: form.querySelector('#url'),
        submit: form.querySelector('button[type="submit"]')
    };
}

const messages = { name: { valueMissing: 'Enter a name.' }, url: { valueMissing: 'Enter an address.' } };
const fields = { name: { messages: messages.name }, url: { messages: messages.url } };
const submitEvent = () => new window.Event('submit', { bubbles: true, cancelable: true });

describe('attachForm', () => {
    it('shares field errors and busy messages with the page announcer', async () => {
        const { form, name, url } = mount();
        const liveRegion = createLiveRegion({ document: doc });
        const controller = attachForm(form, { document: doc, fields });
        expect(await controller.submit()).toBe(false);
        expect(doc.querySelectorAll('[aria-live="polite"]')).toHaveLength(1);
        name.value = 'Steps';
        url.value = 'Address';
        expect(await controller.submit()).toBe(true);
        await new Promise(resolve => setTimeout(resolve, 120));
        expect(doc.querySelector('[data-live-region="polite"]').textContent).toBe('Sending.');
        controller.destroy();
        liveRegion.destroy();
    });

    it('fills the error summary after a failed submit, focuses it, and skips onSubmit', async () => {
        const { form, summary, name, url } = mount();
        const onSubmit = vi.fn();
        const controller = attachForm(form, { document: doc, fields, onSubmit, announce: () => {} });
        expect(await controller.submit()).toBe(false);
        expect(onSubmit).not.toHaveBeenCalled();
        expect(summary.hidden).toBe(false);
        expect(summary.getAttribute('role')).toBe('alert');
        const title = summary.querySelector('.error-summary__title');
        expect(title.textContent).toBe('Fix 2 fields');
        expect(summary.getAttribute('aria-labelledby')).toBe(title.id);
        const links = [...summary.querySelectorAll('.error-summary__list a.error-summary__link')];
        expect(links.map((link) => [link.getAttribute('href'), link.textContent])).toEqual([['#name', 'Enter a name.'], ['#url', 'Enter an address.']]);
        expect(doc.activeElement).toBe(summary);
        expect(name.getAttribute('aria-invalid')).toBe('true');
        expect(url.getAttribute('aria-invalid')).toBe('true');
    });

    it('names one field in the singular and focuses a field when its link is clicked', async () => {
        const { form, summary, name, url } = mount();
        const controller = attachForm(form, { document: doc, fields, announce: () => {} });
        name.value = 'Steps';
        await controller.submit();
        expect(summary.querySelector('.error-summary__title').textContent).toBe('Fix 1 field');
        const link = summary.querySelector('.error-summary__link');
        const click = new window.MouseEvent('click', { bubbles: true, cancelable: true });
        link.dispatchEvent(click);
        expect(click.defaultPrevented).toBe(true);
        expect(doc.activeElement).toBe(url);
    });

    it('handles the native submit event and sends valid data with the busy state', async () => {
        const { form, summary, name, url, submit } = mount();
        let finish;
        const announce = vi.fn();
        const onSubmit = vi.fn(() => new Promise((done) => {
            finish = done;
        }));
        attachForm(form, { document: doc, fields, onSubmit, announce, busyMessage: 'Saving.' });
        name.value = 'Steps';
        url.value = 'https://example.test';
        const event = submitEvent();
        form.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
        await vi.waitFor(() => expect(onSubmit).toHaveBeenCalledTimes(1));
        expect(onSubmit.mock.calls[0][0].data.get('name')).toBe('Steps');
        expect(form.getAttribute('aria-busy')).toBe('true');
        expect(submit.getAttribute('aria-disabled')).toBe('true');
        expect(announce).toHaveBeenCalledWith('Saving.');
        expect(summary.hidden).toBe(true);
        form.dispatchEvent(submitEvent());
        expect(onSubmit).toHaveBeenCalledTimes(1);
        finish();
        await vi.waitFor(() => expect(form.hasAttribute('aria-busy')).toBe(false));
        expect(submit.hasAttribute('aria-disabled')).toBe(false);
    });

    it('routes server errors from onSubmit to the fields and the summary', async () => {
        const { form, summary, name, url } = mount();
        const onSubmit = () => ({ errors: { name: 'That name is taken.' } });
        const controller = attachForm(form, { document: doc, fields, onSubmit, announce: () => {} });
        name.value = 'Steps';
        url.value = 'https://example.test';
        expect(await controller.submit()).toBe(false);
        expect(name.getAttribute('aria-invalid')).toBe('true');
        expect(summary.hidden).toBe(false);
        expect(summary.querySelector('.error-summary__link').textContent).toBe('That name is taken.');
        expect(doc.activeElement).toBe(summary);
        expect(form.hasAttribute('aria-busy')).toBe(false);
    });

    it('hides the summary after a later successful submit', async () => {
        const { form, summary, name, url } = mount();
        const controller = attachForm(form, { document: doc, fields, onSubmit: () => {}, announce: () => {} });
        await controller.submit();
        expect(summary.hidden).toBe(false);
        name.value = 'Steps';
        url.value = 'https://example.test';
        expect(await controller.submit()).toBe(true);
        expect(summary.hidden).toBe(true);
        expect(summary.querySelector('.error-summary__list')).toBe(null);
    });

    it('clears the busy state when onSubmit rejects', async () => {
        const { form, name, url } = mount();
        const controller = attachForm(form, { document: doc, fields, onSubmit: () => Promise.reject(new Error('offline')), announce: () => {} });
        name.value = 'Steps';
        url.value = 'https://example.test';
        await expect(controller.submit()).rejects.toThrow('offline');
        expect(form.hasAttribute('aria-busy')).toBe(false);
    });

    it('adds a summary when the markup has none, and stops listening after destroy', async () => {
        const { form, summary } = mount();
        summary.remove();
        const onSubmit = vi.fn();
        const controller = attachForm(form, { document: doc, fields, onSubmit, announce: () => {} });
        const added = form.firstElementChild;
        expect(added.classList.contains('error-summary')).toBe(true);
        expect(added.getAttribute('tabindex')).toBe('-1');
        expect(added.hidden).toBe(true);
        controller.destroy();
        form.dispatchEvent(submitEvent());
        await Promise.resolve();
        expect(added.hidden).toBe(true);
        expect(controller.fields.get('name')).toBeDefined();
    });
});

describe('review round 1 regressions', () => {
    it('D1: a second submit during async validation never sends twice', async () => {
        const { form, name, url } = mount();
        let resolve;
        const shared = new Promise((done) => {
            resolve = done;
        });
        const onSubmit = vi.fn();
        const controller = attachForm(form, {
            document: doc, announce: () => {}, onSubmit,
            fields: { name: { ...fields.name, validate: () => shared }, url: fields.url }
        });
        name.value = 'Steps';
        url.value = 'https://example.test';
        const first = controller.submit();
        const second = controller.submit();
        resolve(null);
        expect(await second).toBe(false);
        expect(await first).toBe(true);
        expect(onSubmit).toHaveBeenCalledTimes(1);
        expect(await controller.submit()).toBe(true);
        expect(onSubmit).toHaveBeenCalledTimes(2);
    });

    it('D1: the guard is released when validation throws', async () => {
        const { form, name, url } = mount();
        let fail = true;
        const onSubmit = vi.fn();
        const controller = attachForm(form, {
            document: doc, announce: () => {}, onSubmit,
            fields: { name: { ...fields.name, validate: () => (fail ? Promise.reject(new Error('offline')) : null) }, url: fields.url }
        });
        name.value = 'Steps';
        url.value = 'https://example.test';
        await expect(controller.submit()).rejects.toThrow('offline');
        fail = false;
        expect(await controller.submit()).toBe(true);
        expect(onSubmit).toHaveBeenCalledTimes(1);
    });
});

describe('review round 2 regressions', () => {
    it('D1: an edit to a checked field while another check runs is revalidated before sending', async () => {
        const { form, summary, name, url } = mount();
        let resolve;
        let calls = 0;
        const validate = () => (calls++ === 0 ? new Promise((done) => {
            resolve = done;
        }) : null);
        const onSubmit = vi.fn();
        const controller = attachForm(form, {
            document: doc, announce: () => {}, onSubmit,
            fields: { name: fields.name, url: { ...fields.url, validate } }
        });
        name.value = 'Steps';
        url.value = 'https://example.test';
        const result = controller.submit();
        name.value = '';
        name.dispatchEvent(new window.Event('input', { bubbles: true }));
        resolve(null);
        expect(await result).toBe(false);
        expect(onSubmit).not.toHaveBeenCalled();
        expect(name.getAttribute('aria-invalid')).toBe('true');
        expect(summary.hidden).toBe(false);
        expect(summary.querySelector('.error-summary__link').textContent).toBe('Enter a name.');
    });

    it('D1: a valid edit during validation is checked again, and the sent data matches it', async () => {
        const { form, name, url } = mount();
        const checked = [];
        let resolve;
        const validate = (value) => {
            checked.push(value);
            return checked.length === 1 ? new Promise((done) => {
                resolve = done;
            }) : null;
        };
        const onSubmit = vi.fn();
        const controller = attachForm(form, {
            document: doc, announce: () => {}, onSubmit,
            fields: { name: { ...fields.name, validate }, url: fields.url }
        });
        name.value = 'Steps';
        url.value = 'https://example.test';
        const result = controller.submit();
        url.value = 'https://other.test';
        resolve(null);
        expect(await result).toBe(true);
        expect(checked).toEqual(['Steps', 'Steps']);
        expect(onSubmit.mock.calls[0][0].data.get('url')).toBe('https://other.test');
    });
});
