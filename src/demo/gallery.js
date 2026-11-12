/* Look and theme switchers and live token values of the visual style gallery. */

// Add each new look here and as an option of the look select.
export const looks = ['neutral', 'warm'];
export const themes = ['light', 'dark', 'system'];

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
    doc.documentElement.removeAttribute('data-accent');
    const accent = doc.getElementById('accent-select');
    if (accent) {
        accent.disabled = look !== 'warm';
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
        accent.disabled = select.value !== 'warm';
    }
    for (const radio of doc.querySelectorAll('input[name="theme"]')) {
        radio.addEventListener('change', (event) => {
            applyTheme(doc, event.target.value);
            refresh();
        });
    }
    if (link.getAttribute('href') !== lookHref(select.value)) {
        applyLook(doc, select.value);
    }
    applyTheme(doc, doc.querySelector('input[name="theme"]:checked')?.value || 'system');
    refresh();
}

if (typeof document !== 'undefined') {
    initGallery(document, window);
}
