---
id: T0307
owner: "@gemini"
session: antigravity-20261124-fd445d
needs: []
branch: task/T0307-add-standard-core-icons-for-admin-console-screens
worktree: .plan/work/T0307-add-standard-core-icons-for-admin-console-screens
status: active
started_at: "2026-11-24T08:17:32Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 1, duration_s: 1604.8, input: 310694, output: 38930, cache_read: 10884279}
review_status: pending
review_round: 1
review_requested_at: "2026-11-24T08:44:38Z"
---
# T0307: Add standard core icons for admin console screens from Auth

## Goals
Promote the seven Auth admin console screen icons (`icon-overview`, `icon-people`, `icon-sessions`, `icon-events`, `icon-logs`, `icon-broadcast`, `icon-note`) as standard core icons in `contract.json` and every look sprite.
Update the admin screen modules, gallery `#icon` section, `shell-admin-console.html`, and specs to use these standard icons by default.
See [technical-spec.md](T0307-add-standard-core-icons-for-admin-console-screens/technical-spec.md).

## Task Execution Steps
- [x] **[Read]**      Inspect `src/contract.json`, the four look sprites, and the admin screen modules.
- [x] **[Implement]** Add failing tests in `icon.test.js` and admin unit tests for the new core icons.
- [x] **[Verify]**    Run the new tests and confirm they fail before updating sprites and modules.
- [x] **[Implement]** Add the core icons to `contract.json`, all four look sprites, admin modules, and demos.
- [x] **[Verify]**    Run `python scripts/devops.py check` and inspect gallery `#icon` and admin console screenshots.
- [x] **[Doc]**       Update `visual-style-guide.md`, `components.md`, and `CHANGELOG.md`.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-24] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-24] **[Implement]**
  Added seven standard admin console core icons to contract.json, all four look sprites, admin screen defaults, demos, docs, and CHANGELOG.md.

- [2026-11-24] **[Visual]**
  Captured before and after gallery and admin console screenshots in light and dark themes with zero console or network errors.
  - Gallery light: [before](T0307-add-standard-core-icons-for-admin-console-screens/gallery-icon-before-light.png), [after](T0307-add-standard-core-icons-for-admin-console-screens/gallery-icon-after-light.png).
  - Gallery dark: [before](T0307-add-standard-core-icons-for-admin-console-screens/gallery-icon-before-dark.png), [after](T0307-add-standard-core-icons-for-admin-console-screens/gallery-icon-after-dark.png).
  - Admin light: [before](T0307-add-standard-core-icons-for-admin-console-screens/admin-console-before-light.png), [after](T0307-add-standard-core-icons-for-admin-console-screens/admin-console-after-light.png).
  - Admin dark: [before](T0307-add-standard-core-icons-for-admin-console-screens/admin-console-before-dark.png), [after](T0307-add-standard-core-icons-for-admin-console-screens/admin-console-after-dark.png).

- [2026-11-24] **[Verify]**
  Verified red-phase failures, all unit, pytest, Playwright, integration, lint, and build checks; recorded proof in validation-proof.md and task outcomes.
  - Files touched: 16.
  - Lines touched: 224.
  - Reopenings: 0.

- [2026-11-24] **[Read]**
  Inspected contract.json, all four look sprites, the seven admin screen modules, gallery demos, and existing unit tests.

- [2026-11-24] **[Implement]**
  Authored failing unit tests in icon.test.js and admin-console.test.js for all seven standard admin console icons and verified red-phase failures.

- [2026-11-24] **[Doc]**
  Updated visual-style-guide.md, components.md, and CHANGELOG.md with the seven standard admin console core icons and screen defaults.

- [2026-11-24] **[Review]**
  Round 1 requested (mode: agent).

