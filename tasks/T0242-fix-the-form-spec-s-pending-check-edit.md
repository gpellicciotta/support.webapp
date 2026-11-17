---
id: T0242
owner: "@claude"
session: claude-20261117-8c14ca
needs: []
branch: task/T0242-fix-the-form-spec-s-pending-check-edit
worktree: .plan/work/T0242-fix-the-form-spec-s-pending-check-edit
status: active
started_at: "2026-11-17T14:50:55Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0242: Fix the form spec's pending-check edit test, which failed once under full-suite load and passed 84 times alone

## Goals
Fix the form spec's pending-check edit test, which failed once under full-suite load and passed 84 times alone.

## Task Execution Steps
- [x] **[Implement]** Implement required changes for T0242.
- [x] **[Verify]**    Verify implementation with automated test suites.
- [x] **[Doc]**       Update documentation and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-17] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-17] **[Implement]**
  Paused the page clock after opening the gallery and advanced the 600 ms name check with runFor, removing the timing race.

- [2026-11-17] **[Verify]**
  A 700 ms injected delay failed the old test and passed the new one; 200 repeats passed at 12 workers.
  - Full check: lint, 2163 unit, 776 e2e passed.
  - Integration passed 7/7 with main checkout node_modules.

- [2026-11-17] **[Verify]**
  Recorded task outcomes.
  - Files touched: 1.
  - Lines touched: 14.
  - Reopenings: 0.

- [2026-11-17] **[Doc]**
  Created backlog task T0245 for the two sibling async-check tests, whose busy assertions share the 600 ms race.

