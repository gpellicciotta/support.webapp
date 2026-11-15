# T0025 Review Findings, Round 1
An in-session reviewer subagent checked the plan against auth.server `fdbb278` and todos.server `4173976`.
Its verdict was REJECT; `plan tasks review` refused to record it, because agent verdicts need a plan-started session.

---

## Findings
- Blocking: `DELETE /api/tokens?expired=true` keeps every token, so a one-request purge would sign out all users.
- Should-fix: `GET /api/logs` ignores `level`, `message`, and `limit`; filtering must run in the client.
- Should-fix: `GET /api/users` and `GET /api/applications` ignore paging parameters and return every row.
- Should-fix: the plan dropped the client log, linked credentials, bulk session revoke, and Delete application.
- Should-fix: sign-in returns inside the single-page app, so a return URL of `/admin/` opens the old view.
- Should-fix: the two mail stylesheets import deleted files and no mail uses them.
- Should-fix: the service worker precaches every local stylesheet, and the plan made no worker decision.
- Should-fix: the plan and the roadmap disagreed on when auth tasks start.
- Nit: the theme preference storage was left open.
- Nit: two tab names were wrong: Notifications and System Events.
- Nit: the broadcast history comes from system events; there is no list endpoint.
- Nit: the home view, the error page, and the context action bar had no stated new home.
- Nit: promoting the pager and selected rows must update the catalog in components.md.

## Resolution
Each finding was verified against the source and fixed in the plan; see the Execution Log.
