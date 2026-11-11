# Requirements
Goals, scope, and constraints of the shared web design system and app template.
Each requirement has a stable identifier, such as `DS-3`, for tasks and decisions to cite.

---

## Goals
- DS-1: Document every aspect of a design, from tokens to components, patterns, and app shells.
- DS-2: Generate the boilerplate of a new web app from a chosen look and shell.
- DS-3: Let existing apps find and adopt design improvements through versioned releases.
- DS-4: Support several looks, and allow new looks to be added over time.

---

## Design Aspects
The system covers three levels of design:
- Low level: fonts, colors, spacing, borders, radii, shadows, motion, and icons.
- Middle level: lists, multi-select and bulk delete, toasts, notifications, context menus, dialogs, and forms.
- High level: main screen layout, headers and header bars, sidebars, navigation, and dialog placement.

Each aspect appears in code as CSS, JavaScript, and HTML element hierarchies.
The system documents all three for every component and pattern.

---

## Scope
- DS-5: First adopters are todos.webapp, family-portal, and meteo.
- DS-6: Auth and counters stay out of scope for now.
  Both will be redesigned and re-created on this system later.
  They still serve as reference material for the comparison.

---

## Constraints
- DS-7: Follow the dev-guidelines UI guidelines, including the style sheet, gallery, and style guide files.
- DS-8: Work for apps without a build step, which serve their source folder as the web root.
- DS-9: Work for pages rendered on a server, such as the Java-rendered family-portal pages.
- DS-10: Apps consume the shared system as a pinned, versioned dependency, never as hand-copied files.
- DS-11: Never modify a sibling repository from this project; record work for it as tasks there.

---

## Architecture Decisions
The architecture decision records turn these requirements into a design:
- [ADR-0001](adrs/ADR-0001-layer-model-and-token-contract.md): three token tiers, a shared base, and look-owned values.
- [ADR-0002](adrs/ADR-0002-looks.md): looks as folders with primitives, mapping, fonts, and a sprite.
- [ADR-0003](adrs/ADR-0003-components-and-patterns.md): look-neutral components in the light DOM, and shared patterns.
- [ADR-0004](adrs/ADR-0004-app-shell.md): one app shell with optional areas and options, and no router.
- [ADR-0005](adrs/ADR-0005-distribution-and-versioning.md): one package on GitHub Packages, vendored into each web root.
- [ADR-0006](adrs/ADR-0006-generator.md): a `create` command for one-time boilerplate.
- [ADR-0007](adrs/ADR-0007-documentation-and-verification.md): one gallery, static and browser checks, and app conformance.
- [ADR-0008](adrs/ADR-0008-repository-layout.md): `src/` as the web root of the package and the gallery.

The [roadmap](roadmap.md) sets the phases and the adoption order.
