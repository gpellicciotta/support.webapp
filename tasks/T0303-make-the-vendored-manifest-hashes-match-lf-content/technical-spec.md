## Technical Specifications

### Hashing Rule
- Add an exported `fileHash(path)` to `bin/check.mjs`; it keeps importing Node built-ins only (ADR-0005).
- Hash text files after replacing every `\r\n` with `\n`; leave lone `\r` bytes unchanged.
- Text files are `css`, `js`, `mjs`, `json`, `svg`, `html`, `md`, and `txt` by extension.
- Hash every other file as raw bytes, so a new type fails loudly instead of losing coverage.
- `buildManifest()` in `bin/manifest.mjs` imports `fileHash` for `src/` files and `bin/check.mjs`.
- The release manifest then matches the LF form, whatever line endings the release checkout used.
- Each vendored copy ships its own `check.mjs` beside its manifest, so upgrades need no compatibility path.

### Declared Files
- bin/check.mjs
- bin/manifest.mjs
- tests/unit/check.test.js
- tests/unit/manifest.test.js
- tests/integration/vendor.test.js
- docs/adrs/ADR-0005-distribution-and-versioning.md
- docs/devops.md

### Tests
- Unit: `check.test.js` passes a vendored copy rewritten to CRLF, then to LF.
- Unit: `check.test.js` still fails a changed character in a text file.
- Unit: `check.test.js` fails a binary file whose `\r\n` bytes became `\n`.
- Unit: `manifest.test.js` builds equal hashes from LF and CRLF package trees, and raw hashes for binaries.
- Integration: `vendor.test.js` packs and vendors, then `node bin/check.mjs` exits 0 on CRLF and LF copies.

Completion check: `python scripts/devops.py check`

Size estimate: 7 files, 110 lines
