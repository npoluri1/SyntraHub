# SyntraHub — AGENTS.md

## Stack

- **Backend**: Python 3.11+ / FastAPI + SQLAlchemy ORM + SQLite
- **Frontend**: React SPA (CRA, react-scripts 5) — served as static files by FastAPI at `/`
- **Mobile**: React Native (Expo 50)
- **AI**: sentence-transformers (all-MiniLM-L6-v2) + ChromaDB vector store
- **Scheduler**: APScheduler — daily notifications at NOTIFICATION_TIME (default 08:30 IST)
- **Notifications**: SMTP email, Telegram bot, Twilio WhatsApp
- **Deploy**: Render (Python web service, free tier, Oregon)

## Entrypoints

| Layer | Entry | Command |
|-------|-------|---------|
| Server | `backend/main.py` (uvicorn) | `python run.py` or `uvicorn backend.main:app --reload` |
| Frontend dev | `frontend/src/App.js` | `cd frontend && npm start` (separate CRA dev server) |
| Frontend build | — | `cd frontend && npm run build` (output to `frontend/build/`) |
| Mobile | `mobile/App.js` | `cd mobile && npx expo start` |
| Seed data | `backend/data/seed_catalog.py` | Runs automatically on server startup |

## Key Architecture Facts

- **Config**: `backend/config.py` reads `.env` via pydantic-settings. DB defaults to SQLite at `backend/data/books_daily.db`.
- **On startup** (`backend/main.py`): `init_db()` → `start_scheduler()` → seed catalog/shipping/cricket → index ChromaDB.
- **API docs** at `/docs`, health check at `/api/health`.
- **16 route files** in `backend/routes/` — catalog, store, social, events, payments, smarthome, rewards, ai_content, etc.
- **Database models** in `backend/database/models.py` (724 lines, 38 SQLAlchemy models — Book, Product, Order, SocialPost, Event, SmartDevice, UserAchievement, etc.).
- **Seed data** (`backend/data/seed_catalog.py`) generates 75+ books, 30 electronics, 30 clothing, 10+ playlists with 40+ videos across YouTube/TikTok/Instagram/Facebook/Shorts, 15+ podcasts. Images use `picsum.photos` (no API key needed).
- **Mobile** hardcodes `API_BASE = 'http://localhost:8000'` — change for production.
- **GLOBAL_SUPER_APP_PROMPT.md** is an aspirational roadmap — the actual codebase is simpler (multi-product catalog + schedules + notifications working).

## Setup

```bash
copy .env.example .env   # then edit with credentials
start.bat                # creates venv, installs deps, seeds data, starts server
```

## CI (`.github/workflows/ci.yml`)

- **Backend**: Python 3.12, `pip install -r backend/requirements.txt`, `python -c "from backend.main import app; print('OK')"` — import check only, no tests.
- **Frontend**: Node 20, `npm ci`, `npm run build` — build check only.
- **Deploy**: Triggers Render deploy hook on master push (after backend + frontend pass).
- **No test/lint/typecheck jobs** exist anywhere in the repo.

## Constraints & Gotchas

- **No tests** across the entire repo (backend, frontend, or mobile).
- **No lint or typecheck configuration** — `ruff`, `mypy`, `eslint`, `prettier` not present.
- `start.bat` does NOT use `backend/requirements.txt` — it pip-installs deps in three separate groups (core, excel, notifications/AI).
- `python run.py` launches without `--reload`; use `uvicorn backend.main:app --reload` for hot reload during dev.
- Frontend build (`npm run build`) must succeed for the full-stack server to serve the UI.
- `sentence-transformers`, `chromadb`, `numpy` are **not** in `backend/requirements.txt` — they're optional heavy deps installed only via `start.bat` (with `2>nul` error silencing). The code guards all optional imports via try/except.
- `sentence-transformers` downloads ~80MB model on first use — very slow cold start.
- ChromaDB persistence at `backend/data/chroma_db/` — delete to re-index.
- `GLOBAL_SUPER_APP_PROMPT.md` and `SyntraHub_Resources.md` are prose references, not executable docs.
