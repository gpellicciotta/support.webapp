import { expect, test } from '@playwright/test';
import { join } from 'node:path';
import { looks } from '../../src/demo/gallery.js';
import { openGallery, selectGalleryLook } from './gallery-helpers.js';

const SECTIONS = ['link-button', 'badge', 'segmented', 'switch', 'tabs'];

// Evidence only: SMALL_CONTROLS_EVIDENCE names the screenshot directory and SMALL_CONTROLS_PHASE the file prefix.
test('small control sections render for evidence screenshots', async ({ page }, testInfo) => {
    const directory = process.env.SMALL_CONTROLS_EVIDENCE;
    test.skip(!directory, 'set SMALL_CONTROLS_EVIDENCE to capture screenshots');
    const problems = await openGallery(page);
    for (const look of looks) {
        await selectGalleryLook(page, look);
        for (const id of SECTIONS) {
            const section = page.locator(`#${id}`);
            await expect(section).toBeVisible();
            await section.screenshot({ path: join(directory, `${process.env.SMALL_CONTROLS_PHASE ?? 'after'}-${id}-${look}-${testInfo.project.name}.png`) });
        }
    }
    expect(problems).toEqual([]);
});
