---
id: T0020
owner: "@codex"
session: codex-20261112-9374b6
needs: []
branch: task/T0020-design-and-add-the-loading-pattern-aria-busy
worktree: .plan/work/T0020-design-and-add-the-loading-pattern-aria-busy
status: active
started_at: "2026-11-12T18:42:28Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 2, duration_s: 1436.8, input: 184732, output: 28778, cache_read: 9102336, cache_write: 0}
review_status: pending
review_round: 1
---
# T0020: Design and add the loading pattern: aria-busy, a polite status line, and slow-list skeletons

## Goals
Design the loading pattern decided on 2026-11-10, with skeletons only for slow lists and static under reduced motion.
Follow [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md) and the roadmap.
Refine declared files, size estimate, and tests in the technical specification before starting.

## Task Execution Steps
- [x] **[Read]**      Read the named ADRs and the source app at a recorded commit.
- [x] **[Decide]**    Write declared files, size estimate, tests, and the completion check into the technical specification.
- [x] **[Implement]** Write the failing tests named in the technical specification.
- [x] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [x] **[Implement]** Implement the component or look and its gallery specimens.
- [x] **[Verify]**    Run the tests, the verifier, and the completion check until they pass.
- [x] **[Doc]**       Update the style guide and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.

- [2026-11-12] **[Read]**
  Read ADR-0003, roadmap, catalog, and family-portal gallery at commit 1953f75. No accessible loading implementation exists to extract.

- [2026-11-12] **[Decided]**
  Kept polite status outside busy content. Used static, decorative skeletons only for slow lists; applications own request timing and state transitions.

- [2026-11-12] **[Verify]**
  Confirmed failing unit and browser tests before implementation. Browser red phase captured four before screenshots; managed server PID 27600 exited with the runner.

- [2026-11-12] **[Verify]**
  Ran python scripts/devops.py check in session 99215. Verbatim check-output.txt records child commands and PIDs, including Vitest PID 29440 and Playwright PID 51844.

- [2026-11-12] **[Visual]**
  Inspected four before captures and twelve loading captures across all looks, themes, and viewports. Screenshots show readable status and static placeholders without clipping; see companion validation-proof.md.

- [2026-11-12] **[Implement]**
  Added CSS and ordinary, slow-list, and completed gallery specimens. Updated the normative markup, usage guide, and prerelease changelog without changing versions.

- [2026-11-12] **[Verify]**
  Corrected a stylesheet readiness wait after the loading browser test timed out. The targeted rerun passed all four projects with managed server PID 37176.

- [2026-11-12] **[Verify]**
  The first full check passed 295 browser checks and failed five. Preserved failure details in validation-proof.md and check-first-output.txt; rerunning alone after correcting stylesheet readiness.

- [2026-11-12] **[Verify]**
  Final check runs in session 50761 with Playwright PID 19708. Check-output.txt records every child command and PID; no concurrent browser run remains.

- [2026-11-12] **[Verify]**
  Final python scripts/devops.py check exited 0: lint, 3 Python tests, 2044 unit tests, 300 browser checks, integration tests, and packaging passed. Managed servers exited; screenshots and verbatim evidence are linked in validation-proof.md.

- [2026-11-12] **[Verify]**
  Recorded counted outcomes; added files, CHANGELOG.md, and plan artifacts are excluded by sizing rules.
  - Files touched: 4.
  - Lines touched: 58.
  - Reopenings: 0.

- [2026-11-12] **[Verify]**
  Committed implementation as 4b65515. Completion validation passed; all execution steps except orchestrator-owned Review are checked.

- [2026-11-12] **[Review]**
  Round 1 requested (mode: agent).

