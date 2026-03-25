---
name: notifiche
description: Gestisci le notifiche macOS di Claude Code. Attiva/disattiva le notifiche sonore quando Claude finisce di generare o ha bisogno di attenzione. Comandi - /notifiche install (setup guidato), /notifiche on, /notifiche off, /notifiche sempre, /notifiche smart, /notifiche status. Also triggers on notifiche install or notifiche setup.
---

# Notifiche macOS per Claude Code

Notifiche sonore native macOS con logo Claude che avvisano quando Claude finisce di generare o ha bisogno della tua attenzione. Cliccando sulla notifica si torna all'app IDE.

## Comandi

### `/notifiche install` o `/notifiche setup`

Setup guidato. Esegui ogni step in sequenza, controlla il risultato e prosegui.

**Step 1: Controlla brew**
```bash
/opt/homebrew/bin/brew --version
```
Se manca, guida l'utente ad installare Homebrew.

**Step 2: Installa terminal-notifier**
```bash
/opt/homebrew/bin/brew install terminal-notifier
```

**Step 3: Sostituisci icona con logo Claude**
```bash
cp /Applications/Claude.app/Contents/Resources/electron.icns /opt/homebrew/Cellar/terminal-notifier/*/terminal-notifier.app/Contents/Resources/Terminal.icns
touch /opt/homebrew/Cellar/terminal-notifier/*/terminal-notifier.app
/System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -f /opt/homebrew/Cellar/terminal-notifier/*/terminal-notifier.app
killall NotificationCenter Dock 2>/dev/null
```
Se `/Applications/Claude.app` non esiste, salta questo step e avvisa l'utente che l'icona sara quella del terminale.

**Step 4: Rileva l'IDE in uso**
```bash
ps aux | grep -i "[E]lectron" | grep -oE '/Applications/[^/]+\.app' | sort -u
```
Per ogni app trovata, ottieni il nome dell'app (es. "Antigravity", "Cursor", "Visual Studio Code").
Se ci sono piu app Electron, chiedi all'utente quale usa come IDE. Se ce n'e una sola, usala.

**Step 5: Invia notifica di test**
```bash
/opt/homebrew/bin/terminal-notifier -message 'Le notifiche funzionano!' -title 'Claude Code' -sound Glass -execute 'open -a IDE_APP_NAME'
```
Chiedi all'utente se l'ha vista e se cliccandola si e aperta l'app IDE. Se NO, digli di andare in **Impostazioni di Sistema > Notifiche > terminal-notifier** e abilitare le notifiche, poi riprovare.

**Step 6: Configura gli hooks**
Procedi come `/notifiche sempre` usando il nome app rilevato allo step 4.

Alla fine conferma: "Notifiche attive! Riceverai un avviso con logo Claude ogni volta che finisco di rispondere. Clicca sulla notifica per tornare all'IDE."

---

### `/notifiche status`
Leggi `~/.claude/settings.json` e controlla se i hooks `Stop`, `Notification` e `PermissionRequest` esistono e sono attivi. Mostra lo stato attuale:
- Se gli hooks esistono e contengono il check "frontmost" -> modalita "smart" (solo quando non guardi)
- Se gli hooks esistono senza il check -> modalita "sempre"
- Se gli hooks non esistono -> notifiche disattivate

### `/notifiche on`
Alias di `/notifiche smart`. Attiva le notifiche in modalita smart (default).

### `/notifiche off`
Rimuovi i hooks `Stop`, `Notification` e `PermissionRequest` da `~/.claude/settings.json`. Preserva tutto il resto del file.

Leggi il file, rimuovi le chiavi `Stop`, `Notification` e `PermissionRequest` dall'oggetto `hooks`. Se `hooks` rimane vuoto, rimuovi anche la chiave `hooks`.

### `/notifiche sempre`
Configura gli hooks senza il check dell'app in primo piano. Le notifiche arrivano SEMPRE, anche se stai guardando l'IDE.

Per rilevare l'IDE: controlla i processi Electron attivi con `ps aux | grep -i "[E]lectron"` e ottieni il nome dell'app. Se non riesci a rilevarlo, chiedi all'utente.

**IMPORTANTE:** Usa `-execute 'open -a APP_NAME'` e NON `-activate BUNDLE_ID`. Il flag `-activate` non funziona in modo affidabile con tutte le app Electron. Il flag `-execute` con `open -a` funziona sempre.

Hooks da scrivere in `~/.claude/settings.json` (merge con contenuto esistente, sostituisci IDE_APP_NAME con il nome dell'app rilevata, es. "Antigravity", "Cursor", "Visual Studio Code"):

```json
{
  "hooks": {
    "Stop": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "/opt/homebrew/bin/terminal-notifier -message 'Ho finito di generare!' -title 'Claude Code' -sound Glass -execute 'open -a IDE_APP_NAME'"
          }
        ]
      }
    ],
    "Notification": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "/opt/homebrew/bin/terminal-notifier -message 'Serve la tua attenzione!' -title 'Claude Code' -sound Submarine -execute 'open -a IDE_APP_NAME'"
          }
        ]
      }
    ],
    "PermissionRequest": [
      {
        "hooks": [
          {
            "type": "command",
            "command": "/opt/homebrew/bin/terminal-notifier -message 'Serve la tua autorizzazione!' -title 'Claude Code - Permesso' -sound Submarine -execute 'open -a IDE_APP_NAME'"
          }
        ]
      }
    ]
  }
}
```

### `/notifiche smart`
Come `/notifiche sempre` ma con il check dell'app in primo piano. Le notifiche arrivano solo quando l'IDE NON e in primo piano.

Stessa logica di rilevamento app di `/notifiche sempre`. Wrappa ogni comando con:

```
FRONT=$(osascript -e 'tell application "System Events" to get name of first application process whose frontmost is true'); if [ "$FRONT" != "Electron" ] && [ "$FRONT" != "Code" ]; then COMANDO_NOTIFICA; fi
```

## Regole importanti

1. **Leggi SEMPRE** `~/.claude/settings.json` prima di modificarlo
2. **Merge** con il contenuto esistente — non sovrascrivere mai permissions, env, o altri hooks
3. **Valida** il JSON dopo ogni modifica con `jq -e . ~/.claude/settings.json`
4. Conferma all'utente lo stato finale dopo ogni operazione
5. **Usa `-execute 'open -a APP_NAME'`** e MAI `-activate BUNDLE_ID` per il click-to-open
