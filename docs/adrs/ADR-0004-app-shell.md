# ADR-0004: App Shell
Defines the one shared shell: its areas, options, markup, responsive behavior, scroll modes, and each adopter's settings.

- Status: Accepted on 2026-11-12, in review round 2 of the planning task.
- Date: 2026-11-11.
- **[Decided]** with the user on 2026-11-10: one shell as markup and CSS, with optional areas and options, and no router.

---

## Context
- Four apps implement four shells today, with different grids, sticky rules, and breakpoints.
- todos.webapp writes one DOM for phone and desktop and switches layout at 64rem.
- family-portal hand-copies its sticky header into 14 server templates.
- meteo shows three full-window screens with sticky headers and footers, as a centered card on wide screens.
- The support.js lineage anchors its grid on element IDs and moves actions between top and bottom bars.
- Routing differs by nature: a hash router, Java page routes, a screen toggle, and the History API.

---

## Decision
The shell is documented markup plus one `shell.css`, with no shell script and no router.
Optional modules enhance the shell, and the areas never depend on them:
- [app-nav.js](../../src/js/app-nav.js) drives the nav toggle.
- [pull-refresh.js](../../src/js/pull-refresh.js) adds pull-to-refresh to installed apps, with the `app__pull-indicator` overlay part.
- [view.js](../../src/js/view.js) is the base of views that load their own data, with a wait status and an error page.
- [screen-action-bar.js](../../src/js/screen-action-bar.js) renders the screen actions of routed views in `.app__action-bar` and removes empty bars.
- [action-registry.js](../../src/js/action-registry.js) manages app and view actions with enabled state, disabled reasons, events, and `data-action` click delegation.
- [notices.js](../../src/js/notices.js) routes app and sticky inbox notifications to `.app__banners` and `.toast-region`.
Its component key is `app`, following the naming rules of [naming.md](../specs/naming.md).

Areas, each optional except the main area:
- Top bar: a nav toggle, title or brand, a menu button or breadcrumb, and account actions.
  Its parts are `app__nav-toggle`, `app__title`, `app__brand`, `app__brand-logo`, `app__menu-button`, `app__breadcrumb`, and `app__top-actions`.
  Setting `hidden` on a top bar part hides it despite its display rule, while sparing `hidden="until-found"`.
- Navigation: a sidebar on wide screens, a bottom bar on narrow screens, or both.
  An `app__nav-list--end` list pins to the sidebar bottom in every state, and a `.badge` sits at an `app__nav-item` end.
- Banners: system and status banners above the content; a direct `.icon-button` sits at a banner's end edge.
- Main: the content, the only required area.
- Action bar: the main actions of the current screen, or a footer.
- Side panel: a detail or editor panel beside the main column.
- Overlay layer: the toast region and other floating parts, such as the pull-to-refresh indicator.
  The live region is not part of the markup: `createLiveRegion` appends it once at page load.

Markup skeleton, with every area present:

```html
<body class="app app--scroll-main">
  <a class="skip-link" href="#main">Skip to content</a>
  <header class="app__top-bar">…</header>
  <nav class="app__sidebar" aria-label="Main">…</nav>
  <div class="app__banners">…</div>
  <main class="app__main" id="main" tabindex="-1">…</main>
  <aside class="app__side-panel" hidden>…</aside>
  <div class="app__action-bar">…</div>
  <nav class="app__bottom-nav" aria-label="Main">…</nav>
  <div class="app__overlays"><div class="toast-region" role="region" aria-label="Notifications"></div></div>
</body>
```

The normative skeleton of each adopter setup is in [components.md](../specs/components.md#app-shell).
Apps and the generator copy those skeletons, keeping only the areas they use.

Options:

| Option     | Values                                                | Default              | Meaning                                                                   |
| :--------- | :---------------------------------------------------- | :------------------- | :------------------------------------------------------------------------ |
| Scroll     | `app--scroll-main`, `app--scroll-page`                | `app--scroll-main`   | Main keeps the bars in place; page scrolls the document with sticky bars. |
| Navigation | sidebar, bottom bar, menu button, breadcrumb, or none | none                 | The elements present choose it; a sidebar and a bottom bar can combine.   |
| Width      | `app--width-reading`, `-narrow`, `-content`, or none  | none, the full width | Centers the main column at the matching width token.                      |

Width tokens, owned by the shared base of [ADR-0001](ADR-0001-layer-model-and-token-contract.md):
- `--width-reading` is 47.5rem, a comfortable line length for prose.
- `--width-narrow` is 55rem, for forms and single-column pages.
- `--width-content` is 75rem, the widest page column.
- The values are family-portal's, the only app that defines all three today.

Layout rules:
- The grid drops the track of an absent area through `:has()`.
  todos.webapp uses `:has()` in component styles only, so this shell use is new and needs its own tests.

- `shell.css` is the only package stylesheet that sets fixed or sticky positions.
  The floating action button sits in the overlay layer, as the one fixed control.
  The pull-to-refresh indicator sits there too, as a decorative fixed part.

- The sidebar and the bottom bar both carry `aria-label="Main"`; only one shows at any width.
- A skip link leads to the main area.
- Bars pad themselves with the safe-area insets of phones.
- The top bar pads with the main area's formula, so its edge text shares the content column's edges.
  Its first and last icon buttons reach outward by their glyph inset, so glyphs, not 44 px boxes, align.
  With a sidebar in the wide layout, it starts on the sidebar's glyph column, so the nav toggle tops the nav glyphs.
- **[Decided]** with the user on 2026-11-17, in the layout review: the top bar is a full-width app bar.
  From 64rem it and the action bar span every column, with the sidebar and side panel between them.
- The nav toggle, `icon-nav-menu`, cycles the wide sidebar through open, an icon rail, and hidden.
  Below 64rem it opens the sidebar as a drawer under the top bar, with a backdrop, Escape, and focus return.
  It hides below 64rem when a bottom bar holds the navigation.
- The toggle's `aria-expanded`, the sidebar's `hidden`, and the sidebar's `auto` popover state carry the state.
  The `popovertarget` attribute keeps the drawer working without the script.
- Overflow menus open from `icon-more`, drawn as vertical dots, at the end of the top bar.
- Navigation links mark the current entry with `aria-current="page"`.
- **[Decided]** with the user on 2026-11-23: installed apps refresh on a pull down at the page top.
  iOS gives installed web apps no pull-down reload, so `pull-refresh.js` supplies the gesture while `(display-mode: standalone)` matches.
  Browser tabs keep their native reload; the module then sets nothing and ignores touches.
  While installed, `<html data-pull-refresh>` sets `overscroll-behavior-y: contain`, so no native reload drops app state.
  The `app__pull-indicator` slides down under the top bar, arms at 64 px, and spins until the refresh settles.
  Auth's SPA built it app-locally in its task T0249; as a shell part, its fixed position stays in `shell.css`.

Responsive behavior:
- One layout breakpoint at 64rem, todos.webapp's value, splits narrow and wide layouts.
- Custom properties do not work in media queries ([MDN][mdn-custom-properties]), so 64rem is a documented constant.
- Below 64rem the sidebar hides, the bottom bar shows, and the side panel opens as a full-window sheet.
- From 64rem the top bar and action bar span the sidebar, main, and side panel columns.
- Components adapt to their own width through container queries, not through the layout breakpoint.

Adopter settings:
- todos.webapp: every area; sidebar and bottom bar; `app--scroll-main`.
  Its add bar becomes the action bar, and its editor becomes the side panel.

- todos.server Admin Console: nav toggle and brand in the top bar, sidebar, main, and side panel; `app--scroll-main`.
  It has no bottom or action bar, and its page title is the main area's heading; it targets desktop widths.

- counters: top bar with a menu button, banners, action bar, and overlay layer; `app--scroll-page`.
  On wide screens its actions move into the top bar, as the support.js layout does today.

- meteo: top bar, banners, action bar, and overlay layer; no navigation; `app--scroll-page` and `app--width-narrow`.
  Its three screens stay sections inside the main area, toggled by its own code.

- family-portal: top bar with brand, breadcrumb, help, and account; banners; action bar for the footer; `app--scroll-page`.
  One server template partial renders the top bar instead of 14 copies.

- auth, added on 2026-11-15 by the [auth redesign plan](../plans/auth-redesign.md):
  public pages use the narrow page setup, with `app--scroll-page` and `app--width-narrow`.
  Signed-in pages use the top bar with a menu button and the account menu; `app--scroll-page`.
  Its Admin Console uses the todos.server Admin Console setup.

---

## Options Considered
- **[Chosen]** One shell with options: one grid and one set of sticky rules serve all four apps.
- A top bar over the main column only, beside a full-height sidebar: replaced on 2026-11-17 in the layout review.
  A full-width app bar keeps the brand and nav toggle in one place, whether the sidebar is open, a rail, or hidden.
- An app shell plus a site shell: rejected, because it means two near-identical grids to maintain.
  family-portal fits the options of one shell, so the second grid buys nothing.
- No shared shell: rejected, because every app keeps writing its own grid.
  The comparison already found four diverging versions.
- A shell with a router: rejected, because routing differs by nature in each app.
  Server pages route on the server (DS-9), so routing stays app-local.
- A shell script that builds the areas: rejected, because server-rendered pages must work without it.
  Markup plus CSS works for static, script-built, and Java-rendered pages alike.

---

## Consequences
- todos.webapp's fixed toast region and sticky add block move into shell areas.
- family-portal's footer changes from fixed to the action bar, which stays at the bottom in both scroll modes.
- meteo's six width breakpoints, from 380 to 768 px, give way to the width option and container queries.
- family-portal's 40rem breakpoint, used 8 times and mirrored in JavaScript, becomes container queries or stays app-local.
- counters leaves its ID-anchored grid at its redesign.
- One demo page per layout setup proves the fit, with desktop checks for the admin console.

Open points:
- meteo's main column was not measured, and its cards cap at 420 to 480 px in its own CSS.
  Its adoption task checks the column against `--width-narrow`, and may propose a smaller width token.
- todos.webapp's `--width-main` of 45rem maps to none of the three width tokens.
  Its extraction task keeps the value as a look-neutral layout width, or maps it, and lists the choice.

---

## Evidence
- Shells: [App Shell Layout](../analysis/ui-design-comparison.md#app-shell-layout).
- Routing: [Navigation and Routing](../analysis/ui-design-comparison.md#navigation-and-routing).
- Breakpoints: [Responsive Behavior](../analysis/ui-design-comparison.md#responsive-behavior).
- Fixed and sticky positions: [CSS Organization and Class Naming](../analysis/ui-design-comparison.md#css-organization-and-class-naming).
- Width values: family-portal `tokens.css` and todos.webapp `tokens.css`, read on 2026-11-11 in the review of the planning task, `[V:C]`.
- Sibling facts are `[V:C]`: first-party code read at the commits pinned in the comparison.
- Research context: written by Claude Opus 5.5 on 2026-11-11, knowledge cutoff June 2026, with web access to HTML pages.

---

## Sources
- `[V:C]` [Using CSS custom properties][mdn-custom-properties]: "Variables do not work inside media queries and container queries."

[mdn-custom-properties]: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties
