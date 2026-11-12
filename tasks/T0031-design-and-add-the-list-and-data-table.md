---
id: T0031
owner: "@codex"
session: codex-20261112-605570
needs: []
branch: task/T0031-design-and-add-the-list-and-data-table
worktree: .plan/work/T0031-design-and-add-the-list-and-data-table
status: suspended
started_at: "2026-11-12T20:02:57Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 2, duration_s: 275.6, input: 86540, output: 6744, cache_read: 1047552, cache_write: 0}
work_duration: 144.7
---
# T0031: Design and add the list and data table components on native list and table elements

## Goals
Design and add the `list` and `table` components on native list and table elements, under [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md) and [components.md](../../docs/specs/components.md).
They build on the row base of T0016, and data tables keep header cells and captions.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [x] **[Read]**      Read ADR-0003, components.md, naming.md, and the WAI-ARIA pattern the component follows.
- [x] **[Decide]**    Record the markup skeleton, keyboard model, and states in components.md for user approval.
- [x] **[Implement]** Write the failing tests named in the technical specification.
- [x] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [x] **[Implement]** Add the list and table partials and their gallery sections.
- [x] **[Verify]**    Run the named tests and the gallery verifier until both pass.
- [x] **[Visual]**    Capture the new gallery sections per theme at 390 and 1440 px.
- [x] **[Doc]**       Update the style guide, components.md, and CHANGELOG.md.
- [ ] **[Verify]**    Pass the complete repository check without Warm card or accent readiness failures.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-12] **[Visual]**
  Baseline and implemented sections were captured after HTTP 200 responses, with browser error and network checks enabled.
  - [Before light desktop](T0031-design-and-add-the-list-and-data-table/before-neutral-desktop-light.png)
  - [Before dark desktop](T0031-design-and-add-the-list-and-data-table/before-neutral-desktop-dark.png)
  - [Before light phone](T0031-design-and-add-the-list-and-data-table/before-neutral-mobile-light.png)
  - [Before dark phone](T0031-design-and-add-the-list-and-data-table/before-neutral-mobile-dark.png)
  - [After list light desktop](T0031-design-and-add-the-list-and-data-table/after-list-neutral-desktop-light.png)
  - [After list dark desktop](T0031-design-and-add-the-list-and-data-table/after-list-neutral-desktop-dark.png)
  - [After list light phone](T0031-design-and-add-the-list-and-data-table/after-list-neutral-mobile-light.png)
  - [After list dark phone](T0031-design-and-add-the-list-and-data-table/after-list-neutral-mobile-dark.png)
  - [After table light desktop](T0031-design-and-add-the-list-and-data-table/after-table-neutral-desktop-light.png)
  - [After table dark desktop](T0031-design-and-add-the-list-and-data-table/after-table-neutral-desktop-dark.png)
  - [After table light phone](T0031-design-and-add-the-list-and-data-table/after-table-neutral-mobile-light.png)
  - [After table dark phone](T0031-design-and-add-the-list-and-data-table/after-table-neutral-mobile-dark.png)

- [2026-11-11] **[Doc]**
  Created by T0002 round 2 from the review findings F18 to F20.

- [2026-11-12] **[Decide]**
  Prepared native list/table markup, keyboard behavior, states, and scroll-region proposal in components.md. User approval remains required before implementation.

- [2026-11-12] **[Verify]**
  Offline Markdown lint passed. Online link checks received W3C HTTP 403 responses. Completion validation remains unsuccessful; implementation awaits design approval. Evidence: companion validation-proof.md.

- [2026-11-12] **[Decide]**
  Committed proposal as 4ccf95d. Approve the proposed native markup, static keyboard model, and focusable table scroll region before implementation.

- [2026-11-12] **[Decided]**
  Orchestrator approved the proposed list and table contract at 4ccf95d under the user's standing authority. Replace the approval notes in components.md with the final contract while implementing.

- [2026-11-12] **[Verify]**
  Affected browser run passed 56 tests across three looks and four projects. Session 49611 completed; full check runs in session 54342. Commands and output are recorded in validation-proof.md and companion terminal logs.

- [2026-11-12] **[Visual]**
  Captured baseline row and new list/table sections across neutral, warm, and bright looks, light/dark themes, and 390/1440 px viewports. Inspected neutral captures and warm/bright representatives; definition stacking, numeric alignment, and contained scrolling rendered correctly.

- [2026-11-12] **[Implement]**
  Added token-based list/table partials, native gallery specimens, keyboard and semantic browser coverage, usage guidance, and changelog entry. Tables preserve native display and share row spacing, surface, text, and border tokens.

- [2026-11-12] **[Verify]**
  Initial full check passed 335 browser tests and failed Bright accent token comparison: expected black, rendered blue. Likely stylesheet-readiness race; recorded full output. Added failing ordered-list and dense-table tests before implementing both catalog variants.

- [2026-11-12] **[Verify]**
  Final full check runs synchronously in session 72796: LIST_TABLE_PROOF is set to the companion directory, then python scripts/devops.py check. Final-check.txt records spawned process IDs and exact commands.

- [2026-11-12] **[Doc]**
  Updated components.md with the approved contract and ordered/dense variants. Updated the style guide and pre-release changelog without version changes. Read family-portal row-list styling as the reference; shared rows retain todos-derived layout.

- [2026-11-12] **[Verify]**
  Final full check: 341 browser tests passed; three Warm card cases failed. Direct single-worker card/bright run: 15 passed, one Warm card failure. List/table and gallery checks passed. Full verification remains blocked; stylesheet-readiness is suspected, not confirmed.

- [2026-11-12] **[Verify]**
  Named completion command passed all 32 list/table tests. Integration passed four tests; npm pack --dry-run passed. Added an unchecked full-check gate so existing card failures cannot be mistaken for completed verification.

- [2026-11-12] **[Verify]**
  Recorded outcomes: nine changed files, 352 changed lines; four counted modified files, 140 counted lines; zero reopenings. Task validation passed. Completion validation reports the unchecked full-check gate. No development server remains running.

- [2026-11-12] **[Decide]**
  Committed implementation as e303c22; worktree is clean. Review must resolve Warm card validation failures before the full-check gate can pass. See final-check.txt, style-readiness-check.txt, and validation-proof.md for exact failures and evidence.

