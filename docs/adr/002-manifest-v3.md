# ADR-002: Chrome Manifest V3

**Status:** Accepted (Pflicht)  
**Datum:** 2025

## Kontext

Chrome Extensions können in Manifest V2 oder Manifest V3 entwickelt werden. Google hat MV2-Support für neue Extensions seit 2022 eingestellt; bestehende MV2-Extensions werden schrittweise deaktiviert.

## Entscheidung

Wir entwickeln ausschließlich mit **Manifest V3**.

Dies ist keine freie Entscheidung, sondern eine technische Notwendigkeit: Neue Extensions werden im Chrome Web Store nur noch mit MV3 akzeptiert. Trotzdem sind die architektonischen Konsequenzen relevant:

**MV3-Einschränkungen gegenüber MV2:**
- Background Scripts werden zu **Service Workern** → kein persistenter Zustand im Arbeitsspeicher
- `XMLHttpRequest` im Service Worker nicht verfügbar → nur `fetch()`
- `chrome.declarativeNetRequest` statt `webRequestBlocking` (für diese Extension irrelevant)

## Konsequenzen

**Positiv:**
- Zukunftssicher, kein erzwungener Migrationsaufwand später
- Bessere Performance durch Service-Worker-Lifecycle
- Zulässig im Chrome Web Store

**Negativ:**
- Service Worker kann jederzeit vom Browser beendet werden → kein In-Memory-State zwischen API-Calls
- Zustand muss persistent in `chrome.storage` gespeichert werden, was asynchrone Reads erfordert
- Debugging von Service Workern über `chrome://serviceworker-internals` ist weniger komfortabel als Hintergrundseiten in MV2
