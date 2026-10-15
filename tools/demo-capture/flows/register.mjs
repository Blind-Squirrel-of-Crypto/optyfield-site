// Flow 4 — the equipment register (stills only): every machine by make, model,
// serial and position; one machine's record; the customer's own view in the portal.
import { WEB_URL } from '../env.mjs'
import { crmState, humanClick, manifest, portalState } from '../lib.mjs'

export const id = 'register'
export const title = 'Equipment register'

export async function run({ newPage, rec }) {
  const m = manifest()
  const page = await newPage(await crmState(m.users.admin))
  await page.goto(`${WEB_URL}/equipment`)
  await page.waitForLoadState('networkidle')
  await page.getByPlaceholder(/Search by customer/).pressSequentially('Ironworks', { delay: 40 })
  await page.waitForTimeout(1500)
  // Ironworks Uptown TM-1 (the treadmill from the AI estimate). Serials are deterministic per seed.
  const row = page.getByText('AM202301000').first()
  await rec.step(page, {
    key: 'register-list',
    title: 'Every machine, by make, model and serial',
    caption: 'Search across every customer and location. Status, position and warranty are visible at a glance.',
    hotspot: row,
  })
  await humanClick(page, row)
  await page.waitForTimeout(1500)
  const history = page.getByRole('button', { name: /Service History/ }).last()
  if (await history.isVisible().catch(() => false)) { await humanClick(page, history); await page.waitForTimeout(1500) }
  await rec.step(page, {
    key: 'register-detail',
    title: 'One machine’s whole story',
    caption: 'Service notes, estimates and repairs for this treadmill, in one place.',
  })

  const portal = await newPage(await portalState(m.portal.email, 'Priya Shah'))
  await portal.goto(`${WEB_URL}/portal/equipment`)
  await portal.waitForLoadState('networkidle')
  await portal.getByText('Ironworks — Uptown').first().click()
  await portal.waitForTimeout(1200)
  await rec.step(portal, {
    key: 'portal-equipment',
    title: 'Your customer sees it too',
    caption: 'Gym managers see their own machines and what each one needs.',
  })
}
