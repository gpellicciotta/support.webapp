# UI Design Comparison
How todos.webapp, family-portal, meteo, auth, and counters implement their UI design, from tokens to app shells.
This comparison is the evidence base for the design system plan of T0002.

---

## Summary of Findings
- Three design system generations coexist:
  - The support.js lineage serves auth and counters.
    It uses ordinal color roles, Roboto from Google Fonts, Font Awesome, and components without ARIA.
  - meteo runs a single-tier token sheet copied from a quiz app, with no gallery or style guide.
  - family-portal (October 2026) and todos.webapp (November 2026) share one architecture with two different looks.
- family-portal and todos.webapp agree on the mechanics:
  - Two token tiers and `light-dark()` themes with an `@supports` fallback.
  - A `data-theme` override, BEM classes, and self-hosted variable fonts.
  - 24-unit stroke icons in `currentColor`, plus a gallery, a style guide, and automated contrast checks.
- They differ in the look: palette, fonts, radius values, density, and button shape.
- Exact token name overlap is high only between these two: 53 names, 49 of them semantic on both sides.
  Their motion tokens and space steps 1 to 7 hold identical values.
  Their radius names hold values shifted by one step.
- meteo shares 7 names with todos.webapp and 12 with family-portal; support.js shares at most 6 with either.
- Behavior modules are the best sharing candidates.
  todos.webapp has small, tested APIs for dialog, menu, popover, toast, and live region; no sibling has equals.
- family-portal leads on server-rendered shell parts, avatars, decorative tones, seasons, and a browser-based UI verifier.
  meteo leads on data visualization and attribute-based internationalization.
  counters leads on a switch control, button archetypes, and visual regression tooling.
- Gaps shared by the new systems: no loading or skeleton pattern, no tooltip component, no native `popover` use.
  Both lack multi-select.
- Every app breaks some of its own rules, from raw `z-index` values to unused tokens.
  meteo and the support.js lineage also lack reduced-motion handling and consistent focus rings.
- Two of six known facts needed correction; see [Known Facts Checked](#known-facts-checked).
- Main recommendation for T0002: share token names, tiers, theming, and behavior modules as a contract.
  Keep palette, fonts, and radius values per look, and keep each app shell local or shell-specific.

---

## Scope, Sources, and Method
All sibling repositories were read at the commits below and left unchanged.
Line numbers in links refer to these commits.

| App             | Commit    | Web root  | Stylesheet entry point                                                  | Gallery                                                                                       | Style guide                                                                        | Depth     |
| :-------------- | :-------- | :-------- | :---------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------- | :-------- |
| todos.webapp    | `dac760b` | `src/`    | [style.css](../../../todos.webapp/src/css/style.css#L10-L16)            | [visual-style-gallery.html](../../../todos.webapp/src/demo/visual-style-gallery.html)         | [visual-style-guide.md](../../../todos.webapp/docs/specs/visual-style-guide.md)    | full      |
| family-portal   | `1953f75` | `webapp/` | [style.css](../../../family-portal/webapp/css/style.css#L13-L15)        | [visual-style-gallery.html](../../../family-portal/webapp/demo/visual-style-gallery.html)     | [visual-style-guide.md](../../../family-portal/docs/specs/visual-style-guide.md)   | full      |
| meteo           | `8937c32` | root      | [style.css](../../../meteo/css/style.css)                               | absent                                                                                        | absent                                                                             | full      |
| support.js      | `7738fab` | none      | none; partials import `style.css` each                                  | absent                                                                                        | [visual-style-guide.md](../../../support.js/docs/specs/visual-style-guide.md)      | tokens    |
| auth            | `ef0c67f` | `webapp/` | [auth.css](../../../auth/webapp/css/auth.css#L4-L37)                    | absent; 16 demo harnesses                                                                     | absent; defers to support.js                                                       | reference |
| counters.server | `cf13d8b` | `webapp/` | [counters.css](../../../counters.server/webapp/css/counters.css#L4-L41) | [design-system-gallery.html](../../../counters.server/webapp/demo/design-system-gallery.html) | [visual-style-guide.md](../../../counters.server/docs/specs/visual-style-guide.md) | reference |

Method:
- Token counts come from a regex over `--name:` declarations, first definition per name.
  Tiers follow each file's own tier comments; support.js tiers follow its file split.
- Overlap counts compare exact names; the crosswalk below maps names by role.
- Contrast ratios quoted from apps come from their tests; ratios marked computed use the WCAG 2.x formula.
- Screenshots use Playwright Chromium at 390 by 844 and 1440 by 900 px, light and dark, with reduced motion.
  See [Screenshots](#screenshots) for the serving method and the recorded errors.

---

## Known Facts Checked
| Fact from the design conversation                                                 | Verdict                  | Evidence                                                                                                                                                                                          |
| :-------------------------------------------------------------------------------- | :----------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| todos.webapp and family-portal decided to own a design system for look reasons    | Confirmed                | [todos guide](../../../todos.webapp/docs/specs/visual-style-guide.md#L33-L34), [family-portal guide](../../../family-portal/docs/specs/visual-style-guide.md#L60-L61)                             |
| 45 of the 71 semantic todos.webapp names exist in family-portal                   | Not reproduced           | todos.webapp has 83 semantic names in [tokens.css](../../../todos.webapp/src/css/tokens.css#L63-L173); 49 exist in family-portal. The 71 names without typography share 37.                       |
| meteo shares 7 names with todos.webapp and has no gallery or style guide          | Confirmed                | Shared: `--color-bg`, `--color-border`, `--color-text`, and `--radius-sm`, `-md`, `-lg`, `-round`; `index.html` is meteo's only HTML file.                                                        |
| auth and counters hold forked `support.js/css` copies; all 17 shared files differ | Partly wrong             | auth holds 17 copies, 3 identical after line-ending normalization. counters holds 15 differing copies and imports 4 from support.js.                                                              |
| auth and counters load Roboto from Google Fonts and icons from a Font Awesome kit | Confirmed for app shells | [auth index.html](../../../auth/webapp/index.html#L23-L32), [counters index.html](../../../counters.server/webapp/index.html#L23-L41); most demo pages load Font Awesome free from cdnjs instead. |
| todos.webapp uses an SVG sprite; family-portal uses inline stroke SVG icons       | Confirmed, with a nuance | todos.webapp: one [icons.svg](../../../todos.webapp/src/img/icons.svg) file. family-portal: a `<symbol>` block pasted into each template, used through `<use href="#icon-…">`.                    |

Notes on the corrections:
- The fork direction is reversed: support.js extracted these stylesheets from auth and counters in v1.0.0 ([CHANGELOG.md](../../../support.js/CHANGELOG.md#L53)).
  Most small diffs are support.js normalization the forks never took back.
- support.js uses CRLF line endings in its working tree and the forks use LF, so byte comparison flags every file.
- The 45-of-71 measurement method is unknown; no tier split or history state of [tokens.css](../../../todos.webapp/src/css/tokens.css) reproduces it.

---

## Low Level: Tokens and Foundations

### Token Tiers and Theming
| App             | Primitive | Semantic | Other                            | Theming mechanism                                                       | No-JS theme    |
| :-------------- | --------: | -------: | :------------------------------- | :---------------------------------------------------------------------- | :------------- |
| todos.webapp    | 37        | 83       | 2 component-local                | `light-dark()` plus `color-scheme`; `data-theme` sets `color-scheme`    | follows the OS |
| family-portal   | 64        | 124      | 1 component-local                | same as todos.webapp, plus `data-season` accents                        | follows the OS |
| meteo           | 0         | 63       | none                             | `data-theme` and `data-theme-color`, set by a pre-paint script          | light only     |
| support.js      | 42        | 35       | 41 component, 5 alias            | `prefers-color-scheme` media query plus `data-theme`, values duplicated | follows the OS |
| auth            | 42        | 53       | 45 component, 7 alias            | as support.js, plus a stored preference applied before paint            | follows the OS |
| counters.server | 42        | 46       | 82 component, 5 alias, 179 local | as support.js, plus `body.dark-theme` classes                           | follows the OS |

- todos.webapp: tiers are declared in [tokens.css](../../../todos.webapp/src/css/tokens.css#L4-L5).
  Colors use `light-dark()` ([tokens.css](../../../todos.webapp/src/css/tokens.css#L64-L101)); `data-theme` only switches `color-scheme` ([tokens.css](../../../todos.webapp/src/css/tokens.css#L176-L182)).
  An `@supports` block pins light values in older browsers ([tokens.css](../../../todos.webapp/src/css/tokens.css#L194-L222)).
- family-portal: the same model in [tokens.css](../../../family-portal/webapp/css/tokens.css#L107-L117), fallback at [tokens.css](../../../family-portal/webapp/css/tokens.css#L302-L351).
  `data-season` redefines two accent tokens ([tokens.css](../../../family-portal/webapp/css/tokens.css#L281-L299)).
- meteo: one tier with raw hex in role tokens ([style.css](../../../meteo/css/style.css#L9-L87)).
  Accent and dark blocks cover six combinations ([style.css](../../../meteo/css/style.css#L91-L206)), resolved by [theme.js](../../../meteo/js/theme.js#L10-L35).
- support.js: the media query and the `data-theme` block repeat 19 dark values ([style.css](../../../support.js/css/style.css#L83-L130)).
  Components sometimes reference primitives directly, such as `--form-text-color: var(--blue-hex)` ([forms.css](../../../support.js/css/forms.css#L14)).
- Similarities: todos.webapp and family-portal resolve themes in CSS and keep the non-color scales as raw values in the semantic tier.
- Differences that matter: meteo needs JavaScript for dark mode; the support.js lineage defines dark values twice.
- **Reference:** todos.webapp, for its tier comments, fallback parity test, and smaller semantic set.
- **Verdict:** shared contract (tier rules, `light-dark()`, `data-theme`, fallback); values are look-specific.

### Token Name Crosswalk
Rows map tokens by role; a dash means the app has no token for the role.

| Role                 | todos.webapp                                                         | family-portal                                                            | meteo                                           | support.js                                             |
| :------------------- | :------------------------------------------------------------------- | :----------------------------------------------------------------------- | :---------------------------------------------- | :----------------------------------------------------- |
| Page background      | `--color-bg`                                                         | `--color-bg`                                                             | `--color-bg`                                    | `--app-screen-bg-color`                                |
| Surface              | `--color-surface`                                                    | `--color-surface`                                                        | `--color-card`                                  | `--primary-background-color`                           |
| Sunken surface       | `--color-surface-sunken`                                             | `--color-surface-sunken`                                                 | `--color-card-subtle`                           | -                                                      |
| Hover ground         | `--color-hover-bg`                                                   | -                                                                        | `--color-btn-tint-hover`                        | -                                                      |
| Selected ground      | `--color-selected-bg`, `--color-active-bg`                           | -                                                                        | `--color-primary-tint`                          | -                                                      |
| Body text            | `--color-text`                                                       | `--color-text`                                                           | `--color-text`                                  | `--primary-text-color`                                 |
| Strong text          | -                                                                    | -                                                                        | `--color-text-strong`                           | -                                                      |
| Muted text           | `--color-text-muted`                                                 | `--color-text-muted`                                                     | `--color-muted`                                 | `--muted-text-color`                                   |
| Disabled text        | `--color-text-disabled`                                              | `--color-text-disabled`                                                  | -                                               | -                                                      |
| Border               | `--color-border`                                                     | `--color-border`                                                         | `--color-border`, `--color-card-border`         | `--card-border-color`                                  |
| Strong border        | `--color-border-strong`                                              | `--color-border-strong`                                                  | -                                               | -                                                      |
| Subtle border        | -                                                                    | -                                                                        | `--color-border-subtle`                         | -                                                      |
| Main action fill     | `--color-signal`                                                     | `--color-primary`                                                        | `--color-primary`                               | `--secondary-background-color`                         |
| Main action hover    | `--color-signal-hover`                                               | `--color-primary-hover`                                                  | `--color-primary-dark`                          | `--form-button-hover-bg-color`                         |
| Main action pressed  | `--color-signal-active`                                              | -                                                                        | -                                               | `--form-button-active-bg-color`                        |
| Text on main action  | `--color-on-signal`                                                  | `--color-on-primary`                                                     | `--color-on-primary`                            | `--secondary-text-color`                               |
| Inverse fill         | -                                                                    | `--color-inverse`, `--color-on-inverse`                                  | -                                               | `--ternary-background-color`                           |
| Accent               | -                                                                    | `--color-accent`, `--color-on-accent`                                    | accent redefines `--color-primary`              | -                                                      |
| Link                 | `--color-link`                                                       | `--color-link`, `--color-link-hover`                                     | `--color-primary-text`                          | -                                                      |
| Focus color          | `--color-focus`                                                      | `--color-focus`                                                          | `--color-primary-focus`                         | `--form-element-focus-border-color`                    |
| Focus ring shorthand | `--focus-ring`, `--focus-ring-width`                                 | `--focus-ring`, `--focus-ring-width`                                     | -                                               | -                                                      |
| Danger               | `--color-danger`                                                     | `--color-danger`                                                         | `--color-wrong`                                 | `--color-danger`                                       |
| Danger ground        | -                                                                    | `--color-danger-bg`                                                      | `--color-wrong-bg`                              | -                                                      |
| Text on danger       | `--color-on-danger`                                                  | -                                                                        | -                                               | -                                                      |
| Success              | -                                                                    | `--color-success`, `--color-success-bg`                                  | `--color-correct` (unused)                      | `--color-success`                                      |
| Warning              | -                                                                    | `--color-warning`, `--color-warning-bg`                                  | `--color-warning`, `--color-warning-bg`         | `--color-warning`                                      |
| Status hues          | `--color-status-in-progress`, `-completed`, `-cancelled`             | -                                                                        | -                                               | -                                                      |
| Decorative tones     | -                                                                    | `--color-tone-1` to `-4`, `--color-on-tone-1` to `-4`                    | `--color-badge-{hue}-bg`, `-text`               | -                                                      |
| Data series          | -                                                                    | -                                                                        | `--color-rain`, `--color-rain-text`             | -                                                      |
| Backdrop             | `--color-backdrop`                                                   | primitive `--shadow-black-soft`                                          | `--color-overlay` (unused)                      | -                                                      |
| Shadow color         | `--color-shadow`                                                     | `--shadow-color`, `-soft`, `-strong`                                     | `--color-primary-shadow`                        | -                                                      |
| Tooltip              | -                                                                    | -                                                                        | `--color-tooltip-bg`, `-text`, `-border`        | -                                                      |
| Body font            | `--font-body`                                                        | `--font-body`                                                            | -                                               | `--font-family-base`                                   |
| Heading font         | -                                                                    | `--font-heading`                                                         | -                                               | -                                                      |
| Mono font            | `--font-mono`                                                        | `--font-mono`                                                            | -                                               | `--font-family-mono`                                   |
| Type scale           | `--text-xs` to `--text-xl` (5)                                       | `--text-xs` to `--text-3xl` (8)                                          | `--font-size-xs` to `--font-size-2xl` (7)       | -                                                      |
| Weights              | `--weight-regular`, `-medium`, `-semibold`                           | same, plus `--weight-bold`                                               | -                                               | -                                                      |
| Line heights         | `--leading-tight`, `-normal`                                         | `--leading-tight`, `-snug`, `-normal`                                    | -                                               | -                                                      |
| Letter spacing       | -                                                                    | `--tracking-tight`, `-wide`                                              | -                                               | -                                                      |
| Space                | `--space-1` to `--space-8`                                           | `--space-1` to `--space-12`                                              | -                                               | -                                                      |
| Radii                | `--radius-sm`, `-md`, `-lg`, `-round`                                | same, plus `-xl`, `-pill`                                                | same as family-portal, plus `--radius`, `-full` | `--border-radius-sm`, `-md`, `-lg`, `-pill`, `-circle` |
| Radius roles         | -                                                                    | -                                                                        | -                                               | `--control-border-radius`, `--card-border-radius`      |
| Border widths        | `--border-width`, `-strong`                                          | `--border-width`, `-strong`                                              | -                                               | -                                                      |
| Elevation            | `--elevation-1`, `-2`                                                | `--elevation-1`, `-2`                                                    | `--shadow-sm`, `-md`, `-lg`, `-modal`           | `--shadow-sm`, `-md`, `-lg`, `--card-shadow`           |
| Layers               | `--layer-base`, `-sticky`, `-float`, `-popover`, `-dialog`, `-toast` | `--layer-base`, `-sticky`, `-overlay`, `-dialog`, `-toast`               | -                                               | nine `--{name}-z-level` tokens                         |
| Motion               | `--duration-fast`, `-base`, `-spin`, `--ease-standard`               | `--duration-fast`, `-base`, `--ease-standard`, `--offset-press`, `-lift` | -                                               | -                                                      |
| Touch target         | `--target-min`                                                       | `--target-min`                                                           | -                                               | -                                                      |
| Control height       | -                                                                    | `--control-height`                                                       | -                                               | -                                                      |
| Icon size            | `--icon-size`, `-lg`, `--icon-stroke`, `-thin`                       | `--icon-sm`, `--icon-md`                                                 | -                                               | -                                                      |
| Layout widths        | `--width-main`, `-sidebar`, `-editor`, `-menu`, and 3 more           | `--width-content`, `-narrow`, `-reading`, `--gutter`                     | -                                               | `--view-max-width-form`, `-card`, `-wide`              |
| Avatar sizes         | -                                                                    | `--avatar-sm`, `-md`, `-lg`, `-stack`                                    | -                                               | -                                                      |

Exact name overlap, all tiers and semantic on both sides:

| Pair                                    | All tiers | Semantic |
| :-------------------------------------- | --------: | -------: |
| todos.webapp and family-portal          | 53        | 49       |
| family-portal and meteo                 | 12        | 12       |
| todos.webapp and meteo                  | 7         | 7        |
| family-portal and support.js            | 6         | 3        |
| todos.webapp and support.js             | 5         | 1        |
| meteo and support.js                    | 7         | 1        |
| auth and counters, each with support.js | 123       | 35       |

Same names do not mean same values:
- Space steps 1 to 7 are equal in todos.webapp and family-portal; `--space-8` is 3rem against 2.5rem.
- Radii shift one step: todos.webapp `--radius-sm`, `-md`, `-lg` are 4, 8, 12 px; family-portal uses 8, 12, 16 px.
  meteo uses 4, 6, 12 px ([style.css](../../../meteo/css/style.css#L75-L81)).
- Type steps differ above `--text-base`: todos.webapp `--text-lg` is 1.125rem, family-portal's is 1.375rem.
- Motion tokens are identical: 120 ms, 200 ms, and the same easing curve.
  Compare [todos tokens.css](../../../todos.webapp/src/css/tokens.css#L169-L172) with [family-portal tokens.css](../../../family-portal/webapp/css/tokens.css#L272-L274).
- `--layer-dialog` is 200 in todos.webapp and 110 in family-portal.
- **Verdict:** shared contract for names; values stay look-specific.

### Colors, Contrast, and Color Meaning
- todos.webapp: monochrome grays, one navy signal, deep orange danger, and status hues ([guide](../../../todos.webapp/docs/specs/visual-style-guide.md#L24-L27)).
  A unit test checks text pairs at 4.5:1, icons and focus at 3:1, and the raw-color ban ([tokens.test.js](../../../todos.webapp/tests/unit/tokens.test.js#L265-L325)).
- family-portal: navy and ivory with saffron and brick accents; no green or purple ([guide](../../../family-portal/docs/specs/visual-style-guide.md#L64-L66)).
  Tones decorate and never carry meaning ([guide](../../../family-portal/docs/specs/visual-style-guide.md#L123)).
  Contrast, raw colors, targets, and focus are checked in the browser by [verify-ui.py](../../../family-portal/scripts/verify-ui.py#L33-L40).
- meteo: blue, yellow, or red accent; rain colors follow the accent.
  White on yellow is 2.94:1 and was kept by a recorded decision ([T0027 spec](../../../meteo/.plan/tasks/archived/T0027-use-white-text-on-yellow-accent-buttons-in/technical-spec.md#L3-L4)).
  No contrast test exists.
- support.js: a 17-hue palette with RGB triples for alpha mixing ([colors.css](../../../support.js/css/colors.css#L9-L42)).
  Computed failures: muted text on the app background 4.23:1, white on the warning tag 2.94:1, white on the green tag 2.57:1.
- auth added role tokens `--color-*` beside the ordinal names and fixed dark link contrast ([style.css](../../../auth/webapp/css/style.css#L56-L78)).
- Differences that matter: only todos.webapp tests contrast statically; family-portal tests it in a live browser.
- **Reference:** todos.webapp [tokens.test.js](../../../todos.webapp/tests/unit/tokens.test.js) for static checks; family-portal for rendered checks.
- **Verdict:** shared contract (role names, test rules); palettes are look-specific.

### Typography
| App            | Families                                                                     | Loading                                                                                        | Scale                          | Line heights          |
| :------------- | :--------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------- | :----------------------------- | :-------------------- |
| todos.webapp   | Inter variable; system mono                                                  | self-hosted woff2, [fonts.css](../../../todos.webapp/src/css/fonts.css#L9-L15)                 | 5 steps, 0.75 to 1.375rem      | 1.25, 1.5 tokens      |
| family-portal  | Outfit headings, DM Sans body; system mono                                   | self-hosted Fontsource woff2, [fonts.css](../../../family-portal/webapp/css/fonts.css#L12-L69) | 8 steps, two fluid `clamp()`   | 1.05, 1.3, 1.6 tokens |
| meteo          | system stack ([style.css](../../../meteo/css/style.css#L218))                | none                                                                                           | 7 steps, 8 raw sizes bypass it | raw values only       |
| support.js     | Roboto, Roboto Mono ([style.css](../../../support.js/css/style.css#L49-L52)) | left to the consumer                                                                           | none; 39 literal sizes         | reset sets 1          |
| auth, counters | Roboto                                                                       | Google Fonts, regular weight only                                                              | literal sizes                  | literal values        |

- Similarities: todos.webapp and family-portal self-host variable fonts with `font-display: swap` and precache them.
- Differences that matter: auth and counters contact a third-party font service; heavier Roboto weights are likely synthesized.
- **Reference:** family-portal [fonts.css](../../../family-portal/webapp/css/fonts.css), for `unicode-range` subsets and two families.
- **Verdict:** shared contract (font tokens, self-hosting rule); the families are look-specific.

### Spacing, Radii, Borders, Shadows, Layers, and Motion
- Spacing: todos.webapp and family-portal use 4 px based scales ([todos](../../../todos.webapp/src/css/tokens.css#L118-L125), [family-portal](../../../family-portal/webapp/css/tokens.css#L212-L223)).
  meteo and support.js have no spacing tokens: 120 and 138 literal declarations.
- Radii: see the crosswalk; family-portal buttons are pills, todos.webapp buttons use `--radius-md`.
- Borders: the strong border is 3 px in todos.webapp and 1.5 px in family-portal.
- Shadows: two elevation levels in both new systems; family-portal tints them navy in light mode.
- Layers: tokenized in todos.webapp, family-portal, and support.js; meteo uses raw 5, 20, 60, and 1000.
  Raw values remain anyway: [todos app-chrome.css](../../../todos.webapp/src/css/app-chrome.css#L415), [family-portal components.css](../../../family-portal/webapp/css/components.css#L830), and [support.js progress.css](../../../support.js/css/progress.css#L93).
- Motion: both new systems zero durations under `prefers-reduced-motion` at token level.
  See [todos tokens.css](../../../todos.webapp/src/css/tokens.css#L185-L191) and [family-portal tokens.css](../../../family-portal/webapp/css/tokens.css#L353-L358).
  meteo, support.js, auth, and counters have no reduced-motion handling.
- **Reference:** todos.webapp for layers and motion; family-portal for spacing range.
- **Verdict:** shared contract for scales and layer order; step values are look-specific.

### Icons
| App                | System                                                                                | Grid and stroke                | Color                          |
| :----------------- | :------------------------------------------------------------------------------------ | :----------------------------- | :----------------------------- |
| todos.webapp       | one external sprite, 29 symbols, [icons.svg](../../../todos.webapp/src/img/icons.svg) | 24 units, stroke token 2       | `currentColor`                 |
| family-portal      | `<symbol>` block pasted into each template, 30 ids                                    | 24 units, stroke 2; header 1.5 | `currentColor`; tones per tile |
| meteo              | JavaScript string map, 38 icons, [icons.js](../../../meteo/js/icons.js#L1-L189)       | 24 units, stroke 2.2           | `currentColor`                 |
| support.js lineage | Font Awesome classes in markup and JS                                                 | none                           | inherits text color            |

- todos.webapp builds icons with `spriteIcon` ([task-list.js](../../../todos.webapp/src/js/views/task-list.js#L80-L89)); four private helpers duplicate it.
  Its gallery still holds 45 inline-path icons, against its own decision ([guide](../../../todos.webapp/docs/specs/visual-style-guide.md#L55-L57)).
- family-portal inserts icons from templates, Java strings in `Widgets.java`, and a helper copied into 8 modules.
  Java-built icons work only if the host template carries the symbol.
- meteo hydrates `[data-icon]` placeholders ([icons.js](../../../meteo/js/icons.js#L281-L300)); 9 weather icons have day and night variants.
  16 icon definitions are unused quiz leftovers.
- Similarities: all three new-style apps draw 24-unit stroke icons in `currentColor`.
- **Reference:** todos.webapp, because one cached sprite file serves every page and the service worker precaches it.
- **Verdict:** shared component (sprite format, `.icon` class, builder function); the glyph set is look-specific.

### Focus Indicators and Touch Targets
- todos.webapp: global `:focus-visible` outline of 2 px in `--color-focus` ([style.css](../../../todos.webapp/src/css/style.css#L79-L82)).
  Danger controls ring in the danger color; rows use an inset offset.
- family-portal: global box-shadow ring of 3 px ([components.css](../../../family-portal/webapp/css/components.css#L276-L280)).
  Five components use an outline with offset instead.
- meteo: 11 `outline: none` rules; the primary button shows no ring at all ([style.css](../../../meteo/css/style.css#L403-L408)).
- support.js: inputs get a 0.2-alpha ring ([forms.css](../../../support.js/css/forms.css#L147-L153)); buttons keep the browser outline.
- Touch targets: todos.webapp and family-portal define `--target-min` as 2.75rem (44 px).
  Below 44 px: the todos.webapp sync badge at 18 px ([app-chrome.css](../../../todos.webapp/src/css/app-chrome.css#L411-L428)).
  Also below: meteo footer buttons at 38 px ([style.css](../../../meteo/css/style.css#L780-L781)) and the counters target token at 40 px.
- Both new systems mirror states with gallery classes `.is-hover`, `.is-active`, and `.is-focus` in production CSS.
- **Reference:** todos.webapp, for one outline mechanism with danger and inset variants.
- **Verdict:** shared contract (ring token, 44 px minimum, state classes).

---

## Middle Level: Components and Patterns

### Buttons
- todos.webapp: `.button` with `--secondary`, `--danger`, and `--quiet`; disabled and `aria-disabled` ([controls.css](../../../todos.webapp/src/css/controls.css#L30-L140)).
  Also `.icon-button` with `aria-pressed` ([controls.css](../../../todos.webapp/src/css/controls.css#L142-L194)) and `.fab` ([app-chrome.css](../../../todos.webapp/src/css/app-chrome.css#L357-L393)).
- family-portal: pill `.button` with `--secondary`, `--danger`, `--inverse`, and `--small` ([components.css](../../../family-portal/webapp/css/components.css#L857-L937)).
  Also `.link-button` and `.icon-button` with `--danger` ([components.css](../../../family-portal/webapp/css/components.css#L943-L1013)).
- meteo: `.btn-primary`, circle footer buttons, and stacked close-button aliases ([style.css](../../../meteo/css/style.css#L396-L643)).
  No disabled or active styles.
- support.js: element selectors on `button` with hover and disabled only ([forms.css](../../../support.js/css/forms.css#L225-L258)).
  counters added four archetypes with `:focus-visible` ([forms.css](../../../counters.server/webapp/css/forms.css#L685-L769)).
- Similarities: todos.webapp and family-portal share the BEM API: `.button`, `--secondary`, `--danger`, and `.icon-button`.
- Differences that matter: shape and fill colors; family-portal `--danger` is missing from its gallery.
- **Reference:** todos.webapp, for full states, the danger focus ring, and tests of the 44 px target.
- **Verdict:** shared component (class API and states); shape and colors are look-specific.

### Fields, Forms, and Validation
- todos.webapp: `.field` with `__label`, `__control`, `__hint`, `__counter`, and `__error` ([controls.css](../../../todos.webapp/src/css/controls.css#L196-L298)).
  `createField` toggles `aria-invalid` and merges `aria-describedby` ([editor-panel.js](../../../todos.webapp/src/js/views/editor-panel.js#L36-L100)).
- family-portal: the same block names without the counter ([components.css](../../../family-portal/webapp/css/components.css#L1257-L1322)).
  Validation lives per page, as in `survey-form.mjs`.
- meteo: native `<select>` and checkboxes in `.config-field`; errors only as a `role="alert"` line.
- support.js: `.input-group` grid with `.valid` and `.invalid` classes and `<i>` icons ([forms.css](../../../support.js/css/forms.css#L80-L197)).
  It sets no ARIA, and `markInvalid` writes `innerHTML`.
- Similarities: todos.webapp and family-portal share the markup contract almost exactly:
  ```html
  <div class="field">
    <label class="field__label" for="x">Title</label>
    <input class="field__control" id="x" aria-invalid="true" aria-describedby="x-error">
    <p class="field__error" id="x-error">Enter a title.</p>
  </div>
  ```
- Differences that matter: family-portal uses a `<span>` for the error and has no counter or meta row.
- **Reference:** todos.webapp, because `createField` turns the contract into one function.
- **Verdict:** shared component.

### Chips, Toggles, and Segmented Controls
- todos.webapp: `.chip`, `--overdue`, `--removable`, and `.filter-chip` ([controls.css](../../../todos.webapp/src/css/controls.css#L348-L443)).
  The segmented control is a `fieldset` of radios styled through `:has(:checked)` ([controls.css](../../../todos.webapp/src/css/controls.css#L445-L522)).
- family-portal: `.chip` toggles with `aria-pressed`, `.reaction`, `.tag`, and `.segmented` ([components.css](../../../family-portal/webapp/css/components.css#L2670-L2707)).
  Its segmented control uses `role="radiogroup"` on a `div`, not a `fieldset`.
- meteo: non-interactive badges and native checkboxes only.
- counters: the only switch control, `.switch-control` with `role="switch"` ([forms.css](../../../counters.server/webapp/css/forms.css#L474-L488)).
- No app has a switch in the new systems; both use native checkboxes with `accent-color`.
- **Reference:** todos.webapp for chips and the segmented control; counters for the switch idea.
- **Verdict:** shared component.

### Lists, Rows, Cards, and Tiles
- todos.webapp: `ul.task-list` is a size container; rows react to a 36rem container query ([app-components.css](../../../todos.webapp/src/css/app-components.css#L16-L42)).
  `createTaskList` reuses keyed rows and virtualizes above 200 rows ([task-list.js](../../../todos.webapp/src/js/views/task-list.js#L449)).
  No generic card class exists; list rows, bin rows, and group headers are missing from the gallery.
- family-portal: `.card` lifts on hover; app tiles pair `.icon-tile` tones with text ([components.css](../../../family-portal/webapp/css/components.css#L1109-L1183)).
  `.row-list` uses `<dl>` rows ([components.css](../../../family-portal/webapp/css/components.css#L1463-L1592)); `.check-list` adds drag handles.
- meteo: a forecast chart as an `<ol>` of 12 hours with DOM bars ([forecast-view.js](../../../meteo/js/forecast-view.js#L278-L336)).
  Each hour has one screen reader sentence; the visible cells are `aria-hidden`.
- support.js: `.catalogue-item` cards and `makeReordable` drag reorder without keyboard support.
- Similarities: rows are flex or grid lines with a trailing More or actions cell in every app.
- Differences that matter: todos.webapp rows are dense task rows; family-portal cards are spacious tiles.
- Reference anatomy of a family-portal app tile; the whole card is one link, so it nests no controls:
  ```html
  <a class="card" href="…">
    <span class="icon-tile icon-tile--tone-1"><svg class="icon" aria-hidden="true"><use href="#icon-…"/></svg></span>
    <span class="app-tile__body"><span class="card__title">…</span><span class="card__text">…</span></span>
  </a>
  ```
- **Reference:** family-portal for cards and tiles; todos.webapp for rows and container queries; meteo for the chart.
- **Verdict:** card and row base are a shared component; task rows and the chart are app-local.

### Multi-select, Bulk Actions, Delete, Undo, and Recycle Bin
- todos.webapp: Delete moves to the recycle bin and shows an Undo toast ([task-list.js](../../../todos.webapp/src/js/views/task-list.js#L612-L613)).
  The bin screen restores items and asks in place before permanent deletion ([recycle-bin.js](../../../todos.webapp/src/js/views/recycle-bin.js#L274-L324)).
  Multi-select is absent.
- family-portal: Delete uses `confirm()` or an inline Delete and Keep question ([pages.mjs](../../../family-portal/webapp/portal/js/pages.mjs#L83-L98)).
  No undo after delete and no recycle bin.
- meteo: none of these patterns.
- support.js: `CollectionEditor` offers checkbox rows and bulk delete ([collection-editor.mjs](../../../support.js/src/collection-editor.mjs#L39-L59)).
  Its checkbox is `display: none`, so selection works by pointer only.
- counters: a recycle bin view ([recycle-bin-view.mjs](../../../counters.server/webapp/js/view/recycle-bin-view.mjs)) and multi-select through `CollectionEditor`.
- **Reference:** todos.webapp for delete, undo, and the bin; no accessible multi-select reference exists.
- **Verdict:** shared contract (delete moves to a bin, Undo toast); the bin screen is app-local.

### Empty States, Loading, Progress, and Skeletons
- todos.webapp: `.empty-state` with icon, title, text, and at most two actions ([app-chrome.css](../../../todos.webapp/src/css/app-chrome.css#L883-L918)).
  No loading pattern: local work needs no spinner.
- family-portal: several unstyled or per-component empty messages; loading is text in the page header.
  `.widget--loading` with `aria-busy` exists only in the gallery.
- meteo: a `role="status"` text line reports search and load progress.
- support.js: skeleton classes, spinner, and a top progress bar ([component.css](../../../support.js/css/component.css#L87-L151)).
  The skeletons have no dark variant and no `aria-busy`.
- **Reference:** todos.webapp for empty states; none for loading.
- **Verdict:** shared component for empty states; loading is an open gap.

### Toasts, Banners, System Notifications, and Inbox
- todos.webapp: `createToaster` handles Undo, persistent toasts, Ctrl+Z, and holding while a modal is open ([toast.js](../../../todos.webapp/src/js/ui/toast.js#L31)).
  Banners `.banner` and `.banner--error` use `role="status"` and `role="alert"` ([controls.css](../../../todos.webapp/src/css/controls.css#L762-L795)).
  An inbox panel with a badge exists in connected mode ([inbox.js](../../../todos.webapp/src/js/ui/inbox.js#L118)), outside the gallery.
- family-portal: no toasts; banners in danger, success, and warning ([components.css](../../../family-portal/webapp/css/components.css#L1023-L1049)).
  It is the only app with Web Push notifications ([sw.js](../../../family-portal/webapp/sw.js#L48-L73)).
- meteo: one offline banner with `role="status"` ([index.html](../../../meteo/index.html#L45-L48)).
- counters: a toast manager with undo, dedupe, Escape, and Ctrl+Z ([toast-manager.mjs](../../../counters.server/webapp/js/view/toast-manager.mjs)).
  An ADR defines three notification tiers ([ADR](../../../counters.server/docs/adrs/modernize-notification-system-ui-adr.md#L18-L80)).
  auth and counters replaced the support.js drawer with `.urgent-banner` severity banners.
- Similarities: todos.webapp and counters built the same toast behavior independently.
- Reference anatomy, from todos.webapp, announced through a separate live region:
  ```html
  <div class="toast-region" role="region" aria-label="Notifications">
    <div class="toast"><p class="toast__text">…</p><button class="button button--quiet">Undo</button></div>
  </div>
  ```
- **Reference:** todos.webapp `createToaster` plus the counters notification ADR for tier rules.
- **Verdict:** shared component for toasts and banners; Web Push is app-local.

### Menus, Popovers, Tooltips, and Collapsibles
- todos.webapp: `attachMenu` gives keyboard menus with type-ahead ([menu.js](../../../todos.webapp/src/js/ui/menu.js#L36)).
  `attachPopover` and `anchorPanel` position panels with fixed coordinates, RTL-aware ([popover.js](../../../todos.webapp/src/js/ui/popover.js#L37-L72)).
  Both use the `hidden` attribute, not the native `popover` attribute.
- family-portal: no menus or popovers; inline panels toggle with `aria-expanded`.
- meteo: pure CSS `[data-tooltip]` tooltips on focus and fine-pointer hover ([style.css](../../../meteo/css/style.css#L423-L597)).
- support.js: `AppMenu` without roles or keyboard support; hover-only tooltips; a hidden-checkbox accordion.
- Collapsibles: no app uses `<details>`; todos.webapp, family-portal, and meteo use buttons with `aria-expanded`.
- Reference anatomy, from todos.webapp; `attachMenu` sets `aria-expanded`, roving focus, and type-ahead:
  ```html
  <button class="icon-button" aria-haspopup="menu" aria-expanded="true" aria-label="More actions for …">…</button>
  <div class="menu" role="menu" aria-label="Actions for …">
    <button class="menu__item" type="button" role="menuitem">Add to list</button>
    <div class="menu__separator" role="separator"></div>
    <button class="menu__item menu__item--danger" type="button" role="menuitem">Delete</button>
  </div>
  ```
  This skeleton follows [visual-style-gallery.html](../../../todos.webapp/src/demo/visual-style-gallery.html#L571-L578), without the icons.
- Tests: [menu.test.js](../../../todos.webapp/tests/unit/menu.test.js) covers menus and popovers; [behaviors.spec.js](../../../todos.webapp/tests/e2e/behaviors.spec.js) checks anchoring at 390 px.
- **Reference:** todos.webapp for menus and popovers; meteo for tooltips.
- **Verdict:** shared component.

### Dialogs and Confirmations
- todos.webapp: native `<dialog>` with `openDialog` and `confirmDialog` ([dialog.js](../../../todos.webapp/src/js/ui/dialog.js#L22-L143)).
  It becomes a sheet below 64rem ([controls.css](../../../todos.webapp/src/css/controls.css#L710-L724)).
  Three confirmation tiers: modal, in-place `.inline-confirm`, and typing `DELETE` ([settings.js](../../../todos.webapp/src/js/views/settings.js#L189-L269)).
- family-portal: one `<dialog>` opened with `showModal()` for widget parameters ([visual-editor.mjs](../../../family-portal/webapp/portal/js/visual-editor.mjs#L315-L316)).
  Other confirmations use `confirm()` or in-row questions.
- meteo: no dialogs; About and Settings are full-window screens without focus management.
- support.js: `Dialog` is a `div` overlay without role, focus trap, or Escape ([dialog.mjs](../../../support.js/src/dialog.mjs#L44-L78)).
  counters colors dialog buttons by matching their label text ([dialog.css](../../../counters.server/webapp/css/dialog.css#L179-L247)).
- Reference anatomy, from todos.webapp; `openDialog` adds focus trap, Escape, and focus return:
  ```html
  <dialog class="dialog" aria-labelledby="t">
    <div class="dialog__header"><h2 class="dialog__title" id="t">Delete the list Groceries?</h2></div>
    <div class="dialog__body"><p>…</p></div>
    <div class="dialog__actions">
      <button class="button button--secondary" data-dialog-close="cancel">Keep</button>
      <button class="button button--danger" data-dialog-close="delete">Delete list</button>
    </div>
  </dialog>
  ```
- Tests: todos.webapp covers the trap, Escape, and the 390 px sheet in [behaviors-dialog.spec.js](../../../todos.webapp/tests/e2e/behaviors-dialog.spec.js#L28-L65).
- **Reference:** todos.webapp, the only complete and tested implementation.
- **Verdict:** shared component.

### Avatars and Account Menus
- todos.webapp: `.user-button` shows a person icon or initials and opens a popover panel ([user-menu.js](../../../todos.webapp/src/js/ui/user-menu.js#L109-L180)).
  No avatar images.
- family-portal: `.avatar` images in three sizes with tones, stacks, and an icon fallback ([components.css](../../../family-portal/webapp/css/components.css#L1060-L1102)).
  `.account-button` links to the account page instead of opening a menu ([portal.mjs](../../../family-portal/webapp/portal/js/portal.mjs#L95-L107)).
  An avatar cropper supports drag, pinch, and keys ([avatar-crop.mjs](../../../family-portal/webapp/portal/js/avatar-crop.mjs#L8)).
- meteo: no accounts.
- auth and counters: simple avatar circles in their account views.
- **Reference:** family-portal for avatars; todos.webapp for the account menu.
- **Verdict:** shared component; the account button placement is shell-specific.

---

## High Level: App Shells

### App Shell Layout
- todos.webapp: `renderShell` writes one DOM for both layouts ([layout.js](../../../todos.webapp/src/js/ui/layout.js#L124-L140)).
  Phone: top bar, view, sticky add bar, and bottom navigation.
  Desktop from 64rem: sidebar, main column, and editor panel ([app-shell.css](../../../todos.webapp/src/css/app-shell.css#L109-L157)).
  The shell owns every fixed or sticky position.
- family-portal: a sticky header with brand heart, breadcrumb, help, and account buttons.
  The header is hand-copied into all 14 portal templates ([page.html](../../../family-portal/webapp/portal/page.html#L34-L46)).
  A fixed footer, no sidebar, no bottom bar, and no floating action button.
- meteo: three full-window screens with sticky header and footer ([index.html](../../../meteo/index.html#L44-L152)); a centered card from 640 px.
- support.js lineage: a `#sticky-top`, `#content`, `#sticky-bottom` grid anchored on element IDs ([main-layout.css](../../../support.js/css/main-layout.css#L57-L165)).
  Actions move to the bottom bar on phones and to the header on desktop.
- todos.webapp shell skeleton, one DOM for phone and desktop:
  ```html
  <div id="app" class="app">
    <header class="app__top-bar"><h1 class="app__title" id="app-title"></h1><div class="user-menu" data-user-menu></div></header>
    <nav class="sidebar app__sidebar" aria-label="Main">…</nav>
    <main class="app__main" id="main" tabindex="-1" aria-labelledby="app-title">…</main>
    <div class="app__editor" data-editor-slot hidden>…</div>
    <nav class="bottom-nav app__bottom-nav" aria-label="Main">…</nav>
    <div class="toast-region" role="region" aria-label="Notifications"></div>
  </div>
  ```
- family-portal header skeleton; Java fills `{{breadcrumb}}` and the `{{t:…}}` keys:
  ```html
  <header class="sticky-header">
    <div class="container"><div class="top-bar">
      <a class="brand" href="/"><svg class="brand__mark" role="img" aria-label="pellicciotta"><use href="/img/public/logo.svg#heart-18"/></svg></a>
      <nav class="breadcrumb" aria-label="{{t:common.breadcrumb}}">{{breadcrumb}}</nav>
      <div class="top-bar__actions"><a class="help-button" href="/help">…</a><a class="account-button" href="/account">…</a></div>
    </div></div>
    <div class="season-bar"></div>
  </header>
  ```
- **Reference:** todos.webapp for app-style tools; family-portal for content sites.
- **Verdict:** shell-specific: an app shell and a site shell, each a separate shared pattern.

### Navigation and Routing
- todos.webapp: single-page app with a hash router of 14 routes and per-view scroll memory ([router.js](../../../todos.webapp/src/js/ui/router.js#L13-L28)).
- family-portal: multi-page site; Java maps routes to templates ([PortalPages.java](../../../family-portal/src/main/java/com/pellicciotta/portal/PortalPages.java#L118-L178)).
  Breadcrumbs come from `PagePaths.java`.
- meteo: one page; `showScreen` toggles three sections ([screens.js](../../../meteo/js/screens.js#L12-L19)); no History API.
- auth and counters: single-page apps with the History API.
- **Reference:** todos.webapp for single-page apps; family-portal for server pages.
- **Verdict:** shell-specific; `aria-current="page"` marking is a shared contract.

### Responsive Behavior
| App             | Width breakpoints                           | Container queries                | Other queries         |
| :-------------- | :------------------------------------------ | :------------------------------- | :-------------------- |
| todos.webapp    | 64rem layout switch, 40rem sync label       | `task-list`, `bin-list` at 36rem | `hover: none`         |
| family-portal   | 40rem, used 8 times, mirrored in JavaScript | none                             | `pointer: coarse`     |
| meteo           | 380, 479, 500, 639, 640, 768 px             | none, removed by decision        | height 700 and 800 px |
| support.js      | 480, 481, 600, 630 px                       | none                             | none                  |
| auth            | 7 distinct widths                           | none                             | none                  |
| counters.server | 17 distinct widths                          | none                             | none                  |

- Screenshots show no horizontal page scroll in any captured page at 390 px, with one exception.
  The counters gallery renders 648 px wide inside a 390 px viewport.
- **Reference:** todos.webapp, for a single layout breakpoint plus container queries for components.
- **Verdict:** shared contract (breakpoint tokens, container queries for rows); layouts are shell-specific.

### Splash, Offline, Error Pages, Service Worker, and Install
- todos.webapp: cache-first service worker with an enforced precache list ([service-worker.js](../../../todos.webapp/src/service-worker.js#L1-L45)).
  An Update toast handles new versions ([sw-update.js](../../../todos.webapp/src/js/ui/sw-update.js#L1-L25)); no splash page.
- family-portal: an offline page with Retry ([offline.html](../../../family-portal/webapp/offline.html)); not-found pages render through `page.html`.
- meteo: network-first navigations; the last forecast stays in local storage for 6 hours ([sw.js](../../../meteo/sw.js#L99-L137)).
- auth and counters: splash screens in `index.html` and versioned service worker caches.
- **Reference:** todos.webapp for the update flow; family-portal for the offline page.
- **Verdict:** shared contract for update and offline behavior; caching strategy is app-local.

### Theme Switching and Variants
- todos.webapp: Settings offers System, Light, and Dark as a segmented control ([settings.js](../../../todos.webapp/src/js/views/settings.js#L135-L160)).
- family-portal: follows the OS only; the switch exists in the gallery.
  Seasons set `data-season` from date and hemisphere and animate a sky ([season.mjs](../../../family-portal/webapp/portal/js/season.mjs#L41-L67)).
- meteo: theme plus three accents, previewed live in Settings ([config-view.js](../../../meteo/js/config-view.js#L28-L32)).
- auth and counters: a theme `<select>` in the account view.
- **Reference:** todos.webapp for the switch; family-portal `data-season` for variant hooks.
- **Verdict:** shared contract (`data-theme` values, storage key pattern); seasons and accents are look-specific.

### Internationalization Hooks
- todos.webapp: English only; strings sit in frozen per-module objects awaiting a strings module.
  Logical CSS properties make layouts RTL-ready.
- family-portal: `{{t:key}}` placeholders filled by Java and a client `t()` ([i18n.mjs](../../../family-portal/webapp/portal/js/i18n.mjs#L33-L36)).
  Catalogs hold 401 keys each in English and Dutch; some strings remain hard-coded.
- meteo: `data-i18n`, `data-i18n-aria`, `data-i18n-tooltip`, and `data-i18n-placeholder` attributes ([i18n.js](../../../meteo/js/i18n.js#L102-L123)).
  A `languagechange` event re-renders the rest.
- support.js, auth, and counters: no internationalization.
- **Reference:** meteo for client attributes; family-portal for server rendering.
- **Verdict:** shared contract (catalog format, attribute names); loading is shell-specific.

---

## Code Level

### CSS Organization and Class Naming
- todos.webapp: one file per layer, from tokens to controls, app components, chrome, shell, and views.
  BEM classes; state in ARIA and `data-*` attributes; heavy `:has()` use.
- family-portal: three partials, with one `components.css` of 2744 lines; BEM with `data-*` JavaScript hooks.
- meteo: one 2011-line file with numbered sections; flat kebab-case classes, ID selectors, and 11 dead classes.
- support.js: one file per component, each re-importing `style.css`; plain classes and ID selectors.
  `.disabled` means hidden, not disabled.
- **Reference:** todos.webapp, for its layering and its rule that components hold no fixed positions.
- **Verdict:** shared contract.

### JavaScript Components and State
- todos.webapp: plain ES modules in `ui/` with controller APIs that take a `document` for tests.
- family-portal: one module per page; element and icon builders re-implemented in at least 8 files.
- meteo: an element registry, `CustomEvent` signals, and pure forecast logic.
- support.js: class components on `Component`, built from template strings with `innerHTML`, and no ARIA.
  auth vendors pre-v2 copies; counters imports support.js through an import map.
- **Reference:** todos.webapp `src/js/ui/` modules.
- **Verdict:** shared component library, consumed as a pinned package, not copied.

### Documentation, Galleries, and Tests
| App             | Gallery coverage                                              | Automated design checks                                        |
| :-------------- | :------------------------------------------------------------ | :------------------------------------------------------------- |
| todos.webapp    | controls and app components complete; none of 88 view classes | unit token test; 5 gallery end-to-end specs at 390 and 1440 px |
| family-portal   | most components; nav skips 5 sections; 3 inline styles        | `verify-ui.py` browser checks; about 100 page tests            |
| meteo           | none; the About guide draws the real chart from samples       | token-value browser test; no contrast test                     |
| support.js      | none                                                          | stylesheet presence and import tests                           |
| counters.server | large gallery with 444 inline styles                          | Playwright UI suites and pixel-diff visual regression          |

- **Reference:** todos.webapp for static checks; family-portal for rendered checks; counters for pixel diffs.
- **Verdict:** shared contract for gallery rules and checks; the tools are a shared component.

---

## Sharing Verdicts
| Pattern                      | Reference implementation       | Verdict                                |
| :--------------------------- | :----------------------------- | :------------------------------------- |
| Token tiers and theming      | todos.webapp                   | shared contract                        |
| Token names                  | todos.webapp and family-portal | shared contract                        |
| Palette and fonts            | each app                       | look-specific                          |
| Contrast and raw-color tests | todos.webapp, family-portal    | shared contract                        |
| Icons                        | todos.webapp                   | shared component; glyphs look-specific |
| Focus and touch targets      | todos.webapp                   | shared contract                        |
| Buttons                      | todos.webapp                   | shared component                       |
| Fields and validation        | todos.webapp                   | shared component                       |
| Chips and segmented controls | todos.webapp                   | shared component                       |
| Switch                       | counters                       | shared component, to be built          |
| Cards and tiles              | family-portal                  | shared component                       |
| Task rows and forecast chart | todos.webapp, meteo            | app-local                              |
| Delete, undo, and bin        | todos.webapp                   | shared contract                        |
| Empty states                 | todos.webapp                   | shared component                       |
| Loading and skeletons        | none                           | open gap                               |
| Toasts and banners           | todos.webapp                   | shared component                       |
| Menus and popovers           | todos.webapp                   | shared component                       |
| Tooltips                     | meteo                          | shared component                       |
| Dialogs and confirmations    | todos.webapp                   | shared component                       |
| Avatars                      | family-portal                  | shared component                       |
| App shell                    | todos.webapp                   | shell-specific                         |
| Site shell                   | family-portal                  | shell-specific                         |
| Routing                      | todos.webapp, family-portal    | shell-specific                         |
| Service worker update flow   | todos.webapp                   | shared contract                        |
| Theme switch                 | todos.webapp                   | shared contract                        |
| Seasons and accents          | family-portal, meteo           | look-specific                          |
| Internationalization         | meteo, family-portal           | shared contract                        |
| CSS layering and naming      | todos.webapp                   | shared contract                        |
| Behavior modules             | todos.webapp                   | shared component                       |

---

## Screenshots
Each app was served locally without changes:
- todos.webapp and meteo: the todos.webapp `scripts/serve.mjs` static server, pointed at each web root.
- family-portal gallery and mockups: the same static server; the landing and offline pages: the installed Java server.
  Portal pages need a real sign-in, so the [portal mockup](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/family-portal-portal-mockup-light-1440.png) stands in for the home page.
- auth and counters: a read-only static server that adds the `/support/css/`, `/support/js/`, and `/clients/js/src/` aliases.
  Without a backend both apps stop at their sign-in splash.
- meteo forecast: the live Open-Meteo API with the query `Brussels`.

| App             | Page              | Light 390                                                                                                                         | Light 1440                                                                                                                         | Dark 390                                                                                                                         | Dark 1440                                                                                                                         |
| :-------------- | :---------------- | :-------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------- | :-------------------------------------------------------------------------------------------------------------------------------- |
| todos.webapp    | gallery           | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/todos-gallery-light-390.png)               | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/todos-gallery-light-1440.png)               | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/todos-gallery-dark-390.png)               | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/todos-gallery-dark-1440.png)               |
| todos.webapp    | empty task list   | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/todos-main-light-390.png)                  | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/todos-main-light-1440.png)                  | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/todos-main-dark-390.png)                  | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/todos-main-dark-1440.png)                  |
| todos.webapp    | task list         | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/todos-main-populated-light-390.png)        | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/todos-main-populated-light-1440.png)        | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/todos-main-populated-dark-390.png)        | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/todos-main-populated-dark-1440.png)        |
| family-portal   | gallery           | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/family-portal-gallery-light-390.png)       | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/family-portal-gallery-light-1440.png)       | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/family-portal-gallery-dark-390.png)       | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/family-portal-gallery-dark-1440.png)       |
| family-portal   | portal mockup     | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/family-portal-portal-mockup-light-390.png) | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/family-portal-portal-mockup-light-1440.png) | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/family-portal-portal-mockup-dark-390.png) | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/family-portal-portal-mockup-dark-1440.png) |
| family-portal   | landing           | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/family-portal-landing-light-390.png)       | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/family-portal-landing-light-1440.png)       | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/family-portal-landing-dark-390.png)       | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/family-portal-landing-dark-1440.png)       |
| family-portal   | offline           | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/family-portal-offline-light-390.png)       | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/family-portal-offline-light-1440.png)       | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/family-portal-offline-dark-390.png)       | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/family-portal-offline-dark-1440.png)       |
| meteo           | start             | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/meteo-main-light-390.png)                  | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/meteo-main-light-1440.png)                  | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/meteo-main-dark-390.png)                  | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/meteo-main-dark-1440.png)                  |
| meteo           | forecast          | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/meteo-forecast-light-390.png)              | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/meteo-forecast-light-1440.png)              | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/meteo-forecast-dark-390.png)              | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/meteo-forecast-dark-1440.png)              |
| meteo           | About guide       | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/meteo-about-light-390.png)                 | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/meteo-about-light-1440.png)                 | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/meteo-about-dark-390.png)                 | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/meteo-about-dark-1440.png)                 |
| meteo           | Settings          | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/meteo-settings-light-390.png)              | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/meteo-settings-light-1440.png)              | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/meteo-settings-dark-390.png)              | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/meteo-settings-dark-1440.png)              |
| auth            | sign-in splash    | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/auth-main-light-390.png)                   | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/auth-main-light-1440.png)                   | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/auth-main-dark-390.png)                   | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/auth-main-dark-1440.png)                   |
| auth            | dashboard harness | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/auth-dashboard-harness-light-390.png)      | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/auth-dashboard-harness-light-1440.png)      | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/auth-dashboard-harness-dark-390.png)      | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/auth-dashboard-harness-dark-1440.png)      |
| counters.server | gallery           | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/counters-gallery-light-390.png)            | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/counters-gallery-light-1440.png)            | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/counters-gallery-dark-390.png)            | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/counters-gallery-dark-1440.png)            |
| counters.server | sign-in splash    | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/counters-main-light-390.png)               | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/counters-main-light-1440.png)               | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/counters-main-dark-390.png)               | [png](../../.plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family/screenshots/counters-main-dark-1440.png)               |

Recorded errors and limits:
- All 60 captures returned HTTP 200 with no horizontal overflow of the document element.
- Expected errors: the family-portal landing gets HTTP 401 from `/api/auth-token` while signed out.
  auth and counters get HTTP 404 from `/api/auth-token` without their backends.
- The counters gallery scrolls inside its own container, so captures show the first screen only.
- The family-portal footer is fixed, so full-page captures show it mid-page.
- Screenshots are stored as 256-color PNGs to keep the repository small.

---

## Open Questions for T0002
- Should todos.webapp and family-portal converge on one token value set, or share only names and mechanics?
- Which radius naming wins, given the one-step value shift between the two systems?
- Does the shared system ship behavior modules as a package, and how do server-rendered pages load them?
- How is the shared system consumed without a build step: a pinned URL, a package with an import map, or a copy script?
- Should family-portal adopt the external sprite, given that its Java widgets assume an in-page symbol block?
- Does the shared system own a site shell for family-portal and an app shell for todos.webapp, or neither?
- What loading pattern fills the gap: skeletons, `aria-busy`, or a status line like meteo's?
- Is the native `popover` attribute acceptable now, replacing the `hidden`-based popover of todos.webapp?
- Which internationalization contract do apps share: meteo's attributes, family-portal's catalog keys, or both?
- Does meteo adopt the shared system before or after it drops its quiz leftovers and gains reduced-motion support?
- When auth and counters are redesigned, do they move off support.js CSS entirely?
- Which verification tools become shared: the static token test, the browser verifier, or pixel diffs?
