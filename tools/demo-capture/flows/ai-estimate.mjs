// Flow 1 — a technician's notes become a priced estimate.
// Work order (tech notes per machine) → AI Estimates queue → AI draft review → estimate.
//
// KNOWN APP BUG (reviews/estimates.md estimates-25, appendix G AI-1/AI-2, Critical):
// in today's CRM the first Approve click on an AI line crashes the page, and
// "Create Estimate" posts a bad id. Until that is fixed, this flow performs those
// two transitions through the API and then re-opens the real screens, so every
// screenshot is genuine but the clicks between steps 3→4→5 are not. Once fixed,
// run with AI_UI_FIXED=1 and the whole flow is driven through the UI.
import { WEB_URL } from '../env.mjs'
import { apiAs, crmState, humanClick, manifest } from '../lib.mjs'

export const id = 'ai-estimate'
export const title = 'AI estimate from technician notes'
const UI_FIXED = process.env.AI_UI_FIXED === '1'

async function openDraft(page) {
  const row = page.locator('div').filter({ hasText: 'Ironworks Athletic Club' }).filter({ has: page.getByRole('button', { name: 'Start Review' }) }).last()
  return row.getByRole('button', { name: 'Start Review' })
}

export async function run({ newPage, rec }) {
  const m = manifest()
  const state = await crmState(m.users.estimator)
  const page = await newPage(state)

  // 1. The work order, with what the tech typed on site for each machine.
  await page.goto(`${WEB_URL}/work-orders`)
  await page.waitForLoadState('networkidle')
  await page.getByPlaceholder(/Search by WO/).pressSequentially(m.ids.diagWorkOrderNumber, { delay: 40 })
  await page.waitForTimeout(800)
  await humanClick(page, page.getByText(m.ids.diagWorkOrderNumber).first())
  const note = page.getByText(/TM-1 belt slips/).first()
  await note.waitFor()
  await note.evaluate((el) => el.scrollIntoView({ block: 'center' }))
  await rec.step(page, {
    key: 'tech-notes',
    title: 'The tech writes notes the way techs do',
    caption: 'On site, Marcus types quick notes for each machine in the OptyField app: shorthand, abbreviations and all.',
  })
  await page.keyboard.press('Escape')

  // 2. The AI Estimates queue: drafts are already waiting.
  await page.goto(`${WEB_URL}/ai-estimates`)
  await page.waitForLoadState('networkidle')
  const start = await openDraft(page)
  await rec.step(page, {
    key: 'ai-queue',
    title: 'A draft estimate is already waiting',
    caption: 'The AI has turned those notes into a priced draft, with parts from your catalogue, labor, and a confidence score.',
    hotspot: start,
  })
  await humanClick(page, start)

  // 3. Review: confidence, notes and warnings, line by line.
  const approveAll = page.getByRole('button', { name: /Approve All/ })
  await approveAll.waitFor()
  await rec.step(page, {
    key: 'ai-review',
    title: 'Your estimator stays in charge',
    caption: 'Every line shows how sure the AI is and why. Lines it is unsure about are flagged, so the estimator knows where to look.',
    hotspot: approveAll,
  })

  let estimateId
  if (UI_FIXED) {
    await humanClick(page, approveAll)
    await page.waitForTimeout(1200)
  } else {
    const draft = await apiAs(state, 'GET', `/ai-estimates/${m.ids.showcaseDraft}`)
    for (const li of draft.lineItems) await apiAs(state, 'PUT', `/ai-estimates/${draft.id}/line-items/${li.id}`, { reviewStatus: 'APPROVED' })
    await page.reload()
    await page.waitForLoadState('networkidle')
    await humanClick(page, await openDraft(page))
  }

  // 4. Approved lines → one click to a real estimate.
  const create = page.getByRole('button', { name: 'Create Estimate' })
  await create.waitFor()
  await rec.step(page, {
    key: 'ai-approved',
    title: 'Approve, edit or reject each line',
    caption: 'When the lines look right, one click turns the draft into a normal estimate, grouped machine by machine.',
    hotspot: create,
  })
  if (UI_FIXED) {
    await humanClick(page, create)
    await page.waitForURL(/\/estimates/)
  } else {
    estimateId = (await apiAs(state, 'POST', `/ai-estimates/${m.ids.showcaseDraft}/approve`)).estimateId
    await page.goto(`${WEB_URL}/estimates?id=${estimateId}`)
  }
  await page.waitForLoadState('networkidle')
  await page.waitForTimeout(2000)
  // Scroll the new estimate to its machines, so the shot shows the per-unit lines.
  const unit = page.getByText('Precor TRM 885').first()
  if (await unit.isVisible({ timeout: 5000 }).catch(() => false)) await unit.evaluate((el) => el.scrollIntoView({ block: 'start' }))
  await rec.step(page, {
    key: 'ai-estimate-created',
    title: 'A customer-ready estimate',
    caption: 'From tech notes to a priced estimate, machine by machine, ready to send to the customer’s portal.',
  })
  await page.waitForTimeout(1500)
}
