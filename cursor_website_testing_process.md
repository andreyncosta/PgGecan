# Website testing process
_Exported on 3/30/2026 at 01:47:53 GMT-3 from Cursor (2.6.22)_

---

**User**

Show me how to test this site.

---

**Cursor**


Exploring the project to identify its structure and any testing setup.




Verifying tests run:




Here’s how testing works in this project (Vite + React + **Vitest**).

## 1. Install dependencies (once)

If you haven’t run this yet, tests won’t find `vitest` in `node_modules`:

```powershell
Set-Location "c:\Users\andre\OneDrive\Documentos\PgGecan"
npm install
```

## 2. Automated tests (Vitest)

| Command | What it does |
|--------|----------------|
| `npm test` | Runs all tests once (`vitest run`). |
| `npm run test:watch` | Watches files and re-runs tests when you save. |

Tests live under `src/` with names like `*.test.ts`, `*.test.tsx`, `*.spec.ts`, or `*.spec.tsx` (see `vitest.config.ts`). Setup is in `src/test/setup.ts` (Jest DOM matchers + a `matchMedia` stub for the browser environment).

Example file: `src/test/example.test.ts`.

For React components you can use `@testing-library/react` (already in `package.json`) inside those test files.

## 3. Manual / browser testing

| Command | What it does |
|--------|----------------|
| `npm run dev` | Dev server with hot reload (usual way to click through the site). |
| `npm run build` then `npm run preview` | Serves the production build locally to check the built app. |

## 4. Lint (optional)

`npm run lint` runs ESLint over the project; it’s static analysis, not the same as Vitest.

---

**Note:** On your machine, `npm test` failed until `npm install` ran because `vitest` was not installed. After install, the suite passed (1 test in `example.test.ts`).

---

**User**

is there a way to rewrite this project as a flask/django?

---

**Cursor**


Yes. You can move the app to Flask or Django, but it isn’t a mechanical “convert” — you’re choosing how much of the **current React UI** you keep vs rebuild.

## What you have now

A **Vite + React** SPA: UI runs in the browser, routing is client-side (`react-router-dom`), styling is Tailwind/shadcn. There is **no Python** in this repo; any backend would be separate or not present yet.

## Three realistic directions

### 1. **Full rewrite: Django or Flask as the “whole site”**

- **Django**: URLs → views → **templates** (or Django’s form layer). Interactivity can be classic forms, or **HTMX/Alpine** for partial updates without a big JS bundle.
- **Flask**: Jinja2 templates + blueprints; same idea.

You’d **rebuild screens and behavior** in HTML + server logic. Same *product*, new *implementation*. Feasible and common; effort scales with how many pages, forms, and integrations exist.

### 2. **Python API + keep (or trim) the frontend**

- **Django REST Framework** or **Flask** (or FastAPI) exposes JSON APIs.
- The React app stays as the UI and calls those endpoints (or you gradually replace pages with server-rendered HTML).

This is “Flask/Django **for the backend**,” not replacing the React app unless you later delete it.

### 3. **Hybrid**

- Django/Flask serves **some** routes as server-rendered pages and **some** as API for a small React bundle, or embeds React only where needed.

## Trade-offs (short)

| Approach | Pros | Cons |
|----------|------|------|
| Server templates + HTMX | One stack (Python), simpler deploy for many apps | Rebuild UI; different from shadcn component model |
| API + existing React | Reuse current UI | Two runtimes, CORS/auth design |
| Full template rewrite | No Node for serving UI | Largest upfront rewrite |

## Bottom line

**Yes — you can “rewrite” it as Flask or Django**, usually meaning **server-rendered Python + templates** (and optional HTMX), or **Python APIs** with or without keeping React. There’s no drop-in tool that turns this Vite repo into Django/Flask; it’s a **deliberate reimplementation** (or a **backend** added alongside the current frontend).

If you say whether you care more about **dropping Node from production** vs **keeping the React UI**, the next step is a concrete architecture (e.g. Django + HTMX vs DRF + current `npm run build` assets).

---

**User**

What are the pros and cons of changing this project to python?

---

**Cursor**


Here’s a practical **pros / cons** view for “changing this project to Python,” assuming you mean **Flask or Django** (and optionally replacing or shrinking the React UI).

## Pros

- **One primary language on the server** — business logic, auth, DB access, jobs, and APIs in Python; easier for teams that already prefer Python.
- **Strong backend ecosystems** — Django (batteries-included: ORM, admin, auth patterns) or Flask (small core, add what you need); mature libraries for Postgres, Redis, Celery, etc.
- **Easier integration with data / ML / scripts** — if you later need pandas, notebooks, or ML services, Python fits naturally next to the app.
- **Ops patterns you may already know** — gunicorn/uvicorn + reverse proxy, systemd/Docker, many hosting options; Django in particular has a lot of deployment documentation.
- **Server-rendered option** — if you move UI to templates + HTMX (or plain forms), you can **ship less JavaScript** and simplify some apps (forms, CRUD, internal tools).

## Cons

- **Not a refactor — it’s a rewrite (or a big split)** — Your UI is **React + Vite + shadcn**. Moving “to Python” usually means **new templates** or **keeping React and only moving the backend**; either way, the current React code doesn’t become Python automatically.
- **Losing (or duplicating) the React/shadcn investment** — If you drop React for Django templates, you rebuild components and styling; if you keep React, you still maintain **two** stacks (Python API + JS build).
- **Different frontend model** — Client-side routing, instant transitions, and rich component libraries work differently with classic server-rendered pages unless you add HTMX/JS or keep a SPA.
- **Tooling split** — You’ll juggle **Python** (venv, pip/poetry, pytest) and possibly still **Node** (if React stays), plus CI for both.
- **Hiring / speed tradeoff** — If your team is faster in TypeScript/React, a Python rewrite can **slow delivery** until the new stack is stable.

## How to read it

| Your goal | Lean toward |
|-----------|-------------|
| **Python for APIs only**, keep the current UI | Pros dominate on backend; cons are “two stacks” and API design. |
| **Replace the SPA with Django/Flask + templates** | Pros on simplicity/deploy for some apps; cons are **full UI rewrite** and losing React’s ecosystem unless you replicate patterns. |

**Bottom line:** Python shines for **server logic, data, and long-term backend maintenance**. The main **cost** is **reimplementation** (or maintaining **Python + React** together), not a magical swap from Vite to Flask/Django.

---

**User**

I'll keep the current framework. What I want now is to make all the data come from an database gecan.db which I'll fill with multiple tables covering all the data needed. The idea is to make and update the db with python, while the rest of the project runs in whatever it's running.

---

**Cursor**


Exploring the project to locate data sources and app structure so we can add `gecan.db`, Python tooling to manage it, and an API the React app can call.




Implementing a Python FastAPI service for `gecan.db`, database initialization scripts, and wiring the React app to fetch data via an API. Checking app entry and page usage patterns.




Implementing the SQLite + FastAPI backend, Python DB tooling, and switching the React app to fetch from the API. Exporting seed JSON from the current mock data, then removing the large in-repo dataset.




Implementing the stack: a FastAPI service reading `gecan.db`, Python scripts to initialize and seed the DB, Vite proxy, and React hooks. Exporting current mock data to JSON, then slimming `mock-data.ts`.




Fixing the seed script: correcting the INSERT to match 66 columns.




Creating the export script, running it to generate the seed file, then slimming `mock-data.ts` and updating pages.



---

**User**

please generate an excel template for the tables created for the schema.sql

---

**Cursor**


Creating a Python script using `openpyxl` to generate an Excel workbook with sheets matching `schema.sql`, then running it to produce the template file.




Fixing sheet order: `_schema_info` was inserted at index 0 and pushed `unidades` aside. Placing `unidades` first and moving `_schema_info` to the end.




Here’s what was added.

## File

**[templates/gecan_schema_template.xlsx](c:\Users\andre\OneDrive\Documentos\PgGecan\templates\gecan_schema_template.xlsx)** — workbook aligned with `db/schema.sql`.

### Sheets

1. **`unidades`** — One column per field in `CREATE TABLE unidades`.  
   - **Row 1:** column names (same as in SQLite, snake_case).  
   - **Row 2:** short type/notes (SQLite types + a few hints).  
   - **Row 3+:** empty for your data (pane frozen at `A3`).

2. **`meta`** — Columns `key` and `value` for the `meta` table.

3. **`_schema_info`** — Short note that the file mirrors `gecan.db` / `schema.sql`.

Header row uses a dark background so it’s easy to see in Excel.

## Regenerating after schema changes

```powershell
Set-Location "c:\Users\andre\OneDrive\Documentos\PgGecan"
pip install -r requirements.txt
python scripts/generate_excel_template.py
```

`openpyxl` is listed in `requirements.txt`, and the generator lives in `scripts/generate_excel_template.py` so you can keep the Excel file in sync when you alter `schema.sql`.

---

**User**

now create random data from 100 agencies and fill the template

---

**Cursor**


Creating a Python script to generate 100 randomized agency rows and write them into the Excel template. Checking the template generator and schema for exact column order.




Adding a script to generate 100 randomized agency rows and save a filled workbook (keeping the empty template intact).




Here’s what was added and generated.

## Script

**`scripts/fill_template_random_agencies.py`**

- Opens **`templates/gecan_schema_template.xlsx`** (headers + type row on row 2).
- Writes **100 rows** of random but plausible data starting at **row 3** on the **`unidades`** sheet.
- Uses **`random.Random(42)`** so runs are repeatable.
- Fills **`meta`** with two sample rows (`sample_seed`, `gerado_em`).
- Saves to **`templates/gecan_100_agencias_aleatorias.xlsx`** (the original empty template is unchanged).

Random fields include:

- Mix of **Agência / PA / Escritório de Negócios** names, **UFs**, **RAs**, **códigos** (4 digits).
- Financial and volume fields in ranges similar to your domain (produção, resultado, RLA, carteiras, etc.).
- **dentro_orgao** mostly 0, sometimes 1 (about 8%).
- Horários e textos em **pt-BR**.

## Output file

**`templates/gecan_100_agencias_aleatorias.xlsx`**

Regenerate anytime:

```powershell
Set-Location "c:\Users\andre\OneDrive\Documentos\PgGecan"
python scripts/fill_template_random_agencies.py
```

Requires **`openpyxl`** (already in `requirements.txt`).

---

**User**

What's the stept by step to provide the solution with real data?

---

**Cursor**


Here’s a practical **step-by-step** path from “real data” to what the app uses (`gecan.db` + API + React).

---

### 1. Decide the source format

- **Spreadsheet** you already maintain (e.g. the Excel template), or  
- **Export from another system** (CSV/Excel), or  
- **JSON** that matches the app’s `Unidade` shape (same fields as `db/schema.sql` / `seed_from_json.py`).

Everything ends up as **rows in SQLite** `gecan.db` with the same column names as in `db/schema.sql` (especially `unidades`).

---

### 2. Align columns with the database

- Open **`db/schema.sql`** and the **`unidades`** sheet in **`templates/gecan_schema_template.xlsx`** (or your filled file).
- **Names must match** the DB: `snake_case` in SQLite (`uf_ra`, `resultado_com_dg`, …).
- If your export uses other headers, build a **mapping** (Excel formulas, Python, or ETL) before loading.

---

### 3. Create or reset the database file

From the project root:

```text
python scripts/init_db.py
```

That creates/updates **`gecan.db`** from **`db/schema.sql`** (including `unidades` and `meta`).

---

### 4. Load real data into `gecan.db`

Pick one approach:

**A) You already have JSON** (e.g. from an internal tool), array of objects with **camelCase** keys like the frontend / `seed_from_json.py`:

```text
python scripts/seed_from_json.py path\to\seu_arquivo.json
```

(Default path is `data/unidades_seed.json` if you pass nothing.)

**B) Data is only in Excel**  
There is **no** dedicated “Excel → SQLite” script in the repo yet. Typical flow:

1. In Excel: **Save As → CSV (UTF-8)** for the `unidades` sheet (one row per agency, header row = DB column names).
2. Write a **small Python script** (or use DB Browser for SQLite) to `INSERT`/`REPLACE` from CSV into `unidades`, or add a script that uses `pandas.read_excel` / `openpyxl` and maps columns to the same names as `seed_from_json.py`.

**C) Direct editing**  
Use **DB Browser for SQLite** or `sqlite3` CLI to import SQL/CSV against `gecan.db`.

---

### 5. Optional: `meta` table

If you use key/value config, fill the **`meta`** sheet or insert rows into `meta` in SQLite. The API in this project mainly exposes **`/api/unidades`**; extend it if you need `meta` in the UI.

---

### 6. Point the API at the right file

- Default is **`gecan.db` in the project root**.
- Override if needed: **`GECAN_DB`** = full path to your `gecan.db`.

Run the API (from project root):

```text
pip install -r requirements.txt
uvicorn api.main:app --reload --port 8765
```

Check: open `http://127.0.0.1:8765/api/health` and `http://127.0.0.1:8765/api/unidades` and confirm your real rows appear as JSON.

---

### 7. Run the frontend against the API

- Dev: Vite should **proxy `/api`** to the Python server (if that’s configured in `vite.config.ts`).
- Start: `npm run dev` (and keep **uvicorn** running).
- If the UI uses **`VITE_API_BASE`**, set it so requests hit the same origin as the proxy or the full API URL.

---

### 8. Repeat when data changes

1. Update the **source** (Excel/system export).  
2. **Regenerate** the load file (CSV/JSON) or re-run your import script.  
3. **Replace** rows in `unidades` (truncate + insert, or `INSERT OR REPLACE` like `seed_from_json.py`).  
4. Restart API if needed; **refresh** the browser (React Query may cache — hard refresh or invalidate cache if you add that later).

---

### Summary

| Step | Action |
|------|--------|
| 1 | Real data ready; columns mapped to `schema.sql` |
| 2 | `python scripts/init_db.py` |
| 3 | Load data (JSON via `seed_from_json.py`, or CSV/Excel via your own import) |
| 4 | `uvicorn api.main:app --port 8765` |
| 5 | `npm run dev` + verify `/api/unidades` and the app |

If you tell me whether real data will arrive as **Excel only** or **CSV/JSON**, I can outline the exact import commands or add a single **`import_unidades_excel.py`** script tailored to your template columns.

---

**User**

In the end I just need to provide the solution with a table? If so, I'll will serve it via SQLite3 with a solution that's outside the website.

---

**Cursor**


Yes—**your authoritative data can be “just” SQLite**: one file (`gecan.db`) with one or more **tables** (e.g. `unidades`, `meta`), which you maintain **outside** the React site (Python scripts, ETL, another job, manual updates in DB Browser, etc.).

A few precise points:

### What you “provide” as the solution (data side)

- **SQLite file** with tables that match your schema (e.g. `unidades` with all needed columns).  
- That’s enough as the **single source of truth** for numbers and dimensions.

### What the website still needs

The **browser cannot open `gecan.db` on disk** like a file share. So for the **website** to use that same SQLite data you still need **one extra piece** in the middle:

- **Something that reads SQLite and exposes HTTP (usually JSON)** — e.g. the small **FastAPI** app in this repo, or **any** other service you prefer (Node, .NET, etc.), **or**
- A **build step** that exports SQLite → JSON/static files that the front end loads (less flexible, but no live DB server).

So: **SQLite alone = your table(s) + file.**  
**SQLite + website = SQLite + a small API (or export) so the SPA can load data.**

### “Outside the website”

That matches a normal setup:

- **Outside:** you create/update `gecan.db` (scripts, ETL, tools).  
- **Alongside or on a server:** a thin API reads `gecan.db` and serves `/api/unidades`.  
- **Website:** only calls the API; it doesn’t care *how* the DB was filled.

If you **don’t** need the web UI at all and only use **reports, BI, or desktop tools** against SQLite, then you truly only need the **DB file** and those tools—no web stack required.

**Short answer:** You can treat the solution as **“the table(s) in SQLite”** maintained elsewhere; the site only needs a **reader** (API or export) unless you drop the website entirely.

---

**User**

So I'll serve the json.

---

**Cursor**


Checking how the app loads data so we can align it with serving JSON.




Wiring the app to load `Unidade` data from a JSON URL (default: `public/data/unidades.json`). Exporting the current dataset to JSON, then switching the app to fetch it.




Adding a small shared loading wrapper and updating all pages. Refactoring Cockpit360 helpers to use data from the hook.




Fixing a React hooks violation in `RankingComparativos`: moving the loading check after `useMemo`.




Here’s what was implemented and how it fits your plan to **serve JSON** (no SQLite required for the browser).

### What changed

1. **`public/data/unidades.json`** — Copy of your exported dataset (165 unidades). The app loads this in dev and it’s copied into **`dist/`** on build.
2. **`src/lib/load-unidades.ts`** — `fetch()` to a configurable URL.
3. **`src/hooks/use-unidades.ts`** — React Query caches the list and derives `UFS` / `RAS` / `UF_RAS`.
4. **Pages** — All screens that used `unidades` from `mock-data` now use **`useUnidadesData()`** and a small **`UnidadesLoadState`** for loading/errors.
5. **`src/lib/mock-data.ts`** — Only **`Unidade`** + **`formatCurrency` / `formatPercent` / `getStatusColor`** (no embedded table).
6. **`scripts/export-unidades-json.ts`** — Writes both **`data/unidades_seed.json`** and **`public/data/unidades.json`** when you still have a TS source (optional).

### How you serve JSON “outside” the site

| Scenario | What to do |
|----------|------------|
| **Same host as the app** | Put the file at **`/data/unidades.json`** (e.g. `public/data/unidades.json` or your CDN path). Default is already **`/data/unidades.json`**. |
| **Another URL (CDN, S3, API estática)** | Set **`VITE_UNIDADES_JSON_URL`** to the full URL (must allow **CORS** from your site’s origin). |

Example `.env.production`:

```env
VITE_UNIDADES_JSON_URL=https://seu-dominio.com/dados/unidades.json
```

Rebuild after changing env vars (`npm run build`).

### JSON shape

A **JSON array** of objects with **camelCase** fields matching **`Unidade`** (same as before). Your pipeline can export SQLite → JSON in that shape and host the file anywhere.

### Regenerating from the repo (optional)

If you ever add a TS source again:

```bash
npm run db:export-json
```

That refreshes **`public/data/unidades.json`** and **`data/unidades_seed.json`**.

So yes: you can treat the **solution as “one JSON file”** served by your own infrastructure; the app only needs a **GET** that returns that array (with CORS if cross-origin).

---

**User**

When I make changes to the unidades.json, it doesn't change the data presented in the site, only upon reseting (mounting and serving again)

---

**Cursor**


Checking the data-loading and React Query setup. Likely causes: React Query keeping in-memory cache, or fetch/browser caching.




React Query caches the first successful fetch in memory, so edits to `unidades.json` won't appear until the cache is invalidated or the app fully reloads. Adding dev-time cache-busting for the fetch URL and tuning the query so development picks up file changes.




Here’s what was going wrong and what we changed.

### Cause

1. **TanStack Query** keeps the first successful response in memory for the key `["unidades", "json"]`. Editing `unidades.json` does **not** invalidate that cache, so the UI keeps showing old data until a full reload (or remounting the app).
2. The browser can still reuse a **cached GET** for `/data/unidades.json` even with `cache: "no-store"` in some setups.

### Changes

1. **`load-unidades.ts` (dev only)**  
   Append `?_=<timestamp>` to the URL so each request is unique and you don’t get a stale cached file while developing.

2. **`use-unidades.ts`**
   - `staleTime: 0` — data is treated as stale immediately.
   - `refetchOnMount: "always"` — refetch when a screen that uses the query mounts.
   - `refetchOnWindowFocus: true` — refetch when you focus the tab again.
   - `refetchInterval: import.meta.env.DEV ? 4000 : false` — in **development**, refetch about every **4 seconds** so edits to `public/data/unidades.json` show up without restarting Vite.

Production builds **do not** poll (interval is `false`).

If 4s polling feels heavy in dev, say so and we can switch to something like “refetch on focus only” or a longer interval. You can also call `queryClient.invalidateQueries({ queryKey: ['unidades', 'json'] })` from a dev-only button if you prefer manual refresh.

---

**User**

I built again and edited the unidades.json again, and it didn't change the output

---

**Cursor**


Checking the implementation and fixing the production/preview case: `vite build` copies `public/` into `dist/` at build time — editing `public/data/unidades.json` after a build won't update `dist/` until we rebuild or copy the file.




Fixing two issues: (1) After `npm run build`, only `dist/data/unidades.json` is served — editing `public/data/unidades.json` doesn't update `dist/` until we rebuild or copy. (2) Production/preview has no polling and weaker cache-busting. Implementing always-on fetch cache-busting, optional polling via env, and a `sync-json` script to copy JSON into `dist/` without a full rebuild.




Here’s what was going wrong and what we changed.

### Why it looked “stuck”

1. **`npm run build` copies `public/` into `dist/` once.**  
   After that, the app loads **`dist/data/unidades.json`**, not `public/data/unidades.json`.  
   If you edit **`public/data/unidades.json`** and don’t build again (or copy the file), **`dist/` stays old**, so the site won’t change.

2. **Preview / production** had **no polling** (`refetchInterval` was only in dev), so even after updating `dist/`, the tab could keep showing **React Query’s cached** data until a full reload.

### What we changed

1. **Cache bust on every fetch** — Each request adds `?_=timestamp` so the browser doesn’t keep an old JSON response.

2. **`VITE_UNIDADES_REFETCH_MS`** — Optional polling (milliseconds).  
   - Dev still defaults to **4000 ms** if this isn’t set.  
   - For **`vite preview`** or any **production** build, set in **`.env.local`** (or the env file you use for that build), e.g.  
     `VITE_UNIDADES_REFETCH_MS=3000`  
     then **rebuild** so the value is embedded. Use **`0`** to turn polling off.

3. **`npm run sync-json`** — Copies  
   `public/data/unidades.json` → **`dist/data/unidades.json`**  
   without running a full Vite build. Use this when you only changed the JSON and are testing **`dist/`** / **`vite preview`**.

### What you should do day to day

| Situation | Command / action |
|-----------|-------------------|
| **`npm run dev`** | Edit `public/data/unidades.json`; within a few seconds (or on tab focus) it should refresh. If not, hard-refresh once. |
| **After `npm run build`** | Either run **`npm run build`** again after JSON changes, **or** run **`npm run sync-json`** to refresh only the JSON in `dist/`. |
| **`vite preview`** | Same as above: update **`dist/data`** via rebuild or **`npm run sync-json`**. Optionally set **`VITE_UNIDADES_REFETCH_MS=3000`** in `.env.local` and rebuild so the preview tab keeps refetching. |

So: **editing only `public/...` is not enough for preview/production** — **`dist/data/unidades.json`** must be updated (full build or `npm run sync-json`).

---

**User**

Review the project for safety (it'll only be served on intranet for trusted fellows) and unnecessary files/code

---

**Cursor**


Scanning the project for security considerations and cruft.




Completing a concise review and applying safe cleanups: removing dead code, trimming external metadata, hardening the API health endpoint, adding `.gitignore`, and removing the Lovable dev dependency.




Here’s a concise **review** for an **intranet / trusted users** deployment, plus **what was changed** in the repo.

---

## Safety (intranet assumptions)

**Low risk for your model**

- **No login / no session** — Anyone who can open the URL can see the app and the bundled or fetched JSON. That’s acceptable only on a **trusted network**; it is **not** suitable on the public internet without adding auth (or VPN-only access).
- **Data sensitivity** — `public/data/unidades.json` (and anything with the same fields) is **business/financial detail**. Treat the repo, `dist/`, and backups like internal data. Add **`public/data/*.json`** to `.gitignore` if you must not commit real extracts (optional; you may want samples only in git).
- **XSS** — No `eval` or user-controlled HTML in app code. `dangerouslySetInnerHTML` in `chart.tsx` only injects **CSS variables** from chart config (not arbitrary user strings). Risk is low for typical use.
- **Python API** (`api/main.py`) — Read-only SQLite, parameterized queries (`?`), no SQL injection from IDs. **CORS** is permissive (`allow_origins` from env). On a **shared** intranet segment, restrict `GECAN_CORS` to your front-end origin if you ever use this API.
- **External requests** — `MapaEstrategico` loads a **Google Maps embed** (third‑party). `index.html` previously pulled **Lovable** social images; those were removed.

**Vulnerabilities** — `npm audit` still reports some issues in deps (common in JS stacks). For intranet, run `npm audit` periodically; fix what breaks your build.

---

## Unnecessary / redundant items

| Item | Note |
|------|------|
| **`src/pages/Index.tsx`** | Not routed in `App.tsx` — **removed** as dead code. |
| **`lovable-tagger`** | Dev-only tooling — **removed** from `vite.config.ts` and `package.json`. |
| **`index.html`** | Lovable/meta + external og/twitter images — **trimmed** to a short description. |
| **`data/unidades_seed.json` vs `public/data/unidades.json`** | Same content role; seed is for Python/scripts, public copy is for the SPA. Keep both only if you use both pipelines; otherwise one source of truth is enough. |
| **`dist/`** | Build output — should not be committed (now in `.gitignore`). |
| **`api/` + FastAPI** | Unused if you **only** serve static JSON + static frontend. Keep if you still use SQLite via Python. |

---

## Changes made in the project

1. **Deleted** unused `Index.tsx`.
2. **Added** `.gitignore` (`node_modules`, `dist`, env files, `.venv`, `gecan.db`, etc.).
3. **Cleaned** `index.html` (removed Lovable branding and external preview images).
4. **Removed** `lovable-tagger` and simplified `vite.config.ts`.
5. **`/api/health`** — No longer returns the **DB file path**; only `ok` and `db_ready` (reduces casual path disclosure).

---

## Optional hardening (if you ever tighten further)

- **Network**: Serve the static app only on an internal VLAN or behind **VPN**; no change in code required.
- **Git**: Don’t commit `public/data/unidades.json` if it contains real data; use a small **sample** in repo and deploy real JSON via your pipeline.
- **API**: Set `GECAN_CORS` to the exact front-end origin instead of a broad list.

If you want, we can next **drop the FastAPI stack** or the duplicate JSON seed files when you confirm you’re **JSON-only** end-to-end.

