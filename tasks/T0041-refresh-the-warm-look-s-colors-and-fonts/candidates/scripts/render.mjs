// Render each candidate's gallery specimens and portal shell in light and dark with Playwright.
import { createServer } from 'node:http';
import { cpSync, existsSync, mkdirSync, readFileSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from '@playwright/test';
import { contentType, resolveRequest } from '../../scripts/serve.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..', '..');
const SECTIONS = ['button', 'badge', 'chip', 'field', 'banner', 'card'];

// The current look as the baseline, built as an unpatched copy with the look preselected.
for (const look of ['warm', 'bright']) {
    const out = join(here, `${look[0]}0-current`);
    rmSync(out, { recursive: true, force: true });
    cpSync(join(repo, 'src'), join(out, 'src'), { recursive: true });
    for (const page of ['visual-style-gallery.html', 'shell-portal.html']) {
        const path = join(out, 'src', 'demo', page);
        writeFileSync(path, readFileSync(path, 'utf8').replace(`<option value="${look}">`, `<option value="${look}" selected>`));
    }
    writeFileSync(join(out, 'candidate.json'), JSON.stringify({ look, id: `${look[0]}0-current`, name: 'Current', summary: 'Today\'s values, for reference.', changes: {} }, null, 2));
}

const ids = readdirSync(here).filter((name) => existsSync(join(here, name, 'candidate.json')));
let webRoot = '';
const server = createServer(async (req, res) => {
    const target = resolveRequest(webRoot, req.url);
    try {
        const body = readFileSync(target);
        res.writeHead(200, { 'content-type': contentType(target), 'cache-control': 'no-store' });
        res.end(body);
    }
    catch {
        res.writeHead(404);
        res.end();
    }
});
await new Promise((resolve) => server.listen(0, '127.0.0.1', resolve));
const base = `http://127.0.0.1:${server.address().port}`;
const browser = await chromium.launch();
const shots = join(here, 'shots');
mkdirSync(shots, { recursive: true });
const report = {};
for (const id of ids) {
    webRoot = join(here, id, 'src');
    const meta = JSON.parse(readFileSync(join(here, id, 'candidate.json'), 'utf8'));
    for (const theme of ['light', 'dark']) {
        const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: theme });
        const page = await context.newPage();
        await page.goto(`${base}/demo/visual-style-gallery.html`, { waitUntil: 'networkidle' });
        await page.addStyleTag({ content: `
            .gallery-header, .gallery-main > section:not(${SECTIONS.map((s) => `#${s}`).join(', ')}), .gallery-section > p, .is-trimmed { display: none !important; }
            .gallery-main { display: grid !important; grid-template-columns: 1fr 1fr; gap: 0 3rem; align-items: start; max-width: none !important; padding-block: 1.5rem !important; }
            .gallery-main > .board-hero, #card { grid-column: 1 / -1; }
            #field { grid-row: span 2; }
            *, *::before, *::after { transition: none !important; animation: none !important; }` });
        await page.evaluate((name) => {
            const button = document.getElementById('button');
            let trimming = false;
            for (const child of button.children) {
                if (child.tagName === 'H3' && child.textContent.trim() === 'Danger outline') {
                    trimming = true;
                }
                if (trimming) {
                    child.classList.add('is-trimmed');
                }
            }
            const chip = document.getElementById('chip');
            trimming = false;
            for (const child of chip.children) {
                if (child.tagName === 'H3' && child.textContent.trim() === 'Filter') {
                    trimming = true;
                }
                if (trimming) {
                    child.classList.add('is-trimmed');
                }
            }
            const hero = document.createElement('div');
            hero.className = 'board-hero';
            hero.innerHTML = `<h1 style="font-family: var(--font-heading); font-size: var(--text-2xl); line-height: var(--leading-tight); letter-spacing: var(--tracking-tight); margin: 0 0 .5rem">${name}</h1><p style="max-width: 60ch; margin: 0 0 1rem; color: var(--color-text-muted)">Sunday lunch at Grandma's moved to 13:00. Bring the folding chairs, and check the shared shopping list before you leave. <a href="#">See the calendar</a>.</p>`;
            document.querySelector('.gallery-main').prepend(hero);
        }, meta.name);
        await page.evaluate(() => document.fonts.ready);
        await page.waitForTimeout(300);
        const fonts = await page.evaluate(() => [...document.fonts].filter((f) => f.status === 'loaded').map((f) => f.family));
        const look = await page.evaluate(() => document.getElementById('look-stylesheet').getAttribute('href'));
        await page.screenshot({ path: join(shots, `${id}-board-${theme}.png`), fullPage: true });
        const tokens = await page.evaluate(() => {
            const probe = document.createElement('div');
            document.body.append(probe);
            const read = (name) => {
                probe.style.color = `var(${name})`;
                const [r, g, b] = getComputedStyle(probe).color.match(/\d+/g).map(Number);
                return '#' + [r, g, b].map((c) => c.toString(16).padStart(2, '0')).join('');
            };
            const names = ['--color-bg', '--color-surface', '--color-text', '--color-text-muted', '--color-primary', '--color-on-primary', '--color-link', '--color-focus', '--color-danger', '--color-warning-bg', '--color-success'];
            const out = Object.fromEntries(names.map((n) => [n, read(n)]));
            out.fontBody = getComputedStyle(document.documentElement).getPropertyValue('--font-body').trim();
            out.fontHeading = getComputedStyle(document.documentElement).getPropertyValue('--font-heading').trim();
            probe.remove();
            return out;
        });
        report[`${id}/${theme}`] = { look, fonts: [...new Set(fonts)], tokens };
        await context.close();
    }
    console.log(`rendered ${id} (${meta.look})`);
}
await browser.close();
server.close();
writeFileSync(join(shots, 'report.json'), JSON.stringify(report, null, 1));
