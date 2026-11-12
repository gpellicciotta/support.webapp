import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { createIcon, iconSizes, setSpriteUrl, spriteIcon } from '../../src/js/icon.js';
import { readContract } from './contract.js';

const root = fileURLToPath(new URL('../../src/', import.meta.url));
const SVG = 'http://www.w3.org/2000/svg';
const looks = readdirSync(join(root, 'looks'), { withFileTypes: true }).filter((entry) => entry.isDirectory() && (!entry.name.startsWith('_') || entry.name === '_template'));
const symbols = (svg) => [...svg.matchAll(/<symbol\b([^>]*)>([\s\S]*?)<\/symbol>/g)].map((match) => ({
    id: match[1].match(/\bid="([^"]+)"/)?.[1],
    viewBox: match[1].match(/\bviewBox="([^"]+)"/)?.[1],
    body: match[2]
}));

// A minimal simulated DOM: only the members icon.js uses.
class FakeElement {
    constructor(namespace, tag) {
        this.namespaceURI = namespace;
        this.tagName = tag;
        this.attributes = new Map();
        this.children = [];
    }

    setAttribute(name, value) {
        this.attributes.set(name, String(value));
    }

    getAttribute(name) {
        return this.attributes.has(name) ? this.attributes.get(name) : null;
    }

    append(...nodes) {
        this.children.push(...nodes);
    }

    get outerHTML() {
        const attributes = [...this.attributes].map(([name, value]) => ` ${name}="${value}"`).join('');
        return `<${this.tagName}${attributes}>${this.children.map((child) => child.outerHTML).join('')}</${this.tagName}>`;
    }
}

const doc = { createElementNS: (namespace, tag) => new FakeElement(namespace, tag) };

describe('createIcon', () => {
    beforeEach(() => setSpriteUrl('vendor/design/looks/neutral/icons.svg'));

    it('builds a decorative sprite reference in the SVG namespace', () => {
        const icon = createIcon(doc, 'close');
        expect(icon.namespaceURI).toBe(SVG);
        expect(icon.children[0].namespaceURI).toBe(SVG);
        expect(icon.outerHTML).toBe('<svg class="icon" aria-hidden="true" focusable="false"><use href="vendor/design/looks/neutral/icons.svg#icon-close"></use></svg>');
    });

    it.each(iconSizes)('adds the %s size modifier', (size) => {
        expect(createIcon(doc, 'more', { size }).getAttribute('class')).toBe(`icon icon--${size}`);
    });

    it('appends extra classes after the icon classes', () => {
        expect(createIcon(doc, 'alert', { size: 'sm', className: 'field__icon  is-busy ' }).getAttribute('class')).toBe('icon icon--sm field__icon is-busy');
    });

    it('labels a meaningful icon as an image instead of hiding it', () => {
        const icon = createIcon(doc, 'alert', { label: 'Error' });
        expect(icon.getAttribute('role')).toBe('img');
        expect(icon.getAttribute('aria-label')).toBe('Error');
        expect(icon.getAttribute('aria-hidden')).toBeNull();
    });

    it('follows the sprite url set last', () => {
        setSpriteUrl('/static/icons.svg');
        expect(createIcon(doc, 'check').children[0].getAttribute('href')).toBe('/static/icons.svg#icon-check');
    });

    it.each(['icon-close', 'Close', 'close icon', '', 'close#x'])('rejects the name "%s"', (name) => {
        expect(() => createIcon(doc, name)).toThrow(RangeError);
    });

    it('rejects an unknown size', () => {
        expect(() => createIcon(doc, 'close', { size: 'xl' })).toThrow(RangeError);
    });

    it.each([['', TypeError], [42, TypeError], ['icons.svg#icon-close', RangeError]])('rejects the sprite url %j', (url, error) => {
        expect(() => setSpriteUrl(url)).toThrow(error);
    });

    it('keeps the deprecated spriteIcon alias of todos.webapp', () => {
        expect(spriteIcon(doc, 'check').outerHTML).toBe(createIcon(doc, 'check').outerHTML);
        expect(spriteIcon(doc, 'add', 'icon empty-state__icon').getAttribute('class')).toBe('icon empty-state__icon');
    });
});

describe('createIcon without a sprite url', () => {
    it('fails until the app sets the sprite url', async () => {
        vi.resetModules();
        const fresh = await import('../../src/js/icon.js');
        expect(() => fresh.createIcon(doc, 'close')).toThrow(/setSpriteUrl/);
    });
});

describe('core icon ids', () => {
    const icons = readContract().icons;

    it('lists unique icon-prefixed kebab-case ids, validation icons included', () => {
        expect(new Set(icons).size).toBe(icons.length);
        expect(icons.filter((id) => !/^icon-[a-z0-9]+(-[a-z0-9]+)*$/.test(id))).toEqual([]);
        expect(icons).toEqual(expect.arrayContaining(['icon-alert', 'icon-check', 'icon-help', 'icon-close', 'icon-more', 'icon-chevron-down']));
    });

    for (const look of looks) {
        describe(`${look.name} sprite`, () => {
            const svg = readFileSync(join(root, 'looks', look.name, 'icons.svg'), 'utf8');
            const glyphs = symbols(svg);

            it('provides every core id', () => {
                const ids = new Set(glyphs.map(({ id }) => id));
                expect(icons.filter((id) => !ids.has(id))).toEqual([]);
            });

            it('draws unique icon-prefixed symbols on the 24-unit grid', () => {
                expect(glyphs.length).toBeGreaterThan(0);
                expect(new Set(glyphs.map(({ id }) => id)).size).toBe(glyphs.length);
                expect(glyphs.filter(({ id }) => !/^icon-[a-z0-9]+(-[a-z0-9]+)*$/.test(id ?? ''))).toEqual([]);
                expect(glyphs.filter(({ viewBox }) => viewBox !== '0 0 24 24').map(({ id }) => id)).toEqual([]);
            });

            it('holds no color of its own', () => {
                const paints = glyphs.flatMap(({ id, body }) => [...body.matchAll(/\b(fill|stroke|color|style)="([^"]*)"/g)]
                    .filter(([, , value]) => !['none', 'currentColor'].includes(value))
                    .map(([attribute]) => `${id}: ${attribute}`));
                expect(paints).toEqual([]);
            });
        });
    }
});

describe('icon class', () => {
    const css = readFileSync(join(root, 'css', 'components', 'icon.css'), 'utf8');

    it('is imported by the look-neutral style sheet', () => {
        expect(readFileSync(join(root, 'css', 'style.css'), 'utf8')).toContain("@import url('components/icon.css');");
    });

    it('draws strokes in currentColor at the md size by default', () => {
        const rule = css.match(/\.icon\s*{([^}]*)}/)[1];
        expect(rule).toMatch(/inline-size:\s*var\(--icon-md\)/);
        expect(rule).toMatch(/block-size:\s*var\(--icon-md\)/);
        expect(rule).toMatch(/stroke:\s*currentColor/);
        expect(rule).toMatch(/stroke-width:\s*var\(--icon-stroke\)/);
        expect(rule).toMatch(/fill:\s*none/);
    });

    it.each(iconSizes)('sizes the %s modifier with its token', (size) => {
        expect(css).toMatch(new RegExp(`\\.icon--${size}\\s*{[^}]*--icon-${size}\\b`));
    });
});

describe('gallery icon section', () => {
    const html = readFileSync(join(root, 'demo', 'visual-style-gallery.html'), 'utf8');
    const section = html.match(/<section id="icon"[\s\S]*?<\/section>/)?.[0] ?? '';

    it('shows every neutral glyph with its id', () => {
        expect(section).not.toBe('');
        for (const { id } of symbols(readFileSync(join(root, 'looks', 'neutral', 'icons.svg'), 'utf8'))) {
            expect(section, id).toContain(`<use href="../looks/neutral/icons.svg#${id}"/>`);
            expect(section, id).toContain(`<code>${id}</code>`);
        }
    });

    it.each(iconSizes)('shows the %s size', (size) => {
        expect(section).toContain(`class="icon icon--${size}"`);
    });
});
