/* Look and theme switchers, live token values, and live field and form specimens of the visual style gallery. */

import { attachField } from '../js/field.js';
import { attachForm } from '../js/form.js';
import { setSpriteUrl } from '../js/icon.js';

// Add each new look here and as an option of the look select.
export const looks = ['neutral', 'warm', 'bright'];
export const themes = ['light', 'dark', 'system'];

const accents = { warm: ['spring', 'summer', 'autumn', 'winter'], bright: ['blue', 'yellow', 'red'] };

function configureAccents(doc, look) {
    const select = doc.getElementById('accent-select');
    const values = accents[look] || [];
    select.disabled = values.length === 0;
    select.replaceChildren(...['', ...values].map(value => {
        const option = doc.createElement('option');
        option.value = value;
        option.textContent = value ? value[0].toUpperCase() + value.slice(1) : 'Default';
        return option;
    }));
}

/**
 * Return the gallery-relative entry stylesheet of a look.
 * @param {string} look look name
 * @returns {string} the look's `index.css` path
 */
export function lookHref(look) {
    return `../looks/${look}/index.css`;
}

/**
 * Return the gallery-relative icon sprite of a look.
 * @param {string} look look name
 * @returns {string} the look's `icons.svg` path
 */
export function spriteHref(look) {
    return `../looks/${look}/icons.svg`;
}

/**
 * Swap the look stylesheet link and every gallery icon's sprite to another look.
 * @param {Document} doc gallery document
 * @param {string} look one of `looks`
 */
export function applyLook(doc, look) {
    if (!looks.includes(look)) {
        throw new RangeError(`Unknown look: ${look}`);
    }
    doc.getElementById('look-stylesheet').setAttribute('href', lookHref(look));
    setSpriteUrl(spriteHref(look));
    doc.documentElement.removeAttribute('data-accent');
    const accent = doc.getElementById('accent-select');
    if (accent) {
        configureAccents(doc, look);
        accent.value = '';
    }
    for (const use of doc.querySelectorAll('svg.icon use')) {
        use.setAttribute('href', `${spriteHref(look)}#${use.getAttribute('href').split('#')[1]}`);
    }
}

/**
 * Set `data-theme` on the root element, or remove it so the system preference applies.
 * @param {Document} doc gallery document
 * @param {string} theme one of `themes`
 */
export function applyTheme(doc, theme) {
    if (!themes.includes(theme)) {
        throw new RangeError(`Unknown theme: ${theme}`);
    }
    if (theme === 'system') {
        doc.documentElement.removeAttribute('data-theme');
    }
    else {
        doc.documentElement.setAttribute('data-theme', theme);
    }
}

/**
 * Show each token's computed value, and flag tokens the current look leaves undefined.
 * @param {Document} doc gallery document
 * @param {Window} view window that computes styles
 */
export function showTokenValues(doc, view) {
    const style = view.getComputedStyle(doc.documentElement);
    for (const item of doc.querySelectorAll('[data-token]')) {
        const value = style.getPropertyValue(item.dataset.token).trim();
        item.classList.toggle('is-undefined', !value);
        item.querySelector('.token__value').textContent = value || 'Not defined by this look';
    }
}

/**
 * Attach the live field and form specimens, and set the states that markup cannot express.
 * The form fakes a unique-name check and a slow save, so its pending and busy states stay visible.
 * @param {Document} doc gallery document
 * @param {Window} view window whose timers the fake checks use
 */
export function initSpecimens(doc, view) {
    for (const input of doc.querySelectorAll('[data-gallery-indeterminate]')) {
        input.indeterminate = true;
    }
    for (const element of doc.querySelectorAll('#field [data-field]')) {
        attachField(element, { document: doc, messages: { valueMissing: 'Enter a name.' } });
    }
    const form = doc.querySelector('#form form[data-form]');
    if (!form) {
        return;
    }
    const wait = (ms) => new Promise((resolve) => view.setTimeout(resolve, ms));
    const saved = form.querySelector('.banner--success');
    const controller = attachForm(form, {
        document: doc,
        busyMessage: 'Saving.',
        fields: {
            name: {
                messages: { valueMissing: 'Enter a name.' },
                pendingMessage: 'Checking the name.',
                validMessage: 'Name is free.',
                validate: async (value) => {
                    await wait(600);
                    return value.trim().toLowerCase() === 'taken' ? 'That name is taken.' : null;
                }
            },
            url: { messages: { valueMissing: 'Enter an address.', typeMismatch: 'Enter an address that starts with https://.' } }
        },
        onSubmit: async () => {
            saved.hidden = true;
            await wait(800);
            saved.hidden = false;
        }
    });
    // The browser resets the values after the reset event, so the counters refresh on the next task.
    form.addEventListener('reset', () => view.setTimeout(() => {
        for (const field of controller.fields.values()) {
            field.clear();
            field.control.dispatchEvent(new view.Event('input'));
        }
        controller.setErrors({});
        saved.hidden = true;
    }));
}

/**
 * Wire the switchers and apply the choices the browser restored into the controls.
 * @param {Document} doc gallery document
 * @param {Window} view window that computes styles
 */
export function initGallery(doc, view) {
    const link = doc.getElementById('look-stylesheet');
    const select = doc.getElementById('look-select');
    const refresh = () => showTokenValues(doc, view);
    link.addEventListener('load', refresh);
    select.addEventListener('change', (event) => applyLook(doc, event.target.value));
    const accent = doc.getElementById('accent-select');
    accent?.addEventListener('change', (event) => {
        if (event.target.value) {
            doc.documentElement.setAttribute('data-accent', event.target.value);
        }
        else {
            doc.documentElement.removeAttribute('data-accent');
        }
        refresh();
    });
    if (accent) {
        configureAccents(doc, select.value);
    }
    for (const radio of doc.querySelectorAll('input[name="theme"]')) {
        radio.addEventListener('change', (event) => {
            applyTheme(doc, event.target.value);
            refresh();
        });
    }
    setSpriteUrl(spriteHref(select.value));
    if (link.getAttribute('href') !== lookHref(select.value)) {
        applyLook(doc, select.value);
    }
    applyTheme(doc, doc.querySelector('input[name="theme"]:checked')?.value || 'system');
    refresh();
}

if (typeof document !== 'undefined') {
    initGallery(document, window);
    initSpecimens(document, window);
}
