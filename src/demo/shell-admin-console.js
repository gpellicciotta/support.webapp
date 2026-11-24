/* Admin console shell demo interactions: look/theme switchers, nav toggle, row selection, detail panel focus, and inline confirmation. */

import { attachAccountMenu } from '../js/account-menu.js';
import { attachAdminConsole } from '../js/admin-console.js';
import { createAdminLogsScreen } from '../js/admin-logs.js';
import { createAdminOverviewScreen } from '../js/admin-overview.js';
import { createAdminSystemEventsScreen } from '../js/admin-system-events.js';
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

    let logsMode = 'populated';
    const sampleLogEntries = [
        {
            time: '2026-11-24T09:15:30Z',
            level: 'ERROR',
            name: 'org.example.auth.TokenService',
            message: '\n    Token signature verification failed for key kid-2026-11\n        at TokenService.verify(TokenService.java:84)\n        at AuthFilter.handle(AuthFilter.java:41)\n'
        },
        {
            time: '2026-11-24T09:12:14Z',
            level: 'WARN',
            name: 'org.example.auth.RateLimiter',
            message: '    Burst limit approached on /api/sessions (42 of 50 requests/min)'
        },
        {
            time: '2026-11-24T09:10:05Z',
            level: 'INFO',
            name: 'org.example.http.Server',
            message: '    Admin console listener ready on https://demo.example.test/api'
        },
        {
            time: '2026-11-24T09:08:42Z',
            level: 'DEBUG',
            name: 'org.example.repository.Pool',
            message: '    Checked out read-only connection #7 in 2 ms'
        },
        {
            time: '2026-11-24T09:05:19Z',
            level: 'ERROR',
            name: 'org.example.repository.AccountStore',
            message: '    Query timed out after 5000 ms\n        at AccountStore.findByEmail(AccountStore.java:118)'
        },
        {
            time: '2026-11-24T09:02:08Z',
            level: 'WARN',
            name: 'org.example.mail.RelayClient',
            message: '    Slow SMTP handshake (1840 ms) on primary relay'
        },
        {
            time: '2026-11-24T08:59:00Z',
            level: 'INFO',
            name: 'org.example.bootstrap.Startup',
            message: '    Loaded 14 schema migrations and initialized in-memory log buffer'
        }
    ];
    const logsScreen = createAdminLogsScreen({
        sizes: [4, 10, 25],
        defaultSize: 4,
        adapter: {
            fetchLogs: async () => {
                const mode = logsMode;
                logsMode = 'populated';
                if (mode === 'empty') {
                    return { 'log-entries': [] };
                }
                if (mode === 'fail-once') {
                    throw new Error('Log buffer temporarily unavailable');
                }
                if (mode === 'unauthorized') {
                    throw Object.assign(new Error('Session expired'), { status: 401 });
                }
                return { 'log-entries': sampleLogEntries };
            }
        }
    });

    let eventsMode = 'populated';
    const sampleEventUsers = [
        { id: 1, email: 'alex.north@example.test', name: 'Alex North' },
        { id: 34, email: 'samira.patel@example.test', name: 'Samira Patel' }
    ];
    const sampleSystemEvents = [
        {
            id: 214,
            'event-type': 'broadcast-published',
            severity: 'info',
            description: 'Published scheduled maintenance notice to active sessions.',
            'creation-time': '2026-11-24T09:14:00Z',
            'actor-user-id': 1,
            metadata: '{"broadcastId":48,"recipients":128,"channel":"in-app"}'
        },
        {
            id: 213,
            'event-type': 'user-locked',
            severity: 'error',
            description: 'Account Morgan Lee locked after repeated failed sign-ins.',
            'creation-time': '2026-11-24T08:42:15Z',
            'actor-user-id': null,
            metadata: '{"accountId":41,"attempts":5,"windowSeconds":300}'
        },
        {
            id: 212,
            'event-type': 'user-deletion-marked',
            severity: 'warning',
            description: 'Account Jordan Kim marked for deletion by administrator.',
            'creation-time': '2026-11-23T17:35:00Z',
            'actor-user-id': 34,
            metadata: '{"accountId":36,"graceDays":14}'
        },
        {
            id: 211,
            'event-type': 'session-revoked',
            severity: 'warning',
            description: 'Revoked stale refresh token during nightly sweep.',
            'creation-time': '2026-11-23T02:00:00Z',
            'actor-user-id': null,
            metadata: null
        },
        {
            id: 210,
            'event-type': 'broadcast-retracted',
            severity: 'info',
            description: 'Retracted draft release announcement before delivery.',
            'creation-time': '2026-11-22T15:18:00Z',
            'actor-user-id': 1,
            metadata: '{"broadcastId":47,"reason":"postponed"}'
        },
        {
            id: 209,
            'event-type': 'database-upgraded',
            severity: 'info',
            description: 'Applied schema migration v14 on startup.',
            'creation-time': '2026-11-20T10:15:30Z',
            'actor-user-id': null,
            metadata: '{"from":13,"to":14,"durationMs":412}'
        }
    ];
    const systemEventsScreen = createAdminSystemEventsScreen({
        limits: [4, 10, 25],
        defaultLimit: 4,
        debounce: 0,
        adapter: {
            fetchEvents: async ({ eventType, severity, limit, offset }) => {
                const mode = eventsMode;
                eventsMode = 'populated';
                if (mode === 'empty') {
                    return [];
                }
                if (mode === 'fail-once') {
                    throw new Error('Audit store temporarily unavailable');
                }
                if (mode === 'unauthorized') {
                    throw Object.assign(new Error('Session expired'), { status: 401 });
                }
                const matching = sampleSystemEvents.filter((item) => (!eventType || item['event-type'] === eventType)
                    && (!severity || item.severity === severity));
                return matching.slice(offset, offset + limit);
            },
            fetchUsers: async () => sampleEventUsers
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
                name: logsScreen.name,
                title: logsScreen.title,
                mount: (screenView, ctx, route) => {
                    const logsHost = ctx.dom.h('div', { class: 'gallery-section' });
                    let logsController = null;
                    const triggerLogsMode = (mode) => {
                        logsMode = mode;
                        logsController?.refresh();
                    };
                    ctx.dom.setChildren(screenView,
                        logsHost,
                        ctx.dom.h('section', { class: 'gallery-section', 'aria-labelledby': 'logs-states-heading' },
                            ctx.dom.h('h2', { id: 'logs-states-heading' }, 'Log buffer states'),
                            ctx.dom.h('p', null, 'Preview an empty server buffer, fetch failures, and 401 sign-in prompts.'),
                            ctx.dom.h('div', { class: 'toolbar', role: 'group', 'aria-label': 'Log buffer state previews' },
                                ctx.dom.button('Empty buffer', () => triggerLogsMode('empty'), { 'data-demo-logs': 'empty' }),
                                ctx.dom.button('Fail fetch once', () => triggerLogsMode('fail-once'), { 'data-demo-logs': 'fail-once' }),
                                ctx.dom.button('Simulate 401', () => triggerLogsMode('unauthorized'), { 'data-demo-logs': 'unauthorized' }))));
                    logsController = logsScreen.mount(logsHost, ctx, route);
                    return { dispose: () => logsController?.dispose() };
                }
            },
            {
                name: systemEventsScreen.name,
                title: systemEventsScreen.title,
                mount: (screenView, ctx, route) => {
                    const eventsHost = ctx.dom.h('div', { class: 'gallery-section' });
                    let eventsController = null;
                    const triggerEventsMode = (mode) => {
                        eventsMode = mode;
                        eventsController?.refresh();
                    };
                    ctx.dom.setChildren(screenView,
                        eventsHost,
                        ctx.dom.h('section', { class: 'gallery-section', 'aria-labelledby': 'events-states-heading' },
                            ctx.dom.h('h2', { id: 'events-states-heading' }, 'System event states'),
                            ctx.dom.h('p', null, 'Preview an empty audit log, fetch failures, and 401 sign-in prompts.'),
                            ctx.dom.h('div', { class: 'toolbar', role: 'group', 'aria-label': 'System event state previews' },
                                ctx.dom.button('Empty audit log', () => triggerEventsMode('empty'), { 'data-demo-events': 'empty' }),
                                ctx.dom.button('Fail fetch once', () => triggerEventsMode('fail-once'), { 'data-demo-events': 'fail-once' }),
                                ctx.dom.button('Simulate 401', () => triggerEventsMode('unauthorized'), { 'data-demo-events': 'unauthorized' }))));
                    eventsController = systemEventsScreen.mount(eventsHost, ctx, route);
                    return { dispose: () => eventsController?.dispose() };
                }
            }
        ]
    });
}

if (typeof document !== 'undefined') {
    initAdminConsoleDemo(document, window);
}
