# Changelog
All notable changes to this project are documented here.

> See [change management guidelines](https://github.com/gpellicciotta/dev-guidelines/blob/main/guidelines/change-management-guidelines.md)
> for the versioning and changelog conventions used across projects.
>
> Areas: `Tokens`, `Looks`, `Components`, `Shell`, `Modules`, `CLI`, and `Template` for the package,
> plus the standard areas such as `FrontEnd`, `DevEx`, and `Docs`.

---

## v0.2.0-pre
- Components: Gave banner actions one spacing step to the top, bottom, and end borders, wrapping them below multiline text.
- Components: Put labeled row actions on the row text's first baseline, and ended row actions at the row's end edge.
- Components: Added `.card__actions`, which flows static card buttons to the end edge instead of stretching them.
- Components: Colored the error summary title with the danger color and its links with the text color.
- Shell: Padded the top bar like the main area, so its title and content text share a start edge at every width.
- Shell: Pulled the top bar's first and last icon buttons outward by their glyph inset, so glyphs align with content.
- Looks: Redrew `icon-more` as vertical dots in every look's sprite.
- Docs: Moved the toolbar demo's overflow menu button to the end of the top bar.
- DevEx: Paused the page clock in the form spec's pending-check edit test, so a slow run cannot settle the old check early.
- DevEx: Paused the page clock in the form spec's submit-time check test, so the address is cleared before the send.
- Looks: Added 16, 48, and 96 px app icons, apple touch icons, and maskable install icons on opaque plates.
- Looks: Left the app icons out of releases, so `vendor` no longer copies every app's icons into each app.
- Docs: Documented the app icon styles, files, and adoption, and embedded the Lucide notice in the todos icon.
- DevEx: Declared the Pillow dependency of the app icon generator.
- Components: Dropped the border of read-only fields and inset field messages to align with the control's text.
- Components: Kept field rows at their natural height, so status and error lines sit one small step below the control.
- Components: Indented field group content from its legend, and gave selects a chevron inset like the collapsible's.
- Docs: Added a [Select section](src/demo/visual-style-gallery.html#select) to the gallery with every select state.
- Components: Gave link buttons side padding, and made badges smaller and lower with corners at least as round as controls.
- Components: Lowered switch tracks by 2 px and rounded them by one border width, keeping the thumb concentric.
- Components: Separated segmented options by a full spacing step and drew their focus glow inside, so outlines never touch.
- Components: Restyled tabs with top-only rounded corners and a straight primary bar on the divider, with inset focus.
- Components: Replaced the focus outline with a glow, a solid contour plus a soft halo, keeping a transparent outline for forced colors.
- Tokens: Added the `--focus-glow`, `--focus-glow-inset`, `--focus-glow-danger`, and `--focus-glow-danger-inset` base tokens.
- Components: Drew menu focus inside each item and widened menu side padding, so focus clears neighbors and borders.
- DevEx: Made the browser verifier check glow contours at 3:1 against their ground and their halo.
- Looks: Added app icons for the planned quiz, stocks, calories, time, tools, and demos apps in all four styles.
- Looks: Added the shared hexagon app icons in four styles as SVG, PNG, and ICO, with a generator script and an [icon gallery](src/demo/app-icon-gallery.html).
- Looks: Refreshed the neutral look with slate grays and a brighter blue accent, keeping every contrast pair at AA.
- Docs: Recorded the Narrator and Edge check of the tooltip, which announces its name, role, and description once each.
- Components: Sized the account menu's small avatar inside its round button, which it overhung by 2 px per side.
- Docs: Rewrote source comments that named sibling apps as generic rationale, keeping license notes.
- Components: Added `.detail-panel`, bordered `.list--facts` and `.list--compact` rows, `.chip--status` variants, and the [admin console demo](src/demo/shell-admin-console.html).
- Components: Added the filter `.toolbar`, `.pager`, bordered `.table__frame`, and table row hover and `aria-selected` states with gallery specimens.
- Components: Gave switches rounded-rectangle tracks with `--radius-control` and concentric thumbs instead of elliptical `50%` tracks.
- Docs: Planned auth's move to the neutral look, with an Admin Console rebuilt after ToDo's console.
- Template: Added the `generate-app` devops action, which creates an offline-ready app per look and shell options with a vendored design system.
- DevEx: Made browser verification wait for complete look stylesheet loads before inspecting rendered pages.
- Shell: Renamed demos to list editor, toolbar, single screen, and portal examples, with descriptive gallery links.
- Docs: Explained component purposes, look choices, and shell layouts without requiring knowledge of existing applications.
- Shell: Spanned the top bar and the action bar over every wide column, with the sidebar and side panel between them.
- Shell: Added the `app__nav-toggle` hamburger, which cycles the wide sidebar through open, an icon rail, and hidden.
- Shell: Opened the sidebar as a drawer under the top bar below 64rem, with a backdrop, Escape, and focus return.
- Modules: Added `attachAppNav` in `app-nav.js`, which drives the nav toggle through `aria-expanded`, `hidden`, and the popover state.
- Looks: Added the core `icon-nav-menu` glyph, three horizontal lines, to every look's sprite.
- Docs: Moved the admin console demo's brand into the top bar and its page title into the content heading.

## v0.1.0 [released: 2026-11-13]
- Modules: Shared field, form, and toast announcements through one polite live region per document.
- Modules: Added app-scoped theme preferences and user-controlled worker updates, including reload prompts after activation in another tab.
- Components: Added native checkbox multi-select with Shift ranges, mixed select all, announced counts, and bulk action events.
- Components: Added accessible tooltips with focus, hover, Escape dismissal, reversible controllers, and a fallback for unavailable popover methods.
- Components: Added labeled native progress bars and decorative status spinners that stay static under reduced motion.
- Components: Added non-interactive badges for counts and labeled statuses, with neutral, success, warning, and danger tones.
- Components: Added native lists, description pairs, and captioned data tables with scoped headers and contained keyboard-accessible scrolling.
- Components: Added the floating action button with accessible states, gallery specimens, and shell overlay placement above bottom bars.
- DevEx: Synchronized gallery look checks with stylesheet loading and color transitions before measuring dimensions and accent colors.
- Components: Added accessible tabs with automatic activation, arrow navigation, disabled states, reversible enhancement, and responsive gallery specimens.
- Components: Added accessible native switches with keyboard support, system-palette focus, disabled and invalid states, and position-based state cues.
- Components: Added loading feedback with polite status, busy content regions, and static skeleton rows for slow lists.
- Components: Added the collapsible and the account menu, with initials or person icon, current route mark, and gallery sections.
- Modules: Added `attachCollapsible` in `collapsible.js`, `attachAccountMenu` and `initialsOf` in `account-menu.js`, and `align` to `attachMenu`.
- Shell: Added `shell.css` with optional areas, both scroll modes, width options, safe-area padding, and a skip link.
- Shell: Added demo pages for the todos.webapp, counters, meteo, and family-portal setups, linked from the gallery.
- Components: Moved the fixed position of the toast region into `shell.css`, the only stylesheet with fixed or sticky positions.
- DevEx: The browser verifier checks the shell demo pages and waits for color transitions before measuring contrast.
- Components: Added toasts with Undo, persistent toasts, Ctrl+Z, modal holding, and a gallery section with a working toaster.
- Modules: Added `createToast` in `toast.js`, with a deprecated `createToaster` alias, and `createLiveRegion` in `live-region.js`.
- Components: Added menus and popovers with gallery sections, roving focus, type-ahead, and light dismiss.
- Modules: Added `attachMenu` in `menu.js`, `attachPopover` in `popover.js`, and RTL-aware `anchorPanel` in `anchor.js`.
- Components: Moved menus and popovers from `hidden` to the native `popover` attribute, with top layer and light dismiss.
- Modules: `attachPopover` and `attachMenu` add `popover="auto"` and the trigger link, keeping `anchorPanel` placement.
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
