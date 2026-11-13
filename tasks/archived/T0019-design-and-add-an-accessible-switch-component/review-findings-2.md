---
task: T0019
round: 2
verdict: approved
reviewer: "@claude"
reviewed_at: 2026-11-12T20:00:12Z
reviewed_commit: "a27f63c"
base_commit: "eb7645d"
branch: task/T0019-design-and-add-an-accessible-switch-component
---
# Review Findings: Task T0019 (Round 2)

## Summary
Rework commit `a27f63c` resolves all seven round-one rework items.
- Forced colors: focus uses `Highlight`, and the invalid outline is dashed `CanvasText`.
  Probes and the eight before/after captures confirm both.
- New browser regression: it compares the focus ring with a system-color probe.
  Its recorded red output shows it failed in all four projects before the CSS fix.
- RTL: the check now measures the real `::before` box through CDP against the track center.
  All projects run Chromium, so CDP is available.
- Gallery: `#switch` follows `#checkbox`, matching the TOC and import order, with no stray blank line.
- Style guide: switch guidance is a `### Switch` under `## Components`, with a row in the Controls table.
- Catalog: the `switch` row lists the invalid state.
- Tests: the environment-driven screenshot test is gone. Screenshots go only to standard Playwright `outputPath`.

Verification run by the reviewer:
- `npx vitest run`: 24 files, 2049 tests passed.
- `npx playwright test tests/e2e/switch.spec.js --workers=4`: 12 of 12 passed.
- `python scripts/devops.py check`, run twice: lint, 3 Python tests, 2049 unit tests, and 310 to 311 of 312 browser checks passed.
  Each run failed only on look-switch flakes: `card.spec.js:5` (300x17 tile) and `bright.spec.js:47` (`rgb(0, 0, 0)`).
  T0036 tracks both, with the same symptoms. `card.spec.js` then passed 40 of 40 alone (`--repeat-each=5`).
  The switch diff touches no look, card, or tile code.

## Defects
None blocking.

Minor, non-blocking: under forced colors, the invalid switch's track border keeps the author `--color-danger` token.
`.switch__control[aria-invalid='true']` (0,2,0) outranks the forced-colors `.switch__control` border rule (0,1,0).
`forced-color-adjust: none` stops the system from recoloring it.
The review-after captures show a reddish ring inside the dashed outline.
The dashed `CanvasText` outline and the `ButtonText` thumb still convey state, so this is cosmetic.
A follow-up could add `border-color: ButtonText` to the forced-colors invalid rule.

## Process Gaps
None blocking.
- `validation-proof.md` now records browser red-phase output for the round-two regression.
  The Execution Log notes that the first round's red phase covered unit tests only.
- Full-check runs remain exposed to the T0036 look-switch flake.
  The implementer's recorded check passed, and the reviewer's two runs each hit only that known flake.

## Required Rework
None.
