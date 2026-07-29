from __future__ import annotations

from pathlib import Path

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from api.models import Unidade


def _db_path() -> Path:
    """Resolve the on-disk path of the configured SQLite database.

    Used as a pre-flight existence check so read endpoints can return a
    clear 503 instead of letting Django raise an opaque OperationalError
    when the DB file hasn't been created/seeded yet (e.g. fresh clone
    before running scripts/seed_from_json.py).
    """
    name = settings.DATABASES["default"]["NAME"]
    return Path(name)


@require_GET
def health(request):
    """Liveness/readiness check.

    Always returns 200. ``db_ready`` reports whether the SQLite file exists
    on disk — callers should treat ``db_ready: false`` as "not yet seeded",
    not as an application failure.
    """
    db_ready = _db_path().is_file()
    return JsonResponse({"ok": True, "db_ready": db_ready})


@require_GET
def list_unidades(request):
    """Return every branch unit as a JSON array (camelCase, see Unidade.to_api_dict).

    Responds 503 if the database file hasn't been created/seeded yet, so the
    frontend can distinguish "no data" from "temporarily unavailable". No
    pagination — the dataset is small (hundreds of rows) and this is an
    internal dashboard endpoint, not a public API.
    """
    if not _db_path().is_file():
        return JsonResponse(
            {"detail": "Database unavailable"},
            status=503,
        )
    rows = Unidade.objects.all().order_by("id")
    return JsonResponse([u.to_api_dict() for u in rows], safe=False)


@require_GET
def get_unidade(request, unidade_id: int):
    """Return a single branch unit by primary key.

    503 if the database file is missing entirely (not seeded yet); 404 if
    the database exists but no row matches ``unidade_id``.
    """
    if not _db_path().is_file():
        return JsonResponse(
            {"detail": "Database unavailable"},
            status=503,
        )
    try:
        u = Unidade.objects.get(pk=unidade_id)
    except Unidade.DoesNotExist:
        return JsonResponse({"detail": "Unidade not found"}, status=404)
    return JsonResponse(u.to_api_dict())
