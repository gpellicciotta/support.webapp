import { existsSync, readFileSync } from 'node:fs';
import { Window } from 'happy-dom';
import { describe, expect, it } from 'vitest';
import { readContract } from './contract.js';

describe('detail-panel, facts list, and status chip contracts', () => {
    it('registers detail-panel in contract.json and imports its partial in style.css', () => {
        expect(readContract().components).toContain('detail-panel');
        const style = readFileSync(new URL('../../src/css/style.css', import.meta.url), 'utf8');
        expect(style).toContain("@import url('components/detail-panel.css');");
    });

    it('styles detail-panel header, scrolling body, sections, and danger zone with contract tokens only', () => {
        const path = new URL('../../src/css/components/detail-panel.css', import.meta.url);
        expect(existsSync(path)).toBe(true);
        const css = readFileSync(path, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '');
        expect(css).toMatch(/\.detail-panel\s*{[^}]*flex-direction:\s*column;/);
        expect(css).toMatch(/\.detail-panel\[hidden\]\s*{[^}]*display:\s*none;/);
        expect(css).toMatch(/\.detail-panel__body\s*{[^}]*overflow-y:\s*auto;/);
        expect(css).toMatch(/\.detail-panel__section:has\(\+\s*\.detail-panel__danger\)[^{]*{[^}]*border-block-end:\s*0;/);
        expect(css).toMatch(/\.detail-panel__danger\s*{[^}]*border-block-start:\s*var\(--border-width\)\s+solid\s+var\(--color-border\);/);
        expect(css).toMatch(/\.detail-panel__actions\s*{[^}]*justify-content:\s*flex-end;/);
    });

    it('maps bordered facts and compact facts onto list definition rows and styles status chips', () => {
        const listCss = readFileSync(new URL('../../src/css/components/list.css', import.meta.url), 'utf8')
            .replace(/\/\*[\s\S]*?\*\//g, '');
        expect(listCss).toMatch(/\.list--facts\s*{[^}]*--_list-term-width:\s*var\(--width-menu\);/);
        expect(listCss).toMatch(/\.list--compact\s*{[^}]*--_list-term-width:\s*calc\(2\s*\*\s*var\(--space-10\)\);/);
        expect(listCss).toMatch(/\.list--facts\s*>\s*\.list__term\s*{[^}]*color:\s*var\(--color-text-muted\);/);

        const chipCss = readFileSync(new URL('../../src/css/components/chip.css', import.meta.url), 'utf8')
            .replace(/\/\*[\s\S]*?\*\//g, '');
        expect(chipCss).toMatch(/\.chip--status\s*>\s*\.icon\s*{[^}]*color:\s*var\(--color-text-muted\);/);
        expect(chipCss).toMatch(/\.chip--status:is\(\.chip--warning,\s*\.chip--danger\)\s*>\s*\.icon\s*{[^}]*color:\s*var\(--color-danger\);/);
    });

    it('renders gallery specimens and the admin console shell example', async () => {
        const window = new Window();
        try {
            window.document.body.innerHTML = readFileSync(new URL('../../src/demo/visual-style-gallery.html', import.meta.url), 'utf8');
            const detailSection = window.document.querySelector('#detail-panel');
            expect(detailSection).not.toBeNull();
            expect(detailSection.querySelector('.detail-panel__danger .inline-confirm')).not.toBeNull();
            expect(window.document.querySelectorAll('#list dl.list.list--facts').length).toBeGreaterThanOrEqual(2);
            expect(window.document.querySelector('#list dl.list.list--facts.list--compact')).not.toBeNull();
            expect(window.document.querySelectorAll('#chip .chip--status').length).toBeGreaterThanOrEqual(4);

            const adminPath = new URL('../../src/demo/shell-admin-console.html', import.meta.url);
            expect(existsSync(adminPath)).toBe(true);
            window.document.body.innerHTML = readFileSync(adminPath, 'utf8');
            expect(window.document.querySelector('.toolbar[role="search"]')).not.toBeNull();
            expect(window.document.querySelector('.table__frame table.table tr[aria-selected="true"]')).not.toBeNull();
            expect(window.document.querySelector('nav.pager')).not.toBeNull();
            expect(window.document.querySelector('.app__side-panel:not([hidden]) .detail-panel')).not.toBeNull();
            expect(window.document.querySelector('.app__action-bar')).toBeNull();
            expect(window.document.querySelector('.app__bottom-nav')).toBeNull();
        }
        finally {
            await window.happyDOM.close();
        }
    });
});
