/**
 * POST /api/sku/validate
 *
 * Validates a SKU string before it is saved to the database.
 * Checks two independent rules:
 *
 *   Rule 1 (format)    — only uppercase letters, numbers, and hyphens;
 *                        no spaces or special characters.
 *   Rule 2 (uniqueness) — no other product owned by the same seller may
 *                         have the same SKU on any of its variants/sizes.
 *
 * Request body (JSON):
 * {
 *   sku:              string          — the SKU to validate (required)
 *   excludeProductId: string | null   — _id of the product being edited;
 *                                       its own existing SKUs are excluded
 *                                       from the uniqueness scan so an
 *                                       unchanged SKU is not a conflict
 * }
 *
 * Response (JSON):
 * {
 *   valid:     boolean   — true only when both format AND uniqueness pass
 *   formatOk:  boolean   — true if the SKU passes the character-set check
 *   uniqueOk:  boolean   — true if no collision was found in the database
 *   error:     string    — human-readable reason when valid is false
 * }
 *
 * This endpoint is restricted to admin users.
 * It is read-only and does NOT modify the database.
 */

import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/mongodb';
import { Product } from '../../../../models/Product';
import { assertAdminAccess } from '../../../../lib/adminAuth';
import { isValidSkuFormat, normaliseSku } from '../../../../lib/sku';

export async function POST(request: Request) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const rawSku: string = body.sku ?? '';
    const excludeProductId: string | null = body.excludeProductId ?? null;

    if (!rawSku || rawSku.trim() === '') {
      return NextResponse.json(
        { valid: false, formatOk: false, uniqueOk: false, error: 'SKU is required' },
        { status: 400 },
      );
    }

    // Normalise before checking — this mirrors how the SKU would be stored
    const sku = normaliseSku(rawSku);

    // ── Rule 1: Format check ──────────────────────────────────────────────────
    const formatOk = isValidSkuFormat(sku);
    if (!formatOk) {
      return NextResponse.json({
        valid: false,
        formatOk: false,
        uniqueOk: false,
        error:
          'Invalid SKU format. Only uppercase letters (A-Z), digits (0-9), ' +
          'and hyphens (-) are allowed. No spaces or special characters.',
      });
    }

    // ── Rule 2: Uniqueness check ──────────────────────────────────────────────
    await dbConnect();

    // Build the MongoDB query that searches for this SKU inside any
    // variant → size entry across all products.
    const query: any = { 'variants.sizes.sku': sku };

    // When editing an existing product, exclude that product itself so its
    // own current SKU values do not trigger a false conflict.
    if (excludeProductId) {
      query._id = { $ne: excludeProductId };
    }

    const collision = await Product.findOne(query).select('_id name').lean();

    const uniqueOk = collision === null;

    if (!uniqueOk) {
      return NextResponse.json({
        valid: false,
        formatOk: true,
        uniqueOk: false,
        error: `SKU "${sku}" is already in use. Each SKU must be unique across all products.`,
      });
    }

    // Both checks passed
    return NextResponse.json({ valid: true, formatOk: true, uniqueOk: true, sku });
  } catch (error: any) {
    console.error('SKU validate error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to validate SKU' },
      { status: 500 },
    );
  }
}
