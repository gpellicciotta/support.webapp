# ADR-0008: Repository Layout
Defines the folder structure of this repository for tokens, looks, components, shell, gallery, tools, template, and docs.

- Status: Accepted on 2026-11-12, in review round 2 of the planning task.
- Date: 2026-11-11.
- **[Decided]** with the user on 2026-11-12: no copy step to `dist/` until a build step needs one.

---

## Context
- The ui-guidelines place the style sheet at `{{web-root}}/css/style.css` and the gallery at `{{web-root}}/demo/`.
- The package ships its files as they are ([ADR-0005](ADR-0005-distribution-and-versioning.md)), so the source layout is the shipped layout.
- Browsers run CSS, JavaScript, and HTML directly, so a copy of `src/` is a valid package without compiling.
- The project-setup guidelines expect `scripts/bootstrap-dev-environment.py` and [devops.py](../../scripts/devops.py).
- todos.webapp uses `src/` as its web root, with one stylesheet per layer and modules under `src/js/ui/`.
- Each component has one key that names its class, partial, module, gallery section, and tests ([naming.md](../specs/naming.md)).

---

## Decision
Layout:

```text
support.webapp/
  src/                          web root of the package and the gallery
    contract.json               required tokens, themes, core icon ids, and component keys
    css/
      style.css                 look-neutral entry: imports the partials below
      base.css                  shared base tokens: space, motion, layers, widths
      reset.css                 element defaults and the global focus indicator
      components/               one partial per component key, such as button.css and field.css
      shell.css                 the app shell of ADR-0004
      deprecated.css            aliases of renamed tokens
    looks/
      _template/                starting point for a new look
      neutral/                  index.css, primitives.css, look.css, fonts.css, fonts/, icons.svg
      warm/                     the same files, added in phase 2
      bright/                   the same files, added in phase 4
    js/                         one module per component key, such as dialog.js, field.js, and toast.js
                                plus utility modules: focus.js, anchor.js, and live-region.js
    demo/
      visual-style-gallery.html
      gallery.css
      gallery.js
      shell-*.html              one shell demo page per adopter's settings
  bin/
    cli.mjs                     vendor and check subcommands
    check.mjs                   offline integrity and conformance check, also vendored into apps
  template/                     starter app for the generator; stays out of the npm package
  tests/
    unit/                       token test and {{key}}.test.js module tests
    e2e/                        browser verifier and {{key}}.spec.js behavior tests
  scripts/
    bootstrap-dev-environment.py
    devops.py                   check, release, and generate-app actions
    requirements.txt            the pinned support.python version
  docs/
    adrs/                       these decision records
    analysis/                   the comparison
    specs/
      visual-style-guide.md
      components.md             component catalog with markup skeletons
      naming.md                 naming conventions for tokens, classes, hooks, modules, and files
      looks/                    one page per look
    roadmap.md
  package.json
```

Rules:
- A look's `index.css` imports `../../css/style.css` first, then its primitives, mapping, and fonts.
  Base and look tokens never overlap ([ADR-0001](ADR-0001-layer-model-and-token-contract.md)), so import order only matters for component rules.

- `src/css/style.css` stays the single entry for look-neutral styles, as the ui-guidelines require.
- A component key `{{key}}` owns `src/css/components/{{key}}.css`, an optional `src/js/{{key}}.js`, and a gallery section.
- `npm pack` ships `src/` without `demo/`, plus `bin/`, the manifest, and the project files.
- The public entry points of ADR-0005 are the only files apps may link or import; all other files are private.
- [devops.py](../../scripts/devops.py) wraps tests, checks, linting, release, and `generate-app`, following the cli-guidelines.
- `generate-app` reads `template/` from a checkout at a release tag ([ADR-0006](ADR-0006-generator.md)).

---

## Options Considered
Package structure:
- **[Chosen]** One package with `src/` as the web root: the gallery serves the exact files that apps vendor.
- npm workspaces with one package per layer, as support.js has: rejected, because it adds manifests and versions.
  Tokens, components, and the shell always release together, so separate versions only add coordination.
- One repository per look: rejected, because looks and components could drift apart in version.

Build step:
- **[Decided]** with the user on 2026-11-12: no build step; `src/` is the package.
  The copy step to `dist/` comes only once a build step needs it.
- A build step that copies `src/` to `dist/`: changes nothing for apps, since files, paths, and bytes stay identical.
  It costs a build script, and the gallery and tests would have to serve `dist/`.
- A minify-and-bundle step: fewer requests and smaller files on a first visit.
  It removes private partials, so it stays non-breaking only through the public entry points of ADR-0005.
- Adding the copy step now, as insurance for a later bundle: rejected by the user on 2026-11-12.
  The entry-point contract already keeps a later bundle non-breaking.

Look folder names:
- **[Chosen]** Character names such as `neutral`, `warm`, and `bright`: several apps can share a look.
  The user decided the names on 2026-11-12 in [ADR-0002](ADR-0002-looks.md).
- App names such as `todos`: rejected by the user on 2026-11-11, because a look must not belong to one app.

---

## Consequences
- The gallery can run from a plain static server on `src/`, with no build.
- Nested `@import` chains load one level after another, so a first visit pays several round trips.
  Service workers precache the files afterwards; a combined entry file can follow if measurements warrant it.
- Adding a look touches only `src/looks/`, `contract.json` if it adds core icons, the gallery switcher, and `docs/specs/looks/`.
- Adding a component touches its partial, its module, its gallery section, its catalog entry, and `contract.json`.
- The `template/` folder holds files with placeholders, so linters must skip it or understand the placeholders.

---

## Evidence
- Current layouts: [Scope, Sources, and Method](../analysis/ui-design-comparison.md#scope-sources-and-method) and [CSS Organization and Class Naming](../analysis/ui-design-comparison.md#css-organization-and-class-naming).
- Sibling facts are `[V:C]`: first-party code read at the commits pinned in the comparison.
- Research context: written by Claude Opus 5.5 on 2026-11-11, knowledge cutoff June 2026, with web access to HTML pages.
