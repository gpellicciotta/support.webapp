/* Admin console shell demo interactions: look/theme switchers, nav toggle, row selection, detail panel focus, and inline confirmation. */

import { attachAccountMenu } from '../js/account-menu.js';
import { attachAdminConsole } from '../js/admin-console.js';
import { createAdminBroadcastsScreen } from '../js/admin-broadcasts.js';
import { createAdminLogsScreen } from '../js/admin-logs.js';
import { createAdminOverviewScreen } from '../js/admin-overview.js';
import { createAdminSessionsScreen } from '../js/admin-sessions.js';
import { createAdminSystemEventsScreen } from '../js/admin-system-events.js';
import { createAdminUsersScreen } from '../js/admin-users.js';
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

    let broadcastsMode = 'populated';
    let nextBroadcastId = 305;
    let sampleBroadcasts = [
        {
            id: 304,
            title: 'Scheduled maintenance',
            message: 'Sign-in restarts at 22:00 UTC for five minutes.',
            type: 'warning',
            banner: true,
            'action-url': '/help',
            'target-filter': { type: 'all' },
            'created-at': '2026-11-24T09:14:00Z',
            'deletion-time': '2026-11-25T00:00:00Z',
            status: 'active'
        },
        {
            id: 303,
            title: 'Security review reminder',
            message: 'Review delegated sessions before the end of the week.',
            type: 'info',
            banner: false,
            'target-filter': { type: 'role', 'role-name': 'admin' },
            'created-at': '2026-11-23T11:30:00Z',
            status: 'active'
        },
        {
            id: 302,
            title: 'Draft release notice',
            message: 'Retracted prior to rollout.',
            type: 'info',
            banner: false,
            'target-filter': { type: 'all' },
            'created-at': '2026-11-22T15:18:00Z',
            status: 'retracted'
        }
    ];
    const sampleBroadcastUsers = [
        { id: 1, email: 'alex.north@example.test', name: 'Alex North' },
        { id: 34, email: 'samira.patel@example.test', name: 'Samira Patel' },
        { id: 47, email: 'taylor.brooks@example.test', name: 'Taylor Brooks' },
        { id: 52, email: 'casey.rivera@example.test', name: 'Casey Rivera' }
    ];
    const broadcastsScreen = createAdminBroadcastsScreen({
        debounce: 0,
        adapter: {
            fetchHistory: async () => {
                const mode = broadcastsMode;
                broadcastsMode = 'populated';
                if (mode === 'empty') {
                    return [];
                }
                if (mode === 'fail-once') {
                    throw new Error('Broadcast history temporarily unavailable');
                }
                if (mode === 'unauthorized') {
                    throw Object.assign(new Error('Session expired'), { status: 401 });
                }
                return sampleBroadcasts.map((item) => ({ ...item }));
            },
            fetchUsers: async () => sampleBroadcastUsers,
            publish: async (payload) => {
                const id = nextBroadcastId;
                nextBroadcastId += 1;
                sampleBroadcasts = [
                    {
                        id,
                        title: payload.title ?? null,
                        message: payload.message,
                        type: payload.type,
                        banner: Boolean(payload.banner),
                        'action-url': payload['action-url'] ?? null,
                        'target-filter': payload['target-filter'] ?? { type: 'all' },
                        'created-at': new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
                        'deletion-time': payload['deletion-time'] ?? null,
                        status: 'active'
                    },
                    ...sampleBroadcasts
                ];
                return { message: `Broadcast #${id} published` };
            },
            retract: async (id) => {
                sampleBroadcasts = sampleBroadcasts.filter((item) => String(item.id) !== String(id));
                return { message: `Broadcast #${id} retracted` };
            }
        }
    });

    let usersMode = 'populated';
    let nextDemoUserId = 60;
    let sampleUsers = [
        {
            id: 1,
            name: 'Alex North',
            email: 'alex.north@example.test',
            realms: ['owner', 'admin'],
            'creation-time': '2026-01-05T09:30:00Z',
            'last-activity-time': '2026-11-17T07:40:00Z',
            'expiry-time': null,
            sessions: 3
        },
        {
            id: 34,
            name: 'Samira Patel',
            email: 'samira.patel@example.test',
            realms: ['owner'],
            'creation-time': '2026-09-01T10:00:00Z',
            'last-activity-time': '2026-11-16T08:15:00Z',
            'expiry-time': null,
            sessions: 2
        },
        {
            id: 36,
            name: 'Jordan Kim',
            email: 'jordan.kim@example.test',
            realms: ['owner', 'test'],
            'creation-time': '2026-09-20T14:05:00Z',
            'last-activity-time': '2026-11-10T17:22:00Z',
            'expiry-time': '2026-12-01T00:00:00Z',
            sessions: 0
        },
        {
            id: 41,
            name: 'Morgan Lee',
            email: 'morgan.lee@example.test',
            realms: ['owner'],
            'creation-time': '2026-10-02T11:45:00Z',
            'last-activity-time': '2026-11-12T09:03:00Z',
            'expiry-time': null,
            sessions: 1
        },
        {
            id: 47,
            name: 'Taylor Brooks',
            email: 'taylor.brooks@example.test',
            realms: ['owner'],
            'creation-time': '2026-10-14T08:20:00Z',
            'last-activity-time': '2026-11-15T19:05:00Z',
            'expiry-time': null,
            sessions: 1
        },
        {
            id: 52,
            name: 'Casey Rivera',
            email: 'casey.rivera@example.test',
            realms: ['test'],
            'creation-time': '2026-11-01T16:10:00Z',
            'last-activity-time': null,
            'expiry-time': null,
            sessions: 0
        }
    ];
    const usersScreen = createAdminUsersScreen({
        sizes: [4, 10, 20],
        defaultSize: 4,
        adapter: {
            fetchUsers: async () => {
                const mode = usersMode;
                usersMode = 'populated';
                if (mode === 'empty') {
                    return [];
                }
                if (mode === 'fail-once') {
                    throw new Error('User directory temporarily unavailable');
                }
                if (mode === 'unauthorized') {
                    throw Object.assign(new Error('Session expired'), { status: 401 });
                }
                return sampleUsers.map((user) => ({ ...user, realms: [...user.realms] }));
            },
            fetchUser: async (id) => {
                const found = sampleUsers.find((user) => String(user.id) === String(id));
                if (!found) {
                    throw new Error(`Account ${id} was not found`);
                }
                return { ...found, realms: [...found.realms] };
            },
            updateUser: async (id, body) => {
                const index = sampleUsers.findIndex((user) => String(user.id) === String(id));
                if (index < 0) {
                    throw new Error(`Account ${id} was not found`);
                }
                sampleUsers[index] = {
                    ...sampleUsers[index],
                    ...body,
                    realms: body.realms ? [...body.realms] : sampleUsers[index].realms
                };
                return { ...sampleUsers[index] };
            },
            createUser: async (body) => {
                const created = {
                    id: nextDemoUserId,
                    name: body.name ?? '',
                    email: body.email,
                    realms: ['owner'],
                    'creation-time': new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'),
                    'last-activity-time': null,
                    'expiry-time': null,
                    sessions: 0
                };
                nextDemoUserId += 1;
                sampleUsers = [...sampleUsers, created];
                return { ...created };
            },
            markUserForDeletion: async (id) => {
                const index = sampleUsers.findIndex((user) => String(user.id) === String(id));
                if (index >= 0) {
                    sampleUsers[index] = { ...sampleUsers[index], 'expiry-time': '2026-12-10T00:00:00Z' };
                }
                return sampleUsers[index];
            },
            restoreUser: async (id) => {
                const index = sampleUsers.findIndex((user) => String(user.id) === String(id));
                if (index >= 0) {
                    sampleUsers[index] = { ...sampleUsers[index], 'expiry-time': null };
                }
                return sampleUsers[index];
            },
            deleteUser: async (id) => {
                sampleUsers = sampleUsers.filter((user) => String(user.id) !== String(id));
            }
        },
        extraFacts: ({ user }) => [
            { term: 'Sessions', value: `${user.sessions ?? 0} active`, key: 'sessions' }
        ]
    });

    let sessionsMode = 'populated';
    const initialTokens = () => [
        {
            id: 901,
            user: { name: 'Alex North', email: 'alex.north@example.test' },
            type: 'session',
            'creation-time': '2026-11-24T07:40:00Z',
            'expiry-time': '2099-11-25T07:40:00Z'
        },
        {
            id: 902,
            user: { name: 'Samira Patel', email: 'samira.patel@example.test' },
            type: 'session',
            'creation-time': '2026-11-24T08:15:00Z',
            'expiry-time': '2099-11-25T08:15:00Z'
        },
        {
            id: 903,
            user: { name: 'Taylor Brooks', email: 'taylor.brooks@example.test' },
            type: 'session',
            'creation-time': '2026-11-23T19:05:00Z',
            'expiry-time': '2099-11-25T19:05:00Z'
        },
        {
            id: 904,
            user: { name: 'Casey Rivera', email: 'casey.rivera@example.test' },
            type: 'one-time-code',
            'creation-time': '2026-11-24T09:10:00Z',
            'expiry-time': null
        },
        {
            id: 905,
            user: { name: 'Morgan Lee', email: 'morgan.lee@example.test' },
            type: 'authorization',
            'creation-time': '2026-11-22T09:03:00Z',
            'expiry-time': '2099-12-01T00:00:00Z'
        },
        {
            id: 877,
            user: { name: 'Jordan Kim', email: 'jordan.kim@example.test' },
            type: 'session',
            'creation-time': '2025-11-01T17:22:00Z',
            'expiry-time': '2025-11-10T17:22:00Z'
        },
        {
            id: 876,
            user: { name: 'Alex North', email: 'alex.north@example.test' },
            type: 'change-request',
            'creation-time': '2025-10-12T10:00:00Z',
            'expiry-time': '2025-10-13T10:00:00Z'
        }
    ];
    let sampleTokens = initialTokens();
    const sessionsScreen = createAdminSessionsScreen({
        sizes: [4, 10, 20],
        defaultSize: 4,
        adapter: {
            fetchTokens: async () => {
                const mode = sessionsMode;
                sessionsMode = 'populated';
                if (mode === 'empty') {
                    return [];
                }
                if (mode === 'fail-once') {
                    throw new Error('Token store temporarily unavailable');
                }
                if (mode === 'unauthorized') {
                    throw Object.assign(new Error('Session expired'), { status: 401 });
                }
                return sampleTokens.map((token) => ({
                    ...token,
                    user: token.user ? { ...token.user } : null
                }));
            },
            revokeToken: async (id) => {
                sampleTokens = sampleTokens.filter((token) => String(token.id) !== String(id));
            },
            revokeExpired: async () => {
                const now = Date.now();
                sampleTokens = sampleTokens.filter((token) => !token['expiry-time'] || new Date(token['expiry-time']).getTime() > now);
            }
        }
    });

    const frame = attachAdminConsole(doc.body, {
        document: doc,
        window: view,
        dom,
        title: 'Admin Console',
        account: { id: 1, name: 'Alex North', email: 'alex.north@example.test', realms: ['owner', 'admin'] },
        session: { id: 901 },
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
                name: usersScreen.name,
                title: usersScreen.title,
                mount: (screenView, ctx, route) => {
                    const usersHost = ctx.dom.h('div', { class: 'gallery-section' });
                    let usersController = null;
                    const triggerUsersMode = (mode) => {
                        usersMode = mode;
                        usersController?.refresh();
                    };
                    ctx.dom.setChildren(screenView,
                        usersHost,
                        ctx.dom.h('section', { class: 'gallery-section', 'aria-labelledby': 'users-states-heading' },
                            ctx.dom.h('h2', { id: 'users-states-heading' }, 'User directory states'),
                            ctx.dom.h('p', null, 'Preview an empty directory, fetch failures, and 401 sign-in prompts.'),
                            ctx.dom.h('div', { class: 'toolbar', role: 'group', 'aria-label': 'User directory state previews' },
                                ctx.dom.button('Empty directory', () => triggerUsersMode('empty'), { 'data-demo-users': 'empty' }),
                                ctx.dom.button('Fail fetch once', () => triggerUsersMode('fail-once'), { 'data-demo-users': 'fail-once' }),
                                ctx.dom.button('Simulate 401', () => triggerUsersMode('unauthorized'), { 'data-demo-users': 'unauthorized' }))));
                    usersController = usersScreen.mount(usersHost, ctx, route);
                    return {
                        update: (next) => usersController?.update(next),
                        dispose: () => usersController?.dispose()
                    };
                }
            },
            {
                name: sessionsScreen.name,
                title: sessionsScreen.title,
                mount: (screenView, ctx, route) => {
                    const sessionsHost = ctx.dom.h('div', { class: 'gallery-section' });
                    let sessionsController = null;
                    const triggerSessionsMode = (mode) => {
                        if (mode === 'reset') {
                            sampleTokens = initialTokens();
                            sessionsMode = 'populated';
                        }
                        else {
                            sessionsMode = mode;
                        }
                        sessionsController?.refresh();
                    };
                    ctx.dom.setChildren(screenView,
                        sessionsHost,
                        ctx.dom.h('section', { class: 'gallery-section', 'aria-labelledby': 'sessions-states-heading' },
                            ctx.dom.h('h2', { id: 'sessions-states-heading' }, 'Session store states'),
                            ctx.dom.h('p', null, 'Preview an empty token store, fetch failures, and 401 sign-in prompts.'),
                            ctx.dom.h('div', { class: 'toolbar', role: 'group', 'aria-label': 'Session store state previews' },
                                ctx.dom.button('Empty token list', () => triggerSessionsMode('empty'), { 'data-demo-sessions': 'empty' }),
                                ctx.dom.button('Fail fetch once', () => triggerSessionsMode('fail-once'), { 'data-demo-sessions': 'fail-once' }),
                                ctx.dom.button('Simulate 401', () => triggerSessionsMode('unauthorized'), { 'data-demo-sessions': 'unauthorized' }),
                                ctx.dom.button('Reset sample tokens', () => triggerSessionsMode('reset'), { 'data-demo-sessions': 'reset' }))));
                    sessionsController = sessionsScreen.mount(sessionsHost, ctx, route);
                    return { dispose: () => sessionsController?.dispose() };
                }
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
            },
            {
                name: broadcastsScreen.name,
                title: broadcastsScreen.title,
                mount: (screenView, ctx, route) => {
                    const broadcastsHost = ctx.dom.h('div', { class: 'gallery-section' });
                    let broadcastsController = null;
                    const triggerBroadcastsMode = (mode) => {
                        broadcastsMode = mode;
                        broadcastsController?.refresh();
                    };
                    ctx.dom.setChildren(screenView,
                        broadcastsHost,
                        ctx.dom.h('section', { class: 'gallery-section', 'aria-labelledby': 'broadcasts-states-heading' },
                            ctx.dom.h('h2', { id: 'broadcasts-states-heading' }, 'Broadcast history states'),
                            ctx.dom.h('p', null, 'Preview an empty history, fetch failures, and 401 sign-in prompts.'),
                            ctx.dom.h('div', { class: 'toolbar', role: 'group', 'aria-label': 'Broadcast history state previews' },
                                ctx.dom.button('Empty history', () => triggerBroadcastsMode('empty'), { 'data-demo-broadcasts': 'empty' }),
                                ctx.dom.button('Fail fetch once', () => triggerBroadcastsMode('fail-once'), { 'data-demo-broadcasts': 'fail-once' }),
                                ctx.dom.button('Simulate 401', () => triggerBroadcastsMode('unauthorized'), { 'data-demo-broadcasts': 'unauthorized' }))));
                    broadcastsController = broadcastsScreen.mount(broadcastsHost, ctx, route);
                    return { dispose: () => broadcastsController?.dispose() };
                }
            }
        ]
    });
}

if (typeof document !== 'undefined') {
    initAdminConsoleDemo(document, window);
}
