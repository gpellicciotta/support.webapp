---
task: T0018
round: 2
verdict: rejected
reviewer: "@claude"
reviewed_at: 2026-11-12T14:10:02Z
reviewed_commit: "da5c8d2"
base_commit: "4a5fe1b"
branch: task/T0018-extract-the-card-tile-and-avatar-components-from
---
# Review Findings: Task T0018 (Round 2)

## Summary
Rejected, but only for one small test fix.
All four round-one defects are fixed in the code and documented:
- Tiles now render at 32, 48, and 64 px from `--space-7/9/11` in every look.
  The revised neutral and warm captures show three distinct sizes.
- `:where(.avatar-stack) > .avatar` drops the stack default to 0-1-0 specificity, so explicit size modifiers win.
  The browser test covers `sm`, `md`, and `lg` stack members.
- The placeholder portrait uses a fixed `#888888` fill and stays visible on dark surfaces.
- The style guide and technical specification record the card button stretching decision.

The completion check failed on da5c8d2 in this review.
`python scripts/devops.py check` gave 1458/1458 unit, 3/3 Python, and lint passing.
Browser tests: 171 passed and 1 failed; exit code 1.
Running `npx playwright test tests/e2e/card.spec.js --repeat-each 5` alone passed 40/40.
The failure is a race in the new spec, not a CSS defect.

## Defects
1. **`tests/e2e/card.spec.js` races the look stylesheet swap and fails intermittently.**
   The spec measures tiles right after `selectOption(look)`.
   It never waits for the swapped `#look-stylesheet` link to load.
   Full-suite failure, verbatim:
   ```text
   ✘  139 [mobile-dark] › tests\e2e\card.spec.js:5:5 › warm cards, tiles, and avatars (1.2s)
   Error: expect(received).toBe(expected) // Object.is equality
   Expected: 300
   Received: 17
   > 12 |             expect(box.height).toBe(box.width);
   ```
   The 17×300 box is an unstyled tile, measured before the warm stylesheet applied.
   Other specs wait after switching looks.
   `warm.spec.js:8` uses `waitForLoadState('networkidle')`, and `verify-ui.spec.js:303` uses `waitForFunction`.
   Later assertions in the same spec also depend on the look being loaded:
   - focus ring color
   - avatar pixel widths
   - stack sizes
2. **Cosmetic:** the gallery's default link card has a trailing space in `class="card "`.
   It is harmless; fix it while editing nearby.

## Process Gaps
- The worker's one passing full check hid the race, so no one saw that the new spec is load-sensitive.
  Repeat runs under parallel load would have exposed it.

## Required Rework
1. After `selectOption(look)` in `tests/e2e/card.spec.js`, wait for the look stylesheet to apply.
   Follow the pattern in `warm.spec.js` or `verify-ui.spec.js`.
2. Run the spec several times with `--repeat-each` and record the output.
   Then rerun `python scripts/devops.py check` until it exits 0, and record that output too.
