---
id: T0029
owner: ~
needs: [T0007]
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0029: Add the badge component for non-interactive counts and status labels, based on meteo's badges

## Goals
Add the `badge` component for non-interactive counts and status labels, under [ADR-0003](../../docs/adrs/ADR-0003-components-and-patterns.md) and [components.md](../../docs/specs/components.md).
meteo's status badges are the visual reference; the badge carries text, never meaning by color alone.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [ ] **[Read]**      Read ADR-0003, components.md, naming.md, and the source app at a recorded commit.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Add the badge partial, its tones, and its gallery section.
- [ ] **[Verify]**    Run the named tests and the gallery verifier until both pass.
- [ ] **[Visual]**    Capture the new gallery sections per theme at 390 and 1440 px.
- [ ] **[Doc]**       Update the style guide, components.md, and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 round 2 from the review findings F18 to F20.
