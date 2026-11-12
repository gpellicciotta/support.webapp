# T0031 Validation Proof

## Design Approval
The list and table proposals are recorded in components.md on the task branch.
Task step 2 requires user approval before implementation; approval has not been recorded.
No runtime files changed, so automated feature tests and visual captures do not apply to this proposal.

## Planned Test Cases
- Existing static token tests cover CSS token usage; no dedicated unit test applies to these CSS-only components.
- List browser tests verify native list items, description pairs, wrapping, nested action focus, and retained list semantics.
- Table browser tests verify caption naming, scoped headers, numeric alignment, and native table semantics.
- At 390 px, browser tests verify contained horizontal scrolling and keyboard access to the scroll region.
- Gallery verification covers light/dark themes at 390/1440 px, console errors, network failures, contrast, and page overflow.
- Capture and inspect before/after screenshots before requesting integration.

## Walkthrough & Validation
Command: `lint-markdown check docs/specs/components.md` (exit code 1).

```text
docs\specs\components.md:345:38: MD018 [valid-external-links] External link 'https://www.w3.org/WAI/tutorials/page-structure/content/' failed validation: HTTP 403
**[WARN]**  Found 2 lint issues across 1 files.
docs\specs\components.md:371:30: MD018 [valid-external-links] External link 'https://www.w3.org/WAI/ARIA/apg/patterns/table/' failed validation: HTTP 403
**[ERROR]** Finished lint-markdown check in 0.4s with status: failed
```

The web reader retrieved both W3C pages; direct requests with a modern browser User-Agent received Cloudflare challenges.
Offline lint checks document formatting while external validation remains limited by those HTTP 403 responses.

Command: `lint-markdown check --offline docs/specs/components.md` (exit code 0).

```text
All 1 markdown files passed linting.
```

Command: `plan tasks validate T0031 --completion` (exit code 1).

```text
Task files with issues:
- **NOT OK** T0031

Found 11 lint issues across 1 task file.
```

Completion remains pending: design approval, implementation, tests, visual evidence, and final review have not occurred.
