import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';

it('ships static and interactive card parts without coupling nested controls', () => {
    const css = readFileSync('src/css/components/card.css', 'utf8');
    for (const part of ['media', 'body', 'title', 'text']) {
        expect(css).toContain(`.card__${part}`);
    }
    expect(css).toContain('a.card:hover');
    expect(css).toContain('a.card:active');
    expect(css).toContain('var(--radius-card)');
    expect(css).not.toContain('.button');
});
