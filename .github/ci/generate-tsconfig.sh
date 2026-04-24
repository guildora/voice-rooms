#!/usr/bin/env bash
# Generate a minimal tsconfig.ci.json for TypeScript syntax checking.
# This is intentionally minimal — no host types, no strict mode.
# Goal: catch syntactically broken .ts files early, not full Nuxt/Nitro type integration.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
ROOT_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
OUTPUT="$ROOT_DIR/tsconfig.ci.json"

cat > "$OUTPUT" << 'TSCONFIG'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": false,
    "noEmit": true,
    "skipLibCheck": true,
    "allowJs": false,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "verbatimModuleSyntax": true
  },
  "include": ["src/**/*.ts"]
}
TSCONFIG

echo "✅ Generated tsconfig.ci.json at $OUTPUT"
