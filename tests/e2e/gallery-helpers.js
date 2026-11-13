// Shared helpers of the component specs; each project pins the viewport and the system theme.
import { expect } from '@playwright/test';

export const GALLERY = '/demo/visual-style-gallery.html';
export const MIN_TARGET = 44;
export const STATES = [':not(.is-hover, .is-focus, .is-active, :disabled, [aria-disabled="true"])', '.is-hover', '.is-focus', '.is-active', ':disabled'];

/**
 * Wait for pending color transitions before reading computed styles.
 * @param {import('@playwright/test').Page} page page to settle
 */
export async function settleGalleryStyles(page) {
    await page.evaluate(() => Promise.all(document.getAnimations()
        .filter(animation => animation instanceof CSSTransition)
        .map(transition => transition.finished.catch(() => null))));
}

/**
 * Select a look and wait for stylesheet imports, fonts, and transitions before reading styles.
 * @param {import('@playwright/test').Page} page gallery page
 * @param {string} look look option value
 */
export async function selectGalleryLook(page, look) {
    await page.evaluate(async selectedLook => {
        const link = document.getElementById('look-stylesheet');
        const select = document.getElementById('look-select');
        if (select.value !== selectedLook) {
            await new Promise((resolve, reject) => {
                const cleanup = () => {
                    link.removeEventListener('load', loaded);
                    link.removeEventListener('error', failed);
                };
                const loaded = () => {
                    cleanup();
                    resolve();
                };
                const failed = () => {
                    cleanup();
                    reject(new Error(`Failed to load the ${selectedLook} look stylesheet.`));
                };
                // Register before changing href; cached stylesheets may load immediately.
                link.addEventListener('load', loaded);
                link.addEventListener('error', failed);
                select.value = selectedLook;
                select.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
        await document.fonts.ready;
    }, look);
    await settleGalleryStyles(page);
}

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

/**
 * Check that an open panel sits inside the viewport, just below or above its trigger.
 * @param {import('@playwright/test').Page} page page to probe
 * @param {import('@playwright/test').Locator} trigger trigger that opened the panel
 * @param {import('@playwright/test').Locator} panel open panel
 */
export async function expectAnchored(page, trigger, panel) {
    const { width, height } = page.viewportSize();
    const box = await panel.boundingBox();
    const anchor = await trigger.boundingBox();
    expect(box.x).toBeGreaterThanOrEqual(0);
    expect(box.y).toBeGreaterThanOrEqual(0);
    expect(box.x + box.width).toBeLessThanOrEqual(width);
    expect(box.y + box.height).toBeLessThanOrEqual(height);
    const below = Math.abs(box.y - (anchor.y + anchor.height + 4));
    const above = Math.abs(box.y + box.height - (anchor.y - 4));
    expect(Math.min(below, above)).toBeLessThan(1);
}

/**
 * Check that an element of an open panel paints on top, so no specimen covers its center.
 * @param {import('@playwright/test').Locator} target element inside the open panel
 */
export async function expectOnTop(target) {
    const hit = await target.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const top = document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
        return element.contains(top);
    });
    expect(hit, 'covered by another element').toBe(true);
}

/**
 * Check that an open panel paints above a sticky bar at the highest z-index, as only the top layer can.
 * The bar covers the viewport, so the trigger, which stays in the page, must fall under it.
 * @param {import('@playwright/test').Locator} trigger trigger that opened the panel
 * @param {import('@playwright/test').Locator} target element inside the open panel
 */
export async function expectAboveStickyBar(trigger, target) {
    const hits = await target.evaluate((element, opener) => {
        const bar = document.createElement('div');
        bar.style.cssText = 'position: sticky; inset-block-start: 0; z-index: 2147483647; block-size: 100vh; margin-block-end: -100vh; background: gray';
        document.body.prepend(bar);
        const center = (node) => {
            const box = node.getBoundingClientRect();
            return document.elementFromPoint(box.left + box.width / 2, box.top + box.height / 2);
        };
        const result = { trigger: center(opener) === bar, panel: element.contains(center(element)) };
        bar.remove();
        return result;
    }, await trigger.elementHandle());
    expect(hits.trigger, 'the sticky bar covers the trigger').toBe(true);
    expect(hits.panel, 'the panel paints above the sticky bar').toBe(true);
}
