---
id: T0002
owner: "@claude-code"
needs: []
branch: —
worktree: —
status: active
started_at: "2026-11-11T08:20:19Z"
ended_at: —
review: human
preview: none
protocol: standard
review_status: rejected
review_round: 1
reviewed_by: "@giova"
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

