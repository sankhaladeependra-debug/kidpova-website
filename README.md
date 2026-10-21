# kidpavo.com — static site

Plain HTML, CSS and vanilla JS. No framework, no build step. Deploy this `site/` folder as is.

```
index.html          landing page
privacy.html        privacy policy (draft, pending legal review)
404.html            not-found page (Netlify and Vercel serve it automatically)
css/site.css        site styles (uses the brand tokens)
js/config.js        SIGNUP_ENDPOINT, the Google Apps Script URL
js/main.js          renders Pavo art + handles the notify-me form
assets/tokens.css   copy of brand/tokens/tokens.css (font @import removed)
assets/pavo.js      copy of brand/src/pavo.js
favicon.svg, og-image.png (+ .svg source), logo-512.png, apple-touch-icon.png (from logo.svg)
robots.txt, sitemap.xml, llms.txt, <key>.txt (IndexNow key)
google-apps-script/Code.gs   sign-up receiver (not deployed with the site; paste into Apps Script)
```

## Preview locally

```bash
node tools/serve-site.js
```
Run from the repo root, then open http://localhost:8080. (Pages use root paths like `/css/site.css`, so open them through a server, not by double-clicking.)

## Deploy

- **Netlify:** New site → deploy the `site` folder (drag and drop, or set "Publish directory" to `site`, no build command).
- **Vercel:** New project → Root Directory `site`, Framework "Other", no build command.

No `netlify.toml` or `vercel.json` is needed.

## Turn on sign-ups (Google Sheet)

1. Create a Google Sheet named e.g. "Kid Pavo sign-ups" in the Kid Pavo Google account.
2. In the sheet: **Extensions → Apps Script**. Delete the sample code and paste all of `google-apps-script/Code.gs`. Save.
3. **Deploy → New deployment** → type **Web app**. Execute as: **Me**. Who has access: **Anyone**. Deploy and allow the permissions.
4. Copy the Web app URL (ends in `/exec`). Open it in a browser: you should see `{"ok":true,"service":"kidpavo-signups"}`.
5. Paste the URL into `js/config.js`: `window.SIGNUP_ENDPOINT = 'https://script.google.com/macros/s/.../exec';` and redeploy the site.
6. Test with your own email. A row appears in the `Signups` tab (timestamp, email, age group).

While `SIGNUP_ENDPOINT` is empty, the form shows "Sign-ups open soon" and sends nothing.
If you edit `Code.gs` later, use **Deploy → Manage deployments → Edit → New version** so the URL stays the same.

## Updating brand files

After changing tokens or Pavo in `brand/`, run from the repo root:

```bash
node brand/build.js
```
```bash
node tools/build-site-assets.js
```

That refreshes `assets/`, `favicon.svg` and `og-image.svg`. Re-make `og-image.png` (1200×630) with headless Edge or Chrome from inside `site/`:

```bash
"/c/Program Files (x86)/Microsoft/Edge/Application/msedge.exe" --headless=new --hide-scrollbars --window-size=1200,630 --virtual-time-budget=5000 --screenshot="$(pwd -W)/og-image.png" "file:///$(pwd -W)/og-image.svg"
```

## SEO and AI search

After editing any copy in `index.html`, run from the repo root (regenerates JSON-LD, `llms.txt`, sitemap dates):

```bash
node tools/build-seo.js
```

After each deploy, ping Bing/ChatGPT search via IndexNow:

```bash
node tools/indexnow.js
```

Full strategy and the founder checklist: `docs/SEO-AI-VISIBILITY.md`.

## Before going live

The site is in **pre-launch mode** (noindex everywhere, AI crawlers blocked, IndexNow disabled). Check with `node tools/launch-mode.js`; switch with `node tools/launch-mode.js live` only after every item in `docs/LAUNCH-CHECKLIST.md` is done.


- Founder note in `index.html` is a placeholder: replace every `[bracketed]` part and remove the "Draft placeholder" tag.
- Privacy policy is marked "Draft — pending legal review".
- Confirm "No ads" (Safety section) with the founder.
- Hindi lines ("नमस्ते!", "चलो खेलें!") need a native-speaker check.
