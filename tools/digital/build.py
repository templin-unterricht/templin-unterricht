#!/usr/bin/env python3
"""Baut materials/digital/LF4_M_<n>.html aus engine + sheets/m<n>.js. Aufruf: build.py 1 [2 3 ...]"""
import sys,os
d=os.path.dirname(os.path.abspath(__file__))
out=os.path.join(d,'..','..','materials','digital')
os.makedirs(out,exist_ok=True)
r=lambda f:open(os.path.join(d,f),encoding='utf-8').read()
for n in sys.argv[1:]:
    js=r('ui.js')+'\n'+r('common.js')+'\n'+r('sheets/m%s.js'%n)+'\n'+r('engine.js')
    html=r('template.html').replace('/*CSS*/',r('engine.css')).replace('/*JS*/',js.replace('</script','<\\/script'))
    open(os.path.join(out,'LF4_M_%s.html'%n),'w',encoding='utf-8').write(html)
    print('LF4_M_%s.html'%n,len(html)//1024,'KB')
