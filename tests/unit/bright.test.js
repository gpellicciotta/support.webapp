import { readFileSync } from 'node:fs';
import { expect, it } from 'vitest';
import { looks } from '../../src/demo/gallery.js';

it('registers bright with three bare accent variants and no downloaded fonts', () => {
    expect(looks).toContain('bright');
    const read = name => readFileSync(new URL(`../../src/looks/bright/${name}`, import.meta.url), 'utf8');
    expect(read('index.css')).not.toContain('fonts.css');
    for (const part of read('look.css').split('@supports')) {
        for (const accent of ['blue', 'yellow', 'red']) {
            expect(part).toContain(`[data-accent="${accent}"]`);
        }
    }
    expect(read('primitives.css')).toContain('system-ui');
});
