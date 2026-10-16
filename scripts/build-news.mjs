// Pulls Chicago headlines from the RSS feeds listed in config.js and writes news.json.
// Runs in GitHub Actions every 30 minutes, right before each publish (see .github/workflows/pages.yml).
// Usage: node scripts/build-news.mjs   (needs Node 18+, no packages)
import { readFileSync, writeFileSync } from "node:fs";

// Read the feed list and filters from config.js so there is one place to edit.
const cfgSrc = readFileSync(new URL("../config.js", import.meta.url), "utf8");
const win = {}; new Function("window", cfgSrc)(win);
const NEWS = win.SIGNAGE.news || {};
const feeds = NEWS.feeds || [];
const skip = (NEWS.skipWords || []).map(w => w.toLowerCase());
const perFeed = NEWS.perFeed || 4;
const maxItems = NEWS.maxItems || 18;

const decode = s => s.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, "$1").replace(/<[^>]+>/g, "")
  .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"')
  .replace(/&#39;|&apos;/g, "'").replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(n))
  .replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16))).replace(/\s+/g, " ").trim();

function parse(xml, source) {
  const out = [];
  const items = xml.match(/<item[\s>][\s\S]*?<\/item>|<entry[\s>][\s\S]*?<\/entry>/g) || [];
  for (const it of items) {
    const title = decode((it.match(/<title[^>]*>([\s\S]*?)<\/title>/) || [])[1] || "");
    const date = (it.match(/<(?:pubDate|published|updated|dc:date)>([\s\S]*?)<\//) || [])[1] || "";
    if (!title) continue;
    out.push({ source, title, time: new Date(date).getTime() || 0 });
  }
  return out;
}

const all = [];
for (const f of feeds) {
  try {
    const r = await fetch(f.url, { headers: { "user-agent": "Mozilla/5.0 (compatible; lobby-signage/1.0)" }, signal: AbortSignal.timeout(20000) });
    if (!r.ok) throw new Error("HTTP " + r.status);
    const items = parse(await r.text(), f.name)
      .filter(i => !skip.some(w => i.title.toLowerCase().includes(w)))
      .sort((a, b) => b.time - a.time)
      .slice(0, perFeed);
    all.push(...items);
    console.log(`${f.name}: ${items.length} headlines`);
  } catch (e) {
    console.log(`${f.name}: skipped (${e.message})`);
  }
}

// Drop the same story told twice by different outlets: if most of the meaningful
// words in a headline already appeared in a kept headline, skip it. Newest wins.
const STOP = new Set("a an the and or of in on at to for with by from as is are was were be after over into amid says said new chicago chicagos city".split(" "));
const words = t => new Set(t.toLowerCase().replace(/[^a-z0-9 ]+/g, " ").split(/\s+/).filter(w => w.length > 2 && !STOP.has(w)));
const similar = (a, b) => { let n = 0; for (const w of a) if (b.has(w)) n++; return n / Math.min(a.size, b.size || 1) >= 0.6 && n >= 3; };
const kept = [];
const uniq = all.sort((a, b) => b.time - a.time).filter(i => {
  const w = words(i.title);
  if (kept.some(k => similar(w, k))) return false; kept.push(w); return true;
});
const bySource = new Map();
for (const i of uniq) (bySource.get(i.source) || bySource.set(i.source, []).get(i.source)).push(i);
const mixed = [];
while (mixed.length < maxItems && [...bySource.values()].some(a => a.length))
  for (const a of bySource.values()) if (a.length && mixed.length < maxItems) mixed.push(a.shift());

const outPath = new URL("../news.json", import.meta.url);
let previous = null; try { previous = JSON.parse(readFileSync(outPath, "utf8")); } catch {}
if (!mixed.length && previous) { console.log("No headlines fetched; keeping previous news.json"); process.exit(0); }
writeFileSync(outPath, JSON.stringify({ updated: new Date().toISOString(), items: mixed }, null, 1) + "\n");
console.log(`Wrote ${mixed.length} headlines to news.json`);
