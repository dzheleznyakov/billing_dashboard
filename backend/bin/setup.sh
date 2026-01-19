#!/bin/bash

set -e

echo "Initialising project setup (backend)..."

# 1. Check for Python 3
if ! command -v python3 &> /dev/null; then
    echo "Error: Python 3 is not installed. Please install it first."
    exit 1
fi

# 2. Create virtual environment if it doesn't exist
if [ ! -d ".venv" ]; then
    echo "Creating virtual environment (.venv)..."
    python3 -m venv .venv
else
    echo "Virtual environment already exists."
fi

# 3. Activate the environment
echo "Activating environment..."
source .venv/bin/activate

# 4. Upgrade pip and install dependencies
echo "Installing dependencies..."
pip install --upgrade pip
if [ -f "requirements.txt" ]; then
    pip install -r requirements.txt
elif [ -f "pyproject.toml" ]; then
    # If you have pyproject.toml but no requirements.txt, 
    # this will install your dependencies in the venv
    pip install .
else
    echo "Warning: No dependency file found. Skipping installation."
fi

echo "Working dir: ${pwd}"
echo ""
echo "Setup complete!"
echo "-------------------------------------------------------"
echo "To start development, run (from the backend folder):"
echo "  source .venv/bin/activate"
echo "  uvicorn main:app --reload --log-level debug --port 5000"
echo ""
echo "To run tests:"
echo "  python -m pytest"
echo "-------------------------------------------------------"
