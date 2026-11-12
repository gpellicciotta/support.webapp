---
task: T0009
round: 1
verdict: approved
reviewer: "@claude"
reviewed_at: 2026-11-12T15:52:10Z
reviewed_commit: "54aed5e"
base_commit: "bc42670"
branch: task/T0009-extract-the-dialog-component-and-its-three-confirmation
---
# Review Findings: Task T0009 (Round 1)

## Summary
Approved. The work meets every goal in the technical specification.
- `src/js/dialog.js` matches todos.webapp `src/js/ui/dialog.js` at `0cf4981f` line for line. The only differences are indentation, the `focus.js` import, and a reused `tabbableIn` result for initial focus.
- `tabbableIn` now lives in the shared `src/js/focus.js`. It also skips disabled controls, disabled fieldsets, `display: none`, and `visibility: hidden` elements. A unit test covers these cases.
- `dialog.css` reproduces the source modal and the full-height sheet below `64rem`. It maps `--width-editor` to `--width-side-panel` and `--radius-lg` to `--radius-dialog`, and every token it uses exists in each look.
- All three tiers appear in the gallery and in the style guide: modal, in-place (`inline-confirm`), and typed word (`.field` inside the dialog). Class names match the `components.md` skeletons and the key rules in `naming.md`.
- Tests cover what the spec names: focus trap, Escape, focus return, and `confirmDialog` results in the unit tests. `attachInlineConfirm` asking in place and restoring on Keep is tested too. The browser spec covers 390 and 1440 px, the sheet layout, the trap, Escape, focus return, the typed gate, and the inline tier.
- I ran `.venv/Scripts/python.exe scripts/devops.py check` myself, with exit code 0. Results: Markdown lint, Ruff, and ESLint passed. Tests passed: 1937 unit, 244 browser (including `dialog.spec.js`, the completion check), 3 pytest, and 4 integration. Packaging passed too.
- `validation-proof.md` records the failing-first output: the unresolved imports, then a regression in the focus filter. The visual evidence covers every look, theme, and viewport. Captures I inspected show the sheet, the centered typed dialog, and the inline question rendered correctly.
- The Execution Log records the extra files, `gallery.js` and the `naming.md` link repairs, as `[Decided]`. The commit message is one past-tense sentence with no trailers.

## Defects
None.

Non-blocking observations:
- `dialog.js` describes `modal: false` as "for a panel that fills the view". The source `.dialog--in-view` variant that styles such a panel was not extracted. Below 64rem, a non-modal `.dialog` gets full width but stays absolutely positioned. The catalog limits the scope to modal, type-to-confirm, and the sheet, so this is acceptable. A follow-up could add the variant or reword the comment.
- The gallery navigation lists no Dialog or Inline confirmation entry. Earlier sections (card, icon tile, avatar, row, empty state) already lacked entries, so this task did not introduce the gap.

## Process Gaps
None blocking.
- Minor: earlier entries in CHANGELOG.md log new public exports on their own `Modules:` line, for example `createField` and `attachForm`. This entry has a single `Components:` line and does not name `openDialog`, `confirmDialog`, `attachInlineConfirm`, or `tabbableIn`. Consider adding a `Modules:` line in a later change.

## Required Rework
None.
