# T0002 Review, Round 2
Verdict: pending; the user records it with `plan tasks review T0002`.
Findings: the user's answers to the round 2 `**[Feedback Needed]**` items, and one question, from 2026-11-12.
Scope: the ADRs, `docs/roadmap.md`, `docs/specs/`, and the tasks, at commit `9d8c7d3`.

---

## F1. ADR-0001: looks own shape details
- Source: user decision.
- Applied: ADR-0001 marks the shape details look-owned, with an Options Considered entry.
- `--target-min` stays in the shared base, as an accessibility floor.

## F2. ADR-0001: what are the distinct role names?
- Source: user question.
- Answer: ADR-0001 gains a "Roles" section listing the roles per group, with variants and states.
- Groups split into role groups, such as `color` and `radius`, and scale groups, such as `space` and `text`.
- Open: `--color-hover-bg`, `--color-active-bg`, and `--color-selected-bg` put a state where the role belongs.
  The rename to `--color-surface-hover`, `-active`, and `-selected` is marked `**[Feedback Needed]**`.

## F3. ADR-0002: the look names
- Source: user decision.
- Applied: `neutral`, `warm`, and `bright` are decided in ADR-0002, ADR-0008, and the roadmap.

## F4. ADR-0002: per-look sprites
- Source: user decision.
- Applied: one sprite per look stays; the shared glyph set is rejected.

## F5. ADR-0002: dark text on the yellow accent
- Source: user decision: change it for `bright`, as long as meteo can still override that one value.
- Applied: `bright` pairs yellow with dark text; ADR-0002 gains an "App overrides" section.
- meteo overrides `--color-on-primary` on `:root[data-accent="yellow"]`, which outranks the look's bare attribute rule.

## F6. ADR-0002: one variant attribute
- Source: user decision: family-portal also uses `data-accent`, with `spring`, `summer`, and so on as values.
- Applied: every look variant uses `data-accent`; meteo's `data-theme-color` moves to it as well.
- family-portal's `--color-season-accent` and `--color-season-wash` become `--color-accent` and `--color-accent-bg`.

## F7. ADR-0005 and ADR-0008: the copy step
- Source: user decision: add the copy step only once needed.
- Applied: both ADRs decide on no copy step until a build step needs one.

## F8. Roadmap: the FAB task
- Source: user decision.
- Applied: T0028 moves into the Next Milestone, and the roadmap drops its open question.
