---
id: T0013
owner: ~
needs: [T0005]
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0013: Build the app shell stylesheet with its optional areas, scroll modes, width options, and demo pages

## Goals
Build `shell.css` and its documented markup, as [ADR-0004](../../docs/adrs/ADR-0004-app-shell.md) defines them.
Support every optional area, both scroll modes, the navigation choices, and the width options.
Add one demo page per adopter's settings from ADR-0004, reachable from the gallery.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [ ] **[Read]**      Read ADR-0004 and the todos.webapp shell stylesheet and layout at a recorded commit.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Write the shell stylesheet and the four demo pages, and link them from the gallery.
- [ ] **[Verify]**    Run the shell tests and the verifier until both pass.
- [ ] **[Visual]**    Capture the four demo pages per theme at 390 and 1440 px.
- [ ] **[Doc]**       Update the style guide and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.
