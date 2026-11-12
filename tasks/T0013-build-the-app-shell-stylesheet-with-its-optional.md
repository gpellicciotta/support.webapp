---
id: T0013
owner: "@claude"
session: claude-20261112-5d5f71
needs: []
branch: task/T0013-build-the-app-shell-stylesheet-with-its-optional
worktree: .plan/work/T0013-build-the-app-shell-stylesheet-with-its-optional
status: active
started_at: "2026-11-12T18:00:13Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 8, duration_s: 6518.6, input: 512, output: 153588, cache_read: 43330136, cache_write: 445572}
  review: {turns: 4, duration_s: 941.0, input: 90556, output: 7862, cache_read: 2182920, cache_write: 4012}
review_status: pending
review_round: 3
work_duration: 4684.8
---
# T0013: Build the app shell stylesheet with its optional areas, scroll modes, width options, and demo pages

## Goals
Build `shell.css` and its documented markup, as [ADR-0004](../../docs/adrs/ADR-0004-app-shell.md) defines them.
Support every optional area, both scroll modes, the navigation choices, and the width options.
Add one demo page per adopter's settings from ADR-0004, reachable from the gallery.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [x] **[Read]**      Read ADR-0004 and the todos.webapp shell stylesheet and layout at a recorded commit.
- [x] **[Implement]** Write the failing tests named in the technical specification.
- [x] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [x] **[Implement]** Write the shell stylesheet and the four demo pages, and link them from the gallery.
- [x] **[Verify]**    Run the shell tests and the verifier until both pass.
- [x] **[Visual]**    Capture the four demo pages per theme at 390 and 1440 px.
- [x] **[Doc]**       Update the style guide and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.

- [2026-11-12] **[Read]**
  Read ADR-0004 and todos.webapp app-shell.css and app-chrome.css at commit 0cf4981.

- [2026-11-12] **[Verify]**
  Wrote shell.spec.js; all 100 browser checks failed before the implementation, as validation-proof.md records.

- [2026-11-12] **[Implement]**
  Added shell.css, four demo pages, shell-demo.js, and the gallery App shell section; moved the toast region position into shell.css.
  - Undeclared: toast.css, gallery.css, gallery.js, components.md, verify-ui.spec.js.
  - Undeclared new file: src/demo/shell-demo.js.

- [2026-11-12] **[Verify]**
  Shell spec passed 100 tests; verifier passed 108 after waiting for transitions; devops check exited 0.
  - Evidence in validation-proof.md.

- [2026-11-12] **[Visual]**
  Captured 16 demo screenshots per theme at 390 and 1440 px, linked from validation-proof.md.

- [2026-11-12] **[Doc]**
  Updated the style guide Shell section, the components catalog, and CHANGELOG.md.

- [2026-11-12] **[Verify]**
  Recorded task outcomes.
  - Files touched: 8.
  - Lines touched: 92.
  - Reopenings: 0.

- [2026-11-12] **[Visual]**
  Captured gallery screenshots before and after the new App shell section.
  - Before: [gallery-before.png](T0013-build-the-app-shell-stylesheet-with-its-optional/screenshots/gallery-before.png).
  - After: [gallery-after.png](T0013-build-the-app-shell-stylesheet-with-its-optional/screenshots/gallery-after.png).

- [2026-11-12] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-12] **[Review]**
  Round 1 rejected by @claude-2: The work is mostly solid and matches ADR-0004 closely.
  - Findings: [review-findings-1.md](T0013-build-the-app-shell-stylesheet-with-its-optional/review-findings-1.md).

- [2026-11-12] **[Implement]**
  Fixed review round 1 defects: full-height sticky side columns, action bar end inset, and a working counters sample menu.
  - Three new shell.spec.js checks failed first, then passed.

- [2026-11-12] **[Verify]**
  Shell spec passed 110 tests with 2 narrow skips; devops check exited 0; evidence in validation-proof.md.

- [2026-11-12] **[Review]**
  [Feedback Needed] Confirm counters keeps actions in the action bar on wide screens, leaving the top-bar move app-local, despite ADR-0004 listing it.

- [2026-11-12] **[Decided]**
  Orchestrator decided under the user's standing authority: counters moves its wide-screen actions into app__top-actions in its own code. The shell adds no option; ADR-0004 describes counters' behavior, not a shell feature.

- [2026-11-12] **[Doc]**
  Replaced the style guide question with the recorded decision: counters moves wide-screen actions into app__top-actions in its own code; lint exited 0.

- [2026-11-12] **[Review]**
  Round 2 requested (mode: agent).

- [2026-11-12] **[Review]**
  Round 2 rejected by @codex: [Decided]** Rejected because the supplied worktree contains an unfinished rebase with unresolved conflicts.
  - Findings: [review-findings-2.md](T0013-build-the-app-shell-stylesheet-with-its-optional/review-findings-2.md).

- [2026-11-12] **[Implement]**
  Resolved the two documentation conflicts of the rebase onto eb7645d by keeping both sides, and finished the rebase on the task branch.
  - Commits now 2bf091c, 5470d89, f4f3993; no unmerged paths.

- [2026-11-12] **[Verify]**
  Shell spec passed 110; full browser suite passed 490; two check runs each hit one load-dependent gallery flake, tracked by T0036.
  - Evidence in validation-proof.md.

- [2026-11-12] **[Review]**
  Round 3 requested (mode: agent).

