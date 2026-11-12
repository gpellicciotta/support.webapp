// Browser checks of the app shell (ADR-0004): one demo page per adopter's settings, at the viewport of each project.
import { expect, test } from '@playwright/test';
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { GALLERY } from './gallery-helpers.js';

const AREAS = ['top-bar', 'sidebar', 'banners', 'main', 'side-panel', 'action-bar', 'bottom-nav', 'overlays'];
// The one layout breakpoint, 64rem at the 16 px root size.
const BREAKPOINT = 1024;
const SIDEBAR = 256;
const SIDE_PANEL = 400;
const NARROW = 880;

const demos = [
    { name: 'todos', path: '/demo/shell-todos.html', scroll: 'main', width: null,
        areas: ['top-bar', 'sidebar', 'banners', 'main', 'side-panel', 'action-bar', 'bottom-nav', 'overlays'] },
    { name: 'counters', path: '/demo/shell-counters.html', scroll: 'page', width: null,
        areas: ['top-bar', 'banners', 'main', 'action-bar', 'overlays'] },
    { name: 'meteo', path: '/demo/shell-meteo.html', scroll: 'page', width: NARROW,
        areas: ['top-bar', 'banners', 'main', 'action-bar', 'overlays'] },
    { name: 'family-portal', path: '/demo/shell-family-portal.html', scroll: 'page', width: null,
        areas: ['top-bar', 'banners', 'main', 'action-bar', 'overlays'] }
];

/**
 * Open a demo page and fail on console, page, and HTTP errors.
 * @param {import('@playwright/test').Page} page page to drive
 * @param {string} path demo page path
 * @returns {Promise<string[]>} live problem list
 */
async function openDemo(page, path) {
    const problems = [];
    page.on('console', (message) => message.type() === 'error' && problems.push(`console: ${message.text()}`));
    page.on('pageerror', (error) => problems.push(`page: ${error.message}`));
    page.on('response', (response) => response.status() >= 400 && problems.push(`HTTP ${response.status()}: ${response.url()}`));
    const response = await page.goto(path, { waitUntil: 'networkidle' });
    expect(response.status()).toBe(200);
    await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' });
    return problems;
}

/**
 * Read the viewport box of an area, or null when it is absent or not rendered.
 * @param {import('@playwright/test').Page} page page to probe
 * @param {string} area area name without the `app__` prefix
 * @returns {Promise<{x: number, y: number, width: number, height: number}|null>} the box
 */
function areaBox(page, area) {
    return page.evaluate((name) => {
        const element = document.querySelector(`body > .app__${name}`);
        if (!element || getComputedStyle(element).display === 'none') {
            return null;
        }
        const { x, y, width, height } = element.getBoundingClientRect();
        return { x, y, width, height };
    }, area);
}

/** Append tall content to the main area, so either the main area or the page has to scroll. */
function makeTall(page) {
    return page.evaluate(() => {
        const filler = document.createElement('div');
        filler.className = 'shell-test-filler';
        filler.style.blockSize = '3000px';
        document.querySelector('.app__main').append(filler);
    });
}

for (const demo of demos) {
    test.describe(`${demo.name} shell demo`, () => {
        test('renders its areas and drops the absent ones', async ({ page }) => {
            const problems = await openDemo(page, demo.path);
            const { width } = page.viewportSize();
            const wide = width >= BREAKPOINT;
            await expect(page.locator('body')).toHaveClass(new RegExp(`\\bapp--scroll-${demo.scroll}\\b`));
            for (const area of AREAS) {
                await expect(page.locator(`body > .app__${area}`), area).toHaveCount(demo.areas.includes(area) ? 1 : 0);
            }
            const main = await areaBox(page, 'main');
            const sidebar = await areaBox(page, 'sidebar');
            const bottomNav = await areaBox(page, 'bottom-nav');
            if (demo.areas.includes('sidebar') && wide) {
                expect(sidebar.width).toBeCloseTo(SIDEBAR, 0);
                expect(main.x).toBeCloseTo(sidebar.x + sidebar.width, 0);
            }
            else {
                expect(sidebar).toBeNull();
                expect(main.x).toBe(0);
            }
            if (demo.areas.includes('bottom-nav') && !wide) {
                expect(bottomNav.y + bottomNav.height).toBeCloseTo(page.viewportSize().height, 0);
            }
            else {
                expect(bottomNav).toBeNull();
            }
            // The hidden side panel leaves no track, so the main area reaches the end edge.
            expect(main.x + main.width).toBeCloseTo(width, 0);
            await expect(page.locator('nav[aria-label="Main"]:visible')).toHaveCount(demo.areas.includes('sidebar') ? 1 : 0);
            const top = await areaBox(page, 'top-bar');
            expect(top.y).toBe(0);
            expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
            expect(problems).toEqual([]);
        });

        test(`scrolls the ${demo.scroll === 'main' ? 'main area' : 'page'} and keeps the bars in place`, async ({ page }) => {
            const problems = await openDemo(page, demo.path);
            const { height } = page.viewportSize();
            await makeTall(page);
            const owner = await page.evaluate(() => {
                const root = document.scrollingElement;
                const main = document.querySelector('.app__main');
                return { page: root.scrollHeight > root.clientHeight, main: main.scrollHeight > main.clientHeight, overflow: getComputedStyle(main).overflowY };
            });
            if (demo.scroll === 'main') {
                expect(owner).toEqual({ page: false, main: true, overflow: 'auto' });
                await page.locator('.app__main').evaluate((main) => main.scrollTo(0, 1500));
                expect(await page.locator('.app__main').evaluate((main) => main.scrollTop)).toBe(1500);
            }
            else {
                expect(owner.page).toBe(true);
                expect(owner.overflow).toBe('visible');
                await page.evaluate(() => window.scrollTo(0, 1500));
                expect(await page.evaluate(() => window.scrollY)).toBe(1500);
                await expect(page.locator('.app__top-bar')).toHaveCSS('position', 'sticky');
                await expect(page.locator('.app__action-bar')).toHaveCSS('position', 'sticky');
            }
            const top = await areaBox(page, 'top-bar');
            const action = await areaBox(page, 'action-bar');
            const bottomNav = await areaBox(page, 'bottom-nav');
            expect(top.y).toBeCloseTo(0, 0);
            expect(action.y + action.height).toBeCloseTo(bottomNav ? bottomNav.y : height, 0);
            expect(problems).toEqual([]);
        });

        test('puts the toast region in the overlay layer above the bottom bars', async ({ page }) => {
            const problems = await openDemo(page, demo.path);
            const region = page.locator('body > .app__overlays > .toast-region');
            await expect(region).toHaveCount(1);
            await expect(region).toHaveCSS('position', 'fixed');
            await page.locator('[data-demo-toast]').click();
            const toast = region.locator('.toast').first();
            await expect(toast).toBeVisible();
            const box = await toast.boundingBox();
            const action = await areaBox(page, 'action-bar');
            expect(box.y + box.height).toBeLessThanOrEqual(action.y + 0.5);
            expect(problems).toEqual([]);
        });

        test('leads the first Tab to a skip link that moves focus to the main area', async ({ page }) => {
            const problems = await openDemo(page, demo.path);
            const skip = page.locator('body > .skip-link');
            await expect(skip).toHaveAttribute('href', '#main');
            await page.keyboard.press('Tab');
            await expect(skip).toBeFocused();
            const box = await skip.boundingBox();
            expect(box.y).toBeGreaterThanOrEqual(0);
            expect(box.height).toBeGreaterThanOrEqual(44);
            await page.keyboard.press('Enter');
            await expect(page.locator('#main')).toBeFocused();
            expect(problems).toEqual([]);
        });

        test('marks one current entry in each navigation', async ({ page }) => {
            const problems = await openDemo(page, demo.path);
            for (const nav of await page.locator('nav').all()) {
                if (await nav.locator('a').count() > 0 && !(await nav.evaluate((element) => element.closest('.gallery-controls')))) {
                    await expect(nav.locator('[aria-current="page"]'), await nav.getAttribute('aria-label')).toHaveCount(1);
                }
            }
            expect(problems).toEqual([]);
        });
    });
}

test('meteo centers its main column at the narrow width', async ({ page }) => {
    await openDemo(page, demos[2].path);
    const { width } = page.viewportSize();
    const column = await page.locator('.app__main > section:not([hidden])').first().boundingBox();
    if (width >= NARROW + 64) {
        expect(column.width).toBeCloseTo(NARROW, 0);
        expect(column.x).toBeCloseTo((width - NARROW) / 2, 0);
    }
    else {
        expect(column.width).toBeLessThan(width);
        expect(column.x).toBeCloseTo(width - column.x - column.width, 0);
    }
});

test('meteo hides its banners area while every banner is hidden', async ({ page }) => {
    await openDemo(page, demos[2].path);
    expect(await areaBox(page, 'banners')).toBeNull();
    await page.locator('.app__banners > .banner').evaluate((banner) => {
        banner.hidden = false;
    });
    const banners = await areaBox(page, 'banners');
    expect(banners.height).toBeGreaterThan(0);
});

test('todos opens its side panel beside the main column or as a full-window sheet', async ({ page }) => {
    const problems = await openDemo(page, demos[0].path);
    const { width, height } = page.viewportSize();
    const panel = page.locator('.app__side-panel');
    await expect(panel).toBeHidden();
    await page.locator('[data-demo-panel-open]').first().click();
    await expect(panel).toBeVisible();
    const box = await panel.boundingBox();
    const main = await areaBox(page, 'main');
    if (width >= BREAKPOINT) {
        expect(box.width).toBeCloseTo(SIDE_PANEL, 0);
        expect(box.x + box.width).toBeCloseTo(width, 0);
        expect(main.x + main.width).toBeCloseTo(box.x, 0);
        expect(box.height).toBeCloseTo(height, 0);
    }
    else {
        expect(box).toEqual({ x: 0, y: 0, width, height });
        expect(main.x + main.width).toBeCloseTo(width, 0);
    }
    await panel.locator('[data-demo-panel-close]').click();
    await expect(panel).toBeHidden();
    expect(problems).toEqual([]);
});

test('a shell without a scroll modifier scrolls the main area, as the default app--scroll-main does', async ({ page }) => {
    const problems = await openDemo(page, demos[0].path);
    const { width, height } = page.viewportSize();
    await page.evaluate(() => document.body.classList.remove('app--scroll-main'));
    await expect(page.locator('body')).toHaveAttribute('class', 'app');
    await makeTall(page);
    const owner = await page.evaluate(() => {
        const root = document.scrollingElement;
        const main = document.querySelector('.app__main');
        return { body: document.body.getBoundingClientRect().height, page: root.scrollHeight > root.clientHeight,
            main: main.scrollHeight > main.clientHeight, overflow: getComputedStyle(main).overflowY };
    });
    expect(owner).toEqual({ body: height, page: false, main: true, overflow: 'auto' });
    await page.locator('.app__main').evaluate((main) => main.scrollTo(0, 1500));
    expect(await page.locator('.app__main').evaluate((main) => main.scrollTop)).toBe(1500);
    const top = await areaBox(page, 'top-bar');
    const action = await areaBox(page, 'action-bar');
    const bottomNav = await areaBox(page, 'bottom-nav');
    expect(top.y).toBe(0);
    expect(action.y + action.height).toBeCloseTo(width >= BREAKPOINT ? height : bottomNav.y, 0);
    if (bottomNav) {
        expect(bottomNav.y + bottomNav.height).toBeCloseTo(height, 0);
    }
    expect(problems).toEqual([]);
});

test('the page scroll mode keeps the sidebar and side panel at the full viewport height on wide screens', async ({ page }) => {
    const { width, height } = page.viewportSize();
    test.skip(width < BREAKPOINT, 'the sidebar and the side panel column exist only in the wide layout');
    const problems = await openDemo(page, demos[0].path);
    await page.evaluate(() => document.body.classList.replace('app--scroll-main', 'app--scroll-page'));
    await page.locator('[data-demo-panel-open]').first().click();
    await makeTall(page);
    await page.evaluate(() => window.scrollTo(0, 1500));
    expect(await page.evaluate(() => window.scrollY)).toBe(1500);
    for (const area of ['sidebar', 'side-panel']) {
        await expect(page.locator(`.app__${area}`), area).toHaveCSS('position', 'sticky');
        const box = await areaBox(page, area);
        expect(box.y, area).toBeCloseTo(0, 0);
        expect(box.height, area).toBeCloseTo(height, 0);
    }
    expect(problems).toEqual([]);
});

test('the counters menu button opens its sample menu', async ({ page }) => {
    const problems = await openDemo(page, demos[1].path);
    const button = page.locator('.app__menu-button');
    const menu = page.locator('#counters-menu');
    await expect(button).toHaveAttribute('aria-haspopup', 'menu');
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('menuitem').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(button).toBeFocused();
    expect(problems).toEqual([]);
});

test('the action bar pads both sides with their own safe-area insets', () => {
    const shell = readFileSync(fileURLToPath(new URL('../../src/css/shell.css', import.meta.url)), 'utf8');
    const rule = shell.match(/\.app__action-bar \{[^}]*\}/)[0];
    const padding = rule.match(/padding-inline:([^;]*);/)[1];
    const [start, end] = padding.split(/\)\s+max\(/);
    expect(start).toContain('env(safe-area-inset-left)');
    expect(start).not.toContain('safe-area-inset-right');
    expect(end).toContain('env(safe-area-inset-right)');
    expect(end).not.toContain('safe-area-inset-left');
});

test('the gallery links to every shell demo page', async ({ page }) => {
    await page.goto(GALLERY, { waitUntil: 'networkidle' });
    for (const demo of demos) {
        const link = page.locator(`#shell a[href="${demo.path.replace('/demo/', '')}"]`);
        await expect(link, demo.name).toHaveCount(1);
        const response = await page.request.get(demo.path);
        expect(response.status(), demo.name).toBe(200);
    }
});

test('only shell.css sets fixed or sticky positions and pads bars with safe-area insets', () => {
    const root = fileURLToPath(new URL('../../src/css/', import.meta.url));
    const files = (dir) => readdirSync(dir).flatMap((name) => (statSync(join(dir, name)).isDirectory() ? files(join(dir, name)) : [join(dir, name)]));
    const offenders = files(root).filter((path) => path.endsWith('.css') && !path.endsWith('shell.css'))
        .filter((path) => /position:\s*(fixed|sticky)/.test(readFileSync(path, 'utf8')));
    expect(offenders).toEqual([]);
    const shell = readFileSync(join(root, 'shell.css'), 'utf8');
    for (const edge of ['top', 'bottom', 'left', 'right']) {
        expect(shell, edge).toContain(`env(safe-area-inset-${edge})`);
    }
    expect(readFileSync(join(root, 'style.css'), 'utf8')).toContain("@import url('shell.css');");
});
