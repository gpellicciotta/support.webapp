---
id: T0027
owner: ~
needs: [T0010]
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0027: Add the theme switch and service worker update modules, and document the shared patterns

## Goals
Add the shared patterns of [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md) that todos.webapp already implements.
`theme.js` applies System, Light, or Dark to `data-theme` and stores the choice.
`sw-update.js` shows an Update toast for a waiting service worker and reloads on request.
Document the delete and Undo, offline page, and `aria-current` patterns in the style guide.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [ ] **[Read]**      Read ADR-0003 and the todos.webapp settings view and service worker update module.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Add the theme and update modules and the gallery theme switch on them.
- [ ] **[Verify]**    Run the unit tests and the browser test until they pass.
- [ ] **[Doc]**       Document all five patterns in the style guide, and update CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.
