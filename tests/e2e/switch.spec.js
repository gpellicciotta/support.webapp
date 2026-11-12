import { expect, test } from '@playwright/test';
import { expectRing, openGallery, ring, smallTargets, tokenColor } from './gallery-helpers.js';

test('native switch supports pointer, keyboard, forms, reset, and disabled states', async ({ page }) => {
    const problems = await openGallery(page);
    page.on('requestfailed', request => problems.push(request.url()));
    const control = page.locator('#switch input[name="notifications"]');
    await expect(control).toHaveAccessibleName('Notifications');
    await expect(control).not.toBeChecked();
    await control.locator('..').click();
    await expect(control).toBeChecked();
    await control.focus();
    await page.keyboard.press('Space');
    await expect(control).not.toBeChecked();
    expectRing(await ring(control), await tokenColor(page, '--color-focus'), 'switch');
    await control.check();
    const result = await control.evaluate(input => {
        const form = document.createElement('form');
        input.parentElement.before(form);
        form.append(input.parentElement);
        const on = new FormData(form).get(input.name);
        form.reset();
        return { on, checked: input.checked, off: new FormData(form).has(input.name) };
    });
    expect(result).toEqual({ on: 'on', checked: false, off: false });
    for (const disabled of await page.locator('#switch input:disabled').all()) {
        const checked = await disabled.isChecked();
        await disabled.locator('..').click({ force: true });
        await expect(disabled).toBeChecked({ checked });
        await disabled.focus();
        await expect(disabled).not.toBeFocused();
    }
    expect(problems).toEqual([]);
});

test('switch targets, thumb position, invalid state, and RTL remain visible', async ({ page }) => {
    const problems = await openGallery(page);
    page.on('requestfailed', request => problems.push(request.url()));
    const targets = await smallTargets(page, '#switch input');
    expect(targets.count).toBeGreaterThanOrEqual(8);
    expect(targets.small).toEqual([]);
    const control = page.locator('#switch input[name="notifications"]');
    // CDP exposes the actual pseudo-element box, avoiding assumptions about resolved auto margins.
    const session = await page.context().newCDPSession(page);
    await session.send('DOM.enable');
    const { root } = await session.send('DOM.getDocument');
    const { nodeId } = await session.send('DOM.querySelector', { nodeId: root.nodeId, selector: '#switch input[name="notifications"]' });
    const { node } = await session.send('DOM.describeNode', { nodeId });
    const thumbId = node.pseudoElements.find(element => element.pseudoType === 'before').backendNodeId;
    for (const direction of ['ltr', 'rtl']) {
        await page.locator('#switch').evaluate((section, value) => section.dir = value, direction);
        for (const checked of [false, true]) {
            await control.setChecked(checked);
            const { model } = await session.send('DOM.getBoxModel', { backendNodeId: thumbId });
            const track = await control.boundingBox();
            const thumbCenter = (model.border[0] + model.border[2]) / 2;
            const trackCenter = track.x + track.width / 2;
            expect(thumbCenter < trackCenter, `${direction}, checked=${checked}`).toBe(checked === (direction === 'rtl'));
        }
    }
    await session.detach();
    await expect(page.locator('#switch [aria-invalid="true"]')).toHaveAccessibleDescription('Enable notifications to receive alerts.');
    expect(await page.locator('#switch').evaluate(section => section.scrollWidth - section.clientWidth)).toBeLessThanOrEqual(0);
    expect(problems).toEqual([]);
});

test('forced colors use the system palette for focus and a distinct invalid outline', async ({ page }, testInfo) => {
    const problems = await openGallery(page);
    page.on('requestfailed', request => problems.push(request.url()));
    const control = page.locator('#switch input[name="notifications"]');
    const authorFocus = (await ring(control)).color;
    await page.emulateMedia({ forcedColors: 'active' });
    const system = await page.evaluate(() => {
        const probe = document.createElement('span');
        probe.style.cssText = 'forced-color-adjust: none; color: Highlight; background-color: CanvasText';
        document.body.append(probe);
        const style = getComputedStyle(probe);
        const result = { focus: style.color, invalid: style.backgroundColor };
        probe.remove();
        return result;
    });
    const focused = await ring(control);
    await page.locator('#switch').screenshot({ path: testInfo.outputPath('switch-forced-colors.png') });
    expect(focused.color).not.toBe(authorFocus);
    expectRing(focused, system.focus, 'forced colors switch');
    const invalid = page.locator('#switch [aria-invalid="true"]');
    expect(await invalid.evaluate(input => ({ color: getComputedStyle(input).outlineColor, style: getComputedStyle(input).outlineStyle })))
        .toEqual({ color: system.invalid, style: 'dashed' });
    expectRing(await ring(invalid), system.focus, 'focused invalid switch');
    expect(await control.evaluate(input => getComputedStyle(input, '::before').backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
    expect(problems).toEqual([]);
});
