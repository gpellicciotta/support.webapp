---
id: T0294
owner: "@gemini"
session: antigravity-20261124-12a24e
needs: []
branch: task/T0294-add-dom-builders-for-package-components-promoted-from
worktree: .plan/work/T0294-add-dom-builders-for-package-components-promoted-from
status: active
started_at: "2026-11-24T00:02:28Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 1, duration_s: 1154.9, input: 401726, output: 75039, cache_read: 16271603}
review_status: pending
review_round: 1
review_requested_at: "2026-11-24T00:21:55Z"
---
# T0294: Add DOM builders for package components, promoted from Auth's and ToDo's admin console helpers

## Goals
Add DOM builders: the `h` element builder and `setChildren`, plus builders that emit the catalog skeletons.
Cover buttons, selects, checkboxes, facts, data tables, severity chips, status lines, error banners, empty states, and inline confirmation slots.
Auth's and ToDo's admin consoles carry copies that differ in 405 lines.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "DOM Builders", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 120 lines.

## Task Execution Steps
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the DOM builders, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

- [2026-11-24] **[Decided]**
  Chose key dom-builders (src/js/dom-builders.js) exporting createDomBuilders plus h, setChildren, button, select, checkbox, facts, dataTable, severityOf, severityChip, statusLine, errorBanner, emptyState, and inlineConfirm.

- [2026-11-24] **[Verify]**
  Confirmed unit and browser tests fail before implementation.
  - vitest failed: missing src/js/dom-builders.js.
  - playwright failed: admin console missing builder hooks.

- [2026-11-24] **[Implement]**
  Added dom-builders.js, registered dom-builders in contract.json, and rebuilt the admin console demo with the builders.

- [2026-11-24] **[Verify]**
  Verified lint, fast suites, affected browser specs, UI verifier, packaging, and before/after admin console screenshots.
  - 61 pytest and 2425 vitest tests passed.
  - 139 shell/detail/builder and 10 UI verifier tests passed.
  - Screenshots saved in companion directory.

- [2026-11-24] **[Verify]**
  Recorded task outcomes.
  - Files touched: 4.
  - Lines touched: 226.
  - Reopenings: 0.

- [2026-11-24] **[Review]**
  Round 1 requested (mode: agent).

