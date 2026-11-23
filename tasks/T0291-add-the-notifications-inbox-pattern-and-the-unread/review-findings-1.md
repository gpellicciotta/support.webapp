---
task: T0291
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-23T23:04:09Z
reviewed_commit: "8eadc4f"
base_commit: "301d130"
branch: task/T0291-add-the-notifications-inbox-pattern-and-the-unread
---
# Review Findings: Task T0291 (Round 1)

## Summary
Approved; every goal and acceptance criterion is met.
- `inbox.js` renders one selectable row per notification on `selection.js`.
  Rows carry a type badge, an unread edge and badge, source and time chips, and Open, Mark Read, and Discard actions.
- Bulk Mark Read and Discard, Discard All, the empty state, the loading state, and the summary line all work.
- `attachUnreadButton` caps both the badge and the accessible name at `99+`.
  It reads the count from the T0290 `notices.js` store.
- Actions leave as bubbling `inbox:action` and cancelable `inbox:navigate` events, so the package knows no API.
- JS hooks are `data-*` attributes; all DOM is built without `innerHTML`; `safeUrl` blocks unsafe and `//host` links.
- `components.md` drops "Inbox panel" from the not-in-package list and adds the catalog row, section, and upgrade notes.
- The contract entry, ADR-0003, ADR-0004, the style guide, the gallery section, and CHANGELOG.md are updated.
- The unit tests cover the spec: row markup per type and read state, 99+, bulk events, and escaping.
- The portal e2e test selects two rows, chooses Mark Read, and asserts the badge, the aria-label, and the summary update.
- I reran `python scripts/devops.py check` on `8eadc4f`; it exited 0.
  - Markdown, Ruff, and ESLint passed.
  - pytest: 61 passed, 1 skipped.
  - Vitest: 2391 passed in 49 files.
  - Playwright: 994 passed, 42 skipped.
  - Integration: 7 passed.
- The 12 after-screenshots cover neutral, warm, and bright looks in light and dark, at desktop and mobile width.

## Defects
None.

## Process Gaps
Non-blocking:
1. At 390 px, the portal breadcrumb now clips to "Calend" with no ellipsis.
   The new top-bar button takes the room, and `.app__breadcrumb` uses `overflow: hidden` by design.
   Consider `text-overflow: ellipsis` on the current crumb in a follow-up.
2. `<p class="inbox__message">` sits inside `<span class="row__main inbox__main">`.
   That breaks the HTML content model in `inbox.js`, the components.md example, and the gallery, though it renders correctly.
   A `span` or a `div` main would be valid.
3. Rows with a `deletion-time` still render; `isUnread` only leaves them out of the count.
   Apps must filter deleted notifications before calling `setNotifications` or `setInboxNotifications`.
4. The Execution Log is out of order: the **[Read]** and **[Implement]** entries come after the final **[Verify]** entry.
5. Declared files grew from 7 to 10 (247 lines); the log records the reason.

## Required Rework
None.
