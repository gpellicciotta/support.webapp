import { expect, test } from '@playwright/test';
import { expectRing, forcedRing, openGallery, ring, smallTargets, styles, tokenColor } from './gallery-helpers.js';

const describedBy = (locator) => locator.evaluate((element) => (element.getAttribute('aria-describedby') ?? '').split(' ').filter(Boolean));
const glyph = (locator) => locator.locator('svg.icon use').getAttribute('href');

test('the field section shows every field state with its icon, text, and color', async ({ page }) => {
    const problems = await openGallery(page);
    await expect(page.locator('#field h2')).toHaveText('Field');
    const danger = await tokenColor(page, '--color-danger');
    const success = await tokenColor(page, '--color-success');

    const invalid = page.locator('#field .field:has([aria-invalid="true"])').first();
    await expect(invalid.locator('.field__error')).toBeVisible();
    expect(await glyph(invalid.locator('.field__error'))).toMatch(/#icon-alert$/);
    expect((await styles(invalid.locator('.field__error'), ['color'])).color).toBe(danger);
    expect((await styles(invalid.locator('.field__control'), ['border-top-color']))['border-top-color']).toBe(danger);
    expect(await describedBy(invalid.locator('.field__control'))).toContain(await invalid.locator('.field__error').getAttribute('id'));

    const valid = page.locator('#field .field:not([aria-busy="true"]):has(.field__status:not([hidden]))').first();
    await expect(valid.locator('.field__status')).toBeVisible();
    expect(await glyph(valid.locator('.field__status'))).toMatch(/#icon-check$/);
    expect((await styles(valid.locator('.field__status'), ['color'])).color).toBe(success);

    const pending = page.locator('#field .field[aria-busy="true"]').first();
    await expect(pending.locator('.field__status')).toBeVisible();
    expect(await glyph(pending.locator('.field__status'))).toMatch(/#icon-more$/);
    expect((await styles(pending.locator('.field__status'), ['color'])).color).toBe(await tokenColor(page, '--color-text-muted'));

    await expect(page.locator('#field .field__control:disabled')).not.toHaveCount(0);
    await expect(page.locator('#field .field__control[readonly]')).not.toHaveCount(0);
    await expect(page.locator('#field textarea.field__control')).not.toHaveCount(0);
    await expect(page.locator('#field select.field__control')).not.toHaveCount(0);
    for (const state of ['.is-hover', '.is-focus']) {
        await expect(page.locator(`#field .field__control${state}`), state).not.toHaveCount(0);
    }
    expectRing(await forcedRing(page.locator('#field .field__control.is-focus').first()), await tokenColor(page, '--color-focus'), 'focus specimen');
    expect(problems).toEqual([]);
});

test('the help toggle works by keyboard and keeps the help text described', async ({ page }) => {
    const problems = await openGallery(page);
    const field = page.locator('#field .field[data-field]').first();
    const toggle = field.getByRole('button', { name: /^Help for / });
    const help = field.locator('.field__help');
    const control = field.locator('.field__control');
    expect(await describedBy(control)).toContain(await help.getAttribute('id'));
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(help).toBeHidden();
    expectRing(await ring(toggle), await tokenColor(page, '--color-focus'), 'help toggle');
    await page.keyboard.press('Enter');
    await expect(toggle).toHaveAttribute('aria-expanded', 'true');
    await expect(help).toBeVisible();
    await page.keyboard.press('Space');
    await expect(toggle).toHaveAttribute('aria-expanded', 'false');
    await expect(help).toBeHidden();
    expect(problems).toEqual([]);
});

test('a live field announces its error on blur and clears it once fixed', async ({ page }) => {
    const problems = await openGallery(page);
    const field = page.locator('#field .field[data-field]').first();
    const control = field.locator('.field__control');
    const counter = field.locator('.field__counter');
    await control.focus();
    await control.blur();
    await expect(control).toHaveAttribute('aria-invalid', 'true');
    const error = field.locator('.field__error');
    await expect(error).toBeVisible();
    const message = (await error.textContent()).trim();
    expect(message).not.toBe('');
    await expect(page.locator('[data-live-region="polite"]')).toHaveCount(1);
    await expect(page.locator('[data-live-region="polite"]')).toHaveText(message);
    await control.fill('Steps');
    await expect(counter).toHaveText(/^5 \/ \d+$/);
    await expect(control).not.toHaveAttribute('aria-invalid', 'true');
    await expect(error).toBeHidden();
    expect(problems).toEqual([]);
});

test('checkboxes and radios use the primary accent, show focus, and keep 44 px rows', async ({ page }) => {
    const problems = await openGallery(page);
    const primary = await tokenColor(page, '--color-primary');
    for (const selector of ['#checkbox .checkbox__control', '#radio .radio__control']) {
        const control = page.locator(`${selector}:enabled:not(.is-focus)`).first();
        expect((await styles(control, ['accent-color']))['accent-color'], selector).toBe(primary);
        expectRing(await ring(control), await tokenColor(page, '--color-focus'), selector);
        const { count, small } = await smallTargets(page, selector);
        expect(count, selector).toBeGreaterThanOrEqual(4);
        expect(small, selector).toEqual([]);
    }
    await expect(page.locator('#checkbox .checkbox__control:checked')).not.toHaveCount(0);
    expect(await page.locator('#checkbox .checkbox__control').evaluateAll((inputs) => inputs.some((input) => input.indeterminate))).toBe(true);
    await expect(page.locator('#checkbox .checkbox__control[aria-invalid="true"]')).not.toHaveCount(0);
    await expect(page.locator('#radio fieldset.field-group .radio__control:checked')).not.toHaveCount(0);
    const disabled = await tokenColor(page, '--color-text-disabled');
    for (const selector of ['#checkbox .checkbox:has(:disabled)', '#radio .radio:has(:disabled)']) {
        expect(await styles(page.locator(selector).first(), ['color', 'cursor']), selector).toEqual({ color: disabled, cursor: 'not-allowed' });
    }
    expect(problems).toEqual([]);
});

test('field groups are fieldsets with legends, and the field sections never overflow', async ({ page }) => {
    await openGallery(page);
    const groups = page.locator('#field-group fieldset.field-group');
    expect(await groups.count()).toBeGreaterThanOrEqual(3);
    for (const group of await groups.all()) {
        await expect(group.locator(':scope > legend.field-group__legend')).toHaveText(/\S/);
    }
    await expect(page.locator('#field-group .field-group--row .field')).not.toHaveCount(0);
    for (const id of ['field', 'checkbox', 'radio', 'field-group', 'form', 'error-summary']) {
        const overflow = await page.locator(`#${id}`).evaluate((section) => section.scrollWidth - section.clientWidth);
        expect(overflow, id).toBeLessThanOrEqual(0);
    }
});
