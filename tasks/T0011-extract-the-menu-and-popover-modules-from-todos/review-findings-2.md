---
task: T0011
round: 2
verdict: approved
reviewer: "@claude-2"
reviewed_at: 2026-11-12T16:23:57Z
reviewed_commit: "c2b6161"
base_commit: "cb19d61"
branch: task/T0011-extract-the-menu-and-popover-modules-from-todos
---
# Review Findings: Task T0011 (Round 2)

## Summary
Commit `c2b6161` resolves all round 1 findings, and the module extraction from round 1 is unchanged.
- The gallery-scoped `.overlay-specimens` class sets `z-index: auto` on static `.menu` and `.popover` specimens.
  It also sets `align-items: start`, and the component CSS stays unchanged.
- `expectOnTop` uses `document.elementFromPoint` at the center of the menu's Delete item and the popover's Clear button.
  It runs for every look and project, right after `expectAnchored`.
- `validation-proof.md` records the failing desktop menu runs before the fix ("covered by another element").
- I inspected four recaptured screenshots: bright and neutral desktop menus, warm desktop popover, and warm mobile menu.
  Open panels paint above the specimens, including when flipped above the trigger.
  Static menu specimens keep their natural item height at 1440 px.

Verification I ran in the worktree:
- `npx playwright test tests/e2e/menu.spec.js tests/e2e/popover.spec.js`: 8 passed, exit 0.
- `python scripts/devops.py check`: exit 0.
  Markdown lint, Ruff, and ESLint passed.
  3 pytest, 1975 Vitest, 252 Playwright, and 4 integration tests passed, and `npm pack --dry-run` succeeded.

I did not rerun the pre-fix failure myself, because the review must not modify the worktree.
I relied on the recorded failure output for that step.

## Defects
None.

## Process Gaps
None.

## Required Rework
None.
