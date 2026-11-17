---
id: T0239
owner: ~
needs: []
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0239: Align top bar padding with the content column, align edge icons optically, and use vertical overflow dots at the bar's end

## Goals
Give `.app__top-bar` the main area's inline padding formula on both sides, so title and content text share a start edge at every width option.
Pull the first and last top bar icon buttons outward by their glyph inset, so glyphs, not 44 px boxes, align with content text.
Redraw `icon-more` as vertical dots in every look's sprite, and move the toolbar demo's overflow button to the bar's end.
Rendered options and the user's choice (option B, vertical dots at the end) are recorded in the 2026-11-17 layout review.
Guides measured 0 px start and end offsets in the portal demo at 390 and 1440 px; repeat that measurement as the browser check.

## Task Execution Steps
- [ ] **[Implement]** Implement required changes for T0239.
- [ ] **[Verify]**    Verify implementation with automated test suites.
- [ ] **[Doc]**       Update documentation and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-17] **[Doc]**
  Companion task file scaffolded at task creation.
