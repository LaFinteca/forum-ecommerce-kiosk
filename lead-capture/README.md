# Lead capture + winner draw (Google Sheets)

The kiosk (`index.html`) and mobile form (`mobileform/`) collect visitor
contacts. Every submission is **always** saved to the browser's
`localStorage` under the key `fecb_leads`, and — when an endpoint is
configured — also `POST`ed to a backend.

This folder holds the backend: a Google Apps Script Web App that:
- appends each **lead** as a row in the **Leads** sheet;
- serves the participant list to the winner-draw screen (`?action=list`, JSONP);
- appends each **confirmed winner** as a row in the **Winners** sheet.

## Winner draw

The draw screen (`Forum Ecommerce Draw.dc.html`) pulls participants from the
**Leads** sheet via `GET ?action=list` (JSONP, so it works cross-origin). Staff
can run as many **test draws** as they like — nothing is saved. Only when they
press **"Confirmar ganhador final"** is the winner written to the **Winners**
sheet (`type=winner`, `final=yes`, with the selected `prize`). The prize toggle
(iPad / AirPods) defaults by date: iPad on Jul 28 2026, AirPods on Jul 29 2026.
Confirmed winners are excluded from further draws on the same device.

## Fields sent by the form

`timestamp, type, event, source, lang, name, lastname, company, role, email, telegram, phone`

- `source` is `kiosk` or `mobile` depending on where the lead was entered.
- The request is `application/x-www-form-urlencoded`, sent with `mode: 'no-cors'`.

## Setup

1. Create a Google Sheet (e.g. **FECB Leads**).
2. **Extensions ▸ Apps Script**, paste [`Code.gs`](./Code.gs), **Save**.
3. **Deploy ▸ New deployment ▸ Web app**
   - **Execute as:** Me
   - **Who has access:** **Anyone** — _not_ "Anyone within `<your domain>`".
4. Authorize when prompted; copy the **Web app URL** (ends in `/exec`).
5. Set that URL as the kiosk/mobile `endpointUrl` (wired in the page code).

> **Important — public access.** Booth visitors are not signed into your
> Google Workspace, so the deployment must be shared with **Anyone**. A
> domain-restricted deployment has a URL containing `/a/macros/<domain>/`
> and will silently reject visitor submissions (the form posts with
> `mode: 'no-cors'` and can't see the rejection). A correct public URL looks
> like `https://script.google.com/macros/s/AKfyc.../exec` (no `/a/macros/`).
>
> If your Workspace admin has disabled sharing Apps Script Web Apps with
> "Anyone", you'll need them to allow it, or use a different public backend.

## Retrieving leads captured offline

If a device was offline during the event, its leads are still in
`localStorage['fecb_leads']` on that device. Open the page, then in the
browser console:

```js
copy(localStorage.getItem('fecb_leads')); // copies the JSON array
```
