# Lead capture (Google Sheets)

The kiosk (`index.html`) and mobile form (`mobileform/`) collect visitor
contacts. Every submission is **always** saved to the browser's
`localStorage` under the key `fecb_leads`, and — when an endpoint is
configured — also `POST`ed to a backend.

This folder holds the backend: a Google Apps Script Web App that appends each
lead as a row in a Google Sheet.

## Fields sent by the form

`timestamp, type, event, source, lang, name, lastname, company, role, email, telegram, phone`

- `source` is `kiosk` or `mobile` depending on where the lead was entered.
- The request is `application/x-www-form-urlencoded`, sent with `mode: 'no-cors'`.

## Setup

1. Create a Google Sheet (e.g. **FECB Leads**).
2. **Extensions ▸ Apps Script**, paste [`Code.gs`](./Code.gs), **Save**.
3. **Deploy ▸ New deployment ▸ Web app**
   - **Execute as:** Me
   - **Who has access:** Anyone
4. Authorize when prompted; copy the **Web app URL** (ends in `/exec`).
5. Set that URL as the kiosk/mobile `endpointUrl` (wired in the page code).

## Retrieving leads captured offline

If a device was offline during the event, its leads are still in
`localStorage['fecb_leads']` on that device. Open the page, then in the
browser console:

```js
copy(localStorage.getItem('fecb_leads')); // copies the JSON array
```
