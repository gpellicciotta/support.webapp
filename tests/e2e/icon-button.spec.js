import { expect, test } from '@playwright/test';
import { STATES, expectRing, forcedRing, openGallery, ring, smallTargets, styles, tokenColor, tokenLength } from './gallery-helpers.js';

const PLAIN = '.icon-button:not(.icon-button--danger, [aria-pressed="true"])';
const PRESSED = '.icon-button[aria-pressed="true"]';
const DANGER = '.icon-button--danger';

test('the icon button section shows the plain, pressed, and danger buttons in every state', async ({ page }) => {
    const problems = await openGallery(page);
    await expect(page.locator('#icon-button h2')).toHaveText('Icon button');
    for (const [variant, selector] of Object.entries({ plain: PLAIN, danger: DANGER })) {
        for (const state of STATES) {
            await expect(page.locator(`#icon-button ${selector}${state}`), `${variant} ${state}`).not.toHaveCount(0);
        }
    }
    for (const state of [STATES[0], '.is-hover', '.is-focus', '.is-active']) {
        await expect(page.locator(`#icon-button ${PRESSED}${state}`), `pressed ${state}`).not.toHaveCount(0);
    }
    await expect(page.locator('#icon-button .icon-button[aria-pressed="false"]')).not.toHaveCount(0);
    expect(problems).toEqual([]);
});

test('every icon button has a label, one decorative icon, and a 44 px square target', async ({ page }) => {
    await openGallery(page);
    const buttons = page.locator('#icon-button .icon-button');
    for (const button of await buttons.all()) {
        await expect(button).toHaveAttribute('aria-label', /\S/);
        await expect(button.locator('svg.icon[aria-hidden="true"]')).toHaveCount(1);
    }
    const { count, small } = await smallTargets(page, '#icon-button .icon-button');
    expect(count).toBeGreaterThanOrEqual(13);
    expect(small).toEqual([]);
    expect((await styles(buttons.first(), ['border-top-left-radius']))['border-top-left-radius']).toBe(await tokenLength(page, '--radius-button'));
});

test('pressed toggles differ from plain ones and keep distinct hover and active grounds', async ({ page }) => {
    await openGallery(page);
    const grounds = [];
    for (const state of [STATES[0], '.is-hover', '.is-active']) {
        grounds.push((await styles(page.locator(`#icon-button ${PRESSED}${state}`).first(), ['background-color']))['background-color']);
    }
    expect(new Set(grounds).size, grounds.join(' / ')).toBe(3);
    const plain = await styles(page.locator(`#icon-button ${PLAIN}${STATES[0]}`).first(), ['background-color', 'border-top-color', 'color']);
    const pressed = await styles(page.locator(`#icon-button ${PRESSED}${STATES[0]}`).first(), ['background-color', 'border-top-color', 'color']);
    expect(pressed['border-top-color']).toBe(await tokenColor(page, '--color-primary'));
    expect(pressed).not.toEqual(plain);
});

test('disabled icon buttons use the disabled text color', async ({ page }) => {
    await openGallery(page);
    const disabled = await tokenColor(page, '--color-text-disabled');
    const buttons = page.locator('#icon-button .icon-button:disabled');
    expect(await buttons.count()).toBeGreaterThanOrEqual(2);
    for (const button of await buttons.all()) {
        expect(await styles(button, ['color', 'cursor'])).toEqual({ color: disabled, cursor: 'not-allowed' });
    }
});

test('danger icon buttons use the danger color and the danger focus ring', async ({ page }) => {
    await openGallery(page);
    const danger = await tokenColor(page, '--color-danger');
    expect((await styles(page.locator(`#icon-button ${DANGER}${STATES[0]}`).first(), ['color'])).color).toBe(danger);
    expectRing(await ring(page.locator(`#icon-button ${DANGER}${STATES[0]}`).first()), danger, 'danger');
    expectRing(await forcedRing(page.locator(`#icon-button ${DANGER}.is-focus`).first()), danger, 'danger specimen');
    const focus = await tokenColor(page, '--color-focus');
    expectRing(await ring(page.locator(`#icon-button ${PLAIN}${STATES[0]}`).first()), focus, 'plain');
    expectRing(await forcedRing(page.locator(`#icon-button ${PLAIN}.is-focus`).first()), focus, 'plain specimen');
});
