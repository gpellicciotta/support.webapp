# T0017 Technical Specification
Add the warm look from family-portal with its seasons variant, glyph set, and the look template.

---

### Declared Files
- src/demo/gallery.js
- src/demo/gallery.css
- src/demo/visual-style-gallery.html
- docs/specs/visual-style-guide.md
- src/contract.json
- tests/unit/gallery.test.js
- docs/index.md
- New warm and template look directories, warm guide, unit tests, and seasonal browser tests.

Size estimate: 7 files, 180 lines

### Tests
- Unit: Discover warm, resolve its contract, verify contrast, sprites, seasonal mappings, fallback, and template completeness.
- Integration: Switch looks and seasons; verify computed accents, fonts, icons, errors, and overflow in four browser projects.
- Capture neutral before and warm after screenshots at both widths and themes.

Completion check: `python scripts/devops.py check`, exit code 0
