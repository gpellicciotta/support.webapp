# ADR-0007: Documentation and Verification
Defines the gallery, the style guide, this repository's checks, the two jobs of each app's vendored check, and the lossless switch proof.

- Status: Accepted on 2026-11-12, in review round 2 of the planning task.
- Date: 2026-11-11.
- **[Decided]** with the user on 2026-11-10: ship the static token test and a browser verifier; no pixel-diff regression.
- **[Decided]** with the user on 2026-11-11: the vendored check stays JavaScript, as `check.mjs`.

---

## Context
- The ui-guidelines require a style sheet, a gallery, and a style guide for a project-owned system.
- todos.webapp checks tokens statically: contrast pairs, the raw color ban, and fallback parity.
- family-portal checks rendered pages in a browser: contrast, raw colors, target sizes, and focus.
- counters runs pixel-diff visual regression, which the user ruled out for this system.
- Each adopter phase must prove a lossless switch.
- All five sibling apps run Python devops scripts; four of them already have a `package.json`, and family-portal has none.

---

## Decision
Gallery:
- One `src/demo/visual-style-gallery.html` loads the real styles plus one `gallery.css` for specimen layout.
- A look switcher swaps the look stylesheet; a theme switcher sets `data-theme` to `light` or `dark`, or removes it for `system`.
- It shows every token group, component, variant, state, pattern, and shell option, with placeholder content only.
- Each component has one section with `id="{{key}}"`, as [naming.md](../specs/naming.md) defines.

Style guide:
- [visual-style-guide.md](../specs/visual-style-guide.md) covers principles, token groups, patterns, and the shell.
- [components.md](../specs/components.md) is the component catalog: each component's key, markup skeleton, variants, states, and accessibility minimum.
- Each component and pattern links to its gallery section and states when to use it and when not to.
- One page per look under `docs/specs/looks/` covers palette intent, fonts, variants, glyph origin and license, and look decisions.

Checks in this repository, all on Vitest and Playwright Test, as in todos.webapp:
- Static token test, ported from todos.webapp, run for every look and theme:
  - Every required token listed in [contract.json](../../src/contract.json) is defined.
  - Text pairs reach 4.5:1; icons, focus rings, and control borders reach 3:1.
  - No raw colors appear outside token files, and no primitive appears outside its look.
  - The `@supports` fallback defines the same names as the main theme.
  - A private token `--_{{key}}-{{name}}` appears only in `css/components/{{key}}.css`.
  - No component partial selects the block class of another component.
  - Every look's `icons.svg` provides every core icon id listed in `contract.json`.
  - Every component key in `contract.json` has a CSS partial, a gallery section, and a markup skeleton in the catalog.

- Browser verifier, ported from family-portal's Python script to Playwright Test:
  - The gallery and the shell demos return HTTP 200 with every stylesheet loaded.
  - No console errors, no failed requests, and no horizontal scroll at 390 and 1440 px.
  - Rendered contrast, 44 px targets, and a visible focus indicator on every interactive specimen.
  - Screenshots for each look and theme at both widths, stored as review evidence.

- Unit tests for every module, with a simulated DOM, in `tests/unit/{{key}}.test.js`.
- End-to-end tests for dialogs, menus, popovers, toasts, and forms at 390 and 1440 px, in `tests/e2e/{{key}}.spec.js`.

Vendored check in each app:
- `vendor` copies `check.mjs` into the app, so each app runs the checker of its own design version.
- It needs no network and imports nothing else.
- App CI runs it on every push; developers run `node {{web-root}}/vendor/design/bin/check.mjs`.
- It has two jobs, which report separately.

Integrity check, on the vendored copy:
- It hashes every vendored file and compares the hashes with `manifest.json`.
- It fails on a changed file, a missing file, or a file the manifest does not list.
- It fails when the pin, the `version` in `design.json`, differs from the `version` in `manifest.json`.
- It catches accidental edits; an edit to both a file and its manifest entry is out of scope.
- Its purpose is DS-10: copies must not drift, as auth's stale copies did.

Conformance check, on the app's own stylesheets:
- It scans the stylesheet folders listed in `design.json`, including an app's own look folder.
- It fails on raw colors outside the app's token files, and on primitive or private tokens of the package.
- It warns on deprecated names, read from `contract.json`.
- It warns on fixed or sticky positions outside the shell, which belong in shell areas.

Lossless switch proof, for each adopter phase:
- Screenshots of the app's main pages at 390 and 1440 px, light and dark, before and after the switch.
- A snapshot of computed styles of key elements, before and after.
- A search for every renamed token name, which must find no leftover use.
- Every difference is listed in the adoption task, as either a fix or a deliberate change.

---

## Options Considered
Toolchain of this repository's checks:
- **[Chosen]** Port both checks to JavaScript: one toolchain for the package, its tests, and the command line tool.
- Keep family-portal's verifier in Python: rejected, because the repository would need two test toolchains.
  The token test parses CSS next to Vitest unit tests, and Playwright Test already covers the browser.

Language of the vendored check:
- **[Chosen]** JavaScript, as `check.mjs`: **[Decided]** with the user on 2026-11-11.
  It shares code with `vendor`, and Node.js is already needed to run `vendor`.
- A stdlib-only Python `check.py`, run from each app's devops script: rejected by the user.
  It would spare family-portal's CI from Node.js, but the hash and scan rules would exist in two languages.
- A `design-check` tool in support.python: rejected, because its version is not pinned to the design version.
  A newer checker could reject an older vendored copy.

Visual regression:
- **[Chosen]** Screenshots for review plus computed-style snapshots: they show differences without pixel baselines.
- Pixel diffs, as in counters: rejected by the user on 2026-11-10.

---

## Consequences
- The check matrix grows with each look: looks, themes, and two widths.
- Adopters gain a vendored check in CI, which fails on drift instead of letting copies rot as in auth.
- Computed-style snapshots need a list of key selectors per app; each adoption task names them.
- `contract.json` becomes the single list that the token test, the vendored check, the gallery, and the catalog share.
- family-portal's CI gains Node.js to run `check.mjs`.

---

## Evidence
- Current checks: [Documentation, Galleries, and Tests](../analysis/ui-design-comparison.md#documentation-galleries-and-tests).
- Contrast rules: [Colors, Contrast, and Color Meaning](../analysis/ui-design-comparison.md#colors-contrast-and-color-meaning).
- Focus and targets: [Focus Indicators and Touch Targets](../analysis/ui-design-comparison.md#focus-indicators-and-touch-targets).
- Sibling toolchains: the devops scripts and `package.json` files of the five sibling apps, checked on 2026-11-11, `[V:C]`.
- Sibling facts are `[V:C]`: first-party code read at the commits pinned in the comparison.
- Research context: written by Claude Opus 5.5 on 2026-11-11, knowledge cutoff June 2026, with web access to HTML pages.
