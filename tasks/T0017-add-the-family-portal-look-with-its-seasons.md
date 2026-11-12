---
id: T0017
owner: "@codex"
session: codex-20261112-067376
needs: []
branch: task/T0017-add-the-family-portal-look-with-its-seasons
worktree: .plan/work/T0017-add-the-family-portal-look-with-its-seasons
status: completed
started_at: "2026-11-12T13:35:17Z"
ended_at: "2026-11-12T13:54:39Z"
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 4, duration_s: 1474.6, input: 279368, output: 38096, cache_read: 9596160, cache_write: 0}
  review: {turns: 4, duration_s: 756.8, input: 100, output: 25978, cache_read: 2562918, cache_write: 218894}
review_status: approved
review_round: 2
work_duration: 1161.8
reviewed_by: "@claude"
completion-commit: 4a5fe1b1a3a42555c371a11f2114f18b78a56105
---
# T0017: Add the warm look from family-portal with its seasons variant, glyph set, and the look template.

## Goals
Extract the `warm` look from family-portal with its seasons as `data-accent` values, add its sprite, and create `src/looks/_template/` from the two looks.
Follow [ADR-0001](../../docs/adrs/ADR-0001-layer-model-and-token-contract.md) and [ADR-0002](../../docs/adrs/ADR-0002-looks.md) and the roadmap.
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

- [2026-11-12] **[Read]**
  Read ADRs, roadmap, and family-portal at 1953f75484a2fe65aa3444730b3a9f459ae21cb4. Baseline verifier passed 12 checks; new warm tests failed as expected.

- [2026-11-12] **[Decided]**
  Preserved source warm values and seasonal mappings. Added optional shadow roles, documented neutral glyph supplements, and used sunken selected grounds. Declared contract, gallery test, and documentation index additions; seven counted files remain within the estimate.

- [2026-11-12] **[Implement]**
  Added failing warm registration, seasonal mapping, template tests, and browser switching tests before their implementations. Captured expected failures in validation-proof.md.

- [2026-11-12] **[Verify]**
  Full devops check passed: 3 Python, 1003 unit, 164 browser, and 4 integration tests; packaging passed. Inspected eight screenshots linked in validation-proof.md. Test servers exited with their runners.

- [2026-11-12] **[Doc]**
  Documented source provenance, MIT glyph supplements, SIL font licenses, contract gaps, seasonal usage, and template instructions. Updated the guide, index, and existing pre-release changelog.

- [2026-11-12] **[Verify]**
  Recorded outcomes and screenshots in [validation-proof.md](T0017-add-the-family-portal-look-with-its-seasons/validation-proof.md). Counted modified text files exclude new files, CHANGELOG.md, and the plan store.
  - Files touched: 7.
  - Lines touched: 80.
  - Reopenings: 0.

- [2026-11-12] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-12] **[Review]**
  Round 1 rejected by @claude: The warm look itself is solid.
  - Findings: [review-findings-1.md](T0017-add-the-family-portal-look-with-its-seasons/review-findings-1.md).

- [2026-11-12] **[Implement]**
  Round 1 rework adds template optional mappings and commented variant fallbacks. Added failing regression coverage, then validated template tokens and core sprites with the shared checks. Corrected the prior log ordering.

- [2026-11-12] **[Decided]**
  Size note: Review adds ADR-0001, token tests, and icon tests. Ten counted files remain below the large line; template contract checks and the shadow documentation correction belong to this extraction.

- [2026-11-12] **[Doc]**
  Updated ADR-0001 Overlay roles and grouped optional shadows beside color-shadow in contract.json. Template README now explains its combined neutral and warm patterns. Existing screenshots remain applicable because gallery rendering did not change.

- [2026-11-12] **[Verify]**
  Review fixes passed the full devops check: 3 Python, 1446 unit, 164 browser, and 4 integration tests, plus lint and packaging. Recorded red and green evidence in validation-proof.md.

- [2026-11-12] **[Verify]**
  Recorded revised outcomes against bb0e69c. Added files, CHANGELOG.md, and the plan store remain excluded from counted scope.
  - Files touched: 10.
  - Lines touched: 87.
  - Reopenings: 0.

- [2026-11-12] **[Review]**
  Round 2 requested (mode: agent).

- [2026-11-12] **[Review]**
  Round 2 approved by @claude: Commit `4c03f4f` resolves all three round 1 rework items.
  - Findings: [review-findings-2.md](T0017-add-the-family-portal-look-with-its-seasons/review-findings-2.md).

- [2026-11-12] **[Complete]**
  Task completed successfully.

