import { readFileSync, writeFileSync, mkdirSync, existsSync, copyFileSync, rmSync } from 'node:fs';
import { join, dirname, relative, resolve } from 'node:path';
import { packageRoot, packageManifest } from './manifest.mjs';
import { inside, walk } from './check.mjs';

// Only a copy that vendor wrote may be replaced: every file must be listed in its manifest.
function assertReplaceable(target) {
    const manifestPath = join(target, 'manifest.json');
    if (!existsSync(manifestPath)) {
        throw new Error('Target exists but holds no vendored copy; choose a new folder');
    }
    const listed = new Set(['manifest.json', ...Object.keys(JSON.parse(readFileSync(manifestPath)).files ?? {})]);
    for (const path of walk(target)) {
        const name = relative(target, path).replaceAll('\\', '/');
        if (!listed.has(name)) {
            throw new Error(`Target holds a file that vendor did not write: ${name}`);
        }
    }
}

export function vendor({ look, to, styles, dryRun = false }, root = process.cwd()) {
    const target = inside(root, to);
    const name = relative(resolve(root), target).replaceAll('\\', '/');
    const pinPath = join(root, 'design.json');
    const previous = existsSync(pinPath) ? JSON.parse(readFileSync(pinPath)) : null;
    if (previous && previous.target !== name) {
        throw new Error(`design.json vendors into ${previous.target}; vendor there or remove that copy first`);
    }
    const folders = styles ?? previous?.styles ?? [];
    for (const folder of folders) {
        if (!existsSync(inside(root, folder))) {
            throw Object.assign(new Error(`Styles folder not found: ${folder}`), { exitCode: 2 });
        }
    }
    const replace = existsSync(target);
    if (replace) {
        assertReplaceable(target);
    }
    const manifest = packageManifest();
    if (!Object.values(manifest.files).some(entry => entry.look === look)) {
        throw Object.assign(new Error(`Unknown look: ${look}`), { exitCode: 2 });
    }
    const files = Object.entries(manifest.files).filter(([, entry]) => entry.look === null || entry.look === look).map(([path]) => path);
    const pin = { version: manifest.version, look, target: name, styles: folders };
    const changes = [...files.map(path => `${pin.target}/${path}`), `${pin.target}/manifest.json`, 'design.json'];
    if (!dryRun) {
        if (replace) {
            rmSync(target, { recursive: true });
        }
        for (const path of files) {
            const destination = inside(target, path);
            mkdirSync(dirname(destination), { recursive: true });
            copyFileSync(join(packageRoot, path === 'bin/check.mjs' ? path : `src/${path}`), destination);
        }
        writeFileSync(join(target, 'manifest.json'), `${JSON.stringify(manifest, null, 2)}\n`);
        writeFileSync(pinPath, `${JSON.stringify(pin, null, 2)}\n`);
    }
    return { ...pin, dryRun, replaced: replace, changes };
}
