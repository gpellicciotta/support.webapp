---
id: T0273
owner: "@claude-code"
needs: []
branch: —
worktree: —
status: active
started_at: "2026-11-23T09:06:59Z"
ended_at: —
review: agent
preview: none
protocol: standard
review_status: pending
review_round: 1
review_requested_at: "2026-11-23T09:37:44Z"
---
# T0273: Promote the entry list of log lines and events from Auth's admin console into the package

## Goals
Add the `entry-list` component: spaced cards of log lines or events, newest first, in a labeled native list.
Each card shows its message first, then a wrapping chip row starting with a clock time chip.
Auth's Logs and System events screens built it in `webapp/admin/css/admin.css`; keep its class names.
The user chose on 2026-11-23 to promote it before a second app needs it, overriding the ADR-0003 sharing rule.
Record that exception in ADR-0003 and add the catalog entry, skeleton, gallery section, and style guide advice.
Completion check: `python scripts/devops.py check` passes, with the new unit and browser tests green.

## Task Execution Steps
- [x] **[Read]**      Read Auth's entry list CSS, markup, and spec, plus the package chip and list components.
- [x] **[Implement]** Author failing unit and browser tests for the entry list contract and gallery section.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add entry-list.css, the contract key, the style import, and the gallery section.
- [x] **[Verify]**    Run the affected tests and the full check suite.
- [x] **[Visual]**    Capture before and after gallery screenshots across looks, themes, and viewports.
- [x] **[Doc]**       Update components.md, the style guide, ADR-0003, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Read]**
  Read Auth's entry list CSS, builders, and spec, plus the package chip, list, and pager components.

- [2026-11-23] **[Decided]**
  Kept Auth's class names, added the entry-list__details part, and selected chips as chip row children so the partial never names the chip block.

- [2026-11-23] **[Verify]**
  Added unit and browser tests and confirmed the expected red-phase failures.

- [2026-11-23] **[Implement]**
  Added entry-list.css, the contract key, the style import, and the gallery section with log and event cards.

- [2026-11-23] **[Verify]**
  Confirmed python scripts/devops.py check passed linters, unit, browser, integration, and pack checks.
  - 2193 Vitest and 61 pytest tests passed.
  - 842 Playwright and 7 integration tests passed.

- [2026-11-23] **[Visual]**
  Captured gallery screenshots across looks, themes, and viewports; see validation-proof.md for the links.

- [2026-11-23] **[Doc]**
  Updated components.md, the style guide, ADR-0003, and CHANGELOG.md under v0.3.1-pre.

- [2026-11-23] **[Verify]**
  Recorded task outcomes.
  - Files touched: 6.
  - Lines touched: 102.
  - Reopenings: 0.

- [2026-11-23] **[Review]**
  Round 1 requested (mode: agent).

