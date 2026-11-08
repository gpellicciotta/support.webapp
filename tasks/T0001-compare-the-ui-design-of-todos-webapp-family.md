---
id: T0001
owner: ~
needs: []
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: different-agent
preview: none
protocol: standard
---
# T0001: Compare the UI design of todos.webapp, family-portal, meteo, auth, and counters, from tokens to app shells

## Goals
Produce an evidence-based comparison of how five existing apps implement their UI design.
Cover low-level tokens, middle-level components and patterns, high-level app shells, and the code behind each.
Name a reference implementation and a sharing verdict for every pattern, as input for T0002.
Treat all sibling repositories as read-only; record nothing in them.
This is an investigation-only task: it writes findings and changes nothing else, so the sizing gates do not apply.
See [technical-spec.md](T0001-compare-the-ui-design-of-todos-webapp-family/technical-spec.md) for dimensions, format, and known facts.

## Task Execution Steps
- [ ] **[Read]**      Read the ui-guidelines and each app's style guide, gallery, and stylesheet entry point.
- [ ] **[Read]**      Inventory the tokens of all five apps and build the token name crosswalk.
- [ ] **[Read]**      Inventory components and patterns per app, with file references, markup, and JavaScript behavior.
- [ ] **[Read]**      Inventory app shells, navigation, theming, icons, fonts, and asset loading per app.
- [ ] **[Visual]**    Capture gallery and main screen screenshots per app in light and dark, at 390 and 1440 px.
- [ ] **[Doc]**       Write the comparison with a reference implementation and a sharing verdict per pattern.
- [ ] **[Doc]**       Link the comparison from index.md and add a CHANGELOG.md entry.
- [ ] **[Verify]**    Lint the changed markdown files and run plan tasks validate on this task.
- [ ] **[Review]**    Obtain different-agent review approval of the finished comparison before completion.

## Execution Log
- [2026-11-08] **[Doc]**
  Companion task file scaffolded at task creation.
