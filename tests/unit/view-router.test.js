// @vitest-environment happy-dom
// Covers the view router (ADR-0003, ADR-0004): route matching order, fallback, sign-in guards, history push/replace, popstate, shell title/route marks, outside routes, and RoutedView + action-registry integration.
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { attachActionRegistry } from '../../src/js/action-registry.js';
import { setSpriteUrl } from '../../src/js/icon.js';
import { attachScreenActionBar } from '../../src/js/screen-action-bar.js';
import { RoutedView } from '../../src/js/view.js';
import {
    CONTENT_VIEW_ADDED_EVENT,
    CONTENT_VIEW_CHANGED_EVENT,
    CONTENT_VIEW_TITLE_CHANGED_EVENT,
    attachViewRouter,
    createViewRouter
} from '../../src/js/view-router.js';

class TestView extends RoutedView {
    constructor(id, app, title, routeRegex, { onlyWhenSignedIn = false, neverWhenSignedIn = false, onlyWhenAdmin = false, actions = [] } = {}) {
        super(id, app, title, routeRegex);
        this.onlyWhenSignedIn = onlyWhenSignedIn;
        this.neverWhenSignedIn = neverWhenSignedIn;
        this.onlyWhenAdmin = onlyWhenAdmin;
        this._actions = actions;
        this.attachedRoutes = [];
        this.detachCount = 0;
    }

    getActions() {
        return this._actions;
    }

    createMainUIHtml() {
        return `<div class="${this.id}" data-test-view="${this.id}"><p>${this.title}</p></div>`;
    }

    attach(el, route, state) {
        super.attach(el);
        this.attachedRoutes.push({ route, state });
    }

    detach() {
        this.detachCount += 1;
        super.detach();
    }
}

function fakeBrowser(initialPath = '/') {
    const url = new URL(initialPath, 'https://app.example.test');
    const location = {
        origin: url.origin,
        href: url.href,
        pathname: url.pathname,
        search: url.search,
        hash: url.hash,
        assign: vi.fn(),
        replace: vi.fn()
    };
    const updateLocation = (next) => {
        const parsed = new URL(next, location.origin);
        location.href = parsed.href;
        location.pathname = parsed.pathname;
        location.search = parsed.search;
        location.hash = parsed.hash;
    };
    const history = {
        state: null,
        pushState: vi.fn((state, _title, next) => {
            history.state = state;
            if (typeof next === 'string') {
                updateLocation(next);
            }
        }),
        replaceState: vi.fn((state, _title, next) => {
            history.state = state;
            if (typeof next === 'string') {
                updateLocation(next);
            }
        })
    };
    const win = new EventTarget();
    win.location = location;
    win.history = history;
    return { win, location, history, updateLocation };
}

beforeEach(() => {
    setSpriteUrl('icons.svg');
    document.body.innerHTML = '';
    document.title = 'Initial Title';
});

describe('view registration, route matching order, and fallback', () => {
    it('matches views in registration order, resets sticky regexes, and falls back when unmatched', () => {
        const outlet = document.createElement('main');
        const { win, location, history } = fakeBrowser('/');
        const router = createViewRouter({ outlet, window: win, location, history });
        const added = vi.fn();
        router.addEventListener(CONTENT_VIEW_ADDED_EVENT, added);

        const specific = new TestView('users-new', {}, 'New User', /^\/users\/new(?:[/?#].*)?$/ig);
        const general = new TestView('users', {}, 'Users', /^\/users(?:[/?#].*)?$/i);
        const fallback = new TestView('not-found', {}, 'Not Found', /^\/404$/i);

        router.addView(specific);
        router.addView(general);
        router.setFallbackView(fallback);

        expect(specific['activation-count']).toBe(0);
        expect(fallback['activation-count']).toBe(0);
        expect(added).toHaveBeenCalledTimes(3);
        expect(added.mock.calls[0][0].detail).toEqual({ view: specific, fallback: false });
        expect(added.mock.calls[2][0].detail).toEqual({ view: fallback, fallback: true });

        // First registered match wins even across repeated calls with a global regex.
        expect(router.findViewForRoute('/users/new')).toBe(specific);
        expect(router.findViewForRoute('/users/new')).toBe(specific);
        expect(router.findViewForRoute('/users/42')).toBe(general);
        expect(router.findViewForRoute('/missing', fallback)).toBe(fallback);
        expect(router.findViewForRoute('/missing')).toBeNull();
        expect(router.findViewById('users')).toBe(general);
        expect(router.findViewById('unknown', fallback)).toBe(fallback);

        expect(router.activateView('/does-not-exist')).toBe(true);
        expect(router.getActiveView()).toBe(fallback);
        expect(fallback['activation-count']).toBe(1);
        expect(outlet.querySelector('#not-found')).not.toBeNull();

        router.destroy();
    });

    it('returns false when no route matches and no fallback view is registered', () => {
        const outlet = document.createElement('main');
        const { win, location, history } = fakeBrowser('/');
        const router = createViewRouter({
            outlet,
            window: win,
            location,
            history,
            views: [new TestView('home', {}, 'Home', /^\/$/)]
        });

        expect(router.activateView('/unknown')).toBe(false);
        expect(router.getActiveView()).toBeNull();
        expect(history.pushState).not.toHaveBeenCalled();

        router.destroy();
    });
});

describe('sign-in, signed-out, and custom guards', () => {
    it('redirects signed-out users from onlyWhenSignedIn views to sign-in with return-url', () => {
        let signedIn = false;
        const outlet = document.createElement('main');
        const { win, location, history } = fakeBrowser('/');
        const router = createViewRouter({
            outlet,
            window: win,
            location,
            history,
            isSignedIn: () => signedIn
        });

        const home = new TestView('home', {}, 'Home', /^\/$/);
        const signIn = new TestView('sign-in', {}, 'Sign In', /^\/sign-in(?:[/?#].*)?$/i, { neverWhenSignedIn: true });
        const account = new TestView('account', {}, 'Account', /^\/account(?:[/?#].*)?$/i, { onlyWhenSignedIn: true });
        router.addView(home);
        router.addView(signIn);
        router.addView(account);

        expect(router.activateView('/account?tab=security', { from: 'nav' }, 'click')).toBe(true);
        expect(router.getActiveView()).toBe(signIn);
        expect(router.getCurrentRoute()).toBe('/sign-in?return-url=%2Faccount%3Ftab%3Dsecurity');
        expect(signIn.attachedRoutes[0]).toEqual({
            route: '/sign-in?return-url=%2Faccount%3Ftab%3Dsecurity',
            state: { from: 'nav' }
        });

        // Once signed in, account activates and sign-in redirects away to signedInRoute.
        signedIn = true;
        expect(router.activateView('/account')).toBe(true);
        expect(router.getActiveView()).toBe(account);

        expect(router.activateView('/sign-in')).toBe(true);
        expect(router.getActiveView()).toBe(home);
        expect(router.getCurrentRoute()).toBe('/');

        router.destroy();
    });

    it('supports signedInViewId, custom signInRoute functions, custom guards, and prevents redirect cycles', () => {
        let signedIn = true;
        let admin = false;
        const outlet = document.createElement('main');
        const { win, location, history } = fakeBrowser('/');
        const router = createViewRouter({
            outlet,
            window: win,
            location,
            history,
            isSignedIn: () => signedIn,
            signedInViewId: 'dashboard',
            signInRoute: () => '/home',
            guard: (view) => {
                if (view.onlyWhenAdmin && !admin) {
                    return '/dashboard';
                }
                return true;
            }
        });

        const home = new TestView('home', {}, 'Home', /^\/home$/);
        const dashboard = new TestView('dashboard', {}, 'Dashboard', /^\/dashboard$/);
        const signIn = new TestView('sign-in', {}, 'Sign In', /^\/sign-in$/, { neverWhenSignedIn: true });
        const adminOnly = new TestView('admin', {}, 'Admin', /^\/admin-view$/, { onlyWhenAdmin: true });
        router.addView(home);
        router.addView(dashboard);
        router.addView(signIn);
        router.addView(adminOnly);

        expect(router.activateView('/sign-in')).toBe(true);
        expect(router.getActiveView()).toBe(dashboard);

        // Redirecting to the already-active view is a no-op and returns false.
        expect(router.activateView('/admin-view')).toBe(false);
        expect(router.getActiveView()).toBe(dashboard);

        // From another view, the custom guard redirects to dashboard and returns true.
        expect(router.activateView('/home')).toBe(true);
        expect(router.activateView('/admin-view')).toBe(true);
        expect(router.getActiveView()).toBe(dashboard);

        admin = true;
        expect(router.activateView('/admin-view')).toBe(true);
        expect(router.getActiveView()).toBe(adminOnly);

        // Custom signInRoute callback and activateViewById apply the same guards.
        signedIn = false;
        const protectedView = new TestView('secret', {}, 'Secret', /^\/secret$/, { onlyWhenSignedIn: true });
        router.addView(protectedView);
        expect(router.activateViewById('secret')).toBe(true);
        expect(router.getActiveView()).toBe(home);
        expect(router.getCurrentRoute()).toBe('/home');

        // Cycle protection: if signInRoute targets a view that also requires sign-in, stop cleanly.
        signedIn = false;
        const cyclic = createViewRouter({
            outlet: document.createElement('main'),
            window: win,
            location,
            history,
            isSignedIn: () => false,
            signInRoute: '/locked'
        });
        cyclic.addView(new TestView('locked', {}, 'Locked', /^\/locked(?:[/?#].*)?$/, { onlyWhenSignedIn: true }));
        expect(cyclic.activateView('/locked')).toBe(false);
        expect(cyclic.getActiveView()).toBeNull();

        cyclic.destroy();
        router.destroy();
    });
});

describe('history push, replace, and popstate', () => {
    it('replaces for the current address or explicit replace, pushes for new routes, and skips history writes on popstate', () => {
        document.body.innerHTML = '<div id="shell"><main data-view-router-outlet></main></div>';
        const shell = document.getElementById('shell');
        const { win, location, history, updateLocation } = fakeBrowser('/home');
        const router = attachViewRouter(shell, { window: win, location, history });
        const changed = vi.fn();
        router.addEventListener(CONTENT_VIEW_CHANGED_EVENT, changed);

        const home = new TestView('home', {}, 'Home', /^\/home$/);
        const notes = new TestView('notes', {}, 'Notes', /^\/notes(?:\?.*)?$/);
        const help = new TestView('help', {}, 'Help', /^\/help$/);
        router.addView(home);
        router.addView(notes);
        router.addView(help);

        // Initial activation on current location uses replaceState.
        expect(router.start()).toBe(true);
        expect(history.replaceState).toHaveBeenCalledTimes(1);
        expect(history.replaceState).toHaveBeenCalledWith({}, 'Home', '/home');
        expect(history.pushState).not.toHaveBeenCalled();

        // Activating the already-active view is a no-op.
        expect(router.activateView('/home')).toBe(false);
        expect(home.detachCount).toBe(0);
        expect(changed).toHaveBeenCalledTimes(1);

        // Navigating to a different route pushes history and detaches the old view.
        expect(router.activateView('/notes?filter=open', { page: 2 }, 'click')).toBe(true);
        expect(home.detachCount).toBe(1);
        expect(router.getActiveView()).toBe(notes);
        expect(history.pushState).toHaveBeenCalledTimes(1);
        expect(history.pushState).toHaveBeenCalledWith({ page: 2 }, 'Notes', '/notes?filter=open');
        expect(changed).toHaveBeenCalledTimes(2);
        expect(changed.mock.calls[1][0].detail).toMatchObject({
            oldView: home,
            newView: notes,
            route: '/notes?filter=open',
            reason: 'click'
        });

        // Explicit replace option uses replaceState even for a different route.
        expect(router.activateView('/help', {}, 'redirect', { replace: true })).toBe(true);
        expect(history.replaceState).toHaveBeenCalledTimes(2);
        expect(history.replaceState).toHaveBeenLastCalledWith({}, 'Help', '/help');
        expect(history.pushState).toHaveBeenCalledTimes(1);

        // popstate restores the route (including search) without pushing or replacing history.
        updateLocation('/notes?filter=open');
        win.dispatchEvent(new PopStateEvent('popstate', { state: { page: 2 } }));
        expect(router.getActiveView()).toBe(notes);
        expect(router.getCurrentRoute()).toBe('/notes?filter=open');
        expect(notes.attachedRoutes.at(-1)).toEqual({ route: '/notes?filter=open', state: { page: 2 } });
        expect(history.pushState).toHaveBeenCalledTimes(1);
        expect(history.replaceState).toHaveBeenCalledTimes(2);

        router.destroy();
    });
});

describe('shell title, route marks, outside routes, and action-registry integration', () => {
    it('updates shell title, document title, and aria-current route marks across path and query links', () => {
        document.body.innerHTML = `
            <div id="shell">
                <header>
                    <h1 data-view-router-title>App</h1>
                    <nav data-view-router-nav aria-label="Views">
                        <a href="/demo/shell-portal.html" data-view-router-link>Sample</a>
                        <a href="/demo/shell-portal.html?view=notes" data-view-router-link>Notes</a>
                        <a href="/help" data-view-router-link>Help</a>
                    </nav>
                </header>
                <main data-view-router-outlet></main>
            </div>
        `;
        const shell = document.getElementById('shell');
        const { win, location, history } = fakeBrowser('/demo/shell-portal.html');
        const accountMenu = { setRoute: vi.fn() };
        const titleEvents = vi.fn();
        const router = attachViewRouter(shell, {
            window: win,
            location,
            history,
            appTitle: 'Portal',
            accountMenu
        });
        router.addEventListener(CONTENT_VIEW_TITLE_CHANGED_EVENT, titleEvents);

        const sample = new TestView('sample', {}, 'Sample', /^\/demo\/shell-portal\.html$/i);
        const notes = new TestView('notes', {}, 'Notes', /^\/demo\/shell-portal\.html\?view=notes$/i);
        const help = new TestView('help', {}, 'Help', /^\/help(?:[/?#].*)?$/i);
        router.addView(sample);
        router.addView(notes);
        router.addView(help);

        router.start();
        const [sampleLink, notesLink, helpLink] = shell.querySelectorAll('nav a');
        expect(shell.querySelector('[data-view-router-title]').textContent).toBe('Sample');
        expect(document.title).toBe('Sample · Portal');
        expect(sampleLink.getAttribute('aria-current')).toBe('page');
        expect(notesLink.hasAttribute('aria-current')).toBe(false);
        expect(accountMenu.setRoute).toHaveBeenLastCalledWith('/demo/shell-portal.html');

        // Clicking a data-view-router-link switches views and moves aria-current to the query link.
        const click = new MouseEvent('click', { bubbles: true, cancelable: true });
        notesLink.dispatchEvent(click);
        expect(click.defaultPrevented).toBe(true);
        expect(router.getActiveView()).toBe(notes);
        expect(shell.querySelector('[data-view-router-title]').textContent).toBe('Notes');
        expect(document.title).toBe('Notes · Portal');
        expect(sampleLink.hasAttribute('aria-current')).toBe(false);
        expect(notesLink.getAttribute('aria-current')).toBe('page');

        // Path-based link still matches when the active route carries extra query params.
        router.activateView('/help?q=passkey');
        expect(helpLink.getAttribute('aria-current')).toBe('page');
        expect(sampleLink.hasAttribute('aria-current')).toBe(false);
        expect(notesLink.hasAttribute('aria-current')).toBe(false);
        expect(accountMenu.setRoute).toHaveBeenLastCalledWith('/help');

        // Explicit setTitle updates both shell heading and document title.
        router.setTitle('Help: Passkeys');
        expect(shell.querySelector('[data-view-router-title]').textContent).toBe('Help: Passkeys');
        expect(document.title).toBe('Help: Passkeys · Portal');
        expect(titleEvents).toHaveBeenCalledTimes(4);

        router.destroy();
    });

    it('opens outside prefixes, resolved redirects, and cross-origin URLs with a full load and rejects unsafe schemes', () => {
        const outlet = document.createElement('main');
        const { win, location, history } = fakeBrowser('/');
        const router = createViewRouter({
            outlet,
            window: win,
            location,
            history,
            outsidePrefixes: ['/admin/'],
            resolveOutsideRoute: (route) => {
                if (route === '/users/42') {
                    return { url: '/admin/#/users/42', replace: true };
                }
                return null;
            }
        });
        router.addView(new TestView('home', {}, 'Home', /^\/$/));

        expect(router.activateView('/admin/#/overview')).toBe(true);
        expect(location.assign).toHaveBeenCalledWith('/admin/#/overview');
        expect(location.replace).not.toHaveBeenCalled();

        expect(router.activateView('/users/42')).toBe(true);
        expect(location.replace).toHaveBeenCalledWith('/admin/#/users/42');

        expect(router.activateView('https://other.example.test/docs')).toBe(true);
        expect(location.assign).toHaveBeenCalledWith('https://other.example.test/docs');

        expect(router.activateView('javascript:alert(1)')).toBe(false);
        expect(router.activateView('data:text/html,hi')).toBe(false);
        expect(router.getActiveView()).toBeNull();

        router.destroy();
    });

    it('integrates with RoutedView, action-registry navigation actions, screen-action-bar, and contract.json', () => {
        document.body.innerHTML = `
            <div id="shell" class="app">
                <nav data-view-router-nav aria-label="Views">
                    <a href="/home" data-action="navigate-home">Home</a>
                    <a href="/notes" data-action="navigate-notes">Notes</a>
                </nav>
                <main class="app__main" data-view-router-outlet></main>
                <div class="app__overlays" data-screen-action-bar-before></div>
            </div>
        `;
        const shell = document.getElementById('shell');
        const { win, location, history } = fakeBrowser('/home');
        let router = null;
        const registry = attachActionRegistry(shell, {
            getScope: () => router?.getActiveView()?.id ?? null,
            onNavigate: (href) => router?.activateView(href, {}, 'navigate action'),
            actions: [
                { id: 'navigate-home', title: 'Home', href: '/home' },
                { id: 'navigate-notes', title: 'Notes', href: '/notes' }
            ]
        });
        const app = { ...registry };
        const bar = attachScreenActionBar(shell, { app });
        app.setScreenActions = bar.setScreenActions;

        router = attachViewRouter(shell, {
            window: win,
            location,
            history,
            actions: registry,
            updateDocumentTitle: false
        });

        const homeRun = vi.fn();
        const notesRun = vi.fn();
        const home = new TestView('home', app, 'Home', /^\/home$/, {
            actions: [{ id: 'home.export', title: 'Export', run: homeRun }]
        });
        const notes = new TestView('notes', app, 'Notes', /^\/notes$/, {
            actions: [{ id: 'notes.clear', title: 'Clear', run: notesRun }]
        });
        router.addView(home);
        router.addView(notes);
        router.start();

        expect(shell.querySelector('button[data-action="home.export"]')).not.toBeNull();
        expect(registry.getAction('notes.clear')).toBeUndefined();

        // Clicking a registered navigation action switches views and swaps screen actions once.
        shell.querySelector('a[data-action="navigate-notes"]').click();
        expect(router.getActiveView()).toBe(notes);
        expect(registry.getAction('navigate-notes')['run-count']).toBe(1);
        expect(registry.getAction('home.export')).toBeUndefined();
        expect(shell.querySelector('button[data-action="notes.clear"]')).not.toBeNull();

        // Disabling a navigation action prevents routing through the link.
        registry.disableAction('navigate-home', 'Locked');
        shell.querySelector('a[data-action="navigate-home"]').click();
        expect(router.getActiveView()).toBe(notes);

        const contract = JSON.parse(readFileSync(resolve('src/contract.json'), 'utf8'));
        expect(contract.components).toContain('view-router');

        router.destroy();
        bar.destroy();
        registry.destroy();
    });
});
