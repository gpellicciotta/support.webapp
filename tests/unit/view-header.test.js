import { readFileSync } from 'node:fs';
import { Window } from 'happy-dom';
import { describe, expect, it } from 'vitest';
import { readContract } from './contract.js';

const read = (path) => readFileSync(new URL(path, import.meta.url), 'utf8');

describe('view-header component contract', () => {
    it('registers view-header in contract.json, imports its partial before toolbar.css, and catalogs it with the containers', () => {
        expect(readContract().components).toContain('view-header');
        const style = read('../../src/css/style.css');
        const pageIndex = style.indexOf("@import url('page.css');");
        const headerIndex = style.indexOf("@import url('components/view-header.css');");
        const toolbarIndex = style.indexOf("@import url('components/toolbar.css');");
        const shellIndex = style.indexOf("@import url('shell.css');");
        expect(headerIndex).toBeGreaterThan(pageIndex);
        expect(headerIndex).toBeLessThan(toolbarIndex);
        expect(headerIndex).toBeLessThan(shellIndex);

        const catalog = read('../../docs/specs/components.md');
        const containers = catalog.split('### Containers')[1]?.split('###')[0] ?? '';
        expect(containers).toMatch(/\|\s*`view-header`\s*\|/);
        const section = catalog.split('### view-header')[1]?.split(/\n### |\n## /)[0] ?? '';
        expect(section).toContain('class="view-header"');
        expect(section).toContain('class="view-header__title"');
        expect(section).toContain('class="view-header__text"');
        expect(section).toContain('data-view-header-text');
        expect(section).toContain('role="status"');
        expect(section).toContain('Upgrading an existing app:');
    });

    it('records the sharing decision in ADR-0003', () => {
        const adr = read('../../docs/adrs/ADR-0003-components-and-patterns.md');
        const rule = adr.split('### Sharing rule')[1]?.split('###')[0] ?? '';
        expect(rule).toMatch(/view-header/);
    });

    it('styles the title, muted summary, and empty summary collapse with contract tokens only', () => {
        const css = read('../../src/css/components/view-header.css').replace(/\/\*[\s\S]*?\*\//g, '');
        expect(css).toMatch(/\.view-header\s*{[^}]*display:\s*grid;[^}]*gap:\s*var\(--space-1\);[^}]*margin-block:\s*0 var\(--space-4\);/);
        expect(css).toMatch(/\.view-header:has\(>\s*\.view-header__text:empty\)\s*{[^}]*gap:\s*0;/);
        expect(css).toMatch(/\.view-header__title\s*{[^}]*margin:\s*0;[^}]*font-family:\s*var\(--font-heading\);[^}]*font-size:\s*var\(--text-2xl\);[^}]*font-weight:\s*var\(--weight-semibold\);[^}]*line-height:\s*var\(--leading-tight\);/);
        expect(css).toMatch(/\.view-header__text\s*{[^}]*margin:\s*0;[^}]*color:\s*var\(--color-text-muted\);/);
        expect(css).not.toMatch(/#[0-9a-f]{3,8}\b|\b\d+px\b/i);
    });

    it('shows status summary, title-only, and empty summary specimens in the gallery', async () => {
        const window = new Window();
        try {
            window.document.body.innerHTML = read('../../src/demo/visual-style-gallery.html');
            const document = window.document;
            expect(document.querySelector('a[href="#view-header"]')).not.toBeNull();
            const section = document.querySelector('#view-header');
            expect(section).not.toBeNull();

            const statusHeader = section.querySelector('header.view-header[data-view-header="status"]');
            expect(statusHeader).not.toBeNull();
            expect(statusHeader.querySelector('h3.view-header__title')?.textContent).toBe('Notifications');
            const statusText = statusHeader.querySelector('p.view-header__text[role="status"][data-view-header-text]');
            expect(statusText?.textContent).toBe('3 unread · 12 total');

            const titleOnly = section.querySelector('header.view-header[data-view-header="title-only"]');
            expect(titleOnly).not.toBeNull();
            expect(titleOnly.querySelector('h3.view-header__title')?.textContent).toBe('Accounts');
            expect(titleOnly.querySelector('.view-header__text')).toBeNull();

            const emptySummary = section.querySelector('header.view-header[data-view-header="empty"]');
            expect(emptySummary).not.toBeNull();
            expect(emptySummary.querySelector('h3.view-header__title')?.textContent).toBe('Accounts');
            const emptyText = emptySummary.querySelector('p.view-header__text[role="status"][data-view-header-text]');
            expect(emptyText).not.toBeNull();
            expect(emptyText.textContent).toBe('');
        }
        finally {
            await window.happyDOM.close();
        }
    });
});
