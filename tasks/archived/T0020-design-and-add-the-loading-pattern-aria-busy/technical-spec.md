# T0020 Technical Specification

### Declared Files
- src/css/components/loading.css
- src/css/style.css
- src/demo/visual-style-gallery.html
- docs/specs/components.md
- docs/specs/visual-style-guide.md
- tests/unit/loading.test.js
- tests/e2e/loading.spec.js
- CHANGELOG.md

Size estimate: 8 files, 210 lines

**[Decided]** Use static skeleton rows only for slow lists; omit animation in every motion preference.
**[Decided]** Place the polite status outside the busy content region to avoid deferring progress announcements.
Applications own request timing, localized status text, content replacement, and aria-busy transitions.
Show skeletons only after an application determines a list request is slow; there is no universal timing threshold.
Keep existing content during refresh when useful. Clear busy state on success, empty results, and failure.
Replace placeholders with content, an empty state, or an error; update the existing status without moving focus.

### Tests
- Unit: Assert status placement, polite semantics, skeleton exclusion for ordinary loads, and completed markup.
- Integration: Render specimens across all looks, light/dark, phone/desktop, and motion preferences; verify layout and static skeletons.
- Integration: Run the gallery verifier for contrast, stylesheets, focus, overflow, and runtime errors.

Completion check: `python scripts/devops.py check`, exit code 0
