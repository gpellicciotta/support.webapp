import { readFileSync } from 'node:fs';
import { Window } from 'happy-dom';
import { expect, it } from 'vitest';

it('keeps polite status outside busy content and skeletons decorative only for slow lists', () => {
    const document = new Window().document;
    document.body.innerHTML = readFileSync('src/demo/visual-style-gallery.html', 'utf8');
    const specimens = document.querySelectorAll('#loading .loading');
    expect(specimens).toHaveLength(3);
    for (const specimen of specimens) {
        const status = specimen.querySelector('[role="status"]');
        expect(status.getAttribute('aria-live')).toBe('polite');
        expect(status.closest('[aria-busy]')).toBeNull();
        expect(specimen.querySelector('[aria-busy]')).not.toBeNull();
    }
    expect(specimens[0].querySelector('.loading__skeleton')).toBeNull();
    expect(specimens[1].querySelector('.loading__skeleton').getAttribute('aria-hidden')).toBe('true');
    expect(specimens[2].querySelector('[aria-busy]').getAttribute('aria-busy')).toBe('false');
    expect(specimens[2].querySelector('.loading__skeleton')).toBeNull();
});
