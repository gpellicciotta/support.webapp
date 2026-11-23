---
id: T0289
owner: "@gemini"
session: antigravity-20261123-4a7532
needs: []
branch: task/T0289-add-an-action-registry-for-app-actions-with
worktree: .plan/work/T0289-add-an-action-registry-for-app-actions-with
status: active
started_at: "2026-11-23T21:23:42Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 1, duration_s: 1379.8, input: 281813, output: 52847, cache_read: 10121576}
review_status: pending
review_round: 1
review_requested_at: "2026-11-23T21:46:58Z"
---
# T0289: Add an action registry for app actions with enabled state and disabled reasons, promoted from Auth's App

## Goals
Add an action registry: add, remove, get, enable, disable with a reason, toggle, and run actions, with state change events.
Clicks on `data-action` elements run their action, and disabled actions do nothing.
T0276's `RoutedView` calls `addAction` and `removeAction` on an app the package does not provide; Auth and counters both run such an App.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Action Registry", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 150 lines.

## Task Execution Steps
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the action registry, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

- [2026-11-23] **[Decided]**
  Chose key action-registry with createActionRegistry and attachActionRegistry in src/js/action-registry.js, using CustomEvent constants and onNavigate callback.

- [2026-11-23] **[Doc]**
  Updated undeclared file docs/adrs/ADR-0003-components-and-patterns.md with the sharing-rule decision; total counted changes are 5 files and 74 lines.

- [2026-11-23] **[Verify]**
  Verified action-registry unit, browser, lint, build, and full check suites; generate-app.test.js failed only on cache-only worktree node_modules.
  - 14 new unit tests and 4 new E2E tests passed.
  - Lint, 61 pytest, 2360 unit, 978 E2E, pack, vendor passed.

- [2026-11-23] **[Verify]**
  Recorded task outcomes.
  - Files touched: 5.
  - Lines touched: 74.
  - Reopenings: 0.

- [2026-11-23] **[Implement]**
  Implemented src/js/action-registry.js, wired it into src/demo/shell-demo.js, registered action-registry in src/contract.json, and added unit and Playwright tests.

- [2026-11-23] **[Review]**
  Round 1 requested (mode: agent).

