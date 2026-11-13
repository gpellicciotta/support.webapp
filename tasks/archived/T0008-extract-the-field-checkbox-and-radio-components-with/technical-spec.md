# T0008 Technical Specification
Extract fields, checkboxes, radios, and createField from todos.webapp, adding forms, validation states, help toggles, and error summaries.

---

## Approach
- Reference: [Fields, Forms, and Validation](../../../../docs/analysis/ui-design-comparison.md#fields-forms-and-validation).
- The modules accept an injected `document`, so their unit tests run in a simulated DOM.
- `field.js` exports `attachField` for existing markup and `createField`, which builds the skeleton and then attaches.
- `createField` keeps todos.webapp's `{element, control, setError}` result, so its adoption stays lossless.
- Forms and validation follow finding F20 of the T0002 review: help toggles are buttons, and icon, text, and color carry each state.
- The counters forms are the functional reference for help and validation states, not for markup.

---

## Declared Files
- `src/css/components/field.css`
- `src/css/components/checkbox.css`
- `src/css/components/radio.css`
- `src/css/components/field-group.css`
- `src/css/components/form.css`
- `src/css/components/error-summary.css`
- `src/js/field.js`
- `src/js/form.js`
- `src/css/style.css`
- `src/demo/visual-style-gallery.html`
- `tests/unit/field.test.js`
- `tests/unit/form.test.js`
- `tests/e2e/field.spec.js`
- `tests/e2e/form.spec.js`
- `docs/specs/visual-style-guide.md`
- `CHANGELOG.md`

Size estimate: 17 files, 950 lines
Size note: The user placed forms, validation, help toggles, and error summaries in this task on 2026-11-11.
Fields and forms share `field.js` and the validation states, so a split would leave a form without its fields.

### Tests
- Unit: `field.test.js` checks label, hint, counter, help toggle, and error wiring, plus valid, invalid, and pending states.
- Unit: `form.test.js` checks the error summary, focus on a failed submit, and the busy state.
- Integration: `field.spec.js` and `form.spec.js` fill gallery forms at 390 and 1440 px.
  They check error announcement, the help toggle by keyboard, the error summary links, and focus.

Completion check: `npx vitest run tests/unit/field.test.js tests/unit/form.test.js`, exit code 0
