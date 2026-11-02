"""Deutsche Texte von Deichbeat: Inhalte aus den Datenfeldern der App + Oberfläche (Vorlagen mit {1} {2} …)."""
import json,sys,re
def collect(d):
    seg=[]
    def add(x):
        if isinstance(x,str):
            x=' '.join(x.split())
            if x and x not in seg and re.search(r'[A-Za-zÄÖÜäöüß]{2,}',x): seg.append(x)
    for c in d['CH']:
        for k in ('title','topic','story'): add(c[k])
        for w in c['words']: add(w)
        for v in c['decs']:
            for x in v:
                add(x['who']['n']) if False else None
                add(x['who']['d']); add(x['sit']); add(x['q']); add(x['term']); add(x['def']); add(x['ihk'])
                for o in x['opts']: add(o['t']); add(o['say']); add(o['why'])
                for w in x['weil']: add(w)
        for p in c['profi']:
            add(p['q'])
            for o in p['opts']: add(o)
            for k in ('why','hint'):
                if k in p: add(p[k])
    for l in d['BON']['lines']: pass
    for k,v in d['BON'].items():
        if isinstance(v,str): add(v)
    for x in d['ABLAUF']: add(x)
    for x in d['FSK']: add(x['t']); add(x['a'])
    for x in d['ZAHL']: add(x['t']); add(x['a'])
    for x in d['JUG']: add(x['w']); add(x['why'])
    for x in d['AMPEL']: add(x['t']); add(x['why'])
    for x in d['GNA']: add(x['t']); add(x['why'])
    for x in d['ZEIT']:
        for dt,t in x['steps']: add(t)
        add(x['why'])
    for x in d['BESITZ']: add(x['t'])
    for x in d['EVENTS']: add(x['title']); add(x['text']); add(x['good']); add(x['bad'])
    for x in d['ASPEKTE']: add(x)
    for x in d['TALK']:
        add(x['sit']); add(x['a'])
        for grp in x['s']:
            for s in grp: add(s)
    for r in d['ROUTES'].values(): add(r['name']); add(r['sub'])
    for v in d['MINI_TITLE'].values(): add(v)
    return seg
UI=[
 'Alle Fälle hier geschafft – jetzt geht es gemischt von vorn los.','Keine Fehler mehr zum Wiederholen – stark!','Team Deich','Lernfeld 3','DEICHBEAT 2026 · {1}','Festival-Ruf {1}','noch nicht gespielt',
 'Lernfeld 3 · Modul 1–10 · Kasse und Recht','Festival-Kasse Deichbeat',
 'Drei Tage Festival in Nordholz, 40.000 Gäste – und ihr führt die Kasse im Pop-up-Store vom Nordlicht Markt aus Bremerhaven. Nur der Stand mit dem besten Ruf darf 2027 wiederkommen.',
 'Euer Teamname','Euer Fortschritt auf diesem Gerät','Neue Fälle für euch:','{1} von {2}','Sprachnachricht von Jana Ahrens, Filialleiterin','So spielt ihr:',
 'Ihr trefft gemeinsam Entscheidungen. Die Gäste reagieren sofort. Gute Entscheidungen bringen Punkte und Festival-Ruf.','Am Ende seht ihr zu jeder Entscheidung, wie es in der Prüfung steht.',
 "Los geht's",'Modul {1} · {2}','Zur ersten Situation','Modul {1} · Situation {2} von 2','Entscheidung festlegen','Tipp-Joker ({1})','Teilweise richtig','Profi: Begründung wählen',
 'Die beste Lösung ist:','Warum? Wählt den passenden „weil“-Satz.','Darum:','Mini-Spiel · bis zu 10 Punkte','Geschafft!','{1} von 10 Punkten','Lina hält euch einen Bon hin.',
 'Tippt auf die Zeile mit: {1}','Ein Gast zahlt bar. Tippt die Schritte in der richtigen Reihenfolge an. {1} Fehler: {2}','Der Ausweis zeigt:','{1} Jahre','Nicht verkaufen','Tafel an der Kasse',
 'ab 16: Bier, Wein, Sekt, Mischgetränke mit Bier oder Wein','ab 18: Branntwein (Schnaps, Wodka, Likör) und Mischgetränke damit, Lebensmittel mit Branntwein, Tabak, E-Zigaretten (auch ohne Nikotin), Feuerwerk F2',
 'Altersregeln anzeigen','Rot · nichtig','Gelb · schwebend unwirksam','Grün · gültig','Tippt auf den Tag, an dem der Kaufvertrag zustande kommt',
 'Tipp: Erst prüfen, ob das Angebot verbindlich ist. Lieferung und Zahlung sind nie der Tag des Kaufvertrags.',
 'Kasse 1, Samstag 23:30 Uhr. Rechnet die Tageslosung und den Tagesumsatz aus.','Kassenschlussbestand (gezählt)','Abschöpfung (mittags aus der Kasse genommen)','Wechselgeld (morgens eingezählt)',
 'Schritt 1: Wird der Betrag','addiert (+)','abgezogen (−)','Schritt 2: Tageslosung in €','Tageslosung:','Schritt 3: Tagesumsatz in €','Richtig:','Das prüft man durch','Gemeint ist:','schwebend unwirksam','Richtig wäre:','Der Kaufvertrag kommt am',
 'Richtig gefunden!','Die grün markierte Zeile ist richtig.','Höflich anfangen','Grund nennen','Lösung anbieten','Kundengespräch · 3 Punkte wie in der Prüfung','Was sagst du?','1 · Worauf musst du achten? (1 Punkt)',
 '2 · Baue deinen Satz in wörtlicher Rede (2 Punkte)','Aspekt:','So bekommst du volle Punkte:','Für Profis · 5 Punkte','Ole fragt nach','Ole Brodersen','Ruf {1}','Das Ereignis prüft eure Entscheidungen aus Modul {1}.',
 'Platz an der Hauptbühne 2027!','Ole Brodersen gibt euch den besten Platz auf dem ganzen Gelände. Jana ist sprachlos.','Ihr dürft 2027 wiederkommen.',
 'Ole ist zufrieden. Euer Stand war besser als die Snackbude Zack – an ein paar Stellen geht aber noch mehr.','Diesmal nicht.','Ole sagt: „Zu viele Pannen.“ Spielt noch eine Runde und zeigt, dass ihr es besser könnt.',
 'Punktekarte · {1}','Sonntag, 23:59 Uhr · Ole Brodersen verkündet','Snackbude Zack','Nochmal mit neuen Fällen','Andere Strecke oder anderer Modus','So steht es in der Prüfung',
 'Zu jeder Entscheidung: eure Wahl, die Begründung und der Satz wie in der IHK-Prüfung.','Eure Wahl: {1}','So steht es in der Prüfung:','Mini-Spiel „{1}“: {2} von 10 Punkten','Profi-Frage: {1} – {2}','Kundengespräch: {1} von 3 Punkten','Aspekt: {1} (1 Punkt) · {2} (2 Punkte)',
 'Musik an – Handy leise stellen oder Kopfhörer nutzen.','Fortschritt zurückgesetzt.','Eine falsche Antwort ist gestrichen. (−2 Punkte)','Bitte eine Zahl eingeben, z. B. 2.345,60',
 'Besitzer: {1} (hat die Sache) · Eigentümer: {2} (ihm gehört sie).',
]

UI2=[
 'DEICHBEAT 2026 · 14.–16. AUG · NORDHOLZ','DEICHBEAT 2026 · {1}','Festival-Ruf {1}','Punkte',
 'Strecke','Modus','Anfänger','3 Tipp-Joker · Wortspeicher · einfache Fälle','Profi','Zu jeder Entscheidung die Begründung wählen · Profi-Fragen · keine Joker',
 'Klassen-Challenge (freiwillig)','Mit demselben Code, derselben Strecke und demselben Modus bekommen alle Teams dieselben Fälle und Zwischenfälle. So könnt ihr fair vergleichen.','Tagescode','Festival starten','Fehler wiederholen',
 'Anfänger: noch nicht gespielt','Profi: noch nicht gespielt','Anfänger: Rekord {1} %','Profi: Rekord {1} %','Gespeichert wird nur auf diesem Gerät.','Speichern ist in diesem Browser nicht möglich. Das Spiel läuft trotzdem, merkt sich aber nichts.',
 'Fortschritt zurücksetzen','Wirklich alles zurücksetzen?','Ja, zurücksetzen','Nein','Wiederholen','{1} Situation, die ihr noch nicht richtig hattet','{1} Situationen, die ihr noch nicht richtig hattet','Neue Fälle für euch: {1} von {2}',
 'Sonntag, 10:30 Uhr','Freitag, 13:45 Uhr','Der letzte Festivaltag','Willkommen am Deich','Sprachnachricht von Jana Ahrens, Filialleiterin',
 '„Hallo {1}! Heute spielt ihr nur die Situationen, die beim letzten Mal noch nicht geklappt haben. Zeigt Ole, dass ihr dazugelernt habt!“',
 '„Hallo {1}! Freitag und Samstag liefen super. Heute ist Familientag, und heute geht es um Recht: Wer darf was kaufen? Welche Verträge gelten? Ole Brodersen entscheidet heute Abend, wer 2027 wiederkommt.“',
 '„Hallo {1}! Ich stecke mit dem Lieferwagen im Stau auf der A27. Ihr müsst den Stand allein starten. Ole Brodersen von der Festivalleitung beobachtet alle Stände. Nur der beste darf 2027 wiederkommen. Und passt auf Kevin von der Snackbude Zack nebenan auf – der nimmt es mit den Regeln nicht so genau.“',
 'So spielt ihr: Ihr trefft gemeinsam Entscheidungen. Die Gäste reagieren sofort. Gute Entscheidungen bringen Punkte und Festival-Ruf.',
 'Profi: Nach jeder Entscheidung wählt ihr die richtige Begründung. Punkte gibt es nur, wenn beides stimmt.',
 'Anfänger: Ihr habt 3 Tipp-Joker. Ein Joker streicht eine falsche Antwort (kostet 2 Punkte). Im Wortspeicher stehen die Fachbegriffe.',
 'FR {1}','SA {1}','SO {1}','Modul {1} · {2}','Modul {1} · Situation {2} von 2',
 'Darum: {1}','Die beste Lösung ist: {1}','Die beste Lösung ist: {1} Warum? Wählt den passenden „weil“-Satz.','Richtige Begründung: {1}','Richtige Begründung:','Besser: {1}','Besser:','So steht es in der Prüfung: {1}','Begründung richtig.',
 'Begründung falsch. Richtig ist: {1}','Begründung falsch. Richtig ist: {1} Ohne richtige Begründung gibt es keine Punkte.','Top-Entscheidung','Teilweise richtig','Daneben','✓ Top-Entscheidung','~ Teilweise richtig','✗ Daneben',
 'Das rächt sich jetzt.','Das rächt sich jetzt. {1} Ruf {2}','Gut vorbereitet! {1} Ruf {2}','Gut vorbereitet!','Zwischenfall','Weiter','Prüfen','Wortspeicher','Entscheidung festlegen','Tipp-Joker ({1})',
 'Lina hält euch einen Bon hin. Tippt auf die Zeile mit: {1} ({2}/{3})','Ein Gast zahlt bar. Tippt die Schritte in der richtigen Reihenfolge an. Der erste Schritt liegt schon. Fehler: {1}','Ein Gast zahlt bar. Tippt die Schritte in der richtigen Reihenfolge an. Fehler: {1}',
 'Tippt auf den Tag, an dem der Kaufvertrag zustande kommt. ({1}/{2})','{1} Der Ausweis zeigt: {2} Jahre','Der Ausweis zeigt: {1} Jahre','Verkaufen','Nicht verkaufen',
 'Richtig: {1}.','Das prüft man durch {1}.','Gemeint ist: {1}.','Richtig. {1}','Falsch. {1}','Richtig: {1}. {2}','Richtig wäre: {1}. {2}','Der Kaufvertrag kommt am {1} zustande. {2}','Richtig gefunden!','Die grün markierte Zeile ist richtig.',
 'Fühlen','Sehen','Kippen','nichtig','schwebend unwirksam','gültig','anfechtbar','plus','minus','Rot · nichtig','Gelb · schwebend unwirksam','Grün · gültig',
 'Wer hat die Sache? (Besitzer)','Wem gehört die Sache? (Eigentümer)','Besitzer: {1} (hat die Sache) · Eigentümer: {2} (ihm gehört sie).',
 'Schritt 1: Wird der Betrag addiert (+) oder abgezogen (−)?','Richtig! Abschöpfung + (eingenommenes Geld, nur nicht mehr in der Kasse), Wechselgeld − (war schon morgens drin).',
 'Nicht ganz. Abschöpfung + (eingenommenes Geld, nur nicht mehr in der Kasse), Wechselgeld − (war schon morgens drin).','Kartenzahlungen','Tageslosung = {1} + {2} − {3}','Tagesumsatz = Tageslosung + Kartenzahlungen',
 'Tageslosung: {1} € – stimmt!','Tageslosung: {1} € – so wäre es richtig.','Tagesumsatz: {1} + {2} = {3} € – stimmt!','Tagesumsatz: {1} + {2} = {3} € – so wäre es richtig.',
 'Aspekt: {1} {2} · Ansprache: {3} von 2 Punkten So bekommst du volle Punkte: {4}','Stark! Das war eine Profi-Frage.','Nicht ganz. Die grüne Antwort ist richtig.','Nicht ganz.','Richtig!',
 '{1}Festival-Ruf','{1}Top-Entscheidungen','{1}Zwischenfälle','{1} % · {2} · {3}','Modul {1} · {2}','Eure Wahl: {1}','Mini-Spiel „{1}“: {2} von 10 Punkten','Profi-Frage: {1} – {2}','richtig','falsch',
 'Kundengespräch: {1} von 3 Punkten','So steht es in der Prüfung: Aspekt: {1} (1 Punkt) · {2} (2 Punkte)','Tippt auf den Tag, an dem der Kaufvertrag zustande kommt.','Zeile','Weiter','Bon','Kasse',
]
UI2+=['Kaufvertrag zustande kommt','Anfänger:','Profi:','USt-IdNr. DE 999 999 999','Fr 14.08.2026 · 16:42 Uhr','NORDLICHT MARKT · Pop-up-Store Deichbeat-Festival, Stand 14 · Nordholz','Sonnencreme 50 ml 8,99 € A','Brezel','2 Stk × 2,20 €','4,40 € B','SUMME 13,39 €','Bar gegeben 20,00 €','Rückgeld 6,61 €','A 19 % netto 7,55 USt 1,44 B 7 % netto 4,11 USt 0,29','Bon 0417 · Kasse 1 · Lina','TSE-Transaktion 88231 · Signatur 7F3A…']

if __name__=='__main__':
    d=json.load(open(sys.argv[1])); s=collect(d)
    for v in d['BON']['q'].values():
        if v not in s: s.append(v)
    for b in d['BESITZ']:
        for p in b['p']:
            if p not in s: s.append(p)
    for u in UI+UI2:
        if u not in s: s.append(u)
    json.dump(s,open(sys.argv[2],'w'),ensure_ascii=False,indent=0); print(len(s))

def derived(d):
    """zusammengesetzte Texte (Begriff + Erklärung, Zitat mit „…“): liefert [(schlüssel, [teile...], trenner)]"""
    out=[]
    for c in d['CH']:
        for v in c['decs']:
            for x in v:
                out.append((f"{x['term']} {x['def']}",[x['term'],x['def']],': '))
                for o in x['opts']: out.append((f"„{o['say']}“",[o['say']],'quote'))
    for t in d['TALK']:
        pass
    out.append(('Tafel an der Kasse ab 16: Bier, Wein, Sekt, Mischgetränke mit Bier oder Wein ab 18: Branntwein (Schnaps, Wodka, Likör) und Mischgetränke damit, Lebensmittel mit Branntwein, Tabak, E-Zigaretten (auch ohne Nikotin), Feuerwerk F2',
      ['Tafel an der Kasse','ab 16: Bier, Wein, Sekt, Mischgetränke mit Bier oder Wein','ab 18: Branntwein (Schnaps, Wodka, Likör) und Mischgetränke damit, Lebensmittel mit Branntwein, Tabak, E-Zigaretten (auch ohne Nikotin), Feuerwerk F2'],' – '))
    return out
