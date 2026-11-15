# T0047 Technical Specification
Promote the toolbar, pager, and data table row states from ToDo's admin console.

---

## Source
The parts come from todos.server's [admin.css](https://github.com/gpellicciotta/todos.server/blob/main/admin/css/admin.css), read on 2026-11-15 at commit `4173976`:
- `.toolbar`: filter fields in one wrapping row above a table, aligned to their bottom edge.
- `.pager`, `.pager__text`, `.pager__buttons`: a status text and First, Previous, Next, and Last buttons.
- `.table-wrap` and `.data-table`: a bordered table frame, hover feedback, and `tr[aria-selected='true']`.
  A selected row gets the selected ground and a primary inline-start edge, so color never decides alone.
- ToDo's admin spec describes their behavior and accessibility.

## Requirements
- Use contract tokens only, so the vendored conformance check passes in adopters.
- Keep the table look-neutral; the selected state works in every look and theme.
- Remove "Pagination" from the catalog's Not in the Package table.
- Replace the table section's rule that tables have no selected state with the new row states.
- The pager stays markup and CSS; apps own the paging logic.
- Hover styles apply only under `@media (hover: hover)`, if the package does so elsewhere.

## Declared Files
- `src/css/style.css`
- `src/css/components/table.css`
- `src/demo/visual-style-gallery.html`
- `tests/e2e/table.spec.js`
- `docs/specs/components.md`
- `docs/specs/visual-style-guide.md`
- `src/css/components/toolbar.css`, added
- `src/css/components/pager.css`, added
- `tests/e2e/toolbar.spec.js`, added
- `tests/e2e/pager.spec.js`, added

Size estimate: 6 files, 320 lines

### Tests
- Unit: the token test passes with the new component files in every look and theme.
- Integration: gallery browser specs check toolbar wrapping, pager buttons and disabled states, and selected rows at 390 and 1440 px.
  They check the selected row's edge and ground in light and dark themes.

Completion check: `python scripts/devops.py check`, exit code 0
