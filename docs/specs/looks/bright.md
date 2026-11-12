# Bright look
Bright combines meteo's cool surfaces, system typography, rounded controls, and blue, yellow, or red action accents.

## Provenance
Extracted meteo commit `8937c32fca32a82acc6a15b08901f354284cd14b`.
Palette and shapes originate in its `css/style.css`; glyphs originate in `js/icons.js`.
The source carries the MIT license, copyright 2026 Giovanni Pellicciotta.
The imported check, close, help, and settings drawings originate in Feather Icons, by Cole Bemis.
Feather uses MIT, copyright 2013-2023 Cole Bemis; its complete notice ships as [LICENSE.txt](../../../src/looks/bright/LICENSE.txt).
The [upstream license](https://raw.githubusercontent.com/feathericons/feather/master/LICENSE) supplies the retained copyright and permission notice.
Missing source glyphs retain the neutral sprite's MIT drawings, including alert, more, and chevron-down.
System fonts require no font downloads or bundled font licenses.

## Usage
Import [index.css](../../../src/looks/bright/index.css) from the app stylesheet.
Pass [icons.svg](../../../src/looks/bright/icons.svg) to `setSpriteUrl`.
Set `data-accent="blue"`, `data-accent="yellow"`, or `data-accent="red"` on the root or a specimen wrapper.
Omitting the accent selects blue; switching accents redefines semantic action tokens only.
Use `data-theme="light"` or `data-theme="dark"`; omitting the theme follows the operating system.
Browsers without `light-dark()` receive explicit light values for every accent.
The [gallery](../../../src/demo/visual-style-gallery.html#accents) shows default, hover, and active specimens for each accent.

## Contrast decisions
**[Decided]** Yellow uses dark `#111827` labels in both themes.
Light yellow changes from `#ca8a04` to `#b88000`, meeting icon contrast against the shared grounds.
Dark yellow retains `#d97706`; hover and active retain the same fill to preserve label contrast.
Focus outlines and link text keep their separate blue roles across accents.
Dark blue changes from `#2563eb` to `#60a5fa`, and dark red changes from `#dc2626` to `#f87171`.
These lighter dark-theme fills use dark labels and remain visible as pressed icons.
Light blue and red retain source action colors; their hover colors remain darker.
Light blue and red use identical hover and active fills, preserving source hover colors across both shared states.
Primary fills require 4.5:1 label contrast; primary icons and borders require 3:1 against their grounds.
Use link tokens for text, since primary is an action fill and icon role.
Meteo's later adoption may override yellow labels to white as ADR-0002 permits; this package includes no exception.

## Contract mappings
Ground, card, and subtle-card source roles map to background, surface, and sunken surface.
Hover, active, and selected grounds use subtle surfaces, preserving text and icon contrast.
Muted text and strong borders use adjusted slate values for AA contrast on shared grounds.
Control and button radii use 10px, chips use 4px, and dialogs use 16px.
Body and heading fonts use the source system stack; icon strokes preserve its 2.2-unit width.
Other required type, elevation, focus, and feedback roles extend the shared neutral mappings.
Optional task statuses remain undefined; weather charts and app-specific categories remain in meteo.
Shared spacing, motion, layers, and layout widths come from [base.css](../../../src/css/base.css).
