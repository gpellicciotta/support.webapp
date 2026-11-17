---
id: T0241
owner: "@claude"
session: claude-20261117-4081ab
needs: []
branch: task/T0241-release-the-palette-component-polish-and-shell-layout
worktree: .plan/work/T0241-release-the-palette-component-polish-and-shell-layout
status: suspended
started_at: "2026-11-17T16:54:36Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0241: Release the palette, component polish, and shell layout work as v0.2.0

## Goals
Release v0.2.0 from a clean `main` with `python scripts/devops.py release --yes`, after every listed task completes.
The release bumps the minor version, because the neutral palette and shell layout change visibly.
Consolidate the `v0.1.1-pre` changelog entries under `v0.2.0` with the release date.
Ask the user before running the release, since it pushes and publishes.
Afterwards, record which sibling apps should run `vendor` to pick up the release.

## Task Execution Steps
- [x] **[Implement]** Implement required changes for T0241.
- [x] **[Verify]**    Verify implementation with automated test suites.
- [x] **[Doc]**       Update documentation and CHANGELOG.md.
- [ ] **[Implement]** Run release --yes from clean main after user approval, then create vendor tasks per app.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-17] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-17] **[Implement]**
  Opened v0.2.0-pre: renamed the v0.1.1-pre changelog heading and set both npm manifests to 0.2.0-pre in commit 17ad214.

- [2026-11-17] **[Verify]**
  Full devops check passed with exit 0 after npm ci gave the worktree its own node_modules; validation-proof.md holds the output.
  - Pytest: 56 passed, 1 skipped.
  - Vitest: 2184 passed; Playwright: 830 passed.
  - Integration: 7 passed; pack dry-run OK.

- [2026-11-17] **[Doc]**
  Kept the consolidated bullets under v0.2.0-pre; release --yes freezes the heading with the release date.

- [2026-11-17] **[Review]**
  Needs user approval to run release --yes from clean main after merging 17ad214; it tags, pushes, and publishes v0.2.0.
  - Open question: approve the v0.2.0 release push and publish?.
  - Then vendor into auth, family-portal, meteo, todos.webapp (all on 0.1.0).

