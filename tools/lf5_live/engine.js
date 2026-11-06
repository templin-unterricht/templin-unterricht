"use strict";
/* ===== LF5 Live-Einstieg: Engine (Tafel + Handy, 8 Sprachen) =====
   CFG kommt aus dem Modul. Alle Texte sind Arrays [de,es,pt,vi,ti,ar,tr,ru].
   Antworten gehen nur als Zahlen/Indizes über das Netz (Ausnahme: Wortwolke und Zettelwand, freier Text). */
const LANGS=["de","es","pt","vi","ti","ar","tr","ru"];
const LNAME={de:"Deutsch",es:"Español",pt:"Português",vi:"Tiếng Việt",ti:"ትግርኛ",ar:"العربية",tr:"Türkçe",ru:"Русский"};
const LSUB={de:"",es:"Spanisch",pt:"Portugiesisch",vi:"Vietnamesisch",ti:"Tigrinya",ar:"Arabisch",tr:"Türkisch",ru:"Russisch"};
const UI={
 pick:["Sprache wählen","Elige tu idioma","Escolha o idioma","Chọn ngôn ngữ","ቋንቋ ምረጽ","اختر لغتك","Dilini seç","Выбери язык"],
 nick:["Wie heißt du?","¿Cómo te llamas?","Como você se chama?","Bạn tên là gì?","ስምካ መን እዩ?","ما اسمك؟","Adın ne?","Как тебя зовут?"],
 nickph:["Dein Spitzname","Tu apodo","Seu apelido","Biệt danh của bạn","ሽም ዕላዊ","اسمك المستعار","Takma adın","Твой ник"],
 join:["Mitspielen","¡Jugar!","Jogar","Tham gia","ተሳተፍ","شارك","Katıl","Играть"],
 wait:["Gleich geht's los. Schau auf die Tafel!","¡Enseguida empezamos! Mira la pizarra.","Já vamos começar! Olhe para o quadro.","Sắp bắt đầu! Hãy nhìn lên bảng.","ኣብዛ ቅጽበት ይጅምር! ናብ ሰሌዳ ርአ።","نبدأ بعد قليل! انظر إلى السبورة.","Birazdan başlıyoruz! Tahtaya bak.","Сейчас начнём! Смотри на доску."],
 sent:["Gesendet! Warte auf die Tafel.","¡Enviado! Espera a la pizarra.","Enviado! Aguarde o quadro.","Đã gửi! Chờ bảng nhé.","ተላኢኹ! ንሰሌዳ ተጸበ።","تم الإرسال! انتظر السبورة.","Gönderildi! Tahtayı bekle.","Отправлено! Жди доску."],
 send:["Senden","Enviar","Enviar","Gửi","ስደድ","إرسال","Gönder","Отправить"],
 reset:["Neu anfangen","Empezar de nuevo","Recomeçar","Làm lại","ዳግማይ ጀምር","ابدأ من جديد","Yeniden başla","Заново"],
 de:["Deutsch zeigen","Mostrar alemán","Mostrar alemão","Hiện tiếng Đức","ጀርመንኛ ኣርእይ","أظهر الألمانية","Almanca göster","Показать немецкий"],
 right:["Richtig!","¡Correcto!","Correto!","Đúng rồi!","ቅኑዕ!","صحيح!","Doğru!","Верно!"],
 wrong:["Nicht ganz.","No del todo.","Não exatamente.","Chưa đúng.","ብምሉኡ ኣይኰነን።","ليس تمامًا.","Pek değil.","Не совсем."],
 part:["Teilweise richtig.","Parcialmente correcto.","Parcialmente correto.","Đúng một phần.","ኣቐዲሙ ቅኑዕ።","صحيح جزئيًا.","Kısmen doğru.","Частично верно."],
 closest:["Fast getroffen!","¡Casi!","Quase!","Gần đúng rồi!","ቀረባ!","قريب جدًا!","Neredeyse!","Почти!"],
 correctis:["Richtig ist:","Lo correcto es:","O certo é:","Đáp án đúng là:","ቅኑዕ እዚ እዩ:","الصحيح هو:","Doğrusu:","Правильно:"],
 pts:["Punkte","puntos","pontos","điểm","ነጥቢ","نقاط","puan","очков"],
 total:["Gesamt","Total","Total","Tổng","ድምር","المجموع","Toplam","Всего"],
 cloudhint:["Schreibe bis zu 3 Wörter.","Escribe hasta 3 palabras.","Escreva até 3 palavras.","Viết tối đa 3 từ.","ክሳብ 3 ቃላት ጽሓፍ።","اكتب حتى 3 كلمات.","En fazla 3 kelime yaz.","Напиши до 3 слов."],
 word:["Dein Wort","Tu palabra","Sua palavra","Từ của bạn","ቃልካ","كلمتك","Kelimen","Твоё слово"],
 wallhint:["Schreibe einen kurzen Satz.","Escribe una frase corta.","Escreva uma frase curta.","Viết một câu ngắn.","ሓጺር ሓረግ ጽሓፍ።","اكتب جملة قصيرة.","Kısa bir cümle yaz.","Напиши короткую фразу."],
 ord:["Tippe in der richtigen Reihenfolge: 1, 2, 3 …","Toca en el orden correcto: 1, 2, 3 …","Toque na ordem certa: 1, 2, 3 …","Chạm theo đúng thứ tự: 1, 2, 3 …","ብትኽክል ተኸታታሊ ጥዕን: 1, 2, 3 …","المس بالترتيب الصحيح: 1، 2، 3 …","Doğru sırayla dokun: 1, 2, 3 …","Нажимай по порядку: 1, 2, 3 …"],
 match:["Ordne jede Karte zu.","Asigna cada tarjeta.","Associe cada cartão.","Ghép từng thẻ.","ነናይ ካርድ ኣዳሉ።","اربط كل بطاقة.","Her kartı eşleştir.","Распредели каждую карточку."],
 multi:["Mehrere Antworten sind möglich.","Hay varias respuestas posibles.","Há várias respostas possíveis.","Có thể chọn nhiều đáp án.","ብዙሕ መልሲ ይከኣል።","يمكن اختيار عدة إجابات.","Birden çok cevap olabilir.","Возможно несколько ответов."],
 guess:["Dein Tipp:","Tu estimación:","Seu palpite:","Dự đoán của bạn:","ግምትካ:","تقديرك:","Tahminin:","Твоя оценка:"],
 yes:["Stimmt","Verdadero","Verdadeiro","Đúng","ቅኑዕ","صحيح","Doğru","Верно"],
 no:["Stimmt nicht","Falso","Falso","Sai","ጌጋ","خطأ","Yanlış","Неверно"],
 final:["Geschafft! Danke fürs Mitspielen.","¡Lo lograste! Gracias por jugar.","Conseguiu! Obrigado por jogar.","Xong rồi! Cảm ơn bạn đã chơi.","ተወዲኡ! ስለ ተሳትፎኻ የቐንየልና።","أحسنت! شكرًا على المشاركة.","Başardın! Oynadığın için teşekkürler.","Готово! Спасибо за игру."],
 place:["Dein Platz","Tu puesto","Seu lugar","Hạng của bạn","ቦታኻ","ترتيبك","Sıran","Твоё место"],
 merk:["Merke dir","Recuerda","Lembre-se","Hãy nhớ","ኣስተውዕል","تذكّر","Aklında tut","Запомни"],
 conn:["Verbindung wird hergestellt …","Conectando …","Conectando …","Đang kết nối …","ይራኸብ ኣሎ …","جارٍ الاتصال …","Bağlanıyor …","Подключение …"],
 round:["Runde","Ronda","Rodada","Vòng","ዙር","الجولة","Tur","Раунд"],
 tapnum:["Tippe noch einmal auf eine Karte, um sie zu entfernen.","Toca otra vez una tarjeta para quitarla.","Toque de novo num cartão para removê-lo.","Chạm lại vào thẻ để bỏ chọn.","ንምእላይ ካርድ ዳግም ጥዕን።","المس البطاقة مرة أخرى لإزالتها.","Kaldırmak için kartaya tekrar dokun.","Нажми на карточку ещё раз, чтобы убрать."]
};
/* ---------- Hilfen ---------- */
const $=(id)=>document.getElementById(id);
function h(tag,attrs,...kids){const e=document.createElement(tag);if(attrs)for(const k in attrs){const v=attrs[k];if(k==="class")e.className=v;else if(k==="html")e.innerHTML=v;else if(k.startsWith("on"))e.addEventListener(k.slice(2),v);else if(v!==false&&v!=null)e.setAttribute(k,v===true?"":v);}
  for(const c of kids.flat()){if(c==null||c===false)continue;e.append(c.nodeType?c:document.createTextNode(String(c)));}return e;}
function store(k,v){try{if(v===undefined)return JSON.parse(localStorage.getItem(k));localStorage.setItem(k,JSON.stringify(v));}catch(e){return null;}}
function clean(s,max){return String(s==null?"":s).replace(/[\u0000-\u001f\u007f<>]/g," ").replace(/\s+/g," ").trim().slice(0,max);}
function rnd(n){const a="abcdefghijkmnpqrstuvwxyz23456789";let s="";const r=crypto.getRandomValues(new Uint8Array(n));for(const x of r)s+=a[x%a.length];return s;}
function codeGen(){const a="ABCDEFGHJKLMNPQRSTUVWXYZ23456789";let s="";const r=crypto.getRandomValues(new Uint8Array(4));for(const x of r)s+=a[x%a.length];return s;}
function seeded(seed){let s=seed*2654435761%4294967296||1;return()=>{s^=s<<13;s>>>=0;s^=s>>>17;s^=s<<5;s>>>=0;return s/4294967296;};}
function drawQR(canvas,text){const ctx=canvas.getContext("2d");ctx.fillStyle="#fff";ctx.fillRect(0,0,canvas.width,canvas.height);
  if(!text){ctx.fillStyle="#555";ctx.font="bold 20px sans-serif";ctx.textAlign="center";ctx.fillText("Seite erst online stellen (GitHub Pages)",canvas.width/2,canvas.height/2,canvas.width-20);return;}
  const q=new QRLib.QRCode(-1,QRLib.ECL.M);q.addData(text);q.make();const n=q.getModuleCount(),quiet=2,cell=Math.floor(canvas.width/(n+quiet*2)),off=Math.floor((canvas.width-cell*n)/2);
  ctx.fillStyle="#1B1340";for(let r=0;r<n;r++)for(let c=0;c<n;c++)if(q.isDark(r,c))ctx.fillRect(off+c*cell,off+r*cell,cell,cell);}
/* ---------- Netz: MQTT über WebSocket (zwei öffentliche Broker parallel), zum Testen BroadcastChannel (?bc=1) ---------- */
const TE=new TextEncoder(),TD=new TextDecoder();
function mqStr(s){const b=TE.encode(s);return [b.length>>8,b.length&255,...b];}
function mqLen(n){const o=[];do{let d=n%128;n=Math.floor(n/128);if(n>0)d|=128;o.push(d);}while(n>0);return o;}
function mqPacket(hd,body){return new Uint8Array([hd,...mqLen(body.length),...body]);}
class MqttLink{
  constructor(url,cid,onMsg,onStatus){this.url=url;this.cid=cid;this.onMsg=onMsg;this.onStatus=onStatus;this.subs=new Set();this.up=false;this.buf=new Uint8Array(0);this.pid=1;this.tries=0;this.connect();}
  connect(){clearTimeout(this.rt);clearInterval(this.ping);let ws;
    try{ws=new WebSocket(this.url,["mqtt"]);}catch(e){this.retry();return;}
    this.ws=ws;ws.binaryType="arraybuffer";
    const guard=setTimeout(()=>{if(!this.up){try{ws.close();}catch(e){}}},9000);
    ws.onopen=()=>{ws.send(mqPacket(0x10,[...mqStr("MQTT"),4,0x02,0,30,...mqStr(this.cid+"-"+Math.random().toString(36).slice(2,6))]));};
    ws.onmessage=(ev)=>{const d=new Uint8Array(ev.data);const nb=new Uint8Array(this.buf.length+d.length);nb.set(this.buf);nb.set(d,this.buf.length);this.buf=nb;this.parse();};
    ws.onclose=()=>{clearTimeout(guard);this.up=false;clearInterval(this.ping);this.onStatus();this.retry();};
    ws.onerror=()=>{};}
  retry(){this.tries++;const w=Math.min(15000,800*Math.pow(1.6,this.tries));this.rt=setTimeout(()=>this.connect(),w);}
  parse(){while(this.buf.length>=2){let mult=1,len=0,i=1,b;
      do{if(i>=this.buf.length)return;b=this.buf[i++];len+=(b&127)*mult;mult*=128;}while(b&128);
      if(this.buf.length<i+len)return;
      const type=this.buf[0]>>4,flags=this.buf[0]&15,body=this.buf.subarray(i,i+len);this.buf=this.buf.slice(i+len);
      if(type===2){if(body[1]===0){this.up=true;this.tries=0;for(const t of this.subs)this.sendSub(t);
          this.ping=setInterval(()=>{try{this.ws.send(new Uint8Array([0xC0,0]));}catch(e){}},20000);this.onStatus(true);}else{try{this.ws.close();}catch(e){}}}
      else if(type===3){const tl=(body[0]<<8)|body[1];const topic=TD.decode(body.subarray(2,2+tl));let p=2+tl;const qos=(flags>>1)&3;
        if(qos>0){const id=(body[p]<<8)|body[p+1];p+=2;if(qos===1){try{this.ws.send(new Uint8Array([0x40,2,id>>8,id&255]));}catch(e){}}}
        let payload=null;try{payload=JSON.parse(TD.decode(body.subarray(p)));}catch(e){}
        if(payload!==null)this.onMsg(topic,payload);}}}
  sendSub(t){const id=this.pid=(this.pid%60000)+1;try{this.ws.send(mqPacket(0x82,[id>>8,id&255,...mqStr(t),0]));}catch(e){}}
  subscribe(t){this.subs.add(t);if(this.up)this.sendSub(t);}
  publish(t,obj,retain){if(!this.up)return false;const body=[...mqStr(t),...TE.encode(JSON.stringify(obj))];
    try{this.ws.send(mqPacket(retain?0x31:0x30,body));return true;}catch(e){return false;}}
}
class BcLink{
  constructor(cid,onMsg,onStatus){this.up=true;this.subs=new Set();this.ch=new BroadcastChannel("lf5live");this.ch.onmessage=(e)=>{if(this.subs.has(e.data.t))onMsg(e.data.t,e.data.p);};setTimeout(()=>onStatus(true),50);}
  subscribe(t){this.subs.add(t);} publish(t,obj){this.ch.postMessage({t,p:obj});return true;}
}
const params=new URLSearchParams(location.search);
const BC=params.get("bc")==="1";
const NS="lf5live1/";
class Net{
  constructor(onMsg,onStatus){this.cid="c"+rnd(9);this.seen=new Map();this.onMsg=onMsg;const cb=()=>onStatus(this.count());
    this.links=BC?[new BcLink(this.cid,(t,p)=>this.recv(t,p),cb)]:["wss://broker.hivemq.com:8884/mqtt","wss://broker.emqx.io:8084/mqtt"].map(u=>new MqttLink(u,this.cid,(t,p)=>this.recv(t,p),cb));
    this.lastRetained=null;}
  count(){return {up:this.links.filter(l=>l.up).length,all:this.links.length};}
  recv(t,p){if(p&&p.mid){if(this.seen.has(p.mid))return;this.seen.set(p.mid,Date.now());if(this.seen.size>4000)this.seen.clear();}this.onMsg(t.slice(NS.length),p);}
  sub(t){this.links.forEach(l=>l.subscribe(NS+t));}
  pub(t,obj,retain){obj.mid=rnd(12);let ok=false;this.links.forEach(l=>{if(l.publish(NS+t,obj,retain))ok=true;});return ok;}
}
/* ---------- Texte in der Sprache ---------- */
const TS=params.get("t")||"";let LANG=store("lf5.lang"+TS)||"de";if(!LANGS.includes(LANG))LANG="de";
let SHOWDE=store("lf5.showde"+TS);if(SHOWDE==null)SHOWDE=true;
const li=()=>LANGS.indexOf(LANG);
/* tx: Text in Landessprache (+ kleine deutsche Zweitzeile). */
function tx(a,opt){opt=opt||{};if(typeof a==="string")return document.createTextNode(a);
  const de=a[0],loc=a[li()]||de;if(LANG==="de"||!SHOWDE||opt.nodeOnly||loc===de||opt.noDe)return document.createTextNode(loc);
  const f=document.createDocumentFragment();f.append(document.createTextNode(loc));f.append(h("span",{class:"de",lang:"de",dir:"ltr"},de));return f;}
function catEl(c){if(typeof c==="string"||LANG==="de")return document.createTextNode(T0(c));const loc=Tl(c);if(loc===c[0])return document.createTextNode(loc);const f=document.createDocumentFragment();f.append(h("b",{lang:"de",dir:"ltr",style:"display:block"},c[0]),h("small",{style:"display:block;font-weight:600"},loc));return f;}
function ui(k){return tx(UI[k],{noDe:true});}
function uis(k){return UI[k][li()]||UI[k][0];}
function T0(a){return typeof a==="string"?a:a[0];}
function Tl(a){return typeof a==="string"?a:(a[li()]||a[0]);}
const LOGO='<svg viewBox="0 0 48 48" aria-hidden="true"><circle cx="24" cy="24" r="22" fill="#FF3D81" stroke="#fff" stroke-width="3"/><path d="M12 20h8l12-8v24l-12-8h-8z" fill="#FFD23F" stroke="#1B1340" stroke-width="2.5" stroke-linejoin="round"/><path d="M36 18c3 3 3 9 0 12" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round"/></svg>';
const BURST=(c)=>'<svg viewBox="0 0 100 100" aria-hidden="true"><polygon fill="'+c+'" stroke="#1B1340" stroke-width="4" stroke-linejoin="round" points="50,2 60,20 80,10 80,32 98,40 84,56 96,74 74,76 70,98 52,86 34,98 28,76 4,74 16,56 2,40 22,32 20,10 40,20"/></svg>';
const COLS=["#FFD23F","#27C3F2","#2FD493","#FF8A3D"];
/* ---------- Auswertung (gleiche Regeln auf Tafel und Handy) ---------- */
const typOf=(r)=>r.typ;
const SCORED=new Set(["quiz","multi","match","order","tf","guess"]);
function isScored(r){return r.typ==="quiz"?r.ok!=null:r.typ==="multi"?r.ok!=null:SCORED.has(r.typ);}
function validate(r,v){
  switch(r.typ){
   case "quiz":return Number.isInteger(v)&&v>=0&&v<r.opts.length;
   case "multi":return Array.isArray(v)&&v.length<=r.opts.length&&v.every((x,i)=>Number.isInteger(x)&&x>=0&&x<r.opts.length&&v.indexOf(x)===i);
   case "match":return Array.isArray(v)&&v.length===r.items.length&&v.every(x=>Number.isInteger(x)&&x>=0&&x<r.cats.length);
   case "order":return Array.isArray(v)&&v.length===r.steps.length&&v.every((x,i)=>Number.isInteger(x)&&x>=0&&x<r.steps.length&&v.indexOf(x)===i);
   case "tf":return Array.isArray(v)&&v.length===r.items.length&&v.every(x=>x===0||x===1);
   case "guess":return typeof v==="number"&&isFinite(v)&&v>=r.min&&v<=r.max;
   case "cloud":return Array.isArray(v)&&v.length<=3&&v.every(x=>typeof x==="string"&&x.length<=26);
   case "wall":return typeof v==="string"&&v.length>0&&v.length<=100;
  }return false;}
function score(r,v){ /* 0..100 */
  if(v==null)return 0;
  switch(r.typ){
   case "quiz":return r.ok==null?0:(v===r.ok?100:0);
   case "multi":{if(r.ok==null)return 0;const ok=new Set(r.ok);let s=0;v.forEach(x=>{s+=ok.has(x)?1:-1;});return Math.round(Math.max(0,s)/ok.size*100);}
   case "match":return Math.round(r.items.filter((it,i)=>v[i]===it.c).length/r.items.length*100);
   case "order":return Math.round(v.filter((x,i)=>x===i).length/v.length*100);
   case "tf":return Math.round(r.items.filter((it,i)=>v[i]===it.ok).length/r.items.length*100);
   case "guess":{const d=Math.abs(v-r.answer);return d<=r.tol?100:d<=2*r.tol?50:0;}
  }return 0;}
function shuffled(n,seed){const idx=[...Array(n).keys()],R=seeded(seed+7);for(let i=n-1;i>0;i--){const j=Math.floor(R()*(i+1));[idx[i],idx[j]]=[idx[j],idx[i]];}
  if(idx.every((x,i)=>x===i)&&n>1)idx.push(idx.shift());return idx;}
const fmtn=(x)=>Number(x).toLocaleString("de-DE",{maximumFractionDigits:1});

/* =====================================================================
   Rundentypen. phone(r,ctx) -> Element ; board(r,A,rev,P) -> Element
   ctx: {ri, send(value), sent, rev, mine, U (lokaler Zustand), done()}
   ===================================================================== */
const TY={};
function headBurst(ri,n){return h("div",{class:"burst",html:BURST(COLS[ri%4])+'<span>'+(ri+1)+'</span>'});}
function qBlock(r,cls){return h("h2",{class:"q "+(cls||"")},tx(r.q));}
function badge(msgKey,pts,kind){return h("div",{class:"msg "+kind},h("span",{class:"big"},uis(msgKey)+(pts!=null?"  +"+pts:"")));}

/* --- quiz / Umfrage --- */
TY.quiz={
 phone(r,ctx){const box=h("div");box.append(qBlock(r));const o=h("div",{class:"opts"});
  const ok=r.ok;
  r.opts.forEach((t,i)=>{let cls="opt";if(ctx.mine===i)cls+=" sel";if(ctx.rev&&ok!=null){if(i===ok)cls+=" right";else if(ctx.mine===i)cls+=" wrong";}
   o.append(h("button",{class:cls,disabled:ctx.sent||ctx.rev,onclick:()=>ctx.send(i)},h("span",{class:"k"},"ABCDEF"[i]),h("span",null,tx(t))));});
  box.append(o);return box;},
 board(r,A,rev){const n=r.opts.length,c=new Array(n).fill(0);Object.values(A).forEach(v=>{if(typeof v==="number"&&v>=0&&v<n)c[v]++;});const sum=c.reduce((a,b)=>a+b,0)||1;
  const bars=h("div",{class:"bars"});r.opts.forEach((t,i)=>{const p=Math.round(c[i]/sum*100);
   bars.append(h("div",{class:"bar"+(rev&&r.ok!=null?(r.ok===i?" ok":" no"):"")},h("div",{class:"lab"},"ABCDEF"[i]+"  "+T0(t)),h("div",{class:"track"},h("div",{class:"fill",style:"width:"+p+"%"})),h("div",{class:"num tab"},c[i])));});
  return h("div",null,h("h2",{class:"q"},T0(r.q)),bars);}
};
TY.poll=TY.quiz;
/* --- mehrere Antworten --- */
TY.multi={
 phone(r,ctx){const box=h("div");box.append(qBlock(r),h("p",{class:"hint"},ui("multi")));
  const sel=new Set(ctx.mine||ctx.U.sel||[]);const o=h("div",{class:"opts"});const okset=new Set(r.ok||[]);
  const sendBtn=h("button",{class:"btn pink send",disabled:ctx.sent||ctx.rev||sel.size===0,onclick:()=>ctx.send([...sel].sort((a,b)=>a-b))},uis("send"));
  r.opts.forEach((t,i)=>{let cls="opt"+(sel.has(i)?" sel":"");if(ctx.rev&&r.ok){if(okset.has(i))cls+=" right";else if(sel.has(i))cls+=" wrong";}
   const b=h("button",{class:cls,disabled:ctx.sent||ctx.rev,onclick:()=>{if(sel.has(i))sel.delete(i);else sel.add(i);ctx.U.sel=[...sel];b.classList.toggle("sel",sel.has(i));sendBtn.disabled=sel.size===0;}},h("span",{class:"k"},sel.has(i)?"✓":"□"),h("span",null,tx(t)));
   b.addEventListener("click",()=>{b.firstChild.textContent=sel.has(i)?"✓":"□";});o.append(b);});
  box.append(o);if(!ctx.sent&&!ctx.rev)box.append(sendBtn);return box;},
 board(r,A,rev){const n=r.opts.length,c=new Array(n).fill(0);Object.values(A).forEach(v=>{if(Array.isArray(v))v.forEach(x=>{if(x>=0&&x<n)c[x]++;});});const cnt=Object.keys(A).length||1;
  const okset=new Set(r.ok||[]);const bars=h("div",{class:"bars"});r.opts.forEach((t,i)=>{const p=Math.round(c[i]/cnt*100);
   bars.append(h("div",{class:"bar"+(rev&&r.ok?(okset.has(i)?" ok":" no"):"")},h("div",{class:"lab"},T0(t)),h("div",{class:"track"},h("div",{class:"fill",style:"width:"+p+"%"})),h("div",{class:"num tab"},c[i])));});
  return h("div",null,h("h2",{class:"q"},T0(r.q)),bars);}
};
/* --- Wortwolke --- */
TY.cloud={
 phone(r,ctx){const box=h("div");box.append(qBlock(r),h("p",{class:"hint"},ui("cloudhint")));
  const mine=ctx.mine||[];const inp=h("input",{type:"text",maxlength:"24",placeholder:uis("word"),autocomplete:"off",value:ctx.U.txt||""});
  inp.addEventListener("input",()=>{ctx.U.txt=inp.value;});
  const listEl=h("div",{class:"mine"},mine.map(w=>h("span",null,w)));
  const go=()=>{const w=clean(inp.value,24);if(!w||(ctx.mine||[]).length>=3)return;const nv=[...(ctx.mine||[]),w];ctx.send(nv,true);inp.value="";ctx.U.txt="";};
  const b=h("button",{class:"btn pink send",disabled:mine.length>=3,onclick:go},uis("send"));
  inp.addEventListener("keydown",e=>{if(e.key==="Enter")go();});
  box.append(h("div",{style:"margin-top:12px"},inp),listEl);
  if(r.chips){const cr=h("div",{class:"chips"});r.chips.forEach(c=>cr.append(h("button",{class:"chipbtn",onclick:()=>{inp.value=T0(c);ctx.U.txt=inp.value;}},tx(c,{noDe:true}))));box.append(cr);}
  box.append(b);return box;},
 board(r,A,rev,P,B){const cnt={},orig={};Object.values(A).forEach(arr=>{if(Array.isArray(arr))arr.forEach(w=>{const k=w.toLowerCase();cnt[k]=(cnt[k]||0)+1;if(!orig[k])orig[k]=w;});});
  const words=Object.entries(cnt).filter(([w])=>!(B.hide||{})[w]).sort((a,b)=>b[1]-a[1]);const max=words.length?words[0][1]:1;
  const cl=h("div",{class:"cloud"});if(!words.length)cl.append(h("div",{class:"empty"},"…"));
  words.sort(()=>0);const shown=words.map(x=>x).sort((a,b)=>a[0].localeCompare(b[0]));
  shown.forEach(([w,n])=>cl.append(h("span",{style:"font-size:"+Math.round(24+Math.sqrt(n/max)*(words.length>25?48:70))+"px",title:"×",onclick:()=>{if(confirm("„"+orig[w]+"“ ausblenden?")){B.hide=B.hide||{};B.hide[w]=1;B.save();B.redraw();}}},orig[w])));
  return h("div",null,h("h2",{class:"q"},T0(r.q)),cl);}
};
/* --- Zettelwand --- */
TY.wall={
 phone(r,ctx){const box=h("div");box.append(qBlock(r),h("p",{class:"hint"},ui("wallhint")));
  const ta=h("textarea",{maxlength:"100",placeholder:"…"});ta.value=ctx.mine||ctx.U.txt||"";ta.disabled=!!ctx.mine;ta.addEventListener("input",()=>{ctx.U.txt=ta.value;});
  box.append(h("div",{style:"margin-top:12px"},ta));
  if(!ctx.mine)box.append(h("button",{class:"btn pink send",onclick:()=>{const v=clean(ta.value,100);if(v)ctx.send(v);}},uis("send")));
  return box;},
 board(r,A,rev,P,B){const w=h("div",{class:"wall"});const ids=Object.keys(A);if(!ids.length)w.append(h("div",{class:"empty"},"…"));
  ids.forEach(id=>{const n=h("div",{class:"note"+((B.star||{})[id]?" star":""),onclick:()=>{B.star=B.star||{};B.star[id]=!B.star[id];B.save();B.redraw();}},A[id],h("small",null,"– "+((P[id]||{}).n||"?")));w.append(n);});
  return h("div",null,h("h2",{class:"q"},T0(r.q)),w);}
};
/* --- Zuordnung --- */
TY.match={
 phone(r,ctx){const box=h("div");box.append(qBlock(r),h("p",{class:"hint"},ui("match")));
  const pick=(ctx.mine||ctx.U.pick||new Array(r.items.length).fill(-1)).slice();
  const sendBtn=h("button",{class:"btn pink send",disabled:ctx.sent||ctx.rev,onclick:()=>{if(pick.every(x=>x>=0))ctx.send(pick);}},uis("send"));
  const upd=()=>{ctx.U.pick=pick;sendBtn.disabled=!pick.every(x=>x>=0)||ctx.sent||ctx.rev;};
  r.items.forEach((it,i)=>{const row=h("div",{class:"mrow"},h("div",{class:"st"},tx(it.t)));const seg=h("div",{class:"seg"+(r.cats.length>3?" four":"")});
   r.cats.forEach((c,ci)=>{let cls="";if(ctx.rev){if(ci===it.c)cls="right";else if(pick[i]===ci)cls="wrong";}else if(pick[i]===ci)cls="sel";
    const b=h("button",{class:cls,disabled:ctx.sent||ctx.rev,onclick:()=>{pick[i]=ci;[...seg.children].forEach((x,k)=>x.classList.toggle("sel",k===ci));upd();}},catEl(c));seg.append(b);});
   row.append(seg);box.append(row);});
  upd();if(!ctx.sent&&!ctx.rev)box.append(sendBtn);return box;},
 board(r,A,rev){const cnt=r.items.map(()=>r.cats.map(()=>0));let n=0;Object.values(A).forEach(v=>{if(Array.isArray(v)){n++;v.forEach((c,i)=>{if(cnt[i]&&cnt[i][c]!=null)cnt[i][c]++;});}});n=n||1;
  const t=h("table",{class:"mtab"});t.append(h("tr",null,h("th"),r.cats.map(c=>h("th",null,T0(c)))));
  r.items.forEach((it,i)=>t.append(h("tr",null,h("td",null,T0(it.t)),r.cats.map((c,ci)=>h("td",{class:"c tab"+(rev&&it.c===ci?" ok":""),style:"--p:"+(cnt[i][ci]/n).toFixed(2)},cnt[i][ci])))));
  return h("div",null,h("h2",{class:"q sm"},T0(r.q)),t);}
};
/* --- Reihenfolge --- */
TY.order={
 phone(r,ctx){const box=h("div");box.append(qBlock(r),h("p",{class:"hint"},ui("ord")));
  const ord=h("div",{class:"ord"});const chosen=(ctx.mine||ctx.U.ord||[]).slice();const shuf=shuffled(r.steps.length,ctx.ri*13+r.steps.length);
  const sendBtn=h("button",{class:"btn pink send",onclick:()=>{if(chosen.length===r.steps.length)ctx.send(chosen);}},uis("send"));
  const redraw=()=>{ctx.U.ord=chosen;ord.replaceChildren();
   shuf.forEach(si=>{const pos=chosen.indexOf(si);const lock=ctx.sent||ctx.rev;
    let cls=pos>=0?"sel":"";const b=h("button",{class:cls,disabled:lock,onclick:()=>{if(chosen.includes(si))chosen.splice(chosen.indexOf(si),1);else chosen.push(si);redraw();}},h("b",null,pos>=0?pos+1:""),h("span",null,tx(r.steps[si])));
    if(ctx.rev){b.style.borderColor=si===pos?"var(--ok)":"var(--bad)";}ord.append(b);});
   sendBtn.disabled=chosen.length!==r.steps.length||ctx.sent||ctx.rev;};
  redraw();box.append(ord);if(!ctx.sent&&!ctx.rev){box.append(h("p",{class:"hint"},ui("tapnum")),sendBtn,h("button",{class:"btn ghost send",onclick:()=>{chosen.length=0;redraw();}},uis("reset")));}
  if(ctx.rev){box.append(h("div",{class:"msg"},h("span",{class:"big"},uis("correctis")),h("ol",{style:"margin:6px 0 0;padding-inline-start:22px"},r.steps.map(s=>h("li",null,Tl(s))))));}
  return box;},
 board(r,A,rev){const n=r.steps.length;const hit=new Array(n).fill(0);let m=0;Object.values(A).forEach(v=>{if(Array.isArray(v)){m++;v.forEach((x,i)=>{if(x===i)hit[i]++;});}});m=m||1;
  const box=h("div",{class:"steps"});r.steps.forEach((s,i)=>{box.append(h("div",{class:"step"+(rev?"":" hidden")},h("div",{class:"n"},rev?i+1:"?"),h("div",null,rev?T0(s):"• • •"),h("div",{class:"mini"},h("i",{style:"width:"+Math.round(hit[i]/m*100)+"%"}))));});
  return h("div",null,h("h2",{class:"q sm"},T0(r.q)),box);}
};
/* --- Wahr/Falsch (Karte für Karte) --- */
TY.tf={
 phone(r,ctx){const box=h("div");box.append(qBlock(r,"sm"));const lab=r.labels||[UI.yes,UI.no];const ans=(ctx.mine||ctx.U.tf||[]).slice();
  const area=h("div");box.append(area);
  const draw=()=>{area.replaceChildren();const i=ans.length;const dots=h("div",{class:"dotrow"},r.items.map((x,k)=>h("i",{class:k<i?"d":k===i?"n":""})));area.append(dots);
   if(ctx.sent||ctx.rev||i>=r.items.length){ if(ctx.rev&&ctx.mine){const l=h("div");r.items.forEach((it,k)=>{const good=ctx.mine[k]===it.ok;l.append(h("div",{class:"msg "+(good?"good":"bad")},h("div",null,tx(it.t)),h("div",{class:"hint",style:"color:inherit"},(good?"✔ ":"✘ "+uis("correctis")+" ")+Tl(lab[it.ok]))));});area.append(l);} return;}
   area.append(h("div",{class:"tfcard"},tx(r.items[i].t)));
   area.append(h("div",{class:"tfbtns"},[0,1].map(v=>h("button",{class:"btn "+(v?"pink":"mint"),onclick:()=>{ans.push(v);ctx.U.tf=ans;if(ans.length===r.items.length)ctx.send(ans);else draw();}},tx(lab[v],{noDe:true})))));};
  draw();return box;},
 board(r,A,rev){const lab=r.labels||[UI.yes,UI.no];const n=Object.keys(A).length||1;
  const bars=h("div",{class:"bars"});r.items.forEach((it,i)=>{let c=[0,0];Object.values(A).forEach(v=>{if(Array.isArray(v)&&(v[i]===0||v[i]===1))c[v[i]]++;});
   const p=Math.round(c[it.ok]/n*100);
   bars.append(h("div",{class:"bar"+(rev?" ok":"")},h("div",{class:"lab"},T0(it.t)+(rev?"  → "+T0(lab[it.ok]):"")),h("div",{class:"track"},h("div",{class:"fill",style:"width:"+(rev?p:Math.round((c[0]+c[1])/n*100))+"%"})),h("div",{class:"num tab"},rev?p+"%":c[0]+c[1])));});
  return h("div",null,h("h2",{class:"q sm"},T0(r.q)),bars);}
};
/* --- Schätzen --- */
TY.guess={
 phone(r,ctx){const box=h("div");box.append(qBlock(r));const mid=ctx.mine!=null?ctx.mine:(ctx.U.g!=null?ctx.U.g:Math.round((r.min+r.max)/2/ (r.step||1))*(r.step||1));
  const val=h("div",{class:"bigval tab"},fmtn(mid)+" "+(r.unit?T0(r.unit):""));
  const sl=h("input",{type:"range",class:"slider",min:r.min,max:r.max,step:r.step||1,value:mid,disabled:ctx.sent||ctx.rev});
  sl.addEventListener("input",()=>{ctx.U.g=+sl.value;val.textContent=fmtn(+sl.value)+" "+(r.unit?Tl(r.unit):"");});
  val.textContent=fmtn(mid)+" "+(r.unit?Tl(r.unit):"");
  box.append(h("p",{class:"hint"},ui("guess")),h("div",{dir:"ltr"},val,sl,h("div",{class:"scale"},h("span",null,fmtn(r.min)),h("span",null,fmtn(r.max)))));
  if(!ctx.sent&&!ctx.rev)box.append(h("button",{class:"btn pink send",onclick:()=>ctx.send(+sl.value)},uis("send")));
  if(ctx.rev)box.append(h("div",{class:"msg"},h("span",{class:"big"},uis("correctis")+" "+fmtn(r.answer)+" "+(r.unit?Tl(r.unit):""))));
  return box;},
 board(r,A,rev){const strip=h("div",{class:"strip"});const span=r.max-r.min;
  Object.values(A).forEach(v=>{if(typeof v==="number")strip.append(h("div",{class:"dot",style:"left:"+((v-r.min)/span*100)+"%"}));});
  if(rev)strip.append(h("div",{class:"truth",style:"left:"+((r.answer-r.min)/span*100)+"%"},h("b",null,fmtn(r.answer)+" "+(r.unit?T0(r.unit):""))));
  const vals=Object.values(A).filter(v=>typeof v==="number").sort((a,b)=>a-b);const med=vals.length?vals[Math.floor(vals.length/2)]:null;
  return h("div",null,h("h2",{class:"q"},T0(r.q)),strip,h("div",{class:"scale"},h("span",null,fmtn(r.min)),h("span",null,fmtn(r.max))),med!=null?h("p",{class:"hint",style:"text-align:center;font-size:20px;color:var(--ink)"},"Median: "+fmtn(med)+" "+(r.unit?T0(r.unit):"")):null);}
};
/* --- Auftrag / Merksätze (nur lesen) --- */
TY.intro={
 phone(r,ctx){return h("div",null,h("h2",{class:"q"},tx(r.title)),h("p",{style:"font-weight:700;font-size:20px"},tx(r.text)));},
 board(r){return h("div",null,h("div",{class:"kicker"},T0(CFG.title)),h("h2",{class:"q",style:"font-size:clamp(30px,4.6vw,62px)"},T0(r.title)),h("p",{class:"brief"},T0(r.text)));}
};
TY.merk={
 phone(r,ctx){return h("div",null,h("h2",{class:"q sm"},ui("merk")),h("ul",{class:"merklist"},r.points.map(p=>h("li",null,h("span",null,tx(p))))));},
 board(r){return h("div",null,h("div",{class:"kicker"},UI.merk[0]),h("ul",{class:"merklist"},r.points.map(p=>h("li",null,h("span",null,T0(p))))));}
};
/* ===================================================================== */
const ROUNDS=CFG.rounds;
const NR=ROUNDS.length; /* ri: -1 Lobby, 0..NR-1 Runden, NR Ergebnis */
const ROUTE=params.get("s");
const MODKEY="lf5.m"+CFG.modul;
function topbar(extra){return h("div",{class:"top"},h("div",{class:"logo",html:LOGO}, h("b",null,"Werbe-Live")),h("span",{class:"chip"},"LF 5 · M"+CFG.modul),extra);}
function tickerEl(){return h("div",{class:"ticker"});}

/* ============================== TAFEL ============================== */
function tafelApp(){
  document.title="LF5 · M"+CFG.modul+" · "+T0(CFG.title);
  const root=$("app");
  let S=store(MODKEY+".board")||null;
  if(!S||!S.code){S={code:codeGen(),ri:-1,rev:false,P:{},A:{},sc:{},B:{},ids:[]};store(MODKEY+".board",S);}
  const save=()=>store(MODKEY+".board",S);
  let status={up:0,all:2};let wallB={save,redraw:()=>draw()};
  const net=new Net(onMsg,(s)=>{if(s)status=s;paintNet();});
  net.sub(S.code+"/in");
  function onMsg(t,p){
    if(t!==S.code+"/in"||!p)return;
    if(p.t==="hi"){const id=clean(p.id,20);if(!id)return;const n=clean(p.n,16)||"?";const l=LANGS.includes(p.l)?p.l:"de";
      if(S.kick&&S.kick[id])return;
      const isNew=!S.P[id];S.P[id]={n,l};if(!S.sc[id])S.sc[id]={t:0,d:0};if(isNew||true){save();pubSoon();if(S.ri===-1)draw();else paintHead();}return;}
    if(p.t==="a"){const id=clean(p.id,20);if(!S.P[id])return;const ri=p.r;if(ri!==S.ri||S.rev)return;const r=ROUNDS[ri];if(!r||!validate(r,p.v))return;
      S.A[ri]=S.A[ri]||{};if(r.typ==="cloud")p.v=p.v.map(w=>clean(w,24)).filter(Boolean);if(r.typ==="wall")p.v=clean(p.v,100);
      S.A[ri][id]=p.v;save();paintCount();drawBody();return;}
  }
  let pt=null;function pubSoon(){if(pt)return;pt=setTimeout(()=>{pt=null;pub();},250);}
  function pub(){const sc={};Object.keys(S.sc).forEach(k=>sc[k]=[S.sc[k].t,S.sc[k].d]);
    const answered=S.A[S.ri]?Object.keys(S.A[S.ri]):[];
    net.pub(S.code+"/st",{ri:S.ri,rev:S.rev,known:Object.keys(S.P),sc,n:Object.keys(S.P).length,ans:answered},true);}
  setInterval(pub,5000);
  function reveal(){const r=ROUNDS[S.ri];if(!r||S.rev)return;S.rev=true;
    if(isScored(r)){const A=S.A[S.ri]||{};Object.keys(S.P).forEach(id=>{const sc0=S.sc[id]||(S.sc[id]={t:0,d:0});const pts=score(r,A[id]);sc0.d=pts;sc0.t+=pts;});}
    else Object.keys(S.sc).forEach(id=>S.sc[id].d=0);
    save();pub();draw();}
  function go(d){const ni=Math.max(-1,Math.min(NR,S.ri+d));if(ni===S.ri)return;
    /* nicht gewertete Runde verlassen: Delta nullen */
    S.ri=ni;S.rev=false;Object.keys(S.sc).forEach(id=>S.sc[id].d=0);save();pub();draw();if(ni===NR)setTimeout(confetti,300);}
  function newSession(){if(!confirm("Neue Sitzung starten? Alle Spielstände werden gelöscht."))return;S={code:codeGen(),ri:-1,rev:false,P:{},A:{},sc:{},B:{},ids:[]};save();location.reload();}
  function joinUrl(){return location.protocol.startsWith("http")?location.origin+location.pathname+"?s="+S.code:"";}
  /* --- Zeichnen --- */
  const head=h("div"),body=h("div"),foot=h("div");root.replaceChildren(head,body,foot);
  let netEl=h("span",{class:"net"});
  function paintNet(){netEl.className="net "+(status.up===status.all?"up":status.up>0?"half":"");netEl.title=status.up+"/"+status.all;}
  function langStats(){const c={};Object.values(S.P).forEach(p=>c[p.l]=(c[p.l]||0)+1);return LANGS.filter(l=>c[l]).map(l=>h("span",{class:"chip"},LNAME[l]+" "+c[l]));}
  function paintHead(){
    const dots=h("div",{class:"dots"});for(let i=0;i<NR;i++)dots.append(h("i",{class:i<S.ri?"done":i===S.ri?"now":"",title:T0(ROUNDS[i].q||ROUNDS[i].title||"")}));
    head.replaceChildren(topbar([h("span",{class:"spacer"}),dots,h("span",{class:"chip"},Object.keys(S.P).length+" Spieler"),netEl,h("button",{class:"tbtn",onclick:showQR},"QR"),h("button",{class:"tbtn",onclick:()=>{if(confirm("Zur Startseite (Lobby)?")){S.ri=-1;S.rev=false;save();pub();draw();}}},"⌂")]),tickerEl());paintNet();}
  function showQR(){const ov=h("div",{class:"overlay",onclick:()=>ov.remove()},h("div",{class:"qrbox"},h("canvas",{width:420,height:420,id:"qr2"}),h("div",{class:"code"},S.code)));document.body.append(ov);drawQR($("qr2"),joinUrl());}
  function paintCount(){const r=ROUNDS[S.ri];const el=$("cnt");if(!el||!r)return;const n=Object.keys(S.P).length;const a=Object.keys((S.A[S.ri]||{})).length;el.textContent=a+" / "+n;$("meter").style.width=(n?Math.round(a/n*100):0)+"%";}
  function drawBody(){ if(S.ri<0||S.ri>=NR)return; const r=ROUNDS[S.ri];
    const poster=h("div",{class:"poster"},headBurstB(S.ri),TY[r.typ].board(r,S.A[S.ri]||{},S.rev,S.P,Object.assign(S.B[S.ri]=S.B[S.ri]||{},{save,redraw:()=>drawBody()})));
    body.replaceChildren(h("div",{class:"stage"},poster));}
  function headBurstB(i){return h("div",{class:"burst",html:BURST(COLS[i%4])+'<span>'+(i+1)+'</span>'});}
  function draw(){
    paintHead();
    if(S.ri===-1){drawLobby();return;}
    if(S.ri===NR){drawFinal();return;}
    const r=ROUNDS[S.ri];drawBody();
    const scored=isScored(r);
    foot.replaceChildren(h("div",{class:"foot"},
      h("button",{class:"btn ghost",onclick:()=>go(-1)},"◀"),
      (r.typ==="intro"||r.typ==="merk")?h("span",{class:"cnt"},UI.round[0]+" "+(S.ri+1)+" / "+NR):[h("span",{class:"cnt",id:"cnt"},"0"),h("div",{class:"meter"},h("i",{id:"meter"}))],
      scored&&!S.rev?h("button",{class:"btn pink",onclick:reveal},"Auflösen"):null,
      h("button",{class:"btn "+(S.rev||!scored?"mint":"ghost"),onclick:()=>go(1)},S.ri===NR-1?"Ergebnis ▶":"Weiter ▶")));
    paintCount();}
  function drawLobby(){
    const url=joinUrl();const ppl=h("div",{class:"people"});
    Object.entries(S.P).forEach(([id,p])=>ppl.append(h("span",{class:"person",title:"entfernen",onclick:()=>{if(confirm("„"+p.n+"“ entfernen?")){delete S.P[id];S.kick=S.kick||{};S.kick[id]=1;delete S.sc[id];save();pub();drawLobby();paintHead();}}},p.n,h("small",null,p.l.toUpperCase()))));
    if(!Object.keys(S.P).length)ppl.append(h("span",{class:"empty",style:"color:#fff"},"Warte auf Spieler …"));
    body.replaceChildren(h("div",{class:"stage"},h("div",{class:"lobby"},
      h("div",{class:"qrbox"},h("canvas",{width:420,height:420,id:"qr"}),h("div",{class:"code"},S.code),h("div",{class:"url"},url||"Offline: nur Testmodus (?bc=1)")),
      h("div",{class:"poster has-burst"},headBurstB(0),h("div",{class:"kicker"},"Lernfeld 5 · Modul "+CFG.modul),h("h1",{class:"q",style:"font-size:clamp(30px,4.4vw,58px)"},T0(CFG.title)),
        h("p",{class:"brief"},"Scanne den QR-Code mit dem Handy oder iPad, wähle deine Sprache und gib einen Spitznamen ein."),
        h("div",{class:"langs"},LANGS.map(l=>h("span",{class:"chip",style:"background:var(--yellow)"},LNAME[l]))),
        h("div",{class:"kicker",style:"margin-top:18px"},Object.keys(S.P).length+" Spieler"),ppl,h("div",{class:"langs"},langStats())))));
    drawQR($("qr"),url);
    foot.replaceChildren(h("div",{class:"foot"},h("button",{class:"btn ghost",onclick:newSession},"Neue Sitzung"),h("span",{class:"cnt",style:"flex:1"}),h("button",{class:"btn mint",onclick:()=>go(1)},"Los geht's ▶")));}
  function drawFinal(){
    const arr=Object.entries(S.P).map(([id,p])=>({n:p.n,t:(S.sc[id]||{t:0}).t})).sort((a,b)=>b.t-a.t);
    const pod=h("div",{class:"podium"});[1,0,2].forEach(k=>{const e=arr[k];if(!e)return;pod.append(h("div",{class:"pod p"+(k+1)},h("div",{class:"nm"},e.n),h("div",{class:"pt tab"},e.t+" "+UI.pts[0]),h("div",{class:"blk"},k+1)));});
    const rk=h("div",{class:"ranks"});arr.slice(3,10).forEach((e,i)=>rk.append(h("div",{class:"rk"},h("span",null,(i+4)+". "+e.n),h("span",{class:"tab"},e.t))));
    body.replaceChildren(h("div",{class:"stage"},h("div",{class:"poster yellow"},headBurstB(2),h("h1",{class:"q",style:"font-size:clamp(30px,4.4vw,58px)"},"Siegerehrung"),pod,rk)));
    foot.replaceChildren(h("div",{class:"foot"},h("button",{class:"btn ghost",onclick:()=>go(-1)},"◀"),h("span",{class:"cnt",style:"flex:1"},T0(CFG.title)),h("button",{class:"btn pink",onclick:newSession},"Neue Sitzung")));}
  function confetti(){const c=h("canvas",{class:"confetti"});c.width=innerWidth;c.height=innerHeight;document.body.append(c);const x=c.getContext("2d");const P=[...Array(140)].map(()=>({x:Math.random()*c.width,y:-20-Math.random()*c.height*.5,v:2+Math.random()*4,s:6+Math.random()*8,c:["#FF3D81","#FFD23F","#27C3F2","#2FD493","#7B4DFF"][Math.floor(Math.random()*5)],r:Math.random()*6}));
    let f=0;(function step(){x.clearRect(0,0,c.width,c.height);P.forEach(p=>{p.y+=p.v;p.r+=.1;p.x+=Math.sin(p.r)*1.5;x.fillStyle=p.c;x.fillRect(p.x,p.y,p.s,p.s*.6);});if(++f<260)requestAnimationFrame(step);else c.remove();})();}
  addEventListener("keydown",e=>{if(e.target.tagName==="INPUT"||e.target.tagName==="TEXTAREA")return;if(e.key==="ArrowRight"||e.key==="PageDown")go(1);if(e.key==="ArrowLeft"||e.key==="PageUp")go(-1);});
  draw();pub();
}

/* ============================== HANDY ============================== */
function phoneApp(){
  document.title="LF5 · M"+CFG.modul+" · "+T0(CFG.title);
  const CODE=clean(ROUTE,6).toUpperCase();const root=$("app");
  const KEY=MODKEY+".p."+CODE+(params.get("t")||"");
  let ME=store(KEY)||{id:"p"+rnd(7),n:"",joined:false,ans:{}};
  const saveMe=()=>store(KEY,ME);
  let ST=null,U={},pending=null,netSt={up:0,all:2};
  const net=new Net(onMsg,(s)=>{if(s)netSt=s;paintTop();});
  net.sub(CODE+"/st");
  function onMsg(t,p){if(t!==CODE+"/st"||!p)return;ST=p;
    if(ME.joined&&p.known&&!p.known.includes(ME.id))sendHi();
    render();}
  function sendHi(){net.pub(CODE+"/in",{t:"hi",id:ME.id,n:ME.n,l:LANG});}
  setInterval(()=>{if(ME.joined&&ST&&ST.known&&!ST.known.includes(ME.id))sendHi();
    /* Antwort nachsenden, bis die Tafel sie bestätigt */
    if(ME.joined&&ST&&ST.ri>=0&&ST.ri<NR&&!ST.rev&&ME.ans[ST.ri]!=null&&ST.ans&&!ST.ans.includes(ME.id))net.pub(CODE+"/in",{t:"a",id:ME.id,r:ST.ri,v:ME.ans[ST.ri]});},2500);
  const top=h("div"),main=h("div",{class:"phone"});root.replaceChildren(top,main);
  function paintTop(){const nt=h("span",{class:"net "+(netSt.up===netSt.all?"up":netSt.up>0?"half":"")});
    const sc=ST&&ST.sc&&ST.sc[ME.id]?ST.sc[ME.id][0]:0;
    top.replaceChildren(h("div",{class:"top"},h("div",{class:"logo",html:LOGO}),h("span",{class:"chip"},"M"+CFG.modul),h("span",{class:"spacer"}),ME.joined?h("span",{class:"score tab"},"★ "+sc):null,nt,h("button",{class:"tbtn",onclick:()=>{ME.picking=true;render();},"aria-label":"language"},LANG.toUpperCase())),tickerEl());}
  let lastSig="";
  function render(){
    document.documentElement.lang=LANG==="ti"?"ti":LANG;
    root.dir=LANG==="ar"?"rtl":"ltr";
    paintTop();
    const sig=[LANG,SHOWDE,ME.joined,ME.picking,ST?ST.ri+":"+ST.rev:"x",ST&&ST.sc&&ST.sc[ME.id]?ST.sc[ME.id].join():"",ME.ans[ST?ST.ri:-9]!=null].join("|");
    if(sig===lastSig&&main.firstChild)return;lastSig=sig;
    main.replaceChildren(view());}
  function view(){
    if(ME.picking||!store("lf5.langset"+TS)&&!ME.joined)return langView();
    if(!ME.joined)return joinView();
    if(!ST)return h("div",{class:"wait"},h("div",{class:"pulse"},"…"),ui("conn"));
    if(ST.ri<0)return h("div",{class:"wait"},h("div",{class:"pulse"},"★"),ui("wait"),h("p",{class:"hint"},ME.n));
    if(ST.ri>=NR)return finalView();
    return roundView();}
  function langView(){
    const g=h("div",{class:"langgrid"});LANGS.forEach(l=>g.append(h("button",{class:l===LANG?"sel":"",lang:l,dir:l==="ar"?"rtl":"ltr",onclick:()=>{LANG=l;store("lf5.lang"+TS,l);store("lf5.langset"+TS,1);ME.picking=false;saveMe();if(ME.joined)sendHi();lastSig="";render();}},LNAME[l],h("small",null,LSUB[l]))));
    const demo=h("label",{class:"hint",style:"display:flex;gap:8px;align-items:center;margin-top:16px;font-size:16px;color:var(--ink)"},h("input",{type:"checkbox",checked:SHOWDE?"":null,onchange:(e)=>{SHOWDE=e.target.checked;store("lf5.showde"+TS,SHOWDE);}}),uis("de"));
    return h("div",{class:"poster"},h("h2",{class:"q sm"},UI.pick.join(" · ")),g,demo,ME.picking?h("button",{class:"btn send",onclick:()=>{ME.picking=false;lastSig="";render();}},"OK"):null);}
  function joinView(){const inp=h("input",{type:"text",maxlength:"16",placeholder:uis("nickph"),value:ME.n||"",autocomplete:"off"});
    const go=()=>{const n=clean(inp.value,16);if(!n)return;ME.n=n;ME.joined=true;saveMe();sendHi();lastSig="";render();};
    inp.addEventListener("keydown",e=>{if(e.key==="Enter")go();});
    return h("div",{class:"poster"},h("h2",{class:"q"},tx(CFG.title)),h("p",{style:"font-weight:800;margin-top:14px"},ui("nick")),inp,h("button",{class:"btn pink send",onclick:go},uis("join")),
      h("label",{style:"display:flex;gap:8px;align-items:center;margin-top:16px;font-weight:700"},h("input",{type:"checkbox",checked:SHOWDE?"":null,onchange:(e)=>{SHOWDE=e.target.checked;store("lf5.showde"+TS,SHOWDE);lastSig="";render();}}),uis("de")),
      h("button",{class:"btn ghost send",onclick:()=>{ME.picking=true;lastSig="";render();}},LNAME[LANG]+" ▾"));}
  function roundView(){
    const ri=ST.ri,r=ROUNDS[ri];U[ri]=U[ri]||{};
    const mine=ME.ans[ri]!=null?ME.ans[ri]:null;
    const sent=mine!=null&&(r.typ!=="cloud"||mine.length>=3);
    const ctx={ri,rev:ST.rev,mine,sent,U:U[ri],send(v,multi){ if(ST.rev)return;ME.ans[ri]=v;ctx.mine=v;saveMe();net.pub(CODE+"/in",{t:"a",id:ME.id,r:ri,v});lastSig="";if(multi){main.replaceChildren(view());}else render();}};
    const ty=TY[r.typ];const wrap=h("div");
    const poster=h("div",{class:"poster has-burst"},headBurst(ri,NR),ty.phone(r,ctx));
    wrap.append(poster);
    const hasAns=mine!=null;
    if(r.typ!=="intro"&&r.typ!=="merk"){
      if(ST.rev&&isScored(r)){const d=hasAns?score(r,mine):0;const kind=d>=100?"good":d>0?"":"bad";
        wrap.append(h("div",{class:"msg "+kind},h("span",{class:"big"},uis(d>=100?"right":d>0?"part":"wrong")+"  +"+d+" "+uis("pts"))));}
      else if(hasAns&&!ST.rev&&r.typ!=="cloud")wrap.append(h("div",{class:"msg"},ui("sent")));
      else if(hasAns&&r.typ==="cloud"&&!ST.rev)wrap.append(h("div",{class:"hint",style:"margin-top:10px"},ui("sent")));
    }
    return wrap;}
  function finalView(){
    const arr=ST.sc?Object.entries(ST.sc).map(([id,v])=>({id,t:v[0]})).sort((a,b)=>b.t-a.t):[];const pos=arr.findIndex(e=>e.id===ME.id)+1;
    return h("div",{class:"poster yellow has-burst"},headBurst(2,NR),h("h2",{class:"q"},ui("final")),
      h("p",{class:"hint",style:"color:var(--ink)"},uis("place")),h("div",{class:"bigval"},pos?"#"+pos:"–"),
      h("p",{style:"text-align:center;font-weight:900"},(ST.sc&&ST.sc[ME.id]?ST.sc[ME.id][0]:0)+" "+uis("pts")));}
  render();
}
if(ROUTE)phoneApp();else tafelApp();
