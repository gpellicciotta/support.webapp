// Capture gallery screenshots per theme at 390 and 1440 px with an in-process static server.
// Usage: node capture.mjs <worktree> <before|after>
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL, fileURLToPath } from 'node:url';

const [worktree, phase] = process.argv.slice(2);
const { contentType, resolveRequest } = await import(pathToFileURL(join(worktree, 'scripts/serve.mjs')).href);
const { chromium } = await import(pathToFileURL(join(worktree, 'node_modules/playwright/index.mjs')).href);
const webRoot = join(worktree, 'src');
const outDir = fileURLToPath(new URL('.', import.meta.url));
const sections = ['button', 'icon-button', 'chip', 'segmented', 'banner'];

const server = createServer(async (request, response) => {
    const target = resolveRequest(webRoot, request.url);
    try {
        const body = await readFile(target);
        response.writeHead(200, { 'content-type': contentType(target) });
        response.end(body);
    }
    catch {
        response.writeHead(404);
        response.end();
    }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const problems = [];
try {
    for (const width of [390, 1440]) {
        for (const theme of ['light', 'dark']) {
            const page = await browser.newPage({ viewport: { width, height: 900 } });
            page.on('console', (message) => message.type() === 'error' && problems.push(`console: ${message.text()}`));
            page.on('pageerror', (error) => problems.push(`page: ${error.message}`));
            page.on('response', (response) => response.status() >= 400 && problems.push(`HTTP ${response.status()}: ${response.url()}`));
            const response = await page.goto(`${base}/demo/visual-style-gallery.html`, { waitUntil: 'networkidle' });
            console.log(`${phase} ${theme} ${width}px: HTTP ${response.status()}`);
            await page.locator(`input[name="theme"][value="${theme}"]`).check();
            await page.evaluate(() => document.fonts.ready.then(() => true));
            const boxes = await page.evaluate((ids) => ids.map((id) => document.getElementById(id))
                .filter(Boolean).map((el) => {
                    const box = el.getBoundingClientRect();
                    return { top: box.top + scrollY, bottom: box.bottom + scrollY };
                }), sections);
            const path = join(outDir, `${phase}-controls-${theme}-${width}.png`);
            if (boxes.length) {
                const top = Math.min(...boxes.map((box) => box.top));
                const bottom = Math.max(...boxes.map((box) => box.bottom));
                await page.screenshot({ path, fullPage: true, clip: { x: 0, y: top, width, height: bottom - top } });
            }
            else {
                // Before the controls exist, capture the end of the page, where they will be added.
                const height = await page.evaluate(() => document.documentElement.scrollHeight);
                await page.screenshot({ path, fullPage: true, clip: { x: 0, y: Math.max(0, height - 900), width, height: Math.min(900, height) } });
            }
            await page.close();
        }
    }
}
finally {
    await browser.close();
    server.close();
}
console.log(problems.length ? problems.join('\n') : 'no console errors, page errors, or HTTP errors');
process.exitCode = problems.length ? 1 : 0;
