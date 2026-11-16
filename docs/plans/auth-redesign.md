# Auth Redesign Plan
How auth moves onto the design system, and how its Admin Console is rebuilt after ToDo's console.

- Status: Accepted on 2026-11-15, after the agent review of T0025.
- Date: 2026-11-15.
- **[Decided]** with the user on 2026-11-15: this plan covers auth only; T0046 plans counters.
- **[Decided]** with the user on 2026-11-15: auth uses the `neutral` look, as ToDo's does.
- **[Decided]** with the user on 2026-11-15: the Admin Console becomes a separate app, like ToDo's console.
- **[Decided]** with the user on 2026-11-15: the Admin Console targets desktop widths only.
- **[Decided]** with the user on 2026-11-15: the Recycle Bin, Workbench, and PWA controls are dropped.
- **[Decided]** with the user on 2026-11-15: every other auth screen also moves to the look and the shell.
- **[Decided]** with the user on 2026-11-15: the console drops the old client log.
- **[Decided]** with the user on 2026-11-15: signed-in pages use a menu button in the top bar.
- **[Decided]** with the user on 2026-11-15: auth.server T0222 fixes the token routes' `expired` filter.
  It shipped in auth v3.4.0 on 2026-11-16.
- **[Decided]** with the user on 2026-11-16: the auth.server tasks exist before the release; the first waits for it.
- **[Decided]** with the user on 2026-11-15: the proposed task list is approved.

---

## Context
- auth is a Java server that serves a no-build ES module app from `webapp/`.
- The app styles itself with 35 local stylesheets copied from the support.js lineage.
- It loads Roboto from Google Fonts and icons from a Font Awesome kit.
- Its shell has a header action bar, a main menu, a context action bar, and a footer.
- The Admin Console is the `/admin` route of the app, a 3751-line view with nine tabs.
  The tabs are Overview, Users, Sessions, Applications, Notifications, System Events, Recycle Bin, Logs, and Workbench.
- Users and applications open separate detail and create routes, such as `/users/{{id}}`.
- A service worker with scope `/` precaches every local stylesheet and script.
- The list endpoints for users, applications, tokens, and logs return every row, with no paging.
  `GET /api/logs` also ignores its documented `level`, `message`, and `limit` parameters.
- ToDo's Admin Console is a separate desktop app in todos.server's `admin/` folder.
  It links the vendored `neutral` look and adds admin-only components in its own `admin.css`.
  Its [admin spec](https://github.com/gpellicciotta/todos.server/blob/main/docs/specs/admin-spec.md) defines its screens and behavior.

---

## Look
- auth imports `looks/neutral/index.css` from its vendored copy, `webapp/vendor/design/`.
- Inter from the look replaces Roboto; the look's sprite replaces Font Awesome.
- auth keeps its logo, app icons, and the Google, GitHub, and Microsoft logos as images.
- Glyphs the core sprite lacks go into an app-local sprite, as ADR-0002 allows.
- The account view's theme cards become the `theme-switch` component, with the app name `auth`.
  The early theme script reads the new key, and the old `auth_theme` value migrates once.
  The server-side `theme` user setting stays, and wins when it is applied at sign-in.
- All 35 local stylesheets go.
  The two mail stylesheets are unused, since the mail templates carry inline styles.

---

## Shell Settings
Every page follows [ADR-0004](../adrs/ADR-0004-app-shell.md) and a skeleton from [components.md](../specs/components.md#app-shell):
- Public pages, such as sign-in and create account: the narrow page without navigation.
  They use `app--scroll-page` and `app--width-narrow`, with the brand in the top bar.

- Signed-in pages, such as the dashboard, account, notifications, and help: the page with menu navigation.
  The menu holds Dashboard, Notifications, Help, and, for admins, Admin Console.
  The account menu sits at the end of the top bar and replaces the action bar's Account and Sign Out.
  Per-screen actions of the old context action bar move into the shell's action bar.

- Admin Console: the workspace setup without the bottom bar and the action bar.
  It has a sidebar, a top bar, the main area, and the side panel, with `app--scroll-main`.

---

## Admin Console
The console copies the layout and behavior of ToDo's console; this section lists only auth's settings and differences.

### Shared Behavior
- It is a static app in `webapp/admin/`, served at `/admin/`, with hash routes.
- The sidebar holds the title Admin Console, the screens, and Back to Auth pinned to the bottom.
- The top bar holds the screen title and the account menu; there is no Refresh button.
- Filters live in the query of the hash route, so a reload or a shared address restores them.
- Selecting a row opens its details in the side panel, and the row sets `aria-selected`.
- Destructive actions ask in place with an inline confirmation, never in a dialog.
- Every state shows an icon shape and a word, never color alone.
- Times show as local `YYYY-MM-DD HH:MM:SS`.
- The list endpoints return every row, so filters and the pager work on the loaded list.
- Every screen shows loading, empty, and failed states; a failed request offers Retry.

### Sign-In
- auth is its own identity provider, so the console reuses the app's session on the same origin.
- On load it asks `GET /api/auth-token` with the session cookie, as the app's automatic sign-in does.
- Without a session it sends the browser to `/sign-in` with a return URL of `/admin/`.
  The sign-in view loads return URLs outside the app's routes with a full page navigation.
  Until the old view goes, its route stops matching `/admin/`, so only `/admin` opens it.
- A signed-in user without the `admin` realm sees a short message and a link back to auth.
- The server keeps enforcing the realm on every admin endpoint.

### Screens
- Overview, `#/overview`: server facts from `GET /api/server`, reloaded every 30 seconds while visible.
  The version links to the Changelog screen.

- Users, `#/users`: ID, name, email, realms as chips, last active, and status.
  Marked accounts show a warning chip; their panel offers Restore in place of Mark for deletion.
  The panel holds account fields, realm checkboxes, application access, credentials, facts, and a danger zone.
  Each linked credential deletes in place.
  The panel also sets, resets, or removes the password, and exports the account's data.
  An admin cannot remove their own `admin` realm or delete their own account.
  New user opens an empty panel, replacing the `/users/new` route.

- Sessions, `#/sessions`: the tokens from `GET /api/tokens`, with type and state filters on the loaded list.
  Each row revokes in place; the admin's own session reads "Your session" and cannot be revoked.
  Multi-select with bulk actions revokes the selected tokens, one `DELETE /api/tokens/{{id}}` each.
  Remove expired confirms in place, then calls `DELETE /api/tokens?expired=true`.
  Since auth v3.4.0, that request deletes only expired tokens.

- Applications, `#/applications`: name, base URL, registration time, and last update.
  The panel edits name, description, base, logo, and redirect URLs, and manages user grants.
  Generate new secret confirms in place, then shows the secret once in a copyable field.
  Register application opens an empty panel, replacing the `/applications/new` route.
  The panel's danger zone deletes the application after an in-place confirmation.

- System events, `#/system-events`: the audit log with type, severity, and limit filters.
  A toggle per row reveals the metadata as pretty-printed JSON.

- Logs, `#/logs`: the server log buffer, with level and message filters on the loaded entries.
  The old client log showed the app's own in-memory log, which a separate console cannot read.
  So the Logs screen shows server entries only, as ToDo's console does.

- Broadcasts, `#/broadcasts`: the compose form, a live preview, and the history with Retract.
  auth has no broadcast list endpoint, so the history comes from system events.
  It pairs `broadcast-published` and `broadcast-retracted` events through their metadata, as the old console does.
  Audiences stay as auth offers them: everyone, realms, or selected accounts.
  Expiry stays as an optional field.

- Changelog, `#/changelog`: auth's `CHANGELOG.md`, parsed by the app's existing changelog parser.

### Removed
- Recycle Bin: marked accounts stay visible in Users, as in ToDo's console.
- Workbench: the action, view, and REST runner tools leave with no replacement.
- PWA and service worker controls on the Overview.
- The tab counts in the navigation.
- The app routes `/admin`, `/users/...`, and `/applications/...`, which redirect to the console's routes.

---

## Other Screens
- The home view becomes the public start page, with Sign In and Create Account.
- Sign in and create account move onto fields, forms, segmented controls, and banners.
- The dashboard becomes a grid of link cards, one per granted application.
- Notifications move onto rows, badges, chips, and multi-select with bulk actions.
- Help moves onto collapsibles, chips, and cards; its changelog section stays.
- Account moves onto cards, fields, the theme switch, and inline confirmations.
- The notification bar becomes banners and toasts in the shell's areas.
- The app error page becomes an empty state with a way back to the dashboard.

Service worker:
- auth keeps its worker and adopts the package's `sw-update.js` update prompt.
- Every task that adds or deletes app files updates the worker's precache list in the same change.
- The console's files stay out of the precache list; the console always loads from the network.

---

## Components
From the package, as released today:
- Button, icon button, field, form, checkbox, chip, segmented control, and switch.
- Banner, toast, empty state, loading pattern, badge, and inline confirmation.
- Table, list with definition rows, card, collapsible, tabs, multi-select, and theme switch.
- Account menu, avatar, icon, and the shell.

Promoted from ToDo's console, because auth is the second app that needs them:
- Toolbar: filter fields in one wrapping row above a table.
- Data table additions: hover feedback and a selected row marked beyond color.
- Pager: a status text with First, Previous, Next, and Last buttons.
- Detail panel: a header, a scrolling body, and a danger zone inside the side panel.
- Facts: label and value pairs in a bordered grid, as a variant of the definition list.
- Status chip: a chip with an icon and a word for severities and states.

This follows the sharing rule of [ADR-0003](../adrs/ADR-0003-components-and-patterns.md).
The promotion task fixes names by [naming.md](../specs/naming.md), so ToDo's class names may change.
It also updates [components.md](../specs/components.md): pagination leaves Not in the Package.
The table section gains the selected row state, which it rules out today.

App-local in auth:
- The broadcast preview, the JSON metadata block, and the changelog release block.
- The app-launcher tile layout of the dashboard, if link cards do not cover it.

---

## Out of Scope
- Mail templates: they carry inline styles, as mail clients need.
- Server endpoints: the console uses today's API, apart from serving `webapp/admin/`.
- Narrow layouts of the console.
- Offline use, which auth rejects as a non-goal.

---

## Proposed Tasks
auth.server tasks start once the promotion is released; they do not wait for T0046.
Every sibling task is created only after the user approves this plan.

In this repository, created on 2026-11-15:
- T0047: promote the toolbar, the pager, and the data table row states.
- T0048: promote the detail panel, facts, and status chip, and add an admin console example page.
  It ends with a minor release, published with the user's approval.

In auth.server, created on 2026-11-15:
- T0222: fix the `expired` filter of the token and credential routes; done in v3.4.0.

In auth.server, created on 2026-11-16, each with a technical spec:
- T0224: vendor the release, and add the conformance check and Playwright browser tests.
  It stays suspended until support.webapp publishes the release with T0047 and T0048.
- T0225: write the console spec and wireframes, with an inventory of every old console feature.
- T0226: build the console shell, sign-in, Overview, and Changelog.
- T0227, T0228, and T0229, which may run in parallel after T0226:
  Users and Sessions; Applications; and System events, Logs, and Broadcasts.
- T0230: remove the old admin, user, and application views, and redirect their routes.
- T0231: move the SPA's shell, menu, notification bar, home view, and error page.
- T0232 and T0233, in parallel: sign-in, create account, and dashboard; and the account view.
- T0234: move notifications and help, then delete the remaining stylesheets and Font Awesome.
  auth is not released between T0231 and T0234, since its screens look mixed until then.

In todos.webapp and todos.server, after the release:
- todos.webapp vendors the release, since todos.server's console loads that copy.
- todos.server's console swaps its local copies for the promoted components.

---

## Verification
- The console's browser tests cover each screen and state at 1440 px, in both themes.
- They also cover the 401 and 403 responses, an empty page, and a failing request.
- The other screens get browser checks at 390 and 1440 px, in both themes.
- auth passes the vendored conformance check in CI.
- auth records before and after screenshots of each screen.
  This is a redesign, so the lossless switch proof does not apply; every difference is deliberate.

---

## Open Points
- The server serves `index.html` as a fallback; the shell task checks that `/admin/` serves the console.
- Loaded lists may grow large; server-side paging would need its own auth.server task later.
- `GET /api/tokens` marks no current token; the console compares IDs with its own session token.

---

## Evidence
- auth facts are `[V:C]`: first-party code read on 2026-11-15 at auth.server commit `fdbb278`.
  Sources: `webapp/index.html`, `webapp/css/auth.css`, `webapp/js/auth.mjs`, `docs/single-page-app.md`, and `docs/web-api.md`.
  Endpoint behavior comes from the `deleteTokens`, `getAllUserAccounts`, `getAllApplications`, and logs routes.
- ToDo's console facts are `[V:C]`: todos.server's `admin/` and admin spec, read on 2026-11-15 at commit `4173976`.
- Research context: written by Claude Opus 5.5 on 2026-11-15, knowledge cutoff June 2026.
