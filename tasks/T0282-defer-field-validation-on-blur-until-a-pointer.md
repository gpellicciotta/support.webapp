---
id: T0282
owner: "@gemini"
session: antigravity-20261123-409ad6
needs: []
branch: task/T0282-defer-field-validation-on-blur-until-a-pointer
worktree: .plan/work/T0282-defer-field-validation-on-blur-until-a-pointer
status: active
started_at: "2026-11-23T18:00:55Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 1, duration_s: 1801.4, input: 5990, output: 522}
work_duration: 1811.8
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
- [ ] **[Implement]** Defer blur validation in `field.js` until the pointer press ends, keeping keyboard blur immediate.
- [ ] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [ ] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

- [2026-11-23] **[Decided]**
  Keep attachForm unchanged; its submit handler calls field.validate synchronously during click, ahead of the release task, so invalidating the held callback drops duplicate blur checks cleanly.

