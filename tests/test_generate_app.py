"""Verify the generate-app action: options, placeholders, shell areas, and the generated project files."""

import importlib.util
import re
import subprocess
import sys
from datetime import date
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("generate_app", REPO_ROOT / "scripts/generate_app.py")
GEN = importlib.util.module_from_spec(SPEC)
sys.modules["generate_app"] = GEN
SPEC.loader.exec_module(GEN)

TODAY = date(2026, 11, 15)


def fake_vendor(app_dir: Path, look: str, repo_root: Path) -> None:
    """Stand in for the Node vendor command, writing only the pin it would write."""
    (app_dir / "design.json").write_text(f'{{"look": "{look}"}}\n', encoding="utf-8")


def failing_vendor(app_dir: Path, look: str, repo_root: Path) -> None:
    """Fail like a vendor command that exits 1."""
    raise GEN.GenerateError("vendor failed with exit code 1")


def make(tmp_path: Path, **overrides) -> Path:
    """Generate an app from the real template into tmp_path with a stub vendor step."""
    options = {"name": "sample-app", "look": "neutral", "owner": "Sample Owner", "output": tmp_path / "sample-app"}
    options.update(overrides)
    return GEN.generate(GEN.AppOptions(**options), vendor=fake_vendor, git_user=lambda: None, today=lambda: TODAY)


def body_tag(app: Path) -> str:
    """Return the opening body tag of the generated start page."""
    return re.search(r"<body[^>]*>", (app / "src/index.html").read_text(encoding="utf-8")).group(0)


def test_fills_every_placeholder_in_every_template_file(tmp_path):
    app = make(tmp_path, title="Sample App")
    for path in app.rglob("*"):
        if path.is_file():
            text = path.read_text(encoding="utf-8")
            assert not re.search(r"(?<!\\)\{\{[a-z][\w-]*\}\}", text) or path.suffix == ".md", path
    version = GEN.read_version(REPO_ROOT)
    readme = (app / "README.md").read_text(encoding="utf-8")
    assert "# Sample App" in readme
    assert version in (app / "docs/specs/visual-style-guide.md").read_text(encoding="utf-8")
    assert "Copyright (c) 2026 Sample Owner" in (app / "LICENSE.md").read_text(encoding="utf-8")
    assert '"name": "sample-app"' in (app / "package.json").read_text(encoding="utf-8")
    style = (app / "src/css/style.css").read_text(encoding="utf-8")
    assert "@import url('../vendor/design/looks/neutral/index.css');" in style


def test_markdown_files_keep_only_escaped_documentation_placeholders(tmp_path):
    app = make(tmp_path)
    devops = (app / "docs/devops.md").read_text(encoding="utf-8")
    assert "{{task-id}}" in devops
    assert "\\{{" not in devops
    for path in app.rglob("*"):
        if path.is_file():
            assert "\\{{" not in path.read_text(encoding="utf-8"), path


def test_fill_keeps_escaped_placeholders_and_rejects_unknown_ones():
    assert GEN.fill("a \\{{task-id}} b {{look}}", {"look": "warm"}, Path("x.md")) == "a {{task-id}} b warm"
    with pytest.raises(GEN.GenerateError, match=r"x\.md.*\{\{mystery\}\}"):
        GEN.fill("{{mystery}}", {"look": "warm"}, Path("x.md"))


def test_generation_fails_on_an_unfilled_template_placeholder(tmp_path):
    template = tmp_path / "template"
    template.mkdir()
    (template / "README.md").write_text("# {{app-title}} for {{customer}}\n", encoding="utf-8")
    options = GEN.AppOptions(name="demo", look="neutral", owner="Owner", output=tmp_path / "demo")
    with pytest.raises(GEN.GenerateError, match=r"README\.md.*\{\{customer\}\}"):
        GEN.generate(options, template=template, vendor=fake_vendor, git_user=lambda: None, today=lambda: TODAY)
    assert sorted(item.name for item in tmp_path.iterdir()) == ["template"]


def test_select_areas_keeps_matching_blocks_and_drops_markers():
    text = "a\n<!-- if:sidebar -->\nside\n<!-- end:sidebar -->\n<!-- if:!sidebar -->\nnone\n<!-- end:!sidebar -->\nz\n"
    assert GEN.select_areas(text, {"sidebar"}, Path("i.html")) == "a\nside\nz\n"
    assert GEN.select_areas(text, set(), Path("i.html")) == "a\nnone\nz\n"


def test_select_areas_rejects_unclosed_and_unknown_markers():
    with pytest.raises(GEN.GenerateError, match="unclosed"):
        GEN.select_areas("<!-- if:menu -->\nx\n", set(), Path("i.html"))
    with pytest.raises(GEN.GenerateError, match="unknown"):
        GEN.select_areas("<!-- if:footer -->\nx\n<!-- end:footer -->\n", set(), Path("i.html"))


def test_workspace_setup_writes_every_area(tmp_path):
    app = make(tmp_path, scroll="main", nav=("sidebar", "bottom"), action_bar=True, side_panel=True)
    html = (app / "src/index.html").read_text(encoding="utf-8")
    assert body_tag(app) == '<body class="app app--scroll-main">'
    for part in ("app__sidebar", "app__bottom-nav", "app__action-bar", "app__side-panel", "app__title"):
        assert part in html, part
    for part in ("app__menu-button", "app__breadcrumb", "<!--"):
        assert part not in html, part


def test_portal_setup_writes_brand_breadcrumb_and_footer(tmp_path):
    app = make(tmp_path, scroll="page", nav=("breadcrumb",), action_bar=True)
    html = (app / "src/index.html").read_text(encoding="utf-8")
    assert body_tag(app) == '<body class="app app--scroll-page">'
    assert "app__brand" in html and "app__breadcrumb" in html
    assert '<h1 class="app__title"' not in html
    for part in ("app__sidebar", "app__bottom-nav", "app__side-panel", "app__menu-button"):
        assert part not in html, part


def test_minimal_setup_keeps_top_bar_banners_main_and_overlays(tmp_path):
    app = make(tmp_path, scroll="page", width="narrow")
    html = (app / "src/index.html").read_text(encoding="utf-8")
    assert body_tag(app) == '<body class="app app--scroll-page app--width-narrow">'
    for part in ("app__top-bar", "app__banners", 'class="app__main"', "app__overlays", "toast-region", "skip-link"):
        assert part in html, part
    for part in ("app__action-bar", "app__side-panel", "app__sidebar", "app__bottom-nav", "app__menu-button"):
        assert part not in html, part


def test_menu_setup_writes_the_menu_button(tmp_path):
    app = make(tmp_path, nav=("menu",))
    html = (app / "src/index.html").read_text(encoding="utf-8")
    assert "app__menu-button" in html and 'role="menuitem"' in html


@pytest.mark.parametrize(
    ("width", "classes"),
    [("full", "app app--scroll-main"), ("reading", "app app--scroll-main app--width-reading")],
)
def test_shell_classes_map_scroll_and_width(width, classes):
    assert GEN.shell_classes(GEN.AppOptions(name="a", look="neutral", width=width)) == classes


@pytest.mark.parametrize(
    "overrides",
    [
        {"name": "Bad_Name"},
        {"name": "-bad"},
        {"look": "missing"},
        {"look": "_template"},
        {"nav": ("none", "sidebar")},
        {"nav": ("tabs",)},
        {"scroll": "both"},
        {"width": "huge"},
    ],
)
def test_rejects_invalid_options_with_exit_code_two(tmp_path, overrides):
    with pytest.raises(GEN.GenerateError) as error:
        make(tmp_path, **overrides)
    assert error.value.exit_code == 2
    assert not (tmp_path / "sample-app").exists()


def test_rejects_an_existing_output_folder(tmp_path):
    (tmp_path / "sample-app").mkdir()
    with pytest.raises(GEN.GenerateError, match="exists") as error:
        make(tmp_path)
    assert error.value.exit_code == 2


def test_owner_defaults_to_the_git_user(tmp_path):
    options = GEN.AppOptions(name="sample-app", look="warm", output=tmp_path / "sample-app")
    app = GEN.generate(options, vendor=fake_vendor, git_user=lambda: "Git User", today=lambda: TODAY)
    assert "Copyright (c) 2026 Git User" in (app / "LICENSE.md").read_text(encoding="utf-8")


def test_fails_without_owner_or_git_user(tmp_path):
    options = GEN.AppOptions(name="sample-app", look="warm", output=tmp_path / "sample-app")
    with pytest.raises(GEN.GenerateError, match="--owner") as error:
        GEN.generate(options, vendor=fake_vendor, git_user=lambda: None, today=lambda: TODAY)
    assert error.value.exit_code == 2


def test_title_defaults_to_the_name_in_title_case():
    assert GEN.resolve(GEN.AppOptions(name="family-portal", look="warm", owner="o")).title == "Family Portal"


def test_vendor_failure_leaves_no_output_or_temporary_folder(tmp_path):
    options = GEN.AppOptions(name="sample-app", look="neutral", owner="Owner", output=tmp_path / "sample-app")
    with pytest.raises(GEN.GenerateError, match="vendor"):
        GEN.generate(options, vendor=failing_vendor, git_user=lambda: None, today=lambda: TODAY)
    assert list(tmp_path.iterdir()) == []


def test_never_creates_git_or_plan_folders_and_writes_the_project_files(tmp_path):
    app = make(tmp_path)
    assert not (app / ".git").exists() and not (app / ".plan").exists()
    expected = [
        "README.md",
        "CHANGELOG.md",
        "LICENSE.md",
        "AGENTS.md",
        "CLAUDE.md",
        ".gitignore",
        ".editorconfig",
        "package.json",
        "docs/index.md",
        "docs/requirements.md",
        "docs/devops.md",
        "docs/specs/visual-style-guide.md",
        "scripts/bootstrap-dev-environment.py",
        "scripts/devops.py",
        "scripts/requirements.txt",
        ".github/workflows/ci.yml",
        "src/index.html",
        "src/offline.html",
        "src/css/style.css",
        "src/js/main.js",
        "src/manifest.webmanifest",
        "src/service-worker.js",
        "src/demo/visual-style-gallery.html",
        "tests/unit/tokens.test.js",
        "tests/e2e/smoke.spec.js",
        "design.json",
    ]
    missing = [name for name in expected if not (app / name).is_file()]
    assert missing == []
    assert (app / "CLAUDE.md").read_text(encoding="utf-8").strip() == "@AGENTS.md"
    ignored = (app / ".gitignore").read_text(encoding="utf-8").splitlines()
    assert {".plan/", "/PLAN.md", "work/"} <= set(ignored)


def test_template_pins_the_same_support_python_as_this_repository():
    def pin(path: Path) -> str:
        return next(line for line in path.read_text(encoding="utf-8").splitlines() if line.startswith("support-python"))

    assert pin(REPO_ROOT / "template/scripts/requirements.txt") == pin(REPO_ROOT / "scripts/requirements.txt")


def test_devops_registers_the_generate_app_action():
    spec = importlib.util.spec_from_file_location("devops_under_test", REPO_ROOT / "scripts/devops.py")
    devops = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(devops)
    assert "generate-app" in devops.build_cli().harness._actions


def test_cli_rejects_a_bad_app_name_with_exit_code_two(tmp_path):
    result = subprocess.run(
        [sys.executable, str(REPO_ROOT / "scripts/devops.py"), "generate-app", "Bad_Name", "--look", "neutral"]
        + ["--owner", "Owner", "-o", str(tmp_path / "app")],
        capture_output=True,
        text=True,
        check=False,
    )
    assert result.returncode == 2, result.stdout + result.stderr
    assert "app name" in (result.stdout + result.stderr).lower()
    assert not (tmp_path / "app").exists()
