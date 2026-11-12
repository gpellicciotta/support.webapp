import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

it('offers source sizes, image cropping, initials, icon fallback, and overlapping stacks', () => {
    const css = readFileSync('src/css/components/avatar.css', 'utf8');
    for (const size of ['sm', 'md', 'lg', 'initials']) {
        expect(css).toContain(`.avatar--${size}`);
    }
    expect(css).toContain('object-fit: cover');
    expect(css).toContain('.avatar-stack > .avatar');
    expect(css).toContain('clamp(');
    for (const tone of [1, 2, 3, 4]) {
        expect(css).toContain(`var(--color-tone-${tone}, var(--color-surface-sunken))`);
        expect(css).toContain(`var(--color-on-tone-${tone}, var(--color-text))`);
    }
    const html = readFileSync('src/demo/visual-style-gallery.html', 'utf8');
    expect(html).toContain('alt="Sample portrait"');
    expect(html).toContain('aria-label="Unknown person"');
});
