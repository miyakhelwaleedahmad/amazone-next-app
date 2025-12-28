// src/lib/mongodb.ts
import mongoose from "mongoose";

const MONGO_URI = process.env.MONGODB_URI;
if (!MONGO_URI) {
  // ❌ was "Please define the MONGO_URI..." — FIXED
  throw new Error("Please define the MONGODB_URI environment variable in .env.local");
}

/**
 * Simple, type-safe cache on the globalThis object.
 * Use `any` for conn/promise to avoid tricky mongoose types in different environments.
 */
type MongoCache = { conn: any | null; promise: Promise<any> | null };

declare global {
  // eslint-disable-next-line no-var
  var _mongoCache: MongoCache | undefined;
}

const globalAny: any = globalThis;
globalAny._mongoCache = globalAny._mongoCache ?? { conn: null, promise: null };

async function connectToDatabase(): Promise<any> {
  // return existing connection if present
  if (globalAny._mongoCache.conn) {
    return globalAny._mongoCache.conn;
  }

  // create promise once
  if (!globalAny._mongoCache.promise) {
    // cast MONGO_URI as string to placate TS that it may be undefined
    globalAny._mongoCache.promise = mongoose
      .connect(MONGO_URI as string)
      .then((mongooseInstance) => {
        console.log("✅ MongoDB connected");
        globalAny._mongoCache.conn = mongooseInstance;
        return mongooseInstance;
      })
      .catch((err) => {
        console.error("❌ MongoDB connection failed:", err?.message ?? err);
        // clear promise so future attempts can retry
        globalAny._mongoCache.promise = null;
        throw err;
      });
  }

  return globalAny._mongoCache.promise;
}

export default connectToDatabase;
