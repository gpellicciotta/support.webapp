# Project Planning
An overview of all tasks and their planning, possibly split by milestone.

## Next Milestone
- [x] T0049 Make the switch track and thumb rounded rectangles, since the 50% round radius turns the track into an ellipse.
- [x] T0048 Promote the detail panel, facts list, and status chip, and add an admin console shell example.
- [x] T0047 Promote the toolbar, pager, and data table row states from ToDo's admin console into the package.
- [!] T0037 [reason: needs review: requires manual Narrator/NVDA testing of the tooltip component and meteo tooltips by a human; announcements cannot be recorded without a screen reader] [owner: @claude, session: claude-20261117-a1f695] [protocol: adhoc] Check the tooltip component and meteo's tooltips with Narrator or NVDA by hand, recording what each announces.
- [!] T0044 [reason: needs review: could not reproduce. Full suite (8 workers: 724 passed), verify-ui at 24 workers (122 passed) and 32 workers x2 (244 passed) showed no screenshot timeouts or incomplete stylesheet loads. Need the original failing log, machine load, and runner (plan supervise or concurrent worktrees) to continue.] [owner: @claude, session: claude-20261117-5bdc3c] [protocol: adhoc] Investigate intermittent browser verifier screenshot timeouts and incomplete stylesheet loads under parallel execution.
- [x] T0043 Rewrite source comments that name the sibling apps as generic rationale, in the modules, looks, and demos.
- [x] T0045 Fit the account menu's small avatar inside its round button, which it overhangs by 2 px on each side.

## Backlog
- [ ] T0046 Plan the redesign of counters on the design system, split from T0025.
- [ ] T0040 Refresh the neutral look's colors and fonts to new values chosen by the user, after todos.webapp adopts it.
- [ ] T0041 Refresh the warm look's colors and fonts to new values chosen by the user, after family-portal adopts it.
- [ ] T0042 Refresh the bright look's colors and fonts to new values chosen by the user, after meteo adopts it.
