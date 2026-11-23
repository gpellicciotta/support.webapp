---
id: T0046
owner: ~
needs: []
branch: —
worktree: —
status: cancelled
started_at: —
ended_at: "2026-11-23T07:58:31Z"
review: agent
preview: none
protocol: standard
---
# T0046: Plan the redesign of counters on the design system, split from T0025

## Goals
Plan the redesign and re-creation of counters on the design system, split from T0025 on 2026-11-15.
Follow ADR-0004's counters adopter settings, ADR-0002, and the roadmap's Phase 5.
Pick counters' look with the user, then propose its sibling backlog tasks.
Completion check: `lint-markdown check docs`, exit code 0.
Size estimate: 2 files, 120 lines

## Task Execution Steps
- [ ] **[Read]**      Read the roadmap, ADR-0002, ADR-0004, and the current counters interface.
- [ ] **[Decide]**    Agree counters' look and shell settings with the user.
- [ ] **[Doc]**       Write the redesign plan and the sibling backlog tasks to propose.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-15] **[Doc]**
  Split from T0025 when the user restricted T0025 to auth.

- [2026-11-23] **[Cancelled]**
  Moved to counters.server T0272, since the plan is counters-specific; package gaps it finds become tasks here.

