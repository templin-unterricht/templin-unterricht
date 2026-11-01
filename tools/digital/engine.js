/* Gemeinsame Bedienung aller digitalen Arbeitsblätter (Lernfeld 4). Erwartet: SHEET, TR, UI */
(function(){
'use strict';
var LANGS=[['de','Deutsch'],['vi','Tiếng Việt'],['es','Español'],['pt','Português'],['uk','Українська'],['ti','ትግርኛ'],['ru','Русский'],['ar','العربية'],['tr','Türkçe']];
var LI=LANGS.map(function(l){return l[0]});
var RTL={ar:1};
var FS=[100,115,130,150];
var KEY='tu.lf4.'+SHEET.id+'.v1';
var missing={};
var S;
if(typeof TRC!=='undefined')for(var kk in TRC)if(!TR[kk])TR[kk]=TRC[kk];
function fresh(){return {name:'',date:new Date().toISOString().slice(0,10),lang:'de',lvl:'b',fs:0,a:{},tip:{},chk:{},mk:{},rc:{},sub:false,open:false,sol:{}}}
function load(){try{var r=localStorage.getItem(KEY);return r?JSON.parse(r):null}catch(e){return null}}
var st;function save(){clearTimeout(st);st=setTimeout(saveNow,350)}
function saveNow(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function wipe(){try{localStorage.removeItem(KEY)}catch(e){}}
function esc(s){return String(s).replace(/[&<>"]/g,function(c){return {'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]})}
function li(){return LI.indexOf(S.lang)}
/* Übersetzung */
function trText(k){if(S.lang==='de')return '';var a=TR[k];var t=a&&a[li()-1];if(!t){missing[S.lang+':'+k]=1;return ''}return t}
function tl(k){if(S.lang==='de')return '';var t=trText(k);if(!t)return '<div class="tr miss">'+esc(UI.mis[li()])+'</div>';return '<div class="tr" lang="'+S.lang+'" dir="'+(RTL[S.lang]?'rtl':'ltr')+'">'+esc(t)+'</div>'}
function tlo(k){if(S.lang==='de'||!TR[k])return '';return tl(k)}
function U(k){var a=UI[k];return a[li()]||a[0]}
function B(k){var g=UI[k][0];var t=S.lang!=='de'?UI[k][li()]:'';return esc(g)+(t?'<small class="b" lang="'+S.lang+'" dir="'+(RTL[S.lang]?'rtl':'ltr')+'">'+esc(t)+'</small>':'')}
/* Sichtbarkeit */
function vis(b){return b.lvl!=='v'||S.lvl==='v'}
function items(b){return (b.items||[]).filter(function(i){return i.t!=='note'&&i.t!=='est'})}
function A(id){return S.a[id]}
/* Bearbeitet? */
function answered(it){
 var v=A(it.id);
 switch(it.t){
 case 'free':return !!(v&&v.t&&v.t.trim());
 case 'mc':return v!=null;
 case 'calc':return !!(v&&String(v).trim());
 case 'gap':case 'table':case 'tf':case 'sel':var n=(it.rows||it.a).length;return !!v&&v.filter(function(x){return x!=null&&x!==''}).length>=n;
 }return false}
function units(){var u=[];SHEET.blocks.forEach(function(b){if(b.k==='read'){u.push({id:b.id,done:!!S.chk[b.id]&&A(b.id+'.q')!=null})}else if(vis(b)){items(b).forEach(function(it){u.push({id:it.id,done:answered(it)})})}});return u}
function updProg(){var u=units();var d=u.filter(function(x){return x.done}).length;var p=u.length?Math.round(100*d/u.length):0;var f=document.getElementById('progf');if(f){f.style.width=p+'%';document.getElementById('progt').textContent=U('progress')+': '+d+' / '+u.length+' '+U('done')+' ('+p+' %)'}
 var q=p===100&&!S.pdone;if(q){S.pdone=1;toast('🎉 100 %')}}
/* Bewertung */
function num(s){var t=String(s).replace(/\s/g,'').replace(/€|%|cm|g|kg|ml|l|m/gi,'');if(t.indexOf(',')>=0&&t.indexOf('.')>=0)t=t.replace(/\./g,'');t=t.replace(',','.');var x=parseFloat(t);return isNaN(x)?null:x}
function grade(it){
 var v=A(it.id),got=0,max=0,rows=[];
 switch(it.t){
 case 'free':max=it.pts||1;var s=v&&v.s!=null?v.s:null;got=s==null?0:[0,.5,1][s]*max;break;
 case 'mc':max=it.pts||1;if(v!=null&&v===it.a)got=max;break;
 case 'calc':max=it.pts||1;var n=num(v==null?'':v);if(n!=null&&Math.abs(n-it.a)<=(it.tol==null?0.005:it.tol))got=max;break;
 case 'table':case 'sel':it.rows.forEach(function(r,i){max++;var ok=v&&v[i]===r[1];if(ok)got++;rows.push(ok)});break;
 case 'tf':it.rows.forEach(function(r,i){max++;var ok=v&&v[i]===r[1];if(ok)got++;rows.push(ok)});break;
 case 'gap':it.a.forEach(function(a,i){max++;var ok=v&&v[i]===a;if(ok)got++;rows.push(ok)});break}
 return {got:got,max:max,rows:rows}}
function totals(){var g=0,m=0,bg=0;SHEET.blocks.forEach(function(b){if(b.k!=='task'||!vis(b))return;items(b).forEach(function(it){if(it.t==='free'&&b.noscore)return;var r=grade(it);if(b.lvl==='v')bg+=r.got;else{g+=r.got;m+=r.max}})});return {g:g,m:m,b:bg}}
function r1(x){return (Math.round(x*10)/10).toString().replace('.',',')}
/* Rendering */
function tipHTML(b){if(!b.tip)return '';return '<button class="tipb noprint" data-act="tip" data-id="'+b.id+'" aria-label="'+esc(UI.tip[0])+'">💡 '+esc(U('tip'))+'</button>'}
function tipBox(b){if(!b.tip||!S.tip[b.id])return '';return '<div class="tipbox">💡 '+esc(b.tip)+tl(b.tk||b.id+'.t')+'</div>'}
function opts(list,sel,cls,act,id,extra){return '<div class="opts">'+list.map(function(o,i){var c=cls?cls(i):'';return '<button class="opt'+(sel===i?' on':'')+(c?' '+c:'')+'" data-act="'+act+'" data-id="'+id+'" data-i="'+i+'">'+esc(o)+'</button>'}).join('')+'</div>'}
function fbBox(kind,html){return '<div class="fb '+kind+'">'+html+'</div>'}
function showFb(b){return S.chk[b.id]||S.sub}
function renderItem(b,it){
 var v=A(it.id),fb=showFb(b),h='',g,q=it.q?'<div class="q">'+esc(it.q)+'</div>'+(it.nq?'':tl(it.qk||it.id+'.q')):'';
 switch(it.t){
 case 'note':return '<div class="sit">'+it.html+'</div>';
 case 'est':return renderEst(it);
 case 'free':
  v=v||{};h=q+'<textarea class="in" rows="4" data-act="txt" data-id="'+it.id+'" placeholder="…">'+esc(v.t||'')+'</textarea>';
  h+='<div class="noprint"><button class="btn sec" data-act="sol" data-id="'+it.id+'">'+B('sol')+'</button></div>';
  if(S.sol[it.id]||fb&&v.t){h+='<div class="model"><b>'+esc(UI.model[0])+'</b>'+it.model+'</div>';
   h+='<div class="q">'+esc(UI.selfq[0])+'</div>'+tl_ui('selfq')+'<div class="row2">'+[['selfyes',2],['selfpart',1],['selfno',0]].map(function(p){return '<button class="btn gray" style="'+(v.s===p[1]&&v.s!=null?'background:#e3f0f6;border-color:#2f6f8f':'')+'" data-act="self" data-id="'+it.id+'" data-i="'+p[1]+'">'+B(p[0])+'</button>'}).join('')+'</div>'}
  break;
 case 'mc':
  g=grade(it);h=q+opts(it.o,v,fb?function(i){return i===it.a?'ok':(v===i?'no':'')}:null,'mc',it.id);
  if(fb)h+=fbBox(g.got?'ok':'no',g.got?esc(U('right')):esc(U('wrong'))+' '+esc(UI.correctis[0])+' <b>'+esc(it.o[it.a])+'</b>');
  break;
 case 'calc':
  g=grade(it);h=q+'<div class="row2"><input class="in" style="max-width:12rem" inputmode="decimal" autocomplete="off" data-act="calc" data-id="'+it.id+'" value="'+esc(v||'')+'"><b>'+esc(it.unit||'')+'</b></div>';
  if(fb){var trap='';if(!g.got&&it.traps){var nv=num(v==null?'':v);it.traps.forEach(function(t){if(nv!=null&&Math.abs(nv-t[0])<=0.006)trap='<div>⚠ '+esc(t[1])+'</div>'+tl(it.id+'.w')})}h+=fbBox(g.got?'ok':'no',(g.got?esc(U('right')):esc(U('wrong'))+' '+esc(UI.correctis[0])+' <b>'+r1(it.a)+' '+esc(it.unit||'')+'</b>')+trap+'<div><b>'+esc(UI.steps[0])+':</b><br>'+it.steps.map(esc).join('<br>')+'</div>'+tl_ui('steps'))}
  break;
 case 'table':
  g=grade(it);h=q+'<table class="tbl"><tr><th>'+(it.hd||'')+'</th>'+it.cols.map(function(c){return '<th class="c" title="'+esc(c[1]||'')+'">'+esc(c[0])+'</th>'}).join('')+'</tr>'+it.rows.map(function(r,i){var sel=v&&v[i];var rc=fb?(g.rows[i]?' class="rok"':' class="rno"'):'';
   return '<tr'+rc+'><td>'+esc(r[0])+'</td>'+it.cols.map(function(c,j){var cl=sel===j?' on':'';if(fb){if(j===r[1])cl+=sel===j?' ok':' sol';else if(sel===j)cl+=' no'}return '<td class="c"><button class="ch'+cl+'" data-act="tb" data-id="'+it.id+'" data-r="'+i+'" data-i="'+j+'" aria-label="'+esc(c[1]||c[0])+'">'+esc(c[0])+'</button></td>'}).join('')+'</tr>'}).join('')+'</table>';
  if(it.legend)h+='<div class="meta">'+esc(it.legend)+'</div>';
  if(fb)h+=fbBox(g.got===g.max?'ok':g.got?'part':'no',g.got+' / '+g.max);
  break;
 case 'tf':
  g=grade(it);h=q+'<table class="tbl">'+it.rows.map(function(r,i){var sel=v&&v[i];var rc=fb?(g.rows[i]?' class="rok"':' class="rno"'):'';
   return '<tr'+rc+'><td>'+esc(r[0])+'</td>'+[[true,'✔'],[false,'✘']].map(function(c){var cl=sel===c[0]?' on':'';if(fb){if(c[0]===r[1])cl+=sel===c[0]?' ok':' sol';else if(sel===c[0])cl+=' no'}return '<td class="c"><button class="ch'+cl+'" data-act="tf" data-id="'+it.id+'" data-r="'+i+'" data-i="'+(c[0]?1:0)+'">'+c[1]+'</button></td>'}).join('')+'</tr>'}).join('')+'</table>';
  if(fb)h+=fbBox(g.got===g.max?'ok':g.got?'part':'no',g.got+' / '+g.max);
  break;
 case 'sel':
  g=grade(it);h=q+'<table class="tbl">'+it.rows.map(function(r,i){var sel=v&&v[i];var cl=fb?(g.rows[i]?' ok':' no'):'';
   return '<tr><td>'+esc(r[0])+'</td><td><select class="in gapsel'+cl+'" data-act="sel" data-id="'+it.id+'" data-r="'+i+'"><option value="">…</option>'+it.o.map(function(o,j){return '<option value="'+j+'"'+(sel===j?' selected':'')+'>'+esc(o)+'</option>'}).join('')+'</select>'+(fb&&!g.rows[i]?'<div class="meta">'+esc(UI.correctis[0])+' <b>'+esc(it.o[r[1]])+'</b></div>':'')+'</td></tr>'}).join('')+'</table>';
  if(fb)h+=fbBox(g.got===g.max?'ok':g.got?'part':'no',g.got+' / '+g.max);
  break;
 case 'gap':
  g=grade(it);var k=0;h=q+'<div class="gaptxt">'+it.text.split('___').map(function(p,i,arr){var s=esc(p);if(i<arr.length-1){var sel=v&&v[i];var cl=fb?(g.rows[i]?' ok':' no'):'';s+='<select class="gapsel'+cl+'" data-act="gap" data-id="'+it.id+'" data-r="'+i+'"><option value="">…</option>'+it.bank.map(function(o){return '<option'+(sel===o?' selected':'')+'>'+esc(o)+'</option>'}).join('')+'</select>'}return s}).join('')+'</div>';
  if(fb)h+=fbBox(g.got===g.max?'ok':g.got?'part':'no',g.got+' / '+g.max+(g.got<g.max?' — '+esc(UI.correctis[0])+' <b>'+it.a.map(esc).join(' · ')+'</b>':''));
  break}
 if(fb&&it.ex&&it.t!=='free')h+='<div class="meta">'+esc(it.ex)+'</div>'+tl(it.id+'.e');
 return '<div class="item">'+h+'</div>'}
function tl_ui(k){if(S.lang==='de')return '';return '<div class="tr" lang="'+S.lang+'" dir="'+(RTL[S.lang]?'rtl':'ltr')+'">'+esc(U(k))+'</div>'}
function renderEst(it){var v=A(it.id)||{};var t=totals();return '<div class="row2"><label>'+B('estl')+'</label><input class="in" style="max-width:8rem" inputmode="numeric" data-act="est" data-id="'+it.id+'" data-f="e" value="'+esc(v.e||'')+'"></div><div class="row2"><label>'+B('resl')+'</label><input class="in" style="max-width:8rem" inputmode="numeric" data-act="est" data-id="'+it.id+'" data-f="r" value="'+esc(v.r||'')+'"></div>'+(v.e&&v.r?'<div class="meta">'+esc(UI.diff[0])+': '+(Number(v.r)-Number(v.e))+'</div>':'')}
function renderRead(b){
 var mk=S.mk[b.id]||[],done=S.chk[b.id],idx=0,tot=0,hit=0,wrong=0;
 var paras=b.paras.map(function(p){return '<p>'+p.replace(/\[\[(.+?)\]\]([.,;:!?)]*)|\{\{(.+?)\}\}([.,;:!?)]*)|([^\s\[\{]+)/g,function(m,a,pa,d,pd,w){var i=idx++,sel=mk.indexOf(i)>=0,cl='';var good=a!=null;if(good)tot++;
   if(done){if(sel&&good){cl=' ok';hit++}else if(sel){cl=' no';wrong++}else if(good)cl=' miss'}else if(sel)cl=' on';
   return '<span class="w'+cl+'" data-act="mk" data-id="'+b.id+'" data-i="'+i+'">'+esc(a||d||w)+'</span>'+esc(pa||pd||'')+' '})+'</p>'}).join('');
 var h='<div class="card read"><h2>📖 '+esc(b.h)+'</h2>'+tl(b.hk||b.id+'.h')+'<div class="meta">'+esc(U('readhint'))+'</div>'+(b.sum?'<div class="meta"><b>→ </b>'+esc(b.sum)+'</div>'+tl(b.id+'.s'):'')+paras;
 if(b.html)h+=b.html;
 h+='<button class="btn" data-act="mkchk" data-id="'+b.id+'">'+B('mark')+'</button>';
 if(done){var all=b.paras.join(' ').match(/\[\[.+?\]\]/g)||[];h+=fbBox(wrong===0&&hit===all.length?'ok':'part','✔ '+hit+' / '+all.length+' '+esc(U('found'))+(wrong?' · ✘ '+wrong+' '+esc(U('toomany')):'')+(hit<all.length?'<br>'+esc(U('missed')):''))}
 if(b.q){var v=A(b.id+'.q');h+='<div class="q">'+esc(b.q.q)+'</div>'+tl(b.id+'.qq')+opts(b.q.o,v,(done&&v!=null)?function(i){return i===b.q.a?'ok':(v===i?'no':'')}:null,'mc',b.id+'.q')}
 return h+'</div>'}
function renderTask(b){
 var v=b.lvl==='v';
 var h='<div class="card'+(v?' v':'')+'" id="t_'+b.id+'">'+tipHTML(b)+'<h2><span class="nr">'+esc(b.n)+'</span>'+esc(b.h)+(v?'<span class="vtag">⭐ '+esc(UI.vert[0])+'</span>':'')+'</h2>'+tl(b.hk||b.id+'.h');
 if(b.intro)h+='<div>'+esc(b.intro)+'</div>'+tl(b.ik||b.id+'.i');
 h+=tipBox(b);
 if(b.sit)h+='<div class="sit">'+b.sit+'</div>';
 (b.items||[]).forEach(function(it){h+=renderItem(b,it)});
 if(items(b).length){h+='<div class="noprint"><button class="btn" data-act="chk" data-id="'+b.id+'">'+B('check')+'</button></div>';
  if(showFb(b)){var mx=0,gt=0;items(b).forEach(function(it){var r=grade(it);gt+=r.got;mx+=r.max});h+='<div class="fb '+(gt===mx?'ok':gt?'part':'no')+'"><b>'+r1(gt)+' / '+mx+' '+esc(U('points'))+'</b>'+(b.ex&&gt<mx?'<br>'+esc(b.ex)+tl(b.ek||b.id+'.e'):'')+'</div>'}}
 return h+'</div>'}
function summaryRows(){var out=[];SHEET.blocks.forEach(function(b){if(b.k!=='task'||!vis(b)||!items(b).length)return;var gt=0,mx=0;items(b).forEach(function(it){var r=grade(it);gt+=r.got;mx+=r.max});out.push({b:b,g:gt,m:mx})});return out}
function ansLines(b){var o=[];items(b).forEach(function(it){var v=A(it.id);var g=grade(it);var a='';
 if(it.t==='free')a=(v&&v.t||'—')+(v&&v.s!=null?' ['+[UI.selfno[0],UI.selfpart[0],UI.selfyes[0]][v.s]+']':'');
 else if(it.t==='mc')a=v!=null?it.o[v]:'—';
 else if(it.t==='calc')a=(v||'—')+' '+(it.unit||'');
 else if(it.t==='table')a=it.rows.map(function(r,i){return r[0]+': '+(v&&v[i]!=null?it.cols[v[i]][0]:'—')}).join('; ');
 else if(it.t==='tf')a=it.rows.map(function(r,i){return (i+1)+': '+(v&&v[i]!=null?(v[i]?'✔':'✘'):'—')}).join('; ');
 else if(it.t==='sel')a=it.rows.map(function(r,i){return r[0]+' → '+(v&&v[i]!=null?it.o[v[i]]:'—')}).join('; ');
 else if(it.t==='gap')a=it.a.map(function(x,i){return (v&&v[i])||'—'}).join(' · ');
 var q=it.q||it.id;
 o.push('<tr><td>'+esc(q)+'</td><td>'+esc(a)+'</td><td>'+r1(g.got)+'/'+g.max+'</td></tr>')});return o.join('')}
function renderResult(){
 var t=totals(),rows=summaryRows();
 var h='<div class="card" id="result"><h2>🏁 '+esc(UI.result[0])+'</h2>'+tl_hdr('result')+'<div class="score">'+r1(t.g)+' '+esc(UI.of[0])+' '+t.m+' '+esc(UI.points[0])+'</div>';
 if(S.lang!=='de')h+='<div class="tr" lang="'+S.lang+'">'+esc(U('result'))+': '+r1(t.g)+' '+esc(U('of'))+' '+t.m+' '+esc(U('points'))+'</div>';
 if(S.lvl==='v')h+='<div>+ '+r1(t.b)+' '+esc(UI.bonus[0])+'</div>';
 h+='<div class="bar2"><i style="width:'+(t.m?100*t.g/t.m:0)+'%"></i></div>';
 rows.forEach(function(r){var p=r.m?r.g/r.m:0;h+='<div class="fb '+(p>=.99?'ok':p>0?'part':'no')+'"><b>'+esc(r.b.n)+' · '+esc(r.b.h)+'</b>: '+r1(r.g)+' / '+r.m+(p<.99?' → <a href="#t_'+r.b.id+'">'+esc(U('reread'))+'</a>':'')+'</div>'});
 h+='<div class="noprint"><button class="btn big" data-act="print">🖨 '+B('print')+'</button>'+tl_ui('printhint')+'<div class="meta">'+esc(U('printhint'))+'</div><button class="btn gray" data-act="next">'+B('next')+'</button></div></div>';
 return h}
function tl_hdr(k){return ''}
function renderReport(){
 var t=totals(),rows=summaryRows();
 var h='<h1>'+esc(SHEET.mod)+' · '+esc(SHEET.title)+'</h1><p><b>'+esc(UI.name[0])+':</b> '+esc(S.name||'')+' &nbsp; <b>'+esc(UI.date[0])+':</b> '+esc(S.date||'')+' &nbsp; <b>'+esc(UI.points[0])+':</b> '+r1(t.g)+' / '+t.m+(S.lvl==='v'?' (+'+r1(t.b)+' Bonus)':'')+' &nbsp; <b>'+esc(UI.level[0])+':</b> '+(S.lvl==='v'?'Vertiefung':'Basis')+'</p>';
 rows.forEach(function(r){h+='<div class="tk"><h3>'+esc(r.b.n)+' · '+esc(r.b.h)+' ('+r1(r.g)+'/'+r.m+')</h3><table>'+ansLines(r.b)+'</table></div>'});
 return h}
function render(){
 var y=window.scrollY;
 var lv=S.lvl==='v';
 var h='<h1>'+esc(SHEET.mod)+': '+esc(SHEET.title)+'</h1><p class="meta">'+esc(SHEET.meta)+'</p>'+tl('title');
 h+='<div class="card"><div class="row2"><label for="nm">'+B('name')+'</label><input class="in" id="nm" style="flex:1;min-width:10rem" autocomplete="off" data-act="nm" value="'+esc(S.name||'')+'"></div><div class="row2"><label for="dt">'+B('date')+'</label><input class="in" id="dt" type="date" style="max-width:12rem" data-act="dt" value="'+esc(S.date||'')+'"></div></div>';
 h+='<div class="card"><h2>✅ '+esc(UI.can[0])+'</h2>'+(S.lang!=='de'?'<div class="tr" lang="'+S.lang+'" dir="'+(RTL[S.lang]?'rtl':'ltr')+'">'+esc(U('can'))+'</div>':'')+'<ul class="cl">'+SHEET.can.map(function(c,i){return '<li>'+esc(c)+tlo('can.'+i)+'</li>'}).join('')+'</ul></div>';
 SHEET.blocks.forEach(function(b){if(b.k==='read')h+=renderRead(b);else if(vis(b))h+=renderTask(b)});
 h+='<div class="noprint" style="text-align:center"><button class="btn big" data-act="submit">'+B('submit')+'</button></div>';
 if(S.sub)h+=renderResult();
 document.getElementById('app').innerHTML=h;
 document.getElementById('report').innerHTML=renderReport();
 renderBar();updProg();pad();
 window.scrollTo(0,y)}
function renderBar(){
 document.getElementById('langs').innerHTML=LANGS.map(function(l){return '<button class="pill'+(S.lang===l[0]?' on':'')+'" data-act="lang" data-i="'+l[0]+'" lang="'+l[0]+'">'+l[1]+'</button>'}).join('');
 var s=document.getElementById('set');
 s.className=S.open?'open':'';
 s.innerHTML='<div class="card"><div class="row2"><label>'+B('level')+'</label><button class="pill'+(S.lvl==='b'?' on':'')+'" data-act="lvl" data-i="b">'+esc(UI.basis[0])+'</button><button class="pill'+(S.lvl==='v'?' on':'')+'" data-act="lvl" data-i="v">⭐ '+esc(UI.vert[0])+'</button></div><div class="meta">'+esc(UI.vnote[0])+'</div>'+(S.lang!=='de'?'<div class="tr" lang="'+S.lang+'" dir="'+(RTL[S.lang]?'rtl':'ltr')+'">'+esc(U('vnote'))+'</div>':'')+'<div class="row2"><label>'+B('fs')+'</label><button class="pill" data-act="fs" data-i="-1">A−</button><button class="pill" data-act="fs" data-i="1">A+</button></div><div class="row2"><button class="btn gray" data-act="restart">'+B('restart')+'</button></div></div>';
 var bt=document.getElementById('gear');bt.innerHTML='⚙ '+esc(U('settings'));
 document.documentElement.style.setProperty('--fs',FS[S.fs||0]+'%');
 document.documentElement.lang=S.lang;
 }
function pad(){var m=document.querySelector('main'),b=document.getElementById('bar');if(m&&b)m.style.paddingTop=(b.offsetHeight+14)+'px'}
window.addEventListener('resize',pad);
function toast(m){var d=document.createElement('div');d.className='toast';d.textContent=m;document.body.appendChild(d);setTimeout(function(){d.remove()},2200)}
function dialog(msgKey,onYes){var d=document.createElement('div');d.className='dlg';d.innerHTML='<div><p><b>'+esc(UI[msgKey][0])+'</b></p>'+(S.lang!=='de'?'<p>'+esc(U(msgKey))+'</p>':'')+'<button class="btn" data-d="y">'+B('yes')+'</button><button class="btn gray" data-d="n">'+B('cancel')+'</button></div>';d.addEventListener('click',function(e){var x=e.target.getAttribute&&e.target.getAttribute('data-d');if(!x&&e.target!==d&&!e.target.closest('[data-d]'))return;var dd=e.target.closest('[data-d]');if(dd&&dd.getAttribute('data-d')==='y')onYes();d.remove()});document.body.appendChild(d)}
function findBlock(id){for(var i=0;i<SHEET.blocks.length;i++)if(SHEET.blocks[i].id===id)return SHEET.blocks[i]}
function findItem(id){for(var i=0;i<SHEET.blocks.length;i++){var its=SHEET.blocks[i].items||[];for(var j=0;j<its.length;j++)if(its[j].id===id)return its[j]}}
/* Ereignisse */
document.addEventListener('click',function(e){
 var el=e.target.closest('[data-act]');if(!el)return;var act=el.getAttribute('data-act'),id=el.getAttribute('data-id'),i=el.getAttribute('data-i'),r=el.getAttribute('data-r');
 switch(act){
 case 'lang':S.lang=i;break;
 case 'lvl':S.lvl=i;break;
 case 'fs':S.fs=Math.max(0,Math.min(FS.length-1,(S.fs||0)+Number(i)));break;
 case 'tip':S.tip[id]=!S.tip[id];break;
 case 'chk':S.chk[id]=true;break;
 case 'mkchk':S.chk[id]=true;break;
 case 'submit':S.sub=true;SHEET.blocks.forEach(function(b){S.chk[b.id]=true});saveNow();render();var rs=document.getElementById('result');if(rs)rs.scrollIntoView({behavior:'smooth'});return;
 case 'sol':S.sol[id]=true;break;
 case 'self':var v=S.a[id]||{};v.s=Number(i);S.a[id]=v;break;
 case 'mc':S.a[id]=Number(i);break;
 case 'tb':case 'tf':case 'sel':var arr=S.a[id]||[];arr[Number(r)]=act==='tf'?i==='1':Number(i);S.a[id]=arr;break;
 case 'mk':var m=S.mk[id]||[];var n=Number(i),p=m.indexOf(n);if(S.chk[id])return;if(p>=0)m.splice(p,1);else m.push(n);S.mk[id]=m;break;
 case 'print':window.print();return;
 case 'next':dialog('restartq',function(){S=fresh();wipe();render()});return;
 case 'restart':dialog('restartq',function(){var l=S.lang;S=fresh();S.lang=l;wipe();render()});return;
 default:return}
 save();render()});
document.getElementById('gear').addEventListener('click',function(){S.open=!S.open;save();renderBar()});
document.addEventListener('change',function(e){var el=e.target;var act=el.getAttribute&&el.getAttribute('data-act');if(act==='gap'||act==='sel'){var arr=S.a[el.getAttribute('data-id')]||[];var v=el.value;arr[Number(el.getAttribute('data-r'))]=act==='sel'?(v===''?null:Number(v)):(v===''?null:v);S.a[el.getAttribute('data-id')]=arr;save();updProg()}});
document.addEventListener('input',function(e){var el=e.target;var act=el.getAttribute&&el.getAttribute('data-act'),id=el.getAttribute&&el.getAttribute('data-id');
 if(act==='txt'){var v=S.a[id]||{};v.t=el.value;S.a[id]=v}
 else if(act==='calc')S.a[id]=el.value;
 else if(act==='nm')S.name=el.value;
 else if(act==='dt')S.date=el.value;
 else if(act==='est'){var o=S.a[id]||{};o[el.getAttribute('data-f')]=el.value;S.a[id]=o}
 else return;
 save();if(act==='txt'||act==='calc')updProg();
 if(act==='nm'||act==='dt'||act==='est')document.getElementById('report').innerHTML=renderReport()});
document.addEventListener('visibilitychange',saveNow);window.addEventListener('pagehide',saveNow);
window.addEventListener('beforeprint',function(){document.getElementById('report').innerHTML=renderReport()});
/* Start */
var old=load();S=old?Object.assign(fresh(),old):fresh();
document.getElementById('bartitle').textContent=SHEET.mod+' · '+SHEET.title;
document.title='LF 4 · '+SHEET.mod+' · '+SHEET.title;
render();
if(old&&Object.keys(old.a||{}).length)toast(U('restored'));
window.__missing=function(){return Object.keys(missing)};
window.__state=function(){return S};
})();
