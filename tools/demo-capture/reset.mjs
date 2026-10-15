// Drops and recreates the LOCAL demo database schema, then seeds the fictional
// demo company. Hard guard: only ever touches localhost:5434/optyfield_demo.
//   node reset.mjs
import { execSync } from 'node:child_process'
import { fileURLToPath } from 'node:url'
import { API_DIR, DEMO_DB_URL, TOOL_DIR, assertLocalDemoDb } from './env.mjs'

export function resetAndSeed() {
  assertLocalDemoDb(DEMO_DB_URL)
  console.log('[demo:reset] target confirmed: localhost:5434/optyfield_demo')
  // Create the database on first use (no-op if it already exists).
  try {
    execSync('docker exec optyfield-local-db psql -U optyfield -d postgres -c "create database optyfield_demo owner optyfield;"', { stdio: 'pipe' })
  } catch { /* already exists */ }
  const env = { ...process.env, DATABASE_URL: DEMO_DB_URL }
  // --skip-generate: never rewrite the API checkout's generated client.
  execSync('npx prisma db push --force-reset --skip-generate', { cwd: API_DIR, env, stdio: 'inherit' })
  execSync(`node "${TOOL_DIR}/seed-demo.mjs"`, { cwd: TOOL_DIR, env, stdio: 'inherit' })
}

if (process.argv[1] === fileURLToPath(import.meta.url)) resetAndSeed()
