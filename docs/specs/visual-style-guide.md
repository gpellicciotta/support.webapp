# Visual Style Guide
Principles, token groups, patterns, and the shell of the shared design system, with links to the gallery.

- Style sheet: [style.css](../../src/css/style.css), imported by each look's `index.css`.
- Gallery: [visual-style-gallery.html](../../src/demo/visual-style-gallery.html), served by `python scripts/devops.py serve`.
- Component catalog: [components.md](components.md).
- Looks: [neutral](looks/neutral.md).

---

## Principles
- One system serves every sibling app; apps vendor it instead of copying files ([ADR-0005](../adrs/ADR-0005-distribution-and-versioning.md)).
- Components and pages use semantic role tokens only; primitives stay private to their look.
- Light and dark themes redefine semantic tokens only; `data-theme` overrides the system preference.
- Every text pair reaches WCAG 2.2 AA, every target reaches 44 px, and every control shows its focus.
- A look holds palette, fonts, shapes, and icons; its variants redefine semantic tokens only ([ADR-0002](../adrs/ADR-0002-looks.md)).

---

## Token Groups
[contract.json](../../src/contract.json) lists every token with its group and owner.
Base tokens live in [base.css](../../src/css/base.css); look tokens live in each look's `look.css`.
The gallery shows each group in the selected look and theme, with computed values.

| Group               | Intent and usage                                                       | Gallery                                                                                    |
| :------------------ | :--------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| Grounds             | Page and surface backgrounds; pick by elevation and state.             | [Grounds](../../src/demo/visual-style-gallery.html#tokens-grounds)                         |
| Text                | Body, muted, disabled, and link text; never use muted for key content. | [Text](../../src/demo/visual-style-gallery.html#tokens-text)                               |
| Lines and focus     | Dividers, control borders, and the focus ring color.                   | [Lines and focus](../../src/demo/visual-style-gallery.html#tokens-lines-and-focus)         |
| Main action         | The one primary action per view, with its states.                      | [Main action](../../src/demo/visual-style-gallery.html#tokens-main-action)                 |
| Danger              | Destructive actions and errors only, never decoration.                 | [Danger](../../src/demo/visual-style-gallery.html#tokens-danger)                           |
| Success and warning | Outcomes and cautions; pair the color with a label or icon.            | [Success and warning](../../src/demo/visual-style-gallery.html#tokens-success-and-warning) |
| Overlay             | Shadow tint and dialog backdrop.                                       | [Overlay](../../src/demo/visual-style-gallery.html#tokens-overlay)                         |
| Optional per look   | Accents, tones, and statuses a look may define; guard each use.        | [Optional per look](../../src/demo/visual-style-gallery.html#tokens-optional-per-look)     |
| Fonts               | Body, heading, and mono stacks, and the weight steps.                  | [Fonts](../../src/demo/visual-style-gallery.html#tokens-fonts)                             |
| Type                | The type scale, line heights, and letter spacing.                      | [Type](../../src/demo/visual-style-gallery.html#tokens-type)                               |
| Space               | Gaps, padding, and margins; use scale steps, never raw lengths.        | [Space](../../src/demo/visual-style-gallery.html#tokens-space)                             |
| Radius roles        | Corner radii by role, so a look can reshape all controls at once.      | [Radius roles](../../src/demo/visual-style-gallery.html#tokens-radius-roles)               |
| Lines               | Border widths and focus ring geometry.                                 | [Lines](../../src/demo/visual-style-gallery.html#tokens-lines)                             |
| Elevation           | Shadows for raised surfaces and overlays.                              | [Elevation](../../src/demo/visual-style-gallery.html#tokens-elevation)                     |
| Layers              | Stacking order; use the named layer, never a raw `z-index`.            | [Layers](../../src/demo/visual-style-gallery.html#tokens-layers)                           |
| Motion              | Durations, easing, and offsets; reduced motion zeroes the durations.   | [Motion](../../src/demo/visual-style-gallery.html#tokens-motion)                           |
| Sizes               | Touch targets, control heights, and icon sizes.                        | [Sizes](../../src/demo/visual-style-gallery.html#tokens-sizes)                             |
| Widths              | Content, column, and panel widths, and the page gutter.                | [Widths](../../src/demo/visual-style-gallery.html#tokens-widths)                           |

---

## Components
[components.md](components.md) is the catalog: keys, markup skeletons, variants, states, and accessibility minimums.
Each component gains a gallery section `id="{{key}}"` in the task that builds it.

---

## Patterns
No pattern is built yet.
Each pattern task adds its intent, when to use it, when not to, and a gallery link here.

---

## Shell
The app shell task adds its areas, scroll modes, and demo pages here ([ADR-0004](../adrs/ADR-0004-app-shell.md)).

---

## Gallery
- The look switcher swaps the look stylesheet link; the theme switch sets or removes `data-theme`.
- Specimens use classes only; [gallery.css](../../src/demo/gallery.css) maps each token to `--specimen`.
- The gallery shows placeholder content only.
- Add a look to `looks` in [gallery.js](../../src/demo/gallery.js) and to the look select.
- No look defines a `data-accent` variant yet, so the gallery has no variant switch.

**[Decided]** One mapping rule per token in `gallery.css`, such as `.token--color-bg { --specimen: var(--color-bg); }`.
- Inline `style` attributes: rejected, because the ui-guidelines forbid inline styles on specimens.
- Specimens built by script from `contract.json`: rejected, since script-set custom properties are inline styles too.
- The gallery unit test fails when a contract token lacks a specimen or a mapping rule.

---

## Verification
- [tokens.test.js](../../tests/unit/tokens.test.js) checks the contract, contrast pairs, fallbacks, and raw colors statically.
- [gallery.test.js](../../tests/unit/gallery.test.js) checks the switchers and that the gallery covers every token.
- [verify-ui.spec.js](../../tests/e2e/verify-ui.spec.js) is the browser verifier, ported from family-portal's `verify-ui.py`.

The verifier runs each look at 390 and 1440 px, with system and explicit themes:
- HTTP 200, every stylesheet and import loaded, no font errors, no console errors, and no failed requests.
- No horizontal scroll.
- Rendered text contrast of 4.5:1, or 3:1 for large text.
- Targets of at least `--target-min`, except links inside sentences.
- A `:focus-visible` outline of at least 2 px at 3:1, or a focus shadow, on every interactive element.
- A screenshot per look, theme, and width in the Playwright output folder.

Run it with `npx playwright test tests/e2e/verify-ui.spec.js`.
