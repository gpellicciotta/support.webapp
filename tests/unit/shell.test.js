import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { scanStyles } from '../../bin/check.mjs';
import { readContract } from './contract.js';

const root = fileURLToPath(new URL('../../src/', import.meta.url));
const clean = (css) => css.replace(/\/\*[\s\S]*?\*\//g, '');
const readCss = (path) => clean(readFileSync(join(root, 'css', path), 'utf8'));
const readDemo = (name) => readFileSync(join(root, 'demo', name), 'utf8');

describe('shell stylesheet additions', () => {
    const shell = readCss('shell.css');

    it('is imported last by style.css, after page.css and every component partial', () => {
        const style = readCss('style.css');
        const imports = [...style.matchAll(/@import\s+url\(['"]([^'"]+)['"]\);/g)].map((match) => match[1]);
        expect(imports.at(-1)).toBe('shell.css');
        expect(imports.indexOf('page.css')).toBeLessThan(imports.indexOf('shell.css'));
    });

    it('uses only public contract tokens and its own --_app-* private tokens, with no raw colors', () => {
        const publicTokens = new Set(readContract().tokens.map(({ name }) => name));
        const used = [...new Set([...shell.matchAll(/(?<![\w-])--[\w-]+/g)].map((match) => match[0]))];
        const foreign = used.filter((name) => !publicTokens.has(name) && !name.startsWith('--_app-'));
        expect(foreign).toEqual([]);
        expect(shell).not.toMatch(/#[0-9a-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/i);
    });

    it('follows naming.md for shell parts and modifiers and drops the legacy .nav-end class', () => {
        const allowedBlocks = new Set(['app', 'skip-link', 'icon-button', 'icon', 'fab', 'toast-region', 'badge', 'banner']);
        const classes = [...new Set([...shell.matchAll(/\.([a-z][\w-]*)/g)].map((match) => match[1]))];
        const unknown = classes.filter((name) => {
            const block = name.split(/__|__/)[0].split('--')[0];
            return !allowedBlocks.has(block);
        });
        expect(unknown).toEqual([]);
        expect(shell).not.toMatch(/\.nav-end\b/);
    });

    it('defines sidebar end group, nav entry badges, brand logo sizing, hidden top bar parts, and banner dismiss', () => {
        expect(shell).toMatch(/\.app__sidebar\s*>\s*\.app__nav-list--end\s*\{[^}]*margin-block-start:\s*auto[^}]*padding-block-end:\s*var\(--space-2\)/s);
        expect(shell).toMatch(/\.app__nav-item\s+\.badge\s*\{[^}]*margin-inline-start:\s*auto/s);
        expect(shell).toMatch(/\.app__brand\s*\{[^}]*gap:\s*var\(--space-2\)/s);
        expect(shell).toMatch(/\.app__brand-logo\s*\{[^}]*inline-size:\s*var\(--space-7\)[^}]*block-size:\s*var\(--space-7\)/s);
        expect(shell).toMatch(/\.app__top-bar\s+\[hidden\](?::not\(\[hidden=['"]until-found['"](?:\s+i)?\]\))?\s*\{[^}]*display:\s*none/s);
        expect(shell).toMatch(/\.app__banners\s+\.banner\s*>\s*\.icon-button\s*\{[^}]*margin-inline-start:\s*auto/s);
    });

    it('passes the conformance checker when app CSS references the new shell modifier and logo part', () => {
        const contract = readContract();
        const css = '.app__nav-list--end { padding-block-end: var(--space-3); } .app__brand-logo { border-radius: var(--radius-control); }';
        expect(scanStyles(css, 'app.css', contract, ['--neutral-ink'])).toEqual({ errors: [], warnings: [] });
    });

    it('demonstrates the shell additions in the admin console and portal demos without .nav-end', () => {
        const admin = readDemo('shell-admin-console.html');
        const portal = readDemo('shell-portal.html');
        expect(admin).toContain('class="app__nav-list app__nav-list--end"');
        expect(admin).not.toMatch(/\bnav-end\b/);
        expect(admin).toMatch(/<a class="app__nav-item"[^>]*>[\s\S]*?<span class="badge[^"]*"[^>]*>/);
        expect(admin).not.toMatch(/<span class="badge[^"]*"[^>]*aria-hidden="true"/);
        expect(portal).toMatch(/<a class="app__brand"[^>]*>[\s\S]*?<img class="app__brand-logo"[^>]*alt=""/);
        expect(portal).toMatch(/<div class="app__banners">[\s\S]*?<div class="banner[^"]*"[\s\S]*?<button class="icon-button"[^>]*aria-label="Dismiss"/);
    });
});
