/* Wordmaker Service Worker (cache version: 20260111-221352-4061) */
const CACHE_NAME = "wordmaker-v2-20260111-221352-4061";
const CORE = [
  "./",
  "./index.html",
  "./style.css?v=20260111-221352-4061",
  "./script.js?v=20260111-221352-4061",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  // CDN libs (cached after first load)
  "https://cdn.jsdelivr.net/npm/html-to-docx@1.8.0/dist/html-to-docx.umd.js",
  "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js",
  "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map(k => (k === CACHE_NAME ? null : caches.delete(k))));
    await self.clients.claim();
  })());
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  // Network-first for navigation, cache-first for everything else
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put("./", fresh.clone());
        return fresh;
      } catch {
        return (await caches.match("./")) || (await caches.match("./index.html"));
      }
    })());
    return;
  }

  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;
    try {
      const res = await fetch(req);
      const cache = await caches.open(CACHE_NAME);
      cache.put(req, res.clone());
      return res;
    } catch {
      return cached || Response.error();
    }
  })());
});
