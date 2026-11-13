# Warm look
Warm combines navy and ivory, saffron and brick, Outfit headings, DM Sans body text, and pill buttons.

## Provenance
See [ADR-0002](../../adrs/ADR-0002-looks.md) for the look's origins and seasonal variant decisions.
First-party drawings use the MIT license, copyright 2026 Giovanni Pellicciotta.
Bundled font files retain their accompanying SIL OFL licenses.
Fontsource 5.3.0 supplied those variable fonts, including Latin, Latin Extended, and DM Sans italic subsets.

## Usage
Import [index.css](../../../src/looks/warm/index.css) from the app stylesheet.
Pass the [icons.svg](../../../src/looks/warm/icons.svg) URL to `setSpriteUrl`.
Set `data-theme="light"` or `data-theme="dark"`; omit the attribute for the operating system preference.
Browsers without `light-dark()` receive light values, including seasonal accents.

### Seasons
Set `data-accent` to `spring`, `summer`, `autumn`, or `winter` on the root or a specimen wrapper.
`--color-accent` supplies the seasonal decoration; `--color-accent-bg` supplies its background wash.
Both default to transparent when no season is selected.
Saffron action colors remain independent, so seasonal decoration does not change control meaning.
Use seasons decoratively, never as text colors or the sole indication of meaning.
The [gallery](../../../src/demo/visual-style-gallery.html#seasons) demonstrates every season and offers a root season switch.

### Glyphs
The sprite uses the contract's standard 24-unit viewBox, including for `icon-person`.
Aliases map shared icon names to equivalent drawings; the sprite header records each mapping.
Missing core and gallery glyphs reuse the first-party neutral sprite's MIT drawings.
The sprite header lists every supplement explicitly; the circled check remains distinct from neutral's check.
Keep custom 20-unit header glyphs app-local; the shared sprite follows the 24-unit contract.

## Contract additions
**[Decided]** Semantic roles map to the warm palette or shared defaults, keeping components independent of private primitives.
- Surface hover, selected, and active alias `--color-surface-sunken`.
- Primary active aliases primary hover.
- Danger hover uses brick-750 and brick-200; danger active uses brick-800 and brick-100.
- On-danger, on-success, and on-warning use white in light and navy-950 in dark.
- Soft and strong shadow colors are optional contract roles for different elevation strengths.
- Backdrop uses navy at 40% and black at 65% opacity for light and dark themes respectively.
- Control, button, chip, card, and dialog radii map to md, pill, pill, lg, and xl respectively.
- Icon stroke is 2; large icons use the shared 2.5rem size.
- Relaxed leading aliases normal leading; normal tracking uses zero.
- Focus offsets use the shared 2px and -2px defaults.
- Focus ring uses a 3px width with the shared outline syntax.

The outline remains visible in forced colors mode, where box shadows disappear.
Selected surfaces use the sunken ground so strong borders meet non-text contrast requirements.
Shared spacing, motion, widths, and layer values come from [base.css](../../../src/css/base.css).
Keep app-specific brand colors, season imagery, avatar dimensions, and editor dimensions in application stylesheets.

## New looks
Copy [_template](../../../src/looks/_template/README.md) for a complete neutral-based starting point.
Use warm as the example for multiple fonts, seasonal variants, and alternative shape mappings.
Run static contract checks and the browser verifier before shipping a new look.
