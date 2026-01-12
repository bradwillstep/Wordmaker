const editor = document.getElementById("editor");
const toastEl = document.getElementById("toast");
const PLACEHOLDER = "Tap here to start typing ✨";
const STORAGE_KEY = "wordmaker-doc";

function toast(msg){
  if(!toastEl) return;
  toastEl.textContent = msg;
  toastEl.classList.remove("hidden");
  clearTimeout(window.__toastTimer);
  window.__toastTimer = setTimeout(()=>toastEl.classList.add("hidden"), 1600);
}

function clearPlaceholder(){
  if(editor && editor.innerText.trim() === PLACEHOLDER) editor.innerHTML = "";
}
editor?.addEventListener("focus", clearPlaceholder);

document.getElementById("newDoc")?.addEventListener("click", ()=>{
  editor.innerHTML = "";
  editor.focus();
});

document.getElementById("saveDoc")?.addEventListener("click", ()=>{
  localStorage.setItem(STORAGE_KEY, editor.innerHTML);
  toast("Saved");
});

window.addEventListener("load", ()=>{
  const saved = localStorage.getItem(STORAGE_KEY);
  if(saved) editor.innerHTML = saved;
});

document.getElementById("resetApp")?.addEventListener("click", ()=>{
  if(confirm("Reset Wordmaker?")) {
    localStorage.clear();
    location.reload();
  }
});

function downloadFile(content, filename, type){
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

document.getElementById("exportTxt")?.addEventListener("click", ()=>{
  downloadFile(editor.innerText, "document.txt", "text/plain;charset=utf-8");
});
document.getElementById("exportDocx")?.addEventListener("click", ()=>{
  downloadFile(editor.innerText, "document.docx", "application/vnd.openxmlformats-officedocument.wordprocessingml.document");
});
document.getElementById("exportPdf")?.addEventListener("click", ()=>{
  downloadFile(editor.innerText, "document.pdf", "application/pdf");
});
