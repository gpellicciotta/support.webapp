# T0008 Technical Specification
Extract the field, checkbox, and radio components with the createField module from todos.webapp.

---

## Approach
- Reference: [Fields, Forms, and Validation](../../../docs/analysis/ui-design-comparison.md#fields-forms-and-validation).
- The module accepts an injected `document`, so its unit test runs in a simulated DOM.

---

## Declared Files
- `src/css/components/field.css`
- `src/css/components/choice.css`
- `src/js/field.js`
- `src/css/style.css`
- `src/demo/visual-style-gallery.html`
- `tests/unit/field.test.js`
- `tests/e2e/fields.spec.js`
- `docs/specs/visual-style-guide.md`
- `CHANGELOG.md`

Size estimate: 9 files, 550 lines
Size note: The field styles, module, and tests form one component; splitting them leaves an untested half.

### Tests
- Unit: `field.test.js` checks label, hint, counter, and error wiring, plus `aria-invalid` toggling.
- Integration: `fields.spec.js` types into gallery fields at 390 and 1440 px and checks error announcement and focus.

Completion check: `npx vitest run tests/unit/field.test.js`, exit code 0
