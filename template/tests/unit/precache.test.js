import { expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

it('precaches every app file of the web root outside the gallery and the vendored copy', () => {
    const worker = readFileSync('src/service-worker.js', 'utf8');
    const list = worker.slice(worker.indexOf('const PRECACHE = ['), worker.indexOf('];', worker.indexOf('const PRECACHE = [')));
    const precached = new Set([...list.matchAll(/'([^']+)'/g)].map(match => match[1]));
    const files = readdirSync('src', { recursive: true, withFileTypes: true })
        .filter(item => item.isFile())
        .map(item => relative('src', join(item.parentPath, item.name)).split(sep).join('/'))
        .filter(path => !path.startsWith('demo/') && !path.startsWith('vendor/') && path !== 'service-worker.js');
    expect(files.filter(path => !precached.has(path))).toEqual([]);
    expect([...precached].filter(path => path !== './' && !files.includes(path))).toEqual([]);
});
