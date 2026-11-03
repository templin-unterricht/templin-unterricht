// Baut materials/digital/LF5_M_<n>.html aus sheets/M<n>.js + i18n/M<n>.json + engine.* + template.html
// i18n/M<n>.json: {lang:{ "deutscher Text": "Übersetzung", "@<itemId>": "Zusammenfassung" }} für tr, ar, ti, uk, ru, es, pt (vi steht in den Sheets selbst)
// i18n/UI.json: {lang:{schluessel:text}} Bedienelemente
const fs=require('fs'),path=require('path');
const out=path.join(__dirname,'..','..','materials','digital');fs.mkdirSync(out,{recursive:true});
const rd=f=>fs.readFileSync(path.join(__dirname,f),'utf8');
const tpl=rd('template.html'),css=rd('engine.css'),js=rd('engine.js');
const LANGS=['tr','ar','ti','uk','ru','es','pt'];
const ui=JSON.parse(rd('i18n/UI.json'));
const nums=process.argv.slice(2).length?process.argv.slice(2):[1,2,3,4,5,6,7,8,9,10,11];
for(const n of nums){
  const data=JSON.parse(JSON.stringify(require('./sheets/M'+n+'.js')));
  const tr=JSON.parse(rd('i18n/M'+n+'.json'));
  const missing=[];
  (function w(x){
    if(Array.isArray(x))return x.forEach(w);
    if(x&&typeof x==='object'){
      if(typeof x.de==='string'&&typeof x.vi==='string'&&Object.keys(x).length===2){
        for(const l of LANGS){const t=tr[l]&&tr[l][x.de];if(typeof t==='string'&&t.trim())x[l]=t;else missing.push(l+': '+x.de.slice(0,40))}
        return}
      if(x.id&&typeof x.vi==='string'){x.sum={};for(const l of LANGS){const t=tr[l]&&tr[l]['@'+x.id];if(typeof t==='string'&&t.trim())x.sum[l]=t;else missing.push(l+': @'+x.id)}}
      for(const k in x)w(x[k])}
  })(data);
  if(missing.length){console.error('FEHLT in M'+n,missing.length,missing.slice(0,5));process.exit(1)}
  data.ui=ui;
  const html=tpl.replace('@@TITLE@@',()=>data.title).replace('@@CSS@@',()=>css)
    .replace('@@DATA@@',()=>JSON.stringify(data).replace(/<\//g,'<\\/')).replace('@@JS@@',()=>js);
  fs.writeFileSync(path.join(out,'LF5_M_'+n+'.html'),html);
  console.log('gebaut',n,Math.round(html.length/1024)+' KB');
}
