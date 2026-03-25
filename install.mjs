#!/usr/bin/env node

import { mkdirSync, writeFileSync, readFileSync, existsSync } from "fs";
import { join } from "path";
import { homedir } from "os";
import { execSync } from "child_process";

const SKILL_URL =
  "https://raw.githubusercontent.com/nicogiansi-cmd/claude-code-notifiche/main/SKILL.md";
const SKILL_DIR = join(homedir(), ".claude", "skills", "notifiche");
const SKILL_PATH = join(SKILL_DIR, "SKILL.md");

console.log("");
console.log("🔔 Claude Code Notifiche — Installer");
console.log("─".repeat(40));

// 1. Create skill directory
mkdirSync(SKILL_DIR, { recursive: true });

// 2. Download SKILL.md
console.log("📥 Scarico la skill...");
try {
  execSync(`curl -sL "${SKILL_URL}" -o "${SKILL_PATH}"`, { stdio: "pipe" });
} catch {
  console.error("❌ Errore nel download. Controlla la connessione.");
  process.exit(1);
}

if (!existsSync(SKILL_PATH)) {
  console.error("❌ Download fallito.");
  process.exit(1);
}

console.log("✅ Skill installata in ~/.claude/skills/notifiche/");
console.log("");
console.log("─".repeat(40));
console.log("👉 Ora apri Claude Code e scrivi:");
console.log("");
console.log("   /notifiche install");
console.log("");
console.log("Claude farà tutto da solo:");
console.log("  • Installa terminal-notifier");
console.log("  • Mette il logo Claude sulle notifiche");
console.log("  • Rileva il tuo IDE");
console.log("  • Configura le notifiche");
console.log("  • Invia un test");
console.log("");
console.log("⚠️  Ricorda: vai in Impostazioni di Sistema > Notifiche");
console.log("   > terminal-notifier e abilita le notifiche!");
console.log("─".repeat(40));
console.log("");
