// Dev helper: screenshot arbitrary app routes as the demo admin or portal contact.
//   node probe.mjs crm /dispatch /ai-estimates
//   node probe.mjs portal /portal/estimates
// Output: .state/probe/*.png. Needs `node stack.mjs` running.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { STATE_DIR, WEB_URL } from './env.mjs'
import { crmState, manifest, newContext, portalState } from './lib.mjs'

const [who, ...paths] = process.argv.slice(2)
const m = manifest()
const state = who === 'portal' ? await portalState(m.portal.email, 'Priya Shah') : await crmState(m.users[who === 'crm' ? 'admin' : who])
const out = resolve(STATE_DIR, 'probe')
mkdirSync(out, { recursive: true })
const browser = await chromium.launch()
const ctx = await newContext(browser, state)
const page = await ctx.newPage()
page.on('pageerror', (e) => console.log('pageerror:', e.message))
for (const p of paths) {
  await page.goto(WEB_URL + p.replace('{draft}', m.ids.showcaseDraft).replace('{est}', m.ids.portalEstimate))
  await page.waitForLoadState('networkidle').catch(() => {})
  await page.waitForTimeout(1500)
  const file = resolve(out, p.replace(/[^a-z0-9]+/gi, '_') + '.png')
  await page.screenshot({ path: file, fullPage: process.env.FULL === '1' })
  console.log(file)
}
await browser.close()
