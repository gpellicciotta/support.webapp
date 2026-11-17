import { readFileSync } from 'node:fs';
import { Window } from 'happy-dom';
import { describe, expect, it } from 'vitest';

describe('table frame and row state contract', () => {
    it('defines the bordered frame, hover ground, and selected row edge with RTL and forced-colors support', () => {
        const css = readFileSync(new URL('../../src/css/components/table.css', import.meta.url), 'utf8')
            .replace(/\/\*[\s\S]*?\*\//g, '');
        expect(css).toContain('.table__frame');
        expect(css).toContain('var(--radius-card)');
        expect(css).toContain('.table tbody tr:is(:hover, .is-hover)');
        expect(css).not.toMatch(/@media\s*\(\s*hover:\s*hover\s*\)/);
        expect(css).toMatch(/\.table tbody tr\[aria-selected=['"]true['"]\]\s*{[^}]*var\(--color-surface-selected\)/);
        expect(css).toMatch(/\.table tbody tr\[aria-selected=['"]true['"]\]\s*{[^}]*inset var\(--border-width-strong\) 0 0 var\(--color-primary\)/);
        expect(css).toContain(':dir(rtl)');
        expect(css).toContain('@media (forced-colors: active)');
    });

    it('documents and renders hover and selected rows in the catalog and gallery', async () => {
        const catalog = readFileSync(new URL('../../docs/specs/components.md', import.meta.url), 'utf8');
        const tableSection = catalog.split('### table')[1]?.split('\n### ')[0] ?? '';
        expect(tableSection).not.toContain('tables have no selected');
        expect(tableSection).toContain('aria-selected="true"');

        const window = new Window();
        try {
            window.document.body.innerHTML = readFileSync(new URL('../../src/demo/visual-style-gallery.html', import.meta.url), 'utf8');
            const frame = window.document.querySelector('#table .table__frame');
            expect(frame).not.toBeNull();
            expect(frame.querySelector('tbody tr.is-hover')).not.toBeNull();
            expect(frame.querySelector('tbody tr[aria-selected="true"]')).not.toBeNull();
        }
        finally {
            await window.happyDOM.close();
        }
    });
});
