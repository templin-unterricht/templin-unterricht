# LF 5 – Live-Einstiege (Tafel + Handy/iPad, 8 Sprachen)

Erzeugt `materials/LF5_M_<n>_Einstieg_live.html` (n = 1–11). Eine Datei pro Modul, ohne Server.

- **Tafel** (Beamer): Datei ohne Parameter öffnen. QR-Code und Code erscheinen; Pfeiltasten oder „Weiter“ wechseln die Runde, „Auflösen“ wertet aus.
- **Handy/iPad**: QR scannen (`?s=CODE`), Sprache wählen, Spitzname eingeben. Die Sprache wird gemerkt.
- Sprachen: Deutsch, Español, Português, Tiếng Việt, ትግርኛ, العربية, Türkçe, Русский. Deutsch bleibt als Zweitzeile unter der Übersetzung (abschaltbar).
- Antworten gehen nur als Zahlen/Indizes über das Netz (MQTT über WebSocket, zwei öffentliche Broker). Nur Wortwolke und Zettelwand senden freien Text.
- Testen ohne Internet: `?bc=1` an Tafel und Handys (alle Tabs im selben Browser-Profil, Handy zusätzlich `&t=1`, `&t=2` …).

## Aufgabentypen
`intro`, `quiz` (mit `ok` gewertet, sonst Umfrage), `multi`, `cloud` (Wortwolke), `wall` (Zettelwand), `match` (Zuordnung), `order` (Reihenfolge), `tf` (zwei Labels frei wählbar), `guess` (Schätzen), `merk` (Merksätze). Pro Runde max. 100 Punkte; Siegerehrung am Ende.

## Neu bauen
```
python3 tools/lf5_live/build.py        # alle Module
python3 tools/lf5_live/build.py 3 4    # nur M3, M4
```
Inhalte: `content/mNN.py` (jeder Text = `T(de, es, pt, vi, ti, ar, tr, ru)`). Technik: `engine.js`, Design: `style.css`, QR: `qrlib.js`.
Hinweis: Die Übersetzungen (besonders Tigrinya) sollten von Muttersprachlern gegengelesen werden.
