---
task: T0001
round: 1
verdict: approved
reviewer: '@giova'
reviewed_at: '2026-11-10T21:23:50+01:00'
---
# T0001 Review, Round 1

Findings: an independent Claude agent that did not write the work. Verdict: recorded by the user, @giova, on 2026-11-10.
Scope: `docs/analysis/ui-design-comparison.md`, plus the `docs/index.md` and `CHANGELOG.md` edits in 4a899d0.
Sibling checkouts were at the commits the doc lists, with clean worktrees: todos.webapp `dac760b`, family-portal `1953f75`, meteo `8937c32`, support.js `7738fab`, auth `ef0c67f`, counters.server `cf13d8b`.
No file was edited anywhere.

## Verdict: APPROVE

No blocking findings. The core numbers T0002 depends on reproduce exactly: token counts, overlaps, fork facts, contrast ratios, and crosswalk names.
About 7 of roughly 75 sampled claims are wrong or overstated, and 3 line anchors drift. All are minor. Fix them as should-fix items.

---

## 1. Factual Accuracy: Claims Checked

Method: I wrote my own regex token extractor (first definition per name, split by each file's tier comments), and used grep, sed, git log, and a WCAG luminance calculation.

### Correct
| #  | Doc location                     | Claim                                                                                                         | Evidence                                                                                                                                                                   |
| -: | :------------------------------- | :------------------------------------------------------------------------------------------------------------ | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1  | Token tiers table                | todos 37 primitive / 83 semantic / 2 component-local                                                          | tokens.css L1-62 gives 37, L63-173 gives 83; `--sync-indicator-ground` and `--sync-indicator-ring` in app-chrome.css                                                        |
| 2  | Token tiers table                | family-portal 64 / 124 / 1 component-local                                                                    | tokens.css L1-101 gives 64, L123-277 gives 124; `--site-footer-height` at components.css L822                                                                               |
| 3  | Token tiers table                | meteo 0 / 63                                                                                                  | style.css `:root` L7-88 gives 63 names, and no others in the file                                                                                                          |
| 4  | Token tiers table                | auth 42+53+45+7 = 147; counters 42+46+82+5+179 = 354                                                          | my totals: auth 147, counters 354                                                                                                                                          |
| 5  | Overlap table, summary           | todos/family-portal 53 all tiers, 49 semantic                                                                 | reproduced 53 and 49; the 4 non-semantic shared names are `--navy-200/700/800/950`                                                                                         |
| 6  | Known facts row 2                | 45-of-71 not reproduced; 71 names without typography share 37                                                 | 83 - 12 typography names = 71; 37 of them exist in family-portal                                                                                                           |
| 7  | Known facts row 3, overlap table | meteo shares 7 names with todos (the listed ones) and 12 with family-portal                                   | reproduced exactly                                                                                                                                                         |
| 8  | Overlap table                    | support.js shares 5 with todos, 6 with family-portal, 7 with meteo                                            | reproduced; support.js has 123 names in total                                                                                                                              |
| 9  | Overlap table                    | auth and counters each hold all 123 support.js names                                                          | both contain every support.js name; none missing                                                                                                                           |
| 10 | Known facts row 4                | auth holds 17 copies, 3 identical after CRLF normalization; counters holds 15 differing copies and imports 4 | `diff --strip-trailing-cr`: auth identical = dialog, tooltips, wait-panel; counters 0 of 15; imports reset, component, collection-editor, catalogue-view                    |
| 11 | Known facts notes                | support.js is CRLF, forks LF                                                                                  | `file` reports CRLF for support.js/css/style.css and plain LF for auth                                                                                                      |
| 12 | Known facts notes                | support.js CHANGELOG L53 records the extraction in v1.0.0                                                     | L53 says "Extracted 9 shared CSS stylesheets from auth and counters"; auth copies date from 2024-01-12, support.js copies from 2026-09                                     |
| 13 | Known facts row 5                | auth and counters load Roboto from Google Fonts and the Font Awesome kit                                      | auth index.html L23 and L32; counters index.html L23 and L41; `family=Roboto` has no weights                                                                                |
| 14 | Known facts row 5                | most demo pages use Font Awesome from cdnjs                                                                   | auth 12 of 16 demos; counters 24 of 44 (12 use the kit)                                                                                                                     |
| 15 | Known facts row 3                | `index.html` is meteo's only HTML file                                                                        | `git ls-files "*.html"` returns only index.html                                                                                                                            |
| 16 | Crosswalk                        | every listed token name exists in its app                                                                     | I checked about 90 names across the four columns; all exist                                                                                                                |
| 17 | Crosswalk                        | meteo `--color-correct` and `--color-overlay` are unused                                                      | 0 `var()` uses in css, js, and index.html                                                                                                                                  |
| 18 | Values list                      | space 1-7 equal; `--space-8` 3rem vs 2.5rem; radii 4/8/12 vs 8/12/16; meteo 4/6/12; text-lg 1.125 vs 1.375rem | tokens.css values confirmed in all three files                                                                                                                             |
| 19 | Values list                      | motion identical; `--layer-dialog` 200 vs 110                                                                 | 120ms, 200ms, and `cubic-bezier(0.2, 0, 0, 1)` in both; layers confirmed                                                                                                   |
| 20 | Typography table                 | family-portal 8 steps, 2 fluid; leading 1.05/1.3/1.6; todos 5 steps 0.75-1.375rem                             | confirmed                                                                                                                                                                  |
| 21 | Spacing section                  | strong border 3px vs 1.5px                                                                                    | confirmed                                                                                                                                                                  |
| 22 | Spacing section                  | meteo raw z-index 5, 20, 60, 1000; raw z-index at the three cited lines                                       | confirmed; todos app-chrome L415, family-portal components L830, support.js progress L93                                                                                   |
| 23 | Spacing section                  | no reduced-motion handling in meteo, support.js, auth, counters                                               | no `prefers-reduced-motion` anywhere in their CSS                                                                                                                          |
| 24 | Colors section                   | computed 4.23, 2.94, 2.57; meteo white on yellow 2.94                                                         | my computation from `#70757a`/`#f4f4f4`, `#f2711c`, `#21ba45`, `#ca8a04` gives the same ratios                                                                              |
| 25 | Colors section                   | support.js media query and `data-theme` block repeat 19 dark values                                           | 19 declarations in each block                                                                                                                                              |
| 26 | Icons table                      | todos sprite has 29 symbols; 4 private helpers duplicate `spriteIcon`                                         | 29 `<symbol>`; `icon()` in inbox.js, layout.js, user-menu.js, sync-indicator.js                                                                                             |
| 27 | Icons section                    | todos gallery has 45 inline-path icons                                                                        | 216 `<svg>` against 171 `<use>`                                                                                                                                            |
| 28 | Icons table                      | family-portal 30 symbol ids; meteo 38 icons; 16 unused leftovers                                              | 30 unique ids across HTML; 38 keys in ICON_DEFS; 16 names with no reference outside icons.js                                                                               |
| 29 | Focus section                    | family-portal 3px box-shadow ring; meteo 11 `outline: none`                                                   | `--focus-ring-width: 3px`; grep count 11                                                                                                                                   |
| 30 | Touch targets                    | todos sync badge 18px, and it is a button; meteo 38px; counters 2.5rem                                        | sync-indicator.js L157 builds a `button`; style.css L780-781; `--control-touch-target-min: 2.5rem`                                                                          |
| 31 | Buttons section                  | family-portal `.button--danger` is missing from its gallery                                                   | all 14 gallery hits are `icon-button--danger`; `.button--danger` appears only in survey.mjs                                                                                 |
| 32 | Lists section                    | 36rem container queries; virtualization above 200 rows                                                        | `@container task-list (width < 36rem)`; `FULL_ROWS = 200`                                                                                                                  |
| 33 | Delete section                   | support.js bulk-delete checkbox is `display: none`                                                            | action-bar.css L302-303                                                                                                                                                    |
| 34 | Toasts section                   | createToaster: persistent, Ctrl+Z, holds while modal open; counters toast manager has Escape and Ctrl+Z       | toast.js L6-9; toast-manager.mjs L330-343                                                                                                                                  |
| 35 | Toasts section                   | family-portal has no toasts and is the only app with Web Push                                                 | no toast code in family-portal; `push` and `showNotification` in its sw.js only                                                                                            |
| 36 | Menus section                    | family-portal has no menus or popovers; no app uses `<details>`; no native `popover`                          | grep finds no menu role, popover, or `<details>` in todos, family-portal, or meteo                                                                                         |
| 37 | Dialogs section                  | family-portal `showModal()` at visual-editor L315-316; typed DELETE in todos settings                         | confirmed                                                                                                                                                                  |
| 38 | Dialogs section                  | counters colors dialog buttons by label text                                                                  | dialog.css `button[data-answer^="Yes, delete" i]`                                                                                                                          |
| 39 | App shell section                | header hand-copied into all 14 portal templates                                                               | 14 HTML files in portal/, all with `class="sticky-header"`                                                                                                                 |
| 40 | Routing section                  | 14 hash routes; meteo `showScreen` without the History API; auth and counters use `pushState`                 | router.js ROUTES has 14 entries; grep confirms the rest                                                                                                                    |
| 41 | Responsive table                 | family-portal 40rem used 8 times plus JS mirror; meteo widths 380/479/500/639/640/768                         | 8 `max-width: 40rem`; `matchMedia("(max-width: 40rem)")` in shopping-list.mjs                                                                                               |
| 42 | i18n section                     | 401 keys each in English and Dutch; meteo attribute names; `languagechange`                                   | en.json and nl-BE.json each hold 401 keys; i18n.js L102-123                                                                                                                |
| 43 | i18n section                     | support.js, auth, counters have no internationalization                                                       | only `toLocale*` and `localeCompare` calls                                                                                                                                 |
| 44 | Code level                       | components.css 2744 lines; meteo style.css 2011 lines; counters gallery 444 inline styles, family-portal 3     | `wc -l` and grep counts match                                                                                                                                              |
| 45 | Summary                          | family-portal from October 2026, todos from November 2026; meteo copied from a quiz app                       | tokens.css first commits 2026-10-21 and 2026-11-04; meteo log "Copied the reusable verkeersregels-quiz shell files"                                                       |
| 46 | Docs table                       | 5 todos gallery end-to-end specs; 16 auth demo harnesses                                                      | tests/e2e has gallery*.spec.js x5; auth/webapp/demo has 16 HTML files                                                                                                      |

### Wrong or Overstated
| #  | Severity   | Doc location                                                | Claim                                                                    | Evidence                                                                                                                                                                                                          |
| -: | :--------- | :---------------------------------------------------------- | :----------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| W1 | should-fix | Chips section L303; summary L26; verdict table "Switch"     | counters `.switch-control` uses `role="switch"`                          | `.switch-control` is a `<label>` around a plain checkbox, and only in design-system-gallery.html L1229-1245. The only `role="switch"` is a different demo widget in boolean-counter-alternatives.mjs L260. |
| W2 | should-fix | App shell section L438; code level L534                     | the todos shell owns every fixed or sticky position                      | `.toast-region` is `position: fixed` in controls.css L802. `.task-view > .add-block` is `position: sticky` in views.css L94. The rule given as the reason for the CSS reference is not fully kept.             |
| W3 | should-fix | Empty/loading section L344; summary L27                     | todos has no loading pattern                                             | `.sync-indicator[data-state='syncing'] .icon` spins with `--duration-spin` (app-chrome.css L282-283, L345). That is a progress indicator the doc never mentions.                                               |
| W4 | should-fix | Service worker section L498                                 | meteo keeps the last forecast in local storage for 6 hours, citing sw.js | forecast-view.js L690-700 shows a saved forecast while at least 6 of its hours lie ahead. It is not a 6-hour lifetime, and sw.js L99-137 is the navigation strategy, not the storage.                         |
| W5 | nit        | Icons section L239                                          | 9 weather icons have day and night variants                              | 9 weather icons exist, and only clear and partly have day/night variants (forecast.js L59-65).                                                                                                                  |
| W6 | nit        | Icons section L237                                          | a family-portal icon helper is copied into 8 modules                     | 7 modules create `<svg><use>`: announcements, apps, portal, shopping-list, survey-form, survey, week-menu.                                                                                                   |
| W7 | nit        | Crosswalk Radii row, meteo cell                             | meteo radii are "same as family-portal, plus `--radius`, `-full`"        | meteo has no `--radius-pill`; family-portal has it.                                                                                                                                                             |
| W8 | nit        | Crosswalk Radii row, support.js cell                        | support.js radii are only `--border-radius-*`                            | support.js style.css L67-69 also defines `--radius-sm/md/lg` aliases. The overlap table counts them, so the doc contradicts itself.                                                                             |
| W9 | nit        | Spacing section L215; typography table support.js row       | 120 and 138 literal spacing declarations; 39 literal font sizes          | Not reproducible without the method: I count 134 non-token, non-zero spacing declarations in meteo, 142 in support.js, and 41 non-`inherit` literal sizes. State the counting rule or say "about".            |

### Line Anchors That Drift
The proof's link check only tests that ranges fall inside each file. It does not test that they point at the claimed content.
- nit, Focus section L246: todos `style.css#L79-L82`. The `:focus-visible` rule is at L77-80.
- nit, Chips section L300: family-portal `components.css#L2670-L2707` covers only `.segmented`. `.chip` starts at L2227, `.reaction` at L2298, and `.tag` at L2582.
- nit, Colors section L184: todos guide `#L24-L27` lists the principles. It does not mention navy, orange, or status hues.

Other anchors I spot-checked point at the right content, about 35 of them.

---

## 2. Requirement Coverage

Present: every low, middle, high, and code-level dimension has an entry. The crosswalk is a padded table across the four required apps. The summary sits at the top, 27 lines. Open questions for T0002 are listed, 12 of them. All 6 known facts are checked with evidence. 60 screenshots are stored in the companion folder and linked; all 200 links resolve (my own check). Recorded errors and limits are listed.

Gaps:
- should-fix, many entries: the spec asks for each reference "and why". About 12 of 25 entries name the reference with only a scope and no reason. Examples: Chips, Lists, Delete, Empty states, Toasts, Menus, Avatars, Routing, Service worker, Theme switch, i18n, JavaScript components. The comparison bullets often make the pick obvious, which is why this is not blocking.
- should-fix, code level: the spec asks, "for every pattern", for the HTML hierarchy with ARIA, plus the gallery section, style guide section, and tests. Only fields, tiles, toasts, menus, dialogs, and shells give anatomy. Only menus and dialogs cite tests. No pattern links its gallery or style guide section.
- should-fix, Splash/SW/Install entry: install behavior is in the heading but has no content. Examples: manifests, family-portal account.mjs L295 `display-mode: standalone` detection, meteo's `install` icon.
- should-fix, verdict values: Loading has "open gap", which is not one of the allowed values. Name a target verdict, likely shared component, and keep "no reference" as the note.
- nit, Sharing Verdicts table: these section verdicts are missing from it: spacing, radius, and motion scales; collapsibles; account menu; responsive behavior; offline page; docs, galleries, and tests.

---

## 3. Reasoning Quality

- should-fix, Summary L32 vs verdict table: the summary says to share "behavior modules as a contract". The table and the JavaScript section say shared component, consumed as a pinned package.
- should-fix, Tooltips: meteo's CSS-only `[data-tooltip]::after` is named the shared-component reference, with no reason given. The doc does not check how screen readers expose generated `::after` text. Justify the pick or mark it provisional.
- should-fix, Switch: the reference rests on W1. Without `role="switch"`, counters offers only a visual idea, so call it that.
- should-fix, CSS layering reference: the reason given is "components hold no fixed positions", which W2 shows is not fully true. Restate it or note the exceptions.
- OK: the token, icon, dialog, field, and shell picks are well supported by the evidence given. The sprite pick is balanced by an open question about family-portal's Java widgets. The known-fact corrections are careful, and the CRLF explanation checks out.
- Consider: the fork-direction note says support.js extracted "these stylesheets". The support.js changelog says 9 stylesheets, while auth holds 17 copies. "Some of these" would be more precise.

---

## 4. Style and Lint

- Lint: `python ../dev-guidelines/scripts/lint-markdown.py check docs CHANGELOG.md` exits 0 ("All 5 markdown files passed linting").
- nit: two prose sentences go over 20 words:
  - L193, 21 words: "Computed failures: muted text …".
  - L636, 23 words: the open question "How is the shared system consumed without a build step …".
- US English: no British spellings. `.catalogue-item` is a code identifier.
- index.md and CHANGELOG.md edits: fine. The changelog entry is past tense, under v0.1.0-pre, and links the doc.
