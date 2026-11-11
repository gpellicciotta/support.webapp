---
id: T0012
owner: ~
needs: [T0011]
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0012: Switch the popover and menu modules to the native popover attribute, keeping the anchoring code

## Goals
Replace `hidden` toggling with the native `popover` attribute, as decided in [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md).
Keep the anchoring code for placement, and use the platform's light dismiss and top layer.
Keep every existing keyboard behavior and test passing.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [ ] **[Read]**      Read ADR-0003 and the extracted menu and popover modules.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Move both modules and their styles to the popover attribute.
- [ ] **[Verify]**    Run the menu, popover, and overlay tests until they pass.
- [ ] **[Visual]**    Capture the gallery menu sections per theme at 390 and 1440 px.
- [ ] **[Doc]**       Update the style guide and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.
