# Auth Redesign Plan
How auth moves onto the design system, and how its Admin Console is rebuilt after ToDo's console.

- Status: Proposed in T0025, awaiting review.
- Date: 2026-11-15.
- **[Decided]** with the user on 2026-11-15: this plan covers auth only; T0046 plans counters.
- **[Decided]** with the user on 2026-11-15: auth uses the `neutral` look, as ToDo's does.
- **[Decided]** with the user on 2026-11-15: the Admin Console becomes a separate app, like ToDo's console.
- **[Decided]** with the user on 2026-11-15: the Admin Console targets desktop widths only.
- **[Decided]** with the user on 2026-11-15: the Recycle Bin, Workbench, and PWA controls are dropped.
- **[Decided]** with the user on 2026-11-15: every other auth screen also moves to the look and the shell.

---

## Context
- auth is a Java server that serves a no-build ES module app from `webapp/`.
- The app styles itself with 35 local stylesheets copied from the support.js lineage.
- It loads Roboto from Google Fonts and icons from a Font Awesome kit.
- Its shell has a header action bar, a main menu, a context action bar, and a footer.
- The Admin Console is the `/admin` route of the app, a 3751-line view with nine tabs.
  The tabs are Overview, Users, Sessions, Applications, Broadcasts, Events, Recycle Bin, Logs, and Workbench.
- Users and applications open separate detail and create routes, such as `/users/{{id}}`.
- ToDo's Admin Console is a separate desktop app in todos.server's `admin/` folder.
  It links the vendored `neutral` look and adds admin-only components in its own `admin.css`.
  Its [admin spec](https://github.com/gpellicciotta/todos.server/blob/main/docs/specs/admin-spec.md) defines its screens and behavior.

---

## Look
- auth imports `looks/neutral/index.css` from its vendored copy, `webapp/vendor/design/`.
- Inter from the look replaces Roboto; the look's sprite replaces Font Awesome.
- auth keeps its logo, app icons, and the Google, GitHub, and Microsoft logos as images.
- Glyphs the core sprite lacks go into an app-local sprite, as ADR-0002 allows.
- The account view's theme cards become the `theme-switch` component, keeping auth's stored preference.
- The 35 local stylesheets go, apart from the two mail stylesheets; see Out of Scope.

---

## Shell Settings
Every page follows [ADR-0004](../adrs/ADR-0004-app-shell.md) and a skeleton from [components.md](../specs/components.md#app-shell):
- Public pages, such as sign-in and create account: the narrow page without navigation.
  They use `app--scroll-page` and `app--width-narrow`, with the brand in the top bar.

- Signed-in pages, such as the dashboard, account, notifications, and help: the page with menu navigation.
  The menu holds Dashboard, Notifications, Help, and, for admins, Admin Console.
  The account menu sits at the end of the top bar and replaces the action bar's Account and Sign Out.

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
- Times show as local `YYYY-MM-DD HH:MM:SS`; screens show no totals the API does not return.
- Every screen shows loading, empty, and failed states; a failed request offers Retry.

### Sign-In
- auth is its own identity provider, so the console reuses the app's session on the same origin.
- On load it asks `GET /api/auth-token` with the session cookie, as the app's automatic sign-in does.
- Without a session it sends the browser to `/sign-in` with a return URL of `/admin/`.
- A signed-in user without the `admin` realm sees a short message and a link back to auth.
- The server keeps enforcing the realm on every admin endpoint.

### Screens
- Overview, `#/overview`: server facts from `GET /api/server`, reloaded every 30 seconds while visible.
  The version links to the Changelog screen.

- Users, `#/users`: ID, name, email, realms as chips, last active, and status.
  Marked accounts show a warning chip; their panel offers Restore in place of Mark for deletion.
  The panel holds account fields, realm checkboxes, application access, facts, and a danger zone.
  An admin cannot remove their own `admin` realm or delete their own account.
  New user opens an empty panel, replacing the `/users/new` route.

- Sessions, `#/sessions`: the tokens from `GET /api/tokens`, with type and expired filters.
  Each row revokes in place; the admin's own session reads "Your session" and cannot be revoked.
  Remove expired tokens deletes all expired tokens in one confirmed request.

- Applications, `#/applications`: name, base URL, registration time, and last update.
  The panel edits name, description, base, logo, and redirect URLs, and manages user grants.
  Generate new secret confirms in place, then shows the secret once in a copyable field.
  Register application opens an empty panel, replacing the `/applications/new` route.

- System events, `#/system-events`: the audit log with type, severity, and limit filters.
  A toggle per row reveals the metadata as pretty-printed JSON.

- Logs, `#/logs`: the server log buffer with level and message filters, which the endpoint applies.
  The client log of the old console is dropped with the Workbench.

- Broadcasts, `#/broadcasts`: the compose form, a live preview, and the history with Retract.
  Audiences stay as auth offers them: everyone, realms, or selected accounts.
  Expiry stays as an optional field.

- Changelog, `#/changelog`: auth's `CHANGELOG.md`, parsed by the app's existing changelog parser.

### Removed
- Recycle Bin: marked accounts stay visible in Users, as in ToDo's console.
- Workbench: the action, view, and REST runner tools leave with no replacement.
- PWA and service worker controls on the Overview.
- The tab counts, which the API cannot provide without loading every list.
- The app routes `/admin`, `/users/...`, and `/applications/...`, which redirect to the console's routes.

---

## Other Screens
- Sign in and create account move onto fields, forms, segmented controls, and banners.
- The dashboard becomes a grid of link cards, one per granted application.
- Notifications move onto rows, badges, chips, and multi-select with bulk actions.
- Help moves onto collapsibles, chips, and cards; its changelog section stays.
- Account moves onto cards, fields, the theme switch, and inline confirmations.
- The notification bar becomes banners and toasts in the shell's areas.

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

App-local in auth:
- The broadcast preview, the JSON metadata block, and the changelog release block.
- The app-launcher tile layout of the dashboard, if link cards do not cover it.

---

## Out of Scope
- Mail templates and their two stylesheets: mail clients need inline styles, not the shell.
- Server endpoints: the console uses today's API, apart from serving `webapp/admin/`.
- Narrow layouts of the console.
- Offline use, which auth rejects as a non-goal.

---

## Proposed Tasks
Per the roadmap, sibling tasks wait until this repository's tasks for the phase are complete.
Every sibling task is created only after the user approves this plan.

In this repository:
- Promote the toolbar, pager, data table additions, detail panel, facts, and status chip.
  Add an admin console example page to the gallery, with browser checks at 1440 px.
- Release the promotion as a minor version, with the user's approval.

In auth.server, in this order:
- Vendor the release, and run the conformance check in the devops script and CI.
- Write the Admin Console spec and wireframes, after ToDo's spec, from this plan.
- Build the console shell, sign-in, Overview, and Changelog, with browser tests against mocked endpoints.
- Build the Users and Sessions screens with their panels.
- Build the Applications screen with its panel, grants, and secret rotation.
- Build the System events, Logs, and Broadcasts screens.
- Remove the old admin, user, and application views, and redirect their routes to the console.
- Move the app shell, public pages, and dashboard onto the look and the shell.
- Move the account, notifications, and help screens onto the system, then delete the local stylesheets.

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
- Users and Applications page by bookmark dates, not by ToDo's page envelope.
  The spec task settles how the pager maps onto them.
- `GET /api/tokens` marks no current token; the console compares IDs with its own session token.

---

## Evidence
- auth facts are `[V:C]`: first-party code read on 2026-11-15 at auth.server commit `fdbb278`.
  Sources: `webapp/index.html`, `webapp/css/auth.css`, `webapp/js/auth.mjs`, `docs/single-page-app.md`, and `docs/web-api.md`.
- ToDo's console facts are `[V:C]`: todos.server's `admin/` and admin spec, read on 2026-11-15 at commit `4173976`.
- Research context: written by Claude Opus 5.5 on 2026-11-15, knowledge cutoff June 2026.
