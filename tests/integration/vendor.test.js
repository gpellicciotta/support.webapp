import { it, expect, onTestFinished } from 'vitest';
import { mkdtempSync, mkdirSync, readFileSync, writeFileSync, existsSync, rmSync, symlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const run = (script, args, cwd) => spawnSync(process.execPath, [script, ...args], { cwd, encoding: 'utf8' });
function temporary() {
    const folder = mkdtempSync(join(tmpdir(), 'design-vendor-'));
    onTestFinished(() => rmSync(folder, { recursive: true, force: true }));
    return folder;
}
it('packs, vendors, checks offline, re-vendors, and rejects drift and bad arguments', () => {
    const app = temporary();
    const npm = process.env.npm_execpath;
    expect(npm, 'Run this integration scenario through npm or npx').toBeTruthy();
    const pack = run(npm, ['pack', '--pack-destination', app, '--json'], resolve('.'));
    expect(pack.status, pack.stderr).toBe(0);
    expect(existsSync('manifest.json'), 'postpack removes the generated manifest').toBe(false);
    const archive = JSON.parse(pack.stdout.slice(pack.stdout.indexOf('[')))[0].filename;
    // A relative archive path keeps GNU tar from reading a drive letter as a remote host.
    const unpack = spawnSync('tar', ['-xf', archive], { cwd: app, encoding: 'utf8' });
    expect(unpack.status, unpack.stderr).toBe(0);
    expect(existsSync(join(app, 'package/manifest.json'))).toBe(true);
    const cli = join(app, 'package/bin/cli.mjs');
    const target = 'web/vendor/design';
    mkdirSync(join(app, 'styles'));
    const vendor = (...args) => run(cli, ['vendor', '--look', 'neutral', '--to', target, '--styles', 'styles', ...args], app);
    expect(vendor('--dry-run').status).toBe(0);
    expect(existsSync(join(app, 'design.json'))).toBe(false);
    const first = vendor();
    expect(first.status, first.stderr).toBe(0);
    const checker = join(app, target, 'bin/check.mjs');
    const check = () => run(checker, ['--format', 'json'], app);
    expect(check().status, check().stderr).toBe(0);
    expect(JSON.parse(readFileSync(join(app, 'design.json'))).styles).toEqual(['styles']);
    writeFileSync(join(app, 'styles/app.css'), '.app { color: red; }');
    expect(check().status).toBe(1);

    // A linked path, such as a junction or macOS /tmp, must still run the checker.
    const link = join(temporary(), 'app-link');
    symlinkSync(app, link, 'junction');
    const linked = run(join(link, target, 'bin/check.mjs'), ['--format', 'json'], link);
    expect(linked.status, linked.stderr).toBe(1);
    expect(JSON.parse(linked.stdout).conformance.errors.join(' ')).toMatch(/raw color/);
    writeFileSync(join(app, 'styles/app.css'), '.app { color: var(--color-text); }');
    const pinPath = join(app, 'design.json');
    const pin = JSON.parse(readFileSync(pinPath));
    writeFileSync(pinPath, JSON.stringify({ ...pin, version: 'wrong' }));
    expect(JSON.parse(check().stdout).integrity.errors.join(' ')).toMatch(/version/i);
    writeFileSync(pinPath, JSON.stringify(pin));
    writeFileSync(join(app, target, 'css/style.css'), 'edited');
    expect(check().status).toBe(1);

    // Re-vendoring replaces a vendored copy, which is how an app upgrades or repairs it.
    const again = vendor();
    expect(again.status, again.stderr).toBe(0);
    expect(check().status, check().stderr).toBe(0);
    writeFileSync(join(app, target, 'notes.txt'), 'app file');
    expect(vendor().status).toBe(1);
    expect(existsSync(join(app, target, 'notes.txt'))).toBe(true);

    // A folder that vendor did not write is never replaced.
    const other = temporary();
    mkdirSync(join(other, target), { recursive: true });
    writeFileSync(join(other, target, 'keep.txt'), 'app file');
    expect(run(cli, ['vendor', '--look', 'neutral', '--to', target], other).status).toBe(1);
    expect(existsSync(join(other, target, 'keep.txt'))).toBe(true);
    expect(existsSync(join(other, 'design.json'))).toBe(false);

    expect(run(cli, ['vendor', '--look', '../bad', '--to', target], app).status).toBe(2);
    expect(run(cli, ['vendor', '--look', 'neutral', '--to', target, '--styles', 'nope'], app).status).toBe(2);
    expect(run(cli, ['check', '--unknown'], app).status).toBe(2);
    expect(run(cli, ['help', '--verbose'], app).status).toBe(0);
    expect(run(cli, ['version'], app).status).toBe(0);
}, 120_000);
