# chip-doctor-mini

Mini Telegram bot that runs **openclaw doctor --fix** and **openclaw gateway restart** on the same machine where OpenClaw runs. No secrets in code; you provide token and allowed user IDs at setup.

## Commands (for allowed users)

| Command | Action |
|--------|--------|
| `/start` | Short help and list of commands |
| `/doctor` or `doctor` | Run `openclaw doctor --fix`, reply with output |
| `/restart` or `restart` | Run `openclaw gateway restart`, reply with output |

## Requirements

- Node.js 18+
- OpenClaw installed and working on this host
- Telegram bot token (from [@BotFather](https://t.me/BotFather) → /newbot)
- At least one Telegram user ID (allowed to run commands; get it from [@userinfobot](https://t.me/userinfobot) or from the bot’s reply on `/start`)

## Quick setup

1. **Create a bot and get token**  
   Telegram → @BotFather → /newbot → name and username → copy token.

2. **Get your Telegram user ID**  
   Message @userinfobot or send /start to your new bot and add the ID it shows to the allowed list.

3. **Run setup (on the OpenClaw host):**
   ```bash
   git clone https://github.com/YOUR_USERNAME/chip-doctor-mini.git
   cd chip-doctor-mini
   chmod +x setup.sh
   ./setup.sh
   ```
   (Замени YOUR_USERNAME на свой GitHub-логин после создания репо.)
   Setup will ask for:
   - Bot token
   - Allowed user IDs (comma-separated)
   - Install directory (default `~/.openclaw/scripts/doctor-bot`)
   - Env file path (default `~/.openclaw/doctor-bot.env`)
   - Log directory (default `~/.openclaw/logs`)

4. **Start the bot**
   - **macOS:** `launchctl load ~/Library/LaunchAgents/ai.openclaw.doctor-bot.plist`
   - **Linux:** run `./run-doctor-bot.sh` in the install dir (or add a systemd unit).

5. **Test**  
   Open your bot in Telegram and send `/start`.

## Manual setup (no script)

- Copy `doctor-bot.env.example` to e.g. `~/.openclaw/doctor-bot.env`, set `DOCTOR_BOT_TOKEN` and `DOCTOR_BOT_ALLOWED_IDS`, `chmod 600` the file.
- Copy `doctor-bot.js` and `run-doctor-bot.sh` to the same directory; make `run-doctor-bot.sh` executable and ensure it has LF line endings.
- On macOS, use `ai.openclaw.doctor-bot.plist.template`: replace `__INSTALL_DIR__` and `__LOG_DIR__` with your paths, save as `~/Library/LaunchAgents/ai.openclaw.doctor-bot.plist`, then `launchctl load …`.

## Env variables

| Variable | Required | Description |
|----------|----------|-------------|
| `DOCTOR_BOT_TOKEN` | Yes | Telegram bot token from BotFather |
| `DOCTOR_BOT_ALLOWED_IDS` | Yes | Comma-separated Telegram user IDs |
| `DOCTOR_BOT_ENV` | No | Path to env file (default `~/.openclaw/doctor-bot.env`) |
| `DOCTOR_BOT_PATH` | No | PATH for `openclaw` (e.g. Homebrew on macOS) |

## License

MIT.
