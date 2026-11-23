---
task: T0303
round: 1
verdict: approved
blocking: 0
reviewer: "@claude"
reviewed_at: 2026-11-23T15:33:28Z
reviewed_commit: "024b841"
base_commit: "6cd2c62"
branch: task/T0303-make-the-vendored-manifest-hashes-match-lf-content
session: claude-20261123-80bcb2
session_agent: claude-code
session_created_at: 2026-11-23T15:31:38Z
---
# Review Findings: Task T0303 (Round 1)

## Summary
The work meets the goals and the technical specification.
- `fileHash(path)` in `bin/check.mjs` replaces only `\r\n` pairs for the eight listed extensions.
- It hashes every other file as raw bytes and imports Node built-ins only.
- The `latin1` round trip preserves every byte, so non-ASCII text hashes correctly.
- `bin/manifest.mjs` imports `fileHash` for `src/` files and `bin/check.mjs`.
- Importing `check.mjs` has no side effects, because its CLI runs behind the `isMain` guard.
- `vendor.mjs` reaches the new hash through `packageManifest`, so vendoring stays consistent.
- Tests cover LF, CRLF, lone CR, a changed character, and binary `\r\n` bytes.
- ADR-0005, `docs/devops.md`, and `CHANGELOG.md` document the rule.

Reviewer verification on commit `024b841`:
- `npx vitest run tests/unit/check.test.js tests/unit/manifest.test.js`: 22 passed, exit 0.
- `npm run test:integration -- tests/integration/vendor.test.js tests/integration/pack.test.js`: 4 passed.
- `npx eslint` on the changed files: exit 0.
- `lint-markdown check --offline`: all 28 files passed.
- `buildManifest()` ran on this CRLF checkout (`core.autocrlf=true`).
  All 107 entries matched the SHA-256 of the LF Git blobs (`match=107 mismatch=0`).
  A release from a CRLF checkout therefore produces LF hashes, as the goal requires.
- The red-phase and full `devops.py check` evidence in `validation-proof.md` is consistent with the diff.

## Defects
None.

## Process Gaps
- Non-blocking: the goals end with a release via `python scripts/devops.py release --yes`.
  No step covers it, and releasing requires a clean `main`, so it cannot run on this branch.
  **[Feedback Needed]** A human must release v0.4.1 after the merge, or add a follow-up task.
- Non-blocking: the Execution Log records 7 files touched; the commit changes 8.
  `CHANGELOG.md` is also missing from the Declared Files in `technical-spec.md`.
- Non-blocking: the test title "hashes shipped bytes..." in `tests/unit/manifest.test.js` now checks normalized text.
  A title such as "hashes shipped LF content" would match the new behavior.

## Required Rework
None.
