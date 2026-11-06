"""Baut materials/LF1_Modul_1-12_-_Rettet_Kaje_7_mehrsprachig.html (TI·RU·ES·PT) aus dem Original, kaje7/units.json, kaje7/compose.json und kaje7/t*.py.
Aufruf: python3 build_kaje7.py   (vorher kaje7_prep.py; t*.py enthalten T={Einheiten-Nr: [ti,ru,es,pt]})"""
import sys,json,os,glob,re,importlib.util
here=os.path.dirname(os.path.abspath(__file__)); repo=os.path.abspath(os.path.join(here,'..','..')); K=here+'/kaje7'
units=json.load(open(K+'/units.json')); compose=json.load(open(K+'/compose.json'))
T={}
for f in sorted(glob.glob(K+'/t*.py')):
    sp=importlib.util.spec_from_file_location('m',f); m=importlib.util.module_from_spec(sp); sp.loader.exec_module(m)
    dup=set(T)&set(m.T)
    if dup: print('WARN doppelt in',os.path.basename(f),sorted(dup)[:5])
    T.update(m.T)
missing=[i for i in range(len(units)) if i not in T]
bad=[]
for i in [i for i,v in T.items() if v==0]: T[i]=[units[i]]*4   # 0 = in allen Sprachen unveraendert (Namen)
for i,v in T.items():
    if i>=len(units): bad.append((i,'Nummer zu gross'));continue
    if len(v)!=4: bad.append((i,'nicht 4 Sprachen'));continue
    n=units[i].count('§')
    for j,x in enumerate(v):
        if x.count('§')!=n: bad.append((i,'§-Anzahl',j,units[i][:50],x[:50]))
print('Einheiten',len(units),'uebersetzt',len(T),'fehlen',len(missing),'Fehler',len(bad))
for b in bad[:20]: print(' ',b)
if missing and '--partial' not in sys.argv:
    print('fehlende Nummern (erste 30):',missing[:30]); sys.exit(1)
trd={}
for k,items in compose.items():
    out=[]
    for j in range(4):
        s=''
        for l,u,r in items:
            s+=l+(T[u][j] if u is not None and u in T else (units[u] if u is not None else ''))+r
        out.append(s)
    if all(x==k for x in out): continue
    trd[k]=out
json.dump(trd,open(K+'/woerterbuch.json','w'),ensure_ascii=False,indent=0)
layer=open(here+'/layer.js',encoding='utf8').read().replace('__TRD__',json.dumps(trd,ensure_ascii=False,separators=(',',':'))).replace('__KEY__','kaje7')
src=open(repo+'/materials/LF1_Modul_1-12_-_Rettet_Kaje_7.html',encoding='utf8').read()
out=src.replace('<title>Rettet Kaje 7</title>','<title>Rettet Kaje 7 (mehrsprachig)</title>',1)
blk='<script>\n'+layer.replace('</script','<\\/script')+'\n</script>\n'
i=out.rindex('</body>'); out=out[:i]+blk+out[i:]
open(repo+'/materials/LF1_Modul_1-12_-_Rettet_Kaje_7_mehrsprachig.html','w',encoding='utf8').write(out)
print(len(trd),'Eintraege',len(out),'Bytes')
