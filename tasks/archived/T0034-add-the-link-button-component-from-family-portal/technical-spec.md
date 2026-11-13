# T0034 Technical Specification
Add the link button component from family-portal, with its gallery section and browser spec.

---

## Approach
- Reference: [Buttons](../../../../docs/analysis/ui-design-comparison.md#buttons), family-portal `.link-button`.
- Skeleton: the `link-button` entry of [components.md](../../../../docs/specs/components.md#link-button).
- Use semantic tokens only: `--color-link`, `--color-link-hover`, and the global focus ring.

---

## Declared Files
- `src/css/components/link-button.css`
- `src/css/style.css`
- `src/demo/visual-style-gallery.html`
- `tests/e2e/link-button.spec.js`
- `tests/unit/tokens.test.js`
- `docs/specs/components.md`
- `docs/specs/visual-style-guide.md`
- `CHANGELOG.md`

Size estimate: 8 files, 200 lines

### Tests
- Unit test: none (a CSS-only component; the component partial test in tokens.test.js covers its tokens)
- Integration: `tests/e2e/link-button.spec.js` checks states, the 44 px target, and the focus ring.

Completion check: `npx playwright test tests/e2e/link-button.spec.js tests/e2e/verify-ui.spec.js`, exit code 0
