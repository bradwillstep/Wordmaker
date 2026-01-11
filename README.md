<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Free Wordmaker (Characters + Embedded AI + AI Calc)</title>
  <style>
    :root{
      color-scheme: dark;
      --bg:#120b10; --card:#1a1018; --border:rgba(255,255,255,.10);
      --muted:rgba(255,242,251,.78); --text:#fff2fb;
      --btn:#231420; --btnBorder:rgba(255,255,255,.14);
      --accent:#ff6bd6; --accentSoft:rgba(255,107,214,.16);
      --pattern:
        radial-gradient(circle at 20% 20%, rgba(255,107,214,.18) 0 18%, transparent 19%),
        radial-gradient(circle at 80% 35%, rgba(255,255,255,.06) 0 16%, transparent 17%),
        linear-gradient(135deg, rgba(255,255,255,.04) 0 12%, transparent 13% 100%);
      --mascot: none;
      --shadow: 0 18px 44px rgba(0,0,0,.35);
    }

    body{
      margin:0;font-family:system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
      background:var(--bg);color:var(--text);
      background-image: var(--pattern);
      background-size: 240px 240px;
      background-attachment: fixed;
    }
    header{
      position:sticky;top:0;z-index:50;
      background: color-mix(in srgb, var(--bg) 88%, rgba(255,255,255,.02));
      border-bottom:1px solid rgba(255,255,255,.08);
      padding:10px 10px;
      backdrop-filter: blur(10px);
    }
    .wrap{max-width:1180px;margin:0 auto;}
    .bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;}
    .left,.right{display:flex;flex-wrap:wrap;gap:8px;align-items:center;}
    input[type="text"], input[type="password"], select, textarea{
      background:var(--btn);color:var(--text);
      border:1px solid var(--btnBorder);
      border-radius:12px;padding:10px 12px;font-family:inherit;
    }
    input[type="text"]{min-width:190px;max-width:70vw;}
    button{
      background:var(--btn);color:var(--text);
      border:1px solid var(--btnBorder);
      border-radius:12px;padding:10px 12px;cursor:pointer
    }
    button:hover{border-color:rgba(255,255,255,.26)}
    button:disabled{opacity:.55;cursor:not-allowed}
    .note{color:var(--muted);font-size:13px;line-height:1.35;margin-top:8px}
    .status{color:rgba(255,255,255,.75);font-size:12px;margin-top:6px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace;white-space:pre-wrap}
    main{max-width:1180px;margin:0 auto;padding:14px;display:grid;gap:12px;grid-template-columns:1fr;}
    .pageHint{color:rgba(255,255,255,.68);font-size:12px;margin:2px 2px 0}
    .chip{font-size:12px;border:1px solid var(--btnBorder);padding:6px 10px;border-radius:999px;opacity:.92}
    .row2{display:grid;grid-template-columns:1fr 1fr;gap:10px}
    @media (max-width: 920px){ .row2{grid-template-columns:1fr;} }

    /* TinyMCE chrome */
    .tox.tox-tinymce{border-radius:16px;border:1px solid var(--border) !important;overflow:hidden;box-shadow: var(--shadow)}
    .tox .tox-toolbar__primary{flex-wrap:wrap !important;}

    /* Mascot strip */
    .mascotBar{margin-top:8px;display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;}
    .mascotWrap{
      display:flex;gap:10px;align-items:center;padding:8px 10px;
      border:1px solid var(--border);
      background: color-mix(in srgb, var(--card) 88%, rgba(255,255,255,.03));
      border-radius:18px;box-shadow: 0 10px 30px rgba(0,0,0,.25);
      overflow:hidden;position:relative;
    }
    .mascotWrap:before{
      content:"";position:absolute;inset:-30px -30px auto auto;width:120px;height:120px;
      background: var(--accentSoft);filter: blur(2px);border-radius:50%;opacity:.75;
    }
    .mascot{width:52px;height:52px;border-radius:16px;background: var(--mascot);
      box-shadow: 0 10px 24px rgba(0,0,0,.25);border:1px solid rgba(255,255,255,.12);flex:0 0 auto;}
    .mascotText{position:relative;z-index:1}
    .mascotText strong{font-size:13px}
    .mascotText div{font-size:12px;opacity:.78;line-height:1.2;margin-top:2px}

    /* Tools Drawer */
    .drawerBack{position:fixed;inset:0;background:rgba(0,0,0,.55);display:none;z-index:2000}
    .drawer{position:fixed;right:0;top:0;height:100%;width:min(600px, 96vw);background:var(--card);border-left:1px solid var(--border);
      display:none;z-index:2001;overflow:auto}
    .drawerHead{display:flex;gap:10px;align-items:center;justify-content:space-between;padding:12px;border-bottom:1px solid var(--border);
      background: linear-gradient(90deg, color-mix(in srgb, var(--card) 80%, rgba(255,255,255,.05)), color-mix(in srgb, var(--card) 80%, rgba(0,0,0,.05)));
    }
    .drawerBody{padding:12px}
    .section{border:1px solid var(--border);border-radius:16px;padding:12px;margin-bottom:12px;background:rgba(255,255,255,.02)}
    .section h3{margin:0 0 8px;font-size:13px;opacity:.92}
    .small{font-size:12px;opacity:.78;line-height:1.35}
    .issues{display:flex;flex-direction:column;gap:10px;margin-top:10px}
    .issue{border:1px solid var(--border);border-radius:14px;padding:10px;background:rgba(0,0,0,.12)}
    .issue strong{font-size:12px}
    .sugs{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
    .sug{font-size:12px;padding:6px 10px;border-radius:999px;border:1px solid var(--btnBorder);cursor:pointer;background:rgba(255,255,255,.02)}
    .sug:hover{border-color:var(--accent)}

    /* Embedded AI */
    iframe{width:100%;height:520px;border:1px solid var(--border);border-radius:16px;background:rgba(0,0,0,.2);}
    .aiPaste{width:100%;min-height:110px;resize:vertical;cursor:text;margin-top:8px}

    /* Calculator dropdown */
    .menuWrap{position:relative;}
    .dropdown{
      position:absolute;right:0;top:44px;width:min(420px, 92vw);
      background:var(--card);border:1px solid var(--border);border-radius:18px;
      box-shadow: 0 20px 55px rgba(0,0,0,.45);
      padding:12px;display:none;z-index:3000;
    }
    .dropdown .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
    .calcGrid{display:grid;grid-template-columns: repeat(4, 1fr);gap:8px;margin-top:10px;}
    .calcGrid button{padding:12px 0;border-radius:14px}
    .calcDisplay{width:100%;font-size:16px;cursor:text}
    .calcOut{margin-top:8px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace;font-size:12px;white-space:pre-wrap;opacity:.9}
    .divider{height:1px;background:rgba(255,255,255,.10);margin:10px 0}
  </style>
</head>
<body>
  <header>
    <div class="wrap">
      <div class="bar">
        <div class="left">
          <input id="docTitle" type="text" value="Untitled document" aria-label="Document title" />
          <button id="btnNew">New</button>
          <button id="btnSave">Save</button>
          <button id="btnOpen">Open</button>
          <input id="fileOpen" type="file" accept=".html,text/html" style="display:none" />
        </div>
        <div class="right">
          <select id="skin" title="Character skins">
            <option value="bunny" selected>🐰 Bunny</option>
            <option value="shark">🦈 Shark</option>
            <option value="tiger">🐯 Tiger</option>
            <option value="zebra">🦓 Zebra</option>
            <option value="lion">🦁 Lion</option>
            <option value="cat">🐱 Cat</option>
            <option value="dog">🐶 Dog</option>
          </select>

          <div class="menuWrap">
            <button id="btnCalc">Calculator ▾</button>
            <div id="calcMenu" class="dropdown">
              <div class="small">Basic calc + AI Solve. (AI Solve needs your API key in Tools, or use Embedded AI below.)</div>
              <input id="calcDisplay" class="calcDisplay" type="text" placeholder="Type expression: (24*3)+7/2" />
              <div class="row" style="margin-top:8px;justify-content:space-between;">
                <button id="calcEval">=</button>
                <button id="calcClear">C</button>
                <button id="calcBack">⌫</button>
                <button id="calcAISolve" disabled>AI Solve</button>
              </div>

              <div class="calcGrid" id="calcKeys"></div>

              <div class="divider"></div>
              <div class="small">Paste a math problem (word problem ok):</div>
              <textarea id="calcProblem" rows="4" style="width:100%;min-height:90px;resize:vertical;margin-top:8px;cursor:text;"></textarea>
              <button id="calcAISolve2" style="margin-top:8px;width:100%;" disabled>AI Solve Problem</button>
              <div id="calcOut" class="calcOut"></div>
            </div>
          </div>

          <button id="btnDocx">Export DOCX</button>
          <button id="btnPdf">Export PDF</button>
          <button id="btnPrint">Print</button>
          <button id="btnTools">Tools</button>
        </div>
      </div>

      <div class="bar" style="margin-top:8px;">
        <div class="left" style="flex:1;">
          <input id="headerText" type="text" placeholder="Header (print/PDF)" style="flex:1;min-width:220px;" />
          <input id="footerText" type="text" placeholder="Footer (print/PDF)" style="flex:1;min-width:220px;" />
        </div>
        <div class="right">
          <span class="chip">Spellcheck: Chrome</span>
          <span class="chip">Grammar: LanguageTool</span>
          <span class="chip">Embedded AI: Hugging Face</span>
        </div>
      </div>

      <div class="mascotBar">
        <div class="mascotWrap">
          <div class="mascot" id="mascot"></div>
          <div class="mascotText">
            <strong id="skinTitle">Bunny</strong>
            <div id="skinTag">fluffy punk • white • cozy</div>
          </div>
        </div>
        <div class="note" style="max-width:680px;">
          Embedded AI is free-ish and may be slow/limited. For the best AI tools, users can add their own key in Tools (optional).
        </div>
      </div>

      <div id="status" class="status">Status: loading…</div>
      <div class="pageHint">Tools includes Grammar + Embedded AI + optional AI writing + AI calculator solve.</div>
    </div>
  </header>

  <main>
    <textarea id="editor"></textarea>
  </main>

  <!-- Tools Drawer -->
  <div class="drawerBack" id="drawerBack"></div>
  <aside class="drawer" id="drawer">
    <div class="drawerHead">
      <strong style="font-size:13px;">Tools</strong>
      <div style="display:flex;gap:8px;align-items:center;">
        <button id="btnCloseTools">Close</button>
      </div>
    </div>
    <div class="drawerBody">

      <div class="section">
        <h3>Embedded AI writing panel (no key)</h3>
        <div class="small">
          This is an embedded Hugging Face Space. Because of browser security, we can't auto-insert your selection into the iframe.
          Use the buttons below to copy/paste.
        </div>

        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
          <button id="btnCopySelection">Copy Selection</button>
          <button id="btnCopyAll">Copy Entire Document</button>
          <button id="btnOpenEmbed">Open AI in new tab</button>
        </div>

        <div class="small" style="margin-top:10px;">Paste AI output here, then insert it into your doc:</div>
        <textarea id="embedResult" class="aiPaste" placeholder="Paste the AI output here…"></textarea>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
          <button id="btnReplaceWithEmbed">Replace Selection with Pasted Output</button>
          <button id="btnInsertEmbed">Insert Pasted Output at Cursor</button>
        </div>

        <div style="margin-top:10px;">
          <iframe id="embedFrame" title="Embedded AI Space"></iframe>
        </div>
      </div>

      <div class="section">
        <h3>Grammar checker (free)</h3>
        <div class="small">Uses LanguageTool public API. Click a suggestion to apply (best‑effort). May rate‑limit.</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
          <button id="btnGrammar">Check Grammar</button>
          <button id="btnClearIssues">Clear Results</button>
        </div>
        <div id="issues" class="issues"></div>
      </div>

      <div class="section">
        <h3>Optional AI (Bring your own key)</h3>
        <div class="small">
          Enables AI writing buttons + AI Solve in calculator. Stored only in your browser.
        </div>

        <div class="row2" style="margin-top:10px;">
          <div>
            <div class="small" style="margin-bottom:6px;opacity:.85;">API Base URL</div>
            <input id="apiBase" type="text" value="https://api.openai.com/v1/responses" />
          </div>
          <div>
            <div class="small" style="margin-bottom:6px;opacity:.85;">Model</div>
            <input id="apiModel" type="text" value="gpt-4.1-mini" />
          </div>
        </div>

        <div style="margin-top:10px;">
          <div class="small" style="margin-bottom:6px;opacity:.85;">API Key</div>
          <input id="apiKey" type="password" placeholder="Paste key to enable AI" />
        </div>

        <div style="margin-top:10px;">
          <div class="small" style="margin-bottom:6px;opacity:.85;">Instruction</div>
          <textarea id="aiInstruction" style="min-height:90px;">Rewrite the selected text to be clearer and more professional while keeping the meaning. Preserve names and facts. Return only the rewritten text.</textarea>
        </div>

        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
          <button id="btnRewrite" disabled>Rewrite Selection</button>
          <button id="btnExpand" disabled>Expand Selection</button>
          <button id="btnSumm" disabled>Summarize Selection</button>
          <button id="btnInsert" disabled>Continue Here</button>
          <button id="btnSaveKey">Save Key</button>
          <button id="btnForgetKey">Forget Key</button>
        </div>

        <div class="small" id="aiNote" style="margin-top:10px;opacity:.85">AI disabled (optional).</div>
      </div>
    </div>
  </aside>

  <!-- TinyMCE -->
  <script src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/8.1.2/tinymce.min.js"></script>
  <!-- DOCX export -->
  <script src="https://cdn.jsdelivr.net/npm/html-docx-js@0.3.1/dist/html-docx.js"></script>
  <!-- PDF export -->
  <script src="https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js"></script>

  <script>
    // ---------- Helpers ----------
    const $ = (id) => document.getElementById(id);
    const statusEl = $("status");
    const titleEl = $("docTitle");
    const headerEl = $("headerText");
    const footerEl = $("footerText");
    const skinEl = $("skin");
    const fileOpenEl = $("fileOpen");
    const mascotEl = $("mascot");
    const skinTitleEl = $("skinTitle");
    const skinTagEl = $("skinTag");

    function setStatus(s){ statusEl.textContent = "Status: " + s; }
    function safeFilename(name){ return (name||"document").trim().replace(/[\\/:*?"<>|]+/g,"-").slice(0,80)||"document"; }
    function downloadBlob(blob, filename){
      const a=document.createElement("a");
      a.href=URL.createObjectURL(blob);
      a.download=filename;
      a.click();
      setTimeout(()=>URL.revokeObjectURL(a.href),1500);
    }

    // ---------- Local persistence ----------
    const LS_CONTENT = "freeword_v6_content";
    const LS_META = "freeword_v6_meta";
    const LS_APIKEY = "freeword_v6_apikey";

    function saveLocal(){
      const content = tinymce.activeEditor.getContent({format:"html"});
      localStorage.setItem(LS_CONTENT, content);
      localStorage.setItem(LS_META, JSON.stringify({
        title: titleEl.value || "Untitled document",
        header: headerEl.value || "",
        footer: footerEl.value || "",
        skin: skinEl.value || "bunny",
        apiBase: $("apiBase").value || "",
        apiModel: $("apiModel").value || "",
        savedAt: Date.now()
      }));
      setStatus("saved locally ✅");
    }
    function loadLocal(){
      const meta = localStorage.getItem(LS_META);
      const content = localStorage.getItem(LS_CONTENT);
      if (meta){
        try{
          const m=JSON.parse(meta);
          if (m.title) titleEl.value=m.title;
          if (m.header!==undefined) headerEl.value=m.header;
          if (m.footer!==undefined) footerEl.value=m.footer;
          if (m.skin) skinEl.value=m.skin;
          if (m.apiBase) $("apiBase").value = m.apiBase;
          if (m.apiModel) $("apiModel").value = m.apiModel;
        }catch{}
      }
      const k = localStorage.getItem(LS_APIKEY);
      if (k) $("apiKey").value = k;
      applySkin(skinEl.value || "bunny");
      if (content) tinymce.activeEditor.setContent(content,{format:"html"});
      updateAiEnabled();
    }

    // ---------- Character skins (patterns + mascots) ----------
    function svgData(svg){ return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`; }

    const SKINS = {
      bunny: {
        title:"Bunny",
        tag:"fluffy punk • white • cozy",
        vars:{ bg:"#120b10", card:"#1a1018", btn:"#231420", text:"#fff2fb", muted:"rgba(255,242,251,.78)", accent:"#ff6bd6",
          pattern:
            `radial-gradient(circle at 20% 20%, rgba(255,107,214,.18) 0 18%, transparent 19%),
             radial-gradient(circle at 80% 35%, rgba(255,255,255,.06) 0 16%, transparent 17%),
             linear-gradient(135deg, rgba(255,255,255,.04) 0 12%, transparent 13% 100%)`
        },
        mascot: svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
          <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
            <stop stop-color='#ffffff' offset='0'/><stop stop-color='#ffd7ef' offset='1'/></linearGradient></defs>
          <rect width='96' height='96' rx='22' fill='#1f1026'/>
          <circle cx='48' cy='54' r='28' fill='url(#g)'/>
          <ellipse cx='32' cy='24' rx='10' ry='22' fill='url(#g)'/>
          <ellipse cx='64' cy='24' rx='10' ry='22' fill='url(#g)'/>
          <ellipse cx='32' cy='28' rx='6' ry='14' fill='#ff6bd6' opacity='.35'/>
          <ellipse cx='64' cy='28' rx='6' ry='14' fill='#ff6bd6' opacity='.35'/>
          <circle cx='38' cy='54' r='4' fill='#1b0f16'/><circle cx='58' cy='54' r='4' fill='#1b0f16'/>
          <path d='M48 58c4 0 7 2 7 4s-3 4-7 4-7-2-7-4 3-4 7-4z' fill='#ff6bd6'/>
          <path d='M26 66c9-5 35-5 44 0' fill='none' stroke='#ff6bd6' stroke-width='3' stroke-linecap='round' opacity='.9'/>
          <path d='M18 44l10-6' stroke='#ff6bd6' stroke-width='4' stroke-linecap='round'/>
          <path d='M78 44l-10-6' stroke='#ff6bd6' stroke-width='4' stroke-linecap='round'/>
        </svg>`)
      },
      shark: {
        title:"Shark",
        tag:"blue waves • shark teeth • sleek",
        vars:{ bg:"#06131b", card:"#081d2a", btn:"#0b2232", text:"#e7f7ff", muted:"rgba(231,247,255,.78)", accent:"#41c7ff",
          pattern:
            `linear-gradient(135deg, rgba(65,199,255,.12) 0 12%, transparent 13% 100%),
             radial-gradient(circle at 15% 85%, rgba(255,255,255,.05) 0 18%, transparent 19%),
             radial-gradient(circle at 75% 20%, rgba(65,199,255,.10) 0 16%, transparent 17%)`
        },
        mascot: svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
          <rect width='96' height='96' rx='22' fill='#062434'/>
          <path d='M14 54c10-20 38-34 60-20 8 5 10 14 8 22-2 10-12 18-26 20-16 2-32-6-42-22z' fill='#41c7ff' opacity='.85'/>
          <path d='M26 54c10-8 28-10 40 0-6 12-14 18-22 18s-14-6-18-18z' fill='#07202c'/>
          <g fill='#fff'>
            <path d='M30 54l4 10 4-10z'/><path d='M40 54l4 10 4-10z'/><path d='M50 54l4 10 4-10z'/><path d='M60 54l4 10 4-10z'/>
          </g>
          <circle cx='58' cy='44' r='4' fill='#e7f7ff'/><circle cx='58' cy='44' r='2' fill='#06131b'/>
          <path d='M70 48l10-6-8 10z' fill='#41c7ff' opacity='.65'/>
        </svg>`)
      },
      tiger: {
        title:"Tiger",
        tag:"tiger stripes • orange pop • fierce",
        vars:{ bg:"#150b05", card:"#1c1007", btn:"#23140a", text:"#fff0e6", muted:"rgba(255,240,230,.78)", accent:"#ff8a3d",
          pattern:
            `repeating-linear-gradient(135deg, rgba(0,0,0,.28) 0 10px, rgba(255,138,61,.10) 10px 20px),
             radial-gradient(circle at 20% 20%, rgba(255,138,61,.14) 0 18%, transparent 19%)`
        },
        mascot: svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
          <rect width='96' height='96' rx='22' fill='#2a1307'/>
          <circle cx='48' cy='54' r='28' fill='#ff8a3d'/>
          <circle cx='32' cy='44' r='8' fill='#ff8a3d'/><circle cx='64' cy='44' r='8' fill='#ff8a3d'/>
          <g stroke='#1a0b04' stroke-width='5' stroke-linecap='round' opacity='.85'>
            <path d='M34 56l-10 6'/><path d='M38 66l-12 10'/><path d='M62 56l10 6'/><path d='M58 66l12 10'/>
            <path d='M48 36v10'/><path d='M40 38l-6 8'/><path d='M56 38l6 8'/>
          </g>
          <circle cx='40' cy='54' r='4' fill='#1a0b04'/><circle cx='56' cy='54' r='4' fill='#1a0b04'/>
          <path d='M48 58c4 0 7 2 7 4s-3 4-7 4-7-2-7-4 3-4 7-4z' fill='#1a0b04'/>
        </svg>`)
      },
      zebra: {
        title:"Zebra",
        tag:"zebra stripes • monochrome • crisp",
        vars:{ bg:"#090b0f", card:"#101420", btn:"#131a2a", text:"#f2f6ff", muted:"rgba(242,246,255,.78)", accent:"#b9c7ff",
          pattern:
            `repeating-linear-gradient(120deg, rgba(255,255,255,.07) 0 10px, rgba(0,0,0,0) 10px 20px),
             repeating-linear-gradient(60deg, rgba(255,255,255,.04) 0 12px, rgba(0,0,0,0) 12px 24px)`
        },
        mascot: svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
          <rect width='96' height='96' rx='22' fill='#0d111a'/>
          <circle cx='48' cy='54' r='28' fill='#f2f6ff'/>
          <g stroke='#0d111a' stroke-width='6' stroke-linecap='round' opacity='.95'>
            <path d='M34 40l-8 10'/><path d='M44 36l-12 16'/><path d='M56 36l12 16'/><path d='M62 40l8 10'/>
            <path d='M32 60l-10 10'/><path d='M64 60l10 10'/>
          </g>
          <circle cx='40' cy='54' r='4' fill='#0d111a'/><circle cx='56' cy='54' r='4' fill='#0d111a'/>
          <path d='M48 58c4 0 7 2 7 4s-3 4-7 4-7-2-7-4 3-4 7-4z' fill='#0d111a'/>
        </svg>`)
      },
      lion: {
        title:"Lion",
        tag:"mane vibes • warm gold • brave",
        vars:{ bg:"#140c06", card:"#1a1109", btn:"#21150b", text:"#fff3de", muted:"rgba(255,243,222,.78)", accent:"#ffc14d",
          pattern:
            `radial-gradient(circle at 70% 25%, rgba(255,193,77,.14) 0 18%, transparent 19%),
             repeating-linear-gradient(45deg, rgba(255,193,77,.09) 0 10px, rgba(0,0,0,0) 10px 22px)`
        },
        mascot: svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
          <rect width='96' height='96' rx='22' fill='#241406'/>
          <circle cx='48' cy='54' r='32' fill='#ffc14d' opacity='.35'/>
          <circle cx='48' cy='54' r='24' fill='#ffd79a'/>
          <g fill='#b8702a' opacity='.9'>
            <circle cx='28' cy='54' r='10'/><circle cx='68' cy='54' r='10'/>
            <circle cx='34' cy='38' r='10'/><circle cx='62' cy='38' r='10'/>
            <circle cx='48' cy='34' r='10'/><circle cx='36' cy='70' r='10'/><circle cx='60' cy='70' r='10'/>
          </g>
          <circle cx='40' cy='54' r='4' fill='#241406'/><circle cx='56' cy='54' r='4' fill='#241406'/>
          <path d='M48 58c4 0 7 2 7 4s-3 4-7 4-7-2-7-4 3-4 7-4z' fill='#241406'/>
          <path d='M40 66c4 3 12 3 16 0' fill='none' stroke='#241406' stroke-width='4' stroke-linecap='round'/>
        </svg>`)
      },
      cat: {
        title:"Cat",
        tag:"white fluffy • cat ears • soft paws",
        vars:{ bg:"#0e0f14", card:"#141824", btn:"#161c2a", text:"#f6f7ff", muted:"rgba(246,247,255,.78)", accent:"#9bd0ff",
          pattern:
            `radial-gradient(circle at 20% 80%, rgba(155,208,255,.10) 0 16%, transparent 17%),
             radial-gradient(circle at 70% 20%, rgba(255,255,255,.06) 0 18%, transparent 19%),
             linear-gradient(135deg, rgba(255,255,255,.03) 0 12%, transparent 13% 100%)`
        },
        mascot: svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
          <rect width='96' height='96' rx='22' fill='#101626'/>
          <path d='M26 40l10-12 8 12' fill='#f6f7ff'/>
          <path d='M70 40l-10-12-8 12' fill='#f6f7ff'/>
          <circle cx='48' cy='56' r='28' fill='#f6f7ff'/>
          <circle cx='40' cy='56' r='4' fill='#101626'/><circle cx='56' cy='56' r='4' fill='#101626'/>
          <path d='M48 60c4 0 7 2 7 4s-3 4-7 4-7-2-7-4 3-4 7-4z' fill='#ffb6d9'/>
          <path d='M28 62c8-4 32-4 40 0' fill='none' stroke='#9bd0ff' stroke-width='3' stroke-linecap='round' opacity='.9'/>
          <path d='M30 52l-10-4' stroke='#9bd0ff' stroke-width='3' stroke-linecap='round'/>
          <path d='M66 52l10-4' stroke='#9bd0ff' stroke-width='3' stroke-linecap='round'/>
        </svg>`)
      },
      dog: {
        title:"Dog",
        tag:"brown furry • floppy ears • wag tail",
        vars:{ bg:"#120e0a", card:"#19120c", btn:"#20160e", text:"#fff2e6", muted:"rgba(255,242,230,.78)", accent:"#c8a17a",
          pattern:
            `radial-gradient(circle at 25% 20%, rgba(200,161,122,.12) 0 18%, transparent 19%),
             repeating-linear-gradient(35deg, rgba(255,255,255,.03) 0 10px, rgba(0,0,0,0) 10px 20px)`
        },
        mascot: svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
          <rect width='96' height='96' rx='22' fill='#1c120a'/>
          <circle cx='48' cy='56' r='28' fill='#c8a17a'/>
          <ellipse cx='26' cy='54' rx='10' ry='16' fill='#a97f56'/>
          <ellipse cx='70' cy='54' rx='10' ry='16' fill='#a97f56'/>
          <circle cx='40' cy='54' r='4' fill='#1c120a'/><circle cx='56' cy='54' r='4' fill='#1c120a'/>
          <ellipse cx='48' cy='62' rx='8' ry='6' fill='#1c120a'/>
          <path d='M44 66c2 6 6 6 8 0' fill='none' stroke='#1c120a' stroke-width='4' stroke-linecap='round'/>
          <circle cx='34' cy='64' r='4' fill='#fff2e6' opacity='.35'/>
          <circle cx='62' cy='64' r='4' fill='#fff2e6' opacity='.35'/>
        </svg>`)
      }
    };

    function applySkin(name){
      const s = SKINS[name] || SKINS.bunny;
      const r = document.documentElement.style;
      r.setProperty("--bg", s.vars.bg);
      r.setProperty("--card", s.vars.card);
      r.setProperty("--btn", s.vars.btn);
      r.setProperty("--text", s.vars.text);
      r.setProperty("--muted", s.vars.muted);
      r.setProperty("--accent", s.vars.accent);
      r.setProperty("--accentSoft", s.vars.accent + "33");
      r.setProperty("--pattern", s.vars.pattern);
      mascotEl.style.backgroundImage = s.mascot;
      skinTitleEl.textContent = s.title;
      skinTagEl.textContent = s.tag;

      if (tinymce.activeEditor){
        tinymce.activeEditor.dom.addStyle(`body{background:${s.vars.card};color:${s.vars.text};} a{color:${s.vars.accent};}`);
      }
    }

    // ---------- TinyMCE init ----------
    setStatus("loading editor…");
    tinymce.init({
      selector: "#editor",
      height: "calc(100vh - 220px)",
      menubar: false,
      branding: true,
      promotion: false,
      mobile: { menubar:false, toolbar_mode:"sliding" },
      plugins: [
        "autosave","lists","link","image","table",
        "searchreplace","wordcount","code","fullscreen",
        "charmap","insertdatetime","autolink","quickbars","help"
      ],
      toolbar: [
        "undo redo | blocks | bold italic underline | forecolor backcolor | alignleft aligncenter alignright | bullist numlist outdent indent",
        "link image table | searchreplace | removeformat | fullscreen | code"
      ].join(" | "),
      toolbar_mode: "sliding",
      quickbars_selection_toolbar: "bold italic | quicklink h2 h3 blockquote",
      quickbars_insert_toolbar: "image table | bullist numlist | hr",
      autosave_ask_before_unload: true,
      autosave_interval: "10s",
      autosave_prefix: "freeword-{path}{query}-",
      autosave_restore_when_empty: true,
      autosave_retention: "30m",
      paste_data_images: true,
      image_caption: true,
      browser_spellcheck: true,
      contextmenu: "spellchecker",
      content_style: `
        body{
          font-family: Calibri, Arial, sans-serif;
          font-size: 12pt;
          line-height: 1.35;
          margin: 0 auto;
          max-width: 900px;
          padding: 32px 20px 80px;
          background: var(--card);
          color: var(--text);
        }
        a{color: var(--accent);}
        blockquote{border-left:4px solid rgba(255,255,255,.25);margin:16px 0;padding-left:12px;opacity:.95}
        table{border-collapse:collapse;width:100%}
        td,th{border:1px solid rgba(255,255,255,.25);padding:8px}
        img{max-width:100%;height:auto}
      `,
      setup: (editor) => {
        editor.on("init", () => {
          loadLocal();
          setStatus("ready ✅");
        });
        editor.on("Change Input Undo Redo", () => {
          window.clearTimeout(window.__saveDebounce);
          window.__saveDebounce = window.setTimeout(() => { try{saveLocal();}catch{} }, 900);
        });
      }
    });

    // ---------- UI wiring ----------
    function updateAiEnabled(){
      const k = ($("apiKey").value || "").trim();
      const on = k.length > 10;
      ["btnRewrite","btnExpand","btnSumm","btnInsert","calcAISolve","calcAISolve2"].forEach(id => $(id).disabled = !on);
      $("aiNote").textContent = on ? "AI enabled ✅ (writing + AI Solve)" : "AI disabled. Add a key to enable (optional).";
    }

    function loadLocal(){
      const meta = localStorage.getItem(LS_META);
      const content = localStorage.getItem(LS_CONTENT);
      if (meta){
        try{
          const m=JSON.parse(meta);
          if (m.title) titleEl.value=m.title;
          if (m.header!==undefined) headerEl.value=m.header;
          if (m.footer!==undefined) footerEl.value=m.footer;
          if (m.skin) skinEl.value=m.skin;
          if (m.apiBase) $("apiBase").value = m.apiBase;
          if (m.apiModel) $("apiModel").value = m.apiModel;
        }catch{}
      }
      const k = localStorage.getItem(LS_APIKEY);
      if (k) $("apiKey").value = k;
      applySkin(skinEl.value || "bunny");
      if (content) tinymce.activeEditor.setContent(content,{format:"html"});
      updateAiEnabled();
      loadEmbed();
    }

    function saveLocal(){
      const content = tinymce.activeEditor.getContent({format:"html"});
      localStorage.setItem(LS_CONTENT, content);
      localStorage.setItem(LS_META, JSON.stringify({
        title: titleEl.value || "Untitled document",
        header: headerEl.value || "",
        footer: footerEl.value || "",
        skin: skinEl.value || "bunny",
        apiBase: $("apiBase").value || "",
        apiModel: $("apiModel").value || "",
        savedAt: Date.now()
      }));
      setStatus("saved locally ✅");
    }

    skinEl.addEventListener("change", () => { applySkin(skinEl.value); saveLocal(); });
    [titleEl, headerEl, footerEl].forEach(el => el.addEventListener("input", () => {
      window.clearTimeout(window.__metaDebounce);
      window.__metaDebounce = window.setTimeout(() => { try{saveLocal();}catch{} }, 600);
    }));

    // New/Save/Open
    $("btnSave").addEventListener("click", () => { try{saveLocal();}catch(e){alert("Save failed: "+(e.message||e));} });
    $("btnNew").addEventListener("click", () => {
      if (!confirm("Start a new document? (Autosave remains on this device.)")) return;
      titleEl.value="Untitled document";
      tinymce.activeEditor.setContent("");
      saveLocal();
      setStatus("new document ✅");
    });
    $("btnOpen").addEventListener("click", () => fileOpenEl.click());
    fileOpenEl.addEventListener("change", async () => {
      const f = fileOpenEl.files && fileOpenEl.files[0];
      if (!f) return;
      try{
        const text = await f.text();
        const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const bodyHtml = bodyMatch ? bodyMatch[1] : text;
        tinymce.activeEditor.setContent(bodyHtml);
        titleEl.value = f.name.replace(/\.html$/i,"") || "Opened document";
        saveLocal();
        setStatus("opened ✅");
      }catch(e){ alert("Open failed: "+(e.message||e)); }
      finally{ fileOpenEl.value=""; }
    });

    // Export/Print
    function escapeHtml(s){
      return (s||"").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }
    function wrapAsHtmlDoc(bodyHtml, title) {
      const hdr = (headerEl.value || "").trim();
      const ftr = (footerEl.value || "").trim();
      return `<!doctype html><html><head><meta charset="utf-8"><title>${title || ""}</title>
      <style>
        @page { margin: 0.9in; }
        body{font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.35;margin:0;background:#fff;color:#000;}
        .wrap{max-width: 7.5in; margin: 0 auto;}
        .hdr{margin:0 0 14px 0; padding-bottom:10px; border-bottom:1px solid #ddd;}
        .ftr{margin:14px 0 0 0; padding-top:10px; border-top:1px solid #ddd;}
        img{max-width:100%;}
        table{border-collapse:collapse;}
        td,th{border:1px solid #999;padding:6px;}
      </style></head><body>
        <div class="wrap">
          ${hdr ? `<div class="hdr">${escapeHtml(hdr)}</div>` : ``}
          <div class="body">${bodyHtml}</div>
          ${ftr ? `<div class="ftr">${escapeHtml(ftr)}</div>` : ``}
        </div>
      </body></html>`;
    }
    $("btnPrint").addEventListener("click", () => {
      const content = tinymce.activeEditor.getContent({format:"html"});
      const w = window.open("", "_blank");
      const title = titleEl.value || "Document";
      w.document.open();
      w.document.write(wrapAsHtmlDoc(content, title));
      w.document.close();
      w.focus();
      w.print();
    });
    $("btnDocx").addEventListener("click", () => {
      try{
        const title = titleEl.value || "Document";
        const content = tinymce.activeEditor.getContent({format:"html"});
        const html = wrapAsHtmlDoc(content, title);
        const docxBlob = window.htmlDocx.asBlob(html);
        downloadBlob(docxBlob, safeFilename(title)+".docx");
        setStatus("exported DOCX ✅");
      }catch(e){ alert("DOCX export failed: "+(e.message||e)); }
    });
    $("btnPdf").addEventListener("click", async () => {
      try{
        const title = titleEl.value || "Document";
        const content = tinymce.activeEditor.getContent({format:"html"});
        const container = document.createElement("div");
        container.innerHTML = wrapAsHtmlDoc(content, title);
        const body = container.querySelector("body");
        const page = document.createElement("div");
        page.style.background="#ffffff"; page.style.color="#000000";
        page.append(...Array.from(body.children));
        setStatus("exporting PDF…");
        await html2pdf().set({
          margin: 0,
          filename: safeFilename(title)+".pdf",
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "pt", format: "letter", orientation: "portrait" }
        }).from(page).save();
        setStatus("exported PDF ✅");
      }catch(e){ alert("PDF export failed: "+(e.message||e)); }
    });

    // Tools drawer
    const drawerBack = $("drawerBack");
    const drawer = $("drawer");
    function openDrawer(){ drawerBack.style.display="block"; drawer.style.display="block"; }
    function closeDrawer(){ drawerBack.style.display="none"; drawer.style.display="none"; }
    $("btnTools").addEventListener("click", openDrawer);
    $("btnCloseTools").addEventListener("click", closeDrawer);
    drawerBack.addEventListener("click", closeDrawer);

    // Embedded AI Space (chosen automatically)
    // If this Space ever blocks iframes, users can open it in a new tab with the button.
    const EMBED_URL = "https://huggingface.co/spaces/Timemaster/grammar-fixer";
    function loadEmbed(){ $("embedFrame").src = EMBED_URL; }
    $("btnOpenEmbed").addEventListener("click", () => window.open(EMBED_URL, "_blank", "noopener,noreferrer"));
    loadEmbed();

    // Copy helpers
    function getSelectionText(){
      const ed = tinymce.activeEditor;
      return ed.selection.getContent({format:"text"}) || "";
    }
    function getAllText(){
      return tinymce.activeEditor.getContent({format:"text"}) || "";
    }
    async function copyText(t){
      if (!t) { alert("Nothing to copy."); return; }
      await navigator.clipboard.writeText(t);
      setStatus("copied ✅");
    }
    $("btnCopySelection").addEventListener("click", async () => {
      try{ await copyText(getSelectionText()); }catch(e){ alert("Copy failed"); }
    });
    $("btnCopyAll").addEventListener("click", async () => {
      try{ await copyText(getAllText()); }catch(e){ alert("Copy failed"); }
    });

    function replaceSelectionWith(text){
      const ed = tinymce.activeEditor;
      ed.focus();
      ed.selection.setContent(ed.dom.encode(text).replace(/\n/g,"<br>"));
      ed.undoManager.add(); ed.setDirty(true); saveLocal();
    }
    function insertAtCursor(text){
      const ed = tinymce.activeEditor;
      ed.focus();
      ed.selection.setContent(ed.dom.encode(text).replace(/\n/g,"<br>"));
      ed.undoManager.add(); ed.setDirty(true); saveLocal();
    }
    $("btnReplaceWithEmbed").addEventListener("click", () => {
      const t = ($("embedResult").value || "").trim();
      if (!t) { alert("Paste AI output first."); return; }
      replaceSelectionWith(t);
    });
    $("btnInsertEmbed").addEventListener("click", () => {
      const t = ($("embedResult").value || "").trim();
      if (!t) { alert("Paste AI output first."); return; }
      insertAtCursor(t);
    });

    // Grammar checker (LanguageTool)
    const LT_URL = "https://api.languagetool.org/v2/check";
    const issuesEl = $("issues");
    function stripHtmlToText(html){
      const d=document.createElement("div"); d.innerHTML=html;
      return (d.textContent || "").replace(/\s+\n/g,"\n").replace(/\n\s+/g,"\n").trim();
    }
    function clearIssues(){ issuesEl.innerHTML=""; }
    $("btnClearIssues").addEventListener("click", clearIssues);

    async function grammarCheck(){
      clearIssues();
      const html = tinymce.activeEditor.getContent({format:"html"});
      const text = stripHtmlToText(html);
      if (!text){ issuesEl.innerHTML = '<div class="small" style="opacity:.7">Nothing to check.</div>'; return; }
      setStatus("grammar checking…");
      const form = new URLSearchParams();
      form.set("text", text);
      form.set("language", "auto");
      const resp = await fetch(LT_URL, { method:"POST", headers:{"Content-Type":"application/x-www-form-urlencoded"}, body: form.toString() });
      if (!resp.ok) throw new Error("LanguageTool error: HTTP " + resp.status);
      const data = await resp.json();
      const matches = data.matches || [];
      if (!matches.length){ issuesEl.innerHTML = '<div class="small" style="opacity:.7">No issues found ✅</div>'; setStatus("grammar: clean ✅"); return; }
      setStatus("grammar: found "+matches.length+" issues");
      matches.slice(0,60).forEach(m => {
        const card=document.createElement("div"); card.className="issue";
        const msg=(m.message||"Suggestion").trim();
        const short=(m.shortMessage||"").trim();
        const ctx = m.context ? m.context.text : "";
        card.innerHTML = `
          <strong>${escapeHtml(short || "Grammar")}</strong>
          <div class="small" style="margin-top:6px;opacity:.85">${escapeHtml(msg)}</div>
          ${ctx ? `<div class="small" style="margin-top:8px;opacity:.85">“…${escapeHtml(ctx)}…”</div>` : ``}
          <div class="sugs"></div>
        `;
        const sugWrap = card.querySelector(".sugs");
        (m.replacements||[]).slice(0,8).forEach(r => {
          const s=document.createElement("div"); s.className="sug"; s.textContent=r.value;
          s.addEventListener("click", () => applySuggestionToEditor(m, r.value));
          sugWrap.appendChild(s);
        });
        issuesEl.appendChild(card);
      });
    }
    $("btnGrammar").addEventListener("click", async ()=>{ try{ await grammarCheck(); }catch(e){ alert(e.message||e); setStatus("grammar error"); } });

    function applySuggestionToEditor(match, replacement){
      const ed = tinymce.activeEditor;
      const root = ed.getBody();
      const ctxText = match.context?.text || "";
      const wrong = ctxText ? ctxText.substr(match.context.offset, match.length) : "";
      const needle = wrong.trim();
      if (!needle){ alert("Can't auto-apply; copy manually."); return; }
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, null);
      let node;
      while ((node = walker.nextNode())) {
        const i = node.nodeValue.indexOf(needle);
        if (i !== -1) {
          node.nodeValue = node.nodeValue.slice(0, i) + replacement + node.nodeValue.slice(i + needle.length);
          ed.undoManager.add(); ed.setDirty(true); saveLocal(); setStatus("applied suggestion ✅");
          return;
        }
      }
      alert("Couldn’t auto-apply (formatting changed).");
    }

    // Optional AI (BYO key) + AI calculator solve
    $("apiKey").addEventListener("input", updateAiEnabled);
    $("btnSaveKey").addEventListener("click", () => {
      const k = ($("apiKey").value || "").trim();
      if (!k){ alert("Paste a key first."); return; }
      localStorage.setItem(LS_APIKEY, k);
      updateAiEnabled();
      setStatus("key saved locally ✅");
    });
    $("btnForgetKey").addEventListener("click", () => {
      localStorage.removeItem(LS_APIKEY);
      $("apiKey").value = "";
      updateAiEnabled();
      setStatus("key forgotten ✅");
    });

    function replaceSelection(text){
      const ed=tinymce.activeEditor;
      ed.focus(); ed.selection.setContent(ed.dom.encode(text).replace(/\n/g,"<br>"));
      ed.undoManager.add(); ed.setDirty(true); saveLocal();
    }
    function insertCursor(text){
      const ed=tinymce.activeEditor;
      ed.focus(); ed.selection.setContent(ed.dom.encode(text).replace(/\n/g,"<br>"));
      ed.undoManager.add(); ed.setDirty(true); saveLocal();
    }

    async function callAiText(system, user){
      const apiBase = ($("apiBase").value || "").trim();
      const model = ($("apiModel").value || "").trim();
      const key = ($("apiKey").value || "").trim();
      if (!apiBase || !model || !key) throw new Error("AI not configured.");

      const payload = {
        model,
        input: [
          { role: "system", content: [{ type: "text", text: system }] },
          { role: "user", content: [{ type: "text", text: user }] }
        ],
        text: { format: { type: "text" } }
      };

      const resp = await fetch(apiBase, { method:"POST", headers:{ "Content-Type":"application/json", "Authorization":"Bearer " + key }, body: JSON.stringify(payload) });
      const raw = await resp.text();
      if (!resp.ok) throw new Error("AI request failed: HTTP " + resp.status + " " + raw.slice(0, 240));

      let out = "";
      try{
        const j = JSON.parse(raw);
        out = j.output_text
          || (j.output && j.output[0] && j.output[0].content && j.output[0].content[0] && j.output[0].content[0].text)
          || (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content)
          || "";
      }catch{
        out = raw;
      }
      out = (out || "").trim();
      if (!out) throw new Error("AI returned empty output.");
      return out;
    }

    async function callAi(mode){
      const sel = getSelectionText();
      if (!sel && mode !== "insert") { alert("Select some text first."); return; }
      const instruction = ($("aiInstruction").value || "").trim();
      let user = "";
      if (mode === "rewrite") user = "Rewrite this:\n\n" + sel;
      if (mode === "expand") user = "Expand this with more detail (keep tone and facts):\n\n" + sel;
      if (mode === "summ") user = "Summarize this:\n\n" + sel;
      if (mode === "insert") user = "Continue writing from here based on this document context:\n\n" + (tinymce.activeEditor.getContent({format:"text"}).slice(-2000));
      setStatus("AI thinking…");
      const out = await callAiText(instruction || "Improve the writing.", user);
      if (mode === "insert") insertCursor(out); else replaceSelection(out);
      setStatus("AI done ✅");
    }

    $("btnRewrite").addEventListener("click", async ()=>{ try{await callAi("rewrite");}catch(e){alert(e.message||e); setStatus("AI error");} });
    $("btnExpand").addEventListener("click", async ()=>{ try{await callAi("expand");}catch(e){alert(e.message||e); setStatus("AI error");} });
    $("btnSumm").addEventListener("click", async ()=>{ try{await callAi("summ");}catch(e){alert(e.message||e); setStatus("AI error");} });
    $("btnInsert").addEventListener("click", async ()=>{ try{await callAi("insert");}catch(e){alert(e.message||e); setStatus("AI error");} });

    // Calculator dropdown
    const calcBtn = $("btnCalc");
    const calcMenu = $("calcMenu");
    function closeCalc(){ calcMenu.style.display = "none"; }
    function toggleCalc(){ calcMenu.style.display = (calcMenu.style.display === "block") ? "none" : "block"; }
    calcBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleCalc(); });
    document.addEventListener("click", (e) => { if (!calcMenu.contains(e.target) && e.target !== calcBtn) closeCalc(); });
    calcMenu.addEventListener("click", e => e.stopPropagation());

    function safeEval(expr){
      if (!expr) return "";
      if (!/^[0-9\s\+\-\*\/\(\)\.^%]+$/.test(expr)) throw new Error("Only numbers and + - * / ( ) . ^ % allowed.");
      let e = expr.replace(/\^/g, "**");
      e = e.replace(/(\d+(?:\.\d+)?)%/g, "($1/100)");
      const fn = Function('"use strict"; return (' + e + ')');
      const v = fn();
      if (typeof v !== "number" || !isFinite(v)) throw new Error("Invalid result.");
      return v;
    }

    $("calcEval").addEventListener("click", () => {
      try{ $("calcOut").textContent = "Result: " + safeEval($("calcDisplay").value.trim()); }
      catch(e){ $("calcOut").textContent = "Error: " + (e.message||e); }
    });
    $("calcClear").addEventListener("click", () => { $("calcDisplay").value = ""; $("calcOut").textContent = ""; });
    $("calcBack").addEventListener("click", () => { $("calcDisplay").value = $("calcDisplay").value.slice(0,-1); });

    async function aiSolveMath(problemText){
      const sys = "You are a math tutor. Solve step-by-step and give a final answer. Keep it concise.";
      setStatus("AI solving…");
      const out = await callAiText(sys, "Solve this math problem:\n\n" + problemText);
      setStatus("AI solved ✅");
      return out;
    }
    $("calcAISolve").addEventListener("click", async () => {
      try{ $("calcOut").textContent = await aiSolveMath($("calcDisplay").value.trim()); }
      catch(e){ alert(e.message||e); setStatus("AI error"); }
    });
    $("calcAISolve2").addEventListener("click", async () => {
      try{ $("calcOut").textContent = await aiSolveMath($("calcProblem").value.trim()); }
      catch(e){ alert(e.message||e); setStatus("AI error"); }
    });

    // Enable/disable AI buttons + calc AI
    updateAiEnabled();

    // Build calc keypad
    const gridKeys = ["7","8","9","/","4","5","6","*","1","2","3","-","0",".","(",")","+","^","%"];
    const calcKeys = $("calcKeys");
    gridKeys.forEach(k => {
      const b = document.createElement("button");
      b.textContent = k;
      b.addEventListener("click", () => { $("calcDisplay").value += k; $("calcDisplay").focus(); });
      calcKeys.appendChild(b);
    });
  </script>
</body>
</html>
