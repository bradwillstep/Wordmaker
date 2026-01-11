/* Wordmaker - fuller build (rich toolbar + real exports + PWA)
   Runs on GitHub Pages. No server. Everything client-side.
*/
(function(){
  const $ = (id)=>document.getElementById(id);

  const editor = $("editor");
  const pageWrap = $("pageWrap");
  const toastEl = $("toast");

  const STORAGE_KEY = "wordmaker.v2.doc";
  const TITLE_KEY = "wordmaker.v2.title";

  const PLACEHOLDER_HTML = '<p class="placeholder">Tap here to start typing ✨</p>';

  // ---------- Toast ----------
  function toast(msg){
    if(!toastEl) return;
    toastEl.textContent = msg;
    toastEl.classList.remove("hidden");
    clearTimeout(window.__wm_toast_timer);
    window.__wm_toast_timer = setTimeout(()=>toastEl.classList.add("hidden"), 1700);
  }

  // ---------- Safe execCommand wrapper ----------
  function exec(cmd, value=null){
    // execCommand still supported widely; good enough for a lightweight word editor.
    try{
      document.execCommand(cmd, false, value);
      editor && editor.focus();
    }catch(e){
      console.warn("execCommand failed:", cmd, e);
      toast("That action isn't supported on this browser.");
    }
  }

  // ---------- Placeholder ----------
  function ensureNotEmpty(){
    if(!editor) return;
    const text = editor.innerText.replace(/\u200B/g,'').trim();
    const hasRealNodes = editor.querySelectorAll("img,table,ul,ol").length > 0;
    if((!text || text === "Tap here to start typing ✨") && !hasRealNodes){
      editor.innerHTML = PLACEHOLDER_HTML;
    }
  }

  function clearPlaceholder(){
    if(!editor) return;
    if(editor.querySelector(".placeholder") && editor.textContent.trim() === "Tap here to start typing ✨"){
      editor.innerHTML = "";
    }
  }

  editor?.addEventListener("focus", clearPlaceholder);
  editor?.addEventListener("mousedown", clearPlaceholder);

  // ---------- Save / Load ----------
  function serialize(){
    return {
      v: 2,
      title: $("docTitle")?.value || "Untitled document",
      html: editor?.innerHTML || "",
      ts: Date.now()
    };
  }

  function applyDoc(doc){
    if(!doc) return;
    if($("docTitle")) $("docTitle").value = doc.title || "Untitled document";
    if(editor) editor.innerHTML = doc.html || "";
    ensureNotEmpty();
    updateStats();
  }

  function saveLocal(){
    try{
      const doc = serialize();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(doc));
      localStorage.setItem(TITLE_KEY, doc.title || "Untitled document");
      setSaved(true);
      toast("Saved");
    }catch(e){
      console.warn(e);
      alert("Save failed. Storage might be blocked or full.");
    }
  }

  function loadLocal(){
    try{
      const raw = localStorage.getItem(STORAGE_KEY);
      if(!raw) { ensureNotEmpty(); return; }
      const doc = JSON.parse(raw);
      applyDoc(doc);
      setSaved(true);
    }catch(e){
      console.warn(e);
      ensureNotEmpty();
    }
  }

  let savedState = false;
  function setSaved(isSaved){
    savedState = isSaved;
    const el = $("statSaved");
    if(el) el.textContent = isSaved ? "Yes" : "No";
  }

  // Autosave (debounced)
  let autosaveTimer = null;
  editor?.addEventListener("input", ()=>{
    clearTimeout(autosaveTimer);
    setSaved(false);
    autosaveTimer = setTimeout(saveLocal, 900);
    updateStats();
  });

  // ---------- Stats ----------
  function updateStats(){
    if(!editor) return;
    const text = editor.innerText.replace(/\u200B/g,'').trim();
    const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
    const chars = text ? text.length : 0;
    $("statWords") && ($("statWords").textContent = String(words));
    $("statChars") && ($("statChars").textContent = String(chars));
  }

  // ---------- Toolbar wire-up ----------
  $("btnNew")?.addEventListener("click", ()=>{
    if(!confirm("Start a new document? (This won't delete your saved copy unless you hit Save.)")) return;
    if(editor) editor.innerHTML = "";
    if($("docTitle")) $("docTitle").value = "Untitled document";
    ensureNotEmpty();
    setSaved(false);
    updateStats();
    toast("New doc");
  });

  // Open/Save portable file (.wm.json)
  const dlgOpen = $("dlgOpen");
  $("btnOpen")?.addEventListener("click", ()=>dlgOpen?.showModal());
  $("fileOpen")?.addEventListener("change", async (e)=>{
    const file = e.target.files?.[0];
    if(!file) return;
    try{
      const text = await file.text();
      const doc = JSON.parse(text);
      applyDoc(doc);
      saveLocal();
      toast("Opened");
      dlgOpen?.close();
      e.target.value = "";
    }catch(err){
      console.warn(err);
      alert("Could not open that file.");
    }
  });

  $("btnSave")?.addEventListener("click", saveLocal);

  // Download a portable Wordmaker file
  function download(name, blob){
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = name;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  // Undo/Redo
  $("btnUndo")?.addEventListener("click", ()=>exec("undo"));
  $("btnRedo")?.addEventListener("click", ()=>exec("redo"));

  // Font
  $("fontFamily")?.addEventListener("change", (e)=>exec("fontName", e.target.value));
  $("fontSize")?.addEventListener("change", (e)=>{
    // execCommand fontSize uses 1-7; we map by applying inline style to selection.
    const px = parseInt(e.target.value, 10);
    if(!px) return;
    applyInlineStyleToSelection({ fontSize: px + "px" });
  });

  // Basic formatting
  $("btnBold")?.addEventListener("click", ()=>toggleBtn("btnBold", "bold"));
  $("btnItalic")?.addEventListener("click", ()=>toggleBtn("btnItalic", "italic"));
  $("btnUnderline")?.addEventListener("click", ()=>toggleBtn("btnUnderline", "underline"));
  $("btnStrike")?.addEventListener("click", ()=>toggleBtn("btnStrike", "strikeThrough"));

  function toggleBtn(btnId, cmd){
    exec(cmd);
    const b = $(btnId);
    if(b) b.classList.toggle("active");
  }

  // Align
  $("btnAlignLeft")?.addEventListener("click", ()=>exec("justifyLeft"));
  $("btnAlignCenter")?.addEventListener("click", ()=>exec("justifyCenter"));
  $("btnAlignRight")?.addEventListener("click", ()=>exec("justifyRight"));
  $("btnAlignJustify")?.addEventListener("click", ()=>exec("justifyFull"));

  // Lists / indent
  $("btnBullets")?.addEventListener("click", ()=>exec("insertUnorderedList"));
  $("btnNumbered")?.addEventListener("click", ()=>exec("insertOrderedList"));
  $("btnIndent")?.addEventListener("click", ()=>exec("indent"));
  $("btnOutdent")?.addEventListener("click", ()=>exec("outdent"));

  // Page mode
  $("togglePageMode")?.addEventListener("change", (e)=>{
    if(e.target.checked) pageWrap?.classList.add("pageMode");
    else pageWrap?.classList.remove("pageMode");
  });

  // Print
  $("btnPrint")?.addEventListener("click", ()=>window.print());

  // Insert date/time
  $("btnInsertDate")?.addEventListener("click", ()=>{
    const dt = new Date().toLocaleString();
    exec("insertText", dt);
    updateStats();
  });

  // Clear formatting
  $("btnClearFormatting")?.addEventListener("click", ()=>{
    exec("removeFormat");
    // Also strip font tags
    normalizeEditor();
    toast("Formatting cleared");
  });

  // Find/replace dialog
  const dlgFind = $("dlgFind");
  $("btnFindReplace")?.addEventListener("click", ()=>dlgFind?.showModal());

  let lastFindIndex = 0;
  function getDocText(){
    return (editor?.innerText || "").replace(/\u200B/g,'');
  }

  function findNext(){
    const hay = getDocText();
    const needle = $("findText")?.value || "";
    if(!needle) return toast("Type something to find");
    const matchCase = $("findCase")?.checked;
    const h = matchCase ? hay : hay.toLowerCase();
    const n = matchCase ? needle : needle.toLowerCase();

    let idx = h.indexOf(n, lastFindIndex);
    if(idx === -1 && lastFindIndex !== 0){
      idx = h.indexOf(n, 0);
      lastFindIndex = 0;
    }
    if(idx === -1){
      toast("Not found");
      return;
    }
    selectTextRangeInEditor(idx, idx + needle.length);
    lastFindIndex = idx + needle.length;
    toast("Found");
  }

  function replaceOne(){
    const sel = window.getSelection();
    const needle = $("findText")?.value || "";
    const repl = $("replaceText")?.value || "";
    if(!needle) return toast("Type something to find");
    if(sel && sel.toString()){
      exec("insertText", repl);
      toast("Replaced");
      updateStats();
    }else{
      findNext();
    }
  }

  function replaceAll(){
    const needle = $("findText")?.value || "";
    const repl = $("replaceText")?.value || "";
    if(!needle) return toast("Type something to find");
    // Replace on textContent (keeps formatting imperfectly, but reliable)
    // For a formatting-preserving replace you'd need a DOM-walk; this is the safe/simple version.
    const plain = editor?.innerText || "";
    const matchCase = $("findCase")?.checked;
    let out = plain;
    let count = 0;
    if(matchCase){
      out = plain.split(needle).join(repl);
      count = (plain.length - out.length) / Math.max(1,(needle.length - repl.length || 1));
    }else{
      // case-insensitive replace
      const re = new RegExp(escapeRegExp(needle), "gi");
      const m = plain.match(re);
      count = m ? m.length : 0;
      out = plain.replace(re, repl);
    }
    if(editor){
      editor.innerText = out;
    }
    normalizeEditor();
    toast(`Replaced ${count}x`);
    updateStats();
  }

  $("btnFindNext")?.addEventListener("click", (e)=>{ e.preventDefault(); findNext(); });
  $("btnReplaceOne")?.addEventListener("click", (e)=>{ e.preventDefault(); replaceOne(); });
  $("btnReplaceAll")?.addEventListener("click", (e)=>{ e.preventDefault(); replaceAll(); });

  // ---------- Exports: DOCX / PDF (real) ----------
  async function exportDocx(){
    const title = ($("docTitle")?.value || "document").trim() || "document";
    if(!window.htmlToDocx){
      alert("DOCX exporter library didn't load. Check your connection and refresh.");
      return;
    }
    // Clone editor to remove placeholder
    const clone = editor.cloneNode(true);
    clone.querySelectorAll(".placeholder").forEach(n=>n.remove());
    const html = wrapForDocx(title, clone.innerHTML);

    try{
      const blob = await window.htmlToDocx(html, title, {
        table: { row: { cantSplit: true } },
        footer: false,
        pageNumber: true
      });
      download(`${sanitizeFilename(title)}.docx`, blob);
      toast("DOCX exported");
    }catch(err){
      console.warn(err);
      alert("DOCX export failed.");
    }
  }

  async function exportPdf(){
    const title = ($("docTitle")?.value || "document").trim() || "document";
    if(!window.html2canvas || !window.jspdf?.jsPDF){
      alert("PDF exporter library didn't load. Check your connection and refresh.");
      return;
    }

    // Create a printable container
    const container = document.createElement("div");
    container.style.width = "816px";
    container.style.padding = "24px";
    container.style.background = "#fff";
    container.style.color = "#111";
    container.style.fontFamily = "Arial, sans-serif";
    container.style.lineHeight = "1.55";
    container.style.position = "fixed";
    container.style.left = "-99999px";
    container.style.top = "0";
    const h = document.createElement("h2");
    h.textContent = title;
    h.style.margin = "0 0 12px 0";
    h.style.fontSize = "18px";
    container.appendChild(h);

    const content = editor.cloneNode(true);
    content.querySelectorAll(".placeholder").forEach(n=>n.remove());
    content.style.minHeight = "auto";
    content.style.boxShadow = "none";
    content.style.borderRadius = "0";
    content.style.padding = "0";
    container.appendChild(content);
    document.body.appendChild(container);

    try{
      const canvas = await window.html2canvas(container, { scale: 2, backgroundColor: "#ffffff" });
      const imgData = canvas.toDataURL("image/png");
      const { jsPDF } = window.jspdf;
      const pdf = new jsPDF({ orientation: "p", unit: "pt", format: "letter" });

      const pageW = pdf.internal.pageSize.getWidth();
      const pageH = pdf.internal.pageSize.getHeight();

      const imgW = pageW;
      const imgH = canvas.height * (imgW / canvas.width);

      let y = 0;
      let remaining = imgH;

      while(remaining > 0){
        pdf.addImage(imgData, "PNG", 0, y, imgW, imgH);
        remaining -= pageH;
        if(remaining > 0){
          pdf.addPage();
          y -= pageH;
        }
      }

      pdf.save(`${sanitizeFilename(title)}.pdf`);
      toast("PDF exported");
    }catch(err){
      console.warn(err);
      alert("PDF export failed.");
    }finally{
      container.remove();
    }
  }

  $("btnExportDocx")?.addEventListener("click", exportDocx);
  $("btnExportPdf")?.addEventListener("click", exportPdf);

  // ---------- Install button ----------
  let deferredPrompt = null;
  const installBtn = $("btnInstall");
  window.addEventListener("beforeinstallprompt", (e)=>{
    e.preventDefault();
    deferredPrompt = e;
    installBtn?.classList.remove("hidden");
  });
  installBtn?.addEventListener("click", async ()=>{
    if(!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    installBtn.classList.add("hidden");
  });
  window.addEventListener("appinstalled", ()=>{
    installBtn?.classList.add("hidden");
    toast("Installed");
  });

  // ---------- Service worker ----------
  (async function registerSW(){
    if(!("serviceWorker" in navigator)) return;
    try{
      const reg = await navigator.serviceWorker.register("./service-worker.js", { scope: "./" });
      if(reg.waiting) toast("Update ready — refresh");
      reg.addEventListener("updatefound", ()=>{
        const sw = reg.installing;
        if(!sw) return;
        sw.addEventListener("statechange", ()=>{
          if(sw.state === "installed" && navigator.serviceWorker.controller){
            toast("Updated — refresh");
          }
        });
      });
    }catch(err){
      console.warn("SW failed:", err);
    }
  })();

  // ---------- Helpers ----------
  function escapeRegExp(s){ return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

  function sanitizeFilename(name){
    return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, "_").slice(0, 80) || "document";
  }

  function wrapForDocx(title, bodyHtml){
    return `<!doctype html>
<html><head><meta charset="utf-8">
<style>
  body{ font-family: Arial, sans-serif; line-height:1.55; }
  h1{ font-size:18px; margin:0 0 12px 0; }
</style>
</head><body>
<h1>${escapeHtml(title)}</h1>
${bodyHtml}
</body></html>`;
  }

  function escapeHtml(s){
    return (s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  }

  function normalizeEditor(){
    if(!editor) return;
    // Clean placeholder if mixed in
    const ph = editor.querySelector(".placeholder");
    if(ph && editor.textContent.trim() !== "Tap here to start typing ✨"){
      ph.remove();
    }
    // Remove empty spans
    editor.querySelectorAll("span").forEach(sp=>{
      if(!sp.textContent.trim() && !sp.attributes.length) sp.remove();
    });
  }

  function applyInlineStyleToSelection(styles){
    const sel = window.getSelection();
    if(!sel || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    if(range.collapsed) return toast("Select text first");
    const span = document.createElement("span");
    Object.assign(span.style, styles);
    span.appendChild(range.extractContents());
    range.insertNode(span);
    // Reselect content
    sel.removeAllRanges();
    const nr = document.createRange();
    nr.selectNodeContents(span);
    sel.addRange(nr);
  }

  // Select text by character offsets in editor's textContent
  function selectTextRangeInEditor(start, end){
    if(!editor) return;
    const walker = document.createTreeWalker(editor, NodeFilter.SHOW_TEXT, null);
    let node, idx = 0;
    let startNode=null, endNode=null, startOffset=0, endOffset=0;

    while((node = walker.nextNode())){
      const len = node.nodeValue.length;
      if(startNode === null && idx + len >= start){
        startNode = node;
        startOffset = start - idx;
      }
      if(idx + len >= end){
        endNode = node;
        endOffset = end - idx;
        break;
      }
      idx += len;
    }

    if(!startNode || !endNode) return;

    const range = document.createRange();
    range.setStart(startNode, startOffset);
    range.setEnd(endNode, endOffset);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    editor.focus();
  }

  // ---------- Startup ----------
  window.addEventListener("load", ()=>{
    // Default title from local storage if present
    const t = localStorage.getItem(TITLE_KEY);
    if($("docTitle") && t) $("docTitle").value = t;
    loadLocal();
    updateStats();
  });

})();