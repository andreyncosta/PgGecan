"""Django settings for GECAN (SQLite + read API for the React app)."""

from __future__ import annotations

import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SECRET_KEY = os.environ.get(
    "DJANGO_SECRET_KEY",
    "django-insecure-dev-only-change-in-production",
)

DEBUG = os.environ.get("DJANGO_DEBUG", "1") not in ("0", "false", "False")

ALLOWED_HOSTS = [
    h.strip()
    for h in os.environ.get(
        "DJANGO_ALLOWED_HOSTS",
        "127.0.0.1,localhost,testserver",
    ).split(",")
    if h.strip()
]

INSTALLED_APPS = [
    "django.contrib.contenttypes",
    "django.contrib.staticfiles",
    "corsheaders",
    "api.apps.ApiConfig",
]

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES: list = []

WSGI_APPLICATION = "config.wsgi.application"

_DB_PATH = Path(os.environ.get("GECAN_DB", str(BASE_DIR / "gecan.db")))

DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": str(_DB_PATH),
    }
}

AUTH_PASSWORD_VALIDATORS: list = []

LANGUAGE_CODE = "pt-br"
TIME_ZONE = "America/Sao_Paulo"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

_cors = os.environ.get(
    "GECAN_CORS",
    "http://localhost:8080,http://127.0.0.1:8080,http://localhost:5173,http://127.0.0.1:5173",
)
CORS_ALLOWED_ORIGINS = [o.strip() for o in _cors.split(",") if o.strip()]
CORS_ALLOW_CREDENTIALS = True
