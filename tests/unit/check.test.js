import { describe, it, expect, onTestFinished } from 'vitest';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, writeFileSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { check, inside, scanStyles } from '../../bin/check.mjs';

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
    function fixture() {
        const app = mkdtempSync(join(tmpdir(), 'design-check-'));
        onTestFinished(() => rmSync(app, { recursive: true, force: true }));
        const target = join(app, 'vendor/design');
        mkdirSync(join(target, 'looks/neutral'), { recursive: true });
        mkdirSync(join(app, 'css'));
        const files = { 'contract.json': '{"tokens":[]}', 'css/style.css': '.a {}', 'looks/neutral/primitives.css': ':root { --neutral-ink: #000; }' };
        const manifest = { version: '1.2.3', files: {} };
        for (const [path, text] of Object.entries(files)) {
            mkdirSync(join(target, path, '..'), { recursive: true });
            writeFileSync(join(target, path), text);
            manifest.files[path] = { look: /^looks\/([^/]+)\//.exec(path)?.[1] ?? null, sha256: hash(text) };
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
    it('resolves relative roots and rejects paths that leave them', () => {
        expect(inside('.', 'bin')).toBe(resolve('bin'));
        expect(() => inside('.', '../outside')).toThrow(/inside/);
    });
});
