// node harvest.js <app.html> <szenario.js> <out.json>
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const [,,app,scen,out]=process.argv;
(async()=>{
 const layer=fs.readFileSync(path.join(__dirname,'layer.js'),'utf8').replace('__TRD__','{}').replace(/__KEY__/g,'harv');
 let html=fs.readFileSync(app,'utf8').replace(/<link[^>]+fonts\.(googleapis|gstatic)\.com[^>]*>\s*/g,'');
 const i=html.lastIndexOf('</body>');
 html=(i>0?html.slice(0,i):html)+'<script>window.__TR_HARVEST={};</script><script>'+layer.replace(/<\/script/g,'<\\/script')+'</script>'+(i>0?html.slice(i):'');
 const tmp=path.join(path.dirname(app),'__harvest_tmp.html');fs.writeFileSync(tmp,html);
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:900}});
 const errs=[];p.on('pageerror',e=>errs.push(String(e)));
 await p.goto('file://'+path.resolve(tmp));await p.waitForTimeout(300);
 const grab=async()=>{await p.evaluate(()=>window.LF1_TR.walkAll());};
 await require(path.resolve(scen))(p,grab);
 await grab();
 const keys=await p.evaluate(()=>Object.keys(window.__TR_HARVEST));
 fs.writeFileSync(out,JSON.stringify(keys,null,0));
 console.log('harvested',keys.length,'errors',errs.slice(0,3));
 await b.close();fs.unlinkSync(tmp);
})();
