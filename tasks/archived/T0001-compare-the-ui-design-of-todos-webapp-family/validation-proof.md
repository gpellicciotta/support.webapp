# T0001 Validation Proof

## Walkthrough & Validation
Documentation-only task: the applicable checks are the markdown linter and the task file validator.
No automated test applies, since the task changes no code.

### Markdown Lint
Command: `python ../dev-guidelines/scripts/lint-markdown.py check docs CHANGELOG.md`, exit code 0.

```text
Starting lint-markdown v1.12.9-pre+5f5408e with configuration:
- Command: check
- Log file: none
- Log level: INFO
- Verbose: false
- Working directory: C:\Dev-Projects\template.webapp
All 5 markdown files passed linting.
Finished lint-markdown check in 0.2s with status: succeeded
```

### Task File Validation
Command: `plan tasks validate .plan/tasks/T0001-compare-the-ui-design-of-todos-webapp-family.md`, exit code 0.

```text
All 1 task file passed validation.
```

### Link and Line Range Check
A scratch script expanded the draft links and checked that every linked file exists.
It also checked that every `#Lstart-Lend` anchor lies within the file and printed each first anchored line for review.
Final run output after the review fixes, exit code 0:

```text
237 links, 0 problems, 689 lines
```

Two inventory line ranges were wrong and were corrected before this run:
- The family-portal `fonts.css` range became 12 to 69, since the file has 69 lines.
- The todos.webapp `style.css` import range became 10 to 16.

### Screenshots
Playwright Chromium 1.64.1 captured 15 pages at 390 and 1440 px in light and dark, with reduced motion.
The per-capture results are in [capture-report.json](screenshots/capture-report.json).
Summary command output, exit code 0:

```text
captures=60 status200=60 overflow0=60 pageErrors=0
auth-dashboard-harness       no errors
auth-main                    404 http://127.0.0.1:8765/api/auth-token
counters-gallery             no errors
counters-main                404 http://127.0.0.1:8766/api/auth-token
family-portal-gallery        no errors
family-portal-landing        401 http://127.0.0.1:8764/api/auth-token
family-portal-offline        no errors
family-portal-portal-mockup  no errors
meteo-about                  no errors
meteo-forecast               no errors
meteo-main                   no errors
meteo-settings               no errors
todos-gallery                no errors
todos-main                   no errors
todos-main-populated         no errors
```

Expected errors:
- family-portal landing: HTTP 401 from `/api/auth-token` is the signed-out answer of the real server.
- auth and counters: HTTP 404 from `/api/auth-token`, because the static server runs without their backends.

Limits:
- The counters gallery scrolls inside its own container, so its captures show one screen only.
- At 390 px the counters gallery renders 648 px wide; the document element reports no overflow.
- family-portal portal pages need a real sign-in, so the portal mockup stands in for the home page.
- The screenshots are stored as 256-color PNGs to keep the repository small.
