module.exports=async(p,grab)=>{
 const w=()=>p.waitForTimeout(120);
 await p.evaluate(()=>{localStorage.clear()});
 await p.reload();await w();await grab();
 // Stationen anzeigen, Tipps, alle Antworten, Profi-Akte
 await p.evaluate(()=>{S.team="Tisch 3";S.start=Date.now();S.penalty=0;S.solved=[];S.hints={};S.current=0;view="game";render();});await w();await grab();
 const N=await p.evaluate(()=>STATIONS.length);for(let i=0;i<N;i++){
  await p.evaluate(i=>{S.current=i;S.solved=STATIONS.slice(0,i).map(s=>s.id);view="game";render();},i);await w();await grab();
  for(const act of ['hint','hint']){await p.evaluate(a=>{const b=document.querySelector('[data-act="'+a+'"]');if(b)b.click()},act);await w();await grab();}
  // alle Optionen einmal auswählen (falsch), prüfen
  await p.evaluate(()=>{document.querySelectorAll('[data-act="pick"]').forEach(b=>b.click())});await w();await grab();
  await p.evaluate(()=>{const b=document.getElementById('checkbtn');if(b&&!b.disabled)b.click()});await w();await grab();
  // richtig lösen
  await p.evaluate(i=>{const st=STATIONS[i];S.answers=S.answers||{};},i);
  await p.evaluate(()=>{document.querySelectorAll('details.profi').forEach(d=>d.open=true);const t=document.querySelector('[data-act="profitext"]');if(t){t.value='x';t.dispatchEvent(new Event('input',{bubbles:true}));const m=document.querySelector('[data-act="muster"]');if(m&&!m.disabled)m.click();}});await w();await grab();
 }
 await p.evaluate(()=>{S.solved=STATIONS.map(s=>s.id);view="game";S.current=STATIONS.length-1;render();});await w();await grab();
 await p.evaluate(()=>{view="vault";render();});await w();await grab();
 await p.evaluate(()=>{const i=document.getElementById('vaultin');if(i){i.value='XXXXXXX';document.querySelector('[data-act="vaultcheck"]').click()}});await w();await grab();
 await p.evaluate(()=>{S.end=Date.now();view="result";render();});await w();await grab();
 for(const v of ['quizsetup','pin','teacher','cards','remote']){await p.evaluate(v=>{try{view=v;render();}catch(e){}},v);await w();await grab();}
};
