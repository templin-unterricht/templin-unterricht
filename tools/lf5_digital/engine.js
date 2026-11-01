(function(){
'use strict';
const D=SHEET, KEY='lf5_digital_'+D.id+'_v1';
const $=(s,r)=>(r||document).querySelector(s), $$=(s,r)=>[...(r||document).querySelectorAll(s)];
const esc=s=>String(s==null?'':s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const rich=s=>esc(s).replace(/\*\*(.+?)\*\*/g,'<b>$1</b>').replace(/\n/g,'<br>');
const UI={
 progress:{de:'Aufgaben bearbeitet',vi:'bài tập đã làm'},tip:{de:'Tipp',vi:'Gợi ý'},check:{de:'Prüfen',vi:'Kiểm tra'},
 model:{de:'Musterlösung anzeigen',vi:'Xem bài mẫu'},basis:{de:'Basis',vi:'Cơ bản'},vert:{de:'Vertiefung',vi:'Nâng cao'},
 name:{de:'Name',vi:'Họ và tên'},date:{de:'Datum',vi:'Ngày'},can:{de:'Das kann ich danach',vi:'Sau bài này em có thể'},
 eval:{de:'Auswertung anzeigen',vi:'Xem kết quả'},pdf:{de:'Als PDF speichern / drucken',vi:'Lưu PDF / in ra'},
 restart:{de:'Neu starten',vi:'Làm lại từ đầu'},ask:{de:'Alles löschen und neu anfangen? Deine Antworten in diesem Arbeitsblatt gehen verloren.',vi:'Xóa hết và bắt đầu lại? Các câu trả lời của em trong phiếu này sẽ mất.'},
 yes:{de:'Ja, löschen',vi:'Có, xóa'},no:{de:'Abbrechen',vi:'Hủy'},
 rate:{de:'Wie gut war deine Antwort? Vergleiche mit der Musterlösung.',vi:'Câu trả lời của em tốt đến đâu? Hãy so với bài mẫu.'},
 y:{de:'Geschafft',vi:'Đạt'},p:{de:'Teilweise',vi:'Một phần'},n:{de:'Noch nicht',vi:'Chưa đạt'},
 choose:{de:'– wählen –',vi:'– chọn –'},richtig:{de:'richtig',vi:'đúng'},falsch:{de:'falsch',vi:'sai'},
 tap:{de:'Tippe die wichtigen Wörter an (gelb).',vi:'Chạm vào các từ quan trọng (màu vàng).'},chkmark:{de:'Markierung prüfen',vi:'Kiểm tra phần đánh dấu'},
 words:{de:'Wörter und Satzanfänge zum Antippen',vi:'Từ và đầu câu để chạm vào'},
 res:{de:'Deine Auswertung',vi:'Kết quả của em'},pts:{de:'Punkte',vi:'điểm'},bonus:{de:'Bonus (Vertiefung)',vi:'Điểm thưởng (Nâng cao)'},
 mine:{de:'Deine Antwort',vi:'Câu trả lời của em'},sol:{de:'Richtige Lösung',vi:'Đáp án đúng'},why:{de:'Erklärung',vi:'Giải thích'},
 path:{de:'Rechenweg',vi:'Cách tính'},empty:{de:'(keine Antwort)',vi:'(chưa trả lời)'},
 next:{de:'Nächste Person',vi:'Người tiếp theo'},restored:{de:'Weitermachen, wo du aufgehört hast',vi:'Tiếp tục từ chỗ em đã dừng'},
 level:{de:'Ebene',vi:'Mức độ'},selfeval:{de:'Selbsteinschätzung',vi:'Tự đánh giá'},unrated:{de:'noch nicht eingeschätzt',vi:'chưa tự đánh giá'},
 of:{de:'von',vi:'trên'},right:{de:'richtig',vi:'đúng'},found:{de:'Schlüsselbegriffe gefunden',vi:'từ khóa đã tìm thấy'},extra:{de:'zu viel markiert',vi:'đánh dấu thừa'},
 allright:{de:'Alles richtig!',vi:'Tất cả đều đúng!'},notall:{de:'Noch nicht alles richtig. Rot = falsch. Versuche es noch einmal.',vi:'Chưa đúng hết. Màu đỏ = sai. Em thử lại nhé.'},
 fill:{de:'Fülle zuerst alle Felder aus.',vi:'Hãy điền hết các ô trước.'},
 readfb:{de:'Lesetraining (ohne Punkte)',vi:'Luyện đọc (không tính điểm)'},hint:{de:'Mit Hilfe von Claude erstellt – bitte prüfen lassen.',vi:''},
 done:{de:'bearbeitet',vi:'đã làm'},
 printhint:{de:'Tipp: Im Druckfenster „Als PDF sichern“ wählen.',vi:'Gợi ý: Trong cửa sổ in, chọn “Lưu dưới dạng PDF”.'}
};
const u=k=>UI[k][S.lang]||UI[k].de;
const T=x=>x==null?'':typeof x==='string'?x:(x[S.lang]||x.de||'');
function def(){return{lang:'de',level:'b',name:'',date:new Date().toLocaleDateString('de-DE'),ans:{},checked:{},shown:{},can:{},sub:false}}
let S=def();
function load(){try{const r=localStorage.getItem(KEY);if(r){const o=JSON.parse(r);S=Object.assign(def(),o);return true}}catch(e){}return false}
let st=null;function save(){clearTimeout(st);st=setTimeout(saveNow,400)}
function saveNow(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
function clearStore(){try{localStorage.removeItem(KEY)}catch(e){}}
const A=id=>S.ans[id]||(S.ans[id]={});
function hashSeed(s){let h=7;for(let i=0;i<s.length;i++)h=(h*31+s.charCodeAt(i))>>>0;return h}
function shuf(arr,seed){const a=arr.slice();let s=hashSeed(seed)||1;for(let i=a.length-1;i>0;i--){s=(s*1664525+1013904223)>>>0;const j=s%(i+1);[a[i],a[j]]=[a[j],a[i]]}return a}
function norm(s){return String(s==null?'':s).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g,'').replace(/ß/g,'ss').replace(/[^a-z0-9%€., ]/g,' ').replace(/\s+/g,' ').trim()}
function num(s){s=String(s==null?'':s).replace(/[€%\s]|[a-zA-Z²³]+/g,'');if(!s)return NaN;if(s.indexOf(',')>=0)s=s.replace(/\./g,'').replace(',','.');else if(/^\d{1,3}(\.\d{3})+$/.test(s))s=s.replace(/\./g,'');return parseFloat(s)}
const fmt=n=>(Math.round(n*10)/10).toString().replace('.',',');
const fnum=n=>n.toLocaleString('de-DE',{maximumFractionDigits:4});
/* ---------- Teile je Typ ---------- */
function cells(it){const o=[];it.rows.forEach((r,ri)=>r.forEach((c,ci)=>{if(c&&typeof c==='object')o.push({ri,ci,a:c.a,o:c.o||(it.colOpts||[])[ci],typed:c.typed,why:c.why})}));return o}
function parts(it){switch(it.type){case'mc':return it.qs;case'tf':return it.st;case'gap':return it.gaps;case'match':return it.rows;case'table':return cells(it);case'calc':case'free':return it.parts;default:return[]}}
function matchOpts(it){return shuf([...new Set(it.rows.map(r=>r.a).concat(it.extra||[]))],it.id)}
function visible(it){return it.level==='v'?S.level==='v':true}
function scored(it){return['mc','tf','gap','match','table','calc','free'].indexOf(it.type)>=0}
function counted(it){return scored(it)||it.type==='read'}
/* ---------- Bewertung ---------- */
function mcTxt(p,idx){return String(idx).split(',').filter(x=>x!=='').map(i=>p.o[+i]).join(' / ')}
function grade(it){
 const a=A(it.id),ps=parts(it),res=[];
 if(it.type==='read'){const keys=readKeys(it),sel=a.m||[];const found=keys.filter(k=>sel.indexOf(k)>=0).length,extra=sel.filter(k=>keys.indexOf(k)<0).length;
  const q=it.quiz,qa=a.q;return{type:'read',found,total:keys.length,extra,qok:q?(qa!=null&&+qa===q.a):null,max:0,got:0,parts:[],filled:!!(a.chk&&(!q||qa!=null))}}
 ps.forEach((p,i)=>{const v=a['p'+i];let ok=false,mine='',sol='',has=v!=null&&String(v).trim()!=='';
  switch(it.type){
  case'mc':{const sa=[].concat(p.a).slice().sort().join(',');const sv=has?String(v).split(',').sort().join(','):'';ok=has&&sv===sa;mine=has?mcTxt(p,v):'';sol=mcTxt(p,sa);break}
  case'tf':ok=has&&(v==='t')===p.a;mine=has?(v==='t'?u('richtig'):u('falsch')):'';sol=p.a?u('richtig'):u('falsch');break;
  case'gap':{const acc=[].concat(p.a);ok=has&&acc.some(x=>norm(x)===norm(v));mine=has?v:'';sol=acc[0];break}
  case'match':ok=has&&v===p.a;mine=has?v:'';sol=p.a;break;
  case'table':{const acc=[].concat(p.a);ok=has&&acc.some(x=>norm(x)===norm(v));mine=has?v:'';sol=acc[0];break}
  case'calc':{const n=num(v);ok=has&&!isNaN(n)&&Math.abs(n-p.a)<=(p.tol==null?0.01:p.tol);mine=has?v:'';sol=fnum(p.a)+(p.u?' '+p.u:'');if(a['p'+i+'w'])mine+=' | '+u('path')+': '+a['p'+i+'w'];break}
  case'free':{const r=a['r'+i];ok=r==='y'?true:r==='p'?0.5:false;has=has&&!!r;mine=a['p'+i]||'';sol=T(p.m);break}
  }
  res.push({ok,has,mine,sol,why:p.why,q:p.q,p});});
 const per=ps.length?it.pts/ps.length:0;let got=0;res.forEach(r=>{got+=(r.ok===true?1:r.ok===0.5?0.5:0)*per});
 let filled;if(it.type==='free')filled=ps.every((p,i)=>String(a['p'+i]||'').trim()!=='');else filled=res.every(r=>r.has);
 return{type:it.type,parts:res,max:it.pts||0,got,filled,any:res.some(r=>r.has)}}
function tokens(p){const out=[];let idx=0;let m;
 const parts=[];let last=0,s=p;const rg=/\[\[(.+?)\]\]|\{\{(.+?)\}\}/g;while((m=rg.exec(s))){if(m.index>last)parts.push({t:s.slice(last,m.index)});parts.push({t:m[1]||m[2],key:!!m[1]});last=rg.lastIndex}
 if(last<s.length)parts.push({t:s.slice(last)});
 parts.forEach((pt,pi)=>{const prev=parts[pi-1];pt.t.split(/\s+/).filter(Boolean).forEach((w,wi)=>{const att=wi===0&&prev&&!/\s$/.test(prev.t)&&!/^\s/.test(pt.t);out.push({w,key:!!pt.key,i:idx++,att,pu:/^[.,;:!?)“”„"]+$/.test(w)})})});return out}
function allTokens(it){let g=0;return it.paras.map(p=>tokens(p).map(t=>({w:t.w,key:t.key,att:t.att,pu:t.pu,i:g++})))}
function readKeys(it){const k=[];allTokens(it).forEach(ps=>ps.forEach(t=>{if(t.key)k.push(t.i)}));return k}
/* ---------- Rendern ---------- */
function ptsLabel(it){if(it.type==='read'||!it.pts)return'';return it.level==='v'?'+'+fmt(it.pts)+' '+(S.lang==='vi'?'điểm thưởng':'Bonus'):fmt(it.pts)+' '+(S.lang==='vi'?'điểm':(it.pts===1?'Punkt':'Punkte'))}
function tipBlock(it){return it.tip?`<details class="tip"><summary>💡 ${u('tip')}</summary><div>${rich(T(it.tip))}</div></details>`:''}
function wg(it,i,p){if(!p.w&&!p.s)return'';const ch=(p.w||[]).concat(p.s||[]).map(x=>`<button type="button" class="chip" data-chip="${esc(x)}" data-for="${it.id}_${i}">${esc(x)}</button>`).join('');return`<details class="wg"><summary>✏️ ${u('words')}</summary><div class="chips">${ch}</div></details>`}
const BODY={
 info(it){return`<div class="info">${it.html||''}</div>`+(it.vi&&S.lang==='vi'?`<div class="vis">${rich(it.vi)}</div>`:'')},
 read(it){const per=allTokens(it);const a=A(it.id);const sel=a.m||[];
  const ps=per.map(ts=>`<p class="rd${a.chk?' chk':''}" data-rd="${it.id}">`+ts.map(t=>t.pu&&t.att?esc(t.w):(t.att?'':' ')+`<span class="w${t.key?' key':''}${sel.indexOf(t.i)>=0?' sel':''}" data-w="${t.i}" role="button" tabindex="0">${esc(t.w)}</span>`).join('').trim()+'</p>').join('');
  const q=it.quiz;let quiz='';
  if(q&&a.chk){quiz=`<div class="q" data-part="0"><p class="qt">${rich(T(q.q))}</p><div class="opts">`+q.o.map((o,j)=>`<label class="opt"><input type="radio" name="${it.id}_q" data-k="q" value="${j}"${a.q!=null&&+a.q===j?' checked':''}><span>${rich(o)}</span></label>`).join('')+'</div></div>'}
  return`<p class="vis">${u('tap')}</p>${ps}<div class="actions"><button type="button" class="primary" data-act="rdchk" data-id="${it.id}">${u('chkmark')}</button></div>${quiz}`+(it.vi&&S.lang==='vi'?`<p class="vis">${rich(it.vi)}</p>`:'')},
 mc(it){const a=A(it.id);return it.qs.map((q,i)=>{const multi=Array.isArray(q.a);const cur=String(a['p'+i]==null?'':a['p'+i]).split(',');
  return`<div class="q" data-part="${i}"><p class="qt">${rich(T(q.q))}</p><div class="opts">`+q.o.map((o,j)=>`<label class="opt"><input type="${multi?'checkbox':'radio'}" name="${it.id}_${i}" data-k="p${i}" ${multi?'data-multi="1"':''} value="${j}"${cur.indexOf(String(j))>=0?' checked':''}><span>${rich(o)}</span></label>`).join('')+'</div></div>'}).join('')},
 tf(it){const a=A(it.id);return it.st.map((s,i)=>`<div class="tfrow" data-part="${i}"><div class="st">${rich(T(s.t))}</div><div class="opts">`+['t','f'].map(v=>`<label class="opt"><input type="radio" name="${it.id}_${i}" data-k="p${i}" value="${v}"${a['p'+i]===v?' checked':''}><span>${u(v==='t'?'richtig':'falsch')}</span></label>`).join('')+'</div></div>').join('')},
 gap(it){const a=A(it.id);let html=esc(it.text);const bank=it.bank?shuf(it.bank,it.id):null;
  it.gaps.forEach((g,i)=>{const v=a['p'+i]||'';let el;const o=g.o?shuf(g.o,it.id+i):bank;
   if(o)el=`<select data-k="p${i}" data-part="${i}"><option value="">${u('choose')}</option>`+o.map(x=>`<option${x===v?' selected':''}>${esc(x)}</option>`).join('')+'</select>';
   else el=`<input class="in" type="text" data-k="p${i}" data-part="${i}" autocomplete="off" autocapitalize="off" spellcheck="false" size="${Math.max(8,String([].concat(g.a)[0]).length+2)}" value="${esc(v)}">`;
   html=html.replace('{'+i+'}',el)});
  return`<p class="gaptxt">${html.replace(/\n/g,'<br>')}</p>`},
 match(it){const a=A(it.id);const o=matchOpts(it);return it.rows.map((r,i)=>`<div class="mrow" data-part="${i}"><div><b>${rich(T(r.l))}</b></div><select data-k="p${i}"><option value="">${u('choose')}</option>`+o.map(x=>`<option${a['p'+i]===x?' selected':''}>${esc(x)}</option>`).join('')+'</select></div>').join('')},
 table(it){const a=A(it.id);let n=0;return it.rows.map(r=>{const cols=r.length;return`<div class="trow" style="--n:${cols}">`+r.map((c,ci)=>{
   if(c&&typeof c==='object'){const i=n++;const o=c.o||(it.colOpts||[])[ci];const v=a['p'+i]||'';const f=o?`<select data-k="p${i}"><option value="">${u('choose')}</option>`+o.map(x=>`<option${x===v?' selected':''}>${esc(x)}</option>`).join('')+'</select>':`<input class="in" type="text" data-k="p${i}" value="${esc(v)}" autocomplete="off">`;
    return`<div class="fld" data-part="${i}"><label>${esc(it.cols[ci])}</label>${f}</div>`}
   return`<div class="fld"><label>${esc(it.cols[ci])}</label><div>${rich(T(c))}</div></div>`}).join('')+'</div>'}).join('')},
 calc(it){const a=A(it.id);return it.parts.map((p,i)=>`<div class="crow" data-part="${i}"><p class="qt">${rich(T(p.q))}</p><input class="in" type="text" inputmode="decimal" data-k="p${i}" value="${esc(a['p'+i]||'')}" autocomplete="off" placeholder="0,00"><span class="u">${esc(p.u||'')}</span>${p.work?`<textarea class="in" data-k="p${i}w" rows="2" style="min-height:4rem" placeholder="${S.lang==='vi'?'Cách tính (viết ra)':'Rechenweg (aufschreiben)'}">${esc(a['p'+i+'w']||'')}</textarea>`:''}</div>`).join('')},
 free(it){const a=A(it.id);const sh=S.shown[it.id];return it.parts.map((p,i)=>`<div class="fpart"><p class="qt">${rich(T(p.q))}</p>${wg(it,i,p)}<textarea class="in" id="${it.id}_${i}" data-k="p${i}" rows="3" placeholder="…">${esc(a['p'+i]||'')}</textarea>`+(sh?`<div class="model"><div class="t">${u('model').replace(/ anzeigen| ?$/,'')}</div>${rich(T(p.m))}</div><div class="rate" data-part="${i}"><span style="flex:1 1 100%;font-weight:600">${u('rate')}</span>`+['y','p','n'].map(v=>`<button type="button" data-rate="${v}" data-k="r${i}" class="${a['r'+i]===v?'on':''}">${u(v)}</button>`).join('')+'</div>':'')+'</div>').join('')}
};
function actions(it){if(it.type==='info'||it.type==='read')return'';if(it.type==='free')return S.shown[it.id]?'':`<button type="button" class="primary" data-act="model" data-id="${it.id}">${u('model')}</button>`;return`<button type="button" class="primary" data-act="check" data-id="${it.id}">${u('check')}</button>`}
function cardHtml(it){const v=it.level==='v';
 return`<section class="card${v?' vert':''}" id="c_${it.id}" data-id="${it.id}"><header>${it.no?`<span class="no">${esc(it.no)}</span>`:''}<h2>${rich(T(it.title))}</h2><span class="pts">${ptsLabel(it)}</span></header>`+
 (it.instr?`<p class="instr">${rich(T(it.instr))}</p>`:'')+tipBlock(it)+`<div class="body">${BODY[it.type](it)}</div><div class="actions">${actions(it)}</div><div class="fb" aria-live="polite"></div></section>`}
function renderAll(){
 document.documentElement.lang=S.lang==='vi'?'vi':'de';
 $('#cards').innerHTML=D.items.filter(visible).map(cardHtml).join('');
 $('#t_can').textContent=u('can');$('#l_name').textContent=u('name');$('#l_date').textContent=u('date');
 $('#cans').innerHTML=D.can.map((c,i)=>`<label><input type="checkbox" data-can="${i}"${S.can[i]?' checked':''}><span>${rich(T(c))}</span></label>`).join('');
 $('#b_eval').textContent=u('eval');$('#b_pdf').textContent='📄 '+u('pdf');$('#b_restart').textContent=u('restart');
 $$('[data-lv]').forEach(b=>{b.textContent=u(b.dataset.lv==='b'?'basis':'vert');b.classList.toggle('on',S.level===b.dataset.lv)});
 $$('[data-lg]').forEach(b=>b.classList.toggle('on',S.lang===b.dataset.lg));
 $('#cnt').textContent='';$('#m_ask').textContent=u('ask');$('#m_yes').textContent=u('yes');$('#m_no').textContent=u('no');
 D.items.filter(visible).forEach(it=>{if(S.checked[it.id])paint(it)});
 if(S.sub)renderResult();else $('#result').classList.add('hide');
 progress()}
function progress(){const its=D.items.filter(it=>visible(it)&&counted(it));let n=0;its.forEach(it=>{if(grade(it).filled)n++});
 const pc=its.length?Math.round(n/its.length*100):0;$('#barfill').style.width=pc+'%';$('#cnt').textContent=n+' / '+its.length+' '+u('progress');
 $$('.card').forEach(c=>{const it=D.items.find(x=>x.id===c.dataset.id);c.classList.toggle('done',counted(it)&&grade(it).filled)});
 [25,50,75,100].forEach(m=>{if(pc>=m&&!(S.toast||{})[m]&&n>0){S.toast=S.toast||{};S.toast[m]=1;if(m===100||m===50)toast(m+' % ✓')}})}
function paint(it){const c=$('#c_'+it.id);if(!c)return;const g=grade(it);const fb=$('.fb',c);
 if(it.type==='read'){const a=A(it.id);const rd=$$('.rd',c);rd.forEach(r=>r.classList.add('chk'));
  let h=`${g.found===g.total&&!g.extra?'✔':'ℹ️'} ${g.found} ${u('of')} ${g.total} ${u('found')}`+(g.extra?`, ${g.extra} ${u('extra')}`:'');fb.className='fb '+(g.found===g.total&&!g.extra?'ok':'mid');fb.innerHTML=h;
  const q=it.quiz;if(q&&a.q!=null){const qq=$('.q',c);const ok=+a.q===q.a;qq.classList.toggle('ok',ok);qq.classList.toggle('bad',!ok);fb.innerHTML+=`<small>${ok?'✓':'✗'} ${rich(T(q.why))}</small>`}return}
 if(!S.checked[it.id]||it.type==='info')return;
 if(it.type==='free'){return}
 const right=g.parts.filter(p=>p.ok===true).length;
 g.parts.forEach((p,i)=>{$$('[data-part="'+i+'"]',c).forEach(el=>{el.classList.remove('ok','bad');if(p.has)el.classList.add(p.ok===true?'ok':'bad');else el.classList.add('bad')})});
 fb.className='fb '+(right===g.parts.length?'ok':right?'mid':'bad');
 fb.innerHTML=(right===g.parts.length?'✓ '+u('allright'):right+' '+u('of')+' '+g.parts.length+' '+u('right')+'. '+(g.filled?'':u('fill')+' ')+(right<g.parts.length?`<small>${u('notall')}</small>`:''))}
function toast(t){const e=$('#toast');e.textContent=t;e.classList.add('on');clearTimeout(toast.t);toast.t=setTimeout(()=>e.classList.remove('on'),2200)}
/* ---------- Ergebnis ---------- */
function stateOf(r){return r.ok===true?'g':r.ok===0.5?'m':'r'}
function renderResult(){
 const its=D.items.filter(visible);let got=0,max=0,bg=0,bm=0;
 const html=its.filter(it=>it.type!=='info').map(it=>{const g=grade(it);
  if(it.type==='read'){return`<div class="ritem"><h4><span>${esc(it.no||'')}</span> ${rich(T(it.title))} <span class="st ${g.found===g.total&&!g.extra?'g':'m'}">${g.filled?g.found+' / '+g.total:'–'}</span></h4><small>${u('readfb')}</small></div>`}
  if(it.level==='v'){bg+=g.got;bm+=g.max}else{got+=g.got;max+=g.max}
  const nr=g.parts.filter(r=>r.ok===true).length;const full=it.pts?g.got>=g.max-0.001:nr===g.parts.length;const cls=full?'g':(it.pts?g.got>0:nr>0)?'m':'r';
  let li=g.parts.map((r,i)=>{const p=r.p;let line='';const lab=it.type==='match'?T(p.l):it.type==='table'?(it.rows[p.ri]&&T(it.rows[p.ri][0])||'')+' ['+it.cols[p.ci]+']':it.type==='gap'?'('+(i+1)+')':T(p.q||p.t||'')||(i+1);
   const mark=r.ok===true?'✓':r.ok===0.5?'◐':'✗';
   line=`<li><b>${mark}</b> ${rich(String(lab).slice(0,200))}<br><span class="${r.ok===true?'':'mine'}">${u('mine')}: ${r.mine?rich(r.mine):u('empty')}</span>`;
   if(r.ok!==true||it.type==='free')line+=`<br><span class="sol">${u('sol')}: ${rich(r.sol)}</span>`;
   if(r.ok!==true&&r.why)line+=`<br><small>${u('why')}: ${rich(T(r.why))}</small>`;
   if(it.type==='calc'&&p.steps)line+=`<div class="steps"><b>${u('path')}:</b>`+p.steps.map(s=>`<div>${esc(T(s))}</div>`).join('')+'</div>';
   return line+'</li>'}).join('');
  if(it.why&&!full)li+=`<li><small>${u('why')}: ${rich(T(it.why))}</small></li>`;
  if(it.type==='free'&&g.parts.some(r=>!r.has))li+=`<li><small>${u('unrated')}</small></li>`;
  return`<div class="ritem"><h4><span>${esc(it.no||'')}</span> ${rich(T(it.title))}${it.level==='v'?' ('+u('vert')+')':''} <span class="st ${cls}">${it.pts?fmt(g.got)+' / '+fmt(g.max):''}</span></h4><ul>${li}</ul></div>`}).join('');
 const el=$('#result');el.classList.remove('hide');
 el.innerHTML=`<h2>${u('res')}</h2><p><b>${u('name')}:</b> ${esc(S.name)||'______'} &nbsp; <b>${u('date')}:</b> ${esc(S.date)} &nbsp; <b>${u('level')}:</b> ${u(S.level==='v'?'vert':'basis')}</p><p>${esc(D.title)}</p><div class="score">${fmt(got)} ${u('of')} ${fmt(max)} ${u('pts')}</div>`+(S.level==='v'&&bm?`<p><b>${u('bonus')}:</b> +${fmt(bg)} (${fmt(bm)})</p>`:'')+html+`<p class="noprint"><button type="button" id="b_next">${u('next')}</button></p>`;
 $('#b_next').onclick=()=>{S=def();clearStore();renderAll();window.scrollTo(0,0)};
 S.sub=true;save()}
/* ---------- Ereignisse ---------- */
function cardOf(e){const c=e.closest('.card');return c?D.items.find(x=>x.id===c.dataset.id):null}
document.addEventListener('input',e=>{const t=e.target;
 if(t.id==='nm'){S.name=t.value;save();return}if(t.id==='dt'){S.date=t.value;save();return}
 const it=cardOf(t);if(!it||!t.dataset.k)return;if(t.type==='radio'||t.type==='checkbox')return;A(it.id)[t.dataset.k]=t.value;if(S.checked[it.id]&&t.closest('.card'))t.classList.remove('ok','bad');progress();save()});
document.addEventListener('change',e=>{const t=e.target;
 if(t.dataset.can!=null){S.can[t.dataset.can]=t.checked;save();return}
 const it=cardOf(t);if(!it||!t.dataset.k)return;const a=A(it.id);
 if(t.type==='radio'){a[t.dataset.k]=t.value}
 else if(t.type==='checkbox'){const vals=$$('input[name="'+t.name+'"]:checked',t.closest('.card')).map(x=>x.value);a[t.dataset.k]=vals.join(',')}
 else a[t.dataset.k]=t.value;
 if(it.type==='read'&&a.chk){paint(it);}
 if(S.checked[it.id]){const el=t.closest('[data-part]');if(el)el.classList.remove('ok','bad')}
 progress();save()});
document.addEventListener('click',e=>{const t=e.target.closest('button,.w,[data-lg],[data-lv]');if(!t)return;
 if(t.dataset.lg){S.lang=t.dataset.lg;renderAll();save();return}
 if(t.dataset.lv){S.level=t.dataset.lv;renderAll();save();return}
 if(t.classList.contains('w')){const it=cardOf(t);const a=A(it.id);if(a.chk)return;a.m=a.m||[];const i=+t.dataset.w;const k=a.m.indexOf(i);if(k>=0)a.m.splice(k,1);else a.m.push(i);t.classList.toggle('sel');save();return}
 if(t.dataset.chip){const ta=document.getElementById(t.dataset.for);if(!ta)return;const s=ta.selectionStart==null?ta.value.length:ta.selectionStart,en=ta.selectionEnd==null?s:ta.selectionEnd;const ins=t.dataset.chip+' ';ta.value=ta.value.slice(0,s)+ins+ta.value.slice(en);ta.focus();ta.selectionStart=ta.selectionEnd=s+ins.length;ta.dispatchEvent(new Event('input',{bubbles:true}));return}
 if(t.dataset.rate){const it=cardOf(t);A(it.id)[t.dataset.k]=t.dataset.rate;$$('[data-k="'+t.dataset.k+'"]',t.parentNode).forEach(b=>b.classList.toggle('on',b===t));progress();save();return}
 const act=t.dataset.act;if(!act)return;const it=D.items.find(x=>x.id===t.dataset.id);
 if(act==='check'){S.checked[it.id]=true;paint(it);progress();save()}
 if(act==='rdchk'){A(it.id).chk=true;const c=$('#c_'+it.id);const keep=window.scrollY;const fbk=true;renderCard(it);paint(it);window.scrollTo(0,keep);progress();save()}
 if(act==='model'){S.shown[it.id]=true;renderCard(it);progress();save()}
});
function renderCard(it){const old=$('#c_'+it.id);const tmp=document.createElement('div');tmp.innerHTML=cardHtml(it);const det=old.querySelector('.tip').open;old.replaceWith(tmp.firstChild);if(S.checked[it.id]||it.type==='read')paint(it)}
function evaluate(){renderResult();$('#result').scrollIntoView({behavior:'smooth'})}
$('#b_eval').onclick=evaluate;
$('#b_pdf').onclick=()=>{renderResult();setTimeout(()=>window.print(),100)};
$('#b_restart').onclick=()=>$('#modal').classList.add('on');
$('#m_no').onclick=()=>$('#modal').classList.remove('on');
$('#m_yes').onclick=()=>{$('#modal').classList.remove('on');S=def();clearStore();$('#nm').value='';$('#dt').value=S.date;renderAll();window.scrollTo(0,0)};
document.addEventListener('visibilitychange',()=>{if(document.hidden)saveNow()});window.addEventListener('pagehide',saveNow);
window.addEventListener('beforeprint',()=>{$$('textarea').forEach(t=>{t.style.height='auto';t.style.height=t.scrollHeight+'px'})});
/* ---------- Start ---------- */
const had=load();
$('#h_title').textContent=D.title;$('#h_sub').textContent=D.sub;$('#topt').textContent=D.short;
$('#nm').value=S.name;$('#dt').value=S.date;
renderAll();if(had&&Object.keys(S.ans).length)toast(u('restored'));
/* Test-Hilfe (für Lehrkraft-Prüfung per Konsole): LF5.solve(true|false) */
window.LF5={S:()=>S,grade:id=>grade(D.items.find(x=>x.id===id)),
 solve(right){D.items.forEach(it=>{const a=A(it.id);parts(it).forEach((p,i)=>{const k='p'+i;
  switch(it.type){
   case'mc':{const sa=[].concat(p.a);a[k]=right?sa.join(','):String((sa[0]+1)%p.o.length);break}
   case'tf':a[k]=(right===p.a)?'t':'f';break;
   case'gap':a[k]=right?[].concat(p.a)[0]:'xxx';break;
   case'match':a[k]=right?p.a:'—falsch—';break;
   case'table':a[k]=right?[].concat(p.a)[0]:'—falsch—';break;
   case'calc':a[k]=right?String(p.a).replace('.',','):'1';break;
   case'free':a[k]='Beispielantwort';a['r'+i]=right?'y':'n';S.shown[it.id]=true;break}});
  if(it.type==='read'){a.m=right?readKeys(it):[];a.chk=true;if(it.quiz)a.q=right?it.quiz.a:(it.quiz.a+1)%it.quiz.o.length}
  S.checked[it.id]=true});renderAll();evaluate();return S},
 data:D};
})();
