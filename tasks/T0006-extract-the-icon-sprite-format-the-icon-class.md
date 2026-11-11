---
id: T0006
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
# T0006: Extract the icon sprite format, the icon class, and the spriteIcon builder, with the todos glyph set

## Goals
Extract the icon system of todos.webapp, as [ADR-0002](../../docs/adrs/ADR-0002-looks.md) and [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md) define it.
Fix the core icon id list that every look sprite must provide.
Add the `.icon` class, the `spriteIcon` builder module, and the `todos` look sprite.
Show every glyph in the gallery and check every sprite reference in the browser.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [ ] **[Read]**      Read ADR-0002, ADR-0003, and the todos.webapp sprite and builder at a recorded commit.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Add the icon class, builder module, todos sprite, core id list, and gallery section.
- [ ] **[Verify]**    Run the icon tests and the verifier until both pass.
- [ ] **[Visual]**    Capture the gallery icon section per theme at 390 and 1440 px.
- [ ] **[Doc]**       Update the style guide and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.
