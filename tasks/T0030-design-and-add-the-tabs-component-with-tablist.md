---
id: T0030
owner: "@codex"
session: codex-20261112-b7526c
needs: []
branch: task/T0030-design-and-add-the-tabs-component-with-tablist
worktree: .plan/work/T0030-design-and-add-the-tabs-component-with-tablist
status: suspended
started_at: "2026-11-12T20:00:46Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0030: Design and add the tabs component with tablist roles and arrow-key navigation

## Goals
Design and add the `tabs` component, under [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md) and [components.md](../../docs/specs/components.md).
No sibling app has tabs, so the task records the markup skeleton and keyboard model for approval first.
Tabs use the tablist, tab, and tabpanel roles, with arrow keys, Home, and End.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [x] **[Read]**      Read ADR-0003, components.md, naming.md, and the WAI-ARIA pattern the component follows.
- [x] **[Decide]**    Record the markup skeleton, keyboard model, and states in components.md for user approval.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Add the tabs partial, `attachTabs` in `tabs.js`, and the gallery section.
- [ ] **[Verify]**    Run the named tests and the gallery verifier until both pass.
- [ ] **[Visual]**    Capture the new gallery sections per theme at 390 and 1440 px.
- [ ] **[Doc]**       Update the style guide, components.md, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 round 2 from the review findings F18 to F20.

- [2026-11-12] **[Decide]**
  Recorded the proposed tabs contract in components.md. User approval remains required before implementation; automatic activation, keyboard behavior, hooks, states, and script-free content are specified.

- [2026-11-12] **[Verify]**
  Offline Markdown lint and git diff checks passed. Online lint encountered W3C HTTP 403; browsing retrieved the source. Recorded validation-proof.md. Implementation awaits user approval.

