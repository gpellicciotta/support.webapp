import { expect, test } from '@playwright/test';
import { looks } from '../../src/demo/gallery.js';
import { expectForcedRing, expectRing, shadowLayers, forcedRing, openGallery, ring, selectGalleryLook, smallTargets, styles, tokenColor, tokenLength } from './gallery-helpers.js';

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
    const authorFocus = shadowLayers((await ring(control)).shadow)[0].color;
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
    expectForcedRing(focused, system.focus, 'forced colors switch');
    const invalid = page.locator('#switch [aria-invalid="true"]');
    expect(await invalid.evaluate(input => ({ color: getComputedStyle(input).outlineColor, style: getComputedStyle(input).outlineStyle })))
        .toEqual({ color: system.invalid, style: 'dashed' });
    expectForcedRing(await ring(invalid), system.focus, 'focused invalid switch');
    expect(await control.evaluate(input => getComputedStyle(input, '::before').backgroundColor)).not.toBe('rgba(0, 0, 0, 0)');
    expect(problems).toEqual([]);
});

test('switch uses a low track, one border width rounder than controls, with a concentric thumb in every look', async ({ page }) => {
    const problems = await openGallery(page);
    page.on('requestfailed', request => problems.push(request.url()));
    const probe = locator => locator.evaluate(el => ({
        bg: getComputedStyle(el).backgroundColor, border: getComputedStyle(el).borderTopColor,
        thumb: getComputedStyle(el, '::before').backgroundColor
    }));
    for (const look of looks) {
        await selectGalleryLook(page, look);
        const [control, borderRaw, widthRaw, lowRaw, previousRaw] = await Promise.all(
            ['--radius-control', '--border-width', '--space-8', '--space-5', '--space-6'].map(name => tokenLength(page, name))
        );
        const [border, width, low, previous] = [borderRaw, widthRaw, lowRaw, previousRaw].map(parseFloat);
        const height = low + 2 * border;
        expect(height, look).toBeLessThan(previous);
        const radius = parseFloat(control) + border;
        const expected = { trackRadius: `${radius}px`, thumbRadius: `${Math.max(0, radius - 2 * border)}px`, size: `${height - 4 * border}px` };
        for (const control of await page.locator('#switch .switch__control').all()) {
            expect(await control.boundingBox(), look).toMatchObject({ width, height });
            const actual = await control.evaluate(el => {
                const [track, thumb] = [getComputedStyle(el), getComputedStyle(el, '::before')];
                return { trackRadius: track.borderTopLeftRadius, thumbRadius: thumb.borderTopLeftRadius, size: `${thumb.width}x${thumb.height}` };
            });
            expect(actual.trackRadius, look).not.toBe('50%');
            expect(actual.trackRadius, look).not.toContain(' ');
            expect(actual, look).toEqual({ ...expected, size: `${expected.size}x${expected.size}` });
        }
        expect((await smallTargets(page, '#switch input')).small, look).toEqual([]);
        const [surface, muted, primary, onPrimary, sunken, disabled, hover, active, focus, danger] = await Promise.all(
            ['surface', 'text-muted', 'primary', 'on-primary', 'surface-sunken', 'text-disabled', 'surface-hover', 'surface-active', 'focus', 'danger']
                .map(name => tokenColor(page, `--color-${name}`))
        );
        expect(await probe(page.locator('#switch input[name="notifications"]')), `${look} off`).toEqual({ bg: surface, border: muted, thumb: muted });
        expect(await probe(page.locator('#switch input:checked:not(:disabled)').first()), `${look} on`).toEqual({ bg: primary, border: primary, thumb: onPrimary });
        expect(await probe(page.locator('#switch input:disabled').first()), `${look} disabled`).toEqual({ bg: sunken, border: disabled, thumb: disabled });
        expect(await styles(page.locator('#switch .switch.is-hover'), ['background-color']), look).toEqual({ 'background-color': hover });
        expect(await styles(page.locator('#switch .switch.is-active'), ['background-color']), look).toEqual({ 'background-color': active });
        expectRing(await forcedRing(page.locator('#switch .switch__control.is-focus')), focus, `${look} focus`);
        expectForcedRing(await forcedRing(page.locator('#switch [aria-invalid="true"]')), danger, `${look} invalid`);
    }
    expect(problems).toEqual([]);
});
