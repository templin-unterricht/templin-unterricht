#!/usr/bin/env python3
"""Baut materials/LF5_M_<n>_Einstieg_live.html aus content/m<nn>.py + engine.js + style.css + qrlib.js."""
import importlib.util, json, sys, pathlib
HERE=pathlib.Path(__file__).parent; OUT=HERE.parent.parent/"materials"
css=(HERE/"style.css").read_text(); eng=(HERE/"engine.js").read_text(); qr=(HERE/"qrlib.js").read_text()
sys.path.insert(0,str(HERE))
TPL='''<!DOCTYPE html>
<html lang="de">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>LF5 · Modul @@N@@ · Live-Einstieg</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Montserrat:wght@600;800;900&family=Nunito:wght@500;700;800&display=swap">
<style>
@@CSS@@
</style>
</head>
<body>
<div id="app"></div>
<script>
@@QR@@
</script>
<script>
const CFG=@@CFG@@;
@@ENG@@
</script>
</body>
</html>
'''
def build(n):
    p=HERE/"content"/("m%02d.py"%n)
    spec=importlib.util.spec_from_file_location("m%d"%n,p); m=importlib.util.module_from_spec(spec); spec.loader.exec_module(m)
    cfg=m.CFG; cfg["modul"]=n
    html=TPL.replace("@@N@@",str(n)).replace("@@CSS@@",css).replace("@@QR@@",qr).replace("@@CFG@@",json.dumps(cfg,ensure_ascii=False,separators=(",",":"))).replace("@@ENG@@",eng)
    (OUT/("LF5_M_%d_Einstieg_live.html"%n)).write_text(html,encoding="utf-8")
    print("ok",n,len(html))
if __name__=="__main__":
    ns=[int(x) for x in sys.argv[1:]] or [int(p.stem[1:]) for p in sorted((HERE/"content").glob("m*.py"))]
    for n in ns: build(n)
