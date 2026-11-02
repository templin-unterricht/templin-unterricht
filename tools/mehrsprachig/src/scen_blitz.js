module.exports=async(p,grab)=>{
 await p.waitForTimeout(300);await grab();
 for(const lvl of ['basis','profi','basis','profi','profi','basis','profi','basis','profi','profi']){
  await p.evaluate(l=>{document.getElementById('tTimer').checked=false;document.getElementById(l==='basis'?'lvlBasis':'lvlProfi').checked=true;
    ['tChange','tSum','tDiscount','tCoins'].forEach(i=>document.getElementById(i).checked=true);
    document.getElementById('tChange').dispatchEvent(new Event('change',{bubbles:true}))},lvl);
  await grab();
  await p.click('#btnStart');
  for(let k=0;k<10;k++){
   await p.waitForTimeout(40);await grab();
   const mc=await p.evaluate(()=>!document.getElementById('opts').hidden&&document.querySelectorAll('#opts button').length>0);
   const coins=await p.evaluate(()=>!document.getElementById('coins').hidden);
   if(mc){ // abwechselnd richtig/falsch
     await p.click('#opts button:nth-child('+(1+(k%3))+')');
   } else if(coins){
     await p.click('#coinGive').catch(()=>{});
     await p.click('#tray button:nth-child(1)');await p.click('#coinGive');
   } else {
     const keys=k%2?['1','2','ok']:['7',',','5','ok'];
     for(const kk of keys) await p.click('#pad button[data-k="'+kk+'"]');
   }
   await p.waitForTimeout(40);await grab();
   const nb=await p.$('#btnNext');if(nb){await nb.click();}
  }
  await p.waitForTimeout(100);await grab();
  const ag=await p.$('#btnHome');if(ag) await ag.click();
 }
};
