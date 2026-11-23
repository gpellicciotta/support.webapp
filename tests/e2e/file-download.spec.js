// Browser checks for the file download helper and download toast action in the gallery.
import { readFile } from 'node:fs/promises';
import { expect, test } from '@playwright/test';
import { openGallery } from './gallery-helpers.js';

test.describe('file download', () => {
    test('downloads formatted JSON with the given file name from a gallery button', async ({ page }) => {
        const problems = await openGallery(page);
        const section = page.locator('#file-download');
        await section.scrollIntoViewIfNeeded();

        const trigger = section.locator('[data-file-download-json]');
        const [download] = await Promise.all([
            page.waitForEvent('download'),
            trigger.click()
        ]);

        expect(download.suggestedFilename()).toBe('sample-export.json');
        const content = await readFile(await download.path(), 'utf8');
        expect(content.endsWith('\n')).toBe(true);
        expect(JSON.parse(content)).toMatchObject({ app: 'support.webapp' });
        await expect(page.locator('a[data-file-download]')).toHaveCount(0);
        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect(problems).toEqual([]);
    });

    test('offers a persistent download toast action that downloads the named file and dismisses on Escape', async ({ page }) => {
        const problems = await openGallery(page);
        const section = page.locator('#file-download');
        const region = section.locator('[data-file-download-region]');
        const toasts = region.locator('.toast');
        const opener = section.locator('[data-file-download-toast]');
        await section.scrollIntoViewIfNeeded();

        await opener.click();
        await expect(toasts).toHaveCount(1);
        const action = toasts.locator('[data-toast-action="download"]');
        await expect(action).toHaveText('account-export.json');

        // Ctrl+Z never runs a download action.
        await page.keyboard.press('Control+z');
        await expect(toasts).toHaveCount(1);

        const [download] = await Promise.all([
            page.waitForEvent('download'),
            action.click()
        ]);
        expect(download.suggestedFilename()).toBe('account-export.json');
        const content = await readFile(await download.path(), 'utf8');
        expect(JSON.parse(content)).toMatchObject({ account: 'Alex North' });
        await expect(toasts).toHaveCount(0);
        await expect(opener).toBeFocused();

        // Escape dismisses a download toast without starting a download and returns focus.
        await opener.click();
        await expect(toasts).toHaveCount(1);
        await toasts.locator('[data-toast-action="download"]').focus();
        await page.keyboard.press('Escape');
        await expect(toasts).toHaveCount(0);
        await expect(opener).toBeFocused();
        expect(problems).toEqual([]);
    });
});
