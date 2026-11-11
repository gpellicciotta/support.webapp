# Project Planning
An overview of all tasks and their planning, possibly split by milestone.

## Next Milestone
- [!] T0002 [reason: awaiting human review] [owner: @claude-code] Plan the design system from the comparison: architecture decisions, adoption roadmap, and first implementation tasks.
- [x] T0001 Compare the UI design of todos.webapp, family-portal, meteo, auth, and counters, from tokens to app shells.
- [ ] T0003 [needs: T0002] Set up the repository tooling: package manifest, linters, unit and browser test runners, devops scripts, and CI.
- [ ] T0004 [needs: T0003] Extract the shared base tokens and the todos look from todos.webapp, with the static token test.
- [ ] T0005 [needs: T0004] Build the visual style gallery with look and theme switchers, token specimens, and the browser verifier.
- [ ] T0006 [needs: T0005] Extract the icon sprite format, the icon class, and the spriteIcon builder, with the todos glyph set.
- [ ] T0007 [needs: T0006] Extract the button, icon button, banner, chip, and segmented control components from todos.webapp.
- [ ] T0008 [needs: T0007] Extract the field, checkbox, and radio components with the createField module from todos.webapp.
- [ ] T0009 [needs: T0008] Extract the dialog component and its three confirmation tiers from todos.webapp.
- [ ] T0010 [needs: T0008] Extract the toast and live region modules from todos.webapp, including Undo and modal holding.
- [ ] T0011 [needs: T0009] Extract the menu and popover modules from todos.webapp as they are, with keyboard support and anchoring.
- [ ] T0012 [needs: T0011] Switch the popover and menu modules to the native popover attribute, keeping the anchoring code.
- [ ] T0013 [needs: T0005] Build the app shell stylesheet with its optional areas, scroll modes, width options, and demo pages.
- [ ] T0014 [needs: T0004] Add the vendor and check commands of the command line tool, with the package manifest.
- [ ] T0015 [needs: T0014] Add the GitHub Packages publish workflow and document the release flow of the package.
- [ ] T0016 [needs: T0007] Extract the empty state and the row base components from todos.webapp.
- [ ] T0026 [needs: T0012] Extract the collapsible and the account menu components from todos.webapp.
- [ ] T0027 [needs: T0010] Add the theme switch and service worker update modules, and document the shared patterns.

## Backlog
- [ ] T0017 [needs: T0006] Add the family-portal look with its seasons variant, glyph set, and the look template.
- [ ] T0018 [needs: T0017] Extract the card, tile, and avatar components from family-portal.
- [ ] T0019 [needs: T0007] Design and add an accessible switch component.
- [ ] T0020 [needs: T0007] Design and add the loading pattern: aria-busy, a polite status line, and slow-list skeletons.
- [ ] T0021 [needs: T0003] Add the i18n module with the data-i18n attributes and the catalog format.
- [ ] T0022 [needs: T0013, T0014, T0017] Build the create command and the starter app template.
- [ ] T0023 [needs: T0017] Add the meteo look with its accent variant and AA contrast on every accent.
- [ ] T0024 [needs: T0012] Add the tooltip component after a screen reader check of meteo's tooltips.
- [ ] T0025 [needs: T0022, T0023, T0024] Plan the redesign of auth and counters on the design system.
