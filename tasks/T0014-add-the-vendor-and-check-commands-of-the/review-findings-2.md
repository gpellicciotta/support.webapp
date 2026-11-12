---
task: T0014
round: 2
verdict: approved
reviewer: "@claude-2"
reviewed_at: 2026-11-12T10:18:39Z
reviewed_commit: "e7044b1"
base_commit: "0e205ea"
branch: task/T0014-add-the-vendor-and-check-commands-of-the
---
# Review Findings: Task T0014 (Round 2)

## Summary
Approved.
Commit `e7044b1` fixes every round 1 defect and required rework item.
Reviewer reruns:
- `python scripts/devops.py check`: exit 0, run twice.
  - 3 pytest, 472 unit, 8 browser, and 1 integration tests passed.
  - Markdown lint, Ruff, ESLint, and `npm pack --dry-run` passed.
- The worktree stayed clean afterwards; `postpack` removed `manifest.json`.

Round 1 scenarios, reproduced by hand on Windows in a temporary app:
- Vendoring used `--to src/vendor/design --styles src`, and `src/css/app.css` held `color: red`.
- `check.mjs` through its direct path: conformance FAIL, exit 1, no package-file findings.
- `check.mjs` through a junction, in text and JSON formats: same result, exit 1.
- Running from inside the junction directory also gave exit 1.
- A BEM class `.card--neutral-ink` raised no primitive-token error.
- `node {{link}}/bin/manifest.mjs` in a copied checkout reached through a junction wrote `manifest.json`.

Fixes checked in the code:
- `bin/check.mjs` and `bin/manifest.mjs` compare real paths in their main guards.
- Conformance skips files inside the vendored target and reports missing `styles` folders.
- `vendor` rejects missing `styles` folders with exit code 2.
- The integration test now runs the checker through a junction and expects exit 1.
- The new unit tests cover the vendored copy inside `styles`, a missing folder, and BEM selectors.
- `package.json` already sets `engines`; the Execution Log records that decision.
- `docs/devops.md` describes the integration suite in `check`.

## Defects
None.

## Process Gaps
None blocking.
- Red output for all four round 2 tests is in validation-proof.md, captured before the fixes.
- The corrected outcome counts match the diff: 14 files and 605 lines (601 insertions, 4 deletions).
- `package-lock.json` is now declared.
- The reviewer left a temporary folder from the manual reproduction under the system temp directory.
  Removing it needs a recursive delete, which needs user confirmation.

## Required Rework
None.
