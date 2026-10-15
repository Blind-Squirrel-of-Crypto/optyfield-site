/**
 * Demo-company seed: "Northwind Fitness Service", a FICTIONAL commercial-fitness
 * service company in Dallas–Fort Worth, used for website screenshots and videos.
 *
 * LOCAL ONLY. Refuses to run unless DATABASE_URL is localhost:5434/optyfield_demo.
 * reset.mjs force-resets that schema first, so this file only inserts.
 *
 * Every name, address, phone, email, serial number and part number below is made
 * up. No real customer data, ever. Phones use 555-01xx and emails use the reserved
 * example.com / .example domains. Equipment makes and model names are real
 * products, because that is what a fitness service company works on.
 *
 * Structure borrowed from the E2E seed (exer-tech-api/prisma/e2e/seed.ts): plain
 * PrismaClient (bypasses the tenancy guard, so companyId is set explicitly on
 * every row), fixed board-column ids, a manifest of ids + throwaway logins.
 *
 * The AI drafts are pre-written in the shape the real pipeline produces
 * (aiService.ts: line items with a 5-part confidence breakdown, match type,
 * reasoning, notes). Capture runs never call the AI — the API key is blank.
 */
import { createRequire } from 'node:module'
import { randomBytes } from 'node:crypto'
import { mkdirSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { API_DIR, MANIFEST_PATH, STATE_DIR, assertLocalDemoDb } from './env.mjs'

assertLocalDemoDb(process.env.DATABASE_URL)

// Resolve the API's own Prisma client + bcrypt, so the seed always matches the
// schema of whichever API checkout is being captured.
const requireFromApi = createRequire(join(API_DIR, 'package.json'))
const { PrismaClient } = requireFromApi('@prisma/client')
const bcrypt = requireFromApi('bcryptjs')
const prisma = new PrismaClient()

// Fresh throwaway passwords every run. They exist only in the local demo DB and
// the git-ignored manifest.
const PASSWORD = `Demo-${randomBytes(9).toString('base64url')}`
const PORTAL_PASSWORD = `Portal-${randomBytes(9).toString('base64url')}`

const YEAR = new Date().getFullYear()
const pad = (n) => String(n).padStart(5, '0')
const ymd = (d) => d.toLocaleDateString('en-CA') // local day, like the dispatch board
const today = new Date()
const days = (n) => new Date(today.getTime() + n * 86_400_000)
// Skip weekends for scheduled days so the board never looks empty on a Monday.
const workday = (n) => { let d = days(n); while ([0, 6].includes(d.getDay())) d = new Date(d.getTime() + (n < 0 ? -1 : 1) * 86_400_000); return d }
const todayStr = ymd(today)

const COMPANY = {
  name: 'Northwind Fitness Service',
  subdomain: 'northwind-demo',
  address: '4100 Commerce Park Dr, Suite 120, Dallas, TX 75247',
  phone: '214-555-0142',
  email: 'office@northwind-fitness.example',
}

// ── Equipment catalogue (real products, made-up serials) ─────────────────────
const CATALOG = {
  treadmill: [
    { make: 'Precor', model: 'TRM 885', type: 'Treadmill', sn: 'AM' },
    { make: 'Life Fitness', model: 'Integrity 95T', type: 'Treadmill', sn: 'ITR' },
    { make: 'Matrix', model: 'T7xe', type: 'Treadmill', sn: 'T7' },
  ],
  elliptical: [
    { make: 'Precor', model: 'EFX 835', type: 'Elliptical', sn: 'AY' },
    { make: 'Life Fitness', model: 'Integrity 95X', type: 'Elliptical', sn: 'IXR' },
    { make: 'Precor', model: 'AMT 835', type: 'Elliptical', sn: 'AN' },
  ],
  bike: [
    { make: 'Life Fitness', model: 'Integrity Upright Bike', type: 'Bike', sn: 'ICU' },
    { make: 'Matrix', model: 'R50 Recumbent', type: 'Bike', sn: 'R5' },
    { make: 'Keiser', model: 'M3i Indoor Cycle', type: 'SpinBike', sn: 'K3' },
  ],
  other: [
    { make: 'StairMaster', model: '8Gx StepMill', type: 'Stepper', sn: 'SM8' },
    { make: 'Concept2', model: 'RowErg', type: 'Rower', sn: 'C2R' },
    { make: 'Life Fitness', model: 'Signature Chest Press', type: 'PinSelect', sn: 'FZCP' },
    { make: 'Matrix', model: 'Ultra Leg Press', type: 'PinSelect', sn: 'G7LP' },
    { make: 'Hammer Strength', model: 'Plate-Loaded Incline Press', type: 'PlateLoaded', sn: 'HSIP' },
    { make: 'Cybex', model: 'Eagle NX Lat Pulldown', type: 'PinSelect', sn: 'CXLP' },
  ],
}

// ── Customers (all fictional) ────────────────────────────────────────────────
const CUSTOMERS = [
  { key: 'ironworks', name: 'Ironworks Athletic Club', type: 'FitnessCenter', contact: 'Priya Shah', title: 'Fitness Director', zone: 'central',
    locs: [{ key: 'ironworksUptown', name: 'Ironworks — Uptown', street: '2200 Cedar Springs Rd', city: 'Dallas', zip: '75201', lat: 32.799, lng: -96.803, mix: [6, 4, 4, 6] },
           { key: 'ironworksPlano', name: 'Ironworks — Plano', street: '5800 Legacy Cir', city: 'Plano', zip: '75024', lat: 33.077, lng: -96.823, mix: [5, 3, 3, 4] }] },
  { key: 'lakeside', name: 'Lakeside Commons Apartments', type: 'Apartment', contact: 'Marcus Bell', title: 'Property Manager', zone: 'east',
    locs: [{ key: 'lakeside', name: 'Lakeside Commons Fitness Room', street: '910 Shoreline Dr', city: 'Rockwall', zip: '75087', lat: 32.931, lng: -96.459, mix: [3, 2, 1, 1] }] },
  { key: 'meridian', name: 'Meridian Grand Hotel', type: 'Hotel', contact: 'Elena Ruiz', title: 'Director of Engineering', zone: 'central',
    locs: [{ key: 'meridian', name: 'Meridian Grand — Health Club', street: '1500 Main St', city: 'Dallas', zip: '75202', lat: 32.781, lng: -96.799, mix: [4, 2, 2, 2] }] },
  { key: 'crestview', name: 'Crestview Corporate Campus', type: 'CorporateWellness', contact: 'Jordan Ames', title: 'Facilities Manager', zone: 'north',
    locs: [{ key: 'crestview', name: 'Crestview Wellness Center', street: '7400 Tollway Ctr', city: 'Frisco', zip: '75034', lat: 33.150, lng: -96.823, mix: [4, 3, 2, 4] }] },
  { key: 'northpoint', name: 'Northpoint Community Rec Center', type: 'School', contact: 'Dana Cole', title: 'Recreation Supervisor', zone: 'west',
    locs: [{ key: 'northpoint', name: 'Northpoint Rec — Cardio Floor', street: '300 Civic Plaza', city: 'Irving', zip: '75039', lat: 32.869, lng: -96.940, mix: [5, 4, 3, 3] }] },
  { key: 'riverstone', name: 'Riverstone Apartments', type: 'Apartment', contact: 'Kayla Nguyen', title: 'Community Manager', zone: 'west',
    locs: [{ key: 'riverstone', name: 'Riverstone Clubhouse Gym', street: '4455 Riverbend Pkwy', city: 'Fort Worth', zip: '76116', lat: 32.733, lng: -97.410, mix: [2, 2, 1, 1] }] },
  { key: 'pinecrest', name: 'Pinecrest Senior Living', type: 'Medical', contact: 'Robert Hale', title: 'Wellness Coordinator', zone: 'south',
    locs: [{ key: 'pinecrest', name: 'Pinecrest Wellness Studio', street: '820 Magnolia Way', city: 'Arlington', zip: '76010', lat: 32.705, lng: -97.108, mix: [1, 1, 3, 1] }] },
  { key: 'summit', name: 'Summit 24 Fitness', type: 'FitnessCenter', contact: 'Tyler Brooks', title: 'Owner', zone: 'south',
    locs: [{ key: 'summit', name: 'Summit 24 — Grand Prairie', street: '2600 Prairie Center Dr', city: 'Grand Prairie', zip: '75050', lat: 32.746, lng: -97.002, mix: [6, 4, 4, 6] }] },
]

const ZONES = [
  { id: 'south', name: 'South (Arlington/GP)', color: 'rose' },
  { id: 'west', name: 'West (Irving/Fort Worth)', color: 'emerald' },
  { id: 'central', name: 'Central Dallas', color: 'violet' },
  { id: 'north', name: 'North (Frisco/Plano)', color: 'blue' },
  { id: 'east', name: 'East (Rockwall)', color: 'amber' },
]

// ── Parts (made-up part numbers, plausible prices) ───────────────────────────
const PARTS = [
  ['NW-TRM-BELT-885', 'Running belt — Precor TRM 885', 'Precor', ['Treadmill'], 168, 342],
  ['NW-TRM-DECK-885', 'Running deck, reversible — Precor TRM 885', 'Precor', ['Treadmill'], 214, 438],
  ['NW-TRM-LUBE', 'Deck lubricant, silicone (single unit)', null, ['Treadmill'], 6, 18],
  ['NW-95T-MCB', 'Lower motor control board — Integrity 95T', 'Life Fitness', ['Treadmill'], 395, 789],
  ['NW-95T-ESTOP', 'Emergency stop lanyard + clip — Integrity', 'Life Fitness', ['Treadmill'], 14, 39],
  ['NW-T7-ROLLER-F', 'Front roller assembly — Matrix T7xe', 'Matrix', ['Treadmill'], 156, 312],
  ['NW-EFX-RAMPCOV', 'Ramp center cover — Precor EFX 835', 'Precor', ['Elliptical'], 61, 136],
  ['NW-EFX-GRIP-F', 'Front hand grip set — Precor EFX', 'Precor', ['Elliptical'], 41, 91],
  ['NW-EFX-LIFTCOV', 'Lift pedestal cover — Precor EFX 835', 'Precor', ['Elliptical'], 43, 95],
  ['NW-95X-PEDAL', 'Pedal assembly, left — Integrity 95X', 'Life Fitness', ['Elliptical'], 88, 184],
  ['NW-95X-BRG', 'Stride arm bearing kit — Integrity 95X', 'Life Fitness', ['Elliptical'], 52, 119],
  ['NW-ICU-CRANK', 'Crank arm set — Integrity Upright Bike', 'Life Fitness', ['Bike'], 64, 142],
  ['NW-R50-CONSOLE', 'Console overlay + keypad — Matrix R50', 'Matrix', ['Bike'], 118, 249],
  ['NW-M3I-PADS', 'Brake magnet assembly — Keiser M3i', 'Keiser', ['SpinBike'], 72, 158],
  ['NW-8GX-STEP', 'Step tread — StairMaster 8Gx', 'StairMaster', ['Stepper'], 38, 84],
  ['NW-8GX-CHAIN', 'Drive chain — StairMaster 8Gx', 'StairMaster', ['Stepper'], 96, 214],
  ['NW-SEL-CABLE', 'Selectorized cable, 3/16" coated (per ft-assembly)', null, ['PinSelect'], 34, 79],
  ['NW-SEL-PULLEY', 'Pulley 4.5" sealed bearing', null, ['PinSelect'], 12, 32],
  ['NW-UPH-SEAT', 'Seat pad upholstery, black', null, ['PinSelect', 'PlateLoaded'], 58, 128],
]

let serialSeq = 1000
const serial = (prefix) => `${prefix}${YEAR - 3}${String(serialSeq++).padStart(5, '0')}`

async function main() {
  const hash = await bcrypt.hash(PASSWORD, 12)
  const portalHash = await bcrypt.hash(PORTAL_PASSWORD, 12)

  await prisma.company.create({ data: { name: 'OptyField System', subdomain: 'system', isSystem: true } })
  const co = await prisma.company.create({ data: { name: COMPANY.name, subdomain: COMPANY.subdomain } })
  const cid = co.id
  await prisma.companySettings.create({
    data: {
      companyId: cid, companyName: COMPANY.name, address: COMPANY.address, phone: COMPANY.phone, email: COMPANY.email, diagnosticFeeAmount: 95,
      // Saved pricing, so the web app doesn't try to seed its defaults on first load
      // (non-admins get a red "Pricing did NOT save" toast otherwise — e2e-06).
      maintenancePricing: [['Treadmill', 45], ['Elliptical', 40], ['Bike', 35], ['Stepper', 50], ['Rower', 40], ['SpinBike', 35], ['PinSelect', 25], ['PlateLoaded', 20], ['FreeWeight', 20], ['Bench', 20], ['Other', 30]]
        .map(([equipmentType, price], i) => ({ id: `mp-${i + 1}`, equipmentType, defaultPricePerVisit: price, description: '', createdAt: today.toISOString(), updatedAt: today.toISOString() })),
      tripCharges: [
        { id: 'tc-1', name: 'Standard Trip Charge', amount: 95, isDefault: true, description: 'Standard service call trip charge' },
        { id: 'tc-2', name: 'No Trip Charge', amount: 0, isDefault: false, description: 'No trip charge' },
        { id: 'tc-3', name: 'Extended Trip Charge', amount: 125, isDefault: false, description: 'Outside the metro area' },
        { id: 'tc-4', name: 'Service Charge', amount: 180, isDefault: false, description: 'Service charge for callouts' },
      ],
    },
  })

  // ── People (fictional) ──────────────────────────────────────────────────
  const mkUser = (email, name, role, extra = {}) =>
    prisma.user.create({ data: { companyId: cid, email, name, role, password: hash, ...extra } })
  const admin = await mkUser('taylor.morgan@northwind-fitness.example', 'Taylor Morgan', 'Administrator', { canEstimate: true })
  const dispatcher = await mkUser('dana.whitfield@northwind-fitness.example', 'Dana Whitfield', 'Dispatcher')
  const estimator = await mkUser('chris.lowery@northwind-fitness.example', 'Chris Lowery', 'Estimator', { canEstimate: true })
  await mkUser('billing@northwind-fitness.example', 'Morgan Ellis', 'Billing')
  const techSpecs = [
    ['marcus.reyes', 'Marcus Reyes'], ['jordan.pham', 'Jordan Pham'], ['alicia.brooks', 'Alicia Brooks'],
    ['dev.patel', 'Dev Patel'], ['sam.okafor', 'Sam Okafor'],
  ]
  const techs = []
  for (const [i, [handle, name]] of techSpecs.entries()) {
    techs.push(await mkUser(`${handle}@northwind-fitness.example`, name, 'Technician', { dispatchOrder: i + 1, phone: `214-555-01${20 + i}` }))
  }
  const [marcus, jordan, alicia, dev, sam] = techs

  // ── Boards (same fixed column ids as the E2E seed / production defaults) ──
  await prisma.estimatingColumn.createMany({ data: [
    { id: 're-quote', name: 'Re-Quote', color: 'rose', sortOrder: 0 },
    { id: 'unassigned', name: 'Unassigned', color: 'slate', sortOrder: 1 },
    { id: 'working', name: 'Working', color: 'blue', sortOrder: 2 },
    { id: 'ask-tech', name: 'Ask Tech', color: 'amber', sortOrder: 3 },
    { id: 'ready', name: 'Ready to Send', color: 'green', sortOrder: 4 },
  ].map((x) => ({ ...x, slug: x.id, companyId: cid })) })
  await prisma.billingColumn.createMany({ data: [
    { id: 'unbilled', name: 'Unbilled', color: 'slate', sortOrder: 0 },
    { id: 'in-progress', name: 'In Progress', color: 'blue', sortOrder: 1 },
    { id: 'billed', name: 'Billed', color: 'amber', sortOrder: 2 },
    { id: 'paid', name: 'Paid', color: 'green', sortOrder: 3 },
  ].map((x) => ({ ...x, slug: x.id, companyId: cid })) })
  await prisma.partsOrderColumn.createMany({ data: [
    { id: 'needs-parts', name: 'Needs Parts', color: 'slate', sortOrder: 0 },
    { id: 'ordered', name: 'Ordered', color: 'blue', sortOrder: 1 },
    { id: 'reorder-needed', name: 'Reorder Needed', color: 'rose', sortOrder: 2 },
    { id: 'shipped', name: 'Shipped', color: 'amber', sortOrder: 3 },
    { id: 'received', name: 'Received', color: 'green', sortOrder: 4 },
    { id: 'ready-to-schedule', name: 'Ready to Schedule', color: 'emerald', sortOrder: 6 },
  ].map((x) => ({ ...x, slug: x.id, companyId: cid })) })
  const techBoard = await prisma.estimatingBoard.create({
    data: {
      companyId: cid, name: 'Chris', estimatorId: estimator.id, sortOrder: 0,
      columns: { create: [
        { name: 'In Progress', color: 'blue', sortOrder: 0 },
        { name: 'Follow Up', color: 'amber', sortOrder: 1 },
        { name: 'Sent', color: 'emerald', sortOrder: 2, isSentTarget: true },
      ] },
    },
    include: { columns: { orderBy: { sortOrder: 'asc' } } },
  })
  const [tbInProgress, tbFollowUp, tbSent] = techBoard.columns
  await prisma.areaZone.createMany({ data: ZONES.map((z, i) => ({ ...z, slug: z.id, companyId: cid, sortOrder: i })) })
  // GET /api/area-zones auto-inserts Exer-Tech's 16 Houston zones for any company
  // missing them (multi-tenant gap, see reviews/e2e.md e2e-14). Pre-create those
  // ids as INACTIVE so the demo board shows only Northwind's Dallas zones.
  const HOUSTON_DEFAULT_ZONE_IDS = ['katy', 'hwy6', 'galleria', 'midtown', 'cypress', 'tomball', 'woodlands', 'conroe', 'kingwood', 'greenspoint', 'downtown', 'pearland', 'beaumont', '45south', 'sanantonio', 'austin']
  await prisma.areaZone.createMany({ data: HOUSTON_DEFAULT_ZONE_IDS.map((id, i) => ({ id, slug: id, name: id, companyId: cid, sortOrder: 50 + i, active: false })) })

  // ── Customers, locations, equipment register ─────────────────────────────
  const customers = {}, locations = {}, equipment = {}
  let custN = 0
  for (const c of CUSTOMERS) {
    custN++
    const first = c.locs[0]
    const handle = c.contact.toLowerCase().replace(/[^a-z]+/g, '.')
    const cust = await prisma.customer.create({
      data: {
        companyId: cid, customerNumber: 20000 + custN, name: c.name, accountType: c.type, isMultiLocation: c.locs.length > 1,
        billingStreet1: first.street, billingCity: first.city, billingState: 'TX', billingZip: first.zip,
        primaryContactName: c.contact, primaryContactPosition: c.title,
        primaryContactEmail: `${handle}@${c.key}.example`, primaryContactPhone: `214-555-01${50 + custN}`,
        areaZone: c.zone, portalActive: true, assetMgmtEnabled: c.key === 'ironworks', priorityCustomer: c.key === 'ironworks',
      },
    })
    customers[c.key] = cust
    for (const l of c.locs) {
      const loc = await prisma.location.create({
        data: {
          companyId: cid, customerId: cust.id, name: l.name, street1: l.street, city: l.city, state: 'TX', zip: l.zip,
          fullAddress: `${l.street}, ${l.city}, TX ${l.zip}`, lat: l.lat, lng: l.lng, areaZone: c.zone,
          contactName: c.contact, contactPhone: `214-555-01${50 + custN}`,
          accessInstructions: c.type === 'Apartment' ? 'Fob at leasing office; gym opens 5am.' : 'Check in at front desk.',
        },
      })
      locations[l.key] = loc
      equipment[l.key] = []
      // mix = [treadmills, ellipticals, bikes, other]
      const groups = [['treadmill', 'TM'], ['elliptical', 'EL'], ['bike', 'BK'], ['other', 'ST']]
      for (const [gi, [group, tag]] of groups.entries()) {
        for (let k = 0; k < l.mix[gi]; k++) {
          const spec = CATALOG[group][k % CATALOG[group].length]
          const installed = days(-(400 + ((serialSeq * 37) % 1400)))
          const eq = await prisma.equipment.create({
            data: {
              companyId: cid, locationId: loc.id, type: spec.type, make: spec.make, model: spec.model,
              serialNumber: serial(spec.sn), position: `${tag}-${k + 1}`, status: 'Good', photos: [],
              installDate: installed, warrantyExpires: new Date(installed.getTime() + 3 * 365 * 86_400_000),
            },
          })
          equipment[l.key].push(eq)
        }
      }
    }
  }
  // A few realistic statuses across the register.
  const setStatus = (eq, status) => prisma.equipment.update({ where: { id: eq.id }, data: { status } })
  const iw = equipment.ironworksUptown
  await setStatus(iw[0], 'RepairsNeeded'); await setStatus(iw[1], 'OutOfService'); await setStatus(iw[6], 'RepairsNeeded')
  await setStatus(iw[7], 'RepairsNeeded'); await setStatus(iw[2], 'RepairsNeeded'); await setStatus(iw[11], 'RepairsNeeded'); await setStatus(iw[15], 'RepairsComplete')
  // TM-1's warranty has lapsed (the AI showcase repairs it at full price).
  await prisma.equipment.update({ where: { id: iw[0].id }, data: { warrantyExpires: days(-45) } })
  await setStatus(equipment.summit[0], 'RepairsNeeded'); await setStatus(equipment.summit[7], 'OutOfService')
  await setStatus(equipment.northpoint[3], 'RepairsNeeded'); await setStatus(equipment.meridian[1], 'RepairsComplete')

  // ── Portal contacts (fictional) ──────────────────────────────────────────
  const portalEmail = 'priya.shah@ironworks.example'
  await prisma.portalContact.create({ data: { companyId: cid, customerId: customers.ironworks.id, email: portalEmail, name: 'Priya Shah', role: 'Manager', password: portalHash, passwordSetAt: today, isPrimary: true } })
  for (const key of ['lakeside', 'meridian', 'crestview']) {
    const c = CUSTOMERS.find((x) => x.key === key)
    await prisma.portalContact.create({ data: { companyId: cid, customerId: customers[key].id, email: `${c.contact.toLowerCase().replace(/[^a-z]+/g, '.')}@${key}.example`, name: c.contact, password: portalHash, passwordSetAt: today, isPrimary: true } })
  }

  // ── Vendors and parts ────────────────────────────────────────────────────
  const vendorA = await prisma.vendor.create({ data: { companyId: cid, name: 'Lone Star Fitness Parts (demo)', vendorNumber: 7001, contactEmail: 'orders@lonestar-parts.example' } })
  const vendorB = await prisma.vendor.create({ data: { companyId: cid, name: 'Metroplex Cardio Supply (demo)', vendorNumber: 7002, contactEmail: 'sales@metroplex-cardio.example' } })
  const parts = {}
  for (const [i, [partNumber, description, manufacturer, compatibleTypes, unitCost, listPrice]] of PARTS.entries()) {
    parts[partNumber] = await prisma.part.create({
      data: {
        companyId: cid, partNumber, description, manufacturer, compatibleTypes, unitCost, listPrice,
        vendorId: i % 2 ? vendorB.id : vendorA.id, quantityOnHand: (i * 3) % 7, reorderLevel: 2, reorderQuantity: 4,
        binLocation: `A-${1 + (i % 6)}-${1 + (i % 4)}`, priceVerified: true, priceVerifiedDate: days(-20),
      },
    })
  }

  // ── Agreements ───────────────────────────────────────────────────────────
  const agreement = await prisma.serviceAgreement.create({
    data: {
      companyId: cid, agreementNumber: `SA-${YEAR}-${pad(1)}`, customerId: customers.ironworks.id, type: 'MaintenanceOnly',
      startDate: days(-200), endDate: days(165), frequency: 'Monthly', status: 'Active', perVisitPrice: 640, activatedAt: days(-200),
      locations: { create: [{ locationId: locations.ironworksUptown.id }, { locationId: locations.ironworksPlano.id }] },
    },
  })
  await prisma.serviceAgreement.create({
    data: {
      companyId: cid, agreementNumber: `SA-${YEAR}-${pad(2)}`, customerId: customers.summit.id, type: 'MaintenanceOnly',
      startDate: days(-90), endDate: days(275), frequency: 'Quarterly', status: 'Active', perVisitPrice: 520, activatedAt: days(-90),
      locations: { create: [{ locationId: locations.summit.id }] },
    },
  })

  // ── Work orders: a full dispatch day + backlog ───────────────────────────
  let woN = 40
  const mkWO = (d) => {
    const { equipmentIds = [], loc, cust, ...rest } = d
    woN++
    return prisma.workOrder.create({
      data: {
        companyId: cid, workOrderNumber: `WO-${YEAR}-${pad(woN)}`, customerId: customers[cust].id, locationId: locations[loc].id,
        type: 'ServiceCall', assignedTechIds: rest.assignedTechId ? [rest.assignedTechId] : [], completionPhotoIds: [],
        createdDate: ymd(days(-2)), areaZone: CUSTOMERS.find((c) => c.key === cust).zone, estimatedDuration: 90, createdById: dispatcher.id,
        ...rest,
        equipment: equipmentIds.length ? { create: equipmentIds.map((equipmentId) => ({ equipmentId })) } : undefined,
      },
    })
  }
  const T = todayStr
  const job = (tech, time, loc, cust, extra = {}) => mkWO({ assignedTechId: tech.id, scheduledDate: T, scheduledTime: time, loc, cust, status: 'Scheduled', confirmedScheduled: true, ...extra })
  // Marcus — central
  await job(marcus, '07:30', 'meridian', 'meridian', { status: 'Complete', type: 'Maintenance', notes: 'Monthly PM — health club', completedAt: today, billingColumnId: 'unbilled' })
  const woIronworksDiag = await job(marcus, '10:00', 'ironworksUptown', 'ironworks', { status: 'OnSite', notes: 'TM-1 slipping belt, EL-1 grips + covers, BK-2 console dead (member reports)', priority: 'High', equipmentIds: [iw[0].id, iw[6].id, iw[11].id] })
  await job(marcus, '13:30', 'ironworksUptown', 'ironworks', { notes: 'Return visit — install chest press cable', equipmentIds: [iw[16].id] })
  // Jordan — north
  await job(jordan, '08:00', 'crestview', 'crestview', { status: 'Complete', type: 'Maintenance', notes: 'Quarterly PM — wellness center', completedAt: today, billingColumnId: 'unbilled' })
  await job(jordan, '11:00', 'ironworksPlano', 'ironworks', { status: 'EnRoute', notes: 'Treadmill E-stop lanyard missing' })
  await job(jordan, '14:30', 'crestview', 'crestview', { notes: 'Rower monitor not counting strokes' })
  // Alicia — west
  await job(alicia, '08:30', 'northpoint', 'northpoint', { status: 'OnSite', type: 'Maintenance', notes: 'Monthly PM — cardio floor', estimatedDuration: 180 })
  await job(alicia, '13:00', 'riverstone', 'riverstone', { notes: 'Elliptical squeak at stride arm' })
  await job(alicia, '15:00', 'riverstone', 'riverstone', { type: 'Estimate', notes: 'Quote replacement for 2 treadmills' })
  // Dev — south
  await job(dev, '08:00', 'summit', 'summit', { status: 'Complete', notes: 'Spin bike brake pads — 4 bikes', completedAt: today, billingColumnId: 'unbilled' })
  await job(dev, '10:30', 'summit', 'summit', { status: 'OnSite', notes: 'Treadmill TM-1 error E-41', priority: 'High' })
  await job(dev, '14:00', 'pinecrest', 'pinecrest', { notes: 'Recumbent bike seat adjuster stuck' })
  // Sam — east + install
  await job(sam, '09:00', 'lakeside', 'lakeside', { status: 'EnRoute', type: 'Installation', notes: 'Install 2 new upright bikes, haul away old', estimatedDuration: 150 })
  await job(sam, '13:30', 'meridian', 'meridian', { notes: 'StepMill chain noise' })
  // Unscheduled backlog
  for (const [loc, cust, notes, priority, type] of [
    ['summit', 'summit', 'Leg press cable fraying — member flagged', 'Emergency'],
    ['ironworksPlano', 'ironworks', 'EFX ramp cover cracked', 'Normal'],
    ['northpoint', 'northpoint', 'Bike console intermittent', 'Normal'],
    ['lakeside', 'lakeside', 'Treadmill belt needs adjustment', 'Normal'],
    ['crestview', 'crestview', 'Annual electrical safety check', 'Normal'],
    // A realistic backlog: maintenance visits and repairs waiting to be planned
    // (fills the Area Zones columns and the Schedule Builder map).
    ['meridian', 'meridian', 'Quarterly PM — health club', 'Normal', 'Maintenance'],
    ['riverstone', 'riverstone', 'Monthly PM — clubhouse gym', 'Normal', 'Maintenance'],
    ['pinecrest', 'pinecrest', 'Quarterly PM — wellness studio', 'Normal', 'Maintenance'],
    ['ironworksUptown', 'ironworks', 'Install approved repairs — 4 machines', 'High', 'ServiceCall'],
    ['summit', 'summit', 'Treadmill TM-3 belt tracking', 'Normal', 'ServiceCall'],
    ['northpoint', 'northpoint', 'Quarterly PM — cardio floor', 'Normal', 'Maintenance'],
    ['lakeside', 'lakeside', 'Bike seat post stuck', 'Normal', 'ServiceCall'],
    ['crestview', 'crestview', 'Rower handle strap replacement', 'Normal', 'ServiceCall'],
  ]) await mkWO({ loc, cust, notes, priority, type: type ?? 'ServiceCall', status: 'Pending', dispatchZone: CUSTOMERS.find((c) => c.key === cust).zone })
  // Tomorrow
  await mkWO({ loc: 'summit', cust: 'summit', notes: 'Quarterly PM', type: 'Maintenance', status: 'Scheduled', assignedTechId: dev.id, scheduledDate: ymd(workday(1)), scheduledTime: '08:00', serviceAgreementId: null })
  await mkWO({ loc: 'ironworksUptown', cust: 'ironworks', notes: 'Monthly PM — Uptown', type: 'Maintenance', status: 'Scheduled', assignedTechId: marcus.id, scheduledDate: ymd(workday(1)), scheduledTime: '07:00', serviceAgreementId: agreement.id })
  // History
  const woHist = []
  for (let i = 0; i < 6; i++) {
    const cust = ['ironworks', 'summit', 'meridian', 'crestview', 'northpoint', 'lakeside'][i]
    const loc = { ironworks: 'ironworksUptown', summit: 'summit', meridian: 'meridian', crestview: 'crestview', northpoint: 'northpoint', lakeside: 'lakeside' }[cust]
    woHist.push(await mkWO({ loc, cust, notes: 'Service call', status: 'Closed', billingStatus: 'Invoiced', invoicedAt: days(-5 - i * 3), scheduledDate: ymd(workday(-6 - i * 3)), scheduledTime: '09:00', assignedTechId: techs[i % 5].id, closedAt: days(-5 - i * 3) }))
  }

  // ── AI pipeline: tech notes → diagnostics → AI draft ─────────────────────
  // Showcase: Marcus is on site at Ironworks Uptown and diagnoses three units.
  const tm1 = iw[0], el1 = iw[6], bk3 = iw[11] // Matrix R50 recumbent, position BK-2
  const diag = (eq, d) => prisma.equipmentDiagnostic.create({
    data: { workOrderId: woIronworksDiag.id, equipmentId: eq.id, techId: marcus.id, suggestedParts: [], statusChange: 'RepairsNeeded', ...d },
  })
  const dTm = await diag(tm1, {
    issueCategory: 'BELTS_DECK', severity: 'HIGH', laborEstimate: 'EXTENDED', laborEstimateHours: 2.5,
    description: 'Belt slipping under load at 6+ mph. Deck worn through at landing zone, belt edge frayed on left side.',
    techNotes: 'TM-1 belt slips when member runs, deck worn thru at landing zone, belt frayed L side. rec belt + deck flip/replace. drive motor ok, amps 9.2 @ 6mph. lube after.',
    suggestedParts: ['belt', 'deck'],
  })
  const dEl = await diag(el1, {
    issueCategory: 'COSMETIC', severity: 'MODERATE', laborEstimate: 'STANDARD', laborEstimateHours: 1.5,
    description: 'Crossramp cover damaged, front hand grips worn, elevation motor lower cover broken.',
    techNotes: 'EL-1 crossramp cover cracked, user grips worn to foam both sides, lift pedestal cover broken off. no ramp errors.',
    suggestedParts: ['ramp cover', 'grips', 'pedestal cover'],
  })
  const dBk = await diag(bk3, {
    issueCategory: 'ELECTRONICS_CONSOLE', severity: 'HIGH', laborEstimate: 'STANDARD', laborEstimateHours: 1,
    description: 'Console keypad unresponsive; overlay peeling. Unit powers on, resistance works from preset.',
    techNotes: 'BK-2 console keys dead (start/level up), overlay peeling at corner — sweat got under. gen + resistance ok. rec overlay/keypad.',
    suggestedParts: ['console overlay'],
  })
  // What the tech app writes per machine (shown on the work order and beside the estimate).
  for (const [eq, d] of [[tm1, dTm], [el1, dEl], [bk3, dBk]]) {
    await prisma.equipmentServiceNote.create({
      data: { workOrderId: woIronworksDiag.id, equipmentId: eq.id, techId: marcus.id, repairsNeeded: d.techNotes, laborEstimate: d.laborEstimateHours, statusChange: 'RepairsNeeded' },
    })
  }
  // Earlier visits to the same treadmill, so its service history tells a story:
  // a PM flagged belt/deck wear months before it failed.
  const woPmOld = await mkWO({ loc: 'ironworksUptown', cust: 'ironworks', type: 'Maintenance', notes: 'Monthly PM — Uptown', status: 'Closed', billingStatus: 'Invoiced', scheduledDate: ymd(workday(-64)), scheduledTime: '07:00', assignedTechId: alicia.id, serviceAgreementId: agreement.id, closedAt: days(-63), equipmentIds: [tm1.id] })
  const woPmRecent = await mkWO({ loc: 'ironworksUptown', cust: 'ironworks', type: 'Maintenance', notes: 'Monthly PM — Uptown', status: 'Closed', billingStatus: 'Invoiced', scheduledDate: ymd(workday(-30)), scheduledTime: '07:00', assignedTechId: marcus.id, serviceAgreementId: agreement.id, closedAt: days(-29), equipmentIds: [tm1.id] })
  await prisma.equipmentServiceNote.create({ data: { workOrderId: woPmOld.id, equipmentId: tm1.id, techId: alicia.id, notes: 'PM complete. Belt and deck about 60% worn. Recommend belt + deck within 2–3 months.', createdAt: days(-64) } })
  await prisma.equipmentServiceNote.create({ data: { workOrderId: woPmRecent.id, equipmentId: tm1.id, techId: marcus.id, repairsMade: 'Adjusted belt tracking and tension, lubed deck. Edge fray starting on left side.', createdAt: days(-30) } })
  const LABOR_RATE = 125
  const cb = (a, b, c, d, e) => ({ descriptionClarity: a, partMatchQuality: b, historicalAccuracy: c, priceFreshness: d, techSuggestionMatch: e })
  const sum = (o) => Object.values(o).reduce((s, v) => s + v, 0)
  const line = (eq, d, part, qty, hours, breakdown, matchType, aiReasoning) => ({
    equipmentId: eq.id, diagnosticId: d.id, partId: part?.id ?? null, partNumber: part?.partNumber ?? 'LABOR',
    description: part?.description ?? 'Labor', quantity: qty, unitPrice: part?.listPrice ?? 0, laborHours: hours, laborRate: LABOR_RATE,
    extendedPrice: Math.round(((part?.listPrice ?? 0) * qty + hours * LABOR_RATE) * 100) / 100,
    confidenceBreakdown: breakdown, confidenceScore: sum(breakdown), matchType, aiReasoning,
  })
  const P = parts
  const showcaseLines = [
    line(tm1, dTm, P['NW-TRM-BELT-885'], 1, 1.5, cb(28, 25, 18, 15, 9), 'EXACT', 'Tech wrote "belt slips" + "frayed" on a Precor TRM 885. Exact catalogue match; this belt was used on 11 prior TRM 885 repairs.'),
    line(tm1, dTm, P['NW-TRM-DECK-885'], 1, 1, cb(28, 25, 16, 15, 9), 'EXACT', '"Deck worn thru at landing zone" — deck is reversible but worn through, so replacement, not flip. Usually replaced with the belt.'),
    line(tm1, dTm, P['NW-TRM-LUBE'], 1, 0, cb(25, 20, 18, 15, 6), 'ALIAS', 'Tech noted "lube after". Matched shorthand "lube" to deck lubricant.'),
    line(el1, dEl, P['NW-EFX-RAMPCOV'], 1, 0.5, cb(27, 20, 15, 15, 9), 'ALIAS', '"Crossramp cover" is technician shorthand for the ramp center cover on the EFX 835.'),
    line(el1, dEl, P['NW-EFX-GRIP-F'], 2, 0.5, cb(27, 25, 17, 15, 8), 'EXACT', '"User grips worn ... both sides" → 2 front grip sets.'),
    line(el1, dEl, P['NW-EFX-LIFTCOV'], 1, 0.5, cb(24, 15, 8, 15, 6), 'CATEGORY', '"Lift pedestal cover broken off" — matched by category; confirm whether left or right side cover.'),
    line(bk3, dBk, P['NW-R50-CONSOLE'], 1, 1, cb(26, 25, 12, 15, 8), 'EXACT', 'Dead keys + peeling overlay on a Matrix R50: overlay/keypad assembly. Generator and resistance confirmed working, so no board replacement.'),
  ]
  const totalConfidence = Math.round(showcaseLines.reduce((s, l) => s + l.confidenceScore, 0) / showcaseLines.length)
  const showcaseDraft = await prisma.aIDraftEstimate.create({
    data: {
      companyId: cid, workOrderId: woIronworksDiag.id, customerId: customers.ironworks.id, locationId: locations.ironworksUptown.id,
      status: 'READY', totalConfidence, processingTime: 41_800, processedAt: days(0), diagnosticIds: [dTm.id, dEl.id, dBk.id],
      lineItems: { create: showcaseLines },
      aiNotes: { create: [
        { type: 'PATTERN_DETECTED', severity: 'INFO', message: 'Belt and deck were replaced together on 9 of the last 11 TRM 885 belt jobs.', relatedEquipmentId: tm1.id },
        { type: 'LOW_CONFIDENCE', severity: 'WARNING', message: 'Lift pedestal cover side (L/R) not stated in the notes.', relatedEquipmentId: el1.id, suggestion: 'Ask Marcus which side, or check the photo.' },
        { type: 'WARRANTY_CHECK', severity: 'INFO', message: 'BK-2 is outside its 3-year parts warranty.', relatedEquipmentId: bk3.id },
      ] },
    },
  })

  // Two more drafts so the queue looks like a normal week.
  const mkSimpleDraft = async (wo, loc, custKey, eq, status, d, lines, conf, notes = []) => {
    const dg = await prisma.equipmentDiagnostic.create({ data: { workOrderId: wo.id, equipmentId: eq.id, techId: d.tech.id, suggestedParts: [], ...d.fields } })
    return prisma.aIDraftEstimate.create({
      data: {
        companyId: cid, workOrderId: wo.id, customerId: customers[custKey].id, locationId: locations[loc].id, status, totalConfidence: conf,
        processingTime: 30_000 + conf * 100, processedAt: days(-1), diagnosticIds: [dg.id],
        lineItems: { create: lines.map((l) => line(eq, dg, ...l)) }, aiNotes: { create: notes },
      },
    })
  }
  const woSummitDiag = woHist[1]
  await mkSimpleDraft(woSummitDiag, 'summit', 'summit', equipment.summit[12], 'READY',
    { tech: dev, fields: { issueCategory: 'MOTOR_DRIVE', severity: 'MODERATE', laborEstimate: 'STANDARD', laborEstimateHours: 1, description: 'Brake magnets worn on 1 bike', techNotes: 'K3 #1 resistance weak at top levels, magnet assy worn. rec replace.' } },
    [[P['NW-M3I-PADS'], 1, 1, cb(24, 25, 17, 15, 8), 'EXACT', 'Keiser M3i weak resistance at high levels → brake magnet assembly.']], 89)
  await mkSimpleDraft(woHist[4], 'northpoint', 'northpoint', equipment.northpoint[12], 'IN_REVIEW',
    { tech: alicia, fields: { issueCategory: 'STRUCTURAL', severity: 'HIGH', laborEstimate: 'STANDARD', laborEstimateHours: 1.5, description: 'StepMill step tread cracked, chain noise', techNotes: '8gx step cracked 3rd from top, chain clunk @ lvl 10+. chk chain tension, prob replace.' } },
    [[P['NW-8GX-STEP'], 1, 0.5, cb(25, 25, 14, 15, 9), 'EXACT', 'Cracked step tread on StairMaster 8Gx.'],
     [P['NW-8GX-CHAIN'], 1, 1, cb(20, 15, 8, 15, 5), 'AI_INFERENCE', '"Chain clunk" may be tension only — replacement suggested at lower confidence.']], 76,
    [{ type: 'LOW_CONFIDENCE', severity: 'WARNING', message: 'Chain replacement may not be needed if re-tensioning fixes the noise.' }])

  // ── Estimates: the portal-approval showcase + a populated board ──────────
  let estN = 210
  const mkEstimate = async (o) => {
    estN++
    const units = o.units.map((u, i) => {
      const lines = u.lines.map(([part, qty, hours], j) => {
        const unitPrice = part ? part.listPrice : 0
        const labor = hours * LABOR_RATE
        return { partId: part?.id ?? null, partNumber: part?.partNumber ?? null, description: part?.description ?? 'Labor', quantity: qty, cost: part ? part.unitCost : 0, unitPrice, labor, extendedPrice: Math.round((unitPrice * qty + labor) * 100) / 100, sortOrder: j }
      })
      return { ...u, lines, subtotal: lines.reduce((s, l) => s + l.extendedPrice, 0), sortOrder: i }
    })
    const total = Math.round(units.reduce((s, u) => s + u.subtotal, 0) * 100) / 100
    return prisma.estimate.create({
      data: {
        companyId: cid, estimateNumber: `EST-${YEAR}-${pad(estN)}`, customerId: customers[o.cust].id, locationId: locations[o.loc].id,
        estimatorId: estimator.id, createdById: estimator.id, createdByName: estimator.name, status: o.status, total, title: o.title,
        estimatingColumnId: o.column === undefined ? null : o.column, estimatingBoardId: o.boardCol ? techBoard.id : null, techBoardColumnId: o.boardCol ?? null,
        estimateDate: o.sentAt ?? days(-1), sentAt: o.sentAt ?? null, validDays: 30, validUntil: days(29),
        lastSentById: o.sentAt ? estimator.id : null, lastSentByName: o.sentAt ? estimator.name : null,
        approvedAt: o.approvedAt ?? null, firstViewedAt: o.viewedAt ?? null, lastViewedAt: o.viewedAt ?? null,
        customerNotes: o.customerNotes ?? null,
        units: { create: units.map((u) => ({
          equipmentId: u.eq.id, approvalStatus: u.approval ?? 'Pending', approvedAt: u.approval === 'Approved' ? o.approvedAt : null,
          notes: u.notes, sortOrder: u.sortOrder, subtotal: Math.round(u.subtotal * 100) / 100, photos: [],
          lineItems: { create: u.lines },
        })) },
      },
      include: { units: true },
    })
  }
  // Showcase: sent to Ironworks, five machines, waiting on the customer.
  const portalEstimate = await mkEstimate({
    cust: 'ironworks', loc: 'ironworksUptown', status: 'Sent', column: null, boardCol: tbSent.id, sentAt: days(-1), viewedAt: null,
    title: 'Cardio floor repairs — Uptown',
    customerNotes: 'Approve or decline each machine separately. Approved units are scheduled as soon as parts arrive.',
    units: [
      { eq: iw[1], notes: 'Treadmill shuts off mid-run (lower board fault, error E-41). Out of service until repaired.', lines: [[P['NW-95T-MCB'], 1, 1.5]] },
      { eq: iw[2], notes: 'Front roller bearing noise; roller replacement recommended.', lines: [[P['NW-T7-ROLLER-F'], 1, 1.5]] },
      { eq: iw[7], notes: 'Left pedal cracked; bearing kit due.', lines: [[P['NW-95X-PEDAL'], 1, 0.5], [P['NW-95X-BRG'], 1, 1]] },
      { eq: iw[14], notes: 'StepMill: one step tread cracked.', lines: [[P['NW-8GX-STEP'], 1, 0.75]] },
      { eq: iw[18], notes: 'Seat pad torn — cosmetic, safe to use.', lines: [[P['NW-UPH-SEAT'], 1, 0.5]] },
    ],
  })
  // Board filler across states.
  const fill = [
    { cust: 'summit', loc: 'summit', status: 'Draft', column: 'working', title: 'Leg press cable', units: [{ eq: equipment.summit[17], lines: [[P['NW-SEL-CABLE'], 2, 1], [P['NW-SEL-PULLEY'], 2, 0]] }] },
    { cust: 'meridian', loc: 'meridian', status: 'Draft', column: 'unassigned', title: 'Elliptical grips', units: [{ eq: equipment.meridian[4], lines: [[P['NW-EFX-GRIP-F'], 2, 0.5]] }] },
    { cust: 'crestview', loc: 'crestview', status: 'Draft', column: 'ready', title: 'Bike crank arms', units: [{ eq: equipment.crestview[7], lines: [[P['NW-ICU-CRANK'], 1, 1]] }] },
    { cust: 'northpoint', loc: 'northpoint', status: 'Draft', column: 'ask-tech', title: 'Treadmill roller', units: [{ eq: equipment.northpoint[2], lines: [[P['NW-T7-ROLLER-F'], 1, 1.5]] }] },
    { cust: 'lakeside', loc: 'lakeside', status: 'Draft', column: null, boardCol: tbInProgress.id, title: 'Treadmill belt + deck', units: [{ eq: equipment.lakeside[0], lines: [[P['NW-TRM-BELT-885'], 1, 1.5], [P['NW-TRM-DECK-885'], 1, 1]] }] },
    { cust: 'summit', loc: 'summit', status: 'PartiallyApproved', column: null, boardCol: tbFollowUp.id, sentAt: days(-6), approvedAt: days(-4), viewedAt: days(-5), title: 'Treadmill repairs',
      units: [{ eq: equipment.summit[0], approval: 'Approved', lines: [[P['NW-TRM-BELT-885'], 1, 1.5]] }, { eq: equipment.summit[1], approval: 'Declined', lines: [[P['NW-95T-ESTOP'], 1, 0.25]] }] },
    { cust: 'meridian', loc: 'meridian', status: 'Approved', column: null, boardCol: tbSent.id, sentAt: days(-9), approvedAt: days(-8), viewedAt: days(-9), title: 'StepMill chain',
      units: [{ eq: equipment.meridian[8], approval: 'Approved', lines: [[P['NW-8GX-CHAIN'], 1, 1.5]] }] },
    { cust: 'riverstone', loc: 'riverstone', status: 'Sent', column: null, boardCol: tbSent.id, sentAt: days(-3), viewedAt: days(-2), title: 'Elliptical stride arm',
      units: [{ eq: equipment.riverstone[3], lines: [[P['NW-95X-BRG'], 1, 1]] }] },
  ]
  for (const f of fill) await mkEstimate(f)

  // ── Manifest (git-ignored) ───────────────────────────────────────────────
  const manifest = {
    generatedAt: new Date().toISOString(), today: todayStr, company: COMPANY.name,
    password: PASSWORD, portalPassword: PORTAL_PASSWORD,
    users: { admin: admin.email, dispatcher: dispatcher.email, estimator: estimator.email },
    portal: { email: portalEmail, customerId: customers.ironworks.id },
    ids: {
      showcaseDraft: showcaseDraft.id, portalEstimate: portalEstimate.id, portalEstimateNumber: portalEstimate.estimateNumber,
      ironworks: customers.ironworks.id, ironworksUptown: locations.ironworksUptown.id, diagWorkOrder: woIronworksDiag.id, diagWorkOrderNumber: woIronworksDiag.workOrderNumber,
      techBoard: techBoard.id,
    },
  }
  mkdirSync(STATE_DIR, { recursive: true })
  writeFileSync(MANIFEST_PATH, JSON.stringify(manifest, null, 2))
  const eqCount = Object.values(equipment).reduce((s, l) => s + l.length, 0)
  console.log(`[demo-seed] ${COMPANY.name}: ${CUSTOMERS.length} customers, ${eqCount} machines, ${woN - 40} work orders, ${estN - 210} estimates, 3 AI drafts`)
}

main()
  .catch((e) => { console.error(e); process.exit(1) })
  .finally(() => prisma.$disconnect())
