---
id: T0303
owner: ~
needs: []
branch: —
worktree: —
status: ready
started_at: —
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
- [ ] **[Implement]** Add unit and integration tests for LF, CRLF, text edits, and binary line-ending bytes.
- [ ] **[Verify]**    Run the new tests and confirm the LF and CRLF cases fail on raw hashing.
- [ ] **[Implement]** Add the normalizing hash to `check.mjs` and use it in `manifest.mjs`.
- [ ] **[Verify]**    Run `python scripts/devops.py check` and record its output.
- [ ] **[Doc]**       Update ADR-0005, `docs/devops.md`, and `CHANGELOG.md` with the line-ending rule.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-23] **[Doc]**
  Companion task file scaffolded at task creation.

- [2026-11-23] **[Doc]**
  Rewrote the goals to normalize line endings in check.mjs and manifest.mjs, so LF and CRLF checkouts both pass.

