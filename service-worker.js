/* Wordmaker Service Worker (cache version: 20260111-222819-2390)
   Strong update behavior:
   - skipWaiting() on install
   - clients.claim() on activate
   - responds to postMessage {type:'SKIP_WAITING'} to activate updates immediately
*/
const CACHE_NAME = "wordmaker-v2-20260111-222819-2390";
const CORE = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  // CDN libs (cached after first successful fetch)
  "https://cdn.jsdelivr.net/npm/html-to-docx@1.8.0/dist/html-to-docx.umd.js",
  "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js",
  "https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js"
];

self.addEventListener("message", (event) => {
  if (event.data && event.data.type === "SKIP_WAITING") {
    self.skipWaiting();
  }
});

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Pre-cache core. If CDN is temporarily blocked, the install can still complete after caching local files.
    try {
      await cache.addAll(CORE);
    } catch (e) {
      // Fallback: cache only local assets; CDN will be cached on-demand later
      await cache.addAll([
        "./",
        "./index.html",
        "./style.css",
        "./script.js",
        "./manifest.webmanifest",
        "./icon-192.png",
        "./icon-512.png"
      ]);
    }
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
      // If offline and not cached, return a generic error response
      return cached || Response.error();
    }
  })());
});
