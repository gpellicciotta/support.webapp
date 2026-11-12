# Warm look
Warm combines navy and ivory, saffron and brick, Outfit headings, DM Sans body text, and pill buttons.

## Provenance
Extracted family-portal commit `1953f75484a2fe65aa3444730b3a9f459ae21cb4`.
Palette, typography, shapes, and elevations come from its `webapp/css/tokens.css`.
Its first-party code uses the MIT license, copyright 2026 Giovanni Pellicciotta.
No third-party icon attribution appears in its source or style guide.
The font files and accompanying SIL OFL licenses are unchanged copies from its `webapp/fonts/` directory.
Fontsource 5.3.0 supplied those variable fonts, including Latin, Latin Extended, and DM Sans italic subsets.

## Usage
Import [index.css](../../../src/looks/warm/index.css) from the app stylesheet.
Pass the [icons.svg](../../../src/looks/warm/icons.svg) URL to `setSpriteUrl`.
Set `data-theme="light"` or `data-theme="dark"`; omit the attribute for the operating system preference.
Browsers without `light-dark()` receive light values, including seasonal accents.

### Seasons
Set `data-accent` to `spring`, `summer`, `autumn`, or `winter` on the root or a specimen wrapper.
These replace the source's `data-season` hook without changing its seasonal values.
`--color-accent` maps the source's `--color-season-accent`; `--color-accent-bg` maps `--color-season-wash`.
Both default to transparent, preserving the source's neutral seasonal state.
The source's separate saffron action accent stays outside these seasonal roles.
Use seasons decoratively, never as text colors or the sole indication of meaning.
The [gallery](../../../src/demo/visual-style-gallery.html#seasons) demonstrates every season and offers a root season switch.

### Glyphs
The sprite extracts the gallery's glyphs and the survey form's close glyph.
Source glyph geometry stays unchanged, except `icon-person` uses the contract's standard 24-unit viewBox.
Aliases map tasks to todos, lists to list-bullets, bin to trash, user and people to account, and note to page.
Missing core and gallery glyphs reuse the first-party neutral sprite's MIT drawings.
The sprite header lists every supplement explicitly; the circled source check remains distinct from neutral's check.
Header-specific 20-unit account and help glyphs remain app-local; the shared sprite follows the 24-unit contract.

## Contract additions
**[Decided]** Existing source values stay unchanged where the contract provides an equivalent role.
New mappings use source primitives or shared defaults; no palette hue was added.
- Surface hover, selected, and active alias `--color-surface-sunken`.
- Primary active aliases primary hover.
- Danger hover uses brick-750 and brick-200; danger active uses brick-800 and brick-100.
- On-danger, on-success, and on-warning use white in light and navy-950 in dark.
- Shadow soft and strong preserve source shadow-color-soft and shadow-color-strong as optional contract roles.
- Shadow maps source shadow-color; backdrop uses navy at 40% and black at 65% opacity.
- Control, button, chip, card, and dialog radii map to md, pill, pill, lg, and xl respectively.
- Icon stroke is 2, matching source standard icons; large icons use the shared 2.5rem size.
- Relaxed leading aliases normal leading; normal tracking uses zero.
- Focus offsets use the shared 2px and -2px defaults.
- Focus ring preserves the source 3px width with the shared outline syntax.

The outline replaces the source box-shadow ring deliberately, as required by the shared component contract.
Selected surfaces use the sunken ground so the source border-strong meets non-text contrast requirements.
Shared spacing, motion, widths, and layer values come from [base.css](../../../src/css/base.css).
App-specific brand colors, season imagery, avatar dimensions, and editor dimensions remain in family-portal.

## New looks
Copy [_template](../../../src/looks/_template/README.md) for a complete neutral-based starting point.
Use warm as the example for multiple fonts, seasonal variants, and alternative shape mappings.
Run static contract checks and the browser verifier before shipping a new look.
