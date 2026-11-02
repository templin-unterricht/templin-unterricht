/* UB-Engine – Übersetzung zum Antippen (DE | TR | VI | AR)
   Keine externen Abhängigkeiten, nur Systemschriften. Speichert nur die Sprachwahl (kein Name, keine Ergebnisse).
   Daten: window.UB_I18N = { "deutscher Text": {tr:"…", vi:"…", ar:"…"}, … }
   Vorlagen mit Platzhaltern: "Wie viel Rückgeld bekommt {1}?" -> {1} wird mit dem echten Wert gefüllt.
   Konfiguration: window.UB_CONFIG = { mode:true|false, hint:"pdf"|"app", pdf:"Pfad zur PDF" } */
(function () {
  'use strict';
  var CFG = window.UB_CONFIG || {};
  var DATA = window.UB_I18N || {};
  var LANGS = ['de', 'tr', 'vi', 'ar'];
  var NAMES = { de: 'Deutsch', tr: 'Türkçe', vi: 'Tiếng Việt', ar: 'العربية' };
  var SKEY = 'ub_lang';
  var T = {
    hintPdf: { tr: 'Cümleye dokun (bilgisayarda: üzerine gel), çeviriyi gör.', vi: 'Chạm vào câu (trên máy tính: rê chuột) để xem bản dịch.', ar: 'المس الجملة (على الكمبيوتر: مرّر المؤشر) لترى الترجمة.' },
    hintApp: { tr: 'Metne dokun: çeviriyi gör. Düğmeler için: uzun bas ya da 👆 aç.', vi: 'Chạm vào chữ để xem bản dịch. Với nút bấm: nhấn giữ hoặc bật 👆.', ar: 'المس النص لترى الترجمة. للأزرار: اضغط مطولاً أو فعّل 👆.' },
    mode: { de: 'Lesemodus: Antippen übersetzt nur (Knöpfe sind gesperrt)', tr: 'Okuma modu: dokunma yalnızca çevirir (düğmeler kilitli)', vi: 'Chế độ đọc: chạm chỉ để dịch (nút bị khóa)', ar: 'وضع القراءة: اللمس للترجمة فقط (الأزرار مقفلة)' },
    none: { tr: '(Bu metin için çeviri yok)', vi: '(Chưa có bản dịch cho đoạn này)', ar: '(لا توجد ترجمة لهذا النص)' }
  };

  function textOf(el) {
    var out = '';
    (function w(n) { for (var c = n.firstChild; c; c = c.nextSibling) { if (c.nodeType === 3) out += c.nodeValue; else if (c.nodeType === 1) { if (c.tagName === 'BR') out += ' '; else w(c); } } })(el);
    return out;
  }
  function norm(s) { return String(s).replace(/\s+/g, ' ').trim(); }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }
  function store(k, v) { try { if (v === undefined) return localStorage.getItem(k); localStorage.setItem(k, v); } catch (e) { return null; } }

  /* ---------- Wörterbuch ---------- */
  var EX = Object.create(null), TPL = [];
  Object.keys(DATA).forEach(function (key) {
    var v = DATA[key], k = norm(key);
    if (/\{\d+\}/.test(k)) {
      var parts = k.split(/\{\d+\}/), nums = (k.match(/\{(\d+)\}/g) || []).map(function (x) { return parseInt(x.slice(1), 10); });
      var re = new RegExp('^' + parts.map(function (p) { return p.replace(/[.*+?^$()|[\]\\{}]/g, '\\$&'); }).join('(.+?)') + '$');
      TPL.push({ re: re, nums: nums, v: v, len: k.length });
    } else EX[k] = v;
  });
  TPL.sort(function (a, b) { return b.len - a.len; });
  var CACHE = {}, CN = 0;
  function compose(k, lang) {   // Satz aus mehreren bekannten Teilen (z. B. Gesprächsbausteine) mit „…“ für leere Felder
    if (!/^[„…]/.test(k)) return null;
    var w = k.split(' '), memo = {};
    function go(i) {
      if (i === w.length) return [];
      if (memo[i] !== undefined) return memo[i];
      for (var j = w.length; j > i; j--) {
        var p = w.slice(i, j).join(' '), e = EX[p], t = p === '…' ? '…' : (e && e[lang]);
        if (t) { var rest = go(j); if (rest) { memo[i] = [t].concat(rest); return memo[i]; } }
      }
      memo[i] = null; return null;
    }
    var r = go(0); return r && r.length > 1 ? r.join(' ') : null;
  }
  var PLAIN = /^[\d\s.,:;+\-−–×÷=%€/()?!„“"…]*$/;

  function tr(text, lang, depth) {
    var k = norm(text), ck = lang + '|' + k;
    if (ck in CACHE) return CACHE[ck];
    var r = null, e = EX[k];
    if (e && e[lang]) r = e[lang];
    else if (!(depth > 2)) {
      for (var i = 0; i < TPL.length && r === null; i++) {
        var t = TPL[i], m = t.re.exec(k);
        if (m && t.v[lang]) {
          var cap = {};
          t.nums.forEach(function (n, j) { cap[n] = m[j + 1]; });
          r = t.v[lang].replace(/\{(\d+)\}/g, function (_, n) {
            var c = cap[n]; if (c === undefined) return '';
            if (PLAIN.test(c)) return c;
            var x = tr(c, lang, (depth || 0) + 1);
            if (!x) return c;
            return c.length > 32 ? x : c + ' (' + x + ')';
          });
        }
      }
    }
    if (r === null && !(depth > 2) && /^[A-C?]/.test(k) && k.length > 8 && /^[A-C?][A-ZÄÖÜa-zäöü„(0-9]/.test(k)) r = tr(k.slice(1), lang, (depth || 0) + 2);   // Buchstabe/Fragezeichen ohne Leerzeichen davor
    if (r === null && !(depth > 2)) {                      // Markierungen ✓ ✗ ~ am Ende
      var m3 = /^(.*[^\s✓✗~])\s+((?:[✓✗~]\s?)+)$/.exec(k);
      if (m3) { var x3 = tr(m3[1], lang, (depth || 0) + 1); if (x3) r = x3 + ' ' + m3[2]; }
    }
    if (r === null && !(depth > 2)) r = compose(k, lang);
    if (r === null) {
      var m2 = /^(\S{1,3})\s+(.{3,})$/.exec(k);       // z. B. Knopf "A  Antworttext"
      if (m2 && !(depth > 2)) r = tr(m2[2], lang, (depth || 0) + 1);
    }
    if (CN++ > 6000) { CACHE = {}; CN = 0; }
    CACHE[ck] = r;
    return r;
  }

  /* ---------- Sprache ---------- */
  var lang = 'de';
  var saved = store(SKEY);
  if (saved && LANGS.indexOf(saved) >= 0) lang = saved;
  var qm = /[?&]lang=(de|tr|vi|ar)\b/.exec(location.search);   // Sprach-Buttons im Dashboard: ...html?lang=tr
  if (qm) { lang = qm[1]; store(SKEY, lang); }
  var readMode = false;

  /* ---------- Oberfläche ---------- */
  var css = '#ub-bar{position:fixed;z-index:2147483000;top:6px;right:6px;display:flex;gap:3px;align-items:center;padding:3px 5px;border-radius:999px;background:rgba(27,42,56,.92);color:#fff;font:600 13px/1 system-ui,-apple-system,"Segoe UI",Arial,sans-serif;box-shadow:0 1px 6px rgba(0,0,0,.3);direction:ltr}' +
    '#ub-bar button{all:unset;box-sizing:border-box;cursor:pointer;min-width:34px;height:30px;padding:0 7px;border-radius:999px;text-align:center;line-height:30px;font:600 13px/30px system-ui,-apple-system,"Segoe UI",Arial,sans-serif;color:#fff;-webkit-tap-highlight-color:transparent}' +
    '#ub-bar button[aria-pressed=true]{background:#fff;color:#1b2a38}#ub-bar button:focus-visible{outline:2px solid #ffd54a;outline-offset:1px}' +
    '#ub-bar .g{padding:0 3px 0 4px;font-size:15px}#ub-mode{display:none}#ub-bar.l #ub-mode{display:block}' +
    '#ub-hint{position:fixed;z-index:2147482999;top:46px;right:6px;max-width:min(88vw,340px);padding:8px 11px;border-radius:10px;background:#fff8d6;color:#222;border:1px solid #e0c85a;font:14px/1.35 system-ui,-apple-system,"Segoe UI","Noto Sans",Arial,sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.25);display:none}' +
    '#ub-tip{position:absolute;z-index:2147483001;max-width:min(92vw,440px);padding:10px 13px;border-radius:10px;background:#1b2a38;color:#fff;font:17px/1.45 system-ui,-apple-system,"Segoe UI","Noto Sans",Arial,sans-serif;box-shadow:0 4px 16px rgba(0,0,0,.4);pointer-events:none;display:none}' +
    '#ub-tip[dir=rtl]{text-align:right;font-family:"Geeza Pro","Segoe UI","Noto Naskh Arabic",Tahoma,Arial,sans-serif;font-size:19px}#ub-tip.none{opacity:.85;font-size:14px}' +
    '#ub-tip .de{display:block;font-size:12px;opacity:.7;margin-bottom:4px;direction:ltr;text-align:left}' +
    'body.ub-on [data-ub]:not(button):not(a){text-decoration:underline dotted rgba(80,110,160,.8);text-underline-offset:3px;text-decoration-thickness:1.5px}' +
    'body.ub-on [data-ub]:not(button):not(a):hover{background:rgba(255,213,74,.28)}' +
    'body.ub-read{cursor:help}body.ub-read #ub-mode{}' +
    '@media print{#ub-bar,#ub-tip,#ub-hint{display:none!important}body.ub-on [data-ub]{text-decoration:none!important}}';
  if (CFG.mode) css += 'body{padding-top:44px!important}';   // Apps: Leiste verdeckt nichts
  var st = document.createElement('style'); st.textContent = css; document.head.appendChild(st);

  var bar = document.createElement('div'); bar.id = 'ub-bar'; bar.setAttribute('role', 'toolbar'); bar.setAttribute('aria-label', 'Sprache / Language');
  var h = '<span class="g" aria-hidden="true">🌐</span>';
  LANGS.forEach(function (l) { h += '<button type="button" data-l="' + l + '" aria-pressed="false" title="' + NAMES[l] + '">' + l.toUpperCase() + '</button>'; });
  if (CFG.mode) { h += '<button type="button" id="ub-mode" aria-pressed="false" title="Lesemodus">👆</button>'; bar.className = 'l'; }
  bar.innerHTML = h;
  var hint = document.createElement('div'); hint.id = 'ub-hint'; hint.setAttribute('role', 'status');
  var tip = document.createElement('div'); tip.id = 'ub-tip'; tip.setAttribute('role', 'tooltip');
  function mount() { document.body.appendChild(bar); document.body.appendChild(hint); document.body.appendChild(tip); apply(true); }

  function latinRuns(s) { // deutsche Wörter/Zahlen im arabischen Text links-nach-rechts einbetten
    return esc(s).replace(/([A-Za-zÄÖÜäöüß0-9€%][A-Za-zÄÖÜäöüß0-9€%.,:;+\-−×÷=\/'’]*(?: [A-Za-zÄÖÜäöüß0-9€%][A-Za-zÄÖÜäöüß0-9€%.,:;+\-−×÷=\/'’]*)*)/g, '<bdi dir="ltr">$1</bdi>');
  }

  /* ---------- Markieren ---------- */
  var INL = { B: 1, I: 1, EM: 1, STRONG: 1, SPAN: 1, SMALL: 1, BR: 1, A: 1, CODE: 1, SUB: 1, SUP: 1, U: 1, MARK: 1, ABBR: 1, BDI: 1, S: 1, INPUT: 1, IMG: 1 };
  var SKIP = { SCRIPT: 1, STYLE: 1, SVG: 1, TEXTAREA: 1, SELECT: 1, OPTION: 1, NOSCRIPT: 1, CANVAS: 1, TITLE: 1, HEAD: 1 };
  function leafish(el) {
    for (var c = el.firstElementChild; c; c = c.nextElementSibling) if (!INL[c.tagName.toUpperCase()] || (c.firstElementChild && !leafish(c))) return false;
    return true;
  }
  function ownText(el) { for (var c = el.firstChild; c; c = c.nextSibling) if (c.nodeType === 3 && /\S/.test(c.nodeValue)) return true; return false; }
  var NOOP = function () {};   // iOS-Safari: Elemente ohne Handler bekommen sonst kein click-Ereignis
  function markEl(el) {
    if (el.id === 'ub-bar' || el.id === 'ub-tip' || el.id === 'ub-hint') return;
    if (SKIP[el.tagName.toUpperCase()] || el.closest && el.closest('#ub-bar,#ub-tip,#ub-hint,svg')) return;
    if (!leafish(el)) return;
    var t = textOf(el); if (!t || t.length < 2 || !/[A-Za-zÄÖÜäöüß]/.test(t)) return;
    var r = tr(t, lang);
    if (r !== null) { el.setAttribute('data-ub', '1'); if (!el.onclick) el.onclick = NOOP; }
    else if (el.hasAttribute('data-ub')) el.removeAttribute('data-ub');
    else if (CFG.debug && ownText(el)) (window.__ubMissing = window.__ubMissing || {})[norm(t)] = 1;
  }
  function markTree(root) {
    if (lang === 'de') return;
    if (root.nodeType !== 1) return;
    markEl(root);
    var all = root.querySelectorAll('*');
    for (var i = 0; i < all.length; i++) markEl(all[i]);
  }
  function unmarkAll() { var a = document.querySelectorAll('[data-ub]'); for (var i = 0; i < a.length; i++) a[i].removeAttribute('data-ub'); }

  var pend = [], timer = null;
  function queue(n) { pend.push(n); if (!timer) timer = setTimeout(flush, 120); }
  function flush() {
    timer = null; var p = pend; pend = [];
    if (lang === 'de') return;
    var seen = [];
    p.forEach(function (n) {
      var e = n.nodeType === 1 ? n : n.parentElement; if (!e || seen.indexOf(e) >= 0) return; seen.push(e);
      if (!document.body.contains(e)) return;
      markTree(e);
      var up = e.parentElement; if (up && up !== document.body) markEl(up);
    });
  }
  var mo = new MutationObserver(function (ms) {
    for (var i = 0; i < ms.length; i++) {
      var m = ms[i];
      if (m.type === 'characterData') queue(m.target);
      else for (var j = 0; j < m.addedNodes.length; j++) { var n = m.addedNodes[j]; if (n.id === 'ub-tip' || n.id === 'ub-bar' || n.id === 'ub-hint') continue; queue(n); }
      if (m.type === 'childList' && m.target.nodeType === 1 && m.addedNodes.length === 0 && m.removedNodes.length) queue(m.target);
    }
  });

  /* ---------- Tooltip ---------- */
  var tipEl = null, tipTimer = null;
  function hideTip() { tip.style.display = 'none'; tipEl = null; clearTimeout(tipTimer); }
  function findMarked(t) {
    for (var e = t && t.nodeType === 3 ? t.parentElement : t; e && e !== document.body && e !== document.documentElement; e = e.parentElement) if (e.hasAttribute && e.hasAttribute('data-ub')) return e;
    return null;
  }
  function showTip(el) {
    if (lang === 'de') return;
    if (tipEl === el && tip.style.display === 'block') { hideTip(); return; }
    var de = norm(textOf(el)), r = tr(de, lang);
    tip.className = r === null ? 'none' : '';
    if (r === null) { r = (T.none[lang] || ''); }
    tip.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr'); tip.setAttribute('lang', lang);
    tip.innerHTML = '<span class="de">' + esc(de.length > 90 ? de.slice(0, 88) + '…' : de) + '</span>' + (lang === 'ar' ? latinRuns(r) : esc(r));
    tip.style.display = 'block'; tip.style.left = '0px'; tip.style.top = '0px';
    var rc = el.getBoundingClientRect(), tw = tip.offsetWidth, th = tip.offsetHeight, sx = window.pageXOffset, sy = window.pageYOffset, vw = document.documentElement.clientWidth, vh = window.innerHeight;
    var x = rc.left; if (lang === 'ar') x = rc.right - tw; x = Math.max(6, Math.min(x, vw - tw - 6));
    var y = rc.bottom + 6; if (y + th > vh - 6 && rc.top - th - 6 > 6) y = rc.top - th - 6; else if (y + th > vh - 6) y = Math.max(6, vh - th - 6);
    tip.style.left = (x + sx) + 'px'; tip.style.top = (y + sy) + 'px';
    tipEl = el; clearTimeout(tipTimer); tipTimer = setTimeout(hideTip, Math.min(16000, 4000 + r.length * 80));
  }

  /* ---------- Ereignisse ---------- */
  var hoverOK = window.matchMedia && matchMedia('(hover:hover) and (pointer:fine)').matches;
  function interactive(el) {
    for (var e = el; e && e !== document.body; e = e.parentElement) {
      var tg = e.tagName.toUpperCase();
      if (/^(BUTTON|A|INPUT|SELECT|TEXTAREA|LABEL|SUMMARY)$/.test(tg) || e.getAttribute('role') === 'button' || e.hasAttribute('data-act') || e.hasAttribute('onclick') || (typeof e.onclick === 'function' && e.onclick !== NOOP)) return true;
      try { if (getComputedStyle(e).cursor === 'pointer') return true; } catch (x) {}
    }
    return false;
  }
  var suppress = false, lpTimer = null, hoverTimer = null;
  window.addEventListener('click', function (ev) {
    if (ev.target.closest && ev.target.closest('#ub-bar')) return;
    if (suppress) { suppress = false; ev.preventDefault(); ev.stopPropagation(); return; }
    if (lang === 'de') return;
    var m = findMarked(ev.target);
    if (readMode) {   // Lesemodus: nichts im Spiel auslösen, nur übersetzen
      ev.preventDefault(); ev.stopPropagation();
      m = m || (ev.target.querySelector && ev.target.querySelector('[data-ub]'));
      if (m) showTip(m); else hideTip();
      return;
    }
    if (!m) { hideTip(); return; }
    if (!interactive(m)) showTip(m); else hideTip();
  }, true);
  window.addEventListener('touchstart', function (ev) {
    if (lang === 'de' || readMode) return;
    var m = findMarked(ev.target); if (!m || !interactive(m)) return;
    clearTimeout(lpTimer);
    lpTimer = setTimeout(function () { suppress = true; showTip(m); setTimeout(function () { suppress = false; }, 900); }, 520);
  }, { passive: true, capture: true });
  ['touchend', 'touchmove', 'touchcancel'].forEach(function (n) { window.addEventListener(n, function () { clearTimeout(lpTimer); }, { passive: true, capture: true }); });
  window.addEventListener('contextmenu', function (ev) { if (lang !== 'de' && findMarked(ev.target) && 'ontouchstart' in window) ev.preventDefault(); }, true);
  if (hoverOK) {
    window.addEventListener('mouseover', function (ev) {
      if (lang === 'de') return; var m = findMarked(ev.target); clearTimeout(hoverTimer);
      if (!m) return;
      hoverTimer = setTimeout(function () { showTip(m); }, interactive(m) ? 550 : 200);
    }, true);
    window.addEventListener('mouseout', function (ev) { clearTimeout(hoverTimer); if (findMarked(ev.target)) hideTip(); }, true);
  }
  window.addEventListener('scroll', hideTip, { passive: true });
  window.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideTip(); });

  /* ---------- Sprache umschalten ---------- */
  var hintT = null;
  function apply(init) {
    document.body.classList.toggle('ub-on', lang !== 'de');
    var b = bar.querySelectorAll('button[data-l]');
    for (var i = 0; i < b.length; i++) b[i].setAttribute('aria-pressed', b[i].getAttribute('data-l') === lang ? 'true' : 'false');
    hideTip(); unmarkAll();
    if (lang !== 'de') {
      markTree(document.body);
      if (!init) {
        var k = CFG.hint === 'pdf' ? T.hintPdf : T.hintApp;
        hint.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr'); hint.setAttribute('lang', lang);
        hint.textContent = k[lang]; hint.style.display = 'block'; clearTimeout(hintT); hintT = setTimeout(function () { hint.style.display = 'none'; }, 6500);
      }
    } else { hint.style.display = 'none'; readMode = false; document.body.classList.remove('ub-read'); var mb = document.getElementById('ub-mode'); if (mb) mb.setAttribute('aria-pressed', 'false'); }
    document.documentElement.setAttribute('data-ub-lang', lang);
  }
  bar.addEventListener('click', function (ev) {
    var b = ev.target.closest('button'); if (!b) return;
    if (b.id === 'ub-mode') {
      readMode = !readMode; b.setAttribute('aria-pressed', readMode ? 'true' : 'false'); document.body.classList.toggle('ub-read', readMode);
      if (lang === 'de') { lang = 'tr'; store(SKEY, lang); apply(); }
      b.title = T.mode[lang] || T.mode.de;
      if (readMode) { hint.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr'); hint.textContent = T.mode[lang] || T.mode.de; hint.style.display = 'block'; clearTimeout(hintT); hintT = setTimeout(function () { hint.style.display = 'none'; }, 4500); } else hint.style.display = 'none';
      return;
    }
    var l = b.getAttribute('data-l'); if (!l) return;
    lang = l; store(SKEY, lang); apply();
  });

  /* Debug / Qualitätscheck: ?debug=1 sammelt nicht übersetzte Texte in window.__ubMissing */
  if (/[?&]ubdebug=1/.test(location.search)) CFG.debug = true;
  window.UB = { tr: tr, setLang: function (l) { lang = l; store(SKEY, l); apply(); }, lang: function () { return lang; }, missing: function () { return Object.keys(window.__ubMissing || {}); } };

  function start() { mount(); mo.observe(document.body, { childList: true, subtree: true, characterData: true }); }
  if (document.body) start(); else document.addEventListener('DOMContentLoaded', start);
})();
