# T0024 Technical Specification
Add the tooltip component after a screen reader check of meteo's tooltips.

---

## Declared Files
- src/css/style.css
- src/demo/gallery.js
- src/demo/visual-style-gallery.html
- docs/specs/components.md
- docs/specs/visual-style-guide.md

New files: src/js/tooltip.js, src/css/components/tooltip.css, tests/unit/tooltip.test.js, tests/e2e/tooltip.spec.js.

Size estimate: 5 files, 100 lines

The orchestrator authorized Chromium accessibility-tree inspection; T0037 retains the manual screen reader check.
Use explicit text with role tooltip and aria-describedby, following the WAI-ARIA tooltip pattern.
Keep focus on the trigger, dismiss on Escape, and retain hover across the trigger and tooltip.
Use a manual native popover for top-layer positioning, with hidden fallback and reversible attachment.
Without JavaScript, explicit descriptive text remains readable.

### Tests
- Unit: preserve descriptions; restore attributes; focus, blur, Escape, pointer transitions, touch exclusion, plain-text builder, cleanup.
- Integration: Chromium description assertions, hover persistence, focus retention, Escape, viewport containment, and gallery screenshots across looks and themes.

Completion check: `python scripts/devops.py check`, exit code 0
