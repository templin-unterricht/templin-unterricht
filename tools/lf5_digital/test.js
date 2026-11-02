// Test: node test.js <n> ; benötigt playwright (global)
const {chromium}=require('playwright');const path=require('path');
const n=process.argv[2];const file='file://'+path.resolve(__dirname,'../../materials/digital/LF5_M_'+n+'.html');
const D=require('./sheets/M'+n+'.js');
(async()=>{
 const issues=[];
 // statische Prüfung: Übersetzungen vorhanden
 const need=(o,w)=>{if(o==null)return;if(typeof o==='string'){issues.push('Keine Übersetzung: '+w+' => '+o.slice(0,50));return}if(!o.vi)issues.push('vi fehlt: '+w)};
 D.can.forEach((c,i)=>need(c,'can'+i));
 D.items.forEach(it=>{need(it.instr,it.id+'.instr');if(it.tip!=null)need(it.tip,it.id+'.tip');else if(it.type!=='info'&&it.type!=='read')issues.push('Tipp fehlt '+it.id);
  if(it.type==='info'&&!it.vi)issues.push('info ohne vi '+it.id);if(it.type==='read'&&!it.vi)issues.push('read ohne vi '+it.id);
  if(it.type==='read'&&it.quiz)need(it.quiz.why,it.id+'.why');if(it.type==='tf')it.st.forEach((s,i)=>{if(!s.a&&s.a!==false)issues.push('tf');});
  if(it.type==='calc')it.parts.forEach((p,i)=>{if(!p.steps)issues.push('Rechenweg fehlt '+it.id+'.'+i);});
  if(it.type!=='info'&&!it.title)issues.push('title '+it.id);
  if(it.level==='v'&&!/^Vertiefung/.test(it.no))issues.push('no '+it.id);
 });
 const b=await chromium.launch();
 for(const w of [820,390]){
  const ctx=await b.newContext({viewport:{width:w,height:1100},hasTouch:true});const p=await ctx.newPage();
  const errs=[];p.on('pageerror',e=>errs.push('pageerror '+e.message));p.on('console',m=>{if(m.type()==='error')errs.push('console '+m.text())});
  await p.goto(file);
  const total=await p.evaluate(()=>LF5.data.items.length);
  // richtig
  await p.evaluate(()=>LF5.solve(true));
  const r1=await p.$eval('#result .score',e=>e.textContent);
  const stR=await p.$$eval('#result .st.r',e=>e.length);
  // falsch
  await p.evaluate(()=>{LF5.S().ans={};LF5.S().shown={};LF5.S().checked={};});
  await p.evaluate(()=>LF5.solve(false));
  const r0=await p.$eval('#result .score',e=>e.textContent);
  // vi + vertiefung
  await p.click('[data-lg="vi"]');await p.click('[data-lv="v"]');
  const hasV=await p.$$eval('.card.vert',e=>e.length);
  const viTxt=await p.$eval('#b_eval',e=>e.textContent);
  // Reload -> Zwischenstand
  await p.waitForTimeout(600);await p.reload();
  const lang=await p.evaluate(()=>LF5.S().lang+'/'+LF5.S().level+'/'+Object.keys(LF5.S().ans).length);
  const overflow=await p.evaluate(()=>document.documentElement.scrollWidth>window.innerWidth+2);
  if(w===820){await p.screenshot({path:'/tmp/shot_M'+n+'_vi.png',fullPage:false})}
  // Druck
  await p.emulateMedia({media:'print'});const pv=await p.$eval('#result',e=>e.offsetHeight>0);await p.emulateMedia({media:'screen'});
  console.log(`w${w}: items=${total} richtig=${r1} falsch=${r0} rote-bei-richtig=${stR} vertCards=${hasV} viBtn="${viTxt}" nachReload=${lang} hOverflow=${overflow} printResult=${pv}`);
  if(errs.length)issues.push(...errs.map(e=>w+': '+e));
  await ctx.close();
 }
 await b.close();
 console.log(issues.length?'PROBLEME:\n'+issues.join('\n'):'keine Probleme');
})();
