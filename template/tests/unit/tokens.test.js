import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

const styles = 'src/css';
const contract = JSON.parse(readFileSync('src/vendor/design/contract.json', 'utf8'));
const shared = new Set(contract.tokens.map(token => token.name));
const sheets = readdirSync(styles).filter(name => name.endsWith('.css'));
const strip = css => css.replace(/\/\*[\s\S]*?\*\//g, '');
const local = new Set(sheets.flatMap(name => [...strip(readFileSync(join(styles, name), 'utf8')).matchAll(/(--[\w-]+)\s*:/g)].map(match => match[1])));

describe('app style tokens', () => {
    it('use only tokens of the design contract or of the app', () => {
        const unknown = sheets.flatMap(name => [...strip(readFileSync(join(styles, name), 'utf8')).matchAll(/var\(\s*(--[\w-]+)/g)]
            .map(match => match[1])
            .filter(token => !shared.has(token) && !local.has(token))
            .map(token => `${name}: ${token}`));
        expect(unknown).toEqual([]);
    });

    it('define app tokens with the app prefix only, in tokens.css', () => {
        const defined = sheets.flatMap(name => [...strip(readFileSync(join(styles, name), 'utf8')).matchAll(/(--[\w-]+)\s*:/g)]
            .map(match => `${name}: ${match[1]}`));
        expect(defined.filter(entry => !/^tokens\.css: --app-/.test(entry))).toEqual([]);
    });
});
