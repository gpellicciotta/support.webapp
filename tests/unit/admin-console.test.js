// @vitest-environment happy-dom
// Unit tests for admin-console.js: route parsing, marks and titles, update vs remount, dispose on change, gates, and shell lifecycle.
import { readFileSync } from 'node:fs';
import { Window } from 'happy-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
    attachAdminConsole,
    createAdminConsole,
    displayName,
    parseRoute
} from '../../src/js/admin-console.js';
import { setSpriteUrl } from '../../src/js/icon.js';
import { installPopoverShim } from './popover-shim.js';

/**
 * Create an isolated browser-like environment with controllable hash, history, media query, and hashchange dispatch.
 * @param {string} [initialUrl] starting URL
 * @param {boolean} [wide] whether `(width >= 64rem)` matches
 * @returns {object} isolated test environment
 */
function createEnvironment(initialUrl = '/admin/', wide = true) {
    const win = new Window({ url: `https://example.test${initialUrl}` });
    const doc = win.document;
    installPopoverShim(win);

    const parsed = new URL(initialUrl, 'https://example.test');
    const replaceCalls = [];
    const hashListeners = new Set();

    const location = {
        get origin() {
            return parsed.origin;
        },
        get pathname() {
            return parsed.pathname;
        },
        get search() {
            return parsed.search;
        },
        get hash() {
            return parsed.hash;
        },
        set hash(value) {
            const oldURL = parsed.href;
            parsed.hash = value;
            const newURL = parsed.href;
            if (oldURL !== newURL) {
                dispatchHashChange(oldURL, newURL);
            }
        },
        get href() {
            return parsed.href;
        }
    };

    const history = {
        state: null,
        replaceState(state, title, url) {
            replaceCalls.push([state, title, url]);
            this.state = state;
            if (url !== undefined && url !== null) {
                const next = new URL(String(url), parsed.origin);
                parsed.pathname = next.pathname;
                parsed.search = next.search;
                parsed.hash = next.hash;
            }
        }
    };

    function dispatchHashChange(oldURL = parsed.href, newURL = parsed.href) {
        const event = { type: 'hashchange', oldURL, newURL };
        for (const entry of [...hashListeners]) {
            entry.listener(event);
        }
    }

    const mediaListeners = new Set();
    const media = {
        matches: wide,
        addEventListener(type, listener) {
            if (type === 'change') {
                mediaListeners.add(listener);
            }
        },
        removeEventListener(type, listener) {
            if (type === 'change') {
                mediaListeners.delete(listener);
            }
        }
    };

    const view = {
        document: doc,
        location,
        history,
        matchMedia: () => media,
        addEventListener(type, listener, opts) {
            if (type !== 'hashchange') {
                return;
            }
            const entry = { listener };
            hashListeners.add(entry);
            if (opts && typeof opts === 'object' && opts.signal) {
                if (opts.signal.aborted) {
                    hashListeners.delete(entry);
                    return;
                }
                opts.signal.addEventListener('abort', () => hashListeners.delete(entry), { once: true });
            }
        },
        removeEventListener(type, listener) {
            if (type !== 'hashchange') {
                return;
            }
            for (const entry of hashListeners) {
                if (entry.listener === listener) {
                    hashListeners.delete(entry);
                }
            }
        }
    };

    function setHashSilently(nextHash) {
        parsed.hash = nextHash;
    }

    function navigateHash(nextHash) {
        const oldURL = parsed.href;
        parsed.hash = nextHash;
        dispatchHashChange(oldURL, parsed.href);
    }

    return { win, doc, view, location, history, media, replaceCalls, hashListeners, setHashSilently, navigateHash };
}

beforeEach(() => {
    setSpriteUrl('/looks/neutral/icons.svg');
});

describe('parseRoute', () => {
    const screens = [
        { name: 'overview', title: 'Overview' },
        { name: 'users', title: 'Users' },
        { name: 'system-events', title: 'System events' }
    ];

    it('parses known routes with and without ids, leading slash, or query strings', () => {
        expect(parseRoute('#/overview', screens)).toEqual({ name: 'overview', id: null });
        expect(parseRoute('#/users', screens)).toEqual({ name: 'users', id: null });
        expect(parseRoute('#/users/42', screens)).toEqual({ name: 'users', id: '42' });
        expect(parseRoute('#users/42', screens)).toEqual({ name: 'users', id: '42' });
        expect(parseRoute('#/users/42?q=alex&page=2', screens)).toEqual({ name: 'users', id: '42' });
        expect(parseRoute('#/system-events?level=error', screens)).toEqual({ name: 'system-events', id: null });
        expect(parseRoute('#/users/', screens)).toEqual({ name: 'users', id: null });
    });

    it('falls back to defaultScreen or the first screen for empty, query-only, and unknown hashes', () => {
        expect(parseRoute('', screens)).toEqual({ name: 'overview', id: null });
        expect(parseRoute('#', screens)).toEqual({ name: 'overview', id: null });
        expect(parseRoute('#/', screens)).toEqual({ name: 'overview', id: null });
        expect(parseRoute('#?page=2', screens)).toEqual({ name: 'overview', id: null });
        expect(parseRoute('#/missing/99', screens)).toEqual({ name: 'overview', id: null });
        expect(parseRoute('#/missing', screens, 'users')).toEqual({ name: 'users', id: null });
    });
});

describe('displayName', () => {
    it('returns trimmed account name and falls back to email or empty string', () => {
        expect(displayName({ name: '  Alex North  ', email: 'alex@example.test' })).toBe('Alex North');
        expect(displayName({ name: '   ', email: 'alex@example.test' })).toBe('alex@example.test');
        expect(displayName({ email: 'alex@example.test' })).toBe('alex@example.test');
        expect(displayName(null)).toBe('');
    });
});

describe('createAdminConsole shell, marks, titles, and skip link', () => {
    it('builds the shell with side panel, route marks, screen titles, back link, and skip link focus', () => {
        const env = createEnvironment('/admin/#/users');
        const host = env.doc.createElement('div');
        env.doc.body.append(host);

        const mounted = [];
        const frame = createAdminConsole(host, {
            document: env.doc,
            window: env.view,
            media: env.media,
            title: 'Admin Console',
            backLink: { href: '/', label: 'Back to Auth', icon: 'back' },
            accountMenu: { manageHref: '/account' },
            screens: [
                {
                    name: 'overview',
                    title: 'Overview',
                    icon: 'lists',
                    mount: (view, ctx, route) => {
                        mounted.push({ screen: 'overview', route });
                        view.append(ctx.dom.h('p', null, 'Overview body'));
                    }
                },
                {
                    name: 'users',
                    title: 'Users',
                    icon: 'people',
                    badge: { text: '3', srText: ' unread' },
                    mount: (view, ctx, route) => {
                        mounted.push({ screen: 'users', route });
                        view.append(ctx.dom.h('p', null, 'Users body'));
                    }
                }
            ]
        });

        frame.showShell({ name: 'Alex North', email: 'alex@example.test' }, { id: 'tok-1' });

        expect(frame.getMode()).toBe('shell');
        expect(mounted).toEqual([{ screen: 'users', route: { name: 'users', id: null } }]);
        expect(env.doc.title).toBe('Users · Admin Console');
        expect(host.querySelector('[data-admin-console-title]').textContent).toBe('Users');
        expect(host.querySelector('[data-admin-console-view]').dataset.adminConsoleScreen).toBe('users');

        const navLinks = [...host.querySelectorAll('[data-admin-console-nav]')];
        expect(navLinks).toHaveLength(2);
        expect(navLinks[0].getAttribute('aria-current')).toBeNull();
        expect(navLinks[1].getAttribute('aria-current')).toBe('page');
        expect(navLinks[1].querySelector('.badge').textContent).toBe('3 unread');

        const endList = host.querySelector('.app__sidebar > .app__nav-list--end');
        expect(endList).not.toBeNull();
        expect(endList.querySelector('a').getAttribute('href')).toBe('/');
        expect(endList.textContent).toContain('Back to Auth');

        const panel = host.querySelector('[data-admin-console-panel]');
        expect(panel.hidden).toBe(true);

        // Skip link focuses main without mutating location.hash.
        const skip = host.querySelector('[data-admin-console-skip]');
        const main = host.querySelector('[data-admin-console-main]');
        const focusSpy = vi.spyOn(main, 'focus');
        const clickEvent = new env.win.MouseEvent('click', { bubbles: true, cancelable: true });
        skip.dispatchEvent(clickEvent);
        expect(clickEvent.defaultPrevented).toBe(true);
        expect(focusSpy).toHaveBeenCalledTimes(1);
        expect(env.location.hash).toBe('#/users');

        frame.destroy();
    });

    it('supports creating its own container element when passed a Document', () => {
        const env = createEnvironment('/admin/');
        const frame = createAdminConsole(env.doc, {
            window: env.view,
            media: env.media,
            screens: [{ name: 'overview', title: 'Overview', mount: () => {} }]
        });
        expect(frame.element.ownerDocument).toBe(env.doc);
        expect(frame.element.hasAttribute('data-admin-console')).toBe(true);
        frame.destroy();
    });
});

describe('screen lifecycle: update vs remount and dispose on change', () => {
    it('calls update instead of remounting on same-screen hash changes and preserves query across detail ids', () => {
        const env = createEnvironment('/admin/#/users?q=alex');
        const host = env.doc.createElement('div');
        env.doc.body.append(host);

        const events = [];
        const frame = createAdminConsole(host, {
            document: env.doc,
            window: env.view,
            media: env.media,
            screens: [
                {
                    name: 'overview',
                    title: 'Overview',
                    mount: (_view, _ctx, route) => {
                        events.push(['overview:mount', route]);
                        return {
                            dispose: () => events.push(['overview:dispose'])
                        };
                    }
                },
                {
                    name: 'users',
                    title: 'Users',
                    mount: (view, ctx, route) => {
                        events.push(['users:mount', route]);
                        view.append(ctx.dom.h('p', { 'data-test-keep': 'yes' }, 'Users table'));
                        return {
                            update: (next) => {
                                events.push(['users:update', next]);
                                if (next.id) {
                                    ctx.openPanel(ctx.dom.h('p', null, `Detail ${next.id}`));
                                }
                                else {
                                    ctx.closePanel();
                                }
                            },
                            dispose: () => events.push(['users:dispose'])
                        };
                    }
                },
                {
                    name: 'logs',
                    title: 'Logs',
                    mount: (_view, _ctx, route) => {
                        events.push(['logs:mount', route]);
                        return {
                            dispose: () => events.push(['logs:dispose'])
                        };
                    }
                }
            ]
        });

        frame.showShell({ name: 'Alex North' });
        const keptNode = host.querySelector('[data-test-keep="yes"]');
        expect(keptNode).not.toBeNull();

        // Same screen with `update`: does not dispose or remount, and keeps `?q=alex`.
        env.navigateHash('#/users/34');
        expect(events).toEqual([
            ['users:mount', { name: 'users', id: null }],
            ['users:update', { name: 'users', id: '34' }]
        ]);
        expect(host.querySelector('[data-test-keep="yes"]')).toBe(keptNode);
        expect(host.querySelector('[data-admin-console-panel]').hidden).toBe(false);
        expect(env.location.hash).toBe('#/users/34?q=alex');

        // Switching to another screen disposes users, hides and clears side panel, and resets main.scrollTop.
        const main = host.querySelector('[data-admin-console-main]');
        main.scrollTop = 240;
        env.navigateHash('#/overview');
        expect(events).toEqual([
            ['users:mount', { name: 'users', id: null }],
            ['users:update', { name: 'users', id: '34' }],
            ['users:dispose'],
            ['overview:mount', { name: 'overview', id: null }]
        ]);
        expect(host.querySelector('[data-admin-console-panel]').hidden).toBe(true);
        expect(host.querySelector('[data-admin-console-panel]').childNodes.length).toBe(0);
        expect(main.scrollTop).toBe(0);
        expect(env.doc.title).toBe('Overview · Admin Console');

        // Screen without `update`: same-screen hash change disposes and remounts.
        env.navigateHash('#/logs');
        env.navigateHash('#/logs/99');
        expect(events.slice(-4)).toEqual([
            ['overview:dispose'],
            ['logs:mount', { name: 'logs', id: null }],
            ['logs:dispose'],
            ['logs:mount', { name: 'logs', id: '99' }]
        ]);

        // Destroy disposes current screen and unsubscribes hashchange.
        frame.destroy();
        expect(events.at(-1)).toEqual(['logs:dispose']);
        env.navigateHash('#/overview');
        expect(events.at(-1)).toEqual(['logs:dispose']);
    });
});

describe('gate pages, signed-out shell, and start() callbacks', () => {
    it('renders checking, check-failed, and forbidden gate pages and tears down active screens', async () => {
        const env = createEnvironment('/admin/#/overview');
        const host = env.doc.createElement('div');
        env.doc.body.append(host);

        const disposed = vi.fn();
        const onSignOut = vi.fn().mockRejectedValue(new Error('network gone'));
        const frame = createAdminConsole(host, {
            document: env.doc,
            window: env.view,
            media: env.media,
            title: 'Admin Console',
            backLink: { href: '/', label: 'Back to Auth' },
            onSignOut,
            screens: [
                {
                    name: 'overview',
                    title: 'Overview',
                    mount: () => ({ dispose: disposed })
                }
            ]
        });

        frame.showShell({ name: 'Alex North' });
        frame.showChecking();
        expect(disposed).toHaveBeenCalledTimes(1);
        expect(frame.getMode()).toBe('gate');
        const checkingGate = host.querySelector('[data-admin-console-gate="checking"]');
        expect(checkingGate.tagName).toBe('MAIN');
        expect(checkingGate.classList.contains('app__gate')).toBe(true);
        expect(checkingGate.querySelector('h1').textContent).toBe('Admin Console');
        expect(checkingGate.querySelector('[role="status"]').textContent).toContain('Checking your session');

        frame.showForbidden({ message: 'Admin realm needed.' });
        const forbiddenGate = host.querySelector('[data-admin-console-gate="forbidden"]');
        expect(forbiddenGate).not.toBeNull();
        expect(forbiddenGate.getAttribute('aria-label')).toBe('Administrator access required');
        expect(forbiddenGate.textContent).toContain('Admin realm needed.');
        expect(forbiddenGate.querySelector('a.button').getAttribute('href')).toBe('/');

        // Clicking Sign Out invokes onSignOut and transitions to signed-out shell even if onSignOut rejects.
        forbiddenGate.querySelector('[data-admin-console-action="sign-out"]').click();
        await Promise.resolve();
        await Promise.resolve();
        expect(onSignOut).toHaveBeenCalledTimes(1);
        expect(frame.getMode()).toBe('signed-out');
        expect(host.querySelector('[data-admin-console-action="sign-in"]')).not.toBeNull();

        frame.destroy();
    });

    it('keeps route marks and titles updating in the signed-out shell without mounting screens', () => {
        const env = createEnvironment('/admin/#/overview');
        const host = env.doc.createElement('div');
        env.doc.body.append(host);

        const mountSpy = vi.fn();
        const onSignIn = vi.fn();
        const frame = createAdminConsole(host, {
            document: env.doc,
            window: env.view,
            media: env.media,
            onSignIn,
            screens: [
                { name: 'overview', title: 'Overview', mount: mountSpy },
                { name: 'users', title: 'Users', mount: mountSpy }
            ]
        });

        frame.showSignedOut('Sign in to continue.');
        expect(mountSpy).not.toHaveBeenCalled();
        expect(host.querySelector('[data-admin-console-view] [role="status"]').textContent).toBe('Sign in to continue.');
        expect(host.querySelector('[data-admin-console-nav="overview"]').getAttribute('aria-current')).toBe('page');

        env.navigateHash('#/users');
        expect(mountSpy).not.toHaveBeenCalled();
        expect(host.querySelector('[data-admin-console-title]').textContent).toBe('Users');
        expect(host.querySelector('[data-admin-console-nav="users"]').getAttribute('aria-current')).toBe('page');
        expect(env.doc.title).toBe('Users · Admin Console');

        host.querySelector('[data-admin-console-action="sign-in"]').click();
        expect(onSignIn).toHaveBeenCalledTimes(1);

        // Failure variant shows an alert error banner instead of a status line.
        frame.showSignedOut('Sign-in failed.', { failure: true });
        expect(host.querySelector('[data-admin-console-view] [role="alert"]').textContent).toContain('Sign-in failed.');

        frame.destroy();
    });

    it('runs start() callbacks for session failure + Retry, unauthenticated, 401, non-admin forbidden, and authorized shell', async () => {
        const env = createEnvironment('/admin/#/overview');
        const host = env.doc.createElement('div');
        env.doc.body.append(host);

        let attempt = 0;
        const onUnauthenticated = vi.fn();
        const mountSpy = vi.fn();

        const checkSession = vi.fn(async () => {
            attempt += 1;
            if (attempt === 1) {
                throw new Error('offline');
            }
            if (attempt === 2) {
                return null;
            }
            return { token: 'secret-token', id: 'sess-1' };
        });

        let accountMode = '401';
        const checkAccount = vi.fn(async () => {
            if (accountMode === '401') {
                throw Object.assign(new Error('Expired'), { status: 401 });
            }
            if (accountMode === 'user') {
                return { name: 'Sam User', email: 'sam@example.test', realms: ['user'] };
            }
            return { name: 'Alex Admin', email: 'alex@example.test', realms: ['admin'] };
        });

        const frame = createAdminConsole(host, {
            document: env.doc,
            window: env.view,
            media: env.media,
            checkSession,
            checkAccount,
            onUnauthenticated,
            createContext: (base) => ({ ...base, apiTag: 'custom-api' }),
            screens: [{ name: 'overview', title: 'Overview', mount: mountSpy }]
        });

        // Attempt 1: session check throws -> error gate with Retry.
        await frame.start();
        expect(frame.getMode()).toBe('gate');
        const errorGate = host.querySelector('[data-admin-console-gate="error"]');
        expect(errorGate.querySelector('[role="alert"]').textContent).toContain('offline');

        // Retry (attempt 2): null session -> onUnauthenticated.
        errorGate.querySelector('[data-admin-console-action="retry"]').click();
        await vi.waitFor(() => expect(onUnauthenticated).toHaveBeenCalledTimes(1));
        expect(onUnauthenticated).toHaveBeenLastCalledWith({ expired: false, error: null });

        // Attempt 3: 401 from checkAccount -> onUnauthenticated({ expired: true }).
        await frame.start();
        expect(onUnauthenticated).toHaveBeenCalledTimes(2);
        expect(onUnauthenticated.mock.calls[1][0].expired).toBe(true);

        // Attempt 4: account without 'admin' realm -> forbidden gate.
        accountMode = 'user';
        await frame.start();
        expect(host.querySelector('[data-admin-console-gate="forbidden"]')).not.toBeNull();
        expect(mountSpy).not.toHaveBeenCalled();

        // Attempt 5: admin account -> mounts shell with custom context.
        accountMode = 'admin';
        await frame.start();
        expect(frame.getMode()).toBe('shell');
        expect(mountSpy).toHaveBeenCalledTimes(1);
        expect(mountSpy.mock.calls[0][1].apiTag).toBe('custom-api');
        expect(mountSpy.mock.calls[0][1].me.name).toBe('Alex Admin');

        frame.destroy();
    });
});

describe('attachAdminConsole on existing shell markup', () => {
    it('attaches via data-admin-console-* hooks, routes hash changes, and swaps cleanly to a gate and back', () => {
        const env = createEnvironment('/admin/#/accounts');
        env.doc.body.className = 'app app--scroll-main';
        env.doc.body.innerHTML = `
            <a class="skip-link" href="#main" data-admin-console-skip>Skip to content</a>
            <header class="app__top-bar">
                <button class="app__nav-toggle icon-button" type="button" popovertarget="nav" aria-controls="nav" aria-expanded="true" aria-label="Navigation" data-app-nav-toggle></button>
                <a class="app__brand" href="#/accounts" data-admin-console-brand>Admin Console</a>
                <div class="app__top-actions" data-admin-console-top-actions><span data-test-account>Alex</span></div>
            </header>
            <nav class="app__sidebar" id="nav" aria-label="Main" popover data-admin-console-sidebar>
                <ul class="app__nav-list">
                    <li><a class="app__nav-item" href="#/overview" data-admin-console-nav="overview">Overview</a></li>
                    <li><a class="app__nav-item" href="#/accounts" aria-current="page" data-admin-console-nav="accounts">Accounts</a></li>
                </ul>
            </nav>
            <main class="app__main" id="main" tabindex="-1" data-admin-console-main>
                <h1 data-admin-console-title>Accounts</h1>
                <div data-admin-console-view></div>
            </main>
            <aside class="app__side-panel" hidden data-admin-console-panel></aside>
            <div class="app__overlays" data-admin-console-overlays></div>
        `;

        const seen = [];
        const frame = attachAdminConsole(env.doc.body, {
            document: env.doc,
            window: env.view,
            media: env.media,
            defaultScreen: 'accounts',
            screens: [
                {
                    name: 'overview',
                    title: 'Overview',
                    mount: (view) => {
                        seen.push('overview');
                        view.textContent = 'Overview screen';
                    }
                },
                {
                    name: 'accounts',
                    title: 'Accounts',
                    mount: (view) => {
                        seen.push('accounts');
                        view.textContent = 'Accounts screen';
                    }
                }
            ]
        });

        expect(seen).toEqual(['accounts']);
        expect(env.doc.querySelector('[data-admin-console-view]').textContent).toBe('Accounts screen');

        env.navigateHash('#/overview');
        expect(seen).toEqual(['accounts', 'overview']);
        expect(env.doc.querySelector('[data-admin-console-title]').textContent).toBe('Overview');
        expect(env.doc.querySelector('[data-admin-console-nav="overview"]').getAttribute('aria-current')).toBe('page');

        // Transitioning to a gate leaves exactly one <main> and no duplicate #main id.
        frame.showForbidden();
        expect(env.doc.querySelectorAll('main')).toHaveLength(1);
        expect(env.doc.querySelectorAll('#main')).toHaveLength(1);
        expect(env.doc.querySelector('[data-admin-console-gate="forbidden"]')).not.toBeNull();

        // Returning to shell restores the pre-existing shell DOM and re-routes the current hash.
        frame.showShell();
        expect(env.doc.querySelectorAll('main')).toHaveLength(1);
        expect(env.doc.querySelector('[data-test-account]').textContent).toBe('Alex');
        expect(env.doc.querySelector('[data-admin-console-view]').textContent).toBe('Overview screen');

        frame.destroy();
    });
});

describe('admin-console contract and naming compliance', () => {
    it('registers admin-console in contract.json, avoids style-class selectors in JS, and defines .app__gate in shell.css', () => {
        const contract = JSON.parse(readFileSync('src/contract.json', 'utf8'));
        expect(contract.components).toContain('admin-console');

        const moduleSource = readFileSync('src/js/admin-console.js', 'utf8');
        expect(moduleSource).not.toMatch(/querySelector(?:All)?\([^)]*\.[a-z]/);

        const shellCss = readFileSync('src/css/shell.css', 'utf8');
        expect(shellCss).toMatch(/\.app__gate\s*\{/);
        expect(shellCss).toMatch(/\.app__gate-actions\s*\{/);
    });
});

describe('createAdminConsole navigation states', () => {
    it('passes navStates to the nav toggle, so a press skips the icon rail', () => {
        const env = createEnvironment('/admin/#/overview');
        const host = env.doc.createElement('div');
        env.doc.body.append(host);
        const frame = createAdminConsole(host, {
            document: env.doc,
            window: env.view,
            media: env.media,
            navStates: ['open', 'hidden'],
            screens: [{ name: 'overview', title: 'Overview', icon: 'lists', mount: () => {} }]
        });
        frame.showShell({ name: 'Alex North' }, { id: 'tok-1' });
        const toggle = host.querySelector('[data-app-nav-toggle]');
        const sidebar = host.querySelector('.app__sidebar');
        expect(toggle.getAttribute('aria-label')).toBe('Hide navigation');
        expect(toggle.querySelector('use').getAttribute('href')).toMatch(/#icon-nav-close$/);
        toggle.click();
        expect(sidebar.hidden).toBe(true);
        toggle.click();
        expect(sidebar.hidden).toBe(false);
        expect(toggle.getAttribute('aria-expanded')).toBe('true');
        frame.destroy();
    });
});

describe('createAdminConsole label tooltips', () => {
    it('names hovered icon buttons in the shell, and removes the tooltip with the shell', () => {
        const env = createEnvironment('/admin/#/overview');
        const host = env.doc.createElement('div');
        env.doc.body.append(host);
        const frame = createAdminConsole(host, {
            document: env.doc,
            window: env.view,
            media: env.media,
            screens: [{ name: 'overview', title: 'Overview', icon: 'lists', mount: () => {} }]
        });
        frame.showShell({ name: 'Alex North' }, { id: 'tok-1' });
        const toggle = host.querySelector('[data-app-nav-toggle]');
        toggle.dispatchEvent(new env.win.PointerEvent('pointerover', { bubbles: true, pointerType: 'mouse' }));
        const tips = () => env.doc.querySelectorAll('.tooltip--label:not([hidden])');
        expect([...tips()].map((tip) => tip.textContent)).toEqual(['Collapse navigation']);
        frame.destroy();
        expect(env.doc.querySelectorAll('.tooltip--label')).toHaveLength(0);
    });
});
