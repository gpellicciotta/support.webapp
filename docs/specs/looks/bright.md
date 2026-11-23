# Bright look
Bright combines sea-tinted surfaces, Lexend typography, rounded controls, and blue, yellow, or red action accents.

## Provenance
See [ADR-0002](../../adrs/ADR-0002-looks.md) for the look's origins and contrast adjustments.
First-party contributions use the MIT license, copyright 2026 Giovanni Pellicciotta.
The imported check, close, help, and settings drawings originate in Feather Icons, by Cole Bemis.
Feather uses MIT, copyright 2013-2023 Cole Bemis; its complete notice ships as [LICENSE.txt](../../../src/looks/bright/LICENSE.txt).
The [upstream license](https://raw.githubusercontent.com/feathericons/feather/master/LICENSE) supplies the retained copyright and permission notice.
Supplementary glyphs use the neutral sprite's MIT drawings, including alert, more, and chevron-down.
Lexend ships as self-hosted variable font files under the SIL OFL license, kept in its [OFL.txt](../../../src/looks/bright/fonts/lexend/OFL.txt).
Fontsource 5.3.0 supplied the Latin and Latin Extended `wght` subsets; Lexend has no italic, so browsers synthesize oblique text.

## Usage
Import [index.css](../../../src/looks/bright/index.css) from the app stylesheet.
Pass [icons.svg](../../../src/looks/bright/icons.svg) to `setSpriteUrl`.
Set `data-accent="blue"`, `data-accent="yellow"`, or `data-accent="red"` on the root or a specimen wrapper.
Omitting the accent selects blue; switching accents redefines semantic action tokens only.
Use `data-theme="light"` or `data-theme="dark"`; omitting the theme follows the operating system.
Browsers without `light-dark()` receive explicit light values for every accent.
The look loads its fonts by relative URLs only, so apps that precache the vendored look files work offline.
The [gallery](../../../src/demo/visual-style-gallery.html#accents) shows default, hover, and active specimens for each accent.

## Palette
**[Decided]** The user chose the Ocean and raspberry variant and Lexend from five rendered candidates on 2026-11-23.
Each new value re-hues the earlier primitive at the same WCAG luminance, so every contrast ratio below still holds.
- Slate: sea-tinted steps from `#f8fafc` and `#f4f7f9` to `#05222e` and `#011a26`.
- Blue: cerulean `#006796` in light and `#00adf6` in dark; hover and active step darker in light and lighter in dark.
- Red: raspberry `#db2157` and `#b71747` in light and `#f77086` in dark.
- Green, yellow, ink, shadows, scrims, and radii are unchanged.

## Contrast decisions
**[Decided]** Yellow uses dark `#111827` labels in both themes.
Light yellow changes from `#ca8a04` to `#b88000`, meeting icon contrast against the shared grounds.
Dark yellow retains `#d97706`; hover and active retain the same fill to preserve label contrast.
Focus outlines and link text keep their separate blue roles across accents.
Dark blue uses the lighter `#00adf6`, and dark red uses the lighter `#f77086`, instead of the light fills.
These lighter dark-theme fills use dark labels and remain visible as pressed icons.
Light blue and red use darker hover colors to distinguish interaction from the default fill.
Light blue and red use identical hover and active fills to maintain contrast across both states.
Primary fills require 4.5:1 label contrast; primary icons and borders require 3:1 against their grounds.
Use link tokens for text, since primary is an action fill and icon role.
The package provides no exception to label contrast requirements; application-specific exceptions require explicit documentation.

## Contract mappings
Background, surface, and sunken surface distinguish the page, cards, and subtle inset areas.
Hover, active, and selected grounds use subtle surfaces, preserving text and icon contrast.
Muted text and strong borders use adjusted slate values for AA contrast on shared grounds.
Control and button radii use 10px, chips use 4px, and dialogs use 16px.
Body and heading fonts use Lexend with the system stack as fallback; icon strokes use a 2.2-unit width.
Other required type, elevation, focus, and feedback roles extend the shared neutral mappings.
Optional task statuses remain undefined; charts and domain-specific categories belong in application code.
Shared spacing, motion, layers, and layout widths come from [base.css](../../../src/css/base.css).
