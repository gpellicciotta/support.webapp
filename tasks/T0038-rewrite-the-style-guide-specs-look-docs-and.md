---
id: T0038
owner: ~
needs: []
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0038: Rewrite the style guide, specs, look docs, and README for readers who do not know the sibling apps

## Goals
Make the user-facing docs readable without knowing todos.webapp, family-portal, meteo, auth, or counters.
Replace "taken from {{app}}" notes with the reason behind each choice; keep links to ADRs for provenance.
Leave the ADRs, `docs/analysis/`, and `docs/roadmap.md` unchanged, since they record decisions and run adoptions.
Start once todos.webapp and family-portal run on the system; T0022 waits for this task.
Completion check: `lint-markdown check --offline` passes, and a search of the declared files finds no sibling app names.
### Declared Files
- README.md
- docs/specs/visual-style-guide.md
- docs/specs/components.md
- docs/specs/naming.md
- docs/specs/i18n.md
- docs/specs/looks/neutral.md
- docs/specs/looks/warm.md
- docs/specs/looks/bright.md
Size estimate: 8 files, 350 lines

## Task Execution Steps
- [ ] **[Read]**      List every sibling app mention in the declared files and the fact each one carries.
- [ ] **[Doc]**       Rewrite each mention as a generic rationale, keeping ADR links for provenance.
- [ ] **[Verify]**    Run the Markdown linter and the app-name search, recording output in validation-proof.md.
- [ ] **[Doc]**       Update CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-13] **[Doc]**
  Created at the user's request to make the docs usable by readers who do not know the sibling apps.
