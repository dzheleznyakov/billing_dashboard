cd backend
source .venv/bin/activate
uvicorn main:app --reload --log-level debug --port 5000