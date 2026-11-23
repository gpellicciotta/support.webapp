---
id: T0283
owner: "@gemini"
needs: []
branch: task/T0283-add-auth-s-shell-additions-to-shell-css
worktree: .plan/work/T0283-add-auth-s-shell-additions-to-shell-css
status: active
started_at: "2026-11-23T18:39:39Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0283: Add Auth's shell additions to shell.css: sidebar end group, entry badges, hidden top bar parts, and banner dismiss

## Goals
Add to `shell.css` what Auth and ToDo add locally: a sidebar list pinned to the sidebar end, and badges at the end of nav entries.
Also hide `hidden` top bar parts despite their display, size the brand logo, and end shell banners with their dismiss button.
Follow naming.md, so `nav-end` becomes a modifier of the nav list.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Shell Additions", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 70 lines.

## Task Execution Steps
- [ ] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [ ] **[Decide]**    Choose the class names and load order, following naming.md.
- [ ] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add the shell additions, its contract entry, and a gallery or shell demo section.
- [ ] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [ ] **[Visual]**    Capture the shell additions across looks and themes at mobile and desktop width.
- [ ] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

