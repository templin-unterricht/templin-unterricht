const {chromium}=require('playwright');const path=require('path');
const f=n=>'file://'+path.resolve(__dirname,'../../materials/digital/LF5_M_'+n+'.html');
(async()=>{const b=await chromium.launch();
 // 1) echte Bedienung M5
 let ctx=await b.newContext({viewport:{width:820,height:1100},hasTouch:true,acceptDownloads:true});let p=await ctx.newPage();const errs=[];p.on('pageerror',e=>errs.push(e.message));p.on('console',m=>m.type()==='error'&&errs.push(m.text()));
 await p.goto(f(5));
 await p.fill('#nm','Test Schüler');
 // Lesen 1: Wörter tippen
 const card=await p.$('#c_r1');await (await card.$('.w[data-w="3"]')).tap(); // "Maßnahmen"? index prüfen
 await (await card.$('[data-act="rdchk"]')).tap();
 console.log('read fb:',await p.$eval('#c_r1 .fb',e=>e.textContent));
 await (await p.$('#c_r1 .opt')).click();
 await p.waitForTimeout(100);console.log('quiz fb:',await p.$eval('#c_r1 .fb',e=>e.textContent));
 // Tipp öffnen
 await p.click('#c_a3 .tip summary');console.log('tip offen:',await p.$eval('#c_a3 .tip',e=>e.open));
 // Rechnen: falsch/richtig mit Komma
 const inp=await p.$$('#c_a3 input[data-k]');await inp[0].fill('30');await inp[1].fill('299');await inp[2].fill('3.560,00');await inp[3].fill('7505');await inp[4].fill('3945');await inp[5].fill('263');
 await p.click('#c_a3 [data-act="check"]');console.log('calc fb:',await p.$eval('#c_a3 .fb',e=>e.textContent.replace(/\s+/g,' ')),'| rot:',await p.$$eval('#c_a3 .bad',e=>e.length),'grün:',await p.$$eval('#c_a3 .ok',e=>e.length));
 // Freitext: Wortgeländer-Chip einfügen, Musterlösung, Selbstbewertung
 await p.click('#c_a1 .wg summary').catch(()=>{});
 const ta=await p.$('#c_a1 textarea');await ta.fill('Hallo');await p.click('#c_a1 textarea');
 await p.click('#c_a1 [data-act="model"]');await p.click('#c_a1 [data-rate="y"]');
 // Match: select
 await p.selectOption('#c_m1 select >> nth=0','Nicht wirtschaftliche Kontrolle');
 // Sprachumschalter mitten drin
 await p.click('[data-lg="vi"]');
 console.log('nach VI: textarea behalten=',await p.$eval('#c_a1 textarea',e=>e.value),'calc behalten=',await p.$eval('#c_a3 input[data-k="p2"]',e=>e.value),'select=',await p.$eval('#c_m1 select',e=>e.value));
 // Schrift 150%: nur CSS-Variable (A-/A+ gibt es im Zahnradmenü nicht) -> Layout prüfen
 await p.evaluate(()=>document.documentElement.style.setProperty('--fs','1.5'));console.log('overflow bei 150%:',await p.evaluate(()=>document.documentElement.scrollWidth>innerWidth+2));
 await p.evaluate(()=>document.documentElement.style.setProperty('--fs','1'));
 // Auswerten
 await p.click('#b_eval');await p.waitForTimeout(400);
 console.log('Ergebnis:',await p.$eval('#result .score',e=>e.textContent),'| Rechenweg sichtbar:',await p.$$eval('#result .steps',e=>e.length));
 await p.screenshot({path:'/tmp/res5.png',fullPage:false});
 // Neu starten Dialog
 await p.click('#b_restart');console.log('modal:',await p.$eval('#modal',e=>e.classList.contains('on')));await p.click('#m_no');
 console.log('Fehler:',errs);
 await ctx.close();
 // 2) localStorage blockiert
 ctx=await b.newContext({viewport:{width:820,height:1000}});p=await ctx.newPage();const e2=[];p.on('pageerror',e=>e2.push(e.message));
 await p.addInitScript(()=>{Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked')}})});
 await p.goto(f(2));await p.fill('#nm','X');await p.click('[data-lg="vi"]');await p.click('#b_eval');
 console.log('ohne localStorage ok, Fehler:',e2,'Score:',await p.$eval('#result .score',e=>e.textContent));
 await ctx.close();
 // 3) Persistenz
 ctx=await b.newContext({viewport:{width:820,height:1000}});p=await ctx.newPage();await p.goto(f(3));
 await p.selectOption('#c_m1 select >> nth=0',{index:1});await p.fill('#nm','Anna');await p.waitForTimeout(700);await p.reload();
 console.log('Persistenz:',await p.$eval('#nm',e=>e.value),await p.$eval('#c_m1 select',e=>e.selectedIndex));
 await p.click('#b_restart');await p.click('#m_yes');console.log('nach Neustart:',await p.$eval('#nm',e=>e.value||'(leer)'));
 // Druck-Ansicht
 await p.click('#b_eval');await p.emulateMedia({media:'print'});
 console.log('Print: Karten sichtbar?',await p.$$eval('.card',e=>e.some(x=>x.offsetHeight>0)),'Topbar?',await p.$eval('.top',e=>e.offsetHeight>0),'Result?',await p.$eval('#result',e=>e.offsetHeight>0));
 await ctx.close();await b.close();})();
