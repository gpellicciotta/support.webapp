# Visual Style Guide
Principles, token groups, patterns, and the shell of the shared design system, with links to the gallery.

- Style sheet: [style.css](../../src/css/style.css), imported by each look's `index.css`.
- Gallery: [visual-style-gallery.html](../../src/demo/visual-style-gallery.html), served by `python scripts/devops.py serve`.
- Component catalog: [components.md](components.md).
- Looks: [neutral](looks/neutral.md).

---

## Principles
- One system serves every sibling app; apps vendor it instead of copying files ([ADR-0005](../adrs/ADR-0005-distribution-and-versioning.md)).
- Components and pages use semantic role tokens only; primitives stay private to their look.
- Light and dark themes redefine semantic tokens only; `data-theme` overrides the system preference.
- Every text pair reaches WCAG 2.2 AA, every target reaches 44 px, and every control shows its focus.
- A look holds palette, fonts, shapes, and icons; its variants redefine semantic tokens only ([ADR-0002](../adrs/ADR-0002-looks.md)).

---

## Token Groups
[contract.json](../../src/contract.json) lists every token with its group and owner.
Base tokens live in [base.css](../../src/css/base.css); look tokens live in each look's `look.css`.
The gallery shows each group in the selected look and theme, with computed values.

| Group               | Intent and usage                                                       | Gallery                                                                                    |
| :------------------ | :--------------------------------------------------------------------- | :----------------------------------------------------------------------------------------- |
| Grounds             | Page and surface backgrounds; pick by elevation and state.             | [Grounds](../../src/demo/visual-style-gallery.html#tokens-grounds)                         |
| Text                | Body, muted, disabled, and link text; never use muted for key content. | [Text](../../src/demo/visual-style-gallery.html#tokens-text)                               |
| Lines and focus     | Dividers, control borders, and the focus ring color.                   | [Lines and focus](../../src/demo/visual-style-gallery.html#tokens-lines-and-focus)         |
| Main action         | The one primary action per view, with its states.                      | [Main action](../../src/demo/visual-style-gallery.html#tokens-main-action)                 |
| Danger              | Destructive actions and errors only, never decoration.                 | [Danger](../../src/demo/visual-style-gallery.html#tokens-danger)                           |
| Success and warning | Outcomes and cautions; pair the color with a label or icon.            | [Success and warning](../../src/demo/visual-style-gallery.html#tokens-success-and-warning) |
| Overlay             | Shadow tint and dialog backdrop.                                       | [Overlay](../../src/demo/visual-style-gallery.html#tokens-overlay)                         |
| Optional per look   | Accents, tones, and statuses a look may define; guard each use.        | [Optional per look](../../src/demo/visual-style-gallery.html#tokens-optional-per-look)     |
| Fonts               | Body, heading, and mono stacks, and the weight steps.                  | [Fonts](../../src/demo/visual-style-gallery.html#tokens-fonts)                             |
| Type                | The type scale, line heights, and letter spacing.                      | [Type](../../src/demo/visual-style-gallery.html#tokens-type)                               |
| Space               | Gaps, padding, and margins; use scale steps, never raw lengths.        | [Space](../../src/demo/visual-style-gallery.html#tokens-space)                             |
| Radius roles        | Corner radii by role, so a look can reshape all controls at once.      | [Radius roles](../../src/demo/visual-style-gallery.html#tokens-radius-roles)               |
| Lines               | Border widths and focus ring geometry.                                 | [Lines](../../src/demo/visual-style-gallery.html#tokens-lines)                             |
| Elevation           | Shadows for raised surfaces and overlays.                              | [Elevation](../../src/demo/visual-style-gallery.html#tokens-elevation)                     |
| Layers              | Stacking order; use the named layer, never a raw `z-index`.            | [Layers](../../src/demo/visual-style-gallery.html#tokens-layers)                           |
| Motion              | Durations, easing, and offsets; reduced motion zeroes the durations.   | [Motion](../../src/demo/visual-style-gallery.html#tokens-motion)                           |
| Sizes               | Touch targets, control heights, and icon sizes.                        | [Sizes](../../src/demo/visual-style-gallery.html#tokens-sizes)                             |
| Widths              | Content, column, and panel widths, and the page gutter.                | [Widths](../../src/demo/visual-style-gallery.html#tokens-widths)                           |

---

## Components
[components.md](components.md) is the catalog: keys, markup skeletons, variants, states, and accessibility minimums.
Each component gains a gallery section `id="{{key}}"` in the task that builds it.

### Icons
Each look ships one sprite, `looks/{{look}}/icons.svg`, with one 24-unit `<symbol>` per glyph ([ADR-0002](../adrs/ADR-0002-looks.md#icons)).
Every sprite provides the core ids that `icons` in [contract.json](../../src/contract.json) lists.
Components reference only core ids; apps may add local glyphs in their own sprite.

- Draw an icon with `<svg class="icon" aria-hidden="true" focusable="false"><use href="{{sprite}}#icon-{{name}}"/></svg>`.
- The plain class draws the md size; `icon--sm`, `icon--md`, and `icon--lg` pick a size token.
- The lg size uses `--icon-stroke-thin` when the look defines it.
- Glyphs carry no color; they follow the text color through `currentColor`.
- An icon that carries meaning alone sets `role="img"` and `aria-label` instead of `aria-hidden`.
- In script, call `setSpriteUrl` once with the vendored sprite path, then `createIcon(document, 'close')`.
- `createIcon` takes the name without the `icon-` prefix, plus `size`, `className`, and `label` options.
- `spriteIcon` is the deprecated todos.webapp alias; it goes away in the next minor release.
- The [Icon section](../../src/demo/visual-style-gallery.html#icon) shows every size and every glyph.

**[Decided]** `createIcon` throws until the app calls `setSpriteUrl`.
- A default path: rejected, because a wrong path renders blank icons without any error.
- A default of the neutral sprite: rejected, because other looks would silently show neutral glyphs.

**[Decided]** The core list adds `icon-chevron-down` for disclosure toggles, such as the collapsible and select menus.

### Focus
- One global `:focus-visible` outline in `--color-focus` marks focus, from [reset.css](../../src/css/reset.css).
- Danger buttons and danger icon buttons draw the ring in `--color-danger`.
- The ring is an outline, so it stays visible in forced colors mode, where shadows disappear.
- `.is-hover`, `.is-focus`, and `.is-active` force a state on gallery specimens only; apps never set them.

### Controls
Buttons, chips, and segmented controls keep a 44 px target in every variant, including the small button.

| Key           | Use it for                                                    | Avoid it for                                     | Gallery                                                                 |
| :------------ | :------------------------------------------------------------ | :----------------------------------------------- | :---------------------------------------------------------------------- |
| `button`      | One action with a text label; the default marks the main one. | Navigation, which is a link.                     | [Button](../../src/demo/visual-style-gallery.html#button)               |
| `icon-button` | A frequent action whose icon is clear; toggles add a state.   | Rare or ambiguous actions, which need a label.   | [Icon button](../../src/demo/visual-style-gallery.html#icon-button)     |
| `link-button` | A secondary action with an underlined text label.             | Navigation, which needs an anchor.               | [Link button](../../src/demo/visual-style-gallery.html#link-button)     |
| `chip`        | Short metadata, removable values, and filter toggles.         | Actions, which are buttons.                      | [Chip](../../src/demo/visual-style-gallery.html#chip)                   |
| `segmented`   | One choice among 2 to 5 short options, all visible.           | Longer lists, which use a select or radio group. | [Segmented control](../../src/demo/visual-style-gallery.html#segmented) |
| `banner`      | A lasting state of the page, above its content.               | Short confirmations, which are toasts.           | [Banner](../../src/demo/visual-style-gallery.html#banner)               |

- Button variants: default, `--secondary`, `--danger`, the `--secondary.button--danger` outline, `--quiet`, `--inverse`, and `--small`.
- A filled danger button confirms a delete; the danger outline starts one.
- `aria-disabled="true"` keeps a disabled button focusable, for example to explain why it is disabled.
- `--inverse` uses `--color-inverse`, or the text color when the look leaves it undefined.
  A look that defines `--color-inverse` must give it 4.5:1 against `--color-surface`.
- Icon buttons need an `aria-label` naming the action and its object, such as "Delete Groceries".
- Link buttons keep family-portal's underlined label, transparent background, and link colors, with a 44 px target.
  The underline offset stays at `0.2em`, matching the source component.
  Hover and active share `--color-link-hover`; focus uses the global outline, and native `disabled` prevents activation.
- Toggles set `aria-pressed`; pressed toggles take the selected ground and a primary border.
- Static chips are spans and never tab stops; filter chips are buttons with `aria-pressed`.
- Overdue chips pair the danger color with an alert icon and a word, never color alone.
- A segmented control is a `fieldset` of native radios, so arrow keys move the choice.
  Disable one option with `disabled` on its radio, or the whole control with `disabled` on the fieldset.
- Banners come in info, success, warning, and danger; only danger banners use `role="alert"`.
- Forced colors mode drops shadows, so pressed chips and toggles thicken their border, and checked options gain one.

**[Decided]** One partial per key, so the icon button gets `icon-button.css` beside `button.css`.
- One shared controls file: rejected, because the naming link of ADR-0003 maps each key to its own file.

**[Decided]** The segmented control keeps todos.webapp's `segmented__options` wrapper, and the catalog skeleton gains it.
- Grid on the fieldset itself: rejected, because the rendered legend would sit inside the sunken track.

**[Decided]** The banner error variant is `banner--danger`, matching `button--danger` and the danger tokens.
- `banner--error`, as in todos.webapp: rejected, because two names would mean the same role.

---

### Empty state
Use [the empty state](../../src/demo/visual-style-gallery.html#empty-state) when a view has no content or search results.
Compose `.empty-state` with an optional decorative `.icon.icon--lg`, `.empty-state__title`, `.empty-state__text`, and optional `.empty-state__actions`.
Choose the heading level for the surrounding page hierarchy; hide decorative icons from assistive technology.
Provide zero, one, or two actions using existing button components.
The two-action maximum is an authoring contract; CSS never hides extra controls.
Use a banner for errors or loading feedback instead.

### Row base
Use [the row base](../../src/demo/visual-style-gallery.html#row) for dense items with optional trailing actions.
Use native list markup: `.list.row__list` contains `.row`, with `.row__main` and optional `.row__actions`.
The `.row__list` class establishes the `row-list` size container and removes default list spacing and markers.
Below 36rem of container width, actions wrap below the content and remain keyboard reachable.
Long content wraps without truncation; action buttons retain their existing focus, disabled, and touch-target behavior.
Task status, drag handles, selection, navigation, and row interactions remain app-local.
Use a table when columns need shared alignment across rows.

## Patterns
No pattern is built yet.
Each pattern task adds its intent, when to use it, when not to, and a gallery link here.

---

## Shell
The app shell task adds its areas, scroll modes, and demo pages here ([ADR-0004](../adrs/ADR-0004-app-shell.md)).

---

## Gallery
- The look switcher swaps the look stylesheet link; the theme switch sets or removes `data-theme`.
- Specimens use classes only; [gallery.css](../../src/demo/gallery.css) maps each token to `--specimen`.
- The gallery shows placeholder content only.
- Add a look to `looks` in [gallery.js](../../src/demo/gallery.js) and to the look select.
- The look switcher also points every gallery icon at the selected look's sprite.
- No look defines a `data-accent` variant yet, so the gallery has no variant switch.

**[Decided]** One mapping rule per token in `gallery.css`, such as `.token--color-bg { --specimen: var(--color-bg); }`.
- Inline `style` attributes: rejected, because the ui-guidelines forbid inline styles on specimens.
- Specimens built by script from `contract.json`: rejected, since script-set custom properties are inline styles too.
- The gallery unit test fails when a contract token lacks a specimen or a mapping rule.

---

## Verification
- [tokens.test.js](../../tests/unit/tokens.test.js) checks the contract, contrast pairs, fallbacks, and raw colors statically.
- [gallery.test.js](../../tests/unit/gallery.test.js) checks the switchers and that the gallery covers every token.
- [icon.test.js](../../tests/unit/icon.test.js) checks `createIcon`, the icon class, and that every look sprite holds the core ids.
- [verify-ui.spec.js](../../tests/e2e/verify-ui.spec.js) is the browser verifier, ported from family-portal's `verify-ui.py`.

The verifier runs each look at 390 and 1440 px, with system and explicit themes:
- HTTP 200, every stylesheet and import loaded, no font errors, no console errors, and no failed requests.
- No horizontal scroll.
- Every `<use>` reference resolves to a symbol in a loaded sprite file.
- Rendered text contrast of 4.5:1, or 3:1 for large text.
- Targets of at least `--target-min`, except links inside sentences.
- A `:focus-visible` outline of at least 2 px at 3:1, or a focus shadow, on every interactive element.
- A screenshot per look, theme, and width in the Playwright output folder.

Run it with `npx playwright test tests/e2e/verify-ui.spec.js`.
