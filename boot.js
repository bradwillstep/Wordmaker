// Wordmaker bootloader - fixes "stuck on old version" for PWAs
// Build: 20260111-230819-9000
(function(){
  const BUILD = "20260111-230819-9000";
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

    try {
      // Remove only Wordmaker keys
      Object.keys(localStorage).forEach(k => {
        if (k.startsWith("wordmaker")) localStorage.removeItem(k);
      });
    } catch (e) {}
  }

  function uiLooksOld() {
    // If these are missing, it's the old/basic shell.
    return !document.getElementById("btnAIWriter") && !document.getElementById("btnFindReplace");
  }

  window.addEventListener("load", async () => {
    let last = null;
    try { last = localStorage.getItem(KEY); } catch (e) {}
    const needs = (last !== BUILD) || uiLooksOld();
    if (!needs) return;

    try { localStorage.setItem(KEY, BUILD); } catch (e) {}
    await purgeAll();

    const url = new URL(location.href);
    url.searchParams.set("hard", Date.now().toString());
    location.replace(url.toString());
  });
})();
