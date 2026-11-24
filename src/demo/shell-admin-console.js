/* Admin console shell demo interactions: look/theme switchers, nav toggle, row selection, detail panel focus, and inline confirmation. */

import { attachAccountMenu } from '../js/account-menu.js';
import { attachAdminConsole } from '../js/admin-console.js';
import { createAdminOverviewScreen } from '../js/admin-overview.js';
import { attachDataLoader } from '../js/data-loader.js';
import { createDomBuilders } from '../js/dom-builders.js';
import { createLiveRegion } from '../js/live-region.js';
import { attachTableState } from '../js/table-state.js';
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
    const dom = createDomBuilders(doc);
    const confirmSlot = doc.querySelector('[data-admin-confirm]');
    const panel = doc.querySelector('[data-admin-console-panel]');
    const detailPanel = panel?.firstElementChild ?? null;
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

    let tableState = null;
    let accountsMounts = 0;
    const attachAccountsTable = () => attachTableState(accountsSection ?? doc, {
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

    function openAccount(account, button, focusTitle = true) {
        opener = button;
        selected = account;
        panelOpen = true;
        // Dismiss an open confirmation first, so it never survives a change of account.
        const question = confirmSlot?.querySelector('[data-inline-confirm]');
        if (question && !question.hidden) {
            question.dispatchEvent(new view.KeyboardEvent('keydown', { key: 'Escape', bubbles: true, cancelable: true }));
        }
        if (detailPanel && detailPanel.parentElement !== panel) {
            panel.replaceChildren(detailPanel);
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
        if (focusTitle) {
            title.focus();
        }
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

    let statusSection = null;
    let statusLoader = null;
    const main = doc.querySelector('.app__main');
    if (main) {
        let checks = 0;
        let failNext = false;
        const statusHost = dom.h('div', { 'data-admin-status-host': '' });
        statusLoader = attachDataLoader(statusHost, {
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
        statusSection = dom.h('section', { class: 'gallery-section', 'aria-labelledby': 'admin-status-heading', 'data-admin-loader-demo': '' },
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
        );
    }

    function closeAccountPanel() {
        panelOpen = false;
        panel.hidden = true;
        for (const row of tableHost.querySelectorAll('tbody tr[aria-selected="true"]')) {
            row.removeAttribute('aria-selected');
        }
        opener?.focus();
    }
    detailPanel?.querySelector('[data-demo-panel-close]')?.addEventListener('click', closeAccountPanel);

    let overviewMode = 'healthy';
    let overviewChecks = 0;
    const overviewScreen = createAdminOverviewScreen({
        adapter: {
            fetchStatus: async () => {
                const mode = overviewMode;
                overviewMode = 'healthy';
                if (mode === 'fail-once') {
                    throw new Error('Service temporarily unavailable');
                }
                if (mode === 'unauthorized') {
                    throw Object.assign(new Error('Session expired'), { status: 401 });
                }
                overviewChecks += 1;
                const connected = mode !== 'disconnected';
                return {
                    status: 'running',
                    version: '2.4.0',
                    'extra-info': {
                        uptime: `3d 4h ${11 + overviewChecks}m`,
                        'build-time': '2026-11-20T10:15:30Z',
                        environment: 'demo',
                        'repository-status': connected ? 'connected' : 'disconnected',
                        'repository-version': '14',
                        'logged-in-sessions': 12,
                        'feedback-address': 'admin@example.test',
                        'api-url': 'https://demo.example.test/api'
                    }
                };
            }
        }
    });

    const frame = attachAdminConsole(doc.body, {
        document: doc,
        window: view,
        dom,
        title: 'Admin Console',
        defaultScreen: 'accounts',
        backLink: { href: 'visual-style-gallery.html#shell', label: 'Back to gallery' },
        formatDocumentTitle: (screen, appTitle, { initial, hash }) => (initial && !hash ? 'Admin console shell demo · support.webapp' : `${screen.title} · ${appTitle}`),
        onSignIn: () => {
            frame.showShell();
            toaster.show('Signed in as Alex North.');
        },
        onSignOut: () => toaster.show('Signed out.'),
        screens: [
            {
                name: overviewScreen.name,
                title: overviewScreen.title,
                mount: (screenView, ctx, route) => {
                    const overviewHost = ctx.dom.h('div', { class: 'gallery-section' });
                    let overviewController = null;
                    const triggerOverviewMode = (mode) => {
                        overviewMode = mode;
                        overviewController?.refresh();
                    };
                    ctx.dom.setChildren(screenView,
                        overviewHost,
                        ctx.dom.h('section', { class: 'gallery-section', 'aria-labelledby': 'overview-states-heading' },
                            ctx.dom.h('h2', { id: 'overview-states-heading' }, 'Overview states'),
                            ctx.dom.h('p', null, 'Preview repository disconnection, fetch failures, and 401 sign-in prompts.'),
                            ctx.dom.h('div', { class: 'toolbar', role: 'group', 'aria-label': 'Overview state previews' },
                                ctx.dom.button('Simulate disconnected repository', () => triggerOverviewMode('disconnected'), { 'data-demo-overview': 'disconnected' }),
                                ctx.dom.button('Fail fetch once', () => triggerOverviewMode('fail-once'), { 'data-demo-overview': 'fail-once' }),
                                ctx.dom.button('Simulate 401', () => triggerOverviewMode('unauthorized'), { 'data-demo-overview': 'unauthorized' }))),
                        ctx.dom.h('section', { class: 'gallery-section', 'aria-labelledby': 'frame-states-heading' },
                            ctx.dom.h('h2', { id: 'frame-states-heading' }, 'Frame states'),
                            ctx.dom.h('p', null, 'Preview centered gate pages and the signed-out shell.'),
                            ctx.dom.h('div', { class: 'toolbar', role: 'group', 'aria-label': 'Frame state previews' },
                                ctx.dom.button('Show forbidden gate', () => frame.showForbidden({
                                    message: 'Administrator access is required to use Admin Console. Your account does not have the admin realm.',
                                    backLabel: 'Return to console',
                                    onBack: () => frame.showShell()
                                }), { 'data-demo-gate': 'forbidden' }),
                                ctx.dom.button('Show session check gate', () => frame.showGate(
                                    [ctx.dom.statusLine('Checking your session…')],
                                    [ctx.dom.button('Return to console', () => frame.showShell())],
                                    { label: 'Admin Console', state: 'checking' }
                                ), { 'data-demo-gate': 'checking' }),
                                ctx.dom.button('Show check failed gate', () => frame.showCheckFailed(
                                    'The session could not be checked: service unavailable.',
                                    { onRetry: () => frame.showShell() }
                                ), { 'data-demo-gate': 'error' }),
                                ctx.dom.button('Show signed-out shell', () => frame.showSignedOut('You are signed out.'), { 'data-demo-gate': 'signed-out' }))));
                    overviewController = overviewScreen.mount(overviewHost, ctx, route);
                    return { dispose: () => overviewController?.dispose() };
                }
            },
            {
                name: 'accounts',
                title: 'Accounts',
                mount: (screenView, ctx, route) => {
                    accountsMounts += 1;
                    screenView.dataset.demoAccountsMounts = String(accountsMounts);
                    ctx.dom.setChildren(screenView, accountsSection, statusSection);
                    tableState = attachAccountsTable();
                    const initialMatch = route.id ? accounts.find((item) => item.id === route.id) : null;
                    if (initialMatch) {
                        selected = initialMatch;
                        panelOpen = true;
                    }
                    else if (accountsMounts > 1) {
                        panelOpen = false;
                    }
                    if (panelOpen && selected && detailPanel) {
                        ctx.panel.replaceChildren(detailPanel);
                        ctx.panel.hidden = false;
                        fillFacts(selected);
                        title.textContent = selected.name;
                        nameInput.value = selected.name;
                        emailInput.value = selected.email;
                    }
                    renderAccounts();
                    statusLoader?.load();
                    return {
                        update: (next) => {
                            const match = next.id ? accounts.find((item) => item.id === next.id) : null;
                            if (match) {
                                openAccount(match, null, false);
                            }
                            else {
                                closeAccountPanel();
                            }
                        },
                        dispose: () => {
                            statusLoader?.cancel();
                            tableState?.destroy();
                            tableState = null;
                        }
                    };
                }
            },
            {
                name: 'sessions',
                title: 'Sessions',
                mount: (screenView, ctx) => ctx.dom.setChildren(screenView,
                    ctx.dom.h('section', { class: 'gallery-section', 'aria-labelledby': 'sessions-heading' },
                        ctx.dom.h('h2', { id: 'sessions-heading' }, 'Active sessions'),
                        ctx.dom.dataTable('Sample active sessions', ['Token', 'Account', 'Last seen', 'Status'], [
                            ['tok-901', 'Alex North', '2026-11-17 07:40:00', 'ok', 'Active'],
                            ['tok-902', 'Samira Patel', '2026-11-16 08:15:00', 'ok', 'Active'],
                            ['tok-877', 'Jordan Kim', '2026-11-10 17:22:00', 'warning', 'Expiring']
                        ].map(([id, owner, lastSeen, sev, label]) => ctx.dom.h('tr', null,
                            ctx.dom.h('th', { scope: 'row' }, id), ctx.dom.h('td', null, owner), ctx.dom.h('td', null, lastSeen), ctx.dom.h('td', null, ctx.dom.severityChip(sev, label)))))))
            },
            {
                name: 'system-events',
                title: 'System events',
                mount: (screenView, ctx) => ctx.dom.setChildren(screenView,
                    ctx.dom.h('section', { class: 'gallery-section', 'aria-labelledby': 'events-heading' },
                        ctx.dom.h('h2', { id: 'events-heading' }, 'Recent audit events'),
                        ctx.dom.h('ul', { class: 'entry-list', 'aria-label': 'Recent audit events' }, [
                            ['warning', 'Warning', '2026-11-17 07:35:00', 'Account Jordan Kim marked for deletion.'],
                            ['error', 'Error', '2026-11-12 09:03:00', 'Account Morgan Lee locked after repeated failures.'],
                            ['info', 'Info', '2026-11-10 14:20:00', 'Admin console frame router initialized.']
                        ].map(([sev, label, time, msg]) => ctx.dom.h('li', { class: 'entry-list__item' },
                            ctx.dom.h('p', { class: 'entry-list__message' }, msg),
                            ctx.dom.h('div', { class: 'entry-list__meta' }, ctx.dom.severityChip(sev, label), ctx.dom.h('span', { class: 'chip' }, ctx.dom.h('time', null, time))))))))
            }
        ]
    });
}

if (typeof document !== 'undefined') {
    initAdminConsoleDemo(document, window);
}
