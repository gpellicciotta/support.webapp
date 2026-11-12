import { expect, test } from '@playwright/test';
import { expectRing, forcedRing, openGallery, smallTargets, styles, tokenColor } from './gallery-helpers.js';

test('the segmented section shows fieldsets of native radios with legends and every state', async ({ page }) => {
    const problems = await openGallery(page);
    await expect(page.locator('#segmented h2')).toHaveText('Segmented control');
    const groups = page.locator('#segmented fieldset.segmented');
    expect(await groups.count()).toBeGreaterThanOrEqual(3);
    for (const group of await groups.all()) {
        await expect(group.locator(':scope > legend.segmented__legend')).toHaveText(/\S/);
        const options = group.locator('.segmented__option');
        const count = await options.count();
        expect(count).toBeGreaterThanOrEqual(2);
        expect(count).toBeLessThanOrEqual(5);
        await expect(group.locator('.segmented__option > input[type="radio"]')).toHaveCount(count);
        expect(new Set(await group.locator('input[type="radio"]').evaluateAll((inputs) => inputs.map((input) => input.name))).size).toBe(1);
    }
    for (const state of ['.is-hover', '.is-focus', ':has(:checked)']) {
        await expect(page.locator(`#segmented .segmented__option${state}`), state).not.toHaveCount(0);
    }
    await expect(page.locator('#segmented fieldset.segmented:disabled .segmented__option:has(:checked)')).toHaveCount(1);
    expect(problems).toEqual([]);
});

test('every segmented option is at least 44 by 44 px', async ({ page }) => {
    await openGallery(page);
    const { count, small } = await smallTargets(page, '#segmented input[type="radio"]');
    expect(count).toBeGreaterThanOrEqual(9);
    expect(small).toEqual([]);
});

test('arrow keys move the selection, and the focused option draws the focus ring', async ({ page }) => {
    await openGallery(page);
    const group = page.getByRole('group', { name: 'View', exact: true });
    const radios = group.getByRole('radio');
    await expect(radios).toHaveCount(3);
    await expect(radios.nth(0)).toBeChecked();
    // Focus the last tab stop before the group, so one Tab press enters it as a keyboard user would.
    await group.evaluate((fieldset) => {
        const stops = [...document.querySelectorAll('a[href], button, input, select')]
            .filter((element) => !element.disabled && element.checkVisibility() && (element.compareDocumentPosition(fieldset) & Node.DOCUMENT_POSITION_FOLLOWING));
        stops.at(-1).focus();
    });
    await page.keyboard.press('Tab');
    await expect(radios.nth(0)).toBeFocused();
    const focus = await tokenColor(page, '--color-focus');
    const labelRing = (index) => forcedRing(group.locator('.segmented__option').nth(index));
    expectRing(await labelRing(0), focus, 'first option');
    await page.keyboard.press('ArrowRight');
    await expect(radios.nth(1)).toBeChecked();
    await expect(radios.nth(1)).toBeFocused();
    expectRing(await labelRing(1), focus, 'second option');
    expect((await labelRing(0)).style).toBe('none');
    await page.keyboard.press('ArrowLeft');
    await expect(radios.nth(0)).toBeChecked();
    await page.keyboard.press('Tab');
    await expect(radios.nth(1)).not.toBeFocused();
    await expect(radios.nth(2)).not.toBeFocused();
});

test('the checked option stands out by ground, outline, and weight, also in forced colors mode', async ({ page }) => {
    await openGallery(page);
    const group = page.getByRole('group', { name: 'View', exact: true });
    const read = (selector) => styles(group.locator(selector).first(), ['background-color', 'box-shadow', 'font-weight', 'border-top-width']);
    const checked = await read('.segmented__option:has(:checked)');
    const plain = await read('.segmented__option:not(:has(:checked))');
    expect(checked['background-color']).toBe(await tokenColor(page, '--color-surface'));
    expect(checked['box-shadow']).not.toBe('none');
    expect(Number(checked['font-weight'])).toBeGreaterThan(Number(plain['font-weight']));
    await page.emulateMedia({ forcedColors: 'active' });
    const forcedChecked = await read('.segmented__option:has(:checked)');
    const forcedPlain = await read('.segmented__option:not(:has(:checked))');
    expect(parseFloat(forcedChecked['border-top-width'])).toBeGreaterThan(parseFloat(forcedPlain['border-top-width']));
});

test('the forced state specimens and the disabled group render their states', async ({ page }) => {
    await openGallery(page);
    expectRing(await forcedRing(page.locator('#segmented .segmented__option.is-focus').first()), await tokenColor(page, '--color-focus'), 'focus specimen');
    const hover = await styles(page.locator('#segmented .segmented__option.is-hover:not(:has(:checked))').first(), ['background-color']);
    // Hover sits on the sunken track, so it must differ from the track in every look and theme.
    const track = await styles(page.locator('#segmented .segmented__options').first(), ['background-color']);
    expect(hover['background-color']).toBe(await tokenColor(page, '--color-surface-active'));
    expect(hover['background-color']).not.toBe(track['background-color']);
    const disabled = await tokenColor(page, '--color-text-disabled');
    const options = page.locator('#segmented fieldset:disabled .segmented__option');
    expect(await options.count()).toBeGreaterThanOrEqual(2);
    for (const option of await options.all()) {
        expect(await styles(option, ['color', 'cursor'])).toEqual({ color: disabled, cursor: 'not-allowed' });
    }
});

test('options wrap inside the section without horizontal overflow', async ({ page }) => {
    await openGallery(page);
    const overflow = await page.locator('#segmented').evaluate((section) => section.scrollWidth - section.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
});

test('a single disabled radio dims its option in an enabled group and ignores hover', async ({ page }) => {
    await openGallery(page);
    const options = page.locator('#segmented fieldset.segmented:enabled .segmented__option:has(:disabled)');
    expect(await options.count()).toBeGreaterThanOrEqual(2);
    const disabled = await tokenColor(page, '--color-text-disabled');
    for (const option of await options.all()) {
        expect(await styles(option, ['color', 'cursor']), await option.textContent()).toEqual({ color: disabled, cursor: 'not-allowed' });
    }
    const plain = await styles(options.and(page.locator(':not(.is-hover)')).first(), ['background-color']);
    const hovered = await styles(options.and(page.locator('.is-hover')).first(), ['background-color']);
    expect(hovered).toEqual(plain);
});
