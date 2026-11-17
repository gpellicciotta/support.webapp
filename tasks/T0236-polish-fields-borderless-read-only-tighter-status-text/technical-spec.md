## Technical Specifications

### Declared Files
- src/css/components/field.css
- src/css/components/field-group.css
- src/demo/visual-style-gallery.html
- tests/e2e/field.spec.js
- docs/specs/visual-style-guide.md

Added: tests/e2e/field-polish.spec.js.

### Tests
- Unit: none (the change is CSS and gallery markup; the existing tokens.test.js checks private token names).
- Integration: tests/e2e/field-polish.spec.js drives the gallery in all four projects.
  - Read-only controls show transparent borders, also on hover, and the focus border on focus.
  - Valid, invalid, and pending message lines sit at most `--space-1` below the control.
  - Hint, status, and error text start, and counter text ends, at the control's text edge.
  - Field group items start `--space-4` after the legend.
  - The select chevron's ink sits within 1.5 px of the collapsible chevron's inset, in both directions.
  - The Select section shows default, hover, focus, hint, invalid, valid, and disabled selects.

Completion check: `python scripts/devops.py check`

Size estimate: 5 files, 160 lines

Added files and CHANGELOG.md are excluded from counted files and lines, per the sizing rules.
