---
task: T0241
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-17T17:44:32Z
reviewed_commit: "17ad214"
base_commit: "ecbb92e"
branch: task/T0241-release-the-palette-component-polish-and-shell-layout
---
# Review Findings: Task T0241 (Round 1)

## Summary
Commit `17ad214` opens `v0.2.0-pre` as the release candidate.
It renames the changelog heading and sets `package.json` and both `package-lock.json` version fields.
This is the minor bump the goals ask for.
The support.python release step strips `-pre` (`release_version`), so `release --yes` on `main` will produce `v0.2.0` with the date.
The user approved the release on 2026-11-17.
The release run and vendor follow-up moved to T0246, which is open in `PLAN.md`, because the bump must merge to `main` first.
The Execution Log names the vendor targets: auth, family-portal, meteo, and todos.webapp.
Each of those siblings has a `design.json` pinned at `0.1.0`, so the list is right.
`main` has not moved past the base, and `v0.1.0` is the only tag.

Checks rerun by the reviewer, all exit 0:
- `python scripts/devops.py tests`: pytest 56 passed, 1 skipped; Vitest 2184 passed.
- `lint-markdown check --offline`: 27 files passed.
- `npm pack --dry-run`: `@gpellicciotta/support.webapp@0.2.0-pre`, 107 files.
- `python scripts/devops.py version`: `v0.2.0-pre+17ad214`.

The reviewer did not rerun the slow Playwright suite, since the diff changes only version strings.
`validation-proof.md` records a full `check` run with exit 0.

## Defects
None.

## Process Gaps
- Non-blocking: the Goals still describe running the release and dating the heading.
  That scope now belongs to T0246, which only the `[Decided]` step and log entry record.
  Rewording the Goals to cover only the bump would make completion read cleanly.

## Required Rework
None.
