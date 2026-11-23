---
id: T0274
owner: "@claude-code"
needs: []
branch: —
worktree: —
status: completed
started_at: "2026-11-23T10:09:15Z"
ended_at: "2026-11-23T10:59:49Z"
review: agent
preview: none
protocol: standard
review_status: approved
review_round: 2
review_requested_at: "2026-11-23T10:56:40Z"
review_session: antigravity-20261123-32b07a
reviewed_by: "@gemini"
completion-commit: 2a630c060465dcdb056c28c5f8b1f71300596825
---
# T0274: Add pull-to-refresh to the app shell, promoted from Auth's installed SPA

## Goals
Add pull-to-refresh to the app shell as the `pull-refresh` module and the `.app__pull-indicator` shell part.
It works only while the app runs installed; browser tabs keep their native pull-down reload.
Auth's SPA built it app-locally in T0249; keep its behavior, and move the indicator styles into `shell.css`.
The user chose on 2026-11-23 to promote it before a second app needs it, overriding the ADR-0003 sharing rule.
Record that exception in ADR-0003, document the part in ADR-0004, and show it in a shell demo.
Completion check: `python scripts/devops.py check` passes, with the new unit and browser tests green.

## Task Execution Steps
- [x] **[Read]**      Read Auth's pull-to-refresh module, styles, tests, and T0249, plus app-nav.js and ADR-0004.
- [x] **[Implement]** Author failing unit and browser tests for the gesture, threshold, indicator, and inactive cases.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add pull-refresh.js, the shell indicator styles, and the shell demo wiring.
- [x] **[Verify]**    Run the affected tests and the full check suite.
- [x] **[Visual]**    Capture the shell demo mid-pull across looks and themes at mobile width, before and after.
- [x] **[Doc]**       Update ADR-0003, ADR-0004, components.md, and CHANGELOG.md.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Read]**
  Read Auth's pull-to-refresh module, styles, wiring, and tests at c7129b8, plus app-nav.js, live-region.js, and ADR-0004.

- [2026-11-23] **[Decided]**
  Used the sprite's sync-syncing glyph, overridable by an icon option, since no look sprite holds a refresh glyph.

- [2026-11-23] **[Decided]**
  Also ignored pulls inside any scrolled ancestor, so the main scroll mode's scrolled main area keeps its own pan.

- [2026-11-23] **[Verify]**
  Added unit and browser tests; the unit file failed to import the missing module, and two browser tests failed as expected.

- [2026-11-23] **[Implement]**
  Added pull-refresh.js, the shell indicator styles, and the portal demo wiring with a sample refresh toast.

- [2026-11-23] **[Verify]**
  Confirmed python scripts/devops.py check passed linters, unit, browser, integration, and pack checks.
  - 2209 Vitest and 61 pytest tests passed.
  - 858 Playwright and 7 integration tests passed.

- [2026-11-23] **[Visual]**
  Captured the portal demo mid-pull across looks and themes at 390 px; see validation-proof.md for the links.

- [2026-11-23] **[Doc]**
  Updated ADR-0003, ADR-0004, components.md, the undeclared visual-style-guide.md, and CHANGELOG.md; seven counted files stay below the typical line.

- [2026-11-23] **[Verify]**
  Recorded task outcomes.
  - Files touched: 7.
  - Lines touched: 121.
  - Reopenings: 0.

- [2026-11-23] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-23] **[Review]**
  Round 1 rejected by @gemini: Rejected in round 1 with 3 blocking defects in `src/js/pull-refresh.js`.
  - Findings: [review-findings-1.md](T0274-add-pull-to-refresh-to-the-app-shell/review-findings-1.md).

- [2026-11-23] **[Implement]**
  Fixed round 1 findings: a zero move keeps the pull, a second finger or touchcancel drops it, and text node targets start pulls.
  - Listed both new test files in the style guide.

- [2026-11-23] **[Verify]**
  Added four unit tests that failed before the fixes and pass after them.

- [2026-11-23] **[Verify]**
  Confirmed python scripts/devops.py check passed after the rework.
  - 2213 Vitest and 61 pytest tests passed.
  - 858 Playwright and 7 integration tests passed.

- [2026-11-23] **[Verify]**
  Recorded task outcomes after the rework.
  - Files touched: 7.
  - Lines touched: 123.
  - Reopenings: 0.

- [2026-11-23] **[Review]**
  Round 2 requested (mode: agent).

- [2026-11-23] **[Review]**
  Round 2 approved by @gemini: Approved in round 2.
  - Findings: [review-findings-2.md](T0274-add-pull-to-refresh-to-the-app-shell/review-findings-2.md).

- [2026-11-23] **[Complete]**
  Task completed successfully.

