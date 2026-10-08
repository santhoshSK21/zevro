/**
 * POST /api/sku/generate
 *
 * Generates a formatted SKU string from the supplied product attributes.
 *
 * Request body (JSON):
 * {
 *   brand:        string   — brand / store name   (e.g. "Zara")
 *   category:     string   — category slug        (e.g. "tops-shirts")
 *   serialNumber: number   — style serial number  (e.g. 1)
 *   color:        string   — color name           (e.g. "Navy Blue")
 *   size:         string   — size label           (e.g. "M")
 * }
 *
 * Response (JSON):
 * {
 *   sku:     string   — full SKU, e.g. "ZAR-TOP001-NVY-M"
 *   brand:   string   — brand segment,  e.g. "ZAR"
 *   style:   string   — style segment,  e.g. "TOP001"
 *   color:   string   — color segment,  e.g. "NVY"
 *   size:    string   — size segment,   e.g. "M"
 * }
 *
 * This endpoint is restricted to admin users.
 * It is read-only and does NOT persist anything to the database.
 */

import { NextResponse } from 'next/server';
import { assertAdminAccess } from '../../../../lib/adminAuth';
import {
  generateSku,
  brandCode,
  styleCode,
  colorCode,
  sizeCode,
} from '../../../../lib/sku';

export async function POST(request: Request) {
  try {
    const isAdmin = await assertAdminAccess();
    if (!isAdmin) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { brand, category, serialNumber, color, size } = body;

    // Validate required fields
    if (!brand || typeof brand !== 'string' || brand.trim() === '') {
      return NextResponse.json({ error: 'brand is required' }, { status: 400 });
    }
    if (!category || typeof category !== 'string' || category.trim() === '') {
      return NextResponse.json({ error: 'category is required' }, { status: 400 });
    }
    if (!color || typeof color !== 'string' || color.trim() === '') {
      return NextResponse.json({ error: 'color is required' }, { status: 400 });
    }
    if (!size || typeof size !== 'string' || size.trim() === '') {
      return NextResponse.json({ error: 'size is required' }, { status: 400 });
    }

    const serial = Number(serialNumber) || 1;

    // Derive each segment so the client can display a breakdown
    const b  = brandCode(brand.trim());
    const st = styleCode(category.trim(), serial);
    const c  = colorCode(color.trim());
    const sz = sizeCode(size.trim());
    const sku = generateSku(brand.trim(), category.trim(), serial, color.trim(), size.trim());

    return NextResponse.json({
      sku,
      segments: { brand: b, style: st, color: c, size: sz },
    });
  } catch (error: any) {
    console.error('SKU generate error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to generate SKU' },
      { status: 500 },
    );
  }
}
