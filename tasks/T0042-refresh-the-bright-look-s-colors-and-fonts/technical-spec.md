# T0042 Technical Specification
Refresh the bright look's colors and fonts to new values chosen by the user, after meteo adopts it.

---

## New Values
The user fills this section before the preview is approved.
- Colors: none listed yet.
- Fonts: none listed yet.

## Declared Files
- src/looks/bright/primitives.css
- docs/specs/looks/bright.md
- tests/unit/tokens.test.js

Size estimate: 3 files, 120 lines

### Tests
- Unit: token test cases asserting the new primitive values and AA contrast of every checked pair, failing first.
- Integration: the browser verifier over the gallery with the `bright` look in light and dark, at 390 and 1440 px.

Completion check: `python scripts/devops.py check`, exit code 0
