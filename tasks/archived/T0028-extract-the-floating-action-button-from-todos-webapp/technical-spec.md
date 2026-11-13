# T0028 Technical Specification
Extract the floating action button from todos.webapp into the overlay layer of the shell

---

## Approach
- Reference: [Buttons](../../../../docs/analysis/ui-design-comparison.md#buttons), todos.webapp `.fab` in `app-chrome.css`.
- The shell owns the fixed position; the component partial holds no `position: fixed`.

---

## Declared Files
- `src/css/components/fab.css`
- `src/css/shell.css`
- `src/css/style.css`
- `src/demo/visual-style-gallery.html`
- `src/demo/shell-todos.html`
- `tests/e2e/fab.spec.js`
- `docs/specs/visual-style-guide.md`
- `docs/specs/components.md`
- `CHANGELOG.md`

Size estimate: 7 files, 250 lines

### Tests
- Unit test: none (a CSS-only component; the static token test covers its tokens)
- Integration: `fab.spec.js` checks the 44 px target, the label, and that the button stays inside the viewport at 390 and 1440 px.

Completion check: `npx playwright test tests/e2e/fab.spec.js`, exit code 0
