# T0007 Technical Specification
Extract the button, icon button, banner, chip, and segmented control components from todos.webapp.

---

## Approach
- Reference: [Buttons](../../../docs/analysis/ui-design-comparison.md#buttons) and [Chips, Toggles, and Segmented Controls](../../../docs/analysis/ui-design-comparison.md#chips-toggles-and-segmented-controls).
- Banners use `role="status"` and `role="alert"`, in danger, success, and warning variants.
- Button radius comes from `--radius-button`, chips from `--radius-chip`.

---

## Declared Files
- `src/css/components/button.css`
- `src/css/components/banner.css`
- `src/css/components/chip.css`
- `src/css/components/segmented.css`
- `src/css/style.css`
- `src/demo/visual-style-gallery.html`
- `tests/e2e/controls.spec.js`
- `docs/specs/visual-style-guide.md`
- `CHANGELOG.md`

Size estimate: 9 files, 550 lines
Size note: Small CSS-only partials that share one gallery section and one browser test.

### Tests
- Unit test: none (CSS-only components without modules; the static token test covers their tokens)
- Integration: `controls.spec.js` checks states, 44 px targets, focus rings, and keyboard use of the segmented control.

Completion check: `npx playwright test tests/e2e/controls.spec.js`, exit code 0
