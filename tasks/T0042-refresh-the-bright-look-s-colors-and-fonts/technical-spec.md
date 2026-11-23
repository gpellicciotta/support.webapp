# T0042 Technical Specification
Refresh the bright look's colors and fonts to the variant the user picks from five rendered candidates.

---

## New Values
The user picked the Ocean and raspberry variant (`b5`) on 2026-11-23, from five rendered candidates.
See [candidates.md](candidates/candidates.md) and the boards beside it.
Each value re-hues the current primitive at the same WCAG luminance, so every contrast ratio is kept.
- Slate (sea-tinted), replacing the same steps:
  - 50 `#f8fafc`, 75 `#f4f7f9`, 200 `#dfe9ee`, 400 `#8ba6b3`, 500 `#728791`.
  - 600 `#53646c`, 800 `#294350`, 900 `#132c37`, 925 `#05222e`, 950 `#011a26`.
- Blue (cerulean): 200 `#b2dffd`, 300 `#7bc9fc`, 400 `#00adf6`, 600 `#006796`, 800 `#004c6f`.
- Red (raspberry):
  - 200 `#fdcace`, 300 `#fba4af`, 400 `#f77086`.
  - 600 `#db2157`, 700 `#b71747`, 800 `#98183b`, 900 `#7e1b33`.
- Unchanged: white, green, yellow, ink-950, shadow and scrim tints, and radii.
- Fonts: Lexend Variable for body and headings, replacing the system stack, with the system stack as fallback.
  - Self-host `@fontsource-variable/lexend` 5.3.0: the latin and latin-ext `wght` files and the OFL license.
  - Lexend has no italic; browsers synthesize oblique text.
  - Rename the private `--font-family-system` primitive to `--font-family-body`.
- **[Decided]** This replaces ADR-0002's system font stack for bright; amend the ADR with the user's 2026-11-23 choice.

## Declared Files
- src/looks/bright/primitives.css
- src/looks/bright/index.css
- src/looks/bright/look.css
- docs/specs/looks/bright.md
- docs/adrs/ADR-0002-looks.md
- tests/unit/tokens.test.js
- tests/unit/bright.test.js
- tests/e2e/bright.spec.js
- src/looks/bright/fonts.css
- src/looks/bright/fonts/lexend/lexend-latin-wght-normal.woff2
- src/looks/bright/fonts/lexend/lexend-latin-ext-wght-normal.woff2
- src/looks/bright/fonts/lexend/OFL.txt

Size estimate: 8 files, 180 lines

### Tests
- Unit: a bright palette test asserting the new primitive values, failing first; existing contrast checks keep passing.
- Unit: the font byte test pins the Lexend files' SHA-256; the bright test expects `fonts.css` and the Lexend stack.
- Integration: the bright browser spec expects a loaded Lexend body font; the verifier covers light and dark at 390 and 1440 px.

Completion check: `python scripts/devops.py check`, exit code 0
