# T0039 Technical Specification
Rename the per-app shell demo pages to generic examples, updating the gallery links and browser specs.

---

## Declared Files
Renamed files do not count; the four demo pages move with `git mv`.
- src/demo/visual-style-gallery.html
- src/demo/gallery.js
- tests/e2e/shell.spec.js
- tests/e2e/fab.spec.js
- tests/e2e/verify-ui.spec.js
- docs/specs/visual-style-guide.md

Size estimate: 6 files, 120 lines

### Tests
- Unit: none (no module behavior changes; the gallery link list is covered by the browser specs)
- Integration: `npx playwright test tests/e2e/shell.spec.js tests/e2e/fab.spec.js tests/e2e/verify-ui.spec.js` first fails on the new page names, then passes.

Completion check: `python scripts/devops.py check`, exit code 0
