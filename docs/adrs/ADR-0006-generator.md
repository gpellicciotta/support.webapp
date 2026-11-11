# ADR-0006: Generator
Defines the tool that creates a new web app, what it generates, and how later template changes reach generated apps.

- Status: Proposed, awaiting approval in the review of the planning task.
- Date: 2026-11-11.
- Decided with the user on 2026-11-11: an own `create` command; Copier is rejected.

---

## Context
- The system must generate the boilerplate of a new web app from a chosen look and shell (DS-2).
- template.java and template.python each offer a `create` subcommand that copies and renames the template.
- Design changes already reach apps through package releases ([ADR-0005](ADR-0005-distribution-and-versioning.md)).
  The generator only has to produce the one-time boilerplate.

---

## Decision
Command:
- The package's command line tool gains a `create` subcommand:

  ```bash
  npx @gpellicciotta/support.webapp@{{version}} create {{app-name}} --look {{look}} [-o {{output-dir}}]
  ```

- Shell options become flags: `--scroll main|page`, `--nav sidebar|bottom|menu|breadcrumb|none`, and `--width`.
  `--nav` repeats, so an app can combine a sidebar with a bottom bar.

- It copies `template/` from the same package version and fills the placeholders.
- It then runs `vendor` for the chosen look, so the new app starts on a pinned copy.

Generated app:
- `src/` as the web root, as in todos.webapp.
- `src/index.html` with the shell markup of [ADR-0004](ADR-0004-app-shell.md) for the chosen options.
- `src/css/style.css`, which imports the vendored look entry and holds the app's own partials.
- `src/js/main.js`, a web manifest, a service worker that precaches the vendored files, and an offline page.
- `src/demo/visual-style-gallery.html` for local components, and `docs/specs/visual-style-guide.md`.
  The guide names the shared system, its version, and every local addition, as the ui-guidelines require.

- Project files from the project-setup guidelines: README, CHANGELOG, LICENSE, AGENTS.md, and the documentation index.
- `package.json` with the conformance check, a token test, and a browser smoke test, plus a CI workflow running them.

Later template changes:
- Design changes reach generated apps through package releases and `vendor`.
- Boilerplate changes, such as service worker or CI fixes, appear under the `Template` changelog area.
  The release backlog task of each app applies them by hand.

---

## Options Considered
- An own `create` command, chosen: the same model as the sibling templates, and no new tool.
- Copier: it lets template consumers update their projects ([Copier docs][copier]).
  It adds a new tool and template syntax unlike the sibling templates, and updates can conflict.

- A GitHub template repository: no look or shell choices and no placeholders.

---

## Consequences
- Boilerplate fixes need a hand-applied backlog task per app; the changelog lists them.
- The generator comes after the two first adopters, so its template copies proven markup.
- Its test creates an app per look in a temporary folder and runs the generated app's checks.

---

## Evidence
- Shell markup for the template: [App Shell Layout](../analysis/ui-design-comparison.md#app-shell-layout).
- Offline and update behavior for the template: [Splash, Offline, Error Pages, Service Worker, and Install](../analysis/ui-design-comparison.md#splash-offline-error-pages-service-worker-and-install).
- Sibling templates: the READMEs of template.java at `e5840a7` and template.python at `7f08f06`, read on 2026-11-11, `[V:C]`.
- Research context: written by Claude Opus 5.5 on 2026-11-11, knowledge cutoff June 2026, with web access to HTML pages.

---

## Sources
- `[V:C]` [Copier documentation][copier]: "When the template evolves, let consumers update their projects."

[copier]: https://copier.readthedocs.io/en/stable/
