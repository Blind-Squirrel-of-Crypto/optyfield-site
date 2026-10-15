// ONE COMMAND: rebuild the fictional demo company, boot the real app locally,
// drive the three hero flows, and write fresh screenshots + videos + click-through
// data into the website (public/demo/).
//
//   npm run capture                     # everything (~3–4 min)
//   npm run capture -- --only=dispatch  # one flow
//   npm run capture -- --no-reset       # reuse the current demo DB (faster, but flows mutate data)
//
// Point at other app checkouts (e.g. the redesign branch) with DEMO_API_DIR / DEMO_WEB_DIR.
// Never touches production: local DB guard, private ports, all external keys blank.
import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { OUT_DIR, STATE_DIR } from './env.mjs'
import { newContext, StepRecorder, VIEWPORT } from './lib.mjs'
import { resetAndSeed } from './reset.mjs'
import { startStack, stopStack } from './stack.mjs'
import * as aiEstimate from './flows/ai-estimate.mjs'
import * as portalApproval from './flows/portal-approval.mjs'
import * as dispatch from './flows/dispatch.mjs'
import * as register from './flows/register.mjs'
import * as scheduleBuilder from './flows/schedule-builder.mjs'

const FLOWS = [aiEstimate, portalApproval, dispatch, scheduleBuilder, register]

// The website's "peek" tour: plan the day → customer approves → office releases.
// (AI estimating is left out until Exer-Tech is using it — Doug 2026-10-14.)
// With Schedule Builder shots (needs DEMO_GOOGLE_MAPS_KEY) the tour swaps them in.
const TOUR_WITH_SB = ['dispatch-board', 'dispatch-assigned', 'dispatch-detail', 'sb-map', 'portal-estimate', 'portal-decline', 'portal-submit', 'approval-queue']
// Flows captured but not published on the website (AI estimating isn't in use yet).
const UNPUBLISHED = new Set(['ai-estimate'])
const TOUR_NO_SB = ['dispatch-board', 'dispatch-assigned', 'dispatch-detail', 'portal-estimate', 'portal-decline', 'portal-submit', 'approval-queue']

const args = process.argv.slice(2)
const only = args.find((a) => a.startsWith('--only='))?.split('=')[1]
const flows = only ? FLOWS.filter((f) => f.id === only) : FLOWS
if (!flows.length) throw new Error(`no flow "${only}" — have: ${FLOWS.map((f) => f.id).join(', ')}`)

const shotsDir = resolve(OUT_DIR, 'shots')
const videosDir = resolve(OUT_DIR, 'videos')
const rawVideoDir = resolve(STATE_DIR, 'raw-video')
mkdirSync(shotsDir, { recursive: true }); mkdirSync(videosDir, { recursive: true })

// The Claude app's Terminal tabs can't see %LOCALAPPDATA%\ms-playwright, so prefer a
// copy of the browser kept in .state/ms-playwright when there is one.
const localBrowsers = resolve(STATE_DIR, 'ms-playwright')
if (!process.env.PLAYWRIGHT_BROWSERS_PATH && existsSync(localBrowsers)) process.env.PLAYWRIGHT_BROWSERS_PATH = localBrowsers
// Playwright reads PLAYWRIGHT_BROWSERS_PATH when it loads, so load it only now.
const { chromium } = await import('playwright')
// Start the browser first: if it's missing we stop before any server is running.
const browser = await chromium.launch()

if (!args.includes('--no-reset')) resetAndSeed()
// Ctrl+C mid-run still shuts the servers down and restores the web checkout.
for (const sig of ['SIGINT', 'SIGTERM']) process.on(sig, () => { stopStack(); process.exit(130) })
try {
  await startStack()
} catch (e) {
  stopStack()
  await browser.close()
  throw e
}
const results = {}
let failed = false
try {
  for (const flow of flows) {
    const rec = new StepRecorder(flow.id, shotsDir)
    rmSync(rawVideoDir, { recursive: true, force: true })
    const contexts = []
    let recorded = null
    // Each page gets its own context (so CRM and portal sessions don't mix). Only the
    // flow's first page is recorded, so every flow yields exactly one video.
    const newPage = async (storageState) => {
      const ctx = await newContext(browser, storageState, { viewport: flow.viewport, ...(recorded ? {} : { videoDir: rawVideoDir }) })
      contexts.push(ctx)
      const page = await ctx.newPage()
      recorded ??= page
      return page
    }
    console.log(`\n[capture] ▶ ${flow.title}`)
    try {
      await flow.run({ newPage, rec })
    } catch (e) {
      failed = true
      console.error(`[capture] ✖ ${flow.id} failed: ${e.message.split('\n')[0]}`)
      const page = contexts.at(-1)?.pages()[0]
      if (page) await page.screenshot({ path: resolve(STATE_DIR, `FAILED-${flow.id}.png`) }).catch(() => {})
    }
    const rawVideo = recorded?.video() ? await recorded.video().path() : null
    for (const ctx of contexts) await ctx.close() // flushes the video
    let video = null
    if (rawVideo && existsSync(rawVideo)) {
      renameSync(rawVideo, resolve(videosDir, `${flow.id}.webm`))
      video = `videos/${flow.id}.webm`
    }
    // A flow that skipped itself (e.g. no Maps key) keeps whatever an earlier run captured.
    if (rec.steps.length) results[flow.id] = { title: flow.title, steps: rec.steps, video }
  }
} finally {
  await browser.close()
  stopStack()
}

// Merge with any flows not re-run this time.
const dataPath = resolve(OUT_DIR, 'demo-data.json')
let previous = {}
try { previous = JSON.parse(readFileSync(dataPath, 'utf-8')).flows ?? {} } catch { /* first run */ }
const allFlows = { ...previous, ...results }
const byKey = Object.fromEntries(Object.values(allFlows).flatMap((f) => f.steps).map((s) => [s.key, s]))
const TOUR = byKey['sb-map'] ? TOUR_WITH_SB : TOUR_NO_SB
const tour = TOUR.map((k) => byKey[k]).filter(Boolean)
writeFileSync(dataPath, JSON.stringify({
  generatedAt: new Date().toISOString(),
  viewport: VIEWPORT,
  note: 'Generated by tools/demo-capture (npm run capture). Fictional demo company — no real customer data.',
  tour,
  // Published to the website: leave out flows not on the site yet, and video paths
  // (videos are git-ignored, not deployed).
  flows: Object.fromEntries(Object.entries(allFlows).filter(([k]) => !UNPUBLISHED.has(k)).map(([k, f]) => [k, { ...f, video: undefined }])),
}, null, 2))
console.log(`\n[capture] wrote ${dataPath} (${tour.length}/${TOUR.length} tour steps)`)
if (failed) { console.error('[capture] some flows failed — see .state/FAILED-*.png'); process.exit(1) }
