# T0032 Technical Specification
Add the progress bar and spinner components, static under reduced motion

---

## Approach
- Reference: [Empty States, Loading, Progress, and Skeletons](../../../docs/analysis/ui-design-comparison.md#empty-states-loading-progress-and-skeletons).
- The progress bar uses the native `progress` element; the spinner is decorative beside a status text.

---

## Declared Files
- `src/css/components/progress.css`
- `src/css/components/spinner.css`
- `src/css/style.css`
- `src/demo/visual-style-gallery.html`
- `tests/e2e/progress.spec.js`
- `tests/e2e/spinner.spec.js`
- `docs/specs/visual-style-guide.md`
- `CHANGELOG.md`

Size estimate: 8 files, 300 lines

### Tests
- Unit test: none (CSS-only components; the static token test covers their tokens)
- Integration: `progress.spec.js` and `spinner.spec.js` check values, labels, and no animation under reduced motion.

Completion check: `npx playwright test tests/e2e/progress.spec.js tests/e2e/spinner.spec.js`, exit code 0
