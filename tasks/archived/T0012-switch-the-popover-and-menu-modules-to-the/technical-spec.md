# T0012 Technical Specification
Switch the popover and menu modules to the native popover attribute, keeping the anchoring code.

---

## Approach
- New tests cover light dismiss, `popovertarget` without JavaScript, and top layer rendering over sticky bars.
- This is a behavior change, released as a minor version.

---

## Declared Files
- `src/js/popover.js`
- `src/js/menu.js`
- `src/css/components/popover.css`
- `src/css/components/menu.css`
- `tests/unit/popover.test.js`
- `tests/unit/menu.test.js`
- `tests/e2e/menu.spec.js`
- `tests/e2e/popover.spec.js`
- `docs/specs/visual-style-guide.md`
- `CHANGELOG.md`

Size estimate: 10 files, 350 lines
Size note: Menus build on popovers, so both move to the attribute in one change.

### Tests
- Unit: `popover.test.js` checks that panels use the `popover` attribute and still receive anchor positions.
- Integration: `menu.spec.js` and `popover.spec.js` checks light dismiss and that open panels render above the sticky bars.

Completion check: `npx playwright test tests/e2e/menu.spec.js tests/e2e/popover.spec.js`, exit code 0
