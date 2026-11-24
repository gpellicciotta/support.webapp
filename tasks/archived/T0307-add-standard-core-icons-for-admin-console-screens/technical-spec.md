## Technical Specifications

### Scope
Promote Auth's admin console screen icons (`../auth/webapp/admin/js/ui.mjs` and `main.mjs`) into `support.webapp` as standard core icons in `src/contract.json` and every look sprite, and wire them as the default icons for the seven admin console screens.

### Screen-to-Icon Mapping
| Admin screen   | Module                     | Core icon ID      | SVG symbol body (`viewBox="0 0 24 24"`, `currentColor` stroke)                                                |
| :------------- | :------------------------- | :---------------- | :------------------------------------------------------------------------------------------------------------ |
| Overview       | `src/js/admin-overview.js` | `icon-overview`   | `<circle cx="12" cy="12" r="9"/><path d="M12 12l4-4M7 16h10"/>`                                               |
| Users          | `src/js/admin-users.js`    | `icon-people`     | Already present in all four look sprites; add `icon-people` to `src/contract.json` `icons`.                   |
| Sessions       | `src/js/admin-sessions.js` | `icon-sessions`   | `<circle cx="8" cy="15" r="4"/><path d="M11 12l9-9M16 7l3 3"/>`                                               |
| System events  | `src/js/admin-system-events.js` | `icon-events` | `<path d="M3 12h4l3-7 4 14 3-7h4"/>`                                                                         |
| Logs           | `src/js/admin-logs.js`     | `icon-logs`       | `<rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 8h8M8 12h8M8 16h5"/>`                           |
| Broadcasts     | `src/js/admin-broadcasts.js` | `icon-broadcast` | `<path d="M4 10v4h3l6 4V6L7 10H4zM17 9a4 4 0 0 1 0 6M19.5 6.5a8 8 0 0 1 0 11"/>`                            |
| Changelog      | `src/js/admin-changelog.js` | `icon-note`      | Already present in all four look sprites; add `icon-note` to `src/contract.json` `icons`.                     |

### Requirements
1. Add `icon-overview`, `icon-people`, `icon-sessions`, `icon-events`, `icon-logs`, `icon-broadcast`, and `icon-note` to `"icons"` in `src/contract.json`.
2. Add `<symbol id="icon-overview">`, `<symbol id="icon-sessions">`, `<symbol id="icon-events">`, `<symbol id="icon-logs">`, and `<symbol id="icon-broadcast">` to `src/looks/neutral/icons.svg`, `src/looks/warm/icons.svg`, `src/looks/bright/icons.svg`, and `src/looks/_template/icons.svg`.
3. Update default `icon` values in `src/js/admin-overview.js` (`'overview'`), `src/js/admin-sessions.js` (`'sessions'`), `src/js/admin-system-events.js` (`'events'`), `src/js/admin-logs.js` (`'logs'`), and `src/js/admin-broadcasts.js` (`'broadcast'`); keep `admin-users.js` (`'people'`) and `admin-changelog.js` (`'note'`).
4. Add the five new glyphs to `#icon` in `src/demo/visual-style-gallery.html` and update the admin console sidebar links in `src/demo/shell-admin-console.html`.
5. Document the new core icons in `docs/specs/visual-style-guide.md` and updated screen defaults in `docs/specs/components.md` and `CHANGELOG.md`.

### Declared Files
- src/contract.json
- src/looks/neutral/icons.svg
- src/looks/warm/icons.svg
- src/looks/bright/icons.svg
- src/looks/_template/icons.svg
- src/js/admin-overview.js
- src/js/admin-sessions.js
- src/js/admin-system-events.js
- src/js/admin-logs.js
- src/js/admin-broadcasts.js
- src/demo/visual-style-gallery.html
- src/demo/shell-admin-console.html
- docs/specs/visual-style-guide.md
- docs/specs/components.md
- tests/unit/icon.test.js
- tests/unit/admin-console.test.js

### Tests
- Unit: `tests/unit/icon.test.js` asserts all seven admin screen icon IDs are listed in `contract.json` and present in every look sprite; admin unit tests assert default screen `icon` properties (`'overview'`, `'people'`, `'sessions'`, `'events'`, `'logs'`, `'broadcast'`, `'note'`).
- Integration: `tests/e2e/admin-console.spec.js` and `tests/e2e/page.spec.js` (gallery `#icon` checks) pass across desktop/mobile and light/dark via `python scripts/devops.py check`.

Completion check: `python scripts/devops.py check`
Size estimate: 16 files, 150 lines
Size note: Crosses the 8-file typical line because adding core icons requires `contract.json`, four look sprites, five admin modules, demos, specs, and tests together.
