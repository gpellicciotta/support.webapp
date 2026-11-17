import { expect, test } from '@playwright/test';
import { STATES, expectRing, forcedRing, openGallery, ring, selectGalleryLook, smallTargets, styles, tokenColor, tokenLength } from './gallery-helpers.js';

const FILTER = '.chip--filter';
const PRESSED = '.chip--filter[aria-pressed="true"]';

test('the chip section shows static, overdue, status, removable, and filter chips in every state', async ({ page }, testInfo) => {
    const problems = await openGallery(page);
    if (process.env.T0048_BEFORE) {
        await page.locator('#chip').screenshot({ path: `${process.env.T0048_BEFORE}/before-chip-${testInfo.project.name}.png` });
    }
    await expect(page.locator('#chip h2')).toHaveText('Chip');
    await expect(page.locator('#chip span.chip:not(.chip--overdue, .chip--removable, .chip--status)')).not.toHaveCount(0);
    await expect(page.locator('#chip span.chip.chip--overdue')).not.toHaveCount(0);
    await expect(page.locator('#chip span.chip.chip--status')).toHaveCount(4);
    await expect(page.locator('#chip span.chip.chip--removable > button.chip__remove')).not.toHaveCount(0);
    await expect(page.locator('#chip .chip__remove.is-focus')).not.toHaveCount(0);
    for (const state of STATES) {
        await expect(page.locator(`#chip button${FILTER}[aria-pressed="false"]${state}`), `filter ${state}`).not.toHaveCount(0);
    }
    for (const state of [STATES[0], '.is-hover', '.is-focus', '.is-active']) {
        await expect(page.locator(`#chip ${PRESSED}${state}`), `pressed ${state}`).not.toHaveCount(0);
    }
    expect(problems).toEqual([]);
});

test('static chips are not focusable, and interactive chip parts are 44 px targets', async ({ page }) => {
    await openGallery(page);
    const statics = page.locator('#chip span.chip');
    expect(await statics.count()).toBeGreaterThanOrEqual(4);
    for (const chip of await statics.all()) {
        expect(await chip.evaluate((element) => element.tabIndex)).toBe(-1);
    }
    const { count, small } = await smallTargets(page, `#chip ${FILTER}, #chip .chip__remove`);
    expect(count).toBeGreaterThanOrEqual(10);
    expect(small).toEqual([]);
    const removes = page.locator('#chip .chip__remove');
    expect(await removes.count()).toBeGreaterThanOrEqual(2);
    for (const remove of await removes.all()) {
        await expect(remove).toHaveAttribute('aria-label', /^Remove \S/);
    }
});

test('chips take the chip radius role', async ({ page }) => {
    await openGallery(page);
    const radius = await tokenLength(page, '--radius-chip');
    for (const selector of ['span.chip', FILTER, '.chip__remove']) {
        expect((await styles(page.locator(`#chip ${selector}`).first(), ['border-top-left-radius']))['border-top-left-radius'], selector).toBe(radius);
    }
});

test('overdue chips carry the danger color and an icon, never color alone', async ({ page }) => {
    await openGallery(page);
    const overdue = page.locator('#chip .chip--overdue').first();
    expect((await styles(overdue, ['color'])).color).toBe(await tokenColor(page, '--color-danger'));
    await expect(overdue.locator('svg.icon')).toHaveCount(1);
    await expect(overdue).toHaveText(/\S/);
});

test('pressed filter chips differ from plain ones and keep distinct hover and active grounds', async ({ page }) => {
    await openGallery(page);
    const grounds = [];
    for (const state of [STATES[0], '.is-hover', '.is-active']) {
        grounds.push((await styles(page.locator(`#chip ${PRESSED}${state}`).first(), ['background-color']))['background-color']);
    }
    expect(new Set(grounds).size, grounds.join(' / ')).toBe(3);
    const pressed = await styles(page.locator(`#chip ${PRESSED}${STATES[0]}`).first(), ['border-top-color', 'border-top-width']);
    const plain = await styles(page.locator(`#chip ${FILTER}[aria-pressed="false"]${STATES[0]}`).first(), ['border-top-color', 'border-top-width']);
    expect(pressed['border-top-color']).toBe(await tokenColor(page, '--color-primary'));
    expect(pressed).not.toEqual(plain);
});

test('pressed filter chips stay distinct in forced colors mode', async ({ page }) => {
    await openGallery(page);
    await page.emulateMedia({ forcedColors: 'active' });
    const width = async (selector) => parseFloat((await styles(page.locator(`#chip ${selector}${STATES[0]}`).first(), ['border-top-width']))['border-top-width']);
    expect(await width(PRESSED)).toBeGreaterThan(await width(`${FILTER}[aria-pressed="false"]`));
});

test('disabled filter chips use the disabled text color', async ({ page }) => {
    await openGallery(page);
    const disabled = await tokenColor(page, '--color-text-disabled');
    const chips = page.locator(`#chip ${FILTER}:disabled`);
    expect(await chips.count()).toBeGreaterThanOrEqual(1);
    for (const chip of await chips.all()) {
        expect(await styles(chip, ['color', 'cursor'])).toEqual({ color: disabled, cursor: 'not-allowed' });
    }
});

test('filter chips and remove buttons draw the focus ring', async ({ page }) => {
    await openGallery(page);
    const focus = await tokenColor(page, '--color-focus');
    expectRing(await ring(page.locator(`#chip ${FILTER}${STATES[0]}`).first()), focus, 'filter chip');
    expectRing(await ring(page.locator(`#chip .chip__remove${STATES[0]}`).first()), focus, 'remove button');
    expectRing(await forcedRing(page.locator(`#chip ${FILTER}.is-focus`).first()), focus, 'filter chip specimen');
    expectRing(await forcedRing(page.locator('#chip .chip__remove.is-focus').first()), focus, 'remove button specimen');
});

test('the remove button shows hover and active grounds distinct from its sunken chip', async ({ page }) => {
    await openGallery(page);
    const chip = page.locator('#chip .chip--removable').first();
    await chip.evaluate((element) => {
        const remove = element.querySelector('.chip__remove');
        for (const state of ['is-hover', 'is-active']) {
            const clone = remove.cloneNode(true);
            clone.classList.add(state);
            clone.setAttribute('aria-label', `${remove.getAttribute('aria-label')} ${state}`);
            element.append(clone);
        }
    });
    const ground = (await styles(chip, ['background-color']))['background-color'];
    const grounds = [];
    for (const state of [':not(.is-hover, .is-active)', '.is-hover', '.is-active']) {
        grounds.push((await styles(chip.locator(`.chip__remove${state}`).first(), ['background-color']))['background-color']);
    }
    expect(grounds.slice(1), `chip ${ground}`).not.toContain(ground);
    expect(new Set(grounds).size, grounds.join(' / ')).toBe(3);
});

for (const look of ['neutral', 'warm', 'bright']) {
    test(`${look} status chips pair distinct icon shapes with words and color warning and danger icons`, async ({ page }, testInfo) => {
        const problems = await openGallery(page);
        await selectGalleryLook(page, look);
        const section = page.locator('#chip');
        const statuses = section.locator('span.chip.chip--status');
        await expect(statuses).toHaveCount(4);

        const text = await tokenColor(page, '--color-text');
        const muted = await tokenColor(page, '--color-text-muted');
        const danger = await tokenColor(page, '--color-danger');
        const shapes = [];
        for (const chip of await statuses.all()) {
            expect(await chip.evaluate((element) => element.tabIndex)).toBe(-1);
            await expect(chip.locator('svg.icon')).toHaveCount(1);
            await expect(chip).toHaveText(/\S/);
            expect((await styles(chip, ['color'])).color).toBe(text);
            const href = await chip.locator('svg.icon use').getAttribute('href');
            shapes.push(href.split('#')[1]);
        }
        expect(new Set(shapes).size).toBe(4);

        const neutralIcons = section.locator('span.chip.chip--status:not(.chip--warning, .chip--danger) > svg.icon');
        await expect(neutralIcons).toHaveCount(2);
        for (const icon of await neutralIcons.all()) {
            expect((await styles(icon, ['color'])).color).toBe(muted);
        }
        for (const tone of ['.chip--warning', '.chip--danger']) {
            const icon = section.locator(`span.chip.chip--status${tone} > svg.icon`).first();
            expect((await styles(icon, ['color'])).color, tone).toBe(danger);
        }
        if (process.env.T0048_AFTER) {
            await section.screenshot({ path: `${process.env.T0048_AFTER}/after-chip-${look}-${testInfo.project.name}.png` });
        }
        expect(problems).toEqual([]);
    });
}
