# ADR-0007: Documentation and Verification
Defines the gallery, the style guide, this repository's checks, each app's conformance check, and the lossless switch proof.

- Status: Proposed, awaiting approval in the review of the planning task.
- Date: 2026-11-11.
- Decided with the user on 2026-11-10: ship the static token test and a browser verifier; no pixel-diff regression.

---

## Context
- The ui-guidelines require a style sheet, a gallery, and a style guide for a project-owned system.
- todos.webapp checks tokens statically: contrast pairs, the raw color ban, and fallback parity.
- family-portal checks rendered pages in a browser: contrast, raw colors, target sizes, and focus.
- counters runs pixel-diff visual regression, which the user ruled out for this system.
- Each adopter phase must prove a lossless switch.

---

## Decision
Gallery:
- One `src/demo/visual-style-gallery.html` loads the real styles plus one `gallery.css` for specimen layout.
- A look switcher swaps the look stylesheet; a theme switcher sets `data-theme` to light, dark, or system.
- It shows every token group, component, variant, state, pattern, and shell option, with placeholder content only.

Style guide:
- `docs/specs/visual-style-guide.md` covers principles, token groups, components, patterns, and the shell.
- Each component and pattern links to its gallery section and states when to use it and when not to.
- One page per look under `docs/specs/looks/` covers palette intent, fonts, variants, and look decisions.

Checks in this repository, all on Vitest and Playwright Test, as in todos.webapp:
- Static token test, ported from todos.webapp, run for every look and theme:
  - Every required contract token is defined.
  - Text pairs reach 4.5:1; icons, focus rings, and control borders reach 3:1.
  - No raw colors appear outside token files, and no primitive appears outside its look.
  - The `@supports` fallback defines the same names as the main theme.

- Browser verifier, ported from family-portal's Python script to Playwright Test:
  - The gallery and the shell demos return HTTP 200 with every stylesheet loaded.
  - No console errors, no failed requests, and no horizontal scroll at 390 and 1440 px.
  - Rendered contrast, 44 px targets, and a visible focus indicator on every interactive specimen.
  - Screenshots for each look and theme at both widths, stored as review evidence.

- Unit tests for every module, with a simulated DOM.
- End-to-end tests for dialogs, menus, popovers, and toasts at 390 and 1440 px.

Conformance check in each app:
- The vendored `check` tool verifies the copy against its manifest and the pin.
- It scans the stylesheet folders listed in `design.json` for raw colors, primitive or private tokens, and deprecated names.
- It warns on fixed or sticky positions outside the shell, which belong in shell areas.
- App CI runs it on every push.

Lossless switch proof, for each adopter phase:
- Screenshots of the app's main pages at 390 and 1440 px, light and dark, before and after the switch.
- A snapshot of computed styles of key elements, before and after.
- A search for every renamed token name, which must find no leftover use.
- Every difference is listed in the adoption task, as either a fix or a deliberate change.

---

## Options Considered
Toolchain:
- Port both checks to JavaScript, chosen: one toolchain for package, tests, and command line tool.
- Keep family-portal's verifier in Python: two toolchains for one repository.

Visual regression:
- Screenshots for review plus computed-style snapshots, chosen: they show differences without pixel baselines.
- Pixel diffs, as in counters: rejected by the user on 2026-11-10.

---

## Consequences
- The check matrix grows with each look: looks, themes, and two widths.
- Adopters gain a conformance check in CI, which fails on drift instead of letting copies rot as in auth.
- Computed-style snapshots need a list of key selectors per app; each adoption task names them.

---

## Evidence
- Current checks: [Documentation, Galleries, and Tests](../analysis/ui-design-comparison.md#documentation-galleries-and-tests).
- Contrast rules: [Colors, Contrast, and Color Meaning](../analysis/ui-design-comparison.md#colors-contrast-and-color-meaning).
- Focus and targets: [Focus Indicators and Touch Targets](../analysis/ui-design-comparison.md#focus-indicators-and-touch-targets).
- Sibling facts are `[V:C]`: first-party code read at the commits pinned in the comparison.
- Research context: written by Claude Opus 5.5 on 2026-11-11, knowledge cutoff June 2026, with web access to HTML pages.
