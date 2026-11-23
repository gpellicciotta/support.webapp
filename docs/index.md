# Documentation Index
Overview of all documentation for the `support.webapp` project.

---

## Core Documentation
- [README.md](../README.md): Project overview and current status.
- [CHANGELOG.md](../CHANGELOG.md): Versioned change history.
- [PLAN.md](../PLAN.md): Task index for planned, active, and backlog work.
- [LICENSE.md](../LICENSE.md): MIT License.
- [requirements.md](requirements.md): Goals, scope, and constraints of the design system.
- [visual-style-guide.md](specs/visual-style-guide.md): Principles, token groups, gallery, and the browser verifier.
- [components.md](specs/components.md): Component catalog with markup skeletons, statuses, and owning tasks.
- [naming.md](specs/naming.md): Naming conventions linking tokens, HTML classes, CSS files, modules, and tests.
- [app-icons.md](specs/app-icons.md): Hexagon app icon styles, files, adoption, and regeneration.
- [i18n.md](specs/i18n.md): Translation catalogs, interpolation, markup attributes, and application lifecycle.
- [neutral.md](specs/looks/neutral.md): Neutral look provenance, usage, and contract gap values.
- [warm.md](specs/looks/warm.md): Warm look, seasons, fonts, glyphs, and the look template.
- [devops.md](devops.md): Tool setup, documentation checks, versioning, releasing, plan store, and task workflow.
- [roadmap.md](roadmap.md): Phases, entry and exit criteria, and adoption order.
- [auth-redesign.md](plans/auth-redesign.md): How auth moves onto the system, with its new Admin Console.

---

## Architecture Decisions
- [ADR-0001](adrs/ADR-0001-layer-model-and-token-contract.md): Layer model and token contract.
- [ADR-0002](adrs/ADR-0002-looks.md): Looks.
- [ADR-0003](adrs/ADR-0003-components-and-patterns.md): Components and patterns.
- [ADR-0004](adrs/ADR-0004-app-shell.md): App shell.
- [ADR-0005](adrs/ADR-0005-distribution-and-versioning.md): Distribution and versioning.
- [ADR-0006](adrs/ADR-0006-generator.md): Generator.
- [ADR-0007](adrs/ADR-0007-documentation-and-verification.md): Documentation and verification.
- [ADR-0008](adrs/ADR-0008-repository-layout.md): Repository layout.

---

## Analysis
- [ui-design-comparison.md](analysis/ui-design-comparison.md): How the sibling apps implement UI design, with sharing verdicts.
- [auth-webapp-ui-audit.md](analysis/auth-webapp-ui-audit.md): Which UI and view code of Auth's webapp the package should provide.

---

## Related Projects
- [todos.webapp](https://github.com/gpellicciotta/todos.webapp): ToDo's web app, a first adopter.
- [family-portal](https://github.com/gpellicciotta/family-portal): Family space, a first adopter.
- [meteo](https://github.com/gpellicciotta/meteo): Weather forecast app, a first adopter.
- auth.server: Identity service, to be redesigned later.
- counters: Counters app, to be redesigned later.
- [support.js](https://github.com/gpellicciotta/support.js): Shared non-UI JavaScript code; v4.0.0 dropped its stylesheets and UI components.

---

## Guidelines
This project follows the cross-project [dev-guidelines](https://github.com/gpellicciotta/dev-guidelines).
The [ui-guidelines](https://github.com/gpellicciotta/dev-guidelines/blob/main/guidelines/ui-guidelines.md) define the design system rules.
