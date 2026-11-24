// Browser checks of shell additions in shell.css: sidebar end group, entry badges,
// hidden top bar parts, brand logo sizing, and shell banner dismiss button.
import { expect, test } from '@playwright/test';

const BREAKPOINT = 1024;

/**
 * Open a shell demo page and collect console, page, and HTTP errors.
 * @param {import('@playwright/test').Page} page page to drive
 * @param {string} path demo page path
 * @returns {Promise<string[]>} live problem list
 */
async function openDemo(page, path) {
    const problems = [];
    page.on('console', (message) => message.type() === 'error' && problems.push(`console: ${message.text()}`));
    page.on('pageerror', (error) => problems.push(`page: ${error.message}`));
    page.on('response', (response) => response.status() >= 400 && problems.push(`HTTP ${response.status()}: ${response.url()}`));
    const response = await page.goto(path, { waitUntil: 'networkidle' });
    expect(response.status()).toBe(200);
    await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' });
    return problems;
}

/**
 * Verify that the sidebar end list sits pinned at the bottom of the sidebar container.
 * @param {import('@playwright/test').Page} page page to inspect
 * @param {string} label state label for assertion messages
 */
async function expectEndListAtBottom(page, label) {
    const metrics = await page.evaluate(() => {
        const sidebar = document.querySelector('.app__sidebar');
        const mainList = sidebar.querySelector('.app__nav-list:not(.app__nav-list--end)');
        const endList = sidebar.querySelector('.app__nav-list--end');
        const sidebarStyle = getComputedStyle(sidebar);
        const sidebarRect = sidebar.getBoundingClientRect();
        const mainRect = mainList.getBoundingClientRect();
        const endRect = endList.getBoundingClientRect();
        return {
            sidebarBottom: sidebarRect.bottom - parseFloat(sidebarStyle.paddingBottom),
            endBottom: endRect.bottom,
            gap: endRect.top - mainRect.bottom,
            overflowX: sidebar.scrollWidth - sidebar.clientWidth
        };
    });
    expect(Math.abs(metrics.sidebarBottom - metrics.endBottom), `${label}: bottom edge`).toBeLessThanOrEqual(1);
    expect(metrics.gap, `${label}: pushed down from primary list`).toBeGreaterThan(50);
    expect(metrics.overflowX, `${label}: no horizontal overflow`).toBeLessThanOrEqual(0);
}

test('admin-console pins its end list to the sidebar bottom in open, icon rail, and drawer states', async ({ page }) => {
    const { width } = page.viewportSize();
    const problems = await openDemo(page, '/demo/shell-admin-console.html');
    const toggle = page.locator('.app__nav-toggle');
    const endList = page.locator('.app__sidebar > .app__nav-list--end');
    await expect(endList).toHaveCount(1);

    if (width >= BREAKPOINT) {
        // Wide open state.
        await expect(toggle).toHaveAttribute('aria-expanded', 'true');
        await expect(endList).toBeVisible();
        await expectEndListAtBottom(page, 'wide open');

        // Wide icon rail state.
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
        await expect(endList).toBeVisible();
        await expectEndListAtBottom(page, 'wide icon rail');
    }
    else {
        // Narrow drawer state.
        await page.locator('[data-demo-panel-close]').click();
        await toggle.click();
        await expect(page.locator('.app__sidebar')).toBeVisible();
        await expect(endList).toBeVisible();
        await expectEndListAtBottom(page, 'narrow drawer');
    }
    expect(problems).toEqual([]);
});

test('nav entry badge sits at the entry end and stays in the entry accessible name', async ({ page }) => {
    const { width } = page.viewportSize();
    const problems = await openDemo(page, '/demo/shell-admin-console.html');
    const toggle = page.locator('.app__nav-toggle');
    if (width < BREAKPOINT) {
        await page.locator('[data-demo-panel-close]').click();
        await toggle.click();
    }
    const item = page.locator('.app__sidebar .app__nav-item').filter({ has: page.locator('.badge') }).first();
    const badge = item.locator('.badge');
    await expect(item).toHaveCount(1);
    await expect(badge).toBeVisible();
    await expect(item).toHaveAccessibleName(/System events\s+3 unread/);

    const positions = await item.evaluate((link) => {
        const linkStyle = getComputedStyle(link);
        const linkRect = link.getBoundingClientRect();
        const labelRect = link.querySelector('span:not(.badge)').getBoundingClientRect();
        const badgeRect = link.querySelector('.badge').getBoundingClientRect();
        return {
            endEdge: linkRect.right - parseFloat(linkStyle.paddingRight),
            badgeRight: badgeRect.right,
            gapAfterLabel: badgeRect.left - labelRect.right
        };
    });
    expect(Math.abs(positions.endEdge - positions.badgeRight)).toBeLessThanOrEqual(1);
    expect(positions.gapAfterLabel).toBeGreaterThan(20);

    if (width >= BREAKPOINT) {
        // In the icon rail, the clipped badge text remains part of the link's accessible name.
        await toggle.click();
        await expect(toggle).toHaveAttribute('aria-expanded', 'false');
        await expect(item).toHaveAccessibleName(/System events\s+3 unread/);
    }
    expect(problems).toEqual([]);
});

test('hidden top bar parts are not displayed despite their shell display rules', async ({ page }) => {
    // Serve an empty page.css so shell.css itself must hide hidden top bar parts despite their own display rules.
    await page.route('**/css/page.css', (route) => route.fulfill({ status: 200, contentType: 'text/css', body: '' }));
    const problems = await openDemo(page, '/demo/shell-admin-console.html');
    const results = await page.evaluate(() => {
        const bar = document.querySelector('.app__top-bar');
        const brand = bar.querySelector('.app__brand');
        const actions = bar.querySelector('.app__top-actions');
        const toggle = bar.querySelector('.app__nav-toggle');
        const untilFound = document.createElement('span');
        untilFound.setAttribute('hidden', 'until-found');
        bar.append(untilFound);
        brand.hidden = true;
        actions.hidden = true;
        toggle.hidden = true;
        return {
            brand: getComputedStyle(brand).display,
            actions: getComputedStyle(actions).display,
            toggle: getComputedStyle(toggle).display,
            untilFound: getComputedStyle(untilFound).display
        };
    });
    expect(results.brand).toBe('none');
    expect(results.actions).toBe('none');
    expect(results.toggle).toBe('none');
    expect(results.untilFound).not.toBe('none');
    expect(problems).toEqual([]);
});

test('portal brand logo renders at --space-7 with --space-2 gap and banner dismiss sits at the end', async ({ page }) => {
    const problems = await openDemo(page, '/demo/shell-portal.html');
    const brand = page.locator('.app__top-bar .app__brand');
    const logo = brand.locator('.app__brand-logo');
    await expect(brand).toHaveAccessibleName('Portal');
    await expect(logo).toHaveAttribute('alt', '');

    // Remove HTML width/height attributes to confirm CSS sizes the 512x512 SVG logo to --space-7 (32 px).
    const brandMetrics = await brand.evaluate((link) => {
        const img = link.querySelector('.app__brand-logo');
        img.removeAttribute('width');
        img.removeAttribute('height');
        const imgRect = img.getBoundingClientRect();
        const labelRect = link.querySelector('span').getBoundingClientRect();
        return {
            width: imgRect.width,
            height: imgRect.height,
            gap: labelRect.left - imgRect.right
        };
    });
    expect(brandMetrics.width).toBeCloseTo(32, 0);
    expect(brandMetrics.height).toBeCloseTo(32, 0);
    expect(brandMetrics.gap).toBeCloseTo(8, 0);

    // The shell banner's dismiss icon button stays at the end edge, including when wrapped onto its own line.
    const banner = page.locator('.app__banners .banner').first();
    const dismiss = banner.locator('> .icon-button');
    await expect(dismiss).toHaveAccessibleName('Dismiss');
    const measureEndOffset = () => banner.evaluate((el) => {
        const style = getComputedStyle(el);
        const bannerInnerRight = el.getBoundingClientRect().right - parseFloat(style.borderRightWidth) - parseFloat(style.paddingRight);
        const buttonRight = el.querySelector(':scope > .icon-button').getBoundingClientRect().right;
        return Math.abs(bannerInnerRight - buttonRight);
    });
    expect(await measureEndOffset(), 'initial banner').toBeLessThanOrEqual(1);

    // When a sibling action shares a wrapped line with the dismiss button, the action sits at the start, not centered.
    const wrappedActionOffset = await banner.evaluate((el) => {
        const textRect = el.querySelector('.banner__text').getBoundingClientRect();
        const actionRect = el.querySelector('.link-button').getBoundingClientRect();
        if (actionRect.top < textRect.bottom - 1) {
            return null;
        }
        const style = getComputedStyle(el);
        const bannerInnerLeft = el.getBoundingClientRect().left + parseFloat(style.borderLeftWidth) + parseFloat(style.paddingLeft);
        return Math.abs(actionRect.left - bannerInnerLeft);
    });
    if (wrappedActionOffset !== null) {
        expect(wrappedActionOffset, 'wrapped sibling action aligns to banner start').toBeLessThanOrEqual(1);
    }

    // Force the dismiss button onto a new flex line after an action; it must still sit at the end edge.
    await banner.evaluate((el) => {
        const action = el.querySelector('.link-button');
        if (action) {
            action.style.flexBasis = '100%';
        }
    });
    expect(await measureEndOffset(), 'wrapped dismiss button').toBeLessThanOrEqual(1);
    expect(problems).toEqual([]);
});
