import { expect, test } from '@playwright/test';
import { expectRing, openGallery, ring, selectGalleryLook, settleGalleryStyles, smallTargets, styles, tokenColor } from './gallery-helpers.js';

for (const look of ['neutral', 'warm', 'bright']) {
    test(`${look} detail panel scrolls its body beneath a fixed header and separates its danger zone`, async ({ page }, testInfo) => {
        const failures = [];
        page.on('requestfailed', request => failures.push(request.url()));
        const problems = await openGallery(page);
        await selectGalleryLook(page, look);
        const section = page.locator('#detail-panel');
        await expect(section).toBeVisible({ timeout: 1000 });
        await expect(section.locator('.detail-panel[hidden]')).toBeHidden();

        const panel = section.locator('.detail-panel:not([hidden])').first();
        const header = panel.locator('.detail-panel__header');
        const body = panel.locator('.detail-panel__body');
        const close = header.getByRole('button', { name: /^Close / });
        await expect(close).toBeVisible();
        expectRing(await ring(close), await tokenColor(page, '--color-focus'), 'detail panel close');

        const headerBefore = await header.boundingBox();
        const scrollState = await body.evaluate((element) => {
            const overflow = getComputedStyle(element).overflowY;
            const scrollable = element.scrollHeight > element.clientHeight;
            element.scrollTo(0, 80);
            return { overflow, scrollable, scrollTop: element.scrollTop };
        });
        expect(scrollState.overflow).toBe('auto');
        expect(scrollState.scrollable).toBe(true);
        expect(scrollState.scrollTop).toBeGreaterThan(0);
        const headerAfter = await header.boundingBox();
        expect(headerAfter.y).toBeCloseTo(headerBefore.y, 0);

        const sections = panel.locator('.detail-panel__section');
        expect(await sections.count()).toBeGreaterThanOrEqual(3);
        const beforeDanger = panel.locator('.detail-panel__section:not(.detail-panel__danger)').last();
        const dangerZone = panel.locator('.detail-panel__danger');
        expect(parseFloat((await styles(beforeDanger, ['border-bottom-width']))['border-bottom-width'])).toBe(0);
        expect(parseFloat((await styles(dangerZone, ['border-top-width']))['border-top-width'])).toBeGreaterThan(0);

        const actionsBox = await dangerZone.locator('.detail-panel__actions').boundingBox();
        const confirmGroup = dangerZone.locator('.inline-confirm[role="group"]');
        await expect(confirmGroup).toBeVisible();
        expect((await confirmGroup.boundingBox()).width).toBeCloseTo(actionsBox.width, 0);

        const deleteBtn = confirmGroup.locator('.button--danger').first();
        expectRing(await ring(deleteBtn), await tokenColor(page, '--color-danger'), 'danger zone delete');
        expect((await smallTargets(page, '#detail-panel button:not(:disabled)')).small).toEqual([]);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

        if (process.env.T0048_AFTER) {
            await body.evaluate((element) => element.scrollTo(0, 0));
            await section.screenshot({ path: `${process.env.T0048_AFTER}/after-detail-panel-${look}-${testInfo.project.name}.png` });
        }
        expect([...problems, ...failures]).toEqual([]);
    });

    test(`${look} admin console shell example integrates toolbar, selected row, pager, and open detail panel at 1440 px`, async ({ page }, testInfo) => {
        test.skip(page.viewportSize().width < 1024, 'the admin console example targets desktop widths');
        const problems = [];
        page.on('console', (message) => message.type() === 'error' && problems.push(`console: ${message.text()}`));
        page.on('pageerror', (error) => problems.push(`page: ${error.message}`));
        page.on('requestfailed', (request) => problems.push(`request failed: ${request.url()}`));
        page.on('response', (response) => response.status() >= 400 && problems.push(`HTTP ${response.status()}: ${response.url()}`));

        const response = await page.goto('/demo/shell-admin-console.html', { waitUntil: 'networkidle' });
        expect(response.status()).toBe(200);
        await selectGalleryLook(page, look);
        await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' });
        await settleGalleryStyles(page);

        await expect(page.locator('.toolbar[role="search"]')).toBeVisible();
        await expect(page.locator('.table__frame table.table tr[aria-selected="true"]')).toHaveCount(1);
        await expect(page.locator('nav.pager')).toBeVisible();
        const statusChips = page.locator('.table__frame .chip--status');
        expect(await statusChips.count()).toBeGreaterThanOrEqual(3);
        for (const chip of await statusChips.all()) {
            await expect(chip.locator('svg.icon')).toHaveCount(1);
            await expect(chip).toHaveText(/\S/);
        }

        const sidePanel = page.locator('.app__side-panel');
        await expect(sidePanel).toBeVisible();
        const detailPanel = sidePanel.locator('.detail-panel');
        await expect(detailPanel.locator('dl.list.list--facts.list--compact')).toBeVisible();
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect((await smallTargets(page, 'button:not(:disabled), input, select')).small).toEqual([]);

        if (process.env.T0048_AFTER) {
            await page.screenshot({ path: `${process.env.T0048_AFTER}/after-admin-console-${look}-${testInfo.project.name}.png` });
        }

        // In-place confirmation inside the danger zone asks in place and restores focus on Keep/Escape.
        const permanentTrigger = detailPanel.getByRole('button', { name: 'Delete permanently' });
        await permanentTrigger.click();
        const inlineGroup = detailPanel.locator('.inline-confirm[role="group"]');
        await expect(inlineGroup).toBeVisible();
        await page.keyboard.press('Escape');
        await expect(inlineGroup).toBeHidden();
        await expect(permanentTrigger).toBeFocused();

        // Selecting another row moves aria-selected and focuses the panel; closing returns focus to the row.
        const alexInspect = page.getByRole('button', { name: 'Inspect Alex North' });
        await alexInspect.click();
        await expect(alexInspect.locator('xpath=ancestor::tr')).toHaveAttribute('aria-selected', 'true');
        await expect(page.locator('.table__frame table.table tr[aria-selected="true"]')).toHaveCount(1);
        await expect(detailPanel.locator('.detail-panel__title')).toHaveText('Alex North');
        expect(await sidePanel.evaluate((element) => element.contains(document.activeElement))).toBe(true);

        // Facts and the deletion question follow the selected account, and an open question never survives a switch.
        const facts = detailPanel.locator('.list--facts');
        await expect(facts.locator('[data-fact="id"]')).toHaveText('1');
        await expect(facts.locator('[data-fact="roles"]')).toHaveText('admin');
        await expect(facts.locator('[data-fact="status"]')).toHaveText('Active');
        await expect(facts.locator('[data-fact="auth-user-id"]')).toHaveText('101');
        await permanentTrigger.click();
        await expect(inlineGroup).toBeVisible();
        await expect(inlineGroup).toContainText('Delete Alex North and');
        const jordanInspect = page.getByRole('button', { name: 'Inspect Jordan Kim' });
        await jordanInspect.click();
        await expect(inlineGroup).toBeHidden();
        await expect(facts.locator('[data-fact="id"]')).toHaveText('36');
        await expect(facts.locator('[data-fact="status"]')).toHaveText('Marked for deletion');
        await expect(facts.locator('[data-fact="created"]')).toHaveText('2026-09-20 14:05:00');
        expect(await sidePanel.evaluate((element) => element.contains(document.activeElement))).toBe(true);
        await permanentTrigger.click();
        await expect(inlineGroup).toContainText('Delete Jordan Kim and');
        await expect(inlineGroup).not.toContainText('Alex North');
        await page.keyboard.press('Escape');

        await detailPanel.getByRole('button', { name: /^Close / }).click();
        await expect(sidePanel).toBeHidden();
        await expect(page.locator('.table__frame table.table tr[aria-selected="true"]')).toHaveCount(0);
        await expect(jordanInspect).toBeFocused();

        expect(problems).toEqual([]);
    });
}
