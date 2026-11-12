# T0019 Technical Specification
Design and add an accessible switch component.

---

## Declared Files
- src/css/components/switch.css
- src/css/style.css
- src/demo/visual-style-gallery.html
- docs/specs/visual-style-guide.md
- CHANGELOG.md
- tests/unit/switch.test.js
- tests/e2e/switch.spec.js

Size estimate: 7 files, 300 lines.
**[Estimation]** Based on existing native controls; newly added files are excluded from counted size.

**[Decided]** Use the catalog's native checkbox skeleton, with no JavaScript module or duplicated checked ARIA.
Thumb position conveys state without color. Use semantic tokens, logical properties, and a 44 px label target.
Show off, on, hover, focus, active, disabled off, disabled on, and invalid states.
Associate invalid state with error text. Avoid animation; preserve native form, reset, and fieldset behavior.

### Tests
- Unit: gallery skeleton, stable labels, state coverage, stylesheet import, and existing token conformance tests.
- Integration: click and Space toggle; disabled controls resist activation; form submission and reset remain native.
- Integration: targets, focus, thumb position, forced colors, RTL, associated errors, and overflow.
- Integration: gallery verifier across looks, light/dark themes, and 390/1440 px viewports; inspect before/after screenshots.

Completion check: `python scripts/devops.py check`, exit code 0
