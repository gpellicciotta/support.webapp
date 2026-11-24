---
id: T0282
owner: "@gemini"
session: antigravity-20261123-409ad6
needs: []
branch: task/T0282-defer-field-validation-on-blur-until-a-pointer
worktree: .plan/work/T0282-defer-field-validation-on-blur-until-a-pointer
status: completed
started_at: "2026-11-23T18:00:55Z"
ended_at: "2026-11-23T18:39:16Z"
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 3, duration_s: 2092.4, input: 293014, output: 51111, cache_read: 8863538}
  review: {turns: 1, duration_s: 139.5, input: 22, output: 5825, cache_read: 498891, cache_write: 38848}
work_duration: 2300.9
review_status: approved
review_round: 1
review_requested_at: "2026-11-23T18:36:49Z"
reviewed_by: "@claude"
review_session: claude-20261123-ffc09e
completion-commit: 639a5e2e22ff15c9301436ede7498d7e48e3971a
---
# T0282: Defer field validation on blur until a pointer press ends, promoted from Auth's admin console

## Goals
Fix `field.js` so a blur caused by a pointer press validates only after the release.
Today the new error line can move the pressed button away, which loses its click.
Auth's and ToDo's admin consoles patch this locally, and Auth's SPA drops autofocus to avoid it.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Field Validation After Pointer Release", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 90 lines.

## Task Execution Steps
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Decide how a held check interacts with submit validation in `attachForm`.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Defer blur validation in `field.js` until the pointer press ends, keeping keyboard blur immediate.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

- [2026-11-23] **[Decided]**
  Keep attachForm unchanged; its submit handler calls field.validate synchronously during click, ahead of the release task, so invalidating the held callback drops duplicate blur checks cleanly.

- [2026-11-23] **[Implement]**
  Deferred blur validation in field.js until after pointer release, dropping held checks on validate, clear, setError, input, or destroy.

- [2026-11-23] **[Doc]**
  Updated components.md, ADR-0003 (undeclared file required by step 7), and CHANGELOG.md; total remains 5 counted files and 206 lines.

- [2026-11-23] **[Verify]**
  Verified all linters, 61 pytest, 2311 vitest, 930 Playwright, 7 integration tests, and dry-run pack.
  - Files touched: 5.
  - Lines touched: 206.
  - Reopenings: 0.

- [2026-11-23] **[Read]**
  Read technical-spec.md, auth-webapp-ui-audit.md, Auth's ui.mjs pointerState/validatedField, field.js, and form.js.

- [2026-11-23] **[Verify]**
  Confirmed red-phase failures in 3 new field.test.js unit tests and 4 field.spec.js browser viewport runs before editing field.js.

- [2026-11-23] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-23] **[Review]**
  Round 1 approved by @claude: Approved.
  - Findings: [review-findings-1.md](T0282-defer-field-validation-on-blur-until-a-pointer/review-findings-1.md).

- [2026-11-23] **[Complete]**
  Task completed successfully.

