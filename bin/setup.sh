#!/bin/bash

set -e

echo "Initialising project setup..."

ROOT_DIR="$PWD"

BACKEND_SETUP="$ROOT_DIR/backend/bin/setup.sh"
FRONTEND_SETUP="$ROOT_DIR/frontend/bin/setup.sh"
BACKEND_START="$ROOT_DIR/bin/start_backend.sh"
FRONTEND_START="$ROOT_DIR/bin/start_frontend.sh"

[ -f "$BACKEND_SETUP" ] || { echo "Missing: $BACKEND_SETUP"; exit 1; }
[ -f "$FRONTEND_SETUP" ] || { echo "Missing: $FRONTEND_SETUP"; exit 1; }

chmod +x "$BACKEND_SETUP" "$FRONTEND_SETUP" "$BACKEND_START" "$FRONTEND_START"

cd $ROOT_DIR/backend
"$BACKEND_SETUP"
cd ..

cd $ROOT_DIR/frontend
"$FRONTEND_SETUP"
cd ..
