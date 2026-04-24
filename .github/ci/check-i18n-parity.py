#!/usr/bin/env python3
"""Check i18n key parity between en.json and de.json.

Flattens nested JSON to dot-notation keys, then compares both sets.
Exits 0 if keys match, 1 if there is a difference.
"""

import json
import os
import sys

I18N_DIR = os.path.join(os.path.dirname(__file__), "..", "..", "src", "i18n")
EN_PATH = os.path.join(I18N_DIR, "en.json")
DE_PATH = os.path.join(I18N_DIR, "de.json")


def flatten(obj, prefix=""):
    """Flatten a nested dict into {dot.separated.key: value} pairs."""
    items = {}
    for key, value in obj.items():
        full_key = f"{prefix}.{key}" if prefix else key
        if isinstance(value, dict):
            items.update(flatten(value, full_key))
        else:
            items[full_key] = value
    return items


def load_and_flatten(path, label):
    """Load a JSON file and return its flattened key set."""
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as exc:
        print(f"::error file={os.path.relpath(path)}::Invalid JSON in {label}: {exc}")
        sys.exit(1)
    except FileNotFoundError:
        print(f"::error file={os.path.relpath(path)}::{label} not found at {path}")
        sys.exit(1)
    return set(flatten(data).keys())


def main():
    en_keys = load_and_flatten(EN_PATH, "en.json")
    de_keys = load_and_flatten(DE_PATH, "de.json")

    only_en = en_keys - de_keys
    only_de = de_keys - en_keys

    if only_en:
        print(f"::error file=src/i18n/en.json::Keys only in en.json: {sorted(only_en)}")
    if only_de:
        print(f"::error file=src/i18n/de.json::Keys only in de.json: {sorted(only_de)}")

    if only_en or only_de:
        print(
            f"i18n key parity check failed: "
            f"{len(only_en)} key(s) only in en, {len(only_de)} key(s) only in de"
        )
        sys.exit(1)

    print(f"✅ i18n key parity check passed ({len(en_keys)} keys match)")


if __name__ == "__main__":
    main()
