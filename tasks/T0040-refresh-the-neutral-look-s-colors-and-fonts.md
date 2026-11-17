---
id: T0040
owner: ~
needs: []
branch: —
worktree: —
status: ready
started_at: —
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
- [ ] **[Read]**      Read ADR-0002, the look's spec, and the user's new values in the technical specification.
- [ ] **[Implement]** Write or update the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Apply the new values in the look's primitives and update its font loading.
- [ ] **[Verify]**    Run the token test, the verifier, and the completion check until they pass.
- [ ] **[Visual]**    Capture the gallery per theme at 390 and 1440 px, before and after.
- [ ] **[Doc]**       Update the look's spec and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-13] **[Doc]**
  Created at the user's request after the design system milestone.

- [2026-11-17] **[Size]**
  Size approved by @gpellicciotta for 3 files, 120 lines.

- [2026-11-17] **[Preview]**
  Preview approved by @gpellicciotta.

