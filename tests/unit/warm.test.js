import { readFileSync, existsSync } from 'node:fs';
import { expect, it } from 'vitest';
import { looks } from '../../src/demo/gallery.js';
import { readContract } from './contract.js';

const read = (path) => readFileSync(new URL(`../../src/looks/${path}`, import.meta.url), 'utf8');

it('registers the warm look in the gallery', () => {
    expect(looks).toContain('warm');
});

it('maps all four seasons through bare accent selectors with light fallbacks', () => {
    const css = read('warm/look.css');
    for (const season of ['spring', 'summer', 'autumn', 'winter']) {
        expect(css.split('@supports')[0]).toContain(`[data-accent="${season}"]`);
        expect(css.split('@supports')[1]).toContain(`[data-accent="${season}"]`);
    }
    expect(css).not.toContain('data-season');
});

it('ships a complete copyable look template with documented instructions', () => {
    for (const file of ['index.css', 'primitives.css', 'look.css', 'fonts.css', 'icons.svg', 'README.md']) {
        expect(existsSync(new URL(`../../src/looks/_template/${file}`, import.meta.url)), file).toBe(true);
    }
    expect(read('_template/README.md')).toContain('contract.json');
});

it('documents every optional warm role and the variant pattern inside the template', () => {
    const css = read('_template/look.css');
    const warm = read('warm/look.css');
    for (const { name } of readContract().tokens.filter(token => token.owner === 'look' && !token.required)) {
        if (warm.includes(`${name}:`)) {
            expect(css, name).toContain(`${name}:`);
        }
    }
    for (const part of css.split('@supports')) {
        expect(part).toContain('[data-accent="{{value}}"]');
    }
    expect(read('_template/primitives.css')).not.toContain('Private neutral');
    expect(css).not.toContain('Neutral semantic roles');
});
