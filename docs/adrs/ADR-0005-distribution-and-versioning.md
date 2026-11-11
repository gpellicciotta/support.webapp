# ADR-0005: Distribution and Versioning
Defines the package, its public entry points, how apps vendor it without a build step, the versioning rules, and how releases reach apps.

- Status: Proposed, revised after the rejected review round 1 of the planning task.
- Date: 2026-11-11.
- **[Decided]** with the user on 2026-11-10: one versioned package, copied into each web root by a script, with a drift check.
- **[Decided]** with the user on 2026-11-11: GitHub Packages as the registry.
- **[Decided]** with the user on 2026-11-11: `check.mjs` stays JavaScript, and the npm `create` subcommand is dropped.

---

## Context
- Apps must consume the system as a pinned, versioned dependency, never as hand-copied files (DS-10).
- todos.webapp and meteo serve their source folder as the web root, with no build step (DS-8).
- family-portal serves its `webapp/` folder from a Java server (DS-9).
- support.js already publishes an npm package to GitHub Packages from a workflow on each GitHub Release.
- auth vendors stale copies of support.js styles, and counters loads support.js through an import map.

Library and vendoring:
- support.webapp is a library: versioned, published, and pinned by each app.
- A Java or Python library is resolved by the build tool, and its files stay out of the app's repository.
- The apps here have no build tool, and a browser can only load files under the web root.
- So apps vendor the library: a script copies its files into the app's source tree, and the app commits them.
- The nearest Java analogy is copying a dependency's resources into `src/main/resources`, plus a checksum test.
  The nearest Python analogy is pip's own `_vendor` folder.
- This ADR uses "library" for the package and "vendoring" only for the copy step.

---

## Decision
Package:
- One npm package, `@gpellicciotta/support.webapp`, on GitHub Packages.
- A workflow publishes it when a GitHub Release is published, as support.js does.
- It ships source files as they are: CSS, looks, sprites, fonts, ES modules, `contract.json`, and the command line tool.
- The starter template stays in the repository; the generator of [ADR-0006](ADR-0006-generator.md) reads it from a checkout.
- A `manifest.json` lists the version, the look of each file, and the SHA-256 hash of every file.

Public entry points:
- `css/style.css`, `looks/{{look}}/index.css`, and `looks/{{look}}/icons.svg`.
- `js/{{key}}.js` for each component key in the catalog, and the utility modules listed in [naming.md](../specs/naming.md).
- `contract.json`, `manifest.json`, and `bin/check.mjs`.
- Every other file, such as a component partial or a look's `primitives.css`, is private.
- Apps link or import only entry points, so a later build step can merge private files without breaking them.

Command line tool:
- `bin/cli.mjs` has two subcommands: `vendor` and `check`.
- Any app runs `vendor` from the registry, which needs a GitHub Packages token:

  ```bash
  npx @gpellicciotta/support.webapp@{{version}} vendor --look {{look}} --to {{web-root}}/vendor/design
  ```

- The generator runs the same command from a checkout as `node bin/cli.mjs vendor`, with no token.
  Both entry points run one implementation.

Vendoring:
- `vendor` copies the look-neutral files, the chosen look, `contract.json`, the manifest, and `bin/check.mjs`.
- It writes `design.json` at the app root with four fields: `version`, `look`, `target`, and `styles`.
  `styles` lists the app's own stylesheet folders, such as `src/css` or `webapp/css`, for the conformance check.
- An app with its own one-off look lists that folder in `design.json`; `check.mjs` treats it as app code.
- The app commits the copy, so static hosting, Java serving, and offline builds need no registry access.
- Java-served apps vendor into `webapp/vendor/design/`; templates and Java widgets reference `/vendor/design/` paths.
- Service workers precache the vendored entry points they use; the starter template lists them.

Pin and drift check:
- The pin is the `version` field of the app's `design.json`.
- `check.mjs` is self-contained: it holds its own hashing code and imports nothing else.
- `node {{web-root}}/vendor/design/bin/check.mjs` fails when the copy differs from its manifest.
  A changed file, a missing file, or a file the manifest does not list fails it.
- It also fails when the pin differs from the `version` in `manifest.json`.
- It catches accidental edits; an edit to both a file and its manifest entry is out of scope.
- [ADR-0007](ADR-0007-documentation-and-verification.md) describes the integrity and conformance jobs of the check.

Versioning, following the change-management guidelines:
- Versions follow Semantic Versioning from 0.1.0.
- Breaking: removing or renaming a contract token, class, markup contract, module function, or core icon id.
- Breaking also: removing or renaming a public entry point, a component key, or a `data-{{key}}-{{name}}` hook.
- While the major version is 0, a breaking change bumps the minor version and carries the breaking mark.

- Minor: new tokens, components, looks, icons, entry points, deprecations, and visible changes to a look's values.
- Patch: fixes that restore documented behavior.
- The changelog header declares the areas `Tokens`, `Looks`, `Components`, `Shell`, `Modules`, `CLI`, and `Template`.

How DS-10 is met:
- No file is copied by hand: a script copies files from one pinned release.
- The check rejects any accidental edit, extra file, or version mismatch wherever CI runs it.

Release reach:
- Each release gets one backlog task per consuming app, created with `plan tasks create --project`.
- That task runs `vendor`, the app's checks, and the screenshot comparison of [ADR-0007](ADR-0007-documentation-and-verification.md).

---

## Options Considered
Registry:
- **[Chosen]** GitHub Packages: the same release flow as support.js, with no new account.
- Public npmjs.org: rejected for now, because it adds a second release flow and account.
  It would let installs run without a token, and CDN mirrors would work.
- GitHub Release assets: rejected, because plain downloads lack npm version tooling.
  Fetching and pinning a version would become our own code.

Consumption:
- **[Chosen]** Vendoring script with a committed copy: works for static hosting, Java serving, and offline caching alike.
- A pinned CDN URL: rejected, because it adds a third-party runtime dependency and needs a public registry.
- `npm install` with an import map: rejected, because `node_modules` lies outside the web root.
  Static servers and the Java server do not expose it.

Package split:
- **[Chosen]** One package: tokens, components, and modules always match.
- Separate CSS and JavaScript packages: rejected, because their versions could drift apart.

Build step:
- **[Chosen]** for now: ship `src/` as it is, so the gallery serves the exact files that apps vendor.
- A build step that copies `src/` to `dist/`: changes nothing for apps, since files, paths, and bytes stay identical.
  It costs one more script, and the gallery and tests must then serve `dist/`.
- A later minify-and-bundle step: smaller files and fewer requests on a first visit.
  It stays non-breaking only while the public entry points keep their paths and exports.
- **[Feedback Needed]** Add the copy step now, as insurance for a later bundle, or only when a measurement asks for bundling?
  Recommendation: wait, because the entry-point contract above already keeps a later bundle non-breaking.

---

## Consequences
- Fetching a version needs a token in `.npmrc`, because GitHub Packages requires one even for public packages ([GitHub Docs][github-npm-registry]).
  Only the developer who runs `vendor` from the registry needs it, not app builds or hosting.

- Each app repository holds a copy of the files it uses; the drift check keeps accidental edits out.
- The package name follows the repository name, as support.js does.
- `vendor` and `check` need Node.js 22 or later on developer machines and in CI, and nothing else.
  family-portal has no Node.js tooling today, so its adoption task adds Node.js to its CI and devops script.
- A future bundle may remove private files, so the style guide marks every file outside the entry points as private.

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
