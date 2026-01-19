# Usage Dashboard – Take-Home Exercise

This repository contains a small full-stack implementation of a usage dashboard:

- **Backend**: Python (FastAPI) API that aggregates usage and credit data
- **Frontend**: React dashboard that visualises usage in a table and chart

For implementation details, see:

- [backend/README.md](backend/README.md)
- [frontend/README.md](frontend/README.md)

---

## Initialise the project

This project contains both backend and frontend components.

```bash
chmod +x setup.sh
./setup.sh
```

This will:

- Create and initialise a Python virtual environment for the backend
- Install frontend dependencies via npm

---

# How to run

## Start the backend

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload --log-level debug --port 5000
```

The backend will be available at http://127.0.0.1:5000.

## Start the frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at http://127.0.0.1:5001.
