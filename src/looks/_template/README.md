# Look template
This starting point combines neutral's accessible palette, Inter font, and MIT sprite with warm's optional role and variant patterns.
The mappings include optional accents, tones, inverse text, and shadow roles using the default palette.
Commented variant examples include both themed mappings and their light fallbacks; enable and customize both together.
Compare warm for Outfit, DM Sans, and pill shapes.

## Create a look
- Copy this directory to `src/looks/{{look-name}}/` or the app's local look folder.
- Keep the shared stylesheet import first; adjust its path for an app-local folder.
- Edit primitives and semantic mappings together; never change shared components to select a look.
- Define every required look-owned token in [contract.json](../../contract.json) in both themes.
- Retain light fallbacks for every `light-dark()` mapping.
- Customize optional roles in the mapping or remove unused roles; they demonstrate warm's additional contract needs.
- Replace fonts and their declarations together; retain each font license.
- Replace glyphs while preserving every core id in `contract.json` and the 24-unit viewBox.
- Use bare `data-accent` selectors for variants and redefine semantic tokens only.
- Register package looks in the gallery select and `gallery.js`; underscore folders are excluded from discovery.
- Document provenance, licenses, additions, and any intentional changes under `docs/specs/looks/`.
- Run `python scripts/devops.py check` and inspect light and dark screenshots at both gallery widths.

## App-local selection
Import exactly one look entry from the app stylesheet.
Pass its sprite URL to `setSpriteUrl`.
Set `data-theme` to `light` or `dark`, or remove it for the system preference.
Declare an app-local look in `design.json`; the package integrity check ignores that local folder.
