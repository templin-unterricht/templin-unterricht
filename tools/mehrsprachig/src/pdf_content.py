import re,json
from pdflines import lines
from parse_rm import cards as rm_cards
M='/home/user/templin-unterricht/materials/'
LF='Lernfeld 3'; LFN='Kunden im Servicebereich Kasse betreuen'
def sents(t):
    return [s for s in re.split(r'(?<=[.!?])\s+(?=[A-ZÄÖÜ„“"(])',t.strip()) if s]

pages={}
# ---------- Rechen-Minute ----------
def rm(fr,to,stufen,title,intro_steps,intro_paras,ptitle,pdf):
    c=rm_cards(M+pdf)
    ns=list(range(fr,to+1))
    cs=[{'n':n,'stufe':c[(n,False)]['stufe'],'items':c[(n,False)]['items'],'sol':c[(n,True)]['items']} for n in ns]
    return {'file':'LF3_Rechen-Minute_-_Karten_%d-%d'%(fr,to),'pdf':pdf,'title':'Rechen-Minute – Stufe %s'%stufen,'doc':'Rechen-Minute: Karten %d bis %d'%(fr,to),
      'meta':intro_steps['meta'],'steps':intro_steps['steps'],'paras':intro_paras,'cards':cs,'first':fr,'last':to}
pages['rm1']=rm(1,20,'1 und 2',None,
  {'meta':'Für DS 1 bis DS 19 · Stufe 1: Geld und Komma (ohne Taschenrechner) · Stufe 2: Runden, Einheiten, Taschenrechner',
   'steps':['Zu Beginn jeder Doppelstunde bekommt jedes Tandem eine Karte (Karte 1 in DS 1, Karte 2 in DS 2 …).',
            'Jede Person rechnet die drei Aufgaben allein – höchstens 5 Minuten.',
            'Dann vergleicht das Tandem mit der Rückseite und erklärt sich gegenseitig die Fehler (5 Minuten).',
            'Wer alle drei richtig hat, macht einen Strich in seiner Rechen-Liste. Nach 10 Karten: Wie viele Striche?']},
  ['Tipp für die Lehrkraft: Die Karten auf festes Papier beidseitig drucken (Wenden an der langen Kante), dann liegt die Lösung auf der Rückseite. Ab DS 20 folgen die Karten der Stufen 3 und 4 mit dem Rechenblock.'],None,'LF3_Rechen-Minute_-_Karten_1-20.pdf')
pages['rm2']=rm(21,40,'3 und 4',None,
  {'meta':'Für DS 21 bis DS 40 · Stufe 3: Wiederholung früherer Rechenarten · Stufe 4: gemischte Prüfungsaufgaben',
   'steps':[]},
  ['Wie bei den Karten 1–20: Tandem, 5 Minuten rechnen, 5 Minuten vergleichen. Ab jetzt immer mit Taschenrechner und Rezeptkarte.',
   'Die Karten wiederholen bewusst frühere Rechenarten (verteiltes Üben): Karte 25 zum Beispiel übt Prozent, während der Unterricht schon beim Prozentsatz ist. Ab Karte 31 sind alle Rechenarten gemischt – wie in der Prüfung.',
   'Druck: beidseitig auf festes Papier, Wenden an der langen Kante.'],None,'LF3_Rechen-Minute_-_Karten_21-40.pdf')

# ---------- Rezeptkarten ----------
RZ=[
 ('Rezeptkarte 1 Dreisatz','„… kosten …, wie viel kosten …?“ · Prämie · Umtausch · je',['bekannter Wert : bekannte Menge × gesuchte Menge','erst auf 1, dann auf das Gesuchte'],['3 kg kosten 5,70 €. 5 kg?','5,70 : 3 × 5 = 9,50 €'],'Richtung prüfen: mehr Ware → mehr Geld?'),
 ('Rezeptkarte 2 Grundpreis und lose Ware','„je kg / je l / je 100 g“ · Tee · Käse · Schokolade',['Grundpreis = Preis : Menge in kg (l)','lose Ware = Preis je kg × Menge in kg'],['750 ml für 7,95 €: 7,95 : 0,75 = 10,60 € je l','150 g zu 14,20 €/kg: 0,15 × 14,20 = 2,13 €'],'Gramm in kg: 125 g = 0,125 kg'),
 ('Rezeptkarte 3 Prozentwert','„… % von …“ · „wie viel Euro Rabatt / Anteil?“',['P = G : 100 × p','Wert nach Abzug: G : 100 × (100 − p)','Wert nach Aufschlag: G : 100 × (100 + p)'],['25 % von 198 €: 198 : 100 × 25 = 49,50 €'],'keine %-Taste! 10 % = Komma 1 Stelle nach links'),
 ('Rezeptkarte 4 Prozentsatz','„Wie viel Prozent …?“ · „Um wie viel Prozent …?“ · Anteil',['p = P × 100 : G','Preissenkung: P = Differenz, G = alter Preis','Anteil: G = Summe aller Teile'],['69,95 € → 55,95 €: 14,00 × 100 : 69,95 = 20,01 → 20 %'],'G ist der alte Preis, nicht der neue · Rundungsvorgabe!'),
 ('Rezeptkarte 5 Grundwert – Preis vorher','„ursprünglicher Preis“ · „vor dem Rabatt“ · „Rechnungsbetrag vor Skonto“',['G = P : p × 100','Preis vorher = neuer Preis : (100 − p) × 100'],['nach 10 % Rabatt 180 €: 180 : 90 × 100 = 200,00 €'],'NICHT 180 + 10 % (= 198 € ist falsch)'),
 ('Rezeptkarte 6 Rabatt, Coupon, Skonto','„Coupon“ · „Rabatt“ · „Überweisungsbetrag nach Skonto“',['zu zahlen = Preis : 100 × (100 − p)','zwei Nachlässe: nacheinander, der zweite vom neuen Betrag'],['287,20 € mit 15 % Coupon: 287,20 : 100 × 85 = 244,12 €','3.820 € mit 3 % Skonto: 3.820 : 100 × 97 = 3.705,40 €'],'−20 % und −25 % sind nicht −45 %'),
 ('Rezeptkarte 7 Umsatzsteuer','„enthalten“ · „netto“ · „brutto“ · „inkl. USt“ · Kassenbon',['USt herausrechnen: brutto : 119 × 19 (7 %: : 107 × 7)','netto = brutto : 119 × 100','brutto = netto : 100 × 119'],['228,50 € brutto: 228,50 : 119 × 19 = 36,48 € USt'],'NIE 19 % vom Bruttopreis · Probe: netto + USt = brutto'),
 ('Rezeptkarte 8 Durchschnitt','„im Durchschnitt“ · „je Kunde / je Stunde / je m²“ · „Durchschnittspreis“',['einfach: Summe : Anzahl','gewogen: Summe (Menge × Preis) : Summe der Mengen','Ø-Lagerbestand Jahr: (Anfang + 12 Monatsenden) : 13'],['7 × 7,40 + 3 × 12,30 + 4 × 9,75 + 8 × 11,40 = 218,90 €','218,90 : 22 Mützen = 9,95 €'],'Stunden genau zählen (9:00–13:30 = 4,5 h) · Kunden ganzzahlig'),
 ('Rezeptkarte 9 Verteilungsrechnung','„verteilt nach Fläche / Gewicht / Stück / Personen“ · „anteilig“',['Kosten : Summe der Anteile × eigener Anteil','Probe: alle Teile zusammen = Kosten'],['6.000 € nach 800 + 1.200 + 1.000 m²: 6.000 : 3.000 × 800 = 1.600,00 €'],'erst die Summe der Anteile bilden'),
 ('Rezeptkarte 10 Kasse','„Tagesumsatz“ · „Kassendifferenz“ · „Soll-Bestand“ · „Kasseneröffnung“',['Tageslosung = Bargeld + Abschöpfung − Wechselgeld','Tagesumsatz = Tageslosung + Karte','Soll = Wechselgeld + Barumsatz − Entnahmen · Differenz = Ist − Soll'],['3.450 + 2.000 − 600 + 3.150 = 8.000,00 € Tagesumsatz'],'Karte gehört NIE in den Bargeld-Soll · Minus = Fehlbetrag'),
]
pages['rz']={'file':'LF3_Rezeptkarten_Rechnen','pdf':'LF3_Rezeptkarten_Rechnen.pdf','title':'Rezeptkarten Rechnen','doc':'Rezeptkarten: 10 Karten für die Prüfungsrechnungen',
 'meta':'Ausschneiden, lochen oder in eine Klarsichthülle · erlaubt in Übungsklausur 2 und Klausur 2 (ohne eigene Zusätze)',
 'h3':'So benutzt du die Karten',
 'steps':['Lies die Aufgabe und markiere, was gesucht ist.','Suche die Signalwörter – sie zeigen dir die richtige Karte.','Rechne nach dem Rezept und vergleiche mit dem Beispiel.','Lies die Falle – dort passieren die meisten Fehler.'],
 'paras':['Wichtig: In der Abschlussprüfung gibt es keine Rezeptkarten. Übe deshalb im Rechenfit-Block auch ohne Karten.'],'cards':RZ}

# ---------- Domino ----------
P=lines(M+'LF3_Rechen-Domino.pdf')
dom={}
for pi in (1,2):
    W,H,L=P[pi]
    labs=[l for l in L if re.match(r'^Karte \d+$',l['t'])]
    for lab in labs:
        n=int(lab['t'].split()[1]); right=lab['x0']>W/2
        x0,x1=(W/2,W) if right else (0,W/2)
        # Zeilenband: oberhalb des Labels bis Label der vorherigen Reihe
        prev=[l['y0'] for l in labs if l['y0']<lab['y0']-30]
        ytop=max(prev) if prev else 0
        cell=[l for l in L if x0<=l['x0']<x1 and ytop+4<l['y0']<lab['y0']-1 ]
        boxsplit=(W/2+ (370-300)-6) if right else 130
        box=[l['t'] for l in cell if l['x0']<(335 if right else 128)]
        task=[l['t'] for l in sorted(cell,key=lambda l:(l['y0'],l['x0'])) if l['x0']>=(335 if right else 128) and l['x0']<(W if right else W/2)]
        dom[n]={'n':n,'left':' '.join(box),'task':' '.join(task)}
# Lösung aus Seite 4
txt=__import__('subprocess').run(['pdftotext','-layout','-f','4','-l','4',M+'LF3_Rechen-Domino.pdf','-'],capture_output=True,text=True).stdout
chain=re.search(r'Kette der Kartennummern: (.*?)\(zurück zu (\d+)\)',txt,re.S)
chain_txt=' '.join(chain.group(0).split())
sol=[]
for m in re.finditer(r'^(\d+)\s{2,}(.+?)\s{2,}(\S.*?)$',txt,re.M):
    sol.append({'n':int(m.group(1)),'task':m.group(2).strip(),'res':m.group(3).strip()})
# mehrzeilige Aufgaben (Fortsetzungszeilen)
lines_=txt.split('\n');
for i,l in enumerate(lines_):
    m=re.match(r'^(\d+)\s{2,}(.+?)\s{2,}(\S.*?)$',l)
    if m and i+1<len(lines_) and re.match(r'^\s{8,}[A-Za-zÄÖÜ]',lines_[i+1]) and not re.match(r'^\s{8,}\S.*\s{2,}',lines_[i+1]) is None:
        pass
pages['dom']={'file':'LF3_Rechen-Domino','pdf':'LF3_Rechen-Domino.pdf','title':'Spiel – Rechen-Domino','doc':'Rechen-Domino: 24 Karten, eine geschlossene Kette',
 'meta':'Wiederholung aller Rechenarten · z. B. DS 37 (Rechen-Stationen) oder als Einstieg in eine Rechen-Stunde · Gruppen zu dritt, 20 Minuten',
 'h3':'So geht es',
 'steps':['Jede Gruppe bekommt einen gemischten Kartensatz (Karten ausschneiden, jede Karte ist ein Rechteck mit zwei Feldern).',
  'Eine beliebige Karte liegt als Start in der Mitte. Rechnet die Aufgabe rechts. Sucht die Karte, auf der das Ergebnis links im blauen Feld steht, und legt sie an.',
  'Weiter so, bis die Kette geschlossen ist: Die letzte Aufgabe führt wieder zur ersten Karte.',
  'Taschenrechner und Rezeptkarten sind erlaubt. Wer fertig ist, schreibt die Reihenfolge der Karten-Nummern (klein unten) auf – die Lehrkraft kontrolliert mit der Lösung.'],
 'paras':[],'cards':[dom[n] for n in sorted(dom)],'chain':chain_txt,'sol':sol,
 'note':'Merke: Alle Aufgaben sind selbst formuliert – Karten und Lösung dürfen auf itslearning. Tipp: Kartensätze auf farbiges Papier kopieren (eine Farbe je Gruppe), dann mischen sich die Sätze nicht.'}
json.dump(pages,open('pdf_pages.json','w'),ensure_ascii=False,indent=1)
print({k:len(v.get('cards',[])) for k,v in pages.items()}, len(sol))
for n in (1,2,16,24): print(dom[n])
print(chain_txt[:200]); print(sol[:3],sol[-2:])
