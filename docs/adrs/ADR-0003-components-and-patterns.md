# ADR-0003: Components and Patterns
Defines the markup contract, the JavaScript approach, the sharing rule, the first component set, and the shared patterns.

- Status: Proposed, awaiting approval in the review of the planning task.
- Date: 2026-11-11.
- Decided with the user on 2026-11-10: loading, popovers, internationalization, and shipping modules in the package.
- Decided with the user on 2026-11-11: family-portal migrates to `data-i18n` attributes.

---

## Context
- Components must work in apps without a build step (DS-8) and on server-rendered pages (DS-9).
- todos.webapp and family-portal already share BEM class APIs for buttons, fields, and chips.
- todos.webapp alone has small, tested behavior modules for dialogs, menus, popovers, toasts, and live regions.
- The support.js lineage builds components from template strings with `innerHTML` and no ARIA.
- No app has an accessible switch, loading pattern, or multi-select.

---

## Decision
Markup contract, documented per component in the style guide and the gallery:
- Native elements come first: `<button>`, `<dialog>`, the `popover` attribute, `<fieldset>`, and native inputs.
- Classes follow BEM: block, `__element`, and `--modifier`; styles use no ID selectors.
- State lives in native states and ARIA attributes, such as `:disabled`, `[aria-pressed]`, `[aria-invalid]`, and `[aria-busy]`.
- The classes `.is-hover`, `.is-active`, and `.is-focus` mirror pseudo-classes for gallery specimens only.
- Components hold no fixed or sticky positions; the shell of [ADR-0004](ADR-0004-app-shell.md) owns them.
- One global `:focus-visible` outline in `--color-focus` marks focus, with danger and inset variants, as in todos.webapp.
  Forced colors mode sets `box-shadow` to none ([MDN][mdn-forced-colors]), so rings never rely on shadows.

JavaScript approach:
- Plain ES modules in the light DOM, with no framework, custom elements, shadow DOM, or build step.
- Each behavior is a function such as `attachMenu(button, menu, options)` that returns a controller with `destroy()`.
- Functions accept an injected `document`, so unit tests run without a browser, as in todos.webapp.
- Pages stay readable and navigable without JavaScript; behaviors enhance them.
- CSS, sprites, and modules ship together in one package ([ADR-0005](ADR-0005-distribution-and-versioning.md)).

Sharing rule:
- The first set holds every pattern that the comparison marked as a shared component or contract.
- Any later component starts app-local and moves into the package once a second app needs it.

First component set, with its reference implementation:
- Controls from todos.webapp: button, icon button, field with `createField`, checkbox, radio, chip, and segmented control.
- Switch: a new design with `role="switch"`, since no app has an accessible one.
- Containers: card and tile from family-portal, row base and empty state from todos.webapp.
- Feedback: toast, banner, and live region from todos.webapp, with the tier rules of the counters notification ADR, summarized in [the comparison](../analysis/ui-design-comparison.md#toasts-banners-system-notifications-and-inbox).
- Loading: `aria-busy` plus a polite status line; skeletons only for slow lists, static under reduced motion.
- Overlays from todos.webapp: dialog, the three confirmation tiers, menu, and collapsible.
- Popover: the native `popover` attribute, placed by the todos.webapp anchoring code.
- Tooltip: meteo's focus and hover tips, once a screen reader check confirms the tip text is exposed.
- Identity: avatar from family-portal and account menu from todos.webapp.
- Icons: the `.icon` class, external sprite `<use>` references, and the `spriteIcon` builder from todos.webapp.

Shared patterns, documented as contracts without components of their own:
- Delete moves an item to a recycle bin and offers Undo in a toast.
- The theme switch offers System, Light, and Dark, and sets `data-theme` on the root element.
- A new service worker version shows an Update toast, and the user chooses when to reload.
- The offline page explains the state and offers Retry.
- The current navigation entry carries `aria-current="page"`.

Internationalization contract:
- One JSON catalog per locale holds flat dotted keys, such as `common.save`.
- Markup uses `data-i18n` for text, plus `data-i18n-aria`, `data-i18n-tooltip`, and `data-i18n-placeholder`, as in meteo.
- The package ships an `i18n.js` module with `applyTranslations(root)` and `t(key, params)`.
- family-portal moves its server-filled `{{t:key}}` templates to these attributes during adoption.

---

## Options Considered
JavaScript approach:
- Light DOM modules, chosen: server-rendered markup keeps working, and BEM classes style every part.
- Custom elements with shadow DOM: inner parts escape the shared class contract, and content waits for scripts.
- A framework such as React or Lit: needs a build step, which DS-8 rules out.

Sharing rule:
- Shared once a second app needs it, chosen: the package holds only code with proven reuse.
- Everything shared upfront: the package would grow with single-use code.

Popovers:
- The native `popover` attribute, chosen: it works across browsers since April 2024 ([MDN][mdn-popover]).
- todos.webapp's `hidden` toggling: works today, but repeats light dismiss and layering by hand.

Loading:
- `aria-busy` and a status line, chosen: screen readers hear progress, and no motion is needed.
- Skeletons everywhere: motion on every load, and no meaning for assistive technology on their own.

Internationalization of server pages:
- Migrate to `data-i18n`, chosen: one mechanism in every app.
- Server filling with the shared catalog: pages arrive translated, but two mechanisms apply one catalog.
- A family-portal exception: no work now, but two catalog formats in the family.

---

## Consequences
- todos.webapp's popovers move to the native attribute in a behavior-change task after their extraction.
- family-portal pages show default-language text until the script applies the catalog.
  The adoption task measures this delay and reports it.
- family-portal has no recycle bin; its adoption task records the gap against the delete pattern.
- family-portal's 3 px box-shadow focus ring becomes an outline, a deliberate visible change.
- The switch and loading designs need gallery specimens and tests before any app uses them.

---

## Evidence
- Controls: [Buttons](../analysis/ui-design-comparison.md#buttons), [Fields, Forms, and Validation](../analysis/ui-design-comparison.md#fields-forms-and-validation), and [Chips, Toggles, and Segmented Controls](../analysis/ui-design-comparison.md#chips-toggles-and-segmented-controls).
- Containers: [Lists, Rows, Cards, and Tiles](../analysis/ui-design-comparison.md#lists-rows-cards-and-tiles).
- Feedback: [Empty States, Loading, Progress, and Skeletons](../analysis/ui-design-comparison.md#empty-states-loading-progress-and-skeletons) and [Toasts, Banners, System Notifications, and Inbox](../analysis/ui-design-comparison.md#toasts-banners-system-notifications-and-inbox).
- Overlays: [Menus, Popovers, Tooltips, and Collapsibles](../analysis/ui-design-comparison.md#menus-popovers-tooltips-and-collapsibles) and [Dialogs and Confirmations](../analysis/ui-design-comparison.md#dialogs-and-confirmations).
- Patterns: [Multi-select, Bulk Actions, Delete, Undo, and Recycle Bin](../analysis/ui-design-comparison.md#multi-select-bulk-actions-delete-undo-and-recycle-bin) and [Internationalization Hooks](../analysis/ui-design-comparison.md#internationalization-hooks).
- Code approach: [JavaScript Components and State](../analysis/ui-design-comparison.md#javascript-components-and-state) and [Sharing Verdicts](../analysis/ui-design-comparison.md#sharing-verdicts).
- Sibling facts are `[V:C]`: first-party code read at the commits pinned in the comparison.
- Research context: written by Claude Opus 5.5 on 2026-11-11, knowledge cutoff June 2026, with web access to HTML pages.

---

## Sources
- `[V:C]` [popover attribute on MDN][mdn-popover]: "It’s been available across browsers since April 2024."
- `[V:C]` [forced-colors on MDN][mdn-forced-colors]: "`box-shadow` is forced to 'none'".

[mdn-popover]: https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Global_attributes/popover
[mdn-forced-colors]: https://developer.mozilla.org/en-US/docs/Web/CSS/Reference/At-rules/@media/forced-colors
