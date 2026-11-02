# Übersetzungsauftrag (Berufsschule Einzelhandel, Verkäufer/-innen)

Zielgruppe: Auszubildende zum Verkäufer / zur Verkäuferin, oft leistungsschwach, viele erst kurz in Deutschland. Die Übersetzung erscheint als Tooltip neben dem deutschen Text.
Ziel: einfach, kurz, natürlich, fachlich korrekt. Kein literarischer Stil, keine Umgangssprache, kurze Sätze (wie im Deutschen).

## Eingabe / Ausgabe
- Eingabe: eine JSON-Datei {id: deutscher Text}. Lies sie mit dem Read-Tool selbst (nicht abtippen).
- Ausgabe: eine JSON-Datei {id: Übersetzung} mit GENAU denselben ids. Schreibe sie mit dem Write-Tool. Danach lies sie wieder ein, prüfe gültiges JSON und gleiche Anzahl der Schlüssel (python3 -c "import json;…"), korrigiere bei Bedarf.
- Antworte am Ende nur kurz („fertig, N Einträge“), gib den Inhalt NICHT als Text aus.

## Harte Regeln
1. Platzhalter {1}, {2}, {3} … bleiben unverändert im Text (Reihenfolge darf sich ändern, wenn die Sprache es braucht). Sie stehen für Namen, Zahlen oder Wörter.
2. Alle Zahlen, Geldbeträge, Prozentzeichen, €, ct, kg, g, ml, l, Uhrzeiten, Datumsangaben, Formeln (z. B. „Preis : 100 × 85“), Buchstaben-Variablen (G, P, p) bleiben EXAKT wie im Original. Immer westliche Ziffern 0–9, auch im Arabischen. Rechenzeichen bleiben.
3. Symbole/Emojis am Anfang oder Ende bleiben (💡 ✅ ❌ 🔒 🎉 ⚠ ✓ ✗ ~ → ×).
4. Eigennamen (Personen, Firmen, Orte: Kaufhaus Hansa, Nordlicht Markt, Deichbeat, Nordholz, Bremerhaven, Blitzkasse, Kassen-Legende bleibt als Name übersetzbar) bleiben unverändert, nur beschreibende Wörter darum werden übersetzt.
5. FACHBEGRIFFE: Der deutsche Fachbegriff bleibt sichtbar im Text, direkt danach steht die Übersetzung in Klammern – beim ersten Vorkommen im Eintrag, höchstens 2–3 Begriffe pro Eintrag (die wichtigsten). Beispiel (TR): „Der Kunde bekommt Skonto“ → „Müşteri Skonto (peşin ödeme iskontosu) alır.“ Bei sehr kurzen Einträgen, die nur aus einem Fachbegriff bestehen, schreibe: Übersetzung zuerst ist nicht nötig – nur die Übersetzung, z. B. „Rückgeld“ → „Para üstü“. Bei Einträgen, die selbst ein Fachbegriff + Erklärung sind, steht der Begriff deutsch in Klammern hinter der Übersetzung.
6. Bei Einträgen mit direkter Rede „…“ bleiben die Anführungszeichen „ und “ erhalten (genau diese Zeichen).
7. Einträge, die mit „…“ beginnen oder enden (Satzteile, die zusammengesetzt werden), werden so übersetzt, dass sie auch als Teil eines Satzes nach dem Teil davor/danach lesbar bleiben; „…“ am Anfang/Ende beibehalten.
8. Wenn eine Aufgabe eine deutsche Texteingabe verlangt, den deutschen Begriff nicht ändern.
9. Nichts weglassen, nichts hinzufügen, nichts erklären. Auch kurze Einträge (ein Wort) vollständig übersetzen. Wenn ein Eintrag keinen übersetzbaren Text enthält (nur Zahlen/Formeln), gib ihn unverändert zurück.
10. Wenn ein Text eine Rechenaufgabe ist, dürfen Zahlen/Reihenfolge der Rechnung nicht verändert werden.

## Glossar (bitte konsequent verwenden)
Rückgeld = TR: para üstü | VI: tiền thối lại | AR: الباقي (المبلغ المردود)
Wechselgeld (Kasse) = TR: bozuk para (kasa başlangıç parası) | VI: tiền lẻ để thối (tiền đầu ca) | AR: الفكّة (مبلغ بداية الصندوق)
Kassenbon / Beleg / Bon = TR: fiş | VI: hóa đơn (biên lai) | AR: إيصال
Kasse / Kassieren = TR: kasa / kasada ödeme almak | VI: quầy thu ngân, máy tính tiền / thu tiền | AR: صندوق الدفع (الكاشير) / تحصيل المبلغ
Kassensturz = TR: kasa sayımı (sürpriz kasa kontrolü) | VI: kiểm kê quỹ đột xuất | AR: جرد الصندوق المفاجئ
Tageslosung = TR: günlük nakit hasılat | VI: doanh thu tiền mặt trong ngày | AR: حصيلة اليوم النقدية
Tagesumsatz = TR: günlük ciro | VI: doanh thu trong ngày | AR: مبيعات اليوم
Abschöpfung = TR: kasadan ara para çekme | VI: rút bớt tiền khỏi quỹ giữa ca | AR: سحب جزء من النقد من الصندوق
Kassendifferenz / Fehlbetrag / Überschuss = TR: kasa farkı / kasa açığı / kasa fazlası | VI: chênh lệch quỹ / thiếu tiền / thừa tiền | AR: فرق الصندوق / عجز / فائض
Skonto = TR: peşin ödeme iskontosu | VI: chiết khấu thanh toán sớm | AR: خصم الدفع الفوري
Rabatt / Coupon / Gutschein = TR: indirim / kupon / hediye çeki | VI: giảm giá / phiếu giảm giá / phiếu quà tặng | AR: خصم / قسيمة خصم / قسيمة هدية
Grundpreis = TR: birim fiyat (kg / litre başına) | VI: giá theo đơn vị (mỗi kg / lít) | AR: سعر الوحدة (للكيلوغرام / اللتر)
Dreisatz = TR: üçlü orantı | VI: quy tắc tam suất | AR: قاعدة الثلاثة
Umsatzsteuer (USt) = TR: katma değer vergisi (KDV) | VI: thuế giá trị gia tăng (VAT) | AR: ضريبة القيمة المضافة
netto / brutto = TR: net / brüt | VI: chưa thuế / đã gồm thuế | AR: صافي (بدون ضريبة) / إجمالي (مع الضريبة)
Prozent, Prozentsatz, Prozentwert, Grundwert = TR: yüzde, yüzde oranı, yüzde değeri, ana değer | VI: phần trăm, tỷ lệ phần trăm, giá trị phần trăm, giá trị gốc | AR: النسبة المئوية، معدل النسبة، قيمة النسبة، القيمة الأساسية
Durchschnitt / gewogen = TR: ortalama / ağırlıklı | VI: trung bình / có trọng số | AR: المتوسط / المرجّح
Verteilungsrechnung = TR: dağıtım hesabı | VI: tính phân bổ | AR: حساب التوزيع
Prämie = TR: prim | VI: tiền thưởng | AR: مكافأة
Storno / stornieren = TR: iptal / iptal etmek | VI: hủy (Storno) | AR: إلغاء
Scannerkasse = TR: barkod okuyuculu kasa | VI: máy tính tiền có máy quét mã vạch | AR: صندوق دفع بماسح باركود
GTIN / TSE / WWS = (Abkürzungen bleiben) mit kurzer Erklärung in Klammern
Belegausgabepflicht = TR: fiş verme zorunluluğu | VI: nghĩa vụ xuất hóa đơn | AR: واجب إصدار الإيصال
Falschgeld = TR: sahte para | VI: tiền giả | AR: نقود مزيّفة
Geschäftsfähigkeit / geschäftsunfähig / nichtig / anfechtbar / schwebend unwirksam = TR: hukuki işlem ehliyeti / ehliyetsiz / geçersiz (hükümsüz) / iptal edilebilir / askıda (geçici olarak geçersiz) | VI: năng lực hành vi / không có năng lực hành vi / vô hiệu / có thể bị hủy bỏ / chưa có hiệu lực (tạm thời) | AR: الأهلية القانونية / عديم الأهلية / باطل / قابل للإبطال / معلّق (غير نافذ مؤقتاً)
Kaufvertrag / Antrag / Annahme = TR: satış sözleşmesi / teklif / kabul | VI: hợp đồng mua bán / đề nghị / chấp nhận | AR: عقد البيع / الإيجاب / القبول
Besitz / Eigentum / Eigentumsvorbehalt = TR: zilyetlik (elinde bulundurma) / mülkiyet / mülkiyetin saklı tutulması | VI: sự chiếm hữu / quyền sở hữu / bảo lưu quyền sở hữu | AR: الحيازة / الملكية / الاحتفاظ بالملكية
Jugendschutz = TR: gençlerin korunması | VI: bảo vệ thanh thiếu niên | AR: حماية الأحداث
Kundenorientiert / Kundenbindung = TR: müşteri odaklı / müşteri bağlılığı | VI: hướng đến khách hàng / giữ chân khách hàng | AR: موجّه نحو العميل / ولاء العملاء
Filialleiter/in = TR: şube müdürü | VI: trưởng chi nhánh | AR: مدير/ة الفرع
Azubi = TR: çırak | VI: học viên học nghề | AR: متدرّب/ة
Lernfeld / Modul / Doppelstunde (DS) = TR: öğrenme alanı / modül / çift ders | VI: lĩnh vực học tập / mô-đun / tiết đôi | AR: مجال التعلّم / وحدة / حصة مزدوجة
Tandem (Zweierteam) = TR: ikili ekip | VI: nhóm hai người | AR: فريق ثنائي
Taschenrechner = TR: hesap makinesi | VI: máy tính cầm tay | AR: آلة حاسبة
Lösung = TR: çözüm | VI: đáp án | AR: الحل
Rezeptkarte (Rechenrezept) = TR: formül kartı | VI: thẻ công thức | AR: بطاقة الوصفة الحسابية
Signalwörter = TR: ipucu kelimeleri | VI: từ khóa gợi ý | AR: كلمات دالّة
Falle (Fehlerfalle) = TR: dikkat, tuzak | VI: lỗi hay gặp | AR: فخّ شائع / تنبيه
Festival-Ruf = TR: festival itibarı | VI: danh tiếng tại lễ hội | AR: سمعة المهرجان

## Sprachen
- tr = Türkisch (Türkei, Standard), Dateiname-Ordner trans/tr
- vi = Vietnamesisch, mit allen Tonzeichen und Akzenten (Unicode, NFC)
- ar = Modernes Standardarabisch, einfach. Schreibrichtung rechts-nach-links wird vom Programm gesetzt. Deutsche Fachbegriffe, Zahlen und Formeln bleiben lateinisch/ziffernbasiert im Satz. Arabische Satzzeichen (، ؟) verwenden. Keine arabisch-indischen Ziffern (٠١٢) – nur 0123456789.
