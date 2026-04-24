#!/usr/bin/env python3
"""Validate manifest.json: required keys + file reference existence.

Exits 0 on success, 1 on any error. Uses GitHub Actions ::error annotations
so failures appear inline in PR diffs.
"""

import json
import os
import sys

REQUIRED_KEYS = ["id", "name", "version", "author", "description", "pages", "apiRoutes"]
MANIFEST_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "manifest.json")


def main():
    # --- Parse manifest.json ---
    try:
        with open(MANIFEST_PATH, "r", encoding="utf-8") as f:
            manifest = json.load(f)
    except json.JSONDecodeError as exc:
        print(f"::error file=manifest.json::Invalid JSON: {exc}")
        sys.exit(1)
    except FileNotFoundError:
        print(f"::error file=manifest.json::manifest.json not found at {MANIFEST_PATH}")
        sys.exit(1)

    errors = 0

    # --- Required top-level keys ---
    for key in REQUIRED_KEYS:
        if key not in manifest:
            print(f"::error file=manifest.json::Missing required top-level key: {key}")
            errors += 1

    # --- Validate pages[].component file references ---
    for i, page in enumerate(manifest.get("pages", [])):
        component = page.get("component", "")
        if component and not os.path.exists(component):
            print(
                f"::error file=manifest.json::pages[{i}].component references "
                f"non-existent file: {component}"
            )
            errors += 1

    # --- Validate apiRoutes[].handler file references ---
    for i, route in enumerate(manifest.get("apiRoutes", [])):
        handler = route.get("handler", "")
        if handler and not os.path.exists(handler):
            print(
                f"::error file=manifest.json::apiRoutes[{i}].handler references "
                f"non-existent file: {handler}"
            )
            errors += 1

    # --- Validate botHooks file exists if declared ---
    bot_hooks = manifest.get("botHooks", [])
    if bot_hooks:
        hooks_path = os.path.join("src", "bot", "hooks.ts")
        if not os.path.exists(hooks_path):
            print(
                f"::error file=manifest.json::botHooks declared but "
                f"handler file missing: {hooks_path}"
            )
            errors += 1

    if errors:
        print(f"::error file=manifest.json::Manifest validation failed with {errors} error(s)")
        sys.exit(1)

    print("✅ manifest.json validation passed")


if __name__ == "__main__":
    main()
