# ADR-0002: Looks
Defines what a look contains, how apps select one, how new looks get added, and which come first.

- Status: Proposed, awaiting approval in the review of the planning task.
- Date: 2026-11-11.
- Decided with the user on 2026-11-11: meteo gets its own third look.

---

## Context
- The system must support several looks and gain new ones over time (DS-4).
- todos.webapp has a monochrome look: gray grounds, one navy signal color, Inter, and 8 px control radii.
- family-portal has a warmer look: navy and ivory, saffron and brick accents, Outfit and DM Sans, and pill buttons.
- meteo uses the system font stack and lets users pick a blue, yellow, or red accent.
- family-portal redefines two accent tokens per season through a `data-season` attribute.
- All three draw 24-unit stroke icons in `currentColor`, but each with its own glyphs.

---

## Decision
A look is one folder, `src/looks/{look}/`:
- `primitives.css`: palette hues, font stacks, and the radius scale, private to the look.
- `look.css`: maps every look-owned contract token of [ADR-0001](ADR-0001-layer-model-and-token-contract.md) to primitives, in both themes.
- `fonts.css` and `fonts/`: self-hosted woff2 files with `font-display: swap`, plus their license file.
  A system font look needs neither.
- `icons.svg`: the look's sprite, which provides every id of the core icon set.
- `index.css`: the look's entry point, importing the look-neutral `style.css`, then the look's own files.

Variants:
- A look may define variant attributes on the root element.
- A variant redefines only semantic tokens of that look, never component styles.
- family-portal keeps `data-season`; meteo gets `data-accent` with `blue`, `yellow`, and `red`.

Selection:
- An app imports exactly one look entry from its own `style.css`.
- No runtime look switch exists in apps; the gallery swaps the look stylesheet link instead.

Core icon set:
- Components name their icons by id, such as `icon-close`, `icon-more`, `icon-check`, and `icon-undo`.
- The icon extraction task fixes the core id list from the shared components' needs.
- A look may add glyphs beyond the core set; apps may add local glyphs in their own sprite.

Adding a look:
- Copy `src/looks/_template/`, fill in primitives and mapping, and add a page under `docs/specs/looks/`.
- The token test skips folders whose name starts with `_`.
- Add the look to the gallery switcher.
- The static token test must pass in both themes: every contract token defined, every contrast pair at WCAG 2.2 AA.
- A new look ships in a minor release.

First looks, in roadmap order:
- `todos`, extracted from todos.webapp in phase 1.
- `family-portal`, extracted in phase 2, with its seasons as a variant.
- `meteo`, created in phase 4, with its accents as a variant and the system font stack.

---

## Options Considered
Look selection:
- One imported look per app, chosen: each app ships only its own palette and fonts.
- All looks scoped by a `data-look` attribute: runtime switching nobody needs, and every app carries every font.
- One package per look: looks and components could drift apart in version.

meteo's look:
- Its own third look, chosen: meteo keeps its identity, and the third look proves that adding a look works.
- The todos look with an accent variant: least work, but meteo loses its look.
- Deciding at meteo's phase: keeps the last phase of the roadmap vague.

Icons:
- One sprite per look with a shared core id set, chosen: components stay look-neutral while glyphs differ.
- One shared glyph set: both adopters would have to accept one drawing style.

---

## Consequences
- Every look multiplies the test matrix: looks, themes, and widths.
- meteo's yellow accent fails AA with white text, at 2.94:1.
  The meteo look must pair it with dark text, which reverses meteo's recorded decision to keep white.
  This reversal needs the user's confirmation in review.
  The contrast of white on the blue and red accents is not computed yet.
- The look template and the token test make a new look a checklist task, not a design system change.
- Seasons and accents stay look features; a look without variants defines none.

---

## Evidence
- Palettes, fonts, and contrast: [Colors, Contrast, and Color Meaning](../analysis/ui-design-comparison.md#colors-contrast-and-color-meaning) and [Typography](../analysis/ui-design-comparison.md#typography).
- Glyph systems: [Icons](../analysis/ui-design-comparison.md#icons).
- Seasons and accents: [Theme Switching and Variants](../analysis/ui-design-comparison.md#theme-switching-and-variants).
- Sibling facts are `[V:C]`: first-party code read at the commits pinned in the comparison.
- Research context: written by Claude Opus 5.5 on 2026-11-11, knowledge cutoff June 2026, with web access to HTML pages.
