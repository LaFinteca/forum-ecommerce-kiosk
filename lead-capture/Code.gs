/**
 * FECB lead capture + winner draw — Google Apps Script Web App
 *
 * Handles three things for the kiosk / mobile form / winner-draw screen:
 *
 *   1. POST (type != 'winner')  → append a lead to the "Leads" sheet.
 *   2. POST (type == 'winner')  → append a confirmed winner to the "Winners" sheet.
 *   3. GET  ?action=list        → return the participant list as JSON (or JSONP
 *                                 when a &callback= is supplied — the draw screen
 *                                 uses JSONP so it can read the list cross-origin).
 *
 * Setup / deploy:
 *   1. Create a Google Sheet (e.g. "FECB Leads").
 *   2. Extensions ▸ Apps Script, paste this file, Save.
 *   3. Deploy ▸ New deployment ▸ type "Web app".
 *        - Execute as: Me
 *        - Who has access: Anyone   ← MUST be "Anyone", NOT "Anyone within <domain>".
 *   4. Authorize; copy the Web app URL (ends in /exec).
 *
 * IMPORTANT: after editing this code you must publish a NEW VERSION
 * (Deploy ▸ Manage deployments ▸ ✏️ ▸ Version: New version ▸ Deploy),
 * otherwise the old code keeps running.
 *
 * Writes use fetch(..., { mode: 'no-cors' }); the draw's list read uses JSONP.
 */

// Bound script (created via the Sheet's Extensions ▸ Apps Script): leave ''.
// Standalone script: paste the Sheet ID (the /spreadsheets/d/<THIS>/edit token).
const SHEET_ID = '';

const LEADS_SHEET = 'Leads';
const WINNERS_SHEET = 'Winners';

const LEAD_FIELDS = [
  'timestamp', 'type', 'event', 'source', 'lang',
  'name', 'lastname', 'company', 'role', 'email', 'telegram', 'phone',
];
const WINNER_FIELDS = [
  'timestamp', 'prize', 'final', 'event', 'lang',
  'name', 'lastname', 'company', 'role', 'email',
];

function doPost(e) {
  const lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000); // serialize appends so rows never collide
    const p = (e && e.parameter) || {};
    const isWinner = String(p.type || '') === 'winner';
    const sheetName = isWinner ? WINNERS_SHEET : LEADS_SHEET;
    const fields = isWinner ? WINNER_FIELDS : LEAD_FIELDS;
    const sheet = getSheet_(sheetName);
    if (sheet.getLastRow() === 0) sheet.appendRow(fields); // header row once
    sheet.appendRow(fields.map(function (f) { return p[f] || ''; }));
    return json({ ok: true });
  } catch (err) {
    return json({ ok: false, error: String(err) });
  } finally {
    try { lock.releaseLock(); } catch (ignore) {}
  }
}

function doGet(e) {
  const p = (e && e.parameter) || {};
  if (String(p.action || '') === 'list') {
    const body = JSON.stringify(getLeads_());
    if (p.callback) {
      // JSONP — the draw screen loads this via a <script> tag.
      return ContentService
        .createTextOutput(p.callback + '(' + body + ')')
        .setMimeType(ContentService.MimeType.JAVASCRIPT);
    }
    return ContentService.createTextOutput(body).setMimeType(ContentService.MimeType.JSON);
  }
  return ContentService.createTextOutput('FECB lead capture is running.');
}

/** Read the Leads sheet and return participants for the draw. */
function getLeads_() {
  const sheet = getSheet_(LEADS_SHEET);
  if (sheet.getLastRow() < 2) return [];
  const values = sheet.getDataRange().getValues();
  const header = values[0];
  const idx = {};
  header.forEach(function (h, i) { idx[String(h).trim()] = i; });
  const col = function (row, key) { const i = idx[key]; return i == null ? '' : row[i]; };
  const out = [];
  for (var r = 1; r < values.length; r++) {
    var row = values[r];
    var name = String(col(row, 'name') || '').trim();
    if (!name) continue;
    out.push({
      name: name,
      lastname: String(col(row, 'lastname') || ''),
      company: String(col(row, 'company') || ''),
      role: String(col(row, 'role') || ''),
      email: String(col(row, 'email') || ''),
    });
  }
  return out;
}

function getSheet_(name) {
  const ss = SHEET_ID
    ? SpreadsheetApp.openById(SHEET_ID)
    : SpreadsheetApp.getActiveSpreadsheet();
  if (!ss) throw new Error('No spreadsheet: set SHEET_ID for a standalone script.');
  return ss.getSheetByName(name) || ss.insertSheet(name);
}

function json(obj) {
  return ContentService
    .createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
