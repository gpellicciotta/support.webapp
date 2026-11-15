# Visual Style Guide
The design system of {{app-title}} and the app's local additions.

---

## Design System
- The app uses the shared [support.webapp](https://github.com/gpellicciotta/support.webapp) design system.
- Version: v{{design-version}}, pinned in [design.json](../../design.json).
- Look: `{{look}}`, imported by [style.css](../../src/css/style.css) from the vendored copy.
- The shared style guide and gallery of support.webapp describe every shared token, component, and pattern.
- The app shell follows the shared skeletons; [index.html](../../src/index.html) keeps only the areas the app uses.

---

## Local Tokens
Defined in [tokens.css](../../src/css/tokens.css):
- `--app-section-gap`: the gap between the sections of the main area, a shared spacing step.

---

## Local Components
Defined in [app.css](../../src/css/app.css) and shown in the [gallery](../../src/demo/visual-style-gallery.html):
- `side-panel__header`: the side panel title and its close button on one row.
  Use it at the top of every side panel; see [the specimen](../../src/demo/visual-style-gallery.html#side-panel-header).
- `app-footer`: muted footer text in the action bar of pages with breadcrumb navigation.
  Use it only for the footer; see [the specimen](../../src/demo/visual-style-gallery.html#app-footer).

---

## Deviations
- None: the app overrides no shared token.
