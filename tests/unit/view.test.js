// @vitest-environment happy-dom
// Covers the view lifecycle base (ADR-0004): attach and detach, overlays, long-running operations, and routed-view actions.
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { setSpriteUrl } from '../../src/js/icon.js';
import { RoutedView, View } from '../../src/js/view.js';

/**
 * A view whose main UI shows its data, with a controllable data source.
 */
class DataView extends View {
    constructor(id, app, options) {
        super(id, app, options);
        this.loads = [];
        this.registered = 0;
    }

    createMainUIHtml() {
        return `<div id="${this.id}-main"><p class="value"></p></div>`;
    }

    registerEventListeners() {
        this.registered += 1;
    }

    refreshData() {
        return new Promise((resolve, reject) => {
            this.loads.push({ resolve, reject });
        });
    }

    updateMainUI(info) {
        this.mainUIEl.querySelector('.value').textContent = info;
    }
}

let host;

beforeEach(() => {
    setSpriteUrl('icons.svg');
    document.body.innerHTML = '<div id="host"></div>';
    host = document.getElementById('host');
});

afterEach(() => {
    vi.useRealTimers();
});

/**
 * Let pending promise callbacks run.
 * @returns {Promise<void>} a settled promise
 */
function flush() {
    return new Promise((resolve) => {
        setTimeout(resolve, 0);
    });
}

describe('markup', () => {
    it('builds a root with data hooks, hidden overlays, and the main UI last', () => {
        const view = new DataView('data', {});
        view.attach(host);
        const root = host.querySelector('#data');
        expect(root.hasAttribute('data-view')).toBe(true);
        expect(root.dataset.viewState).toBe('ready');
        expect(root.querySelector('[data-view-error]').hidden).toBe(true);
        expect(root.querySelector('[data-view-wait]').hidden).toBe(true);
        expect(root.lastElementChild).toBe(view.mainUIEl);
        expect(view.mainUIEl.hasAttribute('data-view-main')).toBe(true);
        expect(view.mainUIEl.querySelector('.value')).not.toBeNull();
    });

    it('uses no style class as a hook and no JavaScript-set state class', () => {
        const view = new DataView('data', {});
        view.attach(host);
        view.showErrorOverlay({});
        expect(host.querySelector('.error-overlay, .wait-overlay, .main, .is-error')).toBeNull();
    });

    it('defaults the main UI to an empty element named after the view', () => {
        const view = new View('plain', {});
        view.attach(host);
        expect(view.mainUIEl.className).toBe('plain');
    });

    it('builds the error page from the empty-state component with a retry button', () => {
        const view = new DataView('data', {});
        view.attach(host);
        const error = host.querySelector('[data-view-error]');
        expect(error.querySelector('.empty-state[role="alert"]')).not.toBeNull();
        expect(error.querySelector('.empty-state__title')).not.toBeNull();
        expect(error.querySelector('button[data-view-retry]').textContent).toBe('Try again');
    });
});

describe('attach and detach', () => {
    it('attaches once, re-attaches the same element, and registers listeners each time', () => {
        const view = new DataView('data', {});
        view.attach(host);
        const first = view.componentUIEl;
        view.detach();
        view.attach(host);
        expect(view.componentUIEl).toBe(first);
        expect(view.registered).toBe(2);
        expect(host.children).toHaveLength(1);
    });

    it('removes the element and the tracked listeners on detach', () => {
        const view = new DataView('data', {});
        view.attach(host);
        const handler = vi.fn();
        view.registerEventListener(host, 'ping', handler);
        host.dispatchEvent(new Event('ping'));
        view.detach();
        host.dispatchEvent(new Event('ping'));
        expect(handler).toHaveBeenCalledTimes(1);
        expect(host.querySelector('#data')).toBeNull();
        expect(view.domParentEl).toBeNull();
    });

    it('logs through the log option and stays silent without one', () => {
        const log = { trace: vi.fn(), info: vi.fn(), warn: vi.fn(), error: vi.fn() };
        new DataView('data', {}, { log }).attach(host);
        expect(log.trace).toHaveBeenCalled();
        expect(() => new DataView('quiet', {}).attach(host)).not.toThrow();
    });
});

describe('overlays', () => {
    it('shows the wait overlay as a status while keeping the main UI', () => {
        const view = new DataView('data', {});
        view.attach(host);
        view.showWaitOverlay({ 'progress-message': 'Loading users' });
        const root = view.componentUIEl;
        expect(root.dataset.viewState).toBe('updating');
        expect(root.querySelector('[data-view-wait]').hidden).toBe(false);
        expect(root.querySelector('[data-view-wait] [role="status"]').textContent).toBe('Loading users');
        expect(view.mainUIEl.hidden).toBe(false);
        expect(root.getAttribute('aria-busy')).toBe('true');
    });

    it('shows the main UI with the data and hides the overlays', () => {
        const view = new DataView('data', {});
        view.attach(host);
        view.showErrorOverlay({});
        view.showMainUI('42');
        const root = view.componentUIEl;
        expect(root.dataset.viewState).toBe('ready');
        expect(root.querySelector('[data-view-error]').hidden).toBe(true);
        expect(root.querySelector('[data-view-wait]').hidden).toBe(true);
        expect(view.mainUIEl.hidden).toBe(false);
        expect(root.hasAttribute('aria-busy')).toBe(false);
        expect(view.mainUIEl.querySelector('.value').textContent).toBe('42');
    });

    it('replaces the main UI with the error page and shows the texts as plain text', () => {
        const view = new DataView('data', {});
        view.attach(host);
        view.showErrorOverlay({ 'error-title': 'Load <b>users</b>', 'error-description': '<i>Offline</i>' });
        const root = view.componentUIEl;
        expect(root.dataset.viewState).toBe('error');
        expect(view.mainUIEl.hidden).toBe(true);
        expect(root.querySelector('[data-view-error]').hidden).toBe(false);
        expect(root.querySelector('.empty-state__title').textContent).toBe('Load <b>users</b>');
        expect(root.querySelector('.empty-state__text').textContent).toBe('<i>Offline</i>');
        expect(root.querySelector('.empty-state__text i')).toBeNull();
    });

    it('falls back to a default title and description', () => {
        const view = new DataView('data', {});
        view.attach(host);
        view.showErrorOverlay();
        expect(view.componentUIEl.querySelector('.empty-state__title').textContent).toBe('Unknown Error');
        expect(view.componentUIEl.querySelector('.empty-state__text').textContent).toBe('No details available... Sorry.');
    });

    it('uses localized labels from the options', () => {
        const view = new DataView('data', {}, { labels: { retry: 'Opnieuw', waiting: 'Even geduld...', errorTitle: 'Fout', errorText: 'Geen details.' } });
        view.attach(host);
        expect(host.querySelector('[data-view-retry]').textContent).toBe('Opnieuw');
        view.showWaitOverlay();
        expect(host.querySelector('[data-view-wait] [role="status"]').textContent).toBe('Even geduld...');
        view.showErrorOverlay();
        expect(host.querySelector('.empty-state__title').textContent).toBe('Fout');
        expect(host.querySelector('.empty-state__text').textContent).toBe('Geen details.');
    });

    it('draws the error icon from the icon option', () => {
        const view = new DataView('data', {}, { icon: 'warning' });
        view.attach(host);
        expect(host.querySelector('[data-view-error] use').getAttribute('href')).toBe('icons.svg#icon-warning');
    });

    it('draws the alert glyph by default and no icon when the option is null', () => {
        new DataView('data', {}).attach(host);
        expect(host.querySelector('[data-view-error] use').getAttribute('href')).toBe('icons.svg#icon-alert');
        document.body.innerHTML = '<div id="host"></div>';
        host = document.getElementById('host');
        new DataView('none', {}, { icon: null }).attach(host);
        expect(host.querySelector('[data-view-error] svg')).toBeNull();
    });
});

describe('the way back from the error page', () => {
    class BackView extends DataView {
        constructor(id, app) {
            super(id, app);
            this.signedIn = false;
        }

        getBackLink() {
            return this.signedIn
                ? { href: '/dashboard', label: 'Back to dashboard', attributes: { 'data-action': 'navigate-to-dashboard' } }
                : { href: '/', label: 'Back to start', attributes: { 'data-action': 'navigate-to-home' } };
        }
    }

    it('hides the back link when the view offers none', () => {
        const view = new DataView('data', {});
        view.attach(host);
        view.showErrorOverlay({});
        expect(host.querySelector('[data-view-back]').hidden).toBe(true);
    });

    it('asks for the link on every error, so it follows the sign-in state', () => {
        const view = new BackView('data', {});
        view.attach(host);
        view.showErrorOverlay({});
        const back = host.querySelector('[data-view-back]');
        expect([back.hidden, back.getAttribute('href'), back.textContent, back.dataset.action]).toEqual([false, '/', 'Back to start', 'navigate-to-home']);
        view.signedIn = true;
        view.showErrorOverlay({});
        expect([back.getAttribute('href'), back.textContent, back.dataset.action]).toEqual(['/dashboard', 'Back to dashboard', 'navigate-to-dashboard']);
    });
});

describe('long-running operations', () => {
    /**
     * Build an operation with spies and a controllable result.
     * @returns {{op: object, resolve: Function, reject: Function}} the operation and its controls
     */
    function operation() {
        let resolve;
        let reject;
        const op = {
            title: 'Load users',
            description: 'Loading users',
            start: () => new Promise((res, rej) => {
                resolve = res;
                reject = rej;
            }),
            success: vi.fn(),
            error: vi.fn(),
            always: vi.fn()
        };
        return { op, resolve: (value) => resolve(value), reject: (error) => reject(error) };
    }

    it('shows the wait overlay only after the delay, 700 ms by default', async () => {
        vi.useFakeTimers();
        const view = new DataView('data', {});
        view.attach(host);
        const { op, resolve } = operation();
        view.startLongRunningOperation(op);
        await vi.advanceTimersByTimeAsync(699);
        expect(view.componentUIEl.dataset.viewState).toBe('ready');
        await vi.advanceTimersByTimeAsync(1);
        expect(view.componentUIEl.dataset.viewState).toBe('updating');
        expect(host.querySelector('[data-view-wait] [role="status"]').textContent).toBe('Loading users');
        resolve('done');
        await vi.advanceTimersByTimeAsync(0);
        expect(op.success).toHaveBeenCalledWith('done');
        expect(op.always).toHaveBeenCalledTimes(1);
    });

    it('takes the delay from the options', async () => {
        vi.useFakeTimers();
        const view = new DataView('data', {}, { waitDelay: 50 });
        view.attach(host);
        view.startLongRunningOperation(operation().op);
        await vi.advanceTimersByTimeAsync(50);
        expect(view.componentUIEl.dataset.viewState).toBe('updating');
    });

    it('never shows the wait overlay for a fast operation', async () => {
        vi.useFakeTimers();
        const view = new DataView('data', {});
        view.attach(host);
        const { op, resolve } = operation();
        view.startLongRunningOperation(op);
        resolve('fast');
        await vi.advanceTimersByTimeAsync(0);
        await vi.advanceTimersByTimeAsync(2000);
        expect(view.componentUIEl.dataset.viewState).toBe('ready');
        expect(op.success).toHaveBeenCalledWith('fast');
    });

    it('reports a failure with the title, a capitalized message, and the cause', async () => {
        const view = new DataView('data', {});
        view.attach(host);
        const { op, reject } = operation();
        const cause = new Error('network down');
        view.startLongRunningOperation(op);
        reject(cause);
        await flush();
        expect(op.error).toHaveBeenCalledWith({ 'error-title': 'Load users', 'error-description': 'Network down', 'error-cause': cause });
        expect(op.success).not.toHaveBeenCalled();
        expect(op.always).toHaveBeenCalledTimes(1);
    });

    it('lets an operation leave out success, error, and always', async () => {
        const view = new DataView('data', {});
        view.attach(host);
        let resolve;
        view.startLongRunningOperation({
            title: 'x',
            start: () => new Promise((res) => {
                resolve = res;
            })
        });
        resolve(1);
        await flush();
        expect(view.componentUIEl.dataset.viewState).toBe('ready');
    });

    it('starts and stops the app progress around a slow operation', async () => {
        vi.useFakeTimers();
        const app = { startProgress: vi.fn(), stopProgress: vi.fn() };
        const view = new DataView('data', app);
        view.attach(host);
        const { op, resolve } = operation();
        view.startLongRunningOperation(op);
        await vi.advanceTimersByTimeAsync(700);
        expect(app.startProgress).toHaveBeenCalledTimes(1);
        resolve('x');
        await vi.advanceTimersByTimeAsync(0);
        expect(app.stopProgress).toHaveBeenCalledTimes(1);
    });
});

describe('refresh', () => {
    it('loads the data and shows it', async () => {
        const view = new DataView('data', {});
        view.attach(host);
        view.refreshComponentUI();
        view.loads[0].resolve('fresh');
        await flush();
        expect(view.mainUIEl.querySelector('.value').textContent).toBe('fresh');
        expect(view.componentUIEl.dataset.viewState).toBe('ready');
    });

    it('shows the error page on failure, and Try again loads again', async () => {
        const view = new DataView('data', {});
        view.attach(host);
        view.refreshComponentUI();
        view.loads[0].reject(new Error('boom'));
        await flush();
        expect(view.componentUIEl.dataset.viewState).toBe('error');
        host.querySelector('[data-view-retry]').click();
        expect(view.loads).toHaveLength(2);
        view.loads[1].resolve('ok');
        await flush();
        expect(view.componentUIEl.dataset.viewState).toBe('ready');
        expect(view.mainUIEl.querySelector('.value').textContent).toBe('ok');
    });

    it('does nothing while detached', () => {
        const view = new DataView('data', {});
        view.attach(host);
        view.detach();
        view.refreshComponentUI();
        expect(view.loads).toHaveLength(0);
    });

    it('requires refreshData to be implemented', async () => {
        const view = new View('plain', {});
        await expect(view.refreshData()).rejects.toThrow('refreshData method is not implemented');
    });
});

describe('RoutedView', () => {
    /**
     * A routed view offering two actions and a separator.
     */
    class UsersView extends RoutedView {
        getActions() {
            return [{ id: 'users.add', 'context-bar': true }, null, { id: 'users.hidden', 'context-bar': false }, { id: 'users.export' }];
        }
    }

    /**
     * An app that records its calls.
     * @returns {object} the app
     */
    function recordingApp() {
        return { addAction: vi.fn(), removeAction: vi.fn(), setScreenActions: vi.fn() };
    }

    it('matches its own route by default, escaping the id', () => {
        const view = new RoutedView('users', {}, 'Users');
        expect(view.title).toBe('Users');
        expect(view.routeRegex.test('/users')).toBe(true);
        expect(view.routeRegex.test('/USERS/42')).toBe(true);
        expect(view.routeRegex.test('/usersx')).toBe(false);
        expect(new RoutedView('a.b', {}).routeRegex.test('/axb')).toBe(false);
    });

    it('keeps a given route regex', () => {
        const regex = /^\/(people|users)$/;
        expect(new RoutedView('users', {}, 'Users', regex).routeRegex).toBe(regex);
    });

    it('registers its actions on attach and puts the context-bar ones in the screen actions, without separators', () => {
        const app = recordingApp();
        const view = new UsersView('users', app, 'Users');
        view.attach(host);
        expect(app.addAction.mock.calls.map(([action]) => action.id)).toEqual(['users.add', 'users.hidden', 'users.export']);
        expect(app.setScreenActions).toHaveBeenCalledWith(['users.add', 'users.export']);
        expect(view.actions).toEqual(['users.add', 'users.hidden', 'users.export']);
        expect(view.attachCount).toBe(1);
    });

    it('unregisters its actions and clears the screen actions on detach', () => {
        const app = recordingApp();
        const view = new UsersView('users', app, 'Users');
        view.attach(host);
        view.detach();
        expect(app.removeAction.mock.calls.map(([id]) => id)).toEqual(['users.add', 'users.hidden', 'users.export']);
        expect(app.setScreenActions).toHaveBeenLastCalledWith([]);
        expect(view.actions).toEqual([]);
    });

    it('sets no screen actions for a view without actions, and counts attaches', () => {
        const app = recordingApp();
        const view = new RoutedView('plain', app, 'Plain');
        view.attach(host);
        view.detach();
        view.attach(host);
        expect(app.setScreenActions.mock.calls.filter(([ids]) => ids.length > 0)).toHaveLength(0);
        expect(view.attachCount).toBe(2);
    });

    it('works with an app that offers none of the action methods', () => {
        const view = new UsersView('users', {}, 'Users');
        expect(() => {
            view.attach(host);
            view.detach();
        }).not.toThrow();
    });
});
