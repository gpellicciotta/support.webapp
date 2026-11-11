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
- `tests/unit/tabs.test.js`
- `tests/e2e/tabs.spec.js`
- `docs/specs/visual-style-guide.md`
- `docs/specs/components.md`
- `CHANGELOG.md`

Size estimate: 9 files, 500 lines
Size note: The tabs styles, module, and tests form one component; splitting them leaves an untested half.

### Tests
- Unit: `tabs.test.js` checks roles, `aria-selected`, roving focus, arrow keys, Home, and End in a simulated DOM.
- Integration: `tabs.spec.js` switches gallery tabs by pointer and keyboard at 390 and 1440 px.

Completion check: `npx vitest run tests/unit/tabs.test.js`, exit code 0
