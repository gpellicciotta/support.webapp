# Neutral look
The neutral look preserves todos.webapp grays, navy, Inter, and control shapes.

## Provenance
Read todos.webapp commit `0cf4981f2fa235a4d48d143b83db24e1f46bd48a`.
The palette and static resolution helpers came from that checkout.
InterVariable.woff2 and OFL.txt are unchanged copies; the font uses SIL OFL 1.1.
Shared space extensions, widths, gutter, and offsets follow ADR-0001 and family-portal primitives.
Read family-portal commit `1953f75484a2fe65aa3444730b3a9f459ae21cb4` for those shared values.

### Glyphs
[icons.svg](../../../src/looks/neutral/icons.svg) copies todos.webapp `src/img/icons.svg` at the same commit.
Mechanical command: `sed -E 's/<symbol id="/<symbol id="icon-/' {{todos-webapp}}/src/img/icons.svg`.
The header comment and the new `icon-help` glyph were then written by hand.
The glyphs are first-party drawings of todos.webapp under its MIT license.
Neither the sprite nor the todos.webapp docs attribute any glyph to a third-party icon set.
The sprite holds 30 glyphs: the 29 of todos.webapp and `icon-help`.

## Usage
Import [index.css](../../../src/looks/neutral/index.css) from the app stylesheet.
Use semantic names from [contract.json](../../../src/contract.json), never private primitives.
Set `data-theme` to `light` or `dark`; remove it to follow the system.
The light fallback supports browsers without `light-dark()`.
Pass the sprite path to `setSpriteUrl`, such as `vendor/design/looks/neutral/icons.svg`.

## Contract gaps
**[Decided]** Existing values remain unchanged; these additions use existing roles, primitives, or typography steps.
Warning shares danger orange, so labels and icons must distinguish their meanings.
No new palette hues were introduced.
- `--font-heading`: `var(--font-body)`.
- `--color-link-hover`: `var(--color-primary-active)`.
- `--color-danger-bg`: `var(--color-surface-sunken)`.
- `--color-success`: `light-dark(var(--green-700), var(--green-400))`.
- `--color-success-bg`: `var(--color-surface-sunken)`.
- `--color-on-success`: `light-dark(var(--gray-0), var(--gray-950))`.
- `--color-warning`: `var(--color-danger)`.
- `--color-warning-bg`: `var(--color-surface-sunken)`.
- `--color-on-warning`: `var(--color-on-danger)`.
- `--text-md`: `var(--text-lg)`.
- `--text-2xl`: `calc(var(--text-xl) + var(--space-1))`.
- `--text-3xl`: `calc(var(--text-2xl) + var(--space-1))`.
- `--leading-relaxed`: `calc(var(--leading-normal) + 0.25)`.
- `--tracking-normal`: `0`.
- `--tracking-tight`: `-0.01em`.
- `--weight-bold`: `700`.
- `--radius-control`: `var(--radius-md)`.
- `--radius-button`: `var(--radius-md)`.
- `--radius-chip`: `var(--radius-sm)`.
- `--radius-card`: `var(--radius-md)`.
- `--radius-dialog`: `var(--radius-lg)`.
- `--control-height`: `var(--target-min)`.
- `--icon-sm`: `var(--text-base)`.

Pair sunken danger grounds with `--color-danger`; reserve `--color-on-danger` for filled danger controls.
Use `--color-on-success` on filled `--color-success`, and `--color-on-warning` on filled `--color-warning`.
Use `--color-text` on the sunken success and warning `-bg` grounds.

Typography extensions use existing type and space steps.
Leading extends normal by one quarter; tracking uses zero and a small negative em offset.
Bold uses Inter weight 700; control height follows the shared minimum target.
Radius roles follow existing control, button, chip, panel, and dialog uses.

## Optional source roles
These existing todos.webapp tokens remain unchanged and are optional entries in the shared contract.
Other looks may omit them; each present token must pass ownership, resolution, and fallback checks.
- `--focus-ring`: `var(--focus-ring-width) solid var(--color-focus)`, the existing outline shorthand.
- `--icon-stroke-thin`: `1`, the existing thin icon stroke.
- `--color-status-in-progress`: the existing sky-600 and sky-400 theme pair.
- `--color-status-completed`: the existing green-700 and green-400 theme pair.
- `--color-status-cancelled`: the existing danger role alias.

The contract marks status roles with `status: true`, enabling contrast and distinctness checks in every look that provides them.
Its `distinctFrom` metadata preserves the in-progress role's minimum RGB distance of 60 from primary.
The static checks read these fields without naming a look.

## App-only tokens
The todos.webapp adoption must retain these six tokens, with their current values, in its local application stylesheet.
They remain outside the shared contract and neutral look.
- `--row-height`.
- `--group-header-height`.
- `--width-chip-max`.
- `--width-text-min`.
- `--width-segment-min`.
- `--height-textarea-min`.

## Verification
The static test resolves every look import chain and checks required tokens, ownership, fallback values, and contrast.
It excludes disabled text from contrast checks.
Each look, theme, token, and contrast pair reports independently, so one failure does not hide later checks.
The package entry remains unlinked from the current page, so this extraction changes no rendered UI.
