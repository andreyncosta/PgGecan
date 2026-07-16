# PgGecan — Branch Network Executive Dashboard

Internal analytics dashboard built for **GECAN** (Channel Strategy team at BRB, Banco de Brasília) to support strategic decision-making around the bank's branch and service point network.

---

## Overview

BRB operates a distributed network of branches, ATMs, and correspondent banking points across the Federal District and surrounding states. This dashboard centralizes branch-level operational data into a single interface, enabling the channel strategy team to run viability analyses, compare peer performance, and track network evolution over time.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React · TypeScript · Vite · Tailwind CSS · shadcn/ui |
| Backend | Django 5 · Django REST Framework · SQLite |
| Build | Vite (frontend) · Python venv (backend) |

## Architecture

```
┌───────────────────────────────┐
│  React + Vite (TypeScript)    │
│  Tailwind CSS · shadcn/ui     │
│  → proxies /api to Django     │
└──────────────┬────────────────┘
               │ HTTP
┌──────────────▼────────────────┐
│  Django REST API              │
│  GET /api/unidades            │
│  GET /api/unidades/<id>       │
└──────────────┬────────────────┘
               │
┌──────────────▼────────────────┐
│  SQLite (gecan.db)            │
│  Branch network data          │
└───────────────────────────────┘
```

## Getting Started

### Backend (Django)

```bash
python -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scriptsctivate
pip install -r requirements.txt
python manage.py migrate
python scripts/seed_from_json.py  # populate from JSON seed data
python manage.py runserver        # API at http://127.0.0.1:8000
```

**Environment variables:** Django reads `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, `GECAN_DB`, and `GECAN_CORS` directly from the process environment (see `config/settings.py`). Unlike the frontend, there's no `.env` autoloading here — export these in your shell or process manager before running `manage.py`. `env.example` documents each variable and includes the command to generate a key. The built-in `SECRET_KEY` fallback is fine for local development only; **for any production deployment, set `DJANGO_SECRET_KEY` explicitly** and confirm `DJANGO_DEBUG` is unset or `0`.

### Frontend (Vite)

```bash
npm install
cp env.example .env.local
# set VITE_UNIDADES_JSON_URL=/api/unidades to use the Django backend
npm run dev
```

### Production build

```bash
npm run build   # output in dist/
```

## API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/unidades` | List all branch units |
| `GET` | `/api/unidades/<id>` | Branch detail |

Response format: camelCase JSON.

---

**Built by [Andrey Costa](https://andreycosta.com) — GECAN / BRB**

