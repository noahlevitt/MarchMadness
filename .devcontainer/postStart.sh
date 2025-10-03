#!/usr/bin/env bash
set -euo pipefail

# Bring the whole stack up
docker compose up -d

echo "-----------------------------------------------------"
echo " Docker compose is up. Codespaces will auto-forward"
echo " ports it detects. Use the 'Ports' tab to open the app."
echo "-----------------------------------------------------"
docker compose ps
