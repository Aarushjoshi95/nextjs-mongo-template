import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'
import { timingSafeEqual } from 'crypto'
import { classifyEnquiry, askGemini, scoreAnswer, mentionedIn } from '@/lib/ai'

// MongoDB connection
let client
let db

async function connectToMongo() {
  if (!client) {
    client = new MongoClient(process.env.MONGO_URL)
    await client.connect()
    db = client.db(process.env.DB_NAME)
  }
  return db
}

// Helper function to handle CORS
function handleCORS(response) {
  response.headers.set('Access-Control-Allow-Origin', process.env.CORS_ORIGINS || '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Admin-Token')
  return response
}

// ---------------------------------------------------------------------------
// Security helpers
// ---------------------------------------------------------------------------

const MAX_BODY_BYTES = 16 * 1024 // 16 KB is plenty for a contact form

// Read and parse a JSON body with a hard size cap. Returns { body } or { error, status }.
async function readJson(request) {
  const declared = Number(request.headers.get('content-length') || 0)
  if (declared > MAX_BODY_BYTES) return { error: 'Request body too large', status: 413 }
  let text
  try {
    text = await request.text()
  } catch {
    return { error: 'Invalid JSON body', status: 400 }
  }
  if (text.length > MAX_BODY_BYTES) return { error: 'Request body too large', status: 413 }
  try {
    const body = JSON.parse(text)
    if (!body || typeof body !== 'object' || Array.isArray(body)) return { error: 'Invalid JSON body', status: 400 }
    return { body }
  } catch {
    return { error: 'Invalid JSON body', status: 400 }
  }
}

// Constant-time string compare so the admin token cannot be guessed byte-by-byte.
function safeEqual(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') return false
  const ba = Buffer.from(a)
  const bb = Buffer.from(b)
  if (ba.length !== bb.length) return false
  return timingSafeEqual(ba, bb)
}

// Admin-only guard for read endpoints that expose lead PII.
// Accepts `Authorization: Bearer <ADMIN_TOKEN>` or `X-Admin-Token: <ADMIN_TOKEN>`.
// Fails closed if ADMIN_TOKEN is not configured.
function requireAdmin(request) {
  const expected = process.env.ADMIN_TOKEN
  if (!expected) return { error: 'Admin access is not configured', status: 503 }
  const auth = request.headers.get('authorization') || ''
  const bearer = auth.toLowerCase().startsWith('bearer ') ? auth.slice(7).trim() : ''
  const header = request.headers.get('x-admin-token') || ''
  const provided = bearer || header
  if (!provided || !safeEqual(provided, expected)) return { error: 'Unauthorized', status: 401 }
  return null
}

// Simple in-memory fixed-window rate limiter (per process). Good enough to blunt
// form-spam bursts; swap for a shared store if the app runs on many replicas.
const RATE_WINDOW_MS = 10 * 60 * 1000
const RATE_MAX = 5
const rateBuckets = new Map()

function clientIp(request) {
  const xff = request.headers.get('x-forwarded-for') || ''
  const first = xff.split(',')[0].trim()
  return first || request.headers.get('x-real-ip') || 'unknown'
}

function rateLimit(request, key, max = RATE_MAX) {
  const now = Date.now()
  // opportunistic cleanup
  if (rateBuckets.size > 5000) {
    for (const [k, v] of rateBuckets) if (v.resetAt <= now) rateBuckets.delete(k)
  }
  const id = `${key}:${clientIp(request)}`
  let bucket = rateBuckets.get(id)
  if (!bucket || bucket.resetAt <= now) {
    bucket = { count: 0, resetAt: now + RATE_WINDOW_MS }
    rateBuckets.set(id, bucket)
  }
  bucket.count += 1
  if (bucket.count > max) {
    return { error: 'Too many requests. Please try again in a few minutes.', status: 429, retryAfter: Math.ceil((bucket.resetAt - now) / 1000) }
  }
  return null
}

// OPTIONS handler for CORS
export async function OPTIONS() {
  return handleCORS(new NextResponse(null, { status: 200 }))
}

// Route handler function
async function handleRoute(request, { params }) {
  const { path = [] } = await params
  const route = `/${path.join('/')}`
  const method = request.method

  try {
    const db = await connectToMongo()

    // Discovery call enquiries - POST /api/enquiries
    if (route === '/enquiries' && method === 'POST') {
      const limited = rateLimit(request, 'enquiries')
      if (limited) {
        const res = NextResponse.json({ error: limited.error }, { status: 429 })
        res.headers.set('Retry-After', String(limited.retryAfter))
        return handleCORS(res)
      }

      const parsed = await readJson(request)
      if (parsed.error) {
        return handleCORS(NextResponse.json({ error: parsed.error }, { status: parsed.status }))
      }
      const body = parsed.body

      // Honeypot: bots fill this hidden field. Silently accept but do not store.
      if (body.website_url) {
        return handleCORS(NextResponse.json({ ok: true, id: uuidv4() }))
      }

      const str = (v) => (typeof v === 'string' ? v.trim() : '')
      const enquiry = {
        firstName: str(body.firstName),
        lastName: str(body.lastName),
        email: str(body.email).toLowerCase(),
        company: str(body.company),
        country: str(body.country),
        countryCode: str(body.countryCode),
        phone: str(body.phone).replace(/[\s\-().]/g, ''),
        source: str(body.source),
        message: str(body.message),
      }

      const errors = {}
      if (!enquiry.firstName) errors.firstName = 'First name is required'
      if (!enquiry.lastName) errors.lastName = 'Last name is required'
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(enquiry.email)) errors.email = 'Enter a valid email address'
      if (!/^\+\d{1,4}$/.test(enquiry.countryCode)) errors.countryCode = 'Select a country code'
      if (!/^\d{6,15}$/.test(enquiry.phone)) errors.phone = 'Enter a valid contact number (6–15 digits)'
      if (!enquiry.source) errors.source = 'Tell me how you heard about me'
      if (enquiry.message.length > 2000) errors.message = 'Keep the note under 2000 characters'

      if (Object.keys(errors).length) {
        return handleCORS(NextResponse.json({ error: 'Validation failed', errors }, { status: 400 }))
      }

      const doc = {
        id: uuidv4(),
        ...enquiry,
        status: 'new',
        createdAt: new Date().toISOString(),
      }

      // AI enrichment via Jev (fail-open). Spam is stored but flagged so nothing is lost.
      const ai = await classifyEnquiry(enquiry)
      doc.ai = ai
      if (ai.aiClassified) {
        doc.leadScore = ai.leadScore
        doc.leadLabel = ai.leadLabel
        doc.serviceIntent = ai.serviceIntent
        doc.industry = ai.industry
        if (ai.isSpam) doc.status = 'spam'
      }

      await db.collection('enquiries').insertOne(doc)
      const { _id, ai: _ai, ...clean } = doc
      // Do not reveal the spam verdict to the submitter; respond as a normal success.
      if (clean.status === 'spam') clean.status = 'new'
      return handleCORS(NextResponse.json({ ok: true, enquiry: clean }, { status: 201 }))
    }

    // AI Visibility Checker - POST /api/visibility  { brand, buyerPrompt }
    if (route === '/visibility' && method === 'POST') {
      const limited = rateLimit(request, 'visibility', 10)
      if (limited) {
        const res = NextResponse.json({ error: limited.error }, { status: 429 })
        res.headers.set('Retry-After', String(limited.retryAfter))
        return handleCORS(res)
      }
      const parsed = await readJson(request)
      if (parsed.error) return handleCORS(NextResponse.json({ error: parsed.error }, { status: parsed.status }))
      const brand = typeof parsed.body.brand === 'string' ? parsed.body.brand.trim().slice(0, 120) : ''
      const buyerPrompt = typeof parsed.body.buyerPrompt === 'string' ? parsed.body.buyerPrompt.trim().slice(0, 800) : ''
      const errors = {}
      if (brand.length < 2) errors.brand = 'Enter your brand name'
      if (buyerPrompt.length < 8) errors.buyerPrompt = 'Enter the question a buyer would ask (8+ characters)'
      if (Object.keys(errors).length) return handleCORS(NextResponse.json({ error: 'Validation failed', errors }, { status: 400 }))

      let gen
      try {
        gen = await askGemini({ brand, buyerPrompt })
      } catch (e) {
        return handleCORS(NextResponse.json({ error: e.message || 'AI request failed' }, { status: e.status || 502 }))
      }
      const mentioned = mentionedIn(gen.answer, brand)
      const scored = await scoreAnswer({ brand, answer: gen.answer, mentioned })
      const result = {
        id: uuidv4(),
        brand,
        buyerPrompt,
        engine: 'Gemini',
        model: gen.model,
        answer: gen.answer,
        mentioned,
        competitors: gen.competitors,
        ...scored,
        createdAt: new Date().toISOString(),
      }
      try {
        await db.collection('visibility_checks').insertOne({ ...result, ip: clientIp(request) })
      } catch (dbErr) {
        console.error('visibility_checks insert failed', dbErr)
      }
      return handleCORS(NextResponse.json(result))
    }

    // Discovery call enquiries - GET /api/enquiries (admin only — contains lead PII)
    if (route === '/enquiries' && method === 'GET') {
      const denied = requireAdmin(request)
      if (denied) return handleCORS(NextResponse.json({ error: denied.error }, { status: denied.status }))
      const items = await db.collection('enquiries')
        .find({}, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .limit(200)
        .toArray()
      return handleCORS(NextResponse.json({ count: items.length, enquiries: items }))
    }

    // Route not found
    return handleCORS(NextResponse.json(
      { error: `Route ${route} not found` }, 
      { status: 404 }
    ))

  } catch (error) {
    console.error('API Error:', error)
    return handleCORS(NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    ))
  }
}

// Export all HTTP methods
export const GET = handleRoute
export const POST = handleRoute
export const PUT = handleRoute
export const DELETE = handleRoute
export const PATCH = handleRoute