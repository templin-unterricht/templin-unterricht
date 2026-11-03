#!/usr/bin/env python3
"""Baut ein "Arbeitsblatt online" (Satz für Satz antippen/untereinander, AR · VI · TR) im Format der LF2-Blätter.

Zwei Schritte je Blatt (LF 3, Modul N):
  1) python3 tools/online/build_online.py segments 3 N
       liest  tools/online/src/LF3_M_N.html   (Inhalt; jede übersetzbare Einheit als <span class="tr" tabindex="0">Text</span>
                                               bzw. <span class="tr chip" tabindex="0">Wort</span>)
       schreibt tools/online/segments/LF3_M_N.json  = {"0": "deutscher Text", ...}   (ids werden hier vergeben)
  2) python3 tools/online/build_online.py build 3 N
       liest  tools/online/tr/LF3_M_N.json = {"0": ["Arabisch","Vietnamesisch","Türkisch"], ...}
       schreibt materials/LF3_M_N_Arbeitsblatt_online_DE-TR-AR-VI.html
Vorlage (Design, Leiste, Tooltip-Technik) = materials/LF2_M_1_Arbeitsblatt_online_DE-AR-VI.html.
"""
import json, os, re, sys, html

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
TPL = os.path.join(ROOT, 'materials', 'LF2_M_1_Arbeitsblatt_online_DE-AR-VI.html')
SPAN = re.compile(r'<span class="tr( chip)?" tabindex="0">(.*?)</span>', re.S)


def paths(lf, n):
    d = os.path.join(ROOT, 'tools', 'online')
    base = f'LF{lf}_M_{n}'
    return (os.path.join(d, 'src', base + '.html'), os.path.join(d, 'segments', base + '.json'),
            os.path.join(d, 'tr', base + '.json'), os.path.join(ROOT, 'materials', base + '_Arbeitsblatt_online_DE-TR-AR-VI.html'))


def number(fragment):
    """vergibt data-k fortlaufend; gleiche Segmenttexte behalten je Vorkommen eine eigene id (einfach, eindeutig)"""
    segs = {}
    def rep(m):
        k = str(len(segs)); segs[k] = html.unescape(re.sub(r'<[^>]+>', '', m.group(2))).strip()
        return f'<span class="tr{m.group(1) or ""}" tabindex="0" data-k="{k}">{m.group(2)}</span>'
    return SPAN.sub(rep, fragment), segs


def cmd_segments(lf, n):
    src, seg, _, _ = paths(lf, n)
    frag = open(src, encoding='utf8').read()
    if 'data-k=' in frag:
        raise SystemExit('src darf noch keine data-k enthalten')
    _, segs = number(frag)
    os.makedirs(os.path.dirname(seg), exist_ok=True)
    json.dump(segs, open(seg, 'w', encoding='utf8'), ensure_ascii=False, indent=0)
    print(len(segs), 'Segmente ->', seg)


def cmd_build(lf, n):
    src, seg, trf, out = paths(lf, n)
    frag = open(src, encoding='utf8').read()
    frag, segs = number(frag)
    tr = json.load(open(trf, encoding='utf8'))
    miss = [k for k in segs if k not in tr or len(tr[k]) != 3 or not all(isinstance(x, str) and x.strip() for x in tr[k])]
    extra = [k for k in tr if k not in segs]
    if miss or extra:
        raise SystemExit(f'Fehler: fehlend/leer {miss[:10]} ({len(miss)}), überzählig {extra[:10]}')
    t = open(TPL, encoding='utf8').read()
    a = t.index('<header class="kopf">')
    b = t.index('\n</div>\n<div id="tip"')
    title = re.search(r'<h1>.*?>(.*?)</span></h1>', frag, re.S)
    ttl = html.unescape(re.sub(r'<[^>]+>', '', title.group(1))) if title else f'Modul {n}'
    t = t[:a] + frag.rstrip() + t[b:]
    t = re.sub(r'<title>.*?</title>', f'<title>Arbeitsblatt LF {lf} – Modul {n} online (Deutsch · Türkçe · العربية · Tiếng Việt)</title>', t, count=1, flags=re.S)
    t = re.sub(r'var TR = \{.*?\};\n  var LANGNAME', lambda m: 'var TR = ' + json.dumps(tr, ensure_ascii=False) + ';\n  var LANGNAME', t, count=1, flags=re.S)
    t = t.replace('lf2m1_ab', f'lf{lf}m{n}_ab')
    open(out, 'w', encoding='utf8').write(t)
    print('gebaut', out, len(segs), 'Segmente')


if __name__ == '__main__':
    cmd, lf, n = sys.argv[1], int(sys.argv[2]), int(sys.argv[3])
    {'segments': cmd_segments, 'build': cmd_build}[cmd](lf, n)
