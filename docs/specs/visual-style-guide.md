# Visual Style Guide
Principles, token groups, patterns, and the shell of the shared design system, with links to the gallery.

- Style sheet: [style.css](../../src/css/style.css), imported by each look's `index.css`.
- Gallery: [visual-style-gallery.html](../../src/demo/visual-style-gallery.html), served by `python scripts/devops.py serve`.
- Component catalog: [components.md](components.md).
- Looks: [neutral](looks/neutral.md), [warm](looks/warm.md), [bright](looks/bright.md), and the [look template](../../src/looks/_template/README.md).

---

## Principles
- One system serves every sibling app; apps vendor it instead of copying files ([ADR-0005](../adrs/ADR-0005-distribution-and-versioning.md)).
- Components and pages use semantic role tokens only; primitives stay private to their look.
- Light and dark themes redefine semantic tokens only; `data-theme` overrides the system preference.
- Primary fills require 4.5:1 label contrast; primary icons and borders require 3:1 against their grounds.
- Use link tokens for text; primary is an action fill and icon role, without a universal text contrast guarantee.
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

### Dialogs and confirmations
Use the [Dialog section](../../src/demo/visual-style-gallery.html#dialog) for consequential actions and irreversible bulk operations.
- Modal: use a native `dialog.dialog` with a labeled title, body, and actions, following the catalog skeleton.
- In-place: use the [Inline confirmation section](../../src/demo/visual-style-gallery.html#inline-confirm) for a single item's question.
- Typed word: reuse `.field` inside the dialog; enable confirmation only when the input exactly matches the required word.
- Offer a backup before irreversible bulk deletion; explain what disappears and whether recovery exists.
- Prefer recycle-bin deletion with Undo when recovery is possible.

Import `openDialog` and `confirmDialog` from [dialog.js](../../src/js/dialog.js).
`openDialog(dialog, options)` returns a close function accepting a return value.
Options include `opener`, `initialFocus`, `modal` (default `true`), and `onClose(returnValue)`.
The element's owner document supplies focus management, including for injected test documents.
Escape and native cancellation return `cancel`; closing restores focus to a connected opener and removes listeners.
`confirmDialog` resolves `false` for `cancel` or an empty value, and `true` for any other value.
Use `data-dialog-close` buttons or a native `form method="dialog"` to return values.
Nested components can prevent their keyboard event to retain control of Escape.
Modal dialogs trap Tab; `modal: false` opens non-modally without trapping Tab.
Below 64rem, the modal becomes a full-height sheet; desktop dialogs remain centered.

Import `attachInlineConfirm(row, { onConfirm, onCancel })` from [inline-confirm.js](../../src/js/inline-confirm.js).
The row contains `data-inline-confirm-content`, its `data-inline-confirm-trigger`, and a hidden `data-inline-confirm` question group.
Label the group and use `data-inline-confirm-answer="yes"` and `data-inline-confirm-answer="no"` buttons.
Opening focuses the question; Keep or Escape restores the row and trigger focus.
Confirmation restores the row before invoking `onConfirm`; the caller performs the actual operation.
Call the returned controller's `destroy()` to restore content and remove listeners.
Typed confirmation remains caller-owned: check the exact word again in the action handler before executing an irreversible operation.

### Floating action button
Use the [Floating action button section](../../src/demo/visual-style-gallery.html#fab) for one primary action per screen.
Place a native `button.fab` directly inside `.app__overlays`, with `type="button"` and an action-specific `aria-label`.
Its icon is decorative; set `aria-hidden="true"` and `focusable="false"`.
Use `disabled` for unavailable actions and `hidden` while the action does not apply.
Prefer a labeled button when the icon cannot clearly convey the action.
The partial uses primary colors, a round shape, elevation, and the global focus outline.
The shell owns fixed positioning, bottom-bar offsets, safe-area spacing, and trailing content clearance.
Gallery specimens remain in flow; [shell-todos.html](../../src/demo/shell-todos.html) demonstrates overlay placement.
The extraction preserves todos.webapp's geometry and maps its signal tokens to the shared primary roles.

### Menus and popovers
Use the [Menu section](../../src/demo/visual-style-gallery.html#menu) for a short list of actions or one choice.
Use the [Popover section](../../src/demo/visual-style-gallery.html#popover) for a small panel, such as filter choices.
- Menu items are buttons with `role="menuitem"`, or `role="menuitemradio"` and `aria-checked` for a choice.
- Mark disabled items with `aria-disabled="true"`, and destructive items with `.menu__item--danger`.
- Separate item groups with `.menu__separator` and `role="separator"`.
- Give a popover a `.popover__title` and end it with `.popover__actions`.

Import `attachMenu(trigger, menu, options)` from [menu.js](../../src/js/menu.js).
Enter, Space, ArrowDown, or a click open the menu at its first item; ArrowUp opens it at the last.
Arrows move with wrap, Home and End jump, and a letter jumps to the next item starting with it.
Enter, Space, or a click select an item; Escape, Tab, or an outside click close the menu.
Options are `onSelect(item, event)`, `anchor` (default `true`), `onOpen`, and `onClose(reason)`.

Import `attachPopover(trigger, panel, options)` from [popover.js](../../src/js/popover.js).
Escape, an outside click, or focus leaving the panel closes it.
The platform's light dismiss handles outside clicks and reports them to `onClose` as `outside`.
Closing returns focus to the trigger unless another control took it.
Options are `anchor`, `align` (`start` or `end`), `initialFocus`, `onOpen`, and `onClose(reason)`.
Both controllers return `open`, `close`, `isOpen`, and `destroy`; `attachMenu` builds on `attachPopover`.

Import `anchorPanel(panel, trigger, gap, align)` from [anchor.js](../../src/js/anchor.js).
It places the panel below the trigger, or above it when room runs out, inside the viewport.
Its alignment mirrors for right-to-left text.

Menus and popovers use the native `popover` attribute, so open panels sit in the top layer above sticky bars.
- Give the panel `popover` and an `id`, and give its trigger button `popovertarget` with that `id`.
- Without JavaScript, the trigger still opens the panel, and a click outside or Escape closes it.
- Both modules add `popover="auto"` and link the trigger as invoker when the markup lacks them.
- The modules keep `anchorPanel` for placement and take over trigger clicks to manage focus.
- Closed panels no longer use `hidden`; the modules remove it, and the styles still hide it.

### Account menu
Use [the account menu](../../src/demo/visual-style-gallery.html#account-menu) at the end of the top bar ([ADR-0004](../adrs/ADR-0004-app-shell.md)).
- `.account-menu` holds a round `.account-menu__button` and a `.menu.account-menu__panel` with `popover`.
- The button shows an `.avatar--sm` face: initials when signed in, the `icon-user` glyph when signed out.
- The button's `title` and accessible name carry the user name, or `Not signed in`.
- An optional `.account-menu__name` line with `data-account-menu-name` and an id names the menu.
  Hide it with `aria-hidden="true"`; the menu's `aria-labelledby` still reads it.
- Items are links or buttons with `role="menuitem"`; the current route link carries `aria-current="page"`.

Import `attachAccountMenu(root, options)` from [account-menu.js](../../src/js/account-menu.js); it builds on `attachMenu`.
Options are `account` (`{name}` or nothing), `route`, `signedOutLabel`, `onSelect(item, event)`, `anchor`, `onOpen`, and `onClose`.
The controller adds `setAccount(account)` and `setRoute(route)` to the menu methods.
`setRoute` marks the item whose `href` attribute equals the route, so apps call it on navigation.
A link chosen by keyboard is followed through a click, which reaches `onSelect` once and can be cancelled.
`initialsOf(name)` returns the first letters of the first and last words.

**[Decided]** The menu aligns its end edge with the button, so `attachMenu` gained an `align` option.
**[Decided]** The name line sits inside the menu hidden from assistive technology, since a menu owns only items.
**[Decided]** The avatar image waits for the family-portal phase; the face shows initials or the person icon.

### Notifications and toasts
Notifications follow three tiers, after the counters notification ADR:
- Tier 1, banner: a lasting or urgent state, such as offline, an outage, or an account problem.
  Show the most severe banner only; danger banners alone use `role="alert"`.
- Tier 2, toast: brief feedback on the user's own action, with Undo when the action can be reversed.
- Tier 3, inbox: durable messages, such as broadcasts and finished exports; inboxes stay app-local.
- Toasts never enter the inbox, and banners never rotate on their own (WCAG 2.2.2).

Use the [Toast section](../../src/demo/visual-style-gallery.html#toast) for the toast specimens and a working toaster.
- Place one `.toast-region` with `role="region"` and `aria-label="Notifications"` in the shell overlay layer.
- Keep the message to one short sentence that names the object, such as "Task moved to the recycle bin."
- Offer at most one action, as a `.button--quiet`; Undo is the default label.
- Use a persistent toast only when the user must choose the moment, such as Reload for a new version.

Import `createToast(options)` from [toast.js](../../src/js/toast.js); `createToaster` is a deprecated alias.
- Options are `document`, `region`, `liveRegion`, `duration` (default 8000 ms), `max` (default 3), and `undoShortcut`.
- `show(message, settings)` returns a dismiss function.
  Settings are `onAction`, `actionLabel`, `persistent`, `undo`, and `onDismiss(reason)`.
- Reasons are `action`, `timeout`, `escape`, `overflow`, `dismiss`, and `destroy`.
- Expiry pauses while the pointer or focus is on the toast; Escape dismisses it, and focus returns.
- Toasts raised while a modal dialog is open wait until it closes, since the page behind is inert.
- With `undoShortcut`, Ctrl+Z or Cmd+Z outside text fields and modals runs the newest Undo.
  Other actions answer it only with `undo: true`; `undoLatest()` does the same from code.
- Action buttons carry `data-toast-action`: `undo` for Undo actions and `other` for the rest.
- For the counters rule of one toast at a time, pass `max: 1`, so a new toast replaces the old one.

**[Decided]** The defaults keep todos.webapp's 8 seconds for every toast and up to three at once.
- Counters' 4 seconds for plain feedback: rejected as a default, because short timeouts hinder slow readers.

Import `createLiveRegion(options)` from [live-region.js](../../src/js/live-region.js) once, at page load.
- It adds a polite `role="status"` region and an assertive `role="alert"` region, both `.visually-hidden`.
- `announce(message, { politeness })` clears the region first, so a repeated message is read again.
- Use the assertive region only for blocking errors; pass the announcer to `createToast` as `liveRegion`.

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

| Key           | Use it for                                                    | Avoid it for                                      | Gallery                                                                 |
| :------------ | :------------------------------------------------------------ | :------------------------------------------------ | :---------------------------------------------------------------------- |
| `button`      | One action with a text label; the default marks the main one. | Navigation, which is a link.                      | [Button](../../src/demo/visual-style-gallery.html#button)               |
| `icon-button` | A frequent action whose icon is clear; toggles add a state.   | Rare or ambiguous actions, which need a label.    | [Icon button](../../src/demo/visual-style-gallery.html#icon-button)     |
| `link-button` | A secondary action with an underlined text label.             | Navigation, which needs an anchor.                | [Link button](../../src/demo/visual-style-gallery.html#link-button)     |
| `chip`        | Short metadata, removable values, and filter toggles.         | Actions, which are buttons.                       | [Chip](../../src/demo/visual-style-gallery.html#chip)                   |
| `segmented`   | One choice among 2 to 5 short options, all visible.           | Longer lists, which use a select or radio group.  | [Segmented control](../../src/demo/visual-style-gallery.html#segmented) |
| `banner`      | A lasting state of the page, above its content.               | Short confirmations, which are toasts.            | [Banner](../../src/demo/visual-style-gallery.html#banner)               |
| `switch`      | A binary setting that applies immediately.                    | Choices submitted together, which use checkboxes. | [Switch](../../src/demo/visual-style-gallery.html#switch)               |

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

### Switch
Use a [switch](../../src/demo/visual-style-gallery.html#switch) for a binary setting that applies immediately.
Use a checkbox for choices submitted together. Keep the label unchanged when toggling.

**[Decided]** The catalog's native checkbox retains keyboard, form submission, and reset behavior without JavaScript.
Apply `role="switch"` to the input. Native `checked` owns the state; do not duplicate it with `aria-checked`.
Listen for the native `change` event when applying a setting.
The thumb changes position, so color alone never conveys the state.
Logical properties support RTL. No animation is used.

The label provides a 44 px target. Hover, active, focus, disabled, and invalid specimens use semantic tokens.
Use native `disabled`, including disabled fieldsets. Connect invalid controls to visible error text with `aria-describedby`.
Keyboard focus overrides the danger outline. Forced colors preserve the track, thumb, and focus outline.
Forced colors use `Highlight` for focus and a dashed `CanvasText` outline for invalid controls.

### Fields and forms
Fields, choices, and forms follow todos.webapp's field contract, extended with counters' help and validation states.

| Key             | Use it for                                                        | Avoid it for                                      | Gallery                                                                 |
| :-------------- | :---------------------------------------------------------------- | :------------------------------------------------ | :---------------------------------------------------------------------- |
| `field`         | One labeled text input, textarea, or select with its messages.    | Choices among a few options, which are radios.    | [Field](../../src/demo/visual-style-gallery.html#field)                 |
| `checkbox`      | An independent yes or no choice, alone or in a group.             | Settings that apply at once, which are switches.  | [Checkbox](../../src/demo/visual-style-gallery.html#checkbox)           |
| `radio`         | One choice among options that need a full label each.             | Two to five short options, which are segmented.   | [Radio](../../src/demo/visual-style-gallery.html#radio)                 |
| `field-group`   | Checkbox groups, radio groups, and related fields under a legend. | A single control, which needs no fieldset.        | [Field group](../../src/demo/visual-style-gallery.html#field-group)     |
| `form`          | Data the user submits, validated on blur and on submit.           | Filters that apply at once, which need no submit. | [Form](../../src/demo/visual-style-gallery.html#form)                   |
| `error-summary` | The list of invalid fields after a failed submit.                 | A single field error, which stays on the field.   | [Error summary](../../src/demo/visual-style-gallery.html#error-summary) |

- `createField(doc, options)` builds the skeleton; `attachField(element, options)` enhances server-rendered markup.
- `createField` keeps todos.webapp's `{element, control, setError}` result, so its adoption stays lossless.
- The help toggle is a real button with `aria-expanded` and `aria-controls`; collapsed help stays described.
- The counter shows the length against `maxlength` and joins `aria-describedby`.
- Invalid: `aria-invalid` on the control, a danger border, and an error line with the alert icon.
- Pending: `aria-busy` on the field, and a muted status line with the more icon.
- Valid: a success border, and a status line with the check icon and a message.
- An edit discards a pending or valid state; an overtaken check then checks the current value instead.
- `createField` always adds the hidden status line, so created fields show pending and valid states too.
- Field messages reach screen readers through one shared polite live region per document.
- Checkboxes and radios keep the native input, with `accent-color` in the primary color and the global focus ring.
- Their label row is the 44 px target; an invalid checkbox draws a danger outline beside the group's error text.
- `attachForm` sets `aria-busy` on the form and `aria-disabled` on its submit buttons while sending.
- One submit runs at a time, from validation through sending, so a double submit never sends twice.
- A value edited while a submit validates triggers another validation, so every sent value was checked.
- After a failed submit, the error summary takes `role="alert"` and focus, and each link focuses its field.
- The static error summary specimen omits `role="alert"`, so the gallery announces nothing on load.

**[Decided]** The pending state uses the `icon-more` glyph, because the core glyph contract has no progress glyph.
- A new required glyph: rejected, because every look and the look template would need it first.

**[Decided]** The counter joins `aria-describedby`, as in todos.webapp, so the catalog skeleton drops its `aria-hidden`.
- A hidden counter: rejected, because the task goal names counters among the described parts.

**[Decided]** The valid state needs no attribute: a visible status line on a field without `aria-busy` styles it.
- A `data-field-state` attribute: rejected, because ADR-0003 keeps state in native and ARIA attributes.

**[Decided]** Unit tests use happy-dom as their simulated DOM, as todos.webapp does.
- A hand-written fake DOM: rejected, because forms need events, focus, validity, and `FormData`.

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

### Lists and data tables
Use [lists](../../src/demo/visual-style-gallery.html#list) for collections and term/value descriptions.
Plain collections use `.list` and `.list__item`; action rows compose `.list.row__list` with the row base.
Use native `ol.list` for sequences; it retains decimal markers.
Add `role="list"` to markerless unordered lists to preserve list exposure across accessibility implementations.
Description pairs use `.list.list--definitions`, `.list__term`, and `.list__value`; pairs stack below 36rem viewport width.
Long text wraps; nested controls retain their own focus and disabled states.
Use [data tables](../../src/demo/visual-style-gallery.html#table) when values share column relationships.
Keep the native table display, a visible `.table__caption`, and scoped column and row headers.
Use `.table__numeric` for end-aligned numbers with tabular figures.
Use `.table--dense` to reduce cell padding in compact data views; nested controls retain their own touch targets.
Wrap wide tables in `.table__scroll`, with `role="region"`, `tabindex="0"`, and `aria-labelledby` naming the caption.
The wrapper contains horizontal overflow; its keyboard focus uses the global outline.
Tab visits the wrapper and nested controls; static cells stay outside the tab order.
Use existing loading, banner, and empty-state patterns for request outcomes.
Use interactive selection components for bulk selection; these static components provide no grid keyboard model.

**[Decided]** Tables share row tokens while retaining native table layout, because flex rows would break column alignment.
**[Decided]** A focusable, named scroll wrapper makes wide data keyboard accessible without converting cells into widgets.

### Collapsible
Use [the collapsible](../../src/demo/visual-style-gallery.html#collapsible) to show and hide a secondary group, such as done tasks.
- `.collapsible` holds a `.collapsible__toggle` button and the `.collapsible__panel` it names in `aria-controls`.
- The toggle carries `aria-expanded`; an optional `.collapsible__icon` chevron turns while expanded.
- Mark a collapsed panel `hidden`, or `hidden="until-found"` so find in page can reveal it.
- Render panels with essential content expanded, since collapsed panels stay closed without JavaScript.

Import `attachCollapsible(root, options)` from [collapsible.js](../../src/js/collapsible.js).
The toggle is a native button, so a click, Enter, or Space toggles it.
The option `onToggle(expanded)` runs after each change, such as to keep one row of a group open.
The controller returns `expand`, `collapse`, `toggle`, `isExpanded`, and `destroy`.

**[Decided]** The package ships single collapsibles; apps build todos.webapp's one-open accordion with `onToggle`.

### Cards, icon tiles, and avatars
Use [cards](../../src/demo/visual-style-gallery.html#card) for grouped content or one linked destination.
Compose `.card__media`, `.card__body`, `.card__title`, and `.card__text`; select headings appropriate to the page hierarchy.
Link cards must not contain nested controls; static cards may contain buttons.
Use rows instead for dense collections.
Use [icon tiles](../../src/demo/visual-style-gallery.html#icon-tile) as decorative containers, never standalone controls.
Sizes are `--sm`, `--md` (default), and `--lg`; tones are `--tone-1` through `--tone-4`.
Tile sizes use spacing tokens, independent of controls, with distinct 32, 48, and 64 pixel dimensions in every look.
Hide decorative icons with `aria-hidden="true"`.
Use [avatars](../../src/demo/visual-style-gallery.html#avatar) for identity, with the same size and tone modifiers.
Use an image with meaningful alt text, authored initials with `.avatar--initials`, or the `icon-user` fallback.
Give standalone fallback spans `role="img"` and an accessible name; hide decorative avatars beside visible names.
Applications choose fallback markup when images are absent or fail; CSS does not detect broken image requests.
Use `.avatar-stack` to overlap portraits, with an optional named group and individually named members.
Unmodified stack members use responsive sizing; explicit `avatar--sm`, `avatar--md`, and `avatar--lg` modifiers preserve their normal dimensions.
Avoid stacks for large rosters, where a list provides clearer navigation.

**[Decided]** Avatar sizes preserve family-portal dimensions through existing space tokens; stacks preserve its responsive size and ground rings.
**[Decided]** Optional tones fall back to sunken surfaces and text; shared radius roles replace source primitive radii.
**[Decided]** Cards use the global focus outline; initials and icon fallbacks extend the source to satisfy the catalog.
**[Decided]** Static card buttons stretch with their flex container; applications own action alignment instead of cross-component package selectors.
**[Decided]** The placeholder portrait uses a fixed mid-gray fill for visibility in light and dark themes.

## Patterns
No pattern is built yet.
Each pattern task adds its intent, when to use it, when not to, and a gallery link here.

---

## Shell
[shell.css](../../src/css/shell.css) lays out the app shell of [ADR-0004](../adrs/ADR-0004-app-shell.md).
Copy an adopter skeleton from [components.md](components.md#app-shell) and keep only the areas you use.
Open the four demo pages from the [App shell section](../../src/demo/visual-style-gallery.html#shell) of the gallery.

Areas are direct children of `<body class="app">`; only `app__main` is required:
- `app__top-bar`, with `app__title` or `app__brand`, `app__menu-button` or `app__breadcrumb`, and `app__top-actions`.
- `app__sidebar` and `app__bottom-nav`, both `<nav aria-label="Main">`, with `app__nav-list` and `app__nav-item` links.
- `app__banners`, which takes no room while every banner inside it is hidden.
- `app__main`, with `id="main"` and `tabindex="-1"` as the skip link target.
- `app__action-bar`, the screen's main actions or a footer, at the bottom in both scroll modes.
- `app__side-panel`, shown by removing `hidden`.
- `app__overlays`, which holds the `.toast-region` and has no box of its own.

Layout rules:
- The grid drops the tracks of absent areas through `:has()`, so no class names the present areas.
- Below 64rem the sidebar hides, the bottom bar shows, and the side panel covers the window as a sheet.
- From 64rem the sidebar and the side panel sit beside the main column, and the bottom bar hides.
- Media queries cannot read custom properties, so 64rem is a constant; components use container queries instead.
- `app--scroll-main`, the default without a scroll class, makes the main area the scroll container between the bars.
- `app--scroll-page` scrolls the document; the top bar, the action bar, and the bottom bar stick.
- `app--width-reading`, `app--width-narrow`, and `app--width-content` center the banners, main area, and action bar.
- The toast region sits above the action bar and the bottom bar.
- Mark the current navigation entry, and the last breadcrumb link, with `aria-current="page"`.
- Add `viewport-fit=cover` to the viewport meta tag, so bars pad with the safe-area insets of phones.

`shell.css` is the only package stylesheet with fixed or sticky positions; it also pins the toast region.
The `.skip-link` sits above the top edge until focused, keeping its 44 px target.

**[Decided]** The width options center the banners and action bar with the main area, so their content lines up.
- Centering the main area alone: rejected, because meteo's actions would then span the full window.

**[Decided]** Counters moves its wide-screen actions into `app__top-actions` in its own code; the shell adds no option.
- ADR-0004 describes that move as counters' behavior, not as a shell feature, so the counters demo keeps the action bar.
- A shell option for the move: rejected, because ADR-0004 defines no such option and only counters needs it.

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
- [field.test.js](../../tests/unit/field.test.js) and [form.test.js](../../tests/unit/form.test.js) check the field and form modules in happy-dom.
- [field.spec.js](../../tests/e2e/field.spec.js) and [form.spec.js](../../tests/e2e/form.spec.js) drive the gallery fields and form by keyboard.
- [toast.test.js](../../tests/unit/toast.test.js) and [live-region.test.js](../../tests/unit/live-region.test.js) check Undo, expiry, Ctrl+Z, modal holding, and announcements.
- [toast.spec.js](../../tests/e2e/toast.spec.js) raises gallery toasts and checks Undo by pointer and keyboard.
- [collapsible.test.js](../../tests/unit/collapsible.test.js) and [account-menu.test.js](../../tests/unit/account-menu.test.js) check both modules in happy-dom.
- [collapsible.spec.js](../../tests/e2e/collapsible.spec.js) and [account-menu.spec.js](../../tests/e2e/account-menu.spec.js) drive both by pointer and keyboard.
- [shell.spec.js](../../tests/e2e/shell.spec.js) checks areas, scroll owners, sticky bars, widths, and the side panel on each demo page.
- [verify-ui.spec.js](../../tests/e2e/verify-ui.spec.js) is the browser verifier, ported from family-portal's `verify-ui.py`.

The verifier runs the gallery and each shell demo page in each look at 390 and 1440 px, with system and explicit themes:
- HTTP 200, every stylesheet and import loaded, no font errors, no console errors, and no failed requests.
- No horizontal scroll.
- Every `<use>` reference resolves to a symbol in a loaded sprite file.
- Rendered text contrast of 4.5:1, or 3:1 for large text.
- Targets of at least `--target-min`, except links inside sentences.
- A `:focus-visible` outline of at least 2 px at 3:1, or a focus shadow, on every interactive element.
- A screenshot per look, theme, and width in the Playwright output folder.

Run it with `npx playwright test tests/e2e/verify-ui.spec.js`.

## Tabs
Use [tabs](../../src/demo/visual-style-gallery.html#tabs) for related, preloaded panels, such as settings categories.
Use links for navigation between pages; use a collapsible for independently expandable sections.

Import `attachTabs(root)` from [tabs.js](../../src/js/tabs.js) after rendering the [catalog skeleton](components.md#tabs).
The root, list, buttons, and panels carry `data-tabs-root`, `data-tabs-list`, `data-tabs-tab`, and `data-tabs-panel`.
Keep IDs unique across the page, label the tablist, and connect tabs and panels through ARIA references.
Only the selected enabled tab participates in the tab order.
Left and Right wrap across enabled tabs; Home and End select the first and last enabled tabs.
Focus automatically selects a preloaded panel; Tab then leaves the tablist.
Native button activation supports pointer, Enter, and Space.
The selected underline and bold label distinguish selection from the global focus outline.
Disabled tabs use native `disabled`; narrow lists scroll horizontally without widening the page.
No animation is applied, including under reduced motion.
For script-free pages, omit panel `hidden` attributes so every panel remains readable.
The controller's `destroy()` removes listeners and restores authored selection, tab order, and panel visibility.
Destroy before replacing tab markup; reattach after changing the tab or panel collection.

## Loading
Use the [loading specimens](../../src/demo/visual-style-gallery.html#loading) for ordinary loads, slow lists, and completed content.
**[Decided]** Keep the polite status outside the busy content, preventing busy-state suppression of progress announcements.
**[Decided]** Skeleton rows stay static for every motion preference; they communicate layout without requiring motion.
Use skeletons only for slow list requests; ordinary loads need only a visible status and busy content region.
Applications choose the slow threshold from their request behavior; the package supplies no timer or request wrapper.
Mount an empty status before a request, then update its localized text without replacing the live region.
Set content to aria-busy=true during updates; preserve useful existing content during refresh.
Replace placeholders with results, an empty state, or an error, then clear busy and update the status.
Never put controls inside aria-hidden skeletons. Preserve focus, and avoid repeated announcements for each placeholder.
See [components.md](components.md#loading) for the markup contract.
