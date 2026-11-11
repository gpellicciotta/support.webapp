# T0004 Technical Specification
Extract the shared base tokens, the contract file, and the neutral look from todos.webapp, with the static token test.

---

## Approach
- `tests/unit/contract.js` lists the required contract tokens, the optional ones, and the contrast pairs.
- The token test parses each look's import chain and evaluates light and dark values separately.
- Contrast thresholds: 4.5:1 for text pairs, 3:1 for icons, focus rings, and control borders.
- The raw color ban covers every stylesheet outside `base.css` and the look token files.
- Mechanical command for the fonts: copy todos.webapp `src/fonts/*.woff2` and `OFL.txt` to `src/looks/neutral/fonts/`.
- The test skips look folders starting with `_`, and fails when a look redefines a base token.
- `deprecated.css` starts empty, with a header comment stating the alias rules of ADR-0001.
- The neutral look page lists every token added to fill gaps, with its source, for approval in review.

---

## Declared Files
- `src/css/style.css`
- `src/css/base.css`
- `src/css/reset.css`
- `src/contract.json`
- `src/looks/neutral/index.css`
- `src/looks/neutral/primitives.css`
- `src/looks/neutral/look.css`
- `src/looks/neutral/fonts.css`
- `src/css/deprecated.css`
- `tests/unit/contract.js`
- `tests/unit/tokens.test.js`
- `docs/specs/looks/neutral.md`
- `CHANGELOG.md`

Size estimate: 13 files, 850 lines
Size note: The token files and their test form one verifiable unit; neither merges usefully alone.

### Tests
- Unit: `tokens.test.js` reads the required tokens from `src/contract.json`, fails while any is missing, then checks contrast pairs in light and dark.
- Integration: `tokens.test.js` resolves the full import chain of `src/looks/neutral/index.css` and fails on a missing file.

Completion check: `npx vitest run tests/unit/tokens.test.js`, exit code 0
