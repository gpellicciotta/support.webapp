# Auth Webapp UI Audit
Which UI and view code in Auth's webapp support.webapp should provide to every app.
The user decided on 2026-11-23 that everything apps can share belongs in support.webapp.
That decision drops the ADR-0003 second-app rule; candidates used by Auth alone still wait for a second app.

---

## Summary
- Auth holds 18 promote-now candidates and 7 shared admin screens; each has a backlog task, T0278 to T0302.
- Auth's App class has no package home: actions, notifications, routing, and install handling.
  counters runs the same class, so both apps need it once the view lifecycle base of T0276 lands.
- The admin consoles of Auth and ToDo share one helper and router lineage that has drifted apart.
  Promoting its builders, loading helper, table state, and frame stops that drift.
- Five apps repeat the page base styles: body text, headings, links, code, and the `hidden` guard.
- Three candidates wait for a second app, and the identity flows stay in Auth.
- Ten Auth parts already have a package equal or a task in flight; Auth only has to migrate them.
- The inbox candidate reverses the catalog's "Inbox panel: app-local" entry in [components.md](../specs/components.md).

---

## Scope, Sources, and Method
- All sibling repositories were read at the commits below and left unchanged:
  - Auth `eeb9439`: `webapp/js/`, `webapp/admin/js/`, `webapp/styles/`, `webapp/admin/css/`, and `webapp/index.html`.
  - counters `22884ed`: `webapp/js/app.mjs`, `webapp/js/view/`, and `webapp/js/model/installer.mjs`.
  - ToDo server `8992db5`: `admin/js/` and `admin/css/`.
  - todos.webapp `e0503fa` and meteo `e08a781`: page base styles, early theme scripts, and install handling.
- The package was read at `8da1935`, plus the T0276 worktree at `3b6b720` for the view lifecycle base.
- Sizes count Auth source lines of the candidate parts, measured with `wc -l` and line ranges.
- Effort is the expected package size: S up to 100 lines, M up to 300, L above 300.
  **[Estimation]** Effort derives from the Auth line counts, before tests and docs.
- Consumers are the apps whose code holds the same part today.
- Ranking: more consumers first, then smaller effort.

---

## Promote Now
### Page Base Stylesheet
- Task: T0278.
- Auth paths: [app.css](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/styles/app.css#L10-L47) and [admin.css](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/admin/css/admin.css#L13-L58).
- Size: 38 and 46 lines; effort S.
- Consumers: Auth SPA, Auth admin console, todos.webapp, ToDo admin console, meteo.
- What: body ground, text, and font; semibold headings with tight leading; underlined links; monospace code.
  The `[hidden]` guard keeps `hidden="until-found"` panels in place.
- Gap: the package styles only `.app`; [reset.css](../../src/css/reset.css) sets the box model alone.

### Release Notes Renderer
- Task: T0279.
- Auth paths: [help-view.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/js/view/help-view.mjs#L459-L504) and [changelog-view.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/admin/js/changelog-view.mjs).
- Size: 46 and 132 lines; effort M.
- Consumers: Auth Help, Auth admin console, ToDo admin console, counters Help.
- What: one collapsible per release, newest open, with Latest, category, and Breaking badges.
  A User Highlights or All Changes filter, area groups, release status chips, and inline code.
- Input: the releases of support.js `changelog-parser.mjs`, so the package needs no support.js import.

### Theme Boot Script and Account Theme Sync
- Task: T0280.
- Auth paths: [index.html](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/index.html#L12-L28) and [app.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/js/app.mjs#L66-L95) with its `applyTheme` and `applyServerTheme`.
- Size: 17 lines of boot script, about 70 lines of sync; effort S.
- Consumers: Auth, counters, and meteo boot the theme early; Auth and counters sync it with the account.
- What: apply the stored `{{app-name}}.theme` before the first paint, with a one-time key migration.
  Read a `theme` or `style-settings` account setting, apply it at sign-in, and save changes back.
- Gap: [theme-switch.js](../../src/js/theme-switch.js) stores the theme but offers no boot snippet or sync hooks.

### Install Prompt Module
- Task: T0281.
- Auth paths: [app.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/js/app.mjs#L254-L332) and [auth.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/js/auth.mjs#L67-L73).
- Size: 86 lines; effort S.
- Consumers: Auth, counters [installer.mjs](https://github.com/gpellicciotta/counters/blob/22884ed/webapp/js/model/installer.mjs), meteo [pwa.js](https://github.com/gpellicciotta/meteo/blob/e08a781/js/pwa.js).
- What: keep the `beforeinstallprompt` event, report installable and installed state, and prompt on a user gesture.
- Gap: [sw-update.js](../../src/js/sw-update.js) covers worker updates only.

### Field Validation After Pointer Release
- Task: T0282.
- Auth path: [ui.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/admin/js/ui.mjs#L240-L314).
- Size: 75 lines; effort S.
- Consumers: Auth admin console, ToDo admin console; the Auth SPA avoids autofocus to dodge the bug.
- What: a blur caused by a pointer press validates only after the release.
  A new error line then cannot move the pressed button away and lose its click.
- Gap: [field.js](../../src/js/field.js) validates on blur at once; this is a fix, not a new module.

### Shell Additions
- Task: T0283.
- Auth paths: [app.css](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/styles/app.css#L79-L118) and [admin.css](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/admin/css/admin.css#L64-L69).
- Size: 43 lines; effort S.
- Consumers: Auth SPA, Auth admin console, ToDo admin console.
- What: a sidebar list pinned to the sidebar end, badges at the end of nav entries, and `hidden` top bar parts.
  Also the brand logo size and the dismiss button at the end of a shell banner.

### View Header
- Task: T0284.
- Auth paths: [app.css](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/styles/app.css#L49-L64) and [admin.css](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/admin/css/admin.css#L59-L63).
- Size: 21 lines; effort S.
- Consumers: Auth SPA (`view-header`), Auth admin console (`screen-title`).
- What: a screen's page title and an optional muted summary line, such as "3 unread · 12 total".

### File Download Helper
- Task: T0285.
- Auth paths: [ui.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/admin/js/ui.mjs#L484-L497), [account-view.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/js/view/account-view.mjs#L683-L720), and [app-notices.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/js/view/app-notices.mjs#L614-L627).
- Size: 66 lines; effort S.
- Consumers: Auth account export, Auth admin console, counters account export.
- What: hand the viewer a JSON value or blob as a file, and offer it from a persistent toast action.
  The object URL is revoked when the toast goes.

### Screen Action Bar
- Task: T0286, after T0276.
- Auth path: [app-shell.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/js/view/app-shell.mjs#L367-L400).
- Size: 34 lines; effort S.
- Consumers: Auth, counters [app-action-bar.mjs](https://github.com/gpellicciotta/counters/blob/22884ed/webapp/js/view/app-action-bar.mjs).
- What: render the screen actions as buttons or links in `app__action-bar`, with disabled reasons as hints.
- Gap: T0276's `RoutedView` calls `app.setScreenActions`, but nothing in the package draws the bar.

### Data Loading Helper
- Task: T0287, after T0294.
- Auth path: [ui.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/admin/js/ui.mjs#L499-L533).
- Size: 35 lines; effort S.
- Consumers: Auth admin console, ToDo admin console.
- What: load data into a container with loading, failed with Retry, and expired-session states.
  The newest call wins; a quiet mode keeps the content while polling.

### Paged and Filtered Table State
- Task: T0288, after T0294.
- Auth path: [ui.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/admin/js/ui.mjs#L103-L129) and its `pageOf` and `pager` at lines 419 to 465.
- Size: 74 lines; effort M.
- Consumers: Auth admin console (client paging), ToDo admin console (server paging in `mountPagedTable`).
- What: keep filters and the page in the hash query without a history entry.
  Cut client pages or build server page parameters, and wire the package pager.

### Action Registry
- Task: T0289.
- Auth path: [app.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/js/app.mjs#L409-L631).
- Size: 223 lines; effort M.
- Consumers: Auth, counters [app.mjs](https://github.com/gpellicciotta/counters/blob/22884ed/webapp/js/app.mjs).
- What: add, remove, enable, disable, toggle, and run actions, with disabled reasons and state events.
  `data-action` clicks run them.
- Gap: T0276's `RoutedView` calls `addAction` and `removeAction` on an app the package does not provide.

### Notices
- Task: T0290.
- Auth paths: [app-notices.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/js/view/app-notices.mjs) and the notification store in [app.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/js/app.mjs#L632-L759).
- Size: 257 and 128 lines; effort M.
- Consumers: Auth, counters `app-notification-bar.mjs` and `toast-manager.mjs`.
- What: errors and warnings stay as banners, at most three; other notices become toasts.
  The most severe sticky inbox notice shows as a banner with "View all N alerts".
  Dismissing deletes the notice; action URLs must be same-origin paths or http(s) links.

### Notifications Inbox and Unread Button
- Task: T0291, after T0290.
- Auth paths: [notifications-view.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/js/view/notifications-view.mjs), [app.css](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/styles/app.css#L464-L522), and [app-shell.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/js/view/app-shell.mjs#L122-L139).
- Size: 246, 59, and 18 lines; effort M.
- Consumers: Auth, counters [notifications-view.mjs](https://github.com/gpellicciotta/counters/blob/22884ed/webapp/js/view/notifications-view.mjs).
- What: one selectable row per notification with type badge, unread mark, source and time chips, and row actions.
  Bulk Mark Read and Discard, Discard All, an empty state, and a summary line.
  The top bar button shows the unread count, capped at 99+, in its accessible name.

### Help Page
- Task: T0292.
- Auth path: [help-view.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/js/view/help-view.mjs).
- Size: about 250 of 559 lines; the rest is Auth's help text; effort M.
- Consumers: Auth, counters [help-view.mjs](https://github.com/gpellicciotta/counters/blob/22884ed/webapp/js/view/help-view.mjs).
- What: a search with a clear button, topic filter chips, and section cards filtered by both.
  FAQ collapsibles hidden until found, Expand All, a no-results state, and `?q=` and `?topic=` links.
  A feedback mail link carries the app version and the signed-in user.

### Admin Console Frame
- Task: T0293, after T0294.
- Auth path: [main.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/admin/js/main.mjs) and the gate rules of [admin.css](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/admin/css/admin.css#L100-L126).
- Size: about 200 of 304 lines plus 27 lines of CSS; effort M.
- Consumers: Auth admin console, ToDo admin console [main.mjs](https://github.com/gpellicciotta/todos.server/blob/8992db5/admin/js/main.mjs).
- What: a screen registry with `mount`, `update`, and `dispose`, a hash router, and route marks.
  The shell with side panel, centered gate pages for session checks and forbidden access, and a signed-out shell.

### DOM Builders
- Task: T0294.
- Auth path: [ui.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/admin/js/ui.mjs).
- Size: about 300 of 533 lines; effort L.
- Consumers: Auth admin console, ToDo admin console [ui.mjs](https://github.com/gpellicciotta/todos.server/blob/8992db5/admin/js/ui.mjs).
- What: the `h` element builder and `setChildren`, plus builders for buttons, selects, checkboxes, and facts.
  Also data tables, severity chips, status lines, error banners, empty states, and inline confirmation slots.
- Drift: the two copies differ in 405 lines; ToDo lacks entry cards and has its own paged table.

### View Router
- Task: T0295, after T0276 and T0289.
- Auth path: [app.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/js/app.mjs#L760-L937).
- Size: 178 lines; effort L, with the history and click handling around it.
- Consumers: Auth, counters [app.mjs](https://github.com/gpellicciotta/counters/blob/22884ed/webapp/js/app.mjs).
- What: register routed views and a fallback, pick a view by route, and guard signed-in and signed-out views.
  Activate a view with history, keep the shell title and route marks, and open outside routes with a full load.

### Shared Admin Screens
- Tasks: T0296 to T0302, each after T0293 and T0294.
- Consumers: Auth admin console, ToDo admin console; the copies differ in 59 to 654 lines.
- The user decided on 2026-11-23 that the package ships these screens.
- **[Decided]** Each screen takes a data adapter of fetch functions, so each app keeps its own endpoints.
  The endpoints differ today: Auth reads `/admin/system-events` and ToDo `/system-events`, for example.
  No server change is needed; app-specific sections join through extension hooks.
- Screens, with Auth and ToDo sizes:
  - T0296 Overview: server state, reloaded while visible; [overview-view.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/admin/js/overview-view.mjs), 65 and 56 lines; effort S.
  - T0297 Logs: the log buffer as entry cards, filtered and paged; [logs-view.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/admin/js/logs-view.mjs), 148 and 38 lines; effort M.
  - T0298 System events: audit records with type, severity, paging, search, and JSON details; [system-events-view.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/admin/js/system-events-view.mjs), 266 and 114 lines; effort M.
  - T0299 Broadcasts: compose with a live preview and recipients, then review and retract; [broadcasts-view.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/admin/js/broadcasts-view.mjs), 522 and 193 lines; effort L.
  - T0300 Users: the account table, detail panel, New user panel, and deletion; [users-view.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/admin/js/users-view.mjs), 564 and 270 lines; effort L.
    Auth's credentials, grants, and password sections stay app-local, behind the extension hooks.
  - T0301 Sessions: tokens with single, bulk, and expired revocation, sparing the console's own; [sessions-view.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/admin/js/sessions-view.mjs), 256 and 82 lines; effort M.
    It brings the table multi-select along, so that part no longer waits.
  - T0302 Changelog: the T0279 renderer fed from an app loader; [changelog-view.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/admin/js/changelog-view.mjs), 132 and 115 lines; effort S.
- Applications stays app-local: only Auth registers relying parties.

---

## Wait for a Second App
- Start page: [home-view.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/js/view/home-view.mjs) and app.css lines 186 to 219, 63 lines.
  Only Auth has one; counters' home view is empty.
- App launcher grid: the cards of [dashboard-view.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/js/view/dashboard-view.mjs) and app.css lines 432 to 462, 31 lines of CSS.
  family-portal is the likely second app.
- Card header with a trailing action: app.css lines 318 to 324, 7 lines, in the Account view only.

---

## Keep App-Local
- Sign-in, create account, relying-party hand-off, and the social sign-in popup: Auth is the identity provider.
- Account view cards for profile, sign-in methods, sessions, custom settings, and deletion: other apps link to Auth.
- Dashboard grant filtering, `menuActionsFor`, `consoleRedirectFor`, `ACTION_GLYPHS`, and the API clients: app data.
- The email field preset of [field-markup.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/js/utils/field-markup.mjs): it wraps support.js `isValidEmailAddress`.

---

## Already Provided
Auth migrates these parts; nothing is left to promote.
- Error page and action registration of `AppView`: the view lifecycle base of T0276.
- [pull-to-refresh.mjs](https://github.com/gpellicciotta/auth.server/blob/eeb9439/webapp/js/view/pull-to-refresh.mjs) and its CSS: [pull-refresh.js](../../src/js/pull-refresh.js), from T0274.
- Notification polling and view refresh after absence: [auto-refresh.js](../../src/js/auto-refresh.js), from T0275.
- Entry cards of logs and events: the `entry-list` component, from T0273.
- `initialsOf` of the Account view: [account-menu.js](../../src/js/account-menu.js) exports it.
- `fieldHtml`: `createField` of [field.js](../../src/js/field.js).
- Three local `iconHtml` copies: `createIcon` and `spriteIcon` of [icon.js](../../src/js/icon.js).
- Admin console toolbar, data table, pager, facts, and detail panel styles: the package components of the same names.
- Admin console JSON details: the details part of `entry-list`.
- The skip link that focuses the main area: the shell's skip link pattern.
