# ADR-003: Vanilla JavaScript statt React/Vue

**Status:** Accepted  
**Datum:** 2025

## Kontext

Das Popup-UI und die Options-Seite der Extension müssen DOM-Manipulation, Formular-Handling und API-Calls implementieren. Die Frage: Single-Page-App-Framework (React, Vue) oder plain JavaScript?

## Entscheidung

Wir verwenden **Vanilla JavaScript (ES6+)** ohne Framework.

Der ausschlaggebende Grund: Eine Chrome Extension ist kein SPA. Das Popup hat **ein einziges Formular mit ~6 Feldern**. Die Options-Seite hat **eine Eingabemaske mit ~4 Feldern**. Ein Framework würde:
- Einen Build-Step erfordern (Webpack/Vite)
- Die Bundle-Größe um mehrere hundert Kilobyte erhöhen
- Keine komponentenspezifischen Vorteile liefern bei dieser DOM-Komplexität

Für IHK-Projektkontext gilt zusätzlich: Vanilla JS demonstriert fundiertes JavaScript-Verständnis ohne Framework-Abstraktion.

## Abgewogene Alternativen

**React:** Sinnvoll wenn komplexes State-Management oder viele wiederverwendbare Komponenten. Bei einem 6-Felder-Formular ist der Overhead nicht gerechtfertigt.

**Alpine.js / Petite-Vue:** Lightweight Alternativen, aber selbst ~10 kB zusätzliche Abhängigkeit ohne klaren Vorteil.

## Konsequenzen

**Positiv:**
- Kein Build-Step — Änderungen direkt testbar
- Minimale Bundle-Größe → schnelleres Popup-Öffnen
- Keine npm-Vulnerabilities durch Framework-Dependencies

**Negativ:**
- Manuelles DOM-Binding (kein reaktives Rendering)
- Bei signifikant wachsender UI-Komplexität wäre eine Migration nötig
