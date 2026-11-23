## Technical Specifications
### Source
Auth (`../auth`, commit `c7129b8`) holds the app-local version, built in its task T0249:
- Module: `webapp/js/view/pull-to-refresh.mjs`, `attachPullToRefresh(root, { onRefresh, container, iconHtml, media })`.
- Styles: `webapp/styles/app.css`, section "Pull-to-refresh in the installed app".
- Wiring: `AppShell.update` in `webapp/js/view/app-shell.mjs` attaches it while signed in, in the overlay layer.
- Tests: `webapp/test/browser/spa-pull-to-refresh.test.mjs`, with synthetic touch events and a standalone `matchMedia`.
- Task record: `.plan/tasks/T0249-add-pull-to-refresh-to-the-installed-spa.md` and its companion folder.

### Why the shell owns it
- iOS gives installed web apps no pull-down reload; Chrome on Android sources disagree.
- ADR-0003 forbids fixed positions in components; Auth's app-local indicator drew the checker warning
  "fixed or sticky position outside shell". As a shell part in `shell.css`, the warning goes away.

### Contract
Module `src/js/pull-refresh.js`, following the ADR-0003 JavaScript approach:
- `attachPullRefresh(root, { onRefresh, container = root, media, labels })` returns `{ destroy() }`.
- `media` defaults to `matchMedia('(display-mode: standalone)')`; it accepts any object with `matches` and change listeners.
- Accept an injected document through `root.ownerDocument`, so unit tests run without a browser.
- While `media` matches, set `data-pull-refresh` on `<html>`; `shell.css` then sets `overscroll-behavior-y: contain`.
- A pull starts on a one-finger `touchstart` at `scrollY <= 0`, outside `:popover-open` and `dialog[open]`.
- The indicator travels half the dragged distance, up to 96 px; release at 64 px or more calls `onRefresh`.
- The indicator spins until the `onRefresh` promise settles, for at least 400 ms.
- Use touch events, not pointer events: browsers cancel a touch pointer once they take over the pan.
- `touchmove` listens with `passive: false` and prevents the default only while pulling.
- State lives in attributes, not classes: `hidden` and `data-state` of `pulling`, `armed`, or `refreshing`.
- Expose travel and progress as `--_app-pull-travel` and `--_app-pull-progress` custom properties.
- The indicator is `div.app__pull-indicator` with `aria-hidden="true"` and the sprite's refresh glyph.
  Announce the refresh through `live-region.js`, with a label such as "Refreshing", from `labels`.

Shell part `.app__pull-indicator` in `src/css/shell.css`:
- Fixed below the top bar using `--_app-top-offset`, centered, `--target-min` round, surface ground, `--elevation-1`.
- Opacity and rotation follow the progress; the refreshing state spins with `--duration-spin`.
- Reduced motion stops the spin.

The starter template precaches every vendored manifest file, so it needs no change.

### Declared Files
- src/css/shell.css
- src/demo/shell-demo.js
- src/demo/shell-portal.html
- docs/adrs/ADR-0003-components-and-patterns.md
- docs/adrs/ADR-0004-app-shell.md
- docs/specs/components.md
- docs/specs/visual-style-guide.md

Added files, not counted: `src/js/pull-refresh.js`, `tests/unit/pull-refresh.test.js`, `tests/e2e/pull-refresh.spec.js`.

Size estimate: 6 files, 200 lines

### Tests
- Unit: `tests/unit/pull-refresh.test.js` drives touches on an injected document:
  past the threshold calls `onRefresh` once; a short pull does not; a scrolled page or open popover ignores the pull;
  a non-matching `media` sets no attribute and ignores pulls; `destroy` removes listeners, the attribute, and the indicator.
- Integration: `tests/e2e/pull-refresh.spec.js` loads the shell demo with a standalone `matchMedia` and synthetic touches:
  the indicator follows the pull and arms past the threshold; release refreshes once; the page shows no overflow.

Completion check: `python scripts/devops.py check`
