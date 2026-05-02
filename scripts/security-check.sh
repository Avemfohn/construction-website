#!/usr/bin/env bash
# Dependency and deployment security checks for this repo.
# Run from repo root: bash scripts/security-check.sh
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
export XDG_CACHE_HOME="${XDG_CACHE_HOME:-$ROOT/.security-cache}"

cd "$ROOT/frontend"
echo "== npm audit (frontend) =="
npm audit || true

echo "== Next.js production build =="
npm run build

cd "$ROOT/backend"
echo "== Django system checks (deployment) =="
python3 manage.py check --deploy || true

VENV="$ROOT/.security-venv"
if [[ ! -x "$VENV/bin/pip-audit" ]]; then
  echo "== Creating venv for pip-audit =="
  python3 -m venv "$VENV"
  "$VENV/bin/pip" install -q pip-audit
fi
echo "== pip-audit (backend requirements) =="
"$VENV/bin/pip-audit" -r "$ROOT/backend/requirements.txt"

echo "== Django tests (security) =="
python3 manage.py test website.tests.test_security -v 1

echo "Done."
