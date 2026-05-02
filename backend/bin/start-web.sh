#!/usr/bin/env sh
# Railway (and similar) set PORT; avoid "$PORT" in the dashboard so the shell expands it.
set -e
cd "$(dirname "$0")/.." || exit 1
python manage.py migrate --noinput

# Optional one-time bootstrap (Railway: set DJANGO_SUPERUSER_*). Duplicate runs are ignored.
if [ -n "${DJANGO_SUPERUSER_USERNAME:-}" ] &&
  [ -n "${DJANGO_SUPERUSER_EMAIL:-}" ] &&
  [ -n "${DJANGO_SUPERUSER_PASSWORD:-}" ]; then
  python manage.py createsuperuser --noinput \
    --username "$DJANGO_SUPERUSER_USERNAME" \
    --email "$DJANGO_SUPERUSER_EMAIL" || true
fi

python manage.py collectstatic --noinput
PORT="${PORT:-8000}"
exec gunicorn config.wsgi:application --bind "0.0.0.0:${PORT}"
