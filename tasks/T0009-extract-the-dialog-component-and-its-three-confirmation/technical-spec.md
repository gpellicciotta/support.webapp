# T0009 Technical Specification
Extract the dialog component and its three confirmation tiers from todos.webapp.

---

## Approach
- Reference: [Dialogs and Confirmations](../../../docs/analysis/ui-design-comparison.md#dialogs-and-confirmations).
- The in-place tier uses an `.inline-confirm` block; the typed tier reuses the field component.
- todos.webapp imports `tabbableIn` from its popover module; here it moves to a shared `src/js/focus.js`.

---

## Declared Files
- `src/css/components/dialog.css`
- `src/js/dialog.js`
- `src/js/focus.js`
- `src/css/style.css`
- `src/demo/visual-style-gallery.html`
- `tests/unit/dialog.test.js`
- `tests/e2e/dialog.spec.js`
- `docs/specs/visual-style-guide.md`
- `CHANGELOG.md`

Size estimate: 9 files, 650 lines
Size note: The dialog module and its styles form one component, and its tests need both.

### Tests
- Unit: `dialog.test.js` checks focus trap, Escape, focus return, and the value `confirmDialog` resolves with.
- Integration: `dialog.spec.js` opens gallery dialogs at 390 and 1440 px and checks the sheet layout, trap, and Escape.

Completion check: `npx playwright test tests/e2e/dialog.spec.js`, exit code 0
