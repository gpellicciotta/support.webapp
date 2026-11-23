/* Look and theme switchers, the nav toggle, pull-to-refresh, and the sample interactions of the shell demo pages. */

import { initGallery } from './gallery.js';
import { attachAppNav } from '../js/app-nav.js';
import { attachMenu } from '../js/menu.js';
import { createLiveRegion } from '../js/live-region.js';
import { attachPullRefresh } from '../js/pull-refresh.js';
import { createToast } from '../js/toast.js';

/**
 * Wire the switchers, the nav toggle, the sample toast and menu, the side panel, and the screen toggle of one shell demo page.
 * @param {Document} doc demo document
 * @param {Window} view window that computes styles
 */
export function initShellDemo(doc, view) {
    initGallery(doc, view);
    const navToggle = doc.querySelector('[data-app-nav-toggle]');
    if (navToggle) {
        attachAppNav(navToggle, doc.getElementById(navToggle.getAttribute('aria-controls')));
    }
    const toaster = createToast({ document: doc, region: doc.querySelector('.app__overlays > .toast-region'), liveRegion: createLiveRegion({ document: doc }) });
    for (const button of doc.querySelectorAll('[data-demo-toast]')) {
        button.addEventListener('click', () => toaster.show(button.dataset.demoToast));
    }
    // Installed, a pull at the page top runs a sample refresh; browser tabs keep their own pull-down reload.
    if (doc.body.hasAttribute('data-demo-pull-refresh')) {
        attachPullRefresh(doc.body, {
            container: doc.querySelector('.app__overlays'),
            onRefresh: async () => {
                await new Promise((resolve) => view.setTimeout(resolve, 600));
                toaster.show('Sample page refreshed.');
            }
        });
    }
    const menu = doc.querySelector('[data-demo-menu]');
    if (menu) {
        attachMenu(doc.querySelector('[data-demo-menu-button]'), menu, {
            align: 'end',
            onSelect: (item) => toaster.show(`${item.textContent} is a sample menu item.`)
        });
    }
    const panel = doc.querySelector('.app__side-panel');
    let opener = null;
    for (const button of doc.querySelectorAll('[data-demo-panel-open]')) {
        button.addEventListener('click', () => {
            opener = button;
            panel.hidden = false;
            panel.querySelector('[data-demo-panel-close]').focus();
        });
    }
    panel?.querySelector('[data-demo-panel-close]').addEventListener('click', () => {
        panel.hidden = true;
        opener?.focus();
    });
    for (const button of doc.querySelectorAll('[data-demo-screen]')) {
        button.addEventListener('click', () => {
            for (const screen of doc.querySelectorAll('.app__main > [data-screen]')) {
                screen.hidden = screen.dataset.screen !== button.dataset.demoScreen;
            }
            for (const other of doc.querySelectorAll('[data-demo-screen]')) {
                other.setAttribute('aria-pressed', String(other === button));
            }
        });
    }
}

if (typeof document !== 'undefined') {
    initShellDemo(document, window);
}
