import subprocess,re,sys,html
def lines(pdf):
    x=subprocess.run(['pdftotext','-bbox-layout',pdf,'-'],capture_output=True,text=True).stdout
    pages=[]
    for pm in re.finditer(r'<page width="([\d.]+)" height="([\d.]+)">(.*?)</page>',x,re.S):
        W,H=float(pm.group(1)),float(pm.group(2));L=[]
        for lm in re.finditer(r'<line xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">(.*?)</line>',pm.group(3),re.S):
            words=re.findall(r'<word[^>]*>(.*?)</word>',lm.group(5),re.S)
            t=html.unescape(' '.join(words))
            L.append(dict(x0=float(lm.group(1)),y0=float(lm.group(2)),x1=float(lm.group(3)),y1=float(lm.group(4)),t=t))
        pages.append((W,H,L))
    return pages
if __name__=='__main__':
    p=lines(sys.argv[1]);W,H,L=p[int(sys.argv[2])]
    print(W,H)
    for l in sorted(L,key=lambda l:(round(l['y0']),l['x0'])): print(round(l['x0']),round(l['y0']),round(l['y1']-l['y0'],1),l['t'])
