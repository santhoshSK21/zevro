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
    
    // Only attempt in-memory DB in local development if binary is available
    if (!uriToConnect || uriToConnect.includes('USERNAME:PASSWORD')) {
      if (process.env.NODE_ENV !== 'production') {
        try {
          if (!mongoServer) {
            mongoServer = await MongoMemoryServer.create();
          }
          uriToConnect = mongoServer.getUri();
        } catch (memErr) {
          console.warn('Memory MongoDB server unavailable:', memErr);
        }
      }
    }

    if (!uriToConnect) {
      console.warn('MONGODB_URI is not defined. Proceeding in decoupled mode.');
      return null;
    }

    cached.promise = mongoose.connect(uriToConnect, opts).then((mongoose) => {
      return mongoose;
    });
  }
  
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    console.warn('MongoDB connection error:', e);
    return null;
  }

  return cached.conn;
}

export default dbConnect;
