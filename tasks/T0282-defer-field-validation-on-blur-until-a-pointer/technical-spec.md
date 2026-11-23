## Technical Specifications
### Source
Auth (`../auth`, commit `eeb9439`), read for T0277; see `docs/analysis/auth-webapp-ui-audit.md`, section "Field Validation After Pointer Release".
- `webapp/admin/js/ui.mjs` lines 240 to 314 (`pointerState` and `validatedField`).

### Behavior To Keep
- A document-level pointer state records presses; a held check runs on the release.
- Calling `validate`, `clear`, or `setError` first drops the held check.
- Keyboard blur keeps validating at once.
- Follow naming.md: `data-*` hooks and ARIA state, no style classes as hooks.

### Declared Files
- src/js/field.js
- tests/unit/field.test.js
- tests/e2e/field.spec.js
- docs/specs/components.md

### Tests
- Unit: a blur during a press waits for `pointerup`; a later `validate`, `clear`, or `setError` drops it; a keyboard blur validates at once.
- Integration: with an empty required field focused, a click on the submit button still submits and then shows the error.

Completion check: `python scripts/devops.py check`, with the new tests green.
