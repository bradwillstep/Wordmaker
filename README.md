<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
  <title>Free Word‑Like Editor (Character Costume Skins • No License • Mobile)</title>

  <!-- Quill (MIT license, no key) -->
  <link href="https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.snow.css" rel="stylesheet">

  <style>
    :root{
      color-scheme: dark;

      /* skin vars (overridden) */
      --bg:#14070f;
      --card:#1b0f1f;
      --text:#ffe9fb;
      --muted:rgba(255,233,251,.84);
      --border:rgba(255,255,255,.14);
      --btn:#24112e;
      --btnBorder:rgba(255,255,255,.20);
      --accent:#ff4fd8;

      /* background layers */
      --pattern: none;
      --texture: none;
      --noise: none;

      /* costume layers */
      --decorTop: none;        /* top banner */
      --decorBottom: none;     /* bottom teeth/stripes */
      --earL: none;
      --earR: none;
      --mane: none;            /* behind mascot wrap */
      --tail: none;            /* small tail badge */
      --headerGlow: rgba(255,79,216,.20);

      --headerH: 148px; /* updated by JS */
      --shadow: 0 16px 45px rgba(0,0,0,.45);
    }

    html, body { height: 100%; }
    body{
      margin:0;
      font-family: system-ui,-apple-system,Segoe UI,Roboto,Arial,sans-serif;
      background: var(--bg);
      color: var(--text);
      background-image: var(--pattern), var(--texture), var(--noise);
      background-size: 260px 260px, 900px 900px, 180px 180px;
      background-attachment: fixed, fixed, fixed;
      overflow-x: hidden;
    }

    /* Fixed header so editor never scrolls behind it */
    header{
      position:fixed;
      top:0; left:0; right:0;
      z-index:1000;
      background: color-mix(in srgb, var(--bg) 86%, rgba(255,255,255,.03));
      border-bottom:1px solid rgba(255,255,255,.10);
      padding: 10px 10px calc(10px + env(safe-area-inset-bottom, 0px));
      backdrop-filter: blur(10px);
      overflow:hidden;
    }
    /* Costume decor layer inside header */
    .headerDecor{position:absolute; inset:0; pointer-events:none; z-index:0;}
    .decorTop{position:absolute; left:0; right:0; top:0; height:22px; background-image: var(--decorTop); background-repeat:repeat-x; background-size:auto 100%; opacity:.95;}
    .decorBottom{position:absolute; left:0; right:0; bottom:0; height:24px; background-image: var(--decorBottom); background-repeat:repeat-x; background-size:auto 100%; opacity:.95;}
    .ear{position:absolute; top:-8px; width:68px; height:68px; background-repeat:no-repeat; background-size:contain; filter: drop-shadow(0 10px 18px rgba(0,0,0,.35)); opacity:.98;}
    .ear.left{left:10px; background-image: var(--earL);}
    .ear.right{right:10px; background-image: var(--earR);}
    .glowBlob{position:absolute; right:-80px; top:-80px; width:240px; height:240px; border-radius:50%; background: var(--headerGlow); filter: blur(2px); opacity:.9;}
    .wrap{max-width:1180px;margin:0 auto; position:relative; z-index:2;}
    .bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;justify-content:space-between;}
    .left,.right{display:flex;flex-wrap:wrap;gap:8px;align-items:center;}

    input[type="text"], input[type="password"], select, textarea{
      background:var(--btn);
      color:var(--text);
      border:1px solid var(--btnBorder);
      border-radius:12px;
      padding:10px 12px;
      font-family:inherit;
      outline:none;
    }
    input[type="text"]{min-width:170px;max-width:70vw;}
    button{
      background:var(--btn);
      color:var(--text);
      border:1px solid var(--btnBorder);
      border-radius:12px;
      padding:10px 12px;
      cursor:pointer;
      -webkit-tap-highlight-color: transparent;
    }
    button:hover{border-color:rgba(255,255,255,.32)}
    button:disabled{opacity:.55;cursor:not-allowed}

    .note{color:var(--muted);font-size:13px;line-height:1.35;margin-top:8px}
    .status{color:rgba(255,255,255,.86);font-size:12px;margin-top:6px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace;white-space:pre-wrap}
    main{max-width:1180px;margin:0 auto;padding:14px;display:grid;gap:12px;grid-template-columns:1fr;}
    .chip{font-size:12px;border:1px solid var(--btnBorder);padding:6px 10px;border-radius:999px;opacity:.98; background: rgba(255,255,255,.04)}
    .pageHint{color:rgba(255,255,255,.76);font-size:12px;margin:2px 2px 0}

    /* Mascot */
    .mascotBar{margin-top:8px;display:flex;gap:10px;align-items:center;justify-content:space-between;flex-wrap:wrap;}
    .mascotWrap{
      display:flex;gap:10px;align-items:center;
      padding:8px 10px;
      border:1px solid var(--border);
      background: color-mix(in srgb, var(--card) 84%, rgba(255,255,255,.05));
      border-radius:18px;
      box-shadow: 0 12px 30px rgba(0,0,0,.40);
      overflow:hidden;
      position:relative;
    }
    /* Mane behind mascot (lion) */
    .mascotWrap:after{
      content:"";
      position:absolute;
      inset:-10px -18px -10px -18px;
      background-image: var(--mane);
      background-repeat:no-repeat;
      background-size: contain;
      background-position: center;
      opacity:.9;
      pointer-events:none;
      z-index:0;
      filter: drop-shadow(0 14px 22px rgba(0,0,0,.35));
    }
    .mascotWrap:before{
      content:"";
      position:absolute;
      inset:-40px -40px auto auto;
      width:150px;height:150px;
      background: color-mix(in srgb, var(--accent) 30%, transparent);
      filter: blur(2px);
      border-radius:50%;
      opacity:.85;
      z-index:0;
    }
    .mascot{
      width:52px;height:52px;border-radius:16px;
      background-image: var(--mascot);
      background-size: cover;
      background-position: center;
      box-shadow: 0 12px 26px rgba(0,0,0,.40);
      border:1px solid rgba(255,255,255,.16);
      flex:0 0 auto;
      position:relative;
      z-index:1;
    }
    .mascotText{position:relative;z-index:1}
    .mascotText strong{font-size:13px}
    .mascotText div{font-size:12px;opacity:.86;line-height:1.2;margin-top:2px}

    /* Tail badge */
    .tailBadge{
      display:flex;align-items:center;gap:8px;
      padding:8px 10px;
      border:1px solid var(--border);
      background: color-mix(in srgb, var(--card) 82%, rgba(255,255,255,.06));
      border-radius:18px;
      box-shadow: 0 12px 30px rgba(0,0,0,.35);
    }
    .tailIcon{width:44px;height:44px;border-radius:16px;background-image:var(--tail);background-size:contain;background-repeat:no-repeat;background-position:center;filter: drop-shadow(0 10px 16px rgba(0,0,0,.35));}

    /* Main content positioned below header */
    main{
      max-width:1180px;
      margin:0 auto;
      padding: calc(var(--headerH) + 14px) 14px 18px;
    }

    /* Quill toolbar styling */
    .ql-toolbar.ql-snow{
      border-radius:16px 16px 0 0;
      border:1px solid var(--border);
      background: color-mix(in srgb, var(--card) 76%, rgba(255,255,255,.08));
      box-shadow: var(--shadow);
    }
    .ql-container.ql-snow{
      border-radius:0 0 16px 16px;
      border:1px solid var(--border);
      border-top:0;
      background: color-mix(in srgb, var(--card) 92%, rgba(255,255,255,.04));
      box-shadow: var(--shadow);
    }
    .ql-editor{
      min-height: calc(100vh - var(--headerH) - 140px);
      padding: 22px 18px 80px;
      color: var(--text);
      font-size: 16px;
      line-height: 1.5;
    }
    .ql-editor:focus{ outline: none; }
    .ql-editor[contenteditable="true"]{-webkit-user-select:text; user-select:text;}

    /* Page-break guide (visual) */
    .ql-editor{
      background-image:
        linear-gradient(to bottom,
          rgba(255,255,255,0) calc(1120px - 2px),
          rgba(255,255,255,.14) calc(1120px - 2px),
          rgba(255,255,255,.14) 1120px);
      background-size: 100% 1120px;
      background-repeat: repeat;
    }

    /* Dropdown (calculator) */
    .menuWrap{position:relative;}
    .dropdown{
      position:absolute;right:0;top:44px;
      width:min(420px, 92vw);
      background:var(--card);
      border:1px solid var(--border);
      border-radius:18px;
      box-shadow: 0 20px 55px rgba(0,0,0,.55);
      padding:12px;
      display:none;
      z-index:2000;
    }
    .dropdown .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
    .calcGrid{display:grid;grid-template-columns: repeat(4, 1fr);gap:8px;margin-top:10px;}
    .calcGrid button{padding:12px 0;border-radius:14px}
    .calcDisplay{width:100%;font-size:16px;cursor:text}
    .calcOut{margin-top:8px;font-family:ui-monospace,SFMono-Regular,Menlo,Monaco,Consolas,"Liberation Mono",monospace;font-size:12px;white-space:pre-wrap;opacity:.92}
    .divider{height:1px;background:rgba(255,255,255,.10);margin:10px 0}

    /* Drawer (tools) */
    .drawerBack{position:fixed;inset:0;background:rgba(0,0,0,.55);display:none;z-index:3000}
    .drawer{
      position:fixed;right:0;top:0;height:100%;width:min(620px, 96vw);
      background:var(--card);
      border-left:1px solid var(--border);
      display:none;z-index:3001;overflow:auto;
    }
    .drawerHead{display:flex;gap:10px;align-items:center;justify-content:space-between;padding:12px;border-bottom:1px solid var(--border);
      background: linear-gradient(90deg, color-mix(in srgb, var(--card) 80%, rgba(255,255,255,.06)), color-mix(in srgb, var(--card) 80%, rgba(0,0,0,.08)));
      position:sticky;top:0;
    }
    .drawerBody{padding:12px}
    .section{border:1px solid var(--border);border-radius:16px;padding:12px;margin-bottom:12px;background:rgba(255,255,255,.02)}
    .section h3{margin:0 0 8px;font-size:13px;opacity:.95}
    .small{font-size:12px;opacity:.82;line-height:1.35}
    iframe{width:100%;height:520px;border:1px solid var(--border);border-radius:16px;background:rgba(0,0,0,.2);}
    .aiPaste{width:100%;min-height:110px;resize:vertical;cursor:text;margin-top:8px}
    .issues{display:flex;flex-direction:column;gap:10px;margin-top:10px}
    .issue{border:1px solid var(--border);border-radius:14px;padding:10px;background:rgba(0,0,0,.12)}
    .sugs{display:flex;flex-wrap:wrap;gap:6px;margin-top:8px}
    .sug{font-size:12px;padding:6px 10px;border-radius:999px;border:1px solid var(--btnBorder);cursor:pointer;background:rgba(255,255,255,.02)}
    .sug:hover{border-color:var(--accent)}
  </style>
</head>
<body>
  <header id="hdr">
    <div class="headerDecor" aria-hidden="true">
      <div class="glowBlob"></div>
      <div class="decorTop"></div>
      <div class="decorBottom"></div>
      <div class="ear left"></div>
      <div class="ear right"></div>
    </div>

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
              <div class="small">Basic calc + AI Solve (AI Solve needs a key in Tools).</div>
              <input id="calcDisplay" class="calcDisplay" type="text" placeholder="Type expression: (24*3)+7/2" />
              <div class="row" style="margin-top:8px;justify-content:space-between;">
                <button id="calcEval">=</button>
                <button id="calcClear">C</button>
                <button id="calcBack">⌫</button>
                <button id="calcAISolve" disabled>AI Solve</button>
              </div>

              <div class="calcGrid" id="calcKeys"></div>

              <div class="divider"></div>
              <div class="small">Paste a math problem:</div>
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
        </div>
      </div>

      <div class="mascotBar">
        <div class="mascotWrap">
          <div class="mascot" id="mascot"></div>
          <div class="mascotText">
            <strong id="skinTitle">Fluffy Punk Bunny</strong>
            <div id="skinTag">white fluff • punk pink • cozy</div>
          </div>
        </div>
        <div class="tailBadge">
          <div class="tailIcon" id="tailIcon"></div>
          <div class="mascotText">
            <strong>Costume Mode</strong>
            <div>ears • teeth • stripes • mane • tail</div>
          </div>
        </div>
      </div>

      <div id="status" class="status">Status: loading…</div>
      <div class="pageHint">Now the skins have “costumes” (ears/teeth/stripes/mane/tail) in the toolbar area.</div>
    </div>
  </header>

  <main>
    <div id="toolbar">
      <select class="ql-header">
        <option selected></option>
        <option value="1">H1</option>
        <option value="2">H2</option>
        <option value="3">H3</option>
      </select>
      <button class="ql-bold"></button>
      <button class="ql-italic"></button>
      <button class="ql-underline"></button>
      <select class="ql-color"></select>
      <select class="ql-background"></select>
      <button class="ql-blockquote"></button>
      <button class="ql-list" value="ordered"></button>
      <button class="ql-list" value="bullet"></button>
      <button class="ql-indent" value="-1"></button>
      <button class="ql-indent" value="+1"></button>
      <button class="ql-link"></button>
      <button class="ql-clean"></button>
    </div>
    <div id="editor"></div>
  </main>

  <!-- Tools Drawer -->
  <div class="drawerBack" id="drawerBack"></div>
  <aside class="drawer" id="drawer">
    <div class="drawerHead">
      <strong style="font-size:13px;">Tools</strong>
      <button id="btnCloseTools">Close</button>
    </div>
    <div class="drawerBody">
      <div class="section">
        <h3>Embedded AI panel (no key)</h3>
        <div class="small">Copy selection → paste into AI panel → paste output below → Insert/Replace.</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
          <button id="btnCopySelection">Copy Selection</button>
          <button id="btnCopyAll">Copy Document</button>
          <button id="btnOpenEmbed">Open AI in new tab</button>
        </div>
        <div class="small" style="margin-top:10px;">Paste AI output here:</div>
        <textarea id="embedResult" class="aiPaste" placeholder="Paste the AI output here…"></textarea>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px;">
          <button id="btnReplaceWithEmbed">Replace Selection</button>
          <button id="btnInsertEmbed">Insert at Cursor</button>
        </div>
        <div style="margin-top:10px;">
          <iframe id="embedFrame" title="Embedded AI Space"></iframe>
        </div>
      </div>

      <div class="section">
        <h3>Grammar checker (free)</h3>
        <div class="small">LanguageTool public endpoint. May rate-limit.</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px;">
          <button id="btnGrammar">Check Grammar</button>
          <button id="btnClearIssues">Clear</button>
        </div>
        <div id="issues" class="issues"></div>
      </div>

      <div class="section">
        <h3>Optional AI (Bring your own key)</h3>
        <div class="small">Enables AI writing + AI Solve in calculator. Stored only in your browser.</div>

        <div style="margin-top:10px;display:grid;grid-template-columns:1fr 1fr;gap:10px">
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

  <!-- Libraries -->
  <script src="https://cdn.jsdelivr.net/npm/quill@1.3.7/dist/quill.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/html-docx-js@0.3.1/dist/html-docx.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/html2pdf.js@0.10.1/dist/html2pdf.bundle.min.js"></script>

  <script>
    const $ = (id) => document.getElementById(id);
    const statusEl = $("status");
    const titleEl = $("docTitle");
    const headerEl = $("headerText");
    const footerEl = $("footerText");
    const skinEl = $("skin");
    const skinTitleEl = $("skinTitle");
    const skinTagEl = $("skinTag");
    const hdr = $("hdr");

    function setStatus(s){ statusEl.textContent = "Status: " + s; }
    function safeFilename(name){ return (name||"document").trim().replace(/[\\/:*?"<>|]+/g,"-").slice(0,80)||"document"; }
    function downloadBlob(blob, filename){
      const a=document.createElement("a");
      a.href=URL.createObjectURL(blob);
      a.download=filename;
      a.click();
      setTimeout(()=>URL.revokeObjectURL(a.href),1500);
    }

    function svgData(svg){ return `url("data:image/svg+xml;utf8,${encodeURIComponent(svg)}")`; }
    function noiseData(){
      return svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160'>
        <filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.8' numOctaves='2' stitchTiles='stitch'/></filter>
        <rect width='160' height='160' filter='url(%23n)' opacity='.12'/>
      </svg>`);
    }
    const NOISE = noiseData();

    // Costume SVGs
    const EARS_BUNNY_L = svgData(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
      <path d='M70 110C40 88 35 40 50 10c18 10 35 40 35 70 0 12-6 22-15 30z' fill='#fff' opacity='.95'/>
      <path d='M62 104C48 86 48 52 55 26c10 10 18 28 18 50 0 10-3 19-11 28z' fill='#ff4fd8' opacity='.35'/>
      <path d='M88 112c-8-28-2-70 20-94 16 22 14 62 4 88-6 14-13 18-24 6z' fill='#fff' opacity='.95'/>
      <path d='M90 104c-4-22 2-56 16-76 10 18 8 48 2 70-4 10-8 12-18 6z' fill='#ff4fd8' opacity='.35'/>
    </svg>`);
    const EARS_BUNNY_R = EARS_BUNNY_L;

    const EARS_CAT_L = svgData(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
      <path d='M18 92l36-60 18 44-54 16z' fill='#f6f7ff'/>
      <path d='M28 86l24-40 10 28-34 12z' fill='#ffb6d9' opacity='.55'/>
    </svg>`);
    const EARS_CAT_R = svgData(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
      <path d='M102 92L66 32 48 76l54 16z' fill='#f6f7ff'/>
      <path d='M92 86L68 46 58 74l34 12z' fill='#ffb6d9' opacity='.55'/>
    </svg>`);

    const EARS_DOG_L = svgData(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
      <path d='M20 40c20 10 30 30 28 58-22-8-40-26-42-46-1-8 4-14 14-12z' fill='#a97f56'/>
      <path d='M30 46c12 10 18 24 16 44-14-6-26-18-28-32-1-6 3-10 12-12z' fill='#c8a17a' opacity='.6'/>
    </svg>`);
    const EARS_DOG_R = svgData(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
      <path d='M100 40c-20 10-30 30-28 58 22-8 40-26 42-46 1-8-4-14-14-12z' fill='#a97f56'/>
      <path d='M90 46c-12 10-18 24-16 44 14-6 26-18 28-32 1-6-3-10-12-12z' fill='#c8a17a' opacity='.6'/>
    </svg>`);

    const DECOR_SHARK_TEETH = svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='220' height='24' viewBox='0 0 220 24'>
      <rect width='220' height='24' fill='rgba(0,0,0,0)'/>
      <g fill='#ffffff'>
        ${''.join([f"<path d='M{i*11} 0l5.5 24L{i*11+11} 0z'/>" for i in range(0,20)])}
      </g>
      <rect width='220' height='4' y='0' fill='#1bd3ff' opacity='.55'/>
    </svg>`);

    const DECOR_TIGER_STRIPES = svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='260' height='22' viewBox='0 0 260 22'>
      <rect width='260' height='22' fill='#ff7a1a' opacity='.85'/>
      <g stroke='#160a04' stroke-width='6' stroke-linecap='round' opacity='.85'>
        <path d='M10 18l22-14'/><path d='M44 20l22-14'/><path d='M78 18l22-14'/><path d='M112 20l22-14'/>
        <path d='M146 18l22-14'/><path d='M180 20l22-14'/><path d='M214 18l22-14'/><path d='M248 20l22-14'/>
      </g>
    </svg>`);

    const DECOR_ZEBRA_STRIPES = svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='260' height='22' viewBox='0 0 260 22'>
      <rect width='260' height='22' fill='rgba(255,255,255,.85)'/>
      <g stroke='#0d111a' stroke-width='8' stroke-linecap='round'>
        <path d='M0 20L22 0'/><path d='M28 22L50 0'/><path d='M56 22L78 0'/><path d='M84 22L106 0'/>
        <path d='M112 22L134 0'/><path d='M140 22L162 0'/><path d='M168 22L190 0'/><path d='M196 22L218 0'/><path d='M224 22L246 0'/>
      </g>
    </svg>`);

    const DECOR_BUNNY_RIBBON = svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='260' height='22' viewBox='0 0 260 22'>
      <rect width='260' height='22' fill='rgba(255,79,216,.85)'/>
      <circle cx='30' cy='11' r='5' fill='rgba(255,255,255,.8)'/>
      <circle cx='60' cy='11' r='4' fill='rgba(255,255,255,.55)'/>
      <circle cx='90' cy='11' r='5' fill='rgba(255,255,255,.8)'/>
      <circle cx='120' cy='11' r='4' fill='rgba(255,255,255,.55)'/>
      <circle cx='150' cy='11' r='5' fill='rgba(255,255,255,.8)'/>
      <circle cx='180' cy='11' r='4' fill='rgba(255,255,255,.55)'/>
      <circle cx='210' cy='11' r='5' fill='rgba(255,255,255,.8)'/>
      <circle cx='240' cy='11' r='4' fill='rgba(255,255,255,.55)'/>
    </svg>`);

    const MANE_LION = svgData(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 420 220'>
      <defs>
        <radialGradient id='m' cx='50%' cy='50%' r='60%'>
          <stop offset='0' stop-color='rgba(255,193,77,.0)'/>
          <stop offset='.55' stop-color='rgba(184,112,42,.65)'/>
          <stop offset='1' stop-color='rgba(90,50,20,.0)'/>
        </radialGradient>
      </defs>
      <circle cx='210' cy='110' r='95' fill='url(%23m)'/>
      <g fill='rgba(184,112,42,.55)'>
        ${''.join([f"<circle cx='{210+math.cos(i)*120:.1f}' cy='{110+math.sin(i)*95:.1f}' r='18'/>" for i in [j*0.45 for j in range(0,14)]])}
      </g>
    </svg>`);

    const TAIL_CAT = svgData(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
      <path d='M30 90c30-10 40-30 34-50-4-12 4-22 18-26 10 12 12 26 6 40-10 24-30 40-58 46z' fill='rgba(124,199,255,.85)'/>
      <path d='M30 90c30-10 40-30 34-50' fill='none' stroke='rgba(255,255,255,.35)' stroke-width='6' stroke-linecap='round'/>
    </svg>`);
    const TAIL_DOG = svgData(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
      <path d='M34 90c40-6 60-30 54-54-2-10 4-18 18-22 8 12 8 22 2 34-12 26-38 40-74 42z' fill='rgba(200,161,122,.85)'/>
      <path d='M34 90c40-6 60-30 54-54' fill='none' stroke='rgba(255,255,255,.28)' stroke-width='6' stroke-linecap='round'/>
    </svg>`);
    const TAIL_SHARK = svgData(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
      <path d='M22 70c28 6 52-2 70-22 10-12 20-12 28-2-10 30-34 54-72 64-16 4-24-6-26-40z' fill='rgba(27,211,255,.85)'/>
      <path d='M68 48l18-18' stroke='rgba(255,255,255,.35)' stroke-width='6' stroke-linecap='round'/>
    </svg>`);

    // Mascots (same style as earlier)
    const MASCOT_BUNNY = svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
      <defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>
        <stop stop-color='#ffffff' offset='0'/><stop stop-color='#ffd7ef' offset='1'/></linearGradient></defs>
      <rect width='96' height='96' rx='22' fill='#2a1031'/>
      <circle cx='48' cy='54' r='28' fill='url(#g)'/>
      <ellipse cx='32' cy='24' rx='10' ry='22' fill='url(#g)'/>
      <ellipse cx='64' cy='24' rx='10' ry='22' fill='url(#g)'/>
      <circle cx='38' cy='54' r='4' fill='#1b0f16'/><circle cx='58' cy='54' r='4' fill='#1b0f16'/>
      <path d='M48 58c4 0 7 2 7 4s-3 4-7 4-7-2-7-4 3-4 7-4z' fill='#ff4fd8'/>
    </svg>`);
    const MASCOT_SHARK = svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
      <rect width='96' height='96' rx='22' fill='#062a3f'/>
      <path d='M14 54c10-20 38-34 60-20 8 5 10 14 8 22-2 10-12 18-26 20-16 2-32-6-42-22z' fill='#1bd3ff' opacity='.88'/>
      <path d='M26 54c10-8 28-10 40 0-6 12-14 18-22 18s-14-6-18-18z' fill='#04202f'/>
      <g fill='#fff'><path d='M30 54l4 10 4-10z'/><path d='M40 54l4 10 4-10z'/><path d='M50 54l4 10 4-10z'/><path d='M60 54l4 10 4-10z'/></g>
    </svg>`);
    const MASCOT_TIGER = svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
      <rect width='96' height='96' rx='22' fill='#2a1307'/>
      <circle cx='48' cy='54' r='28' fill='#ff7a1a'/>
      <g stroke='#1a0b04' stroke-width='5' stroke-linecap='round'>
        <path d='M34 56l-10 6'/><path d='M62 56l10 6'/><path d='M48 36v10'/>
      </g>
      <circle cx='40' cy='54' r='4' fill='#1a0b04'/><circle cx='56' cy='54' r='4' fill='#1a0b04'/>
    </svg>`);
    const MASCOT_ZEBRA = svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
      <rect width='96' height='96' rx='22' fill='#0d111a'/>
      <circle cx='48' cy='54' r='28' fill='#f2f6ff'/>
      <g stroke='#0d111a' stroke-width='6' stroke-linecap='round'>
        <path d='M34 40l-8 10'/><path d='M56 36l12 16'/><path d='M32 60l-10 10'/><path d='M64 60l10 10'/>
      </g>
    </svg>`);
    const MASCOT_LION = svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
      <rect width='96' height='96' rx='22' fill='#241406'/>
      <circle cx='48' cy='54' r='32' fill='#ffb428' opacity='.35'/>
      <circle cx='48' cy='54' r='24' fill='#ffd79a'/>
      <circle cx='40' cy='54' r='4' fill='#241406'/><circle cx='56' cy='54' r='4' fill='#241406'/>
    </svg>`);
    const MASCOT_CAT = svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
      <rect width='96' height='96' rx='22' fill='#101626'/>
      <path d='M26 40l10-12 8 12' fill='#f6f7ff'/>
      <path d='M70 40l-10-12-8 12' fill='#f6f7ff'/>
      <circle cx='48' cy='56' r='28' fill='#f6f7ff'/>
      <circle cx='40' cy='56' r='4' fill='#101626'/><circle cx='56' cy='56' r='4' fill='#101626'/>
    </svg>`);
    const MASCOT_DOG = svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96'>
      <rect width='96' height='96' rx='22' fill='#1c120a'/>
      <circle cx='48' cy='56' r='28' fill='#c8a17a'/>
      <ellipse cx='26' cy='54' rx='10' ry='16' fill='#a97f56'/>
      <ellipse cx='70' cy='54' rx='10' ry='16' fill='#a97f56'/>
    </svg>`);

    const SKINS = {
      bunny: {
        title:"Fluffy Punk Bunny",
        tag:"white fluff • punk pink • cozy",
        vars:{
          bg:"#14070f", card:"#1b0f1f", btn:"#24112e",
          text:"#ffe9fb", muted:"rgba(255,233,251,.84)", accent:"#ff4fd8",
          pattern:`radial-gradient(circle at 20% 20%, rgba(255,79,216,.40) 0 14%, transparent 15%),
                   radial-gradient(circle at 80% 30%, rgba(255,255,255,.10) 0 12%, transparent 13%),
                   repeating-linear-gradient(135deg, rgba(255,79,216,.12) 0 10px, rgba(0,0,0,0) 10px 20px)`,
          texture:`linear-gradient(180deg, rgba(255,255,255,.06), rgba(0,0,0,0))`,
          mascot: MASCOT_BUNNY,
          decorTop: DECOR_BUNNY_RIBBON,
          decorBottom: DECOR_BUNNY_RIBBON,
          earL: EARS_BUNNY_L,
          earR: EARS_BUNNY_R,
          mane: "none",
          tail: svgData(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
            <path d='M30 90c22-10 26-26 22-42-3-10 2-18 12-22 18 16 16 44 2 64-10 14-22 18-36 0z' fill='rgba(255,79,216,.85)'/>
            <circle cx='44' cy='90' r='10' fill='rgba(255,255,255,.85)'/>
          </svg>`),
          headerGlow:"rgba(255,79,216,.25)"
        }
      },
      shark: {
        title:"Shark Teeth Blue",
        tag:"ocean blue • teeth • splash",
        vars:{
          bg:"#04121a", card:"#052335", btn:"#062b42",
          text:"#e8fbff", muted:"rgba(232,251,255,.82)", accent:"#1bd3ff",
          pattern:`radial-gradient(circle at 30% 20%, rgba(27,211,255,.32) 0 16%, transparent 17%),
                   radial-gradient(circle at 70% 80%, rgba(255,255,255,.10) 0 10%, transparent 11%),
                   repeating-linear-gradient(120deg, rgba(27,211,255,.10) 0 12px, rgba(0,0,0,0) 12px 24px)`,
          texture:`linear-gradient(180deg, rgba(27,211,255,.10), rgba(0,0,0,0))`,
          mascot: MASCOT_SHARK,
          decorTop: svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='260' height='22'><rect width='260' height='22' fill='rgba(27,211,255,.75)'/><circle cx='40' cy='11' r='4' fill='rgba(255,255,255,.6)'/><circle cx='78' cy='11' r='3' fill='rgba(255,255,255,.45)'/><circle cx='120' cy='11' r='4' fill='rgba(255,255,255,.6)'/><circle cx='160' cy='11' r='3' fill='rgba(255,255,255,.45)'/><circle cx='204' cy='11' r='4' fill='rgba(255,255,255,.6)'/></svg>`),
          decorBottom: DECOR_SHARK_TEETH,
          earL: "none",
          earR: "none",
          mane: "none",
          tail: TAIL_SHARK,
          headerGlow:"rgba(27,211,255,.22)"
        }
      },
      tiger: {
        title:"Tiger Stripes",
        tag:"orange • stripes • power",
        vars:{
          bg:"#120804", card:"#1c0f07", btn:"#241206",
          text:"#fff0e6", muted:"rgba(255,240,230,.82)", accent:"#ff7a1a",
          pattern:`repeating-linear-gradient(135deg, rgba(0,0,0,.40) 0 10px, rgba(255,122,26,.18) 10px 20px),
                   radial-gradient(circle at 70% 25%, rgba(255,122,26,.25) 0 18%, transparent 19%)`,
          texture:`linear-gradient(180deg, rgba(255,122,26,.10), rgba(0,0,0,0))`,
          mascot: MASCOT_TIGER,
          decorTop: DECOR_TIGER_STRIPES,
          decorBottom: DECOR_TIGER_STRIPES,
          earL: "none",
          earR: "none",
          mane: "none",
          tail: svgData(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
            <path d='M28 92c38-12 60-42 54-70-1-6 2-10 9-12 8 10 8 22 4 36-10 30-36 54-68 60z' fill='rgba(255,122,26,.85)'/>
            <g stroke='rgba(0,0,0,.35)' stroke-width='6' stroke-linecap='round'>
              <path d='M40 82l18-12'/><path d='M52 70l18-12'/>
            </g>
          </svg>`),
          headerGlow:"rgba(255,122,26,.20)"
        }
      },
      zebra: {
        title:"Zebra Stripes",
        tag:"high contrast • stripes • clean",
        vars:{
          bg:"#070910", card:"#0f1320", btn:"#121a2c",
          text:"#f2f6ff", muted:"rgba(242,246,255,.82)", accent:"#c7d3ff",
          pattern:`repeating-linear-gradient(120deg, rgba(255,255,255,.10) 0 12px, rgba(0,0,0,0) 12px 24px),
                   repeating-linear-gradient(60deg, rgba(255,255,255,.06) 0 14px, rgba(0,0,0,0) 14px 28px)`,
          texture:`linear-gradient(180deg, rgba(255,255,255,.08), rgba(0,0,0,0))`,
          mascot: MASCOT_ZEBRA,
          decorTop: DECOR_ZEBRA_STRIPES,
          decorBottom: DECOR_ZEBRA_STRIPES,
          earL: "none",
          earR: "none",
          mane: "none",
          tail: svgData(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
            <path d='M30 92c34-10 54-34 48-58-1-6 2-10 9-12 8 10 8 22 4 36-10 26-32 44-60 50z' fill='rgba(255,255,255,.85)'/>
            <g stroke='#0d111a' stroke-width='7' stroke-linecap='round'>
              <path d='M36 86l18-14'/><path d='M52 74l18-14'/>
            </g>
          </svg>`),
          headerGlow:"rgba(199,211,255,.18)"
        }
      },
      lion: {
        title:"Lion Mane",
        tag:"gold • mane • brave",
        vars:{
          bg:"#0f0903", card:"#1a1108", btn:"#22160a",
          text:"#fff4df", muted:"rgba(255,244,223,.82)", accent:"#ffb428",
          pattern:`radial-gradient(circle at 65% 25%, rgba(255,180,40,.25) 0 18%, transparent 19%),
                   repeating-linear-gradient(45deg, rgba(255,180,40,.16) 0 10px, rgba(0,0,0,0) 10px 24px)`,
          texture:`linear-gradient(180deg, rgba(255,180,40,.10), rgba(0,0,0,0))`,
          mascot: MASCOT_LION,
          decorTop: svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='260' height='22'><rect width='260' height='22' fill='rgba(255,180,40,.78)'/><circle cx='30' cy='11' r='5' fill='rgba(90,50,20,.35)'/><circle cx='70' cy='11' r='5' fill='rgba(90,50,20,.35)'/><circle cx='110' cy='11' r='5' fill='rgba(90,50,20,.35)'/><circle cx='150' cy='11' r='5' fill='rgba(90,50,20,.35)'/><circle cx='190' cy='11' r='5' fill='rgba(90,50,20,.35)'/><circle cx='230' cy='11' r='5' fill='rgba(90,50,20,.35)'/></svg>`),
          decorBottom: svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='260' height='24'><rect width='260' height='24' fill='rgba(184,112,42,.65)'/><path d='M0 24c30-18 52-18 82 0s52 18 82 0 52-18 96 0V24z' fill='rgba(255,215,154,.45)'/></svg>`),
          earL: "none",
          earR: "none",
          mane: MANE_LION,
          tail: svgData(`<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 120 120'>
            <path d='M26 90c40-6 60-30 54-54-2-10 4-18 18-22 8 12 8 22 2 34-12 26-38 40-74 42z' fill='rgba(255,180,40,.85)'/>
            <circle cx='86' cy='74' r='12' fill='rgba(184,112,42,.85)'/>
          </svg>`),
          headerGlow:"rgba(255,180,40,.22)"
        }
      },
      cat: {
        title:"Fluffy White Cat",
        tag:"ears • soft • icy pop",
        vars:{
          bg:"#0a0d14", card:"#121827", btn:"#141e30",
          text:"#f6f7ff", muted:"rgba(246,247,255,.82)", accent:"#7cc7ff",
          pattern:`radial-gradient(circle at 20% 80%, rgba(124,199,255,.22) 0 16%, transparent 17%),
                   radial-gradient(circle at 75% 20%, rgba(255,255,255,.10) 0 14%, transparent 15%),
                   repeating-linear-gradient(135deg, rgba(124,199,255,.12) 0 12px, rgba(0,0,0,0) 12px 24px)`,
          texture:`linear-gradient(180deg, rgba(124,199,255,.10), rgba(0,0,0,0))`,
          mascot: MASCOT_CAT,
          decorTop: svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='260' height='22'><rect width='260' height='22' fill='rgba(124,199,255,.65)'/><path d='M0 22c26-16 52-16 78 0s52 16 78 0 52-16 78 0v22H0z' fill='rgba(255,255,255,.18)'/></svg>`),
          decorBottom: svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='260' height='24'><rect width='260' height='24' fill='rgba(255,255,255,.12)'/><circle cx='20' cy='12' r='5' fill='rgba(124,199,255,.55)'/><circle cx='60' cy='12' r='5' fill='rgba(124,199,255,.55)'/><circle cx='100' cy='12' r='5' fill='rgba(124,199,255,.55)'/><circle cx='140' cy='12' r='5' fill='rgba(124,199,255,.55)'/><circle cx='180' cy='12' r='5' fill='rgba(124,199,255,.55)'/><circle cx='220' cy='12' r='5' fill='rgba(124,199,255,.55)'/></svg>`),
          earL: EARS_CAT_L,
          earR: EARS_CAT_R,
          mane: "none",
          tail: TAIL_CAT,
          headerGlow:"rgba(124,199,255,.22)"
        }
      },
      dog: {
        title:"Brown Doggo",
        tag:"floppy ears • warm fur • wag",
        vars:{
          bg:"#0f0a06", card:"#19120c", btn:"#22160e",
          text:"#fff2e6", muted:"rgba(255,242,230,.82)", accent:"#c8a17a",
          pattern:`radial-gradient(circle at 25% 20%, rgba(200,161,122,.20) 0 18%, transparent 19%),
                   radial-gradient(circle at 80% 70%, rgba(255,255,255,.08) 0 12%, transparent 13%),
                   repeating-linear-gradient(35deg, rgba(200,161,122,.14) 0 12px, rgba(0,0,0,0) 12px 24px)`,
          texture:`linear-gradient(180deg, rgba(200,161,122,.12), rgba(0,0,0,0))`,
          mascot: MASCOT_DOG,
          decorTop: svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='260' height='22'><rect width='260' height='22' fill='rgba(200,161,122,.72)'/><path d='M0 22c30-10 60-10 90 0s60 10 90 0 60-10 80 0v22H0z' fill='rgba(255,255,255,.12)'/></svg>`),
          decorBottom: svgData(`<svg xmlns='http://www.w3.org/2000/svg' width='260' height='24'><rect width='260' height='24' fill='rgba(169,127,86,.55)'/><circle cx='40' cy='12' r='4' fill='rgba(255,255,255,.15)'/><circle cx='90' cy='12' r='4' fill='rgba(255,255,255,.15)'/><circle cx='140' cy='12' r='4' fill='rgba(255,255,255,.15)'/><circle cx='190' cy='12' r='4' fill='rgba(255,255,255,.15)'/></svg>`),
          earL: EARS_DOG_L,
          earR: EARS_DOG_R,
          mane: "none",
          tail: TAIL_DOG,
          headerGlow:"rgba(200,161,122,.22)"
        }
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
      r.setProperty("--pattern", s.vars.pattern);
      r.setProperty("--texture", s.vars.texture);
      r.setProperty("--noise", NOISE);
      r.setProperty("--decorTop", s.vars.decorTop || "none");
      r.setProperty("--decorBottom", s.vars.decorBottom || "none");
      r.setProperty("--earL", s.vars.earL || "none");
      r.setProperty("--earR", s.vars.earR || "none");
      r.setProperty("--mane", s.vars.mane || "none");
      r.setProperty("--tail", s.vars.tail || "none");
      r.setProperty("--headerGlow", s.vars.headerGlow || "rgba(255,255,255,.12)");

      document.getElementById("mascot").style.backgroundImage = s.vars.mascot || "none";
      document.getElementById("tailIcon").style.backgroundImage = s.vars.tail || "none";
      skinTitleEl.textContent = s.title;
      skinTagEl.textContent = s.tag;
    }

    // Quill init (no license)
    const quill = new Quill('#editor', { theme:'snow', modules:{ toolbar:'#toolbar' } });

    // Force focus on tap so mobile keyboard appears
    document.getElementById("editor").addEventListener("pointerdown", () => quill.focus(), {passive:true});

    // Header height → main padding so editor never hides behind toolbar
    function updateHeaderH(){
      const h = hdr.getBoundingClientRect().height;
      document.documentElement.style.setProperty("--headerH", Math.round(h) + "px");
    }
    window.addEventListener("resize", updateHeaderH);
    window.addEventListener("orientationchange", updateHeaderH);

    // Storage
    const LS_CONTENT="freeword_costume_content_v1";
    const LS_META="freeword_costume_meta_v1";
    const LS_API="freeword_costume_apikey_v1";

    function saveLocal(){
      localStorage.setItem(LS_CONTENT, quill.root.innerHTML);
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
      const html = localStorage.getItem(LS_CONTENT);
      if (meta){
        try{
          const m = JSON.parse(meta);
          if (m.title) titleEl.value = m.title;
          if (m.header !== undefined) headerEl.value = m.header;
          if (m.footer !== undefined) footerEl.value = m.footer;
          if (m.skin) skinEl.value = m.skin;
          if (m.apiBase) $("apiBase").value = m.apiBase;
          if (m.apiModel) $("apiModel").value = m.apiModel;
          if (m.savedAt) setStatus("restored (" + new Date(m.savedAt).toLocaleString() + ")");
        }catch{}
      }
      applySkin(skinEl.value || "bunny");
      if (html) quill.root.innerHTML = html;

      const k = localStorage.getItem(LS_API);
      if (k) $("apiKey").value = k;

      updateAiEnabled();
      updateHeaderH();
      loadEmbed();
    }

    // Autosave
    let saveT=null;
    quill.on('text-change', () => {
      clearTimeout(saveT);
      saveT = setTimeout(() => { try{ saveLocal(); }catch{} }, 700);
    });

    // Skin switch
    skinEl.addEventListener("change", () => { applySkin(skinEl.value); saveLocal(); updateHeaderH(); });

    // Buttons
    $("btnSave").addEventListener("click", saveLocal);
    $("btnNew").addEventListener("click", () => {
      if (!confirm("Start a new document?")) return;
      titleEl.value="Untitled document";
      quill.setContents([]);
      saveLocal();
      setStatus("new document ✅");
    });
    $("btnOpen").addEventListener("click", () => $("fileOpen").click());
    $("fileOpen").addEventListener("change", async () => {
      const f = $("fileOpen").files && $("fileOpen").files[0];
      if (!f) return;
      try{
        const text = await f.text();
        const bodyMatch = text.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
        const bodyHtml = bodyMatch ? bodyMatch[1] : text;
        quill.root.innerHTML = bodyHtml;
        titleEl.value = f.name.replace(/\.html$/i,"") || "Opened document";
        saveLocal();
        setStatus("opened ✅");
      }catch(e){ alert("Open failed: " + (e.message||e)); }
      finally{ $("fileOpen").value=""; }
    });

    // Export/Print
    function escapeHtml(s){
      return (s||"").replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
    }
    function wrapAsHtmlDoc(bodyHtml, title) {
      const hdrTxt = (headerEl.value || "").trim();
      const ftrTxt = (footerEl.value || "").trim();
      return `<!doctype html><html><head><meta charset="utf-8"><title>${title||""}</title>
      <style>
        @page { margin: 0.9in; }
        body{font-family:Calibri,Arial,sans-serif;font-size:12pt;line-height:1.35;margin:0;background:#fff;color:#000;}
        .wrap{max-width: 7.5in; margin: 0 auto;}
        .hdr{margin:0 0 14px 0; padding-bottom:10px; border-bottom:1px solid #ddd;}
        .ftr{margin:14px 0 0 0; padding-top:10px; border-top:1px solid #ddd;}
      </style></head><body>
        <div class="wrap">
          ${hdrTxt ? `<div class="hdr">${escapeHtml(hdrTxt)}</div>` : ``}
          <div class="body">${bodyHtml}</div>
          ${ftrTxt ? `<div class="ftr">${escapeHtml(ftrTxt)}</div>` : ``}
        </div>
      </body></html>`;
    }
    $("btnPrint").addEventListener("click", () => {
      const content = quill.root.innerHTML;
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
        const html = wrapAsHtmlDoc(quill.root.innerHTML, title);
        const docxBlob = window.htmlDocx.asBlob(html);
        downloadBlob(docxBlob, safeFilename(title)+".docx");
        setStatus("exported DOCX ✅");
      }catch(e){ alert("DOCX export failed: " + (e.message||e)); }
    });
    $("btnPdf").addEventListener("click", async () => {
      try{
        const title = titleEl.value || "Document";
        const container = document.createElement("div");
        container.innerHTML = wrapAsHtmlDoc(quill.root.innerHTML, title);
        const body = container.querySelector("body");
        const page = document.createElement("div");
        page.style.background="#fff"; page.style.color="#000";
        page.append(...Array.from(body.children));
        setStatus("exporting PDF…");
        await html2pdf().set({
          margin: 0,
          filename: safeFilename(title)+".pdf",
          html2canvas: { scale: 2, useCORS: true },
          jsPDF: { unit: "pt", format: "letter", orientation: "portrait" }
        }).from(page).save();
        setStatus("exported PDF ✅");
      }catch(e){ alert("PDF export failed: " + (e.message||e)); }
    });

    // Calculator
    const calcBtn = $("btnCalc");
    const calcMenu = $("calcMenu");
    function closeCalc(){ calcMenu.style.display="none"; }
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
    $("calcClear").addEventListener("click", () => { $("calcDisplay").value=""; $("calcOut").textContent=""; });
    $("calcBack").addEventListener("click", () => { $("calcDisplay").value = $("calcDisplay").value.slice(0,-1); });

    const gridKeys = ["7","8","9","/","4","5","6","*","1","2","3","-","0",".","(",")","+","^","%"];
    gridKeys.forEach(k => {
      const b=document.createElement("button");
      b.textContent=k;
      b.addEventListener("click", ()=>{ $("calcDisplay").value += k; $("calcDisplay").focus(); });
      $("calcKeys").appendChild(b);
    });

    // Tools drawer
    const drawerBack = $("drawerBack");
    const drawer = $("drawer");
    function openDrawer(){ drawerBack.style.display="block"; drawer.style.display="block"; }
    function closeDrawer(){ drawerBack.style.display="none"; drawer.style.display="none"; }
    $("btnTools").addEventListener("click", openDrawer);
    $("btnCloseTools").addEventListener("click", closeDrawer);
    drawerBack.addEventListener("click", closeDrawer);

    // Embedded AI
    const EMBED_URL = "https://huggingface.co/spaces/Timemaster/grammar-fixer";
    function loadEmbed(){ $("embedFrame").src = EMBED_URL; }
    $("btnOpenEmbed").addEventListener("click", () => window.open(EMBED_URL, "_blank", "noopener,noreferrer"));

    async function copyText(t){
      if (!t) return alert("Nothing to copy.");
      await navigator.clipboard.writeText(t);
      setStatus("copied ✅");
    }
    function getSelectionText(){
      const range = quill.getSelection();
      if (!range || range.length===0) return "";
      return quill.getText(range.index, range.length);
    }
    function getAllText(){ return quill.getText(); }
    $("btnCopySelection").addEventListener("click", ()=>copyText(getSelectionText()).catch(()=>alert("Copy failed")));
    $("btnCopyAll").addEventListener("click", ()=>copyText(getAllText()).catch(()=>alert("Copy failed")));

    function replaceSelectionWith(text){
      const range = quill.getSelection(true);
      if (!range || range.length===0) return alert("Select text first.");
      quill.deleteText(range.index, range.length, "user");
      quill.insertText(range.index, text, "user");
    }
    function insertAtCursor(text){
      const range = quill.getSelection(true) || {index: quill.getLength(), length:0};
      quill.insertText(range.index, text, "user");
    }
    $("btnReplaceWithEmbed").addEventListener("click", ()=>{ 
      const t = ($("embedResult").value||"").trim();
      if (!t) return alert("Paste AI output first.");
      replaceSelectionWith(t); saveLocal();
    });
    $("btnInsertEmbed").addEventListener("click", ()=>{ 
      const t = ($("embedResult").value||"").trim();
      if (!t) return alert("Paste AI output first.");
      insertAtCursor(t); saveLocal();
    });

    // Grammar (LanguageTool) — simplified
    const LT_URL = "https://api.languagetool.org/v2/check";
    $("btnClearIssues").addEventListener("click", ()=> $("issues").innerHTML="");
    function escMini(s){ return (s||"").replace(/[&<>]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])); }

    $("btnGrammar").addEventListener("click", async () => {
      try{
        $("issues").innerHTML="";
        const text = getAllText().trim();
        if (!text) { $("issues").innerHTML="<div class='small'>Nothing to check.</div>"; return; }
        setStatus("grammar checking…");
        const form = new URLSearchParams();
        form.set("text", text);
        form.set("language", "auto");
        const resp = await fetch(LT_URL, { method:"POST", headers:{ "Content-Type":"application/x-www-form-urlencoded" }, body: form.toString() });
        if (!resp.ok) throw new Error("LanguageTool HTTP " + resp.status);
        const data = await resp.json();
        const matches = data.matches || [];
        if (!matches.length) { $("issues").innerHTML="<div class='small'>No issues found ✅</div>"; setStatus("grammar: clean ✅"); return; }
        setStatus("grammar: found " + matches.length);
        matches.slice(0,40).forEach(m=>{
          const card=document.createElement("div");
          card.className="issue";
          card.innerHTML = `<strong>${escMini(m.shortMessage||"Grammar")}</strong>
            <div class="small" style="margin-top:6px">${escMini(m.message||"")}</div>
            <div class="sugs"></div>`;
          const sugWrap = card.querySelector(".sugs");
          (m.replacements||[]).slice(0,6).forEach(r=>{
            const s=document.createElement("div");
            s.className="sug";
            s.textContent=r.value;
            s.addEventListener("click", ()=>{
              const wrong = (m.context && m.context.text) ? m.context.text.substr(m.context.offset, m.length) : "";
              const all = getAllText();
              const idx = all.indexOf(wrong);
              if (idx === -1) return alert("Couldn't auto-apply. Copy manually.");
              quill.deleteText(idx, wrong.length, "user");
              quill.insertText(idx, r.value, "user");
              saveLocal();
              setStatus("applied ✅");
            });
            sugWrap.appendChild(s);
          });
          $("issues").appendChild(card);
        });
      }catch(e){
        alert(e.message||e);
        setStatus("grammar error");
      }
    });

    // Optional AI (BYO key) — enable writing + AI solve
    function updateAiEnabled(){
      const k = ($("apiKey").value||"").trim();
      const on = k.length>10;
      ["btnRewrite","btnExpand","btnSumm","btnInsert","calcAISolve","calcAISolve2"].forEach(id => $(id).disabled = !on);
      $("aiNote").textContent = on ? "AI enabled ✅" : "AI disabled (optional).";
    }
    $("apiKey").addEventListener("input", updateAiEnabled);
    $("btnSaveKey").addEventListener("click", ()=> {
      const k = ($("apiKey").value||"").trim();
      if (!k) return alert("Paste a key first.");
      localStorage.setItem(LS_API, k);
      updateAiEnabled();
      setStatus("key saved locally ✅");
    });
    $("btnForgetKey").addEventListener("click", ()=> {
      localStorage.removeItem(LS_API);
      $("apiKey").value="";
      updateAiEnabled();
      setStatus("key forgotten ✅");
    });

    async function callAiText(system, user){
      const apiBase = ($("apiBase").value||"").trim();
      const model = ($("apiModel").value||"").trim();
      const key = ($("apiKey").value||"").trim();
      if (!apiBase || !model || !key) throw new Error("AI not configured.");
      const payload = {
        model,
        input: [
          { role:"system", content:[{type:"text", text:system}] },
          { role:"user", content:[{type:"text", text:user}] }
        ],
        text: { format: { type: "text" } }
      };
      const resp = await fetch(apiBase, {
        method:"POST",
        headers:{ "Content-Type":"application/json", "Authorization":"Bearer " + key },
        body: JSON.stringify(payload)
      });
      const raw = await resp.text();
      if (!resp.ok) throw new Error("AI HTTP " + resp.status + " " + raw.slice(0,240));
      let out="";
      try{
        const j = JSON.parse(raw);
        out = j.output_text
          || (j.output && j.output[0] && j.output[0].content && j.output[0].content[0] && j.output[0].content[0].text)
          || (j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content)
          || "";
      }catch{ out = raw; }
      out = (out||"").trim();
      if (!out) throw new Error("AI returned empty output.");
      return out;
    }

    async function aiSolveMath(problemText){
      const sys = "You are a math tutor. Solve step-by-step and give the final answer. Keep concise.";
      setStatus("AI solving…");
      const out = await callAiText(sys, "Solve:\n\n" + problemText);
      setStatus("AI solved ✅");
      return out;
    }
    $("calcAISolve").addEventListener("click", async ()=>{ 
      try{ $("calcOut").textContent = await aiSolveMath($("calcDisplay").value.trim()); }
      catch(e){ alert(e.message||e); setStatus("AI error"); }
    });
    $("calcAISolve2").addEventListener("click", async ()=>{ 
      try{ $("calcOut").textContent = await aiSolveMath($("calcProblem").value.trim()); }
      catch(e){ alert(e.message||e); setStatus("AI error"); }
    });

    async function aiWrite(mode){
      const instruction = ($("aiInstruction").value||"").trim() || "Improve the writing.";
      let user = "";
      if (mode !== "insert"){
        const sel = getSelectionText();
        if (!sel) return alert("Select some text first.");
        if (mode==="rewrite") user = "Rewrite this:\n\n"+sel;
        if (mode==="expand") user = "Expand this (keep facts):\n\n"+sel;
        if (mode==="summ") user = "Summarize this:\n\n"+sel;
      } else {
        user = "Continue writing from this context:\n\n" + getAllText().slice(-2000);
      }
      setStatus("AI thinking…");
      const out = await callAiText(instruction, user);
      if (mode === "insert") insertAtCursor(out);
      else replaceSelectionWith(out);
      saveLocal();
      setStatus("AI done ✅");
    }
    $("btnRewrite").addEventListener("click", ()=>aiWrite("rewrite").catch(e=>{alert(e.message||e); setStatus("AI error");}));
    $("btnExpand").addEventListener("click", ()=>aiWrite("expand").catch(e=>{alert(e.message||e); setStatus("AI error");}));
    $("btnSumm").addEventListener("click", ()=>aiWrite("summ").catch(e=>{alert(e.message||e); setStatus("AI error");}));
    $("btnInsert").addEventListener("click", ()=>aiWrite("insert").catch(e=>{alert(e.message||e); setStatus("AI error");}));

    // Calculator keypad
    const gridKeys = ["7","8","9","/","4","5","6","*","1","2","3","-","0",".","(",")","+","^","%"];
    gridKeys.forEach(k => {
      const b=document.createElement("button");
      b.textContent=k;
      b.addEventListener("click", ()=>{ $("calcDisplay").value += k; $("calcDisplay").focus(); });
      $("calcKeys").appendChild(b);
    });

    // enable dropdown close
    const calcBtn = $("btnCalc");
    const calcMenu = $("calcMenu");
    function closeCalc(){ calcMenu.style.display="none"; }
    function toggleCalc(){ calcMenu.style.display = (calcMenu.style.display === "block") ? "none" : "block"; }
    calcBtn.addEventListener("click", (e) => { e.stopPropagation(); toggleCalc(); });
    document.addEventListener("click", (e) => { if (!calcMenu.contains(e.target) && e.target !== calcBtn) closeCalc(); });
    calcMenu.addEventListener("click", e => e.stopPropagation());

    // Load stored key and start
    const storedK = localStorage.getItem(LS_API);
    if (storedK) $("apiKey").value = storedK;
    loadLocal();
    updateAiEnabled();
    setTimeout(updateHeaderH, 50);
    setStatus("ready ✅");
  </script>
</body>
</html>
