---
task: T0034
round: 1
verdict: rejected
reviewer: "@claude"
reviewed_at: 2026-11-12T13:20:30Z
reviewed_commit: "36e12d6"
base_commit: "5143742"
branch: task/T0034-add-the-link-button-component-from-family-portal
---
# Review Findings: Task T0034 (Round 1)

## Summary
The link button partial, gallery section, browser spec, catalog, style guide, and changelog entry are in place.
The work is close to approval. Two small fidelity and consistency defects block it.

Reviewer verification on commit `36e12d6`:
- `npx playwright test tests/e2e/link-button.spec.js tests/e2e/verify-ui.spec.js`: exit 0, 24 passed (16.1s).
- `npx vitest run tests/unit`: 7 files, 546 tests passed.
- The recorded full `devops.py check` output shows exit 0, with 148 browser tests and 4 integration tests.
- Failing-first evidence covers the new spec and the partial-list unit test.
- Screenshot `after-mobile-dark.png` shows all five states rendered, with the focus ring on the specimen.
- CSS specificity is correct: `.link-button:disabled` comes last, so it overrides real and specimen hover and active.

## Defects
1. Gallery section order disagrees with the table of contents and the catalog.
   - `src/demo/visual-style-gallery.html:399` places `#link-button` between `#button` and `#icon-button`.
   - The navigation (`visual-style-gallery.html:53-55`), `components.md`, and the style guide table list it after Icon button.
   - A reader who follows the navigation order meets Link button before Icon button on the page.
2. The partial drops family-portal's `text-underline-offset: 0.2em`.
   - Source: `family-portal/webapp/css/components.css:956`.
   - The `[Decided]` log entry says "Kept family-portal link styling" but records no reason for dropping it.
   - The underline therefore sits closer to the text than in the source app.
   - The `--radius-button` and 44 px minimum-width changes are documented divergences and are acceptable.

## Process Gaps
- The `[Decided]` entry says the source styling was kept unchanged, but the underline offset was dropped.
  Decision records should list every divergence from the source.

## Required Rework
1. Move the `#link-button` section after the `#icon-button` section to match the navigation and catalog order.
2. Add `text-underline-offset: 0.2em` to `.link-button`. Otherwise, record a `[Decided]` entry explaining why it was dropped.
   If it is restored, assert `text-underline-offset` in `tests/e2e/link-button.spec.js` and record its failing-first output.
3. Rerun the completion check and record the output in `validation-proof.md`.
   Refresh the after screenshots if the section moves.
