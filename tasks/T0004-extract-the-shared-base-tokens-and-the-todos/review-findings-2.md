---
task: T0004
round: 2
verdict: approved
reviewer: "@claude"
reviewed_at: 2026-11-12T09:43:27Z
reviewed_commit: "9607287"
base_commit: "083e9a5"
branch: task/T0004-extract-the-shared-base-tokens-and-the-todos
---
# Review Findings: Task T0004 (Round 2)

## Summary
Approved. Commit `9607287` resolves every round-one defect and process gap.

Verified by the reviewer:
- `python scripts/devops.py check` exits 0 at `9607287`.
  - Vitest 445/445, Playwright 4/4, pytest 3/3, ESLint, Ruff, Markdown lint (20 files), and `npm pack --dry-run`.
- `--color-on-success` is now `light-dark(gray-0, gray-950)`, matching `on-primary` and `on-danger`.
  - Its `@supports` fallback pins `gray-0`.
- `--color-on-warning` aliases `--color-on-danger`, so it already has a fallback.
- `contract.js` pairs `on-success` and `on-warning` with the filled roles at 4.5:1.
  - It pairs `text` with the success and warning `-bg` grounds.
- Every contract `category` is one of the 18 ADR-0001 headings, and a test checks this.
- All five missing tokens are now optional contract entries.
  - Tokens: `--focus-ring`, `--icon-stroke-thin`, and the three `--color-status-` roles.
  - A new test fails on any `look.css` token missing from the contract.
  - A script check confirms no `base.css` or `look.css` name is missing from the contract.
- Status and distance checks read `status` and `distinctFrom` from the contract; the `look.name === 'neutral'` branch is gone.
- The test reports each look, theme, token, and contrast pair as its own test.
- `neutral.md` documents the optional source roles, filled-role usage, and the six app-only tokens.
- Space tokens are in numeric order in `base.css` and `contract.json`.
- `validation-proof.md` records failing-first output for the three regressions, then passing runs.

## Defects
None.

## Process Gaps
None blocking. Notes for later contract work:
- The kept todos.webapp names do not fully match the ADR-0001 naming tables:
  - `--focus-ring` has no role segment.
  - `thin` is not a listed variant.
  - `status` is not in the `color` role table.
  - Keeping the source names is right under "rename only as ADR-0001 lists".
  - Add them to the ADR-0001 tables, or plan renames before adoption.
- The `status` and `distinctFrom` contract fields extend the ADR-0001 file shape.
  - Only `neutral.md` documents them; ADR-0001 or naming.md should list them when the contract is next revised.
- Optional tokens a look omits still produce passing no-op tests, which inflates the count of 445.

## Required Rework
None.
