import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import { applyLook, applyTheme, initGallery, lookHref, looks, showTokenValues, themes } from '../../src/demo/gallery.js';
import { categories, readContract } from './contract.js';

const read = (path) => readFileSync(new URL(`../../src/demo/${path}`, import.meta.url), 'utf8');
const sectionId = (category) => `tokens-${category.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

// A minimal simulated DOM: only the members gallery.js uses.
class FakeElement {
    constructor(attributes = {}) {
        this.attributes = new Map(Object.entries(attributes));
        this.listeners = new Map();
        this.dataset = {};
        this.classes = new Set();
        this.classList = { toggle: (name, on) => (on ? this.classes.add(name) : this.classes.delete(name)) };
        this.children = new Map();
        this.textContent = '';
    }

    getAttribute(name) {
        return this.attributes.has(name) ? this.attributes.get(name) : null;
    }

    setAttribute(name, value) {
        this.attributes.set(name, String(value));
    }

    removeAttribute(name) {
        this.attributes.delete(name);
    }

    addEventListener(type, listener) {
        this.listeners.set(type, [...(this.listeners.get(type) || []), listener]);
    }

    dispatch(type) {
        for (const listener of this.listeners.get(type) || []) {
            listener({ type, target: this });
        }
    }

    querySelector(selector) {
        return this.children.get(selector) || null;
    }
}

function token(name) {
    const item = new FakeElement();
    item.dataset.token = name;
    item.children.set('.token__value', new FakeElement());
    return item;
}

function fakeGallery({ values = {}, checked = 'system' } = {}) {
    const root = new FakeElement();
    const link = new FakeElement({ href: lookHref(looks[0]) });
    const select = new FakeElement();
    select.value = looks[0];
    const radios = themes.map((value) => Object.assign(new FakeElement(), { value, checked: value === checked }));
    const tokens = [token('--color-bg'), token('--color-accent')];
    const doc = {
        documentElement: root,
        getElementById: (id) => ({ 'look-stylesheet': link, 'look-select': select })[id] || null,
        querySelector: (selector) => (selector === 'input[name="theme"]:checked' ? radios.find((radio) => radio.checked) || null : null),
        querySelectorAll: (selector) => ({ '[data-token]': tokens, 'input[name="theme"]': radios })[selector] || []
    };
    const view = { getComputedStyle: () => ({ getPropertyValue: (name) => values[name] || '' }) };
    return { doc, view, root, link, select, radios, tokens };
}

describe('look switcher', () => {
    it.each(looks)('swaps the look stylesheet link to %s', (look) => {
        const { doc, link } = fakeGallery();
        link.setAttribute('href', 'stale.css');
        applyLook(doc, look);
        expect(link.getAttribute('href')).toBe(`../looks/${look}/index.css`);
    });

    it('rejects an unknown look and keeps the current link', () => {
        const { doc, link } = fakeGallery();
        expect(() => applyLook(doc, 'missing')).toThrow(RangeError);
        expect(link.getAttribute('href')).toBe(lookHref(looks[0]));
    });

    it('swaps the link when the look select changes', () => {
        const { doc, view, link, select } = fakeGallery();
        initGallery(doc, view);
        link.setAttribute('href', 'stale.css');
        select.value = looks.at(-1);
        select.dispatch('change');
        expect(link.getAttribute('href')).toBe(lookHref(looks.at(-1)));
    });
});

describe('theme switcher', () => {
    it.each([['light', 'light'], ['dark', 'dark'], ['system', null]])('applies %s as data-theme %s', (theme, attribute) => {
        const { doc, root } = fakeGallery();
        root.setAttribute('data-theme', 'stale');
        applyTheme(doc, theme);
        expect(root.getAttribute('data-theme')).toBe(attribute);
    });

    it('rejects an unknown theme and keeps the current attribute', () => {
        const { doc, root } = fakeGallery();
        root.setAttribute('data-theme', 'dark');
        expect(() => applyTheme(doc, 'sepia')).toThrow(RangeError);
        expect(root.getAttribute('data-theme')).toBe('dark');
    });

    it.each(themes)('sets data-theme when the %s radio changes', (theme) => {
        const { doc, view, root, radios } = fakeGallery();
        initGallery(doc, view);
        radios.find((radio) => radio.value === theme).dispatch('change');
        expect(root.getAttribute('data-theme')).toBe(theme === 'system' ? null : theme);
    });

    it('applies the checked theme on start, as restored by the browser', () => {
        const { doc, view, root } = fakeGallery({ checked: 'dark' });
        initGallery(doc, view);
        expect(root.getAttribute('data-theme')).toBe('dark');
    });
});

describe('token values', () => {
    it('shows computed values and flags tokens the look leaves undefined', () => {
        const { doc, view, tokens } = fakeGallery({ values: { '--color-bg': ' light-dark(#f7f7f9, #111216)' } });
        showTokenValues(doc, view);
        expect(tokens[0].querySelector('.token__value').textContent).toBe('light-dark(#f7f7f9, #111216)');
        expect(tokens[0].classes.has('is-undefined')).toBe(false);
        expect(tokens[1].querySelector('.token__value').textContent).toBe('Not defined by this look');
        expect(tokens[1].classes.has('is-undefined')).toBe(true);
    });

    it('refreshes values when the look stylesheet loads', () => {
        const values = {};
        const { doc, view, link, tokens } = fakeGallery({ values });
        initGallery(doc, view);
        values['--color-accent'] = '#123456';
        link.dispatch('load');
        expect(tokens[1].querySelector('.token__value').textContent).toBe('#123456');
    });
});

describe('gallery page', () => {
    const html = read('visual-style-gallery.html');
    const css = read('gallery.css');

    it('lists every look and theme in the switchers', () => {
        expect([...html.matchAll(/<option value="([^"]+)"/g)].map((match) => match[1])).toEqual(looks);
        expect([...html.matchAll(/name="theme" value="([^"]+)"/g)].map((match) => match[1]).sort()).toEqual([...readContract().themes].sort());
        expect(themes).toEqual(readContract().themes);
        expect(html).toContain(`<link id="look-stylesheet" rel="stylesheet" href="${lookHref(looks[0])}">`);
    });

    it('has a section for every token group', () => {
        for (const category of categories) {
            expect(html, category).toContain(`<section id="${sectionId(category)}"`);
        }
    });

    it('shows every contract token in its group section with a specimen rule', () => {
        const sections = new Map([...html.matchAll(/<section id="([^"]+)"[\s\S]*?<\/section>/g)].map((match) => [match[1], match[0]]));
        for (const { name, category } of readContract().tokens) {
            expect(sections.get(sectionId(category)), name).toContain(`data-token="${name}"`);
            expect(css, name).toContain(`.token${name} { --specimen: var(${name}); }`);
        }
    });

    it('uses no inline styles on the page', () => {
        expect(html).not.toMatch(/\sstyle=|<style/i);
    });
});
