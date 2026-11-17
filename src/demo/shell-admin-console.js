/* Admin console shell demo interactions: look/theme switchers, row selection, detail panel focus, and inline confirmation. */

import { attachAccountMenu } from '../js/account-menu.js';
import { attachInlineConfirm } from '../js/inline-confirm.js';
import { createLiveRegion } from '../js/live-region.js';
import { createToast } from '../js/toast.js';
import { initGallery } from './gallery.js';

export function initAdminConsoleDemo(doc, view) {
    initGallery(doc, view);
    const liveRegion = createLiveRegion({ document: doc });
    const toaster = createToast({
        document: doc,
        region: doc.querySelector('.app__overlays > .toast-region'),
        liveRegion
    });
    for (const button of doc.querySelectorAll('[data-demo-toast]')) {
        button.addEventListener('click', () => toaster.show(button.dataset.demoToast));
    }
    const accountRoot = doc.querySelector('[data-account-menu]');
    if (accountRoot) {
        attachAccountMenu(accountRoot, {
            document: doc,
            account: { name: 'Alex North' },
            route: '#main',
            onSelect: (item, event) => {
                event.preventDefault();
                toaster.show(`${item.textContent.trim()} is a sample account action.`);
            }
        });
    }
    const confirmSlot = doc.querySelector('[data-admin-confirm]');
    if (confirmSlot) {
        attachInlineConfirm(confirmSlot, {
            document: doc,
            onConfirm: () => toaster.show('Sample permanent deletion confirmed.')
        });
    }
    const panel = doc.querySelector('.app__side-panel');
    const title = doc.getElementById('detail-panel-demo-title');
    const nameInput = doc.getElementById('admin-detail-name');
    const emailInput = doc.getElementById('admin-detail-email');
    let opener = doc.querySelector('tr[aria-selected="true"] [data-demo-panel-open]');

    function setFact(key, content) {
        const target = panel.querySelector(`[data-fact="${key}"]`);
        if (target) {
            target.replaceChildren(...content);
        }
    }

    // ID, roles, and status come from the selected table row; the other facts from the button's data.
    function fillFacts(row, button) {
        const cells = row.querySelectorAll('td');
        setFact('id', [doc.createTextNode(cells[0].textContent)]);
        setFact('roles', [...cells[2].childNodes].map((node) => node.cloneNode(true)));
        setFact('status', [...cells[3].childNodes].map((node) => node.cloneNode(true)));
        const facts = JSON.parse(button.dataset.demoFacts || '{}');
        for (const [key, value] of Object.entries(facts)) {
            setFact(key, [doc.createTextNode(value)]);
        }
    }

    for (const button of doc.querySelectorAll('[data-demo-panel-open]')) {
        button.addEventListener('click', () => {
            opener = button;
            const selectedRow = button.closest('tr');
            for (const row of doc.querySelectorAll('.table tbody tr')) {
                if (row === selectedRow) {
                    row.setAttribute('aria-selected', 'true');
                }
                else {
                    row.removeAttribute('aria-selected');
                }
            }
            const name = button.dataset.demoPanelOpen;
            if (name) {
                // Dismiss an open confirmation first, so it never survives a change of account.
                const question = confirmSlot?.querySelector('[data-inline-confirm]');
                if (question && !question.hidden) {
                    question.dispatchEvent(new view.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
                }
                title.textContent = name;
                nameInput.value = name;
                emailInput.value = button.dataset.demoPanelEmail || '';
                const confirmName = confirmSlot?.querySelector('[data-admin-confirm-name]');
                if (confirmName) {
                    confirmName.textContent = name;
                }
                fillFacts(selectedRow, button);
            }
            panel.hidden = false;
            title.focus();
        });
    }

    panel?.querySelector('[data-demo-panel-close]')?.addEventListener('click', () => {
        panel.hidden = true;
        for (const row of doc.querySelectorAll('.table tbody tr[aria-selected="true"]')) {
            row.removeAttribute('aria-selected');
        }
        opener?.focus();
    });
}

if (typeof document !== 'undefined') {
    initAdminConsoleDemo(document, window);
}
