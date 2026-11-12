# Project Planning
An overview of all tasks and their planning, possibly split by milestone.

## Next Milestone
- [x] T0034 Add the link button component from family-portal, with its gallery section and browser spec.
- [x] T0003 Set up the repository tooling: package manifest, linters, unit and browser test runners, devops scripts, and CI.
- [x] T0004 Extract the shared base tokens, the contract file, and the neutral look from todos.webapp, with the static token test.
- [x] T0021 Add the i18n module with the data-i18n attributes and the catalog format.
- [x] T0014 Add the vendor and check commands of the command line tool, with the package manifest.
- [x] T0015 Add the GitHub Packages publish workflow and document the release flow of the package.
- [x] T0005 Build the visual style gallery with look and theme switchers, token specimens, and the browser verifier.
- [x] T0006 Extract the icon sprite format, the icon class, and the createIcon builder, with the neutral glyph set.
- [x] T0007 Extract the button, icon button, banner, chip, and segmented control components from todos.webapp.
- [x] T0016 Extract the empty state and the row base components from todos.webapp.
- [x] T0017 Add the warm look from family-portal with its seasons variant, glyph set, and the look template.
- [x] T0018 Extract the card, tile, and avatar components from family-portal.
- [x] T0008 Extract fields, checkboxes, radios, and createField from todos.webapp, adding forms, validation states, help toggles, and error summaries.
- [x] T0023 Add the bright look from meteo with its accent variant and AA contrast on every accent.
- [x] T0009 Extract the dialog component and its three confirmation tiers from todos.webapp.
- [x] T0011 Extract the menu and popover modules from todos.webapp as they are, with keyboard support and anchoring.
- [x] T0010 Extract the toast and live region modules from todos.webapp, including Undo and modal holding.
- [x] T0012 Switch the popover and menu modules to the native popover attribute, keeping the anchoring code.
- [x] T0026 Extract the collapsible and the account menu components from todos.webapp.
- [!] T0013 [reason: circuit breaker: 3 consecutive review rejections; inspect review findings before resuming] [owner: @claude] Build the app shell stylesheet with its optional areas, scroll modes, width options, and demo pages.
- [ ] T0028 [needs: T0013] Extract the floating action button from todos.webapp into the overlay layer of the shell.
- [x] T0020 Design and add the loading pattern: aria-busy, a polite status line, and slow-list skeletons.
- [~] T0019 [owner: @codex] Design and add an accessible switch component.
- [ ] T0030 Design and add the tabs component with tablist roles and arrow-key navigation.
- [ ] T0031 Design and add the list and data table components on native list and table elements.
- [ ] T0024 Add the tooltip component after a screen reader check of meteo's tooltips.
- [ ] T0029 Add the badge component for non-interactive counts and status labels, based on meteo's badges.
- [ ] T0032 Add the progress bar and spinner components, static under reduced motion.
- [ ] T0033 Design and add multi-select with checkbox rows, range selection, and a bulk action bar.
- [ ] T0022 [needs: T0013] Build the Python generate-app devops action and the starter app template.
- [ ] T0025 [needs: T0022, T0024] Plan the redesign of auth and counters on the design system.
- [ ] T0027 Add the theme switch and service worker update modules, and document the shared patterns.
- [x] T0002 Plan the design system from the comparison: architecture decisions, adoption roadmap, and first implementation tasks.
- [x] T0001 Compare the UI design of todos.webapp, family-portal, meteo, auth, and counters, from tokens to app shells.

## Backlog
- [ ] T0036 Fix the gallery specs that read styles before a look switch settles, seen failing under load in bright and card.
- [ ] T0035 Move field and form announcements to the shared live region module, so each page has one polite region.
