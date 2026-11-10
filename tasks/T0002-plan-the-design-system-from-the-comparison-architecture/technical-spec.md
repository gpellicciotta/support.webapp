# T0002 Technical Specification
Decision areas, roadmap contents, and task creation rules for the design system plan.

---

## Inputs
- The T0001 comparison at `docs/analysis/ui-design-comparison.md`.
- [requirements.md](../../../docs/requirements.md): goals DS-1 to DS-4 and constraints DS-7 to DS-11.
- The dev-guidelines ui-guidelines, especially the rules for projects reusing a shared system.

---

## Decided in the Design Conversation
- **[Decided]** The project lives in its own repository, `template.webapp`, not inside support.js.
- **[Decided]** The system supports several looks, and new looks get added over time.
- **[Decided]** First adopters are todos.webapp, family-portal, and meteo.
- **[Decided]** Auth and counters get redesigned and re-created on the system later, not in this plan's first phase.

---

## Decided on the T0001 Open Questions
Decided with the user on 2026-11-10; each ADR records these choices and their rejected options.
- **[Decided]** Token values: one shared base for space, motion, layers, and widths.
  Each look overrides only palette, fonts, radii, and type steps.
- **[Decided]** Radius naming: components use role tokens such as `--radius-control` and `--radius-card`.
  Each look maps the roles to its own scale steps.
- **[Decided]** Consumption: a versioned package, copied into each web root by a script.
  A check fails when the copy drifts from the pinned release.
- **[Decided]** Behavior modules: CSS, sprite, and JavaScript ship together in that package as ES modules.
- **[Decided]** Icons: family-portal templates, Java widgets, and JavaScript helpers move to the shared external sprite.
- **[Decided]** Shells: one shell, documented as markup and CSS, with no shared router or shell script.
  Optional areas: top bar, navigation, banners, action bar, side panel, and overlay layer.
  Options: scroll owner (main column or page), navigation (sidebar, bottom bar, menu, breadcrumb, none), and width.
  todos.webapp, counters, meteo, and family-portal all fit it with different options.
- **[Decided]** Loading: `aria-busy` plus a polite status line as the baseline.
  Skeletons only for slow lists, with reduced-motion handling.
- **[Decided]** Popovers: the native `popover` attribute, with the todos.webapp JavaScript anchoring for placement.
- **[Decided]** Internationalization: client-side `data-i18n` attributes, as in meteo.
  Open for the ADR: family-portal's server-filled `{{t:key}}` pages migrate or stay an app-local exception.
- **[Decided]** meteo adopts last and drops its quiz leftovers during that migration.
- **[Decided]** Auth and counters move fully onto the system at their redesign; support.js CSS then retires.
- **[Decided]** Verification: ship the todos.webapp static token test and a browser verifier based on family-portal's.
  Pixel-diff visual regression is out of scope.

---

## Decision Areas
Write one ADR per area as `docs/adrs/ADR-{{nnnn}}-{{slug}}.md`.
Each ADR lists options, trade-offs, the recommendation, and links to comparison evidence.

Layer model and token contract:
- Which tokens form the shared contract, and which stay private to a look.
- Naming rules, tiers, and the deprecation path for renamed tokens.

Looks:
- What a look contains: primitive palette, semantic mapping, fonts, icon set, and density.
- How an app selects a look, and how a new look gets added and verified.
- Which looks come first; candidates are one from todos.webapp and one from family-portal.
- Whether meteo adopts an existing look or gets its own.

Components and patterns:
- The markup contract per component: element hierarchy, class naming, and ARIA.
- The JavaScript approach; candidate: light DOM, native elements, progressive enhancement.
- When a component becomes shared; candidate: once a second app needs it.

App shell:
- One shell with optional areas and options, as decided above.
- Its markup, responsive behavior, both scroll modes, and the areas and options each adopter uses.

Distribution and versioning:
- Package format and registry.
- How apps without a build step consume it, and how Java-served apps do.
- Semantic versioning rules, breaking changes, and changelog sections.
- How a release reaches each app; candidate: a backlog task per consuming app.

Generator:
- Tool choice; candidates: an own scaffold command like template.java, or Copier with its update command.
- What it generates, and how later template changes reach generated apps.

Documentation and verification:
- One gallery with a look and theme switcher, and the structure of the shared style guide.
- Contrast, raw color, target size, and focus checks in this repository, without pixel diffs.
- A conformance check that each app runs against its pinned version.

Repository layout:
- Folder structure of this repository for tokens, looks, components, shells, gallery, docs, and generator.
- The `scripts/` folder with `bootstrap-dev-environment.py` and `devops.py`.

---

## Roadmap
Write `docs/roadmap.md` with phases, entry and exit criteria, and adoption order.
Each adopter phase proves a lossless switch: gallery screenshots before and after match.
Candidate order, to confirm or change:
1. Extract the token contract, first look, and controls from todos.webapp.
2. Add family-portal as the second look, to prove the contract separates look from structure.
3. Build the generator from the two adopters.
4. Move meteo onto the system.
5. Redesign and re-create auth and counters on the system.

---

## Task Creation Rules
- Create first-phase tasks in the Next Milestone section; later phases go to Backlog.
- Each task passes the sizing gates, names its declared files, and names its completion check.
- Code tasks include `### Tests` with unit and integration scenarios, plus TDD steps.
- Create backlog tasks in sibling repositories only after human approval of the plan.
- Use `plan tasks create --project {{path}} --section Backlog` for sibling repositories.

---

## Declared Files
- `docs/adrs/ADR-{{nnnn}}-{{slug}}.md` (new, one per decision area, up to 8 files)
- `docs/roadmap.md` (new)
- [requirements.md](../../../docs/requirements.md)
- [index.md](../../../docs/index.md)
- [CHANGELOG.md](../../../CHANGELOG.md)

Size estimate: 12 files, 900 lines
Size note: Documentation-only planning; one ADR per decision area keeps each decision reviewable on its own.

### Tests
- Unit test: none (documentation-only task without code)
- Integration test: none (documentation-only task without code)

Completion check: `lint-markdown check docs CHANGELOG.md`, from support.python v2.0.0 or later
