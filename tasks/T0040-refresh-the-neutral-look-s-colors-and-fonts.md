---
id: T0040
owner: "@claude-code"
needs: []
branch: —
worktree: —
status: active
started_at: "2026-11-17T09:32:39Z"
ended_at: —
review: agent
preview: human
protocol: standard
preview_status: approved
previewed_by: "@gpellicciotta"
size_status: approved
size_approved: 3 files, 120 lines
size_approved_by: "@gpellicciotta"
size_approved_at: "2026-11-17T09:29:05Z"
review_status: pending
review_round: 1
review_requested_at: "2026-11-17T09:42:39Z"
---
# T0040: Refresh the neutral look's colors and fonts to the variant the user picks from five rendered candidates.

## Goals
Change the `neutral` look's palette and font stacks to the values the user lists in the technical specification.
Keep the token contract, AA contrast on every pair the token test checks, and every accent variant valid.
The user waived waiting for todos.webapp on 2026-11-17; values follow the gallery review instead.
Release the change as a new minor version; todos.webapp picks it up with `vendor`.
The user picks one of five rendered variants; see the technical specification for files and tests.

## Task Execution Steps
- [x] **[Preview]**   Obtain preview approval of the task definition before work starts.
- [x] **[Read]**      Read ADR-0002, the look's spec, and the user's new values in the technical specification.
- [x] **[Implement]** Write or update the failing tests named in the technical specification.
- [x] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [x] **[Implement]** Apply the new values in the look's primitives and update its font loading.
- [x] **[Verify]**    Run the token test, the verifier, and the completion check until they pass.
- [x] **[Visual]**    Capture the gallery per theme at 390 and 1440 px, before and after.
- [x] **[Doc]**       Update the look's spec and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-13] **[Doc]**
  Created at the user's request after the design system milestone.

- [2026-11-17] **[Size]**
  Size approved by @gpellicciotta for 3 files, 120 lines.

- [2026-11-17] **[Preview]**
  Preview approved by @gpellicciotta.

- [2026-11-17] **[Implement]**
  Added the palette test; it failed on undefined blue primitives and old grays, as recorded in red.log.

- [2026-11-17] **[Implement]**
  Applied slate grays and blue primitives, renamed navy to blue, and tinted shadows slate; Inter needed no font loading change.

- [2026-11-17] **[Visual]**
  Started the gallery server for screenshots with python scripts/devops.py serve --port 4173.
  - PIDs: python 27016, node 27120.
  - Before and after PNGs: button and field, both themes, 390 and 1440 px.

- [2026-11-17] **[Verify]**
  Completion check passed with exit code 0; proof and screenshots are in validation-proof.md.
  - Vitest: 2131 passed; Playwright: 724 passed, 28 skipped.

- [2026-11-17] **[Size]**
  Touched undeclared look.css to rename navy primitives to blue; 4 counted files, 97 lines, below the typical line.

- [2026-11-17] **[Review]**
  Round 1 requested (mode: agent).

