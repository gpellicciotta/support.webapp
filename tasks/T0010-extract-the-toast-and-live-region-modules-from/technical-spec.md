# T0010 Technical Specification
Extract the toast and live region modules from todos.webapp, including Undo and modal holding.

---

## Approach
- Reference: [Toasts, Banners, System Notifications, and Inbox](../../../docs/analysis/ui-design-comparison.md#toasts-banners-system-notifications-and-inbox).
- The toast region sits in the shell's overlay layer; the gallery hosts it in a demo frame.

---

## Declared Files
- `src/css/components/toast.css`
- `src/js/toast.js`
- `src/js/live-region.js`
- `src/css/style.css`
- `src/demo/visual-style-gallery.html`
- `tests/unit/toast.test.js`
- `tests/unit/live-region.test.js`
- `tests/e2e/toast.spec.js`
- `docs/specs/visual-style-guide.md`
- `CHANGELOG.md`

Size estimate: 10 files, 700 lines
Size note: Toasts announce through the live region, so both modules ship and test together.

### Tests
- Unit: `toast.test.js` and `live-region.test.js` check Undo, timeouts, Ctrl+Z, modal holding, and announcements.
- Integration: `toast.spec.js` raises gallery toasts at 390 and 1440 px and checks Undo by pointer and keyboard.

Completion check: `npx playwright test tests/e2e/toast.spec.js`, exit code 0
