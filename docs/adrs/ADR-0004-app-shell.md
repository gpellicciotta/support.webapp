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
Its component key is `app`, following the naming rules of [naming.md](../specs/naming.md).

Areas, each optional except the main area:
- Top bar: title or brand, a menu button or breadcrumb, and account actions.
  Its parts are `app__title`, `app__brand`, `app__menu-button`, `app__breadcrumb`, and `app__top-actions`.
- Navigation: a sidebar on wide screens, a bottom bar on narrow screens, or both.
- Banners: system and status banners above the content.
- Main: the content, the only required area.
- Action bar: the main actions of the current screen, or a footer.
- Side panel: a detail or editor panel beside the main column.
- Overlay layer: the toast region and other floating parts.
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

- The sidebar and the bottom bar both carry `aria-label="Main"`; only one shows at any width.
- A skip link leads to the main area.
- Bars pad themselves with the safe-area insets of phones.
- Navigation links mark the current entry with `aria-current="page"`.

Responsive behavior:
- One layout breakpoint at 64rem, todos.webapp's value, splits narrow and wide layouts.
- Custom properties do not work in media queries ([MDN][mdn-custom-properties]), so 64rem is a documented constant.
- Below 64rem the sidebar hides, the bottom bar shows, and the side panel opens as a full-window sheet.
- Components adapt to their own width through container queries, not through the layout breakpoint.

Adopter settings:
- todos.webapp: every area; sidebar and bottom bar; `app--scroll-main`.
  Its add bar becomes the action bar, and its editor becomes the side panel.

- counters: top bar with a menu button, banners, action bar, and overlay layer; `app--scroll-page`.
  On wide screens its actions move into the top bar, as the support.js layout does today.

- meteo: top bar, banners, action bar, and overlay layer; no navigation; `app--scroll-page` and `app--width-narrow`.
  Its three screens stay sections inside the main area, toggled by its own code.

- family-portal: top bar with brand, breadcrumb, help, and account; banners; action bar for the footer; `app--scroll-page`.
  One server template partial renders the top bar instead of 14 copies.

---

## Options Considered
- **[Chosen]** One shell with options: one grid and one set of sticky rules serve all four apps.
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
- One demo page per adopter's settings proves the fit; each gets browser checks at 390 and 1440 px.

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
