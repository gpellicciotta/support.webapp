import { describe, it, expect, onTestFinished } from 'vitest';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildManifest, packageManifest } from '../../bin/manifest.mjs';

describe('package manifest', () => {
    it('hashes shipped bytes and classifies look files without demo files', () => {
        const manifest = buildManifest();
        expect(manifest.version).toBe(JSON.parse(readFileSync('package.json')).version);
        expect(manifest.files['css/style.css']).toEqual({ look: null, sha256: createHash('sha256').update(readFileSync('src/css/style.css')).digest('hex') });
        expect(manifest.files['looks/neutral/index.css'].look).toBe('neutral');
        expect(manifest.files['bin/check.mjs'].look).toBe(null);
        expect(Object.keys(manifest.files).some(path => path.startsWith('demo/') || path === 'index.html')).toBe(false);
        expect(buildManifest()).toEqual(manifest);
    });

    it('uses the shipped manifest only while it matches the package files', () => {
        const root = mkdtempSync(join(tmpdir(), 'design-package-'));
        onTestFinished(() => rmSync(root, { recursive: true, force: true }));
        mkdirSync(join(root, 'src/looks/neutral'), { recursive: true });
        mkdirSync(join(root, 'bin'));
        writeFileSync(join(root, 'package.json'), '{"version":"1.0.0"}');
        writeFileSync(join(root, 'bin/check.mjs'), '');
        writeFileSync(join(root, 'src/looks/neutral/index.css'), '.a {}');
        expect(packageManifest(root)).toEqual(buildManifest(root));
        writeFileSync(join(root, 'manifest.json'), JSON.stringify(buildManifest(root)));
        expect(packageManifest(root)).toEqual(buildManifest(root));
        writeFileSync(join(root, 'src/looks/neutral/index.css'), '.b {}');
        expect(() => packageManifest(root)).toThrow(/manifest\.json/);
    });
});
