// Browser checks of pull-to-refresh in the installed app shell (ADR-0004), on the portal shell demo.
// The tests stand in for an installed app by answering `(display-mode: standalone)` with a match,
// and pull with synthetic touch events, which reach the page's listeners as a finger's would.
import { expect, test } from '@playwright/test';

/** Answer the installed app's display mode query with a match, as an installed app's browser does. */
function standalone() {
    const realMatchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query) => {
        if (!query.includes('display-mode: standalone')) {
            return realMatchMedia(query);
        }
        return {
            matches: true, media: query, onchange: null,
            addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {},
            dispatchEvent: () => false
        };
    };
}

/**
 * Open the portal demo, failing on console, page, and HTTP errors.
 * @param {import('@playwright/test').Page} page page to drive
 * @param {boolean} installed whether the page runs as an installed app
 * @returns {Promise<string[]>} live problem list
 */
async function openPortal(page, installed) {
    const problems = [];
    page.on('console', (message) => message.type() === 'error' && problems.push(`console: ${message.text()}`));
    page.on('pageerror', (error) => problems.push(`page: ${error.message}`));
    page.on('response', (response) => response.status() >= 400 && problems.push(`HTTP ${response.status()}: ${response.url()}`));
    if (installed) {
        await page.addInitScript(standalone);
    }
    const response = await page.goto('/demo/shell-portal.html', { waitUntil: 'networkidle' });
    expect(response.status()).toBe(200);
    return problems;
}

/**
 * Touch the main area and drag down, optionally without lifting the finger.
 * @param {import('@playwright/test').Page} page page to drive
 * @param {number} distance dragged distance in px
 * @param {boolean} [release] lift the finger at the end
 */
async function pull(page, distance, release = true) {
    await page.evaluate(({ dy, lift }) => {
        const target = document.querySelector('.app__main');
        const touch = (y) => new Touch({ identifier: 1, target, clientX: 195, clientY: y, pageX: 195, pageY: y + window.scrollY });
        const fire = (type, y) => target.dispatchEvent(new TouchEvent(type, {
            bubbles: true, cancelable: true, composed: true,
            touches: type === 'touchend' ? [] : [touch(y)], targetTouches: type === 'touchend' ? [] : [touch(y)], changedTouches: [touch(y)]
        }));
        fire('touchstart', 200);
        for (let step = 1; step <= 8; step += 1) {
            fire('touchmove', 200 + (dy * step) / 8);
        }
        if (lift) {
            fire('touchend', 200 + dy);
        }
    }, { dy: distance, lift: release });
}

test('the indicator follows a pull, arms past the threshold, and a release refreshes once', async ({ page }) => {
    const problems = await openPortal(page, true);
    await expect(page.locator('html')).toHaveAttribute('data-pull-refresh', '');
    const indicator = page.locator('.app__overlays > .app__pull-indicator');
    await expect(indicator).toBeHidden();
    await expect(indicator).toHaveAttribute('aria-hidden', 'true');

    await pull(page, 80, false);
    await expect(indicator).toBeVisible();
    await expect(indicator).toHaveAttribute('data-state', 'pulling');
    const short = await indicator.boundingBox();
    await pull(page, 200, false);
    await expect(indicator).toHaveAttribute('data-state', 'armed');
    const long = await indicator.boundingBox();
    expect(long.y - short.y).toBeCloseTo(96 - 40, 0);
    expect(long.width).toBeGreaterThanOrEqual(44);
    expect(Math.round(long.x + long.width / 2)).toBe(Math.round(page.viewportSize().width / 2));
    const bar = await page.locator('.app__top-bar').boundingBox();
    expect(long.y).toBeGreaterThan(bar.y + bar.height);
    await expect(indicator).toHaveCSS('opacity', '1');
    await expect(indicator).toHaveCSS('position', 'fixed');

    await page.evaluate(() => document.querySelector('.app__main').dispatchEvent(new TouchEvent('touchend', { bubbles: true, cancelable: true, touches: [], changedTouches: [] })));
    await expect(indicator).toHaveAttribute('data-state', 'refreshing');
    await expect(page.locator('.toast-region .toast__text')).toHaveText(['Sample page refreshed.']);
    await expect(indicator).toBeHidden();
    await expect(page.locator('.toast-region .toast__text')).toHaveCount(1);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(problems).toEqual([]);
});

test('a short pull lets the indicator go without refreshing', async ({ page }) => {
    const problems = await openPortal(page, true);
    await pull(page, 80);
    await expect(page.locator('.app__pull-indicator')).toBeHidden();
    await page.waitForTimeout(300);
    await expect(page.locator('.toast-region .toast__text')).toHaveCount(0);
    expect(problems).toEqual([]);
});

test('in a browser tab the gesture stays off, leaving the browser its own pull-to-refresh', async ({ page }) => {
    const problems = await openPortal(page, false);
    await expect(page.locator('html')).not.toHaveAttribute('data-pull-refresh');
    await expect(page.locator('html')).toHaveCSS('overscroll-behavior-y', 'auto');
    await pull(page, 200);
    await page.waitForTimeout(300);
    await expect(page.locator('.app__pull-indicator')).toBeHidden();
    await expect(page.locator('.toast-region .toast__text')).toHaveCount(0);
    expect(problems).toEqual([]);
});

test('the installed page keeps the browser from its native overscroll reload', async ({ page }) => {
    const problems = await openPortal(page, true);
    await expect(page.locator('html')).toHaveCSS('overscroll-behavior-y', 'contain');
    expect(problems).toEqual([]);
});
