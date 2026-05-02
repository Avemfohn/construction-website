import os
from pathlib import Path

import cloudinary
import dj_database_url
from dotenv import load_dotenv

BASE_DIR = Path(__file__).resolve().parent.parent
# Always load backend/.env regardless of cwd. Use override=True so real values from the file
# replace empty placeholders injected by docker-compose (e.g. CLOUDINARY_API_KEY: ${VAR:-}).
load_dotenv(BASE_DIR / ".env", override=True)
# Optional repo-root .env; do not clobber keys already set from backend/.env.
load_dotenv(BASE_DIR.parent / ".env", override=False)

SECRET_KEY = os.environ.get("SECRET_KEY", "django-insecure-dev-change-me")
DEBUG = os.environ.get("DEBUG", "True").lower() in ("1", "true", "yes")

# If ALLOWED_HOSTS is set but empty (e.g. Railway variable present with no value), os.environ.get
# returns "" and Django ends up with [] — management commands fail when DEBUG=False.
_allowed_hosts_raw = os.environ.get("ALLOWED_HOSTS")
if _allowed_hosts_raw is None or not str(_allowed_hosts_raw).strip():
    _allowed_hosts_raw = "localhost,127.0.0.1,backend"
ALLOWED_HOSTS = [
    h.strip()
    for h in str(_allowed_hosts_raw).split(",")
    if h.strip()
]

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "cloudinary",
    "corsheaders",
    "rest_framework",
    "rest_framework.authtoken",
    "website",
]

MIDDLEWARE = [
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

ROOT_URLCONF = "config.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "config.wsgi.application"
ASGI_APPLICATION = "config.asgi.application"

# Railway / Heroku-style: set DATABASE_URL (Postgres plugin). Local Docker: use DATABASE_* or omit URL.
_database_url = os.environ.get("DATABASE_URL", "").strip()
if _database_url:
    DATABASES = {
        "default": dj_database_url.parse(
            _database_url,
            conn_max_age=600,
        )
    }
else:
    DATABASES = {
        "default": {
            "ENGINE": "django.db.backends.postgresql",
            "NAME": os.environ.get("DATABASE_NAME", "construction_db"),
            "USER": os.environ.get("DATABASE_USER", "construction"),
            "PASSWORD": os.environ.get("DATABASE_PASSWORD", "construction_dev"),
            # Default `db` matches docker-compose Postgres service (devcontainer / backend containers).
            # For Postgres on your machine only, set DATABASE_HOST=localhost in backend/.env
            "HOST": os.environ.get("DATABASE_HOST", "db"),
            "PORT": os.environ.get("DATABASE_PORT", "5432"),
        }
    }

AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

LANGUAGE_CODE = "en-us"
TIME_ZONE = "Europe/Istanbul"
USE_I18N = True
USE_TZ = True

STATIC_URL = "static/"
STATIC_ROOT = BASE_DIR / "staticfiles"

STORAGES = {
    "default": {
        "BACKEND": "django.core.files.storage.FileSystemStorage",
    },
    "staticfiles": {
        "BACKEND": "whitenoise.storage.CompressedStaticFilesStorage",
    },
}

MEDIA_URL = os.environ.get("MEDIA_URL", "/media/")
MEDIA_ROOT = os.environ.get("MEDIA_ROOT", str(BASE_DIR / "media"))

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Cloudinary (Founder videos on /urban-renewal).
# https://cloudinary.com/documentation/django_integration


_cloudinary_url = os.environ.get("CLOUDINARY_URL", "").strip()
if _cloudinary_url:
    cloudinary.config_from_url(_cloudinary_url)
else:
    _cloud_name = os.environ.get("CLOUDINARY_CLOUD_NAME", "").strip()
    _api_key = os.environ.get("CLOUDINARY_API_KEY", "").strip()
    _api_secret = os.environ.get("CLOUDINARY_API_SECRET", "").strip()
    if _cloud_name and _api_key and _api_secret:
        cloudinary.config(
            cloud_name=_cloud_name,
            api_key=_api_key,
            api_secret=_api_secret,
            secure=True,
        )

_cors = os.environ.get("CORS_ALLOWED_ORIGINS", "")
CORS_ALLOWED_ORIGINS = [o.strip() for o in _cors.split(",") if o.strip()]
CORS_ALLOW_CREDENTIALS = True

REST_FRAMEWORK = {
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.TokenAuthentication",
        "rest_framework.authentication.SessionAuthentication",
    ],
    # Staff only (same users as Django admin). Anonymous browsers cannot read /api/.
    # Next.js server-side fetches must send Authorization: Token <key> (see frontend INTERNAL_API_AUTH_TOKEN).
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAdminUser",
    ],
    "DEFAULT_PARSER_CLASSES": [
        "rest_framework.parsers.JSONParser",
        "rest_framework.parsers.MultiPartParser",
        "rest_framework.parsers.FormParser",
    ],
}

# Browser POST origins when using SessionAuthentication across sites (e.g. admin on another host).
_csrf_trusted = os.environ.get("CSRF_TRUSTED_ORIGINS", "")
CSRF_TRUSTED_ORIGINS = [o.strip() for o in _csrf_trusted.split(",") if o.strip()]

if not DEBUG:
    # Hardening for real deployments (see `manage.py check --deploy`).
    # TLS is often terminated at nginx/Caddy; `SECURE_PROXY_SSL_HEADER` lets Django trust
    # `X-Forwarded-Proto` so redirects and secure cookies behave correctly.
    SECURE_CONTENT_TYPE_NOSNIFF = True
    SECURE_BROWSER_XSS_FILTER = True
    SESSION_COOKIE_SECURE = True
    CSRF_COOKIE_SECURE = True
    SECURE_HSTS_SECONDS = int(os.environ.get("SECURE_HSTS_SECONDS", "31536000"))
    SECURE_HSTS_INCLUDE_SUBDOMAINS = os.environ.get(
        "SECURE_HSTS_INCLUDE_SUBDOMAINS", "true"
    ).lower() in ("1", "true", "yes")
    SECURE_HSTS_PRELOAD = os.environ.get("SECURE_HSTS_PRELOAD", "").lower() in (
        "1",
        "true",
        "yes",
    )
    SECURE_SSL_REDIRECT = os.environ.get("SECURE_SSL_REDIRECT", "true").lower() in (
        "1",
        "true",
        "yes",
    )
    if os.environ.get("USE_X_FORWARDED_PROTO", "true").lower() in ("1", "true", "yes"):
        SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")
