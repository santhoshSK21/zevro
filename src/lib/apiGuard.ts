/**
 * apiGuard.ts — server-side API response helpers.
 *
 * When the database is unavailable (dbConnect returns null), every API route
 * should return a consistent 503 with a generic payload instead of exposing
 * internal error details to the client.
 *
 * Usage in a new route handler:
 *
 *   import dbConnect from '../../../lib/mongodb';
 *   import { dbUnavailableResponse, isDbConnected } from '../../../lib/apiGuard';
 *
 *   export async function GET() {
 *     const conn = await dbConnect();
 *     if (!isDbConnected(conn)) return dbUnavailableResponse();
 *     // ... normal handler
 *   }
 */

import { NextResponse } from 'next/server';

/** Opaque payload returned to clients when the DB is down. */
const DB_UNAVAILABLE_PAYLOAD = {
  error: 'SERVICE_UNAVAILABLE',
  message: 'Service unavailable. Please try again later.',
};

/**
 * Returns a 503 JSON response with a generic "service unavailable" payload.
 * Never leaks internal error messages or stack traces.
 */
export function dbUnavailableResponse(): NextResponse {
  return NextResponse.json(DB_UNAVAILABLE_PAYLOAD, { status: 503 });
}

/**
 * Returns a 500 JSON response with a generic message.
 * Use this instead of leaking the raw `error.message` to the client.
 */
export function internalErrorResponse(context?: string): NextResponse {
  console.error(`[API error]${context ? ` ${context}` : ''}:`);
  return NextResponse.json(
    { error: 'SERVICE_UNAVAILABLE', message: 'Service unavailable. Please try again later.' },
    { status: 503 },
  );
}

/**
 * Returns true when `conn` is a live Mongoose connection object.
 * Treats null (returned by dbConnect when DB is unreachable) as unavailable.
 */
export function isDbConnected(conn: unknown): boolean {
  return conn !== null && conn !== undefined;
}
