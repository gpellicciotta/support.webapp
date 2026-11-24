// @vitest-environment happy-dom
// Unit tests for data-loader.js: loadInto, createDataLoader, and attachDataLoader.
import { readFileSync } from 'node:fs';
import { Window } from 'happy-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { setSpriteUrl } from '../../src/js/icon.js';
import { attachDataLoader, createDataLoader, loadInto } from '../../src/js/data-loader.js';
import { h } from '../../src/js/dom-builders.js';

const SPRITE = '/vendor/design/looks/neutral/icons.svg';

/**
 * Create a manually settled deferred promise for ordering async race tests.
 * @returns {{promise: Promise<unknown>, resolve: (value?: unknown) => void, reject: (reason?: unknown) => void}}
 *   deferred handle
 */
function deferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
        resolve = res;
        reject = rej;
    });
    return { promise, resolve, reject };
}

describe('data-loader', () => {
    beforeEach(() => {
        document.body.innerHTML = '';
        setSpriteUrl(SPRITE);
    });

    describe('loading and success states', () => {
        it('shows a polite status line outside any busy ancestor while loading and renders content on success', async () => {
            const container = document.createElement('div');
            document.body.append(container);
            const request = deferred();

            const pending = loadInto(
                container,
                { signIn: vi.fn() },
                'Server status',
                () => request.promise,
                (data) => h('p', { 'data-result': 'ok' }, `Status: ${data.state}`)
            );

            const status = container.querySelector('[data-data-loader-status]');
            expect(status).not.toBeNull();
            expect(status.className).toContain('loading__status');
            expect(status.getAttribute('role')).toBe('status');
            expect(status.getAttribute('aria-live')).toBe('polite');
            expect(status.getAttribute('aria-atomic')).toBe('true');
            expect(status.textContent).toBe('Loading server status…');
            // Status line must not sit inside an aria-busy region so screen readers announce it immediately.
            expect(status.closest('[aria-busy="true"]')).toBeNull();

            request.resolve({ state: 'healthy' });
            await expect(pending).resolves.toBe(true);

            expect(container.querySelector('[data-data-loader-status]')).toBeNull();
            expect(container.getAttribute('aria-busy')).toBeNull();
            expect(container.querySelector('[data-result="ok"]').textContent).toBe('Status: healthy');
        });

        it('accepts an options object with loadInto and flattens array results from render', async () => {
            const container = document.createElement('div');
            const rendered = await loadInto(container, {
                what: 'Users',
                fetcher: async () => ['Alex', 'Samira'],
                render: (names) => names.map((name) => h('span', null, name))
            });

            expect(rendered).toBe(true);
            expect([...container.querySelectorAll('span')].map((el) => el.textContent)).toEqual(['Alex', 'Samira']);
        });
    });

    describe('newest call wins', () => {
        it('drops a stale resolution, aborts its signal, and keeps the newer render', async () => {
            const container = document.createElement('div');
            const first = deferred();
            const second = deferred();
            const signals = [];
            const firstRender = vi.fn(() => h('p', null, 'stale'));
            const secondRender = vi.fn(() => h('p', null, 'fresh'));

            const run1 = loadInto(container, null, 'Logs', ({ signal }) => {
                signals.push(signal);
                return first.promise;
            }, firstRender);

            const run2 = loadInto(container, null, 'Logs', ({ signal }) => {
                signals.push(signal);
                return second.promise;
            }, secondRender);

            expect(signals[0].aborted).toBe(true);
            expect(signals[1].aborted).toBe(false);

            second.resolve('v2');
            await expect(run2).resolves.toBe(true);
            expect(container.textContent).toBe('fresh');

            first.resolve('v1');
            await expect(run1).resolves.toBe(false);
            expect(firstRender).not.toHaveBeenCalled();
            expect(container.textContent).toBe('fresh');
        });

        it('drops a stale rejection without replacing the newer content with an error banner', async () => {
            const container = document.createElement('div');
            const first = deferred();
            const second = deferred();

            const run1 = loadInto(container, null, 'Logs', () => first.promise, () => h('p', null, 'stale'));
            const run2 = loadInto(container, null, 'Logs', () => second.promise, () => h('p', null, 'fresh'));

            second.resolve('v2');
            await expect(run2).resolves.toBe(true);

            first.reject(new Error('old timeout'));
            await expect(run1).resolves.toBe(false);
            expect(container.querySelector('[data-data-loader-error]')).toBeNull();
            expect(container.textContent).toBe('fresh');
        });
    });

    describe('quiet mode', () => {
        it('keeps existing content visible with aria-busy while polling and replaces it on success', async () => {
            const container = document.createElement('div');
            container.append(h('p', { 'data-existing': 'true' }, 'Initial content'));
            const request = deferred();

            const pending = loadInto(
                container,
                null,
                'Server status',
                () => request.promise,
                (value) => h('p', { 'data-updated': 'true' }, value),
                { quiet: true }
            );

            expect(container.querySelector('[data-existing="true"]')).not.toBeNull();
            expect(container.querySelector('[data-data-loader-status]')).toBeNull();
            expect(container.getAttribute('aria-busy')).toBe('true');

            request.resolve('Polled content');
            await expect(pending).resolves.toBe(true);
            expect(container.getAttribute('aria-busy')).toBeNull();
            expect(container.querySelector('[data-updated="true"]').textContent).toBe('Polled content');
        });

        it('shows the loading status line when quiet mode targets an empty container', async () => {
            const container = document.createElement('div');
            const request = deferred();

            const pending = loadInto(
                container,
                null,
                'Accounts',
                () => request.promise,
                () => h('p', null, 'Loaded'),
                { quiet: true }
            );

            const status = container.querySelector('[data-data-loader-status]');
            expect(status).not.toBeNull();
            expect(status.textContent).toBe('Loading accounts…');
            expect(container.getAttribute('aria-busy')).toBeNull();

            request.resolve();
            await expect(pending).resolves.toBe(true);
            expect(container.textContent).toBe('Loaded');
        });
    });

    describe('failure and sign-in states', () => {
        it('offers a primary Sign in button on 401 errors and invokes the app callback', async () => {
            const container = document.createElement('div');
            const signIn = vi.fn();
            const error = Object.assign(new Error('Session expired'), { status: 401 });

            const ok = await loadInto(
                container,
                { signIn },
                'Users',
                async () => {
                    throw error;
                },
                () => h('p', null, 'never')
            );

            expect(ok).toBe(false);
            const banner = container.querySelector('[data-data-loader-error="unauthorized"]');
            expect(banner).not.toBeNull();
            expect(banner.getAttribute('role')).toBe('alert');
            expect(banner.className).toContain('banner--danger');
            expect(banner.querySelector('.banner__text').textContent).toBe('Users could not be loaded: Session expired. Sign in again.');

            const btn = banner.querySelector('[data-data-loader-action="sign-in"]');
            expect(btn).not.toBeNull();
            expect(btn.textContent).toBe('Sign in');
            expect(btn.classList.contains('button')).toBe(true);
            expect(btn.classList.contains('button--secondary')).toBe(false);

            btn.click();
            expect(signIn).toHaveBeenCalledTimes(1);
            expect(signIn).toHaveBeenCalledWith(error);
        });

        it('omits the Sign in button on 401 when no sign-in callback is supplied', async () => {
            const container = document.createElement('div');
            const ok = await loadInto(container, {
                what: 'Users',
                fetcher: async () => {
                    throw Object.assign(new Error('Session expired'), { status: 401 });
                },
                render: () => null
            });

            expect(ok).toBe(false);
            expect(container.querySelector('[data-data-loader-error="unauthorized"]')).not.toBeNull();
            expect(container.querySelector('[data-data-loader-action]')).toBeNull();
        });

        it('offers a Retry button with refresh icon on non-401 failures and reloads non-quietly', async () => {
            const container = document.createElement('div');
            container.append(h('p', null, 'Stale content'));
            const retryRequest = deferred();
            let attempts = 0;

            const fetcher = () => {
                attempts += 1;
                if (attempts === 1) {
                    return Promise.reject(new Error('Gateway timeout'));
                }
                return retryRequest.promise;
            };

            const firstOk = await loadInto(
                container,
                { signIn: vi.fn() },
                'System events',
                fetcher,
                (data) => h('p', { 'data-recovered': 'true' }, data),
                { quiet: true }
            );

            expect(firstOk).toBe(false);
            expect(container.getAttribute('aria-busy')).toBeNull();
            const banner = container.querySelector('[data-data-loader-error="failed"]');
            expect(banner).not.toBeNull();
            expect(banner.getAttribute('role')).toBe('alert');
            expect(banner.querySelector('.banner__text').textContent).toBe('System events could not be loaded: Gateway timeout.');

            const retryBtn = banner.querySelector('[data-data-loader-action="retry"]');
            expect(retryBtn).not.toBeNull();
            expect(retryBtn.textContent).toBe('Retry');
            expect(retryBtn.classList.contains('button--secondary')).toBe(true);
            expect(retryBtn.querySelector('svg.icon use').getAttribute('href')).toBe(`${SPRITE}#icon-refresh`);

            retryBtn.click();
            // Retry runs with quiet: false so the user sees immediate loading feedback.
            expect(container.querySelector('[data-data-loader-status]').textContent).toBe('Loading system events…');

            retryRequest.resolve('Recovered');
            await vi.waitFor(() => {
                expect(container.querySelector('[data-recovered="true"]')?.textContent).toBe('Recovered');
            });
            expect(attempts).toBe(2);
        });

        it('escapes HTML in subjects and error messages and avoids duplicate trailing periods', async () => {
            const container = document.createElement('div');
            await loadInto(container, {
                what: '<img src=x>',
                fetcher: async () => {
                    throw new Error('<script>alert(1)</script>.');
                },
                render: () => null
            });

            expect(container.querySelector('script')).toBeNull();
            expect(container.querySelector('img')).toBeNull();
            expect(container.querySelector('.banner__text').textContent).toBe('<img src=x> could not be loaded: <script>alert(1)</script>.');
        });
    });

    describe('createDataLoader and attachDataLoader', () => {
        it('supports injected documents, shared sign-in callbacks, custom labels, and cancellation on destroy', async () => {
            const foreignWindow = new Window();
            const foreignDoc = foreignWindow.document;
            const container = foreignDoc.createElement('div');
            const onSignIn = vi.fn();
            const pendingRequest = deferred();

            const loader = createDataLoader({
                document: foreignDoc,
                onSignIn,
                loadingText: (what) => `Fetching ${what}…`,
                retryLabel: 'Try again',
                signInLabel: 'Log in'
            });

            const run = loader.loadInto(container, 'Tokens', () => pendingRequest.promise, () => foreignDoc.createTextNode('ok'));
            expect(container.querySelector('[data-data-loader-status]').textContent).toBe('Fetching Tokens…');
            expect(container.firstChild.ownerDocument).toBe(foreignDoc);

            loader.destroy();
            pendingRequest.resolve('late');
            await expect(run).resolves.toBe(false);
            expect(container.textContent).toBe('Fetching Tokens…');
        });

        it('attaches to one container and supports reload({ quiet: true }) and cancel()', async () => {
            const container = document.createElement('div');
            let count = 0;
            const controller = attachDataLoader(container, {
                what: 'Server status',
                fetcher: async () => {
                    count += 1;
                    return `Sample ${count}`;
                },
                render: (text) => h('p', null, text)
            });

            await expect(controller.load()).resolves.toBe(true);
            expect(container.textContent).toBe('Sample 1');

            await expect(controller.reload({ quiet: true })).resolves.toBe(true);
            expect(container.textContent).toBe('Sample 2');

            const second = deferred();
            const quietRun = controller.load({
                fetcher: () => second.promise,
                quiet: true
            });
            expect(container.textContent).toBe('Sample 2');
            expect(container.getAttribute('aria-busy')).toBe('true');

            controller.cancel();
            expect(container.getAttribute('aria-busy')).toBeNull();
            second.resolve('Cancelled');
            await expect(quietRun).resolves.toBe(false);
            expect(container.textContent).toBe('Sample 2');
            controller.destroy();
        });
    });

    it('registers data-loader in src/contract.json', () => {
        const contract = JSON.parse(readFileSync('src/contract.json', 'utf8'));
        expect(contract.components).toContain('data-loader');
    });
});
