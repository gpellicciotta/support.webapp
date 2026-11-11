# T0006 Technical Specification
Extract the icon sprite format, the icon class, and the spriteIcon builder, with the todos glyph set.

---

## Approach
- Icons reference the look sprite as an external file with `<use href>`, served from the same origin.
- The core id list lives in `src/js/icons.js` and is the source for the sprite test.
- `setSpriteUrl(url)` sets the sprite path once, so Java-served and static apps both resolve it.
- Mechanical command for the glyphs: copy todos.webapp `src/img/icons.svg` to `src/looks/todos/icons.svg`.

---

## Declared Files
- `src/css/components/icon.css`
- `src/js/icons.js`
- `src/css/style.css`
- `src/demo/visual-style-gallery.html`
- `tests/unit/icons.test.js`
- `tests/e2e/verify-ui.spec.js`
- `docs/specs/visual-style-guide.md`
- `CHANGELOG.md`

Size estimate: 8 files, 350 lines

### Tests
- Unit: `icons.test.js` checks the markup `spriteIcon` builds and that the todos sprite holds every core id.
- Integration: `verify-ui.spec.js` loads the gallery icon section and fails on any unresolved sprite reference.

Completion check: `npx vitest run tests/unit/icons.test.js`, exit code 0
