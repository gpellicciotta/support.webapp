---
task: T0294
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-24T00:31:12Z
reviewed_commit: "174b4e4"
base_commit: "03732a2"
branch: task/T0294-add-dom-builders-for-package-components-promoted-from
session: claude-20261124-bafa86
session_agent: claude-code
session_created_at: 2026-11-24T00:21:56Z
---
# Review Findings: Task T0294 (Round 1)

## Summary
Approved. All goals are met.
- `src/js/dom-builders.js` exports `createDomBuilders`, `h`, `setChildren`, and builders for all ten listed components.
- Each builder's output matches its skeleton in components.md:
  - button, field select, checkbox, `list--facts`, and the `table__frame` table.
  - `chip--status`, `loading__status`, `banner--danger`, `empty-state`, and `inline-confirm`.
- `on*` listeners and the six DOM properties behave as the spec requires.
- Hooks use `data-*` and ARIA state, never `innerHTML`.
- Signatures stay compatible with Auth's `ui.mjs` at `0535f71`: tuple facts, `button(label, onclick, options)`, and `inlineConfirm(trigger, {...})`.
- The contract entry, the components.md catalog row and section with upgrade note, the ADR-0003 decision, and CHANGELOG are present.
- The rebuilt admin console demo matches its before screenshot in light mode, pixel for pixel by eye.

Verification run by the reviewer:
- `python scripts/devops.py check` in the worktree: lint passed, plus 61 pytest, all vitest unit tests, and 1008 Playwright tests (0 failed), and pack and vendor integration.
- It exited 1 only because `tests/integration/generate-app.test.js` failed 3 tests, all in the generated app's `eslint`.
  - Cause: `ERR_MODULE_NOT_FOUND @stylistic/eslint-plugin`.
  - The worktree's `node_modules` is empty, so the test's junction gets no packages. Conformance had already passed. The environment causes it, not this change.
- I reproduced the neutral generated app by hand, with a junction to the primary checkout's `node_modules`.
  - Generation, `check.mjs` conformance, and the app's own `devops.py check` all exited 0.
  - `dom-builders.js` was vendored into that app.

## Defects
None.

## Process Gaps
Non-blocking:
1. The evidence never shows a full `python scripts/devops.py check` run, which the completion check names.
   - It lists the parts instead and notes the worktree `generate-app` limitation.
   - The reviewer's run and repro above close this gap. Future evidence should state the full-check exit code and the cause of any failure.
2. Demo focus return breaks after the table re-renders (`src/demo/shell-admin-console.js`).
   - `openAccount` stores the clicked Inspect button as `opener`, and `renderAccounts` rebuilds every row on filter changes.
   - Repro: open an account, type in the filter, then close the panel. `opener.focus()` targets a detached button and focus drops to `body`.
   - Before this change the rows were static, so focus returned correctly.
3. The catalog and the code disagree on the warning chip icon.
   - `severityChip('warning')` uses `icon-sync-error`; the chip skeleton in components.md shows `icon-alert` for warning.
   - Both shapes stay distinct from error's `icon-alert`. The catalog example or the dom-builders section should state the mapping.
4. `h` sets a non-function `on*` value, such as a string, as an attribute, which creates an inline handler.
   - Skipping or rejecting non-function `on*` values would make the builder harder to misuse.
5. The demo's Page size select changes only the caption text; it pages nothing. This is acceptable for a demo but undocumented.

## Required Rework
None.
