# Security

- **No secrets in code.** The bot reads `DOCTOR_BOT_TOKEN` and `DOCTOR_BOT_ALLOWED_IDS` from environment (or from a file you create from `doctor-bot.env.example`). Never commit real tokens or IDs.
- **Do not commit** any file named `doctor-bot.env`, `.env`, or similar. `.gitignore` excludes them.
- If you accidentally push a secret, revoke the Telegram bot token in @BotFather and create a new bot.
