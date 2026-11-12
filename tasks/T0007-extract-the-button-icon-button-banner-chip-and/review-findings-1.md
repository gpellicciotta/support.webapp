---
task: T0007
round: 1
verdict: rejected
reviewer: "@claude-2"
reviewed_at: 2026-11-12T13:01:59Z
reviewed_commit: "ee2227f"
base_commit: "73aaa9d"
branch: task/T0007-extract-the-button-icon-button-banner-chip-and
---
# Review Findings: Task T0007 (Round 1)

## Summary
The work is high quality and nearly complete.
Five partials, the global focus ring, gallery sections, catalog, style guide, and changelog follow ADR-0003.
Every partial passes the token and naming contract tests.
`python scripts/devops.py check` passed with exit code 0 on `ee2227f`:
- 543 unit, 132 browser, and 4 integration tests passed.
- Markdown lint and Ruff passed.
- The verifier reported zero errors in every theme at 390 and 1440 px.

TDD evidence is complete: red-phase logs, the green completion check, and before/after screenshots.
I checked the light 1440 and dark 390 captures by eye.
Every variant and state renders, with no overflow.
The link-button deferral to T0034 and the `banner--danger` rename are recorded with `**[Decided]**`.
Undeclared files are listed in the Execution Log.

I rejected the work for one regression from the todos.webapp source, below.

## Defects
1. **Disabling one segmented option leaves it looking enabled.**
   - Where: `src/css/components/segmented.css`, the `.segmented:disabled .segmented__option` rules.
   - Source: todos.webapp `controls.css` at `0cf4981` uses `.segmented__option:has(:disabled)` and `.segmented__option:has(:checked:disabled)`.
     Those rules match a disabled fieldset and a single disabled radio alike.
   - New behavior: only a disabled fieldset gets the disabled style.
     A native `disabled` on one radio keeps the normal text color and the `pointer` cursor.
   - Reproduced in Chromium with the neutral look:

     ```text
     per-option disabled  { color: 'rgb(0, 0, 0)', cursor: 'pointer', disabledInput: true }
     fieldset disabled    { color: 'rgb(163, 163, 176)', cursor: 'not-allowed', disabledInput: true }
     ```

   - Impact: the option looks enabled but ignores clicks.
     The catalog lists `disabled` for `segmented`, and the task requires native radio semantics and every state.
   - Tests and gallery cover only the disabled fieldset, so the suite misses this case.

2. Minor, no rework needed: in the neutral look, warning and danger banners share one color.
   - Cause: `look.css` sets `--color-warning: var(--color-danger)`, which predates this task.
   - The icon and role still tell them apart.
     A later look task could give warning its own hue.

## Process Gaps
- The style guide limits disabling to the whole fieldset, a narrower contract than the source.
  This scope cut has no `**[Decided]**` entry in the task log or the style guide.

## Required Rework
1. In `segmented.css`, key the disabled styles on the option's own input:
   - Use `.segmented__option:has(:disabled)` and `.segmented__option:has(:checked:disabled)`, as in todos.webapp.
   - These still match a disabled fieldset, because its radios match `:disabled`.
   - Keep the hover ground off disabled options.
2. Add a failing test first, then make it pass:
   - Add a gallery specimen with one disabled option in an enabled group.
   - Assert that the option uses `--color-text-disabled`, has the `not-allowed` cursor, and keeps its ground under `.is-hover`.
3. Update the segmented lines of the style guide and the catalog skeleton note.
   They should allow `disabled` on a single radio as well as on the fieldset.
4. Rerun the completion check and `python scripts/devops.py check`, and record the results in `validation-proof.md`.
