# T0023 Technical Specification
Bright extracts meteo commit 8937c32fca32a82acc6a15b08901f354284cd14b, licensed MIT.

### Declared Files
- src/looks/bright/index.css
- src/looks/bright/primitives.css
- src/looks/bright/look.css
- src/looks/bright/icons.svg
- src/demo/gallery.js
- src/demo/visual-style-gallery.html
- tests/unit/bright.test.js
- tests/unit/contract.js
- tests/unit/tokens.test.js
- tests/e2e/bright.spec.js
- tests/e2e/verify-ui.spec.js
- docs/specs/looks/bright.md
- docs/specs/visual-style-guide.md
- CHANGELOG.md

Size estimate: 13 files, 480 lines
Size note: One look requires assets, gallery registration, documentation, and cross-theme contrast verification.

### Tests
- Unit: Discover bright, resolve every contract role, validate fallbacks, core glyphs, and all accent contrast pairs.
- Integration: Verify every accent with the rendered gallery verifier at 390 and 1440 pixels in both themes.
- Integration: Capture before and after galleries; verify wrapper variants, switching, system themes, and request errors.

Completion check: python scripts/devops.py check
