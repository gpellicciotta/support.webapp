import { readFileSync } from 'node:fs';
import { Window } from 'happy-dom';
import { describe, expect, it } from 'vitest';
import { readContract } from './contract.js';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

describe('entry-list component contract', () => {
    it('registers entry-list in contract.json, imports its partial, and catalogs it with the containers', () => {
        expect(readContract().components).toContain('entry-list');
        expect(read('../../src/css/style.css')).toContain("@import url('components/entry-list.css');");
        const containers = read('../../docs/specs/components.md').split('### Containers')[1]?.split('###')[0] ?? '';
        expect(containers).toMatch(/\|\s*`entry-list`\s*\|/);
    });

    it('records the sharing rule exception in ADR-0003', () => {
        const adr = read('../../docs/adrs/ADR-0003-components-and-patterns.md');
        const rule = adr.split('### Sharing rule')[1]?.split('###')[0] ?? '';
        expect(rule).toMatch(/entry-list/);
    });

    it('styles spaced cards, the message, the chip row, and hover with contract tokens only', () => {
        const css = read('../../src/css/components/entry-list.css').replace(/\/\*[\s\S]*?\*\//g, '');
        expect(css).toMatch(/\.entry-list\s*{[^}]*display:\s*grid;[^}]*gap:\s*var\(--space-2\);[^}]*list-style:\s*none;/);
        expect(css).toMatch(/\.entry-list__item\s*{[^}]*border:\s*var\(--border-width\) solid var\(--color-border\);/);
        expect(css).toMatch(/\.entry-list__item\s*{[^}]*border-radius:\s*var\(--radius-card\);/);
        expect(css).toMatch(/\.entry-list__item\s*{[^}]*background-color:\s*var\(--color-surface\);/);
        expect(css).toMatch(/\.entry-list__item:is\(:hover, \.is-hover\)\s*{[^}]*background-color:\s*var\(--color-surface-hover\);/);
        expect(css).toMatch(/\.entry-list__item:is\(:hover, \.is-hover\) :is\(\.entry-list__meta > :not\(\.entry-list__action\), \.entry-list__details\)\s*{[^}]*background-color:\s*var\(--color-surface\);/);
        expect(css).toMatch(/\.entry-list__message\s*{[^}]*white-space:\s*pre-wrap;/);
        expect(css).toMatch(/\.entry-list__message--code\s*{[^}]*font-family:\s*var\(--font-mono\);/);
        expect(css).toMatch(/\.entry-list__meta\s*{[^}]*flex-wrap:\s*wrap;/);
        expect(css).toMatch(/\.entry-list__code\s*{[^}]*white-space:\s*normal;/);
        expect(css).toMatch(/\.entry-list__action\s*{[^}]*margin-inline-start:\s*auto;/);
        expect(css).toMatch(/\.entry-list__details\s*{[^}]*background-color:\s*var\(--color-surface-sunken\);/);
        expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|\b\d+px\b/i);
    });

    it('shows log and event cards in the gallery: the message first, then chips led by a clock time chip', async () => {
        const window = new Window();
        try {
            window.document.body.innerHTML = read('../../src/demo/visual-style-gallery.html');
            const document = window.document;
            expect(document.querySelector('a[href="#entry-list"]')).not.toBeNull();
            const section = document.querySelector('#entry-list');
            expect(section).not.toBeNull();
            const lists = [...section.querySelectorAll('ul.entry-list')];
            expect(lists.length).toBe(2);
            expect(lists.every(list => list.getAttribute('role') === 'list' && list.getAttribute('aria-label'))).toBe(true);
            const cards = [...section.querySelectorAll('li.entry-list__item')];
            expect(cards.length).toBeGreaterThanOrEqual(4);
            for (const card of cards) {
                const [message, meta] = card.children;
                expect(message.classList.contains('entry-list__message')).toBe(true);
                expect(meta.classList.contains('entry-list__meta')).toBe(true);
                const time = meta.querySelector('.chip');
                expect(time.querySelector('use').getAttribute('href')).toMatch(/#icon-clock$/);
                expect(time.querySelector('time').getAttribute('datetime')).toMatch(/^\d{4}-\d{2}-\d{2}T/);
            }
            expect(lists[0].querySelectorAll('.entry-list__message--code').length).toBe(lists[0].children.length);
            expect(lists[1].querySelectorAll('.entry-list__message--code').length).toBe(0);
            expect(section.querySelectorAll('.entry-list__item.is-hover').length).toBe(1);
            const toggle = lists[1].querySelector('.entry-list__action > button.icon-button[aria-expanded="true"]');
            expect(toggle?.getAttribute('aria-label')).toBeTruthy();
            const details = document.getElementById(toggle.getAttribute('aria-controls'));
            expect(details?.matches('.entry-list__meta + pre.entry-list__details')).toBe(true);
        }
        finally {
            await window.happyDOM.close();
        }
    });
});
