/**
 * Kid Pavo — "Notify me at launch" sign-ups → Google Sheet.
 * Deploy as a Web App (Execute as: Me, Who has access: Anyone). Setup steps: site/README.md.
 * Receives a form-encoded POST: email, age (optional), website (honeypot, must be empty).
 */
var SHEET_NAME = 'Signups';
var AGE_GROUPS = ['', '1-2', '3-4', '5'];
var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function doPost(e) {
  var p = (e && e.parameter) || {};
  if (p.website) return json_({ ok: true }); // honeypot filled: bot. Pretend success, save nothing.

  var email = String(p.email || '').trim().toLowerCase().slice(0, 254);
  var age = String(p.age || '').trim();
  if (!EMAIL_RE.test(email)) return json_({ ok: false, error: 'invalid_email' });
  if (AGE_GROUPS.indexOf(age) === -1) age = '';

  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var sheet = getSheet_();
    // Skip duplicates so the same parent is only emailed once.
    var last = sheet.getLastRow();
    if (last > 1) {
      var existing = sheet.getRange(2, 2, last - 1, 1).getValues();
      for (var i = 0; i < existing.length; i++) {
        if (existing[i][0] === email) return json_({ ok: true });
      }
    }
    sheet.appendRow([new Date(), email, age]);
  } finally {
    lock.releaseLock();
  }
  return json_({ ok: true });
}

// Visiting the URL in a browser shows this, which confirms the deployment works.
function doGet() {
  return json_({ ok: true, service: 'kidpavo-signups' });
}

function getSheet_() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sheet.getLastRow() === 0) {
    sheet.appendRow(['Timestamp', 'Email', 'Age group']);
    sheet.setFrozenRows(1);
  }
  return sheet;
}

function json_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
