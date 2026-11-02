import re,json,sys
from pdflines import lines
def cards(pdf):
    P=lines(pdf); out={}
    for pi,(W,H,L) in enumerate(P):
        if pi==0: continue
        for col,(a,b) in enumerate([(0,W/2),(W/2,W)]):
            C=sorted([l for l in L if a<=l['x0']<b and l['y0']<780],key=lambda l:l['y0'])
            cur=None
            for l in C:
                t=l['t'].strip()
                m=re.match(r'^Rechen-Minute (\d+)( · Lösung)?$',t)
                if m:
                    cur={'n':int(m.group(1)),'sol':bool(m.group(2)),'stufe':None,'items':[]}
                    out[(cur['n'],cur['sol'])]=cur; continue
                if cur is None: continue
                if t.startswith('Stufe') and cur['stufe'] is None: cur['stufe']=t; continue
                if re.match(r'^_+$',t): continue
                if re.match(r'^[abc] ',t): cur['items'].append([t[0],t[2:]])
                elif cur['items'] and not re.match(r'^\d+ / \d+$',t) and not t.startswith('LF 3'):
                    cur['items'][-1][1]+=' '+t
    return out
if __name__=='__main__':
    for f in ['1-20','21-40']:
        c=cards(f'/home/user/templin-unterricht/materials/LF3_Rechen-Minute_-_Karten_{f}.pdf')
        ns=sorted({k[0] for k in c}); print(f,len(c),ns[0],ns[-1],[n for n in range(ns[0],ns[-1]+1) if (n,False) not in c or (n,True) not in c])
        for n in ns[:2]+ns[-1:]: print(c[(n,False)],c[(n,True)])
        json.dump([{'n':n,'stufe':c[(n,False)]['stufe'],'items':c[(n,False)]['items'],'sol':c[(n,True)]['items']} for n in ns],open(f'rm_{f}.json','w'),ensure_ascii=False,indent=1)
