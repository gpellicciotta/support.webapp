## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Shell Additions".
- `webapp/styles/app.css` lines 79 to 118 and 175 to 177; `webapp/admin/css/admin.css` lines 64 to 69.
- ToDo `admin/css/admin.css` and `admin/js/main.mjs` use the same end list.

### Behavior To Keep
- The end list stays at the sidebar bottom when open, as an icon rail, and as a drawer.
- A badge in a nav entry sits at its end and keeps its text in the entry's accessible name.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/css/shell.css
- docs/specs/components.md
- src/demo/shell-admin-console.html
- src/demo/shell-portal.html

Added files are not counted: tests.

### Tests
- Unit: the contract and naming checks accept the new modifier.
- Integration: in the admin console demo, the end list sits at the sidebar bottom in all three nav states, and a hidden top bar part is not displayed.

Completion check: `python scripts/devops.py check`, with the new tests green.
