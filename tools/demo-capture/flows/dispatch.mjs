// Flow 3 — the dispatch board: today's techs, unscheduled work by area, drag to assign.
import { WEB_URL } from '../env.mjs'
import { crmState, humanClick, manifest } from '../lib.mjs'

export const id = 'dispatch'
export const title = 'Dispatch board'
// The board is wide: shoot it on a big monitor (16:10, same shape as the other shots).
export const viewport = { width: 1920, height: 1200 }

async function drag(page, src, dst) {
  const a = await src.boundingBox()
  const b = await dst.boundingBox()
  await page.mouse.move(a.x + a.width / 2, a.y + a.height / 2, { steps: 12 })
  await page.mouse.down()
  await page.mouse.move(a.x + a.width / 2 + 12, a.y + a.height / 2 + 12, { steps: 4 })
  await page.mouse.move(b.x + 60, b.y + 15, { steps: 30 })
  await page.waitForTimeout(300)
  await page.mouse.up()
}

export async function run({ newPage, rec }) {
  const m = manifest()
  const page = await newPage(await crmState(m.users.dispatcher))
  // Fold away the left-hand queues that are empty in the demo (the board keeps this
  // in sessionStorage), so the area zones and techs get the room.
  await page.addInitScript(() => sessionStorage.setItem('dispatch-collapsed-cols', JSON.stringify({ officeReview: true, pendingJobs: true, partsPendingSA: true })))
  await page.goto(`${WEB_URL}/dispatch`)
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(800)

  // The urgent leg-press job waiting in the South zone column.
  const zoneHeader = page.getByText('South (Arlington/GP)', { exact: true }).first()
  const zone = zoneHeader.locator('xpath=ancestor::div[.//button][1]')
  const tile = zone.getByRole('button', { name: /^Summit 24 Fitness/ }).first()
  await tile.waitFor()
  await rec.step(page, {
    key: 'dispatch-board',
    title: 'Today, at a glance',
    caption: 'Every tech’s day on one board. Unscheduled jobs wait in their area of town, ready to drag onto a tech.',
    hotspot: tile,
  })

  // Drag the urgent leg-press job onto Dev's afternoon.
  const heading = page.getByRole('heading', { name: 'Dev Patel', level: 3 })
  await heading.scrollIntoViewIfNeeded()
  const column = heading.locator('xpath=ancestor::div[.//*[normalize-space(text())="4PM"]][1]')
  const slot = column.getByText("4PM", { exact: true }).first()
  await slot.scrollIntoViewIfNeeded()
  await drag(page, tile, slot)
  await page.waitForTimeout(1500)
  const placed = column.getByRole('button', { name: /Summit 24 Fitness/ }).filter({ hasText: '16:00' }).first()
  await rec.step(page, {
    key: 'dispatch-assigned',
    title: 'Drag, drop, done',
    caption: 'The job lands on Dev’s afternoon. Every other dispatcher’s screen updates live, and it appears on Dev’s phone.',
    hotspot: placed,
  })
  // Right after a drag the side panel still shows the job as "Unassigned" until the
  // board refreshes (display bug; the save itself is correct). Reload first.
  await page.reload()
  await page.waitForLoadState('networkidle')
  await page.getByRole('heading', { name: 'Dev Patel', level: 3 }).scrollIntoViewIfNeeded()
  await page.waitForTimeout(800)
  await humanClick(page, column.getByRole('button', { name: /Summit 24 Fitness/ }).filter({ hasText: '16:00' }).first())
  await page.waitForTimeout(1500)
  await rec.step(page, {
    key: 'dispatch-detail',
    title: 'Everything about the job, one click away',
    caption: 'Customer, location, access notes, equipment and history — without leaving the board.',
  })
  await page.waitForTimeout(1500)
}
