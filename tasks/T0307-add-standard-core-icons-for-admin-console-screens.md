---
id: T0307
owner: "@gemini"
needs: []
branch: task/T0307-add-standard-core-icons-for-admin-console-screens
worktree: .plan/work/T0307-add-standard-core-icons-for-admin-console-screens
status: active
started_at: "2026-11-24T08:17:32Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0307: Add standard core icons for admin console screens from Auth

## Goals
Promote the seven Auth admin console screen icons (`icon-overview`, `icon-people`, `icon-sessions`, `icon-events`, `icon-logs`, `icon-broadcast`, `icon-note`) as standard core icons in `contract.json` and every look sprite.
Update the admin screen modules, gallery `#icon` section, `shell-admin-console.html`, and specs to use these standard icons by default.
See [technical-spec.md](T0307-add-standard-core-icons-for-admin-console-screens/technical-spec.md).

## Task Execution Steps
- [ ] **[Read]**      Inspect `src/contract.json`, the four look sprites, and the admin screen modules.
- [ ] **[Implement]** Add failing tests in `icon.test.js` and admin unit tests for the new core icons.
- [ ] **[Verify]**    Run the new tests and confirm they fail before updating sprites and modules.
- [ ] **[Implement]** Add the core icons to `contract.json`, all four look sprites, admin modules, and demos.
- [ ] **[Verify]**    Run `python scripts/devops.py check` and inspect gallery `#icon` and admin console screenshots.
- [ ] **[Doc]**       Update `visual-style-guide.md`, `components.md`, and `CHANGELOG.md`.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-24] **[Doc]**
  Companion task file scaffolded at task creation.
