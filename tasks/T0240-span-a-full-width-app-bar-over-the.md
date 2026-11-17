---
id: T0240
owner: ~
needs: ['T0239']
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0240: Span a full-width app bar over the sidebar and side panel, with a hamburger toggling open, rail, and hidden navigation

## Goals
Make the top bar span every column in the wide layout, with the sidebar and side panel below it; the action bar or footer spans too.
Add a hamburger button at the bar's start whose glyph aligns with the navigation icons, and add a menu glyph to every look's sprite.
On wide screens, the button cycles the sidebar through open, icon rail, and hidden; keep `aria-expanded` and the label accurate.
Below 64 rem, the button opens the navigation as a drawer under the bar, with a backdrop, Escape, and focus return.
Move the admin console's brand into the bar and its page title into the content heading.
Update ADR-0004 and the shell section of the visual style guide.
The user chose this layout, including the icon rail, in the 2026-11-17 layout review.

## Task Execution Steps
- [ ] **[Implement]** Implement required changes for T0240.
- [ ] **[Verify]**    Verify implementation with automated test suites.
- [ ] **[Doc]**       Update documentation and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-17] **[Doc]**
  Companion task file scaffolded at task creation.
