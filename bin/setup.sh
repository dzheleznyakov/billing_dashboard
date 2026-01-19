#!/bin/bash

set -e

echo "Initialising project setup..."

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Initialising project setup..."

BACKEND_SETUP="$ROOT_DIR/backend/bin/setup.sh"
FRONTEND_SETUP="$ROOT_DIR/frontend/bin/setup.sh"

[ -f "$BACKEND_SETUP" ] || { echo "Missing: $BACKEND_SETUP"; exit 1; }
[ -f "$FRONTEND_SETUP" ] || { echo "Missing: $FRONTEND_SETUP"; exit 1; }

chmod +x "$BACKEND_SETUP" "$FRONTEND_SETUP"

"$BACKEND_SETUP"
"$FRONTEND_SETUP"
