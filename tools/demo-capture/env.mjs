// Single source of truth for the demo-capture stack: ports, paths, env.
//
// LOCAL ONLY. Everything here points at the local Docker Postgres
// (localhost:5434/optyfield_demo) and private ports, and every external
// service key (email, AI, storage, maps, QuickBooks) is forced blank, so a
// capture run can never send an email or touch production.
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const here = dirname(fileURLToPath(import.meta.url))

export const TOOL_DIR = here
export const SITE_DIR = resolve(here, '..', '..')
// Which app checkouts to boot. Defaults to the workspace clones; point these at a
// redesign branch's worktree to capture the new UI.
export const API_DIR = process.env.DEMO_API_DIR ?? 'C:/Projects/optyfield-local/exer-tech-api'
export const WEB_DIR = process.env.DEMO_WEB_DIR ?? 'C:/Projects/optyfield-local/exer-tech-web'

export const STATE_DIR = resolve(here, '.state') // git-ignored: manifest, raw videos
export const MANIFEST_PATH = resolve(STATE_DIR, 'manifest.json')
export const OUT_DIR = resolve(SITE_DIR, 'public', 'demo') // what the website serves

export const API_PORT = 3211
export const WEB_PORT = 3210
export const API_URL = `http://localhost:${API_PORT}`
export const WEB_URL = `http://localhost:${WEB_PORT}`

export const DEMO_DB_URL = 'postgresql://optyfield:optyfield@localhost:5434/optyfield_demo'

/** Throws unless the URL is the local demo database. Every script calls this. */
export function assertLocalDemoDb(url) {
  if (!/^postgres(ql)?:\/\/[^@]+@(localhost|127\.0\.0\.1):5434\/optyfield_demo(\?|$)/.test(url ?? '')) {
    throw new Error(`REFUSING: database must be localhost:5434/optyfield_demo (got ${String(url).replace(/\/\/[^@]*@/, '//***@')})`)
  }
}

export const API_ENV = {
  DATABASE_URL: DEMO_DB_URL,
  PORT: String(API_PORT),
  NODE_ENV: 'test',
  TENANT_ENFORCEMENT: 'on',
  CORS_ORIGIN: WEB_URL,
  PORTAL_URL: `${WEB_URL}/portal`,
  WEB_APP_URL: WEB_URL,
  POSTMARK_SERVER_TOKEN: '',
  SMTP_HOST: '',
  ANTHROPIC_API_KEY: '',
  VOYAGE_API_KEY: '',
  CLOUDINARY_CLOUD_NAME: '',
  CLOUDINARY_API_KEY: '',
  CLOUDINARY_API_SECRET: '',
  R2_MIRROR_ENDPOINT: '',
  R2_MIRROR_ACCESS_KEY_ID: '',
  R2_MIRROR_SECRET_ACCESS_KEY: '',
  R2_MIRROR_BUCKET_NAME: '',
  // Maps stay off unless you supply a key yourself (needed for Schedule Builder shots).
  GOOGLE_MAPS_API_KEY: process.env.DEMO_GOOGLE_MAPS_KEY ?? '',
  GOOGLE_MAPS_SERVER_API_KEY: process.env.DEMO_GOOGLE_MAPS_KEY ?? '',
  QUICKBOOKS_CLIENT_ID: '',
  QUICKBOOKS_CLIENT_SECRET: '',
}

export const WEB_ENV = {
  VITE_API_URL: API_URL,
  VITE_GOOGLE_MAPS_API_KEY: process.env.DEMO_GOOGLE_MAPS_KEY ?? '',
}
