## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Theme Boot Script and Account Theme Sync".
- `webapp/index.html` lines 12 to 28 (boot script and `auth_theme` migration).
- `webapp/js/app.mjs` `themeOfSettings`, `applyTheme`, and `applyServerTheme`; `account-view.mjs` `saveTheme`.

### Behavior To Keep
- The boot script stays a few classic-script lines the template can inline; it must never throw.
- Sync takes `load()` and `save(theme)` callbacks, so the package knows no account API.
- The old `default` value reads as `system`; unknown values are ignored.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/js/theme-switch.js
- src/contract.json
- docs/specs/components.md
- template/src/index.html

Added files are not counted: tests.

### Tests
- Unit: settings parsing for lists, objects, and `default`; the boot script applies a stored theme and migrates a legacy key once.
- Integration: a page reloaded with a stored dark theme has `data-theme="dark"` before any module runs.

Completion check: `python scripts/devops.py check`, with the new tests green.
