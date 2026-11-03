"""Baut materials/LF1_Escape_Room_2_-_Die_neue_Filiale_mehrsprachig.html (TI·RU·ES·PT) aus dem Original + er2/t*.py.
Aufruf: python3 build_er2.py <leaf.json>  (Liste der deutschen Texte, Index = Schlüssel in t*.py)"""
import sys,json,os,glob,importlib.util
here=os.path.dirname(os.path.abspath(__file__)); repo=os.path.abspath(os.path.join(here,'..','..'))
leaf=json.load(open(sys.argv[1]))
T={}
for f in sorted(glob.glob(here+'/er2/t*.py')):
    sp=importlib.util.spec_from_file_location('m',f); m=importlib.util.module_from_spec(sp); sp.loader.exec_module(m); T.update(m.T)
trd={leaf[i]:v for i,v in T.items() if not all(x==leaf[i] for x in v)}
json.dump(trd,open(here+'/er2/woerterbuch.json','w'),ensure_ascii=False,indent=0)
layer=open(here+'/layer.js',encoding='utf8').read().replace('__TRD__',json.dumps(trd,ensure_ascii=False)).replace('__KEY__','er2')
src=open(repo+'/materials/LF1_Escape_Room_2_-_Die_neue_Filiale.html',encoding='utf8').read()
out=src.replace('<title>Escape Room Neue Filiale</title>','<title>Escape Room Neue Filiale (mehrsprachig)</title>',1)
blk='<script>\n'+layer.replace('</script','<\\/script')+'\n</script>\n'
i=out.rindex('</body>'); out=out[:i]+blk+out[i:]
open(repo+'/materials/LF1_Escape_Room_2_-_Die_neue_Filiale_mehrsprachig.html','w',encoding='utf8').write(out)
print(len(trd),'Eintraege',len(out))
