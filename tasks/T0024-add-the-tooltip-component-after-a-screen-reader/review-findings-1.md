---
task: T0024
round: 1
verdict: rejected
reviewer: "@codex-2"
reviewed_at: 2026-11-13T01:04:00Z
reviewed_commit: "fd786b3"
base_commit: "fd786b3"
branch: task/T0024-add-the-tooltip-component-after-a-screen-reader
---
# Review Findings: Task T0024 (Round 1)

## Summary
**[Decided]** Rejected for a broken documented fallback and an unfinished rebase.
The explicit description, reversible controller, hover persistence, and native popover behavior otherwise pass affected tests.
The task records authorization for accessibility-tree evidence and defers manual speech verification to T0037.

Verification commands executed during review:

- `npx vitest run tests/unit/tooltip.test.js` exited 0.
- `npx playwright test tests/e2e/tooltip.spec.js` exited 0; its managed server finished with the runner.

```text
 Test Files  1 passed (1)
      Tests  4 passed (4)
```

```text
  12 passed (9.5s)
```

Existing full-check evidence was inspected in validation-proof.md and check-output.txt.

## Defects
- P2: The documented hidden-state fallback cannot display a tooltip when `showPopover` is unavailable.
  `src/js/tooltip.js` always assigns `popover="manual"`, including when the optional method is unavailable.
  `src/css/components/tooltip.css` hides `[popover]:not(:popover-open)` despite the controller clearing `hidden`.
  A Chromium capability-removal probe reproduced the failure using the actual module, anchor utility, and stylesheet.
  Removing `HTMLElement.prototype.showPopover`, attaching the tooltip, and calling `open()` produced:

  ```text
  {"open":true,"hidden":false,"display":"none"}
  ```

  The controller therefore reports success while the description stays visually hidden.
  Existing happy-dom tests check `hidden` without validating computed display; browser tests exercise only native support.

## Process Gaps
- The supplied worktree is midway through an interactive rebase onto fd786b3, with an unresolved CHANGELOG.md conflict.
  `git status` reports `UU CHANGELOG.md`; HEAD equals main, so the requested commit-range commands return no implementation changes.
  Review inspected staged implementation changes and original commit ab06d04 instead.
  The pre-scaffolded reviewed_commit identifies the base, rather than a completed implementation commit.
- Prior full-check evidence predates the current rebased working state.

## Required Rework
- Make popover capability detection and CSS visibility agree, preserving the documented hidden-state fallback.
- Add a browser regression covering missing popover methods and actual computed visibility, opening, closing, and cleanup.
- Resolve the changelog conflict and finish the rebase through the implementation owner.
- Run affected tests and required checks on the final commit, then request review against that commit.
