# T0027 Technical Specification
Add the theme switch and service worker update modules, and document the shared patterns.

---

## Approach
- Reference: [Theme Switching and Variants](../../../docs/analysis/ui-design-comparison.md#theme-switching-and-variants) and [Service Worker and Install](../../../docs/analysis/ui-design-comparison.md#splash-offline-error-pages-service-worker-and-install).
- The storage key takes the app name as a prefix, so apps on one origin never share a choice.
- The gallery theme switch moves onto `theme.js`, so the module has a real consumer.

---

## Declared Files
- `src/js/theme.js`
- `src/js/sw-update.js`
- `src/demo/gallery.js`
- `tests/unit/theme.test.js`
- `tests/unit/sw-update.test.js`
- `tests/e2e/theme.spec.js`
- `docs/specs/visual-style-guide.md`
- `CHANGELOG.md`

Size estimate: 8 files, 450 lines
Size note: Two small modules plus pattern documentation; the documentation carries no code to split off.

### Tests
- Unit: `theme.test.js` and `sw-update.test.js` check stored choices, the System default, and the reload on request.
- Integration: `theme.spec.js` switches the gallery theme, reloads, and checks the stored choice at 390 and 1440 px.

Completion check: `npx playwright test tests/e2e/theme.spec.js`, exit code 0
