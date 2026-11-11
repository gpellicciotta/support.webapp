# ADR-0001: Layer Model and Token Contract
Defines the token tiers, the contract file, the shared names and vocabulary, value ownership, modularity rules, and token retirement.

- Status: Proposed, revised after the rejected review round 1 of the planning task.
- Date: 2026-11-11.
- **[Decided]** with the user on 2026-11-10: shared base values and radius role names.
- **[Decided]** with the user on 2026-11-11: one kebab-case key per component, as [naming.md](../specs/naming.md) defines.

---

## Context
- The system serves several looks over one set of components (DS-4).
- todos.webapp and family-portal already share two tiers, `light-dark()` themes, and 49 semantic names.
- Their palettes, fonts, radii, and type steps differ; space steps 1 to 7 and motion match.
- meteo shares at most 12 names with either system, and the support.js lineage at most 6.
- The same radius names hold values one step apart in the two systems.
- The round 1 review found the contract names only in prose, with no file that tests and tools can read.

---

## Decision
### Vocabulary
- Token: a CSS custom property, such as `--color-primary-hover`.
- Tier: primitive, semantic, or component; each tier has one owner.
- Group: the first segment of a token name, such as `color`, `space`, or `radius`.
- Category: a heading that gathers related contract tokens for people, such as Grounds or Text.
- Role: what a token is for, such as `primary`, `danger`, or `surface`; never what it looks like.
- Variant: a sub-role, such as `-bg` or `-strong`.
- State: an interaction state, one of `hover`, `active`, `disabled`, or `selected`.
- Theme: `light`, `dark`, or `system`; `system` means no `data-theme` attribute and follows the operating system.
- Look: one palette, font, and shape set, as [ADR-0002](ADR-0002-looks.md) defines.
- Look variant: an attribute that redefines some of a look's semantic tokens, such as `data-season`.

### Three tiers, each with one owner
- Primitive tier: raw values such as palette hues, font stacks, and the radius scale.
  Each look owns its primitives; components and apps never reference them.
- Semantic tier: role names that form the shared contract.
  Components and app styles reference only these names.
- Component tier: private tokens of one component, named `--_{{key}}-{{name}}`, such as `--_button-bg`.
  The underscore marks them private; they are outside the contract and may change in any release.

### Contract file
- `src/contract.json` is the single machine-readable list of the contract, and it ships in the package.
- It lists every contract token with its category, group, owner (`base` or `look`), and whether it is required.
- It also lists the themes, the core icon ids of [ADR-0002](ADR-0002-looks.md), and the component keys of the catalog.
- The token test, the conformance check, the gallery, and the style guide all read it ([ADR-0007](ADR-0007-documentation-and-verification.md)).
- The style guide links to it instead of repeating names, so prose and code cannot drift.

Shape of the file, as a sketch for the extraction task:

```json
{
  "themes": ["light", "dark", "system"],
  "tokens": [
    { "name": "--color-primary", "category": "Main action", "group": "color", "owner": "look", "required": true }
  ],
  "icons": ["icon-close", "icon-more", "icon-check", "icon-alert", "icon-help"],
  "components": ["button", "field", "dialog"]
}
```

### Value ownership
- The shared base in `base.css` sets space, motion, layers, and layout widths once for every look.
- Each look sets palette roles, font roles, radius roles, and type steps.
- **[Feedback Needed]** Each look also sets shape details: border widths, elevation, focus ring width, control height, and icon sizes.
  These differ between the two systems today, and the decision of 2026-11-10 did not cover them.
  Recommendation: let looks own them, since they are part of what makes a look recognizable.
- The two sets never overlap: a look that redefines a base token fails the token test.

### Contract categories
An initial list, which the extraction tasks confirm against real use and record in `src/contract.json`:
- Grounds: `--color-bg`, `--color-surface`, `--color-surface-sunken`, `--color-hover-bg`, `--color-selected-bg`, `--color-active-bg`.
- Text: `--color-text`, `--color-text-muted`, `--color-text-disabled`, `--color-link`, `--color-link-hover`.
- Lines and focus: `--color-border`, `--color-border-strong`, `--color-focus`.
- Main action: `--color-primary`, `--color-primary-hover`, `--color-primary-active`, `--color-on-primary`.
- Danger: `--color-danger`, `--color-danger-hover`, `--color-danger-active`, `--color-danger-bg`, `--color-on-danger`.
- Success and warning: `--color-success` and `--color-warning`, each with a `-bg` and an `--color-on-` token.
- Overlay: `--color-backdrop` and `--color-shadow`.
- Optional per look: `--color-accent`, `--color-inverse`, and four tones with matching `--color-on-tone-` tokens.
- Fonts: `--font-body`, `--font-heading`, `--font-mono`, and `--weight-regular` to `--weight-bold`.
- Type: `--text-xs`, `-sm`, `-base`, `-md`, `-lg`, `-xl`, `-2xl`, `-3xl`, three `--leading-` and two `--tracking-` steps.
- Space: `--space-1` to `--space-12` with family-portal's values.
- Radius roles: `--radius-control`, `--radius-button`, `--radius-chip`, `--radius-card`, `--radius-dialog`, `--radius-round`.
- Lines: `--border-width`, `--border-width-strong`, `--focus-ring-width`, `--focus-ring-offset`, `--focus-ring-offset-inset`.
- Elevation: `--elevation-1` and `--elevation-2`.
- Layers, with todos.webapp's values: `--layer-base` 0, `-sticky` 10, `-float` 20, `-popover` 100, `-dialog` 200, `-toast` 300.
- Motion: `--duration-fast` 120 ms, `--duration-base` 200 ms, `--duration-spin`, `--ease-standard`, and two `--offset-` steps.
- Sizes: `--target-min` 2.75rem, `--control-height`, `--icon-sm`, `--icon-md`, `--icon-lg`, `--icon-stroke`.
- Widths, owned by the base with family-portal's values: `--width-reading` 47.5rem, `--width-narrow` 55rem, `--width-content` 75rem.
  Also `--width-main`, `--width-sidebar`, `--width-side-panel`, `--width-menu`, and `--gutter`.

### Naming rules
- Token names follow `--{{group}}-{{role}}[-{{variant}}][-{{state}}]`, such as `--color-primary-hover`.
- Text on a filled role uses `--color-on-{{role}}`.
- Names describe roles, never appearances.
- Every look defines every required contract token in both themes.
- [naming.md](../specs/naming.md) holds every naming convention: tokens, classes, hooks, modules, files, and tests.

### Modularity rules
- Layers depend in one direction: base tokens, then the look, then components, then the shell, then the app.
- A component partial uses only semantic tokens and its own `--_{{key}}-` tokens.
- A component nests another component only through that component's markup, such as `.button` inside `.dialog__actions`.
  It never restyles another component's classes.
- A component module imports only utility modules, or a component module that the catalog names as a dependency.
- The token test fails on a `--_{{key}}-` token outside `css/components/{{key}}.css`.
  It also fails on a component partial that selects another component's block.
- Partial loading is not supported: `style.css` loads every component.
  A per-component entry can follow if a measurement shows the cost matters.

### Filling a look's gaps
- An extracted look rarely defines every required token; todos.webapp lacks success, warning, and heading tokens, for example.
- The extraction task derives each missing value from the look's own primitives, or aliases an existing role.
- It lists every new token with its source in the look's style guide page.
- New hues need the token test's contrast pairs to pass, and the user approves them in the task review.
- Gaps never touch values the app already uses, so the switch stays lossless.

### Theming
As todos.webapp and family-portal do it today:
- `base.css` sets `color-scheme` and the `data-theme` rules once for every look.
- Color roles hold `light-dark()` values, and `color-scheme` picks the theme.
- `data-theme="light"` or `"dark"` on the root element overrides the operating system choice.
- Without `data-theme`, the `system` theme follows the operating system.
- Each look pins its light values in an `@supports` block for browsers without `light-dark()`.
- Durations drop to 0 ms under `prefers-reduced-motion: reduce`.

### Deprecation path
- A rename adds the new name in a minor release and keeps the old name as an alias.
- Aliases live in one `deprecated.css` partial, each with the version that removes it.
- `src/contract.json` marks each deprecated name with its replacement.
- The conformance check of [ADR-0007](ADR-0007-documentation-and-verification.md) warns on deprecated names.
- The next major release removes them; while the major version is 0, a minor release marked breaking does.

---

## Options Considered
Value sharing:
- **[Chosen]** Shared base plus look overrides: space and motion live in one place, and looks stay distinct.
- One value set for every look: rejected, because both adopters would lose their look.
- Shared names only: rejected, because space and motion would drift for no gain.

Radius naming:
- **[Chosen]** Role tokens: components state their role, and each look maps roles to its own scale.
- Shared size steps such as `--radius-md`: rejected, because that name means 8 px in one system and 12 px in the other.
  A size name invites a component to pick a size, while a role lets each look decide.

Main action name:
- **[Chosen]** `--color-primary`: family-portal and meteo use it, and it is the common term.
- `--color-signal`: rejected, because only todos.webapp uses it; a mechanical rename replaces it there.

Contract source:
- **[Chosen]** One `src/contract.json` read by tests, tools, and docs: one list, no drift.
- The list in this ADR only: rejected, because the token test and the conformance check cannot read prose.
- Names defined by the token test's own code: rejected, because docs and the conformance check would need a copy.

Private component tokens:
- **[Chosen]** A leading underscore, `--_{{key}}-`: the name itself says private and names the owning component.
- No private tier, components use semantic tokens only: rejected, because variants then repeat whole declarations.
- A `--{{key}}-` prefix without underscore: rejected, because it reads like a contract token and invites outside use.

---

## Consequences
todos.webapp renames, each keeping its value, so the switch stays lossless:
- `--color-signal` tokens become `--color-primary` tokens.
- `--space-8` becomes `--space-9`, `--width-editor` becomes `--width-side-panel`.
- `--icon-size` becomes `--icon-md`, and `--icon-size-lg` becomes `--icon-lg`.
- Each direct use of `--radius-sm`, `-md`, or `-lg` moves to the radius role it serves.
  Where no role fits, the extraction task adds one to the contract.
- A missed `--space-8` would silently shrink from 3rem to 2.5rem.
  The adoption task renames it with one named command and greps for leftovers.

family-portal changes:
- `--layer-overlay` maps to `--layer-popover` or `--layer-float` by use.
- Its dialog layer moves from 110 to 200.

Other consequences:
- Every contract change edits `src/contract.json` first; the token test then shows what each look must add.
- The width values come from family-portal; todos.webapp's `--width-main` of 45rem keeps its own token.
- Breakpoints cannot be tokens, because custom properties do not work in media queries ([MDN][mdn-custom-properties]).
  [ADR-0004](ADR-0004-app-shell.md) fixes the layout breakpoint as a documented constant.

---

## Evidence
- Tiers and theming: [Token Tiers and Theming](../analysis/ui-design-comparison.md#token-tiers-and-theming).
- Names, overlap counts, and value shifts: [Token Name Crosswalk](../analysis/ui-design-comparison.md#token-name-crosswalk).
- Scales, layers, and motion: [Spacing, Radii, Borders, Shadows, Layers, and Motion](../analysis/ui-design-comparison.md#spacing-radii-borders-shadows-layers-and-motion).
- Sibling facts are `[V:C]`: first-party code read at the commits pinned in the comparison.
- Token values were re-read on 2026-11-11 at todos.webapp `0cf4981` and family-portal `1953f75`.
- Width values come from family-portal's `tokens.css`, read on 2026-11-11 during the round 1 review.
- Research context: written by Claude Opus 5.5 on 2026-11-11, knowledge cutoff June 2026.
  Web access covered HTML pages; no source was paywalled or blocked.

---

## Sources
- `[V:C]` [Using CSS custom properties][mdn-custom-properties]: "Variables do not work inside media queries and container queries."

[mdn-custom-properties]: https://developer.mozilla.org/en-US/docs/Web/CSS/Guides/Cascading_variables/Using_custom_properties
