# Component Catalog
Every component the design system provides, with its key, source, owning task, HTML skeleton, and accessibility minimum.
[ADR-0003](../adrs/ADR-0003-components-and-patterns.md) records the decisions; [naming.md](naming.md) defines how each key names its files.

- Status: Accepted on 2026-11-12, in review round 2 of the planning task.
- **[Decided]** with the user on 2026-11-11: badge, floating action button, list and data table, tabs, progress bar and spinner, and multi-select join the first set.
- **[Decided]** with the user on 2026-11-11: forms, validation states, the help toggle, the error summary, and field groups are part of T0008.
- **[Decided]** with the user on 2026-11-11: validation icons come from the shared sprite.

---

## How to Read This Catalog
- Every component in the tables belongs to the first set: the initial set of ADR-0003, delivered across phases 1 and 2.
- Source names the app whose implementation is the reference; "new design" means no sibling app has one.
- Task names the owning task; "to create" means the task is created with the revised roadmap.
- The skeletons are normative: CSS, JavaScript, server templates, and the generator all build on them.
- Each skeleton heading is the component key, so `components.md#dialog` links to the dialog.
- Every component gets a gallery section, `id="{{key}}"`, before its task ends.
- [contract.json](../../src/contract.json) lists the keys; the token test checks that each has a CSS partial, a gallery section, and a skeleton here.
- `icons.svg` in a skeleton stands for the path of the app's vendored look sprite.

## Starter App Minimum
A generated app ([ADR-0006](../adrs/ADR-0006-generator.md)) needs at least these:
- The shell, button, field, form, dialog, toast with the live region, menu, empty state, icon, and theme switch.
- The offline page and the service worker update toast, as shared patterns.

---

## Catalog
### Controls
| Key           | Component                      | Source              | Module and functions                     | Variants and states                                                               | Accessibility minimum                                     | Task      |
| :------------ | :----------------------------- | :------------------ | :--------------------------------------- | :-------------------------------------------------------------------------------- | :-------------------------------------------------------- | :-------- |
| `button`      | Button                         | todos.webapp        | none                                     | default, secondary, danger, quiet, inverse, small; hover, active, focus, disabled | native button; visible focus; 44 px target                | T0007     |
| `icon-button` | Icon button                    | todos.webapp        | none                                     | default, danger; pressed toggle                                                   | native button; `aria-label`; `aria-pressed` for toggles   | T0007     |
| `link-button` | Link button                    | family-portal       | none                                     | default; hover, focus-visible, active, disabled                                   | native button; visible focus; 44 px target                | T0034     |
| `fab`         | Floating action button         | todos.webapp        | none                                     | one per screen, in the shell's overlay layer                                      | native button; `aria-label`; 44 px target                 | to create |
| `field`       | Field: input, textarea, select | todos.webapp, meteo | `field.js`: `createField`, `attachField` | hint, counter, help, status, error; invalid, pending, disabled, read-only         | label for the control; `aria-invalid`; `aria-describedby` | T0008     |
| `checkbox`    | Checkbox                       | todos.webapp        | none                                     | checked, indeterminate, disabled, invalid                                         | native input inside its label                             | T0008     |
| `radio`       | Radio                          | todos.webapp        | none                                     | checked, disabled                                                                 | native radios inside a field group                        | T0008     |
| `switch`      | Switch                         | new design          | none                                     | off, on, disabled, invalid                                                        | native checkbox with `role="switch"`                      | T0019     |
| `chip`        | Chip                           | todos.webapp        | none                                     | static, removable, filter toggle; overdue tone                                    | button when interactive; the remove button has a label    | T0007     |
| `segmented`   | Segmented control              | todos.webapp        | none                                     | 2 to 5 options; selected, disabled                                                | fieldset of native radios with a legend                   | T0007     |
| `badge`       | Badge                          | meteo               | none                                     | neutral, count, success, warning, danger                                          | text, never color alone                                   | to create |

### Forms and Selection
| Key             | Component                      | Source                 | Module and functions                             | Variants and states                                             | Accessibility minimum                                                            | Task                    |
| :-------------- | :----------------------------- | :--------------------- | :----------------------------------------------- | :-------------------------------------------------------------- | :------------------------------------------------------------------------------- | :---------------------- |
| `form`          | Form                           | counters, todos.webapp | `form.js`: `attachForm`, using `field.js`        | idle, busy, failed submit; actions row                          | native form; Enter submits; busy state announced                                 | T0008                   |
| `field`         | Field help toggle              | counters, new design   | `field.js`: `attachField`                        | collapsed, expanded                                             | button with `aria-expanded` and `aria-controls`; help text in `aria-describedby` | T0008                   |
| `field`         | Validation states              | counters, todos.webapp | `field.js`: `setError`, `setValid`, `setPending` | valid, invalid, pending; icon and text, never color alone       | `aria-invalid`; `aria-busy` while pending; message in the live region            | T0008                   |
| `error-summary` | Error summary                  | new design             | filled by `attachForm`                           | hidden; shown after a failed submit, one link per invalid field | focus moves to it; links jump to the fields                                      | T0008                   |
| `field-group`   | Field group                    | counters               | none                                             | checkbox group, radio group, related fields                     | native fieldset and legend                                                       | T0008                   |
| `selection`     | Multi-select with bulk actions | new design             | `selection.js`: `attachSelection`                | none, some, or all selected; bar with count and actions         | native checkboxes; Shift selects a range; count announced                        | to create, design first |

### Containers
| Key           | Component   | Source        | Module and functions                  | Variants and states                                       | Accessibility minimum                              | Task      |
| :------------ | :---------- | :------------ | :------------------------------------ | :-------------------------------------------------------- | :------------------------------------------------- | :-------- |
| `card`        | Card        | family-portal | none                                  | static, link card with hover lift, with media             | a link card nests no other controls                | T0018     |
| `icon-tile`   | Icon tile   | family-portal | none                                  | tones 1 to 4; sizes sm, md, lg                            | decorative icon is `aria-hidden`                   | T0018     |
| `row`         | Row base    | todos.webapp  | none                                  | dense row with trailing actions; container query at 36rem | list semantics; actions reachable by keyboard      | T0016     |
| `empty-state` | Empty state | todos.webapp  | none                                  | icon, title, text, at most two actions                    | heading level set by the app                       | T0016     |
| `collapsible` | Collapsible | todos.webapp  | `collapsible.js`: `attachCollapsible` | collapsed, expanded                                       | button with `aria-expanded` and `aria-controls`    | T0026     |
| `list`        | List        | new design    | none                                  | simple list, definition rows                              | native `ul`, `ol`, or `dl`                         | to create |
| `table`       | Data table  | new design    | none                                  | plain, dense; caption; numeric columns aligned            | native table with `caption` and `th scope`         | to create |
| `tabs`        | Tabs        | new design    | `tabs.js`: `attachTabs`               | selected, disabled                                        | `tablist`, `tab`, and `tabpanel` roles; arrow keys | to create |

### Feedback
| Key           | Component       | Source       | Module and functions                 | Variants and states                          | Accessibility minimum                                        | Task      |
| :------------ | :-------------- | :----------- | :----------------------------------- | :------------------------------------------- | :----------------------------------------------------------- | :-------- |
| `toast`       | Toast           | todos.webapp | `toast.js`: `createToast`            | message, with Undo, persistent; three tiers  | announced by the live region; holds while a modal is open    | T0010     |
| none, utility | Live region     | todos.webapp | `live-region.js`: `createLiveRegion` | polite, assertive                            | present at page load; text changes are announced             | T0010     |
| `banner`      | Banner          | todos.webapp | none                                 | info, success, warning, danger               | `role="status"`, or `role="alert"` for danger                | T0007     |
| `loading`     | Loading pattern | new design   | none                                 | busy region, status line, slow-list skeleton | `aria-busy`; polite status text; static under reduced motion | T0020     |
| `progress`    | Progress bar    | support.js   | none                                 | determinate, indeterminate                   | native `progress` with a label                               | to create |
| `spinner`     | Spinner         | support.js   | none                                 | sizes sm, md                                 | label in the status line; static under reduced motion        | to create |

### Overlays
| Key              | Component           | Source       | Module and functions                       | Variants and states                       | Accessibility minimum                              | Task         |
| :--------------- | :------------------ | :----------- | :----------------------------------------- | :---------------------------------------- | :------------------------------------------------- | :----------- |
| `dialog`         | Dialog              | todos.webapp | `dialog.js`: `openDialog`, `confirmDialog` | modal, type-to-confirm; sheet below 64rem | native dialog; focus trap; Escape; focus return    | T0009        |
| `inline-confirm` | Inline confirmation | todos.webapp | `inline-confirm.js`: `attachInlineConfirm` | asking, confirmed, cancelled              | focus moves to the question and back               | T0009        |
| `menu`           | Menu                | todos.webapp | `menu.js`: `attachMenu`                    | items, separators, danger item            | menu roles; roving focus; type-ahead; Escape       | T0011, T0012 |
| `popover`        | Popover             | todos.webapp | `popover.js`: `attachPopover`              | anchored panel; light dismiss             | native `popover` attribute; focus returns on close | T0011, T0012 |
| `tooltip`        | Tooltip             | meteo        | none                                       | shown on focus and on fine-pointer hover  | text in `aria-describedby`; exposure checked first | T0024        |

### Identity and Foundations
| Key            | Component    | Source        | Module and functions                                    | Variants and states                                     | Accessibility minimum                              | Task  |
| :------------- | :----------- | :------------ | :------------------------------------------------------ | :------------------------------------------------------ | :------------------------------------------------- | :---- |
| `avatar`       | Avatar       | family-portal | none                                                    | sizes sm, md, lg; image, initials, icon fallback; stack | `alt` text, or `aria-hidden` beside a visible name | T0018 |
| `account-menu` | Account menu | todos.webapp  | `account-menu.js`: `attachAccountMenu`, using `menu.js` | signed in, signed out                                   | menu pattern; marks the current route              | T0026 |
| `icon`         | Icon         | todos.webapp  | `icon.js`: `createIcon`                                 | sizes sm, md, lg; stroke token                          | `aria-hidden` unless it carries meaning            | T0006 |
| `theme-switch` | Theme switch | todos.webapp  | `theme-switch.js`: `attachThemeSwitch`                  | System, Light, Dark                                     | segmented control of native radios                 | T0027 |

### Not in the Package
| Component                                              | Source                      | Reason                                                      |
| :----------------------------------------------------- | :-------------------------- | :---------------------------------------------------------- |
| Task row, recycle bin screen                           | todos.webapp                | app-local                                                   |
| Forecast chart                                         | meteo                       | app-local; its per-hour sentence is the model for any chart |
| Reaction toggle, drag handles, avatar cropper          | family-portal               | app-local; drag lacks keyboard support                      |
| Inbox panel, Web Push                                  | todos.webapp, family-portal | app-local, connected features                               |
| Pagination, slider, date picker, file upload, combobox | none                        | no adopter needs them; they enter under the sharing rule    |

---

## Markup Skeletons
One skeleton per key. `...` marks content that the app supplies.

### button
Button. Variants add a modifier, such as `button--secondary` or `button--danger`.

```html
<button class="button" type="button">Save</button>
<button class="button button--secondary" type="button">Keep</button>
<button class="button button--danger" type="button" aria-disabled="true">Delete</button>
```

### icon-button
Icon button. A toggle carries `aria-pressed`; a plain action omits it.

```html
<button class="icon-button" type="button" aria-label="Star" aria-pressed="false">
  <svg class="icon" aria-hidden="true"><use href="icons.svg#icon-star"/></svg>
</button>
```

### link-button
Use a link button for a secondary action, such as showing details; use an anchor for navigation.
It stays underlined with a transparent background and keeps a 44 px target in both dimensions.
Hover and active use the link hover color; focus uses the global ring, and native `disabled` blocks activation.
See every state in the [gallery](../../src/demo/visual-style-gallery.html#link-button).

```html
<button class="link-button" type="button">Show details</button>
```

### fab
Floating action button. It lives in the shell's overlay layer, never inside a component.

```html
<button class="fab" type="button" aria-label="Add task">
  <svg class="icon" aria-hidden="true"><use href="icons.svg#icon-add"/></svg>
</button>
```

### field
Field. Every part except the label and the control is optional. The help text stays in `aria-describedby` while collapsed.
`attachField` orders `aria-describedby` as hint, help, counter, status, and error, naming only visible status and error lines.

```html
<div class="field" data-field>
  <label class="field__label" for="name">Name</label>
  <button class="field__help-toggle" type="button" aria-expanded="false" aria-controls="name-help" aria-label="Help for Name">
    <svg class="icon" aria-hidden="true"><use href="icons.svg#icon-help"/></svg>
  </button>
  <p class="field__help" id="name-help" hidden>The counter name, shown on every screen.</p>
  <input class="field__control" id="name" name="name" maxlength="40" aria-describedby="name-hint name-help name-counter name-error" aria-invalid="true">
  <p class="field__hint" id="name-hint">Up to 40 characters.</p>
  <p class="field__counter" id="name-counter">12 / 40</p>
  <p class="field__status" id="name-status"><svg class="icon" aria-hidden="true"><use href="icons.svg#icon-check"/></svg>Name is free.</p>
  <p class="field__error" id="name-error"><svg class="icon" aria-hidden="true"><use href="icons.svg#icon-alert"/></svg>Enter a name.</p>
</div>
```

### checkbox
Checkbox.

```html
<label class="checkbox">
  <input class="checkbox__control" type="checkbox" name="done">
  <span class="checkbox__label">Done</span>
</label>
```

### radio
Radio. Radios always sit in a field group.

```html
<label class="radio">
  <input class="radio__control" type="radio" name="size" value="small">
  <span class="radio__label">Small</span>
</label>
```

### switch
Switch. New design; the native checkbox keeps form submission and keyboard support.

```html
<label class="switch">
  <input class="switch__control" type="checkbox" role="switch">
  <span class="switch__label">Notifications</span>
</label>
```

### chip
Chip. A static chip is a `span`; a filter or removable chip uses buttons.

```html
<span class="chip">Work</span>
<button class="chip chip--filter" type="button" aria-pressed="true">Today</button>
<span class="chip chip--removable">Home<button class="chip__remove" type="button" aria-label="Remove Home">
  <svg class="icon" aria-hidden="true"><use href="icons.svg#icon-close"/></svg></button></span>
```

### segmented
Segmented control. The options wrapper draws the track, so the legend stays a real legend.
`disabled` on one radio disables its option; on the fieldset it disables every option.

```html
<fieldset class="segmented">
  <legend class="segmented__legend">View</legend>
  <div class="segmented__options">
    <label class="segmented__option"><input type="radio" name="view" value="list" checked>List</label>
    <label class="segmented__option"><input type="radio" name="view" value="board">Board</label>
  </div>
</fieldset>
```

### badge
Badge. A count badge carries its meaning in text, such as a visually hidden word.

```html
<span class="badge badge--warning">Overdue</span>
<span class="badge badge--count">3<span class="visually-hidden"> unread</span></span>
```

### form
Form. `attachForm` validates on blur and on submit, and sets `aria-busy` while sending.

```html
<form class="form" data-form novalidate>
  <div class="error-summary" tabindex="-1" hidden>...</div>
  <div class="field">...</div>
  <fieldset class="field-group">...</fieldset>
  <div class="form__actions">
    <button class="button button--secondary" type="button">Cancel</button>
    <button class="button" type="submit">Save</button>
  </div>
</form>
```

### error-summary
Error summary. Focus moves to the summary after a failed submit; each link jumps to its field.

```html
<div class="error-summary" role="alert" tabindex="-1" aria-labelledby="errors-title">
  <h2 class="error-summary__title" id="errors-title">Fix 2 fields</h2>
  <ul class="error-summary__list">
    <li><a class="error-summary__link" href="#name">Enter a name.</a></li>
    <li><a class="error-summary__link" href="#url">Enter a valid URL.</a></li>
  </ul>
</div>
```

### field-group
Field group. `field-group--row` sets related fields side by side; the hint and error lines are optional.

```html
<fieldset class="field-group" aria-describedby="notify-hint">
  <legend class="field-group__legend">Notify me</legend>
  <label class="checkbox">...</label>
  <label class="checkbox">...</label>
  <p class="field-group__hint" id="notify-hint">...</p>
  <p class="field-group__error" id="notify-error" hidden>...</p>
</fieldset>
```

### selection
Multi-select with bulk actions. Draft only; the design task settles the markup before implementation.

```html
<ul class="selection" data-selection aria-label="Tasks">
  <li class="row"><input class="selection__control" type="checkbox" aria-label="Select Buy milk">...</li>
</ul>
<div class="selection__bar" hidden>
  <p class="selection__count">2 selected</p>
  <button class="button button--danger" type="button">Delete</button>
</div>
```

### card
Card. A link card is one link and nests no other controls.

```html
<a class="card" href="...">
  <span class="card__media"><span class="icon-tile icon-tile--tone-1">...</span></span>
  <span class="card__body"><span class="card__title">Calendar</span><span class="card__text">Family events</span></span>
</a>
```

### icon-tile
Icon tile.

```html
<span class="icon-tile icon-tile--tone-2">
  <svg class="icon" aria-hidden="true"><use href="icons.svg#icon-calendar"/></svg>
</span>
```

### row
Row base. The `.row__list` list is a size container, so rows adapt to their column width.

```html
<ul class="list row__list">
  <li class="row">
    <span class="row__main">Buy milk</span>
    <span class="row__actions"><button class="icon-button" type="button" aria-label="More actions for Buy milk">...</button></span>
  </li>
</ul>
```

### empty-state
Empty state. At most two actions.

```html
<div class="empty-state">
  <svg class="icon icon--lg" aria-hidden="true"><use href="icons.svg#icon-inbox"/></svg>
  <h2 class="empty-state__title">No tasks yet</h2>
  <p class="empty-state__text">Add a task to get started.</p>
  <div class="empty-state__actions"><button class="button" type="button">Add task</button></div>
</div>
```

### collapsible
Collapsible.

```html
<div class="collapsible" data-collapsible>
  <button class="collapsible__toggle" type="button" aria-expanded="false" aria-controls="done-list">Done (4)</button>
  <div class="collapsible__panel" id="done-list" hidden>...</div>
</div>
```

### list
List.

```html
<ul class="list"><li class="list__item">...</li></ul>
<dl class="list list--definitions"><dt class="list__term">Owner</dt><dd class="list__value">Ann</dd></dl>
```

### table
Data table.

```html
<table class="table">
  <caption class="table__caption">Readings this week</caption>
  <thead><tr><th scope="col">Day</th><th scope="col" class="table__numeric">Value</th></tr></thead>
  <tbody><tr><th scope="row">Monday</th><td class="table__numeric">42</td></tr></tbody>
</table>
```

### tabs
Tabs. Arrow keys move between tabs; only the selected tab is in the tab order.

#### Contract
**[Decided]** Horizontal tabs automatically activate preloaded panels when focus changes.
It follows the [WAI-ARIA tabs pattern](https://www.w3.org/WAI/ARIA/apg/patterns/tabs/).

- Use horizontal tabs for switching between related, preloaded content panels.
- Keep `.tabs`, `.tabs__list`, `.tabs__tab`, and `.tabs__panel` as the styling contract.
- Use `data-tabs-root`, `data-tabs-list`, `data-tabs-tab`, and `data-tabs-panel` as behavior hooks.
- Give every tab a unique ID and `aria-controls`; give its panel the matching `aria-labelledby`.
- Label the tablist with `aria-label` or `aria-labelledby`.
- Use native buttons with `type="button"` and `role="tab"`.
- Initialize exactly one enabled tab with `aria-selected="true"` and `tabindex="0"`.
- Set other tabs to `aria-selected="false"` and `tabindex="-1"`; hide their panels with `hidden`.
- Make text-first panels focusable with `tabindex="0"`.
- Left and Right move focus and selection, wrapping and skipping disabled tabs.
- Home and End focus and select the first and last enabled tabs.
- Pointer activation and native Enter or Space activation select the corresponding panel.
- Tab leaves the tablist; Up and Down retain native scrolling.
- Automatic activation requires preloaded panels without noticeable loading latency.
- Native `disabled` tabs remain visible but cannot receive focus or activate.
- Show default, hover, focus-visible, selected, and disabled states with semantic tokens.
- Mark selection with an underline and text emphasis; preserve a separate visible focus outline.
- Keep targets at least 44 pixels tall; let the tablist scroll horizontally on narrow screens.
- Expose `attachTabs(element)` returning `{ destroy() }`; destruction removes listeners and restores authored attributes.
- Scope behavior to the owning root so nested tabsets operate independently.
- For pages without JavaScript, authors show all panels and omit `hidden` until enhancement runs.

```html
<div class="tabs" data-tabs-root>
  <div class="tabs__list" data-tabs-list role="tablist" aria-label="Settings">
    <button type="button" class="tabs__tab" data-tabs-tab role="tab" id="tab-general" aria-selected="true" aria-controls="panel-general" tabindex="0">General</button>
    <button type="button" class="tabs__tab" data-tabs-tab role="tab" id="tab-sharing" aria-selected="false" aria-controls="panel-sharing" tabindex="-1">Sharing</button>
  </div>
  <div class="tabs__panel" data-tabs-panel role="tabpanel" id="panel-general" aria-labelledby="tab-general" tabindex="0">General settings</div>
  <div class="tabs__panel" data-tabs-panel role="tabpanel" id="panel-sharing" aria-labelledby="tab-sharing" tabindex="0" hidden>Sharing settings</div>
</div>
```
The skeleton shows enhanced state; remove `hidden` for the readable, script-free baseline.

### toast
Toast. The toast region sits in the shell's overlay layer; the live region announces the text.

```html
<div class="toast-region" role="region" aria-label="Notifications">
  <div class="toast"><p class="toast__text">Task deleted.</p><button class="button button--quiet" type="button" data-toast-action="undo">Undo</button></div>
</div>
```

### live-region
Live region. A utility, not a component: `createLiveRegion` adds it once, at page load.

```html
<div class="visually-hidden" role="status" aria-live="polite"></div>
```

### banner
Banner. Variants add `banner--success`, `banner--warning`, or `banner--danger`; only danger banners use `role="alert"`.

```html
<div class="banner banner--warning" role="status">
  <svg class="icon" aria-hidden="true"><use href="icons.svg#icon-alert"/></svg>
  <p class="banner__text">You are offline. Changes sync later.</p>
</div>
```

### loading
Loading pattern. New design; the skeleton appears only for slow lists and never moves under reduced motion.

```html
<section class="loading" aria-label="Tasks">
  <p class="loading__status" role="status" aria-live="polite" aria-atomic="true">Loading tasks...</p>
  <div class="loading__content" aria-busy="true">
    <div class="loading__skeleton" aria-hidden="true">
      <div class="loading__placeholder"></div>
      <div class="loading__placeholder"></div>
      <div class="loading__placeholder"></div>
    </div>
  </div>
</section>
```

Keep the status outside the busy region, so loading announcements are not deferred until completion.
Omit skeletons for ordinary loads; use them only when the application identifies a slow list request.
Skeletons are static under every motion preference and contain no focusable elements.
Applications replace placeholders, set `aria-busy="false"`, and update the existing status on success, empty results, or failure.
Create the status before starting requests; keep focus stable and localize its messages.

### progress
Progress bar.

```html
<label class="progress">
  <span class="progress__label">Uploading</span>
  <progress class="progress__bar" max="100" value="40">40%</progress>
</label>
```

### spinner
Spinner. The spinner is decoration; the status text carries the meaning.

```html
<span class="spinner" aria-hidden="true"></span><span role="status">Syncing...</span>
```

### dialog
Dialog. `openDialog` adds the focus trap, Escape, and focus return; below 64rem it becomes a sheet.

```html
<dialog class="dialog" aria-labelledby="dialog-title">
  <div class="dialog__header"><h2 class="dialog__title" id="dialog-title">Delete the list Groceries?</h2></div>
  <div class="dialog__body"><p>...</p></div>
  <div class="dialog__actions">
    <button class="button button--secondary" type="button" data-dialog-close="cancel">Keep</button>
    <button class="button button--danger" type="button" data-dialog-close="delete">Delete list</button>
  </div>
</dialog>
```

### inline-confirm
Inline confirmation. The second confirmation tier; the third is a dialog asking to type a word.

```html
<div class="inline-confirm" data-inline-confirm role="group" aria-label="Confirm delete">
  <p class="inline-confirm__question">Delete forever?</p>
  <button class="button button--danger" type="button" data-inline-confirm-answer="yes">Delete</button>
  <button class="button button--secondary" type="button" data-inline-confirm-answer="no">Keep</button>
</div>
```

### menu
Menu. `attachMenu` sets `aria-expanded`, roving focus, and type-ahead, and builds on `attachPopover` of `popover.js`.

```html
<button class="icon-button" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="More actions for Buy milk" popovertarget="actions">...</button>
<div class="menu" id="actions" role="menu" aria-label="Actions for Buy milk" popover>
  <button class="menu__item" type="button" role="menuitem">Add to list</button>
  <div class="menu__separator" role="separator"></div>
  <button class="menu__item menu__item--danger" type="button" role="menuitem">Delete</button>
</div>
```

### popover
Popover.

```html
<button class="button button--secondary" type="button" popovertarget="filters">Filters</button>
<div class="popover" id="filters" popover aria-label="Filters">...</div>
```

### tooltip
Tooltip. Provisional until the screen reader check of T0024.

```html
<button class="icon-button" type="button" aria-label="Refresh" aria-describedby="refresh-tip">...</button>
<span class="tooltip" id="refresh-tip" role="tooltip">Refresh the forecast</span>
```

### avatar
Avatar. The fallback shows initials, or the person icon when no name is known.

```html
<img class="avatar avatar--md" src="ann.webp" alt="Ann">
<span class="avatar avatar--md avatar--initials" aria-hidden="true">AN</span>
<span class="avatar-stack"><img class="avatar avatar--sm" src="..." alt="Ann"><img class="avatar avatar--sm" src="..." alt="Bo"></span>
```

### account-menu
Account menu.

```html
<div class="account-menu" data-account-menu>
  <button class="account-menu__button" type="button" popovertarget="account" aria-label="Alex North">
    <span class="avatar avatar--sm avatar--initials" aria-hidden="true">AN</span>
  </button>
  <div class="menu account-menu__panel" id="account" role="menu" aria-labelledby="account-name" popover>
    <p class="account-menu__name" id="account-name" data-account-menu-name aria-hidden="true">Alex North</p>
    <a class="menu__item" role="menuitem" href="#/settings" aria-current="page">Settings</a>
  </div>
</div>
```

### icon
Icon. The sprite path comes from the vendored look, such as `vendor/design/looks/{{look}}/icons.svg`.

```html
<svg class="icon icon--md" aria-hidden="true"><use href="icons.svg#icon-close"/></svg>
```

### theme-switch
Theme switch. System removes `data-theme`; Light and Dark set it on the root element.

```html
<fieldset class="segmented theme-switch" data-theme-switch>
  <legend class="segmented__legend">Theme</legend>
  <label class="segmented__option"><input type="radio" name="theme" value="system" checked>System</label>
  <label class="segmented__option"><input type="radio" name="theme" value="light">Light</label>
  <label class="segmented__option"><input type="radio" name="theme" value="dark">Dark</label>
</fieldset>
```

---

## App Shell
The shell has the key `app`, and [ADR-0004](../adrs/ADR-0004-app-shell.md) defines its areas and options.
Each adopter setup below keeps only the areas and options that adopter uses.
The top bar parts `app__title`, `app__brand`, `app__menu-button`, `app__breadcrumb`, and `app__top-actions` come from ADR-0004.
The sidebar and the bottom bar hold an `app__nav-list` of `app__nav-item` links, as the [demo pages](../../src/demo/visual-style-gallery.html#shell) show.

### todos.webapp setup
Every area; sidebar and bottom bar; the main column scrolls. The add bar becomes the action bar, and the editor the side panel.

```html
<body class="app app--scroll-main">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="app__top-bar">
    <h1 class="app__title">Todos</h1>
    <div class="app__top-actions"><div class="account-menu">...</div></div>
  </header>
  <nav class="app__sidebar" aria-label="Main">...</nav>
  <div class="app__banners"></div>
  <main class="app__main" id="main" tabindex="-1">...</main>
  <aside class="app__side-panel" hidden>...</aside>
  <div class="app__action-bar">...</div>
  <nav class="app__bottom-nav" aria-label="Main">...</nav>
  <div class="app__overlays">
    <div class="toast-region" role="region" aria-label="Notifications"></div>
    <button class="fab" type="button" aria-label="Add task">...</button>
  </div>
</body>
```

### counters setup
Top bar with a menu button, banners, action bar, and overlay layer; the page scrolls.

```html
<body class="app app--scroll-page">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="app__top-bar">
    <button class="app__menu-button icon-button" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="Menu">...</button>
    <h1 class="app__title">Counters</h1>
  </header>
  <div class="app__banners"></div>
  <main class="app__main" id="main" tabindex="-1">...</main>
  <div class="app__action-bar">...</div>
  <div class="app__overlays"><div class="toast-region" role="region" aria-label="Notifications"></div></div>
</body>
```

### meteo setup
Top bar, banners, action bar, and overlay layer; no navigation; the page scrolls in a narrow column. The three screens are sections of the main area.

```html
<body class="app app--scroll-page app--width-narrow">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="app__top-bar"><h1 class="app__title">Meteo</h1></header>
  <div class="app__banners"><div class="banner" role="status" hidden>You are offline.</div></div>
  <main class="app__main" id="main" tabindex="-1">
    <section data-screen="start">...</section>
    <section data-screen="forecast" hidden>...</section>
    <section data-screen="settings" hidden>...</section>
  </main>
  <div class="app__action-bar">...</div>
  <div class="app__overlays"><div class="toast-region" role="region" aria-label="Notifications"></div></div>
</body>
```

### family-portal setup
Top bar with brand, breadcrumb, help, and account; banners; the action bar holds the footer; the page scrolls. One server template partial renders the top bar.

```html
<body class="app app--scroll-page">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="app__top-bar">
    <a class="app__brand" href="/">Family</a>
    <nav class="app__breadcrumb" aria-label="Breadcrumb">
      <ol><li><a href="/">Home</a></li><li><a href="/calendar" aria-current="page">Calendar</a></li></ol>
    </nav>
    <div class="app__top-actions">
      <a class="icon-button" href="/help" aria-label="Help">...</a>
      <div class="account-menu">...</div>
    </div>
  </header>
  <div class="app__banners"></div>
  <main class="app__main" id="main" tabindex="-1">...</main>
  <footer class="app__action-bar">...</footer>
  <div class="app__overlays"><div class="toast-region" role="region" aria-label="Notifications"></div></div>
</body>
```

---

## Glossary
- Live region: a part of the page that screen readers watch, and announce when its text changes, without moving focus.
  - `role="status"` is polite and waits until the user is idle; `role="alert"` is assertive and interrupts.
  - It is the web counterpart of Android's `announceForAccessibility`.
  - It must exist in the page before its text changes, so `createLiveRegion` adds it once, at page load.
  - Toasts, form errors, loading status lines, and "Saved" messages all use it.
- Controller: the object that a behavior function returns, with `destroy()` and the methods its catalog row lists.
- Skeleton: the reference HTML of a component, which CSS and JavaScript both rely on.
