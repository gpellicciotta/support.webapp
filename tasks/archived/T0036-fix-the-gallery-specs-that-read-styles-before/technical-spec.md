# Technical Specifications
## Tests
### Tests
- Unit test: none (the defect depends on browser CSS transitions).
- Integration: Force a one-second color transition and confirm look selection waits for its final computed color.
- Integration: Repeat bright and card specs twenty times while the full browser suite runs.

Completion check: `python scripts/devops.py check` passes twice consecutively.
