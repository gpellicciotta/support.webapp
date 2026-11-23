---
id: T0280
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
# T0280: Add a theme boot script and account theme sync to the theme switch, promoted from Auth

## Goals
Give apps a theme boot script that applies the stored `{{app-name}}.theme` before the first paint, with an optional legacy key migration.
Add account sync: read a `theme` or `style-settings` setting, apply it at sign-in, and save switch changes back through app callbacks.
Auth, counters, and meteo each hand-write the boot script today.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Theme Boot Script and Account Theme Sync", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 100 lines.

## Task Execution Steps
- [ ] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [ ] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [ ] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add the theme boot script and account sync, its contract entry, and a gallery or shell demo section.
- [ ] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [ ] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

