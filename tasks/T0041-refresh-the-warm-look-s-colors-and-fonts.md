---
id: T0041
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
---
# T0041: Refresh the warm look's colors and fonts to new values chosen by the user, after family-portal adopts it.

## Goals
Change the `warm` look's palette and font stacks to the values the user lists in the technical specification.
Keep the token contract, AA contrast on every pair the token test checks, and every accent variant valid.
Start only after family-portal runs on its vendored copy, so its lossless switch proof stays clean.
Release the change as a new minor version; family-portal picks it up with `vendor`.
The human preview gate waits for the user's values; see the technical specification for files and tests.

## Task Execution Steps
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
