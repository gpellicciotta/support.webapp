---
id: T0287
owner: "@gemini"
session: antigravity-20261124-006db1
needs: []
branch: task/T0287-add-a-data-loading-helper-with-loading-failed
worktree: .plan/work/T0287-add-a-data-loading-helper-with-loading-failed
status: active
started_at: "2026-11-24T00:31:34Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0287: Add a data loading helper with loading, failed, and sign-in states, promoted from Auth's admin console

## Goals
Add a helper that loads data into a container with loading, failed with Retry, and expired-session states.
The newest call on a container wins, and a quiet mode keeps the shown content while polling.
Auth's and ToDo's admin consoles each carry a copy.
The audit in `docs/analysis/auth-webapp-ui-audit.md`, section "Data Loading Helper", is the source.
Completion check: `python scripts/devops.py check`, with the new tests green.
Size estimate: 3 files, 60 lines.

## Task Execution Steps
- [x] **[Read]**      Read the technical specification, the audit section, and the Auth source it cites.
- [x] **[Decide]**    Choose the module key and exported API, following naming.md and the ADR-0003 JavaScript approach.
- [x] **[Implement]** Author failing unit and browser tests for the behavior in the technical specification.
- [x] **[Verify]**    Run the new tests and confirm they fail for the expected reason.
- [x] **[Implement]** Add the data loading helper, its contract entry, and a gallery or shell demo section.
- [x] **[Verify]**    Run the affected tests and `python scripts/devops.py check`.
- [x] **[Doc]**       Update components.md, the ADRs it touches, the upgrade note for apps, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Task fleshed out from the T0277 audit of Auth's webapp at commit eeb9439.

- [2026-11-24] **[Decided]**
  Chose key data-loader (src/js/data-loader.js) exporting createDataLoader, attachDataLoader, and loadInto using dom-builders, WeakMap runs, AbortSignal, and data-data-loader-* hooks.

- [2026-11-24] **[Implement]**
  Added src/js/data-loader.js, contract entry, admin console demo section, and unit/browser tests.
  - Undeclared file touched per step 7: docs/adrs/ADR-0003-components-and-patterns.md.

- [2026-11-24] **[Verify]**
  Verified linters, 2438 Vitest, 61 pytest, 1010 Playwright tests, pack, and vendor checks; generate-app failed only for missing worktree node_modules.
  - Before/after screenshots linked in validation-proof.md.
  - Files touched: 4.
  - Lines touched: 78.
  - Reopenings: 0.

- [2026-11-24] **[Read]**
  Reviewed technical-spec.md, the Data Loading Helper audit section, Auth's and ToDo's loadInto sources, naming.md, and ADR-0003.

- [2026-11-24] **[Doc]**
  Updated components.md with data-loader catalog entry and upgrade note, ADR-0003 sharing rule, and CHANGELOG.md under v0.4.1-pre.

