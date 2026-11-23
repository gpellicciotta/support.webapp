import { expect, test } from '@playwright/test';
import { resolve } from 'node:path';
import { looks } from '../../src/demo/gallery.js';
import { openGallery, selectGalleryLook, settleGalleryStyles, styles, tokenColor, tokenLength } from './gallery-helpers.js';

const evidence = process.env.PAGE_EVIDENCE;
const baseline = process.env.PAGE_BASELINE;

/**
 * Resolve a font-family token to its computed value in the current page.
 * @param {import('@playwright/test').Page} page page to probe
 * @param {string} token token name, such as `--font-body`
 * @returns {Promise<string>} computed font family
 */
function tokenFont(page, token) {
    return page.evaluate((name) => {
        const probe = document.createElement('span');
        probe.style.fontFamily = `var(${name})`;
        document.body.append(probe);
        const value = getComputedStyle(probe).fontFamily;
        probe.remove();
        return value;
    }, token);
}

/**
 * Resolve a typographic property token to its computed value in the current page.
 * @param {import('@playwright/test').Page} page page to probe
 * @param {string} property CSS property name
 * @param {string} token token name
 * @returns {Promise<string>} computed value
 */
function tokenValue(page, property, token) {
    return page.evaluate(([prop, name]) => {
        const probe = document.createElement('span');
        probe.style.setProperty(prop, `var(${name})`);
        document.body.append(probe);
        const value = getComputedStyle(probe).getPropertyValue(prop);
        probe.remove();
        return value;
    }, [property, token]);
}

/**
 * Load a minimal document with only the look's entry stylesheet (no gallery.css).
 * @param {import('@playwright/test').Page} page page to load
 * @param {string} look look folder name
 * @param {'light'|'dark'} theme explicit theme attribute
 */
async function openBareLook(page, look, theme) {
    const errors = [];
    page.on('console', (message) => message.type() === 'error' && errors.push(`console: ${message.text()}`));
    page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
    page.on('response', (response) => response.status() >= 400 && errors.push(`HTTP ${response.status()}: ${response.url()}`));
    // Start on a same-origin empty document so relative look URLs resolve against the dev server.
    await page.goto('/demo/visual-style-gallery.html', { waitUntil: 'domcontentloaded' });
    await page.setContent(`<!doctype html>
<html lang="en" data-theme="${theme}">
<head>
    <meta charset="utf-8">
    <title>Page base probe</title>
    <link rel="stylesheet" href="/looks/${look}/index.css">
</head>
<body>
    <main>
        <h1>Heading one</h1>
        <h2>Heading two</h2>
        <h3>Heading three</h3>
        <p>Body paragraph with an <a id="inline-link" href="#top">inline link</a> and <code>inline code</code>.</p>
        <p><a id="button-link" class="button" href="#top">Button link</a></p>
        <article id="hidden-card" class="card" hidden><p>Hidden card</p></article>
        <div id="until-found-panel" hidden="until-found"><p>Findable hidden panel</p></div>
    </main>
</body>
</html>`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    await settleGalleryStyles(page);
    return errors;
}

for (const look of looks) {
    for (const theme of ['light', 'dark']) {
        test(`${look} look (${theme}) applies page base tokens, component precedence, hidden guard, and opt-out`, async ({ page }) => {
            const errors = await openBareLook(page, look, theme);

            const bg = await tokenColor(page, '--color-bg');
            const text = await tokenColor(page, '--color-text');
            const linkColor = await tokenColor(page, '--color-link');
            const linkHoverColor = await tokenColor(page, '--color-link-hover');
            const onPrimary = await tokenColor(page, '--color-on-primary');
            const focusWidth = await tokenLength(page, '--focus-ring-width');
            const fontBody = await tokenFont(page, '--font-body');
            const fontHeading = await tokenFont(page, '--font-heading');
            const fontMono = await tokenFont(page, '--font-mono');
            const textBase = await tokenValue(page, 'font-size', '--text-base');
            const textSm = await tokenValue(page, 'font-size', '--text-sm');
            const textLg = await tokenValue(page, 'font-size', '--text-lg');
            const textXl = await tokenValue(page, 'font-size', '--text-xl');
            const weightRegular = await tokenValue(page, 'font-weight', '--weight-regular');
            const weightSemibold = await tokenValue(page, 'font-weight', '--weight-semibold');

            expect(await styles(page.locator('body'), ['background-color', 'color', 'font-family', 'font-size', 'font-weight'])).toEqual({
                'background-color': bg,
                color: text,
                'font-family': fontBody,
                'font-size': textBase,
                'font-weight': weightRegular
            });

            expect(await styles(page.locator('h1'), ['font-family', 'font-size', 'font-weight'])).toEqual({
                'font-family': fontHeading,
                'font-size': textXl,
                'font-weight': weightSemibold
            });
            expect(await styles(page.locator('h2'), ['font-family', 'font-size', 'font-weight'])).toEqual({
                'font-family': fontHeading,
                'font-size': textLg,
                'font-weight': weightSemibold
            });
            expect(await styles(page.locator('h3'), ['font-family', 'font-size', 'font-weight'])).toEqual({
                'font-family': fontHeading,
                'font-size': textBase,
                'font-weight': weightSemibold
            });

            const link = page.locator('#inline-link');
            expect(await styles(link, ['color'])).toEqual({ color: linkColor });
            await link.hover();
            expect(await styles(link, ['color', 'text-decoration-thickness'])).toEqual({
                color: linkHoverColor,
                'text-decoration-thickness': focusWidth
            });

            // A component class on an anchor still wins on hover.
            const buttonLink = page.locator('#button-link');
            await buttonLink.hover();
            expect(await styles(buttonLink, ['color'])).toEqual({ color: onPrimary });

            expect(await styles(page.locator('code'), ['font-family', 'font-size'])).toEqual({
                'font-family': fontMono,
                'font-size': textSm
            });

            // Plain hidden hides even a flex component; hidden="until-found" keeps its box for find in page.
            expect(await styles(page.locator('#hidden-card'), ['display'])).toEqual({ display: 'none' });
            const untilFound = await styles(page.locator('#until-found-panel'), ['display', 'content-visibility']);
            expect(untilFound.display).not.toBe('none');
            expect(untilFound['content-visibility']).toBe('hidden');

            // Setting data-page-base="off" on <html> opts out of bare element styles while keeping the [hidden] guard.
            await page.evaluate(() => document.documentElement.setAttribute('data-page-base', 'off'));
            expect(await styles(page.locator('body'), ['background-color'])).toEqual({ 'background-color': 'rgba(0, 0, 0, 0)' });
            expect(await styles(page.locator('#hidden-card'), ['display'])).toEqual({ display: 'none' });

            expect(errors).toEqual([]);
        });
    }
}

test('gallery page base section renders cleanly across looks', async ({ page }, testInfo) => {
    const problems = await openGallery(page);
    if (baseline && evidence) {
        await page.locator('#tokens-widths').scrollIntoViewIfNeeded();
        await page.screenshot({ path: resolve(evidence, `before-gallery-${testInfo.project.name}.png`) });
        expect(problems).toEqual([]);
        return;
    }
    const section = page.locator('#page');
    for (const look of looks) {
        await selectGalleryLook(page, look);
        await section.scrollIntoViewIfNeeded();
        await expect(section).toBeVisible();
        expect(await styles(section.locator('[data-page-hidden]'), ['display'])).toEqual({ display: 'none' });
        const untilFound = await styles(section.locator('[data-page-until-found]'), ['display', 'content-visibility']);
        expect(untilFound.display).not.toBe('none');
        expect(untilFound['content-visibility']).toBe('hidden');
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        if (evidence) {
            await section.screenshot({ path: resolve(evidence, `after-page-${look}-${testInfo.project.name}.png`) });
        }
    }
    expect(problems).toEqual([]);
});
