# T0030 Technical Specification
Design and add the tabs component with tablist roles and arrow-key navigation

---

## Approach
- Reference: the WAI-ARIA Authoring Practices tabs pattern, with automatic activation by default.
- `attachTabs(element)` enhances existing markup; it returns a controller with `destroy()`.

---

## Declared Files
- `src/css/components/tabs.css`
- `src/js/tabs.js`
- `src/css/style.css`
- `src/demo/visual-style-gallery.html`
- `src/demo/gallery.js`
- `tests/unit/tabs.test.js`
- `tests/e2e/tabs.spec.js`
- `docs/specs/visual-style-guide.md`
- `docs/specs/components.md`
- `CHANGELOG.md`
- `tests/e2e/gallery-helpers.js`
- `tests/e2e/card.spec.js`
- `tests/e2e/bright.spec.js`
- `tests/e2e/look-loading.spec.js`

Size estimate: 14 files, 600 lines
Size note: The tabs styles, module, and tests form one component; splitting them leaves an untested half.
Combined task: Review P1 requires resolving the gallery verification gate before the tabs task can complete.

### Tests
- Unit: `tabs.test.js` checks roles, `aria-selected`, roving focus, arrow keys, Home, and End in a simulated DOM.
- Integration: `tabs.spec.js` switches gallery tabs by pointer and keyboard at 390 and 1440 px.
- Integration: `look-loading.spec.js` holds imported CSS until released, verifying readiness before dimensions and token reads.

Completion check: `npx vitest run tests/unit/tabs.test.js`, exit code 0
