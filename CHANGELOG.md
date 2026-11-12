# Changelog
All notable changes to this project are documented here.

> See [change management guidelines](https://github.com/gpellicciotta/dev-guidelines/blob/main/guidelines/change-management-guidelines.md)
> for the versioning and changelog conventions used across projects.
>
> Areas: `Tokens`, `Looks`, `Components`, `Shell`, `Modules`, `CLI`, and `Template` for the package,
> plus the standard areas such as `FrontEnd`, `DevEx`, and `Docs`.

## v0.1.0-pre
- Components: Added menus and popovers with gallery sections, roving focus, type-ahead, and light dismiss.
- Modules: Added `attachMenu` in `menu.js`, `attachPopover` in `popover.js`, and RTL-aware `anchorPanel` in `anchor.js`.
- Components: Added native dialogs, responsive sheets, inline confirmations, and typed-word gallery examples with keyboard and focus management.
- Looks: Added bright with accessible accents, cascade-tested light fallbacks, system fonts, attributed glyphs, and gallery controls.
- Components: Added fields, checkboxes, radios, field groups, forms, and error summaries, with help toggles, validation states, and gallery sections.
- Modules: Added `createField` and `attachField` in `field.js`, and `attachForm` in `form.js`, with error summaries and busy states.
- Components: Fixed hidden banners, which their flex display showed.
- DevEx: Made the verifier skip controls in disabled fieldsets, and the warm season check wait for the look stylesheet.
- Components: Added cards, distinct tile sizes, and avatars with fallbacks, stacks honoring explicit sizes, and gallery specimens.
- Looks: Added warm with seasonal accents, self-hosted fonts, its glyph sprite, gallery controls, and a complete look template.
- Template: Added optional role mappings, variant examples, and complete token and core glyph contract checks.
- Components: Added empty states with up to two actions and container-responsive row layouts with keyboard-accessible trailing actions.
- Components: Added the link button with five states, accessible targets, source underline spacing, gallery specimens, and browser coverage.
- Components: Added the button, icon button, chip, segmented control, and banner, with the global focus ring and gallery sections.
- Components: Added the `.icon` class with three sizes, the `createIcon` builder, the neutral sprite, and sprite checks in the tests and verifier.
- FrontEnd: Added the visual style gallery with look and theme switchers, specimens of every token group, and the [visual style guide](docs/specs/visual-style-guide.md).
- DevEx: Added the browser verifier for status, loading, errors, overflow, contrast, targets, and focus, and widened desktop tests to 1440 px.
- DevEx: Added the GitHub Packages publish workflow for published releases, documented the release flow, and declared the changelog areas.
- CLI: Added `vendor` and `check` commands, with a hashed package manifest, the `design.json` pin, and integrity and conformance checks.
- FrontEnd: Added flat translation catalogs, parameter interpolation, and scoped translation of text, accessibility labels, tooltips, and placeholders.
- FrontEnd: Added shared base tokens, a machine-readable contract, the neutral look, self-hosted Inter, and contrast and conformance checks.
- DevEx: Added npm tooling, isolated tests with automatic browser-server ports, a static server, bootstrap automation, and continuous integration.
- Docs: Accepted the ADRs, roadmap, and specifications after review round 2, renaming three ground tokens.
- Docs: Recorded the decisions on look names, `data-accent` variants, per-look sprites, shape details, and the copy step in the ADRs.
- Docs: Revised the eight ADRs and the [roadmap](docs/roadmap.md) after review round 1, and added the [component catalog](docs/specs/components.md) and [naming conventions](docs/specs/naming.md).
- Docs: Added [devops.py](scripts/devops.py) with a one-command release, excluded `CHANGELOG.md` from `lint-markdown`, and required Python 3.15.
- Docs: Updated to dev-guidelines v2.0.0: restructured [devops.md](docs/devops.md), added agent instructions to [AGENTS.md](AGENTS.md), and required support.python v3.1.0 for `lint-markdown`.
- Docs: Added eight architecture decision records and the [roadmap](docs/roadmap.md) for building and adopting the design system.
- Docs: Added the [UI design comparison](docs/analysis/ui-design-comparison.md) of five sibling apps, from tokens to app shells.
- Docs: Created the project with its requirements, documentation index, and planning store.
