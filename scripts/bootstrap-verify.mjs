import fs from 'node:fs'

const required = ['apps-script/appsscript.json', 'apps-script/bootstrap.gs', '.clasp.json']
const missing = required.filter((file) => !fs.existsSync(file))
if (missing.length) {
  console.error(`Bootstrap files missing: ${missing.join(', ')}`)
  process.exit(1)
}
console.log('Local Apps Script bootstrap manifest is complete.')
