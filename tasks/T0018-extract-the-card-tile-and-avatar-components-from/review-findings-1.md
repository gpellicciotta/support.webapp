---
task: T0018
round: 1
verdict: rejected
reviewer: "@claude"
reviewed_at: 2026-11-12T14:02:17Z
reviewed_commit: "578bdeb"
base_commit: "4a5fe1b"
branch: task/T0018-extract-the-card-tile-and-avatar-components-from
---
# Review Findings: Task T0018 (Round 1)

## Summary
Rejected.
The extraction follows the family-portal source closely, and its decisions are recorded.
`python scripts/devops.py check` passes on 578bdeb: 1458 unit, 172 browser, 4 integration, and 3 Python tests, plus lint.
Avatar sizes match the source (48, 72, 104 px), and tone fallbacks and the stack overlap work.
However, icon tiles offer only two distinct sizes in the neutral look and the template.
The catalog skeleton for avatar stacks also conflicts with the stack CSS.

## Defects
1. **Icon tile `--sm` and `--md` are identical in neutral and the template look.**
   `src/css/components/icon-tile.css` sets `--sm` to `--target-min` and `--md` to `--control-height`.
   Neutral and `_template` define `--control-height: var(--target-min)`, so both render at 44 px.
   Warm differs by only 4 px (44 vs 48 px).
   The neutral icon-tile captures in the companion directory confirm it: the first eight tiles share one size.
   This breaks the catalog's "sizes sm, md, lg" and the gallery's "Three sizes" claim.
   Tying a decorative tile to the touch-target token is also semantically wrong, since tiles are never controls.
2. **Size modifiers are silently ignored inside `.avatar-stack`.**
   `.avatar-stack > .avatar` (0-2-0) overrides `.avatar--sm` (0-1-0) with `clamp(72px, 20vw, 104px)`.
   The normative catalog skeleton (`docs/specs/components.md#avatar`) puts `avatar--sm` children in a stack.
   Markup built from the skeleton therefore renders 72–104 px stack members, not small ones.
   The style guide says avatars take "the same size and tone modifiers" and never mentions the override.
   Either let explicit size modifiers win inside stacks or document the fixed stack size and fix the skeleton.
3. **The gallery portrait is nearly invisible in dark themes (minor).**
   `src/demo/avatar.svg` fills with `currentColor`, which resolves to black inside an `<img>`.
   The dark captures show a black silhouette on near-black card and avatar surfaces.
   The visual inspection note claims the specimens remain readable.
4. **The static card button behavior changed without a recorded decision (minor).**
   The source pinned card buttons with `.card .button { align-self: flex-end; }`.
   The extraction drops it, so the button stretches full width at phone widths (warm mobile card capture).
   Dropping it may be correct under the ownership rule, but the style guide and decisions do not say so.

## Process Gaps
- No test asserts distinct rendered icon-tile sizes, so defect 1 passed unit, browser, and visual checks.
  The unit test only checks that the modifier selectors exist.
- The visual inspection in validation-proof.md missed defects 1 and 3, both visible in the saved captures.

## Required Rework
1. Give icon tiles three distinct sizes in every look, independent of `--target-min` and `--control-height`.
   Add a browser test asserting strictly increasing computed widths for `--sm`, `--md`, and `--lg` in both looks.
2. Resolve the avatar-stack size conflict in the CSS or the catalog skeleton and style guide.
   Cover the chosen behavior with a test.
3. Make the gallery portrait visible in dark themes, for example with a fixed fill that contrasts both surfaces.
4. Record a decision on the card button alignment, or restore an equivalent without breaking ownership rules.
5. Recapture the affected gallery sections, re-inspect them, and rerun `python scripts/devops.py check`.
