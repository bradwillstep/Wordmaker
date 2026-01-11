# Wordmaker

Wordmaker is a lightweight, browser-based writing app designed to work like a simplified Microsoft Word — fully client-side, GitHub Pages–friendly, and offline-capable.

No accounts. No servers. Your writing stays on your device.

---

## Files

This project runs entirely in the browser and uses only static files:

- `index.html` — App shell + UI
- `style.css` — Styling
- `script.js` — Core editor logic (toolbar, saving, export, PWA)
- `ai.js` — **Open-source AI tools (writer, calculator, grammar)**
- `manifest.webmanifest` — PWA configuration
- `service-worker.js` — Offline cache + update control
- `icon-192.png`, `icon-512.png` — App icons

---

## Features

### Core editor
- Rich text toolbar (bold, italic, underline, strike)
- Fonts + font sizes
- Alignment (left, center, right, justify)
- Lists, indent/outdent
- Page Mode (letter-style paper view)
- Undo / redo
- Word & character count
- Autosave (localStorage)
- Portable open/save (`.wm.json`)
- Print

### Export
- **DOCX** (real Word documents)
- **PDF**

### PWA
- “Add to Home Screen”
- Fullscreen app (no browser chrome)
- Offline-ready
- Auto-update with forced refresh when a new version is deployed

---

## Open-Source AI Tools (Local, In-Browser)

Wordmaker includes optional AI tools that run **entirely in the browser** using open-source projects.

No cloud APIs. No data leaves your device.

### AI Writer
- Generate paragraphs, rewrite text, continue writing
- Uses a small open-source language model via `transformers.js`

### AI Calculator
- Natural-language math
- Step-by-step explanations

### AI Spellcheck & Grammar
- Grammar, spelling, and style suggestions
- Runs offline using WebAssembly

### Technologies used
- **Transformers.js** (browser inference)
- **Qwen2.5-0.5B-Instruct (ONNX)** — small open-source LLM
- **Harper** — open-source grammar & spell
