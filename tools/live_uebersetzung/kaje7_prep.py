"""Kaje 7: raw_info.json (Rohliste aus scen_kaje7.js) -> kaje7/leaf.json (Zahlen als §) + kaje7/units.json (zu uebersetzende Einheiten)
und kaje7/compose.json (Gesamttext -> [(Sep, Einheitsindex), ...]); die Gesamttexte werden beim Bauen aus den Einheiten zusammengesetzt."""
import json,re,os,sys
here=os.path.dirname(os.path.abspath(__file__)); K=here+'/kaje7'
NUM=re.compile(r'\d{1,3}(?:[   ]\d{3})+(?:,\d+)?|\d+(?:[.,]\d+)*')
raw=json.load(open(K+'/raw_info.json'))['leaf']
LET=re.compile(r'[A-Za-zÄÖÜäöüß]{2}')
keys=list(dict.fromkeys(NUM.sub('§',k) for k in raw if LET.search(k) and 'Tisch 3' not in k and k!='NaN %'))
ABBR=('z. B.','Nr.','S.','ca.','bzw.','d. h.','u. a.','Std.','Abs.','inkl.','evtl.','usw.','z.B.','Mio.','Tsd.','max.','min.','vgl.')
def split_units(k):
    """zerlegt k in (sep0,[(unit,sepAfter)...]) – Trenner: Satzende, ' · ', ' – ', ': ' nach kurzem Label, Anfuehrungszeichen am Rand"""
    # Satzgrenzen
    parts=[];cur=0
    cuts=[]
    for m in re.finditer(r'(?<=[.!?][“”"])\s+|(?<=[.!?])\s+|\s[·–]\s|(?<=:)\s',k):
        pre=k[:m.start()]
        if m.group().strip()=='' and pre.endswith(ABBR): continue
        if m.group()==' – ':   # Gedankenstrich nur trennen, wenn danach ein neuer Satz beginnt oder links ein kurzes Label steht
            left=re.split(r'(?<=[.!?][“”"])\s+|(?<=[.!?])\s+|\s[·–]\s',pre)[-1]
            nxt=k[m.end():m.end()+1]
            if not (nxt.isupper() or (len(left.split())<=3 and len(left)<=28)): continue
        if m.group().strip()=='' and pre.endswith(':'):
            # Doppelpunkt nur nach kurzem Label (<=3 Woerter, <=32 Zeichen) trennen
            lab=re.split(r'(?<=[.!?][“”"])\s+|(?<=[.!?])\s+|\s[·–]\s',pre)[-1]
            if len(lab)>32 or len(lab.split())>3: continue
        cuts.append((m.start(),m.end()))
    pos=0;segs=[]
    for a,b in cuts:
        segs.append((k[pos:a],k[a:b]));pos=b
    segs.append((k[pos:],''))
    out=[];lead=''
    for u,sep in segs:
        # Randzeichen (Anfuehrungszeichen, Klammern) nur abloesen, wenn sie unpaarig sind
        l=re.match(r'^\s*','' if False else u).group(0);u2=u[len(l):]
        while u2 and u2[0] in '„(' and (u2.count('„')+u2.count('(')>u2.count('“')+u2.count(')')): l+=u2[0];u2=u2[1:]
        r='';u3=u2.rstrip()
        r=u2[len(u3):]
        while u3 and u3[-1] in '“)' and (u3.count('“')+u3.count(')')>u3.count('„')+u3.count('(')): r=u3[-1]+r;u3=u3[:-1]
        out.append((l,u3,r+sep))
    return out
# bestehende Einheiten (eingefrorene Nummerierung) uebernehmen, neue werden hinten angehaengt
ul0=json.load(open(K+'/units.json')) if os.path.exists(K+'/units.json') else []
units={u:i for i,u in enumerate(ul0)};compose={}
for k in keys:
    segs=split_units(k)
    items=[]
    for l,u,r in segs:
        if not LET.search(u):   # reine Zahl/Symbol: unveraendert lassen
            items.append((l,None,u+r));continue
        units.setdefault(u,len(units)); items.append((l,units[u],r))
    compose[k]=items
ul=sorted(units,key=lambda u:units[u])
print(len(ul)-len(ul0),'neue Einheiten')
json.dump(keys,open(K+'/leaf.json','w'),ensure_ascii=False)
json.dump(ul,open(K+'/units.json','w'),ensure_ascii=False)
json.dump(compose,open(K+'/compose.json','w'),ensure_ascii=False)
print(len(keys),'Texte ->',len(ul),'Einheiten',sum(map(len,ul)),'Zeichen')
