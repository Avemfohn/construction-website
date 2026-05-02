#!/usr/bin/env sh
# Railway (and similar) set PORT; avoid "$PORT" in the dashboard so the shell expands it.
set -e
PORT="${PORT:-8000}"
exec gunicorn config.wsgi:application --bind "0.0.0.0:${PORT}"
