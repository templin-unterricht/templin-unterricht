import json,re,sys
def nd(s): return s.translate(str.maketrans('٠١٢٣٤٥٦٧٨٩۰۱۲۳۴۵۶۷۸۹','01234567890123456789'))
def digits(s): return sorted(re.findall(r'\d+',nd(s)))
def check(src,tr,lang):
    bad=[]
    for k,de in src.items():
        t=tr.get(k)
        if not isinstance(t,str) or not t.strip(): bad.append((k,'leer',de,t));continue
        if sorted(re.findall(r'\{\d+\}',de))!=sorted(re.findall(r'\{\d+\}',t)): bad.append((k,'platzhalter',de,t))
        if digits(de)!=digits(t): bad.append((k,'zahlen',de,t))
        if re.search(r'[٠-٩]',t): bad.append((k,'arab-ziffern',de,t))
    extra=set(tr)-set(src)
    return bad,extra
if __name__=='__main__':
    lang,ci=sys.argv[1],sys.argv[2]
    src=json.load(open(f'pool/chunk_{ci}.json'));tr=json.load(open(f'trans/{lang}/chunk_{ci}.json'))
    bad,extra=check(src,tr,lang);print(lang,ci,len(src),len(tr),'Fehler',len(bad),'extra',len(extra))
    for b in bad[:15]: print(b)
