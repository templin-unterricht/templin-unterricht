// node qa_missing.js <gebaute-datei> <szenario> : spielt die App mit ?lang=tr durch und listet Texte ohne Übersetzung
const {chromium}=require('playwright');
(async()=>{const [,,f,scen]=process.argv;const b=await chromium.launch();const p=await b.newPage({viewport:{width:1100,height:900}});
 const errs=[];p.on('pageerror',e=>errs.push(String(e)));
 await p.goto('file://'+f+'?lang=tr&ubdebug=1');
 const miss=new Set();const grab=async()=>{(await p.evaluate(()=>window.UB.missing())).forEach(x=>miss.add(x));};
 await require('./scen_'+scen+'.js')(p,grab);await grab();
 console.log('JS-Fehler:',errs.length,errs.slice(0,2));
 [...miss].filter(x=>!/^[\d\s.,:€%×÷=+−-]+$/.test(x)).forEach(x=>console.log(' ?',x.slice(0,140)));await b.close();})();
