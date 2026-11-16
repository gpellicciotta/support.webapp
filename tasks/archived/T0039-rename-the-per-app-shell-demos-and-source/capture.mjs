import assert from 'node:assert/strict';
import { mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { chromium } from 'playwright';

const phase = process.argv[2];
assert.ok(['before', 'after'].includes(phase));
const root = new URL('.', import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, '$1');
const folder = join(root, phase);
await mkdir(folder, { recursive: true });
const names = ['list-editor', 'toolbar', 'single-screen', 'portal'];
const oldNames = ['todos', 'counters', 'meteo', 'family-portal'];
const browser = await chromium.launch();
const captures = [];
try {
    for (const width of [1440, 390]) {
        for (const theme of ['light', 'dark']) {
            for (const [index, name] of [...names, 'gallery'].entries()) {
                const page = await browser.newPage({ viewport: { width, height: 900 }, colorScheme: theme, reducedMotion: 'reduce' });
                const errors = [];
                page.on('console', message => {
                    if (message.type() === 'error') { errors.push(message.text()); }
                });
                page.on('pageerror', error => errors.push(error.message));
                page.on('requestfailed', request => errors.push(request.url()));
                page.on('response', response => {
                    if (response.status() >= 400) { errors.push(`${response.status()} ${response.url()}`); }
                });
                const file = name === 'gallery' ? 'visual-style-gallery.html' : `shell-${phase === 'before' ? oldNames[index] : name}.html`;
                const response = await page.goto(`http://127.0.0.1:4173/demo/${file}`, { waitUntil: 'networkidle' });
                assert.equal(response.status(), 200);
                await page.evaluate(() => document.fonts.ready);
                if (name === 'gallery') { await page.locator('#shell').scrollIntoViewIfNeeded(); }
                const path = join(folder, `${name}-${theme}-${width}.png`);
                await page.screenshot({ path });
                assert.deepEqual(errors, []);
                captures.push({ label: `${name} ${theme} ${width}`, path });
                await page.close();
            }
        }
    }
    const sheet = await browser.newPage({ viewport: { width: 1250, height: 1000 } });
    const cards = await Promise.all(captures.map(async ({ label, path }) => `<figure><figcaption>${label}</figcaption><img src="data:image/png;base64,${(await readFile(path)).toString('base64')}"></figure>`));
    await sheet.setContent(`<style>body{margin:0;display:grid;grid-template-columns:repeat(5,250px);font:14px sans-serif}figure{margin:0;padding:4px}img{width:240px;height:215px;object-fit:contain;object-position:top;background:#ddd}</style>${cards.join('')}`);
    await sheet.screenshot({ path: join(root, `${phase}-overview.png`), fullPage: true });
    console.log(`${phase}: ${captures.length} screenshots; HTTP 200; no console, page, or network errors.`);
}
finally {
    await browser.close();
}
