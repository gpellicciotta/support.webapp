# ADR-0003: Components and Patterns
Defines the markup contract, naming link, JavaScript approach, modularity, sharing rule, catalog, and shared patterns.

- Status: Accepted on 2026-11-12, in review round 2 of the planning task.
- Date: 2026-11-11.
- **[Decided]** with the user on 2026-11-10: loading, popovers, internationalization, and shipping modules in the package.
- **[Decided]** with the user on 2026-11-11: family-portal migrates to `data-i18n` attributes.
- **[Decided]** with the user on 2026-11-11: one kebab-case key per component links its HTML, CSS, and JavaScript.
- **[Decided]** with the user on 2026-11-11: the first set adds badge, floating action button, list and data table, tabs, progress bar and spinner, and multi-select.
- **[Decided]** with the user on 2026-11-11: forms, validation states, the help toggle, and the error summary are part of T0008.

---

## Context
- Components must work in apps without a build step (DS-8) and on server-rendered pages (DS-9).
- todos.webapp and family-portal already share BEM class APIs for buttons, fields, and chips.
- todos.webapp alone has small, tested behavior modules for dialogs, menus, popovers, toasts, and live regions.
- The support.js lineage builds components from template strings with `innerHTML` and no ARIA.
- No app has an accessible switch, loading pattern, or multi-select.
- counters has field help toggles and valid, error, and pending states, but its help icon is neither focusable nor labeled.
- The round 1 review found the first set to be an inventory of what apps have, not a deliberate catalog.

---

## Decision
### Component catalog
- [components.md](../specs/components.md) lists every component the system provides, with its key, source, status, and owning task.
- For each component it gives the HTML skeleton, variants and states, and the accessibility minimum.
- The skeleton is normative: CSS, JavaScript, server templates, and the generator all build on it.
- The four adopter setups of the app shell of [ADR-0004](ADR-0004-app-shell.md) have skeletons there too.
- The gallery and the token test iterate over the component keys in `src/contract.json`.

First set, by category; the catalog holds the detail:
- Controls: button, icon button, link button, floating action button, field, checkbox, radio, switch, chip, segmented control, and badge.
- Forms and selection: form, field help toggle, validation states, error summary, field group, and multi-select.
- Containers: card, icon tile, row base, empty state, collapsible, list and data table, and tabs.
- Feedback: toast, live region, banner, loading pattern, and progress bar and spinner.
- Overlays: dialog with its three confirmation tiers, menu, popover, and tooltip.
- Identity and foundations: avatar, account menu, icon, and theme switch.

### Markup contract
- Native elements come first: `<button>`, `<dialog>`, the `popover` attribute, `<fieldset>`, and native inputs.
- Classes follow BEM: block, `__element`, and `--modifier`; styles use no ID selectors.
- State lives in native states and ARIA attributes, such as `:disabled`, `[aria-pressed]`, `[aria-invalid]`, and `[aria-busy]`.
  JavaScript never sets a class to show state.
- The classes `.is-hover`, `.is-active`, and `.is-focus` mirror pseudo-classes for gallery specimens only.
- Components hold no fixed or sticky positions; the shell of [ADR-0004](ADR-0004-app-shell.md) owns them.
- One global `:focus-visible` outline in `--color-focus` marks focus, with danger and inset variants, as in todos.webapp.
  Forced colors mode sets `box-shadow` to none ([MDN][mdn-forced-colors]), so rings never rely on shadows.

### Naming link
Each component has one kebab-case key, and every artifact derives its name from it.
[naming.md](../specs/naming.md) defines the rule; for the key `{{key}}`:
- Classes `.{{key}}`, `.{{key}}__{{part}}`, and `.{{key}}--{{variant}}`.
- JavaScript hooks as `data-{{key}}-{{name}}` attributes, never classes.
- Files `css/components/{{key}}.css` and `js/{{key}}.js`, and private tokens `--_{{key}}-{{name}}`.
- Gallery section `id="{{key}}"`, and tests `tests/unit/{{key}}.test.js` and `tests/e2e/{{key}}.spec.js`.

### JavaScript approach
- Plain ES modules in the light DOM, with no framework, custom elements, shadow DOM, or build step.
- Function names say what they do:
  - `attach{{Key}}(element, options)` enhances markup that already exists, such as server-rendered pages.
  - `create{{Key}}(doc, options)` builds the skeleton, then calls `attach{{Key}}` on it.
  - `open{{Key}}(options)` shows a temporary element and resolves with the user's answer, such as `openDialog`.
- Each function returns a controller with `destroy()`, plus the methods its catalog entry lists.
- Functions accept an injected `document`, so unit tests run without a browser, as in todos.webapp.
- Pages stay readable and navigable without JavaScript; behaviors enhance them.
- CSS, sprites, and modules ship together in one package ([ADR-0005](ADR-0005-distribution-and-versioning.md)).

### Modularity
The rules of [ADR-0001](ADR-0001-layer-model-and-token-contract.md) apply to components:
- A component partial uses only semantic tokens and its own `--_{{key}}-` tokens.
- A component nests another component only through that component's markup, such as `.button` inside `.dialog__actions`.
- A component module imports only utility modules, such as `focus.js`, `anchor.js`, and `live-region.js`.
  It imports another component module only when the catalog names that dependency, such as the account menu using `menu.js`.

### Forms and validation
- A field has a label, one control, and optional hint, counter, help text, status, and error parts.
- The help toggle is a real button with `aria-expanded` and `aria-controls`; the help text also sits in `aria-describedby`.
- Invalid fields carry `aria-invalid`; pending checks carry `aria-busy` on the field and a status line.
- Icon, text, and color together carry each state, never color alone; icons come from the shared sprite.
- Validation runs on blur and on submit; server errors reach a field through the controller's `setError`.
- After a failed submit, an error summary lists every invalid field as a link, and focus moves to it.
- Messages reach screen readers through the live region.

### Sharing rule
- The first set holds every component in the catalog with the status "first set".
- Any later component starts app-local and moves into the package once a second app needs it.

### Shared patterns
Documented as contracts without components of their own:
- Delete moves an item to a recycle bin and offers Undo in a toast.
- The current navigation entry carries `aria-current="page"`.
- A new service worker version shows an Update toast, and the user chooses when to reload.
- The offline page explains the state and offers Retry.

### Internationalization contract
- One JSON catalog per locale holds flat dotted keys, such as `common.save`; component strings use `{{key}}.{{name}}`.
- Markup uses `data-i18n` for text, plus `data-i18n-aria`, `data-i18n-tooltip`, and `data-i18n-placeholder`, as in meteo.
- The package ships an `i18n.js` module with `applyTranslations(root)` and `t(key, params)`.
- family-portal moves its server-filled `{{t:key}}` templates to these attributes during adoption.

---

## Options Considered
JavaScript approach:
- **[Chosen]** Light DOM modules: server-rendered markup keeps working, and BEM classes style every part.
- Custom elements with shadow DOM: rejected, because inner parts escape the shared class contract.
  Content also waits for scripts, which breaks server-rendered pages.
- A framework such as React or Lit: rejected, because it needs a build step, which DS-8 rules out.

Catalog:
- **[Chosen]** A deliberate catalog with a skeleton per component: every task knows what done means.
- The extraction inventory of the first draft: rejected by the user, because it listed only what apps already had.

JavaScript hooks:
- **[Chosen]** `data-{{key}}-{{name}}` attributes: a CSS redesign cannot break behavior, and the key names the owner.
- Classes with a `js-` prefix: rejected, because classes mix styling and behavior in one attribute.
- One `data-js` marker per element: rejected, because one shared attribute does not say which component owns it.

Sharing rule:
- **[Chosen]** Shared once a second app needs it: the package holds only code with proven reuse.
  The catalog's first set is the exception the user approved for components new apps need.
- Everything shared upfront: rejected, because the package would grow with single-use code.

Popovers:
- **[Chosen]** The native `popover` attribute: it works across browsers since April 2024 ([MDN][mdn-popover]).
- todos.webapp's `hidden` toggling: rejected, because it repeats light dismiss and layering by hand.

Loading:
- **[Chosen]** `aria-busy` and a status line: screen readers hear progress, and no motion is needed.
- Skeletons everywhere: rejected, because they add motion to every load and mean nothing to assistive technology alone.

Forms:
- **[Chosen]** Part of T0008, with the field: forms, help, and validation share one module and one skeleton.
- A separate forms task: rejected by the user, so field and form stay one unit of work.

Internationalization of server pages:
- **[Chosen]** Migrate to `data-i18n`: one mechanism in every app.
- Server filling with the shared catalog: rejected, because two mechanisms would apply one catalog.
- A family-portal exception: rejected, because two catalog formats would live in the family.

---

## Consequences
- todos.webapp's popovers move to the native attribute in a behavior-change task after their extraction.
- todos.webapp names change to the key rule, each with a deprecated alias for one minor release:
  - `createToaster` becomes `createToast` in `js/toast.js`.
  - `spriteIcon` becomes `createIcon` in `js/icon.js`.
  - `createField` moves from `views/editor-panel.js` to `js/field.js`, and gains `attachField`.
  - `anchorPanel` moves from `popover.js` to the utility module `anchor.js`.
- family-portal's card parts take the card key, such as `.card__title`, instead of `.app-tile__body`.
- T0008 grows by the form, help toggle, validation states, error summary, and field group.
- Badge, floating action button, list and data table, tabs, progress bar and spinner, and multi-select need tasks.
  Multi-select needs a design first, since no accessible reference exists.
- family-portal pages show default-language text until the script applies the catalog.
  The adoption task measures this delay and reports it.
- family-portal has no recycle bin; its adoption task records the gap against the delete pattern.
- family-portal's 3 px box-shadow focus ring becomes an outline, a deliberate visible change.
- The switch, loading, multi-select, and error summary designs need gallery specimens and tests before any app uses them.

---

## Evidence
- Controls: [Buttons](../analysis/ui-design-comparison.md#buttons), [Fields, Forms, and Validation](../analysis/ui-design-comparison.md#fields-forms-and-validation), and [Chips, Toggles, and Segmented Controls](../analysis/ui-design-comparison.md#chips-toggles-and-segmented-controls).
- Containers: [Lists, Rows, Cards, and Tiles](../analysis/ui-design-comparison.md#lists-rows-cards-and-tiles).
- Feedback: [Empty States, Loading, Progress, and Skeletons](../analysis/ui-design-comparison.md#empty-states-loading-progress-and-skeletons) and [Toasts, Banners, System Notifications, and Inbox](../analysis/ui-design-comparison.md#toasts-banners-system-notifications-and-inbox).
- Overlays: [Menus, Popovers, Tooltips, and Collapsibles](../analysis/ui-design-comparison.md#menus-popovers-tooltips-and-collapsibles) and [Dialogs and Confirmations](../analysis/ui-design-comparison.md#dialogs-and-confirmations).
- Patterns: [Multi-select, Bulk Actions, Delete, Undo, and Recycle Bin](../analysis/ui-design-comparison.md#multi-select-bulk-actions-delete-undo-and-recycle-bin) and [Internationalization Hooks](../analysis/ui-design-comparison.md#internationalization-hooks).
- Code approach: [JavaScript Components and State](../analysis/ui-design-comparison.md#javascript-components-and-state) and [Sharing Verdicts](../analysis/ui-design-comparison.md#sharing-verdicts).
- counters forms: `counter-edit-or-create-view.mjs`, `forms.css`, and `app.mjs` in counters.server, read on 2026-11-11 during the round 1 review, `[V:C]`.
- todos.webapp `createField`: `views/editor-panel.js` in todos.webapp, read on 2026-11-11 during the round 1 review, `[V:C]`.
- Sibling facts are `[V:C]`: first-party code read at the commits pinned in the comparison.
- Research context: written by Claude Opus 5.5 on 2026-11-11, knowledge cutoff June 2026, with web access to HTML pages.

---

## Sources
- `[V:C]` [popover attribute on MDN][mdn-popover]: "It’s been available across browsers since April 2024."
- `[V:C]` [forced-colors on MDN][mdn-forced-colors]: "`box-shadow` is forced to 'none'".

[mdn-popover]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover
[mdn-forced-colors]: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors
