---
id: T0303
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
# T0303: Make the vendored manifest hashes match LF content, so apps normalizing line endings pass the design integrity check

## Goals
Make the vendored manifest hashes match LF content, so apps normalizing line endings pass the design integrity check.
In v0.4.0, `manifest.json` hashes the CRLF form of every file; v0.2.1 hashed the LF form.
Auth normalizes text to LF (`* text=auto eol=lf`), so `check.mjs` reports `Changed file:` for every vendored file.
Hash LF content in the release build, or make `check.mjs` hash after normalizing line endings.
Release a fixed version; Auth then re-vendors it and drops its local manifest workaround.
Completion check: `node bin/check.mjs` passes on a vendored copy checked out with LF and with CRLF line endings.

## Task Execution Steps
- [ ] **[Implement]** Implement required changes for T0303.
- [ ] **[Verify]**    Verify implementation with automated test suites.
- [ ] **[Doc]**       Update documentation and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.
