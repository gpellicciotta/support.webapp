---
id: T0290
owner: "@gemini"
needs: []
branch: task/T0290-add-a-notices-module-that-routes-app-notifications
worktree: .plan/work/T0290-add-a-notices-module-that-routes-app-notifications
status: active
started_at: "2026-11-23T21:50:47Z"
ended_at: —
review: agent
preview: none
protocol: standard
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
- [ ] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [ ] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [ ] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add the notices module, its contract entry, and a gallery or shell demo section.
- [ ] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [ ] **[Visual]**    Capture the notices module across looks and themes at mobile and desktop width.
- [ ] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

