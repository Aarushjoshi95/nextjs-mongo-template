import { MongoClient } from 'mongodb'
import { v4 as uuidv4 } from 'uuid'
import { NextResponse } from 'next/server'

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
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')
  return response
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

    // Root endpoint - GET /api/root (since /api/ is not accessible with catch-all)
    if (route === '/root' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: "Hello World" }))
    }
    // Root endpoint - GET /api/root (since /api/ is not accessible with catch-all)
    if (route === '/' && method === 'GET') {
      return handleCORS(NextResponse.json({ message: "Hello World" }))
    }

    // Discovery call enquiries - POST /api/enquiries
    if (route === '/enquiries' && method === 'POST') {
      let body
      try {
        body = await request.json()
      } catch {
        return handleCORS(NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 }))
      }

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
      await db.collection('enquiries').insertOne(doc)
      const { _id, ...clean } = doc
      return handleCORS(NextResponse.json({ ok: true, enquiry: clean }, { status: 201 }))
    }

    // Discovery call enquiries - GET /api/enquiries
    if (route === '/enquiries' && method === 'GET') {
      const items = await db.collection('enquiries')
        .find({}, { projection: { _id: 0 } })
        .sort({ createdAt: -1 })
        .limit(200)
        .toArray()
      return handleCORS(NextResponse.json({ count: items.length, enquiries: items }))
    }

    // Status endpoints - POST /api/status
    if (route === '/status' && method === 'POST') {
      const body = await request.json()
      
      if (!body.client_name) {
        return handleCORS(NextResponse.json(
          { error: "client_name is required" }, 
          { status: 400 }
        ))
      }

      const statusObj = {
        id: uuidv4(),
        client_name: body.client_name,
        timestamp: new Date()
      }

      await db.collection('status_checks').insertOne(statusObj)
      return handleCORS(NextResponse.json(statusObj))
    }

    // Status endpoints - GET /api/status
    if (route === '/status' && method === 'GET') {
      const statusChecks = await db.collection('status_checks')
        .find({})
        .limit(1000)
        .toArray()

      // Remove MongoDB's _id field from response
      const cleanedStatusChecks = statusChecks.map(({ _id, ...rest }) => rest)
      
      return handleCORS(NextResponse.json(cleanedStatusChecks))
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