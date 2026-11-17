## Technical Specifications

### Decisions
- **[Decided]** Link buttons take `padding: 0 var(--space-2)`; the 44 px minimum target stays.
- **[Decided]** Badges use `--text-xs`, `calc(var(--space-1) / 2)` block padding, and `max(var(--radius-chip), var(--radius-control))` corners.
  A new `--radius-badge` token was rejected, because every look would need a value for one component.
- **[Decided]** Switch tracks are `calc(var(--space-5) + 2 * var(--border-width))` tall, 22 px instead of 24 px.
  Their radius is `calc(var(--radius-control) + var(--border-width))`; the thumb radius stays concentric.
- **[Decided]** Segmented options sit `--space-2` apart and use `--focus-glow-inset`, so outlines and glows never meet.
  The checked and focused option shows the inset glow; ground and weight still mark it as checked.
- **[Decided]** Tabs round only their top corners and carry a `--border-width-strong` bottom border.
  The selected border takes `--color-primary`; the list drops its bottom padding, so the bar sits on the divider.
  Tabs use `--focus-glow-inset`, because the scrolling list clips outer shadows.
  Forced colors paint transparent borders, so unselected bars take `Canvas` and the selected bar `Highlight`.

### Declared Files
- src/css/components/link-button.css
- src/css/components/badge.css
- src/css/components/switch.css
- src/css/components/segmented.css
- src/css/components/tabs.css
- tests/e2e/link-button.spec.js
- tests/e2e/badge.spec.js
- tests/e2e/switch.spec.js
- tests/e2e/segmented.spec.js
- tests/e2e/tabs.spec.js
- tests/unit/switch.test.js
- docs/specs/visual-style-guide.md
- tests/e2e/small-controls.spec.js (added, uncounted: opt-in evidence screenshots)

Size estimate: 12 files, 170 lines
Size note: 12 counted files exceed the typical line, because each component pairs one stylesheet with its spec; measured lines stay near 205.
Combined task: the user requested the five component tweaks together after one gallery review; each is a few lines.

### Tests
- Unit: `tests/unit/switch.test.js` checks the low track height, the rounder track radius, and the concentric thumb radius.
- Integration: Playwright specs for link button, badge, switch, segmented, and tabs check computed styles in every look and project.

Completion check: `python scripts/devops.py check`
