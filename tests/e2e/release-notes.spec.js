import { expect, test } from '@playwright/test';
import { resolve } from 'node:path';
import { expectRing, openGallery, ring, selectGalleryLook, smallTargets, tokenColor } from './gallery-helpers.js';

const looks = ['neutral', 'warm', 'bright'];
const evidence = process.env.RELEASE_NOTES_PROOF;
const baseline = process.env.RELEASE_NOTES_BASELINE === '1';

test('release notes gallery section expands, collapses, switches filters, and pages cleanly across looks', async ({ page }, testInfo) => {
    const failures = [];
    page.on('requestfailed', (request) => failures.push(request.url()));
    const problems = await openGallery(page);

    if (baseline && evidence) {
        await page.locator('#collapsible').scrollIntoViewIfNeeded();
        await page.screenshot({ path: resolve(evidence, `before-gallery-${testInfo.project.name}.png`) });
        expect([...problems, ...failures]).toEqual([]);
        return;
    }

    const section = page.locator('#release-notes');
    await expect(section).toBeVisible({ timeout: 2000 });
    await section.scrollIntoViewIfNeeded();

    const highlightsDemo = section.locator('[data-release-notes-demo="highlights"]');
    const toggles = highlightsDemo.locator('[data-release-notes-release] > button[aria-controls]');
    await expect(toggles).toHaveCount(2);
    await expect(toggles.nth(0)).toHaveAttribute('aria-expanded', 'true');
    await expect(toggles.nth(1)).toHaveAttribute('aria-expanded', 'false');

    // Expand the second release by click and collapse the first by keyboard.
    await toggles.nth(1).click();
    await expect(toggles.nth(1)).toHaveAttribute('aria-expanded', 'true');
    const secondPanelId = await toggles.nth(1).getAttribute('aria-controls');
    await expect(page.locator(`#${secondPanelId}`)).toBeVisible();

    await toggles.nth(0).focus();
    await page.keyboard.press('Enter');
    await expect(toggles.nth(0)).toHaveAttribute('aria-expanded', 'false');
    await page.keyboard.press('Space');
    await expect(toggles.nth(0)).toHaveAttribute('aria-expanded', 'true');

    // Switch filter chips between User Highlights and All Changes.
    const allChip = highlightsDemo.locator('[data-release-notes-filter="all"]');
    const userChip = highlightsDemo.locator('[data-release-notes-filter="user"]');
    await expect(userChip).toHaveAttribute('aria-pressed', 'true');
    await allChip.click();
    await expect(allChip).toHaveAttribute('aria-pressed', 'true');
    await expect(userChip).toHaveAttribute('aria-pressed', 'false');
    await expect(highlightsDemo.locator('[data-release-notes-release]')).toHaveCount(3);
    await expect(highlightsDemo.locator('[data-release-notes-category="internal"]')).toHaveCount(2);
    await userChip.click();
    await expect(highlightsDemo.locator('[data-release-notes-release]')).toHaveCount(2);

    // Area-grouped and status-chip specimen with paging.
    const adminDemo = section.locator('[data-release-notes-demo="grouped"]');
    await expect(adminDemo.locator('[data-release-notes-release]')).toHaveCount(2);
    await expect(adminDemo.locator('[data-release-notes-status]')).toHaveCount(2);
    await expect(adminDemo.locator('[data-release-notes-area]')).toHaveCount(4);
    const more = adminDemo.locator('[data-release-notes-more]');
    await expect(more).toBeVisible();
    await more.click();
    await expect(adminDemo.locator('[data-release-notes-release]')).toHaveCount(4);
    await expect(more).toHaveCount(0);

    // Focus glow, target sizes, and responsive layout across every look.
    for (const look of looks) {
        await selectGalleryLook(page, look);
        await section.scrollIntoViewIfNeeded();
        const focusColor = await tokenColor(page, '--color-focus');
        await userChip.focus();
        expectRing(await ring(userChip), focusColor, `${look} release-notes filter chip`);
        await toggles.nth(0).focus();
        expectRing(await ring(toggles.nth(0)), focusColor, `${look} release-notes toggle`, { inset: true });
        await page.evaluate(() => document.activeElement?.blur());

        const targets = await smallTargets(page, '#release-notes button');
        expect(targets.count).toBeGreaterThanOrEqual(4);
        expect(targets.small).toEqual([]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect(await section.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);

        if (evidence) {
            await page.mouse.move(0, 0);
            await section.screenshot({ path: resolve(evidence, `after-release-notes-${look}-${testInfo.project.name}.png`) });
        }
    }

    expect([...problems, ...failures]).toEqual([]);
});
