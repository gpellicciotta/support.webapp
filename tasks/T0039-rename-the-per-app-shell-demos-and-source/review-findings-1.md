---
task: T0039
round: 1
verdict: rejected
reviewer: "@claude-code"
reviewed_at: 2026-11-13T18:27:11Z
reviewed_commit: 6cd1671
---
# T0039 Review Findings, Round 1

Verdict: **rejected**

Reviewed: `git diff HEAD -M`, technical-spec.md, validation-proof.md, both overview screenshots.
No tests were rerun, per instructions.

## Passing checks
- **Renamed URLs:** No `shell-todos`, `shell-counters`, `shell-meteo`, or `shell-family-portal` reference remains outside `.plan/`. Gallery, specs, style guide, and the fab spec all use the new names.
- **Retained behavior checks:** Test bodies are unchanged apart from names, the `#toolbar-menu` id, and an added title assertion. No skips, retries, or timeouts were added.
- **Red phase:** The gallery-link failure is recorded with exit code 1.
- **Full runs:** Both full runs are recorded, plus the serial diagnostic. The intermittent failures point to T0044, which exists in PLAN.md.
- **Scope:** 10 files match the declared list. Lines touched (76) are under the estimate (180). No product file outside the list changed.
- **Screenshots:** The overviews show all four pages and the gallery at 390 and 1440 px, light and dark. Layouts are intact. Gallery cards read "List editor layout" and so on.

## Findings

### F1 (medium): app-specific label remains on the generic single-screen page
`src/demo/shell-single-screen.html` still shows the meteo-derived labels:
- line 53: `data-screen="forecast"`
- line 54: `<h2>Forecast</h2>`
- line 55: placeholder text "forecast content for a sample place"
- line 64: button `Forecast` with `data-demo-screen="forecast"`

The spec requires "titles, headings, and app-specific labels" to be generic.
The after-overview shows "Forecast" in the bottom bar of the single-screen page at 390 px.
Fix: rename to a neutral label such as "Details", and update the `data-screen` and `data-demo-screen` values together.
No test asserts "forecast" in shell specs, so the fix needs no test change.
Recapture the after screenshots for single-screen.

### F2 (low, non-blocking): docs examples still carry app names
`docs/specs/components.md` lines 315, 699, and 716 keep "Family" and `data-screen="forecast"` in the shell skeleton.
These files are outside the declared scope; do not fix here. If the skeleton should match the demo, record a follow-up task.

## Notes
- The before-screenshot files use the new names, but they show the old pages. This is acceptable but could confuse a reader.
