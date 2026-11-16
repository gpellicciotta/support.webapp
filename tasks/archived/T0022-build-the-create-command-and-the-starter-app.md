---
id: T0022
owner: "@claude-code"
session: codex-20261113-c0618e
needs: []
branch: task/T0022-build-the-create-command-and-the-starter-app
worktree: .plan/work/T0022-build-the-create-command-and-the-starter-app
status: completed
started_at: "2026-11-15T18:32:37Z"
ended_at: "2026-11-15T19:21:03Z"
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 2, duration_s: 206.4, input: 85304, output: 5820, cache_read: 1023232, cache_write: 0}
work_duration: 110.4
contributors: "@codex"
review_status: approved
review_round: 2
review_requested_at: "2026-11-15T18:50:54Z"
reviewed_by: "@gpellicciotta"
completion-commit: fa7812df0a8d269cc1445299915a9d4331926940
---
# T0022: Build the Python generate-app devops action and the starter app template.

## Goals
Add the `generate-app` action to `scripts/devops.py` and the `template/` starter app, built from the two adopted apps.
It runs from a checkout at a release tag, calls `node bin/cli.mjs vendor`, and never runs `git init` or `plan init`.
Follow [ADR-0006](../../../docs/adrs/ADR-0006-generator.md) and [ADR-0004](../../../docs/adrs/ADR-0004-app-shell.md) and the roadmap.
Refine declared files, size estimate, and tests in the technical specification before starting.

## Task Execution Steps
- [x] **[Read]**      Read the named ADRs and the source app at a recorded commit.
- [x] **[Decide]**    Write declared files, size estimate, tests, and the completion check into the technical specification.
- [x] **[Implement]** Write the failing tests named in the technical specification.
- [x] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [x] **[Implement]** Implement the component or look and its gallery specimens.
- [x] **[Verify]**    Run the tests, the verifier, and the completion check until they pass.
- [x] **[Doc]**       Update the style guide and CHANGELOG.md.
- [x] **[Review]**    Obtain review approval of the finished work before completion.

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

- [2026-11-13] **[Read]**
  Rechecked todos.webapp at 3e003d2: adoption tasks T0230, T0231, and T0233 completed. family-portal at e45395a retains local styles; T0177 worktree ee5cdbc awaits review approval, and T0178-T0181 remain pending. T0038 remains an explicit unmet dependency.

- [2026-11-15] **[Read]**
  Resumed after both adoptions released: todos.webapp v0.5.0 at d6e46d5 and family-portal v0.6.0 at 46af159; T0177-T0181 completed.

- [2026-11-15] **[Decided]**
  Recorded generator decisions, declared files, tests, and a 6-file, 160-line estimate in technical-spec.md; started in place because the stale worktree could not be removed.

- [2026-11-15] **[Verify]**
  Recorded failing unit and integration output, then green runs, the generated app check, and the completion check in validation-proof.md.

- [2026-11-15] **[Visual]**
  Captured generated app screenshots for three setups at 390 and 1440 px, light and dark; linked from validation-proof.md.

- [2026-11-15] **[Doc]**
  Documented the generator in devops.md and README.md, amended ADR-0006, and added a Template changelog entry; no shared style guide change applies.

- [2026-11-15] **[Verify]**
  Recorded task outcomes; template, generator, and tests are added files and not counted.
  - Files touched: 5.
  - Lines touched: 55.
  - Reopenings: 0.

- [2026-11-15] **[Review]**
  Round 1 requested (mode: agent).

- [2026-11-15] **[Implement]**
  Fixed review findings: unsafe title and owner characters, capitalized placeholder typos, menu skeleton attributes, and private app folder mode.

- [2026-11-15] **[Verify]**
  Recorded final outcomes after review fixes; the full check passed again.
  - Files touched: 5.
  - Lines touched: 56.
  - Reopenings: 0.

- [2026-11-15] **[Review]**
  Round 1 approved by @gpellicciotta.

- [2026-11-15] **[Review]**
  Round 2 approved by @gpellicciotta.
  - Approved by the user after agent review fixes.

- [2026-11-15] **[Visual]**
  Before: the source shell demos the template copies; after: the generated apps for the same setups.
  - [Before, list editor 1440](T0022-build-the-create-command-and-the-starter-app/before-shell-list-editor-1440-light.png).
  - [Before, list editor 390](T0022-build-the-create-command-and-the-starter-app/before-shell-list-editor-390-light.png).
  - [After, workspace app 1440](T0022-build-the-create-command-and-the-starter-app/generated-todos-desktop-light.png).
  - [After, workspace app 390](T0022-build-the-create-command-and-the-starter-app/generated-todos-mobile-light.png).
  - [Before, portal 1440](T0022-build-the-create-command-and-the-starter-app/before-shell-portal-1440-dark.png).
  - [Before, portal 390](T0022-build-the-create-command-and-the-starter-app/before-shell-portal-390-dark.png).
  - [After, portal app 1440](T0022-build-the-create-command-and-the-starter-app/generated-portal-desktop-dark.png).
  - [After, portal app 390](T0022-build-the-create-command-and-the-starter-app/generated-portal-mobile-dark.png).
  - [Before, toolbar 1440](T0022-build-the-create-command-and-the-starter-app/before-shell-toolbar-1440-dark.png).
  - [Before, toolbar 390](T0022-build-the-create-command-and-the-starter-app/before-shell-toolbar-390-light.png).
  - [After, toolbar app 1440](T0022-build-the-create-command-and-the-starter-app/generated-toolbar-desktop-dark.png).
  - [After, toolbar app 390](T0022-build-the-create-command-and-the-starter-app/generated-toolbar-mobile-light.png).

- [2026-11-15] **[Complete]**
  Task completed successfully.

