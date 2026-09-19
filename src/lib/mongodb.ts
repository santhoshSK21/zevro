import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let MONGODB_URI = process.env.MONGODB_URI;
let mongoServer: MongoMemoryServer | null = null;

/**
 * Global is used here to maintain a cached connection across hot reloads
 * in development. This prevents connections growing exponentially
 * during API Route usage.
 */
let cached = (global as any).mongoose;

if (!cached) {
  cached = (global as any).mongoose = { conn: null, promise: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    let uriToConnect = MONGODB_URI;
    
    // Fallback to in-memory DB if the provided URI is a placeholder
    if (!uriToConnect || uriToConnect.includes('USERNAME:PASSWORD')) {
      console.log('Using fallback in-memory MongoDB because MONGODB_URI is a placeholder or not set.');
      if (!mongoServer) {
        mongoServer = await MongoMemoryServer.create();
      }
      uriToConnect = mongoServer.getUri();
    }

    cached.promise = mongoose.connect(uriToConnect!, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
