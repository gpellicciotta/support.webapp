---
task: T0015
round: 1
verdict: approved
reviewer: "@claude-2"
reviewed_at: 2026-11-12T10:30:36Z
reviewed_commit: "2b53d57"
base_commit: "76fd991"
branch: task/T0015-add-the-github-packages-publish-workflow-and-document
---
# Review Findings: Task T0015 (Round 1)

## Summary
Approved. The work meets every goal of the task and ADR-0005.
- `publish.yml` follows the support.js workflow: it reruns `check`, then publishes with `GITHUB_TOKEN` and `packages: write`.
- Only a published release publishes; a manual run only rehearses with `npm publish --dry-run`.
- The tag-version guard matches support.python v3.1.0, which tags `v{release}` and freezes `package.json` first.
- `gh release create` runs with the user's token, so the release event triggers the workflow.
- `publishConfig`, `repository`, and the `!src/index.html` exclusion are correct; the tarball holds 21 files.
- The changelog header declares all seven ADR-0005 areas.
- devops.md documents publishing, the classic `read:packages` token, and per-app backlog tasks.
- The `plan tasks create --project ... --section Backlog` syntax matches the plan CLI help.
- `fileParallelism: false` correctly serializes the two tests that share `manifest.json`.

Verification run by the reviewer:
- `npx vitest run --config vitest.integration.config.js tests/integration/pack.test.js`: 3 passed, exit code 0.
- `python scripts/devops.py check`: exit code 0; Markdown lint, Ruff, 472 unit, 8 browser, and 4 integration tests passed.
- `node -p "require('./package.json').version"` works in this ESM package and prints `0.1.0-pre`.
- `publish.yml` parses as YAML with the `release` and `workflow_dispatch` triggers.
- The working tree stays clean after packing; `postpack` removes `manifest.json`.
- The validation proof records the failing tests before the implementation.

## Defects
None blocking. Non-blocking observations:
- The second pack test checks only for the `--dry-run` string.
  It does not assert that the real `npm publish` and the tag guard run on `release` events only.
- The tag guard fails with no message on a mismatch; an `echo` of both values would ease diagnosis.

## Process Gaps
None blocking. Non-blocking observation:
- The outcome entry records 4 files and 65 lines, but the commit touches 7 files with 175 insertions.
  It was recorded before the documentation step, and the log entries are out of chronological order.

## Required Rework
None.
