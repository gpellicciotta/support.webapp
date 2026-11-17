import { readFileSync } from 'node:fs';
import { Window } from 'happy-dom';
import { describe, expect, it } from 'vitest';
import { readContract } from './contract.js';

describe('toolbar component contract', () => {
    it('registers toolbar in contract.json and imports its partial in style.css', () => {
        expect(readContract().components).toContain('toolbar');
        const style = readFileSync(new URL('../../src/css/style.css', import.meta.url), 'utf8');
        expect(style).toContain("@import url('components/toolbar.css');");
    });

    it('aligns wrapping filter items to their bottom edge without cross-component class selectors', () => {
        const css = readFileSync(new URL('../../src/css/components/toolbar.css', import.meta.url), 'utf8')
            .replace(/\/\*[\s\S]*?\*\//g, '');
        expect(css).toMatch(/\.toolbar\s*{[^}]*display:\s*flex;/);
        expect(css).toMatch(/\.toolbar\s*{[^}]*flex-wrap:\s*wrap;/);
        expect(css).toMatch(/\.toolbar\s*{[^}]*align-items:\s*flex-end;/);
        expect(css).toMatch(/\.toolbar\[hidden\]\s*{[^}]*display:\s*none;/);
        expect(css).toContain('min(100%, var(--width-menu))');
        expect(css).not.toContain('.field');
    });

    it('renders a labeled search toolbar with native controls in the gallery', async () => {
        const window = new Window();
        try {
            window.document.body.innerHTML = readFileSync(new URL('../../src/demo/visual-style-gallery.html', import.meta.url), 'utf8');
            const section = window.document.querySelector('#toolbar');
            expect(section).not.toBeNull();
            const bar = section.querySelector('.toolbar[role="search"]');
            expect(bar).not.toBeNull();
            expect(bar.getAttribute('aria-label')).toMatch(/\S/);
            expect(bar.getAttribute('role')).not.toBe('toolbar');
            expect(bar.querySelector('input[type="search"]')).not.toBeNull();
            expect(bar.querySelectorAll('select').length).toBeGreaterThanOrEqual(2);
            expect(bar.querySelector('button.button')).not.toBeNull();
        }
        finally {
            await window.happyDOM.close();
        }
    });
});
