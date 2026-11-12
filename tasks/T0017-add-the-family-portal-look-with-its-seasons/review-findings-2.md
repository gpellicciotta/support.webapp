---
task: T0017
round: 2
verdict: approved
reviewer: "@claude"
reviewed_at: 2026-11-12T13:51:30Z
reviewed_commit: "4c03f4f"
base_commit: "bb0e69c"
branch: task/T0017-add-the-family-portal-look-with-its-seasons
---
# Review Findings: Task T0017 (Round 2)

## Summary
Commit `4c03f4f` resolves all three round 1 rework items.
- The template now draws on both looks.
  - Header comments in `look.css` and `primitives.css` give template guidance, not neutral provenance.
  - `look.css` maps every optional role warm uses: accent, inverse, four tones, and both extra shadows.
  - Commented `[data-accent="{{value}}"]` examples sit in the main block and in the `@supports not` fallback.
- Template coverage is now real.
  - `tokens.test.js` and `icon.test.js` include `_template`.
  - It now gets the shared ownership, both-theme, fallback, contrast, and core-sprite checks.
  - The reviewer confirmed this in the verbose output: 442 `_template` cases, including "provides every core id".
  - `warm.test.js` checks `fonts.css`, the optional roles, and both variant examples.
- ADR-0001 lists the optional shadow roles under Overlay.
  `contract.json` now groups them beside `--color-shadow`.

The reviewer ran `python scripts/devops.py check`, which exited 0.
- Results: Markdown lint, Ruff, 3 Python, 1446 unit, 164 browser, and 4 integration tests all passed.
- The working tree stayed clean afterward.
- Red and green evidence for the rework is in `validation-proof.md`.
- Both commit messages follow the one-sentence convention.

## Defects
None.

## Process Gaps
None.
The round 1 log-ordering gap was corrected, and the size note records why three counted files were added.

## Required Rework
None.

Optional, not required:
- The optional-role test only asserts roles that warm defines.
  Optional roles added later by `bright` (T0023) will not be enforced in the template unless that test changes.
- The round 1 optional notes still apply: the hard-coded `look !== 'warm'` season switch, and the duplicated Inter font in the template.
