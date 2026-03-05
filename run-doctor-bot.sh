#!/usr/bin/env bash
# Load env and run doctor-bot. Set INSTALL_DIR if not next to this script.
set -e
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
INSTALL_DIR="${INSTALL_DIR:-$SCRIPT_DIR}"
ENV_FILE="${DOCTOR_BOT_ENV:-$HOME/.openclaw/doctor-bot.env}"
if [[ -f "$ENV_FILE" ]]; then
  set -a
  source "$ENV_FILE"
  set +a
fi
export PATH="${DOCTOR_BOT_PATH:-$PATH}"
exec node "$INSTALL_DIR/doctor-bot.js"
