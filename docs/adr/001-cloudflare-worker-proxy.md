# ADR-001: Cloudflare Worker als OAuth2-Proxy

**Status:** Accepted  
**Datum:** 2025

## Kontext

Die Extension muss OAuth2-Tokens mit Zoho austauschen — dafür wird der `client_secret` benötigt. Browser-Extensions können Secrets nicht sicher speichern: Alles im Extension-Bundle ist für technisch versierte Nutzer auslesbar (`chrome-extension://` URLs).

Optionen:
- **Direkt aus dem Browser:** `client_secret` im Extension-Code gespeichert → leicht extrahierbar, Sicherheitsrisiko
- **Eigener Backend-Server:** Infrastrukturaufwand, Hosting-Kosten, Wartung
- **Cloudflare Worker:** Serverless, kostenlos im Free-Tier, deployed in unter 1 Minute

## Entscheidung

Wir setzen einen **Cloudflare Worker** als schlanken Proxy ein.

Der Worker hält den `client_secret` als verschlüsseltes Environment-Secret. Die Extension sendet nur den `refresh_token`, der Worker tauscht diesen gegen einen `access_token` aus und gibt ihn zurück. Der `client_secret` verlässt nie den Worker.

```
Extension → CF Worker (public) → Zoho Auth (secret geschützt)
```

## Konsequenzen

**Positiv:**
- `client_secret` nicht im Extension-Bundle
- Kein eigener Server nötig (Cloudflare Free Tier)
- Rate-Limiting direkt auf dem Worker konfigurierbar
- Deployment: `wrangler deploy` in < 1 Minute

**Negativ:**
- Dritte-Partei-Abhängigkeit (Cloudflare); bei Ausfall ist die Auth unterbrochen
- Netzwerklatenz durch zusätzlichen Hop
- Worker-Code muss separat gepflegt werden
