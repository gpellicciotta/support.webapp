# T0048 Technical Specification
Promote the detail panel, facts list, and status chip, and add an admin console example.

---

## Source
The parts come from todos.server's [admin.css](https://github.com/gpellicciotta/todos.server/blob/main/admin/css/admin.css), read on 2026-11-15 at commit `4173976`:
- `.detail-panel` with `__header`, `__title`, `__body`, `__section`, `__danger`, and `__actions`.
  It fills the shell's side panel: a header with a close button, a scrolling body, and a danger zone.
- `.facts`, `.facts__row`, and `.facts--compact`: label and value pairs in a bordered grid.
- `.chip--sev[data-severity]`: a chip with an icon and a word; warning and error icons use the danger color.

## Requirements
- Use contract tokens only, so the vendored conformance check passes in adopters.
- Prefer a variant of the definition list for facts over a new component, if it fits.
- The status chip carries an icon shape and a word for every state, never color alone.
- The example page uses the workspace setup without bottom bar and action bar, with `app--scroll-main`.
  It shows a toolbar, a data table with a selected row, a pager, and an open detail panel.
- Browser checks cover the example page at 1440 px in light and dark themes, with no failed requests.
- Release follows ADR-0005 and the roadmap's release flow; publishing needs the user's approval.

## Declared Files
- `src/css/style.css`
- `src/css/components/list.css`
- `src/css/components/chip.css`
- `src/demo/visual-style-gallery.html`
- `tests/e2e/chip.spec.js`
- `tests/e2e/list.spec.js`
- `tests/e2e/shell.spec.js`
- `docs/specs/components.md`
- `src/css/components/detail-panel.css`, added
- `src/demo/shell-admin-console.html`, added
- `tests/e2e/detail-panel.spec.js`, added

Size estimate: 8 files, 380 lines

Size note: at the typical line; one shared example page needs all three parts.

### Tests
- Unit: the token test passes with the new component files in every look and theme.
- Integration: browser specs check the panel's focus, scrolling body, and danger zone, and the example page at 1440 px.
  They check status chip icons and words, and facts rows, in light and dark themes.

Completion check: `python scripts/devops.py check`, exit code 0
