#!/usr/bin/env node
/**
 * OpenClaw Doctor Mini — Telegram bot to run openclaw doctor --fix and gateway restart.
 * Same host as OpenClaw. No secrets in code; set DOCTOR_BOT_TOKEN and DOCTOR_BOT_ALLOWED_IDS in env.
 * Repo: chip-doctor-mini (public)
 */
"use strict";

const { execSync } = require("child_process");

const BOT_TOKEN = process.env.DOCTOR_BOT_TOKEN;
const ALLOWED_IDS = (process.env.DOCTOR_BOT_ALLOWED_IDS || "")
  .split(",")
  .map((s) => s.trim())
  .filter(Boolean);
const PATH_ENV = process.env.DOCTOR_BOT_PATH || process.env.PATH || "";
const MAX_MESSAGE_LENGTH = 4000;
const RESTART_INTERVAL_MS = 6 * 60 * 60 * 1000;

if (!BOT_TOKEN || ALLOWED_IDS.length === 0) {
  console.error("Set DOCTOR_BOT_TOKEN and DOCTOR_BOT_ALLOWED_IDS (comma-separated Telegram user IDs)");
  process.exit(1);
}

async function api(method, body = {}) {
  const url = `https://api.telegram.org/bot${BOT_TOKEN}/${method}`;
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`Telegram API ${res.status}: ${await res.text()}`);
  const data = await res.json();
  if (!data.ok) throw new Error(data.description || "Telegram API error");
  return data.result;
}

async function sendMessage(chatId, text) {
  if (text.length > MAX_MESSAGE_LENGTH) {
    text = text.slice(0, MAX_MESSAGE_LENGTH - 80) + "\n\n… (обрезано)";
  }
  await api("sendMessage", { chat_id: chatId, text, parse_mode: "HTML" });
}

function runCmd(cmd, timeoutMs = 120_000) {
  try {
    const out = execSync(cmd, {
      encoding: "utf8",
      timeout: timeoutMs,
      env: { ...process.env, PATH: PATH_ENV || process.env.PATH },
    });
    return out || "(пусто)";
  } catch (e) {
    return `Ошибка: ${e.message}\n${(e.stdout || e.stderr || "").slice(0, 2000)}`;
  }
}

function runDoctor() {
  return runCmd("openclaw doctor --fix 2>&1");
}

function runGatewayRestart() {
  return runCmd("openclaw gateway restart 2>&1", 30_000);
}

let offset = 0;

setTimeout(() => {
  console.error("Scheduled restart after 6h");
  process.exit(0);
}, RESTART_INTERVAL_MS);

async function poll() {
  for (;;) {
    try {
      const updates = await api("getUpdates", {
        offset,
        timeout: 25,
        allowed_updates: ["message"],
      });
      for (const u of updates) {
        offset = u.update_id + 1;
        const msg = u.message;
        if (!msg?.text) continue;
        const text = msg.text.trim().toLowerCase();
        const chatId = msg.chat.id;
        const fromId = String(msg.from?.id ?? "");
        const isStart = text === "/start" || text === "start";
        const isDoctorCmd = text === "/doctor" || text === "doctor" || text === "/fix" || text === "fix";
        const isRestartCmd = text === "/restart" || text === "restart" || text === "/gateway" || text === "gateway";

        if (isStart) {
          const allowed = ALLOWED_IDS.includes(fromId);
          const reply = allowed
            ? "Привет. <code>/doctor</code> — openclaw doctor --fix. <code>/restart</code> — перезапуск gateway."
            : `Привет. Твой ID: <code>${fromId}</code>. Добавь его в DOCTOR_BOT_ALLOWED_IDS в конфиге бота для доступа.`;
          await sendMessage(chatId, reply);
          continue;
        }
        if (!ALLOWED_IDS.includes(fromId)) continue;
        if (isDoctorCmd) {
          await sendMessage(chatId, "Запускаю doctor — подожди…");
          const result = runDoctor();
          const escaped = result.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          await sendMessage(chatId, "<pre>" + escaped + "</pre>");
        } else if (isRestartCmd) {
          await sendMessage(chatId, "Перезапускаю gateway…");
          const result = runGatewayRestart();
          const escaped = result.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
          await sendMessage(chatId, "<pre>" + escaped + "</pre>");
        }
      }
    } catch (e) {
      console.error("Poll error:", e.message);
      await new Promise((r) => setTimeout(r, 5000));
    }
  }
}

poll();
