## Technical Specifications

### Design
- **[Decided]** The glow is two `box-shadow` layers: a solid `--focus-ring-width` contour, then a halo.
- The halo blurs over `2 × --focus-ring-width` and spreads one `--focus-ring-width`, at 20% of the contour color.
- **[Decided]** The halo is 20%, not 25%: at 25% the neutral dark contour on the active ground fell to 2.80:1.
- A transparent `--focus-ring-width` outline stays at `--focus-ring-offset`; forced colors mode paints it.
- **[Decided]** Base tokens `--focus-glow`, `--focus-glow-inset`, `--focus-glow-danger`, and `--focus-glow-danger-inset` carry the glow.
  Components cannot declare contract tokens, so danger variants are fixed tokens, not a per-element color variable.
- Components with their own shadow compose the glow first: fab, link card, pressed filter chip, checked segmented option, invalid field, current bottom-nav item.
- **[Decided]** Menu items and collapsible toggles use the inset glow, with an outline offset of `-1 × --focus-ring-width`.
- Menus take `--space-2` of inline padding, so the inset glow keeps clear of the side borders.
- Danger buttons, icon buttons, menu items, and invalid checkboxes, selection boxes, and fields glow in `--color-danger`.
- The contour touches filled controls, so on primary and danger fills the halo, not the contour, separates the focused state.

### Declared Files
- src/css/base.css
- src/css/reset.css
- src/css/shell.css
- src/css/components/button.css
- src/css/components/card.css
- src/css/components/checkbox.css
- src/css/components/chip.css
- src/css/components/collapsible.css
- src/css/components/error-summary.css
- src/css/components/fab.css
- src/css/components/field.css
- src/css/components/icon-button.css
- src/css/components/menu.css
- src/css/components/segmented.css
- src/css/components/selection.css
- src/css/components/switch.css
- src/contract.json
- src/demo/gallery.css
- src/demo/visual-style-gallery.html
- tests/e2e/gallery-helpers.js
- tests/e2e/button.spec.js
- tests/e2e/card.spec.js
- tests/e2e/link-button.spec.js
- tests/e2e/menu.spec.js
- tests/e2e/segmented.spec.js
- tests/e2e/switch.spec.js
- tests/e2e/verify-ui.spec.js
- docs/adrs/ADR-0001-layer-model-and-token-contract.md
- docs/adrs/ADR-0003-components-and-patterns.md
- docs/specs/components.md
- docs/specs/visual-style-guide.md

Size estimate: 31 files, 420 lines

Size note: Every focus override sits in its own component partial, so one global change touches each of them.
A split would leave intermediate states with mixed outline and glow indicators, or failing verifier runs.

### Tests
- Unit: `tests/unit/tokens.test.js` checks the four glow tokens are base-owned contract tokens, resolved in every look.
- Unit: `tests/unit/gallery.test.js` checks the gallery shows each new token with a specimen rule.
- Integration: `expectRing` in `gallery-helpers.js` asserts a transparent outline, a solid contour in the expected color, and a translucent blurred halo.
- Integration: `menu.spec.js` asserts inset glows on menu items in every look, and `--space-2` side room inside each menu.
- Integration: `verify-ui.spec.js` checks each glow contour at 3:1 against its ground and against its halo over that ground.
- Integration: forced colors tests assert an opaque solid outline of at least 2 px and no shadow.

Completion check: python scripts/devops.py check
