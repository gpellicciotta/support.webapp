---
id: T0005
owner: ~
needs: [T0004]
branch: —
worktree: —
status: ready
started_at: —
ended_at: —
review: agent
preview: none
protocol: standard
---
# T0005: Build the visual style gallery with look and theme switchers, token specimens, and the browser verifier

## Goals
Build the gallery, the style guide skeleton, and the browser verifier of [ADR-0007](../../docs/adrs/ADR-0007-documentation-and-verification.md).
The gallery shows every token group of the `neutral` look, with a look switcher and a light, dark, and system theme switch.
Port the checks of family-portal's verifier, described in [the comparison](../../docs/analysis/ui-design-comparison.md#documentation-galleries-and-tests), to Playwright Test.
Capture gallery screenshots per look and theme at 390 and 1440 px.
See the technical specification for files, tests, and the completion check.

## Task Execution Steps
- [ ] **[Read]**      Read ADR-0007, the ui-guidelines gallery rules, and family-portal's verifier at a recorded commit.
- [ ] **[Implement]** Write the failing tests named in the technical specification.
- [ ] **[Verify]**    Run the new tests and record their failure output in validation-proof.md.
- [ ] **[Implement]** Build the gallery page, its stylesheet and switcher script, and the browser verifier.
- [ ] **[Verify]**    Run the switcher unit test and the verifier until both pass.
- [ ] **[Visual]**    Capture gallery screenshots per look and theme at 390 and 1440 px.
- [ ] **[Doc]**       Write the style guide skeleton, and update index.md and CHANGELOG.md.
- [ ] **[Review]**    Obtain review approval of the finished work before completion.

## Execution Log
- [2026-11-11] **[Doc]**
  Created by T0002 from the design system roadmap.
