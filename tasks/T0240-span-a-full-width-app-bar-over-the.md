---
id: T0240
owner: "@claude"
session: claude-20261117-b21a04
needs: []
branch: task/T0240-span-a-full-width-app-bar-over-the
worktree: .plan/work/T0240-span-a-full-width-app-bar-over-the
status: active
started_at: "2026-11-17T15:59:10Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 2, duration_s: 2451.7, input: 40, output: 7338, cache_read: 3825817, cache_write: 15601}
work_duration: 2492.4
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
- [x] **[Implement]** Implement required changes for T0240.
- [x] **[Verify]**    Verify implementation with automated test suites.
- [x] **[Doc]**       Update documentation and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-17] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-17] **[Implement]**
  Spanned the top bar and action bar over every wide column and added the app-nav toggle with rail, hidden, and drawer states.
  - New core glyph icon-nav-menu in every look.
  - Admin console brand moved into the bar.

- [2026-11-17] **[Verify]**
  Lint, unit, browser, integration, and build steps passed; see validation-proof.md and the before and after screenshots.
  - Before: [admin 1440](T0240-span-a-full-width-app-bar-over-the/before-admin-console-1440.png), [list 1440](T0240-span-a-full-width-app-bar-over-the/before-list-editor-1440.png).
  - After: [admin 1440](T0240-span-a-full-width-app-bar-over-the/after-admin-console-1440.png), [drawer](T0240-span-a-full-width-app-bar-over-the/after-admin-console-390-drawer.png), [rail](T0240-span-a-full-width-app-bar-over-the/after-list-editor-1440-rail.png).
  - npm install restored a missing declared ESLint plugin.

- [2026-11-17] **[Verify]**
  Recorded task outcomes.
  - Files touched: 16.
  - Lines touched: 385.
  - Reopenings: 0.

- [2026-11-17] **[Verify]**
  Resumed turn found the work committed, verified, and validated; no changes were needed before review.

