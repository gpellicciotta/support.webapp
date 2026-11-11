# ADR-0008: Repository Layout
Defines the folder structure of this repository for tokens, looks, components, shell, gallery, tools, template, and docs.

- Status: Proposed, awaiting approval in the review of the planning task.
- Date: 2026-11-11.

---

## Context
- The ui-guidelines place the style sheet at `{{web-root}}/css/style.css` and the gallery at `{{web-root}}/demo/`.
- The package ships its files as they are ([ADR-0005](ADR-0005-distribution-and-versioning.md)), so the source layout is the shipped layout.
- The project-setup guidelines expect `scripts/bootstrap-dev-environment.py` and [devops.py](../../scripts/devops.py).
- todos.webapp uses `src/` as its web root, with one stylesheet per layer and modules under `src/js/ui/`.

---

## Decision
Layout:

```text
support.webapp/
  src/                          web root of the package and the gallery
    css/
      style.css                 look-neutral entry: imports the partials below
      base.css                  shared base tokens: space, motion, layers, widths
      reset.css                 element defaults and the global focus indicator
      components/               one partial per component, such as button.css
      shell.css                 the app shell of ADR-0004
      deprecated.css            aliases of renamed tokens
    looks/
      _template/                starting point for a new look
      todos/                    index.css, primitives.css, look.css, fonts.css, fonts/, icons.svg
    js/                         behavior modules, such as dialog.js, menu.js, and toast.js
    demo/
      visual-style-gallery.html
      gallery.css
      gallery.js
      shell-*.html              one shell demo page per adopter's settings
  bin/
    cli.mjs                     create, vendor, and check subcommands
    check.mjs                   offline conformance check, also vendored into apps
  template/                     starter app for the create command
  tests/
    unit/                       token test and module tests
    e2e/                        browser verifier and behavior tests
  scripts/
    bootstrap-dev-environment.py
    devops.py
  docs/
    adrs/                       these decision records
    analysis/                   the comparison
    specs/
      visual-style-guide.md
      looks/                    one page per look
    roadmap.md
  package.json
```

Rules:
- A look's `index.css` imports `../../css/style.css` first, then its primitives, mapping, and fonts.
  Base and look tokens never overlap ([ADR-0001](ADR-0001-layer-model-and-token-contract.md)), so import order only matters for component rules.

- `src/css/style.css` stays the single entry for look-neutral styles, as the ui-guidelines require.
- `npm pack` ships `src/` without `demo/`, plus `bin/`, `template/`, the manifest, and the project files.
- [devops.py](../../scripts/devops.py) wraps tests, checks, linting, and release steps, following the cli-guidelines.

---

## Options Considered
- One package with `src/` as the web root, chosen: the gallery serves the exact files that apps vendor.
- npm workspaces with one package per layer, as support.js has: more manifests and versions for one release unit.
- One repository per look: looks and components could drift apart in version.

---

## Consequences
- The gallery can run from a plain static server on `src/`, with no build.
- Nested `@import` chains load one level after another, so a first visit pays several round trips.
  Service workers precache the files afterwards; a combined entry file can follow if measurements warrant it.
- Adding a look touches only `src/looks/`, the gallery switcher, and `docs/specs/looks/`.
- The `template/` folder holds files with placeholders, so linters must skip it or understand the placeholders.

---

## Evidence
- Current layouts: [Scope, Sources, and Method](../analysis/ui-design-comparison.md#scope-sources-and-method) and [CSS Organization and Class Naming](../analysis/ui-design-comparison.md#css-organization-and-class-naming).
- Sibling facts are `[V:C]`: first-party code read at the commits pinned in the comparison.
- Research context: written by Claude Opus 5.5 on 2026-11-11, knowledge cutoff June 2026, with web access to HTML pages.
