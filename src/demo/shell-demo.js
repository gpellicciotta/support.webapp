/* Look and theme switchers, the nav toggle, pull-to-refresh, auto-refresh, the sample view, and the sample interactions of the shell demo pages. */

import { initGallery } from './gallery.js';
import { attachActionRegistry } from '../js/action-registry.js';
import { attachAppNav } from '../js/app-nav.js';
import { attachAutoRefresh } from '../js/auto-refresh.js';
import { attachInstallPrompt } from '../js/install-prompt.js';
import { attachMenu } from '../js/menu.js';
import { createLiveRegion } from '../js/live-region.js';
import { attachPullRefresh } from '../js/pull-refresh.js';
import { attachScreenActionBar } from '../js/screen-action-bar.js';
import { createToast } from '../js/toast.js';
import { RoutedView } from '../js/view.js';

/**
 * A sample view whose first load fails and whose later loads succeed, to show the error page, Try again, and screen actions.
 */
class SampleView extends RoutedView {
    constructor(app, options) {
        super('sample-view', app, 'Sample', undefined, options);
        this.loads = 0;
    }

    getActions() {
        const waiting = this.loads < 2;
        return [
            { id: 'sample-view.export', title: 'Export', description: 'Export the current view summary', run: () => this.app.showToast?.('Sample summary exported.') },
            { id: 'sample-view.publish', title: 'Publish', description: 'Publish the loaded sample data', disabled: waiting, 'disabled-reason': 'Load sample data before publishing', run: () => this.app.showToast?.('Sample data published.') },
            { id: 'sample-view.calendar', title: 'Calendar', description: 'Jump to the sample calendar', href: '#sample-calendar-title', disabled: waiting, 'disabled-reason': 'Load sample data to open calendar' }
        ];
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
        this.app.enableAction?.('sample-view.publish');
        this.app.enableAction?.('sample-view.calendar');
    }
}

/**
 * Attach the sample view to its host, connect the action registry and screen action bar, and wire the attach/detach toggle.
 * @param {HTMLElement} host the element that receives the view
 * @param {{show: (message: string) => void}} toaster toast controller for sample action feedback
 */
function mountSampleView(host, toaster) {
    const doc = host.ownerDocument;
    let activeView = null;
    const registry = attachActionRegistry(doc.body, {
        document: doc,
        getScope: () => activeView?.id ?? null,
        onNavigate: (href) => {
            if (href.startsWith('#')) {
                const target = doc.getElementById(href.slice(1));
                target?.scrollIntoView?.();
                if (doc.defaultView?.location) {
                    doc.defaultView.location.hash = href;
                }
            }
        }
    });
    const app = {
        ...registry,
        showToast: (message) => toaster.show(message)
    };
    const bar = attachScreenActionBar(doc.body, { app });
    app.setScreenActions = bar.setScreenActions;
    const view = new SampleView(app, { document: doc });
    let attached = true;
    activeView = view;
    view.attach(host);
    view.refreshComponentUI();
    const toggle = doc.querySelector('[data-demo-view-toggle]');
    toggle?.addEventListener('click', () => {
        if (attached) {
            view.detach();
            activeView = null;
            attached = false;
            toggle.textContent = 'Attach sample view';
        }
        else {
            activeView = view;
            view.attach(host);
            attached = true;
            toggle.textContent = 'Detach sample view';
        }
    });
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
    const installButton = doc.querySelector('[data-install-prompt-action]');
    if (installButton) {
        const installer = attachInstallPrompt({
            window: view,
            onChange({ installable, installed }) {
                installButton.hidden = !installable || installed;
            }
        });
        installButton.hidden = !installer.isInstallable() || installer.isInstalled();
        installButton.addEventListener('click', async () => {
            if (installButton.getAttribute('aria-disabled') === 'true') {
                return;
            }
            // Keep focus on the button while prompting instead of using `disabled`.
            installButton.setAttribute('aria-disabled', 'true');
            try {
                const choice = await installer.prompt();
                if (choice?.outcome === 'accepted') {
                    toaster.show('Install prompt accepted.');
                }
                else if (choice?.outcome === 'dismissed') {
                    toaster.show('Install prompt dismissed.');
                }
            }
            finally {
                installButton.removeAttribute('aria-disabled');
            }
        });
    }
    const sampleViewHost = doc.querySelector('[data-demo-view]');
    if (sampleViewHost) {
        mountSampleView(sampleViewHost, toaster);
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
