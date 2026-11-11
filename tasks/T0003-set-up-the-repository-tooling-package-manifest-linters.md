---
id: T0003
owner: ~
needs: [T0002]
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0003: Set up the repository tooling: package manifest, linters, unit and browser test runners, devops scripts, and CI

## Goals
Set up the tooling that every later task runs, in the layout of [ADR-0008](../../docs/adrs/ADR-0008-repository-layout.md).
Add `package.json` for `@gpellicciotta/support.webapp` at version `0.1.0-pre`, with ESLint, Vitest, and Playwright Test.
Add `scripts/devops.py` with `tests`, `check`, and `serve` commands, plus `scripts/bootstrap-dev-environment.py`.
Add a static server for `src/` and a CI workflow running the devops tests and check.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [ ] **[Read]**      Read ADR-0008, the cli-guidelines, and the template.java devops and bootstrap scripts.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Add the manifest, linter and runner configs, static server, devops scripts, and CI workflow.
- [ ] **[Verify]**    Run the devops tests and check until both exit with code 0.
- [ ] **[Doc]**       Update devops.md and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.
