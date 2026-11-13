---
id: T0022
owner: "@codex"
session: codex-20261113-c0618e
needs: ['T0038']
branch: task/T0022-build-the-create-command-and-the-starter-app
worktree: .plan/work/T0022-build-the-create-command-and-the-starter-app
status: suspended
started_at: "2026-11-13T01:36:17Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 2, duration_s: 206.4, input: 85304, output: 5820, cache_read: 1023232, cache_write: 0}
work_duration: 110.4
---
# T0022: Build the Python generate-app devops action and the starter app template.

## Goals
Add the `generate-app` action to `scripts/devops.py` and the `template/` starter app, built from the two adopted apps.
It runs from a checkout at a release tag, calls `node bin/cli.mjs vendor`, and never runs `git init` or `plan init`.
Follow [ADR-0006](../../docs/adrs/ADR-0006-generator.md) and [ADR-0004](../../docs/adrs/ADR-0004-app-shell.md) and the roadmap.
Refine declared files, size estimate, and tests in the technical specification before starting.

## Task Execution Steps
- [ ] **[Read]**      Read the named ADRs and the source app at a recorded commit.
- [ ] **[Decide]**    Write declared files, size estimate, tests, and the completion check into the technical specification.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Implement the component or look and its gallery specimens.
- [ ] **[Verify]**    Run the tests, the verifier, and the completion check until they pass.
- [ ] **[Doc]**       Update the style guide and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.

- [2026-11-13] **[Read]**
  Read ADR-0004, ADR-0006, and roadmap Phase 3. Inspected todos.webapp at 0cf4981f2fa235a4d48d143b83db24e1f46bd48a and family-portal at 1953f75484a2fe65aa3444730b3a9f459ae21cb4. Neither tracked vendor tree exists; stylesheets import local partials.

- [2026-11-13] **[Decided]**
  Blocked: Phase 3 requires two completed adoptions. Current source commits cannot supply the required adopted markup. Resume after both apps vendor a release and record conformance and lossless-switch proofs. No implementation or tests ran.

- [2026-11-13] **[Verify]**
  Recorded prerequisite inspection in validation-proof.md. No product files changed; no completed implementation exists to commit.
  - Files touched: 0.
  - Lines touched: 0.
  - Reopenings: 0.

- [2026-11-13] **[Verify]**
  Completion validation exited 1 with eight lint issues. Task remains incomplete; execution steps remain unchecked. Recorded verbatim output in validation-proof.md.

