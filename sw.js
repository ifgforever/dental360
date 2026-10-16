// Offline copy of the lobby screen.
// When the internet is up, the TV always gets the latest page, settings and office content.
// When the internet is down, especially right after the player powers on, it plays the
// last copy it saved instead of showing an error page.
const CACHE = "signage-v1";
const CORE = ["./", "index.html", "config.js", "content.json", "news.json",
  "assets/tooth.png", "assets/photo-dentist.jpg", "assets/photo-smile.jpg", "assets/photo-patient.jpg",
  "assets/qr-book.svg", "assets/qr-facebook.svg"];
const FRESH = /\/(index\.html|config\.js|content\.json|news\.json)?$/;     // network first, then saved copy
const LIVE = /api\.github\.com|hc-ping\.com|open-meteo\.com|rss2json\.com|admin\.html/;  // never cached

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => Promise.all(CORE.map(u => c.add(u).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});

const keyOf = req => { const u = new URL(req.url); u.search = ""; return u.href; };   // ignore ?t= cache-busters

async function networkFirst(req){
  const cache = await caches.open(CACHE);
  try{
    const res = await Promise.race([fetch(req, {cache: "no-store"}), new Promise((_, rej) => setTimeout(() => rej(new Error("slow")), 5000))]);
    if(res.ok){
      await cache.put(keyOf(req), res.clone());
      if(/content\.json$/.test(new URL(req.url).pathname)) pruneUploads(res.clone(), cache);
      return res;
    }
    throw new Error("HTTP " + res.status);
  }catch(e){
    const hit = await cache.match(keyOf(req));
    if(hit) return hit;
    if(req.mode === "navigate"){ const home = await cache.match(new URL("index.html", self.registration.scope).href); if(home) return home; }
    throw e;
  }
}
async function cacheFirst(req){
  const cache = await caches.open(CACHE);
  const hit = await cache.match(keyOf(req));
  if(hit) return hit;
  const res = await fetch(req);
  if(res.ok || res.type === "opaque") cache.put(keyOf(req), res.clone());
  return res;
}
// forget uploaded pictures/videos the office has since deleted
async function pruneUploads(res, cache){
  try{
    const j = await res.json();
    const keep = new Set((j.slides || []).filter(s => s.src).map(s => new URL(s.src, self.registration.scope).href));
    for(const req of await cache.keys()) if(req.url.includes("/uploads/") && !keep.has(req.url)) await cache.delete(req);
  }catch(e){}
}

self.addEventListener("fetch", e => {
  const req = e.request;
  if(req.method !== "GET" || LIVE.test(req.url)) return;
  const u = new URL(req.url);
  const sameSite = u.origin === self.location.origin;
  if(sameSite && (req.mode === "navigate" || FRESH.test(u.pathname))) return e.respondWith(networkFirst(req));
  if(sameSite || /fonts\.(googleapis|gstatic)\.com/.test(u.host)) return e.respondWith(cacheFirst(req));
});
