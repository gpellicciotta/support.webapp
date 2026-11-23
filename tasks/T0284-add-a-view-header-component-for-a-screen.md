---
id: T0284
owner: "@gemini"
session: antigravity-20261123-731837
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
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the class names and load order, following naming.md.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the view header, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Visual]**    Capture the view header across looks and themes at mobile and desktop width.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

- [2026-11-23] **[Decided]**
  Chose view-header key with __title and __text parts, imported before toolbar.css, collapsing empty summaries with :has(> .view-header__text:empty).

- [2026-11-23] **[Verify]**
  Confirmed red-phase failures: 4 unit tests and desktop-light view-header browser spec failed before implementation.

- [2026-11-23] **[Implement]**
  Added view-header.css, registered view-header in contract.json, imported it before toolbar.css, and added gallery specimens.

- [2026-11-23] **[Doc]**
  Updated components.md with the view-header catalog entry and upgrade note, ADR-0003 (undeclared file required by step 8), and CHANGELOG.md.

- [2026-11-23] **[Visual]**
  Captured before and after gallery screenshots across neutral, warm, and bright looks in light and dark themes at 390 px and 1440 px.
  - Before: [before-gallery-desktop-light.png](T0284-add-a-view-header-component-for-a-screen/before-gallery-desktop-light.png).
  - After: [after-view-header-neutral-desktop-light.png](T0284-add-a-view-header-component-for-a-screen/after-view-header-neutral-desktop-light.png).
  - Full set linked in validation-proof.md.

- [2026-11-23] **[Verify]**
  All lint, unit (2324), pytest (61), Playwright (962), integration (7), and dry-run pack checks passed.
  - Files touched: 5.
  - Lines touched: 36.
  - Reopenings: 0.

