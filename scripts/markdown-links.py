"""Check source links while treating sibling repositories and the plan store as external evidence."""

import re
from dataclasses import replace
from pathlib import Path
from urllib.parse import unquote

from support_python.markdown.rules import MD014ValidRelativeLinks


class PortableLinks(MD014ValidRelativeLinks):
    """Preserve internal link checks without requiring optional workspace artifacts."""

    rule_id = "SW001"
    name = "portable-relative-links"

    def check(self, ctx):
        """Remove external workspace links before applying the standard relative-link rule."""

        def portable(match):
            target = unquote(match.group(1).split("#")[0])
            if ":" in target or target.startswith("#"):
                return match.group(0)
            root = ctx.project_root.resolve()
            resolved = (
                root / target.lstrip("/\\")
                if target.startswith(("/", "\\")) and not target.startswith(("//", "\\\\"))
                else ctx.file_path.parent / target
            ).resolve()
            if not resolved.is_relative_to(root):
                return ""
            local = resolved.relative_to(root)
            if local == Path("PLAN.md") or local.parts[:1] == (".plan",):
                return ""
            return match.group(0)

        sanitized = re.sub(r"\]\(([^)]+)\)", portable, ctx.sanitized)
        return super().check(replace(ctx, sanitized=sanitized))


def register(registry):
    """Replace relative-link handling with the source-checkout variant."""
    registry.register(PortableLinks())
