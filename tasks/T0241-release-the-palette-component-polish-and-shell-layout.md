---
id: T0241
owner: ~
needs: [T0040, T0235, T0236, T0237, T0238, T0239, T0240]
branch: —
worktree: —
status: ready
started_at: —
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
- [ ] **[Implement]** Implement required changes for T0241.
- [ ] **[Verify]**    Verify implementation with automated test suites.
- [ ] **[Doc]**       Update documentation and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-17] **[Doc]**
  Companion task file scaffolded at task creation.
