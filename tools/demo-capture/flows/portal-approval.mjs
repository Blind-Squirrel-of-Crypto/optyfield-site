// Flow 2 — the customer approves (or declines) machine by machine in the portal,
// and the office sees exactly what was approved.
import { WEB_URL } from '../env.mjs'
import { crmState, humanClick, manifest } from '../lib.mjs'

export const id = 'portal-approval'
export const title = 'Customer approves unit by unit'

export async function run({ newPage, rec }) {
  const m = manifest()
  const page = await newPage(undefined)

  // Sign in as the (fictional) gym's fitness director.
  await page.goto(`${WEB_URL}/portal/login`)
  await page.getByPlaceholder('you@company.com').pressSequentially(m.portal.email, { delay: 25 })
  await page.getByPlaceholder('••••••••').fill(m.portalPassword)
  await humanClick(page, page.getByRole('button', { name: 'Sign In', exact: true }))
  await page.waitForURL(/\/portal\/?$/)
  await page.waitForLoadState('networkidle')

  await page.goto(`${WEB_URL}/portal/estimates/${m.ids.portalEstimate}`)
  await page.getByText(m.ids.portalEstimateNumber).first().waitFor()
  await page.waitForLoadState('networkidle')
  // The portal's sticky totals bar is 50% transparent (bg-slate-800/50), so the next
  // machine's text shows through it. Make it solid for the shots; the real fix is one
  // class in PortalEstimateDetail.tsx (logged in reviews/website-revamp.md).
  await page.addStyleTag({ content: '.sticky.bottom-4.no-print{background:#1e293b !important;backdrop-filter:blur(8px)}' })
  const approve = page.getByRole('button', { name: 'Approve Repair' })
  const decline = page.getByRole('button', { name: 'Decline', exact: true })
  await approve.first().evaluate((el) => el.scrollIntoView({ block: 'center' }))
  await rec.step(page, {
    key: 'portal-estimate',
    title: 'The gym manager sees every machine',
    caption: 'Each machine has its own notes, parts and price — no 5-page PDF to decipher.',
    hotspot: approve.first(),
  })
  // Approve the out-of-service treadmill.
  await humanClick(page, approve.first())
  await page.waitForTimeout(600)

  // Decline the cosmetic seat pad (last unit).
  const lastDecline = decline.last()
  await lastDecline.evaluate((el) => el.scrollIntoView({ block: 'center' }))
  await rec.step(page, {
    key: 'portal-decline',
    title: 'Yes to this one, not that one',
    caption: 'The torn seat pad can wait. She declines that machine and keeps going — the total updates as she decides.',
    hotspot: lastDecline,
  })
  await humanClick(page, lastDecline)
  // Approve the rest.
  for (let i = 0; i < 3; i++) {
    const next = approve.first()
    if (!(await next.isVisible().catch(() => false))) break
    await next.evaluate((el) => el.scrollIntoView({ block: 'center' }))
    await humanClick(page, next)
    await page.waitForTimeout(400)
  }
  const submit = page.getByRole('button', { name: 'Submit Response' })
  // Show the declined seat pad above the totals bar, not under it.
  await decline.last().evaluate((el) => el.scrollIntoView({ block: 'center' }))
  await rec.step(page, {
    key: 'portal-submit',
    title: 'Four approved, one declined',
    caption: 'One response covers every machine. Partial approvals are normal — nothing gets lost in an email thread.',
    hotspot: submit,
  })
  await humanClick(page, submit)
  await page.getByPlaceholder('Type your full name to sign').pressSequentially('Priya Shah', { delay: 40 })
  await page.getByPlaceholder('Enter PO number').pressSequentially('IW-4471', { delay: 40 })
  const confirm = page.getByRole('button', { name: 'Confirm & Submit' })
  await rec.step(page, {
    key: 'portal-sign',
    title: 'Signed, with their PO number',
    caption: 'She signs by name and adds her PO number, so billing has what it needs.',
    hotspot: confirm,
  })
  await humanClick(page, confirm)
  const skip = page.getByRole('button', { name: 'Skip' })
  if (await skip.isVisible({ timeout: 3000 }).catch(() => false)) await humanClick(page, skip)
  await page.getByText(/Response Submitted!|Your response has been submitted/).first().waitFor()
  await rec.step(page, { key: 'portal-done', title: 'Done in under a minute', caption: 'The customer is finished. The office is notified straight away.' })

  // Back in the office: only the approved machines move forward.
  const office = await newPage(await crmState(m.users.dispatcher))
  await office.goto(`${WEB_URL}/approval-queue`)
  await office.waitForLoadState('networkidle')
  const card = office.locator('div').filter({ hasText: m.ids.portalEstimateNumber }).filter({ has: office.getByRole('button', { name: /^Release to/ }) }).last()
  await card.waitFor()
  await card.evaluate((el) => el.scrollIntoView({ block: 'center' }))
  await rec.step(office, {
    key: 'approval-queue',
    title: 'The office releases only what was approved',
    caption: 'The four approved machines go to parts ordering, then dispatch. The declined seat stays on file to quote again later.',
    hotspot: card.getByRole('button', { name: /^Release to/ }),
  })
  await office.waitForTimeout(1500)
}
