import json,sys,re
def build(h_path,st_path):
    h=json.load(open(h_path)); st=json.load(open(st_path))
    seg=[]
    def add(x):
        x=' '.join(x.split())
        if x and x not in seg: seg.append(x)
    skip=re.compile(r'^\d\d:\d\d Min\.|^Das Wechselgeld ist da – der Kassensturz kann kommen\. Eure Zeit: \d|^❌|^\d von \d richtig|^Station \d|^Modul(e)? \d')
    for x in h:
        if skip.search(x): continue
        x=re.sub(r'^\d\. ','',x)
        add(x)
    for s in st:
        add(s['t']); add('💡 '+s['h'])
        for q in s['f']:
            add(q[0])
            if q[1]:
                for o in q[1]: add(o)
    add('Station {1}: {2}'); add('Module {1} und {2}'); add('Modul {1} und {2}'); add('Modul {1}')
    add('{1} von {2} richtig. Die roten Aufgaben noch einmal prüfen – schaut in euren Unterlagen nach.')
    add('✅ Alles richtig! Eure Ziffer für den Tresor: {1}')
    add('Das Wechselgeld ist da – der Kassensturz kann kommen. Eure Zeit: {1} · Genutzte Tipps: {2}')
    add('Das Wechselgeld ist da – der Kassensturz kann kommen. Eure Zeit: · Genutzte Tipps:')
    add('❌ Der Tresor bleibt zu. Prüft eure Ziffern!')
    add('{1} Min. (inkl. Tipps)')
    return seg
if __name__=='__main__':
    s=build(*sys.argv[1:3]); json.dump(s,open(sys.argv[3],'w'),ensure_ascii=False); print(len(s))
