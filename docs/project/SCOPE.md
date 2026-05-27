# Projektscope: ArgoTicketTool

## Problemstellung

IT-Support-Mitarbeiter bei der **Argo Aviation GmbH** erstellen Tickets für interne Support-Anfragen über das Zoho Creator Web-Interface. Dieser Prozess erfordert mehrere Navigationsschritte (Login → Modul öffnen → Formular suchen → Felder ausfüllen), was bei häufig wiederkehrenden Anfragen ineffizient ist.

## Lösung

Eine **Chrome Extension** ermöglicht das Erstellen von Tickets direkt aus dem Browser-Toolbar — ohne Navigation zum Web-Interface. Das Popup-Formular ist in unter 10 Sekunden ausgefüllt und abgesendet.

## In Scope

- Ticket-Erstellung via Popup-Formular
- OAuth2-Authentifizierung gegen Zoho (Refresh-Token-Flow)
- Request-Types: Bug, Feature, Support, Change Request
- Prioritätsstufen: Low, Medium, High, Critical
- Konfigurierbare Options-Seite (Credentials, Worker-URL)
- Automatisches Token-Refresh
- Cloudflare Worker als Sicherheits-Proxy
- Jest Unit-Tests für Kernlogik

## Out of Scope

- Ticket-Anzeige / -Bearbeitung / -Kommentierung
- Push-Benachrichtigungen bei Ticket-Updates
- Offline-Funktionalität
- Multi-Account-Support
- Firefox / Edge Kompatibilität
- Dashboard / Reporting

## Nicht-funktionale Anforderungen

| Anforderung | Zielwert |
|-------------|----------|
| Popup-Ladezeit | < 200ms |
| Ticket-Erstellung (End-to-End) | < 3 Sekunden |
| Bundle-Größe | < 500 KB |
| Chrome-Version | 88+ (Manifest V3) |

## Projektkontext

**IHK-Abschlussprojekt** im Rahmen der Umschulung zum Fachinformatiker für Anwendungsentwicklung (GFN Hamburg).  
Praktikumsbetrieb: **Argo Aviation GmbH**, Hamburg.  
Projektdauer: ~3 Monate | IHK-Prüfung: Januar 2026
