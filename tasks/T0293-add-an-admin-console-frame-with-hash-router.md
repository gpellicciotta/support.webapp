---
id: T0293
owner: "@gemini"
session: antigravity-20261124-3c9452
needs: []
branch: task/T0293-add-an-admin-console-frame-with-hash-router
worktree: .plan/work/T0293-add-an-admin-console-frame-with-hash-router
status: active
started_at: "2026-11-24T01:41:54Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 3, duration_s: 2162.1, input: 1245815, output: 104925, cache_read: 28793809}
work_duration: 1888.9
review_status: pending
review_round: 1
review_requested_at: "2026-11-24T02:18:55Z"
---
# T0293: Add an admin console frame with hash router, screen registry, and gate pages, promoted from Auth

## Goals
Add an admin console frame: a screen registry with `mount`, `update`, and `dispose`, a hash router, route marks, and screen titles.
Include the shell with its side panel, centered gate pages for session checks and forbidden access, and a signed-out shell.
Auth's and ToDo's admin consoles share this frame in two drifted copies.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Admin Console Frame", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 6 files, 220 lines.

## Task Execution Steps
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the admin console frame, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Visual]**    Capture the admin console frame across looks and themes at mobile and desktop width.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

- [2026-11-24] **[Decided]**
  Chose key admin-console with createAdminConsole, attachAdminConsole, parseRoute, and displayName in src/js/admin-console.js, plus .app__gate styles in src/css/shell.css.

- [2026-11-24] **[Visual]**
  Captured before and after screenshots across neutral, warm, and bright looks in light and dark themes at 390px and 1440px.
  - Before: [before-admin-console-neutral-desktop-light.png](T0293-add-an-admin-console-frame-with-hash-router/before-admin-console-neutral-desktop-light.png).
  - After overview: [after-admin-console-overview-neutral-desktop-light.png](T0293-add-an-admin-console-frame-with-hash-router/after-admin-console-overview-neutral-desktop-light.png).
  - After gate: [after-admin-console-gate-neutral-desktop-light.png](T0293-add-an-admin-console-frame-with-hash-router/after-admin-console-gate-neutral-desktop-light.png).

- [2026-11-24] **[Verify]**
  Passed lint, pytest, 2469 Vitest tests, 1032 Playwright tests, 7 integration tests, and dry-run pack; recorded task outcomes.
  - Files touched: 6.
  - Lines touched: 295.
  - Reopenings: 0.

- [2026-11-24] **[Read]**
  Reviewed technical-spec.md, the Auth audit section, Auth and ToDo admin console mains, ADR-0003, ADR-0004, and naming.md.

- [2026-11-24] **[Implement]**
  Added admin-console.js, .app__gate shell styles, contract entry, unit and browser tests, and updated shell-admin-console demo and docs.

- [2026-11-24] **[Verify]**
  Confirmed red-phase failures in admin-console.test.js and admin-console.spec.js before implementation; recorded verbatim proof in validation-proof.md.

- [2026-11-24] **[Review]**
  Round 1 requested (mode: agent).

