// node verify_kaje7.js <mehrsprachig.html> <lang>  – spielt Kaje 7 mit Übersetzung durch und meldet nicht übersetzte Texte
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const [,,app,lang,runs]=process.argv;
const scenFactory=async(p,RUNSN)=>{
 const RUNS=RUNSN;
 await p.emulateMedia({reducedMotion:'reduce'});

 await p.evaluate(()=>{
  const SKIP={SCRIPT:1,STYLE:1,SVG:1,CANVAS:1,INPUT:1,TEXTAREA:1,SELECT:1,OPTION:1,NOSCRIPT:1,IFRAME:1,svg:1,TITLE:1};
  const BLOCKY={SMALL:1,BUTTON:1,TD:1,TH:1,LI:1,LABEL:1,A:1,H1:1,H2:1,H3:1,H4:1,P:1,DIV:1,SPAN:1,B:1,STRONG:1,I:1,EM:1,SUMMARY:1,FIGCAPTION:1};
  const norm=s=>s.replace(/\s+/g,' ').trim();
  const LET=/[A-Za-zÄÖÜäöüß]{2}/;
  window.__LEAF={};window.__UNREACH={};window.__MISS={};window.__OK=0;const NUMRE=/\d{1,3}(?:[ \u00a0\u202f]\d{3})+(?:,\d+)?|\d+(?:[.,]\d+)*/g;window.__chk=(el,node,key)=>{const tpl=key.replace(NUMRE,'§');const inDict=window.__DICT[key]||window.__DICT[tpl];const nz=t=>t.replace(/\s+/g,' ').trim();let w=node?node.parentElement:el;let ok=false;for(let i=0;i<4&&w;i++){if(w.hasAttribute('data-trd')&&[...w.children].some(c=>c.className==='trl')){ok=true;break;}const pe=w.parentElement;if(!node&&pe&&pe.hasAttribute('data-trd')&&[...pe.children].some(c=>c.className==='trl')){ok=true;break;}else break;}if(ok)window.__OK++;else{const k=(inDict?'[IN DICT] ':'[NICHT IM DICT] ')+key.slice(0,140);window.__MISS[k]=(window.__MISS[k]||0)+1;if(window.__MISS[k]===1){(window.__SAMPLE=window.__SAMPLE||{})[k]=(el.parentElement||el).outerHTML.slice(0,260);}}};const SENT='Tisch 3';
  function visit(el,nested){
   if(el.nodeType!==1||SKIP[el.tagName]||SKIP[el.nodeName])return;
   if(el.id==='trbtn'||el.id==='trpanel'||el.className==='trl'||el.hasAttribute('data-trl')||el.hasAttribute('data-notr'))return;
   const key=norm(el.textContent||'');
   const direct=[...el.childNodes].some(n=>n.nodeType===3&&LET.test(n.nodeValue));
   let cn=nested;
   if(el.placeholder&&!nested&&LET.test(el.placeholder))window.__LEAF[norm(el.placeholder)]=1;
   // ganzer Block (Satz beginnt mit Text, kein <br>) oder Zerlegung (Label-Element zuerst: <b>Richtig.</b> Rest …)
   const whole=()=>{ if(!el.children.length)return true; if(el.querySelector(':scope > br'))return false;
     for(const c of el.children){ if(c.getClientRects().length&&!/^(inline|inline-block|contents)$/.test(getComputedStyle(c).display))return false; }
     const f=[...el.childNodes].find(n=>(n.nodeType===3&&n.nodeValue.trim())||n.nodeType===1); return !!f&&f.nodeType===3&&LET.test(f.nodeValue); };
   if(direct&&!nested){
    if(key.length>=2&&key.length<=800&&BLOCKY[el.tagName]&&whole()&&!key.includes(SENT)){ window.__chk(el,null,key); cn=true; }
    else{
     const hasEl=el.children.length>0;
     for(const n of el.childNodes){ if(n.nodeType!==3)continue; const t=norm(n.nodeValue); if(t.length<3||!LET.test(t))continue;
       if(hasEl)window.__chk(el,n,t); else window.__UNREACH[key.slice(0,80)+'|'+el.tagName]=1; }
    }
   }
   for(const c of el.children)visit(c,cn);
  }
  window.__cls=()=>{visit(document.body,false);};
  window.__grab=()=>{window.LF1_TR.walkAll();window.__cls();};
  const sleep=ms=>new Promise(r=>setTimeout(r,ms));
  const vis=b=>b.getClientRects().length>0&&!b.closest('[hidden]');
  const A=()=>[...document.querySelectorAll('#app [data-act]')].filter(b=>b.dataset.act&&!b.disabled&&vis(b));
  const rnd=a=>a[Math.floor(Math.random()*a.length)];
  function setInput(id,v){const i=document.getElementById(id);if(i){i.value=v;i.dispatchEvent(new Event('input',{bubbles:true}));}}
  window.__origEnding=ending;
  window.__play=async(cfg)=>{
   S=fresh();ui={};S.phase='intro';render();window.__grab();
   // Weiterspielen-Pfad einmal anzeigen, falls Spielstand da ist
   document.querySelector('[data-act="new"]').click();window.__grab();
   setInput('inTeam','Tisch 3');window.__grab();
   for(const k of ['branch','mode','block']){const b=document.querySelector(`[data-act="${k}"][data-v="${cfg[k]}"]`);if(b)b.click();}
   window.__grab();
   document.querySelector('[data-act="toDraw"]').click();window.__grab();
   document.querySelector('[data-act="draw"]').click();window.__grab();
   if(cfg.redraw){document.querySelector('[data-act="startGame"]');}
   if(cfg.ending){ const E=ENDINGS.find(e=>e.id===cfg.ending); window.ending=function(){return E;}; } else if(window.__origEnding){ window.ending=window.__origEnding; }
   let n=0,chap=0,wordsDone=false;
   while(n++<900){
    if(S.phase==='result'){
     document.querySelectorAll('details').forEach(d=>d.open=true);window.__grab();
     break;
    }
    const acts=A();const by=a=>acts.filter(b=>b.dataset.act===a);
    const click=b=>{b.click();};
    let did=false;
    const doit=b=>{click(b);did=true;window.__grab();};
    // Rechenaufgabe
    if(by('rechCheck').length){ const ans=ui.rech&&ui.rech.ans; setInput('inRech', Math.random()<0.5&&ans!=null?String(ans).replace('.',','):'1'); doit(by('rechCheck')[0]); continue; }
    // Locks
    let lk=['lock','proLock','krLock','cpLock','bossLock','rLock','satzCheck','checkOrder','checkSec'].find(a=>by(a).length);
    if(lk){ doit(by(lk)[0]); continue; }
    // Auswahl
    if(by('pick').length){ const want=cfg.run%2===0?(cfg.run/2+chap)%3:Math.floor(Math.random()*3); const b=by('pick').find(x=>+x.dataset.i===want)||by('pick')[0]; chap++; doit(b); continue; }
    const pickers=['proPick','krPick','cpPick','bossPick','rPick'];
    const pk=pickers.find(a=>by(a).length);
    if(pk){ doit(rnd(by(pk))); continue; }
    if(by('satz').length){ const ks=['r','f']; for(const k of ks){ const grp=by('satz').filter(b=>b.dataset.k===k); if(grp.length&&!grp.some(b=>b.getAttribute('aria-pressed')==='true')){ doit(rnd(grp)); did=true; break; } } if(did)continue; }
    if(cfg.timeoutMini&&!cfg._t1&&(by('mAns').length||by('slot').length)&&ui.left){ cfg._t1=1; ui.left=1; await sleep(1300); window.__grab(); continue; }
    if(cfg.timeoutBoss&&!cfg._t2&&by('bossPick').length&&ui.left){ cfg._t2=1; ui.left=1; await sleep(1300); window.__grab(); continue; }
    if(by('mAns').length){ doit(rnd(by('mAns'))); continue; }
    if(by('slot').length){ doit(rnd(by('slot'))); continue; }
    if(by('sec').length){ const js=[...new Set(by('sec').map(b=>b.dataset.j))]; let c=false; for(const j of js){ const grp=by('sec').filter(b=>b.dataset.j===j); if(!grp.some(b=>b.getAttribute('aria-pressed')==='true')){ doit(rnd(grp)); c=true; break; } } if(c)continue; }
    if(by('buyEx').length&&Math.random()<0.7){ doit(rnd(by('buyEx'))); continue; }
    if((by('goDecide').length||by('goMini').length)&&!wordsDone&&Math.random()<0.25){
      wordsDone=true; document.getElementById('btnWords').click();window.__grab(); const c=document.querySelector('#drawer [data-close]'); if(c)c.click();
      document.querySelectorAll('details').forEach(d=>d.open=true);window.__grab(); continue; }
    if(by('mNext').length&&Math.random()<0.9){ doit(by('mNext')[0]); continue; }
    const adv=['goDecide','goMini','afterDecide','afterMini','afterPro','nextCh','mNext','interNext','bossNext','bossDone','evRun','evNext','rNext','retryDone','count','toResult','startGame'];
    const ad=adv.find(a=>by(a).length);
    if(ad){
      // Pro-Profi-Details und Tipps aufklappen, damit ihr Text erfasst wird
      document.querySelectorAll('#app details').forEach(d=>d.open=true);window.__grab();
      doit(by(ad)[0]);
      if(ad==='count') await sleep(120);
      continue; }
    // Wenn nichts klickbar: Mini-Spiel mit Zeit? Abbruch
    await sleep(50);
    if(!A().length)break;
   }
   window.__grab();
   return {n,phase:S.phase};
  };
 });
 const cfgs=[];
 const brs=['mode','lm','el'],mds=['anf','pro'],bls=['AB','A','B'];
 for(let r=0;r<RUNS;r++){cfgs.push({run:r,branch:brs[r%3],mode:mds[Math.floor(r/3)%2],block:bls[Math.floor(r/6)%3===0?0:(Math.floor(r/6)%3)]});}
 let prev=0;
 for(const c of cfgs){
  const res=await p.evaluate(c=>window.__play(c),c);
  console.log('run',c.run,c.branch,c.mode,c.block,JSON.stringify(res));
 }
  // Sonderfälle: Schlussbilder, Zeit abgelaufen (Minispiel/Boss), Musik-Hinweis
 const sp=[];
 for(const e of ['award','gerettet','partner','nachbar','opa','kroll'])sp.push({run:100+sp.length,branch:brs[sp.length%3],mode:'anf',block:'B',ending:e});
 sp.push({run:110,branch:'lm',mode:'pro',block:'A',timeoutMini:1});
 sp.push({run:111,branch:'el',mode:'pro',block:'B',timeoutBoss:1,timeoutMini:1});
 for(const c of sp){const res=await p.evaluate(c=>window.__play(c),c);console.log('special',c.run,c.ending||'',JSON.stringify(res));}
 await p.evaluate(()=>{window.ending=window.__origEnding;});
 try{await p.evaluate(()=>{document.getElementById('btnMusic').click();window.__grab();});}catch(e){}
}
;
(async()=>{
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:420,height:900}});
 const errs=[];p.on('pageerror',e=>errs.push(String(e)));p.on('console',m=>{if(m.type()==='error')errs.push(m.text())});
 await p.goto('file://'+path.resolve(app)+'?lang='+lang);await p.waitForTimeout(500);
 const dict=JSON.parse(fs.readFileSync(path.join(__dirname,'kaje7','woerterbuch.json'),'utf8'));
 await p.evaluate(d=>{window.__DICT=d;},dict);
 await scenFactory(p,runs?+runs:6);
 const out=await p.evaluate(()=>({ok:window.__OK,miss:window.__MISS,sample:window.__SAMPLE||{}}));
 console.log('uebersetzt',out.ok,'fehlend',Object.keys(out.miss).length,'JS-Fehler',errs.length,errs.slice(0,3));
 const ks=Object.entries(out.miss).sort((a,b)=>b[1]-a[1]);
 fs.writeFileSync(path.join(__dirname,'kaje7','verify_'+lang+'.txt'),ks.map(([k,v])=>v+'x '+k+'\n      '+(out.sample[k]||'')).join('\n'));
 for(const [k,v] of ks.slice(0,40))console.log(v+'x',k);
 await p.screenshot({path:process.env.SHOT||'/tmp/verify_'+lang+'.png'});
 await b.close();
})();
