---
id: T0277
owner: "@claude-code"
needs: []
branch: —
worktree: —
status: completed
started_at: "2026-11-23T12:03:07Z"
ended_at: "2026-11-23T12:25:43Z"
review: none
preview: none
protocol: standard
review_status: pending
review_round: 1
review_requested_at: "2026-11-23T12:03:15Z"
completion-commit: 8da1935f42e30a37f26035425ddf859e8668930c
---
# T0277: Audit Auth's webapp for further UI and view code that support.webapp should provide to every app

## Goals
Investigation only: list the UI and view code in Auth's webapp that other apps could share, and propose one promotion task each.
The user decided on 2026-11-23 that everything apps can share belongs in support.webapp.
Compare with counters' webapp, and with what the package already offers, before proposing.
Findings go in `docs/analysis/`, ranked by reuse and effort; this task changes nothing else.
Completion check: the analysis lists every candidate with its Auth path, size, and consumer apps, and `markdownlint` passes.

### Declared Files
- docs/analysis/auth-webapp-ui-audit.md
- docs/index.md
- AGENTS.md
- CHANGELOG.md

## Task Execution Steps
- [x] **[Read]**      Read Auth's `webapp/js/view/`, `webapp/js/utils/`, and `webapp/admin/js/`, plus the package catalog.
- [x] **[Read]**      Read counters' webapp views for the same patterns.
- [x] **[Decide]**    Sort candidates into promote now, wait for a second app, and keep app-local, with reasons.
- [x] **[Doc]**       Write the analysis and create one backlog task per promote-now candidate.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from Auth's T0251 and the user's decision on shared UI code.

- [2026-11-23] **[Read]**
  Read Auth's SPA views, utilities, app core, and admin console at eeb9439, plus the package catalog at 8da1935 and the T0276 view module.

- [2026-11-23] **[Read]**
  Compared counters at 22884ed, ToDo's admin console at 8992db5, todos.webapp, and meteo for the same parts.

- [2026-11-23] **[Decided]**
  Sorted parts into 18 promote now, 5 waiting for a second app, app-local identity flows, and 10 already provided.

- [2026-11-23] **[Decided]**
  No screenshot: the audit read source code, not the running UI; TF017 does not apply to this task.

- [2026-11-23] **[Doc]**
  Wrote docs/analysis/auth-webapp-ui-audit.md, linked it from docs/index.md and AGENTS.md, and created backlog tasks T0278 to T0295 with specs.

- [2026-11-23] **[Verify]**
  Markdown lint, Ruff, ESLint, the Markdown link test, and plan tasks validate all pass; proof in validation-proof.md.

- [2026-11-23] **[Doc]**
  Restarted the task: the first start reported success, but PLAN.md and frontmatter later showed it ready, likely overwritten by the concurrent T0276 session.

- [2026-11-23] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-23] **[Review]**
  Review lowered from agent to none by @gpellicciotta: The user declined an additional review on 2026-11-23..

- [2026-11-23] **[Decided]**
  The user decided to ship the shared admin screens; created T0296 to T0302 with an adapter per screen, and updated the audit.

- [2026-11-23] **[Verify]**
  Recorded task outcomes.
  - Files touched: 2.
  - Lines touched: 3.
  - Reopenings: 0.

- [2026-11-23] **[Complete]**
  Task completed successfully.

