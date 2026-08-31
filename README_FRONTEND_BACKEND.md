# WorkBridge — Run Instructions

This workspace contains the backend (FastAPI) and frontend (Vite + React + TypeScript)

Backend

1. Create a virtual environment and install dependencies (use the `backend/requirements.txt`).

```powershell
cd backend
python -m venv .venv
. .venv/Scripts/Activate.ps1
pip install -r requirements.txt
```

2. Create a `.env` file with `DATABASE_URL`, `SECRET_KEY`, etc., matching `backend/app/core/config.py`.

3. Run the backend

```powershell
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Frontend

1. Install dependencies

```bash
cd frontend
npm install
```

2. Start dev server

```bash
npm run dev
```

3. Build

```bash
npm run build
```

Notes

- Frontend expects backend at `http://127.0.0.1:8000` by default; override with `VITE_API_BASE` env var.
- WebSockets connect to `ws://127.0.0.1:8000/ws/{assignment_id}?token=<jwt>` — token is stored in `localStorage` as `wb_token`.
- The repo includes a simple AI assistant endpoint at `/ai/ask` (see `backend/app/api/routes/ai.py`) which is a minimal stub.
