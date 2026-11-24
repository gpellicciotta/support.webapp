/* Admin console shell demo interactions: look/theme switchers, nav toggle, row selection, detail panel focus, and inline confirmation. */

import { attachAccountMenu } from '../js/account-menu.js';
import { attachAppNav } from '../js/app-nav.js';
import { attachDataLoader } from '../js/data-loader.js';
import { createDomBuilders } from '../js/dom-builders.js';
import { createLiveRegion } from '../js/live-region.js';
import { attachTableState } from '../js/table-state.js';
import { createToast } from '../js/toast.js';
import { initGallery } from './gallery.js';

export function initAdminConsoleDemo(doc, view) {
    initGallery(doc, view);
    const navToggle = doc.querySelector('[data-app-nav-toggle]');
    if (navToggle) {
        attachAppNav(navToggle, doc.getElementById(navToggle.getAttribute('aria-controls')));
    }
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
    const dom = createDomBuilders(doc);
    const confirmSlot = doc.querySelector('[data-admin-confirm]');
    const panel = doc.querySelector('.app__side-panel');
    const title = doc.getElementById('detail-panel-demo-title');
    const nameInput = doc.getElementById('admin-detail-name');
    const emailInput = doc.getElementById('admin-detail-email');
    const factsSection = doc.getElementById('admin-detail-facts')?.closest('section');
    const accountsSection = doc.querySelector('[data-table-state]');
    const accounts = [...doc.querySelectorAll('.table tbody tr')].map((row) => {
        const [idCell, emailCell, rolesCell, statusCell] = row.querySelectorAll('td');
        const btn = row.querySelector('[data-demo-panel-open]');
        const chip = statusCell.querySelector('.chip--status');
        const severity = chip?.classList.contains('chip--danger') ? 'error' : (chip?.classList.contains('chip--warning') ? 'warning' : 'ok');
        return {
            id: idCell.textContent.trim(),
            name: btn.dataset.demoPanelOpen,
            email: emailCell.textContent.trim(),
            roles: [...rolesCell.querySelectorAll('.chip')].map((el) => el.textContent.trim()),
            severity,
            status: statusCell.textContent.trim(),
            statusKey: severity === 'ok' ? 'active' : severity,
            selected: row.getAttribute('aria-selected') === 'true',
            facts: JSON.parse(btn.dataset.demoFacts || '{}')
        };
    });
    const tableHost = dom.h('div', { 'data-admin-table-host': true });
    doc.querySelector('.table__frame')?.replaceWith(tableHost);
    let selected = accounts.find((item) => item.selected) ?? accounts[0];
    let panelOpen = Boolean(selected);
    let opener = null;

    const statusSelect = dom.select([['', 'All statuses'], ['active', 'Active'], ['warning', 'Marked for deletion'], ['error', 'Locked']], '', {
        id: 'admin-status',
        'data-table-state-filter': 'status'
    });
    doc.getElementById('admin-status')?.replaceWith(statusSelect);
    const sizeSelect = dom.select(['2', '4', '20'], '4', {
        id: 'admin-size',
        'data-table-state-size': ''
    });
    doc.getElementById('admin-size')?.replaceWith(sizeSelect);

    const tableState = attachTableState(accountsSection ?? doc, {
        window: view,
        document: doc,
        dom,
        sizes: [2, 4, 20],
        defaultSize: 4,
        filters: {
            q: { default: '', trim: true },
            status: { default: '', values: ['active', 'warning', 'error'] }
        },
        onChange: () => renderAccounts()
    });

    if (confirmSlot) {
        const trigger = dom.button('Delete permanently', null, { kind: 'primary', danger: true });
        dom.setChildren(confirmSlot,
            dom.h('p', null, 'Permanent deletion removes all lists and active sessions.'),
            dom.button('Mark for deletion', null, { kind: 'secondary', danger: true }),
            dom.inlineConfirm(trigger, {
                label: 'Confirm permanent deletion',
                text: () => `Delete ${selected.name} and all sample data now?`,
                confirmLabel: 'Delete permanently',
                onConfirm: () => toaster.show('Sample permanent deletion confirmed.')
            })
        );
    }

    const roleChips = (account) => account.roles.flatMap((role, i) => [i ? ' ' : null, dom.h('span', { class: 'chip' }, role)]);

    function fillFacts(account) {
        const rows = [
            { term: 'ID', value: account.id, key: 'id' },
            { term: 'Roles', value: roleChips(account), key: 'roles' },
            { term: 'Status', value: dom.severityChip(account.severity, account.status), key: 'status' },
            { term: 'Created', value: account.facts.created, key: 'created' },
            { term: 'Last active', value: account.facts['last-active'], key: 'last-active' },
            { term: 'Auth user ID', value: account.facts['auth-user-id'], key: 'auth-user-id' },
            { term: 'Lists', value: account.facts.lists, key: 'lists' },
            { term: 'Sessions', value: account.facts.sessions, key: 'sessions' }
        ];
        factsSection?.querySelector('dl')?.replaceWith(dom.facts(rows, true));
    }

    function openAccount(account, button) {
        opener = button;
        selected = account;
        panelOpen = true;
        // Dismiss an open confirmation first, so it never survives a change of account.
        const question = confirmSlot?.querySelector('[data-inline-confirm]');
        if (question && !question.hidden) {
            question.dispatchEvent(new view.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
        }
        title.textContent = account.name;
        nameInput.value = account.name;
        emailInput.value = account.email;
        fillFacts(account);
        for (const row of tableHost.querySelectorAll('tbody tr')) {
            if (row.dataset.accountId === account.id) {
                row.setAttribute('aria-selected', 'true');
            }
            else {
                row.removeAttribute('aria-selected');
            }
        }
        panel.hidden = false;
        title.focus();
    }

    function renderAccounts() {
        const { filters, size } = tableState.getState();
        const query = filters.q;
        const statusFilter = filters.status;
        const needle = query.toLowerCase();
        const visible = accounts.filter((a) => (!needle || a.name.toLowerCase().includes(needle) || a.email.toLowerCase().includes(needle))
            && (!statusFilter || a.statusKey === statusFilter));
        const cut = tableState.slice(visible);
        tableState.updatePager({
            cut,
            shown: visible.length,
            loaded: accounts.length,
            noun: 'account'
        });
        if (visible.length === 0) {
            const clear = dom.button('Clear filter', () => tableState.resetFilters());
            dom.setChildren(tableHost, dom.emptyState(`No account matches ${query ? `“${query}”` : 'this filter'}.`, clear));
            return;
        }
        const rows = cut.rows.map((account) => {
            const inspect = dom.button(['Inspect ', dom.h('span', { class: 'visually-hidden' }, account.name)],
                (event) => openAccount(account, event.currentTarget),
                { small: true, 'data-demo-panel-open': account.name });
            const isSelected = panelOpen && selected?.id === account.id;
            if (isSelected && !opener) {
                opener = inspect;
            }
            return dom.h('tr', { 'data-account-id': account.id, 'aria-selected': isSelected ? 'true' : null },
                dom.h('td', { class: 'table__numeric' }, account.id),
                dom.h('th', { scope: 'row' }, account.name),
                dom.h('td', null, account.email),
                dom.h('td', null, roleChips(account)),
                dom.h('td', null, dom.severityChip(account.severity, account.status)),
                dom.h('td', null, inspect));
        });
        dom.setChildren(tableHost, dom.dataTable(`Sample accounts, ${size} per page`,
            [{ label: 'ID', numeric: true }, 'Name', 'Email', 'Roles', 'Status', 'Details'],
            rows, { captionId: 'admin-accounts-caption' }));
    }

    if (selected) {
        fillFacts(selected);
    }
    renderAccounts();

    const main = doc.querySelector('.app__main');
    if (main) {
        let checks = 0;
        let failNext = false;
        const statusHost = dom.h('div', { 'data-admin-status-host': '' });
        const statusLoader = attachDataLoader(statusHost, {
            document: doc,
            dom,
            what: 'Server status',
            fetcher: async () => {
                if (failNext) {
                    failNext = false;
                    throw new Error('Service temporarily unavailable');
                }
                checks += 1;
                return { state: 'Healthy', checks, sessions: 12 };
            },
            render: (status) => dom.facts([
                { term: 'Status', value: dom.severityChip('ok', status.state), key: 'server-status' },
                { term: 'Checks', value: String(status.checks), key: 'checks' },
                { term: 'Active sessions', value: String(status.sessions), key: 'sessions' }
            ], true),
            onSignIn: () => toaster.show('Sign-in flow requested.')
        });
        main.append(dom.h('section', { class: 'gallery-section', 'aria-labelledby': 'admin-status-heading', 'data-admin-loader-demo': '' },
            dom.h('h2', { id: 'admin-status-heading' }, 'Server status'),
            dom.h('div', { class: 'toolbar', role: 'group', 'aria-label': 'Server status actions' },
                dom.button('Load (fail once)', () => {
                    failNext = true;
                    statusLoader.load();
                }, { 'data-admin-load': 'fail-once' }),
                dom.button('Simulate 401', () => statusLoader.load({
                    fetcher: () => Promise.reject(Object.assign(new Error('Session expired'), { status: 401 }))
                }), { 'data-admin-load': 'unauthorized' }),
                dom.button('Quiet refresh', () => statusLoader.load({ quiet: true }), { 'data-admin-load': 'quiet' })
            ),
            statusHost
        ));
        statusLoader.load();
    }

    panel?.querySelector('[data-demo-panel-close]')?.addEventListener('click', () => {
        panelOpen = false;
        panel.hidden = true;
        for (const row of tableHost.querySelectorAll('tbody tr[aria-selected="true"]')) {
            row.removeAttribute('aria-selected');
        }
        opener?.focus();
    });
}

if (typeof document !== 'undefined') {
    initAdminConsoleDemo(document, window);
}
