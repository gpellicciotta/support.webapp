# ADR-0002: Looks
Defines look contents, look names, selection, app-local looks, icons, and the first looks.

- Status: Accepted on 2026-11-12, in review round 2 of the planning task.
- Date: 2026-11-11.
- **[Decided]** with the user on 2026-11-11: meteo's appearance becomes its own third look.
- **[Decided]** with the user on 2026-11-11: looks carry character names, never app names.
- **[Decided]** with the user on 2026-11-11: validation icons come from the shared sprite.
- **[Decided]** with the user on 2026-11-12: the look names `neutral`, `warm`, and `bright`.
- **[Decided]** with the user on 2026-11-12: one sprite per look, with a shared core id list.
- **[Decided]** with the user on 2026-11-12: every look variant uses `data-accent`, family-portal's seasons included.
- **[Decided]** with the user on 2026-11-12: `bright` pairs yellow with dark text, and meteo may override that value.

---

## Context
- The system must support several looks and gain new ones over time (DS-4).
- todos.webapp has a monochrome look: gray grounds, one navy signal color, Inter, and 8 px control radii.
- family-portal has a warmer look: navy and ivory, saffron and brick accents, Outfit and DM Sans, and pill buttons.
- meteo uses the system font stack and lets users pick a blue, yellow, or red accent.
- family-portal redefines two accent tokens per season through a `data-season` attribute.
- meteo redefines its main action tokens per accent through a `data-theme-color` attribute.
- All three draw 24-unit stroke icons in `currentColor`, but each with its own glyphs.
  todos.webapp has 29 symbols, family-portal 30 ids, and meteo 38 icons; their strokes are 2, 1.5 in a header, and 2.2.
- A look should serve several apps, so a name after one app misleads.

---

## Decision
### Look folder
A look is one folder, `src/looks/{{look}}/`:
- `primitives.css`: palette hues, font stacks, and the radius scale, private to the look.
- `look.css`: maps every look-owned contract token of [ADR-0001](ADR-0001-layer-model-and-token-contract.md) to primitives, in both themes.
- `fonts.css` and `fonts/`: self-hosted woff2 files with `font-display: swap`, plus their license file.
  A system font look needs neither.
- `icons.svg`: the look's sprite, which provides every core icon id listed in [contract.json](../../src/contract.json).
- `index.css`: the look's entry point, importing the look-neutral `style.css`, then the look's own files.

### Look names
Looks are named after their character, so several apps can share one.

**[Decided]** with the user on 2026-11-12:
- `neutral`: monochrome grays with one navy signal color and Inter, extracted from todos.webapp.
- `warm`: navy and ivory with saffron and brick accents, Outfit and DM Sans, and pill buttons, from family-portal.
- `bright`: the system font stack with a user-picked blue, yellow, or red accent, from meteo.

### Themes and look variants
- Every look defines both themes, `light` and `dark`; the `system` theme follows the operating system ([ADR-0001](ADR-0001-layer-model-and-token-contract.md)).
- A look may define variant attributes on the root element.
- A variant redefines only semantic tokens of that look, never component styles.
- Every look uses one variant attribute, `data-accent`, so apps and the gallery handle one hook.
- `warm` sets `data-accent` to `spring`, `summer`, `autumn`, or `winter`, replacing family-portal's `data-season`.
  Each value redefines `--color-accent` and `--color-accent-bg`, today's `--color-season-accent` and `--color-season-wash`.
- `bright` sets `data-accent` to `blue`, `yellow`, or `red`, replacing meteo's `data-theme-color`.
  Each value redefines the `--color-primary` tokens and `--color-on-primary`.
- Variant rules use a bare attribute selector, `[data-accent="{{value}}"]`, so the gallery can set one on a wrapper.

### App overrides
- An app may override a contract token's value in its own `style.css`, for a small deviation.
- A rule on `:root[data-accent="{{value}}"]` outranks the look's bare attribute rule, whatever the load order.
- The app's style guide lists each override with its reason; the look's token test does not cover app overrides.

### Selection
- An app imports exactly one look entry from its own `style.css`.
- No runtime look switch exists in apps; the gallery swaps the look stylesheet link instead.

### App-local looks
- An app with a one-off appearance keeps its own look folder in its own repository, copied from `_template`.
- It follows the same folder contract and imports the vendored `style.css`.
- `vendor` copies only package files, and `check.mjs` ignores the app's own look folder, listed in `design.json`.
- A look that a second app wants moves into the package, as the sharing rule of [ADR-0003](ADR-0003-components-and-patterns.md) says.

### Icons
- Components name their icons by id, `icon-{{name}}`, such as `icon-close`, `icon-more`, and `icon-undo`.
- [contract.json](../../src/contract.json) lists the core ids; the icon extraction task fixes the list from the shared components' needs.
- The core list includes the validation icons `icon-alert`, `icon-check`, and `icon-help`.
- A look may add glyphs beyond the core set; apps may add local glyphs in their own sprite.
- The token test fails when a look's sprite misses a core id.
- Each look's style guide page records where its glyphs come from and under which license.

### Adding a look
- Copy `src/looks/_template/`, fill in primitives and mapping, and add a page under `docs/specs/looks/`.
- The token test skips folders whose name starts with `_`.
- Add the look to the gallery switcher.
- The static token test must pass in both themes: every contract token defined, every contrast pair at WCAG 2.2 AA.
- A new look ships in a minor release.

### First looks, in roadmap order
- `neutral`, extracted from todos.webapp in phase 1.
- `warm`, extracted from family-portal in phase 2, with its seasons as a variant.
- `bright`, created for meteo in phase 4, with its accents as a variant and the system font stack.

---

## Options Considered
Look selection:
- **[Chosen]** One imported look per app: each app ships only its own palette and fonts.
- All looks scoped by a `data-look` attribute: rejected, because nobody needs runtime switching.
  Every app would also carry every look's fonts.
- One package per look: rejected, because looks and components could drift apart in version.

Look names:
- **[Chosen]** Character names: a name says what the look is like, so any app can pick it.
- App names, as first drafted: rejected by the user, because looks must serve more than one app.
- Neutral codes such as `look-a`: rejected, because a code says nothing about the look.

meteo's look:
- **[Chosen]** Its own third look: meteo keeps its identity, and the third look proves that adding a look works.
- The `neutral` look with an accent variant: rejected, because meteo would lose its look for a small saving.
- Deciding at meteo's phase: rejected, because it keeps the last phase of the roadmap vague.

App-local looks:
- **[Chosen]** A look folder in the app's own repository: one-off appearances stay out of the package.
- Every look in the package: rejected, because the package would grow with single-use looks.
- Overrides of shared semantic tokens in the app's stylesheet: kept for small deviations only, as the ui-guidelines allow.

Icons:
- **[Decided]** with the user on 2026-11-12: one sprite per look with a shared core id list.
  Components stay look-neutral while glyphs differ.
- One shared glyph set with a per-look `--icon-stroke` token: rejected by the user on 2026-11-12.
  It draws each glyph once, but looks would lose distinct glyph shapes.

Variant attribute:
- **[Decided]** with the user on 2026-11-12: `data-accent` for every look, with values the look defines.
- One attribute per look, such as `data-season` and `data-accent`: rejected, because apps and the gallery handle one hook per look.

---

## Consequences
- Every look multiplies the test matrix: looks, themes, and widths.
- meteo's yellow accent fails AA with white text: 2.94:1 on `#ca8a04` in light, and 3.19:1 on `#d97706` in dark.
- **[Decided]** with the user on 2026-11-12: `bright` pairs yellow with dark text, such as `#111827` at 6.04:1 and 5.57:1.
- Meteo may keep white yellow labels through an app override, listed as a deliberate AA exception:

  ```css
  :root[data-accent="yellow"] {
    --color-on-primary: #ffffff;
  }
  ```

- White passes AA on light blue `#1a56db` at 6.18:1 and red `#dc2626` at 4.83:1.
- **[Decided]** Implementation adjustment: light yellow uses `#b88000`, giving pressed icons 3:1 contrast against shared grounds.
- **[Decided]** Dark blue uses `#60a5fa`, and dark red uses `#f87171`, with dark labels for shared icon contrast.
  These implementation choices satisfy the shared contract; they are not additional user-approved palette decisions.
- Meteo's lossless adoption must assess action fills, hover and active fills, labels, links, focus, and shared grounds separately.
  Restoring source colors needs several documented app overrides, including light yellow and dark blue and red action roles.
  Keeping package values instead requires listing those visual changes explicitly in the adoption proof.
- The look template and the token test make a new look a checklist task, not a design system change.
- Seasons and accents stay look features; a look without variants defines none.
- family-portal renames `data-season` to `data-accent` in `portal.mjs`, `tokens.css`, its season sky styles, and its gallery.
- meteo renames `data-theme-color` to `data-accent` in `theme.js` and `style.css`.

---

## Evidence
- Palettes, fonts, and contrast: [Colors, Contrast, and Color Meaning](../analysis/ui-design-comparison.md#colors-contrast-and-color-meaning) and [Typography](../analysis/ui-design-comparison.md#typography).
- Glyph systems and symbol counts: [Icons](../analysis/ui-design-comparison.md#icons).
- Seasons and accents: [Theme Switching and Variants](../analysis/ui-design-comparison.md#theme-switching-and-variants).
- Sibling facts are `[V:C]`: first-party code read at the commits pinned in the comparison.
- The origin and license of the three apps' glyphs were not checked; each look's extraction task records them.
- Contrast ratios are `[D]`: computed on 2026-11-12 with the WCAG 2.2 relative luminance formula.
  The colors come from meteo's `css/style.css` at `8937c32`; the season tokens from family-portal's `tokens.css` at `1953f75`.
- Research context: written by Claude Opus 5.5 on 2026-11-11, knowledge cutoff June 2026, with web access to HTML pages.
