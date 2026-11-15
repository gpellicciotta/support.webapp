import { expect, test } from '@playwright/test';

/**
 * Collect console errors, page errors, failed requests, and error responses of a page.
 * @param {import('@playwright/test').Page} page the page to watch
 * @returns {string[]} the problems, filled while the page runs
 */
function watch(page) {
    const problems = [];
    page.on('console', message => {
        if (message.type() === 'error') {
            problems.push(message.text());
        }
    });
    page.on('pageerror', error => problems.push(error.message));
    page.on('requestfailed', request => problems.push(`failed ${request.url()}`));
    page.on('response', response => {
        if (response.status() >= 400) {
            problems.push(`${response.status()} ${response.url()}`);
        }
    });
    return problems;
}

test('shows the shell styled by the design system, without errors or horizontal scrolling', async ({ page }, testInfo) => {
    const problems = watch(page);
    const response = await page.goto('/');
    expect(response.status()).toBe(200);
    await expect(page.locator('.app__top-bar')).toBeVisible();
    await expect(page.locator('.app__main')).toBeVisible();
    await expect(page.locator('#home-title')).toBeVisible();
    await page.evaluate(() => document.fonts.ready);
    const ground = await page.evaluate(() => {
        const probe = document.createElement('div');
        probe.style.backgroundColor = 'var(--color-bg)';
        document.body.append(probe);
        const expected = getComputedStyle(probe).backgroundColor;
        probe.remove();
        return { expected, actual: getComputedStyle(document.body).backgroundColor };
    });
    expect(ground.actual).toBe(ground.expected);
    expect(ground.actual).not.toBe('rgba(0, 0, 0, 0)');
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    expect(overflow).toBeLessThanOrEqual(0);
    await page.screenshot({ path: testInfo.outputPath('start.png'), fullPage: true });
    expect(problems).toEqual([]);
});

test('installs the service worker with every precached file', async ({ page }) => {
    const problems = watch(page);
    await page.goto('/');
    const active = await page.evaluate(async () => (await navigator.serviceWorker.ready).active?.state);
    expect(['activating', 'activated']).toContain(active);
    expect(problems).toEqual([]);
});

test('switches the theme from the settings section', async ({ page }) => {
    await page.goto('/');
    await page.getByLabel('Dark').check();
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
    await page.getByLabel('System').check();
    await expect(page.locator('html')).not.toHaveAttribute('data-theme', /.+/);
});

for (const path of ['/offline.html', '/demo/visual-style-gallery.html']) {
    test(`serves ${path} without errors`, async ({ page }) => {
        const problems = watch(page);
        const response = await page.goto(path);
        expect(response.status()).toBe(200);
        await expect(page.locator('h1')).toBeVisible();
        expect(problems).toEqual([]);
    });
}
