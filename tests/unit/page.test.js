import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { readContract } from './contract.js';

const root = fileURLToPath(new URL('../../src/', import.meta.url));
const clean = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');

describe('page base stylesheet', () => {
    it('is imported by style.css after reset.css and before components and shell', () => {
        const style = clean(readFileSync(join(root, 'css', 'style.css'), 'utf8'));
        const imports = [...style.matchAll(/@import\s+url\(['"]([^'"]+)['"]\);/g)].map((match) => match[1]);
        const resetIndex = imports.indexOf('reset.css');
        const pageIndex = imports.indexOf('page.css');
        const firstComponentIndex = imports.findIndex((href) => href.startsWith('components/'));
        const shellIndex = imports.indexOf('shell.css');

        expect(resetIndex).toBeGreaterThanOrEqual(0);
        expect(pageIndex).toBeGreaterThan(resetIndex);
        expect(pageIndex).toBeLessThan(firstComponentIndex);
        expect(pageIndex).toBeLessThan(shellIndex);
    });

    it('uses only public contract tokens and no raw colors', () => {
        const css = clean(readFileSync(join(root, 'css', 'page.css'), 'utf8'));
        const publicTokens = new Set(readContract().tokens.map(({ name }) => name));
        const used = [...new Set([...css.matchAll(/(?<![\w-])--[\w-]+/g)].map((match) => match[0]))];

        expect(used.length).toBeGreaterThan(0);
        expect(used).toEqual(expect.arrayContaining([
            '--color-bg',
            '--color-text',
            '--font-body',
            '--font-heading',
            '--font-mono',
            '--color-link',
            '--color-link-hover'
        ]));
        expect(used.filter((name) => !publicTokens.has(name))).toEqual([]);
        expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i);
    });

    it('keeps element rules at zero specificity with a root opt-out and guards [hidden] without breaking until-found', () => {
        const css = clean(readFileSync(join(root, 'css', 'page.css'), 'utf8'));
        const selectors = [...css.matchAll(/([^{}]+)\{/g)].map((match) => match[1].trim());
        const elementSelectors = selectors.filter((selector) => !selector.startsWith('[hidden]'));

        expect(elementSelectors.length).toBeGreaterThanOrEqual(7);
        for (const selector of elementSelectors) {
            expect(selector).toMatch(/^:where\(.+\)$/);
            expect(selector).toContain("data-page-base='off'");
        }
        expect(elementSelectors.some((selector) => /\bbody\b/.test(selector))).toBe(true);
        expect(elementSelectors.some((selector) => /\bh1\b/.test(selector))).toBe(true);
        expect(elementSelectors.some((selector) => /\ba\b/.test(selector))).toBe(true);
        expect(elementSelectors.some((selector) => /\bcode\b/.test(selector))).toBe(true);
        expect(css).toMatch(/\[hidden\]:not\(\[hidden=['"]until-found['"](?:\s+i)?\]\)/);
    });

    it('has a page base section in the visual style gallery', () => {
        const gallery = readFileSync(join(root, 'demo', 'visual-style-gallery.html'), 'utf8');
        const section = gallery.match(/<section id="page"[\s\S]*?<\/section>/)?.[0] ?? '';

        expect(section).toBeTruthy();
        expect(section).toContain('<a ');
        expect(section).toContain('<code>');
        expect(section).toContain('hidden="until-found"');
    });
});
