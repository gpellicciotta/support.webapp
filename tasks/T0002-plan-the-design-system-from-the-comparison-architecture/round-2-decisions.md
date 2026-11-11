# T0002 Round 2: Shared Decisions for the Revision
Working sheet for revising the ADRs and docs after the rejected round 1.
Every revised document applies these choices, so the set stays consistent.
Findings F1 to F20 are in [review-findings-1.md](review-findings-1.md).

---

## Conventions for Every Revised Document
- Placeholders use mustache style with kebab-case names: `{{look}}`, `{{key}}`, `{{web-root}}` (F14).
- Every option list starts the selected option with `**[Chosen]**` (F17).
- A choice the user made carries `**[Decided]**` and the date, such as `**[Decided]** with the user on 2026-11-11`.
- A choice still waiting for the user carries `**[Feedback Needed]**` and states the recommendation.
- Every rejected option states why it lost, in one or two sentences (F7).
- Status line of each ADR: `Proposed, revised after the rejected review round 1 of the planning task.`
- US English, sentences of at most 20 words, padded Markdown tables, and links instead of repeated text.

## Names
- Looks get character names, not app names (F4). Proposed names, marked `**[Feedback Needed]**` in ADR-0002:
  - `neutral`: monochrome grays with one navy signal color and Inter, extracted from todos.webapp.
  - `warm`: navy and ivory with saffron and brick accents, Outfit and DM Sans, pill buttons, from family-portal.
  - `bright`: the system font stack with a user-picked blue, yellow, or red accent, from meteo.
- Paths become `src/looks/neutral/`, `src/looks/warm/`, and `src/looks/bright/`; examples use `--look neutral`.
- An app with a one-off appearance keeps its own look folder in its own repository, built from `_template`.
  `vendor` copies only package files, and `check.mjs` ignores the app's own look folder, listed in `design.json`.
- Themes are `light`, `dark`, and `system`; `system` means no `data-theme` attribute.
- Look variants keep `data-season` for `warm` and `data-accent` for `bright`.

## Contract and Naming
- One machine-readable contract file, `src/contract.json`, ships in the package (F13).
  It lists the required tokens with their category and group, the themes, the core icon ids, and the component keys.
  The token test, `check.mjs`, the gallery, and the style guide all read it.
- Vocabulary: a token name is `--{{group}}-{{role}}[-{{variant}}][-{{state}}]`.
  The group is the name prefix, such as `color` or `space`; the list headings, such as Grounds, become categories.
- Naming conventions live in a new `docs/specs/naming.md`, linked from ADR-0001 and ADR-0003 (F15).
- The component key rule is accepted (F19, decided with the user on 2026-11-11):
  - One kebab-case key per component, such as `dialog`.
  - Class `.{{key}}`, parts `.{{key}}__{{part}}`, variants `.{{key}}--{{variant}}`.
  - JavaScript hooks are `data-{{key}}-{{name}}` attributes; state is native or ARIA, never a JavaScript-set class.
  - Files `css/components/{{key}}.css` and `js/{{key}}.js`; private tokens `--_{{key}}-{{name}}`.
  - Functions `open{{Key}}`, `attach{{Key}}`, and `create{{Key}}`; `create` builds markup, then calls `attach`.
  - Gallery section `id="{{key}}"`, tests `tests/unit/{{key}}.test.js` and `tests/e2e/{{key}}.spec.js`.
  - Icon ids `icon-{{name}}`; i18n keys `{{key}}.{{name}}`.
  - todos.webapp names that break the rule get the rule's name plus a deprecated alias: `createToaster` becomes `createToast`, `spriteIcon` becomes `createIcon`.
  - `createField` moves to `js/field.js`, with `attachField` for server-rendered markup.
- Utility modules without a component key, such as `focus.js` and `live-region.js`, are allowed and listed in `naming.md`.

## Modularity Rules (F12)
- Dependency order: base tokens, then the look, then components, then the shell, then the app.
- A component partial uses only semantic tokens and its own `--_{{key}}-` tokens.
- A component nests another component only through that component's markup, such as `.button` inside `.dialog__actions`.
  It never restyles another component's classes.
- A component module imports only utility modules, or a component module named in the catalog, such as the account menu using `menu.js`.
- The token test fails on a `--_{{key}}-` token outside `css/components/{{key}}.css`, and on a selector for another component's block.
- Partial loading is not supported: `style.css` loads every component. Revisit when a measurement warrants it.

## Components (F18 to F20)
- The catalog moves to `docs/specs/components.md`, from `component-catalog-draft.md`, with the user's decisions applied.
- "First set" means the initial component set of ADR-0003, delivered across phases 1 and 2 of the roadmap.
- Decided with the user on 2026-11-11: badge, floating action button, list and data table, tabs, progress bar and spinner, and multi-select are in the first set; multi-select needs a design.
- Forms, validation states, the help toggle, the error summary, and field groups are part of T0008.
- Validation icons come from the shared sprite: `icon-alert`, `icon-check`, and `icon-help` join the core icon ids.
- Every catalog component has a normative HTML skeleton in `components.md`, and so do the four adopter shell setups.

## Icons (F16)
- `**[Chosen]**` for now: one sprite per look with a shared core id list, as drafted.
- `**[Feedback Needed]**`: one shared glyph set with a per-look `--icon-stroke` token, which draws each glyph once.
- The token test checks that every look's sprite provides every core id from `contract.json`.
- The style guide records the origin and license of each glyph set.

## Distribution and Checks (F2, F3, F5, F6)
- support.webapp is a library, versioned, published, and pinned; apps consume it by vendoring, which ADR-0005 explains (F3).
- `**[Chosen]**` for now: ship `src/` as it is; `**[Feedback Needed]**` on adding a copy step to `dist/` now (F2).
- Public entry points, whatever the build: `css/style.css`, `looks/{{look}}/index.css`, `looks/{{look}}/icons.svg`, `js/{{key}}.js`, `contract.json`, `manifest.json`, and `bin/check.mjs`.
  Every other file is private. Removing or renaming an entry point is a breaking change.
- The pin is the `version` field of the app's `design.json`; `check.mjs` fails when it differs from `manifest.json`.
- `check.mjs` has two jobs, described separately: integrity of the vendored copy, and conformance of the app's own stylesheets.
  It catches accidental edits; an edit to both a file and the manifest is out of scope.
- `check.mjs` stays JavaScript (decided with the user on 2026-11-11); Python options are listed as rejected.

## Generator (F7 to F11)
- Decided with the user on 2026-11-11: the generator is Python, run as `python scripts/devops.py generate-app {{app-name}} --look {{look}}` from a checkout of this repository at a release tag.
- It copies `template/`, fills placeholders, then calls `node bin/cli.mjs vendor` from the same checkout, without a registry token.
- It never runs `git init` or `plan init` (decided with the user on 2026-11-11).
- The npm `create` subcommand is dropped; `bin/cli.mjs` keeps `vendor` and `check`.
- `vendor` also works in any existing app through `npx @gpellicciotta/support.webapp@{{version}} vendor`, with a GitHub Packages token.
- `template/` stays in the repository and leaves the npm package.
- Flags: `--look`, `--scroll main|page` (default `main`), `--nav sidebar|bottom|menu|breadcrumb|none` (repeatable, default `none`), `--width reading|narrow|content|full` (default `full`), `--action-bar`, `--side-panel`, `--owner`, and `-o {{output-dir}}`.
  Top bar, banners, main, and the overlay layer are always generated.
- Generated files: the web root of ADR-0006, plus `README.md`, `CHANGELOG.md`, `LICENSE.md`, `AGENTS.md`, `CLAUDE.md`, `docs/index.md`, `docs/requirements.md`, `docs/devops.md`, `scripts/bootstrap-dev-environment.py`, `scripts/devops.py`, `scripts/requirements.txt`, `package.json`, `.gitignore` with the plan entries, `.editorconfig`, and a CI workflow.

## Widths (F8)
- The shared base owns the width tokens: `--width-reading` 47.5rem, `--width-narrow` 55rem, `--width-content` 75rem, from family-portal.
- meteo's column was not measured; its adoption task checks it against `narrow`, and may propose a smaller width.
