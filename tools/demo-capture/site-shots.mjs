// Screenshots of the marketing site itself (for review docs), desktop + phone.
//   node site-shots.mjs <outDir> [baseUrl=http://localhost:3300]
// Needs the site running (npx next dev -p 3300). Also clicks through /demo once.
import { chromium } from 'playwright'
import { mkdirSync } from 'node:fs'
import { resolve } from 'node:path'

const out = resolve(process.argv[2] ?? '.state/site')
const base = process.argv[3] ?? 'http://localhost:3300'
mkdirSync(out, { recursive: true })
const PAGES = ['/', '/dispatch-scheduling', '/customer-approvals', '/equipment-register', '/fitness-service-companies', '/pricing', '/about', '/contact', '/demo']

const browser = await chromium.launch()
for (const [label, viewport] of [['desktop', { width: 1440, height: 900 }], ['phone', { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport, deviceScaleFactor: 1 })
  page.on('pageerror', (e) => console.log(`pageerror ${label}:`, e.message))
  for (const p of PAGES) {
    await page.goto(base + p, { waitUntil: 'networkidle' })
    await page.waitForTimeout(400)
    const name = (p === '/' ? 'home' : p.slice(1)).replace(/\//g, '-')
    await page.screenshot({ path: resolve(out, `${label}-${name}.png`), fullPage: label === 'desktop' && p !== '/demo' ? true : false })
  }
  if (label === 'desktop') {
    // Click the demo's hotspots through to the end card.
    await page.goto(base + '/demo', { waitUntil: 'networkidle' })
    await page.locator('.peek').scrollIntoViewIfNeeded()
    for (let i = 0; i < 12; i++) {
      if (await page.locator('.peek-end').isVisible()) break
      const hot = page.locator('.peek-hotspot')
      if (await hot.isVisible()) await hot.click(); else await page.getByRole('button', { name: /Next|Finish/ }).last().click()
      await page.waitForTimeout(250)
      if (i === 2) await page.locator('.peek').screenshot({ path: resolve(out, 'desktop-demo-step3.png') })
    }
    await page.locator('.peek').screenshot({ path: resolve(out, 'desktop-demo-end.png') })
  }
  await page.close()
}
await browser.close()
console.log(`site shots → ${out}`)
