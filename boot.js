// Wordmaker bootloader - fixes "stuck on old version" for PWAs
// Build: 20260111-231936-1223
(function(){
  const BUILD = "20260111-231936-1223";
  const KEY = "wordmaker.boot.build";

  async function purgeAll() {
    try {
      if ("serviceWorker" in navigator) {
        const regs = await navigator.serviceWorker.getRegistrations();
        await Promise.all(regs.map(r => r.unregister()));
      }
    } catch (e) {}

    try {
      if ("caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map(k => caches.delete(k)));
      }
    } catch (e) {}
  }

  window.addEventListener("load", async () => {
    let last = null;
    try { last = localStorage.getItem(KEY); } catch (e) {}
    if (last === BUILD) return;
    try { localStorage.setItem(KEY, BUILD); } catch (e) {}
    await purgeAll();
  });
})();
