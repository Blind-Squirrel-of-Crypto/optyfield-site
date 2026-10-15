// Flow 5 — Schedule Builder: every unscheduled job on one map, with a tech's day loaded.
//
// NEEDS A GOOGLE MAPS KEY. Without one, Google covers the map with "For development
// purposes only", so this flow skips itself. Run capture-with-maps.ps1 (asks for the
// key, never saves it). DEMO_SB_FORCE=1 runs it without a key, to test the clicks
// (those screenshots are not fit to publish).
//
// The map opens on its default centre (Houston) here, not on the Dallas jobs, so we
// centre it the way a user would: open a job, "Show on Map", then zoom out.
// (Pins need the production build — see stack.mjs.)
import { WEB_URL } from '../env.mjs'
import { crmState, humanClick, manifest } from '../lib.mjs'

export const id = 'schedule-builder'
export const title = 'Schedule Builder'
export const viewport = { width: 1920, height: 1200 }

export async function run({ newPage, rec }) {
  if (!process.env.DEMO_GOOGLE_MAPS_KEY && process.env.DEMO_SB_FORCE !== '1') {
    console.log('[capture] schedule-builder skipped: set DEMO_GOOGLE_MAPS_KEY to capture it')
    return
  }
  const m = manifest()
  const page = await newPage(await crmState(m.users.dispatcher))
  await page.goto(`${WEB_URL}/schedule-builder`, { waitUntil: 'domcontentloaded', timeout: 90_000 })
  const scheduleTab = page.getByRole('button', { name: /^Schedule/ }).first()
  await scheduleTab.waitFor({ timeout: 60_000 })
  await page.waitForTimeout(2500)
  const dismiss = page.getByRole('button', { name: 'OK' }) // Google's dev-mode dialog (no key)
  if (await dismiss.isVisible().catch(() => false)) await dismiss.click()

  // Load Alicia's day (3 jobs in Irving / Fort Worth).
  await humanClick(page, scheduleTab)
  const techSelect = page.locator('select').filter({ has: page.locator('option', { hasText: 'Choose tech…' }) }).first()
  await techSelect.selectOption({ label: 'Alicia Brooks' })
  await page.waitForTimeout(600)
  await humanClick(page, page.getByRole('button', { name: /^(Load|Add) their \d+ job/ }).first())
  await page.waitForTimeout(1200)

  // Centre the map on Dallas–Fort Worth: open the first job, Show on Map, zoom out.
  await humanClick(page, page.getByText('Northpoint Commun', { exact: false }).first())
  await page.waitForTimeout(1000)
  await humanClick(page, page.getByRole('button', { name: /Show on Map/ }).first())
  await page.waitForTimeout(1500)
  const zoomOut = page.getByRole('button', { name: 'Zoom out' })
  for (let i = 0; i < 5; i++) { await zoomOut.click(); await page.waitForTimeout(350) }
  // Nudge east so Fort Worth to Rockwall is all in frame.
  const map = page.locator('.gm-style').first()
  const b = await map.boundingBox()
  if (b) {
    await page.mouse.move(b.x + b.width * 0.55, b.y + b.height * 0.5)
    await page.mouse.down()
    await page.mouse.move(b.x + b.width * 0.45, b.y + b.height * 0.5, { steps: 15 })
    await page.mouse.up()
  }
  await page.waitForTimeout(2500) // tiles
  // Close the job preview (its X is the first button in the panel) so the map gets the room.
  const panel = page.locator('div').filter({ has: page.getByRole('button', { name: /Show on Map/ }) }).filter({ has: page.getByText(/WO-\d{4}-/) }).last()
  await panel.locator('button').first().click().catch(() => {})
  await page.waitForTimeout(800)
  if (process.env.DEMO_SB_FILTERS === '1') { await page.getByRole('button', { name: /^Filters/ }).first().click(); await page.waitForTimeout(1200) }
  await page.waitForTimeout(1500)

  await rec.step(page, {
    key: 'sb-map',
    title: 'Plan the day on a map',
    caption: 'Every job waiting to be scheduled is on one map, coloured by area, next to a tech’s day. Add the nearby ones, and OptyField puts the route in driving order before you send it to the board.',
    hotspot: page.getByRole('button', { name: /Optimise/ }).first(),
  })
  await page.waitForTimeout(1500)
}
