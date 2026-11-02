"""Baut aus pdf_pages.json (Inhalt der 4 PDFs) die Satz-Übersetzungsseiten *_mehrsprachig.html.
Schritt 1 (ohne Übersetzung): erzeugt HTML mit Platzhalter und die Segmentliste.
Aufruf: python3 build_pdfpages.py <pdf_pages.json> <ausgabeordner_segmente>"""
import json,re,html,sys,os
CSS='''
:root{--bg:#f4f7fb;--card:#fff;--ink:#1c2733;--mut:#5a6978;--blue:#1F4E79;--line:#c9d5e2;--soft:#eaf1f8;--warn:#b00020;--ok:#1d6b3a}
@media (prefers-color-scheme:dark){:root{--bg:#121a22;--card:#1b2631;--ink:#e8eef4;--mut:#9fb0c0;--blue:#8ec1f0;--line:#33465a;--soft:#22313f;--warn:#ff8a8a;--ok:#7fd49b}}
*{box-sizing:border-box}html{-webkit-text-size-adjust:100%}
body{margin:0;background:var(--bg);color:var(--ink);font:17px/1.5 system-ui,-apple-system,"Segoe UI","Noto Sans",Arial,sans-serif}
main{max-width:1000px;margin:0 auto;padding:54px 16px 40px}
header.top{margin-bottom:14px}.lf{color:var(--mut);font-size:14px;margin:0}
h1{font-size:26px;line-height:1.2;margin:4px 0 6px;color:var(--blue)}h2{font-size:21px;margin:22px 0 4px;color:var(--blue)}h3{font-size:18px;margin:18px 0 6px;color:var(--blue)}
.meta{color:var(--mut);font-size:15px;margin:2px 0 10px}
.print{display:inline-block;margin:6px 0 10px;padding:9px 14px;border-radius:8px;background:var(--blue);color:var(--bg);text-decoration:none;font-weight:600;font-size:15px}
ol.steps{padding-left:24px;margin:8px 0}ol.steps li{margin:6px 0}
.box{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 14px;margin:12px 0}
.tip{background:var(--soft);border-left:4px solid var(--blue)}
.liste{overflow-x:auto}.liste table{border-collapse:collapse;width:100%;min-width:560px;font-size:15px}.liste th,.liste td{border:1px solid var(--line);padding:5px 4px;text-align:center}.liste th:first-child,.liste td:first-child{text-align:left;white-space:nowrap}
.liste input{width:20px;height:20px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(300px,1fr));gap:14px;margin:12px 0}
.card{background:var(--card);border:1px solid var(--line);border-radius:10px;padding:12px 14px}
.card h3{margin:0 0 2px;font-size:18px}.stufe{font-size:13px;color:var(--mut);margin:0 0 8px}
.card ol{list-style:none;margin:0;padding:0}.card li{margin:8px 0;display:flex;gap:8px}.card li b{min-width:1.2em;color:var(--blue)}
.line{display:block;border-bottom:1px solid var(--mut);height:20px;margin-top:2px;max-width:12em}
details{margin-top:10px}summary{cursor:pointer;font-weight:600;color:var(--blue);padding:4px 0}
.sol li{color:var(--ok);font-weight:600}
.rz h3{font-size:18px}.rz .lab{font-weight:700;margin:10px 0 2px}.rz ul{margin:0;padding-left:20px}.rz li{margin:3px 0}
.falle{color:var(--warn);margin-top:8px}.falle::before{content:"⚠ ";}
.dom .cardd{display:grid;grid-template-columns:96px 1fr;gap:10px;align-items:start;position:relative;padding-bottom:22px}
.dom .left{background:var(--soft);color:var(--blue);font-weight:700;text-align:center;border-radius:6px;padding:8px 4px;font-size:16px;word-break:break-word}
.dom .nr{position:absolute;right:10px;bottom:4px;font-size:12px;color:var(--mut)}
table.sol{border-collapse:collapse;width:100%;font-size:15px}.sol th,.sol td{border:1px solid var(--line);padding:5px 8px;text-align:left}
.tr{border-radius:3px}
@media print{body{background:#fff;color:#000}.print{display:none}}
'''
def needs_tr(s):
    t=re.sub(r'\b(kg|ml|ct|USt|Ø|g|l|h)\b','',s)
    return bool(re.search(r'[A-Za-zÄÖÜäöüß]{3,}',t))
class Reg:
    def __init__(s): s.seg=[]
    def sp(s,de,tag='span'):
        de=' '.join(de.split())
        if not needs_tr(de): return html.escape(de)
        if de not in s.seg: s.seg.append(de)
        return '<span class="tr">%s</span>'%html.escape(de)
    def sents(s,t):
        parts=[x for x in re.split(r'(?<=[.!?])\s+(?=[A-ZÄÖÜ„“"(])',t.strip()) if x]
        return ' '.join(s.sp(x) for x in parts)

def shell(title,body,pdf):
    return '''<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>%s · mehrsprachig</title><style>%s</style></head><body>
<main>
%s
</main>
<script>window.UB_CONFIG={hint:"pdf"};</script>
<script id="uebersetzungen">/*UB_I18N*/</script>
<script>/*UB_ENGINE*/</script>
</body></html>'''%(html.escape(title),CSS,body)

def head(R,pg,sub):
    return '''<header class="top"><p class="lf">%s · %s</p><h1>%s</h1><p class="meta">%s</p>
<a class="print" href="%s">📄 Druckversion (PDF)</a></header>'''%('Lernfeld 3',R.sp('Kunden im Servicebereich Kasse betreuen'),R.sp(pg['title']),R.sp(sub),pg['pdf'])

def rm_page(pg):
    R=Reg();B=[head(R,pg,'Mehrsprachige Online-Fassung · Sprache oben wählen')]
    B.append('<h2>%s</h2><p class="meta">%s</p>'%(R.sp(pg['doc']),R.sp(pg['meta'])))
    if pg['steps']:
        B.append('<h3>%s</h3><ol class="steps">%s</ol>'%(R.sp('So geht es'),''.join('<li>%s</li>'%R.sents(x) for x in pg['steps'])))
    else: B.append('<h3>%s</h3>'%R.sp('So geht es'))
    for t in pg['paras']: B.append('<div class="box tip"><p style="margin:0">%s</p></div>'%R.sents(t))
    # Rechen-Liste
    fr=pg['first'];rows=[]
    for a in (fr,fr+10):
        rows.append('<tr><th>%s</th>%s</tr>'%(R.sp('Karte'),''.join('<th>%d</th>'%n for n in range(a,a+10))))
        rows.append('<tr><td>%s</td>%s</tr>'%(R.sp('alle richtig?'),''.join('<td><input type="checkbox" aria-label="Karte %d"></td>'%n for n in range(a,a+10))))
    B.append('<h3>%s</h3><div class="liste box"><table>%s</table></div>'%(R.sp('Meine Rechen-Liste'),''.join(rows)))
    B.append('<div class="grid">')
    for c in pg['cards']:
        items=''.join('<li><b>%s</b><span>%s<span class="line"></span></span></li>'%(l,R.sp(t)) for l,t in c['items'])
        sol=''.join('<li><b>%s</b><span>%s</span></li>'%(l,R.sp(t)) for l,t in c['sol'])
        B.append('<article class="card"><h3>%s</h3><p class="stufe">%s</p><ol>%s</ol><details><summary>%s</summary><ol class="sol">%s</ol></details></article>'%(
            R.sp('Rechen-Minute %d'%c['n']) if False else 'Rechen-Minute %d'%c['n'],R.sp(c['stufe']),items,R.sp('Lösung zeigen'),sol))
    B.append('</div>')
    rows=''.join('<tr><td>%d</td><td>%s</td><td>%s</td></tr>'%(c['n'],c['stufe'].split()[1],' · '.join('%s) %s'%(l,t) for l,t in c['sol'])) for c in pg['cards'])
    B.append('<details class="box"><summary>%s · %s</summary><table class="sol"><tr><th>%s</th><th>%s</th><th>%s</th></tr>%s</table></details>'%(R.sp('Lösungen auf einen Blick'),R.sp('Für die Lehrkraft'),R.sp('Karte'),R.sp('Stufe'),R.sp('Lösungen'),rows))
    return shell(pg['title'],'\n'.join(B),pg['pdf']),R.seg

def rz_page(pg):
    R=Reg();B=[head(R,pg,'Mehrsprachige Online-Fassung · Sprache oben wählen')]
    B.append('<h2>%s</h2><p class="meta">%s</p>'%(R.sp(pg['doc']),R.sp(pg['meta'])))
    B.append('<h3>%s</h3><ol class="steps">%s</ol>'%(R.sp(pg['h3']),''.join('<li>%s</li>'%R.sents(x) for x in pg['steps'])))
    for t in pg['paras']: B.append('<div class="box tip"><p style="margin:0"><b>%s</b></p></div>'%R.sents(t))
    B.append('<div class="grid rzg">')
    for title,sig,rez,bsp,fa in pg['cards']:
        B.append('<article class="card rz"><h3>%s</h3><div><b>%s</b> %s</div><div class="lab">%s</div><ul>%s</ul><div class="lab">%s</div>%s<div class="falle"><b>%s</b> %s</div></article>'%(
            R.sp(title),R.sp('Signalwörter:'),R.sp(sig),R.sp('Rezept'),''.join('<li>%s</li>'%R.sp(x) for x in rez),R.sp('Beispiel'),''.join('<div>%s</div>'%R.sp(x) for x in bsp),R.sp('Falle:'),R.sp(fa)))
    B.append('</div>')
    return shell(pg['title'],'\n'.join(B),pg['pdf']),R.seg

def dom_page(pg):
    R=Reg();B=[head(R,pg,'Mehrsprachige Online-Fassung · Sprache oben wählen')]
    B.append('<h2>%s</h2><p class="meta">%s</p>'%(R.sp(pg['doc']),R.sp(pg['meta'])))
    B.append('<h3>%s</h3><ol class="steps">%s</ol>'%(R.sp(pg['h3']),''.join('<li>%s</li>'%R.sents(x) for x in pg['steps'])))
    B.append('<div class="grid dom">')
    for c in pg['cards']:
        B.append('<article class="card cardd"><div class="left">%s</div><div>%s</div><span class="nr">Karte %d</span></article>'%(R.sp(c['left']),R.sp(c['task']),c['n']))
    B.append('</div>')
    card={c['n']:c for c in pg['cards']}
    rows=''.join('<tr><td>%d</td><td>%s</td><td>%s</td></tr>'%(s['n'],R.sp(card[s['n']]['task']),R.sp(s['res'])) for s in pg['sol'])
    B.append('<details class="box"><summary>%s</summary><p>%s</p><p>%s</p><table class="sol"><tr><th>%s</th><th>%s</th><th>%s</th></tr>%s</table><p>%s</p></details>'%(
        R.sp('Lösung für die Lehrkraft'),R.sp('Reihenfolge der Kette (beginnt an beliebiger Stelle, Richtung wie unten)'),html.escape(pg['chain'].replace('Kette der Kartennummern:','Kette der Kartennummern:')),R.sp('Karte'),R.sp('Aufgabe'),R.sp('Ergebnis (steht links auf der nächsten Karte)'),rows,R.sents(pg['note'])))
    return shell(pg['title'],'\n'.join(B),pg['pdf']),R.seg

if __name__=='__main__':
    pages=json.load(open(sys.argv[1],encoding='utf8'));out=sys.argv[2];os.makedirs(out,exist_ok=True)
    for key,fn in (('rm1',rm_page),('rm2',rm_page),('rz',rz_page),('dom',dom_page)):
        h,seg=fn(pages[key]);f=pages[key]['file']
        open(os.path.join(out,f+'_mehrsprachig.tpl.html'),'w',encoding='utf8').write(h)
        json.dump(seg,open(os.path.join(out,f+'.segments.json'),'w'),ensure_ascii=False,indent=0)
        print(f,len(seg))
