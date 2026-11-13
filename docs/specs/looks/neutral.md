# Neutral look
The neutral look combines gray surfaces, navy actions, Inter typography, and compact control shapes.

## Provenance
See [ADR-0002](../../adrs/ADR-0002-looks.md) for the look's origins and separation from shared structure.
The bundled Inter variable font retains its SIL OFL 1.1 license.
Shared spacing, widths, gutters, and offsets follow [ADR-0001](../../adrs/ADR-0001-layer-model-and-token-contract.md).

### Glyphs
[icons.svg](../../../src/looks/neutral/icons.svg) provides first-party MIT-licensed drawings, including the help glyph.
Symbol IDs use the `icon-` prefix, so components can reference the same names across looks.

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

## Optional roles
These optional contract entries support outline shorthands, thin strokes, and task status colors.
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
Keep application-specific row and editor dimensions in the application's stylesheet.
Examples include these six tokens:
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
