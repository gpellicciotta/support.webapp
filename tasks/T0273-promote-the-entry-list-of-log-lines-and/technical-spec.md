## Technical Specifications
### Source
Auth's Admin Console (`../auth`, commit `ef04ac9`) holds the app-local version:
- CSS: `webapp/admin/css/admin.css`, section "Entry list".
- Markup builders: `entryList`, `entryCard`, `timeChip`, and `textChip` in `webapp/admin/js/ui.mjs`.
- Spec: `docs/specs/admin-spec.md`, sections Components, System Events, and Logs.

### Component Contract
Key `entry-list`, CSS only, no JavaScript module:
- `ul.entry-list` with `role="list"` and an `aria-label`: a grid of cards with a `--space-2` gap.
- `li.entry-list__item`: a card with border, card radius, surface ground, and `--space-3` by `--space-4` padding.
- `.entry-list__message`: small text that keeps line breaks and wraps anywhere.
- `.entry-list__message--code`: monospace message for log lines.
- `.entry-list__meta`: a wrapping chip row with a `--space-2` gap; the first chip shows the time with the clock icon.
- `.entry-list__code`: a monospace chip that may wrap, for identifiers and logger names.
- `.entry-list__action`: an optional icon button pushed to the end of the chip row.
- Hover gives the card the hover ground; its chips and any nested sunken block rise to the surface.
- Expanded details, such as JSON metadata, follow the chip row inside the card.

### Declared Files
- src/contract.json
- src/css/style.css
- src/demo/visual-style-gallery.html
- docs/specs/components.md
- docs/specs/visual-style-guide.md
- docs/adrs/ADR-0003-components-and-patterns.md

Added files, not counted: `src/css/components/entry-list.css`, `tests/unit/entry-list.test.js`, and `tests/e2e/entry-list.spec.js`.

Size estimate: 6 files, 160 lines

### Tests
- Unit: `tests/unit/entry-list.test.js` checks the contract key, style import, token-only CSS rules, and the gallery markup.
- Integration: `tests/e2e/entry-list.spec.js` renders the gallery section per look and checks layout, hover, wrapping, and overflow.

Completion check: `python scripts/devops.py check`
