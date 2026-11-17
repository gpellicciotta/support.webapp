import { expect, test } from '@playwright/test';
import { resolve } from 'node:path';
import { looks } from '../../src/demo/gallery.js';
import { expectRing, forcedRing, openGallery, selectGalleryLook, styles, tokenColor, tokenLength } from './gallery-helpers.js';

test('tabs switch by pointer and keyboard with accessible states', async ({ page }, testInfo) => {
    const problems = await openGallery(page);
    page.on('requestfailed', request => problems.push(`request: ${request.url()}`));
    const section = page.locator('#tabs');
    const general = section.getByRole('tab', { name: 'General', exact: true });
    const sharing = section.getByRole('tab', { name: 'Sharing', exact: true });
    await expect(general).toHaveAttribute('aria-selected', 'true');
    await sharing.click();
    await expect(sharing).toHaveAttribute('aria-selected', 'true');
    await expect(page.locator('#tabs-sharing-panel')).toBeVisible();
    await page.keyboard.press('ArrowRight');
    await expect(general).toBeFocused();
    await page.keyboard.press('End');
    await expect(sharing).toBeFocused();
    await page.keyboard.press('Home');
    await expect(general).toBeFocused();
    await page.keyboard.press('Space');
    await page.keyboard.press('Enter');
    await expect(general).toHaveAttribute('aria-selected', 'true');
    await page.keyboard.press('Tab');
    await expect(page.locator('#tabs-general-panel')).toBeFocused();
    for (const tab of await section.getByRole('tab').all()) {
        const box = await tab.boundingBox();
        expect(box.height).toBeGreaterThanOrEqual(44);
        expect(box.width).toBeGreaterThanOrEqual(44);
    }
    if (process.env.TABS_EVIDENCE) {
        await section.screenshot({ path: resolve(process.env.TABS_EVIDENCE, `after-${testInfo.project.name}.png`) });
    }
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    expect(problems).toEqual([]);
});

test.describe('without JavaScript', () => {
    test.use({ javaScriptEnabled: false });
    test('all panel content remains readable', async ({ page }) => {
        await page.goto('/demo/visual-style-gallery.html');
        await expect(page.locator('#tabs-general-panel')).toBeVisible();
        await expect(page.locator('#tabs-sharing-panel')).toBeVisible();
    });
});

test('tabs round only their top corners and mark the selection with a straight primary bar on the divider', async ({ page }) => {
    const problems = await openGallery(page);
    for (const look of looks) {
        await selectGalleryLook(page, look);
        const radius = await tokenLength(page, '--radius-control');
        // Chromium snaps border widths to device pixels, so a probe border gives the used width.
        const strong = await page.evaluate(() => {
            const probe = document.createElement('span');
            probe.style.borderBottom = 'var(--border-width-strong) solid';
            document.body.append(probe);
            const width = getComputedStyle(probe).borderBottomWidth;
            probe.remove();
            return width;
        });
        const primary = await tokenColor(page, '--color-primary');
        for (const tab of await page.locator('#tabs .tabs__tab').all()) {
            const style = await styles(tab, ['border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius', 'border-bottom-width', 'border-bottom-color']);
            const selected = await tab.getAttribute('aria-selected') === 'true';
            expect(style, `${look} ${await tab.textContent()}`).toEqual({
                'border-top-left-radius': radius, 'border-top-right-radius': radius,
                'border-bottom-left-radius': '0px', 'border-bottom-right-radius': '0px',
                'border-bottom-width': strong, 'border-bottom-color': selected ? primary : 'rgba(0, 0, 0, 0)'
            });
        }
        const list = page.locator('#tabs .tabs__list');
        const [listBox, tabBox, listPadding] = await Promise.all([list.boundingBox(), list.locator('.tabs__tab').first().boundingBox(), styles(list, ['border-bottom-width'])]);
        expect(tabBox.y + tabBox.height, `${look}: the bar sits on the divider`).toBeCloseTo(listBox.y + listBox.height - parseFloat(listPadding['border-bottom-width']), 0);
        expectRing(await forcedRing(page.locator('#tabs .tabs__tab.is-focus')), await tokenColor(page, '--color-focus'), `${look} focus`, { inset: true });
    }
    await page.emulateMedia({ forcedColors: 'active' });
    const bar = locator => styles(locator, ['border-bottom-color']);
    const selectedBar = await bar(page.locator('#tabs .tabs__tab[aria-selected="true"]').first());
    const plainBar = await bar(page.locator('#tabs .tabs__tab:not([aria-selected="true"])').first());
    const canvas = await page.locator('#tabs').evaluate(section => getComputedStyle(section).backgroundColor);
    expect(selectedBar, 'forced colors: the selected bar differs from unselected tabs').not.toEqual(plainBar);
    expect(selectedBar['border-bottom-color'], 'forced colors: the selected bar is visible').not.toBe(canvas);
    expect(problems).toEqual([]);
});
