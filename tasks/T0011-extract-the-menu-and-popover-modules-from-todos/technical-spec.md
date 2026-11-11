# T0011 Technical Specification
Extract the menu and popover modules from todos.webapp as they are, with keyboard support and anchoring.

---

## Approach
- Reference: [Menus, Popovers, Tooltips, and Collapsibles](../../../docs/analysis/ui-design-comparison.md#menus-popovers-tooltips-and-collapsibles).
- This task is an extraction only; behavior changes belong to the native popover task.
- Both modules import `tabbableIn` from the shared `src/js/focus.js`.

---

## Declared Files
- `src/css/components/menu.css`
- `src/css/components/popover.css`
- `src/js/menu.js`
- `src/js/popover.js`
- `src/css/style.css`
- `src/demo/visual-style-gallery.html`
- `tests/unit/menu.test.js`
- `tests/unit/popover.test.js`
- `tests/e2e/overlays.spec.js`
- `docs/specs/visual-style-guide.md`
- `CHANGELOG.md`

Size estimate: 11 files, 800 lines
Size note: Menus open through the popover anchoring, so the two modules extract and test together.

### Tests
- Unit: `menu.test.js` and `popover.test.js` check roving focus, type-ahead, Escape, and anchor positions.
- Integration: `overlays.spec.js` opens gallery menus at 390 and 1440 px and checks anchoring stays inside the viewport.

Completion check: `npx playwright test tests/e2e/overlays.spec.js`, exit code 0
