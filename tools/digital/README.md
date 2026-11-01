# Digitale Arbeitsblätter LF 4

Die 11 Dateien `materials/digital/LF4_M_1.html` … `LF4_M_11.html` werden aus diesen Quellen gebaut:

- `engine.js`, `engine.css`, `template.html`: gemeinsame Bedienung und Design
- `ui.js`: Oberflächentexte in 9 Sprachen (de, vi, es, pt, uk, ti, ru, ar, tr)
- `common.js`: wiederkehrende Überschriften und Hinweise (übersetzt)
- `sheets/mN.js`: Aufgaben, Lösungen und Übersetzungen eines Arbeitsblatts

Bauen: `python3 tools/digital/build.py 1 2 3 …` (die Zahlen sind die Modulnummern). Ergebnis ist je Blatt eine eigenständige HTML-Datei ohne externe Abhängigkeiten.
Im Browser prüft `window.__missing()` nach dem Durchschalten aller Sprachen, ob Übersetzungen fehlen.
