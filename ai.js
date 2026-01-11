// Wordmaker AI Tools (open source) - runs in browser
// - Transformers.js + onnx-community/Qwen2.5-0.5B-Instruct (WebGPU when available)
// - Harper (WASM) for offline spell/grammar suggestions
//
// Notes:
// - First run downloads model artifacts and caches them (IndexedDB / Cache Storage).
// - Works best in Chrome with WebGPU enabled on most modern devices.

import { pipeline } from "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.0";
import { binaryInlined, WorkerLinter } from "https://unpkg.com/harper.js@0.54.0/dist/harper.js";

const MODEL_ID = "onnx-community/Qwen2.5-0.5B-Instruct";

let generator = null;
let linter = null;

const $ = (id) => document.getElementById(id);

function toast(msg) {
  const t = $("toast");
  if (!t) return;
  t.textContent = msg;
  t.classList.remove("hidden");
  clearTimeout(window.__ai_toast_timer);
  window.__ai_toast_timer = setTimeout(() => t.classList.add("hidden"), 1600);
}

function setStatus(msg) {
  const el = $("aiStatus");
  if (el) el.textContent = msg;
}

function getSelectionText() {
  const sel = window.getSelection();
  return sel ? sel.toString() : "";
}

function replaceSelection(text) {
  // Replace current selection with plain text (keeps surrounding formatting)
  try {
    document.execCommand("insertText", false, text);
  } catch {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    sel.deleteFromDocument();
    sel.getRangeAt(0).insertNode(document.createTextNode(text));
  }
}

async function ensureGenerator() {
  if (generator) return generator;

  const hasWebGPU = !!navigator.gpu;
  const device = hasWebGPU ? "webgpu" : "wasm";
  setStatus(`Loading AI model… (device: ${device})`);
  toast("Loading AI model…");

  generator = await pipeline("text-generation", MODEL_ID, {
    dtype: "q4",   // 4-bit quantization (smaller/faster)
    device
  });

  setStatus("AI model ready.");
  toast("AI ready");
  return generator;
}

async function ensureLinter() {
  if (linter) return linter;
  setStatus("Loading grammar engine…");
  linter = new WorkerLinter({ binary: binaryInlined });
  setStatus("Grammar engine ready.");
  return linter;
}

function openDialog(mode) {
  const dlg = $("dlgAI");
  if (!dlg) return;
  dlg.showModal();
  setMode(mode);
}

function setMode(mode) {
  const writer = $("aiTabWriter");
  const calc = $("aiTabCalc");
  const grammar = $("aiTabGrammar");
  const label = $("aiLabel");
  const input = $("aiInput");
  const lintWrap = $("aiLintWrap");

  writer?.classList.remove("aiTab--active");
  calc?.classList.remove("aiTab--active");
  grammar?.classList.remove("aiTab--active");
  lintWrap?.classList.add("hidden");

  window.__ai_mode = mode;

  if (mode === "writer") {
    writer?.classList.add("aiTab--active");
    if (label) label.textContent = "Instruction";
    if (input) input.placeholder = "Write a paragraph about...";
  } else if (mode === "calc") {
    calc?.classList.add("aiTab--active");
    if (label) label.textContent = "Question / Expression";
    if (input) input.placeholder = "Example: What is 18% of 249.95? Show steps.";
  } else {
    grammar?.classList.add("aiTab--active");
    if (label) label.textContent = "What should I improve?";
    if (input) input.placeholder = "Optional: e.g., Make it more formal / friendlier / shorter...";
    lintWrap?.classList.remove("hidden");
  }

  setStatus("Ready.");
  const out = $("aiOutput");
  if (out) out.value = "";
  const lints = $("aiLints");
  if (lints) lints.textContent = "No suggestions yet.";
}

function renderLints(lints) {
  const wrap = $("aiLints");
  if (!wrap) return;

  if (!lints || lints.length === 0) {
    wrap.textContent = "No issues found 🎉";
    return;
  }

  wrap.innerHTML = "";
  for (const lint of lints) {
    const item = document.createElement("div");
    item.className = "aiLintItem";

    const msg = document.createElement("div");
    msg.className = "aiLintMsg";
    msg.textContent = lint.message();

    const sugWrap = document.createElement("div");
    sugWrap.className = "aiLintSug";

    const suggestions = (typeof lint.suggestions === "function") ? (lint.suggestions() || []) : [];
    if (suggestions.length === 0) {
      const none = document.createElement("div");
      none.style.color = "rgba(255,255,255,.7)";
      none.style.fontSize = "12px";
      none.textContent = "No suggestion available.";
      sugWrap.appendChild(none);
    } else {
      for (const s of suggestions.slice(0, 6)) {
        const chip = document.createElement("button");
        chip.type = "button";
        chip.className = "aiChip";
        chip.textContent = s.replacementText ?? String(s);

        chip.addEventListener("click", () => {
          replaceSelection(chip.textContent);
          toast("Applied");
        });

        sugWrap.appendChild(chip);
      }
    }

    item.appendChild(msg);
    item.appendChild(sugWrap);
    wrap.appendChild(item);
  }
}

async function runWriter() {
  const out = $("aiOutput");
  const instruction = $("aiInput")?.value || "";
  const useSel = $("aiUseSelection")?.checked;
  const sel = useSel ? getSelectionText() : "";

  const prompt = [
    "You are an assistant inside a writing app.",
    "Write helpful, natural-sounding text.",
    "If context is provided, continue in the same tone.",
    "",
    sel ? `Context (selected text):\n${sel}\n` : "",
    `Instruction:\n${instruction}\n`,
    "Output:"
  ].join("\n");

  const gen = await ensureGenerator();
  setStatus("Generating…");
  const res = await gen(prompt, {
    max_new_tokens: 220,
    temperature: 0.7,
    top_p: 0.9
  });

  const text = Array.isArray(res) ? (res[0]?.generated_text ?? "") : (res?.generated_text ?? "");
  const cleaned = text.replace(prompt, "").trim();
  if (out) out.value = cleaned || text;
  setStatus("Done.");
}

async function runCalc() {
  const out = $("aiOutput");
  const q = $("aiInput")?.value || "";
  const useSel = $("aiUseSelection")?.checked;
  const sel = useSel ? getSelectionText() : "";

  const prompt = [
    "You are an accurate calculator and explainer.",
    "Show steps clearly.",
    "",
    sel ? `Context (selected text):\n${sel}\n` : "",
    `Question:\n${q}\n`,
    "Answer:"
  ].join("\n");

  const gen = await ensureGenerator();
  setStatus("Calculating…");
  const res = await gen(prompt, {
    max_new_tokens: 220,
    temperature: 0.2,
    top_p: 0.9
  });

  const text = Array.isArray(res) ? (res[0]?.generated_text ?? "") : (res?.generated_text ?? "");
  const cleaned = text.replace(prompt, "").trim();
  if (out) out.value = cleaned || text;
  setStatus("Done.");
}

async function runGrammar() {
  const out = $("aiOutput");
  const hint = $("aiInput")?.value || "";
  const useSel = $("aiUseSelection")?.checked;
  const sel = getSelectionText();

  if (!useSel || !sel) {
    toast("Select text first, then enable “Use selected text as context”.");
    setStatus("Select text to check.");
    return;
  }

  const lin = await ensureLinter();
  setStatus("Checking…");
  const lints = await lin.lint(sel);

  // Optional AI rewrite (corrected text) into output box
  const gen = await ensureGenerator();
  const prompt = [
    "You are an editor. Fix spelling and grammar, keep meaning.",
    hint ? `Extra instruction: ${hint}` : "",
    "",
    "Text:",
    sel,
    "",
    "Corrected:"
  ].join("\n");

  const res = await gen(prompt, {
    max_new_tokens: 260,
    temperature: 0.2,
    top_p: 0.9
  });

  const text = Array.isArray(res) ? (res[0]?.generated_text ?? "") : (res?.generated_text ?? "");
  const cleaned = text.replace(prompt, "").trim();
  if (out) out.value = cleaned || text;

  renderLints(lints);
  setStatus("Done.");
}

function wireUI() {
  $("btnAIWriter")?.addEventListener("click", () => openDialog("writer"));
  $("btnAICalc")?.addEventListener("click", () => openDialog("calc"));
  $("btnAICheck")?.addEventListener("click", () => openDialog("grammar"));

  $("aiTabWriter")?.addEventListener("click", () => setMode("writer"));
  $("aiTabCalc")?.addEventListener("click", () => setMode("calc"));
  $("aiTabGrammar")?.addEventListener("click", () => setMode("grammar"));

  $("aiRun")?.addEventListener("click", async () => {
    try {
      const mode = window.__ai_mode || "writer";
      if (mode === "writer") await runWriter();
      else if (mode === "calc") await runCalc();
      else await runGrammar();
    } catch (e) {
      console.warn(e);
      setStatus("Error. See console.");
      toast("AI error");
    }
  });

  $("aiInsert")?.addEventListener("click", () => {
    const text = $("aiOutput")?.value || "";
    if (!text) return toast("Nothing to insert");
    replaceSelection(text);
    toast("Inserted");
  });

  $("aiReplace")?.addEventListener("click", () => {
    const text = $("aiOutput")?.value || "";
    if (!text) return toast("Nothing to replace with");
    replaceSelection(text);
    toast("Replaced");
  });

  setMode("writer");
}

window.addEventListener("load", wireUI);
