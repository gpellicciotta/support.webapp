import { expect, test } from '@playwright/test';
import { expectRing, forcedRing, openGallery, styles, tokenColor } from './gallery-helpers.js';

test('a failed submit by Enter fills the error summary, announces it, and focuses it', async ({ page }) => {
    const problems = await openGallery(page);
    const form = page.locator('#form form[data-form]');
    const summary = form.locator('.error-summary');
    await expect(summary).toBeHidden();
    await form.getByLabel('Name', { exact: true }).press('Enter');
    await expect(summary).toBeVisible();
    await expect(summary).toBeFocused();
    await expect(summary).toHaveAttribute('role', 'alert');
    await expect(summary.locator('.error-summary__title')).toHaveText('Fix 2 fields');
    const links = summary.locator('.error-summary__link');
    await expect(links).toHaveCount(2);
    expect(await links.evaluateAll((items) => items.map((link) => link.getAttribute('href')))).toEqual(['#form-name', '#form-url']);
    await expect(form.locator('[aria-invalid="true"]')).toHaveCount(2);
    expectRing(await forcedRing(summary), await tokenColor(page, '--color-focus'), 'focused summary');
    expect((await styles(summary, ['border-inline-start-color']))['border-inline-start-color']).toBe(await tokenColor(page, '--color-danger'));
    expect(problems).toEqual([]);
});

test('each summary link moves focus to its field', async ({ page }) => {
    const problems = await openGallery(page);
    const form = page.locator('#form form[data-form]');
    await form.getByRole('button', { name: 'Save' }).click();
    const summary = form.locator('.error-summary');
    await expect(summary).toBeFocused();
    await summary.locator('.error-summary__link').nth(1).click();
    await expect(form.locator('#form-url')).toBeFocused();
    await summary.locator('.error-summary__link').first().focus();
    await page.keyboard.press('Enter');
    await expect(form.locator('#form-name')).toBeFocused();
    expect(problems).toEqual([]);
});

test('an async check shows the pending state, then its error', async ({ page }) => {
    const problems = await openGallery(page);
    const form = page.locator('#form form[data-form]');
    const field = form.locator('.field:has(#form-name)');
    await form.locator('#form-name').fill('taken');
    await form.locator('#form-name').blur();
    await expect(field).toHaveAttribute('aria-busy', 'true');
    await expect(field.locator('.field__status')).toBeVisible();
    await expect(field).not.toHaveAttribute('aria-busy', 'true');
    await expect(field.locator('.field__error')).toHaveText('That name is taken.');
    await form.locator('#form-name').fill('Steps');
    await form.locator('#form-name').blur();
    await expect(field.locator('.field__status')).toHaveText('Name is free.');
    expect(problems).toEqual([]);
});

test('a valid submit sets the busy state, then confirms the save', async ({ page }) => {
    const problems = await openGallery(page);
    const form = page.locator('#form form[data-form]');
    await expect(page.locator('#form .banner--success')).toBeHidden();
    await form.locator('#form-name').fill('Steps');
    await form.locator('#form-url').fill('https://example.test');
    await form.getByRole('button', { name: 'Save' }).click();
    await expect(form).toHaveAttribute('aria-busy', 'true');
    await expect(form.getByRole('button', { name: 'Save' })).toHaveAttribute('aria-disabled', 'true');
    await expect(form).not.toHaveAttribute('aria-busy', 'true');
    await expect(page.locator('#form .banner--success')).toBeVisible();
    await expect(form.locator('.error-summary')).toBeHidden();
    expect(problems).toEqual([]);
});

test('the error summary section shows a filled summary with links to fields', async ({ page }) => {
    await openGallery(page);
    const summary = page.locator('#error-summary .error-summary');
    await expect(summary).toBeVisible();
    await expect(summary.locator('.error-summary__title')).toHaveText(/\S/);
    for (const link of await summary.locator('.error-summary__link').all()) {
        const target = await link.getAttribute('href');
        await expect(page.locator(target)).toHaveCount(1);
    }
});

test('an edit during a pending check discards the old result and checks the new value', async ({ page }) => {
    const problems = await openGallery(page);
    const form = page.locator('#form form[data-form]');
    const field = form.locator('.field:has(#form-name)');
    const name = form.locator('#form-name');
    await name.fill('taken');
    await name.blur();
    await expect(field).toHaveAttribute('aria-busy', 'true');
    await name.press('End');
    await name.press('s');
    await expect(field).not.toHaveAttribute('aria-busy', 'true');
    await expect(field.locator('.field__status')).toBeHidden();
    // The overtaken check of "taken" settles by checking "takens" instead, which passes.
    await expect(field.locator('.field__status')).toHaveText('Name is free.');
    await expect(field.locator('.field__error')).toBeHidden();
    await expect(name).not.toHaveAttribute('aria-invalid', 'true');
    expect(problems).toEqual([]);
});

test('clearing the address while the name check runs during submit blocks the send', async ({ page }) => {
    const problems = await openGallery(page);
    const form = page.locator('#form form[data-form]');
    await form.locator('#form-name').fill('Steps');
    await form.locator('#form-url').fill('https://example.test');
    await form.getByRole('button', { name: 'Save' }).click();
    await expect(form.locator('.field:has(#form-name)')).toHaveAttribute('aria-busy', 'true');
    await form.locator('#form-url').fill('');
    const summary = form.locator('.error-summary');
    await expect(summary).toBeFocused();
    await expect(summary.locator('.error-summary__link')).toHaveText(['Enter an address.']);
    await expect(form.locator('#form-url')).toHaveAttribute('aria-invalid', 'true');
    await expect(page.locator('#form .banner--success')).toBeHidden();
    expect(problems).toEqual([]);
});
