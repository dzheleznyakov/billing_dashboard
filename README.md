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

## How to run

### Start the backend

```bash
cd backend
source .venv/bin/activate
uvicorn main:app --reload --log-level debug --port 5000
```

The backend will be available at http://127.0.0.1:5000.

### Start the frontend

```bash
cd frontend
npm run dev
```

The frontend will be available at http://127.0.0.1:5001.

---

---

## Backend – Design Decisions

### API shape and contract

- The `/usage` endpoint strictly follows the response contract defined in the task.
- Fields are included or omitted explicitly (e.g. report_name only when applicable) to avoid ambiguity for downstream consumers.
- Any unexpected backend failure results in a 503 with a stable error shape.

### Credit calculation

For non-report messages, token usage is estimated using the provided heuristic (1 token ≈ 4 characters) to mirror LLM cost drivers without introducing model-specific dependencies.
Credits are:

- calculated deterministically,
- rounded to 2 decimal places, and
- clamped to a minimum of 1.00.

Token count is rounded up to reflect the discrete nature of tokens.

### Report resolution and caching

Report metadata is fetched lazily and cached in-memory for the lifetime of the process. This avoids repeated network calls when multiple messages reference the same report ID, while keeping the implementation simple and predictable.

If a report lookup fails (e.g. 404 or invalid report_id), the system safely falls back to text-based credit calculation rather than failing the entire request.

## Error handling philosophy

The backend follows a fail-soft per message, fail-fast per request approach:

- Individual message issues (invalid report_id, missing report) degrade gracefully.
- System-level failures (message fetch unavailable) fail the request with a clear error response.

This ensures partial data issues do not block the entire usage report.

The upstream API contracts are treated as follows:

- For `/messages/current-period` we assume that individual message report entries have
  - `report_id` field as optional;
  - all other fields as mandatory.
- For `/reports/:id` we assume that
  - all fields are mandatory.

If a mandatory field is missing, it's treated as a general failure, and the `/usage` endpoint will result to the `503` response.

### Concurrency model

The API is implemented using FastAPI with async I/O. External calls are non-blocking, and shared state is limited to a simple cache, avoiding concurrency hazards for this scope.

The calls for the upstream endpoint `/reports/:id` are made **sequentially**, which is sufficient for this exercise.
A natural next step would be to resolve reports **in parallel with bounded concurrency** to reduce latency under higher volumes.

### Scope decisions

- No persistent storage was introduced; all data is derived from upstream APIs.
- No authentication or rate limiting was added, as endpoints are explicitly unauthenticated in the task.
- Validation is intentionally minimal and focused on contract safety rather than full schema enforcement.
