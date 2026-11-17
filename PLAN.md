# Project Planning
An overview of all tasks and their planning, possibly split by milestone.

## Next Milestone
- [x] T0243 [owner: @claude, session: claude-20261117-911132] [protocol: adhoc] Format the app icon generator script with Ruff, which currently fails the devops check.
- [!] T0244 [reason: circuit breaker: 3 consecutive no-op turns] [owner: @claude, session: claude-20261117-3cd0be] [protocol: adhoc] Investigate the intermittent mobile-light failure of the form spec's edit-during-pending-check test under load.
- [x] T0242 Fix the form spec's pending-check edit test, which failed once under full-suite load and passed 84 times alone.
- [x] T0040 Refresh the neutral look's colors and fonts to the variant the user picks from five rendered candidates.
- [x] T0235 Replace the focus ring with a glow, and give menu items room so focus never overlaps neighbors or edges.
- [x] T0237 Polish small controls: link button padding, smaller rounder badges, lower switches, separated segment borders, and tab headings.
- [x] T0236 Polish fields: borderless read-only, tighter status text, aligned hint padding, indented groups, and select chevron spacing with a gallery section.
- [x] T0238 Align buttons in banners, rows, forms, and cards, and recolor the error summary title and links.
- [x] T0239 Align top bar padding with the content column, align edge icons optically, and use vertical overflow dots at the bar's end.
- [~] T0240 [owner: @claude] Span a full-width app bar over the sidebar and side panel, with a hamburger toggling open, rail, and hidden navigation.
- [ ] T0241 [needs: T0240] Release the palette, component polish, and shell layout work as v0.2.0.

## Backlog
- [ ] T0245 Pause the page clock in the form spec's other async-check tests, which share the 600 ms timing race.
- [ ] T0046 Plan the redesign of counters on the design system, split from T0025.
- [ ] T0041 Refresh the warm look's colors and fonts to new values chosen by the user, after family-portal adopts it.
- [ ] T0042 Refresh the bright look's colors and fonts to new values chosen by the user, after meteo adopts it.
