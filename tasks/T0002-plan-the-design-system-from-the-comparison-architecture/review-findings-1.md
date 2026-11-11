# T0002 Review, Round 1 (draft)

Status: open. Findings are collected during the human review; no verdict is recorded yet.
The YAML frontmatter that `plan` requires (`verdict`, `reviewer`, `reviewed_at`) is added when the user records the verdict.
Source: the user's review remarks (`@giova`), with Claude's clarifications written as answers under each finding.
Scope: `docs/adrs/ADR-0001` to `ADR-0008`, `docs/roadmap.md`, and the tasks T0003 to T0027.
A second round works through these findings.

---

## F1. ADR-0008: why ship the source layout?
- Source: user question.
- Severity: should-fix. The ADR states the decision but not the alternative that the question targets.

Answer:
- ADR-0008 says the package ships files as they are, so the source layout is the shipped layout.
- Browsers run CSS, JavaScript, and HTML directly, so a copy of `src/` is a valid package.
- The reason for no build step is that the apps have none (DS-8, DS-9), and the gallery serves the same files.
- Neither ADR-0005 nor ADR-0008 lists a build step as an alternative.

Proposed change, for round 2:
- Add a "Build step" entry to the Options Considered of ADR-0008, covering the options in F2.

## F2. A build step that copies `src/` to `dist/`
- Source: user question.
- Severity: should-fix.

Correction to an earlier Claude answer:
- Claude said a build step would break DS-8 and DS-9. That was wrong.
- DS-8 and DS-9 require that the apps need no build step.
- A build step inside support.webapp is invisible to the apps, since they receive files through `vendor`.

Why a copy step is possible:
- Nothing in the requirements forbids it.
- The cost is a moving part in this repository: a `build` script, and a rule on which folder the gallery and e2e tests serve.

Effect on consumers of a plain copy:
- None. The files, paths, and bytes are identical, so the manifest, hashes, `vendor`, and `check.mjs` behave the same.
- `npm pack` would ship `dist/` instead of `src/`; consumers never see that name.

Effect on consumers of a later minify-and-bundle step:
- Partial files such as `components/button.css` disappear when bundled. Apps that import them directly break.
- Service workers in the apps precache individual vendored files, and the starter template lists them. Changed file lists break that.
- Apps that import JavaScript modules by path, such as `js/toast.js`, break if the bundle drops those entry points.
- Minified code is hard to debug unless source maps ship too.
- Class names, token names, and exported function names normally survive minification, so the contract itself stays intact.
- The gallery and e2e tests must then serve `dist/`, because the shipped bytes differ from `src/`.

Gap in ADR-0005:
- Its breaking-change rules name tokens, classes, markup, module functions, and icon ids, but not file paths or entry points.
- A later bundle would be a breaking change that the rules do not recognize.

Proposed change, for round 2:
- Decide whether to add the copy step now. It is cheap insurance only if the next change also happens.
- Declare the public contract: the entry points `css/style.css`, `looks/{look}/index.css`, and `js/{module}.js`, with every other file private.
- Add file paths of entry points to the breaking-change rules of ADR-0005.

## F3. ADR-0005: why "vendor" and not a library?
- Source: user question.
- Severity: should-fix. The ADR never explains the term.

Answer:
- support.webapp is a library in the packaging sense: versioned, published, and pinned.
- It differs in how apps consume it.
  - A Java or Python library is resolved by the build tool, and its files stay out of your repository.
  - Vendoring copies the library files into the app's source tree, and the app commits them.
- The apps need vendoring because they have no build tool to resolve a dependency, and a browser can only load files under the web root.
- `npm install` puts files in `node_modules`, outside the web root, which the apps' servers do not expose.
- A committed copy can be edited by hand, so `check.mjs` verifies each file against the manifest hashes.
- The nearest Java analogy: copy a dependency's resources into `src/main/resources`, commit them, and add a checksum test.
- The nearest Python analogy: pip's own `_vendor` folder.

Proposed change, for round 2:
- Add a Context bullet to ADR-0005 explaining vendoring and why apps cannot resolve dependencies.
- Use "library" for the package and "vendoring" only for the copy step.

## F4. ADR-0008 and ADR-0002: looks must not carry app names
- Source: user remark.
- Severity: must-fix. The names contradict the goal that looks apply to several apps.

Facts:
- The planned looks are `todos`, `family-portal`, and `meteo`, each named after its first adopter.
- The names appear in `ADR-0002`, `ADR-0008`, `docs/roadmap.md`, and tasks T0002, T0004, T0017, and T0023.
- `ADR-0008` uses the path `src/looks/todos/`, and the `vendor` command takes `--look {look}`.

Requested direction:
- Name looks after their character, so several apps can share them.
- An app with a one-off appearance makes its own look.

Proposed change, for round 2:
- Pick a character-based name for each look. The user decides the names.
- Describe each look by its traits: for example monochrome gray with a navy signal color, or warm ivory with saffron accents.
- Document how an app keeps its own look outside the package, and confirm that `vendor` and `check.mjs` accept it.
- Rename the folder, task titles, roadmap entries, and the examples that use `--look todos`.

## F5. ADR-0005 and ADR-0007: what the vendored check does, and when it runs
- Source: user question.
- Severity: should-fix. The behavior is split over two ADRs and the word "pin" is undefined.

Answer, as the ADRs describe it. The tool does not exist yet; task T0014 builds it:
- `check.mjs` is copied into the app by `vendor`, so each app runs the version that matches its copy.
- Integrity: it hashes every vendored file and compares the hashes with `manifest.json`.
  - It fails on a changed file, a missing file, or a file the manifest does not list.
  - It fails when the version in `design.json` differs from the pin.
- Rules: it scans the app's own stylesheet folders, listed in `design.json`, for raw colors, primitive or private tokens, and deprecated names.
- Warning: it flags fixed or sticky positions outside the shell.
- It needs no network and imports nothing else.
- App CI runs it on every push. Developers run it locally with `node {{web-root}}/vendor/design/bin/check.mjs`.
- Its purpose is DS-10: copies must not drift, as auth's stale copies did.
- Two jobs: integrity of the vendored files, and conformance of the app's own stylesheets. Only the first concerns vendored code.

Gaps:
- ADR-0005 says the check fails against "the pin" but never defines the pin. Presumably it is the `version` in `design.json`.
- The manifest travels with the copy, so an edit to a file and to its manifest entry passes the hash check.
  The check catches accidental edits, not deliberate ones. This is Claude's inference, not stated in the ADRs.

Proposed change, for round 2:
- Define the pin, and state whether deliberate manifest edits are in scope.
- Describe the two jobs of the vendored tool separately in ADR-0007 (user decision, 2026-11-11):
  - Integrity: the vendored files against the manifest and the pin.
  - Conformance: the app's own stylesheets against the token rules.
- For each job, state what it checks, what fails, and that app CI runs both on every push.

## F6. ADR-0007: JavaScript or Python for the tools?
- Source: user question.
- Severity: decision needed. The ADR's only reason is "one toolchain".

Facts, checked in the sibling checkouts on 2026-11-11:
- All five apps have `scripts/devops.py`. family-portal has 29 Python files and no Node.js tooling.
- todos.webapp, meteo, auth (`webapp/`), and counters (`scripts/`) already have a `package.json`.
- ADR-0007 ports family-portal's Python browser verifier to JavaScript, so the one app that is Python-only gets a new language.
- The Node.js requirement of ADR-0005 covers `vendor` and `check`, and the adoption task adds Node.js to family-portal's CI.

Options:
- JavaScript for everything, as drafted: one toolchain with the Vitest token test and the Playwright verifier.
  Costs: Node.js in family-portal's CI, and a language that most Java and Python developers know less well.
- A stdlib-only Python `check.py` vendored beside the copy, run from each app's `devops.py`:
  - CI needs no Node.js, because only developers who run `vendor` need npm.
  - Costs: the hash and scan rules exist in Python, while the token test stays JavaScript, so a parity test is needed.
- A `design-check` tool inside support.python: Python and already installed, but its version is not pinned to the design version.
  A newer checker could reject an older vendored copy.

Decision (user, 2026-11-11): keep `check.mjs` in JavaScript. Claude's lean was a vendored `check.py`, which the user declined.
Round 2 only records the decision and the rejected options in ADR-0007; no other ADR or task changes.

Proposed change, for round 2:
- Record the decision, and list the Python options as rejected in ADR-0007.

## F7. ADR-0006: the rejected options lack real reasons
- Source: user remark.
- Severity: should-fix.

Facts:
- Copier gets one sentence: it adds a tool and template syntax, and updates can conflict.
- The GitHub template repository gets one clause: no look or shell choices and no placeholders.
- The chosen option's reason is only "the same model as the sibling templates".

What a full reason would say, for round 2:
- Copier is a Python tool that fills Jinja placeholders. Its key feature, `copier update`, re-applies later template changes to a generated project, like a merge.
  - That is exactly what the ADR's Consequences give up: every boilerplate fix becomes a hand-applied backlog task per app.
  - The ADR should weigh that loss against the cost: a second tool and language next to the Node command line tool, a new syntax, and merge conflicts in apps that edited the boilerplate.
  - Also state that Copier would have to call the Node `vendor` command after generation.
- A GitHub template repository copies a fixed set of files with the "Use this template" button.
  - It cannot take a look, a shell setup, or an app name, so every combination would need its own repository or a manual edit.
- Options the ADR does not list, suggested by Claude:
  - No generator, only a documented recipe: copy todos.webapp by hand. Cheapest, but it is how the four diverging shells arose.
  - A Python `create` in support.python, like template.python: familiar, but the template, `vendor`, and `check.mjs` are Node.

## F8. ADR-0006: the shell flags need explanation
- Source: user remark.
- Severity: should-fix. The flags are named but not defined; the meaning lives only in ADR-0004.

Meaning of each flag, for the ADR:
- `--scroll main`: the window is a fixed frame, like a Swing frame with a scroll pane in the center.
  The top bar, sidebar, and action bar stay in place, and only the main column scrolls.
- `--scroll page`: the whole page scrolls like a normal web page, and the top bar and action bar stick to the window edge while it does.
- `--nav sidebar`: a vertical menu on the left on wide screens.
- `--nav bottom`: a tab bar at the bottom on narrow screens, like Android's bottom navigation.
- `--nav menu`: a menu button in the top bar that opens the navigation.
- `--nav breadcrumb`: a trail like Home > Section > Page in the top bar.
- `--nav none`: no navigation.
- `--nav` repeats: a sidebar plus a bottom bar shows one of them at a time, split at 64rem (1024 px at the default font size).
- `--width`: centers the main column at a width token, `reading` for text, `narrow`, or `content`; without it the column fills the window.

Gaps:
- ADR-0006 gives no values for `--width` and no default for any flag.
- The other areas of ADR-0004, which are banners, action bar, side panel, and overlay layer, have no flag.
  It is unclear whether the generated shell includes them.
- ADR-0001 lists `--width-reading`, `--width-narrow`, and `--width-content` as contract tokens but gives no values.
- Today's only values are family-portal's: content 75rem (1200 px), narrow 55rem (880 px), reading 47.5rem (760 px), at the default 16 px.
  - `reading` caps a line of prose at a comfortable length; `narrow` suits forms and single-column pages; `content` is the widest page column.
- Possible mismatch: ADR-0004 gives meteo `app--width-narrow`, but meteo's own CSS caps its cards at 420 to 480 px, and one block at 640 px.
  Claude did not find which of those is meteo's main column, so the match is unverified.
- todos.webapp has one value, `--width-main` at 45rem (720 px), which maps to none of the three names.

Proposed change, for round 2:
- Add a flag table with values, default, and one line of meaning, linking ADR-0004.
- Define the three width values in ADR-0001 or ADR-0004, say which look owns them, and check meteo against them.
- Decide whether each optional area gets a flag, or the generated shell always includes all of them.
- Give the four adopter setups of ADR-0004 as example commands, or as `--preset` names.

## F9. ADR-0006: what "runs `vendor` for the chosen look" means
- Source: user question.
- Severity: should-fix. The sentence assumes ADR-0005.

Answer:
- `vendor` is the ADR-0005 command that copies the design system files into an app, into `{{web-root}}/vendor/design`.
- `create` first copies the app skeleton from `template/`, which holds the app's own files.
- It then runs `vendor`, so the new app already holds the design files: the look-neutral files, the chosen look, `manifest.json`, `check.mjs`, and a `design.json` that records the version.
- The app's `style.css` then imports the vendored look entry.
- The result is a new app that starts on a pinned, committed copy, with no second command to run.
- Skeleton and design files come from the same package version, so they always match.
- A Java analogy: generate the project and resolve its dependencies in one step, except the dependency files are committed.

Proposed change, for round 2:
- Replace the sentence with the three lines above, and name the target folder `src/vendor/design`.

## F10. ADR-0006: the generated app lacks the standard boilerplate
- Source: user question.
- Severity: should-fix.

Listed by the ADR: README, CHANGELOG, LICENSE, AGENTS.md, a documentation index, `package.json`, and a CI workflow.

Not listed, but required or customary under the project-setup guidelines:
- `CLAUDE.md`, containing only `@AGENTS.md`.
- `docs/requirements.md` and `docs/devops.md`, which are mandatory documentation files.
- `scripts/` with `bootstrap-dev-environment.py` and `devops.py`, since a web app is a code project.
- The ignore entries for `.plan/` and `PLAN.md`; the generator does not create them, because the user runs `plan init` later.
- `.gitignore`, and `.editorconfig` as in template.python.

Open design questions:
- The generator is a Node command, while `devops.py` and the bootstrap script are Python on support.python.
  The generated `scripts/requirements.txt` must pin support.python, and the template must carry the scripts.
- `git init` and `plan init`: decided in F11, the generator runs neither; the bootstrap script or the user does.
- LICENSE and the copyright owner need placeholders and flags.

Proposed change, for round 2:
- Replace the vague "project files" bullet with the full list, and state which command creates the plan store.

## F11. ADR-0006: generate the app from Python, not from the Node command
- Source: user preference, `python devops generate-app` or similar.
- Severity: decided; round 2 applies it. It changes ADR-0006 and touches ADR-0005 and ADR-0008.

Decisions (user, 2026-11-11):
- The generator is Python code, run as a devops action from a checkout of this repository at a release tag.
- The generator never runs `git init` or `plan init`.
- The generator calls the Node `vendor` command from the checkout, and the npm `create` subcommand is dropped.
- Premise of that decision: `vendor` also works directly in a project the generator did not create.
  ADR-0005 already allows this: `npx @gpellicciotta/support.webapp@{{version}} vendor --look {{look}} --to {{web-root}}/vendor/design`, which needs a GitHub Packages token.
  The generator reaches the same command from its checkout without a token. Round 2 must keep both entry points on one implementation.

Why it fits:
- Every sibling has a Python `scripts/devops.py`, and `DevopsCli` accepts extra actions, so `python scripts/devops.py generate-app {{app-name}} --look {{look}}` is feasible.
- template.python already generates its projects from Python, in `scaffold.py`.
- It removes the Node dependency for creating an app, and makes the generator match F10, where the generated app carries Python scripts.

Open questions, with Claude's lean:
- Where does the code live?
  - In this repository's `scripts/devops.py`, run from a checkout at a release tag. This matches how template.python works. Lean: this one.
  - Or as a tool in support.python, which then needs to fetch the template of a given release.
- How does the new app get its vendored copy?
  - A Python generator that runs from a checkout can call the same `node bin/cli.mjs vendor` command from that checkout. No registry token is needed, and `vendor` exists once.
  - Reimplementing `vendor` in Python gives two implementations that must produce identical manifests. Lean: do not.
- Does `create` still exist as an npm subcommand? Lean: no. Then `bin/cli.mjs` keeps `vendor` and `check`.
- `git init` and `plan init`: decided, the generator runs neither. The generated bootstrap script or the user does.

Consequences to carry into round 2:
- ADR-0006: replace the `npx ... create` command, and the flags table of F8, with the devops action.
- ADR-0008: `bin/cli.mjs` loses `create`, and `template/` need not ship in the npm package, since the generator runs from a checkout.
- ADR-0005: the CLI list shrinks to `vendor` and `check`; Node.js is still needed to run `vendor`.
- Tasks T0014 (vendor and check commands) and T0022 (the create command and starter template) change scope.
- The generator's test stays the same: create an app per look in a temporary folder and run its checks.

## F12. ADR-0001: how composability and modularity are ensured
- Source: user question.
- Severity: should-fix. The mechanisms exist, but the ADRs never state the module rules.

What exists today:
- Ownership: three token tiers with one owner each; components reference only semantic tokens.
- Isolation: component tokens are private (`--_{component}-`) and "outside the contract".
- Separation: the base and a look never overlap, and the token test fails a look that redefines a base token.
- Layout: components hold no fixed or sticky positions; only the shell sets them (ADR-0003, ADR-0004).
- Files: one partial per component, all imported by `style.css` (ADR-0008).
- JavaScript: one plain ES module per behavior, each a function returning a controller, with an injected `document` (ADR-0003).

What is not stated:
- Whether a component may use another component's classes or private tokens, such as a dialog styling its buttons.
- Whether any check enforces that. ADR-0007 scans only the app's own stylesheets for private tokens, not the package's partials.
- Whether an app can load a subset of components. `style.css` imports everything, so the package ships and loads all of them.
- Whether JavaScript modules may import each other. ADR-0003 only mentions a shared `focus.js` through the T0009 task.

Proposed change, for round 2:
- State the dependency rules: which layers may depend on which, and that a component never reads another component's `--_` tokens.
- Add a token-test rule that enforces the private-token rule inside the package.
- Say whether partial loading is supported or deliberately not.

## F13. ADR-0001: where group, role, and theme names are defined
- Source: user questions.
- Severity: must-fix. The normative lists exist only as prose in one ADR.

Findings by name type:
- Groups: the "Contract groups" list in ADR-0001 is called an "initial list" for the extraction tasks to confirm.
  - The word "group" has two meanings: the headings of that list, such as Grounds or Text, and `{group}` in the rule `--{group}-{role}`, which is the name prefix, such as `color` or `space`.
- Roles: the role names are the token names in the same list, such as `primary`, `danger`, and `surface`.
  - No rule says what makes a valid role, which variant and state words exist (`hover`, `active`, `disabled`, `-bg`, `on-`), or who may add one.
  - The only process is in "Filling a look's gaps": the extraction task adds a token and the user approves new hues.
- Themes: ADR-0001 Theming names `light` and `dark` through `data-theme`; ADR-0007 adds `system` for the gallery switcher.
  Nothing defines the set once.
- No machine-readable contract exists in the ADR-0008 layout, yet the token test must check that "every required contract token is defined".
  That test, the conformance check, the docs, and the generator all need the same list.

Proposed change, for round 2:
- Add one machine-readable contract file, for example `src/css/contract.json`, listing the required tokens, their groups, and the themes.
  Generate or verify the style guide's token tables from it.
- Define the vocabulary in one place: group, role, variant, state, theme, look, and look variant.
- Split "group" into "category" for the list headings and "group" for the name prefix, or pick one meaning.
- Add the contract file to ADR-0008 and to the token test of ADR-0007.

## F14. ADRs use single-brace placeholders; the project standard is mustache style
- Source: user question.
- Severity: should-fix.

Facts:
- ADR-0001 writes `--_{component}-`, `--{group}-{role}[-{variant}][-{state}]`, and `--color-on-{role}`.
- ADR-0002 writes `src/looks/{look}/`.
- ADR-0005, ADR-0006, and ADR-0008 use the standard form, such as `{{look}}` and `{{web-root}}`.
- The standard is mustache style with kebab-case names, as the user's guidelines require.
- Claude found no reason for the exception. The braces may have seemed natural in CSS, but the style mixes inside one set of documents.

Proposed change, for round 2:
- Rewrite every placeholder to `{{name}}`, for example `--{{group}}-{{role}}`, and search all ADRs, the roadmap, and the tasks for leftovers.
- Do the same for the placeholders that the generator and the template will use.

## F15. Where the CSS naming style is defined
- Source: user question.
- Severity: should-fix. The conventions are scattered and incomplete.

Where each convention lives today:
- Token names: the "Naming rules" of ADR-0001.
- Private component tokens, `--_{{component}}-`: the "Three tiers" bullet of ADR-0001, inline, with no rule on why the underscore.
- Class names: ADR-0003, as BEM (block, `__element`, `--modifier`) with no ID selectors.
- State: native states and ARIA attributes, plus the `.is-hover`, `.is-active`, and `.is-focus` classes for gallery specimens only (ADR-0003).
- Look and theme attributes: `data-theme` in ADR-0001, `data-season` in ADR-0002, and no stated name for the accent mechanism.
- The dev-guidelines UI guidelines do not define class naming.

Not defined anywhere:
- Prefixes for classes: whether components carry a namespace, which matters when an app mixes its own BEM classes with the package's.
- Naming of JavaScript modules, functions, events, icon ids, and files beyond what ADR-0008 shows.

Proposed change, for round 2:
- Add a "Naming conventions" section to `docs/specs/visual-style-guide.md`, or a separate `docs/specs/naming.md`, covering tokens, private tokens, classes, state, data attributes, icon ids, modules, and files.
- Link to it from ADR-0001 and ADR-0003 instead of repeating the rules.
- Decide the class prefix question explicitly.

## F16. ADR-0002: is there a shared icon set?
- Source: user question.
- Severity: decision needed. The ADR shares icon names, not drawings, and the reason against a shared set is thin.

Answer:
- No shared set of drawings. Each look ships its own `icons.svg` sprite.
- What is shared is a contract: components name icons by id, such as `icon-close`, `icon-more`, `icon-check`, and `icon-undo`, and every look's sprite must provide every id of the core set.
- The core id list does not exist yet; the icon extraction task T0006 fixes it from the shared components' needs.
- A look may add glyphs beyond the core set, and an app may add local glyphs in its own sprite.
- The sprite format, the `.icon` class, and the `spriteIcon` builder are shared (ADR-0003).

Facts from the comparison:
- todos.webapp has 29 symbols, family-portal 30 ids, and meteo 38 icons, all on a 24-unit grid in `currentColor`.
- Their stroke widths differ: 2, 1.5 in the header, and 2.2.
- The support.js lineage (auth, counters) uses Font Awesome, and is out of scope for now.

Gaps and challenges:
- The only reason against one shared glyph set is that adopters "would have to accept one drawing style".
  Since all three draw 24-unit stroke icons in `currentColor`, the differences are mostly stroke width, which `--icon-stroke` already tokenizes.
  One set means each glyph is drawn and maintained once instead of once per look.
- No check enforces that a look's sprite provides every core id. ADR-0007 lists token checks only.
- The ADRs do not say where the glyphs come from or under which license; this review did not check the three apps' icon sources.

Proposed change, for round 2:
- Decide between per-look sprites and one shared set with a per-look stroke token, and record the reasons either way.
- Add a sprite-completeness check to the token test.
- Record the origin and license of the glyphs in the style guide.

## F17. All ADRs: mark the chosen option
- Source: user remark, applies to every ADR.
- Severity: should-fix.

Facts:
- Every Options Considered section marks the choice only with the lowercase word "chosen" inside a sentence.
- Several ADRs also hold options lists outside that section, such as ADR-0008's layout choices and ADR-0003's loading and popover options.

Proposed change, for round 2:
- Mark the selected option of every option list with `**[Chosen]**`, and the user's explicit decisions with `**[Decided]**` where the user decided.
- Put the marker at the start of the option, so it is visible when scanning.
- Apply the same rule to every new ADR.

## F18. ADR-0003: list all controls the system provides at minimum
- Source: user question.
- Severity: must-fix. The ADR lists what the apps already have, not a deliberate minimum catalog.

Facts:
- ADR-0003 has a "First component set", grouped by theme, with the reference implementation of each item.
  It is an extraction inventory: it holds what todos.webapp, family-portal, and meteo already built, plus the switch and the loading pattern as new designs.
- The list does not name common controls that a generated app (DS-2) needs, such as a text input, textarea, select, tabs, table or data list, badge, progress or spinner, link, and pagination.
  The `createField` item may cover inputs, but the ADR does not say which input types.
- The comparison reports that both new systems lack multi-select; the ADR does not decide whether it is in or out.
- The ADR gives no variants, states, or sizes per component, so "done" for each task is unclear.
- The mapping to tasks lives only in the roadmap.

Proposed change, for round 2:
- Add a component catalog as a table in `docs/specs/components.md`, linked from ADR-0003, with these columns:
  - Component.
  - Category: control, container, feedback, overlay, identity, or icon.
  - Source: extract from an app, or new design.
  - Status: in the first set, planned later, or out of scope, each with a reason.
  - Required variants and states.
  - Accessibility minimum: native element, keyboard, and ARIA.
  - Owning task.
- Decide for each missing control above whether it is in the first set, later, or out.
- Make the gallery sections and the token test iterate over this catalog, so a component cannot ship without a gallery section.
- Draft of the catalog, written by Claude on 2026-11-11: `component-catalog-draft.md` in this task folder, with six questions for the user.

## F19. Components and shells must define their HTML, and one name must link HTML, CSS, and JavaScript
- Source: user remark, 2026-11-11.
- Severity: must-fix. ADR-0003 and ADR-0004 mainly specify CSS and behavior.

Facts:
- ADR-0003 says the markup contract is "documented per component in the style guide and the gallery", but no ADR or catalog lists it.
- ADR-0004 gives one skeleton with every shell area, not the markup of the option combinations that adopters use.
- Nothing states how a component's HTML class, CSS file, JavaScript module, gallery section, and tests share one name.
- Today's names drift: `createToaster` against `.toast`, `createField` against `.field`, and `spriteIcon` against `.icon`.

Proposed change, for round 2:
- Give every catalog row a normative HTML skeleton, with its classes, parts, variants, hooks, and ARIA.
  The same applies to every shell option combination in ADR-0004.
- Define one kebab-case component key and derive every name from it, as the table in `component-catalog-draft.md` proposes.
- Enforce the link in the token test: each catalog key needs a CSS partial, a gallery section, and a markup skeleton.
- Put the naming rule in the naming conventions of F15, and link ADR-0003 and ADR-0004 to it.
