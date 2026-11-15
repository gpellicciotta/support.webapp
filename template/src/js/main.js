/* App entry point: wires the shared behaviors of the shell; add the app's screens and modules from here. */

import { createLiveRegion } from '../vendor/design/js/live-region.js';
import { attachMenu } from '../vendor/design/js/menu.js';
import { watchWorkerUpdates } from '../vendor/design/js/sw-update.js';
import { attachThemeSwitch } from '../vendor/design/js/theme-switch.js';
import { createToast } from '../vendor/design/js/toast.js';

/** Prefix of the app's stored preferences, which keeps them apart from other apps on the same origin. */
export const APP_NAME = '{{app-name}}';

/**
 * Wire the toasts, theme switch, navigation, side panel, and offline banner that the page contains.
 * @param {Document} doc the page
 * @returns {{toaster: {show: Function}}} the shared toaster, for app modules
 */
export function initApp(doc) {
    const view = doc.defaultView;
    const toaster = createToast({
        document: doc,
        region: doc.querySelector('.app__overlays > .toast-region'),
        liveRegion: createLiveRegion({ document: doc })
    });
    for (const button of doc.querySelectorAll('[data-toast]')) {
        button.addEventListener('click', () => toaster.show(button.dataset.toast));
    }
    const themeSwitch = doc.querySelector('[data-theme-switch]');
    if (themeSwitch) {
        attachThemeSwitch(themeSwitch, { appName: APP_NAME });
    }
    const menuButton = doc.querySelector('.app__menu-button');
    if (menuButton) {
        attachMenu(menuButton, doc.getElementById('app-menu'), {
            onSelect: item => doc.getElementById(item.dataset.target)?.scrollIntoView()
        });
    }
    // Both navigation bars mark the same current entry, since only one shows at any width.
    const navItems = [...doc.querySelectorAll('.app__nav-item')];
    for (const item of navItems) {
        item.addEventListener('click', () => {
            for (const other of navItems) {
                if (other.getAttribute('href') === item.getAttribute('href')) {
                    other.setAttribute('aria-current', 'page');
                }
                else {
                    other.removeAttribute('aria-current');
                }
            }
        });
    }
    const panel = doc.querySelector('.app__side-panel');
    let opener = null;
    for (const button of doc.querySelectorAll('[data-panel-open]')) {
        button.addEventListener('click', () => {
            opener = button;
            panel.hidden = false;
            panel.querySelector('[data-panel-close]').focus();
        });
    }
    panel?.querySelector('[data-panel-close]').addEventListener('click', () => {
        panel.hidden = true;
        opener?.focus();
    });
    const offline = doc.querySelector('[data-offline-banner]');
    if (offline) {
        const update = () => {
            offline.hidden = view.navigator.onLine;
        };
        view.addEventListener('online', update);
        view.addEventListener('offline', update);
        update();
    }
    return { toaster };
}

if (typeof document !== 'undefined') {
    const { toaster } = initApp(document);
    watchWorkerUpdates({ script: 'service-worker.js', toaster }).catch(error => {
        toaster.show(`Offline use is unavailable: ${error.message}`);
    });
}
