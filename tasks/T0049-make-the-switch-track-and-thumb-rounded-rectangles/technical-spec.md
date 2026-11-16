## Technical Specifications

### Tests
- Unit: switch.css gives `.switch__control` `--radius-control` and its thumb a smaller concentric radius, never `--radius-round`.
- Integration: the switch e2e spec checks the computed track radius in every look, and that states and sizes are unchanged.

Completion check: `python scripts/devops.py check` passes.
