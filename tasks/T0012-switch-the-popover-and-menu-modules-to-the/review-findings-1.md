---
task: T0012
round: 1
verdict: approved
reviewer: "@claude-2"
reviewed_at: 2026-11-12T17:13:06Z
reviewed_commit: "0ed9d48"
base_commit: "6cdeeaa"
branch: task/T0012-switch-the-popover-and-menu-modules-to-the
---
# Review Findings: Task T0012 (Round 1)

## Summary
The work meets the goals and approves.
- `attachPopover` swaps `hidden` for `showPopover` and `hidePopover`, with `popover="auto"` as the default.
- The trigger becomes the invoker, so the panel opens without JavaScript.
- `anchorPanel` stays in charge of placement and clears the right and bottom insets of the UA rules.
- A `toggle` listener replaces the document click listener and follows platform closes as `outside`.
- Toggle events of the module's own changes are ignored, because `open` is already updated.
- Trigger clicks call `preventDefault`, so the invoker's own toggle never races the module.
- Existing keyboard tests still pass, and new tests cover light dismiss, top layer, and no-JavaScript use.
- The style guide, the components skeleton, and CHANGELOG.md describe the new contract.

Reviewer runs on commit `0ed9d48`:
- `npx vitest run tests/unit/popover.test.js tests/unit/menu.test.js`: exit 0, 36 passed.
- `npx playwright test tests/e2e/menu.spec.js tests/e2e/popover.spec.js`: exit 0, 24 passed.
- `python scripts/devops.py check`: exit 0, worktree clean afterwards.

Two inspected screenshots show anchored panels painted on top: warm 390 px dark menu, neutral 1440 px dark popover.

## Defects
None blocking. Non-blocking observations:
- `src/css/components/menu.css` and `popover.css` no longer use `--layer-popover`.
  The token stays public in `contract.json` and ADR-0001, now without a component consumer.
- With `anchor: false`, the panel keeps the UA `inset: 0; margin: auto`, so it centers in the viewport.
  The style guide does not mention it.
- `tests/unit/popover.test.js` asserts `style.right` and `style.bottom` twice in "anchors the open popover at its trigger".
- The second CHANGELOG.md entry uses present tense ("add") where neighboring entries use past-tense verbs.
- Browser specs run on Chromium only, so `popoverTargetElement` and light dismiss lack Firefox and WebKit coverage.

## Process Gaps
None blocking.
- The task touched 13 files against 10 declared; the Execution Log records the undeclared files and the reason.
- Failing-first evidence and the completion check output are in validation-proof.md.

## Required Rework
None.
