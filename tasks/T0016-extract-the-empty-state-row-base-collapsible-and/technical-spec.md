# T0016 Technical Specification
Extract the empty state and the row base components from todos.webapp.

---

## Approach
- Reference: [Empty States](../../../docs/analysis/ui-design-comparison.md#empty-states-loading-progress-and-skeletons) and [Lists, Rows, Cards, and Tiles](../../../docs/analysis/ui-design-comparison.md#lists-rows-cards-and-tiles).
- Task rows stay app-local in todos.webapp; only the row layout and its trailing actions cell move.

---

## Declared Files
- `src/css/components/empty-state.css`
- `src/css/components/row.css`
- `src/css/style.css`
- `src/demo/visual-style-gallery.html`
- `tests/e2e/empty-state.spec.js`
- `tests/e2e/row.spec.js`
- `docs/specs/visual-style-guide.md`
- `CHANGELOG.md`

Size estimate: 8 files, 370 lines

### Tests
- Unit test: none (CSS-only components without modules; the static token test covers their tokens)
- Integration: `row.spec.js` and `empty-state.spec.js` check the row layout at narrow and wide container widths and the two-action limit.

Completion check: `npx playwright test tests/e2e/empty-state.spec.js tests/e2e/row.spec.js`, exit code 0
