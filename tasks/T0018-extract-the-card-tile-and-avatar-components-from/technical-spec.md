# T0018 Technical Specification
Extract static cards, tiles, and avatars from family-portal commit `1953f75484a2fe65aa3444730b3a9f459ae21cb4`.
Follow ADR-0001, ADR-0003, ADR-0007, and the catalog.
**[Decided]** Preserve avatar dimensions with space tokens; use semantic radii and optional-tone fallbacks.
**[Decided]** Author initials or icon fallback markup; consuming applications handle failed image requests.
**[Decided]** Keep the catalog's `.avatar-stack` companion block in avatar.css, explicitly allowed by ownership tests.
**[Decided]** Use the shared outline and keep nested actions in static cards only.
**[Decided]** Tiles use space tokens for distinct 32, 48, and 64 pixel sizes, independent of controls.
**[Decided]** Explicit avatar size modifiers override responsive stack defaults.
**[Decided]** Static card buttons retain natural flex stretching; applications own action alignment without cross-component selectors.
**[Decided]** The placeholder portrait uses a fixed mid-gray illustration fill, independent of the embedding document's theme.

---

## Declared Files
- src/css/style.css
- src/css/components/card.css (new)
- src/css/components/icon-tile.css (new)
- src/css/components/avatar.css (new)
- src/demo/visual-style-gallery.html
- src/demo/gallery.css
- src/demo/avatar.svg (new placeholder illustration)
- tests/unit/card.test.js (new)
- tests/unit/icon-tile.test.js (new)
- tests/unit/avatar.test.js (new)
- tests/unit/tokens.test.js
- tests/e2e/card.spec.js (new)
- docs/specs/visual-style-guide.md
- CHANGELOG.md

Size estimate: 5 files, 240 lines

### Tests
- Unit: Check component imports, sizes, tone fallbacks, stack ownership, and avatar alternatives before implementation.
- Integration: Test both looks, themes, and viewport sizes; check card keyboard focus, hover, press, images, and overflow.
- Integration: Check reduced motion, forced colors, console errors, and failed requests with the browser verifier.
- Integration: Assert strictly increasing tile widths in both looks and explicit small, medium, and large stack member sizes.
- Visual: Capture the gallery before extraction and component sections afterward; inspect screenshots.

Completion check: `python scripts/devops.py check`, exit code 0
