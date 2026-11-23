---
id: T0292
owner: "@gemini"
needs: []
branch: task/T0292-add-a-help-page-pattern-with-search-topic
worktree: .plan/work/T0292-add-a-help-page-pattern-with-search-topic
status: active
started_at: "2026-11-23T23:24:48Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0292: Add a help page pattern with search, topic chips, FAQ, and feedback link, promoted from Auth

## Goals
Add a help page pattern: a search with a clear button, topic filter chips, and section cards filtered by both.
FAQ collapsibles stay hidden until found, with Expand All, a no-results state, and `?q=` and `?topic=` links.
A feedback mail link carries the app version and the signed-in user.
Auth and counters both build this page; the help text stays with each app.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Help Page", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 150 lines.

## Task Execution Steps
- [ ] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [ ] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [ ] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add the help page pattern, its contract entry, and a gallery or shell demo section.
- [ ] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [ ] **[Visual]**    Capture the help page pattern across looks and themes at mobile and desktop width.
- [ ] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

