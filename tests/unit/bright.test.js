import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { looks } from '../../src/demo/gallery.js';

const read = name => readFileSync(new URL(`../../src/looks/bright/${name}`, import.meta.url), 'utf8');

it('registers bright with three bare accent variants and self-hosted Lexend', () => {
    expect(looks).toContain('bright');
    expect(read('index.css')).toContain("@import url('fonts.css');");
    for (const part of read('look.css').split('@supports')) {
        for (const accent of ['blue', 'yellow', 'red']) {
            expect(part).toContain(`[data-accent="${accent}"]`);
        }
    }
    expect(read('primitives.css')).toMatch(/--font-family-body:\s*"Lexend Variable", "Lexend", system-ui,/);
    expect(read('primitives.css')).not.toContain('--font-family-system');
    expect(read('look.css')).toContain('--font-body: var(--font-family-body);');
});

it('loads every font by a relative URL, so the look never contacts a remote server', () => {
    const css = read('fonts.css').replace(/\/\*[\s\S]*?\*\//g, '');
    const urls = [...css.matchAll(/url\(\s*['"]?([^'")]+)['"]?\s*\)/g)].map(match => match[1]);
    expect(urls).toEqual(['fonts/lexend/lexend-latin-ext-wght-normal.woff2', 'fonts/lexend/lexend-latin-wght-normal.woff2']);
    expect(css).not.toMatch(/@import/);
    for (const url of urls) {
        expect(url, url).not.toMatch(/^(?:[a-z][\w+.-]*:|\/)/i);
    }
});
