// Shared helpers for the capture flows: sign-in, consistent screenshots, and
// hotspot recording for the website's click-through demo.
import { readFileSync, mkdirSync } from 'node:fs'
import { resolve } from 'node:path'
import { API_URL, MANIFEST_PATH, WEB_URL } from './env.mjs'

export const VIEWPORT = { width: +(process.env.VW ?? 1600), height: +(process.env.VH ?? 1000) }
export const manifest = () => JSON.parse(readFileSync(MANIFEST_PATH, 'utf-8'))

async function post(path, body) {
  const res = await fetch(`${API_URL}/api${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const json = await res.json()
  if (!res.ok) throw new Error(`${path} → ${res.status} ${JSON.stringify(json)}`)
  return json.data ?? json
}

/** Calls the local demo API as a CRM user (token taken from a storage state). */
export async function apiAs(state, method, path, body) {
  const token = state.origins[0].localStorage.find((x) => x.name === 'token').value
  const res = await fetch(`${API_URL}/api${path}`, {
    method, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) throw new Error(`${method} ${path} → ${res.status} ${JSON.stringify(json)}`)
  return json.data ?? json
}

/** Storage state for a signed-in CRM user (same shape the app persists on login). */
export async function crmState(email) {
  const { token, user } = await post('/auth/login', { email, password: manifest().password })
  return { cookies: [], origins: [{ origin: WEB_URL, localStorage: [
    { name: 'token', value: token },
    { name: 'exer-tech-auth', value: JSON.stringify({ state: { user, token, isAuthenticated: true }, version: 0 }) },
  ] }] }
}

/** Storage state for a signed-in portal contact. */
export async function portalState(email, contactName) {
  const m = manifest()
  const data = await post('/portal/login', { email, password: m.portalPassword })
  const token = data.multiCustomer ? (await post('/portal/select-customer', { tempToken: data.tempToken, customerId: data.customers[0].id })).token : data.token
  const session = {
    customerId: m.portal.customerId, email, token, loginAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + 24 * 3600_000).toISOString(), contactId: null, contactName,
    contactRole: 'Manager', needsPasswordSetup: false,
  }
  return { cookies: [], origins: [{ origin: WEB_URL, localStorage: [
    { name: 'portalToken', value: token },
    { name: 'exer-tech-portal', value: JSON.stringify({ state: { session, seenMaintenanceSummaryIds: [], availableCustomers: [] }, version: 0 }) },
  ] }] }
}

// Headless video has no mouse pointer, so draw one (and a click ripple) in the page.
const CURSOR_SCRIPT = `(() => {
  if (window.__demoCursor) return; window.__demoCursor = true
  const add = () => {
    const s = document.createElement('style')
    s.textContent = '#demo-cursor{position:fixed;z-index:2147483647;pointer-events:none;width:22px;height:22px;margin:-3px 0 0 -3px;transition:transform .08s}' +
      '#demo-cursor svg{filter:drop-shadow(0 1px 2px rgba(0,0,0,.6))}#demo-cursor.down{transform:scale(.85)}' +
      '.demo-ripple{position:fixed;z-index:2147483646;pointer-events:none;width:34px;height:34px;margin:-17px 0 0 -17px;border-radius:50%;border:3px solid #EF4444;animation:demo-r .5s ease-out forwards}' +
      '@keyframes demo-r{from{opacity:1;transform:scale(.3)}to{opacity:0;transform:scale(1.4)}}html.demo-shot #demo-cursor{display:none}'
    document.head.appendChild(s)
    const c = document.createElement('div'); c.id = 'demo-cursor'
    c.innerHTML = '<svg width="22" height="22" viewBox="0 0 24 24"><path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#0B1426" stroke-width="1.5"/></svg>'
    c.style.left = '-50px'; c.style.top = '-50px'
    document.body.appendChild(c)
    addEventListener('mousemove', (e) => { c.style.left = e.clientX + 'px'; c.style.top = e.clientY + 'px' }, true)
    addEventListener('mousedown', (e) => { c.classList.add('down'); const r = document.createElement('div'); r.className = 'demo-ripple'; r.style.left = e.clientX + 'px'; r.style.top = e.clientY + 'px'; document.body.appendChild(r); setTimeout(() => r.remove(), 600) }, true)
    addEventListener('mouseup', () => c.classList.remove('down'), true)
  }
  if (document.body) add(); else addEventListener('DOMContentLoaded', add)
})()`

/** New context with consistent viewport, optional video recording. */
export async function newContext(browser, storageState, { videoDir, viewport = VIEWPORT } = {}) {
  if (videoDir) mkdirSync(videoDir, { recursive: true })
  const ctx = await browser.newContext({
    storageState, viewport, deviceScaleFactor: 1, colorScheme: 'dark',
    ...(videoDir ? { recordVideo: { dir: videoDir, size: viewport } } : {}),
  })
  await ctx.addInitScript(CURSOR_SCRIPT)
  // The dev server's build stamp never matches the bundle, which pops a "new version"
  // toast. Production doesn't have this, so hide it from the captures.
  await ctx.route('**/build-info.json*', (route) => route.fulfill({ status: 404, body: '' }))
  return ctx
}

/**
 * Records click-through steps. Each step = one screenshot + an optional hotspot
 * (the element the viewer should click next, as % of the image) + a caption.
 * Hotspots are measured from the live page, so they stay correct after a redesign
 * as long as the locators still find the right element.
 */
export class StepRecorder {
  constructor(flowId, outDir) {
    this.flowId = flowId
    this.outDir = outDir
    this.steps = []
    mkdirSync(outDir, { recursive: true })
  }

  async step(page, { key, title, caption, hotspot, settle = 600 }) {
    await page.waitForTimeout(settle)
    const file = `${key}.png`
    // Measure the hotspot first: a hover state changes nothing, but scrolling would.
    let b = null
    if (hotspot) b = await hotspot.boundingBox().catch(() => null)
    await page.evaluate(() => document.documentElement.classList.add('demo-shot')) // hide the fake cursor
    await page.screenshot({ path: resolve(this.outDir, file) })
    await page.evaluate(() => document.documentElement.classList.remove('demo-shot'))
    let box = null
    const vp = page.viewportSize()
    if (hotspot) {
      if (b) box = {
        x: +(100 * b.x / vp.width).toFixed(2), y: +(100 * b.y / vp.height).toFixed(2),
        w: +(100 * b.width / vp.width).toFixed(2), h: +(100 * b.height / vp.height).toFixed(2),
      }
      else console.warn(`[capture] ${file}: hotspot not visible — step will advance on any click`)
    }
    this.steps.push({ key, flow: this.flowId, image: file, width: vp.width, height: vp.height, title, caption, hotspot: box })
    console.log(`[capture] ${this.flowId} · ${key}${hotspot ? (box ? '' : ' (no hotspot)') : ''}`)
    return box
  }
}

/** Slow, visible pointer movement so the recorded video reads well. */
export async function humanClick(page, locator) {
  await locator.scrollIntoViewIfNeeded()
  const b = await locator.boundingBox()
  if (b) {
    await page.mouse.move(b.x + b.width / 2, b.y + b.height / 2, { steps: 18 })
    await page.waitForTimeout(250)
  }
  await locator.click()
}
