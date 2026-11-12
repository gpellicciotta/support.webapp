// Browser verifier, ported from family-portal's scripts/verify-ui.py at commit 1953f75.
// The static token test covers raw colors, so this verifier checks only rendered pages.
import { expect, test } from '@playwright/test';
import { lookHref, looks } from '../../src/demo/gallery.js';

// Shell demos join this list when they exist.
const pages = [{ name: 'gallery', path: '/demo/visual-style-gallery.html' }];
const NORMAL_TEXT_RATIO = 4.5;
const LARGE_TEXT_RATIO = 3;
const NON_TEXT_RATIO = 3;
const MIN_FOCUS_OUTLINE_PX = 2;

/**
 * Collect everything the checks need in one pass inside the page.
 * @returns {object} overflow, fonts, stylesheets, texts, targets, and focus records
 */
function collect() {
    const interactive = 'a[href], button, input:not([type="hidden"]), select, textarea, summary, [role="button"], [role="link"]';
    const visible = (el) => {
        const box = el.getBoundingClientRect();
        if (box.width === 0 || box.height === 0) {
            return false;
        }
        for (let node = el; node; node = node.parentElement) {
            const style = getComputedStyle(node);
            if (style.display === 'none' || style.visibility === 'hidden' || parseFloat(style.opacity) === 0 || node.getAttribute('aria-hidden') === 'true') {
                return false;
            }
        }
        return true;
    };
    const describe = (el) => el.tagName.toLowerCase() + (el.id ? `#${el.id}` : '')
        + (typeof el.className === 'string' && el.className.trim() ? `.${el.className.trim().split(/\s+/).join('.')}` : '');
    const layers = (start) => {
        const result = [];
        for (let node = start; node; node = node.parentElement) {
            const style = getComputedStyle(node);
            result.push({ color: style.backgroundColor, image: style.backgroundImage !== 'none' });
        }
        return result;
    };
    const probe = document.createElement('div');
    probe.className = 'verify-probe';
    probe.style.cssText = 'position:absolute;visibility:hidden;width:var(--target-min, 2.75rem)';
    document.body.append(probe);
    const targetMin = parseFloat(getComputedStyle(probe).width);
    probe.remove();
    const out = {
        overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth),
        targetMin,
        canvas: getComputedStyle(document.documentElement).backgroundColor,
        background: getComputedStyle(document.body).backgroundColor,
        fonts: [...document.fonts].map((face) => ({ family: face.family, weight: face.weight, status: face.status })),
        stylesheets: [], missingStylesheets: [], texts: [], targets: [], focus: []
    };
    // Follow @import chains, since every look entry pulls its partials in that way.
    const walk = (sheet, owner) => {
        if (!sheet) {
            out.missingStylesheets.push(owner);
            return;
        }
        out.stylesheets.push(sheet.href);
        let rules;
        try {
            rules = [...sheet.cssRules];
        }
        catch {
            out.missingStylesheets.push(sheet.href);
            return;
        }
        for (const rule of rules.filter((rule) => rule instanceof CSSImportRule)) {
            walk(rule.styleSheet, rule.href);
        }
    };
    for (const link of document.querySelectorAll('link[rel="stylesheet"]')) {
        walk(link.sheet, link.href);
    }
    for (const el of document.body.querySelectorAll('*')) {
        if (['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'OPTION'].includes(el.tagName)) {
            continue;
        }
        const ownText = [...el.childNodes].filter((node) => node.nodeType === Node.TEXT_NODE).map((node) => node.textContent).join('').trim();
        // Inactive controls are exempt from contrast (WCAG 1.4.3), including the label of a disabled control.
        if (!ownText || !visible(el) || el.closest('[disabled], [aria-disabled="true"]') || el.closest('label')?.control?.disabled) {
            continue;
        }
        const style = getComputedStyle(el);
        let opacity = 1;
        for (let node = el; node; node = node.parentElement) {
            opacity *= parseFloat(getComputedStyle(node).opacity);
        }
        out.texts.push({ where: describe(el), text: ownText.slice(0, 40), color: style.color, opacity,
            size: parseFloat(style.fontSize), weight: parseInt(style.fontWeight, 10) || 400, layers: layers(el) });
    }
    for (const el of document.querySelectorAll(interactive)) {
        // :disabled also covers controls inside a disabled fieldset, whose own disabled property stays false.
        if (!visible(el) || el.matches(':disabled')) {
            continue;
        }
        let box = el.getBoundingClientRect();
        if ((el.type === 'checkbox' || el.type === 'radio') && el.labels?.length) {
            box = el.labels[0].getBoundingClientRect();
        }
        // A link counts as inside a sentence only when real words surround it (WCAG 2.5.8).
        let inSentence = false;
        if (el.tagName === 'A' && getComputedStyle(el).display === 'inline' && el.parentElement) {
            const rest = el.parentElement.cloneNode(true);
            rest.querySelectorAll(`${interactive}, [aria-hidden="true"]`).forEach((node) => node.remove());
            inSentence = /\p{L}{2,}/u.test(rest.textContent);
        }
        out.targets.push({ where: describe(el), width: box.width, height: box.height, inSentence });
        const before = getComputedStyle(el).boxShadow;
        el.focus();
        const focused = getComputedStyle(el);
        out.focus.push({ where: describe(el), focusVisible: el.matches(':focus-visible'), outlineStyle: focused.outlineStyle,
            outlineWidth: parseFloat(focused.outlineWidth), outlineColor: focused.outlineColor, boxShadow: focused.boxShadow,
            boxShadowBefore: before, layers: layers(el.parentElement) });
        el.blur();
    }
    return out;
}

/**
 * Fetch every sprite file the page references and list the references that do not resolve.
 * @returns {Promise<{references: number, problems: string[]}>} the reference count and one line per unresolved reference
 */
async function collectSprites() {
    const uses = [...document.querySelectorAll('use')].map((use) => use.getAttribute('href') ?? use.getAttribute('xlink:href') ?? '');
    const files = new Map();
    const problems = [];
    for (const href of uses) {
        const url = new URL(href, document.baseURI);
        const file = url.href.split('#')[0];
        if (!url.hash) {
            problems.push(`sprite reference without an id: ${href}`);
            continue;
        }
        if (!files.has(file)) {
            files.set(file, fetch(file).then(async (response) => (response.ok
                ? new DOMParser().parseFromString(await response.text(), 'image/svg+xml')
                : null)));
        }
        const sprite = await files.get(file);
        if (!sprite) {
            problems.push(`sprite file not loaded: ${href}`);
        }
        else if (!sprite.getElementById(decodeURIComponent(url.hash.slice(1)))) {
            problems.push(`unresolved sprite reference: ${href}`);
        }
    }
    return { references: uses.length, problems };
}

/**
 * Parse a computed CSS color into 0-255 channels and alpha.
 * @param {string} value computed color, such as `rgb(1 2 3 / 50%)` or `color(srgb 0.1 0.2 0.3)`
 * @returns {number[]|null} `[r, g, b, a]`, or null when the format is unknown
 */
export function parseColor(value) {
    const text = value.trim().toLowerCase();
    if (text === 'transparent') {
        return [0, 0, 0, 0];
    }
    const alpha = (raw) => (raw === undefined ? 1 : raw.endsWith('%') ? parseFloat(raw) / 100 : parseFloat(raw));
    let match = text.match(/^rgba?\(\s*([\d.]+)[\s,]+([\d.]+)[\s,]+([\d.]+)(?:\s*[,/]\s*([\d.]+%?))?\s*\)$/);
    if (match) {
        return [Number(match[1]), Number(match[2]), Number(match[3]), alpha(match[4])];
    }
    match = text.match(/^color\(srgb\s+([\d.]+)\s+([\d.]+)\s+([\d.]+)(?:\s*\/\s*([\d.]+%?))?\s*\)$/);
    if (match) {
        return [Number(match[1]) * 255, Number(match[2]) * 255, Number(match[3]) * 255, alpha(match[4])];
    }
    return null;
}

const blend = (top, bottom) => [0, 1, 2].map((index) => top[index] * top[3] + bottom[index] * (1 - top[3]));

function luminance(rgb) {
    const [r, g, b] = rgb.map((channel) => {
        const value = channel / 255;
        return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrastRatio(a, b) {
    const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (high + 0.05) / (low + 0.05);
}

/**
 * Composite background layers from the element outward over the canvas.
 * @param {{color: string, image: boolean}[]} layers background layers, innermost first
 * @param {string} canvas computed canvas color
 * @returns {number[]|null} the opaque RGB background, or null when an image makes it unknown
 */
function background(layers, canvas) {
    const base = parseColor(canvas);
    let rgb = base && base[3] >= 1 ? base.slice(0, 3) : [255, 255, 255];
    const shown = [];
    for (const layer of layers) {
        shown.push(layer);
        const color = parseColor(layer.color);
        if (color && color[3] >= 1) {
            break;
        }
    }
    if (shown.some((layer) => layer.image)) {
        return null;
    }
    for (const layer of shown.reverse()) {
        const color = parseColor(layer.color);
        if (color && color[3] > 0) {
            rgb = blend(color, rgb);
        }
    }
    return rgb;
}

/** WCAG AA minimum: 3:1 for large text (24 px, or 18.66 px bold), otherwise 4.5:1. */
const requiredRatio = (size, weight) => (size >= 24 || (size >= 18.66 && weight >= 700) ? LARGE_TEXT_RATIO : NORMAL_TEXT_RATIO);

export function contrastProblems(texts, canvas) {
    const problems = [];
    for (const text of texts) {
        const ground = background(text.layers, canvas);
        if (!ground) {
            continue;
        }
        const color = parseColor(text.color);
        if (!color) {
            problems.push(`${text.where} '${text.text}': unparsed color ${text.color}`);
            continue;
        }
        const ratio = contrastRatio(blend([...color.slice(0, 3), color[3] * text.opacity], ground), ground);
        const need = requiredRatio(text.size, text.weight);
        if (ratio + 1e-9 < need) {
            problems.push(`${text.where} '${text.text}': contrast ${ratio.toFixed(2)} < ${need}`);
        }
    }
    return problems;
}

export function targetProblems(targets, minimum) {
    const tolerance = 0.5;
    return targets.filter((target) => !target.inSentence && (target.width + tolerance < minimum || target.height + tolerance < minimum))
        .map((target) => `${target.where}: target ${target.width.toFixed(0)}x${target.height.toFixed(0)}px < ${minimum.toFixed(0)}px`);
}

export function focusProblems(records, canvas) {
    const problems = [];
    for (const record of records) {
        const outlined = record.outlineStyle !== 'none' && record.outlineWidth >= MIN_FOCUS_OUTLINE_PX;
        const shadowed = record.boxShadow !== 'none' && record.boxShadow !== record.boxShadowBefore;
        if (!record.focusVisible) {
            problems.push(`${record.where}: does not match :focus-visible when focused`);
        }
        else if (!outlined && !shadowed) {
            problems.push(`${record.where}: no visible focus indicator`);
        }
        else if (outlined) {
            const ground = background(record.layers, canvas);
            const color = parseColor(record.outlineColor);
            if (ground && color) {
                const ratio = contrastRatio(blend(color, ground), ground);
                if (ratio + 1e-9 < NON_TEXT_RATIO) {
                    problems.push(`${record.where}: focus outline contrast ${ratio.toFixed(2)} < ${NON_TEXT_RATIO}`);
                }
            }
        }
    }
    return problems;
}

/**
 * Turn one run's collected data into problem lines; an empty list means the run passed.
 * @param {object} data the result of `collect`
 * @returns {string[]} problems
 */
export function summarize(data) {
    return [
        ...(data.overflow > 0 ? [`horizontal overflow ${data.overflow}px`] : []),
        ...data.missingStylesheets.map((href) => `stylesheet not loaded: ${href}`),
        ...data.fonts.filter((face) => face.status === 'error').map((face) => `font ${face.family} ${face.weight}: error`),
        ...contrastProblems(data.texts, data.canvas),
        ...targetProblems(data.targets, data.targetMin),
        ...focusProblems(data.focus, data.canvas)
    ];
}

function watchErrors(page) {
    const errors = [];
    page.on('console', (message) => message.type() === 'error' && errors.push(`console: ${message.text()}`));
    page.on('pageerror', (error) => errors.push(`page error: ${error.message}`));
    page.on('requestfailed', (request) => errors.push(`request failed: ${request.method()} ${request.url()} ${request.failure()?.errorText}`));
    page.on('response', (response) => response.status() >= 400 && errors.push(`HTTP ${response.status()}: ${response.url()}`));
    return errors;
}

async function open(page, path, look, theme) {
    const response = await page.goto(path, { waitUntil: 'networkidle' });
    await page.locator('#look-select').selectOption(look);
    await page.locator(`input[name="theme"][value="${theme}"]`).check();
    await page.waitForFunction((href) => {
        const sheet = document.getElementById('look-stylesheet').sheet;
        return sheet?.href.endsWith(href.replace(/^(\.\.\/)+/, '/')) && sheet.cssRules.length > 0;
    }, lookHref(look));
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => document.fonts.ready.then(() => true));
    return response;
}

async function check(page) {
    // Keyboard modality makes programmatic focus match :focus-visible, as for keyboard users.
    await page.keyboard.press('Tab');
    return page.evaluate(collect);
}

for (const target of pages) {
    for (const look of looks) {
        test(`${target.name} passes every verifier check in the ${look} look`, async ({ context }, testInfo) => {
            const { colorScheme, viewport } = testInfo.project.use;
            const opposite = colorScheme === 'dark' ? 'light' : 'dark';
            // The system choice follows the emulated preference; the explicit choice must override it.
            for (const [theme, effective] of [['system', colorScheme], [opposite, opposite]]) {
                await test.step(`${theme} theme at ${viewport.width} px`, async () => {
                    const page = await context.newPage();
                    const errors = watchErrors(page);
                    const response = await open(page, target.path, look, theme);
                    expect(response.status()).toBe(200);
                    await page.screenshot({ path: testInfo.outputPath(`${target.name}-${look}-${effective}-${viewport.width}-${theme === 'system' ? 'system' : 'explicit'}.png`), fullPage: true });
                    const data = await check(page);
                    const sprites = await page.evaluate(collectSprites);
                    // One summary line per run, as family-portal's verifier printed.
                    console.log(`[${look} ${theme} ${viewport.width}px] ${data.stylesheets.length} stylesheets, ${data.texts.length} texts, `
                        + `${data.targets.length} targets, ${data.focus.length} focus records, ${sprites.references} sprite references, `
                        + `overflow ${data.overflow}px, errors ${errors.length}`);
                    expect(data.stylesheets.some((href) => href.endsWith(lookHref(look).replace(/^(\.\.\/)+/, '/')))).toBe(true);
                    expect(data.stylesheets.some((href) => href.endsWith('/css/style.css'))).toBe(true);
                    expect(data.texts.length).toBeGreaterThan(0);
                    expect(data.targets.length).toBeGreaterThan(0);
                    expect(sprites.references).toBeGreaterThan(0);
                    expect(luminance(parseColor(data.background).slice(0, 3)) < 0.2, `${effective} background ${data.background}`).toBe(effective === 'dark');
                    expect([...errors, ...summarize(data), ...sprites.problems]).toEqual([]);
                    await page.close();
                });
            }
        });
    }
}

test('reports injected overflow, contrast, target, and focus violations', async ({ page }) => {
    await open(page, pages[0].path, looks[0], 'system');
    await page.evaluate(() => {
        const main = document.querySelector('main');
        main.insertAdjacentHTML('beforeend', `<div id="faults">
            <p id="faint">Faint placeholder text</p>
            <button id="tiny" type="button">x</button>
            <button id="unringed" type="button">Placeholder action</button>
            <div id="wide">Wide placeholder</div>
            <label id="inactive"><input type="radio" disabled>Inactive placeholder</label></div>`);
        const ground = getComputedStyle(document.body).backgroundColor;
        Object.assign(document.getElementById('faint').style, { color: ground });
        Object.assign(document.getElementById('tiny').style, { width: '10px', height: '10px', padding: '0' });
        Object.assign(document.getElementById('unringed').style, { outline: 'none', minHeight: '3rem', minWidth: '3rem' });
        Object.assign(document.getElementById('wide').style, { width: '300vw' });
        Object.assign(document.getElementById('inactive').style, { color: ground });
    });
    const problems = summarize(await check(page));
    expect(problems.filter((problem) => problem.startsWith('horizontal overflow'))).toHaveLength(1);
    expect(problems.some((problem) => problem.startsWith('p#faint') && problem.includes('contrast'))).toBe(true);
    expect(problems.some((problem) => problem.startsWith('button#tiny: target 10x10px'))).toBe(true);
    expect(problems).toContain('button#unringed: no visible focus indicator');
    // WCAG exempts the text of inactive controls, so a label of a disabled control is not checked.
    expect(problems.filter((problem) => problem.startsWith('label#inactive'))).toEqual([]);
});

test('reports unresolved sprite references', async ({ page }) => {
    await open(page, pages[0].path, looks[0], 'system');
    await page.evaluate(() => {
        document.querySelector('main').insertAdjacentHTML('beforeend', `<div id="faults">
            <svg class="icon" aria-hidden="true"><use href="../looks/neutral/icons.svg#icon-missing"/></svg>
            <svg class="icon" aria-hidden="true"><use href="../looks/missing/icons.svg#icon-close"/></svg></div>`);
    });
    const { problems } = await page.evaluate(collectSprites);
    expect(problems).toEqual([
        'unresolved sprite reference: ../looks/neutral/icons.svg#icon-missing',
        'sprite file not loaded: ../looks/missing/icons.svg#icon-close'
    ]);
});
