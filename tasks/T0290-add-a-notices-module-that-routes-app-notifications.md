---
id: T0290
owner: "@gemini"
session: antigravity-20261123-18c692
needs: []
branch: task/T0290-add-a-notices-module-that-routes-app-notifications
worktree: .plan/work/T0290-add-a-notices-module-that-routes-app-notifications
status: active
started_at: "2026-11-23T21:50:47Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 3, duration_s: 2225.1, input: 541376, output: 81227, cache_read: 18605043}
work_duration: 1471.7
review_status: pending
review_round: 1
review_requested_at: "2026-11-23T22:29:11Z"
---
# T0290: Add a notices module that routes app notifications to banners and toasts, promoted from Auth

## Goals
Add a notices module with a notification store: errors and warnings stay as banners, at most three, and other notices become toasts.
The most severe sticky inbox notice shows as a banner with a link to all alerts.
Dismissing deletes the notice; action URLs must be same-origin paths or http(s) links.
Auth and counters each route notices locally.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Notices", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 5 files, 200 lines.

## Task Execution Steps
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the notices module, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Visual]**    Capture the notices module across looks and themes at mobile and desktop width.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

- [2026-11-23] **[Decided]**
  Chose key notices (src/js/notices.js) exporting createNotices, attachNotices, helpers, and event constants with data-notices-* hooks.

- [2026-11-23] **[Verify]**
  Confirmed unit and browser tests fail before implementation.
  - vitest failed: missing src/js/notices.js.
  - playwright failed: missing inbox banner and notice demo controls.

- [2026-11-23] **[Implement]**
  Added src/js/notices.js, contract entry, portal demo, and unit/browser tests.
  - 15 unit tests and 36 affected Playwright tests passed.
  - 20 UI verifier checks and 7 integration tests passed.

- [2026-11-23] **[Visual]**
  Captured before and after portal screenshots across neutral, warm, and bright looks.
  - Verified light and dark themes at 1440 px and 390 px.
  - Linked screenshots in companion validation-proof.md.

- [2026-11-23] **[Doc]**
  Updated components.md, ADR-0003, ADR-0004, and CHANGELOG.md.
  - Undeclared file touched: docs/adrs/ADR-0004-app-shell.md (1 line).
  - Counted diff: 6 files, 131 lines (within typical line).

- [2026-11-23] **[Verify]**
  Started supervised full check via python scripts/devops.py check.
  - PID: 37912 (handle 20261123T221039-28212-30cf8f).
  - Yielding turn until supervised verification completes.

- [2026-11-23] **[Verify]**
  Ran python scripts/devops.py check directly in-turn (task-62) with exit code 0.
  - Lint, 61 pytest, 2375 Vitest, 986 Playwright, 7 integration tests, and pack passed.
  - Recorded verbatim proof in validation-proof.md.

- [2026-11-23] **[Review]**
  Round 1 requested (mode: agent).

