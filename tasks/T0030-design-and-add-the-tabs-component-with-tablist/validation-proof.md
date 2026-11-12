# T0030 Validation Proof

## Walkthrough & Validation
Design proposal only; implementation awaits the task's required user approval.
No automated component tests apply because no component code changed.

Command: `lint-markdown check docs/specs/components.md`; exit code: 1.

```text
docs\specs\components.md:357:40: MD018 [valid-external-links] External link 'https://www.w3.org/WAI/ARIA/apg/patterns/tabs/' failed validation: HTTP 403
**[WARN]**  Found 1 lint issue across 1 files.
**[ERROR]** Finished lint-markdown check in 0.2s with status: failed
```

W3C returned a Cloudflare challenge even with a modern browser User-Agent.
The browsing tool successfully retrieved the W3C pattern and confirmed the referenced keyboard and ARIA guidance.

Command: `lint-markdown check --offline docs/specs/components.md`; exit code: 0.

```text
All 1 markdown files passed linting.
```
