# PWA Setup (SskChitFrontend-main)

## Files added
- `manifest.json` (app icon + theme + start_url)
- `sw.js` (service worker: offline cache + navigation fallback)

## Updated
- `index.html`
  - added `<link rel="manifest" href="manifest.json">`
  - added theme-color meta
  - registers `sw.js` on page load

## How to test
1. Open the app in **HTTPS** or **localhost** (service workers need secure context).
2. Hard refresh the page: **Ctrl+F5**.
3. In Chrome DevTools → **Application** → **Service Workers**:
   - confirm `sw.js` is installed and controlling the page.
4. In Chrome DevTools → **Application** → **Manifest**:
   - confirm manifest is detected.

## Note
This service worker caches static files for offline use. API responses are not cached.

