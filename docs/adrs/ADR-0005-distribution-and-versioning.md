# ADR-0005: Distribution and Versioning
Defines the package, how apps consume it without a build step, the versioning rules, and how releases reach apps.

- Status: Proposed, awaiting approval in the review of the planning task.
- Date: 2026-11-11.
- Decided with the user on 2026-11-10: one versioned package, copied into each web root by a script, with a drift check.
- Decided with the user on 2026-11-11: GitHub Packages as the registry.

---

## Context
- Apps must consume the system as a pinned, versioned dependency, never as hand-copied files (DS-10).
- todos.webapp and meteo serve their source folder as the web root, with no build step (DS-8).
- family-portal serves its `webapp/` folder from a Java server (DS-9).
- support.js already publishes an npm package to GitHub Packages from a workflow on each GitHub Release.
- auth vendors stale copies of support.js styles, and counters loads support.js through an import map.

---

## Decision
Package:
- One npm package, `@gpellicciotta/support.webapp`, on GitHub Packages.
- A workflow publishes it when a GitHub Release is published, as support.js does.
- It ships source files as they are: CSS, looks, sprites, fonts, ES modules, the command line tool, and the starter template.
- A `manifest.json` lists the version, the look of each file, and the SHA-256 hash of every file.

Consumption:
- An app copies the package into its web root with one command:

  ```bash
  npx @gpellicciotta/support.webapp@{{version}} vendor --look {{look}} --to {{web-root}}/vendor/design
  ```

- The command copies the look-neutral files, the chosen look, the manifest, and `bin/check.mjs`.
- `check.mjs` is self-contained: it holds its own hashing code and imports nothing else.
- It writes `design.json` at the app root with four fields: `version`, `look`, `target`, and `styles`.
  `styles` lists the app's own stylesheet folders, such as `src/css` or `webapp/css`, for the token rules.
- The app commits the copy, so static hosting, Java serving, and offline builds need no registry access.
- `node {{web-root}}/vendor/design/bin/check.mjs` fails when the copy differs from its manifest or the pin.
  A file in the copy that the manifest does not list also fails it.
- Java-served apps vendor into `webapp/vendor/design/`; templates and Java widgets reference `/vendor/design/` paths.
- Service workers precache the vendored files they use; the starter template lists them.

Versioning, following the change-management guidelines:
- Versions follow Semantic Versioning from 0.1.0.
- Breaking: removing or renaming a contract token, class, markup contract, module function, or core icon id.
  While the major version is 0, a breaking change bumps the minor version and carries the breaking mark.

- Minor: new tokens, components, looks, icons, deprecations, and visible changes to a look's values.
- Patch: fixes that restore documented behavior.
- The changelog header declares the areas `Tokens`, `Looks`, `Components`, `Shell`, `Modules`, `CLI`, and `Template`.

How DS-10 is met:
- No file is copied by hand: a script copies files from one pinned release.
- The check rejects any hand edit, extra file, or version mismatch wherever CI runs it.

Release reach:
- Each release gets one backlog task per consuming app, created with `plan tasks create --project`.
- That task runs `vendor`, the app's checks, and the screenshot comparison of [ADR-0007](ADR-0007-documentation-and-verification.md).

---

## Options Considered
Registry:
- GitHub Packages, chosen: the same release flow as support.js.
- Public npmjs.org: installs need no token and CDN mirrors work, but it adds a second release flow and account.
- GitHub Release assets: plain downloads, but no npm version tooling, so fetching and pinning become our code.

Consumption:
- Vendoring script with a committed copy, chosen: works for static hosting, Java serving, and offline caching alike.
- A pinned CDN URL: adds a third-party runtime dependency and needs a public registry.
- `npm install` with an import map: `node_modules` lies outside the web root of static and Java-served apps.

Package split:
- One package, chosen: tokens, components, and modules always match.
- Separate CSS and JavaScript packages: their versions could drift apart.

---

## Consequences
- Fetching a version needs a token in `.npmrc`, because GitHub Packages requires one even for public packages ([GitHub Docs][github-npm-registry]).
  Only the developer who runs `vendor` needs it, not app builds or hosting.

- Each app repository holds a copy of the files it uses; the drift check keeps local edits out.
- The package name follows the repository name, as support.js does.
- `vendor` and `check` need Node.js 22 or later on developer machines and in CI, and nothing else.
  family-portal has no Node.js tooling today, so its adoption task adds Node.js to its CI and devops script.

---

## Evidence
- Current consumption: [Scope, Sources, and Method](../analysis/ui-design-comparison.md#scope-sources-and-method) and [Known Facts Checked](../analysis/ui-design-comparison.md#known-facts-checked).
- Module sharing: [JavaScript Components and State](../analysis/ui-design-comparison.md#javascript-components-and-state).
- support.js publishing: its README and devops guide, read at `7738fab` on 2026-11-11, `[V:C]`.
- Sibling facts are `[V:C]`: first-party code read at the commits pinned in the comparison.
- Research context: written by Claude Opus 5.5 on 2026-11-11, knowledge cutoff June 2026, with web access to HTML pages.

---

## Sources
- `[V:C]` [Working with the npm registry][github-npm-registry]: "You need an access token to publish, install, and delete private, internal, and public packages."

[github-npm-registry]: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-npm-registry
