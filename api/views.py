from __future__ import annotations

from pathlib import Path

from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.http import require_GET

from api.models import Unidade


def _db_path() -> Path:
    name = settings.DATABASES["default"]["NAME"]
    return Path(name)


@require_GET
def health(request):
    db_ready = _db_path().is_file()
    return JsonResponse({"ok": True, "db_ready": db_ready})


@require_GET
def list_unidades(request):
    if not _db_path().is_file():
        return JsonResponse(
            {"detail": f"Database not found: {_db_path()}"},
            status=503,
        )
    rows = Unidade.objects.all().order_by("id")
    return JsonResponse([u.to_api_dict() for u in rows], safe=False)


@require_GET
def get_unidade(request, unidade_id: int):
    if not _db_path().is_file():
        return JsonResponse(
            {"detail": f"Database not found: {_db_path()}"},
            status=503,
        )
    try:
        u = Unidade.objects.get(pk=unidade_id)
    except Unidade.DoesNotExist:
        return JsonResponse({"detail": "Unidade not found"}, status=404)
    return JsonResponse(u.to_api_dict())
