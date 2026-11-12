import { it, expect } from 'vitest';
import { existsSync, readFileSync, readdirSync } from 'node:fs';
import { join, relative, resolve, sep } from 'node:path';
import { spawnSync } from 'node:child_process';

const read = (path) => readFileSync(resolve(path), 'utf8');
const shipped = ['src/', 'bin/'];
const projectFiles = ['package.json', 'README.md', 'LICENSE.md', 'CHANGELOG.md', 'manifest.json'];
const entryPoints = [
    'src/contract.json',
    'src/css/style.css',
    'src/looks/neutral/index.css',
    'bin/cli.mjs',
    'bin/check.mjs',
    'manifest.json'
];

it('packs the source layout of ADR-0008 without the gallery or repository tooling', () => {
    const npm = process.env.npm_execpath;
    expect(npm, 'Run this integration scenario through npm or npx').toBeTruthy();
    const pack = spawnSync(process.execPath, [npm, 'pack', '--dry-run', '--json'], { cwd: resolve('.'), encoding: 'utf8' });
    expect(pack.status, pack.stderr).toBe(0);
    expect(existsSync('manifest.json'), 'postpack removes the generated manifest').toBe(false);
    const paths = JSON.parse(pack.stdout.slice(pack.stdout.indexOf('[')))[0].files.map((file) => file.path);

    const unexpected = paths.filter((path) => !projectFiles.includes(path) && !shipped.some((root) => path.startsWith(root)));
    expect(unexpected).toEqual([]);
    expect(paths).toEqual(expect.arrayContaining([...entryPoints, ...projectFiles]));
    // The package ships every source file except the gallery and the development server's landing page.
    const sources = readdirSync(resolve('src'), { recursive: true, withFileTypes: true })
        .filter((item) => item.isFile())
        .map((item) => relative(resolve('.'), join(item.parentPath, item.name)).replaceAll(sep, '/'))
        .filter((path) => !path.startsWith('src/demo/') && path !== 'src/index.html');
    expect(paths.filter((path) => path.startsWith('src/')).sort()).toEqual(sources.sort());
});

it('publishes to GitHub Packages from a published GitHub Release only', () => {
    const manifest = JSON.parse(read('package.json'));
    expect(manifest.publishConfig).toEqual({ registry: 'https://npm.pkg.github.com' });
    expect(manifest.repository?.url).toBe('git+https://github.com/gpellicciotta/support.webapp.git');

    expect(existsSync(resolve('.github/workflows/publish.yml')), 'publish workflow').toBe(true);
    const workflow = read('.github/workflows/publish.yml');
    expect(workflow).toMatch(/release:\s*\n\s*types: \[published\]/);
    expect(workflow).toMatch(/packages: write/);
    expect(workflow).toMatch(/registry-url: "https:\/\/npm\.pkg\.github\.com"/);
    expect(workflow).toMatch(/NODE_AUTH_TOKEN: \$\{\{ secrets\.GITHUB_TOKEN \}\}/);
    // A manual run can only rehearse the publication; only a release publishes.
    expect(workflow).toMatch(/npm publish --dry-run/);
});

it('declares the changelog areas of ADR-0005 in the changelog header', () => {
    const header = read('CHANGELOG.md').split(/^## /m)[0];
    for (const area of ['Tokens', 'Looks', 'Components', 'Shell', 'Modules', 'CLI', 'Template']) {
        expect(header).toContain(`\`${area}\``);
    }
});
