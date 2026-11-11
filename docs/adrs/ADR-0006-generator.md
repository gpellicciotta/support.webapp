# ADR-0006: Generator
Defines the tool that creates a new web app, what it generates, and how later template changes reach generated apps.

- Status: Accepted on 2026-11-12, in review round 2 of the planning task.
- Date: 2026-11-11.
- **[Decided]** with the user on 2026-11-11: an own generator; Copier is rejected.
- **[Decided]** with the user on 2026-11-11: the generator is Python, run from a checkout of this repository at a release tag.
- **[Decided]** with the user on 2026-11-11: the generator never runs `git init` or `plan init`.
- **[Decided]** with the user on 2026-11-11: the generator reuses the Node `vendor` command, and the npm `create` subcommand is dropped.

---

## Context
- The system must generate the boilerplate of a new web app from a chosen look and shell (DS-2).
- template.java and template.python each offer a `create` subcommand that copies and renames the template.
- Every sibling project runs its operations through a Python devops script in its `scripts/` folder.
- Design changes already reach apps through package releases ([ADR-0005](ADR-0005-distribution-and-versioning.md)).
  The generator only has to produce the one-time boilerplate.

---

## Decision
Command:
- The [devops.py](../../scripts/devops.py) script of this repository gains a `generate-app` action:

  ```bash
  git switch --detach v{{version}}
  python scripts/devops.py generate-app {{app-name}} --look {{look}} [options] [-o {{output-dir}}]
  ```

- It runs from a checkout at a release tag, so the template and the vendored files come from one version.
- It copies `template/`, fills the placeholders, and writes the shell markup for the chosen options.
- It then vendors the design files, as described under "Vendor step".
- It never runs `git init` or `plan init`; the developer runs both, or the generated bootstrap script does.

Flags:

| Flag           | Values                                            | Default          | Meaning                                                                     |
| :------------- | :------------------------------------------------ | :--------------- | :-------------------------------------------------------------------------- |
| `--look`       | a look name, such as `neutral`                    | required         | The look the app imports from its `style.css`.                              |
| `--scroll`     | `main`, `page`                                    | `main`           | `main` keeps the bars in place; `page` scrolls the whole document.          |
| `--nav`        | `sidebar`, `bottom`, `menu`, `breadcrumb`, `none` | `none`           | Navigation elements; repeat the flag to combine a sidebar and a bottom bar. |
| `--width`      | `reading`, `narrow`, `content`, `full`            | `full`           | The maximum width of the main column, from the width tokens.                |
| `--action-bar` | none                                              | off              | Adds the action bar for the main actions of a screen, or a footer.          |
| `--side-panel` | none                                              | off              | Adds the side panel for a detail or editor view.                            |
| `--owner`      | a name                                            | the Git user     | The copyright owner in `LICENSE.md`.                                        |
| `-o`           | a folder                                          | `./{{app-name}}` | The folder that receives the app; it must not exist.                        |

- The top bar, banners, main area, and overlay layer are always generated.
- [ADR-0004](ADR-0004-app-shell.md) defines each option; [components.md](../specs/components.md#app-shell) holds the skeletons.

Example commands for the four adopter setups of ADR-0004:

```bash
python scripts/devops.py generate-app todos --look neutral --scroll main --nav sidebar --nav bottom --action-bar --side-panel
python scripts/devops.py generate-app counters --look neutral --scroll page --nav menu --action-bar
python scripts/devops.py generate-app meteo --look bright --scroll page --width narrow --action-bar
python scripts/devops.py generate-app family-portal --look warm --scroll page --nav breadcrumb --action-bar
```

Vendor step:
- `vendor` is the command of ADR-0005 that copies the design files into an app.
- After copying the template, the generator runs `node bin/cli.mjs vendor --look {{look}} --to {{output-dir}}/src/vendor/design`.
- The new app then holds the look-neutral files, the chosen look, `contract.json`, the manifest, `check.mjs`, and `design.json`.
- Its `src/css/style.css` imports the vendored look entry.
- The app starts on a pinned, committed copy, with no second command to run.
- Running from the checkout needs no registry token; apps that exist already run the same `vendor` through `npx`.

Generated app, web root:
- `src/` as the web root, as in todos.webapp.
- `src/index.html` with the shell markup for the chosen options.
- `src/css/style.css`, which imports the vendored look entry and holds the app's own partials.
- `src/js/main.js`, a web manifest, a service worker that precaches the vendored entry points, and an offline page.
- `src/demo/visual-style-gallery.html` for local components, and `docs/specs/visual-style-guide.md`.
  The guide names the shared system, its version, and every local addition, as the ui-guidelines require.

Generated app, project files from the project-setup guidelines:
- `README.md`, `CHANGELOG.md`, `LICENSE.md`, `AGENTS.md`, and `CLAUDE.md` containing only `@AGENTS.md`.
- `docs/index.md`, `docs/requirements.md`, and `docs/devops.md`.
- A `scripts/` folder with the bootstrap script, the devops script, and a `requirements.txt` pinning support.python.
- `package.json` with the conformance check, a token test, and a browser smoke test, plus a CI workflow running them.
- `.gitignore` with the entries for `.plan/`, `PLAN.md`, and `work/`, and `.editorconfig`.
- No `.git/` and no `.plan/`: the developer creates both after generation.

Placeholders in `template/`:
- `{{app-name}}`, `{{app-title}}`, `{{look}}`, `{{owner}}`, `{{year}}`, and `{{design-version}}`.
- The generator fails when a placeholder stays unfilled.

Later template changes:
- Design changes reach generated apps through package releases and `vendor`.
- Boilerplate changes, such as service worker or CI fixes, appear under the `Template` changelog area.
  The release backlog task of each app applies them by hand.

---

## Options Considered
Tool:
- **[Chosen]** A Python `generate-app` action in this repository's devops script.
  It matches template.python's `create`, and every sibling already runs Python devops scripts.
- Copier: rejected by the user on 2026-11-11.
  Its key feature, `copier update`, re-applies later template changes to generated apps, like a merge ([Copier docs][copier]).
  That would replace the hand-applied boilerplate tasks this ADR accepts.
  It adds a new tool, Jinja template syntax unlike the sibling templates, and merge conflicts in apps that edited the boilerplate.
  It would also have to call the Node `vendor` command after generation.
- A GitHub template repository: rejected, because the "Use this template" button copies a fixed set of files.
  It takes no look, shell options, or app name, so each combination would need its own repository or manual edits.
- An npm `create` subcommand in `bin/cli.mjs`: rejected by the user on 2026-11-11.
  It ties app creation to Node.js, while the generated app's operations run on Python.
- No generator, only a documented recipe that copies todos.webapp: rejected.
  It is the cheapest, but hand copies are how the four diverging shells arose.
- A generator tool inside support.python: rejected, because its version is not tied to a design release.
  It would have to fetch the template of a given release, while a checkout at a tag has it already.

Where the vendor step comes from:
- **[Chosen]** Call the Node `vendor` command from the checkout: one implementation for generated and existing apps.
- Reimplement `vendor` in Python: rejected, because two implementations must produce identical manifests.

---

## Consequences
- Generating an app needs Python, support.python, Node.js 22 or later, and a checkout of this repository.
- Boilerplate fixes need a hand-applied backlog task per app; the changelog lists them.
- The generator comes after the two first adopters, so its template copies proven markup.
- Its test creates an app per look in a temporary folder and runs the generated app's checks.
- `template/` holds files with placeholders, so linters skip it or understand the placeholders.

---

## Evidence
- Shell markup for the template: [App Shell Layout](../analysis/ui-design-comparison.md#app-shell-layout).
- Offline and update behavior for the template: [Splash, Offline, Error Pages, Service Worker, and Install](../analysis/ui-design-comparison.md#splash-offline-error-pages-service-worker-and-install).
- Sibling templates: the READMEs of template.java at `e5840a7` and template.python at `7f08f06`, read on 2026-11-11, `[V:C]`.
- Sibling devops scripts: todos.webapp, family-portal, meteo, auth, and counters.server each have one, checked on 2026-11-11, `[V:C]`.
- Research context: written by Claude Opus 5.5 on 2026-11-11, knowledge cutoff June 2026, with web access to HTML pages.

---

## Sources
- `[V:C]` [Copier documentation][copier]: "When the template evolves, let consumers update their projects."

[copier]: https://copier.readthedocs.io/en/stable/
