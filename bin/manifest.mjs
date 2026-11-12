import { createHash } from 'node:crypto';
import { existsSync, readFileSync, readdirSync, realpathSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { isDeepStrictEqual } from 'node:util';
import { fileURLToPath } from 'node:url';

export const packageRoot = fileURLToPath(new URL('../', import.meta.url));

export function buildManifest(root = packageRoot) {
    const files = {};
    function walk(folder, prefix = '') {
        for (const item of readdirSync(folder, { withFileTypes: true }).sort((a, b) => a.name.localeCompare(b.name))) {
            const name = `${prefix}${item.name}`;
            if (name === 'demo' || name === 'index.html') {
                continue;
            }
            if (item.isSymbolicLink()) {
                throw new Error(`Symbolic link is not a package asset: ${name}`);
            }
            if (item.isDirectory()) {
                walk(join(folder, item.name), `${name}/`);
            }
            else {
                files[name] = { look: /^looks\/([^/]+)\//.exec(name)?.[1] ?? null, sha256: createHash('sha256').update(readFileSync(join(folder, item.name))).digest('hex') };
            }
        }
    }
    walk(join(root, 'src'));
    files['bin/check.mjs'] = { look: null, sha256: createHash('sha256').update(readFileSync(join(root, 'bin/check.mjs'))).digest('hex') };
    return { version: JSON.parse(readFileSync(join(root, 'package.json'))).version, files };
}

// The shipped manifest must describe the files beside it; a checkout has none after postpack.
export function packageManifest(root = packageRoot) {
    const manifest = buildManifest(root);
    const shipped = join(root, 'manifest.json');
    if (existsSync(shipped) && !isDeepStrictEqual(JSON.parse(readFileSync(shipped)), manifest)) {
        throw new Error('Package files differ from manifest.json; reinstall the package');
    }
    return manifest;
}

// Real paths keep the guard true when a linked checkout runs prepack.
function isMain(url) {
    try {
        return Boolean(process.argv[1]) && realpathSync(process.argv[1]) === realpathSync(fileURLToPath(url));
    }
    catch {
        return false;
    }
}

if (isMain(import.meta.url)) {
    if (process.argv[2] === '--remove') {
        rmSync(join(packageRoot, 'manifest.json'), { force: true });
    }
    else {
        writeFileSync(join(packageRoot, 'manifest.json'), `${JSON.stringify(buildManifest(), null, 2)}\n`);
    }
}
