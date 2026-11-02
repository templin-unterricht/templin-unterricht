# LF 5 – Digitale Arbeitsblätter (Bauskript)

Die elf Dateien `materials/digital/LF5_M_1.html` … `LF5_M_11.html` werden aus einer gemeinsamen Engine und je einer Datendatei gebaut.
So sehen alle Blätter gleich aus und werden gleich bedient.

- `engine.css`, `engine.js`, `template.html`: gemeinsames Design und gemeinsame Bedienung
- `sheets/M<n>.js`: Aufgaben, Lösungen, Tipps und Vietnamesisch für Modul n
- `node build.js` baut alle elf Dateien, `node build.js 5` nur Modul 5
- `node test.js 5` prüft ein Blatt (Konsole, richtig/falsch, Vietnamesisch, Reload); `node itest.js` testet echte Bedienung

Nach Änderungen an einer Datendatei: `node build.js <n>` und die HTML-Datei einchecken.
Die HTML-Dateien selbst sind eigenständig und brauchen weder Server noch Internet.
