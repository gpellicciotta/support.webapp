import { it, expect, onTestFinished } from 'vitest';
import { existsSync, mkdtempSync, readFileSync, rmSync, symlinkSync, unlinkSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

// The repository's virtual environment holds support.python when it exists; CI installs it into the runner's Python.
const venvPython = resolve(process.platform === 'win32' ? '.venv/Scripts/python.exe' : '.venv/bin/python');
const python = existsSync(venvPython) ? venvPython : (process.platform === 'win32' ? 'python' : 'python3');

// One adopter setup of ADR-0004 per look, so every look and every navigation kind runs its own checks.
const setups = [
    { look: 'neutral', options: ['--scroll', 'main', '--nav', 'sidebar', '--nav', 'bottom', '--action-bar', '--side-panel'] },
    { look: 'warm', options: ['--scroll', 'page', '--nav', 'breadcrumb', '--action-bar'] },
    { look: 'bright', options: ['--scroll', 'page', '--nav', 'menu', '--width', 'narrow', '--action-bar'] }
];

for (const { look, options } of setups) {
    it(`generates a ${look} app that passes its own checks and the conformance check`, () => {
        const folder = mkdtempSync(join(tmpdir(), 'design-generate-'));
        const app = join(folder, `sample-${look}`);
        const link = join(app, 'node_modules');
        onTestFinished(() => {
            // Remove the junction itself first, so the cleanup never reaches this repository's node_modules.
            if (existsSync(link)) {
                unlinkSync(link);
            }
            rmSync(folder, { recursive: true, force: true });
        });
        const generate = spawnSync(python, ['scripts/devops.py', 'generate-app', `sample-${look}`, '--look', look,
            '--owner', 'Sample Owner', ...options, '-o', app], { cwd: resolve('.'), encoding: 'utf8' });
        expect(generate.status, generate.stdout + generate.stderr).toBe(0);
        expect(existsSync(join(app, '.git')) || existsSync(join(app, '.plan'))).toBe(false);
        const pin = JSON.parse(readFileSync(join(app, 'design.json'), 'utf8'));
        expect(pin).toMatchObject({ look, target: 'src/vendor/design', styles: ['src/css'] });

        const conformance = spawnSync(process.execPath, ['src/vendor/design/bin/check.mjs', '--format', 'json'], { cwd: app, encoding: 'utf8' });
        expect(conformance.status, conformance.stdout + conformance.stderr).toBe(0);

        // The generated app declares the same development tools as this repository, so it borrows its installed copy.
        symlinkSync(resolve('node_modules'), link, 'junction');
        const check = spawnSync(python, ['scripts/devops.py', 'check'], { cwd: app, encoding: 'utf8' });
        expect(check.status, `${check.stdout}\n${check.stderr}`.slice(-6000)).toBe(0);
    }, 600_000);
}
