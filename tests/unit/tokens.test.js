import { readdirSync, readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { dirname, join, resolve as resolvePath } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeAll, describe, expect, it } from 'vitest';
import { categories, contrastPairs, readContract } from './contract.js';

const root = fileURLToPath(new URL('../../src/', import.meta.url));
const clean = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');
const declarations = (css) => new Map([...css.matchAll(/(--[\w-]+)\s*:\s*([^;{}]+);/g)].map((match) => [match[1], match[2].trim()]));
const rootDeclarations = (css) => new Map([...css.matchAll(/(?:^|})\s*:root\s*{([^{}]*)}/g)].flatMap((match) => [...declarations(match[1])]));

function chain(path, visited = new Set()) {
    if (visited.has(path)) {
        throw new Error(`Cyclic import: ${path}`);
    }
    const css = clean(readFileSync(path, 'utf8'));
    const next = new Set([...visited, path]);
    return [...css.matchAll(/@import\s+url\(['"]([^'"]+)['"]\);/g)].flatMap((match) => chain(resolvePath(dirname(path), match[1]), next)).concat({ path, css });
}

function files(path) {
    return readdirSync(path, { withFileTypes: true }).flatMap((entry) => entry.isDirectory() ? files(join(path, entry.name)) : [join(path, entry.name)]);
}

// Ported resolution and WCAG helpers from todos.webapp; see the neutral look page.
function splitArgs(args) {
    const parts = [];
    let depth = 0;
    let current = '';
    for (const char of args) {
        if (char === '(') {
            depth++;
        }
        else if (char === ')') {
            depth--;
        }
        if (char === ',' && depth === 0) {
            parts.push(current.trim());
            current = '';
        }
        else {
            current += char;
        }
    }
    parts.push(current.trim());
    return parts;
}

/**
 * Follow a token through var() and light-dark() to its raw value for one theme.
 * @param {Map<string, string>} tokens declaration map
 * @param {string} value raw value or token name
 * @param {'light'|'dark'} theme theme to resolve `light-dark()` for
 * @returns {string} the raw value, such as a hex color
 */
function resolveRaw(tokens, value, theme) {
    let current = value.trim();
    for (let hops = 0; hops < 20; hops++) {
        if (current.startsWith('--')) {
            if (!tokens.has(current)) {
                throw new Error(`undefined token ${current}`);
            }
            current = tokens.get(current);
            continue;
        }
        const lightDark = current.match(/^light-dark\((.*)\)$/s);
        if (lightDark) {
            const [light, dark] = splitArgs(lightDark[1]);
            current = theme === 'light' ? light : dark;
            continue;
        }
        const variable = current.match(/^var\(\s*(--[\w-]+)\s*\)$/);
        if (variable) {
            current = variable[1];
            continue;
        }
        return current;
    }
    throw new Error(`token chain too deep for ${value}`);
}

/**
 * Resolve a token to a hex color for one theme.
 * @param {Map<string, string>} tokens declaration map
 * @param {string} value raw value or token name
 * @param {'light'|'dark'} theme theme to resolve `light-dark()` for
 * @returns {string} the hex color in lowercase `#rrggbb` form
 */
function resolve(tokens, value, theme) {
    const raw = resolveRaw(tokens, value, theme);
    if (!/^#[0-9a-f]{6}$/i.test(raw)) {
        throw new Error(`${value} resolves to "${raw}", not a 6-digit hex color`);
    }
    return raw.toLowerCase();
}

/**
 * Compute the WCAG relative luminance of a hex color.
 * @param {string} hex color in `#rrggbb` form
 * @returns {number} luminance from 0 to 1
 */
function luminance(hex) {
    const channels = [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16) / 255);
    const [r, g, b] = channels.map((c) => (c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4));
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Compute the WCAG contrast ratio of two hex colors.
 * @param {string} a first color
 * @param {string} b second color
 * @returns {number} ratio from 1 to 21
 */
function contrast(a, b) {
    const [high, low] = [luminance(a), luminance(b)].sort((x, y) => y - x);
    return (high + 0.05) / (low + 0.05);
}

describe('token contract', () => {
    it('uses the ADR categories for every contract entry', () => {
        const invalid = readContract().tokens.filter(({ category }) => !categories.includes(category));
        expect(invalid.map(({ name, category }) => [name, category])).toEqual([]);
    });

    it('lists every public look semantic token in the contract', () => {
        const names = new Set(readContract().tokens.map(({ name }) => name));
        for (const look of readdirSync(join(root, 'looks'), { withFileTypes: true }).filter((entry) => entry.isDirectory() && !entry.name.startsWith('_'))) {
            const tokens = declarations(clean(readFileSync(join(root, 'looks', look.name, 'look.css'), 'utf8')));
            expect([...tokens.keys()].filter((name) => !names.has(name)), look.name).toEqual([]);
        }
    });

    const contract = readContract();
    // Validate the copyable template too; other private folders remain excluded.
    const looks = readdirSync(join(root, 'looks'), { withFileTypes: true }).filter((entry) => entry.isDirectory() && (!entry.name.startsWith('_') || entry.name === '_template'));
    it('defines unique tokens, supported themes, and at least one look', () => {
        expect(contract.themes).toEqual(['light', 'dark', 'system']);
        expect(new Set(contract.tokens.map(({ name }) => name)).size).toBe(contract.tokens.length);
        expect(looks.length).toBeGreaterThan(0);
    });

    for (const look of looks) {
        describe(look.name, () => {
            let sheets;
            let tokens;
            let fallback;
            beforeAll(() => {
                sheets = chain(join(root, 'looks', look.name, 'index.css'));
                tokens = new Map(sheets.flatMap(({ css }) => [...rootDeclarations(css.split('@supports')[0].split('@media')[0])]));
                fallback = new Map(sheets.flatMap(({ css }) => [...declarations(css.split('@supports')[1] || '')]));
            });

            it('resolves the complete import chain with base first', () => {
                expect(sheets[0].path).toBe(join(root, 'css', 'base.css'));
            });

            for (const token of contract.tokens) {
                it(`defines ${token.name} under its declared owner when required or present`, () => {
                    expect(['base', 'look']).toContain(token.owner);
                    expect(categories).toContain(token.category);
                    expect(token.group).toBeTruthy();
                    if (!token.required && !tokens.has(token.name)) {
                        return;
                    }
                    expect(tokens.has(token.name)).toBe(true);
                    for (const theme of ['light', 'dark']) {
                        const value = resolveRaw(tokens, token.name, theme);
                        expect(value).toBeTruthy();
                        for (const ref of value.matchAll(/var\((--[\w-]+)\)/g)) {
                            expect(tokens.has(ref[1]), ref[1]).toBe(true);
                        }
                    }
                    const owners = sheets.filter(({ css }) => declarations(css).has(token.name));
                    expect(owners.length).toBeGreaterThan(0);
                    for (const owner of owners) {
                        expect(owner.path === join(root, 'css', 'base.css')).toBe(token.owner === 'base');
                    }
                });

                it(`pins ${token.name} to its light value when themed`, () => {
                    const value = tokens.get(token.name);
                    if (value?.startsWith('light-dark(')) {
                        expect(fallback.has(token.name)).toBe(true);
                        expect(resolveRaw(tokens, fallback.get(token.name), 'light')).toBe(resolveRaw(tokens, token.name, 'light'));
                    }
                });
            }

            for (const theme of ['light', 'dark']) {
                describe(theme, () => {
                    for (const [foreground, background, minimum] of contrastPairs) {
                        it(`${foreground} on ${background} reaches ${minimum}:1`, () => {
                            expect(contrast(resolve(tokens, `--color-${foreground}`, theme), resolve(tokens, `--color-${background}`, theme))).toBeGreaterThanOrEqual(minimum);
                        });
                    }
                    const statuses = contract.tokens.filter((token) => token.status);
                    it('gives present status roles distinct colors', () => {
                        const colors = statuses.filter(({ name }) => tokens.has(name)).map(({ name }) => resolve(tokens, name, theme));
                        expect(new Set(colors).size).toBe(colors.length);
                    });
                    for (const status of statuses) {
                        for (const ground of ['bg', 'surface', 'surface-sunken', 'surface-hover', 'surface-selected', 'surface-active']) {
                            it(`${status.name} on ${ground} reaches 3:1 when present`, () => {
                                if (tokens.has(status.name)) {
                                    expect(contrast(resolve(tokens, status.name, theme), resolve(tokens, `--color-${ground}`, theme))).toBeGreaterThanOrEqual(3);
                                }
                            });
                        }
                    }
                    for (const token of contract.tokens.filter((token) => token.distinctFrom)) {
                        it(`distinguishes ${token.name} from ${token.distinctFrom.name} when present`, () => {
                            if (tokens.has(token.name)) {
                                const rgb = (hex) => [1, 3, 5].map((offset) => parseInt(hex.slice(offset, offset + 2), 16));
                                const reference = rgb(resolve(tokens, token.distinctFrom.name, theme));
                                const color = rgb(resolve(tokens, token.name, theme));
                                expect(Math.hypot(...color.map((value, index) => value - reference[index]))).toBeGreaterThanOrEqual(token.distinctFrom.minimumDistance);
                            }
                        });
                    }
                });
            }
        });
    }

    it('bans raw colors in every stylesheet outside base and look token files', () => {
        for (const path of files(root).filter((path) => path.endsWith('.css'))) {
            if (path === join(root, 'css', 'base.css') || /looks[/\\][^/\\]+[/\\](primitives|look)\.css$/.test(path)) {
                continue;
            }
            expect(clean(readFileSync(path, 'utf8')), path).not.toMatch(/#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i);
        }
    });

    it('rejects missing imports and cyclic imports', () => {
        expect(() => chain(join(root, 'missing.css'))).toThrow();
        expect(() => chain(join(root, 'css', 'style.css'), new Set([join(root, 'css', 'style.css')]))).toThrow('Cyclic import');
    });

    it('resolves nested theme references and known WCAG contrast', () => {
        expect(contrast('#000000', '#ffffff')).toBeCloseTo(21);
        const tokens = new Map([['--a', 'light-dark(var(--b), var(--c))'], ['--b', '#ffffff'], ['--c', '#000000']]);
        expect(resolve(tokens, '--a', 'light')).toBe('#ffffff');
        expect(resolve(tokens, '--a', 'dark')).toBe('#000000');
        expect(() => resolveRaw(tokens, '--missing', 'light')).toThrow('undefined token');
    });

    it('preserves the copied font and license bytes', () => {
        const hashes = {
            'InterVariable.woff2': '693b77d4f32ee9b8bfc995589b5fad5e99adf2832738661f5402f9978429a8e3',
            'OFL.txt': '262481e844521b326f5ecd053e59b98c8b2da78c8ee1bdbb6e8174305e54935a'
        };
        for (const [name, hash] of Object.entries(hashes)) {
            expect(createHash('sha256').update(readFileSync(join(root, 'looks/neutral/fonts', name))).digest('hex')).toBe(hash);
        }
    });
});

describe('component partials', () => {
    const contract = readContract();
    const tokenNames = new Set(contract.tokens.map(({ name }) => name));
    const partials = readdirSync(join(root, 'css', 'components')).filter((name) => name.endsWith('.css')).map((name) => name.slice(0, -4));
    const style = clean(readFileSync(join(root, 'css', 'style.css'), 'utf8'));
    const gallery = readFileSync(join(root, 'demo', 'visual-style-gallery.html'), 'utf8');
    const catalog = readFileSync(fileURLToPath(new URL('../../docs/specs/components.md', import.meta.url)), 'utf8');

    it('ships a partial for every delivered component key', () => {
        expect(partials).toEqual(expect.arrayContaining(['icon', 'button', 'icon-button', 'link-button', 'chip', 'segmented', 'banner']));
    });

    for (const key of partials) {
        describe(key, () => {
            const css = clean(readFileSync(join(root, 'css', 'components', `${key}.css`), 'utf8'));

            it('is a contract component key with a catalog skeleton, a gallery section, and a style.css import', () => {
                expect(contract.components).toContain(key);
                expect(catalog).toMatch(new RegExp(`^### ${key}$`, 'm'));
                expect(gallery).toContain(`<section id="${key}"`);
                expect(style).toContain(`@import url('components/${key}.css');`);
            });

            it('uses only contract tokens and its own private tokens', () => {
                const used = new Set([...css.matchAll(/(?<![\w-])--[\w-]+/g)].map((match) => match[0]));
                const foreign = [...used].filter((name) => !tokenNames.has(name) && !name.startsWith(`--_${key}-`));
                expect(foreign).toEqual([]);
            });

            it('styles only its own block and the gallery state classes', () => {
                const blocks = new Set([...css.matchAll(/\.([a-z][\w-]*?)(?:__[\w-]+|--[\w-]+)?(?![\w-])/g)].map((match) => match[1]));
                expect([...blocks].filter((block) => block !== key && !['is-hover', 'is-focus', 'is-active', 'icon'].includes(block))).toEqual([]);
            });
        });
    }
});
