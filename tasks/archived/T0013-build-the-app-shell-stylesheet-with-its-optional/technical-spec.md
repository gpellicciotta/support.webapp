# T0013 Technical Specification
Build the app shell stylesheet with its optional areas, scroll modes, width options, and demo pages.

---

## Approach
- The grid drops absent areas with `:has()`; one layout breakpoint sits at 64rem.
- Below 64rem the sidebar hides, the bottom bar shows, and the side panel opens as a sheet.
- Bars pad with safe-area insets; `shell.css` holds every fixed and sticky position.
- The floating action button sits in the overlay layer; a skip link leads to the main area.

---

## Declared Files
- `src/css/shell.css`
- `src/css/style.css`
- `src/demo/shell-todos.html`
- `src/demo/shell-counters.html`
- `src/demo/shell-meteo.html`
- `src/demo/shell-family-portal.html`
- `src/demo/visual-style-gallery.html`
- `tests/e2e/shell.spec.js`
- `docs/specs/visual-style-guide.md`
- `CHANGELOG.md`

Size estimate: 10 files, 750 lines
Size note: The shell stylesheet needs its four demo pages as fixtures; each page proves one adopter fits.

### Tests
- Unit test: none (CSS and markup only; the browser test covers the layout)
- Integration: `shell.spec.js` checks each demo page at 390 and 1440 px: present and absent areas, sticky bars, scroll owner, and overflow.

Completion check: `npx playwright test tests/e2e/shell.spec.js`, exit code 0
