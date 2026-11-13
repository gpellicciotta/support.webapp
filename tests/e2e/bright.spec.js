import { expect, test } from '@playwright/test';
import { openGallery, selectGalleryLook, tokenColor } from './gallery-helpers.js';
import { contrastPairs } from '../unit/contract.js';

test('look selection waits for pending color transitions', async ({ page }) => {
    const errors = await openGallery(page);
    await page.evaluate(() => {
        const probe = document.createElement('div');
        probe.id = 'settle-probe';
        probe.style.cssText = 'color: rgb(0, 0, 0); transition: color 1s linear !important';
        document.body.append(probe);
        getComputedStyle(probe).color;
        probe.style.color = 'rgb(255, 0, 0)';
        getComputedStyle(probe).color;
    });
    await selectGalleryLook(page, 'neutral');
    expect(await page.locator('#settle-probe').evaluate(element => getComputedStyle(element).color)).toBe('rgb(255, 0, 0)');
    expect(errors).toEqual([]);
});

test('forced fallback preserves root accents and every contrast pair', async ({ page }) => {
    await page.route('**/looks/bright/look.css', async route => {
        const response = await route.fetch();
        const css = (await response.text()).replace('@supports not (color: light-dark(#000000, #ffffff))', '@media all');
        await route.fulfill({ response, body: css });
    });
    const errors = await openGallery(page);
    page.on('requestfailed', request => errors.push(request.url()));
    await selectGalleryLook(page, 'bright');
    for (const theme of ['light', 'dark']) {
        await page.locator(`input[name="theme"][value="${theme}"]`).check();
        for (const accent of ['blue', 'yellow', 'red']) {
            await page.locator('#accent-select').selectOption(accent);
            const expected = { blue: 'rgb(26, 86, 219)', yellow: 'rgb(184, 128, 0)', red: 'rgb(220, 38, 38)' };
            expect(await tokenColor(page, '--color-primary')).toBe(expected[accent]);
            const ratios = await page.evaluate(pairs => {
                const probe = document.createElement('span');
                document.body.append(probe);
                const luminance = name => {
                    probe.style.color = `var(--color-${name})`;
                    const channels = getComputedStyle(probe).color.match(/[\d.]+/g).slice(0, 3).map(Number).map(c => c / 255).map(c => c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
                    return channels.reduce((sum, c, index) => sum + c * [0.2126, 0.7152, 0.0722][index], 0);
                };
                const results = pairs.map(([foreground, background, minimum]) => {
                    const values = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
                    return { foreground, background, minimum, ratio: (values[0] + 0.05) / (values[1] + 0.05) };
                });
                probe.remove();
                return results;
            }, contrastPairs);
            for (const pair of ratios) {
                expect(pair.ratio, `${theme} ${accent}: ${pair.foreground} on ${pair.background}`).toBeGreaterThanOrEqual(pair.minimum);
            }
        }
    }
    if (process.env.BRIGHT_PROOF) {
        await page.screenshot({ path: `${process.env.BRIGHT_PROOF}/fallback-${test.info().project.name}.png`, fullPage: true });
    }
    expect(errors).toEqual([]);
});

test('bright accents work on roots and wrappers and reset when switching looks', async ({ page }, testInfo) => {
    const errors = await openGallery(page);
    page.on('requestfailed', request => errors.push(request.url()));
    if (process.env.BRIGHT_BASELINE) {
        await page.screenshot({ path: `${process.env.BRIGHT_PROOF}/before-${testInfo.project.name}.png`, fullPage: true });
        expect(errors).toEqual([]);
        return;
    }
    await selectGalleryLook(page, 'bright');
    for (const accent of ['blue', 'yellow', 'red']) {
        await page.locator('#accent-select').selectOption(accent);
        await expect(page.locator('html')).toHaveAttribute('data-accent', accent);
        const color = await tokenColor(page, '--color-primary');
        await expect(page.locator(`#accents [data-accent="${accent}"] .button`).first()).toHaveCSS('background-color', color);
        if (process.env.BRIGHT_PROOF) {
            await page.screenshot({ path: `${process.env.BRIGHT_PROOF}/after-${accent}-${testInfo.project.name}.png`, fullPage: true });
        }
    }
    await expect(page.locator('body')).toHaveCSS('font-family', /system-ui/);
    expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
    await selectGalleryLook(page, 'warm');
    await expect(page.locator('html')).not.toHaveAttribute('data-accent');
    await expect(page.locator('#accent-select option[value="yellow"]')).toHaveCount(0);
    expect(errors).toEqual([]);
});
