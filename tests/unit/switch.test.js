import { readFileSync } from 'node:fs';
import { Window } from 'happy-dom';
import { describe, expect, it } from 'vitest';

describe('switch markup contract', () => {
    it('imports its component stylesheet', () => {
        const css = readFileSync(new URL('../../src/css/style.css', import.meta.url), 'utf8');
        expect(css).toContain("@import url('components/switch.css');");
    });

    it('shows native labeled switches and every state without duplicated checked ARIA', async () => {
        const window = new Window();
        try {
            window.document.body.innerHTML = readFileSync(new URL('../../src/demo/visual-style-gallery.html', import.meta.url), 'utf8');
            const section = window.document.querySelector('#switch');
            expect(section).not.toBeNull();
            const inputs = [...section.querySelectorAll('.switch__control')];
            expect(inputs.length).toBeGreaterThanOrEqual(8);
            for (const input of inputs) {
                expect(input.type).toBe('checkbox');
                expect(input.getAttribute('role')).toBe('switch');
                expect(input.hasAttribute('aria-checked')).toBe(false);
                expect(input.closest('label.switch')?.querySelector('.switch__label')?.textContent).toMatch(/\S/);
            }
            for (const selector of [':checked', ':disabled:not(:checked)', ':checked:disabled', '[aria-invalid="true"]']) {
                expect(section.querySelector(`input${selector}`), selector).not.toBeNull();
            }
            for (const state of ['is-hover', 'is-focus', 'is-active']) {
                expect(section.querySelector(`.${state}`), state).not.toBeNull();
            }
        }
        finally {
            await window.happyDOM.close();
        }
    });
});
