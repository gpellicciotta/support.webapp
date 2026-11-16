# T0039 Technical Specification
Rename the per-app shell demo pages to generic examples, updating the gallery links and browser specs.

---

## Declared Files
Move the four demo pages with `git mv`; update their titles, headings, and app-specific labels.
- src/demo/shell-list-editor.html
- src/demo/shell-toolbar.html
- src/demo/shell-single-screen.html
- src/demo/shell-portal.html
- src/demo/visual-style-gallery.html
- tests/e2e/shell.spec.js
- tests/e2e/fab.spec.js
- tests/e2e/verify-ui.spec.js
- docs/specs/visual-style-guide.md
- CHANGELOG.md

Size estimate: 10 files, 180 lines

### Tests
- Unit: none (no module behavior changes; the gallery link list is covered by the browser specs)
- Integration: Shell, verifier, and floating action button specs retain behavior coverage at each generic page URL.
- Integration: Gallery cards link to all four generic pages and expose descriptive layout names.
- Integration: The single-screen example switches between Start, Details, and Settings with exactly one visible section.
- Integration: Hold a required look import; the verifier must wait for release before inspecting the page.
- Red phase: Run the gallery-link test against renamed URL expectations before moving the pages.
- Visual: Capture gallery cards and every shell before and after at 390 and 1440 px, light and dark.

Completion check: `python scripts/devops.py check`, exit code 0
