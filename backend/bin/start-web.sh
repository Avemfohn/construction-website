#!/usr/bin/env sh
# Railway (and similar) set PORT; avoid "$PORT" in the dashboard so the shell expands it.
set -e
cd "$(dirname "$0")/.." || exit 1
python manage.py migrate --noinput
python manage.py collectstatic --noinput
PORT="${PORT:-8000}"
exec gunicorn config.wsgi:application --bind "0.0.0.0:${PORT}"
