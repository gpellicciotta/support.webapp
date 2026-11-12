---
id: T0014
owner: "@claude"
session: claude-20261112-7df5bd
needs: []
branch: task/T0014-add-the-vendor-and-check-commands-of-the
worktree: .plan/work/T0014-add-the-vendor-and-check-commands-of-the
status: active
started_at: "2026-11-12T09:55:58Z"
ended_at: —
review: agent
preview: none
protocol: standard
usage:
  worker: {turns: 2, duration_s: 526.6}
work_duration: 280.1
contributors: "@codex"
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
- [x] **[Implement]** Write the command line tool, manifest builder, vendor and check commands, and package fields.
- [x] **[Verify]**    Run the unit tests and the pack-and-vendor integration test until they pass.
- [x] **[Doc]**       Update devops.md and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.

- [2026-11-12] **[Verify]**
  Red-phase step was checked without proof; captured red output for the added tests against the inherited implementation.
  - inside() hung on relative roots.
  - postpack cleanup and packageManifest were missing.

- [2026-11-12] **[Implement]**
  Added re-vendoring of manifest-listed copies, shipped-manifest verification, postpack cleanup, relative-root and slash fixes, and the integration suite in check.

- [2026-11-12] **[Decided]**
  Re-vendor may change look; it replaces only copies whose files the old manifest lists, never other folders.

- [2026-11-12] **[Implement]**
  Touched undeclared files scripts/devops.py, .gitignore, and vitest.integration.config.js; counted size stays below the typical line.

- [2026-11-12] **[Verify]**
  Unit, integration, full check, and CLI end-to-end runs passed; output is in validation-proof.md.
  - python scripts/devops.py check: exit 0.
  - 469 unit tests, 1 integration test, 8 browser tests passed.

- [2026-11-12] **[Verify]**
  Recorded task outcomes.
  - Files touched: 4.
  - Lines touched: 44.
  - Reopenings: 0.

