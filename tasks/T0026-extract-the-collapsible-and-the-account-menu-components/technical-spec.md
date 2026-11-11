# T0026 Technical Specification
Extract the collapsible and the account menu components from todos.webapp.

---

## Approach
- Reference: [Avatars and Account Menus](../../../docs/analysis/ui-design-comparison.md#avatars-and-account-menus) and [Collapsibles](../../../docs/analysis/ui-design-comparison.md#menus-popovers-tooltips-and-collapsibles).
- The account menu builds on the popover module; the avatar image waits for the family-portal phase.

---

## Declared Files
- `src/css/components/collapsible.css`
- `src/css/components/account-menu.css`
- `src/js/collapsible.js`
- `src/js/account-menu.js`
- `src/demo/visual-style-gallery.html`
- `tests/unit/account-menu.test.js`
- `tests/e2e/collapsible.spec.js`
- `tests/e2e/account-menu.spec.js`
- `docs/specs/visual-style-guide.md`
- `CHANGELOG.md`

Size estimate: 10 files, 570 lines
Size note: Both are disclosure widgets on `aria-expanded`, tested with the same steps in two specs.

### Tests
- Unit: `account-menu.test.js` checks initials, the person icon fallback, the current route mark, and Escape.
- Integration: `collapsible.spec.js` and `account-menu.spec.js` open and closes both widgets by pointer and keyboard at 390 and 1440 px.

Completion check: `npx playwright test tests/e2e/collapsible.spec.js tests/e2e/account-menu.spec.js`, exit code 0
