import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

it('offers three sizes and four optional tones with neutral fallbacks', () => {
    const css = readFileSync('src/css/components/icon-tile.css', 'utf8');
    for (const size of ['sm', 'md', 'lg']) {
        expect(css).toContain(`.icon-tile--${size}`);
    }
    for (const tone of [1, 2, 3, 4]) {
        expect(css).toContain(`var(--color-tone-${tone}, var(--color-surface-sunken))`);
        expect(css).toContain(`var(--color-on-tone-${tone}, var(--color-text))`);
    }
});
