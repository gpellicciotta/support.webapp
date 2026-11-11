# T0002 Draft: Component Catalog
Status: draft written by Claude for the round-1 review, findings F18 and F19. Nothing is decided until the user confirms it.
In round 2 this file moves to `docs/specs/components.md`, linked from ADR-0003.

Statuses:
- `first set`: shipped in the first release, by the task named.
- `out`: not part of the package, with a reason.

Sources come from the comparison sections on buttons, fields, chips, lists, feedback, menus, dialogs, and avatars.
Rows with source "none, new design" are Claude's proposals; no sibling app has them.
CSS blocks, module names, and functions marked in the table follow the sibling apps where one exists; the others are suggestions.
Every component gets a gallery section and a documented markup skeleton before its task ends.

## Starter app minimum
A generated app needs at least these, from DS-2 and ADR-0006:
- Shell, button, field, dialog, toast with live region, menu, empty state, icon, theme switch, and the offline and update patterns.

## Catalog
### Controls
| Component                            | Source              | Status    | CSS block         | JS module and function             | Variants and states                                                               | Accessibility minimum                               | Task     |
| :----------------------------------- | :------------------ | :-------- | :---------------- | :--------------------------------- | :-------------------------------------------------------------------------------- | :-------------------------------------------------- | :------- |
| Button                               | todos.webapp        | first set | .button           | none                               | primary, secondary, danger, quiet, inverse, small; hover, active, focus, disabled | native button; visible focus; 44 px target          | T0007    |
| Icon button                          | todos.webapp        | first set | .icon-button      | none                               | default, danger, pressed toggle                                                   | native button; aria-label; aria-pressed for toggles | T0007    |
| Link button                          | family-portal       | first set | .link-button      | none                               | default, hover, focus                                                             | native button or anchor                             | T0007    |
| Floating action button               | todos.webapp        | first set | .fab              | none                               | one fixed control in the overlay layer                                            | native button; aria-label                           | none yet |
| Field (text input, textarea, select) | todos.webapp, meteo | first set | .field            | field.js: createField, attachField | valid, invalid, pending, disabled, read-only; hint, counter, help toggle optional | label for control; aria-invalid; aria-describedby   | T0008    |
| Checkbox and radio                   | todos.webapp        | first set | .checkbox, .radio | none                               | checked, indeterminate for checkbox; disabled, invalid                            | native inputs; group in fieldset with legend        | T0008    |
| Switch                               | none, new design    | first set | .switch           | none                               | off, on, disabled                                                                 | native checkbox with role switch                    | T0019    |
| Chip                                 | todos.webapp        | first set | .chip             | none                               | static, removable, filter, toggle; overdue tone                                   | button for interactive chips; remove has a label    | T0007    |
| Segmented control                    | todos.webapp        | first set | .segmented        | none                               | 2 to 5 options; selected, disabled                                                | fieldset of native radios                           | T0007    |
| Badge                                | meteo               | first set | .badge            | none                               | non-interactive count or status label                                             | text, not color alone                               | none yet |

### Forms and selection
| Component                      | Source                 | Status    | CSS block                                       | JS module and function                   | Variants and states                                             | Accessibility minimum                                                           | Task                     |
| :----------------------------- | :--------------------- | :-------- | :---------------------------------------------- | :--------------------------------------- | :-------------------------------------------------------------- | :------------------------------------------------------------------------------ | :----------------------- |
| Form                           | counters, todos.webapp | first set | .form                                           | form.js: attachForm                      | idle, busy, submitted with errors; actions bar                  | native form; submit by Enter; busy state announced                              | T0008, scope to add      |
| Field help toggle              | counters, new design   | first set | .field__help-toggle, .field__help               | field.js: attachField                    | collapsed, expanded                                             | button with aria-expanded and aria-controls; help text also in aria-describedby | T0008, scope to add      |
| Validation states              | counters, todos.webapp | first set | .field--valid, .field--invalid, .field--pending | field.js: setError, setValid, setPending | valid, invalid, pending, with icon and text, never color alone  | aria-invalid; aria-busy while pending; message in a live region                 | T0008, scope to add      |
| Error summary                  | none, new design       | first set | .error-summary                                  | form.js: attachForm                      | hidden, shown after a failed submit; one link per invalid field | focus moves to the summary; links jump to the fields                            | T0008, scope to add      |
| Field group                    | counters               | first set | .field-group                                    | none                                     | fieldset with legend; checkbox group, radio group               | native fieldset and legend                                                      | T0008                    |
| Multi-select with bulk actions | none, new design       | first set | .selection, .bulk-bar                           | selection.js: attachSelection            | none selected, some, all; bulk action bar                       | native checkboxes; Shift range; count announced                                 | none yet, needs a design |

### Containers
| Component           | Source           | Status    | CSS block             | JS module and function            | Variants and states                                       | Accessibility minimum                         | Task     |
| :------------------ | :--------------- | :-------- | :-------------------- | :-------------------------------- | :-------------------------------------------------------- | :-------------------------------------------- | :------- |
| Card                | family-portal    | first set | .card                 | none                              | static, link card, hover lift                             | whole card is one link, or nests no links     | T0018    |
| Icon tile and tile  | family-portal    | first set | .icon-tile, .app-tile | none                              | tones 1 to n; sizes                                       | decorative icon is aria-hidden                | T0018    |
| Row base            | todos.webapp     | first set | .row                  | none                              | dense row with trailing actions; container query at 36rem | list semantics; actions reachable by keyboard | T0016    |
| Empty state         | todos.webapp     | first set | .empty-state          | none                              | icon, title, text, at most two actions                    | heading level set by the app                  | T0016    |
| Collapsible         | todos.webapp     | first set | .collapsible          | collapsible.js: attachCollapsible | collapsed, expanded                                       | button with aria-expanded and aria-controls   | T0026    |
| List and data table | none, new design | first set | .list, .table         | none                              | simple list, definition rows, data table                  | native table elements with headers            | none yet |
| Tabs                | none, new design | first set | .tabs                 | tabs.js: attachTabs               | horizontal; selected, disabled                            | tablist, tab, tabpanel roles; arrow keys      | none yet |

### Feedback
| Component                | Source           | Status    | CSS block              | JS module and function   | Variants and states                          | Accessibility minimum                                      | Task     |
| :----------------------- | :--------------- | :-------- | :--------------------- | :----------------------- | :------------------------------------------- | :--------------------------------------------------------- | :------- |
| Toast and toaster        | todos.webapp     | first set | .toast                 | toast.js: createToaster  | message, with Undo, persistent; three tiers  | separate live region; holds while a modal is open          | T0010    |
| Live region              | todos.webapp     | first set | .live-region           | live-region.js: announce | polite, assertive                            | aria-live set once at page load                            | T0010    |
| Banner                   | todos.webapp     | first set | .banner                | none                     | info, error, success, warning                | status or alert role by severity                           | T0007    |
| Loading pattern          | none, new design | first set | .skeleton, [aria-busy] | none                     | busy region, status line, slow-list skeleton | aria-busy; polite status text; static under reduced motion | T0020    |
| Progress bar and spinner | support.js       | first set | .progress, .spinner    | none                     | determinate, indeterminate                   | progress element or role progressbar                       | none yet |

### Overlays
| Component                     | Source       | Status                   | CSS block                | JS module and function                 | Variants and states                                       | Accessibility minimum                            | Task         |
| :---------------------------- | :----------- | :----------------------- | :----------------------- | :------------------------------------- | :-------------------------------------------------------- | :----------------------------------------------- | :----------- |
| Dialog and confirmation tiers | todos.webapp | first set                | .dialog, .inline-confirm | dialog.js: openDialog, confirmDialog   | modal, inline confirm, type-to-confirm; sheet below 64rem | native dialog; focus trap; Escape; focus return  | T0009        |
| Menu                          | todos.webapp | first set                | .menu                    | menu.js: attachMenu                    | items, separators, danger item                            | menu roles; roving focus; type-ahead; Escape     | T0011, T0012 |
| Popover                       | todos.webapp | first set                | .popover                 | popover.js: attachPopover, anchorPanel | anchored panel; light dismiss                             | native popover attribute; focus returns on close | T0011, T0012 |
| Tooltip                       | meteo        | first set, after a check | .tooltip                 | none                                   | focus and hover tip                                       | exposed to screen readers, unverified today      | T0024        |

### Identity and foundations
| Component    | Source        | Status    | CSS block           | JS module and function             | Variants and states                                | Accessibility minimum                          | Task  |
| :----------- | :------------ | :-------- | :------------------ | :--------------------------------- | :------------------------------------------------- | :--------------------------------------------- | :---- |
| Avatar       | family-portal | first set | .avatar             | none                               | three sizes; image, initials, icon fallback; stack | alt text, or aria-hidden beside a visible name | T0018 |
| Account menu | todos.webapp  | first set | .user-button, .menu | account-menu.js: attachAccountMenu | signed in, signed out                              | menu pattern; marks the current route          | T0026 |
| Icon         | todos.webapp  | first set | .icon               | icon.js: spriteIcon                | sizes sm, md, lg; stroke token                     | aria-hidden unless it carries meaning          | T0006 |
| Theme switch | todos.webapp  | first set | .segmented          | theme.js: attachThemeSwitch        | System, Light, Dark                                | segmented control pattern; sets data-theme     | T0027 |

### Not in the package, or undecided
| Component                                              | Source                      | Status | Reason                                                | Task |
| :----------------------------------------------------- | :-------------------------- | :----- | :---------------------------------------------------- | :--- |
| Task row, bin screen                                   | todos.webapp                | out    | app-local                                             | none |
| Forecast chart                                         | meteo                       | out    | app-local; its per-hour sentence is the model to copy | none |
| Reaction toggle, drag handles, avatar cropper          | family-portal               | out    | app-local; drag lacks keyboard support                | none |
| Inbox panel, Web Push                                  | todos.webapp, family-portal | out    | app-local, connected features                         | none |
| Pagination, slider, date picker, file upload, combobox | none                        | out    | no adopter needs them; add under the sharing rule     | none |

## Markup contracts
Each first-set component states its HTML skeleton, so CSS, JavaScript, and generated apps agree on it.
The skeletons below come from the comparison's reference anatomy, except where marked as a draft.

### Button and icon button
```html
<button class="button button--secondary" type="button">Keep</button>
<button class="icon-button" type="button" aria-label="More actions" aria-pressed="false">
  <svg class="icon" aria-hidden="true"><use href="#icon-more"/></svg>
</button>
```

### Field
```html
<div class="field">
  <label class="field__label" for="x">Title</label>
  <input class="field__control" id="x" aria-invalid="true" aria-describedby="x-error">
  <p class="field__error" id="x-error">Enter a title.</p>
</div>
```

### Switch (draft, new design)
```html
<label class="switch">
  <input class="switch__control" type="checkbox" role="switch">
  <span class="switch__label">Notifications</span>
</label>
```

### Card
```html
<a class="card" href="...">
  <span class="icon-tile icon-tile--tone-1"><svg class="icon" aria-hidden="true"><use href="#icon-..."/></svg></span>
  <span class="app-tile__body"><span class="card__title">...</span><span class="card__text">...</span></span>
</a>
```

### Toast
```html
<div class="toast-region" role="region" aria-label="Notifications">
  <div class="toast"><p class="toast__text">...</p><button class="button button--quiet">Undo</button></div>
</div>
```

### Menu
```html
<button class="icon-button" aria-haspopup="menu" aria-expanded="true" aria-label="More actions for ...">...</button>
<div class="menu" role="menu" aria-label="Actions for ...">
  <button class="menu__item" type="button" role="menuitem">Add to list</button>
  <div class="menu__separator" role="separator"></div>
  <button class="menu__item menu__item--danger" type="button" role="menuitem">Delete</button>
</div>
```

### Dialog
```html
<dialog class="dialog" aria-labelledby="t">
  <div class="dialog__header"><h2 class="dialog__title" id="t">Delete the list Groceries?</h2></div>
  <div class="dialog__body"><p>...</p></div>
  <div class="dialog__actions">
    <button class="button button--secondary" data-dialog-close="cancel">Keep</button>
    <button class="button button--danger" data-dialog-close="delete">Delete list</button>
  </div>
</dialog>
```

### App shell
The shell markup, with every optional area, is in ADR-0004.
The generated `index.html` keeps only the areas and options the app chose.
The catalog needs one skeleton per option combination that an adopter uses, which the four adopter setups of ADR-0004 give.

Rows without a skeleton above get one in round 2, before their task starts.

## Naming link between HTML, CSS, and JavaScript
Status: proposal, not decided. The user asked for more elaboration on 2026-11-11.

### The problem
- A component is made of up to five artifacts: HTML markup, a CSS file, a JavaScript module, a gallery section, and tests.
- A developer who sees `class="dialog"` in a page should find `dialog.css`, `dialog.js`, and the gallery section without searching.
- JavaScript must find its elements without breaking when the CSS changes, and CSS must not depend on what JavaScript sets.

### The rule in one sentence
Each component has one kebab-case key, such as `dialog`, and every artifact derives its name from that key.

### The key `dialog`, end to end
| Artifact          | Rule                                                      | Example                            |
| :---------------- | :-------------------------------------------------------- | :--------------------------------- |
| HTML root class   | `.{{key}}`                                                | `.dialog`                          |
| HTML parts        | `.{{key}}__{{part}}` and `.{{key}}--{{variant}}`          | `.dialog__title`, `.dialog--sheet` |
| JavaScript hooks  | `data-{{key}}-{{name}}` attributes, never classes         | `data-dialog-close`                |
| State             | native states and ARIA, never JavaScript classes          | `[open]`, `[aria-expanded]`        |
| CSS file          | `css/components/{{key}}.css`                              | `css/components/dialog.css`        |
| Private tokens    | `--_{{key}}-{{name}}`                                     | `--_dialog-bg`                     |
| JavaScript module | `js/{{key}}.js`                                           | `js/dialog.js`                     |
| Exported function | `open{{Key}}`, `attach{{Key}}`, `create{{Key}}`           | `openDialog`, `attachMenu`         |
| Gallery section   | `id="{{key}}"` in the gallery                             | `#dialog`                          |
| Catalog and guide | heading `{{key}}` in `components.md`                      | `components.md#dialog`             |
| Tests             | `tests/unit/{{key}}.test.js`, `tests/e2e/{{key}}.spec.js` | `tests/unit/dialog.test.js`        |
| Icon ids          | `icon-{{name}}`                                           | `icon-close`                       |
| i18n keys         | `{{key}}.{{name}}`                                        | `dialog.cancel`                    |

### Why each choice, in Java and Python terms
- Hooks as `data-*` attributes: like annotations on a Java element. Renaming a CSS class for a redesign must not break the behavior, so JavaScript never selects by style class.
- State from native states and ARIA: the browser and screen readers already understand `[open]` and `[aria-expanded]`. A JavaScript-set class such as `.is-open` is invisible to assistive technology and can disagree with the real state.
- One key for the module: like one Java class per file, named after the class, so `import { openDialog } from './dialog.js'` needs no lookup.
- Verb prefixes on functions: `open` shows and returns a result, `attach` enhances markup that already exists, and `create` builds new markup.

### How `createField` fits
What todos.webapp has today:
- `createField(doc, options)` lives in `views/editor-panel.js`, not in a module named after the component.
- It builds the markup itself: a `div.field` holding a label, one control, and an error line.
- Its `setError(message)` sets `aria-invalid`, adds the error line to `aria-describedby`, and announces the message in a live region.
- It has no hint, counter, or help toggle, although the CSS defines hint and counter parts.

What the rule would make of it:
- The key is `field`, so the module is `js/field.js`, and the CSS block is `.field` with parts `__label`, `__control`, `__hint`, `__counter`, `__error`, and `__help`.
- The HTML skeleton is the contract. Server-rendered pages, such as family-portal's Java templates, write that skeleton by hand.
- `attachField(element)` enhances existing markup and returns a controller with `setError`, `setValid`, `setPending`, and the help toggle. It works on server-rendered and on built markup alike.
- `createField(doc, options)` builds the skeleton for JavaScript-first apps, then calls `attachField` on it. The returned object keeps todos.webapp's `{element, control, setError}` and gains the rest, so the switch stays lossless.
- Fields of every kind go through the same pair: input, textarea, and select, with the options in the catalog row.

### Names that break the rule today
- `createToaster` against the key `toast`; `createField` against `field`, with no module named in ADR-0008.
- `spriteIcon` against the key `icon`; `attachPopover` and `anchorPanel` both live in `popover.js`.
- The tooltip, switch, and loading pattern have no JavaScript, so their key still names the CSS, gallery, and tests.
- `data-i18n` and `data-theme` are global hooks, not component hooks.
- The shared `focus.js` that T0009 needs has no component key; it is a utility module.

### Open choices for the user
- Hooks as `data-{{key}}-{{name}}` attributes, or a single `data-js` marker, or classes with a `js-` prefix.
- Whether `createToaster` keeps its name, or becomes `createToast`, with a deprecated alias.
- Whether components with no JavaScript still get an entry in the catalog's module column, as "none".
- Whether the token test enforces the key rule: each key needs a CSS partial, a gallery section, and a markup skeleton.

## Glossary
- Live region: a part of the page that screen readers watch, and announce when its text changes, without moving focus.
  - `role="status"` (polite) waits until the user is idle; `role="alert"` (assertive) interrupts.
  - It is the web counterpart of Android's `announceForAccessibility`.
  - It must exist in the page before its text changes, so the shell creates it once at page load.
  - Toasts, form errors, loading status lines, and "Saved" messages all use it.
- Controller: the object that a behavior function returns, with methods such as `destroy()`.
- Skeleton: the reference HTML of a component, which CSS and JavaScript both rely on.

## Decisions by the user, 2026-11-11
- Badge stays a separate component.
- Select, textarea, and the other field types join T0008.
- List and data table, tabs, and progress bar and spinner are in the first set.
- Multi-select is in the first set, and needs a design task.
- The floating action button is in the first set.

## Open questions
- Do you accept the naming rule, or which choices in "Open choices" need to change?
- Should forms, validation states, help toggles, and the error summary stay inside T0008, or become a task of their own?
  The rows under "Forms and selection" add scope to T0008, which already holds fields, checkboxes, and radios.
- Should the validation icons come from the shared sprite, with ids such as `icon-alert`, `icon-check`, and `icon-help`?
