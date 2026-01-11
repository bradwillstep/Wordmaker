# 📝 Wordmaker — A Free, Word‑Like Editor (PWA)

Wordmaker is a **100% free**, **mobile‑friendly**, **Word‑style editor** that runs entirely in the browser and can be **installed as an app** (PWA) on Android, desktop Chrome, and other modern browsers.

No accounts.  
No licenses.  
No backend required.

---

## ✨ Features

### Core Editor
- Word‑like rich text editing
- Mobile‑first (keyboard pops correctly)
- Autosave (local browser storage)
- Open & edit:
  - `.docx`
  - `.txt`
  - `.html`
  - `.rtf`
  - `.pdf` (text layer + OCR fallback)
  - `.odt`
  - `.pages` (best‑effort text extraction)

### Page Mode
- Optional **Word‑style page layout**
- Visual page breaks
- Page numbers
- Live refresh while typing

### Character Skins
Fun animated UI skins:
- 🐰 Bunny
- 🦈 Shark
- 🐯 Tiger
- 🦓 Zebra
- 🦁 Lion
- 🐱 Cat
- 🐶 Dog

Includes animated ears, tails, stripes, manes, and typing reactions.

### AI Tools (Optional)
- Grammar checking (LanguageTool)
- AI writing tools (bring‑your‑own API key)
- Embedded AI panel (no sign‑in)
- AI calculator (“AI Solve”)

### Calculator
- Built‑in calculator
- AI Solve mode for math problems

### App Install (PWA)
- Installable on Android & desktop
- Offline support
- Home screen icon
- Standalone app mode

---

## 📦 Repository Structure

Your GitHub Pages repo **must look exactly like this**:

```
/
├── index.html
├── manifest.webmanifest
├── sw.js
└── icons/
    ├── icon-192.png
    └── icon-512.png
```

---

## 🚀 How to Deploy (GitHub Pages)

1. Create a GitHub repository
2. Upload **all files above** to the root
3. Go to:
   - **Settings → Pages**
   - Source: `main` branch, `/root`
4. Save and wait for deployment

Your app will be live at:
```
https://USERNAME.github.io/REPO_NAME/
```

---

## 📱 How Users Install the App

### Android (Chrome)
1. Open the app URL
2. Tap the **round download button** (top‑right)
3. OR Chrome menu (⋮) → **Install app**

### Desktop (Chrome / Edge)
- Click the install icon in the address bar

### iOS (Safari)
1. Share → **Add to Home Screen**
2. Launch from home screen

---

## 📄 Supported File Types (Details)

### ✅ Fully Supported
- `.docx`
- `.txt`
- `.html`

### ⚠️ Best‑Effort
- `.pdf` (OCR used for scans)
- `.odt`
- `.pages`

### ❌ Not Supported (Browser Limitation)
- `.doc` (legacy Word binary)
- PDFs with complex layout editing

Tip: Convert `.doc → .docx` before opening.

---

## 🔒 Privacy & Safety

- Everything runs **locally in the browser**
- No accounts
- No tracking
- AI keys (if used) are stored **only on the user’s device**
- No data is sent anywhere except optional AI / grammar requests

---

## 🛠 Tech Stack

- Quill (MIT license)
- PDF.js
- Tesseract.js (OCR)
- Mammoth.js (DOCX)
- LanguageTool (grammar)
- PWA (Service Worker + Manifest)

---

## 📜 License

This project is **free to use, modify, and host**.

Recommended: MIT License

---

## ❤️ Credits

Built with open‑source libraries and browser‑native APIs.

---

## 🧠 Notes

This is a **browser‑only Word replacement**.  
Perfect fidelity with Microsoft Word is **not possible** without a server‑side conversion pipeline — but this gets extremely close while staying free.

Enjoy ✨
