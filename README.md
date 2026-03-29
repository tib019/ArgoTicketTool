# ArgoTicketTool

[![Chrome Extension](https://img.shields.io/badge/Chrome-Extension-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://github.com/tib019/ArgoTicketTool)
[![IHK Abschlussprojekt](https://img.shields.io/badge/IHK-Abschlussprojekt-green?style=for-the-badge)](https://github.com/tib019/ArgoTicketTool)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://github.com/tib019/ArgoTicketTool)
[![Manifest V3](https://img.shields.io/badge/Manifest-V3-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)](https://github.com/tib019/ArgoTicketTool)

> IHK-Abschlussprojekt im Rahmen der Umschulung zum Fachinformatiker für Anwendungsentwicklung

Eine Chrome-Extension zur Automatisierung von Support-Ticket-Erstellung im Zoho Creator System, entwickelt während des Praktikums bei **Argo Aviation GmbH**.

---

## Beschreibung

Das **ArgoTicketTool** vereinfacht den Prozess der Ticket-Erstellung für IT-Support-Anfragen. Mitarbeiter können direkt aus dem Browser heraus Support-Tickets erstellen, ohne sich durch das Zoho Creator Web-Interface navigieren zu müssen. Die Extension nutzt OAuth2-Authentifizierung und einen Cloudflare Worker als Sicherheits-Proxy.

---

## Features

- Schnelle Ticket-Erstellung direkt aus dem Browser-Popup
- OAuth2-Authentifizierung für sichere Zoho Creator API-Zugriffe
- Cloudflare Worker Proxy für zusätzliche Sicherheit und Rate-Limiting
- Benutzerfreundliches Popup-Interface mit Formularvalidierung
- Automatisches Token-Refresh für nahtlose Authentifizierung
- Konfigurierbare Einstellungen über die Options-Seite
- Unterstützung verschiedener Request-Typen (Bug, Feature, Support, etc.)
- Prioritätsstufen: Low, Medium, High, Critical

---

## Tech Stack

| Kategorie | Technologie |
|-----------|-------------|
| Frontend | JavaScript (Vanilla), HTML5, CSS3 |
| API | Zoho Creator REST API |
| Authentifizierung | OAuth2 |
| Proxy | Cloudflare Workers |
| Browser | Chrome Extension Manifest V3 |

---

## Projektstruktur

```
ArgoTicketTool/
  manifest.json        # Chrome Extension Manifest V3
  background.js        # Service Worker
  Popup/
    popup.html         # Hauptinterface
    popup.js           # Ticket-Erstellung Logik
  Options/
    options.html       # Einstellungsseite
    options.js         # Konfigurationsverwaltung
  icons/               # Extension Icons
  Doku/                # Projektdokumentation
  tests/               # Jest-Tests
```

---

## Installation

### Voraussetzungen

- Google Chrome (Version 88+)
- Zoho Creator Account mit API-Zugriff
- OAuth2-Credentials (Client ID, Client Secret, Refresh Token)

### Extension in Chrome laden

1. Repository klonen:
   ```bash
   git clone https://github.com/tib019/ArgoTicketTool.git
   cd ArgoTicketTool
   ```

2. `chrome://extensions/` im Browser öffnen
3. Entwicklermodus aktivieren
4. "Entpackte Erweiterung laden" klicken und den `ArgoTicketTool`-Ordner auswählen

### OAuth2-Konfiguration

1. Extension-Icon in der Chrome-Toolbar anklicken
2. Einstellungen öffnen
3. Client ID, Client Secret und Refresh Token eintragen
4. Konfiguration speichern

---

## Verwendung

1. ArgoTicketTool-Icon in der Chrome-Toolbar anklicken
2. Formular ausfüllen:
   - E-Mail-Adresse
   - Request Type (Bug, Feature, Support, etc.)
   - Priorität
   - Betreff
   - Beschreibung
3. "Ticket erstellen" klicken
4. Bestätigung mit Ticket-ID erhalten

---

## Tests

Das Projekt verwendet Jest für Unit-Tests.

```bash
npm install
npm test
```

Testdateien befinden sich im `tests/`-Ordner:
- `background.test.js` - Tests für den Service Worker
- `popup.test.js` - Tests für die Popup-Logik

---

## Sicherheit

- OAuth2-Authentifizierung statt direkter API-Keys
- Cloudflare Worker Proxy verhindert direkten API-Zugriff aus dem Browser
- Token-Speicherung ausschließlich im lokalen Chrome Storage
- HTTPS-only Kommunikation
- Input-Validierung gegen XSS und Injection-Angriffe

---

## Dokumentation

Die vollständige Projektdokumentation befindet sich im `Doku/`-Ordner:
- Anforderungsanalyse
- Technisches Konzept
- API-Dokumentation
- Sicherheitskonzept
- Benutzerhandbuch
- Testprotokolle

---

## Projektkontext

Entwickelt im Rahmen der IHK-Umschulung zum Fachinformatiker für Anwendungsentwicklung bei der **GFN Hamburg**.
Praktische Umsetzung während des sechsmonatigen Praktikums bei der **Argo Aviation GmbH**, Hamburg.

- Praktikum: Mai 2025 - November 2025
- Projektdauer: ca. 3 Monate
- IHK-Prüfung: Januar 2026

---

## Autor

**Tobias Heiko Buss**
- GitHub: [@tib019](https://github.com/tib019)
- Hamburg, Deutschland

---

## Lizenz

Dieses Projekt wurde für die **Argo Aviation GmbH** entwickelt und dient als IHK-Abschlussprojekt.
