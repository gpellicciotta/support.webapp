// Browser checks of the app shell (ADR-0004): generic layout examples at each configured viewport.
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
    { name: 'list-editor', title: 'List editor', path: '/demo/shell-list-editor.html', scroll: 'main', width: null,
        areas: ['top-bar', 'sidebar', 'banners', 'main', 'side-panel', 'action-bar', 'bottom-nav', 'overlays'] },
    { name: 'toolbar', title: 'Toolbar', path: '/demo/shell-toolbar.html', scroll: 'page', width: null,
        areas: ['top-bar', 'banners', 'main', 'action-bar', 'overlays'] },
    { name: 'single-screen', title: 'Single screen', path: '/demo/shell-single-screen.html', scroll: 'page', width: NARROW,
        areas: ['top-bar', 'banners', 'main', 'action-bar', 'overlays'] },
    { name: 'portal', title: 'Portal', path: '/demo/shell-portal.html', scroll: 'page', width: null,
        areas: ['top-bar', 'banners', 'main', 'action-bar', 'overlays'] },
    { name: 'admin-console', title: 'Admin console', path: '/demo/shell-admin-console.html', scroll: 'main', width: null,
        desktopOnly: true, panelOpen: true,
        areas: ['top-bar', 'sidebar', 'banners', 'main', 'side-panel', 'overlays'] }
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

/**
 * Measure the offsets of the top bar's edge items from the main area's content edges.
 * Icon buttons count by their glyph box, other items by their own box; closed popovers and hidden items are skipped.
 * @param {import('@playwright/test').Page} page page to probe
 * @returns {Promise<{start: number, end: number, first: string, last: string}>} signed offsets in px, positive inward
 */
function topBarEdges(page) {
    return page.evaluate(() => {
        const main = document.querySelector('body > .app__main');
        const style = getComputedStyle(main);
        const rect = main.getBoundingClientRect();
        const content = { start: rect.left + parseFloat(style.paddingLeft), end: rect.right - parseFloat(style.paddingRight) };
        const shown = (element) => element.getClientRects().length > 0 && !element.matches('[popover]');
        const items = [...document.querySelector('body > .app__top-bar').children]
            .flatMap((child) => (child.matches('.app__top-actions') ? [...child.children] : [child]))
            .filter(shown);
        const box = (element) => (element.matches('.icon-button') ? element.querySelector('.icon') : element).getBoundingClientRect();
        const name = (element) => element.getAttribute('aria-label') ?? element.className;
        const first = items[0];
        const last = items.at(-1);
        return { start: box(first).left - content.start, end: content.end - box(last).right, first: name(first), last: name(last) };
    });
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
            test.skip(Boolean(demo.desktopOnly) && page.viewportSize().width < BREAKPOINT, 'admin-console targets desktop widths');
            const problems = await openDemo(page, demo.path);
            await expect(page).toHaveTitle(`${demo.title} shell demo · support.webapp`);
            const { width } = page.viewportSize();
            const wide = width >= BREAKPOINT;
            await expect(page.locator('body')).toHaveClass(new RegExp(`\\bapp--scroll-${demo.scroll}\\b`));
            for (const area of AREAS) {
                await expect(page.locator(`body > .app__${area}`), area).toHaveCount(demo.areas.includes(area) ? 1 : 0);
            }
            const main = await areaBox(page, 'main');
            const sidebar = await areaBox(page, 'sidebar');
            const sidePanel = await areaBox(page, 'side-panel');
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
            if (demo.panelOpen && wide) {
                expect(sidePanel.width).toBeCloseTo(SIDE_PANEL, 0);
                expect(sidePanel.x + sidePanel.width).toBeCloseTo(width, 0);
                expect(main.x + main.width).toBeCloseTo(sidePanel.x, 0);
            }
            else {
                // The hidden side panel leaves no track, so the main area reaches the end edge.
                expect(main.x + main.width).toBeCloseTo(width, 0);
            }
            await expect(page.locator('nav[aria-label="Main"]:visible')).toHaveCount(demo.areas.includes('sidebar') ? 1 : 0);
            const top = await areaBox(page, 'top-bar');
            expect(top.y).toBe(0);
            expect(await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)).toBe(0);
            expect(problems).toEqual([]);
        });

        test(`scrolls the ${demo.scroll === 'main' ? 'main area' : 'page'} and keeps the bars in place`, async ({ page }) => {
            test.skip(Boolean(demo.desktopOnly) && page.viewportSize().width < BREAKPOINT, 'admin-console targets desktop widths');
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
            if (action) {
                expect(action.y + action.height).toBeCloseTo(bottomNav ? bottomNav.y : height, 0);
            }
            expect(problems).toEqual([]);
        });

        test('puts the toast region in the overlay layer above the bottom bars', async ({ page }) => {
            test.skip(Boolean(demo.desktopOnly) && page.viewportSize().width < BREAKPOINT, 'admin-console targets desktop widths');
            const problems = await openDemo(page, demo.path);
            const region = page.locator('body > .app__overlays > .toast-region');
            await expect(region).toHaveCount(1);
            await expect(region).toHaveCSS('position', 'fixed');
            await page.locator('[data-demo-toast]').click();
            const toast = region.locator('.toast').first();
            await expect(toast).toBeVisible();
            const box = await toast.boundingBox();
            const action = await areaBox(page, 'action-bar');
            expect(box.y + box.height).toBeLessThanOrEqual(action ? action.y + 0.5 : page.viewportSize().height);
            expect(problems).toEqual([]);
        });

        test('leads the first Tab to a skip link that moves focus to the main area', async ({ page }) => {
            test.skip(Boolean(demo.desktopOnly) && page.viewportSize().width < BREAKPOINT, 'admin-console targets desktop widths');
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
            test.skip(Boolean(demo.desktopOnly) && page.viewportSize().width < BREAKPOINT, 'admin-console targets desktop widths');
            const problems = await openDemo(page, demo.path);
            for (const nav of await page.locator('nav').all()) {
                if (await nav.locator('a').count() > 0 && !(await nav.evaluate((element) => element.closest('.gallery-controls')))) {
                    await expect(nav.locator('[aria-current="page"]'), await nav.getAttribute('aria-label')).toHaveCount(1);
                }
            }
            expect(problems).toEqual([]);
        });

        test('aligns the top bar edge text and glyphs with the content column', async ({ page }) => {
            test.skip(Boolean(demo.desktopOnly) && page.viewportSize().width < BREAKPOINT, 'admin-console targets desktop widths');
            const problems = await openDemo(page, demo.path);
            const edges = await topBarEdges(page);
            expect(Math.abs(edges.start), `start offset of ${edges.first}`).toBeLessThan(0.5);
            expect(Math.abs(edges.end), `end offset of ${edges.last}`).toBeLessThan(0.5);
            expect(problems).toEqual([]);
        });
    });
}

test('single-screen centers its main column at the narrow width', async ({ page }) => {
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

test('single-screen hides its banners area while every banner is hidden', async ({ page }) => {
    await openDemo(page, demos[2].path);
    expect(await areaBox(page, 'banners')).toBeNull();
    await page.locator('.app__banners > .banner').evaluate((banner) => {
        banner.hidden = false;
    });
    const banners = await areaBox(page, 'banners');
    expect(banners.height).toBeGreaterThan(0);
});

test('single-screen switches between generic start, details, and settings views', async ({ page }) => {
    const problems = await openDemo(page, demos[2].path);
    const details = page.getByRole('button', { name: 'Details', exact: true });
    await expect(details).toHaveCount(1);
    for (const name of ['Details', 'Settings', 'Start']) {
        await page.getByRole('button', { name, exact: true }).click();
        await expect(page.locator('.app__main > section:visible')).toHaveCount(1);
        await expect(page.locator('.app__main > section:visible h2')).toHaveText(name);
    }
    expect(problems).toEqual([]);
});

test('list-editor opens its side panel beside the main column or as a full-window sheet', async ({ page }) => {
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

test('the toolbar overflow button sits at the bar end and opens its sample menu', async ({ page }) => {
    const problems = await openDemo(page, demos[1].path);
    const button = page.locator('.app__top-bar > .app__top-actions > .icon-button');
    const menu = page.locator('#toolbar-menu');
    await expect(button).toHaveAttribute('aria-haspopup', 'menu');
    await expect(button).toHaveAccessibleName('More actions');
    await expect(button.locator('use')).toHaveAttribute('href', /#icon-more$/);
    const edges = await topBarEdges(page);
    expect(edges.first).toBe('app__title');
    expect(edges.last).toBe('More actions');
    await button.click();
    await expect(button).toHaveAttribute('aria-expanded', 'true');
    await expect(menu).toBeVisible();
    await expect(menu.getByRole('menuitem').first()).toBeFocused();
    await page.keyboard.press('Escape');
    await expect(menu).toBeHidden();
    await expect(button).toBeFocused();
    expect(problems).toEqual([]);
});

for (const bar of ['top-bar', 'action-bar']) {
    test(`the ${bar.replace('-', ' ')} pads both sides with the main column formula and their own safe-area insets`, () => {
        const shell = readFileSync(fileURLToPath(new URL('../../src/css/shell.css', import.meta.url)), 'utf8');
        const rule = shell.match(new RegExp(`\\.app__${bar} \\{[^}]*\\}`))[0];
        const padding = rule.match(/padding-inline:([^;]*);/)[1];
        const [start, end] = padding.split(/\)\s+max\(/);
        for (const side of [start, end]) {
            expect(side).toContain('var(--gutter), (100% - var(--_app-width)) / 2');
        }
        expect(start).toContain('env(safe-area-inset-left)');
        expect(start).not.toContain('safe-area-inset-right');
        expect(end).toContain('env(safe-area-inset-right)');
        expect(end).not.toContain('safe-area-inset-left');
    });
}

test('the gallery links to every shell demo page', async ({ page }, testInfo) => {
    await page.goto(GALLERY, { waitUntil: 'networkidle' });
    if (process.env.T0048_BEFORE) {
        await page.locator('#shell').screenshot({ path: `${process.env.T0048_BEFORE}/before-shell-${testInfo.project.name}.png` });
    }
    for (const demo of demos) {
        const link = page.locator(`#shell a[href="${demo.path.replace('/demo/', '')}"]`);
        await expect(link, demo.name).toHaveCount(1);
        await expect(link.locator('.card__title')).toHaveText(`${demo.title} layout`);
        const response = await page.request.get(demo.path);
        expect(response.status(), demo.name).toBe(200);
    }
    if (process.env.T0048_AFTER) {
        await page.locator('#shell').screenshot({ path: `${process.env.T0048_AFTER}/after-shell-${testInfo.project.name}.png` });
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
