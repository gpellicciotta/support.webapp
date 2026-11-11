# T0031 Technical Specification
Design and add the list and data table components on native list and table elements

---

## Approach
- Reference: family-portal's `.row-list` definition rows and todos.webapp's row base.
- Wide tables scroll inside their own container, never the page.

---

## Declared Files
- `src/css/components/list.css`
- `src/css/components/table.css`
- `src/css/style.css`
- `src/demo/visual-style-gallery.html`
- `tests/e2e/list.spec.js`
- `tests/e2e/table.spec.js`
- `docs/specs/visual-style-guide.md`
- `docs/specs/components.md`
- `CHANGELOG.md`

Size estimate: 9 files, 450 lines
Size note: Lists and tables share the row base and one gallery section; each key keeps its own spec.

### Tests
- Unit test: none (CSS-only components; the static token test covers their tokens)
- Integration: `list.spec.js` and `table.spec.js` check header semantics, captions, and contained horizontal scroll at 390 px.

Completion check: `npx playwright test tests/e2e/list.spec.js tests/e2e/table.spec.js`, exit code 0
