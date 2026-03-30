# PgGecanPython (GECAN)

Painel executivo com **React + Vite + TypeScript** no frontend e **Django** servindo a API de leitura sobre **SQLite** (`gecan.db`).

## Requisitos

- Python 3.10+
- Node.js e npm (para o frontend; **não é necessário nvm**)

### Node.js sem nvm

O projeto não depende de **nvm** (nem de fnm, volta, etc.). Qualquer instalação suportada de Node.js com `npm` no `PATH` serve.

No **Windows**, opções comuns quando nvm está bloqueado por política:

1. **Instalador oficial** — [nodejs.org](https://nodejs.org/) (LTS), MSI para o usuário ou para todos.
2. **winget** (se permitido): `winget install OpenJS.NodeJS.LTS`
3. **Distribuição corporativa** — pacote aprovado pela TI (MSI/portable); depois confira no terminal: `node -v` e `npm -v`.

O backend Django roda só com Python; só o passo `npm install` / `npm run dev` exige Node.

## Backend (Django)

```powershell
cd <este repositório>
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r requirements.txt
python manage.py migrate
```

Criar o banco e popular (opcional):

```powershell
python scripts\seed_from_json.py
```

Ou use `python scripts\init_db.py` apenas se não for usar migrações do Django no mesmo arquivo; o fluxo recomendado com Django é só `migrate` + `seed_from_json.py`.

Se você já tem um `gecan.db` criado por `init_db.py` e as tabelas existem, alinhe o histórico do Django com:

```powershell
python manage.py migrate --fake-initial
```

Subir o servidor (API em `http://127.0.0.1:8000`):

```powershell
python manage.py runserver
```

Endpoints: `GET /api/health`, `GET /api/unidades`, `GET /api/unidades/<id>` — mesmo formato JSON (camelCase) que o app React espera.

Variáveis úteis: `GECAN_DB` (caminho do SQLite), `GECAN_CORS` (origens permitidas, separadas por vírgula), `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`.

## Frontend (Vite)

```powershell
npm install
npm run dev
```

Por padrão os dados vêm de `public/data/unidades.json`. Para usar a API Django enquanto desenvolve, copie `env.example` para `.env.local` e defina `VITE_UNIDADES_JSON_URL=/api/unidades`. O `vite.config.ts` encaminha `/api` para `http://127.0.0.1:8000`.

## Build estático do front

```powershell
npm run build
```

O resultado fica em `dist/`.

## Stack

- Vite, React, TypeScript, Tailwind, shadcn-ui
- Django 5, django-cors-headers, SQLite
