/**
 * SKU (Stock Keeping Unit) logic for Zevro fashion e-commerce.
 *
 * Format: BRAND-STYLE-COLOR-SIZE
 *   BRAND  — first 3 letters of brand name, uppercase        (e.g. "Zara"      → "ZAR")
 *   STYLE  — category prefix (3 chars) + 3-digit zero-padded (e.g. "TSH001")
 *   COLOR  — 3-letter color code, uppercase                  (e.g. "Navy Blue" → "NVY")
 *   SIZE   — apparel size label or numeric size               (e.g. "M", "32")
 *
 * Examples:
 *   ZAR-TSH001-RED-M
 *   ZAR-JNS014-BLU-32
 *   LEV-DNM003-BLK-28
 *
 * Rules enforced here:
 *   1. Only uppercase letters, numbers, and hyphens — no spaces or special characters.
 *   2. Uniqueness per seller is enforced server-side via the /api/sku/validate endpoint.
 *   3. One SKU per color + size variant.
 *   4. SKU segments never include price, season, or database IDs.
 */

// ─── Category → STYLE prefix map ────────────────────────────────────────────
//
// Keys are category/subcategory slugs used in the Product model.
// Values are 3-letter uppercase style prefixes.
//
export const CATEGORY_SKU_PREFIX: Record<string, string> = {
  // Western Wear subcategories
  'dresses-gowns':    'DRS',
  'coord-sets':       'CRD',
  'tops-shirts':      'TOP',
  'trousers-skirts':  'TRS',
  'blazers-jackets':  'BLZ',
  'jumpsuits':        'JMP',
  // Ethnic Wear subcategories
  'sarees-drapes':    'SAR',
  'anarkali-suits':   'ANK',
  'lehengas-sets':    'LHG',
  'kurta-sets':       'KRT',
  'festive-dupattas': 'DPT',
  // Indo-Western
  'cape-gowns':       'CPG',
  'dhoti-sets':       'DHT',
  'fusion-coords':    'FUS',
  'crop-top-skirt':   'CRP',
  // Accessories
  'jewelry':          'JWL',
  'clutches':         'CLT',
  'belts':            'BLT',
  'footwear':         'FTW',
  // Top-level categories (fallback)
  'western-wear':     'WST',
  'ethnic-wear':      'ETH',
  'indo-western':     'IWS',
  'accessories':      'ACS',
  'new-in':           'NEW',
  // Generic garment types
  'jeans':            'JNS',
  'denim':            'DNM',
  'tshirts':          'TSH',
  't-shirts':         'TSH',
  'shirts':           'SHT',
};

// ─── Color name → 3-letter code map ─────────────────────────────────────────
//
// Covers the most common fashion colors.
// Unknown colors fall back to the first 3 alphanumeric chars of the name.
//
const COLOR_CODE_MAP: Record<string, string> = {
  'red':           'RED',
  'blue':          'BLU',
  'navy':          'NVY',
  'navy blue':     'NVY',
  'midnight blue': 'MDB',
  'green':         'GRN',
  'olive':         'OLV',
  'emerald':       'EMR',
  'yellow':        'YLW',
  'mustard':       'MST',
  'orange':        'ORG',
  'pink':          'PNK',
  'rose':          'RSE',
  'blush':         'BLS',
  'purple':        'PRP',
  'lavender':      'LVN',
  'violet':        'VLT',
  'white':         'WHT',
  'off white':     'OFW',
  'off-white':     'OFW',
  'cream':         'CRM',
  'ivory':         'IVR',
  'black':         'BLK',
  'charcoal':      'CHL',
  'grey':          'GRY',
  'gray':          'GRY',
  'silver':        'SLV',
  'gold':          'GLD',
  'brown':         'BRN',
  'beige':         'BGE',
  'tan':           'TAN',
  'camel':         'CML',
  'rust':          'RST',
  'maroon':        'MRN',
  'burgundy':      'BRG',
  'wine':          'WNE',
  'coral':         'CRL',
  'peach':         'PCH',
  'turquoise':     'TRQ',
  'teal':          'TEL',
  'cyan':          'CYN',
  'indigo':        'IND',
  'magenta':       'MGT',
  'fuchsia':       'FCH',
  'lilac':         'LLC',
  'mint':          'MNT',
  'sage':          'SGE',
  'nude':          'NDE',
  'khaki':         'KHK',
  'denim':         'DNM',
  'multicolor':    'MLT',
  'multi':         'MLT',
  'printed':       'PRT',
  'floral':        'FLR',
  'stripe':        'STR',
  'check':         'CHK',
};

// ─── SKU format regex ────────────────────────────────────────────────────────
//
// Rule 1: Only uppercase letters, numbers, and hyphens.
//         String must contain at least one hyphen (minimum two segments).
//
export const SKU_SEGMENT_REGEX = /^[A-Z0-9]+(-[A-Z0-9]+)+$/;

// ─── Exported helpers ─────────────────────────────────────────────────────────

/**
 * Derive a 3-letter BRAND code from a brand/store name.
 *
 * @example brandCode('Zara')          // 'ZAR'
 * @example brandCode('Louis Vuitton') // 'LOU'
 */
export function brandCode(brandName: string): string {
  return brandName
    .replace(/[^A-Za-z0-9]/g, '') // strip non-alphanumeric
    .toUpperCase()
    .slice(0, 3)
    .padEnd(3, 'X'); // pad to 3 chars if name is shorter
}

/**
 * Derive a 3-letter color code from a human-readable color name.
 *
 * @example colorCode('Red')        // 'RED'
 * @example colorCode('Navy Blue')  // 'NVY'
 * @example colorCode('Coral Pink') // 'CRL'  (first map match wins)
 */
export function colorCode(colorName: string): string {
  const lower = colorName.toLowerCase().trim();

  // Exact match
  if (COLOR_CODE_MAP[lower]) return COLOR_CODE_MAP[lower];

  // Partial match — first map key that appears inside the color name
  for (const [key, code] of Object.entries(COLOR_CODE_MAP)) {
    if (lower.includes(key)) return code;
  }

  // Fallback: first 3 alphanumeric characters, uppercase
  return lower
    .replace(/[^a-z0-9]/g, '')
    .slice(0, 3)
    .toUpperCase()
    .padEnd(3, 'X');
}

/**
 * Derive a STYLE segment: 3-letter category prefix + 3-digit zero-padded serial.
 *
 * @param categorySlug  Category or subcategory slug (e.g. "tops-shirts")
 * @param serialNumber  Positive integer (1 → "001", 14 → "014")
 *
 * @example styleCode('tops-shirts', 1)  // 'TOP001'
 * @example styleCode('jeans', 14)       // 'JNS014'
 */
export function styleCode(categorySlug: string, serialNumber: number): string {
  const prefix =
    CATEGORY_SKU_PREFIX[categorySlug.toLowerCase()] ??
    categorySlug
      .replace(/[^a-z0-9]/gi, '')
      .slice(0, 3)
      .toUpperCase()
      .padEnd(3, 'X');

  const serial = Math.max(1, Math.floor(serialNumber));
  return `${prefix}${String(serial).padStart(3, '0')}`;
}

/**
 * Sanitise a size label to be SKU-safe (uppercase, no spaces or specials).
 *
 * @example sizeCode('XL')   // 'XL'
 * @example sizeCode('32')   // '32'
 * @example sizeCode('38 W') // '38W'
 */
export function sizeCode(size: string): string {
  return size.toUpperCase().replace(/[^A-Z0-9]/g, '');
}

/**
 * Generate a complete, formatted SKU from its four semantic components.
 *
 * @param brand         Brand / store name   (e.g. "Zara")
 * @param categorySlug  Category slug        (e.g. "tops-shirts")
 * @param serialNumber  Style serial number  (e.g. 1)
 * @param color         Color name           (e.g. "Navy Blue")
 * @param size          Size label           (e.g. "M")
 *
 * @returns SKU in the format BRAND-STYLE-COLOR-SIZE
 *
 * @example
 * generateSku('Zara', 'tops-shirts', 1, 'Red', 'M')
 * // => 'ZAR-TOP001-RED-M'
 */
export function generateSku(
  brand: string,
  categorySlug: string,
  serialNumber: number,
  color: string,
  size: string,
): string {
  const b  = brandCode(brand);
  const st = styleCode(categorySlug, serialNumber);
  const c  = colorCode(color);
  const sz = sizeCode(size);
  return `${b}-${st}-${c}-${sz}`;
}

/**
 * Validate that a SKU string conforms to the allowed character set (Rule 1).
 *
 * Only uppercase letters, numbers, and hyphens are permitted.
 * The string must contain at least one hyphen (i.e. has at least two segments).
 *
 * Does NOT check uniqueness — use the `/api/sku/validate` endpoint for that.
 *
 * @returns true if the format is valid, false otherwise.
 */
export function isValidSkuFormat(sku: string): boolean {
  if (!sku || typeof sku !== 'string') return false;
  return SKU_SEGMENT_REGEX.test(sku.trim());
}

/**
 * Normalise a raw SKU before storage:
 *   - Trim surrounding whitespace
 *   - Convert to uppercase
 *   - Collapse internal whitespace runs into a single hyphen
 *   - Strip any character that is not A-Z, 0-9, or -
 */
export function normaliseSku(raw: string): string {
  return raw
    .trim()
    .toUpperCase()
    .replace(/\s+/g, '-')
    .replace(/[^A-Z0-9-]/g, '');
}
