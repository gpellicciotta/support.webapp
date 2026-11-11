---
id: T0010
owner: ~
needs: [T0008]
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0010: Extract the toast and live region modules from todos.webapp, including Undo and modal holding

## Goals
Extract the toaster as `createToast`, with `createToaster` as a deprecated alias, and the live region of todos.webapp, under [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md).
Keep Undo actions, persistent toasts, Ctrl+Z, and holding toasts while a modal is open.
Apply the notification tier rules of the counters ADR to the documentation.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [ ] **[Read]**      Read ADR-0003, the todos.webapp toast and live region modules, and the counters notification ADR.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Add the toast partial, the toaster and live region modules, and the gallery section.
- [ ] **[Verify]**    Run the toast tests and the verifier until both pass.
- [ ] **[Visual]**    Capture the gallery toast section per theme at 390 and 1440 px.
- [ ] **[Doc]**       Update the style guide and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.
