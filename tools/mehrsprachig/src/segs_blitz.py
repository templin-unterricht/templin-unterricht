"""Deutsche Texte der Blitzkasse (statisch, Vorlagen mit {1} {2} … für eingesetzte Werte, Daten aus dem Quelltext)."""
import re,json,sys
SRC='/home/user/templin-unterricht/materials/LF3_Blitzkasse_-_Kopfrechnen_an_der_Kasse.html'
def js_array(src,name):
    m=re.search(r'const '+name+r'=(\[.*?\]);\n',src,re.S); return m.group(1)
def build():
    src=open(SRC,encoding='utf8').read()
    seg=[]
    def add(*a):
        for x in a:
            if x not in seg: seg.append(x)
    # --- Oberfläche (statisch)
    add('Kopfrechnen an der Kasse','Kunde {1}/{2}','Punkte {1}','Serie {1}','Lernfeld 3 · Kassieren','Deine Schicht an Kasse 3 beginnt.',
     'Zehn Kunden stehen an. Rechne Rückgeld, Summen und Rabatte im Kopf und gib das Wechselgeld passend heraus. Wer schnell und richtig rechnet, sammelt mehr Punkte.',
     'Stufe','Azubi','Runde Beträge, Scheine bis 50 €, Rabatte 10 / 20 / 25 / 50 %','Kassenprofi','Krumme Cent-Beträge, Skonto, Doppel-Rabatt und Profi-Fragen zum Begründen',
     'Aufgaben','Rückgeld','Summe','Rabatt & Aktion','Geld herausgeben','Zeit','Mit Zeitbonus (ohne Haken: in Ruhe üben)','Schicht starten',
     'Tastatur geht auch: Zahlen, Komma, Enter.','Wähle mindestens eine Aufgabenart.','Kasse 3','So läuft die Schicht','10 Kunden pro Schicht.',
     'Richtig: 100 Punkte. Schnell: bis zu 50 Punkte extra.','Ab 3 Richtigen hintereinander gibt es Serien-Punkte.',
     'Beim Geldherausgeben zählt auch: möglichst wenige Scheine und Münzen.','Nach jeder Antwort siehst du den schnellen Rechenweg.',
     'Dein Rekord: Azubi {1} · Kassenprofi {2} Punkte','Noch kein Rekord auf diesem Gerät.',
     'Profi-Frage · Begründen','Betrag','Fertig','Auf dem Tresen (antippen = zurücknehmen)','Alles zurück','Geld geben','Dein Titel','Neue Schicht','Einstellungen ändern',
     'Letzte Ziffer löschen',
     # Beleg-Zeilen
     'Gegeben','Zu zahlen','SUMME','ZU ZAHLEN','Aktion 3 für 2','3 für 2','Rabatt','Doppel-Rabatt','Skonto','2. Teil −50 %','Rabatt {1} %','Skonto {1} %','Rabatt 20 %','Gutschein 10 % auf Rest',
     'Rechnung Möbel-Lieferung','PUNKTE','Richtig','Rekord','Rekord {1}',
     'Profi-Frage','Wähle die richtige Antwort.','Kurze Frage an Sie, bevor der nächste Kunde kommt.','Filialleiterin Frau Brandt',
     # Aufgabentexte
     'Wie viel Rückgeld bekommt {1}?','Wie viel muss {1} bezahlen?','Wie viel kostet der Einkauf zusammen?','Lege das Rückgeld hin – mit möglichst wenigen Scheinen und Münzen.',
     'Ich zahle mit einem {1}-Euro-Schein.','Hier sind {1} – dann bekomme ich glatter zurück.',
     "Das wär's, danke.",'Einmal das hier, bitte.','Nur die paar Sachen.',"Ich hab's ein bisschen eilig!",'Was macht das zusammen?',
     'Ich nehme drei Mal {1}. Da ist doch die Aktion, oder?','Ich nehme das hier: {1}. Das ist doch heute reduziert, oder?','Ich nehme {1} Stück {2}. Gilt die Aktion?',
     'Ich zahle die Rechnung sofort bar. Da gibt es doch {1} % Skonto?','Ich nehme das hier: {1}. Das ist 20 % reduziert – und ich habe noch einen 10-%-Gutschein!',
     'Ich nehme zwei Mal {1}. Das zweite ist doch halb so teuer?',"Ich nehme das hier: {1}. Heute gibt es {2} % darauf, stimmt's?",
     # Rückmeldung
     'Betrag stimmt!','Aber es geht mit weniger Teilen: {1} statt {2}.','Leider nicht richtig.','Deine Antwort: {1} Richtig: {2}','Richtig: {1}','Deine Antwort: {1} · Richtig: {2}',
     'Richtig!','Stimmt genau!','Sauber gerechnet!','Perfekt!','Nächster Kunde','Schicht beenden','Tippe zuerst einen Betrag ein.','Tippe oben auf Scheine und Münzen.','Lege zuerst Geld auf den Tresen.',
     'Zeitbonus: +{1}','Der Kunde wird ungeduldig – kein Zeitbonus mehr. Rechne trotzdem in Ruhe zu Ende.',
     '{1} in 1 Teil','{1} in {2} Teilen','{1} · {2} Teile','{1} · 1 Teil',
     # Rechenwege
     'Ergänzen wie an der Kasse – vom Preis hochzählen:','Von {1} bis {2} fehlen {3}.','Dazu kommen {1}, die der Kunde extra gegeben hat.','Zusammen: {1} Rückgeld.',
     'Trick erkennen:','Die Cent sind gleich (,{1}). Sie heben sich auf.','Rechne nur mit den Euro: {1} − {2} = {3}.','Rückgeld: {1}.',
     'Mit glatten Preisen rechnen, dann die Cent abziehen:','{1} → {2} ({3} ct zu viel)','{1} bleibt so','Glatte Summe: {1}','Erst die Euro, dann die Cent:','Euro zusammen: {1} €','Cent zusammen: {1} ct','Summe: {1}',
     'Bei „3 für 2“ ist ein Teil gratis:','Der Kunde bezahlt nur 2 Stück.','Bei „3 für 2“ ist jedes dritte Teil gratis:','{1} Stück: {2} davon gratis, bezahlt werden {3}.',
     'Erst den Rabatt, dann abziehen:','10 % = Preis ÷ 10 = {1}','25 % = ein Viertel = Preis ÷ 4 = {1}','50 % = die Hälfte = {1}','Über 1 % rechnen:','1 % = Preis ÷ 100 = {1}',
     'Schritt für Schritt – der Gutschein gilt für den neuen Preis:','20 % von {1} = {2} → {3}','10 % von {1} = {2}','Achtung: Das sind nicht 30 %, sondern 28 % Ersparnis.',
     'Ein Teil voll, eins zum halben Preis:','1. Teil: {1}','2. Teil: {1} ÷ 2 = {2}','5 % = die Hälfte davon = {1}','5 % = die Hälfte = {1}','25 % = Preis ÷ 4 = {1}','Schneller: Der Kunde zahlt nur 25 % = {1}',
     'Über 10 % (oder 25 %) rechnen:','Immer mit dem größten Schein oder der größten Münze anfangen, die noch passt:','Das sind {1} Teile.','Das sind 1 Teile.','Begründung:',
     # Ende
     'Vielen Dank für Ihren Einsatz!','Kassen-Legende','Kassen-Ass','Kassen-Azubi','Kassen-Neuling',
     'Alles richtig. Du bist bereit für den Samstag vor Weihnachten.','Sehr sicher an der Kasse. Schau dir die Fehler unten kurz an.','Gute Grundlage. Mit den Rechenwegen unten wirst du schneller.',
     'Noch etwas wackelig. Spiel ohne Zeitbonus und lies die Rechenwege in Ruhe.','Probier als Nächstes die Stufe Kassenprofi.',
     'Das schauen wir uns nochmal an','Keine Fehler in dieser Schicht','Profi-Frage: {1}','Rückgeld: {1}','{1} von {2}','NEU! {1}')
    # Aufgabenarten in Schichtbericht/Bon (kind)
    add('Rückgeld','Summe','Rabatt','Geld herausgeben')
    # Produkte, Waren
    for name in ('PRODUCTS',):
        for n,_ in re.findall(r'\["([^"]+)",(\d+)\]',js_array(src,'PRODUCTS')): add(n)
    for name in ('BIG','SMALL'):
        for n in re.findall(r'"([^"]+)"',js_array(src,name)): add(n)
    add('T-Shirt','Jeans','Bluse','Mütze','Hemd')
    # Profi-Fragen
    mc=js_array(src,'MC')
    for k in ('q','why'):
        for m in re.finditer(r'\b'+k+r':"((?:[^"\\]|\\.)*)"',mc): add(m.group(1))
    for m in re.finditer(r'o:\[((?:"(?:[^"\\]|\\.)*",?)+)\]',mc):
        for o in re.findall(r'"((?:[^"\\]|\\.)*)"',m.group(1)): add(o)
    return seg
if __name__=='__main__':
    s=build(); json.dump(s,open(sys.argv[1],'w'),ensure_ascii=False,indent=0); print(len(s))
