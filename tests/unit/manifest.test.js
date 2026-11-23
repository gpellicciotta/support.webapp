import { describe, it, expect, onTestFinished } from 'vitest';
import { createHash } from 'node:crypto';
import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { buildManifest, packageManifest } from '../../bin/manifest.mjs';

describe('package manifest', () => {
    it('hashes shipped bytes and classifies look files without demo files or app icons', () => {
        const manifest = buildManifest();
        expect(manifest.version).toBe(JSON.parse(readFileSync('package.json')).version);
        expect(manifest.files['css/style.css']).toEqual({ look: null, sha256: createHash('sha256').update(readFileSync('src/css/style.css', 'utf8').replaceAll('\r\n', '\n')).digest('hex') });
        expect(manifest.files['looks/neutral/index.css'].look).toBe('neutral');
        expect(manifest.files['bin/check.mjs'].look).toBe(null);
        expect(Object.keys(manifest.files).some(path => path.startsWith('demo/') || path === 'index.html')).toBe(false);
        // Apps copy their own app icon files from a tagged checkout instead of vendoring every app's icons.
        expect(Object.keys(manifest.files).some(path => path.startsWith('img/app-icons/'))).toBe(false);
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

    it('builds equal hashes from LF and CRLF text trees and raw hashes for binaries', () => {
        const hash = data => createHash('sha256').update(data).digest('hex');
        const textPaths = ['css/a.css', 'js/a.js', 'js/a.mjs', 'contract.json', 'looks/neutral/icons.svg', 'page.html', 'notes.md', 'info.txt'];
        const tree = (eol, binary) => {
            const root = mkdtempSync(join(tmpdir(), 'design-eol-'));
            onTestFinished(() => rmSync(root, { recursive: true, force: true }));
            mkdirSync(join(root, 'bin'));
            writeFileSync(join(root, 'package.json'), '{"version":"1.0.0"}');
            writeFileSync(join(root, 'bin/check.mjs'), `line1${eol}line2${eol}`);
            for (const path of textPaths) {
                mkdirSync(join(root, 'src', path, '..'), { recursive: true });
                writeFileSync(join(root, 'src', path), `a${eol}b${eol}`);
            }
            writeFileSync(join(root, 'src/lone.txt'), `a\rb${eol}`);
            mkdirSync(join(root, 'src/fonts'), { recursive: true });
            writeFileSync(join(root, 'src/fonts/sample.woff2'), binary);
            return buildManifest(root);
        };
        const lf = tree('\n', Buffer.from([0x01, 0x0d, 0x0a, 0x02]));
        const crlf = tree('\r\n', Buffer.from([0x01, 0x0a, 0x02]));
        for (const path of [...textPaths, 'bin/check.mjs', 'lone.txt']) {
            expect(crlf.files[path].sha256).toBe(lf.files[path].sha256);
        }
        expect(lf.files['css/a.css'].sha256).toBe(hash('a\nb\n'));
        expect(lf.files['lone.txt'].sha256).toBe(hash('a\rb\n'));
        expect(lf.files['lone.txt'].sha256).not.toBe(hash('a\nb\n'));
        expect(lf.files['fonts/sample.woff2'].sha256).toBe(hash(Buffer.from([0x01, 0x0d, 0x0a, 0x02])));
        expect(crlf.files['fonts/sample.woff2'].sha256).toBe(hash(Buffer.from([0x01, 0x0a, 0x02])));
        expect(crlf.files['fonts/sample.woff2'].sha256).not.toBe(lf.files['fonts/sample.woff2'].sha256);
    });
});
