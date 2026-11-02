"""Baut alle *_mehrsprachig.html in materials/ aus Übersetzungsdateien.
Aufruf: python3 build_all.py <arbeitsordner>   (enthält pool_index.json, seg_all.json, trans/<sprache>/chunk_*.json, db_data.json)"""
import json,glob,os,sys,re
sys.path.insert(0,os.path.dirname(os.path.abspath(__file__)))
import lib,build_pdfpages as bp,segs_deich as sd
W=sys.argv[1]; REPO=os.path.abspath(os.path.join(os.path.dirname(__file__),'..','..','..')); MAT=os.path.join(REPO,'materials')
idx=json.load(open(W+'/pool_index.json')); seg=json.load(open(W+'/seg_all.json'))
LANGS=['tr','vi','ar']; T={l:{} for l in LANGS}
for l in LANGS:
    for f in sorted(glob.glob(f'{W}/trans/{l}/chunk_*.json')): T[l].update(json.load(open(f)))
def entry(de):
    i=idx[de]; e={l:T[l].get(i) for l in LANGS}
    return e if all(e.values()) else None
def dictfor(keys,missing):
    d={}
    for k in keys:
        e=entry(k)
        if e: d[k]=e
        else: missing.append(k)
    return d
missing=[]
# von Hand ergänzte kurze Einträge (nicht aus der Übersetzungsrunde)
EXTRA={'blitz':{'je {1}':{'tr':'birimi {1}','vi':'mỗi cái {1}','ar':'للواحد {1}'}},
 'deich':{'Junger Mann':{'tr':'Genç adam','vi':'Chàng trai trẻ','ar':'شاب'},'Junge':{'tr':'Oğlan çocuğu','vi':'Cậu bé','ar':'ولد'},
  'Zwei Mädchen':{'tr':'İki kız','vi':'Hai cô bé','ar':'فتاتان'},'Du selbst':{'tr':'Sen kendin','vi':'Chính bạn','ar':'أنت نفسك'}}}
os.makedirs(os.path.join(REPO,'tools/mehrsprachig/i18n'),exist_ok=True)
def save(name,d):
    json.dump(d,open(os.path.join(REPO,'tools/mehrsprachig/i18n',name+'.json'),'w',encoding='utf8'),ensure_ascii=False,indent=1)
pages=json.load(open(os.path.join(os.path.dirname(__file__),'pdf_pages.json')))
ML={}
# --- PDF-Seiten
for key,fn in (('rm1',bp.rm_page),('rm2',bp.rm_page),('rz',bp.rz_page),('dom',bp.dom_page)):
    html,segs=fn(pages[key]); f=pages[key]['file']
    d=dictfor(segs,missing); save(f,d)
    out=f+'_mehrsprachig.html'; open(os.path.join(MAT,out),'w',encoding='utf8').write(lib.assemble_page(html,d))
    ML['materials/'+pages[key]['pdf']]=out
# --- Apps
apps={'escape':'LF3_Escape_Room_-_Kassensturz','blitz':'LF3_Blitzkasse_-_Kopfrechnen_an_der_Kasse','deich':'LF3_Modul_1-10_-_Festival-Kasse_Deichbeat'}
dbd=json.load(open(W+'/db_data.json'))
for key,f in apps.items():
    d=dictfor(seg[key],missing); d.update(EXTRA.get(key,{}))
    if key=='deich':   # zusammengesetzte Texte aus den Teil-Übersetzungen
        for k,parts,sep in sd.derived(dbd):
            if all(p in d for p in parts):
                v={}
                for l in LANGS:
                    ts=[d[p][l] for p in parts]
                    v[l]='„'+ts[0]+'“' if sep=='quote' else sep.join(ts) if sep!=': ' else ts[0]+': '+ts[1]
                d[k]=v
    save(f,d)
    src=open(os.path.join(MAT,f+'.html'),encoding='utf8').read()
    open(os.path.join(MAT,f+'_mehrsprachig.html'),'w',encoding='utf8').write(lib.inject_app(src,d,{'mode':True}))
    ML['materials/'+f+'.html']=f+'_mehrsprachig.html'
# --- Dashboard-Daten (Sprach-Buttons)
js='/* Sprach-Buttons TR · VI · AR im Dashboard (Lernstoff > Modulübergreifend). Schlüssel = Pfad des Originals. */\nwindow.UEB_ML='+json.dumps({k:{l:'materials/'+v+'?lang='+l for l in LANGS} for k,v in ML.items()},ensure_ascii=False,indent=1)+';\n'
open(os.path.join(REPO,'uebersicht_mehrsprachig.js'),'w',encoding='utf8').write(js)
print('fehlende Übersetzungen:',len(missing)); [print(' ',m[:90]) for m in missing[:10]]
