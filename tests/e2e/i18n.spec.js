import { expect, test } from '@playwright/test';

test('translates scoped markup and switches catalogs safely', async ({ page }) => {
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    page.on('console', message => {
        if (message.type() === 'error') {
            errors.push(message.text());
        }
    });
    page.on('requestfailed', request => errors.push(request.url()));
    page.on('response', response => {
        if (response.status() >= 400) {
            errors.push(`${response.status()} ${response.url()}`);
        }
    });
    expect((await page.goto('/')).status()).toBe(200);
    const result = await page.evaluate(async () => {
        const { setCatalog, applyTranslations } = await import('/js/i18n.js');
        document.body.innerHTML = `<main data-i18n-aria="common.label">
            <span data-i18n="common.save" data-i18n-html></span>
            <input data-i18n-placeholder="common.label" data-i18n-tooltip="common.save">
            <span data-i18n="common.missing"></span></main>
            <aside data-i18n="common.save">Outside</aside>`;
        setCatalog({ 'common.save': '<b>Save</b>', 'common.label': 'Name' });
        const root = document.querySelector('main');
        applyTranslations(root);
        const first = {
            aria: root.getAttribute('aria-label'), text: root.querySelector('span').textContent,
            html: root.querySelectorAll('b').length, placeholder: root.querySelector('input').placeholder,
            tooltip: root.querySelector('input').dataset.tooltip, title: root.querySelector('input').title,
            missing: root.querySelectorAll('span')[1].textContent, outside: document.querySelector('aside').textContent
        };
        setCatalog({ 'common.save': 'Opslaan', 'common.label': 'Naam' });
        applyTranslations();
        const fragment = document.createDocumentFragment();
        const child = document.createElement('span');
        child.dataset.i18n = 'common.save';
        fragment.append(child);
        applyTranslations(fragment);
        return { first, switched: root.querySelector('span').textContent, fragment: child.textContent };
    });
    expect(result).toEqual({
        first: { aria: 'Name', text: '<b>Save</b>', html: 0, placeholder: 'Name',
            tooltip: '<b>Save</b>', title: '<b>Save</b>', missing: 'common.missing', outside: 'Outside' },
        switched: 'Opslaan', fragment: 'Opslaan'
    });
    expect(errors).toEqual([]);
});
