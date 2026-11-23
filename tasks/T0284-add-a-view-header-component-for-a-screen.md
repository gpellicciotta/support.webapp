---
id: T0284
owner: "@gemini"
needs: []
branch: task/T0284-add-a-view-header-component-for-a-screen
worktree: .plan/work/T0284-add-a-view-header-component-for-a-screen
status: active
started_at: "2026-11-23T19:26:01Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0284: Add a view header component for a screen's title and summary line, promoted from Auth

## Goals
Add a view header component: a screen's page title and an optional muted summary line.
Auth's SPA calls it `view-header` and its admin console `screen-title`.
The summary line may be a polite status, such as "3 unread · 12 total".
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "View Header", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 50 lines.

## Task Execution Steps
- [ ] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [ ] **[Decide]**    Choose the class names and load order, following naming.md.
- [ ] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add the view header, its contract entry, and a gallery or shell demo section.
- [ ] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [ ] **[Visual]**    Capture the view header across looks and themes at mobile and desktop width.
- [ ] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

