# Demo capture — website screenshots, videos and click-through data

Rebuilds a **fictional** demo company ("Northwind Fitness Service", Dallas–Fort Worth),
boots the real OptyField API + web app **locally**, drives four flows in a browser, and
writes fresh images, videos and `demo-data.json` into `public/demo/`. Re-run it after
any UI change; the website's `/demo` tour picks up new screenshots and hotspot positions.

```bash
cd tools/demo-capture
npm install                          # once (Playwright 1.55; browsers already on this PC)
npm run capture                      # ~4 min: reset DB → seed → boot → 4 flows → public/demo/
npm run capture -- --only=dispatch   # one flow (ai-estimate, portal-approval, dispatch, schedule-builder, register)
DEMO_GOOGLE_MAPS_KEY=... npm run capture   # include Schedule Builder (needs a Maps key allowing localhost:3210)
npm run stack                        # just run the demo app on :3210 (API :3211) to look around
```

On Windows Git Bash prefix with `MSYS_NO_PATHCONV=1`.

To capture the redesigned UI, point at that branch's worktrees:
`DEMO_API_DIR=... DEMO_WEB_DIR=... npm run capture`.

## Safety
- Every script refuses any database except `localhost:5434/optyfield_demo` (`env.mjs`).
- Email, AI, storage, maps and QuickBooks keys are forced blank; private ports 3210/3211.
- Logins are random per run, kept only in `.state/manifest.json` (git-ignored).
- All names, addresses, phones (555-01xx), emails (`.example`), serials and part numbers are made up.
- Vite rewrites `public/build-info.json` in the web checkout; the stack restores it on exit.

## Files
| File | What |
|---|---|
| `seed-demo.mjs` | The fictional company: 8 customers, ~112 machines, a dispatch day, AI drafts, estimates |
| `flows/*.mjs` | One file per flow; each `rec.step()` = one screenshot + caption + hotspot |
| `run.mjs` | The one command; `TOUR_NO_SB` / `TOUR_WITH_SB` list the steps used on `/demo` |
| `site-shots.mjs` | Screenshots of the marketing site itself, for review docs |

## Known app bugs worked around (remove when fixed)
- **AI draft review crashes on the first Approve** (estimates-25, AI-1/AI-2). `flows/ai-estimate.mjs`
  approves lines and creates the estimate through the API, then re-opens the real screens.
  Once fixed, run with `AI_UI_FIXED=1` and delete the workaround.
- The API auto-adds Exer-Tech's 16 Houston dispatch zones to every company (e2e-14); the seed
  pre-creates them as inactive.
- A fresh company shows non-admins a "Pricing did NOT save" toast (e2e-06); the seed saves pricing.
