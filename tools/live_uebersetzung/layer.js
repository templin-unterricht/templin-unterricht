/* Übersetzungsschicht für Live-Apps (Handy: Sprache wählen, Übersetzung ein-/ausblenden) */
(function(){
  "use strict";
  var TRD = __TRD__;
  var LG = [["ti","ትግርኛ","🌐"],["ru","Русский","🇷🇺"],["es","Español","🇪🇸"],["pt","Português","🇵🇹"]];
  var UIX = {
    title:["ቋንቋ ትርጉም","Язык перевода","Idioma de la traducción","Idioma da tradução"],
    off:["ብዘይ ትርጉም","Без перевода","Sin traducción","Sem tradução"],
    close:["ዕጸው","Закрыть","Cerrar","Fechar"]
  };
  var idx=-1, shown=true;
  try{ var s=localStorage.getItem("__KEY___lang"); if(s!==null && s!=="") idx=+s; shown=localStorage.getItem("__KEY___show")!=="0"; }catch(e){}
  try{var q=new URLSearchParams(location.search).get("lang"); if(q){var qi=LG.map(function(l){return l[0];}).indexOf(q); if(qi>=0) idx=qi;}}catch(e){}
  if(!(idx>=0&&idx<LG.length)) idx=-1;
  var HARVEST=window.__TR_HARVEST||null;
  var SKIP={SCRIPT:1,STYLE:1,SVG:1,CANVAS:1,INPUT:1,TEXTAREA:1,SELECT:1,OPTION:1,NOSCRIPT:1,IFRAME:1,svg:1,TITLE:1};
  var BLOCKY={BUTTON:1,TD:1,TH:1,LI:1,LABEL:1,A:1,H1:1,H2:1,H3:1,H4:1,P:1,DIV:1,SPAN:1,B:1,STRONG:1,I:1,EM:1,SUMMARY:1,FIGCAPTION:1};
  function norm(s){return s.replace(/\s+/g," ").trim();}
  function tr(key){if(HARVEST){HARVEST[key]=1;return null;} var a=TRD[key]; return (a&&idx>=0)?a[idx]:null;}
  function mk(txt){var s=document.createElement("span");s.className="trl";s.textContent=txt;s.setAttribute("data-trl","1");return s;}
  function hasOwnTrl(el){for(var c=el.firstChild;c;c=c.nextSibling){if(c.nodeType===1&&c.className==="trl")return true;}return false;}
  function walk(el){
    if(el.nodeType!==1) return;
    if(SKIP[el.tagName]||SKIP[el.nodeName]) return;
    if(el.id==="trbtn"||el.id==="trpanel") return;
    if(el.className==="trl"||el.hasAttribute("data-trl")) return;
    if(el.hasAttribute("data-notr")) return;
    if(el.hasAttribute("data-trd")){ if(hasOwnTrl(el)) return; el.removeAttribute("data-trd"); }
    if(el.placeholder){var pk=tr(norm(el.placeholder)); if(pk) el.title=pk;}
    var key=norm(el.textContent||"");
    if(key.length>=2 && key.length<=800){
      var t=tr(key);
      if(t && BLOCKY[el.tagName]){ el.setAttribute("data-trd","1"); el.appendChild(mk(t)); return; }
    }
    // mixed content: einzelne Textknoten
    var kids=Array.prototype.slice.call(el.childNodes);
    var hasEl=kids.some(function(k){return k.nodeType===1;});
    for(var i=0;i<kids.length;i++){
      var k=kids[i];
      if(k.nodeType===1) walk(k);
      else if(k.nodeType===3 && hasEl){
        var tk=norm(k.nodeValue); if(tk.length<3) continue;
        var tt=tr(tk);
        if(tt){
          var w=document.createElement("span"); w.setAttribute("data-trd","1");
          k.parentNode.insertBefore(w,k); w.appendChild(k); w.appendChild(mk(tt));
        }
      }
    }
  }
  function clearAll(){
    document.querySelectorAll(".trl").forEach(function(n){n.remove();});
    document.querySelectorAll("[data-trd]").forEach(function(n){n.removeAttribute("data-trd");});
  }
  var queued=false, pend=new Set();
  function flush(){
    queued=false; if(idx<0){pend.clear();return;}
    obs.disconnect();
    pend.forEach(function(n){ if(n.isConnected) walk(n); });
    pend.clear();
    obs.observe(document.body,{childList:true,subtree:true,characterData:true});
  }
  function enqueue(n){pend.add(n); if(!queued){queued=true;requestAnimationFrame(flush);}}
  var obs=new MutationObserver(function(ms){
    if(idx<0) return;
    for(var i=0;i<ms.length;i++){
      var m=ms[i];
      if(m.type==="characterData"){ var p=m.target.parentElement; if(p&&!p.hasAttribute("data-trl")) enqueue(p.closest("[data-trd]")||p); continue; }
      var t=m.target; if(t.nodeType!==1) continue;
      if(t.id==="trpanel"||t.id==="trbtn"||(t.closest&&t.closest("#trpanel"))) continue;
      var real=false;
      for(var j=0;j<m.addedNodes.length;j++){var a=m.addedNodes[j]; if(a.nodeType===1&&(a.className==="trl"||a.id==="trbtn"||a.id==="trpanel")) continue; real=true;}
      if(real) enqueue(t.hasAttribute("data-trd")?t.parentElement||t:t);
    }
  });
  var css=document.createElement("style");
  css.textContent=".trl{display:block;font-family:system-ui,'Noto Sans','Noto Sans Ethiopic','Nyala',sans-serif;font-size:clamp(11px,.78em,16px);font-weight:400;font-style:normal;line-height:1.35;color:#7a3d00;background:#FFF4E5;border-left:3px solid #E9A659;border-radius:2px;padding:1px 6px;margin:2px 0 2px;text-align:left;text-transform:none;letter-spacing:0;white-space:normal}"+
   "body.tr-hide .trl{display:none!important}"+
   "#trbtn{position:fixed;left:10px;bottom:10px;z-index:99998;width:46px;height:46px;border-radius:50%;border:2px solid #1F4E79;background:#fff;color:#1F4E79;font-size:22px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,.3);padding:0}"+
   "#trbtn.on{background:#1F4E79;color:#fff}"+
   "#trpanel{position:fixed;left:10px;bottom:64px;z-index:99999;background:#fff;color:#1a2430;border:1px solid #9DC3E6;border-radius:12px;padding:10px;box-shadow:0 6px 24px rgba(0,0,0,.35);display:none;font-family:system-ui,'Noto Sans Ethiopic',sans-serif;min-width:220px}"+
   "#trpanel b{display:block;font-size:13px;margin-bottom:6px}"+
   "#trpanel button{display:block;width:100%;text-align:left;font:inherit;font-size:16px;border:1px solid #1F4E79;background:#fff;color:#1F4E79;border-radius:8px;padding:9px 12px;margin:4px 0;cursor:pointer;min-height:42px}"+
   "#trpanel button.sel{background:#1F4E79;color:#fff}"+
   "@media print{#trbtn,#trpanel{display:none}}";
  document.head.appendChild(css);
  var btn=document.createElement("button"); btn.id="trbtn"; btn.type="button"; btn.textContent="🌐"; if(HARVEST) idx=0; btn.setAttribute("aria-label","Übersetzung / Translation");
  var panel=document.createElement("div"); panel.id="trpanel";
  function lab(a){ return a[idx>=0?idx:0]; }
  function drawPanel(){
    var h="<b>🌐 Übersetzung · "+UIX.title.join(" · ")+"</b>";
    LG.forEach(function(L,i){h+='<button type="button" data-i="'+i+'" class="'+(idx===i?"sel":"")+'">'+L[2]+" "+L[1]+"</button>";});
    h+='<button type="button" data-i="-1" class="'+(idx<0?"sel":"")+'">✕ '+UIX.off[0]+" / "+UIX.off[1]+"</button>";
    panel.innerHTML=h;
    btn.className=idx>=0?"on":"";
  }
  panel.addEventListener("click",function(e){
    var b=e.target.closest("button"); if(!b) return;
    idx=+b.getAttribute("data-i");
    try{localStorage.setItem("__KEY___lang",String(idx));}catch(x){}
    obs.disconnect(); clearAll(); drawPanel(); panel.style.display="none";
    if(idx>=0) walk(document.body);
    obs.observe(document.body,{childList:true,subtree:true,characterData:true});
    document.body.classList.remove("tr-hide");
  });
  btn.addEventListener("click",function(e){e.stopPropagation(); panel.style.display=panel.style.display==="block"?"none":"block";});
  document.addEventListener("click",function(e){ if(!e.target.closest("#trpanel")&&e.target.id!=="trbtn") panel.style.display="none"; });
  function init(){
    document.body.appendChild(btn); document.body.appendChild(panel); drawPanel();
    if(idx>=0) walk(document.body);
    obs.observe(document.body,{childList:true,subtree:true,characterData:true});
  }
  if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",function(){setTimeout(init,50);}); else setTimeout(init,50);
  window.LF1_TR={walkAll:function(){walk(document.body);},setLang:function(i){idx=i;},get lang(){return idx;}};
})();

