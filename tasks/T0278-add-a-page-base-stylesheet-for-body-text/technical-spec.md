## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Page Base Stylesheet".
- `webapp/styles/app.css` lines 10 to 47 and `webapp/admin/css/admin.css` lines 13 to 58.
- Repeats: todos.webapp `src/css/style.css`, ToDo `admin/css/admin.css`, meteo `css/style.css`.

### Behavior To Keep
- Element rules use public tokens only: `--font-body`, `--font-heading`, `--font-mono`, text and link colors.
- Load order: after `reset.css`, before components, so a component class still wins.
- Record in ADR-0003 that the package now styles bare elements, and how an app opts out.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/css/style.css
- docs/adrs/ADR-0003-components-and-patterns.md
- docs/specs/components.md
- src/demo/visual-style-gallery.html

Added files are not counted: the new partial and its tests.

### Tests
- Unit: the entry imports the partial after `reset.css`, and the partial uses public tokens only.
- Integration: in each look and theme, body text, a heading, a link, and code compute the look's fonts and colors; a `hidden="until-found"` panel keeps its box.

Completion check: `python scripts/devops.py check`, with the new tests green.
