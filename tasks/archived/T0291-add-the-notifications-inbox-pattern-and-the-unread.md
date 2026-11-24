---
id: T0291
owner: "@gemini"
session: antigravity-20261123-03cdc4
needs: []
branch: task/T0291-add-the-notifications-inbox-pattern-and-the-unread
worktree: .plan/work/T0291-add-the-notifications-inbox-pattern-and-the-unread
status: completed
started_at: "2026-11-23T22:32:34Z"
ended_at: "2026-11-23T23:24:18Z"
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 2, duration_s: 1854.1, input: 466799, output: 82201, cache_read: 20420603}
  review: {turns: 1, duration_s: 1194.1, input: 8, output: 2262, cache_read: 289083, cache_write: 2840}
work_duration: 3102.9
review_status: approved
review_round: 1
review_requested_at: "2026-11-23T23:04:07Z"
reviewed_by: "@claude"
review_session: claude-20261124-856192
completion-commit: 83f1ae153248aa7918e12b30e7dff12f8a6b48d6
---
# T0291: Add the notifications inbox pattern and the unread count button, promoted from Auth

## Goals
Add the notifications inbox: one selectable row per notification with type badge, unread mark, source and time chips, and row actions.
Add bulk Mark Read and Discard, Discard All, an empty state, and a summary line.
Add the top bar button whose badge and accessible name carry the unread count, capped at 99+.
Remove "Inbox panel" from the catalog's not-in-package list.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Notifications Inbox and Unread Button", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 7 files, 220 lines.

## Task Execution Steps
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the inbox pattern and unread button, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Visual]**    Capture the inbox pattern and unread button across looks and themes at mobile and desktop width.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

- [2026-11-23] **[Decided]**
  Chose component key inbox with inbox.js, inbox.css, and shell.css unread button parts.
  - Exports: createInbox, attachInbox, createUnreadButton, attachUnreadButton, helpers.
  - Events: inbox:action and inbox:navigate; integrates notices.js and selection.js.

- [2026-11-23] **[Verify]**
  Confirmed new unit and browser tests fail before implementation.
  - vitest failed: ../../src/js/inbox.js not found.
  - playwright failed: [data-inbox-button] missing on shell-portal.html.

- [2026-11-23] **[Visual]**
  Captured before and after portal screenshots across neutral, warm, and bright looks in light and dark themes.
  - Before: [before-portal-desktop-light.png](T0291-add-the-notifications-inbox-pattern-and-the-unread/before-portal-desktop-light.png).
  - After desktop: [after-portal-neutral-light-desktop.png](T0291-add-the-notifications-inbox-pattern-and-the-unread/after-portal-neutral-light-desktop.png).
  - After mobile: [after-portal-bright-light-mobile.png](T0291-add-the-notifications-inbox-pattern-and-the-unread/after-portal-bright-light-mobile.png).
  - After dark: [after-portal-warm-dark-desktop.png](T0291-add-the-notifications-inbox-pattern-and-the-unread/after-portal-warm-dark-desktop.png).

- [2026-11-23] **[Doc]**
  Updated components.md, ADR-0003, ADR-0004, visual-style-guide.md, gallery, and CHANGELOG.md for inbox.
  - Size note: 10 files (247 lines); tokens test requires gallery section, shell docs require ADR-0004.
  - Undeclared files: visual-style-gallery.html, ADR-0004-app-shell.md, visual-style-guide.md.

- [2026-11-24] **[Verify]**
  Verified lint, pytest, 2391 unit tests, 994 Playwright checks, 7 integration tests, and pack.
  - Files touched: 10.
  - Lines touched: 247.
  - Reopenings: 0.

- [2026-11-24] **[Read]**
  Reviewed technical-spec.md, Auth audit section, Auth notifications-view.mjs and app-shell.mjs, and counters notifications-view.mjs.

- [2026-11-24] **[Implement]**
  Implemented inbox.js, inbox.css, top-bar unread button styles in shell.css, contract entry, gallery and portal demos, and tests.

- [2026-11-24] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-24] **[Review]**
  Round 1 approved by @claude: Approved; every goal and acceptance criterion is met.
  - Findings: [review-findings-1.md](T0291-add-the-notifications-inbox-pattern-and-the-unread/review-findings-1.md).

- [2026-11-24] **[Complete]**
  Task completed successfully.

