/**
 * FECB lead capture — Google Apps Script Web App
 *
 * Receives the urlencoded POST that the kiosk and mobile form send, and
 * appends one row per lead to a Google Sheet.
 *
 * The form posts these fields (see FIELDS below):
 *   timestamp, type, event, source, lang,
 *   name, lastname, company, role, email, telegram, phone
 *
 * Setup:
 *   1. Create a Google Sheet (e.g. "FECB Leads").
 *   2. Extensions ▸ Apps Script, paste this file, Save.
 *   3. Deploy ▸ New deployment ▸ type "Web app".
 *        - Execute as: Me
 *        - Who has access: Anyone
 *   4. Authorize when prompted, then copy the Web app URL (ends in /exec).
 *   5. Give that /exec URL to wire into the kiosk/mobile endpointUrl.
 *
 * Note: the form uses fetch(..., { mode: 'no-cors' }), so it does not read
 * the response — it just needs the endpoint to accept the POST and store it.
 */

const SHEET_NAME = 'Leads';
const FIELDS = [
  'timestamp', 'type', 'event', 'source', 'lang',
  'name', 'lastname', 'company', 'role', 'email', 'telegram', 'phone',
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000); // serialize appends so rows never collide
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) sheet = ss.insertSheet(SHEET_NAME);
    if (sheet.getLastRow() === 0) sheet.appendRow(FIELDS); // header row once
    const p = (e && e.parameter) || {};
    sheet.appendRow(FIELDS.map(function (f) { return p[f] || ''; }));
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function doGet() {
  return ContentService.createTextOutput('FECB lead capture is running.');
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
