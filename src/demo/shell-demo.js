/* Look and theme switchers, the nav toggle, pull-to-refresh, auto-refresh, the sample view, and the sample interactions of the shell demo pages. */

import { initGallery } from './gallery.js';
import { attachAppNav } from '../js/app-nav.js';
import { attachAutoRefresh } from '../js/auto-refresh.js';
import { attachMenu } from '../js/menu.js';
import { createLiveRegion } from '../js/live-region.js';
import { attachPullRefresh } from '../js/pull-refresh.js';
import { createToast } from '../js/toast.js';
import { RoutedView } from '../js/view.js';

/**
 * A sample view whose first load fails and whose later loads succeed, to show the error page and Try again.
 */
class SampleView extends RoutedView {
    constructor(app, options) {
        super('sample-view', app, 'Sample', undefined, options);
        this.loads = 0;
    }

    createMainUIHtml() {
        return '<div class="sample-view"><p data-sample-view-text>Not loaded yet.</p></div>';
    }

    async refreshData() {
        this.loads += 1;
        await new Promise((resolve) => globalThis.setTimeout(resolve, 100));
        if (this.loads === 1) {
            throw new Error('the sample server is not answering');
        }
        return `Sample data loaded on attempt ${this.loads}.`;
    }

    updateMainUI(info) {
        this.mainUIEl.querySelector('[data-sample-view-text]').textContent = info;
    }
}

/**
 * Attach the sample view to its host and load it.
 * @param {HTMLElement} host the element that receives the view
 */
function mountSampleView(host) {
    const view = new SampleView({}, { document: host.ownerDocument });
    view.attach(host);
    view.refreshComponentUI();
}

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
    const sampleViewHost = doc.querySelector('[data-demo-view]');
    if (sampleViewHost) {
        mountSampleView(sampleViewHost);
    }
    // The Refresh pattern: a sample check on each visible poll and return, without a Refresh button.
    const checked = doc.querySelector('[data-demo-checked]');
    if (checked) {
        const check = () => {
            checked.textContent = `Checked for new events at ${new Date().toLocaleTimeString()}.`;
        };
        attachAutoRefresh({
            document: doc,
            onPoll: check,
            onReturn: ({ long }) => {
                check();
                if (long) {
                    toaster.show('Sample page refreshed after a long absence.');
                }
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
