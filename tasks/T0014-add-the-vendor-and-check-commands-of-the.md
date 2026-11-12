---
id: T0014
owner: "@codex"
session: codex-20261112-4a6203
needs: []
branch: task/T0014-add-the-vendor-and-check-commands-of-the
worktree: .plan/work/T0014-add-the-vendor-and-check-commands-of-the
status: active
started_at: "2026-11-12T09:55:58Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0014: Add the vendor and check commands of the command line tool, with the package manifest

## Goals
Add `bin/cli.mjs` with the `vendor` and `check` subcommands of [ADR-0005](../../docs/adrs/ADR-0005-distribution-and-versioning.md).
`vendor` copies the look-neutral files, one look, the manifest, and `check.mjs` into a target folder, and writes the pin.
`check` fails when a copy differs from its manifest or pin, or app styles break the token rules.
The tool runs on Node.js without dependencies.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [x] **[Read]**      Read ADR-0005, ADR-0007, and the cli-guidelines.
- [x] **[Implement]** Write the failing tests named in the technical specification.
- [x] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Write the command line tool, manifest builder, vendor and check commands, and package fields.
- [ ] **[Verify]**    Run the unit tests and the pack-and-vendor integration test until they pass.
- [ ] **[Doc]**       Update devops.md and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.
