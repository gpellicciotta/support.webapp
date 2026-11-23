import { expect, test } from '@playwright/test';
import { resolve } from 'node:path';
import { looks } from '../../src/demo/gallery.js';
import { openGallery, selectGalleryLook, settleGalleryStyles, styles, tokenColor, tokenLength } from './gallery-helpers.js';

const proofDir = process.env.VIEW_HEADER_PROOF;
const baseline = process.env.VIEW_HEADER_BASELINE;

/**
 * Resolve a typographic CSS property token to its computed value.
 * @param {import('@playwright/test').Page} page page to probe
 * @param {string} property CSS property name
 * @param {string} token custom property name
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

if (baseline && proofDir) {
    test('captures baseline gallery view before adding view-header', async ({ page }, testInfo) => {
        const problems = await openGallery(page);
        await page.locator('#toolbar').scrollIntoViewIfNeeded();
        await page.screenshot({ path: resolve(proofDir, `before-gallery-${testInfo.project.name}.png`) });
        expect(problems).toEqual([]);
    });
}

for (const look of looks) {
    test(`${look} view header renders title, muted summary, and zero-height empty summary`, async ({ page }, testInfo) => {
        const failures = [];
        page.on('requestfailed', request => failures.push(request.url()));
        const problems = await openGallery(page);
        await selectGalleryLook(page, look);

        const section = page.locator('#view-header');
        await expect(section).toBeVisible({ timeout: 1000 });
        await section.scrollIntoViewIfNeeded();

        const statusHeader = section.locator('[data-view-header="status"]');
        const titleOnlyHeader = section.locator('[data-view-header="title-only"]');
        const emptyHeader = section.locator('[data-view-header="empty"]');

        const headingFont = await tokenValue(page, 'font-family', '--font-heading');
        const titleSize = await tokenValue(page, 'font-size', '--text-2xl');
        const titleWeight = await tokenValue(page, 'font-weight', '--weight-semibold');
        const mutedColor = await tokenColor(page, '--color-text-muted');
        const gap = parseFloat(await tokenLength(page, '--space-1'));
        const marginEnd = await tokenLength(page, '--space-4');

        // Title uses the heading font and page title size even on an h3.
        const statusTitle = statusHeader.locator('.view-header__title');
        expect(await styles(statusTitle, ['font-family', 'font-size', 'font-weight', 'margin-top', 'margin-bottom'])).toEqual({
            'font-family': headingFont,
            'font-size': titleSize,
            'font-weight': titleWeight,
            'margin-top': '0px',
            'margin-bottom': '0px'
        });
        expect(await styles(statusHeader, ['margin-block-end'])).toEqual({ 'margin-block-end': marginEnd });

        const statusText = statusHeader.locator('[data-view-header-text]');
        await expect(statusText).toHaveAttribute('role', 'status');
        expect(await styles(statusText, ['color', 'margin-top', 'margin-bottom'])).toEqual({
            color: mutedColor,
            'margin-top': '0px',
            'margin-bottom': '0px'
        });

        const [titleBox, textBox] = [await statusTitle.boundingBox(), await statusText.boundingBox()];
        expect(Math.round(textBox.y - (titleBox.y + titleBox.height))).toBe(Math.round(gap));

        // Empty summary takes no room: height matches the title-only header.
        const [titleOnlyBox, emptyBox] = [await titleOnlyHeader.boundingBox(), await emptyHeader.boundingBox()];
        expect(Math.abs(emptyBox.height - titleOnlyBox.height)).toBeLessThan(0.5);
        const emptyText = emptyHeader.locator('[data-view-header-text]');
        expect((await emptyText.boundingBox()).height).toBe(0);

        // Filling the empty status region restores the gap; hiding collapses it back.
        await emptyText.evaluate((el) => {
            el.textContent = '1 unread · 4 total';
        });
        await settleGalleryStyles(page);
        const filledBox = await emptyHeader.boundingBox();
        expect(filledBox.height).toBeGreaterThan(titleOnlyBox.height + gap);

        await emptyText.evaluate((el) => {
            el.hidden = true;
        });
        await settleGalleryStyles(page);
        const hiddenBox = await emptyHeader.boundingBox();
        expect(Math.abs(hiddenBox.height - titleOnlyBox.height)).toBeLessThan(0.5);

        await emptyText.evaluate((el) => {
            el.hidden = false;
            el.textContent = '';
        });
        await settleGalleryStyles(page);

        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect(await section.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);

        if (proofDir && !baseline) {
            await section.screenshot({ path: resolve(proofDir, `after-view-header-${look}-${testInfo.project.name}.png`) });
        }
        expect([...problems, ...failures]).toEqual([]);
    });
}

test('view header preserves page title sizing when page-base is opted out', async ({ page }) => {
    const errors = [];
    page.on('console', (message) => message.type() === 'error' && errors.push(`console: ${message.text()}`));
    page.on('pageerror', (error) => errors.push(`page: ${error.message}`));
    page.on('response', (response) => response.status() >= 400 && errors.push(`HTTP ${response.status()}: ${response.url()}`));

    await page.goto('/demo/visual-style-gallery.html', { waitUntil: 'domcontentloaded' });
    await page.setContent(`<!doctype html>
<html lang="en" data-page-base="off">
<head>
    <meta charset="utf-8">
    <title>View header probe</title>
    <link rel="stylesheet" href="/looks/neutral/index.css">
</head>
<body>
    <main>
        <header class="view-header" id="probe-header">
            <h1 class="view-header__title">Dashboard</h1>
            <p class="view-header__text" role="status"></p>
        </header>
    </main>
</body>
</html>`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);

    const headingFont = await tokenValue(page, 'font-family', '--font-heading');
    const titleSize = await tokenValue(page, 'font-size', '--text-2xl');
    const titleWeight = await tokenValue(page, 'font-weight', '--weight-semibold');
    const title = page.locator('#probe-header .view-header__title');
    expect(await styles(title, ['font-family', 'font-size', 'font-weight'])).toEqual({
        'font-family': headingFont,
        'font-size': titleSize,
        'font-weight': titleWeight
    });
    const [headerBox, titleBox] = [await page.locator('#probe-header').boundingBox(), await title.boundingBox()];
    expect(Math.abs(headerBox.height - titleBox.height)).toBeLessThan(0.5);
    expect(errors).toEqual([]);
});
