---
id: T0303
owner: "@gemini"
session: antigravity-20261123-b52085
needs: []
branch: task/T0303-make-the-vendored-manifest-hashes-match-lf-content
worktree: .plan/work/T0303-make-the-vendored-manifest-hashes-match-lf-content
status: active
started_at: "2026-11-23T15:04:39Z"
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0303: Make the design integrity hashes ignore line endings, so LF and CRLF checkouts of a vendored copy both pass.

## Goals
Hash text files with CRLF normalized to LF in `manifest.json` and `check.mjs`, so any checkout passes.
Both hash raw bytes today, so v0.4.0, built from a CRLF checkout, fails every file in LF apps such as Auth.
Hashing LF in the build alone would move that failure to apps that check out CRLF.
Add one normalizing hash function to the standalone `check.mjs`, and import it in `manifest.mjs`.
Normalize only `css`, `js`, `mjs`, `json`, `svg`, `html`, `md`, and `txt` files; hash all others raw.
Then release with `python scripts/devops.py release --yes`; Auth re-vendors in its own task and drops its workaround.
See [technical-spec.md](T0303-make-the-vendored-manifest-hashes-match-lf-content/technical-spec.md).

## Task Execution Steps
- [x] **[Implement]** Add unit and integration tests for LF, CRLF, text edits, and binary line-ending bytes.
- [x] **[Verify]**    Run the new tests and confirm the LF and CRLF cases fail on raw hashing.
- [x] **[Implement]** Add the normalizing hash to `check.mjs` and use it in `manifest.mjs`.
- [x] **[Verify]**    Run `python scripts/devops.py check` and record its output.
- [x] **[Doc]**       Update ADR-0005, `docs/devops.md`, and `CHANGELOG.md` with the line-ending rule.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Rewrote the goals to normalize line endings in check.mjs and manifest.mjs, so LF and CRLF checkouts both pass.

- [2026-11-23] **[Verify]**
  Confirmed red-phase failures on LF/CRLF hashing in check.test.js, manifest.test.js, and vendor.test.js.

- [2026-11-23] **[Implement]**
  Added normalizing fileHash in check.mjs, imported it in manifest.mjs, and updated ADR-0005, docs/devops.md, and CHANGELOG.md.

- [2026-11-23] **[Verify]**
  Passed full python scripts/devops.py check with exit code 0.
  - 28 markdown, Ruff, ESLint, 61 pytest, 2262 unit tests passed.
  - 866 Playwright e2e, 7 integration tests, and npm pack passed.

- [2026-11-23] **[Verify]**
  Recorded task outcomes.
  - Files touched: 7.
  - Lines touched: 107.
  - Reopenings: 0.

