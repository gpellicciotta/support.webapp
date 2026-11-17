import { readFileSync } from 'node:fs';
import { Window } from 'happy-dom';
import { describe, expect, it } from 'vitest';
import { readContract } from './contract.js';

describe('pager component contract', () => {
    it('registers pager in contract.json, imports its partial, and removes Pagination from Not in the Package', () => {
        expect(readContract().components).toContain('pager');
        const style = readFileSync(new URL('../../src/css/style.css', import.meta.url), 'utf8');
        expect(style).toContain("@import url('components/pager.css');");
        const catalog = readFileSync(new URL('../../docs/specs/components.md', import.meta.url), 'utf8');
        const excluded = catalog.split('### Not in the Package')[1]?.split('---')[0] ?? '';
        expect(excluded).not.toMatch(/\bPagination\b/i);
    });

    it('styles the status text and wrapping button group with contract tokens only', () => {
        const css = readFileSync(new URL('../../src/css/components/pager.css', import.meta.url), 'utf8')
            .replace(/\/\*[\s\S]*?\*\//g, '');
        expect(css).toMatch(/\.pager\s*{[^}]*justify-content:\s*space-between;/);
        expect(css).toMatch(/\.pager\[hidden\]\s*{[^}]*display:\s*none;/);
        expect(css).toMatch(/\.pager__text\s*{[^}]*color:\s*var\(--color-text-muted\);/);
        expect(css).toMatch(/\.pager__text\s*{[^}]*font-variant-numeric:\s*tabular-nums;/);
        expect(css).toMatch(/\.pager__buttons\s*{[^}]*flex-wrap:\s*wrap;/);
    });

    it('renders named navigation landmarks with First, Previous, Next, and Last boundary states in the gallery', async () => {
        const window = new Window();
        try {
            window.document.body.innerHTML = readFileSync(new URL('../../src/demo/visual-style-gallery.html', import.meta.url), 'utf8');
            const section = window.document.querySelector('#pager');
            expect(section).not.toBeNull();
            const navs = [...section.querySelectorAll('nav.pager:not([hidden])')];
            expect(navs.length).toBeGreaterThanOrEqual(2);
            const labels = navs.map(nav => nav.getAttribute('aria-label'));
            expect(labels.every(Boolean)).toBe(true);
            expect(new Set(labels).size).toBe(labels.length);
            const firstButtons = [...navs[0].querySelectorAll('.pager__buttons button')];
            expect(firstButtons.map(btn => btn.textContent.trim())).toEqual(['First', 'Previous', 'Next', 'Last']);
            expect(firstButtons.map(btn => btn.disabled)).toEqual([true, true, false, false]);
            const lastButtons = [...navs[1].querySelectorAll('.pager__buttons button')];
            expect(lastButtons.map(btn => btn.disabled)).toEqual([false, false, true, true]);
        }
        finally {
            await window.happyDOM.close();
        }
    });
});
