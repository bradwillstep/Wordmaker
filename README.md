# Wordmaker (Full App Build)

This is the **full Wordmaker** (not a tiny demo). It includes:

- Rich text toolbar (bold/italic/underline/strike)
- Fonts + font size
- Align (L/C/R/Justify)
- Bullets/numbering + indent/outdent
- Page Mode (Letter-sized paper look)
- Save/load to browser + portable `.wm.json` open/save
- Find/Replace (basic)
- Word/character count
- **Real export: DOCX + PDF** (via client-side libraries)
- PWA install button + “Add to Home Screen”
- Offline-ready foundation (service worker caches core + export libs)

## Files you must upload to your GitHub repo root

- `index.html`
- `style.css`
- `script.js`
- `manifest.webmanifest`
- `service-worker.js`
- `icon-192.png`
- `icon-512.png`

## Notes about DOCX/PDF export

Exports are generated in the browser using these libraries:

- `html-to-docx`
- `html2canvas`
- `jspdf`

They are loaded from jsDelivr and cached by the service worker after first load.

## Versioning

This build is auto-versioned:

- CSS/JS are loaded with `?v=20260111-221352-4061`
- Service worker cache name includes `20260111-221352-4061`

Build version: `20260111-221352-4061`
