#!/usr/bin/env bash
# Local smoke-test wrapper — runs all pre-push validators sequentially.
# Usage: bash .github/ci/validate-manifest.sh

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== Running manifest validator ==="
python3 "$SCRIPT_DIR/validate-manifest.py"

echo ""
echo "=== Running i18n key parity check ==="
python3 "$SCRIPT_DIR/check-i18n-parity.py"

echo ""
echo "✅ All local validators passed"
