---
id: T0024
owner: "@codex"
session: codex-20261113-d3bee8
needs: []
branch: task/T0024-add-the-tooltip-component-after-a-screen-reader
worktree: .plan/work/T0024-add-the-tooltip-component-after-a-screen-reader
status: suspended
started_at: "2026-11-13T00:07:19Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0024: Add the tooltip component after a screen reader check of meteo's tooltips

## Goals
Check how screen readers expose meteo's tooltip text, then add a tooltip component that is exposed reliably.
Follow [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md) and the roadmap.
Refine declared files, size estimate, and tests in the technical specification before starting.

## Task Execution Steps
- [x] **[Read]**      Read the named ADRs and the source app at a recorded commit.
- [ ] **[Decide]**    Write declared files, size estimate, tests, and the completion check into the technical specification.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Implement the component or look and its gallery specimens.
- [ ] **[Verify]**    Run the tests, the verifier, and the completion check until they pass.
- [ ] **[Doc]**       Update the style guide and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.

- [2026-11-13] **[Read]**
  Read ADR-0003, roadmap, tooltip catalog, and meteo at 8937c32fca32a82acc6a15b08901f354284cd14b. CSS generates tooltip text; translations copy it into title. Screen reader announcements remain unverified.

- [2026-11-13] **[Decided]**
  Blocked before implementation: Narrator exists, but available tools cannot capture its announcements. Obtain a recorded screen reader/browser check covering focus, hover, duplicate announcements, and translated tooltip text before accepting the provisional contract.

- [2026-11-13] **[Verify]**
  No implementation or automated tests ran because the required screen reader check remains blocked. No code commit was created.
  - Files touched: 0.
  - Lines touched: 0.
  - Reopenings: 0.

- [2026-11-13] **[Verify]**
  Completion validation exited 1 with eight issues; verbatim output and source findings are in validation-proof.md. The unfinished task is not ready for review.

