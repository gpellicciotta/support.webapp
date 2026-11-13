# T0033 Technical Specification
Design and add multi-select with checkbox rows, range selection, and a bulk action bar

---

## Approach
- Reference: [Multi-select, Bulk Actions, Delete, Undo, and Recycle Bin](../../../../docs/analysis/ui-design-comparison.md#multi-select-bulk-actions-delete-undo-and-recycle-bin).
- Bulk delete follows the shared delete pattern: move to the bin and offer Undo.

---

## Declared Files
- `src/css/components/selection.css`
- `src/js/selection.js`
- `src/css/style.css`
- `src/demo/visual-style-gallery.html`
- `tests/unit/selection.test.js`
- `tests/e2e/selection.spec.js`
- `docs/specs/visual-style-guide.md`
- `docs/specs/components.md`
- `CHANGELOG.md`

Size estimate: 9 files, 650 lines
Size note: The selection model, its bulk bar, and their tests form one behavior; a split leaves either untested.

### Tests
- Unit: `selection.test.js` checks single, range, and all selection, the count announcement, and keyboard use.
- Integration: `selection.spec.js` selects gallery rows by pointer and keyboard at 390 and 1440 px and runs a bulk action.

Completion check: `npx vitest run tests/unit/selection.test.js`, exit code 0
