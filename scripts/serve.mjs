import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, isAbsolute, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseArgs } from 'node:util';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '../src');
const types = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'text/javascript; charset=utf-8',
    '.mjs': 'text/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json',
    '.svg': 'image/svg+xml',
    '.png': 'image/png',
    '.woff2': 'font/woff2'
};

export function contentType(path) {
    return types[extname(path)] || 'application/octet-stream';
}

export function resolveRequest(webRoot, url) {
    try {
        const pathname = decodeURIComponent(url.split('?')[0]);
        const target = resolve(webRoot, `.${pathname === '/' ? '/index.html' : pathname}`);
        const local = relative(webRoot, target);
        return local.startsWith('..') || isAbsolute(local) || pathname.includes('\0') ? null : target;
    }
    catch {
        return null;
    }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const { values } = parseArgs({ options: { port: { type: 'string', default: '4173' } } });
    const port = Number(values.port);
    if (!Number.isInteger(port) || port < 1 || port > 65535) {
        console.error('Port must be an integer from 1 through 65535.');
        process.exitCode = 2;
    }
    else {
        const server = createServer(async (request, response) => {
            if (!['GET', 'HEAD'].includes(request.method)) {
                response.writeHead(405, { Allow: 'GET, HEAD' }).end();
                return;
            }
            const path = resolveRequest(root, request.url);
            if (!path) {
                response.writeHead(403).end();
                return;
            }
            try {
                const body = await readFile(path);
                response.writeHead(200, { 'Content-Type': contentType(path) });
                response.end(request.method === 'HEAD' ? undefined : body);
            }
            catch (error) {
                response.writeHead(['ENOENT', 'ENOTDIR', 'EISDIR'].includes(error.code) ? 404 : 500).end();
            }
        });
        server.on('error', error => {
            console.error(error.message);
            process.exitCode = 1;
        });
        server.listen(port, '127.0.0.1', () => console.log(`Serving src/ at http://127.0.0.1:${port}`));
    }
}
