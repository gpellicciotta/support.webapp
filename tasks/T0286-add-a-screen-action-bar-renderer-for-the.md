---
id: T0286
owner: "@gemini"
needs: []
branch: task/T0286-add-a-screen-action-bar-renderer-for-the
worktree: .plan/work/T0286-add-a-screen-action-bar-renderer-for-the
status: active
started_at: "2026-11-23T20:40:59Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0286: Add a screen action bar renderer for the screen actions of routed views, promoted from Auth's shell

## Goals
Add a renderer for the screen actions that T0276's `RoutedView` passes to `app.setScreenActions`.
It draws buttons or links in `app__action-bar`, marks disabled actions, shows disabled reasons as hints, and removes an empty bar.
Auth's shell and counters' `app-action-bar.mjs` do this locally.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Screen Action Bar", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 70 lines.

## Task Execution Steps
- [ ] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [ ] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [ ] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add the screen action bar renderer, its contract entry, and a gallery or shell demo section.
- [ ] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [ ] **[Visual]**    Capture the screen action bar renderer across looks and themes at mobile and desktop width.
- [ ] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

