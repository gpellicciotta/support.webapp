// Shared helpers of the component specs; each project pins the viewport and the system theme.
import { expect } from '@playwright/test';

export const GALLERY = '/demo/visual-style-gallery.html';
export const MIN_TARGET = 44;
export const STATES = [':not(.is-hover, .is-focus, .is-active, :disabled, [aria-disabled="true"])', '.is-hover', '.is-focus', '.is-active', ':disabled'];

/**
 * Open the gallery, fail on console, page, and HTTP errors, and stop transitions so states compute at once.
 * @param {import('@playwright/test').Page} page page to drive
 * @returns {Promise<string[]>} live problem list
 */
export async function openGallery(page) {
    const problems = [];
    page.on('console', (message) => message.type() === 'error' && problems.push(`console: ${message.text()}`));
    page.on('pageerror', (error) => problems.push(`page: ${error.message}`));
    page.on('response', (response) => response.status() >= 400 && problems.push(`HTTP ${response.status()}: ${response.url()}`));
    const response = await page.goto(GALLERY, { waitUntil: 'networkidle' });
    expect(response.status()).toBe(200);
    await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' });
    return problems;
}

/**
 * Resolve a token to its computed color in the current theme.
 * @param {import('@playwright/test').Page} page page to probe
 * @param {string} token token name, such as `--color-danger`
 * @returns {Promise<string>} computed color
 */
export function tokenColor(page, token) {
    return page.evaluate((name) => {
        const probe = document.createElement('span');
        probe.style.color = `var(${name})`;
        document.body.append(probe);
        const color = getComputedStyle(probe).color;
        probe.remove();
        return color;
    }, token);
}

/**
 * Resolve a length token to pixels.
 * @param {import('@playwright/test').Page} page page to probe
 * @param {string} token token name, such as `--radius-button`
 * @returns {Promise<string>} computed length
 */
export function tokenLength(page, token) {
    return page.evaluate((name) => {
        const probe = document.createElement('span');
        probe.style.borderTopLeftRadius = `var(${name})`;
        document.body.append(probe);
        const length = getComputedStyle(probe).borderTopLeftRadius;
        probe.remove();
        return length;
    }, token);
}

/**
 * Focus an element with keyboard modality and read its outline.
 * @param {import('@playwright/test').Locator} locator element to focus
 * @returns {Promise<{focusVisible: boolean, style: string, width: number, color: string}>} the ring
 */
export async function ring(locator) {
    await locator.page().keyboard.press('Tab');
    return locator.evaluate((element) => {
        element.focus();
        const style = getComputedStyle(element);
        return { focusVisible: element.matches(':focus-visible'), style: style.outlineStyle, width: parseFloat(style.outlineWidth), color: style.outlineColor };
    });
}

/**
 * Read the outline of a forced `.is-focus` specimen without focusing it.
 * @param {import('@playwright/test').Locator} locator specimen
 * @returns {Promise<{style: string, width: number, color: string}>} the ring
 */
export function forcedRing(locator) {
    return locator.evaluate((element) => {
        const style = getComputedStyle(element);
        return { style: style.outlineStyle, width: parseFloat(style.outlineWidth), color: style.outlineColor };
    });
}

/**
 * List the visible elements under a selector whose box is smaller than the minimum target.
 * @param {import('@playwright/test').Page} page page to measure
 * @param {string} selector elements to measure
 * @returns {Promise<{count: number, small: string[]}>} the measured count and each small element
 */
export function smallTargets(page, selector) {
    return page.locator(selector).evaluateAll((elements, min) => {
        const small = [];
        let count = 0;
        for (const element of elements) {
            const target = element.matches('input[type="radio"], input[type="checkbox"]') ? element.closest('label') : element;
            if (!target.checkVisibility()) {
                continue;
            }
            count++;
            const box = target.getBoundingClientRect();
            if (box.width + 0.5 < min || box.height + 0.5 < min) {
                small.push(`${target.className} "${element.getAttribute('aria-label') ?? target.textContent.trim()}" ${box.width}x${box.height}`);
            }
        }
        return { count, small };
    }, MIN_TARGET);
}

/**
 * Read computed style properties of one element.
 * @param {import('@playwright/test').Locator} locator element
 * @param {string[]} properties CSS property names
 * @returns {Promise<Record<string, string>>} the values by property
 */
export function styles(locator, properties) {
    return locator.evaluate((element, names) => {
        const style = getComputedStyle(element);
        return Object.fromEntries(names.map((name) => [name, style.getPropertyValue(name)]));
    }, properties);
}

/**
 * Expect a solid ring of at least 2 px in a color, on a focused element or a forced specimen.
 * @param {{focusVisible?: boolean, style: string, width: number, color: string}} actual ring read by `ring` or `forcedRing`
 * @param {string} color expected computed color
 * @param {string} label assertion label
 */
export function expectRing(actual, color, label) {
    expect(actual.focusVisible ?? true, `${label}: matches :focus-visible`).toBe(true);
    expect(actual.style, `${label}: outline style`).toBe('solid');
    expect(actual.width, `${label}: outline width`).toBeGreaterThanOrEqual(2);
    expect(actual.color, `${label}: outline color`).toBe(color);
}
