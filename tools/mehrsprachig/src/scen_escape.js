module.exports=async(p,grab)=>{
 await p.waitForTimeout(300);await grab();
 for(let i=0;i<6;i++){
  await p.evaluate(i=>zeige(i),i);await p.waitForTimeout(150);await grab();
  await p.evaluate(i=>tipp(i),i);await p.waitForTimeout(150);
  await p.evaluate(i=>pruefe(i),i);await p.waitForTimeout(150);await grab();
 }
 await p.evaluate(()=>{document.getElementById('code').value='000000';oeffnen()});await p.waitForTimeout(150);await grab();
 await p.evaluate(()=>{document.getElementById('code').value='371945';oeffnen()});await p.waitForTimeout(250);await grab();
};
