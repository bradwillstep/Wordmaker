/* Wordmaker Service Worker
   Cache version: 20260111-220831-9937
*/
const CACHE_NAME = "wordmaker-cache-20260111-220831-9937";
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=20260111-220831-9937",
  "./script.js?v=20260111-220831-9937",
  "./manifest.webmanifest",
  "./icon-192.png",
  "./icon-512.png",
  "./README.md"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS);
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.map((k) => (k === CACHE_NAME ? null : caches.delete(k))));
    await self.clients.claim();
  })());
});

// Cache-first for same-origin requests; network-first for navigation
self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Only handle same-origin
  if (url.origin !== self.location.origin) return;

  // Navigation: network-first, fallback to cached index
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(CACHE_NAME);
        cache.put("./", fresh.clone());
        return fresh;
      } catch {
        const cached = await caches.match("./");
        return cached || caches.match("./index.html");
      }
    })());
    return;
  }

  // Static assets: cache-first
  event.respondWith((async () => {
    const cached = await caches.match(req);
    if (cached) return cached;

    const res = await fetch(req);
    const cache = await caches.open(CACHE_NAME);
    cache.put(req, res.clone());
    return res;
  })());
});
