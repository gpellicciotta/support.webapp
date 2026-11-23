import { expect, test } from '@playwright/test';
import { expectRing, openGallery, ring, selectGalleryLook, settleGalleryStyles, smallTargets, styles, tokenColor, tokenLength } from './gallery-helpers.js';

for (const look of ['neutral', 'warm', 'bright']) {
    test(`${look} entry list shows spaced cards with the message first, chips after, and hover feedback`, async ({ page }, testInfo) => {
        const failures = [];
        page.on('requestfailed', request => failures.push(request.url()));
        const problems = await openGallery(page);
        await selectGalleryLook(page, look);
        const section = page.locator('#entry-list');
        await expect(section).toBeVisible({ timeout: 1000 });

        const logs = section.getByRole('list', { name: 'Recent log entries' });
        const events = section.getByRole('list', { name: 'Recent system events' });
        await expect(logs).toBeVisible();
        await expect(events).toBeVisible();
        const cards = logs.locator('.entry-list__item');

        const [first, second] = [await cards.nth(0).boundingBox(), await cards.nth(1).boundingBox()];
        const gap = parseFloat(await tokenLength(page, '--space-2'));
        expect(Math.round(second.y - (first.y + first.height))).toBe(Math.round(gap));

        const surface = await tokenColor(page, '--color-surface');
        const hover = await tokenColor(page, '--color-surface-hover');
        const sunken = await tokenColor(page, '--color-surface-sunken');
        expect(await styles(cards.nth(1), ['background-color', 'border-top-left-radius'])).toEqual({
            'background-color': surface,
            'border-top-left-radius': await tokenLength(page, '--radius-card')
        });
        await expect(cards.nth(1).locator('.chip').first()).toHaveCSS('background-color', sunken);
        await expect(cards.nth(0)).toHaveClass(/is-hover/);
        await expect(cards.nth(0)).toHaveCSS('background-color', hover);
        await expect(cards.nth(0).locator('.chip').first()).toHaveCSS('background-color', surface);
        await cards.nth(1).hover();
        await settleGalleryStyles(page);
        await expect(cards.nth(1)).toHaveCSS('background-color', hover);
        await expect(cards.nth(1).locator('.chip').first()).toHaveCSS('background-color', surface);

        const message = cards.nth(1).locator('.entry-list__message');
        const metaBox = await cards.nth(1).locator('.entry-list__meta').boundingBox();
        expect(metaBox.y).toBeGreaterThanOrEqual((await message.boundingBox()).y + (await message.boundingBox()).height);
        expect(await styles(message, ['white-space', 'font-family'])).toEqual({
            'white-space': 'pre-wrap',
            'font-family': await page.evaluate(() => {
                const probe = document.createElement('span');
                probe.style.fontFamily = 'var(--font-mono)';
                document.body.append(probe);
                const family = getComputedStyle(probe).fontFamily;
                probe.remove();
                return family;
            })
        });
        expect((await message.innerText()).split('\n').length).toBeGreaterThanOrEqual(2);
        await expect(events.locator('.entry-list__message').first()).not.toHaveCSS('font-family', await message.evaluate(element => getComputedStyle(element).fontFamily));

        const clock = cards.nth(0).locator('.entry-list__meta .chip').first().locator('svg.icon');
        expect((await clock.boundingBox()).width).toBeGreaterThan(0);

        const toggle = events.getByRole('button', { name: 'Hide details of event 107' });
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        const card = events.locator('.entry-list__item').first();
        await expect(card.getByRole('button', { name: 'Hide details of event 107' })).toHaveCount(1);
        const [cardBox, toggleBox] = [await card.boundingBox(), await toggle.boundingBox()];
        expect(cardBox.x + cardBox.width - (toggleBox.x + toggleBox.width)).toBeLessThan(cardBox.width / 8);
        const details = card.locator('.entry-list__details');
        await expect(details).toHaveCSS('white-space', 'pre-wrap');
        await expect(toggle.locator('.icon')).toHaveCSS('transform', 'matrix(-1, 0, 0, -1, 0, 0)');
        await expect(events.getByRole('button', { name: 'Show details of event 104' }).locator('.icon')).toHaveCSS('transform', 'none');
        await page.mouse.move(0, 0);
        await settleGalleryStyles(page);
        await expect(details).toHaveCSS('background-color', sunken);
        await details.hover();
        await settleGalleryStyles(page);
        await expect(card).toHaveCSS('background-color', hover);
        await expect(details).toHaveCSS('background-color', surface);
        await toggle.focus();
        expectRing(await ring(toggle), await tokenColor(page, '--color-focus'), 'entry list details toggle');
        const targets = await smallTargets(page, '#entry-list button');
        expect(targets.count).toBeGreaterThanOrEqual(1);
        expect(targets.small).toEqual([]);

        expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);
        expect(await section.evaluate(element => element.scrollWidth <= element.clientWidth)).toBe(true);
        if (process.env.ENTRY_LIST_PROOF) {
            await page.mouse.move(0, 0);
            await section.screenshot({ path: `${process.env.ENTRY_LIST_PROOF}/after-entry-list-${look}-${testInfo.project.name}.png` });
        }
        expect([...problems, ...failures]).toEqual([]);
    });
}
