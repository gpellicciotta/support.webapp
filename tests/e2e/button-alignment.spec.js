import { expect, test } from '@playwright/test';
import { openGallery, selectGalleryLook, tokenColor, tokenLength } from './gallery-helpers.js';

const px = (value) => Number.parseFloat(value);

/**
 * Read the inner edges of an element's border box, so gaps measure to the border, not over it.
 * @param {import('@playwright/test').Locator} locator element to measure
 * @returns {Promise<{top: number, right: number, bottom: number, left: number}>} inner edges in CSS pixels
 */
function innerEdges(locator) {
    return locator.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return {
            top: box.top + Number.parseFloat(style.borderTopWidth),
            right: box.right - Number.parseFloat(style.borderRightWidth),
            bottom: box.bottom - Number.parseFloat(style.borderBottomWidth),
            left: box.left + Number.parseFloat(style.borderLeftWidth)
        };
    });
}

/**
 * Locate the baseline of an element's first line of text through a zero-height inline probe.
 * @param {import('@playwright/test').Locator} locator element holding the text
 * @returns {Promise<number>} the first baseline's viewport offset in CSS pixels
 */
function firstBaseline(locator) {
    return locator.evaluate((element) => {
        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT, {
            acceptNode: (node) => (node.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP)
        });
        const text = walker.nextNode();
        // Wrap the text with the probe, so a flex parent such as a button lays both out on one line.
        const holder = document.createElement('span');
        const probe = document.createElement('span');
        probe.style.display = 'inline-block';
        probe.style.blockSize = '0';
        text.before(holder);
        holder.append(probe, text);
        // An empty inline block sits its bottom margin edge on the baseline.
        const baseline = probe.getBoundingClientRect().bottom;
        holder.before(text);
        holder.remove();
        return baseline;
    });
}

test('banner buttons keep the same space above, below, and after them', async ({ page }, testInfo) => {
    const problems = await openGallery(page);
    const stack = page.locator('#banner .stack');
    const banners = page.locator('#banner .banner').filter({ has: page.locator('.button') });
    expect(await banners.count()).toBeGreaterThan(0);
    let inline = 0;
    let wrapped = 0;
    // Narrow widths wrap the text; wide widths keep the button beside one line of text.
    for (const width of [320, 420, 560, 760, 1100]) {
        await stack.evaluate((element, size) => {
            element.style.inlineSize = `min(100%, ${size}px)`;
        }, width);
        for (const banner of await banners.all()) {
            const label = `${width}px ${await banner.locator('.banner__text').textContent()}`;
            const edges = await innerEdges(banner);
            const button = await banner.locator('.button').boundingBox();
            const text = await banner.locator('.banner__text').boundingBox();
            const below = edges.bottom - (button.y + button.height);
            const after = edges.right - (button.x + button.width);
            const padding = px(await banner.evaluate((element) => getComputedStyle(element).paddingBottom));
            expect(after, `${label}: end space`).toBeCloseTo(padding, 0);
            expect(below, `${label}: bottom space`).toBeCloseTo(after, 0);
            if (button.y >= text.y + text.height) {
                // A wrapped button sits at the bottom end corner, one row gap below the text box.
                wrapped += 1;
                expect(button.y - (text.y + text.height), `${label}: space above a wrapped button`).toBeCloseTo(after, 0);
            }
            else {
                inline += 1;
                expect(button.y - edges.top, `${label}: top space`).toBeCloseTo(after, 0);
            }
        }
    }
    // Phone columns are too narrow for a button beside one line of text.
    if (testInfo.project.name.startsWith('desktop')) {
        expect(inline, 'inline buttons').toBeGreaterThan(0);
    }
    expect(wrapped, 'wrapped buttons').toBeGreaterThan(0);
    await stack.evaluate((element) => element.style.removeProperty('inline-size'));
    // Text-only banners keep their full end inset before the text.
    const textOnly = page.locator('#banner .banner').filter({ hasNot: page.locator('.button') }).first();
    const inset = await textOnly.locator('.banner__text').evaluate((text) => {
        const banner = text.parentElement;
        const style = getComputedStyle(banner);
        const content = text.getBoundingClientRect().right - Number.parseFloat(getComputedStyle(text).paddingRight);
        return banner.getBoundingClientRect().right - Number.parseFloat(style.borderRightWidth) - content;
    });
    expect(inset).toBeCloseTo(px(await tokenLength(page, '--space-4')), 0);
    expect(problems).toEqual([]);
});

for (const look of ['neutral', 'warm']) {
    test(`${look} row button labels sit on the row text's first baseline`, async ({ page }) => {
        const problems = await openGallery(page);
        await selectGalleryLook(page, look);
        const lists = page.locator('#row .row__list, #list .row__list');
        // Hold the lists above the 36rem wrap point but narrow enough that the long names wrap.
        await lists.evaluateAll((elements) => elements.forEach((element) => {
            element.style.inlineSize = '40rem';
        }));
        const rows = page.locator('#row .row, #list .row').filter({ has: page.locator('.row__actions .button') });
        expect(await rows.count()).toBeGreaterThan(2);
        let wrapped = 0;
        for (const row of await rows.all()) {
            const main = row.locator('.row__main');
            const lines = await main.evaluate((element) => Math.round(element.getBoundingClientRect().height / Number.parseFloat(getComputedStyle(element).lineHeight)));
            wrapped += lines > 1 ? 1 : 0;
            const offset = await firstBaseline(row.locator('.row__actions .button').first()) - await firstBaseline(main);
            // Fractional line heights, as in the warm look, round each baseline to the pixel grid on its own.
            expect(Math.abs(offset), await main.textContent()).toBeLessThan(1);
        }
        expect(wrapped, 'rows with wrapped names').toBeGreaterThan(0);
        // Icon-only actions center on the first line of the row text, which here is its only line.
        const iconRow = page.locator('#row .row').filter({ has: page.locator('.row__actions .icon-button') }).first();
        const mainBox = await iconRow.locator('.row__main').boundingBox();
        const iconBox = await iconRow.locator('.icon-button').boundingBox();
        expect(iconBox.y + iconBox.height / 2).toBeCloseTo(mainBox.y + mainBox.height / 2, 0);
        expect(problems).toEqual([]);
    });
}

test('row actions end at the row end edge', async ({ page }) => {
    const problems = await openGallery(page);
    const rows = page.locator('#row .row, #list .row').filter({ has: page.locator('.row__actions') });
    expect(await rows.count()).toBeGreaterThan(2);
    for (const row of await rows.all()) {
        const edges = await innerEdges(row);
        const last = await row.locator('.row__actions > :last-child').boundingBox();
        expect(last.x + last.width, await row.locator('.row__main').textContent()).toBeCloseTo(edges.right, 0);
    }
    expect(problems).toEqual([]);
});

test('form and card buttons flow to the end edge', async ({ page }) => {
    const problems = await openGallery(page);
    const form = await page.locator('#form .form').boundingBox();
    const formButtons = page.locator('#form .form__actions .button');
    const lastFormButton = await formButtons.last().boundingBox();
    expect(lastFormButton.x + lastFormButton.width).toBeCloseTo(form.x + form.width, 0);
    expect((await formButtons.first().boundingBox()).x).toBeGreaterThan(form.x);
    const card = page.locator('#card article.card').filter({ has: page.locator('.button') }).first();
    const content = await card.evaluate((element) => {
        const box = element.getBoundingClientRect();
        const style = getComputedStyle(element);
        return { left: box.left + Number.parseFloat(style.paddingLeft), right: box.right - Number.parseFloat(style.paddingRight) };
    });
    const cardButton = await card.locator('.button').last().boundingBox();
    expect(cardButton.x + cardButton.width).toBeCloseTo(content.right, 0);
    expect(cardButton.x, 'card button keeps its natural width').toBeGreaterThan(content.left + 1);
    expect(problems).toEqual([]);
});

test('the error summary title takes the danger color and its links the text color', async ({ page }) => {
    const problems = await openGallery(page);
    const summary = page.locator('#error-summary .error-summary');
    await expect(summary.locator('.error-summary__title')).toHaveCSS('color', await tokenColor(page, '--color-danger'));
    for (const link of await summary.locator('.error-summary__link').all()) {
        await expect(link).toHaveCSS('color', await tokenColor(page, '--color-text'));
    }
    expect(problems).toEqual([]);
});

test('separate bordered controls and containers in the gallery never touch borders', async ({ page }) => {
    const problems = await openGallery(page);
    const space4 = px(await tokenLength(page, '--space-4'));
    for (const selector of [
        '#dialog [data-dialog-result]',
        '#menu [data-menu-result]',
        '#toast [data-toast-result]',
        '#file-download [data-file-download-result]',
        '#account-menu [data-account-menu-result]',
        '#theme-switch [data-theme-sync-status]'
    ]) {
        const gap = await page.locator(selector).evaluate((el) => {
            const prev = el.previousElementSibling;
            const prevTarget = prev?.classList.contains('card-specimens') && prev.getBoundingClientRect().height === 0
                ? prev.previousElementSibling
                : prev;
            return el.getBoundingClientRect().top - prevTarget.getBoundingClientRect().bottom;
        });
        expect(gap, `${selector} top gap`).toBeGreaterThanOrEqual(space4 - 0.5);
    }

    const touches = await page.evaluate(() => {
        const isTransparent = (color) => !color || color === 'rgba(0, 0, 0, 0)' || color === 'transparent';
        const hasAllBorder = (el) => {
            const st = getComputedStyle(el);
            return Number.parseFloat(st.borderTopWidth) > 0 && !isTransparent(st.borderTopColor)
                && Number.parseFloat(st.borderBottomWidth) > 0 && !isTransparent(st.borderBottomColor)
                && Number.parseFloat(st.borderLeftWidth) > 0 && !isTransparent(st.borderLeftColor)
                && Number.parseFloat(st.borderRightWidth) > 0 && !isTransparent(st.borderRightColor);
        };
        const bordered = [...document.querySelectorAll('main *')].filter((el) => el.getClientRects().length > 0 && hasAllBorder(el));
        const hits = [];
        for (let i = 0; i < bordered.length; i++) {
            const a = bordered[i];
            const ar = a.getBoundingClientRect();
            if (ar.width === 0 || ar.height === 0) {
                continue;
            }
            for (let j = i + 1; j < bordered.length; j++) {
                const c = bordered[j];
                if (a.contains(c) || c.contains(a)) {
                    continue;
                }
                const cr = c.getBoundingClientRect();
                if (cr.width === 0 || cr.height === 0) {
                    continue;
                }
                if (Math.min(ar.right, cr.right) - Math.max(ar.left, cr.left) > 1) {
                    const dy = Math.max(cr.top - ar.bottom, ar.top - cr.bottom);
                    if (dy >= -0.5 && dy < 2) {
                        hits.push(`v:${a.tagName}.${a.className}->${c.tagName}.${c.className}@${a.closest('section')?.id}`);
                    }
                }
                if (Math.min(ar.bottom, cr.bottom) - Math.max(ar.top, cr.top) > 1) {
                    const dx = Math.max(cr.left - ar.right, ar.left - cr.right);
                    if (dx >= -0.5 && dx < 2) {
                        hits.push(`h:${a.tagName}.${a.className}->${c.tagName}.${c.className}@${a.closest('section')?.id}`);
                    }
                }
            }
        }
        return hits;
    });
    expect(touches).toEqual([]);

    const actionContainers = page.locator('#dialog .toast-demo-actions, #file-download .toast-demo-actions, #accents [data-accent] .toast-demo-actions, #form .form__actions');
    expect(await actionContainers.count()).toBe(6);
    for (const container of await actionContainers.all()) {
        const edges = await container.evaluate((el) => {
            const first = el.firstElementChild;
            const last = el.lastElementChild;
            return {
                firstMarginLeft: Number.parseFloat(getComputedStyle(first).marginLeft),
                lastMarginRight: Number.parseFloat(getComputedStyle(last).marginRight),
                firstOffset: first.getBoundingClientRect().left - el.getBoundingClientRect().left
            };
        });
        expect(edges.firstMarginLeft).toBe(0);
        expect(edges.lastMarginRight).toBe(0);
        expect(edges.firstOffset).toBeGreaterThanOrEqual(0);
    }
    expect(problems).toEqual([]);
});
