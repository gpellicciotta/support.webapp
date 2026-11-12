---
id: T0004
owner: "@codex"
session: codex-20261112-0f070d
needs: []
branch: task/T0004-extract-the-shared-base-tokens-and-the-todos
worktree: .plan/work/T0004-extract-the-shared-base-tokens-and-the-todos
status: active
started_at: "2026-11-12T09:23:39Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 2, duration_s: 1120.4, input: 151540, output: 30662, cache_read: 4428032, cache_write: 0}
  review: {turns: 2, duration_s: 354.4, input: 76, output: 25742, cache_read: 2493108, cache_write: 154118}
review_status: rejected
review_round: 1
reviewed_by: "@claude"
work_duration: 768.4
---
# T0004: Extract the shared base tokens, the contract file, and the neutral look from todos.webapp, with the static token test.

## Goals
Create the shared base tokens, `src/contract.json`, and the `neutral` look, following [ADR-0001](../../docs/adrs/ADR-0001-layer-model-and-token-contract.md) and [ADR-0002](../../docs/adrs/ADR-0002-looks.md).
Port the todos.webapp token test, described in [the comparison](../../docs/analysis/ui-design-comparison.md#colors-contrast-and-color-meaning), to check every look.
Keep todos.webapp values exactly; rename only as ADR-0001 lists.
Copy the Inter woff2 files unchanged, and record the todos.webapp commit read.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [x] **[Read]**      Read ADR-0001, ADR-0002, and the todos.webapp token files and token test at a recorded commit.
- [x] **[Implement]** Write the failing tests named in the technical specification.
- [x] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [x] **[Implement]** Write the base files, the contract file, and the neutral look with its fonts, filling contract gaps from its primitives.
- [x] **[Verify]**    Run the token test and the completion check until both pass.
- [x] **[Doc]**       Write the neutral look page with its gap tokens, and update CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.

- [2026-11-12] **[Implement]**
  Extracted todos.webapp 0cf4981 and shared family-portal 1953f75 values. Added unchanged Inter assets and documented gap roles. Additional edits repair contract links in seven existing documents; no rendered page changed.

- [2026-11-12] **[Doc]**
  Documented gap token sources and unchanged rendering. Added documentation index entry. Repaired newly resolvable contract references in seven documents; these eight additional documentation files contain only links.

- [2026-11-12] **[Implement]**
  Added .gitattributes to preserve copied font and license bytes across Windows checkouts. Font checksum tests confirm both files match todos.webapp.

- [2026-11-12] **[Verify]**
  Passed completion test, full devops check, and final Markdown lint. Recorded verbatim evidence. Counted modified files exclude additions and changelog under sizing rules.
  - Files touched: 8.
  - Lines touched: 27.
  - Reopenings: 0.

- [2026-11-12] **[Read]**
  Read ADR-0001, ADR-0002, source token styles, font definitions, and the static token test at todos.webapp 0cf4981. Read family-portal 1953f75 for base scale extensions.

- [2026-11-12] **[Verify]**
  Committed verified work as 0312db4. All execution steps except orchestrator-owned review are checked. Completion validation passed; review settings remain unchanged.

- [2026-11-12] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-12] **[Review]**
  Round 1 rejected by @claude: Rejected.
  - Findings: [review-findings-1.md](T0004-extract-the-shared-base-tokens-and-the-todos/review-findings-1.md).

- [2026-11-12] **[Implement]**
  Reproduced three review defects before fixes. Corrected filled success/warning foregrounds, ADR categories, and optional source-token entries. Contract metadata now drives status checks for every look; separate tests report individual token and contrast failures.

- [2026-11-12] **[Doc]**
  Addressed every round-one finding. Documented optional source roles and metadata, filled-role foreground usage, and six app-only tokens retained during adoption. Ordered spacing numerically in base and contract.

- [2026-11-12] **[Verify]**
  Recorded failing-first regressions and full passing checks: 445 unit tests, four browser tests, three Python tests, linting, and packaging. Task-base counted outcomes remain unchanged.
  - Files touched: 8.
  - Lines touched: 27.
  - Reopenings: 0.

