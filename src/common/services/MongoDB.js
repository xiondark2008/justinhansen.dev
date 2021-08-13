import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
const MONGODB_DB = process.env.MONGODB_DB

if (!MONGODB_URI) {
  throw new Error(
    'Please define the MONGODB_URI environment variable inside .env.local'
  )
}

if (!MONGODB_DB) {
  throw new Error(
    'Please define the MONGODB_DB environment variable inside .env.local'
  )
}

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = global.mongo

if (!cached) {
  cached = global.mongo = new Map()
  //{ conn: null, promise: null }
}

export async function connectToDatabase(db = MONGODB_DB) {

  if( !cached.has(db) ){
    cached.set(db, { conn: null, promise: null })
  }
  const cachedDB = cached.get(db)

  if (cachedDB.conn) {
    return cachedDB.conn
  }

  if (!cachedDB.promise) {
    const opts = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }

    cachedDB.promise = MongoClient.connect(MONGODB_URI, opts).then((client) => {
      return {
        client,
        db: client.db(MONGODB_DB),
      }
    })
  }
  cachedDB.conn = await cachedDB.promise
  return cachedDB.conn
}
