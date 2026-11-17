import { expect, test } from '@playwright/test';
import { openGallery, styles, tokenColor, tokenLength } from './gallery-helpers.js';

const TRANSPARENT = 'rgba(0, 0, 0, 0)';
const px = (value) => Number.parseFloat(value);

/**
 * Measure how far the outermost ink of an element's middle band sits from one of its edges.
 * The band spans the vertical middle, so it holds a chevron and skips rounded corners.
 * @param {import('@playwright/test').Locator} locator element to capture
 * @param {'left'|'right'} side edge to scan from
 * @returns {Promise<number>} distance in CSS pixels from that edge to the nearest ink
 */
async function inkInset(locator, side) {
    const box = await locator.boundingBox();
    const data = (await locator.screenshot({ animations: 'disabled' })).toString('base64');
    return locator.page().evaluate(async ({ data, width, side }) => {
        const image = new Image();
        image.src = `data:image/png;base64,${data}`;
        await image.decode();
        const canvas = document.createElement('canvas');
        canvas.width = image.width;
        canvas.height = image.height;
        const context = canvas.getContext('2d');
        context.drawImage(image, 0, 0);
        const scale = image.width / width;
        const pixels = context.getImageData(0, 0, image.width, image.height).data;
        const at = (x, y) => pixels.slice((y * image.width + x) * 4, (y * image.width + x) * 4 + 3);
        // Start 3 px inside the edge, past the border, and treat that pixel as the ground.
        const skip = Math.round(3 * scale);
        const middle = Math.round(image.height / 2);
        let nearest = Infinity;
        for (let y = middle - Math.round(4 * scale); y <= middle + Math.round(4 * scale); y++) {
            const start = side === 'right' ? image.width - 1 - skip : skip;
            const ground = at(start, y);
            for (let step = 0; step < image.width / 2; step++) {
                const x = side === 'right' ? start - step : start + step;
                const color = at(x, y);
                const distance = Math.abs(color[0] - ground[0]) + Math.abs(color[1] - ground[1]) + Math.abs(color[2] - ground[2]);
                if (distance > 60) {
                    nearest = Math.min(nearest, (step + skip) / scale);
                    break;
                }
            }
        }
        return nearest;
    }, { data, width: box.width, side });
}

test('read-only fields drop their border but keep the focus border', async ({ page }) => {
    const problems = await openGallery(page);
    const control = page.locator('#field .field__control[readonly]').first();
    const sides = ['border-top-color', 'border-right-color', 'border-bottom-color', 'border-left-color'];
    expect(Object.values(await styles(control, sides))).toEqual(sides.map(() => TRANSPARENT));
    await control.hover();
    expect((await styles(control, ['border-top-color']))['border-top-color'], 'hover').toBe(TRANSPARENT);
    await control.focus();
    expect((await styles(control, ['border-top-color']))['border-top-color'], 'focus').toBe(await tokenColor(page, '--color-focus'));
    expect(problems).toEqual([]);
});

test('status and error lines sit one small step below the control', async ({ page }) => {
    const problems = await openGallery(page);
    const step = px(await tokenLength(page, '--space-1'));
    for (const [control, part] of [['#field-valid', '#field-valid-status'], ['#field-invalid', '#field-invalid-error'], ['#field-pending', '#field-pending-status']]) {
        const controlBox = await page.locator(control).boundingBox();
        const partBox = await page.locator(part).boundingBox();
        expect(partBox.y - (controlBox.y + controlBox.height), part).toBeLessThanOrEqual(step + 0.5);
    }
    expect(problems).toEqual([]);
});

test('hint, counter, status, and error text align with the text inside the control', async ({ page }) => {
    const problems = await openGallery(page);
    const offsets = await page.locator('#field .field, #select .field').evaluateAll((fields) => fields.flatMap((field) => {
        const control = field.querySelector(':scope > .field__control');
        const box = control.getBoundingClientRect();
        const style = getComputedStyle(control);
        const textStart = box.left + Number.parseFloat(style.borderLeftWidth) + Number.parseFloat(style.paddingLeft);
        // Text controls pad both sides alike; a select's end padding also holds its chevron, so use the start padding.
        const textEnd = box.right - Number.parseFloat(style.borderRightWidth) - Number.parseFloat(style.paddingLeft);
        return [...field.querySelectorAll(':scope > :is(.field__hint, .field__counter, .field__status, .field__error)')]
            .filter((part) => part.getClientRects().length > 0)
            .map((part) => {
                const partBox = part.getBoundingClientRect();
                const partStyle = getComputedStyle(part);
                return {
                    part: `${control.id} ${part.className}`,
                    counter: part.classList.contains('field__counter'),
                    start: partBox.left + Number.parseFloat(partStyle.paddingLeft) - textStart,
                    end: textEnd - (partBox.right - Number.parseFloat(partStyle.paddingRight))
                };
            });
    }));
    expect(offsets.filter((offset) => !offset.counter).length).toBeGreaterThanOrEqual(5);
    expect(offsets.filter((offset) => offset.counter).length).toBeGreaterThanOrEqual(2);
    for (const offset of offsets) {
        expect(offset.end, `${offset.part} end`).toBeGreaterThanOrEqual(-0.5);
        expect(offset.start, `${offset.part} start`).toBeGreaterThanOrEqual(-0.5);
        if (offset.counter) {
            expect(offset.end, `${offset.part} end`).toBeLessThanOrEqual(0.5);
        }
        else {
            expect(offset.start, `${offset.part} start`).toBeLessThanOrEqual(0.5);
        }
    }
    expect(problems).toEqual([]);
});

test('field group content is indented from its legend', async ({ page }) => {
    const problems = await openGallery(page);
    const indent = px(await tokenLength(page, '--space-4'));
    const groups = await page.locator('#field-group fieldset.field-group, #radio fieldset.field-group').evaluateAll((fieldsets) => fieldsets.map((fieldset) => {
        const legend = fieldset.querySelector(':scope > .field-group__legend').getBoundingClientRect().left;
        const items = [...fieldset.children].filter((child) => !child.matches('legend') && child.getClientRects().length > 0);
        return items.map((item) => ({ item: item.className, offset: item.getBoundingClientRect().left - legend }));
    }));
    expect(groups.length).toBeGreaterThanOrEqual(5);
    for (const items of groups) {
        expect(items.length).toBeGreaterThanOrEqual(2);
        // Row items after the first column sit further in; the first column starts at the indent.
        expect(Math.min(...items.map(({ offset }) => offset)), items[0].item).toBeCloseTo(indent, 0);
        for (const { item, offset } of items) {
            expect(offset, item).toBeGreaterThanOrEqual(indent - 0.5);
        }
    }
    expect(problems).toEqual([]);
});

test('the select chevron sits as far from the edge as the collapsible chevron', async ({ page }) => {
    const problems = await openGallery(page);
    const select = page.locator('#select select.field__control:not(.is-hover, .is-focus, :disabled, [aria-invalid="true"])').first();
    expect((await styles(select, ['appearance'])).appearance).toBe('none');
    expect((await styles(select, ['background-image']))['background-image']).toContain(await tokenColor(page, '--color-text-muted'));
    const disabled = page.locator('#select select.field__control:disabled').first();
    expect((await styles(disabled, ['background-image']))['background-image']).toContain(await tokenColor(page, '--color-text-disabled'));

    const collapsible = page.locator('#collapsible .state .collapsible__toggle[aria-expanded="false"]:not(.is-hover, .is-focus, .is-active)').first();
    await collapsible.scrollIntoViewIfNeeded();
    const reference = await inkInset(collapsible, 'right');
    await select.scrollIntoViewIfNeeded();
    const inset = await inkInset(select, 'right');
    expect(reference).toBeGreaterThan(8);
    expect(Math.abs(inset - reference), `select ${inset} px, collapsible ${reference} px`).toBeLessThanOrEqual(1.5);

    // The text stops before the chevron, which keeps the collapsible's gap.
    const iconSize = px(await tokenLength(page, '--icon-md'));
    const gap = px(await tokenLength(page, '--space-2'));
    expect(px((await styles(select, ['padding-right']))['padding-right'])).toBeCloseTo(2 * gap + iconSize, 0);

    await select.evaluate((element) => element.setAttribute('dir', 'rtl'));
    expect(Math.abs(await inkInset(select, 'left') - reference), 'right to left').toBeLessThanOrEqual(1.5);
    expect(px((await styles(select, ['padding-left']))['padding-left'])).toBeCloseTo(2 * gap + iconSize, 0);
    expect(problems).toEqual([]);
});

test('forced colors restore the native select arrow, since they drop gradient backgrounds', async ({ page }) => {
    const problems = await openGallery(page);
    await page.emulateMedia({ forcedColors: 'active' });
    const endPadding = 2 * px(await tokenLength(page, '--space-2')) + px(await tokenLength(page, '--icon-md'));
    for (const state of [':not(.is-hover, .is-focus, :disabled, [aria-invalid="true"])', ':disabled']) {
        const select = page.locator(`#select select.field__control${state}`).first();
        expect((await styles(select, ['appearance'])).appearance, state).not.toBe('none');
        await select.scrollIntoViewIfNeeded();
        // The text starts at the far side, so ink inside the end padding can only be the arrow.
        expect(await inkInset(select, 'right'), state).toBeLessThan(endPadding);
    }
    expect(problems).toEqual([]);
});

test('the select section shows every select state', async ({ page }) => {
    const problems = await openGallery(page);
    await expect(page.locator('#select h2')).toHaveText('Select');
    await expect(page.locator('.gallery-nav a[href="#select"], nav a[href="#select"]').first()).toHaveText('Select');
    const selects = page.locator('#select .field > select.field__control');
    expect(await selects.count()).toBeGreaterThanOrEqual(6);
    for (const state of [':not(.is-hover, .is-focus, :disabled, [aria-invalid="true"])', '.is-hover', '.is-focus', '[aria-invalid="true"]', ':disabled']) {
        await expect(page.locator(`#select select.field__control${state}`), state).not.toHaveCount(0);
    }
    await expect(page.locator('#select .field:has(> select[aria-invalid="true"]) > .field__error')).toBeVisible();
    await expect(page.locator('#select .field:has(> select) > .field__hint')).not.toHaveCount(0);
    for (const select of await selects.all()) {
        await expect(page.locator(`label[for="${await select.getAttribute('id')}"]`)).toHaveText(/\S/);
    }
    const overflow = await page.locator('#select').evaluate((section) => section.scrollWidth - section.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    expect(problems).toEqual([]);
});
