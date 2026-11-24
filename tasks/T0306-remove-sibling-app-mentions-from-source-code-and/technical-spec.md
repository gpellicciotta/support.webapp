## Technical Specifications

### Scope
Remove all mentions of sibling or legacy applications (`Auth`, `Counters`, `ToDo`, `todos.webapp`, `meteo`, `family-portal`, `support.js`) from source code comments, JSDoc comments, and test comments/descriptions so the codebase is self-explanatory without knowing those apps.

### Rules
1. Rewrite comments in `src/js/*.js` to describe the supported payload shapes, signatures, and behavior directly in domain-neutral terms (for example, `nested extra-info status payload` or `direct broadcast list` instead of `Auth's` or `ToDo's`).
2. Rewrite test comments, JSDoc, and `describe`/`it`/`test` labels in `tests/unit/*.js` and `tests/e2e/*.js` in the same neutral style.
3. Preserve all runtime code, exported aliases (such as `createToaster`, `spriteIcon`, `onKeep`, `activation-count`), and behavior unchanged; only update comments and test descriptions (plus non-semantic sample labels where purely illustrative if appropriate, without altering component contracts).
4. Leave documentation files under `docs/` (including `docs/specs/components.md`, `docs/adrs/`, `docs/analysis/`, `docs/roadmap.md`) and app-icon generators/galleries (`scripts/generate-app-icons.py`, `src/demo/app-icon-gallery.html`, `tests/test_generate_app_icons.py`) unchanged.
5. Verify afterward with a case-insensitive search across `src/js/`, `src/css/`, `tests/unit/`, and `tests/e2e/` that no sibling-app references remain in comments or test descriptions.

### Declared Files
- src/js/action-registry.js
- src/js/admin-broadcasts.js
- src/js/admin-changelog.js
- src/js/admin-console.js
- src/js/admin-logs.js
- src/js/admin-overview.js
- src/js/admin-sessions.js
- src/js/admin-system-events.js
- src/js/admin-users.js
- src/js/auto-refresh.js
- src/js/data-loader.js
- src/js/inbox.js
- src/js/install-prompt.js
- src/js/notices.js
- src/js/pull-refresh.js
- src/js/release-notes.js
- src/js/table-state.js
- src/js/view-router.js
- src/js/view.js
- tests/unit/account-menu.test.js
- tests/unit/admin-broadcasts.test.js
- tests/unit/admin-changelog.test.js
- tests/unit/admin-logs.test.js
- tests/unit/admin-overview.test.js
- tests/unit/admin-sessions.test.js
- tests/unit/admin-system-events.test.js
- tests/unit/admin-users.test.js
- tests/unit/collapsible.test.js
- tests/unit/dom-builders.test.js
- tests/unit/field.test.js
- tests/unit/icon.test.js
- tests/unit/menu.test.js
- tests/unit/popover.test.js
- tests/unit/tokens.test.js
- tests/e2e/shell-additions.spec.js
- tests/e2e/verify-ui.spec.js

### Tests
- Unit: Add or run a check confirming no sibling-app names (`Auth`, `Counters`, `ToDo`, `todos.webapp`, `meteo`, `family-portal`, `support.js`) appear in `src/js/` or `tests/` comments; existing Vitest suite passes unchanged.
- Integration: Existing Playwright e2e and integration suites pass via `python scripts/devops.py check`.

Completion check: `python scripts/devops.py check`
Size estimate: 36 files, 160 lines
Size note: Touches 36 comment-only files across `src/js/` and `tests/`; request human size approval before starting or split by folder.
