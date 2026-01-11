// Wordmaker core
const editor = document.getElementById("editor");
const toastEl = document.getElementById("toast");
const installBtn = document.getElementById("installBtn");

// --- Toast helper ---
function toast(msg) {
  if (!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.remove("hidden");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(() => toastEl.classList.add("hidden"), 1600);
}

// --- Placeholder handling ---
const PLACEHOLDER = "Tap here to start typing ✨";

function clearPlaceholder() {
  if (editor && editor.innerText.trim() === PLACEHOLDER) {
    editor.innerHTML = "";
  }
}

if (editor) editor.addEventListener("focus", clearPlaceholder);

// --- Save/Load ---
const STORAGE_KEY = "wordmaker-doc";

function loadDoc() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && editor) editor.innerHTML = saved;
  } catch (e) {
    console.warn("Load failed:", e);
  }
}

function saveDoc() {
  try {
    if (!editor) return;
    localStorage.setItem(STORAGE_KEY, editor.innerHTML);
    toast("Saved");
  } catch (e) {
    console.warn("Save failed:", e);
    alert("Save failed. Storage may be blocked or full.");
  }
}

window.addEventListener("load", loadDoc);

// Autosave (lightweight)
let autosaveTimer = null;
if (editor) {
  editor.addEventListener("input", () => {
    clearTimeout(autosaveTimer);
    autosaveTimer = setTimeout(saveDoc, 800);
  });
}

// --- Buttons ---
document.getElementById("newDoc")?.addEventListener("click", () => {
  if (!editor) return;
  editor.innerHTML = "";
  editor.focus();
  toast("New doc");
});

document.getElementById("saveDoc")?.addEventListener("click", saveDoc);

document.getElementById("resetApp")?.addEventListener("click", () => {
  if (confirm("Reset Wordmaker? This clears local saves.")) {
    try {
      localStorage.clear();
    } catch {}
    location.reload();
  }
});

// --- Exports (simple text containers) ---
function downloadFile(content, filename, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

document.getElementById("exportTxt")?.addEventListener("click", () => {
  downloadFile(editor?.innerText ?? "", "document.txt", "text/plain;charset=utf-8");
});

document.getElementById("exportDocx")?.addEventListener("click", () => {
  downloadFile(
    editor?.innerText ?? "",
    "document.docx",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  );
});

document.getElementById("exportPdf")?.addEventListener("click", () => {
  downloadFile(editor?.innerText ?? "", "document.pdf", "application/pdf");
});

// --- PWA Install prompt button ---
let deferredPrompt = null;

window.addEventListener("beforeinstallprompt", (e) => {
  // Prevent Chrome from showing the mini-infobar
  e.preventDefault();
  deferredPrompt = e;

  if (installBtn) {
    installBtn.classList.remove("hidden");
    installBtn.setAttribute("aria-hidden", "false");
  }
});

installBtn?.addEventListener("click", async () => {
  if (!deferredPrompt) return;
  deferredPrompt.prompt();
  const choice = await deferredPrompt.userChoice;
  deferredPrompt = null;

  // Hide button after interaction
  installBtn.classList.add("hidden");
  installBtn.setAttribute("aria-hidden", "true");

  if (choice?.outcome === "accepted") toast("Installing…");
  else toast("Install dismissed");
});

window.addEventListener("appinstalled", () => {
  if (installBtn) {
    installBtn.classList.add("hidden");
    installBtn.setAttribute("aria-hidden", "true");
  }
  toast("Installed");
});

// --- Service worker registration (offline-ready) ---
(async function registerSW() {
  if (!("serviceWorker" in navigator)) return;

  try {
    const reg = await navigator.serviceWorker.register("./service-worker.js", { scope: "./" });

    // If a new SW is waiting, tell user to refresh
    if (reg.waiting) toast("Update ready — refresh");

    reg.addEventListener("updatefound", () => {
      const sw = reg.installing;
      if (!sw) return;
      sw.addEventListener("statechange", () => {
        if (sw.state === "installed" && navigator.serviceWorker.controller) {
          toast("Updated — refresh");
        }
      });
    });
  } catch (err) {
    console.warn("SW registration failed:", err);
  }
})();
