---
id: T0286
owner: "@gemini"
session: antigravity-20261123-e09e85
needs: []
branch: task/T0286-add-a-screen-action-bar-renderer-for-the
worktree: .plan/work/T0286-add-a-screen-action-bar-renderer-for-the
status: active
started_at: "2026-11-23T20:40:59Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 1, duration_s: 1800.5, input: 2320, output: 175}
work_duration: 1813.9
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
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the screen action bar renderer, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Visual]**    Capture the screen action bar renderer across looks and themes at mobile and desktop width.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

- [2026-11-23] **[Decided]**
  Chose key screen-action-bar with attachScreenActionBar in src/js/screen-action-bar.js.
  - Uses data-screen-action-bar hooks and data-action attributes without style-class hooks.
  - Demo integrates with SampleView in shell-portal.html.

- [2026-11-23] **[Implement]**
  Added src/js/screen-action-bar.js, contract entry, unit and browser tests, and portal demo integration.
  - Also updated ADR-0003 and ADR-0004 (undeclared) per Doc step.

- [2026-11-23] **[Visual]**
  Captured and inspected before/after screenshots across neutral, warm, and bright looks, light/dark themes, mobile/desktop.
  - Before: [before-shell-portal.png](T0286-add-a-screen-action-bar-renderer-for-the/before-shell-portal.png).
  - After: [after-neutral-light-desktop.png](T0286-add-a-screen-action-bar-renderer-for-the/after-neutral-light-desktop.png), [after-neutral-dark-desktop.png](T0286-add-a-screen-action-bar-renderer-for-the/after-neutral-dark-desktop.png).
  - Mobile: [after-neutral-light-mobile.png](T0286-add-a-screen-action-bar-renderer-for-the/after-neutral-light-mobile.png), [after-warm-dark-mobile.png](T0286-add-a-screen-action-bar-renderer-for-the/after-warm-dark-mobile.png), [after-bright-dark-mobile.png](T0286-add-a-screen-action-bar-renderer-for-the/after-bright-dark-mobile.png).

- [2026-11-23] **[Verify]**
  All lint, unit (2346), pytest (61), browser (974), integration (7), and pack checks passed.
  - Files touched: 6.
  - Lines touched: 132.
  - Reopenings: 0.

- [2026-11-23] **[Read]**
  Reviewed technical-spec.md, auth-webapp-ui-audit.md, Auth app-shell.mjs, counters app-action-bar.mjs, naming.md, and ADR-0003/ADR-0004.

- [2026-11-23] **[Verify]**
  Confirmed red-phase failures for missing screen-action-bar.js module and demo hook before implementation.

- [2026-11-23] **[Doc]**
  Updated components.md with upgrade notes, ADR-0003, ADR-0004, and CHANGELOG.md.

