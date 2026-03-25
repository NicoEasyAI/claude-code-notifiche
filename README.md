# 🔔 Notifiche macOS per Claude Code

Notifiche native macOS con logo Claude che ti avvisano quando Claude finisce di generare o ha bisogno della tua attenzione. Cliccando sulla notifica torni direttamente all'IDE.

![macOS](https://img.shields.io/badge/macOS-only-blue) ![Claude Code](https://img.shields.io/badge/Claude%20Code-skill-purple)

## Installazione

### 1. Copia e incolla nel terminale:

```bash
mkdir -p ~/.claude/skills/notifiche && curl -sL https://raw.githubusercontent.com/nicogiansi-cmd/claude-code-notifiche/main/SKILL.md -o ~/.claude/skills/notifiche/SKILL.md
```

### 2. Apri Claude Code e scrivi:

```
/notifiche install
```

Claude farà tutto da solo:
- ✅ Installa `terminal-notifier` (serve [Homebrew](https://brew.sh))
- ✅ Mette il logo Claude sulle notifiche
- ✅ Rileva automaticamente il tuo IDE
- ✅ Configura gli hooks
- ✅ Invia una notifica di test

### 3. Abilita le notifiche di sistema

> ⚠️ **Questo step è obbligatorio** — senza, le notifiche non appaiono.

1. Apri **Impostazioni di Sistema** (System Settings)
2. Vai su **Notifiche** (Notifications)
3. Scorri fino a trovare **terminal-notifier**
4. Attiva **Consenti notifiche** (Allow Notifications)
5. Scegli lo stile **Avvisi** (Alerts) o **Banner**

## Comandi disponibili

| Comando | Cosa fa |
|---------|---------|
| `/notifiche install` | Setup automatico completo |
| `/notifiche sempre` | Notifica SEMPRE, anche se stai guardando l'IDE |
| `/notifiche smart` | Notifica solo quando NON stai guardando l'IDE |
| `/notifiche off` | Disattiva le notifiche |
| `/notifiche status` | Mostra lo stato attuale |

## Requisiti

- macOS
- [Homebrew](https://brew.sh)
- [Claude Code](https://claude.ai/download)
- Un IDE con supporto Claude Code (VS Code, Cursor, Windsurf, ecc.)

## Come funziona

La skill configura degli [hooks](https://docs.anthropic.com/en/docs/claude-code/hooks) in `~/.claude/settings.json` che inviano una notifica nativa macOS:

- **Quando Claude finisce di rispondere** → "Ho finito di generare!" 🔔
- **Quando Claude ha bisogno di attenzione** → "Serve la tua attenzione!" 🔔
- **Quando Claude chiede un permesso** → "Serve la tua autorizzazione!" 🔔

Cliccando sulla notifica torni direttamente al tuo IDE.

## Disinstallazione

```
/notifiche off
```

Per rimuovere completamente la skill:

```bash
rm -rf ~/.claude/skills/notifiche
```

## License

MIT
