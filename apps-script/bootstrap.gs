/**
 * One-account pilot bootstrap. Run once from the organization-owned Apps Script
 * deployment after clasp authorization. Re-running is idempotent by title and
 * stores resource IDs in Script Properties.
 */
function bootstrap() {
  const props = PropertiesService.getScriptProperties()
  const root = ensureFolder_("Eagle's Ark KPI Tracker - Pilot")
  const summaries = ensureFolder_('Board Summaries', root)
  const backups = ensureFolder_('Backups', root)
  const admin = ensureSpreadsheet_("Eagle's Ark KPI Tracker - Admin Raw")
  const board = ensureSpreadsheet_("Eagle's Ark KPI Tracker - Board Aggregate")
  const form = ensureForm_("Eagle's Ark Ministry Monthly Submission")
  ensureHeartbeatTrigger_()
  ensureMonthlyTrigger_()
  props.setProperties({
    PILOT_ROOT_FOLDER_ID: root.getId(),
    BOARD_SUMMARIES_FOLDER_ID: summaries.getId(),
    BACKUPS_FOLDER_ID: backups.getId(),
    RAW_WORKBOOK_ID: admin.getId(),
    BOARD_WORKBOOK_ID: board.getId(),
    MINISTRY_FORM_ID: form.getId(),
    MINISTRY_FORM_URL: form.getPublishedUrl(),
    APP_TIMEZONE: 'America/Edmonton',
    FEATURE_MEMBERSHIP_STATUS: 'false',
    FEATURE_ATTENDANCE_DECLINE_ALERT: 'false',
    FEATURE_UNVERIFIED_REACH: 'false',
    FEATURE_AUTO_BOARD_DELIVERY: 'false',
    PDF_RECIPIENT_EMAIL: 'aayey812@mtroyal.ca',
    FEATURE_AUTO_BOARD_DELIVERY: 'true',
  }, true)
  return { rootId: root.getId(), rawWorkbookId: admin.getId(), boardWorkbookId: board.getId(), ministryFormId: form.getId() }
}

function ensureForm_(name) {
  const files = DriveApp.getFilesByName(name)
  while (files.hasNext()) {
    const file = files.next()
    if (file.getMimeType() === MimeType.GOOGLE_FORMS) return FormApp.openById(file.getId())
  }
  const form = FormApp.create(name)
  form.setDescription('Persistent verified ministry outcome submission for the Eagle\'s Ark KPI Tracker pilot.')
  form.addTextItem().setTitle('Ministry ID').setRequired(true)
  form.addTextItem().setTitle('Reporting period (YYYY-MM)').setRequired(true)
  form.addTextItem().setTitle('Result').setRequired(true)
  return form
}

function ensureHeartbeatTrigger_() {
  const exists = ScriptApp.getProjectTriggers().some((trigger) => trigger.getHandlerFunction() === 'heartbeat')
  if (!exists) ScriptApp.newTrigger('heartbeat').timeBased().everyDays(1).atHour(8).create()
}

function ensureMonthlyTrigger_() {
  const exists = ScriptApp.getProjectTriggers().some((trigger) => trigger.getHandlerFunction() === 'runMonthlyCycle')
  if (!exists) ScriptApp.newTrigger('runMonthlyCycle').timeBased().onMonthDay(1).atHour(8).create()
}

function runMonthlyCycle() {
  const props = PropertiesService.getScriptProperties()
  const period = Utilities.formatDate(new Date(), props.getProperty('APP_TIMEZONE') || 'America/Edmonton', 'yyyy-MM')
  const pdf = createBoardSummaryPdf_(period)
  if (props.getProperty('FEATURE_AUTO_BOARD_DELIVERY') === 'true') {
    MailApp.sendEmail({ to: props.getProperty('PDF_RECIPIENT_EMAIL'), subject: `Eagle's Ark board summary · ${period}`, body: `Attached is the aggregate board summary for ${period}.`, attachments: [pdf.getBlob()] })
  }
  props.setProperty('LAST_MONTHLY_CYCLE_AT', new Date().toISOString())
  return { period: period, pdfId: pdf.getId(), delivered: props.getProperty('FEATURE_AUTO_BOARD_DELIVERY') === 'true' }
}

function createBoardSummaryPdf_(period) {
  const props = PropertiesService.getScriptProperties()
  const folder = DriveApp.getFolderById(props.getProperty('BOARD_SUMMARIES_FOLDER_ID'))
  const doc = DocumentApp.create(`Eagle's Ark Board Summary ${period}`)
  doc.getBody().appendParagraph("Eagle's Ark Church Health").setHeading(DocumentApp.ParagraphHeading.HEADING1)
  doc.getBody().appendParagraph(`Aggregate board summary · ${period}`)
  doc.getBody().appendParagraph('Live attendance, replay participation, combined participants, and approved ministry outcomes.')
  doc.saveAndClose()
  const pdf = folder.createFile(DriveApp.getFileById(doc.getId()).getAs(MimeType.PDF).setName(`Eagle's-Ark-Board-Summary-${period}.pdf`))
  DriveApp.getFileById(doc.getId()).setTrashed(true)
  return pdf
}

function heartbeat() {
  PropertiesService.getScriptProperties().setProperty('LAST_HEARTBEAT_AT', new Date().toISOString())
}

function backupPilotResources() {
  const props = PropertiesService.getScriptProperties()
  const backupFolder = DriveApp.getFolderById(props.getProperty('BACKUPS_FOLDER_ID'))
  const stamp = Utilities.formatDate(new Date(), props.getProperty('APP_TIMEZONE') || 'America/Edmonton', 'yyyyMMdd-HHmmss')
  const ids = [props.getProperty('RAW_WORKBOOK_ID'), props.getProperty('BOARD_WORKBOOK_ID')]
  const copies = ids.map((id) => DriveApp.getFileById(id).makeCopy(`KPI-backup-${stamp}-${id.slice(0, 6)}`, backupFolder).getId())
  props.setProperty('LAST_BACKUP_AT', new Date().toISOString())
  props.setProperty('LAST_BACKUP_MANIFEST', JSON.stringify(copies))
  return { stamp: stamp, copies: copies }
}

function ping() {
  return { ok: true, account: Session.getActiveUser().getEmail() }
}

function ensureFolder_(name, parent) {
  const iterator = (parent || DriveApp).getFoldersByName(name)
  if (iterator.hasNext()) return iterator.next()
  return parent ? parent.createFolder(name) : DriveApp.createFolder(name)
}

function ensureSpreadsheet_(name) {
  const files = DriveApp.getFilesByName(name)
  if (files.hasNext()) return SpreadsheetApp.open(files.next())
  return SpreadsheetApp.create(name)
}
