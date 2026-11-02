# Mehrsprachige Fassungen (TR · VI · AR)

Neue Dateien `materials/<name>_mehrsprachig.html` für Lernfeld 3 → Modulübergreifend. Die Originale bleiben unverändert.

- **Übersetzungen korrigieren:** in der jeweiligen `*_mehrsprachig.html` steht ganz oben im Text der Block `<script id="uebersetzungen">` (`window.UB_I18N = { "deutscher Text": {tr, vi, ar} }`). Eine Übersetzung dort ändern, speichern, fertig. Dieselben Texte liegen lesbar in `i18n/<name>.json`.
- `{1}`, `{2}` in einem Eintrag sind Platzhalter für eingesetzte Werte (Zahlen, Namen) – nicht entfernen.
- `engine.js` = gemeinsame Technik (Sprachwahl DE|TR|VI|AR, Antippen/Hover, Lesemodus 👆, Arabisch rechts-nach-links). Wird beim Bauen in jede Datei eingebettet.
- Dashboard: `uebersicht_mehrsprachig.js` (Sprach-Buttons) + kleine Erweiterung in `uebersicht.html`.
- Neu bauen (nur nötig, wenn Technik oder Texte der Originale geändert werden): `src/build_all.py` (Quellen: `src/`).
- Debug: Seite mit `?ubdebug=1` öffnen, dann listet `UB.missing()` in der Browser-Konsole alle Texte ohne Übersetzung.
