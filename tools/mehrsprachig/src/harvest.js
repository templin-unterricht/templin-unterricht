// node harvest.js <app.html> <szenario> <out.json> : öffnet die App mit leerem Wörterbuch (Debug) und sammelt alle angezeigten Texte
const {chromium}=require('playwright');const fs=require('fs'),path=require('path');
const [,,app,scen,out,dictf]=process.argv;
(async()=>{
 const eng=fs.readFileSync(path.join(__dirname,'..','engine.js'),'utf8');
 let html=fs.readFileSync(app,'utf8').replace(/<link[^>]+fonts\.(googleapis|gstatic)\.com[^>]*>\s*/g,'');
 const i=html.lastIndexOf('</body>');
 html=html.slice(0,i)+'<script>window.UB_CONFIG={mode:true,debug:true};window.UB_I18N='+(dictf?JSON.stringify(Object.fromEntries((j=>Array.isArray(j)?j:Object.keys(j))(JSON.parse(fs.readFileSync(dictf,'utf8'))).map(k=>[k,{tr:'x',vi:'x',ar:'x'}]))):'{}')+';try{localStorage.setItem("ub_lang","tr")}catch(e){}</script><script>'+eng.replace(/<\/script/g,'<\\/script')+'</script>'+html.slice(i);
 const tmp=path.join(path.dirname(app),'__harvest_tmp.html');fs.writeFileSync(tmp,html);
 const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:900}});
 const errs=[];p.on('pageerror',e=>errs.push(String(e)));
 await p.goto('file://'+tmp);
 const S=require('./scen_'+scen+'.js');
 const miss=new Set();
 const grab=async()=>{(await p.evaluate(()=>window.UB.missing())).forEach(x=>miss.add(x));};
 await S(p,grab);
 await grab();
 fs.writeFileSync(out,JSON.stringify([...miss],null,0));
 console.log('harvested',miss.size,'errors',errs.slice(0,3));
 await b.close();fs.unlinkSync(tmp);
})();
