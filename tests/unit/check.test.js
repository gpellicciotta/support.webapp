import { describe, it, expect, onTestFinished } from 'vitest';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { check, fileHash, inside, scanStyles } from '../../bin/check.mjs';

const contract = { deprecated: ['--old'], tokens: [{ name: '--color-text' }] };
describe('app style conformance', () => {
    it.each(['#fff', 'rgb(1 2 3)', 'oklch(50% 0.1 30)', 'red'])('rejects raw color %s', color => {
        expect(scanStyles(`.app { color: ${color}; }`, 'app.css', contract, ['--neutral-ink']).errors).not.toHaveLength(0);
    });
    it.each(['--neutral-ink', '--_dialog-bg'])('rejects package internal token %s', token => {
        expect(scanStyles(`.app { color: var(${token}); }`, 'tokens.css', contract, ['--neutral-ink']).errors).not.toHaveLength(0);
    });
    it('allows app tokens and comments, and exempts token files from raw colors', () => {
        expect(scanStyles('/* color: red */ .app { color: var(--color-text); }', 'app.css', contract, []).errors).toEqual([]);
        expect(scanStyles(':root { --app-color: #fff; }', 'tokens.css', contract, []).errors).toEqual([]);
    });
    it('ignores double dashes inside BEM class names', () => {
        expect(scanStyles('.card--neutral-ink { color: var(--color-text); }', 'app.css', contract, ['--neutral-ink']).errors).toEqual([]);
    });
    it('warns on deprecated tokens and positioning outside shell styles', () => {
        expect(scanStyles('.app { color: var(--old); position: sticky; }', 'app.css', contract, []).warnings).toHaveLength(2);
        expect(scanStyles('.shell { position: fixed; }', 'shell.css', contract, []).warnings).toEqual([]);
    });
});

describe('vendored copy integrity', () => {
    const hash = text => createHash('sha256').update(text).digest('hex');
    function fixture(extra = {}) {
        const app = mkdtempSync(join(tmpdir(), 'design-check-'));
        onTestFinished(() => rmSync(app, { recursive: true, force: true }));
        const target = join(app, 'vendor/design');
        mkdirSync(join(target, 'looks/neutral'), { recursive: true });
        mkdirSync(join(app, 'css'));
        const files = { 'contract.json': '{"tokens":[]}', 'css/style.css': '.a {}', 'looks/neutral/primitives.css': ':root { --neutral-ink: #000; }', ...extra };
        const manifest = { version: '1.2.3', files: {} };
        for (const [path, data] of Object.entries(files)) {
            mkdirSync(join(target, path, '..'), { recursive: true });
            writeFileSync(join(target, path), data);
            manifest.files[path] = { look: /^looks\/([^/]+)\//.exec(path)?.[1] ?? null, sha256: hash(data) };
        }
        writeFileSync(join(target, 'manifest.json'), JSON.stringify(manifest));
        writeFileSync(join(app, 'design.json'), JSON.stringify({ version: '1.2.3', look: 'neutral', target: 'vendor/design', styles: ['css'] }));
        return { app, target };
    }
    const errors = app => check(app).integrity.errors.join('\n');

    it('passes an unchanged copy', () => {
        const { app } = fixture();
        expect(check(app)).toMatchObject({ ok: true, integrity: { errors: [] }, conformance: { errors: [] } });
    });
    it('fails on a pin that differs from the manifest version', () => {
        const { app } = fixture();
        writeFileSync(join(app, 'design.json'), JSON.stringify({ version: '1.2.4', look: 'neutral', target: 'vendor/design', styles: [] }));
        expect(errors(app)).toMatch(/version/i);
    });
    it('fails on changed, missing, and unlisted files', () => {
        const { app, target } = fixture();
        writeFileSync(join(target, 'css/style.css'), '.b {}');
        rmSync(join(target, 'looks/neutral/primitives.css'));
        writeFileSync(join(target, 'extra.css'), '');
        expect(errors(app)).toMatch(/Changed file: css\/style\.css/);
        expect(errors(app)).toMatch(/Missing file: looks\/neutral\/primitives\.css/);
        expect(errors(app)).toMatch(/Unlisted file: extra\.css/);
    });
    it('fails on primitive tokens of the vendored look in app styles', () => {
        const { app } = fixture();
        writeFileSync(join(app, 'css/app.css'), '.app { color: var(--neutral-ink); }');
        expect(check(app).conformance.errors.join('\n')).toMatch(/css\/app\.css: package internal token --neutral-ink/);
    });
    it('skips the vendored copy when a styles folder contains it', () => {
        const { app } = fixture();
        writeFileSync(join(app, 'design.json'), JSON.stringify({ version: '1.2.3', look: 'neutral', target: 'vendor/design', styles: ['vendor'] }));
        expect(check(app).conformance.errors).toEqual([]);
    });
    it('reports a missing styles folder as a conformance error', () => {
        const { app } = fixture();
        writeFileSync(join(app, 'design.json'), JSON.stringify({ version: '1.2.3', look: 'neutral', target: 'vendor/design', styles: ['nope'] }));
        expect(check(app).conformance.errors).toEqual(['Missing styles folder: nope']);
    });
    it('passes a vendored copy rewritten to CRLF and back to LF', () => {
        const { app, target } = fixture({ 'css/style.css': '.a {\n  color: var(--c);\n}\n', 'js/app.js': 'export const a = 1;\nexport const b = 2;\n' });
        for (const path of ['css/style.css', 'js/app.js']) {
            writeFileSync(join(target, path), path.endsWith('.css') ? '.a {\r\n  color: var(--c);\r\n}\r\n' : 'export const a = 1;\r\nexport const b = 2;\r\n');
        }
        expect(fileHash(join(target, 'css/style.css'))).toBe(hash('.a {\n  color: var(--c);\n}\n'));
        expect(check(app)).toMatchObject({ ok: true, integrity: { errors: [] } });
        for (const path of ['css/style.css', 'js/app.js']) {
            writeFileSync(join(target, path), path.endsWith('.css') ? '.a {\n  color: var(--c);\n}\n' : 'export const a = 1;\nexport const b = 2;\n');
        }
        expect(check(app)).toMatchObject({ ok: true, integrity: { errors: [] } });
    });
    it('fails a changed character or lone carriage return in a text file', () => {
        const { app, target } = fixture({ 'css/style.css': '.a {\n  color: var(--c);\n}\n' });
        writeFileSync(join(target, 'css/style.css'), '.a {\r\n  color: var(--d);\r\n}\r\n');
        expect(errors(app)).toMatch(/Changed file: css\/style\.css/);
        writeFileSync(join(target, 'css/style.css'), '.a {\r  color: var(--c);\n}\n');
        expect(errors(app)).toMatch(/Changed file: css\/style\.css/);
    });
    it('fails a binary file whose CRLF bytes become LF', () => {
        const { app, target } = fixture({ 'fonts/font.woff2': Buffer.from([0x77, 0x4f, 0x46, 0x32, 0x0d, 0x0a, 0x00, 0x01]) });
        expect(check(app).ok).toBe(true);
        writeFileSync(join(target, 'fonts/font.woff2'), Buffer.from([0x77, 0x4f, 0x46, 0x32, 0x0a, 0x00, 0x01]));
        expect(errors(app)).toMatch(/Changed file: fonts\/font\.woff2/);
    });
    it('resolves relative roots and rejects paths that leave them', () => {
        expect(inside('.', 'bin')).toBe(resolve('bin'));
        expect(() => inside('.', '../outside')).toThrow(/inside/);
    });
});
