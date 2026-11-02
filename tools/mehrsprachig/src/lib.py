import json,re,os
HERE=os.path.dirname(os.path.abspath(__file__))
ENGINE=open(os.path.join(HERE,'..','engine.js'),encoding='utf8').read()
def i18n_js(d):
    return 'window.UB_I18N='+json.dumps(d,ensure_ascii=False,separators=(',',':')).replace('</','<\\/')+';'
def assemble_page(tpl,d):
    return tpl.replace('/*UB_I18N*/',i18n_js(d)).replace('/*UB_ENGINE*/',ENGINE.replace('</script','<\\/script'))
def inject_app(html,d,cfg):
    # externe Schriften (Google Fonts) entfernen: nur Systemschriften
    html=re.sub(r'<link[^>]+fonts\.(googleapis|gstatic)\.com[^>]*>\s*','',html)
    block='<script>window.UB_CONFIG=%s;</script>\n<script id="uebersetzungen">%s</script>\n<script>%s</script>\n'%(json.dumps(cfg),i18n_js(d),ENGINE.replace('</script','<\\/script'))
    i=html.rindex('</body>')
    return html[:i]+block+html[i:]
