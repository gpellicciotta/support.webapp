# T0029 Technical Specification
Add the badge component for non-interactive counts and status labels, based on meteo's badges

---

## Approach
- Reference: meteo's non-interactive badges, as the comparison describes under chips and toggles.
- A badge is never focusable; an interactive label is a chip.

---

## Declared Files
- `src/css/components/badge.css`
- `src/css/style.css`
- `src/demo/visual-style-gallery.html`
- `tests/e2e/badge.spec.js`
- `docs/specs/visual-style-guide.md`
- `CHANGELOG.md`

Size estimate: 6 files, 200 lines

### Tests
- Unit test: none (a CSS-only component; the static token test covers its contrast pairs)
- Integration: `badge.spec.js` checks contrast of every tone in both themes and that badges are not focusable.

Completion check: `npx playwright test tests/e2e/badge.spec.js`, exit code 0
