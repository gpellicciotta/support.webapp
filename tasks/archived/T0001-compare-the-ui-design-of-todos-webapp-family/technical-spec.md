# T0001 Technical Specification
Dimensions, sources, output format, and known facts for the UI design comparison.

---

## Apps and Sources
Read every app from its sibling checkout under the workspace root:
- `todos.webapp`: vanilla single-page app without build step; web root `src/`.
- `family-portal`: Java server with server-rendered pages; web root `webapp/`.
- `meteo`: vanilla app with one stylesheet; web root is the repository root.
- `auth`: single-page app on support.js components; web root `webapp/`.
- `counters.server`: single-page app on support.js components; web root `webapp/`.
- `support.js`: the `css/` and `src/` files that auth and counters started from.

Auth and counters will be redesigned later, so cover them at reference depth.
Reference depth means: name their approach and any pattern the other apps lack, without full anatomy.
Skip generated and build output folders, such as `build/`, `output/`, and `node_modules/`.

---

## Dimensions
Low level:
- Token tiers, naming, count per category, and theming mechanism (`light-dark()`, `data-theme`, media queries).
- Colors and palette, contrast checks, and color-meaning rules.
- Typography: font families, loading (self-hosted or third-party), type scale, and line heights.
- Spacing, radii, borders, shadows and elevation, layers, and motion with reduced-motion handling.
- Icons: system (sprite, inline SVG, icon font, JavaScript), grid, sizing, and color behavior.
- Focus indicators and touch target sizes.

Middle level:
- Buttons, fields, forms, validation states, chips, and toggles.
- Lists and list rows, cards, and tiles.
- Multi-select, bulk actions, delete, undo, and recycle bin.
- Empty states, loading and progress, and skeletons.
- Toasts, banners, system notifications, and notification inbox or center.
- Context menus, popovers, tooltips, and collapsibles.
- Dialogs and confirmations, including typed confirmations.
- Avatars and account menus.

High level:
- App shell: header or top bar, sidebars, bottom bar, floating action button, and editor panels.
- Navigation and routing: single-page app versus multi-page site.
- Responsive behavior: breakpoints, container queries, and phone versus desktop layouts.
- Splash, offline, and error pages; service worker and install behavior.
- Theme switching and seasonal or brand variants.
- Internationalization hooks that affect markup or layout.

Code level, for every pattern above:
- CSS: file organization, class naming scheme, and selectors that depend on markup.
- HTML: the element hierarchy, with ARIA roles and attributes.
- JavaScript: module, public API, state handling, and native elements used (`<dialog>`, `popover`).
- Documentation and tests: gallery section, style guide section, and visual or token tests.

---

## Output Format
Write the comparison to `docs/analysis/ui-design-comparison.md` in this repository.
Per dimension, give one entry per pattern with:
- How each app does it, with repository file links and line numbers.
- Similarities and differences that matter for sharing.
- The recommended reference implementation, and why.
- A sharing verdict: shared contract, shared component, look-specific, shell-specific, or app-local.

Also include:
- A token name crosswalk across todos.webapp, family-portal, meteo, and support.js, as a padded table.
- A summary of findings, at most one screen long, at the top of the document.
- A list of open questions for T0002.

Store screenshots in this task's companion directory and link them from the comparison.
Use the testing-guidelines skill for screenshots: 390 px and 1440 px, light and dark.
Serve each app locally without changing it; record any app that cannot run, and why.

---

## Known Facts to Verify
Measured during the design conversation on 2026-11-08:
- todos.webapp and family-portal each recorded a decision to own a design system, for look reasons.
- 45 of the 71 semantic token names of todos.webapp also exist in family-portal.
- meteo shares 7 token names with todos.webapp and has no gallery or style guide.
- Auth and counters hold forked copies of `support.js/css`; all 17 shared files differ.
- Auth and counters load Roboto from Google Fonts and icons from a Font Awesome kit.
- todos.webapp uses an SVG sprite; family-portal uses inline stroke SVG icons.

---

## Declared Files
- `docs/analysis/ui-design-comparison.md` (new)
- [index.md](../../../../docs/index.md)
- [CHANGELOG.md](../../../../CHANGELOG.md)

Size estimate: 3 files, 900 lines

### Tests
- Unit test: none (documentation-only task without code)
- Integration test: none (documentation-only task without code)

Completion check: `python ../dev-guidelines/scripts/lint-markdown.py check docs CHANGELOG.md`
