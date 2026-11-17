## Technical Specifications

### Declared Files
- src/css/components/banner.css
- src/css/components/row.css
- src/css/components/card.css
- src/css/components/error-summary.css
- src/demo/visual-style-gallery.html
- tests/unit/card.test.js
- docs/specs/visual-style-guide.md
- docs/specs/components.md

### Tests
- Unit: `tests/unit/card.test.js` requires the `.card__actions` part in `card.css`.
- Integration: `tests/e2e/button-alignment.spec.js` measures banners, rows, forms, cards, and the error summary in four projects.

Completion check: `python scripts/devops.py check`
