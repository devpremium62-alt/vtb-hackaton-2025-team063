#!/bin/sh
set -e

echo "[entrypoint] Backend container startup initiated"

python <<'PY'
import os
import socket
import sys
import time

host = os.environ.get("DB_HOST") or os.environ.get("POSTGRES_HOST", "postgres")
port = int(os.environ.get("DB_PORT") or os.environ.get("POSTGRES_PORT", "5432"))
attempts = int(os.environ.get("DB_MAX_ATTEMPTS", "30"))
delay = float(os.environ.get("DB_CHECK_DELAY", "2"))

for attempt in range(1, attempts + 1):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.settimeout(1)
        try:
            sock.connect((host, port))
        except OSError:
            print(f"[entrypoint] Waiting for database {host}:{port} ({attempt}/{attempts})", flush=True)
            time.sleep(delay)
        else:
            print(f"[entrypoint] Database {host}:{port} is available", flush=True)
            break
else:
    print(f"[entrypoint] Database {host}:{port} is unavailable after {attempts} attempts", file=sys.stderr, flush=True)
    sys.exit(1)
PY

if [ "${DJANGO_APPLY_MIGRATIONS:-1}" = "1" ]; then
  echo "[entrypoint] Applying Django migrations"
  python manage.py migrate --noinput
fi

if [ "${DJANGO_COLLECTSTATIC:-1}" = "1" ]; then
  echo "[entrypoint] Collecting static files"
  python manage.py collectstatic --noinput
fi

echo "[entrypoint] Executing command: $*"
exec "$@"