---
id: T0021
owner: "@codex"
session: codex-20261112-b4fe7e
needs: []
branch: task/T0021-add-the-i18n-module-with-the-data-i18n
worktree: .plan/work/T0021-add-the-i18n-module-with-the-data-i18n
status: completed
started_at: "2026-11-12T09:43:50Z"
ended_at: "2026-11-12T09:55:33Z"
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 4, duration_s: 791.4, input: 135876, output: 19650, cache_read: 2831360, cache_write: 0}
  review: {turns: 4, duration_s: 473.2, input: 48, output: 8300, cache_read: 958118, cache_write: 62152}
review_status: approved
review_round: 2
work_duration: 701.4
reviewed_by: "@claude"
completion-commit: 0e205ea4db9ad0b3c9f96757cd74761f5297a21f
---
# T0021: Add the i18n module with the data-i18n attributes and the catalog format

## Goals
Add `i18n.js` with `applyTranslations` and `t`, the catalog format, and the four `data-i18n` attributes from meteo.
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
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.

- [2026-11-12] **[Decided]**
  Read ADR-0003, the roadmap, and meteo at 8937c32fca32a82acc6a15b08901f354284cd14b. Documented the shell-owned loading boundary and setCatalog API.

- [2026-11-12] **[Verify]**
  Recorded missing-module failure before implementation. Full check passed: 454 unit tests, three Python tests, eight browser tests, linting, and packaging. No persistent visual component changed; documented the utility contract instead of adding gallery specimens.

- [2026-11-12] **[Size]**
  Counted one modified file and two changed lines; added files and changelog are excluded.
  - Files touched: 1.
  - Lines touched: 2.
  - Reopenings: 0.

- [2026-11-12] **[Read]**
  Read the named ADR, roadmap, naming contract, and recorded meteo source commit before defining tests.

- [2026-11-12] **[Implement]**
  Authored nine failing unit cases and a browser integration scenario before implementing the module. Added catalog replacement, interpolation, safe text rendering, and scoped attribute application.

- [2026-11-12] **[Doc]**
  Added the internationalization usage specification, linked the naming contract, and updated the active changelog heading. The utility introduces no style changes.

- [2026-11-12] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-12] **[Review]**
  Round 1 rejected by @claude: The module meets the ADR-0003 contract and is correct.
  - Findings: [review-findings-1.md](T0021-add-the-i18n-module-with-the-data-i18n/review-findings-1.md).

- [2026-11-12] **[Doc]**
  Addressed review round one: indexed the i18n guide and documented setCatalog in the utility exports table. Added docs/index.md to declared files; no product behavior changed.

- [2026-11-12] **[Verify]**
  Review rework passed the full check: linting, three Python tests, 454 unit tests, eight browser tests, and packaging. Recorded verbatim evidence. Earlier log entries described completed activities retrospectively; validation proof preserves the actual TDD order.

- [2026-11-12] **[Size]**
  Review rework added the declared documentation index. Cumulative counted changes remain below the typical threshold.
  - Files touched: 2.
  - Lines touched: 15.
  - Reopenings: 0.

- [2026-11-12] **[Review]**
  Round 2 requested (mode: agent).

- [2026-11-12] **[Review]**
  Round 2 approved by @claude: Approved.
  - Findings: [review-findings-2.md](T0021-add-the-i18n-module-with-the-data-i18n/review-findings-2.md).

- [2026-11-12] **[Complete]**
  Task completed successfully.

