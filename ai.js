// Wordmaker AI (Open Source, Local-in-Browser)
// Writer + Calculator: Transformers.js (runs on-device; first run downloads model)
// Spell/Grammar: Harper (WASM)

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
  try {
    document.execCommand("insertText", false, text);
  } catch {
    const sel = window.getSelection();
    if (!sel || sel.rangeCount === 0) return;
    sel.deleteFromDocument();
    sel.getRangeAt(0).insertNode(document.createTextNode(text));
  }
}

function setMode(mode) {
  window.__ai_mode = mode;

  $("tabWriter")?.classList.toggle("active", mode === "writer");
  $("tabCalc")?.classList.toggle("active", mode === "calc");
  $("tabGrammar")?.classList.toggle("active", mode === "grammar");

  const label = $("aiLabel");
  const input = $("aiInput");
  const lintWrap = $("lintWrap");

  if (lintWrap) lintWrap.classList.toggle("hidden", mode !== "grammar");

  if (mode === "writer") {
    if (label) label.textContent = "Instruction";
    if (input) input.placeholder = "Write a paragraph about...";
  } else if (mode === "calc") {
    if (label) label.textContent = "Question / Expression";
    if (input) input.placeholder = "Example: What is 18% of 249.95? Show steps.";
  } else {
    if (label) label.textContent = "How should I improve it?";
    if (input) input.placeholder = "Optional: Make it more formal / shorter / friendlier...";
  }

  setStatus("Ready.");
  if ($("aiOutput")) $("aiOutput").value = "";
  if ($("lints")) $("lints").textContent = "No suggestions yet.";
}

async function ensureGenerator() {
  if (generator) return generator;

  const hasWebGPU = !!navigator.gpu;
  const device = hasWebGPU ? "webgpu" : "wasm";

  setStatus(`Loading AI model… (${device})`);
  toast("Loading AI model… (first run downloads files)");

  generator = await pipeline("text-generation", MODEL_ID, {
    dtype: "q4",
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

function renderLints(items) {
  const wrap = $("lints");
  if (!wrap) return;

  if (!items || items.length === 0) {
    wrap.textContent = "No issues found 🎉";
    return;
  }

  wrap.innerHTML = "";
  for (const lint of items) {
    const div = document.createElement("div");
    div.className = "lintItem";

    const msg = document.createElement("div");
    msg.textContent = lint.message();
    div.appendChild(msg);

    const sug = (typeof lint.suggestions === "function") ? (lint.suggestions() || []) : [];
    if (sug.length) {
      const chips = document.createElement("div");
      chips.className = "chips";
      sug.slice(0, 6).forEach(s => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "chip";
        b.textContent = s.replacementText ?? String(s);
        b.addEventListener("click", () => {
          replaceSelection(b.textContent);
          toast("Applied");
        });
        chips.appendChild(b);
      });
      div.appendChild(chips);
    }

    wrap.appendChild(div);
  }
}

async function runWriter() {
  const instruction = $("aiInput")?.value || "";
  const useSel = $("useSelection")?.checked;
  const sel = useSel ? getSelectionText() : "";

  const prompt = [
    "You are an assistant inside a writing app.",
    "Write helpful, natural-sounding text.",
    sel ? `Context:\n${sel}\n` : "",
    `Instruction:\n${instruction}\n`,
    "Output:"
  ].join("\n");

  const gen = await ensureGenerator();
  setStatus("Generating…");
  const res = await gen(prompt, { max_new_tokens: 220, temperature: 0.7, top_p: 0.9 });
  const text = Array.isArray(res) ? (res[0]?.generated_text ?? "") : (res?.generated_text ?? "");
  const cleaned = text.replace(prompt, "").trim();
  if ($("aiOutput")) $("aiOutput").value = cleaned || text;
  setStatus("Done.");
}

async function runCalc() {
  const q = $("aiInput")?.value || "";
  const useSel = $("useSelection")?.checked;
  const sel = useSel ? getSelectionText() : "";

  const prompt = [
    "You are an accurate calculator and explainer.",
    "Show steps clearly.",
    sel ? `Context:\n${sel}\n` : "",
    `Question:\n${q}\n`,
    "Answer:"
  ].join("\n");

  const gen = await ensureGenerator();
  setStatus("Calculating…");
  const res = await gen(prompt, { max_new_tokens: 220, temperature: 0.2, top_p: 0.9 });
  const text = Array.isArray(res) ? (res[0]?.generated_text ?? "") : (res?.generated_text ?? "");
  const cleaned = text.replace(prompt, "").trim();
  if ($("aiOutput")) $("aiOutput").value = cleaned || text;
  setStatus("Done.");
}

async function runGrammar() {
  const hint = $("aiInput")?.value || "";
  const useSel = $("useSelection")?.checked;
  const sel = getSelectionText();

  if (!useSel || !sel) {
    toast("Select text first, then run Spell/Grammar.");
    setStatus("Select text to check.");
    return;
  }

  const lin = await ensureLinter();
  setStatus("Checking…");
  const items = await lin.lint(sel);
  renderLints(items);

  // Optional corrected rewrite into output
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

  const res = await gen(prompt, { max_new_tokens: 260, temperature: 0.2, top_p: 0.9 });
  const text = Array.isArray(res) ? (res[0]?.generated_text ?? "") : (res?.generated_text ?? "");
  const cleaned = text.replace(prompt, "").trim();
  if ($("aiOutput")) $("aiOutput").value = cleaned || text;

  setStatus("Done.");
}

function openAI() {
  $("dlgAI")?.showModal();
  setMode(window.__ai_mode || "writer");
}

function closeAI() {
  $("dlgAI")?.close();
}

function wire() {
  $("aiBtn")?.addEventListener("click", openAI);
  $("aiClose")?.addEventListener("click", closeAI);

  $("tabWriter")?.addEventListener("click", () => setMode("writer"));
  $("tabCalc")?.addEventListener("click", () => setMode("calc"));
  $("tabGrammar")?.addEventListener("click", () => setMode("grammar"));

  $("aiRun")?.addEventListener("click", async () => {
    try {
      const mode = window.__ai_mode || "writer";
      if (mode === "writer") await runWriter();
      else if (mode === "calc") await runCalc();
      else await runGrammar();
    } catch (e) {
      console.warn(e);
      setStatus("Error. See console.");
      toast("AI error (see console)");
    }
  });

  $("aiInsert")?.addEventListener("click", () => {
    const t = $("aiOutput")?.value || "";
    if (!t) return toast("Nothing to insert");
    replaceSelection(t);
    toast("Inserted");
  });

  $("aiReplace")?.addEventListener("click", () => {
    const t = $("aiOutput")?.value || "";
    if (!t) return toast("Nothing to replace with");
    replaceSelection(t);
    toast("Replaced");
  });

  setMode("writer");
}

window.addEventListener("load", wire);
