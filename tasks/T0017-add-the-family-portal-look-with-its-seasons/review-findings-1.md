---
task: T0017
round: 1
verdict: rejected
reviewer: "@claude"
reviewed_at: 2026-11-12T13:44:02Z
reviewed_commit: "28c4101"
base_commit: "bb0e69c"
branch: task/T0017-add-the-family-portal-look-with-its-seasons
---
# Review Findings: Task T0017 (Round 1)

## Summary
The warm look itself is solid.
Its primitives, semantic values, season ramps, and light fallbacks match family-portal `tokens.css` at `1953f75`.
`data-season` became bare `[data-accent="…"]` rules, as ADR-0002 requires.
The gallery season switch, specimens, sprite provenance, and font licenses are in place.
`python scripts/devops.py check` passed for the reviewer: exit 0, 1003 unit, 164 browser, and 4 integration tests.
The tree stayed clean afterward.
Screenshots show warm rendering in both themes, with all four season specimens.

The look template does not meet the goal.
The goal asks for a template built "from the two looks", but `src/looks/_template/` is a byte-for-byte copy of `neutral`.
Its "template completeness" test only checks that files exist.
Rejected for that gap, plus one stale contract document.

## Defects
1. **The template is a verbatim neutral copy, not a template built from both looks.**
   `diff` shows `look.css`, `primitives.css`, `icons.svg`, `fonts.css`, and `InterVariable.woff2` identical to `src/looks/neutral/`.
   - Comments still describe neutral, not template guidance.
     `look.css` says "Neutral semantic roles. Existing values are preserved; additions are documented."
     `primitives.css` says "Private neutral palette … from todos.webapp."
   - `look.css` omits every optional look-owned token that warm introduced or uses.
     Missing: `--color-accent`, `--color-accent-bg`, `--color-inverse`, `--color-tone-1..4`, `--color-on-tone-1..4`, `--color-shadow-soft`, `--color-shadow-strong`.
   - It has no `[data-accent="{{value}}"]` variant block or matching fallback block, so the ADR-0002 variant pattern is undiscoverable from the copy.
   - The README sends readers to warm for these, so the copied folder is not a self-contained checklist starting point.
2. **The template completeness test is too weak to back the spec's claim.**
   `tests/unit/warm.test.js` checks only that five files exist, plus one README substring.
   It skips `fonts.css`, and the token and icon tests skip `_` folders.
   Nothing proves that the template defines every required contract token in both themes, or provides every core icon id.
   The template can silently drift from the contract.
3. **The contract grew without updating ADR-0001.**
   `src/contract.json` adds `--color-shadow-soft` and `--color-shadow-strong` as optional Overlay tokens.
   ADR-0001 line 81 still lists Overlay as only `--color-backdrop` and `--color-shadow`.
   The new entries also sit at the top of the `tokens` array, apart from the other Overlay token and the optional tokens.

## Process Gaps
- The Execution Log lists the red-phase `[Implement]` entry after the green `[Verify]` entry, so the order reads out of sequence.
  `validation-proof.md` does record the failing output first.
- The technical specification promised "template completeness" coverage, but the shipped test only checks file presence (see Defect 2).

## Required Rework
1. Make `_template` a real template drawn from both looks:
   - Replace the neutral-specific header comments with template guidance.
   - Show the optional look-owned tokens, as defined placeholders or as clearly commented examples.
   - Include a commented `[data-accent="{{value}}"]` example in the main block and in the `@supports not (light-dark)` fallback block.
2. Strengthen the template test.
   Assert that every required look-owned contract token appears in both the main and fallback mappings, where applicable.
   Assert that every `contract.json` core icon id appears in `_template/icons.svg`, and that `fonts.css` exists.
   Record red and green output in `validation-proof.md`.
3. Update ADR-0001's Overlay token list, or document the optional shadow roles there.
   Move the two new `contract.json` entries next to `--color-shadow`, or into the optional-token group.

Optional, not required for approval:
- `applyLook` hard-codes `look !== 'warm'`, and the HTML hard-codes season options.
  A per-look accent map would let `bright` (T0023) reuse the switch.
- The template ships a 352 KB duplicate of neutral's Inter font in the package.
  Consider a system font stack in the template, which ADR-0002 allows, to avoid the duplication.
- Warm aliases surface hover, selected, and active to one sunken ground.
  This choice is documented, but hovered and selected rows then look the same.
