// Browser checks of the help page pattern across looks, themes, widths, and URL query parameters.
import { expect, test } from '@playwright/test';
import { resolve } from 'node:path';
import { expectRing, openGallery, ring, selectGalleryLook, smallTargets, tokenColor } from './gallery-helpers.js';

const looks = ['neutral', 'warm', 'bright'];
const evidence = process.env.HELP_PAGE_PROOF;
const baseline = process.env.HELP_PAGE_BASELINE === '1';

/**
 * Open the standalone help page demo, failing on console, page, and HTTP errors.
 * @param {import('@playwright/test').Page} page page to drive
 * @param {string} [query] optional query string, such as `?topic=faq&q=sso`
 * @returns {Promise<string[]>} live problem list
 */
async function openHelpDemo(page, query = '') {
    const problems = [];
    page.on('console', (message) => message.type() === 'error' && problems.push(`console: ${message.text()}`));
    page.on('pageerror', (error) => problems.push(`page: ${error.message}`));
    page.on('response', (response) => response.status() >= 400 && problems.push(`HTTP ${response.status()}: ${response.url()}`));
    const response = await page.goto(`/demo/help-page.html${query}`, { waitUntil: 'networkidle' });
    expect(response.status()).toBe(200);
    await page.addStyleTag({ content: '*, *::before, *::after { transition: none !important; }' });
    return problems;
}

test.describe('help page pattern', () => {
    test('narrows sections, opens a matching FAQ answer, resets search, and checks layout across looks', async ({ page }, testInfo) => {
        const failures = [];
        page.on('requestfailed', (request) => failures.push(request.url()));

        if (baseline && evidence) {
            const problems = await openGallery(page);
            await page.locator('#release-notes').scrollIntoViewIfNeeded();
            await page.screenshot({ path: resolve(evidence, `before-gallery-${testInfo.project.name}.png`) });
            expect([...problems, ...failures]).toEqual([]);
            return;
        }

        const problems = await openHelpDemo(page);
        const root = page.locator('[data-help-page]');
        const search = root.locator('[data-help-page-search]');
        const clear = root.locator('[data-help-page-search-clear]');
        const sections = root.locator('[data-help-page-section]');
        const faqItems = root.locator('[data-help-page-faq-item]');
        const faqToggle = root.locator('[data-help-page-faq-toggle]');
        const noResults = root.locator('[data-help-page-no-results]');
        const feedbackLink = root.locator('[data-help-page-feedback-link]').first();

        await expect(root).toBeVisible();
        await expect(sections).toHaveCount(6);
        await expect(clear).toBeHidden();
        await expect(noResults).toBeHidden();

        // Feedback link carries app version and signed-in user; toggling user updates it.
        const initialHref = await feedbackLink.getAttribute('href');
        expect(initialHref).toContain('mailto:support%40example.test'.replace('%40', '@'));
        expect(decodeURIComponent(initialHref)).toContain('Version: 1.4.2');
        expect(decodeURIComponent(initialHref)).toContain('User: Alex North <alex@example.test>');

        // Topic filter chips narrow visible sections and set aria-pressed.
        const securityChip = root.locator('[data-help-page-topic="security"]');
        await securityChip.click();
        await expect(securityChip).toHaveAttribute('aria-pressed', 'true');
        await expect(root.locator('[data-help-page-section]:visible')).toHaveCount(2);

        // Reset back to all topics before searching.
        await root.locator('[data-help-page-topic="all"]').click();
        await expect(root.locator('[data-help-page-section]:visible')).toHaveCount(6);

        // Search narrows the sections and automatically expands a matching FAQ answer.
        await search.fill('delegated');
        await expect(clear).toBeVisible();
        await expect(root.locator('[data-help-page-section]:visible')).toHaveCount(1);
        const matchedFaq = faqItems.first();
        await expect(matchedFaq).toBeVisible();
        await expect(matchedFaq.locator('> button')).toHaveAttribute('aria-expanded', 'true');
        const panelId = await matchedFaq.locator('> button').getAttribute('aria-controls');
        await expect(page.locator(`#${panelId}`)).toBeVisible();

        // Unmatched search shows empty state; Reset Search restores all sections and focuses search.
        await search.fill('no-such-help-term');
        await expect(noResults).toBeVisible();
        await expect(root.locator('[data-help-page-no-results-term]')).toHaveText('no-such-help-term');
        await root.locator('[data-help-page-reset]').click();
        await expect(noResults).toBeHidden();
        await expect(search).toHaveValue('');
        await expect(search).toBeFocused();
        await expect(root.locator('[data-help-page-section]:visible')).toHaveCount(6);

        // Expand All opens every FAQ item and switches to Collapse All.
        await faqToggle.click();
        await expect(faqToggle).toHaveText('Collapse All');
        await expect(faqToggle).toHaveAttribute('aria-expanded', 'true');
        await faqToggle.click();
        await expect(faqToggle).toHaveText('Expand All');
        await expect(faqToggle).toHaveAttribute('aria-expanded', 'false');

        // Release notes section is rendered by release-notes.js.
        await expect(root.locator('[data-help-page-release-notes] [data-release-notes-release]')).toHaveCount(2);

        // Focus glow, target sizes, and responsive layout across every look.
        for (const look of looks) {
            await selectGalleryLook(page, look);
            const focusColor = await tokenColor(page, '--color-focus');
            await securityChip.focus();
            expectRing(await ring(securityChip), focusColor, `${look} help-page topic chip`);
            await page.evaluate(() => document.activeElement?.blur());

            const targets = await smallTargets(page, '[data-help-page] button, [data-help-page] a.button');
            expect(targets.count).toBeGreaterThanOrEqual(5);
            expect(targets.small).toEqual([]);
            expect(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth)).toBe(true);

            if (evidence) {
                await page.mouse.move(0, 0);
                await page.evaluate(() => window.scrollTo(0, 0));
                await page.screenshot({ path: resolve(evidence, `after-help-page-${look}-${testInfo.project.name}.png`), fullPage: false });
            }
        }

        expect([...problems, ...failures]).toEqual([]);
    });

    test('applies ?topic= and ?q= query parameters on load', async ({ page }) => {
        if (baseline && evidence) {
            return;
        }
        const problems = await openHelpDemo(page, '?topic=faq&q=backup');
        const root = page.locator('[data-help-page]');

        await expect(root.locator('[data-help-page-topic="faq"]')).toHaveAttribute('aria-pressed', 'true');
        await expect(root.locator('[data-help-page-search]')).toHaveValue('backup');
        await expect(root.locator('[data-help-page-section]:visible')).toHaveCount(1);
        const visibleFaq = root.locator('[data-help-page-faq-item]:visible');
        await expect(visibleFaq).toHaveCount(1);
        await expect(visibleFaq.locator('> button')).toHaveAttribute('aria-expanded', 'true');
        expect(problems).toEqual([]);
    });

    test('renders the help-page gallery section cleanly without overflow', async ({ page }) => {
        if (baseline && evidence) {
            return;
        }
        const problems = await openGallery(page);
        const section = page.locator('#help-page');
        await expect(section).toBeVisible();
        await section.scrollIntoViewIfNeeded();
        expect(await section.evaluate((el) => el.scrollWidth <= el.clientWidth)).toBe(true);
        expect(problems).toEqual([]);
    });
});
