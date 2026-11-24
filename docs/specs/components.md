# Component Catalog
Every component the design system provides, with its key, behavior, HTML skeleton, and accessibility minimum.
[ADR-0003](../adrs/ADR-0003-components-and-patterns.md) records the decisions; [naming.md](naming.md) defines how each key names its files.

- Status: Accepted on 2026-11-12, in review round 2 of the planning task.
- **[Decided]** with the user on 2026-11-11: badge, floating action button, list and data table, tabs, progress bar and spinner, and multi-select join the first set.
- **[Decided]** with the user on 2026-11-11: forms, validation states, the help toggle, the error summary, and field groups are part of T0008.
- **[Decided]** with the user on 2026-11-11: validation icons come from the shared sprite.

---

## How to Read This Catalog
- The tables list the initial set of ADR-0003 and components promoted under its sharing rule.
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
| Key           | Component                      | Module and functions                     | Variants and states                                                               | Accessibility minimum                                     |
| :------------ | :----------------------------- | :--------------------------------------- | :-------------------------------------------------------------------------------- | :-------------------------------------------------------- |
| `button`      | Button                         | none                                     | default, secondary, danger, quiet, inverse, small; hover, active, focus, disabled | native button; visible focus; 44 px target                |
| `icon-button` | Icon button                    | none                                     | default, danger; pressed toggle                                                   | native button; `aria-label`; `aria-pressed` for toggles   |
| `link-button` | Link button                    | none                                     | default; hover, focus-visible, active, disabled                                   | native button; visible focus; 44 px target                |
| `fab`         | Floating action button         | none                                     | one per screen, in the shell's overlay layer                                      | native button; `aria-label`; 44 px target                 |
| `field`       | Field: input, textarea, select | `field.js`: `createField`, `attachField` | hint, counter, help, status, error; invalid, pending, disabled, read-only         | label for the control; `aria-invalid`; `aria-describedby` |
| `checkbox`    | Checkbox                       | none                                     | checked, indeterminate, disabled, invalid                                         | native input inside its label                             |
| `radio`       | Radio                          | none                                     | checked, disabled                                                                 | native radios inside a field group                        |
| `switch`      | Switch                         | none                                     | off, on, disabled, invalid                                                        | native checkbox with `role="switch"`                      |
| `chip`        | Chip                           | none                                     | static, status with icon, removable, filter toggle; overdue, warning, danger      | icon and word; button when interactive; labeled remove    |
| `segmented`   | Segmented control              | none                                     | 2 to 5 options; selected, disabled                                                | fieldset of native radios with a legend                   |
| `badge`       | Badge                          | none                                     | neutral, count, success, warning, danger                                          | text, never color alone                                   |

### Forms and Selection
| Key             | Component                      | Module and functions                             | Variants and states                                             | Accessibility minimum                                                            |
| :-------------- | :----------------------------- | :----------------------------------------------- | :-------------------------------------------------------------- | :------------------------------------------------------------------------------- |
| `form`          | Form                           | `form.js`: `attachForm`, using `field.js`        | idle, busy, failed submit; actions row                          | native form; Enter submits; busy state announced                                 |
| `field`         | Field help toggle              | `field.js`: `attachField`                        | collapsed, expanded                                             | button with `aria-expanded` and `aria-controls`; help text in `aria-describedby` |
| `field`         | Validation states              | `field.js`: `setError`, `setValid`, `setPending` | valid, invalid, pending; icon and text, never color alone       | `aria-invalid`; `aria-busy` while pending; message in the live region            |
| `error-summary` | Error summary                  | filled by `attachForm`                           | hidden; shown after a failed submit, one link per invalid field | focus moves to it; links jump to the fields                                      |
| `field-group`   | Field group                    | none                                             | checkbox group, radio group, related fields                     | native fieldset and legend                                                       |
| `selection`     | Multi-select with bulk actions | `selection.js`: `attachSelection`                | list or `--table`; none, some, or all selected; bulk bar        | native checkboxes; Shift selects a range; count announced                        |

### Containers
| Key             | Component     | Module and functions                                                                              | Variants and states                                               | Accessibility minimum                                       |
| :-------------- | :------------ | :------------------------------------------------------------------------------------------------ | :---------------------------------------------------------------- | :---------------------------------------------------------- |
| `card`          | Card          | none                                                                                              | static, link card with hover lift, with media                     | a link card nests no other controls                         |
| `icon-tile`     | Icon tile     | none                                                                                              | tones 1 to 4; sizes sm, md, lg                                    | decorative icon is `aria-hidden`                            |
| `row`           | Row base      | none                                                                                              | dense row with trailing actions; container query at 36rem         | list semantics; actions reachable by keyboard               |
| `empty-state`   | Empty state   | none                                                                                              | icon, title, text, at most two actions                            | heading level set by the app                                |
| `collapsible`   | Collapsible   | `collapsible.js`: `attachCollapsible`                                                             | collapsed, expanded                                               | button with `aria-expanded` and `aria-controls`             |
| `release-notes` | Release notes | `release-notes.js`: `createReleaseNotes`, `attachReleaseNotes`, using `collapsible.js`, `icon.js` | collapsibles or open blocks; filters, area groups, status, paging | filter group `aria-pressed`; `role="list"`; findable panels |
| `help-page`     | Help page     | `help-page.js`: `createHelpPage`, `attachHelpPage`, `buildFeedbackMailto`, `parseHelpQuery`       | search, topic chips, FAQ collapsibles, no-results, release notes  | labeled search; `aria-pressed` chips; findable FAQ panels   |
| `list`          | List          | none                                                                                              | simple list, definition rows, bordered facts, compact facts       | native `ul`, `ol`, or `dl`                                  |
| `view-header`   | View header   | none                                                                                              | title with optional muted summary; empty summary collapses        | heading level set by the app; `role="status"` when live     |
| `toolbar`       | Toolbar       | none                                                                                              | wrapping filter fields and actions aligned to the bottom edge     | `role="search"` landmark; labeled native controls           |
| `table`         | Data table    | none                                                                                              | plain, dense, framed; hover and `aria-selected` rows; numeric     | native table with `caption` and `th scope`                  |
| `pager`         | Pager         | none                                                                                              | status text with First, Previous, Next, and Last buttons          | labeled `nav`; native `disabled` on boundaries              |
| `table-state`   | Table state   | `table-state.js`: `createTableState`, `attachTableState`, `createPager`, `pageOf`, `pageParams`   | client slicing, server bookmarks or offsets, URL hash persistence | labeled pager nav; native disabled buttons; `data-*` hooks  |
| `entry-list`    | Entry list    | none                                                                                              | log or event cards; code message; action; details; hover          | labeled native `ul`; time chip with `time` element          |
| `detail-panel`  | Detail panel  | none                                                                                              | fixed header, scrolling body, sections, and danger zone           | labeled landmark; focus moves in and returns                |
| `tabs`          | Tabs          | `tabs.js`: `attachTabs`                                                                           | selected, disabled                                                | `tablist`, `tab`, and `tabpanel` roles; arrow keys          |

### Feedback
| Key           | Component           | Module and functions                                                                                                                | Variants and states                                                           | Accessibility minimum                                                  |
| :------------ | :------------------ | :---------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- | :--------------------------------------------------------------------- |
| `toast`       | Toast               | `toast.js`: `createToast`                                                                                                           | message, Undo, download, persistent; 3 tiers                                  | announced by the live region; holds while a modal is open              |
| none, utility | Live region         | `live-region.js`: `createLiveRegion`                                                                                                | polite, assertive                                                             | present at page load; text changes are announced                       |
| none, utility | Auto-refresh        | `auto-refresh.js`: `attachAutoRefresh`                                                                                              | poll while visible; return; long return                                       | no Refresh button; keeps typed input and selections                    |
| `banner`      | Banner              | none                                                                                                                                | info, success, warning, danger                                                | `role="status"`, or `role="alert"` for danger                          |
| `notices`     | Notices             | `notices.js`: `createNotices`, `attachNotices`, using `toast.js`, `icon.js`                                                         | app banners (cap 3), sticky inbox banner, toasts                              | `role="alert"` for errors, `role="status"` otherwise; safe URLs        |
| `inbox`       | Notifications inbox | `inbox.js`: `createInbox`, `attachInbox`, `createUnreadButton`, `attachUnreadButton`, using `selection.js`, `notices.js`, `icon.js` | selectable rows, unread edge and badge, bulk actions, empty state, 99+ button | 44 px checkbox labels; disambiguated row actions; count in button name |
| `loading`     | Loading pattern     | none                                                                                                                                | busy region, status line, slow-list skeleton                                  | `aria-busy`; polite status text; static under reduced motion           |
| `data-loader` | Data loader         | `data-loader.js`: `createDataLoader`, `attachDataLoader`, `loadInto`, using `dom-builders.js`                                       | loading, quiet polling, failed with Retry, 401 with Sign in                   | polite status outside busy region; `aria-busy` on quiet; alert banners |
| `progress`    | Progress bar        | none                                                                                                                                | determinate, indeterminate                                                    | native `progress` with a label                                         |
| `spinner`     | Spinner             | none                                                                                                                                | sizes sm, md                                                                  | label in the status line; static under reduced motion                  |

### Overlays
| Key              | Component           | Module and functions                                    | Variants and states                       | Accessibility minimum                                     |
| :--------------- | :------------------ | :------------------------------------------------------ | :---------------------------------------- | :-------------------------------------------------------- |
| `dialog`         | Dialog              | `dialog.js`: `openDialog`, `confirmDialog`              | modal, type-to-confirm; sheet below 64rem | native dialog; focus trap; Escape; focus return           |
| `inline-confirm` | Inline confirmation | `inline-confirm.js`: `attachInlineConfirm`              | asking, confirmed, cancelled              | focus moves to the question and back                      |
| `menu`           | Menu                | `menu.js`: `attachMenu`                                 | items, separators, danger item            | menu roles; roving focus; type-ahead; Escape              |
| `popover`        | Popover             | `popover.js`: `attachPopover`                           | anchored panel; light dismiss             | native `popover` attribute; focus returns on close        |
| `tooltip`        | Tooltip             | `attachTooltip`, `createTooltip`, `attachLabelTooltips` | focus, hover, Escape; `tooltip--label`    | explicit text in `aria-describedby`; labels `aria-hidden` |

### Identity and Foundations
| Key                   | Component             | Module and functions                                                                                                                                             | Variants and states                                     | Accessibility minimum                                             |
| :-------------------- | :-------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------- | :------------------------------------------------------ | :---------------------------------------------------------------- |
| none, base            | Page base             | none                                                                                                                                                             | body text, headings, links, code, and `[hidden]` guard  | underlined links; `hidden="until-found"` stays findable           |
| `avatar`              | Avatar                | none                                                                                                                                                             | sizes sm, md, lg; image, initials, icon fallback; stack | `alt` text, or `aria-hidden` beside a visible name                |
| `account-menu`        | Account menu          | `account-menu.js`: `attachAccountMenu`, using `menu.js`                                                                                                          | signed in, signed out                                   | menu pattern; marks the current route                             |
| `icon`                | Icon                  | `icon.js`: `createIcon`                                                                                                                                          | sizes sm, md, lg; stroke token                          | `aria-hidden` unless it carries meaning                           |
| `theme-switch`        | Theme switch          | `theme-switch.js`: `attachThemeSwitch`, `syncAccountTheme`, `themeOfSettings`; `theme-boot.js`                                                                   | System, Light, Dark; pre-paint boot and account sync    | segmented control of native radios                                |
| `install-prompt`      | Install prompt        | `install-prompt.js`: `attachInstallPrompt`                                                                                                                       | installable, installed; standalone and `appinstalled`   | app-owned button starts `hidden`; `aria-disabled` while prompting |
| `file-download`       | File download         | `file-download.js`: `createFileDownload`, `downloadFile`, `downloadJson`, `downloadBlob`                                                                         | JSON or Blob one-shot download; reusable handle         | hidden temporary anchor removed after click; toast action         |
| `screen-action-bar`   | Screen action bar     | `screen-action-bar.js`: `attachScreenActionBar`                                                                                                                  | buttons, links, disabled hints, empty-bar removal       | native `disabled` on buttons; `aria-disabled` on links            |
| `action-registry`     | Action registry       | `action-registry.js`: `createActionRegistry`, `attachActionRegistry`                                                                                             | enabled, disabled with reason, scoped lookup, events    | blocks disabled and `aria-disabled` `[data-action]` triggers      |
| `dom-builders`        | DOM builders          | `dom-builders.js`: `createDomBuilders`, `h`, `setChildren`, and catalog builders                                                                                 | buttons, selects, checkboxes, facts, tables, confirm    | emits catalog ARIA skeletons; text nodes only, no `innerHTML`     |
| `admin-console`       | Admin console frame   | `admin-console.js`: `createAdminConsole`, `attachAdminConsole`, `parseRoute`, `displayName`, using `account-menu.js`, `app-nav.js`, `dom-builders.js`, `icon.js` | shell with side panel, hash router, gates, signed-out   | skip link focuses `#main`; `aria-current="page"`; single `<main>` |
| `admin-overview`      | Admin Overview screen | `admin-overview.js`: `createAdminOverview`, `attachAdminOverview`, `createAdminOverviewScreen`, using `auto-refresh.js`, `data-loader.js`, `dom-builders.js`     | server facts, visible 30 s reload, disconnected alert   | polite status line; `role="alert"` banners; `data-*` hooks        |
| `admin-logs`          | Admin Logs screen     | `admin-logs.js`: `createAdminLogs`, `attachAdminLogs`, `createAdminLogsScreen`, using `data-loader.js`, `dom-builders.js`, `icon.js`, `table-state.js`           | entry cards, level/text filters, URL paging, empty      | labeled `<search>` and `role="list"`; `<time>`; `data-*` hooks    |
| `admin-system-events` | Admin System events   | `admin-system-events.js`: `createAdminSystemEvents`, `attachAdminSystemEvents`, `createAdminSystemEventsScreen`                                                  | audit cards, server filters/paging, search, JSON toggle | `aria-expanded`/`aria-controls` details; `<search>`; `data-*`     |
| `admin-broadcasts`    | Admin Broadcasts      | `admin-broadcasts.js`: `createAdminBroadcasts`, `attachAdminBroadcasts`, `createAdminBroadcastsScreen`                                                           | compose, inbox/banner preview, recipients, retraction   | `field.js` validation; `selection.js`; inline confirm; `data-*`   |
| `admin-users`         | Admin Users screen    | `admin-users.js`: `createAdminUsers`, `attachAdminUsers`, `createAdminUsersScreen`                                                                               | account table, filters, paging, detail/create panel     | `aria-selected`, focus return, inline confirm, `data-*` hooks     |
| `admin-sessions`      | Admin Sessions screen | `admin-sessions.js`: `createAdminSessions`, `attachAdminSessions`, `createAdminSessionsScreen`                                                                   | token table, filters, paging, single/bulk/expired       | own session protected; `selection.js`; inline confirm; `data-*`   |
| `admin-changelog`     | Admin Changelog       | `admin-changelog.js`: `createAdminChangelog`, `attachAdminChangelog`, `createAdminChangelogScreen`                                                               | adapter releases, area groups, status chips, 10/page    | `aria-labelledby` sections; `role="status"`/`alert`; `data-*`     |
| `view-router`         | View router           | `view-router.js`: `createViewRouter`, `attachViewRouter`                                                                                                         | routed views, fallback, sign-in guards, outside routes  | `aria-current="page"` route marks; `data-view-router-*` hooks     |

### Not in the Package
| Component                                     | Reason                                                                            |
| :-------------------------------------------- | :-------------------------------------------------------------------------------- |
| Task row, recycle bin screen                  | app-local                                                                         |
| Forecast chart                                | domain-specific visualization; provide an accessible text equivalent              |
| Reaction toggle, drag handles, avatar cropper | app-specific interactions requiring their own keyboard and accessibility behavior |
| Web Push                                      | app-local, connected feature                                                      |
| Slider, date picker, file upload, combobox    | no adopter needs them; they enter under the sharing rule                          |

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
Hover and active use the link hover color; focus uses the global glow, and native `disabled` blocks activation.
See every state in the [gallery](../../src/demo/visual-style-gallery.html#link-button).

```html
<button class="link-button" type="button">Show details</button>
```

### fab
Floating action button. It lives in the shell's overlay layer, never inside a component.
Implemented in [fab.css](../../src/css/components/fab.css), with [gallery specimens](../../src/demo/visual-style-gallery.html#fab).
Use one native button per screen, with an action label and one decorative icon.
States are default, hover, active, focus-visible, disabled, and hidden.
The shell fixes it above bottom navigation and action bars, with safe-area spacing.

```html
<button class="fab" type="button" aria-label="Add task">
  <svg class="icon" aria-hidden="true" focusable="false"><use href="icons.svg#icon-plus"/></svg>
</button>
```

### field
Field. Every part except the label and the control is optional. The help text stays in `aria-describedby` while collapsed.
Hint, status, and error lines (`.field__hint`, `.field__status`, `.field__error`) align with a button, link button, checkbox, radio, or switch.
Place them directly after the control, or inside a `.field` wrapper.
`attachField` orders `aria-describedby` as hint, help, counter, status, and error, naming only visible status and error lines.
A blur during a pointer press waits until after release, so a new error line cannot shift pressed buttons.
Keyboard blur validates at once; calling `validate`, `clear`, or `setError` drops any held check.

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

Upgrading an existing app:
- Drop local pointer-blur wrappers such as Auth's `validatedField`; `attachField` and `createField` handle pointer releases directly.
- Re-enable initial field autofocus where apps removed it to avoid lost button clicks on blur.

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
Status chips pair a distinct icon shape with a word; warning and danger color the icon.

```html
<span class="chip">Work</span>
<span class="chip chip--status"><svg class="icon" aria-hidden="true"><use href="icons.svg#icon-check"/></svg>Running</span>
<span class="chip chip--status chip--warning"><svg class="icon" aria-hidden="true"><use href="icons.svg#icon-alert"/></svg>Warning</span>
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
Delivered in T0029: neutral `.badge`, `--count`, `--success`, `--warning`, and `--danger` variants.
Use a span without `tabindex`, event handlers, or interactive descendants; use a chip for interactive labels.
Labels name each status, including when forced colors removes tone differences.
See the [gallery](../../src/demo/visual-style-gallery.html#badge) for all variants.

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
Multi-select with native checkbox rows and an in-flow bulk action bar.
**[Decided]** Follow the [APG checkbox pattern](https://www.w3.org/WAI/ARIA/apg/patterns/checkbox/) using native checked and indeterminate properties.
Use a labeled fieldset, ordinary Tab navigation, and Space to toggle each checkbox.
Shift+click and Shift+Space apply the target's new state over the range from the last ordinary checkbox activation.
Ranges skip disabled and hidden rows; select all affects only available rows.
The master checkbox is mixed for partial selection and disabled when no rows are available.

```html
<fieldset class="selection" data-selection-root tabindex="-1">
  <legend>Tasks</legend>
  <label class="selection__row"><input class="selection__control" type="checkbox" data-selection-all> Select all tasks</label>
  <ul class="selection__list">
    <li><label class="selection__row"><input class="selection__control" type="checkbox" data-selection-item value="milk"> Buy milk</label></li>
  </ul>
  <p class="selection__count" data-selection-count role="status" aria-live="polite" aria-atomic="true">0 selected</p>
  <div class="selection__bar" data-selection-bar role="group" aria-label="Bulk actions" hidden>
    <button class="button button--danger" type="button" data-selection-action="bin">Move to bin</button>
    <button class="button" type="button" data-selection-clear>Clear selection</button>
  </div>
</fieldset>
```

Enhance with `attachSelection(root, { formatCount })` from [selection.js](../../src/js/selection.js).
`formatCount(count)` supplies localized count text; the default is `{{count}} selected`.
The controller exposes `selectedValues`, `clear()`, `refresh()`, and idempotent `destroy()`.
Give each item a unique value; call `refresh()` after changing rows, checked properties, or availability.
Bulk buttons emit bubbling `selection:action` events with `{ action, values }`; the host owns persistence and errors.
Selection remains until the host clears it after successful actions.
Clear returns focus from the disappearing bar to select all, or the fieldset when no rows remain.
Destroy removes listeners and restores authored count, bar, and master checkbox state; item selections remain native form state.
Labels provide touch targets; native checks convey selection without relying on color.
Disabled inputs stay unavailable; `aria-invalid="true"` adds the shared danger outline when validation requires it.
Without JavaScript, individual native checkboxes remain usable; the bulk bar stays hidden.
For delete, move records to the recycle bin and offer Undo through the host's toast controller.
Add `selection--table` on the fieldset to pair the bulk action bar above a data table.
Wrap each table checkbox in `<label class="selection__cell">` to preserve a 44 px touch target inside dense tables.

### card
Card. A link card is one link and nests no other controls.
A static card puts its buttons in `.card__actions`, which flows them to the end edge.

```html
<a class="card" href="...">
  <span class="card__media"><span class="icon-tile icon-tile--tone-1">...</span></span>
  <span class="card__body"><span class="card__title">Calendar</span><span class="card__text">Family events</span></span>
</a>
<article class="card">
  <div class="card__body"><h3 class="card__title">Backup</h3><p class="card__text">Saved daily.</p></div>
  <div class="card__actions"><button class="button" type="button">Back up now</button></div>
</article>
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

### release-notes
Release notes. Renders parsed changelog releases from plain objects, with no support.js import; uses `collapsible.js` and `icon.js`.
- `createReleaseNotes(doc, options)` builds the `.release-notes` skeleton and calls `attachReleaseNotes(root, options)`.
- Controller methods: `setReleases`, `setFilter`, `getFilter`, `showMore`, `expandAll`, `collapseAll`, and `destroy`.
- Also exports `describeRelease(release)` and `parseInlineMarkdown(text)` for plain release normalization and inline parsing.
- Escapes all text via DOM text nodes; turns backtick spans into `<code>` and flattens Markdown links to labels.
- Collapsible mode opens the newest visible release and marks older panels `hidden="until-found"` for find in page.
- Supports `User Highlights` / `All Changes` filter chips, category and `Breaking` badges, area groups, status chips, and `pageSize` paging.
- Call `setSpriteUrl` before creating instances; icons default to core contract glyphs and may be overridden via `options.icons`.

```html
<div class="release-notes" data-release-notes>
  <div class="release-notes__filters" role="group" aria-label="Changes to show" data-release-notes-filters>
    <button class="chip chip--filter" type="button" aria-pressed="true" data-release-notes-filter="user">User Highlights</button>
    <button class="chip chip--filter" type="button" aria-pressed="false" data-release-notes-filter="all">All Changes</button>
  </div>
  <div class="release-notes__list" data-release-notes-list>
    <div class="collapsible release-notes__release" data-release-notes-release>
      <button class="collapsible__toggle release-notes__toggle" type="button" aria-expanded="true" aria-controls="rn-1">
        <span class="release-notes__version">v1.2.0</span>
        <span class="release-notes__tag">released: 2026-11-23</span>
        <span class="badge badge--success" data-release-notes-latest>Latest</span>
        <svg class="icon collapsible__icon" aria-hidden="true" focusable="false"><use href="icons.svg#icon-chevron-down"/></svg>
      </button>
      <div class="collapsible__panel release-notes__panel" id="rn-1" data-release-notes-panel>
        <ul class="release-notes__entries" role="list">
          <li class="release-notes__entry">
            <span class="release-notes__badges"><span class="badge" data-release-notes-category="feature">Feature</span></span>
            <span class="release-notes__text">Added <code>release-notes</code> renderer.</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</div>
```

Upgrading an existing app:
- Replace local changelog renderers and release CSS with `attachReleaseNotes` or `createReleaseNotes` from `release-notes.js`.
- Pass parsed releases from `parseChangelog` or a server changelog endpoint; use `groupByArea`, `showStatus`, and `pageSize` for admin consoles.
- See the [Release notes section](../../src/demo/visual-style-gallery.html#release-notes) of the gallery.

### help-page
Help page pattern ([help-page.js](../../src/js/help-page.js), [help-page.css](../../src/css/components/help-page.css)).
Uses [collapsible.js](../../src/js/collapsible.js), [release-notes.js](../../src/js/release-notes.js), and [icon.js](../../src/js/icon.js).
- `attachHelpPage(root, options)` enhances existing markup via `data-help-page-*` hooks; `createHelpPage(doc, options)` builds the skeleton first.
- Also exports `buildFeedbackMailto(options)`, `parseHelpQuery(input)`, and `formatHelpQuery(params)`.
- Controller methods: `setTopic`, `getTopic`, `setQuery`, `getQuery`, `reset`, `applyQuery`, `getQueryString`, `expandAllFaq`, `collapseAllFaq`, `toggleAllFaq`, `setFeedback`, `setReleases`, `refresh`, and `destroy`.
- Sections list space-separated topics in `data-help-page-topics`; matching FAQ items auto-expand during search and stay `hidden="until-found"` when collapsed.
- Supports `?q=` and `?topic=` links on load or via `applyQuery`, optional `syncUrl`, feedback `mailto:` updates, and release notes in `[data-help-page-release-notes]`.

```html
<div class="help-page" data-help-page>
  <div class="help-page__toolbar">
    <div class="field help-page__search">
      <label class="field__label" for="help-search">Search help</label>
      <div class="help-page__search-row">
        <input class="field__control help-page__search-control" id="help-search" type="search" data-help-page-search>
        <button class="icon-button help-page__search-clear" type="button" aria-label="Clear search" data-help-page-search-clear hidden>...</button>
      </div>
    </div>
    <div class="help-page__filters" role="group" aria-label="Help topics" data-help-page-filters>
      <button class="chip chip--filter" type="button" aria-pressed="true" data-help-page-topic="all">All Topics</button>
      <button class="chip chip--filter" type="button" aria-pressed="false" data-help-page-topic="faq">Q&amp;A / FAQ</button>
    </div>
  </div>
  <div class="empty-state help-page__no-results" data-help-page-no-results hidden>
    <h2 class="empty-state__title">No matching topics</h2>
    <p class="empty-state__text" role="status" aria-live="polite">No topics match "<span data-help-page-no-results-term></span>".</p>
    <div class="empty-state__actions"><button class="button button--secondary" type="button" data-help-page-reset>Reset Search</button></div>
  </div>
  <section class="card help-page__section" data-help-page-section data-help-page-topics="faq">
    <h2 class="card__title">Questions &amp; Answers</h2>
    <div class="help-page__actions"><button class="button button--quiet help-page__faq-toggle" type="button" data-help-page-faq-toggle aria-expanded="false">Expand All</button></div>
    <div class="help-page__faq-list" data-help-page-faq-list>
      <div class="collapsible help-page__faq" data-help-page-faq-item data-help-page-tags="sso login">
        <button class="collapsible__toggle help-page__faq-question" type="button" aria-expanded="false" aria-controls="help-faq-1">...</button>
        <div class="collapsible__panel" id="help-faq-1" hidden="until-found"><p class="card__text">...</p></div>
      </div>
    </div>
  </section>
  <section class="card help-page__section" data-help-page-section data-help-page-topics="release-notes">
    <h2 class="card__title">Release Notes</h2>
    <div class="release-notes" data-help-page-release-notes></div>
  </section>
</div>
```

Upgrading an existing app:
- Replace local help view filtering, FAQ expand-all, query parsing, and feedback mailto helpers with `attachHelpPage` from [help-page.js](../../src/js/help-page.js).
- Keep app-specific help text and server info fetching local; call `setFeedback` on sign-in or status updates and `setReleases` after parsing the changelog.
- See the [Help page section](../../src/demo/visual-style-gallery.html#help-page) of the gallery and the standalone [help-page.html](../../src/demo/help-page.html) demo.

### list
List. Native collection and description markup; no JavaScript module.

- Use native unordered lists for collections, ordered lists for sequences, and description lists for term/value pairs.
- Ordered lists retain decimal markers; unordered collections omit markers.
- Compose action rows with `.row__list`, `.row`, `.row__main`, and `.row__actions`; retain native list items.
- Plain items use `.list__item`; definition terms and values use `.list__term` and `.list__value`.
- Use `.list--facts` for a bordered grid of muted terms and values; `.list--compact` narrows the term column.
- Long text wraps; definition pairs stack at narrow widths.
- Lists remain static; Tab visits nested links and buttons in document order.
- Nested controls retain their component's hover, focus-visible, active, and disabled states.
- Lists have no selection, disabled, or error state themselves; use existing loading, banner, and empty-state patterns.
- Preserve list semantics when suppressing markers; verify the accessibility tree in browser tests.

The [WAI content structure tutorial](https://www.w3.org/WAI/tutorials/page-structure/content/) describes the native list semantics.

```html
<ul class="list" role="list"><li class="list__item">Buy milk</li></ul>
<ol class="list"><li class="list__item">Check quantities</li></ol>
<ul class="list row__list" role="list" aria-label="Tasks">
  <li class="row">
    <span class="row__main">Buy milk</span>
    <span class="row__actions"><button class="button" type="button">Edit Buy milk</button></span>
  </li>
</ul>
<dl class="list list--definitions"><dt class="list__term">Owner</dt><dd class="list__value">Ann</dd></dl>
<dl class="list list--facts list--compact"><dt class="list__term">ID</dt><dd class="list__value">34</dd></dl>
```

### view-header
View header. A screen's page title and an optional muted summary line; no JavaScript module.
- The title uses `--font-heading` and `--text-2xl`; the app chooses the heading level.
- An empty or `hidden` summary takes no room, so a live `role="status"` element stays mounted safely.
- Select dynamic summary nodes with `data-*` hooks, such as `data-view-header-text`, never style classes.

```html
<header class="view-header">
  <h1 class="view-header__title">Notifications</h1>
  <p class="view-header__text" role="status" data-view-header-text>3 unread · 12 total</p>
</header>
<header class="view-header">
  <h1 class="view-header__title">Accounts</h1>
</header>
```

Upgrading an existing app:
- Replace app-local `.view-header` and `.screen-title` CSS with `.view-header`, `.view-header__title`, and `.view-header__text`.
- Move dynamic summary hooks from style classes to `data-*` attributes and native `hidden` or empty text.
- See the [View header section](../../src/demo/visual-style-gallery.html#view-header) of the gallery.

### toolbar
Toolbar. Filter fields and optional actions in one wrapping row above a table or list; no JavaScript module.
- Items align to their bottom edge so labeled controls and trailing buttons share one baseline.
- Field containers keep at least `--width-menu` where room allows and wrap cleanly on narrow screens.
- Use `role="search"` with an accessible label so inputs and selects keep ordinary Tab and arrow keys.
- Never set `role="toolbar"` on filter fields, since roving arrow keys conflict with text editing and selects.

```html
<div class="toolbar" role="search" aria-label="Filter accounts">
  <div class="field">
    <label class="field__label" for="account-filter">Filter this page</label>
    <input class="field__control" id="account-filter" type="search" placeholder="Name or email">
  </div>
  <div class="field">
    <label class="field__label" for="account-size">Page size</label>
    <select class="field__control" id="account-size"><option>20</option><option>50</option><option>100</option></select>
  </div>
</div>
```

### table
Data table. Native tabular markup; no JavaScript module.
- Preserve native table display, captions, column headers, and row headers.
- Use `.table__numeric` for numeric alignment and tabular figures.
- Use `.table--dense` for reduced cell padding; nested controls keep their normal touch targets.
- Share row spacing, surface, border, and text tokens without applying flex-based `.row` styling to table rows.
- Wrap wide tables in `.table__scroll`, or `.table__frame` for a bordered card frame; overflow stays contained.
- Make the named scroll region focusable for keyboard scrolling, with the global visible focus glow.
- Tab visits the wrapper and nested controls; cells remain static and have no arrow-key navigation model.
- Body rows show hover feedback; `tr[aria-selected="true"]` adds the selected ground and a primary inline-start edge.
- Forced colors keep a `Highlight` inline-start border on selected rows, so selection never relies on color alone.
- Tables have no disabled or error state themselves; nested controls keep their own component states.
- Use existing loading, banner, and empty-state patterns for request outcomes, keeping caption and headers meaningful.
- CSS introduces no sorting or selection behavior; applications must supply behavior before exposing those controls.

The [WAI-ARIA table pattern](https://www.w3.org/WAI/ARIA/apg/patterns/table/) recommends native tables for static tabular content.

```html
<div class="table__frame" role="region" aria-labelledby="accounts-caption" tabindex="0">
  <table class="table table--dense">
    <caption class="visually-hidden" id="accounts-caption">Accounts</caption>
    <thead><tr><th scope="col" class="table__numeric">ID</th><th scope="col">Account</th><th scope="col">Details</th></tr></thead>
    <tbody>
      <tr aria-selected="true"><td class="table__numeric">34</td><th scope="row">South relay</th><td><button class="button button--secondary button--small" type="button">Inspect South relay</button></td></tr>
    </tbody>
  </table>
</div>
```

### pager
Pager. Status text beside First, Previous, Next, and Last buttons below a table or list; no JavaScript module.
- Use a labeled `nav.pager` landmark; disambiguate `aria-label` when multiple pagers appear on one page.
- `.pager__text` uses muted small text with tabular numerals; `.pager__buttons` wraps native secondary buttons.
- Disable unavailable boundary buttons natively with `disabled`; applications own paging state, bookmarks, and requests.

```html
<nav class="pager" aria-label="Pages">
  <p class="pager__text">Page 1 · 20 records shown</p>
  <div class="pager__buttons">
    <button class="button button--secondary" type="button" disabled>First</button>
    <button class="button button--secondary" type="button" disabled>Previous</button>
    <button class="button button--secondary" type="button">Next</button>
    <button class="button button--secondary" type="button">Last</button>
  </div>
</nav>
```

### entry-list
Entry list. Log lines or events as spaced cards, newest first; no JavaScript module.
- Use a native `ul.entry-list` with `role="list"` and an `aria-label`, so suppressed markers keep list semantics.
- Each `li.entry-list__item` card shows `.entry-list__message` first, then the `.entry-list__meta` chip row.
- The message keeps its line breaks; `.entry-list__message--code` sets log lines in monospace.
- The chip row wraps and starts with a time chip: the `clock` icon and a `time` element with a `datetime` value.
- Severity uses a status chip; `.entry-list__code` sets identifiers such as logger names in a monospace chip that may wrap.
- An optional `.entry-list__action` holds one icon button at the end of the chip row, such as a details toggle.
- A details toggle sets `aria-expanded` and `aria-controls`; its chevron turns while `.entry-list__details` shows.
- Details, such as pretty-printed JSON, follow the chip row inside the card and keep their line breaks.
- Cards show hover feedback with `--color-surface-hover`; their chips and details rise to `--color-surface` to stay distinct.
- Cards stay static: Tab visits only nested buttons and links, and there is no selection or arrow-key model.
- Use existing loading, banner, empty-state, and pager patterns for request outcomes and paging.

```html
<ul class="entry-list" role="list" aria-label="Recent log entries">
  <li class="entry-list__item">
    <p class="entry-list__message entry-list__message--code">Processing error: connection closed</p>
    <div class="entry-list__meta">
      <span class="chip"><svg class="icon" aria-hidden="true" focusable="false"><use href="icons.svg#icon-clock"/></svg><time datetime="2026-11-17T09:03:18Z">2026-11-17 09:03:18</time></span>
      <span class="chip chip--status chip--danger"><svg class="icon" aria-hidden="true" focusable="false"><use href="icons.svg#icon-alert"/></svg>Error</span>
      <span class="chip entry-list__code">relay.audit</span>
      <span class="entry-list__action">
        <button class="icon-button" type="button" aria-expanded="true" aria-controls="entry-details-7" aria-label="Hide details of entry 7"><svg class="icon" aria-hidden="true" focusable="false"><use href="icons.svg#icon-chevron-down"/></svg></button>
      </span>
    </div>
    <pre class="entry-list__details" id="entry-details-7">{ "account": 34 }</pre>
  </li>
</ul>
```

### detail-panel
Detail panel. Record details inside the shell's side panel; no JavaScript module.
- Compose `.detail-panel__header`, scrolling `.detail-panel__body`, `.detail-panel__section` blocks, and an optional `.detail-panel__danger` zone.
- Move focus into the panel on open, return focus on close, and confirm destructive actions in place.

```html
<div class="detail-panel">
  <header class="detail-panel__header">
    <h2 class="detail-panel__title" id="detail-title" tabindex="-1">Alex North</h2>
    <button class="icon-button" type="button" aria-label="Close user details">
      <svg class="icon" aria-hidden="true"><use href="icons.svg#icon-close"/></svg>
    </button>
  </header>
  <div class="detail-panel__body">
    <section class="detail-panel__section" aria-labelledby="detail-facts">
      <h3 id="detail-facts">Facts</h3>
      <dl class="list list--facts list--compact"><dt class="list__term">ID</dt><dd class="list__value">34</dd></dl>
    </section>
    <section class="detail-panel__section detail-panel__danger" aria-labelledby="detail-danger">
      <h3 id="detail-danger">Danger zone</h3>
      <div class="detail-panel__actions">
        <button class="button button--secondary button--danger" type="button">Mark for deletion</button>
        <div class="inline-confirm" role="group" aria-label="Confirm permanent deletion" hidden>...</div>
      </div>
    </section>
  </div>
</div>
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
- Mark selection with an underline and text emphasis; preserve a separate visible focus glow.
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
`toast.js` uses `file-download.js` when `download` (`{ json | blob | source | url, filename, label? }` or a `createFileDownload` handle) is passed, making the toast persistent by default.
Its button carries `data-toast-action="download"`, ignores `Ctrl+Z`, and revokes its object URL when dismissed.

```html
<div class="toast-region" role="region" aria-label="Notifications">
  <div class="toast"><p class="toast__text">Task deleted.</p><button class="button button--quiet" type="button" data-toast-action="undo">Undo</button></div>
  <div class="toast"><p class="toast__text">Account export is ready.</p><button class="button button--quiet" type="button" data-toast-action="download">user-data.json</button></div>
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
Progress bar. Delivered as CSS with native determinate and indeterminate states.

```html
<label class="progress">
  <span class="progress__label">Uploading</span>
  <progress class="progress__bar" max="100" value="40">40%</progress>
</label>
```

Omit `value` for indeterminate progress; never set a fake percentage.
Keep a visible label associated with each bar. Native values support empty, partial, and complete progress.
**[Decided]** Indeterminate tracks stay static for every motion preference; status text communicates unknown duration.
Use a separate polite status for announcements; progress values alone are not live regions.

### spinner
Spinner. The spinner is decoration; the status text carries the meaning.

```html
<span class="spinner" aria-hidden="true"></span><span role="status">Syncing...</span>
```

Use `.spinner--sm` for the small size; the default is medium.
Keep the ring decorative and provide localized visible status text beside it.
Reduced motion disables rotation entirely. Neither component needs JavaScript or introduces keyboard stops.
Applications update status text and native progress values; keep status outside any busy content region.

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
Tooltip. Explicit text supplies the accessible description; the trigger retains its independent accessible name.

```html
<button class="icon-button" type="button" aria-label="Refresh" aria-describedby="refresh-tip">...</button>
<span class="tooltip" id="refresh-tip" role="tooltip">Refresh the forecast</span>
```

Import `attachTooltip(trigger, element)` or `createTooltip(doc, { trigger, text })` from [tooltip.js](../../src/js/tooltip.js).
Controllers expose `element`, `open()`, `close()`, `isOpen()`, and `destroy()`.
Attachment preserves existing descriptions, removes the native title, and restores authored attributes on destruction.
The builder inserts plain text and removes its generated element on destruction.
Focus and mouse hover open the tooltip; Escape dismisses it without changing focus.
Hover remains open over either element, with a short exit grace period for crossing between them.
Touch users receive no hover behavior; essential instructions must remain visible elsewhere.
Use text only, without focusable content, explicit tooltip names, or live regions.
Without enhancement, the description stays visible and readable.
Chromium accessibility-tree evidence replaced the initial live screen reader gate by orchestrator decision.
Narrator with Edge announced the gallery tooltip button as name, role, then description, once each: "Refresh forecast. Button. Get the latest forecast for this location".
Narrator first announces the enclosing section heading, so a leading section name is not a defect.
Escape closed the tooltip and kept focus on the button; hover showed it visually, and Narrator speaks nothing on hover.
Not verified: NVDA, other browsers, and touch screen readers.

Label tooltips name icon-only controls on mouse hover and keyboard focus:

```js
import { attachLabelTooltips } from './tooltip.js';

const labels = attachLabelTooltips(document); // every .icon-button, by delegation
attachLabelTooltips(sidebar, { selector: 'a[href]', placement: 'inline-end', when: () => isRail() });
labels.destroy();
```

- One shared `tooltip tooltip--label` element per call shows the control's name, read from `aria-label`, `aria-labelledby`, `title`, or text.
- It is `aria-hidden` and adds no `aria-describedby`, since the name is already the accessible name.
- `when(control)` gates each control; `placement` is `block-end` (below, flipping above) or `inline-end` (beside).
- It follows `aria-label` changes, closes when a click hides or removes the control, and suspends a native `title` while open.
- Nested roots may overlap; the innermost root that names a control shows its tooltip.

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
Theme switch. System removes `data-theme`; Light and Dark set it on the root element and sync `meta[name="color-scheme"]`.

```html
<fieldset class="segmented theme-switch" data-theme-switch>
  <legend class="segmented__legend">Theme</legend>
  <label class="segmented__option"><input type="radio" name="theme" value="system" checked>System</label>
  <label class="segmented__option"><input type="radio" name="theme" value="light">Light</label>
  <label class="segmented__option"><input type="radio" name="theme" value="dark">Dark</label>
</fieldset>
```

Pre-paint boot script ([theme-boot.js](../../src/js/theme-boot.js)):
- Place `<meta name="color-scheme" content="light dark">` and the classic boot script in `<head>` before stylesheets.
- Pass `data-theme-switch-app="{{app-name}}"` and optional `data-theme-switch-legacy-key` to migrate a legacy key once without throwing.
- Use `themeBootScript(appName, { legacyKey })` from [theme-switch.js](../../src/js/theme-switch.js) when a server template inlines the script.

```html
<meta name="color-scheme" content="light dark">
<script src="vendor/design/js/theme-boot.js" data-theme-switch-app="example" data-theme-switch-legacy-key="example_theme"></script>
```

Account theme sync ([theme-switch.js](../../src/js/theme-switch.js)):
- `themeOfSettings(settings)` reads `theme` or `style-settings` from lists, objects, or strings, mapping `default` to `system`.
- `syncAccountTheme({ appName, settings, load, onChange, onError })` applies the account theme at sign-in without a mounted switch.
- `attachThemeSwitch(element, { appName, legacyKey, sync: { load, save, onError } })` exposes `sync(settings?)` and saves manual changes.
- Account sync never echoes `save(theme)` back; cross-tab `storage` events keep open tabs aligned without saving.

Upgrading an existing app:
- Replace hand-written `<head>` theme scripts with `theme-boot.js`, setting `data-theme-switch-app` and any `data-theme-switch-legacy-key`.
- Replace local settings parsing and server theme sync with `themeOfSettings`, `syncAccountTheme`, and `attachThemeSwitch` `sync` callbacks.
- See the [Theme switch section](../../src/demo/visual-style-gallery.html#theme-switch) of the gallery.

### install-prompt
Install prompt tracking ([install-prompt.js](../../src/js/install-prompt.js)).
The module owns no button; it tracks `beforeinstallprompt`, `appinstalled`, and `(display-mode: standalone)` and reports `{ installable, installed }`.

```html
<button class="button button--secondary" type="button" data-install-prompt-action hidden>Install app</button>
```

- Call `attachInstallPrompt({ window, matchMedia, onChange })`; `onChange({ installable, installed })` runs only when state changes.
- The controller exposes `getState()`, `isInstallable()`, `isInstalled()`, `prompt()`, and `destroy()`.
- Call `prompt()` inside a click handler; it clears the single-use event before awaiting and resolves to the choice.
- Without a kept event, `prompt()` resolves to `{ outcome: 'unavailable' }`; standalone mode keeps the action hidden.
- Use native `hidden` and `aria-disabled="true"` while prompting so focus stays on the button.

Upgrading an existing app:
- Replace local `beforeinstallprompt`, `appinstalled`, and `standalone` handlers with `attachInstallPrompt` from [install-prompt.js](../../src/js/install-prompt.js).
- Show or hide the app's install button from `onChange` and call `prompt()` from its click handler.
- See the [portal shell demo](../../src/demo/shell-portal.html) for a wired `data-install-prompt-action` button.

### file-download
File download helper ([file-download.js](../../src/js/file-download.js)).
Hands the viewer a JSON value or `Blob` as a named file through a temporary hidden `a[download]`.

```html
<button class="button button--secondary" type="button" data-file-download-json="sample-export.json">Download sample JSON</button>
```

- `downloadJson(value, filename, options)` formats JSON with two-space indentation and a trailing newline, clicks a temporary anchor, and revokes the URL after a short delay.
- `downloadBlob(blob, filename, options)` and `downloadFile(source, filename, options)` download a `Blob` or JSON value the same way.
- `downloadUrl(href, filename, options)` clicks a temporary `a[download]` for an existing URL without managing revocation.
- `createFileDownload(source, filename, options)` returns `{ filename, blob, url, download, revoke, isRevoked, destroy }` to keep an object URL until dismissed.
- Pass `{ download: { json, filename } }` or `{ download: { blob, filename } }` to `createToast().show()` for a persistent download toast that revokes its URL on dismiss.

Upgrading an existing app:
- Replace local helpers such as Auth admin's `saveJson` with `downloadJson`, `downloadBlob`, or `downloadFile` from [file-download.js](../../src/js/file-download.js).
- Replace manual `urlsByNoteId` maps and notification-delete cleanup in Auth and counters account exports with `toast.js` `download` actions.
- See the [File download section](../../src/demo/visual-style-gallery.html#file-download) of the gallery.

### screen-action-bar
Screen action bar renderer ([screen-action-bar.js](../../src/js/screen-action-bar.js)).
Draws the screen actions that `RoutedView` passes to `app.setScreenActions` inside the shell's `.app__action-bar`.

```html
<div class="app__action-bar" data-screen-action-bar>
  <button class="button button--secondary" type="button" data-screen-action-bar-item data-action="view.save">Save</button>
  <a class="button button--secondary" href="/help" data-screen-action-bar-item data-action="view.help" aria-disabled="true" title="Load data first" aria-description="Load data first">Help</a>
</div>
```

- Call `attachScreenActionBar(root, { app, getAction, events, eventType, before, onAction, document })`.
- The controller returns `setScreenActions(actions)`, `render()`, `getElement()`, `getActions()`, and `destroy()`.
- Actions with `href` render as links with `aria-disabled="true"` when disabled; other actions render as native buttons with `disabled`.
- Disabled actions expose `disabled-reason` (falling back to `description`) in `title` and `aria-description`; empty bars remove `.app__action-bar`.
- Listening on `ACTION_STATE_CHANGED_EVENT` (`action-state-changed`) redraws on state changes; DOM construction escapes every text and attribute value.

Upgrading an existing app:
- Replace Auth shell `setScreenActions` and `renderActionBar` methods or counters' local `app-action-bar.mjs` with `attachScreenActionBar` from [screen-action-bar.js](../../src/js/screen-action-bar.js).
- Mark the sibling that follows the bar with `data-screen-action-bar-before`, or pass `before`, and bind `app.setScreenActions = bar.setScreenActions`.
- See the [portal shell demo](../../src/demo/shell-portal.html) for a routed view driving the screen action bar.

### action-registry
Action registry ([action-registry.js](../../src/js/action-registry.js)).
Stores app and routed-view actions with enabled state, disabled reasons, state events, and `[data-action]` click delegation.

```html
<button class="button button--secondary" type="button" data-action="items.export">Export</button>
<a class="button button--secondary" href="/help" data-action="navigate-to-help" aria-disabled="true" title="Sign in first" aria-description="Sign in first">Help</a>
```

- Call `createActionRegistry({ actions, getScope, onNavigate, root, document, events })` or `attachActionRegistry(root, options)`.
- The controller returns `addAction`, `removeAction`, `getAction`, `getActions`, `isActionEnabled`, `enableAction`, `disableAction`, `toggleAction`, `runAction`, `addEventListener`, `removeEventListener`, `attach`, `detach`, and `destroy`.
- Action descriptors carry `id`, `title`, `description`, `href` or `run`, `disabled`, `disabled-reason`, and a tracked `run-count`.
- `getScope` resolves `${scope}.${id}` before global IDs; `onNavigate(href, action, data)` handles `href` actions so routing stays outside.
- State changes emit `ACTION_STATE_CHANGED_EVENT` (`action-state-changed`); additions, removals, and runs emit `ACTION_ADDED_EVENT`, `ACTION_REMOVED_EVENT`, `ACTION_RUN_EVENT`, and `action.id`.
- Delegated clicks on `[data-action]` pass dataset values to `runAction`, and block disabled actions and `aria-disabled="true"` controls.

Upgrading an existing app:
- Replace the action map, state methods, and `[data-action]` click handler in Auth's or counters' `App` with `createActionRegistry` or `attachActionRegistry` from [action-registry.js](../../src/js/action-registry.js).
- Pass initial `APP_ACTIONS` in `options.actions`, wire `getScope: () => this.activeView?.id`, and pass `onNavigate: (href) => this.activateView(href, {}, 'navigate action')`.
- Pair it with [screen-action-bar.js](../../src/js/screen-action-bar.js) and [view.js](../../src/js/view.js), as shown in the [portal shell demo](../../src/demo/shell-portal.html).

### notices
Notices router and notification store ([notices.js](../../src/js/notices.js)), using [toast.js](../../src/js/toast.js) and [icon.js](../../src/js/icon.js).
Errors and warnings stay in `.app__banners` (at most three); other notices become toasts.

```html
<div class="app__banners" data-notices-banners>
  <div class="banner banner--danger" role="alert" data-notices-banner data-notices-id="2" data-notices-source="inbox">
    <svg class="icon" aria-hidden="true" focusable="false"><use href="icons.svg#icon-alert"/></svg>
    <p class="banner__text"><strong>Outage:</strong> Service maintenance is underway.</p>
    <a class="link-button" href="/notifications" data-notices-all>View all 3 alerts</a>
    <a class="button button--quiet" href="/help" data-notices-action>Read more</a>
    <button class="icon-button" type="button" data-notices-dismiss aria-label="Dismiss" title="Dismiss">
      <svg class="icon" aria-hidden="true" focusable="false"><use href="icons.svg#icon-close"/></svg>
    </button>
  </div>
</div>
```

- Call `createNotices(options)` or `attachNotices(banners, options)` after calling `setSpriteUrl`.
- Store methods include `addNotification`, `deleteNotification`, `getNotifications`, `clearNotifications`, `setInboxNotifications`, `getInboxNotifications`, `getUnreadCount`, and `refreshInbox`.
- Lifecycle methods include `dismissBanner`, `update`, `attach`, `detach`, `addEventListener`, `removeEventListener`, and `destroy`.
- Pure helpers exported: `noticeKind`, `bannerVariant`, `bannerRole`, `pickBanner`, and `safeUrl`.
- Store events exported: `NOTIFICATION_ADDED_EVENT`, `NOTIFICATION_DELETED_EVENT`, `NOTIFICATIONS_CLEARED_EVENT`, and `NOTIFICATIONS_UPDATED_EVENT`.
- `pickBanner` picks the most severe, then newest, live sticky inbox notice and counts all active alerts.
- Dismissing an app banner or toast deletes its notification; dismissing an inbox banner calls `onDiscardInbox`.
- Action URLs must be same-origin paths or `http(s)` links; all text is built with DOM APIs.
- Placeholder entries guard against duplicate toasts when overflow removes an older toast during `show()`.

Upgrading an existing app:
- Replace Auth's `app-notices.mjs` and `App` notification store, or counters' `app-notification-bar.mjs` and `toast-manager.mjs`, with [notices.js](../../src/js/notices.js).
- Pass `onDiscardInbox`, `loadInbox`, `isSignedIn`, and `onNavigate` callbacks so API and routing stay app-local.
- See the [portal shell demo](../../src/demo/shell-portal.html) for live error, warning, info, action, and sticky inbox notices.

### inbox
Notifications inbox and top-bar unread button ([inbox.js](../../src/js/inbox.js), [inbox.css](../../src/css/components/inbox.css), [shell.css](../../src/css/shell.css)).
Uses [selection.js](../../src/js/selection.js), [notices.js](../../src/js/notices.js), and [icon.js](../../src/js/icon.js).

```html
<a class="icon-button app__notifications-button" href="/notifications" data-inbox-button aria-label="Notifications, 3 unread notifications" title="Notifications, 3 unread notifications">
  <svg class="icon" aria-hidden="true" focusable="false"><use href="icons.svg#icon-bell"/></svg>
  <span class="badge badge--count app__notifications-count" data-inbox-count aria-hidden="true">3</span>
</a>
<div class="inbox" data-inbox>
  <header class="view-header">
    <h1 class="view-header__title">Notifications</h1>
    <p class="view-header__text" role="status" data-inbox-summary>1 unread · 2 total</p>
  </header>
  <p class="loading__status inbox__loading" role="status" aria-live="polite" data-inbox-loading hidden>Loading notifications…</p>
  <div class="empty-state inbox__empty" data-inbox-empty hidden>...</div>
  <fieldset class="selection inbox__selection" data-selection-root data-inbox-selection tabindex="-1">
    <legend class="visually-hidden">Notifications</legend>
    <label class="selection__row"><input class="selection__control" type="checkbox" data-selection-all> Select all</label>
    <ul class="list row__list inbox__list" role="list" aria-label="Notifications" data-inbox-list>
      <li class="row inbox__item inbox__item--unread" data-inbox-item="1" data-inbox-unread="true">
        <label class="inbox__select"><input class="selection__control" type="checkbox" data-selection-item value="1"><span class="visually-hidden">Select Storage</span></label>
        <span class="row__main inbox__main">
          <span class="inbox__heading"><span class="inbox__title">Storage</span><span class="badge badge--warning">Warning</span><span class="badge inbox__unread" data-inbox-unread-badge>Unread</span></span>
          <p class="inbox__message">Archive storage reached 80% capacity.</p>
          <span class="inbox__meta"><span class="chip" data-inbox-source>storage</span><span class="chip" title="2026-11-23 10:30"><svg class="icon" aria-hidden="true" focusable="false"><use href="icons.svg#icon-clock"/></svg><time datetime="2026-11-23T10:30:00Z">2h ago</time></span></span>
        </span>
        <span class="row__actions inbox__actions">
          <a class="button button--secondary button--small" href="/storage" data-inbox-action="open" aria-label="Open: Storage">Open</a>
          <button class="button button--secondary button--small" type="button" data-inbox-action="mark-read" aria-label="Mark Read: Storage">Mark Read</button>
          <button class="button button--secondary button--danger button--small" type="button" data-inbox-action="discard" aria-label="Discard: Storage">Discard</button>
        </span>
      </li>
    </ul>
    <p class="selection__count inbox__count" data-selection-count role="status" aria-live="polite" aria-atomic="true">0 selected</p>
    <div class="selection__bar" data-selection-bar role="group" aria-label="Bulk actions" hidden>
      <button class="button button--secondary" type="button" data-selection-action="mark-read">Mark Read</button>
      <button class="button button--danger" type="button" data-selection-action="discard">Discard</button>
      <button class="button button--quiet" type="button" data-selection-clear>Clear Selection</button>
    </div>
  </fieldset>
  <div class="inbox__footer">
    <button class="button button--secondary button--danger" type="button" data-inbox-discard-all>Discard All</button>
  </div>
</div>
```

- Call `createInbox(doc, options)` or `attachInbox(root, options)` after calling `setSpriteUrl`.
- Controller methods: `setNotifications`, `getNotifications`, `setLoading`, `getSelectedIds`, `clearSelection`, `refresh`, and `destroy`.
- Call `createUnreadButton(doc, options)` or `attachUnreadButton(button, options)` for the top-bar button.
- Unread button methods: `setCount`, `getCount`, `setRoute`, and `destroy`; both badge and accessible name cap at `99+`.
- Pass `options.notices` from [notices.js](../../src/js/notices.js) so rows and unread counts stay synchronized automatically.
- Actions emit bubbling `inbox:action` (`INBOX_ACTION_EVENT`) with `{ action, ids, notifications, scope }`; bulk `mark-read` skips already-read rows.
- Same-origin `Open` links emit cancelable `inbox:navigate` (`INBOX_NAVIGATE_EVENT`) and invoke `options.onNavigate`; unsafe URLs are omitted.
- Pure helpers exported: `isUnread`, `inboxTypeBadge`, `formatUnreadCount`, `formatUnreadLabel`, and `formatInboxSummary`.

Upgrading an existing app:
- Replace Auth's `notifications-view.mjs` rendering and `app.css` inbox and unread button styles, or counters' `notifications-view.mjs`, with [inbox.js](../../src/js/inbox.js).
- Wire `attachUnreadButton` and `attachInbox` to your [notices.js](../../src/js/notices.js) store and handle `inbox:action` with your API client.
- See the [Notifications inbox section](../../src/demo/visual-style-gallery.html#inbox) and the interactive [portal shell demo](../../src/demo/shell-portal.html#sample-inbox-title).

### dom-builders
DOM builders ([dom-builders.js](../../src/js/dom-builders.js)), using [icon.js](../../src/js/icon.js) and [inline-confirm.js](../../src/js/inline-confirm.js).
Builds light-DOM elements and catalog component skeletons without `innerHTML`, using `data-*` hooks and native ARIA states.

```js
import { createDomBuilders } from './dom-builders.js';

const dom = createDomBuilders(document);
const slot = dom.inlineConfirm(
    dom.button('Delete', null, { kind: 'primary', danger: true }),
    { label: 'Confirm delete', text: 'Delete forever?', confirmLabel: 'Delete', onConfirm }
);
```

- Call `createDomBuilders(doc, { icons })` to bind builders to an injected `document` and release `inlineConfirm` listeners via `destroy()`.
- Top-level exports mirror those methods: `h`, `setChildren`, `button`, `select`, `checkbox`, `facts`, `dataTable`, `severityOf`, `severityChip`, `statusLine`, `errorBanner`, `emptyState`, and `inlineConfirm`.
- `h(tag, props, ...children)` wires `on*` listeners and sets `value`, `checked`, `disabled`, `hidden`, `open`, and `selected` properties.
- `h` and `setChildren` flatten nested arrays, skip `null`, `undefined`, and `false`, and escape primitives as text nodes.
- Each component builder emits its normative catalog skeleton from this document.
- `severityOf(name)` normalizes `warn` to `warning`, `danger` to `error`, and unknown names to `info`.
- `severityChip` pairs distinct sprite icons with text; call `setSpriteUrl` first, or pass `{ icons }` overrides.

Upgrading an existing app:
- Replace local `h`, `setChildren`, and component builders in Auth's and ToDo's `admin/js/ui.mjs` with [dom-builders.js](../../src/js/dom-builders.js).
- Remove legacy `.facts`, `.table-wrap`, `.data-table`, `.chip--sev`, `.muted`, and `.confirm-slot` rules; builders emit package skeletons directly.
- See the [admin console shell demo](../../src/demo/shell-admin-console.html) and [shell-admin-console.js](../../src/demo/shell-admin-console.js) for live builder usage.

### data-loader
Data loading helper ([data-loader.js](../../src/js/data-loader.js)), using [dom-builders.js](../../src/js/dom-builders.js).
Loads async data into a container with loading, failed with Retry, and 401 Sign in states.

```js
import { attachDataLoader } from './data-loader.js';

const loader = attachDataLoader(container, {
    what: 'Server status',
    fetcher: ({ signal }) => fetchJson('/server', { signal }),
    render: (status) => dom.facts(rowsOf(status), true),
    onSignIn: () => ctx.signIn()
});
await loader.load();
await loader.reload({ quiet: true });
```

- `createDataLoader(defaults)` binds shared `document`, `dom`, `onSignIn`, and text formatters, returning `load`, `loadInto`, `cancel`, and `destroy`.
- `attachDataLoader(container, defaults)` binds one container with `load`, `reload`, `cancel`, and `destroy`.
- `loadInto(container, ctx, what, fetcher, render, options)` and `loadInto(container, options)` support direct one-off loads.
- Newest call per container wins; superseded calls abort their `AbortSignal`, drop late results, and resolve to `false`.
- Non-quiet loads render `statusLine` with `data-data-loader-status` outside `aria-busy`; quiet refreshes keep content under `aria-busy="true"`.
- Failures render `errorBanner` (`role="alert"`) with `data-data-loader-error="failed"` and a Retry button (`data-data-loader-action="retry"`).
- A 401 error renders `data-data-loader-error="unauthorized"` and a primary Sign in button (`data-data-loader-action="sign-in"`) when `onSignIn` exists.

Upgrading an existing app:
- Replace local `loadInto` in Auth's and ToDo's `admin/js/ui.mjs` with [data-loader.js](../../src/js/data-loader.js); call `setSpriteUrl` before error banners render.
- Positional `loadInto(container, ctx, what, fetcher, render, { quiet })` calls keep working, or bind shared defaults with `createDataLoader({ onSignIn })`.
- See the [admin console shell demo](../../src/demo/shell-admin-console.html) and [shell-admin-console.js](../../src/demo/shell-admin-console.js) for Retry, 401, and quiet refresh.

### table-state
Paged and filtered table state ([table-state.js](../../src/js/table-state.js)), using [dom-builders.js](../../src/js/dom-builders.js).
Keeps filters, page size, and page number in the URL hash query without adding a history entry.

```js
import { attachTableState } from './table-state.js';

const table = attachTableState(section, {
    sizes: [20, 50, 100],
    defaultSize: 20,
    filters: { q: { default: '', trim: true }, status: { default: '', values: ['active', 'marked'] } },
    onChange: () => render()
});
const cut = table.slice(filteredRows);
table.updatePager({ cut, shown: filteredRows.length, loaded: allRows.length, noun: 'user' });
```

- `readHashQuery`, `formatHashQuery`, and `writeHashQuery` round-trip hash parameters via `history.replaceState` without firing `hashchange`.
- Empty values, `null`, `undefined`, `page <= 1`, and default filter or size values drop out of the hash query.
- `pageOf(rows, page, size)` and `table.slice(rows)` clamp page numbers to `[1, pages]` and sync clamped URLs.
- `pageParams(direction, envelope, size, extra)` builds bookmark Page envelope parameters; `offsetParams(page, size, extra)` builds `limit` and `offset`.
- In server mode (`mode: 'server'`), `pageKey` defaults to `null`, and `applyEnvelope` saves the prior request parameters for `serverParams('current')`.
- `createTableState(options)` manages state headlessly; `attachTableState(root, options)` binds controls via `data-table-state-*` hooks only.
- Supported hooks: `[data-table-state]`, `[data-table-state-filter="key"]`, `[data-table-state-size]`, `[data-table-state-pager]`, `[data-table-state-text]`, and `[data-table-state-action]`.
- `createPager(doc, options)` and `updatePager(options)` drive the normative `.pager` skeleton with native `disabled` boundary states.
- Same-route `hashchange` events reload state and sync controls; different route prefixes are ignored, and `destroy()` cleans up listeners.

Upgrading an existing app:
- Replace `readFilters`, `filterQuery`, `saveFilters`, `pageOf`, and `pager` in Auth's `admin/js/ui.mjs` with [table-state.js](../../src/js/table-state.js).
- Replace `readFilters`, `saveFilters`, `pageParams`, and pager wiring in ToDo's `admin/js/ui.mjs` with `createTableState({ mode: 'server' })` or `attachTableState`.
- See the [admin console shell demo](../../src/demo/shell-admin-console.html) and [shell-admin-console.js](../../src/demo/shell-admin-console.js) for live reload-safe filtering and paging.

### admin-console
Admin console frame ([admin-console.js](../../src/js/admin-console.js)), using [account-menu.js](../../src/js/account-menu.js), [app-nav.js](../../src/js/app-nav.js), [dom-builders.js](../../src/js/dom-builders.js), and [icon.js](../../src/js/icon.js).
Provides a screen registry, hash router, route marks, screen titles, centered gate pages, and a signed-out shell.

```js
import { createAdminConsole } from './admin-console.js';

const consoleFrame = createAdminConsole(document.getElementById('app'), {
    title: 'Admin Console',
    backLink: { href: '/', label: 'Back to Auth' },
    screens: [
        { name: 'overview', title: 'Overview', icon: 'lists', mount: mountOverview },
        { name: 'users', title: 'Users', icon: 'people', mount: mountUsers }
    ],
    checkSession: () => lookUpSession(),
    checkAccount: (session) => fetchAccount(session),
    onSignIn: () => redirectToSignIn(),
    onSignOut: () => endSession()
});
await consoleFrame.start();
```

- `parseRoute(hash, screens, defaultScreen)` parses `#/screen`, `#/screen/id`, and hash queries, falling back to `defaultScreen`.
- `displayName(account)` returns the trimmed account name, falling back to `email`.
- Each screen's `mount(view, ctx, route)` returns an optional `{ update, dispose }` controller.
- Same-screen hash changes call `update(route, ctx)` when present, keeping detail-panel filter queries; otherwise the frame disposes and remounts.
- Screen changes call `dispose()`, hide and clear the side panel, reset `main.scrollTop`, and update `aria-current="page"` and titles.
- The skip link prevents default navigation and focuses `#main`, keeping the hash route unchanged.
- `showChecking`, `showCheckFailed`, `showForbidden`, and `showGate` tear down active screens and render a centered `<main class="app__gate">`.
- `showSignedOut(message, { failure })` shows a primary Sign In button and tracks route marks without mounting protected screens.
- `navStates: ['open', 'hidden']` makes the nav toggle skip the icon rail.
- The shell names its icon buttons with label tooltips from `attachLabelTooltips`.
- `createAdminConsole(rootOrDoc, options)` builds the shell and gates; `attachAdminConsole(root, options)` enhances existing `.app` markup via `data-admin-console-*` hooks.
- Session lookup (`checkSession`), account lookup (`checkAccount`), and authorization (`isAuthorized`) stay with the app as callbacks.

Upgrading an existing app:
- Replace local router, shell builder, account menu wiring, and gate helpers in Auth's and ToDo's `admin/js/main.mjs` with [admin-console.js](../../src/js/admin-console.js).
- Remove app-local `.gate` and `.gate__actions` CSS rules; [shell.css](../../src/css/shell.css) styles `.app__gate` and `.app__gate-actions`.
- Pass session lookup, account check, sign-in, and sign-out callbacks in options, and keep `ctx.editor` or `ctx.panel` for detail panels.
- See the [admin console shell demo](../../src/demo/shell-admin-console.html) and [shell-admin-console.js](../../src/demo/shell-admin-console.js) for hash routing and gate previews.

### admin-overview
Shared admin Overview screen ([admin-overview.js](../../src/js/admin-overview.js)), using [auto-refresh.js](../../src/js/auto-refresh.js), [data-loader.js](../../src/js/data-loader.js), and [dom-builders.js](../../src/js/dom-builders.js).
Renders server state as bordered facts from an app-supplied data adapter and reloads quietly while the page is visible.

```js
import { createAdminConsole } from './admin-console.js';
import { createAdminOverviewScreen } from './admin-overview.js';

const consoleFrame = createAdminConsole(root, {
    title: 'Admin Console',
    screens: [
        createAdminOverviewScreen({
            adapter: { fetchStatus: ({ signal }) => api.get('/server', { signal }) }
        })
    ]
});
```

- `createAdminOverviewScreen(options)` returns an [admin-console.js](../../src/js/admin-console.js) screen descriptor with default icon `overview`, reusing `ctx.dom`, `ctx.signIn`, and `ctx.screenSignal`.
- `attachAdminOverview(root, options)` mounts into an existing element; `createAdminOverview(doc, options)` builds a root for an injected document.
- Controller methods: `refresh({ quiet })`, `getStatus()`, `dispose()`, and `destroy()` (alias of `dispose()`).
- `options.adapter.fetchStatus({ signal })` supplies server status; both Auth's `extra-info` and ToDo's flat payloads normalize automatically.
- `options.interval` defaults to `30_000` ms (`DEFAULT_RELOAD_INTERVAL`), stops while hidden, and refreshes on tab return after one interval.
- Passing `0`, `null`, or `false` as `interval` disables polling and omits the refresh cadence from the status line.
- Disconnected repositories render a danger banner (`[data-admin-overview-banner="repository"]`) with Retry above the Server facts.
- Fetch failures and 401 errors render [data-loader.js](../../src/js/data-loader.js) Retry and Sign in banners.
- Extension hooks `extraFacts`, `facts`, and `extraSections` add app-specific facts or sections without server changes.
- Pure helpers exported: `normalizeServerStatus`, `buildServerFacts`, and `formatTimestamp`; hooks use `data-admin-overview-*` and `data-fact` only.

Upgrading an existing app:
- Replace `overview-view.mjs` in Auth's and ToDo's admin consoles with `createAdminOverviewScreen` from [admin-overview.js](../../src/js/admin-overview.js).
- Pass `{ adapter: { fetchStatus: ({ signal }) => api.get('/server', { signal }) } }` so each app keeps its own endpoint.
- See the [admin console shell demo](../../src/demo/shell-admin-console.html#/overview) and [shell-admin-console.js](../../src/demo/shell-admin-console.js) for live states.

### admin-logs
Shared admin Logs screen ([admin-logs.js](../../src/js/admin-logs.js)), using [data-loader.js](../../src/js/data-loader.js), [dom-builders.js](../../src/js/dom-builders.js), [icon.js](../../src/js/icon.js), and [table-state.js](../../src/js/table-state.js).
Renders the server's log buffer as newest-first `.entry-list` cards, filtered by level and text and paged via URL hash.

```js
import { createAdminConsole } from './admin-console.js';
import { createAdminLogsScreen } from './admin-logs.js';

const consoleFrame = createAdminConsole(root, {
    title: 'Admin Console',
    screens: [
        createAdminLogsScreen({
            adapter: { fetchLogs: ({ signal }) => api.get('/logs', { signal }) }
        })
    ]
});
```

- `createAdminLogsScreen(options)` returns an [admin-console.js](../../src/js/admin-console.js) screen descriptor with default icon `logs`, reusing `ctx.dom`, `ctx.signIn`, and `ctx.screenSignal`.
- `attachAdminLogs(root, options)` mounts into an existing container; `createAdminLogs(doc, options)` builds a root for an injected document.
- Controller methods: `refresh({ quiet })`, `getEntries()`, `getFilteredEntries()`, `getState()`, `resetFilters()`, `tableState`, `dispose()`, and `destroy()`.
- `options.adapter.fetchLogs({ signal })` supplies entries; Auth's `log-entries`, ToDo's `elements`, and plain arrays normalize automatically.
- `stripIndent(message)` removes shared leading indent and trailing whitespace while keeping line breaks and stack-frame indentation intact.
- Filters (`q`, `level`), page size (`size`), and page number (`page`) persist in the URL hash via [table-state.js](../../src/js/table-state.js).
- Dotted logger names insert `<wbr>` after each dot inside `.entry-list__code`, so long class names wrap on phones.
- Empty buffers render a plain empty state; unmatched filters render an empty state with a Clear filters action.
- Fetch failures and 401 errors render [data-loader.js](../../src/js/data-loader.js) Retry and Sign in banners and hide the pager.
- Extension hooks `extraChips`, `renderCard`, and `filterText` customize entry rendering and matching; hooks use `data-admin-logs-*` only.

Upgrading an existing app:
- Replace `logs-view.mjs` in Auth's and ToDo's admin consoles with `createAdminLogsScreen` from [admin-logs.js](../../src/js/admin-logs.js).
- Pass `{ adapter: { fetchLogs: ({ signal }) => api.get('/logs', { signal }) } }` so each app keeps its own endpoint.
- See the [admin console shell demo](../../src/demo/shell-admin-console.html#/logs) and [shell-admin-console.js](../../src/demo/shell-admin-console.js) for live states.

### admin-system-events
Shared admin System events screen ([admin-system-events.js](../../src/js/admin-system-events.js)), using [data-loader.js](../../src/js/data-loader.js), [dom-builders.js](../../src/js/dom-builders.js), [icon.js](../../src/js/icon.js), and [table-state.js](../../src/js/table-state.js).
Renders audit records as newest-first `.entry-list` cards with server filters, offset paging, client search, and JSON details.

```js
import { createAdminConsole } from './admin-console.js';
import { createAdminSystemEventsScreen } from './admin-system-events.js';

const consoleFrame = createAdminConsole(root, {
    title: 'Admin Console',
    screens: [
        createAdminSystemEventsScreen({
            adapter: {
                fetchEvents: ({ params, signal }) => api.get(`/admin/system-events?${params}`, { signal }),
                fetchUsers: ({ signal }) => api.get('/users?expired=true', { signal })
            }
        })
    ]
});
```

- `createAdminSystemEventsScreen(options)` returns an [admin-console.js](../../src/js/admin-console.js) screen descriptor with default icon `events`, reusing `ctx.dom`, `ctx.signIn`, and `ctx.screenSignal`.
- `attachAdminSystemEvents(root, options)` mounts into an existing container; `createAdminSystemEvents(doc, options)` builds a root for an injected document.
- Controller methods: `refresh({ quiet })`, `getEvents()`, `getFilteredEvents()`, `getState()`, `resetFilters()`, `tableState`, `dispose()`, and `destroy()`.
- `options.adapter.fetchEvents({ eventType, severity, limit, offset, params, signal })` supplies records; Auth arrays and ToDo envelopes normalize automatically.
- Optional `options.adapter.fetchUsers({ signal })` resolves actor IDs once and falls back cleanly to `User #{{id}}` on failure.
- Event type, severity, limit, and offset go to the adapter; Search filters loaded rows in memory without re-fetching.
- Active filters (`q`, `event-type`, `severity`) and non-default row limits (`limit`) persist in the URL hash via [table-state.js](../../src/js/table-state.js).
- Each card's details toggle manages `aria-expanded`, `aria-controls`, and a unique `<pre class="entry-list__details">` block with pretty-printed JSON.
- Toggles disable with `title="No metadata"` when `formatMetadata(metadata)` returns `null`; hooks use `data-admin-system-events-*` only.
- Extension hooks `extraChips`, `renderCard`, `formatActor`, `formatTime`, and `filterText` customize card rendering, actor labels, and search matching.

Upgrading an existing app:
- Replace `system-events-view.mjs` in Auth's and ToDo's admin consoles with `createAdminSystemEventsScreen` from [admin-system-events.js](../../src/js/admin-system-events.js).
- Pass `adapter.fetchEvents` (and optional `adapter.fetchUsers`) so each app keeps its own endpoints and severity or actor shapes.
- See the [admin console shell demo](../../src/demo/shell-admin-console.html#/system-events) and [shell-admin-console.js](../../src/demo/shell-admin-console.js) for live states.

### admin-broadcasts
Shared admin Broadcasts screen ([admin-broadcasts.js](../../src/js/admin-broadcasts.js)), using [data-loader.js](../../src/js/data-loader.js), [dom-builders.js](../../src/js/dom-builders.js), [field.js](../../src/js/field.js), [icon.js](../../src/js/icon.js), [inbox.js](../../src/js/inbox.js), [notices.js](../../src/js/notices.js), [selection.js](../../src/js/selection.js), and [table-state.js](../../src/js/table-state.js).
Composes announcements with live inbox and banner previews, optional recipient selection, history filtering, and inline-confirmed retraction.

```js
import { createAdminBroadcastsScreen } from './admin-broadcasts.js';
import { createAdminConsole } from './admin-console.js';

const consoleFrame = createAdminConsole(root, {
    title: 'Admin Console',
    screens: [
        createAdminBroadcastsScreen({
            adapter: {
                fetchHistory: ({ signal }) => api.get('/admin/system-events?limit=200', { signal }),
                fetchUsers: ({ signal }) => api.get('/users?expired=true', { signal }),
                publish: (payload, { signal }) => api.post('/admin/broadcast-notifications', payload, { signal }),
                retract: (id, _entry, { signal }) => api.post(`/admin/broadcast-notifications/${encodeURIComponent(id)}/retract`, null, { signal })
            }
        })
    ]
});
```

- `createAdminBroadcastsScreen(options)` returns an [admin-console.js](../../src/js/admin-console.js) screen descriptor with default icon `broadcast`, reusing `ctx.dom`, `ctx.signIn`, and `ctx.screenSignal`.
- `attachAdminBroadcasts(root, options)` mounts into a container; `createAdminBroadcasts(doc, options)` creates a root in an injected document.
- Controller methods: `refresh`, `updatePreview`, `resetForm`, `buildPayload`, `getHistory`, `getFilteredHistory`, `getState`, `resetFilters`, `tableState`, `dispose`, and `destroy`.
- `.app__split` in [shell.css](../../src/css/shell.css) stacks compose and preview below `64rem` and arranges them `3fr 2fr` above `64rem`.
- Non-banner drafts preview as `.inbox__item` rows; checking the banner option also previews a `.banner` with `bannerVariant` and `bannerRole`.
- Preview links pass through `safeUrl` from [notices.js](../../src/js/notices.js), dropping unsafe URL schemes before setting `href`.
- Selecting `specific-users` lazily loads active accounts via `adapter.fetchUsers` into a searchable [selection.js](../../src/js/selection.js) checklist.
- `normalizeBroadcastHistory` accepts Auth `broadcast-published`/`broadcast-retracted` events (`buildBroadcastHistory`) and ToDo direct broadcast lists.
- History filters (`q`, `type`, `status`) persist in the URL hash via [table-state.js](../../src/js/table-state.js) with `Show more` paging.
- Retraction asks through `dom.inlineConfirm`, calls `adapter.retract(id, entry)`, announces status, and reloads history quietly; hooks use `data-admin-broadcasts-*`.

Upgrading an existing app:
- Replace `broadcasts-view.mjs` in Auth's and ToDo's admin consoles with `createAdminBroadcastsScreen` from [admin-broadcasts.js](../../src/js/admin-broadcasts.js).
- Pass `adapter.fetchHistory`, `adapter.publish`, `adapter.retract`, and optional `adapter.fetchUsers`; ToDo passes `payloadFormat: 'audience'`, `defaultBanner: true`, and `showExpires: false`.
- Remove app-local `.split`, `.preview`, `.recipients`, and `.selection__scroll` rules replaced by `.app__split`, `.app__section`, and `.app__scroll-list`.
- See the [admin console shell demo](../../src/demo/shell-admin-console.html#/broadcasts) and [shell-admin-console.js](../../src/demo/shell-admin-console.js) for live states.

### admin-users
Shared admin Users screen ([admin-users.js](../../src/js/admin-users.js)), using [data-loader.js](../../src/js/data-loader.js), [dom-builders.js](../../src/js/dom-builders.js), [field.js](../../src/js/field.js), [file-download.js](../../src/js/file-download.js), [icon.js](../../src/js/icon.js), and [table-state.js](../../src/js/table-state.js).
Displays user accounts with filters, paging, a detail panel, a New user panel, and inline-confirmed deletion and restore.

```js
import { createAdminConsole } from './admin-console.js';
import { createAdminUsersScreen } from './admin-users.js';

const consoleFrame = createAdminConsole(root, {
    title: 'Admin Console',
    screens: [
        createAdminUsersScreen({
            adapter: {
                fetchUsers: ({ signal }) => api.get('/users?expired=true', { signal }),
                fetchUser: (id, { signal }) => api.get(`/users/${encodeURIComponent(id)}`, { signal }),
                updateUser: (id, body, { signal }) => api.put(`/users/${encodeURIComponent(id)}`, body, { signal }),
                createUser: (body, { signal }) => api.post('/users', body, { signal }),
                markUserForDeletion: (id, { signal }) => api.put(`/users/${encodeURIComponent(id)}`, { deleted: true }, { signal }),
                restoreUser: (id, { signal }) => api.put(`/users/${encodeURIComponent(id)}`, { deleted: false }, { signal }),
                deleteUser: (id, { signal }) => api.delete(`/users/${encodeURIComponent(id)}`, { signal })
            }
        })
    ]
});
```

- `createAdminUsersScreen(options)` builds an [admin-console.js](../../src/js/admin-console.js) descriptor (default icon `people`), reusing `ctx.dom`, `ctx.panel`, `ctx.navigate`, `ctx.me`, and `ctx.screenSignal`.
- `attachAdminUsers(root, options)` mounts into a container; `createAdminUsers(doc, options)` creates a root in an injected document.
- Controller methods: `refresh`, `update`, `openUser`, `openCreate`, `closePanel`, `getUsers`, `getFilteredUsers`, `getSelectedId`, `getState`, `resetFilters`, `tableState`, `dispose`, and `destroy`.
- Supports client slicing (`mode: 'client'`) and bookmark Page envelopes (`mode: 'server'`), keeping filters and page in the hash.
- `extraColumns`, `extraFacts`, and `extraSections` add table columns, Facts rows, and detail panel sections with `block()` and `act()` helpers.
- Marking for deletion, restoring, and permanent deletion ask through `dom.inlineConfirm` in the danger zone, guarding the signed-in account.
- Omitting `adapter.createUser` hides the `New user` button; `adapter.exportUserData` enables JSON export via [file-download.js](../../src/js/file-download.js).
- Hooks use `data-admin-users-*` only; row selection uses `aria-selected`, and closing the panel returns focus to the opener.

Upgrading an existing app:
- Replace `users-view.mjs` in Auth's and ToDo's admin consoles with `createAdminUsersScreen` from [admin-users.js](../../src/js/admin-users.js).
- Wire Auth's password, linked credentials, and application access sections through `extraSections`, loading their data inside `adapter.fetchUser`.
- Pass `mode: 'server'`, `showRealms: false`, and `extraFacts` in ToDo's console, omitting `adapter.createUser`.
- See the [admin console shell demo](../../src/demo/shell-admin-console.html#/users) and [shell-admin-console.js](../../src/demo/shell-admin-console.js) for live states.

### admin-sessions
Shared admin Sessions screen ([admin-sessions.js](../../src/js/admin-sessions.js)), using [data-loader.js](../../src/js/data-loader.js), [dom-builders.js](../../src/js/dom-builders.js), [selection.js](../../src/js/selection.js), and [table-state.js](../../src/js/table-state.js).
Displays tokens with search, type, state, and size filters, paging, and single, bulk, and expired revocation.

```js
import { createAdminConsole } from './admin-console.js';
import { createAdminSessionsScreen } from './admin-sessions.js';

const consoleFrame = createAdminConsole(root, {
    title: 'Admin Console',
    screens: [
        createAdminSessionsScreen({
            adapter: {
                fetchTokens: ({ signal }) => api.get('/tokens', { signal }),
                revokeToken: (id, _token, { signal }) => api.delete(`/tokens/${encodeURIComponent(id)}`, { signal }),
                revokeExpired: ({ signal }) => api.delete('/tokens?expired=true', { signal })
            }
        })
    ]
});
```

- `createAdminSessionsScreen(options)` builds an [admin-console.js](../../src/js/admin-console.js) descriptor (default icon `sessions`), reusing `ctx.dom`, `ctx.signIn`, `ctx.session`, and `ctx.screenSignal`.
- `attachAdminSessions(root, options)` mounts into a container; `createAdminSessions(doc, options)` creates a root in an injected document.
- Controller methods: `refresh`, `revoke`, `removeExpired`, `getTokens`, `getFilteredTokens`, `getSelectedIds`, `getExpiredCount`, `getState`, `resetFilters`, `tableState`, `dispose`, and `destroy`.
- Protects the console's own token via `currentTokenId`, `ctx.tokenId()`, `ctx.session.id`, or `token.current === true`.
- The own session's checkbox and Revoke button stay disabled, and programmatic `revoke()` skips the own token.
- Table multi-select uses `.selection--table` and `.selection__cell` in [selection.css](../../src/css/components/selection.css) through [selection.js](../../src/js/selection.js).
- Single, bulk, and expired revocations ask through `dom.inlineConfirm`, report partial bulk failures, and reload quietly.
- Supports client slicing (`mode: 'client'`) and bookmark Page envelopes (`mode: 'server'`), keeping filters and page in the hash.
- Omitting `adapter.revokeExpired` hides `Remove expired`; `adapter.revokeTokens` enables single-request bulk revocation when supplied.
- Pure helpers exported: `isTokenExpired`, `isOwnToken`, `tokenUserName`, `tokenUserEmail`, `formatSessionTime`, and `normalizeTokensResult`; hooks use `data-admin-sessions-*`.

Upgrading an existing app:
- Replace `sessions-view.mjs` in Auth and `tokens-view.mjs` in ToDo with `createAdminSessionsScreen` from [admin-sessions.js](../../src/js/admin-sessions.js).
- Remove app-local `.selection--table` and `.selection__count` rules replaced by [selection.css](../../src/css/components/selection.css).
- Pass `mode: 'server'`, `showTypeFilter: false`, and `showStateFilter: false` in ToDo, omitting `adapter.revokeExpired`.
- See the [admin console shell demo](../../src/demo/shell-admin-console.html#/sessions) and [shell-admin-console.js](../../src/demo/shell-admin-console.js) for live states.

### admin-changelog
Shared admin Changelog screen ([admin-changelog.js](../../src/js/admin-changelog.js)), using [release-notes.js](../../src/js/release-notes.js), [data-loader.js](../../src/js/data-loader.js), and [dom-builders.js](../../src/js/dom-builders.js).
Loads releases through an app-supplied adapter and renders them grouped by area, paged ten at a time.

```js
import { createAdminChangelogScreen } from './admin-changelog.js';
import { createAdminConsole } from './admin-console.js';

const consoleFrame = createAdminConsole(root, {
    title: 'Admin Console',
    screens: [
        createAdminChangelogScreen({
            adapter: {
                fetchReleases: ({ signal }) => api.get('/changelog', { signal })
            }
        })
    ]
});
```

- `createAdminChangelogScreen(options)` returns an [admin-console.js](../../src/js/admin-console.js) screen descriptor with default icon `note`, reusing `ctx.dom`, `ctx.signIn`, and `ctx.screenSignal`.
- `attachAdminChangelog(root, options)` mounts into a container; `createAdminChangelog(doc, options)` creates a root in an injected document.
- Controller methods: `refresh`, `showMore`, `setFilter`, `getFilter`, `expandAll`, `collapseAll`, `getReleases`, `getReleaseNotes`, `dispose`, and `destroy`.
- `options.adapter.fetchReleases({ signal })` returns a release array or `{ releases }` envelope; `normalizeReleasesResult` accepts both shapes.
- Defaults to `groupByArea: true`, `showStatus: true`, `showFilter: false`, `collapsible: false`, and `pageSize: 10` (`DEFAULT_PAGE_SIZE`).
- Empty lists render `.empty-state`; failures and 401 responses render [data-loader.js](../../src/js/data-loader.js) Retry and Sign in banners.
- `extraSections` appends app-specific sections after the releases; hooks use `data-admin-changelog-*` and `data-release-notes-*` only.

Upgrading an existing app:
- Replace `changelog-view.mjs` in Auth and ToDo with `createAdminChangelogScreen` from [admin-changelog.js](../../src/js/admin-changelog.js).
- In Auth, pass `fetchReleases` that fetches `/CHANGELOG.md` and parses it with `parseChangelog`.
- In ToDo, pass `fetchReleases: ({ signal }) => api.get('/changelog', { signal })`; `{ releases }` normalizes automatically.
- See the [admin console shell demo](../../src/demo/shell-admin-console.html#/changelog) and [shell-admin-console.js](../../src/demo/shell-admin-console.js) for live states.

### view-router
View router for `RoutedView` screens ([view-router.js](../../src/js/view-router.js)).
Registers routed views and a fallback, enforces sign-in guards, manages history, and opens outside routes with full loads.

```html
<body class="app app--scroll-page" data-view-router>
  <header class="app__top-bar">
    <h1 class="app__title" data-view-router-title>Home</h1>
  </header>
  <nav class="app__sidebar" aria-label="Main" data-view-router-nav>
    <a class="app__nav-item" href="/" data-view-router-link aria-current="page">Home</a>
    <a class="app__nav-item" href="/notes" data-view-router-link data-action="navigate-to-notes">Notes</a>
  </nav>
  <main class="app__main" id="main" tabindex="-1" data-view-router-outlet></main>
</body>
```

- Call `createViewRouter(options)` or `attachViewRouter(root, options)` with injectable `document`, `window`, `location`, and `history`.
- Controller methods: `addView`, `setFallbackView`, `getViews`, `getFallbackView`, `getActiveView`, `getCurrentRoute`, `findViewForRoute`, and `findViewById`.
- Activation and lifecycle: `activateView`, `activateViewById`, `activateSpecificView`, `openOutside`, `setTitle`, `markRoute`, `start`, `attach`, `detach`, and `destroy`.
- Events exported: `CONTENT_VIEW_ADDED_EVENT`, `CONTENT_VIEW_CHANGED_EVENT`, and `CONTENT_VIEW_TITLE_CHANGED_EVENT`.
- Views match in registration order; unmatched routes select the fallback view, and re-activating the active view returns `false`.
- `onlyWhenSignedIn` and `neverWhenSignedIn` guards read `isSignedIn()`, with optional `signInRoute`, `returnUrlParam`, `signedInRoute`, `signedInViewId`, and `guard` callbacks.
- History uses `replaceState` for the current address or `{ replace: true }`, `pushState` otherwise, and no history write on `popstate`.
- `outsidePrefixes`, `resolveOutsideRoute`, and cross-origin URLs open via `location.assign` or `location.replace`, rejecting unsafe URL schemes.
- Shell title updates `[data-view-router-title]` and `document.title`; route marks sync `aria-current="page"` and optional `accountMenu.setRoute`.

Upgrading an existing app:
- Replace view lists, `findViewForRoute`, `activateView`, `popstate`, and `openOutsideSpa` in Auth's and counters' `App` with [view-router.js](../../src/js/view-router.js).
- Wire `isSignedIn`, `outsidePrefixes`, and `resolveOutsideRoute` in options, and forward [action-registry.js](../../src/js/action-registry.js) `onNavigate` to `router.activateView`.
- Replace app-local shell `markRoute` and `setTitle` hooks with `data-view-router-nav`, `data-view-router-title`, and `data-view-router-outlet`.
- See the [portal shell demo](../../src/demo/shell-portal.html) and [shell-demo.js](../../src/demo/shell-demo.js) for routed views with links and browser history.

---

## Page Base
[page.css](../../src/css/page.css) loads after [reset.css](../../src/css/reset.css) and before components, styling bare elements from public tokens only.
- `body`: ground (`--color-bg`), text (`--color-text`), `--font-body`, `--text-base`, `--weight-regular`, and `--leading-normal`.
- Headings (`h1`–`h6`): `--font-heading`, `--weight-semibold`, `--leading-tight`; `h1` uses `--text-xl`, `h2` `--text-lg`, and `h3` `--text-base`.
- Links (`a`): `--color-link`, hover color `--color-link-hover`, and `--focus-ring-width` underline thickness.
- Inline code (`code`): `--font-mono` and `--text-sm`.
- Guard: `[hidden]:not([hidden='until-found' i])` sets `display: none` while keeping `hidden="until-found"` panels findable.
- Zero-specificity `:where(...)` selectors let component classes and app stylesheets override any element rule directly.
- Set `data-page-base="off"` on `<html>` to opt out of bare element styles while keeping the `[hidden]` guard.

Upgrading an existing app:
- After vendoring this release, remove app-local base rules for `body`, headings, `a`, `code`, and `[hidden]`.
- Keep only app-specific overrides, which win over [page.css](../../src/css/page.css) automatically.
- See the [Page base section](../../src/demo/visual-style-gallery.html#page) of the gallery.

---

## App Shell
The shell has the key `app`, and [ADR-0004](../adrs/ADR-0004-app-shell.md) defines its areas and options.
Choose a setup by navigation, scrolling, and content width; omit areas your application does not need.
The top bar parts `app__nav-toggle`, `app__title`, `app__brand`, `app__brand-logo`, `app__menu-button`, `app__breadcrumb`, and `app__top-actions` come from ADR-0004.
The sidebar and the bottom bar hold an `app__nav-list` of `app__nav-item` links, as the [demo pages](../../src/demo/visual-style-gallery.html#shell) show.

Shell additions in [shell.css](../../src/css/shell.css):
- Sidebar end list: add `app__nav-list--end` to a second `app__nav-list` inside `app__sidebar` to pin it to the bottom.
  It stays pinned when the sidebar is open, an icon rail, or a narrow drawer.
- Nav entry badges: place a `.badge` inside an `app__nav-item` to align it at the entry end.
  Leave `aria-hidden` off the badge so its text stays in the link's accessible name.
- Brand logo: place `<img class="app__brand-logo" alt="" width="32" height="32">` beside the brand text inside `app__brand`.
  `shell.css` sizes the logo to `--space-7` and adds a `--space-2` gap to `app__brand`.
- Hidden top bar parts: setting `hidden` on any part inside `app__top-bar` hides it despite shell or component display rules.
  Elements with `hidden="until-found"` keep their box, matching [page.css](../../src/css/page.css).
- Banner dismiss: a direct `.icon-button` inside `.app__banners .banner` stays at the banner end, even on a wrapped line.
- Unread count button: place `.icon-button.app__notifications-button` with `.badge.badge--count.app__notifications-count` inside `.app__top-actions`.
  Drive it with `attachUnreadButton` from [inbox.js](../../src/js/inbox.js); its badge and accessible name cap at `99+`.
- Gate page: render `<main class="app__gate" id="main" tabindex="-1">` with `.app__gate-actions` for centered session checks and forbidden states.
  `admin-console.js` drives it alongside the signed-out shell and hash router.
- Split layout: `.app__split` stacks `.app__section` blocks below `64rem` and arranges them `3fr 2fr` at `64rem` and above.
  `.app__scroll-list` bounds tall selection checklists with contained overscroll; `.app__slot:empty` and `.app__status:empty` collapse empty feedback slots.

Upgrading an existing app:
- Replace app-local `.app__sidebar > .nav-end` markup and CSS with `<ul class="app__nav-list app__nav-list--end">`.
- Remove app-local rules for `.app__nav-item .badge`, `.app__brand` gap, `.app__brand-logo`, `.app__top-bar [hidden]`, `.app__notifications-button`, `.app__notifications-count`, and `.app__banners .banner > .icon-button`.

### Workspace with sidebar and bottom navigation
Use every area, with sidebar and bottom navigation; the main column scrolls.
Place primary controls in the action bar and an editor in the side panel.

```html
<body class="app app--scroll-main">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="app__top-bar">
    <h1 class="app__title">Workspace</h1>
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

### Admin console with sidebar and detail panel
Use a nav toggle and brand in the top bar, a sidebar, a scrolling main column, and a side panel.
Omit the bottom navigation and action bar; open record details inside the side panel.
Put the page title in the main area; `attachAppNav` from `app-nav.js` drives the toggle.

```html
<body class="app app--scroll-main">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="app__top-bar">
    <button class="app__nav-toggle icon-button" type="button" popovertarget="app-nav" aria-controls="app-nav"
            aria-expanded="true" aria-label="Navigation" data-app-nav-toggle>...</button>
    <a class="app__brand" href="/">Admin Console</a>
    <div class="app__top-actions"><div class="account-menu">...</div></div>
  </header>
  <nav class="app__sidebar" id="app-nav" aria-label="Main" popover>...</nav>
  <div class="app__banners"></div>
  <main class="app__main" id="main" tabindex="-1"><h1>Accounts</h1>...</main>
  <aside class="app__side-panel" aria-labelledby="detail-title">
    <div class="detail-panel">...</div>
  </aside>
  <div class="app__overlays"><div class="toast-region" role="region" aria-label="Notifications"></div></div>
</body>
```

### Page with menu navigation
Top bar with a menu button, banners, action bar, and overlay layer; the page scrolls.

```html
<body class="app app--scroll-page">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="app__top-bar">
    <button class="app__menu-button icon-button" type="button" aria-haspopup="menu" aria-expanded="false" aria-label="Menu">...</button>
    <h1 class="app__title">Dashboard</h1>
  </header>
  <div class="app__banners"></div>
  <main class="app__main" id="main" tabindex="-1">...</main>
  <div class="app__action-bar">...</div>
  <div class="app__overlays"><div class="toast-region" role="region" aria-label="Notifications"></div></div>
</body>
```

### Narrow page without navigation
Use a top bar, banners, action bar, and overlay layer without navigation.
The page scrolls in a narrow column; screens occupy sections of the main area.

```html
<body class="app app--scroll-page app--width-narrow">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="app__top-bar"><h1 class="app__title">Overview</h1></header>
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

### Server-rendered page with breadcrumbs
Use a top bar with brand, breadcrumbs, help, and account controls; the page scrolls.
Place notices in banners and the footer in the action bar.
Render the top bar from one shared server template partial.

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

### Pull-to-refresh
Installed apps add it to any setup with `attachPullRefresh(root, { onRefresh, container, media, labels, icon })` from `pull-refresh.js`.
- It acts only while `(display-mode: standalone)` matches; browser tabs keep their native pull-down reload.
- A one-finger pull at the top of the page and every scrolled ancestor, outside open dialogs and popovers, starts it.
- A release at 64 px or more calls `onRefresh`; the indicator spins until its promise settles, for at least 400 ms.
- The module appends the indicator to `container`, normally the overlay layer, and announces "Refreshing" politely.
- Call `setSpriteUrl` first; the indicator draws the core `icon-refresh` unless `icon` names another glyph.

```html
<html data-pull-refresh>
  ...
  <div class="app__overlays">
    <div class="toast-region" role="region" aria-label="Notifications"></div>
    <div class="app__pull-indicator" aria-hidden="true" data-state="pulling">...</div>
  </div>
</html>
```

- The module sets `data-pull-refresh` and the indicator; apps never write them.
- `data-state` is `pulling`, `armed`, or `refreshing`, and `hidden` hides the idle indicator.
- The module moves the indicator through `--_app-pull-travel` and `--_app-pull-progress`.

### View lifecycle
Views that load their own data extend `View`, or `RoutedView` when a router selects them, from `view.js`.
It replaces `Component` and `AppView` of support.js v3, which v4.0.0 removed; member names stay the same.
- `new View(id, app, options)` builds the root; `attach(el)` adds it, and `detach()` removes it with its tracked listeners.
- Override `createMainUIHtml()`, `updateMainUI(info)`, and `refreshData()`; `refreshComponentUI()` reloads and shows the result.
- A failed load shows the error page in place of the main UI, with Try again and an optional way back.
- A load slower than the wait delay, 700 ms by default, shows a status with a spinner; the main UI stays visible.
- `startLongRunningOperation({ title, description, start, success, error, always })` runs any other asynchronous work the same way.
- Call `setSpriteUrl` first; the error page draws `icon-alert` unless `options.icon` names another glyph, or `null`.

```html
<div id="users" class="app__view" data-view data-view-state="ready">
  <div data-view-error hidden>
    <div class="empty-state" role="alert">...<button class="button" data-view-retry>Try again</button>...</div>
  </div>
  <div data-view-wait hidden><span class="spinner" aria-hidden="true"></span><span role="status"></span></div>
  <div data-view-main>...the view's own markup...</div>
</div>
```

- The module sets `data-view-state` to `ready`, `updating`, or `error`, plus `hidden` and `aria-busy`; apps never write them.
- `options` are `log`, `waitDelay`, `icon`, `labels` (`retry`, `waiting`, `errorTitle`, `errorText`), and `document`.
- Override `getBackLink()` to return `{ href, label, attributes }` or `null`; it is asked again on every error.
- Error texts are set as plain text, where support.js v3 set them as HTML.
- `RoutedView(id, app, title, routeRegex, options)` adds `routeRegex`, `getActions()`, and the registration of actions.
  The app may offer `addAction`, `removeAction`, and `setScreenActions`; actions with `'context-bar': false` stay out of the screen actions.
- The app may offer `startProgress` and `stopProgress`; a slow operation brackets them.

Moving from support.js v3:

| support.js v3                              | support.webapp                                              |
| :----------------------------------------- | :---------------------------------------------------------- |
| `Component`, `import ... component.mjs`    | `View` from `view.js`                                       |
| `AppView`, `import ... app-view.mjs`       | `RoutedView` from `view.js`                                 |
| `Component.errorIconSprite`, `errorIconId` | `setSpriteUrl` and `options.icon`                           |
| `Component.waitUIDelayTime`                | `options.waitDelay`                                         |
| `AppView.ActionBarClass`, action bars      | `attachScreenActionBar` from `screen-action-bar.js`         |
| `.error-overlay`, `.wait-overlay`, `.main` | `[data-view-error]`, `[data-view-wait]`, `[data-view-main]` |
| logger created inside                      | `options.log`, silent by default                            |

---

## Glossary
- Live region: a part of the page that screen readers watch, and announce when its text changes, without moving focus.
  - `role="status"` is polite and waits until the user is idle; `role="alert"` is assertive and interrupts.
  - It is the web counterpart of Android's `announceForAccessibility`.
  - It must exist in the page before its text changes, so `createLiveRegion` adds it once, at page load.
  - Toasts, form errors, loading status lines, and "Saved" messages all use it.
- Controller: the object that a behavior function returns, with `destroy()` and the methods its catalog row lists.
- Skeleton: the reference HTML of a component, which CSS and JavaScript both rely on.
