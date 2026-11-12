---
id: T0018
owner: "@codex"
session: codex-20261112-128579
needs: []
branch: task/T0018-extract-the-card-tile-and-avatar-components-from
worktree: .plan/work/T0018-extract-the-card-tile-and-avatar-components-from
status: active
started_at: "2026-11-12T13:55:00Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 2, duration_s: 847.2, input: 170812, output: 24426, cache_read: 4091904, cache_write: 0}
  review: {turns: 2, duration_s: 382.4, input: 100, output: 19586, cache_read: 2905010, cache_write: 127644}
review_status: rejected
review_round: 1
reviewed_by: "@claude"
work_duration: 633.9
---
# T0018: Extract the card, tile, and avatar components from family-portal

## Goals
Extract cards, icon tiles, and avatars with sizes, tones, stacks, and the icon fallback from family-portal.
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
  Read ADR-0001, ADR-0003, ADR-0007, roadmap, catalog, and family-portal components at 1953f75484a2fe65aa3444730b3a9f459ae21cb4. Recorded extraction decisions and tests.

- [2026-11-12] **[Implement]**
  Added card, icon-tile, and avatar partials, gallery specimens, documentation, and tests. The shared ownership test explicitly permits the catalog's avatar-stack companion block. Full verification command: python scripts/devops.py check; Playwright server PID: 32452.

- [2026-11-12] **[Verify]**
  Full check passed: 1458 unit tests, 172 browser tests, 4 integration tests, 3 Python tests, linting, and package dry run. Saved before/after screenshots and verbatim proof. Playwright stopped its server; process inspection found no remaining development server.

- [2026-11-12] **[Visual]**
  Inspected real gallery captures in both looks and themes at phone and desktop widths. Evidence: [validation-proof.md](T0018-extract-the-card-tile-and-avatar-components-from/validation-proof.md). Cards wrap, tones remain readable, and avatar stacks overlap.

- [2026-11-12] **[Decided]**
  Preserved source avatar dimensions using space tokens. Added catalog-required tile sizes and authored fallbacks. Used semantic radii, optional-tone fallbacks, and the global focus outline. Kept avatar-stack as the catalog's companion block.

- [2026-11-12] **[Doc]**
  Updated the style guide with markup, accessibility, fallback ownership, composition rules, and extraction decisions. Added the component changelog entry without changing versions.

- [2026-11-12] **[Verify]**
  Measured the final diff against the task base; excluded added files and CHANGELOG.md from counted size.
  - Files touched: 5.
  - Lines touched: 84.
  - Reopenings: 0.

- [2026-11-12] **[Verify]**
  Committed the verified implementation on the task branch. All execution steps except orchestrator-owned agent review are checked. Task completion validation passed; review settings remain unchanged.

- [2026-11-12] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-12] **[Review]**
  Round 1 rejected by @claude: Rejected.
  - Findings: [review-findings-1.md](T0018-extract-the-card-tile-and-avatar-components-from/review-findings-1.md).

- [2026-11-12] **[Decided]**
  Addressed all review findings. Tiles use 32/48/64 pixel spacing sizes. Explicit avatar sizes override stack defaults. Placeholder portraits use fixed gray artwork. Static card buttons retain natural stretching; applications own alignment under component isolation rules.

- [2026-11-12] **[Verify]**
  Regression tests reproduced both defects: neutral tile widths were 44/44 pixels, and a small warm stack avatar rendered at 104 pixels. Recorded verbatim failures. Updated CSS; all eight affected browser scenarios then passed.

- [2026-11-12] **[Visual]**
  Re-inspected revised captures: neutral tiles show three distinct sizes; gray portraits remain visible on dark card and avatar surfaces. Retained round-one captures as before evidence. New review2 captures cover both looks, themes, and widths.

- [2026-11-12] **[Verify]**
  Running python scripts/devops.py check synchronously through tool session 77568. Full output is retained in review2-check.log. Reused unchanged baseline screenshots and captured all revised component sections before the final run.

- [2026-11-12] **[Doc]**
  Documented distinct decorative tile sizes, explicit stack size precedence, visible placeholder artwork, and deliberate static card button stretching. Updated the existing changelog bullet and retained original review evidence.

- [2026-11-12] **[Verify]**
  Updated task size against the original base after review rework. Added files remain excluded from counted size.
  - Files touched: 5.
  - Lines touched: 88.
  - Reopenings: 0.

- [2026-11-12] **[Verify]**
  Final review-rework check passed: 1458 unit tests, 172 browser tests, 4 integration tests, 3 Python tests, lint, and package dry run. Stored full output and revised screenshots. Confirmed Playwright stopped its server.

