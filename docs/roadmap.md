# Roadmap
Phases, entry and exit criteria, and adoption order for building and adopting the design system.
The decisions behind each phase are in the [ADRs](adrs/ADR-0001-layer-model-and-token-contract.md), numbered 0001 to 0008.

- Status: Proposed, awaiting approval in the review of the planning task.
- Date: 2026-11-11.

---

## Adoption Order
1. Extract the token contract, the `todos` look, the core components, and the shell from todos.webapp.
2. Add family-portal as the second look, which proves that the contract separates look from structure.
3. Build the generator from the two adopted apps.
4. Add the meteo look and move meteo onto the system, dropping its quiz leftovers.
5. Redesign and re-create auth and counters on the system, then retire the support.js styles.

---

## Phase 1: Foundation and the Todos Look
Entry criteria:
- The ADRs and this roadmap are approved.

Work in this repository, in the Next Milestone section of [PLAN.md](../PLAN.md):
- T0003: repository tooling, devops scripts, and CI.
- T0004: shared base tokens, the `todos` look, and the static token test.
- T0005: the gallery with look and theme switchers, and the browser verifier.
- T0006: the icon sprite format, the icon class, and the `spriteIcon` builder.
- T0007: buttons, icon buttons, banners, chips, and the segmented control.
- T0008: fields, checkboxes, radios, and `createField`.
- T0009: the dialog and its three confirmation tiers.
- T0010: toasts and the live region.
- T0011: menus and popovers, extracted as they are.
- T0012: menus and popovers on the native `popover` attribute.
- T0013: the app shell with its areas, scroll modes, and demo pages.
- T0014: the `vendor` and `check` commands with the package manifest.
- T0015: the publish workflow and the release flow.
- T0016: the empty state and the row base.
- T0026: the collapsible and the account menu.
- T0027: the theme switch and service worker update modules, and the shared pattern docs.

Work in todos.webapp, as a backlog task created there after approval:
- Vendor the first release, apply the renames of ADR-0001, and move the shell onto `shell.css`.
- Search for every renamed token afterwards, so no `--space-8` silently shrinks.
- Keep app-local components, such as task rows, in todos.webapp.

Exit criteria:
- Every Phase 1 task is complete, and the user has approved and published the first release.
- todos.webapp runs on its vendored copy, passes the conformance check, and passes the lossless switch proof.

---

## Phase 2: The Family-Portal Look
Entry criteria:
- Phase 1 is complete.

Work in this repository, in the Backlog section:
- T0017: the `family-portal` look with seasons, its glyph set, and the look template.
- T0018: cards, tiles, and avatars.
- T0019: an accessible switch.
- T0020: the loading pattern.
- T0021: the i18n module and catalog format.

Work in family-portal, as backlog tasks created there after approval:
- Vendor the release into `webapp/vendor/design/` and move templates and Java widgets to the external sprite.
- Add Node.js to its CI and devops script, so the conformance check runs there.
- Render the top bar from one server template partial in the shell's markup.
- Move `{{t:key}}` templates to `data-i18n` attributes, and measure the delay before translation.
- Replace the box-shadow focus ring with the shared outline.

Exit criteria:
- Both looks pass the token test and the browser verifier.
- family-portal passes the conformance check and the lossless switch proof, apart from listed deliberate changes.

---

## Phase 3: Generator
Entry criteria:
- Phase 2 is complete, so the template copies markup proven in two apps.

Work in this repository:
- T0022: the `create` command and the starter app template.

Exit criteria:
- An app generated for each look passes its own checks and the conformance check.

---

## Phase 4: Meteo
Entry criteria:
- Phase 3 is complete.

Work in this repository:
- T0023: the `meteo` look with its accent variant and AA contrast on every accent.
- T0024: the tooltip component, after a screen reader check.

Work in meteo, as backlog tasks created there after approval:
- Drop the quiz leftovers: unused icons, classes, and tokens.
- Vendor the release and move the three screens into the shell with `app--scroll-page` and `app--width-narrow`.
- Gain reduced-motion handling and visible focus rings through the shared components.

Exit criteria:
- meteo passes the conformance check and the lossless switch proof, apart from listed deliberate changes.
- The listed changes include dark text on the yellow accent, if the user confirms that reversal.

---

## Phase 5: Auth and Counters
Entry criteria:
- Phase 4 is complete.

Work in this repository:
- T0025: the redesign plan for auth and counters, and the sibling tasks it proposes.

Work in auth, counters, and support.js, as backlog tasks created there after approval:
- Re-create both apps on the system, with no support.js stylesheets left.
- Retire the support.js stylesheets once no app loads them.

Exit criteria:
- auth and counters run on the system and pass the conformance check.
- support.js ships no stylesheets.

---

## Lossless Switch Proof
Each adopter phase proves that switching to the system changes nothing by accident:
- Screenshots of the app's main pages at 390 and 1440 px, light and dark, before and after the switch.
- A snapshot of computed styles of key elements, before and after.
- Every difference listed in the adoption task, as either a fix or a deliberate change.

[ADR-0007](adrs/ADR-0007-documentation-and-verification.md) defines both checks; pixel diffs are out of scope.

---

## Release Flow
- Every release follows [ADR-0005](adrs/ADR-0005-distribution-and-versioning.md): a GitHub Release publishes the package.
- Publishing a release is an outbound step and needs the user's approval each time.
- Each release gets one backlog task per consuming app, created after the user approves.
