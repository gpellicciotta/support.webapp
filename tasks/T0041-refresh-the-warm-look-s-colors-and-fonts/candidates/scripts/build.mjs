// Build one patched copy of src/ per candidate under work/candidates/<id>/.
import { cpSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { hexToOklch, hexToRgb, rehue } from './oklch.mjs';
import { bright, warm } from './candidates.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const repo = join(here, '..', '..');

function rampOf(name, ramps) {
    const prefix = name.slice(2).split('-')[0];
    return ramps[prefix];
}

function build(look, candidate) {
    const out = join(here, candidate.id);
    rmSync(out, { recursive: true, force: true });
    mkdirSync(join(out, 'tests', 'unit'), { recursive: true });
    cpSync(join(repo, 'src'), join(out, 'src'), { recursive: true });
    cpSync(join(repo, 'docs'), join(out, 'docs'), { recursive: true });
    for (const file of ['tokens.test.js', 'contract.js']) {
        cpSync(join(repo, 'tests', 'unit', file), join(out, 'tests', 'unit', file));
    }
    const lookDir = join(out, 'src', 'looks', look);
    const primitivesPath = join(lookDir, 'primitives.css');
    const changes = {};
    let css = readFileSync(primitivesPath, 'utf8').replace(/(--[\w-]+)(\s*:\s*)(#[0-9a-fA-F]{6})/g, (match, name, sep, hex) => {
        const ramp = rampOf(name, candidate.ramps);
        if (!ramp) {
            return match;
        }
        const next = rehue(hex.toLowerCase(), ramp);
        changes[name] = { from: hex.toLowerCase(), to: next, fromLch: hexToOklch(hex).map((v) => +v.toFixed(3)), toLch: hexToOklch(next).map((v) => +v.toFixed(3)) };
        return `${name}${sep}${next}`;
    });
    if (look === 'warm' && changes['--navy-900']) {
        const [r, g, b] = hexToRgb(changes['--navy-900'].to).map((c) => Math.round(c * 255));
        css = css.replace(/rgb\(27 36 51 /g, `rgb(${r} ${g} ${b} `);
    }
    writeFileSync(primitivesPath, css);
    if (candidate.fonts) {
        if (look === 'warm') {
            writeFileSync(join(lookDir, 'fonts.css'), '/* Candidate preview: the demo pages load the candidate fonts. */\n');
        }
        const heading = candidate.fonts.heading ?? 'var(--font-body)';
        const look_ = join(lookDir, 'look.css');
        writeFileSync(look_, `${readFileSync(look_, 'utf8')}\n:root {\n  --font-body: ${candidate.fonts.body};\n  --font-heading: ${heading};\n}\n`);
    }
    for (const page of ['visual-style-gallery.html', 'shell-portal.html']) {
        const path = join(out, 'src', 'demo', page);
        let html = readFileSync(path, 'utf8').replace(`<option value="${look}">`, `<option value="${look}" selected>`);
        if (candidate.fonts) {
            html = html.replace('<link id="look-stylesheet"', `<link rel="stylesheet" href="https://fonts.googleapis.com/css2?${candidate.fonts.google}&amp;display=swap">\n    <link id="look-stylesheet"`);
        }
        writeFileSync(path, html);
    }
    writeFileSync(join(out, 'candidate.json'), JSON.stringify({ look, id: candidate.id, name: candidate.name, summary: candidate.summary, fonts: candidate.fontLabel ?? candidate.fonts?.label, changes }, null, 2));
    return out;
}

const only = process.argv[2];
for (const [look, list] of [['warm', warm], ['bright', bright]]) {
    for (const candidate of list) {
        if (!only || candidate.id.startsWith(only)) {
            console.log(build(look, candidate));
        }
    }
}
