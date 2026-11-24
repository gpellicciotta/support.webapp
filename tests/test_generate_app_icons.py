"""Verify the app icon generator: renditions, opaque plates, safe zones, notices, and the committed icon files."""

import importlib.util
import re
import sys
from pathlib import Path

import pytest

REPO_ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location("generate_app_icons", REPO_ROOT / "scripts/generate-app-icons.py")
GEN = importlib.util.module_from_spec(SPEC)
sys.modules["generate_app_icons"] = GEN
SPEC.loader.exec_module(GEN)

ICONS = REPO_ROOT / "src/img/app-icons"
# Farthest hexagon point from the center: polygon radius plus the round join of half the stroke.
HEX_EXTENT = GEN.HEX_R + GEN.HEX_STROKE / 2


def test_png_sizes_cover_favicons_toolbars_and_install_icons():
    assert {16, 32, 48, 96, 192, 512} <= set(GEN.PNG_SIZES)


def test_renditions_name_touch_and_maskable_icons():
    names = GEN.rendition_names("todos")
    assert "todos-icon.svg" in names
    assert "todos-icon.ico" in names
    assert "todos-icon-16.png" in names
    assert "todos-apple-touch-icon.png" in names
    assert "todos-icon-maskable-192.png" in names
    assert "todos-icon-maskable-512.png" in names


@pytest.mark.parametrize(
    "variant, plate",
    [
        ("blue-flat", "#ffffff"),
        ("blue-dimensional", "#ffffff"),
        ("white-flat", "#0a1626"),
        ("white-dimensional", "#0a1626"),
    ],
)
def test_plates_are_opaque_and_contrast_with_the_hexagon(variant, plate):
    assert GEN.PLATES[variant] == plate
    svg = GEN.build("todos", variant, "t", plate=GEN.PLATES[variant], scale=GEN.MASKABLE_SCALE)
    assert f'<rect width="100" height="100" fill="{plate}"/>' in svg


def test_unplated_icons_keep_a_transparent_background():
    assert "<rect width=" not in GEN.build("todos", "blue-flat", "t")


def test_maskable_icons_keep_the_hexagon_inside_the_safe_zone():
    # The maskable safe zone is a centered circle with a radius of 40% of the icon size.
    assert GEN.MASKABLE_SCALE * HEX_EXTENT <= 40
    svg = GEN.build("auth", "blue-dimensional", "t", plate="#ffffff", scale=GEN.MASKABLE_SCALE)
    assert f"scale({GEN.MASKABLE_SCALE})" in svg


def test_touch_icons_leave_room_for_rounded_corners():
    assert GEN.TOUCH_SIZE == 180
    assert GEN.TOUCH_SCALE * HEX_EXTENT <= 40


def test_only_the_todos_icon_carries_the_lucide_notice():
    todos = GEN.build("todos", "blue-flat", "t")
    assert "Lucide" in todos
    assert "ISC License" in todos
    assert "copyright notice and this permission notice appear in all copies" in todos
    assert "Lucide" not in GEN.build("meteo", "blue-flat", "t")


def test_requirements_declare_pillow_for_the_generator():
    requirements = (REPO_ROOT / "scripts/requirements.txt").read_text(encoding="utf-8")
    assert re.search(r"^pillow>=", requirements, re.IGNORECASE | re.MULTILINE)


@pytest.mark.parametrize("variant", GEN.VARIANTS)
def test_hiscores_is_generated_in_every_style(variant):
    assert "hiscores" in GEN.APPS
    svg = GEN.build("hiscores", variant, "t")
    assert 'aria-label="hiscores icon"' in svg
    assert all((ICONS / variant / name).is_file() for name in GEN.rendition_names("hiscores"))


@pytest.mark.parametrize("variant", GEN.VARIANTS)
def test_committed_icons_hold_every_rendition(variant):
    missing = [
        f"{variant}/{name}"
        for app in GEN.APPS
        for name in GEN.rendition_names(app)
        if not (ICONS / variant / name).is_file()
    ]
    assert missing == []
