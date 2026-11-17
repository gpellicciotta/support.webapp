---
id: T0043
owner: "@claude"
needs: []
branch: task/T0043-rewrite-source-comments-that-name-the-sibling-apps
worktree: .plan/work/T0043-rewrite-source-comments-that-name-the-sibling-apps
status: active
started_at: "2026-11-17T02:14:38Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0043: Rewrite source comments that name the sibling apps as generic rationale, in the modules, looks, and demos.

## Goals
Rewrite comments in `src/` that cite todos.webapp, family-portal, meteo, auth, or counters as the reason behind each choice.
Keep a source note only where a glyph or font license requires attribution.
Change comments only; behavior, token values, and test names stay as they are.
Size note: 9 counted files cross the typical line; comment-only edits stay well under 400 lines.
Completion check: `python scripts/devops.py check` passes, and a search of `src/` finds no sibling app names outside license notes.
### Declared Files
- src/js/field.js
- src/js/icon.js
- src/js/toast.js
- src/looks/neutral/primitives.css
- src/looks/bright/primitives.css
- src/looks/neutral/icons.svg
- src/looks/warm/icons.svg
- src/looks/bright/icons.svg
- src/looks/_template/icons.svg
Size estimate: 9 files, 80 lines

## Task Execution Steps
- [ ] **[Read]**      List every sibling app mention in `src/` and the fact or license each one carries.
- [ ] **[Doc]**       Rewrite each comment as a generic rationale, keeping required license notes.
- [ ] **[Verify]**    Run the app-name search and the completion check, recording output in validation-proof.md.
- [ ] **[Doc]**       Update CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-13] **[Doc]**
  Created at the user's request after the design system milestone.
