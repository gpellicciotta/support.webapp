# T0005 Technical Specification
Build the visual style gallery with look and theme switchers, token specimens, and the browser verifier.

---

## Approach
- The look switcher swaps the look stylesheet link; the theme switch sets `data-theme` on the root element.
- Specimens use classes and tokens only, never inline styles, as the ui-guidelines require.
- The verifier checks HTTP 200, stylesheets loaded, console errors, failed requests, and horizontal scroll.
- It also checks rendered contrast, 44 px targets, and visible focus on interactive specimens.

---

## Declared Files
- `src/demo/visual-style-gallery.html`
- `src/demo/gallery.css`
- `src/demo/gallery.js`
- `tests/unit/gallery.test.js`
- `tests/e2e/verify-ui.spec.js`
- `docs/specs/visual-style-guide.md`
- `docs/index.md`
- `CHANGELOG.md`

Size estimate: 8 files, 700 lines
Size note: The verifier needs the gallery to test, and the gallery needs the verifier as its acceptance check.

### Tests
- Unit: `gallery.test.js` asserts that the switcher swaps the look link and sets `data-theme` for each choice.
- Integration: `verify-ui.spec.js` loads the gallery at 390 and 1440 px in light and dark and runs every verifier check.

Completion check: `npx playwright test tests/e2e/verify-ui.spec.js`, exit code 0
