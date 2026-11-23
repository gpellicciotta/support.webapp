// Copy candidate boards, scripts, and a comparison page into each task's companion directory.
import { cpSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const here = dirname(fileURLToPath(import.meta.url));
const tasks = join(here, '..', '..', '.plan', 'tasks');
const report = JSON.parse(readFileSync(join(here, 'shots', 'report.json'), 'utf8'));
const targets = [
    { look: 'warm', prefix: 'w', task: 'T0041-refresh-the-warm-look-s-colors-and-fonts', title: 'T0041 warm look candidates' },
    { look: 'bright', prefix: 'b', task: 'T0042-refresh-the-bright-look-s-colors-and-fonts', title: 'T0042 bright look candidates' }
];
const swatchNames = ['--color-bg', '--color-surface', '--color-text', '--color-primary', '--color-link', '--color-focus', '--color-danger', '--color-warning-bg'];

for (const target of targets) {
    const out = join(tasks, target.task, 'candidates');
    mkdirSync(join(out, 'scripts'), { recursive: true });
    for (const script of ['oklch.mjs', 'candidates.mjs', 'build.mjs', 'render.mjs', 'publish.mjs']) {
        cpSync(join(here, script), join(out, 'scripts', script));
    }
    const ids = readdirSync(here).filter((name) => name.startsWith(target.prefix) && /^\w\d-/.test(name)).sort();
    const rows = [];
    const md = [`# ${target.title}`, 'Each candidate re-hues the current primitives at the same WCAG luminance per step.', 'Every candidate passes the full token test: AA pairs, status contrast, and accent variants.', ''];
    for (const id of ids) {
        const meta = JSON.parse(readFileSync(join(here, id, 'candidate.json'), 'utf8'));
        for (const theme of ['light', 'dark']) {
            cpSync(join(here, 'shots', `${id}-board-${theme}.png`), join(out, `${id}-${theme}.png`));
        }
        const light = report[`${id}/light`].tokens;
        const dark = report[`${id}/dark`].tokens;
        const fonts = meta.fonts ?? `${light.fontHeading.split(',')[0]} headings, ${light.fontBody.split(',')[0]} body`;
        md.push(`## ${meta.name} (\`${id}\`)`, meta.summary, `- Fonts: ${fonts}.`, `- Light: primary \`${light['--color-primary']}\`, background \`${light['--color-bg']}\`, text \`${light['--color-text']}\`.`, `- Dark: primary \`${dark['--color-primary']}\`, background \`${dark['--color-bg']}\`, text \`${dark['--color-text']}\`.`, `- Boards: [light](${id}-light.png), [dark](${id}-dark.png).`, '');
        const chips = (tokens) => swatchNames.map((n) => `<span class="chip" title="${n} ${tokens[n]}" style="background:${tokens[n]}"></span>`).join('');
        rows.push(`<section><h2>${meta.name} <code>${id}</code></h2><p>${meta.summary}<br><b>Fonts:</b> ${fonts}</p>
<div class="pair"><figure><figcaption>Light ${chips(light)}</figcaption><a href="${id}-light.png"><img src="${id}-light.png" alt="${meta.name}, light"></a></figure>
<figure><figcaption>Dark ${chips(dark)}</figcaption><a href="${id}-dark.png"><img src="${id}-dark.png" alt="${meta.name}, dark"></a></figure></div></section>`);
    }
    writeFileSync(join(out, 'candidates.md'), md.join('\n'));
    writeFileSync(join(out, 'index.html'), `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${target.title}</title>
<style>body{font:15px/1.5 system-ui,sans-serif;margin:0 auto;padding:24px 16px;max-width:1600px;background:#f4f4f5;color:#18181b}h1{margin:0 0 4px}section{margin:32px 0;padding-top:16px;border-top:1px solid #d4d4d8}h2{margin:0}code{font-size:.8em;color:#52525b}
.pair{display:grid;grid-template-columns:1fr 1fr;gap:16px}@media(max-width:800px){.pair{grid-template-columns:1fr}}figure{margin:0}figcaption{display:flex;gap:4px;align-items:center;font-weight:600;margin-bottom:6px}
.chip{width:18px;height:18px;border-radius:4px;border:1px solid #0003;display:inline-block}img{width:100%;border:1px solid #d4d4d8;border-radius:6px;display:block}</style></head>
<body><h1>${target.title}</h1><p>Candidate 0 is today's look. Each candidate re-hues the current primitives at the same WCAG luminance, and all pass the full token test. Click a board for full size. Swatches: background, surface, text, primary, link, focus, danger, warning background.</p>
${rows.join('\n')}</body></html>`);
    console.log(out);
}
