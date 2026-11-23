---
id: T0285
owner: "@gemini"
needs: []
branch: task/T0285-add-a-file-download-helper-and-download-toast
worktree: .plan/work/T0285-add-a-file-download-helper-and-download-toast
status: active
started_at: "2026-11-23T20:00:55Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0285: Add a file download helper and download toast actions, promoted from Auth's account export

## Goals
Add a file download helper that hands the viewer a JSON value or blob as a named file.
Let a persistent toast offer the file as its action, and revoke the object URL when the toast goes.
Auth's account export and admin console, and counters' account export, need it.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "File Download Helper", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 4 files, 80 lines.

## Task Execution Steps
- [ ] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [ ] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [ ] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [ ] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [ ] **[Implement]** Add the file download helper, its contract entry, and a gallery or shell demo section.
- [ ] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [ ] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

