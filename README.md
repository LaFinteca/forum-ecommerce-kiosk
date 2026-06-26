# Forum Ecommerce Kiosk

A self-contained, standalone web application bundling a forum, ecommerce, and kiosk experience into a single HTML file.

## Contents

This is a multi-page prototype. Each page is a self-contained, standalone HTML file (all assets, scripts, and resources are bundled inline — no build step or server required):

- **`index.html`** — The **Kiosk** page (booth attendant view). Entry point. Offers "Register contacts" and "Sortear ganhador" (draw winner).
- **`Forum Ecommerce Draw.dc.html`** — The **Draw** page. Opened from the kiosk's "Sortear ganhador" button; returns to the kiosk via its back button.
- **`mobileform/index.html`** — The **Mobile** page (visitor-facing form), served at **`/mobileform`**. Reached by scanning the kiosk's QR code rather than by in-app navigation.

### Navigation

```
index.html  ──(Sortear ganhador)──▶  Forum Ecommerce Draw.dc.html
     ▲                                          │
     └──────────────(‹ back)───────────────────┘

index.html  ──(QR code / formUrl)──▶  /mobileform  (mobileform/index.html)
```

> The kiosk's QR code encodes its `formUrl`, which points to `/mobileform` on this site
> (`https://lafinteca.github.io/forum-ecommerce-kiosk/mobileform/`). If you later attach a
> custom domain so the app is served at the domain root, update `formUrl` to the bare
> `/mobileform` path.

## Running locally

Because everything is bundled into one file, you can simply open it in a browser:

```bash
# Open directly
open index.html        # macOS
xdg-open index.html    # Linux
```

Or serve it over HTTP (recommended, some browsers restrict features on `file://`):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000/
```

> Note: The page requires JavaScript. On load it briefly displays an "Unpacking..." indicator while it unpacks the embedded bundle, then renders the app.

## Deploying

Since the app is a single static `index.html`, it can be hosted on any static host:

- **GitHub Pages** — enable Pages for this repository (serve from the branch root).
- **Netlify / Vercel / Cloudflare Pages** — point at the repository; no build command needed.
- Any static file server / CDN.

## Notes

`index.html` is a large file (~16 MB) because all images, scripts, and other assets are embedded inline to make the page fully self-contained and portable.
