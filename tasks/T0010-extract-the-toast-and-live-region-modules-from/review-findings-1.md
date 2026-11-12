---
task: T0010
round: 1
verdict: approved
reviewer: "@claude-2"
reviewed_at: 2026-11-12T16:46:39Z
reviewed_commit: "5f7981b"
base_commit: "b81a316"
branch: task/T0010-extract-the-toast-and-live-region-modules-from
---
# Review Findings: Task T0010 (Round 1)

## Summary
Approved. The work meets every goal and the completion check passes.
- `toast.js` and `live-region.js` match todos.webapp at `0cf4981` line for line, apart from the following additions:
  - `createToast` is the new name, and `createToaster` stays as a deprecated alias, per ADR-0003 Consequences.
  - `data-toast-action` hooks and `role="status"`/`role="alert"`, as the components.md markup contract requires.
- Undo, persistent toasts, Ctrl+Z/Cmd+Z, Redo exclusion, modal holding, pause on hover/focus, focus return, and overflow are all kept and tested.
- The style guide applies the counters ADR tiers correctly: single highest-severity banner, `role="alert"` only for danger, no rotation (WCAG 2.2.2), and no toasts in the inbox.
  It also records the 8 s / three-toast default decision and documents `max: 1` for the counters single-toast rule.
- Every token the partial uses exists (`--layer-toast`, `--width-side-panel`, `--elevation-2`, `--radius-card`, `--color-surface-sunken`, `--target-min`).
- I reran the checks independently on `5f7981b`:
  - `python scripts/devops.py check`: exit 0.
  - Markdown lint, Ruff, ESLint, and pytest: all clean (pytest 3 passed).
  - Vitest: 20 files, 2009 tests passed.
  - `test:slow`: passed, including `toast.spec.js` in all four projects, and the verifier reported overflow 0px and errors 0.
- Screenshots: 12 after shots (3 looks × 2 themes × 2 widths) plus 2 before shots. In the shots I opened, the toasts sit inside the demo frame with no overflow.
- The validation proof records the failing-first output for both unit suites and the e2e spec.

## Defects
None blocking. Minor observations, optional:
- In the gallery, `#toast-demo-result` has `role="status"`, so the demo has a second polite region. A screen reader may read "Sample task deleted." and the toast message together. This affects the demo only.
- In the toast section, the `#toast-demo-result` paragraph sits flush against the bottom edge of `.toast-frame`, with no gap, at 390 and 1440 px.

## Process Gaps
None blocking. Minor observations:
- The Execution Log is out of order: the `[Read]`, `[Verify]` failing-test, `[Visual]`, and `[Doc]` entries come after the outcome entry.
- The recorded outcomes say "Files touched: 8, Lines touched: 134", but `git diff main...HEAD --stat` shows 15 files and 1071 inserted lines. If the plan tooling generated these figures, they may count only part of the change.
- The worker touched five undeclared files and listed them with reasons in the Execution Log, so this is disclosed.

## Required Rework
None.
