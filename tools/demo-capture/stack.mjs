// Boots a private API (:3211) + Vite web app (:3210) against the demo DB.
//   node stack.mjs        → leaves both running until Ctrl+C (for exploring/debugging)
// run.mjs imports startStack()/stopStack() for the one-command pipeline.
//
// Vite's build-info plugin rewrites public/build-info.json in the web checkout;
// we put the original back on stop so the checkout is left untouched.
import { execSync, spawn } from 'node:child_process'
import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { API_DIR, API_ENV, API_URL, STATE_DIR, WEB_DIR, WEB_ENV, WEB_PORT, WEB_URL, assertLocalDemoDb } from './env.mjs'

const buildInfo = resolve(WEB_DIR, 'public', 'build-info.json')
const WEB_DIST = resolve(STATE_DIR, 'web-dist') // production build of the web app (git-ignored)
let original = null
let procs = []

async function waitFor(url, label, timeoutMs = 120_000) {
  const start = Date.now()
  while (Date.now() - start < timeoutMs) {
    try { const r = await fetch(url); if (r.ok) return } catch { /* not up yet */ }
    await new Promise((r) => setTimeout(r, 1000))
  }
  throw new Error(`${label} did not come up at ${url}`)
}

export async function startStack({ quiet = true } = {}) {
  assertLocalDemoDb(API_ENV.DATABASE_URL)
  original = existsSync(buildInfo) ? readFileSync(buildInfo) : null
  const stdio = quiet ? 'ignore' : 'inherit'
  const webEnv = { ...process.env, ...WEB_ENV }
  // Capture a PRODUCTION build by default, like the live app. The Vite dev server
  // runs React StrictMode's double-mount, which makes @react-google-maps' legacy
  // <Marker> drop every pin present on first load (Schedule Builder showed no
  // backlog pins). DEMO_WEB_DEV=1 uses the dev server instead (faster to start).
  let web
  if (process.env.DEMO_WEB_DEV === '1') {
    web = spawn('npx', ['vite', '--port', String(WEB_PORT), '--strictPort'], { cwd: WEB_DIR, env: webEnv, stdio, shell: true })
  } else {
    console.log('[demo:stack] building the web app (production build, ~1–2 min)…')
    execSync(`npx vite build --outDir "${WEB_DIST}" --emptyOutDir`, { cwd: WEB_DIR, env: webEnv, stdio: quiet ? 'ignore' : 'inherit' })
    web = spawn('npx', ['vite', 'preview', '--outDir', `"${WEB_DIST}"`, '--port', String(WEB_PORT), '--strictPort'], { cwd: WEB_DIR, env: webEnv, stdio, shell: true })
  }
  procs = [
    spawn('npx', ['tsx', 'src/index.ts'], { cwd: API_DIR, env: { ...process.env, ...API_ENV }, stdio, shell: true }),
    web,
  ]
  await waitFor(`${API_URL}/health`, 'API')
  await waitFor(WEB_URL, 'Web')
  console.log(`[demo:stack] API ${API_URL}  web ${WEB_URL}`)
}

export function stopStack() {
  for (const c of procs) {
    // shell:true → the pid is cmd.exe's; /T takes the node child with it.
    if (process.platform === 'win32' && c.pid) spawn('taskkill', ['/PID', String(c.pid), '/T', '/F'], { stdio: 'ignore' })
    else c.kill()
  }
  procs = []
  if (original) writeFileSync(buildInfo, original)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  await startStack({ quiet: false })
  console.log('[demo:stack] running — Ctrl+C to stop')
  const stop = () => { stopStack(); process.exit(0) }
  process.on('SIGINT', stop); process.on('SIGTERM', stop)
}
