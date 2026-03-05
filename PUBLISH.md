# Как выложить этот каталог как отдельный публичный репо

1. На GitHub: **New repository** → имя `chip-doctor-mini`, Public, без README/.gitignore (они уже есть здесь).

2. В терминале из каталога с этим проектом (где лежит `chip-doctor-mini/`):

   ```bash
   cd chip-doctor-mini
   git init
   git add .
   git commit -m "Initial: OpenClaw Doctor Mini bot"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/chip-doctor-mini.git
   git push -u origin main
   ```

3. Подставь свой `YOUR_USERNAME` в URL. После пуша обнови ссылку в `README.md` в шаге «Quick setup».

4. Перед первым коммитом проверь: `git status` — в списке не должно быть файлов `*.env`, `doctor-bot.env`, `.env` (их игнорирует `.gitignore`).
