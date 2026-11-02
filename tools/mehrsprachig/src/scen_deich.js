module.exports=async(p,grab)=>{
 await p.waitForTimeout(300);await grab();
 const PROG=new Set(['go','tochap','lock','next','mnext','minidone','tnext','pnext','evnext','signchk','calc','beschk','tchk','bdone']);
 for(const mode of ['anf','pro','pro','anf','pro']){
  await p.evaluate(m=>{pre.mode=m;pre.route='all';render();},mode);
  await p.click('[data-act="start"]');
  let steps=0,last='';
  while(steps++<420){
   await grab();
   const acts=await p.evaluate(()=>[...document.querySelectorAll('[data-act]')].filter(b=>b.offsetParent&&!b.disabled).map((b,i)=>({i,a:b.dataset.act,v:b.dataset.v||'',g:b.dataset.g||''})));
   if(!acts.length) break;
   if(acts.some(a=>a.a==='again')){ await grab(); break; }
   const prog=acts.filter(a=>PROG.has(a.a));
   let pick;
   if(prog.length&&Math.random()<0.7) pick=prog[Math.floor(Math.random()*prog.length)];
   else { const ot=acts.filter(a=>!['reset','menu','music','again','daycode'].includes(a.a)); pick=(ot.length?ot:acts)[Math.floor(Math.random()*(ot.length||acts.length))]; }
   await p.evaluate(({i})=>{const b=[...document.querySelectorAll('[data-act]')].filter(b=>b.offsetParent&&!b.disabled)[i];
     ['in1','in2'].forEach(id=>{const e=document.getElementById(id);if(e)e.value=String(Math.round(Math.random()*5000)/100).replace('.',',')});
     b.click();},pick);
   await p.waitForTimeout(8);
  }
  await grab();
  // Endbildschirm
  
  await p.evaluate(()=>{S=null;ui={};render();});
 }
};
