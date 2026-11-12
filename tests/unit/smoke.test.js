import { describe, expect, it } from 'vitest';
import config from '../../vitest.config.js';
import { resolveRequest, contentType } from '../../scripts/serve.mjs';
import { resolve } from 'node:path';

describe('repository tooling', () => {
    it('uses portable JavaScript and CSS media types', () => {
        expect(contentType('module.js')).toBe('text/javascript; charset=utf-8');
        expect(contentType('module.mjs')).toBe('text/javascript; charset=utf-8');
        expect(contentType('style.css')).toBe('text/css; charset=utf-8');
    });
    it('limits the fast suite to unit tests', () => {
        expect(config.test.include).toEqual(['tests/unit/**/*.test.js']);
        expect(config.test.testTimeout).toBe(30_000);
    });

    it('resolves the landing page and rejects paths outside the web root', () => {
        const root = resolve('src');
        expect(resolveRequest(root, '/')).toBe(resolve(root, 'index.html'));
        expect(resolveRequest(root, '/../package.json')).toBeNull();
        expect(resolveRequest(root, '/%2e%2e%2fpackage.json')).toBeNull();
        expect(resolveRequest(root, '/%ZZ')).toBeNull();
    });
});
