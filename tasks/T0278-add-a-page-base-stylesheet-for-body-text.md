---
id: T0278
owner: ~
needs: []
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0278: Add a page base stylesheet for body text, headings, links, code, and the hidden guard, promoted from Auth

## Goals
Add a page base stylesheet that every app loads with its look: body ground, text, and font; headings; links; code; and the `hidden` guard.
The guard keeps `hidden="until-found"` panels in place, so find in page can open them.
Five apps repeat these rules today; the package styles only `.app`.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Page Base Stylesheet", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 80 lines.

## Task Execution Steps
- [ ] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [ ] **[Decide]**    Choose the class names and load order, following naming.md.
- [ ] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add the page base stylesheet, its contract entry, and a gallery or shell demo section.
- [ ] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [ ] **[Visual]**    Capture the page base stylesheet across looks and themes at mobile and desktop width.
- [ ] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

