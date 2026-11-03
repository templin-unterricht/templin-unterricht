#!/usr/bin/env node
/*
 * Hilfswerkzeug für die Mehrsprachigkeit.
 *
 *   node tools/i18n/i18n_tool.js extract <seite.html ...>   deutsche Texte der Seite(n) auslesen -> i18n/pages/<seite>/de.json
 *   node tools/i18n/i18n_tool.js extract --dry <seite...>   nur anzeigen, was neu/geändert/entfallen ist
 *   node tools/i18n/i18n_tool.js missing [--lang ar] [--out datei.json]   fehlende Übersetzungen auflisten
 *   node tools/i18n/i18n_tool.js check [--live]             Qualitätsprüfung (vor jedem Commit); --live liest die Seiten neu ein
 *
 * Voraussetzung: Node + Playwright (bei Claude Code vorinstalliert; lokal: npm i playwright).
 */
'use strict';
const fs = require('fs'), path = require('path'), http = require('http');
const ROOT = path.resolve(__dirname, '..', '..');
const I18N = path.join(ROOT, 'i18n');
const LANGS = ['tr', 'ar', 'vi', 'ru', 'es', 'ti', 'pt', 'uk'];
const RTL = { ar: 1 };

const rd = f => JSON.parse(fs.readFileSync(f, 'utf8'));
const exists = f => fs.existsSync(f);
function pageId(file) {
  let p = path.basename(file).replace(/\.html?$/i, '');
  return p.replace(/[^A-Za-z0-9_\-]+/g, '_') || 'index';
}
function pagesWithDe() {
  const d = path.join(I18N, 'pages');
  return exists(d) ? fs.readdirSync(d).filter(x => exists(path.join(d, x, 'de.json'))) : [];
}
function loadDe() { // {id: {text, pages:[..]}}
  const all = {};
  const add = (src, name) => { const o = rd(src); for (const k in o) { (all[k] = all[k] || { text: o[k], where: [] }).where.push(name); } };
  const c = path.join(I18N, 'common', 'de.json');
  if (exists(c)) add(c, 'common');
  pagesWithDe().forEach(p => add(path.join(I18N, 'pages', p, 'de.json'), p));
  return all;
}

/* ---------- Auslesen mit Headless-Browser ---------- */
function serve() {
  const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.json': 'application/json', '.css': 'text/css', '.woff2': 'font/woff2', '.png': 'image/png' };
  const srv = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]);
    const f = path.join(ROOT, p);
    if (!f.startsWith(ROOT) || !exists(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); return res.end(); }
    res.writeHead(200, { 'Content-Type': types[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  return new Promise(r => srv.listen(0, '127.0.0.1', () => r(srv)));
}
function playwright() {
  try { return require('playwright'); } catch (e) {
    try { return require(require('child_process').execSync('npm root -g').toString().trim() + '/playwright'); } catch (e2) { console.error('Playwright nicht gefunden.'); process.exit(2); }
  }
}
const GERMAN_HINT = /\b(der|die|das|den|dem|des|ein|eine|einen|einem|und|oder|nicht|ist|sind|wird|werden|mit|für|auf|von|zu|im|am|bei|nach|ihr|sie|wir|du|dich|dir|dein|deine|wie|was|wer|wo|welche|welcher|welches|kann|darf|muss|bitte|aus|an|als|auch|nur|noch|wenn|dass)\b|[äöüßÄÖÜ]/i;
const OTHER_HINT = /\b(el|los|las|una|uno|para|con|por|que|está|são|não|uma|para|você|os|as|dos|das|the|and|is|are|of|to|with|bir|ve|için|değil|bu|nasıl)\b/gi;
function looksForeign(t) {
  if (/[\u0400-\u04FF\u0600-\u06FF\u1200-\u137F]/.test(t)) return true;
  if (/[ăđơưạảấầẩẫậắằẳẵặẹẻẽếềểễệ]/i.test(t)) return true;
  const other = (t.match(OTHER_HINT) || []).length;
  return other >= 2 && !GERMAN_HINT.test(t);
}
async function extractPages(files, dry) {
  const { chromium } = playwright();
  const srv = await serve(), port = srv.address().port;
  const browser = await chromium.launch();
  const libJs = fs.readFileSync(path.join(I18N, 'i18n.js'), 'utf8');
  const common = exists(path.join(I18N, 'common', 'de.json')) ? rd(path.join(I18N, 'common', 'de.json')) : {};
  const report = [];
  for (const file of files) {
    const abs = path.resolve(file), rel = path.relative(ROOT, abs).split(path.sep).map(encodeURIComponent).join('/');
    const id = pageId(abs);
    const ctx = await browser.newContext({ viewport: { width: 900, height: 900 } });
    await ctx.route(/^https?:\/\/(?!127\.0\.0\.1)/, r => r.abort());
    const pg = await ctx.newPage();
    pg.on('dialog', d => d.dismiss());
    await pg.goto(`http://127.0.0.1:${port}/${rel}`, { waitUntil: 'load' });
    await pg.waitForTimeout(400);
    if (!(await pg.evaluate(() => !!window.I18N))) await pg.addScriptTag({ content: libJs });
    const cfgFile = path.join(I18N, 'pages', id, 'config.json');
    if (exists(cfgFile)) await pg.evaluate(c => window.I18N.configure(c), rd(cfgFile));
    const seen = new Map();
    const grab = async () => { (await pg.evaluate(() => window.I18N.collect())).forEach(x => { if (!seen.has(x.id)) seen.set(x.id, x); }); };
    await grab();
    const stepsFile = path.join(I18N, 'pages', id, 'steps.json');
    if (exists(stepsFile)) {
      for (const s of rd(stepsFile)) {
        if (s.click) await pg.click(s.click);
        if (s.select) await pg.selectOption(s.select, { index: s.index || 1 });
        if (s.eval) await pg.evaluate(s.eval);
        await pg.waitForTimeout(s.wait || 250);
        await grab();
      }
    }
    await ctx.close();
    const out = {}, foreign = [];
    for (const [k, x] of seen) {
      if (common[k] !== undefined) continue;
      if (looksForeign(x.text)) { foreign.push(x.text); continue; }
      out[k] = x.text;
    }
    const dir = path.join(I18N, 'pages', id), f = path.join(dir, 'de.json');
    const old = exists(f) ? rd(f) : {};
    const added = Object.keys(out).filter(k => !(k in old)), gone = Object.keys(old).filter(k => !(k in out));
    report.push({ id, n: Object.keys(out).length, added: added.length, gone: gone.length, foreign: foreign.length, addedTexts: added.map(k => out[k]), goneTexts: gone.map(k => old[k]) });
    if (!dry) { fs.mkdirSync(dir, { recursive: true }); fs.writeFileSync(f, JSON.stringify(out, null, 1) + '\n'); }
  }
  await browser.close(); srv.close();
  return report;
}

/* ---------- Prüfungen ---------- */
const nums = s => (s.match(/\d+(?:[.,:]\d+)*/g) || []).sort().join('|');
const phs = s => ((s.match(/\{\d+\}|___/g) || []).sort().join('|'));
function check(opts) {
  const errs = [], warns = [];
  const E = (m) => errs.push(m), W = (m) => warns.push(m);
  const de = loadDe();
  let gl = [];
  const gf = path.join(I18N, 'glossary.json');
  if (exists(gf)) gl = rd(gf).terms;
  const files = [];
  const cdir = path.join(I18N, 'common');
  const dirs = [['common', cdir]].concat(pagesWithDe().map(p => [p, path.join(I18N, 'pages', p)]));
  let total = 0, filled = 0;
  for (const [name, dir] of dirs) {
    const deF = path.join(dir, 'de.json');
    if (!exists(deF)) continue;
    const src = rd(deF);
    for (const l of LANGS) {
      const f = path.join(dir, l + '.json');
      total += Object.keys(src).length;
      if (!exists(f)) { E(`${name}/${l}: Datei fehlt`); continue; }
      const raw = fs.readFileSync(f, 'utf8'); let tr;
      try { tr = JSON.parse(raw); } catch (e) { E(`${name}/${l}: ungültiges JSON`); continue; }
      const keys = (raw.match(/^\s*"(t[a-z0-9]+)"\s*:/gm) || []).map(x => x.match(/"(.+)"/)[1]);
      if (new Set(keys).size !== keys.length) E(`${name}/${l}: doppelte IDs`);
      for (const k in tr) if (!(k in src)) E(`${name}/${l}: verwaiste ID ${k} ("${String(tr[k]).slice(0, 40)}")`);
      for (const k in src) {
        const t = tr[k], d = src[k], tag = `${name}/${l} ${k}`;
        if (t === undefined) { E(`${tag}: fehlt ("${d.slice(0, 50)}")`); continue; }
        if (typeof t !== 'string' || !t.trim()) { E(`${tag}: leer`); continue; }
        filled++;
        if (nums(d) !== nums(t)) E(`${tag}: Zahlen weichen ab  DE[${nums(d)}] ≠ ${l}[${nums(t)}]  ("${d.slice(0, 50)}")`);
        if (phs(d) !== phs(t)) E(`${tag}: Platzhalter/Lücken (___) weichen ab ("${d.slice(0, 50)}")`);
        if (/[٠-٩۰-۹]/.test(t)) E(`${tag}: östliche Ziffern – bitte 0-9 verwenden`);
        if (l === 'ar' && !/[؀-ۿ]/.test(t) && /\p{L}{3}/u.test(d)) W(`${tag}: keine arabische Schrift ("${t.slice(0, 40)}")`);
        if (l === 'ti' && !/[ሀ-፿]/.test(t) && /\p{L}{3}/u.test(d)) W(`${tag}: keine Ge'ez-Schrift ("${t.slice(0, 40)}")`);
        if (l === 'ti' && /[؀-ۿ]/.test(t)) E(`${tag}: arabische Schrift im Tigrinya`);
        if ((l === 'ru' || l === 'uk') && !/[Ѐ-ӿ]/.test(t) && /\p{L}{3}/u.test(d)) W(`${tag}: keine kyrillische Schrift`);
        if (l === 'uk' && /[ыэъё]/i.test(t)) E(`${tag}: russische Buchstaben im Ukrainischen`);
        if (l === 'ru' && /[іїєґ]/i.test(t)) E(`${tag}: ukrainische Buchstaben im Russischen`);
        if (l === 'vi' && !/[ăâđêôơưáàảãạéèẻẽẹíìỉĩịóòỏõọúùủũụýỳỷỹỵ]/i.test(t) && t.length > 25) W(`${tag}: keine vietnamesischen Zeichen`);
        if (t.trim() === d.trim() && /\p{L}{4}/u.test(d) && d.split(' ').length > 1) W(`${tag}: identisch mit Deutsch ("${d.slice(0, 40)}")`);
        if (t.length > d.length * 4 + 20) W(`${tag}: Übersetzung auffällig lang`);
        if (RTL[l] && /[A-Za-z]{3}/.test(t) && !/\(/.test(t)) W(`${tag}: lateinischer Text ohne Klammer im RTL-Text`);
        for (const g of gl) {
          if (!g[l]) continue;
          const stem = (g.stem || g.de).toLowerCase();
          if (d.toLowerCase().includes(stem)) {
            const tl = t.toLowerCase();
            // jedes Wort des Glossar-Eintrags muss (mit Endungen/Fällen/Plural tolerant) vorkommen
            const okTr = String(g[l]).toLowerCase().split(/[\s\-]+/).filter(w => w.length > 2).every(w => {
              w = w.replace(/^ال/, ''); const s = w.length > 4 ? w.slice(0, -2) : w.length > 3 ? w.slice(0, -1) : w; return tl.includes(s);
            });
            const okDe = t.toLowerCase().includes(g.de.toLowerCase());
            if (!okTr || !okDe) W(`${tag}: Glossar „${g.de}“ -> ${g[l]} (${g.de})  ${!okTr ? '[Übersetzung fehlt]' : ''}${!okDe ? '[dt. Begriff in Klammern fehlt]' : ''}`);
          }
        }
      }
    }
  }
  // Glossar vollständig?
  gl.forEach(g => LANGS.forEach(l => { if (!g[l] || !String(g[l]).trim()) E(`glossary: „${g.de}“ ohne ${l}`); }));
  return { errs, warns, total, filled };
}

/* ---------- main ---------- */
(async () => {
  const [cmd, ...args] = process.argv.slice(2);
  const flag = n => args.includes(n);
  const val = n => { const i = args.indexOf(n); return i >= 0 ? args[i + 1] : null; };
  if (cmd === 'extract') {
    const files = args.filter(a => /\.html?$/i.test(a));
    const rep = await extractPages(files, flag('--dry'));
    rep.forEach(r => {
      console.log(`${r.id}: ${r.n} Texte (neu ${r.added}, entfallen ${r.gone}, fremdsprachig übersprungen ${r.foreign})`);
      if (flag('--dry')) { r.addedTexts.forEach(t => console.log('  + ' + t.slice(0, 80))); r.goneTexts.forEach(t => console.log('  - ' + t.slice(0, 80))); }
    });
  } else if (cmd === 'missing') {
    const only = val('--lang'), de = loadDe(), out = {}; let n = 0;
    const dirs = [['common', path.join(I18N, 'common')]].concat(pagesWithDe().map(p => [p, path.join(I18N, 'pages', p)]));
    for (const [name, dir] of dirs) {
      if (!exists(path.join(dir, 'de.json'))) continue;
      const src = rd(path.join(dir, 'de.json'));
      for (const l of LANGS) {
        if (only && l !== only) continue;
        const tr = exists(path.join(dir, l + '.json')) ? rd(path.join(dir, l + '.json')) : {};
        const miss = Object.keys(src).filter(k => !tr[k] || !String(tr[k]).trim());
        if (miss.length) { out[`${name}/${l}`] = Object.fromEntries(miss.map(k => [k, src[k]])); n += miss.length; console.log(`${name} [${l}]: ${miss.length} fehlen`); }
      }
    }
    console.log(n ? `Insgesamt fehlen ${n} Einträge.` : 'Nichts fehlt.');
    if (val('--out')) fs.writeFileSync(val('--out'), JSON.stringify(out, null, 1));
  } else if (cmd === 'promote') {
    // Texte, die auf mehreren Seiten vorkommen (oder in --texts datei.txt stehen), nach i18n/common verschieben
    const min = parseInt(val('--min') || '0', 10), tf = val('--texts');
    const wanted = tf ? new Set(fs.readFileSync(tf, 'utf8').split('\n').map(s => s.trim()).filter(Boolean)) : null;
    const pages = pagesWithDe(), cnt = {}, text = {};
    pages.forEach(p => { const o = rd(path.join(I18N, 'pages', p, 'de.json')); for (const k in o) { cnt[k] = (cnt[k] || 0) + 1; text[k] = o[k]; } });
    const ids = Object.keys(cnt).filter(k => (min && cnt[k] >= min) || (wanted && wanted.has(text[k])));
    const cdir = path.join(I18N, 'common'); fs.mkdirSync(cdir, { recursive: true });
    const move = (lang) => {
      const cf = path.join(cdir, lang + '.json'), c = exists(cf) ? rd(cf) : {};
      pages.forEach(p => {
        const f = path.join(I18N, 'pages', p, lang + '.json'); if (!exists(f)) return;
        const o = rd(f); let ch = false;
        ids.forEach(k => { if (k in o) { if (!(k in c)) c[k] = o[k]; delete o[k]; ch = true; } });
        if (ch) fs.writeFileSync(f, JSON.stringify(o, null, 1) + '\n');
      });
      fs.writeFileSync(cf, JSON.stringify(c, null, 1) + '\n');
    };
    ['de'].concat(LANGS).forEach(move);
    console.log(`${ids.length} Texte nach i18n/common verschoben.`);
  } else if (cmd === 'check') {
    let live = [];
    if (flag('--live')) {
      const files = [];
      const walk = d => fs.readdirSync(d, { withFileTypes: true }).forEach(e => {
        if (['.git', '_backup', 'node_modules', 'i18n', 'tools'].includes(e.name)) return;
        const p = path.join(d, e.name); if (e.isDirectory()) walk(p); else if (e.name.endsWith('.html')) files.push(p);
      });
      walk(ROOT);
      const have = new Set(pagesWithDe());
      const mine = files.filter(f => have.has(pageId(f)));
      const rep = await extractPages(mine, true);
      rep.forEach(r => { if (r.added || r.gone) live.push(`${r.id}: Deutsch hat sich geändert (neu ${r.added}, entfallen ${r.gone}) – bitte „extract“ und Übersetzungen ergänzen`); });
    }
    const r = check();
    live.forEach(m => r.errs.push(m));
    r.warns.forEach(w => console.log('WARNUNG ' + w));
    r.errs.forEach(e => console.log('FEHLER  ' + e));
    console.log(`\n${r.filled}/${r.total} Übersetzungen vorhanden · ${r.errs.length} Fehler · ${r.warns.length} Warnungen`);
    process.exit(r.errs.length ? 1 : 0);
  } else {
    console.log(fs.readFileSync(__filename, 'utf8').split('*/')[0].replace(/^\/\*\n?/, ''));
  }
})();
