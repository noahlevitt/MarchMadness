#!/usr/bin/env bash
set -euo pipefail

# Start Docker in the codespace
sudo service docker start || true

# If you keep a demo env file, copy it to .env (safe placeholders only)
if [ -f ".env.demo" ] && [ ! -f ".env" ]; then
  cp .env.demo .env
fi

# Optional: build images (or rely on compose to build on up)
docker compose build || true
