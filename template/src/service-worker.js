/**
 * Service worker: precaches the app shell so the app starts and runs offline.
 *
 * Install caches the app files of PRECACHE and the vendored design files that the vendored manifest.json lists
 * for the app's look, in a cache named after VERSION; activate deletes older caches.
 * A new worker waits after it installs; the page's Update toast sends `{type: 'skip-waiting'}` to activate it,
 * so open pages never mix old and new files. The first install has no page to protect and just claims it.
 * Same-origin GET requests are served cache first; page navigations fall back to the cached start page,
 * and to offline.html when even that is missing.
 * Bump VERSION with every change to a precached file, including a re-vendored design system.
 * tests/unit/precache.test.js fails when a file under src/, outside src/demo/ and src/vendor/, is missing here.
 */

const VERSION = '1';
const PREFIX = '{{app-name}}-shell-';
const CACHE = `${PREFIX}${VERSION}`;
const LOOK = '{{look}}';
const VENDOR = 'vendor/design/';

const PRECACHE = [
    './',
    'index.html',
    'offline.html',
    'manifest.webmanifest',
    'css/style.css',
    'css/tokens.css',
    'css/app.css',
    'img/app-icon.svg',
    'js/main.js'
];

/**
 * Return the vendored files the app can load: every file of its look and the look-neutral ones, without the checker.
 * @returns {Promise<string[]>} paths relative to the worker
 */
async function vendoredFiles() {
    const response = await fetch(new URL(`${VENDOR}manifest.json`, self.location.href), { cache: 'reload' });
    if (!response.ok) {
        throw new Error(`Precache failed: the vendored manifest answered ${response.status}`);
    }
    const { files } = await response.json();
    return Object.entries(files)
        .filter(([path, entry]) => (entry.look === null || entry.look === LOOK) && !path.startsWith('bin/'))
        .map(([path]) => `${VENDOR}${path}`);
}

/**
 * Fetch one precache entry and store it, or throw when the server answered with an error.
 * @param {Cache} cache the cache to fill
 * @param {string} path the entry, relative to the worker
 * @returns {Promise<void>} resolves once the entry is stored
 */
async function precacheEntry(cache, path) {
    // `cache: 'reload'` skips the HTTP cache, so a new VERSION never stores files cached before the deploy.
    const request = new Request(new URL(path, self.location.href), { cache: 'reload' });
    const response = await fetch(request);
    if (!response.ok) {
        throw new Error(`Precache failed: ${path} answered ${response.status}`);
    }
    await cache.put(request, response);
}

self.addEventListener('install', event => {
    // One bad entry fails the install and drops the partial cache, so the next visit starts clean.
    event.waitUntil(caches.open(CACHE)
        .then(async cache => {
            const paths = [...PRECACHE, ...await vendoredFiles()];
            await Promise.all(paths.map(path => precacheEntry(cache, path)));
        })
        .catch(async error => {
            await caches.delete(CACHE);
            throw error;
        }));
});

self.addEventListener('message', event => {
    if (event.data?.type === 'skip-waiting') {
        self.skipWaiting();
    }
});

self.addEventListener('activate', event => {
    event.waitUntil(caches.keys()
        .then(keys => Promise.all(keys.filter(key => key.startsWith(PREFIX) && key !== CACHE).map(key => caches.delete(key))))
        .then(() => self.clients.claim()));
});

self.addEventListener('fetch', event => {
    const { request } = event;
    const url = new URL(request.url);
    if (request.method !== 'GET' || url.origin !== self.location.origin) {
        return;
    }
    event.respondWith(caches.open(CACHE).then(async cache => {
        const cached = await cache.match(request, { ignoreSearch: request.mode === 'navigate' });
        if (cached) {
            return cached;
        }
        try {
            return await fetch(request);
        }
        catch (error) {
            const fallback = request.mode === 'navigate'
                ? (await cache.match('./')) ?? (await cache.match('offline.html'))
                : null;
            if (fallback) {
                return fallback;
            }
            throw error;
        }
    }));
});
