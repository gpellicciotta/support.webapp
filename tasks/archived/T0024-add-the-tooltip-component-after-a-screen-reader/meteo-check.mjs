import { createRequire } from 'node:module';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
const require = createRequire(resolve('package.json'));
const { chromium } = require('@playwright/test');
const source = process.argv[2];
const output = process.argv[3];
const html = readFileSync(resolve(source, 'index.html'), 'utf8');
const css = readFileSync(resolve(source, 'css/style.css'), 'utf8');
const browser = await chromium.launch();
try {
    const page = await browser.newPage();
    const button = html.match(/<button type="button" id="btn-config"[\s\S]*?<\/button>/)[0];
    await page.setContent(`<style>${css}</style>${button}`);
    const cdp = await page.context().newCDPSession(page);
    await cdp.send('Accessibility.enable');
    const results = [];
    for (const locale of ['authored', 'en', 'nl']) {
        if (locale !== 'authored') {
            const strings = JSON.parse(readFileSync(resolve(source, `data/strings.${locale}.json`), 'utf8'));
            // Reproduce the three attribute assignments in meteo's applyTranslations, without starting its app.
            await page.locator('button').evaluate((el, s) => {
                el.setAttribute('aria-label', s['start.btn_config_aria']);
                el.dataset.tooltip = s['start.btn_config_tooltip'];
                el.title = s['start.btn_config_tooltip'];
            }, strings);
        }
        for (const mode of ['focus', 'hover']) {
            if (mode === 'focus') { await page.locator('button').focus(); }
            else { await page.locator('button').blur(); await page.locator('button').hover(); }
            const tree = await cdp.send('Accessibility.getFullAXTree');
            const node = tree.nodes.find(n => n.role?.value === 'button');
            results.push({ locale, mode, name: node.name.value, description: node.description?.value ?? null,
                generated: await page.locator('button').evaluate(el => getComputedStyle(el, '::after').content) });
        }
    }
    writeFileSync(output, JSON.stringify({ browser: browser.version(), results }, null, 2));
    console.log(`Chromium ${browser.version()}; extracted Settings control; translation attribute assignments reproduced.`);
    for (const row of results) { console.log(JSON.stringify(row)); }
}
finally { await browser.close(); }
