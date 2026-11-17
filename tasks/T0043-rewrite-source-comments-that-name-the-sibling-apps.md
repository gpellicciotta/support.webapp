---
id: T0043
owner: "@claude"
session: claude-20261117-c19145
needs: []
branch: task/T0043-rewrite-source-comments-that-name-the-sibling-apps
worktree: .plan/work/T0043-rewrite-source-comments-that-name-the-sibling-apps
status: active
started_at: "2026-11-17T02:14:38Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 2, duration_s: 2111.2, input: 56, output: 7934, cache_read: 1337237, cache_write: 43257}
  review: {turns: 1, duration_s: 393.5, input: 87432, output: 2816, cache_read: 1269120, cache_write: 0}
review_status: pending
review_round: 2
review_requested_at: "2026-11-17T02:57:03Z"
review_session: codex-20261117-0b885a
work_duration: 1928.4
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
- [x] **[Read]**      List every sibling app mention in `src/` and the fact or license each one carries.
- [x] **[Doc]**       Rewrite each comment as a generic rationale, keeping required license notes.
- [x] **[Verify]**    Run the app-name search and the completion check, recording output in validation-proof.md.
- [x] **[Doc]**       Update CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-13] **[Doc]**
  Created at the user's request after the design system milestone.

- [2026-11-17] **[Verify]**
  Rewrote sibling app comments in 11 files; app-name search is clean; integration failure is worktree node_modules, passes on main.

- [2026-11-17] **[Read]**
  Listed mentions in field.js, icon.js, toast.js, and the look primitives and sprites.

- [2026-11-17] **[Doc]**
  Rewrote comments as generic rationale; kept the Feather MIT notice.

- [2026-11-17] **[Doc]**
  Added the CHANGELOG.md bullet.

- [2026-11-17] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-17] **[Review]**
  Round 1 rejected by @codex: [Decided]** Rejected because the required completion check fails in the reviewed worktree.
  - Findings: [review-findings-1.md](T0043-rewrite-source-comments-that-name-the-sibling-apps/review-findings-1.md).

- [2026-11-17] **[Verify]**
  Round 2: repaired worktree node_modules junction; devops check exit 0. Also edited src/looks/warm/primitives.css and warm/icons.svg (scope beyond declared files, comment-only).

- [2026-11-17] **[Review]**
  Round 2 requested (mode: agent).

