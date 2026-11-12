---
id: T0003
owner: "@codex"
session: codex-20261112-6abb55
needs: []
branch: task/T0003-set-up-the-repository-tooling-package-manifest-linters
worktree: .plan/work/T0003-set-up-the-repository-tooling-package-manifest-linters
status: active
started_at: "2026-11-12T08:59:21Z"
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
- [x] **[Read]**      Read ADR-0008, the cli-guidelines, and the template.java devops and bootstrap scripts.
- [x] **[Implement]** Write the failing tests named in the technical specification.
- [x] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [x] **[Implement]** Add the manifest, linter and runner configs, static server, devops scripts, and CI workflow.
- [x] **[Verify]**    Run the devops tests and check until both exit with code 0.
- [x] **[Doc]**       Update devops.md and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.

- [2026-11-12] **[Decided]**
  Extended the existing docs tooling with NodeProject. Added portable link checks for source-only CI and worktrees.
  - Undeclared: .gitignore, .lint-markdown.json, AGENTS.md, ADR-0008, requirements.txt, pyproject.toml, Python link plugin and tests.
  - Removed obsolete docs_project.py; added the generated package lock.

- [2026-11-12] **[Verify]**
  Bootstrap session 52372 installed Python 3.15 tools and exposed ESLint scanning .venv. Excluded installed dependencies; added root-relative link regression.
  - Command: py -3.15 scripts/bootstrap-dev-environment.py.

- [2026-11-12] **[Implement]**
  Added manifest, server, test runners, devops commands, bootstrap, CI, and portable documentation linting. Recorded dependency and configuration additions.

- [2026-11-12] **[Verify]**
  Reran py -3.15 scripts/bootstrap-dev-environment.py in session 4740 after excluding .venv from ESLint.

- [2026-11-12] **[Verify]**
  Bootstrap and full check passed on Python 3.15.2. Six fast tests and four browser cases passed; screenshots inspected.
  - Evidence: validation-proof.md and desktop/mobile light/dark screenshots in the companion directory.
  - No prior landing page existed for a before screenshot; Playwright stopped its server.

- [2026-11-12] **[Verify]**
  Recorded counted changes against the prepared task base.
  - Files touched: 7.
  - Lines touched: 142.
  - Reopenings: 0.

- [2026-11-12] **[Verify]**
  Committed implementation as 0148064. Completion validation passed; execution steps 1-6 are checked. Review remains for the orchestrator.

