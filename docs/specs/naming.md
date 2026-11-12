# Naming Conventions
Names for tokens, classes, hooks, modules, files, gallery sections, tests, icons, and translation keys.
[ADR-0001](../adrs/ADR-0001-layer-model-and-token-contract.md) and [ADR-0003](../adrs/ADR-0003-components-and-patterns.md) record the decisions; this page holds the rules.

- Status: Accepted on 2026-11-12, in review round 2 of the planning task.
- **[Decided]** with the user on 2026-11-11: one kebab-case key per component, with every name derived from it.

---

## Why One Naming Rule
- A component is made of up to five artifacts: HTML markup, a CSS file, a JavaScript module, a gallery section, and tests.
- A developer who sees `class="dialog"` in a page should find `dialog.css`, `dialog.js`, and the gallery section without searching.
- JavaScript must find its elements without breaking when the CSS changes.
- CSS must not depend on anything that JavaScript sets, other than native states and ARIA.

The rule in one sentence: each component has one kebab-case key, such as `dialog`, and every artifact derives its name from that key.

---

## Component Key Rule
Rule and example for the key `dialog`:

| Artifact          | Rule                                                 | Example                     |
| :---------------- | :--------------------------------------------------- | :-------------------------- |
| HTML root class   | `.{{key}}`                                           | `.dialog`                   |
| HTML parts        | `.{{key}}__{{part}}`                                 | `.dialog__title`            |
| HTML variants     | `.{{key}}--{{variant}}`                              | `.dialog--sheet`            |
| JavaScript hooks  | `data-{{key}}-{{name}}` attributes, never classes    | `data-dialog-close`         |
| State             | native states and ARIA, never JavaScript-set classes | `[open]`, `[aria-expanded]` |
| CSS file          | `css/components/{{key}}.css`                         | `css/components/dialog.css` |
| Private tokens    | `--_{{key}}-{{name}}`                                | `--_dialog-bg`              |
| JavaScript module | `js/{{key}}.js`                                      | `js/dialog.js`              |
| Exported function | `open{{Key}}`, `attach{{Key}}`, or `create{{Key}}`   | `openDialog`                |
| Gallery section   | `id="{{key}}"` in the gallery                        | `#dialog`                   |
| Catalog entry     | heading `{{key}}` in [components.md](components.md)  | `components.md#dialog`      |
| Unit test         | `tests/unit/{{key}}.test.js`                         | `tests/unit/dialog.test.js` |
| Browser test      | `tests/e2e/{{key}}.spec.js`                          | `tests/e2e/dialog.spec.js`  |
| Translation keys  | `{{key}}.{{name}}`                                   | `dialog.cancel`             |

- `{{Key}}` is the key in PascalCase: `dialog` gives `Dialog`, `icon-button` gives `IconButton`.
- A component without JavaScript, such as the badge, has no module.
  It still has its class, CSS file, gallery section, and tests.
- Keys come from [contract.json](../../src/contract.json); the token test checks that each key has a CSS partial, a gallery section, and a catalog skeleton.

### Why Each Choice
In Java and Python terms:
- Hooks as `data-*` attributes work like annotations on a Java field.
  A redesign that renames a CSS class must not break the behavior, so JavaScript never selects by style class.
- State from native states and ARIA: the browser and screen readers already understand `[open]` and `[aria-expanded]`.
  A JavaScript-set class such as `.is-open` is invisible to assistive technology, and can disagree with the real state.
- One module per key works like one Java class per file, named after the class.
  `import { openDialog } from './dialog.js'` then needs no lookup.
- Verb prefixes on functions say what a call does, as the next section explains.

---

## Functions
| Prefix          | Meaning                                                             | Example                     |
| :-------------- | :------------------------------------------------------------------ | :-------------------------- |
| `attach{{Key}}` | Enhances markup that already exists, such as a server-rendered page | `attachMenu(button, menu)`  |
| `create{{Key}}` | Builds the skeleton, then calls `attach{{Key}}` on it               | `createField(doc, options)` |
| `open{{Key}}`   | Shows a temporary element and resolves with the user's answer       | `openDialog(options)`       |

- Each function returns a controller: an object with `destroy()` and the methods the catalog lists.
- Each function accepts an injected `document`, so unit tests run without a browser.
- A module may export more functions of its own key, such as `confirmDialog` beside `openDialog`.

### How `createField` Fits
What todos.webapp has today:
- `createField(doc, options)` lives in `views/editor-panel.js`, not in a module named after the component.
- It builds the markup itself: a `div.field` holding a label, one control, and an error line.
- Its `setError(message)` sets `aria-invalid`, adds the error line to `aria-describedby`, and announces the message in a live region.
- It has no hint, counter, or help toggle, although the CSS defines hint and counter parts.

What the rule makes of it:
- The key is `field`, so the module is `js/field.js`, and the class is `.field`.
- Its parts are `__label`, `__control`, `__hint`, `__counter`, `__help-toggle`, `__help`, `__status`, and `__error`.
- The HTML skeleton in [components.md](components.md#field) is the contract.
  Server-rendered pages, such as family-portal's Java templates, write that skeleton by hand.
- `attachField(element)` enhances existing markup, and returns a controller with `setError`, `setValid`, `setPending`, and the help toggle.
  It works on server-rendered and on built markup alike.
- `createField(doc, options)` builds the skeleton for JavaScript-first apps, then calls `attachField` on it.
  The returned object keeps todos.webapp's `{element, control, setError}` and gains the rest, so the switch stays lossless.
- Inputs, textareas, and selects all go through the same pair of functions.

---

## Utility Modules
Modules without a component key hold shared helpers and never style anything:

| Module           | Exports                                 | Used by                     |
| :--------------- | :-------------------------------------- | :-------------------------- |
| `focus.js`       | focus trap and focus return             | dialog, menu, popover       |
| `anchor.js`      | `anchorPanel`                           | menu, popover, account menu |
| `live-region.js` | `createLiveRegion`                      | toast, field, form, loading |
| `i18n.js`        | `setCatalog`, `applyTranslations`, `t`  | every app                   |

- A utility module imports no component module.
- A new utility module needs an entry in this table.

---

## Tokens
- Contract tokens: `--{{group}}-{{role}}[-{{variant}}][-{{state}}]`, such as `--color-primary-hover`.
- Text on a filled role: `--color-on-{{role}}`.
- Private component tokens: `--_{{key}}-{{name}}`; only `css/components/{{key}}.css` may use them.
- Primitive tokens: owned by one look, with names the look chooses; only its `primitives.css` and `look.css` use them.
- [ADR-0001](../adrs/ADR-0001-layer-model-and-token-contract.md) defines the group, role, variant, and state vocabulary.

---

## Global Hooks
Some attributes belong to the whole page, not to one component:

| Attribute        | Values                           | Set on           | Owner        |
| :--------------- | :------------------------------- | :--------------- | :----------- |
| `data-theme`     | `light`, `dark`; absent = system | root element     | theme switch |
| `data-accent`    | the look's variant values        | root element     | the app      |
| `data-i18n`      | a translation key                | any text element | `i18n.js`    |
| `data-i18n-aria` | a translation key                | any element      | `i18n.js`    |

`data-i18n-tooltip` and `data-i18n-placeholder` follow the same pattern as `data-i18n-aria`.

See [i18n.md](i18n.md) for catalog loading, interpolation, attribute mappings, and the `setCatalog` API.

---

## Other Names
- Shell classes use the key `app`: `.app`, `.app__top-bar`, `.app--scroll-main`, as [ADR-0004](../adrs/ADR-0004-app-shell.md) shows.
- Icon ids: `icon-{{name}}` in kebab-case, such as `icon-close`; core ids live in [contract.json](../../src/contract.json).
- Gallery-only state classes: `.is-hover`, `.is-active`, and `.is-focus`, never used in app markup.
- Files and folders: kebab-case, such as `css/components/icon-button.css`.
- Look folders: `src/looks/{{look}}/`, with a character name such as `neutral`.
- Translation keys outside components: `common.{{name}}` for shared words such as `common.save`.

---

## Names to Change During Extraction
todos.webapp names that break the rule get the rule's name, plus a deprecated alias for one minor release:

| Today                           | After extraction               | Reason                             |
| :------------------------------ | :----------------------------- | :--------------------------------- |
| `createToaster`                 | `createToast` in `js/toast.js` | the key is `toast`                 |
| `spriteIcon`                    | `createIcon` in `js/icon.js`   | the key is `icon`                  |
| `createField` in `editor-panel` | `createField` in `js/field.js` | the module carries the key         |
| `anchorPanel` in `popover.js`   | `anchorPanel` in `anchor.js`   | it is shared by several components |
| `.user-button`                  | `.account-menu__button`        | the key is `account-menu`          |
| `.app-tile__body`               | `.card__body`                  | the parts belong to the card       |

The variant attribute changes too: family-portal's `data-season` and meteo's `data-theme-color` become `data-accent`.
[ADR-0002](../adrs/ADR-0002-looks.md) lists the values per look.
