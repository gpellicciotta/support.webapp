---
id: T0002
owner: "@claude-code"
needs: []
branch: —
worktree: —
status: suspended
started_at: "2026-11-11T08:20:19Z"
ended_at: —
review: human
preview: none
protocol: standard
review_status: pending
review_round: 2
---
# T0002: Plan the design system from the comparison: architecture decisions, adoption roadmap, and first implementation tasks

## Goals
Turn the T0001 comparison into an approved plan for building and adopting the design system.
Record each key architecture choice as an ADR, with rejected alternatives and links to comparison evidence.
Write an adoption roadmap, and create the first implementation tasks in PLAN.md, each passing the sizing gates.
Obtain human approval of the plan before any sibling repository receives a backlog task.
This is a planning task that changes documentation only, so the code sizing gates do not apply.
See [technical-spec.md](T0002-plan-the-design-system-from-the-comparison-architecture/technical-spec.md) for the decisions to make.

## Task Execution Steps
- [x] **[Read]**      Read the T0001 comparison, requirements.md, and the ui-guidelines.
- [x] **[Decide]**    Draft an ADR per decision area, each with options, trade-offs, a recommendation, and evidence links.
- [x] **[Doc]**       Write the roadmap with phases, adoption order, and a lossless-extraction proof per adopter.
- [x] **[Doc]**       Update requirements.md, index.md, and CHANGELOG.md to match the decisions.
- [x] **[Doc]**       Create the first-phase tasks in PLAN.md, and later phases in the Backlog section.
- [x] **[Verify]**    Lint the changed markdown files and run plan tasks validate on every task.
- [x] **[Doc]**       Revise the ADRs, roadmap, and tasks for round 2, following the round-2 decisions sheet.
- [x] **[Verify]**    Lint the changed markdown files and run plan tasks validate on every task.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-08] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-11] **[Decided]**
  Settled the remaining open choices with the user: GitHub Packages, own create command, a meteo look, and data-i18n migration.

- [2026-11-11] **[Doc]**
  Wrote eight ADRs and the roadmap, updated requirements, index, and changelog, and created tasks T0003 to T0025.
  - T0003 to T0015 in Next Milestone.
  - T0016 to T0025 in Backlog.

- [2026-11-11] **[Verify]**
  Fixed the findings of an independent agent review, renamed the project to support.webapp in docs, and passed lint, link, and task checks.
  - Added tasks T0026 and T0027 to phase 1.
  - Undeclared file touched: docs/devops.md, for the rename.

- [2026-11-11] **[Verify]**
  Recorded task outcomes.
  - Files touched: 13.
  - Lines touched: 1001.
  - Reopenings: 0.

- [2026-11-11] **[Review]**
  Round 1 requested (mode: human).

- [2026-11-11] **[Review]**
  Round 1 rejected by @giova: Rejected round 1: twenty findings on the ADRs, roadmap, and tasks need a second round.
  - Findings are in review-findings-1.md, with decisions per finding.

- [2026-11-11] **[Doc]**
  Started round 2: recorded the shared decisions, renamed looks in task titles, and created tasks T0028 to T0033.
  - Decisions sheet: round-2-decisions.md in the task folder.
  - Two forks revise ADR-0001 to 0003 and ADR-0004 to 0008.

- [2026-11-11] **[Verify]**
  Finished round 2: revised eight ADRs, the roadmap, and tasks, added two specifications, and passed lint and task checks.
  - Main commit 9d8c7d3.
  - Size note: round 2 touched 14 files and 1529 lines.
  - Open items are marked Feedback Needed in the ADRs.

- [2026-11-11] **[Review]**
  Round 2 requested (mode: human).

