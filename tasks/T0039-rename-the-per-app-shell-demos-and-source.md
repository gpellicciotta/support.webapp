---
id: T0039
owner: ~
needs: [T0038]
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0039: Rename the per-app shell demo pages to generic examples, updating the gallery links and browser specs.

## Goals
Rename `shell-todos.html`, `shell-family-portal.html`, `shell-meteo.html`, and `shell-counters.html` after the layouts they show.
Use names such as `shell-list-editor.html`, `shell-portal.html`, `shell-single-screen.html`, and `shell-toolbar.html`.
Keep every shell, verifier, and floating action button check passing against the renamed pages.
Start once meteo runs on the system, since ADR-0004 proves each adopter's fit with its own demo page.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [ ] **[Read]**      Read ADR-0004 and list every reference to the four demo pages.
- [ ] **[Implement]** Write or update the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Rename the pages with git mv and update the gallery links and specs.
- [ ] **[Verify]**    Run the shell, verifier, and floating action button specs, then the completion check.
- [ ] **[Doc]**       Update the style guide links and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-13] **[Doc]**
  Created at the user's request after the design system milestone.
