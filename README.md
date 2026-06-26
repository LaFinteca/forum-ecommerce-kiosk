# Forum Ecommerce Kiosk

A self-contained, standalone web application bundling a forum, ecommerce, and kiosk experience into a single HTML file.

## Contents

- **`index.html`** — The complete, standalone application. It bundles all assets, scripts, and resources inline, so no build step or server is required.

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
