## Technical Specifications
support.python v3.1.0's `ReleasePipeline` writes only the first version file, `package.json`.
`scripts/devops.py` adds `LockfileReleasePipeline`, which follows each version edit with a lockfile edit.
It also stages `package-lock.json` in both `git add` steps.
`set_lockfile_version` rewrites only the top-level and root-package versions, keeping other bytes and line endings.
`WebDevopsCli._release` builds that pipeline with the same settings as `DevopsCli._release`.

### Declared Files
- scripts/devops.py
- tests/test_release_lockfile.py
- docs/devops.md

### Tests
- Unit: `set_lockfile_version` keeps dependency versions and CRLF endings, and rejects a lockfile without root versions.
- Unit: a full fake release commits lockfile versions 0.3.0 and 0.3.1-pre, staging the lockfile twice.
- Unit: the dry run lists both lockfile edits and changes nothing; the release action builds the lockfile pipeline.
- Integration: `python scripts/devops.py release --dry-run` in a temporary `main` clone lists both lockfile edits.

Completion check: `python scripts/devops.py check` and `python scripts/devops.py release --dry-run`.
