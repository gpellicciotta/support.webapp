---
task: T0247
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-17T20:00:47Z
reviewed_commit: "e537eb4"
base_commit: "858924b"
branch: task/T0247-make-the-release-action-bump-package-lock-json
---
# Review Findings: Task T0247 (Round 1)

## Summary
Approved. The release action now sets both `package-lock.json` root versions with each `package.json` version edit.
It also stages the lockfile in both `git add` steps.
All three goals hold: the frozen release version, the next development version, and the dry-run listing.

Verified against the installed support.python v3.1.0 sources:
- `ReleasePipeline._plan`, `_set_version`, and `_command` have the overridden signatures.
- `_set_version` step descriptions differ for the release and next versions, so the description-keyed map is unambiguous.
- `WebDevopsCli._release` passes the same arguments as `DevopsCli._release`.
- It drops the `project.release()` hook, which is safe: `NodeProject` inherits the base `release()` that returns `None`.

Reviewer runs (exit 0 unless noted):
- `python -m pytest tests/test_release_lockfile.py -q -n 0`: 5 passed.
- `python scripts/devops.py lint`: Ruff, Ruff format, and ESLint passed.
- `python scripts/devops.py tests`: 61 passed, 1 skipped; Vitest 2184 passed.
- `python scripts/devops.py release --dry-run` in a temporary clone checked out as `main`.
  - It listed `edit package-lock.json: root versions 0.2.2` and `... 0.2.3-pre`.
  - Both `git add` lines included `package-lock.json`, and the clone stayed clean.
- `set_lockfile_version` on the real lockfile in that clone changed exactly the two root `version` lines.

The full 11-minute `check` was not rerun by the reviewer; the worker's evidence covers it (see Process Gaps).

## Defects
None.

## Process Gaps
- Non-blocking: the worker's full `check` exited 1 in the generated-app integration suite.
  - Cause: a stale worktree `node_modules`, unrelated to this change.
  - The proof reruns only `npm run test:integration` after `npm ci`, not the whole `check`; it reports this honestly.
- Non-blocking: the technical spec's Declared Files omit `CHANGELOG.md`, which the commit changes.
- Non-blocking: `LockfileReleasePipeline` overrides private `ReleasePipeline` methods.
  - `WebDevopsCli._release` also duplicates `DevopsCli._release`.
  - A support.python upgrade past v3.1.0 can silently break this.
  - The tests would catch most breaks; a follow-up could add multi-file version support upstream in support.python.
- Non-blocking: Execution Log entries are out of chronological order; the Read entry follows Implement and Verify.

## Required Rework
None.
