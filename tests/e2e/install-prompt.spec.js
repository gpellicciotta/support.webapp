// Browser checks of the install prompt module on the portal shell demo.
import { expect, test } from '@playwright/test';

/** Answer `(display-mode: standalone)` with a match, as an installed app does. */
function standalone() {
    const realMatchMedia = window.matchMedia.bind(window);
    window.matchMedia = (query) => {
        if (!query.includes('display-mode: standalone')) {
            return realMatchMedia(query);
        }
        return {
            matches: true, media: query, onchange: null,
            addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {},
            dispatchEvent: () => false
        };
    };
}

/**
 * Open the portal demo, failing on console, page, and HTTP errors.
 * @param {import('@playwright/test').Page} page page to drive
 * @param {boolean} [installed] whether the page runs in standalone display mode
 * @returns {Promise<string[]>} live problem list
 */
async function openPortal(page, installed = false) {
    const problems = [];
    page.on('console', (message) => message.type() === 'error' && !message.text().includes('Failed to load resource') && problems.push(`console: ${message.text()}`));
    page.on('pageerror', (error) => problems.push(`page: ${error.message}`));
    page.on('response', (response) => response.status() >= 400 && problems.push(`HTTP ${response.status()}: ${response.url()}`));
    if (installed) {
        await page.addInitScript(standalone);
    }
    const response = await page.goto('/demo/shell-portal.html', { waitUntil: 'networkidle' });
    expect(response.status()).toBe(200);
    return problems;
}

/**
 * Dispatch a synthetic `beforeinstallprompt` event on the demo window.
 * @param {import('@playwright/test').Page} page page to drive
 * @param {'accepted'|'dismissed'} outcome user choice returned when prompted
 * @returns {Promise<{defaultPrevented: boolean}>} whether the module prevented the default banner
 */
function fireInstallPrompt(page, outcome = 'accepted') {
    return page.evaluate((choice) => {
        window.__installPromptCalls = 0;
        const event = new Event('beforeinstallprompt', { cancelable: true });
        event.prompt = () => {
            window.__installPromptCalls += 1;
        };
        event.userChoice = Promise.resolve({ outcome: choice, platform: 'web' });
        window.dispatchEvent(event);
        return { defaultPrevented: event.defaultPrevented };
    }, outcome);
}

test.describe('install prompt', () => {
    test('stays hidden until beforeinstallprompt arrives, then prompts and hides on click', async ({ page }) => {
        const problems = await openPortal(page);
        const action = page.locator('[data-install-prompt-action]');
        await expect(action).toBeHidden();

        const fired = await fireInstallPrompt(page, 'accepted');
        expect(fired.defaultPrevented).toBe(true);
        await expect(action).toBeVisible();

        await action.click();
        expect(await page.evaluate(() => window.__installPromptCalls)).toBe(1);
        await expect(action).toBeHidden();
        await expect(page.locator('.toast-region .toast__text')).toHaveText(['Install prompt accepted.']);
        expect(problems).toEqual([]);
    });

    test('reports a dismissed choice and shows the action again on a new beforeinstallprompt', async ({ page }) => {
        const problems = await openPortal(page);
        const action = page.locator('[data-install-prompt-action]');
        await fireInstallPrompt(page, 'dismissed');
        await expect(action).toBeVisible();

        await action.click();
        await expect(action).toBeHidden();
        await expect(page.locator('.toast-region .toast__text')).toHaveText(['Install prompt dismissed.']);

        await fireInstallPrompt(page, 'accepted');
        await expect(action).toBeVisible();
        expect(problems).toEqual([]);
    });

    test('hides the install action when appinstalled fires', async ({ page }) => {
        const problems = await openPortal(page);
        const action = page.locator('[data-install-prompt-action]');
        await fireInstallPrompt(page, 'accepted');
        await expect(action).toBeVisible();

        await page.evaluate(() => window.dispatchEvent(new Event('appinstalled')));
        await expect(action).toBeHidden();
        expect(problems).toEqual([]);
    });

    test('stays hidden when running in standalone display mode', async ({ page }) => {
        const problems = await openPortal(page, true);
        const action = page.locator('[data-install-prompt-action]');
        await expect(action).toHaveCount(1);
        await expect(action).toBeHidden();
        await fireInstallPrompt(page, 'accepted');
        await expect(action).toBeHidden();
        expect(problems).toEqual([]);
    });
});
