#!/bin/bash

set -e

echo "Initialising project setup (frontend)..."

# 1. Verify Node.js presence and version
if ! command -v node &> /dev/null; then
    echo "Error: Node.js is not installed."
    exit 1
fi

# 2. Verify npm presence
if ! command -v npm &> /dev/null; then
    echo "Error: npm is not installed."
    exit 1
fi

echo "Environment: Node $(node -v), npm $(npm -v)"

# 3. Check for package.json
if [ ! -f "package.json" ]; then
    echo "Error: package.json not found in current directory."
    exit 1
fi

# 4. Install Dependencies
if [ -f "package-lock.json" ]; then
    echo "Installing dependencies using package-lock.json..."
    npm ci
else
    echo "Installing dependencies using package.json..."
    npm install
fi

echo "Working dir: ${pwd}"
echo ""
echo "Setup complete!"
echo "-------------------------------------------------------"
echo "To start development, run:"
echo "  npm run dev"
echo ""
echo "To run tests:"
echo "  npm run test"
echo "-------------------------------------------------------"
