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

Gaps:
- ADR-0005 says the check fails against "the pin" but never defines the pin. Presumably it is the `version` in `design.json`.
- The manifest travels with the copy, so an edit to a file and to its manifest entry passes the hash check.
  The check catches accidental edits, not deliberate ones. This is Claude's inference, not stated in the ADRs.

Proposed change, for round 2:
- Define the pin, and state whether deliberate manifest edits are in scope.
- Add one "Conformance check" section to ADR-0007 that lists what it checks and when it runs.

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

Claude's lean: the vendored `check.py`. Every consumer already runs Python in CI, and the check is small.
The token test and browser verifier stay in JavaScript inside this repository, since they never reach the apps.
The user decides.

Proposed change, for round 2:
- Record the chosen language of the check as a decision, and list the other options in ADR-0007.
- If Python wins, update ADR-0005 (the Node.js consequence) and T0014 and the family-portal adoption task.
