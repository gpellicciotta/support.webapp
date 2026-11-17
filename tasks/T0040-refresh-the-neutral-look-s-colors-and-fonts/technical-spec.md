# T0040 Technical Specification
Refresh the neutral look's colors and fonts to new values chosen by the user, after todos.webapp adopts it.

---

## New Values
The user picked the Blue variant with Inter on 2026-11-17, from five rendered candidates.
- Grays (slate), steps 0 to 950: `#ffffff`, `#f8fafc`, `#f1f5f9`, `#e2e8f0`, `#cbd5e1`, `#94a3b8`, `#64748b`, `#475569`, `#334155`, `#1e293b`, `#172033`, `#0f172a`, `#020617`.
- Blue accent, replacing the navy primitives: 50 `#eff6ff`, 200 `#c3d5fb`, 300 `#a3bdf8`, 400 `#7ea2f6`, 600 `#2563eb`, 700 `#1d4ed8`, 800 `#1e40af`, 950 `#172554`.
- Blue 400 is lightened from `#60a5fa`, keeping the in-progress status at least 60 RGB distance from primary in dark.
- Fonts: unchanged; Inter stays the body and heading face.
- Rename the private `--navy-*` primitives to `--blue-*` in the neutral look only.

## Declared Files
- src/looks/neutral/primitives.css
- docs/specs/looks/neutral.md
- tests/unit/tokens.test.js

Size estimate: 3 files, 120 lines

### Tests
- Unit: a neutral palette test asserting the new primitive values and the absence of navy primitives, failing first; existing contrast checks keep passing.
- Integration: the browser verifier over the gallery with the `neutral` look in light and dark, at 390 and 1440 px.

Completion check: `python scripts/devops.py check`, exit code 0
