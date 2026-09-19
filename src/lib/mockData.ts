export const categories = [
  { name: 'Western Wear', slug: 'western-wear' },
  { name: 'Ethnic Wear', slug: 'ethnic-wear' },
  { name: 'Indo-Western', slug: 'indo-western' },
  { name: 'Accessories', slug: 'accessories' }
];

const adjectives = ['Premium', 'Luxury', 'Ethereal', 'Classic', 'Modern', 'Vintage', 'Signature', 'Timeless', 'Artisan', 'Bespoke'];
const materials = ['Silk', 'Cotton', 'Linen', 'Velvet', 'Chiffon', 'Georgette', 'Satin', 'Cashmere'];
const nouns: Record<string, string[]> = {
  'western-wear': ['Blouse', 'Dress', 'Trousers', 'Gown', 'Jacket', 'Blazer', 'Skirt', 'Corset'],
  'ethnic-wear': ['Saree', 'Lehenga', 'Kurti Set', 'Anarkali', 'Sharara', 'Dupatta'],
  'indo-western': ['Drape Dress', 'Fusion Set', 'Cape Suit', 'Dhoti Pants', 'Palazzo Set'],
  'accessories': ['Necklace', 'Earrings', 'Handbag', 'Belt', 'Scarf', 'Clutch']
};

const colorPalettes = [
  [
    { colorName: 'Ivory', colorHex: '#F5F0E8' },
    { colorName: 'Midnight', colorHex: '#1A1A2E' },
    { colorName: 'Rose Dust', colorHex: '#C9A59A' },
  ],
  [
    { colorName: 'Sage', colorHex: '#8FAF8B' },
    { colorName: 'Burgundy', colorHex: '#6D2B3D' },
    { colorName: 'Champagne', colorHex: '#D4C5A9' },
  ],
  [
    { colorName: 'Steel Blue', colorHex: '#4A7C9E' },
    { colorName: 'Blush', colorHex: '#E8B4B8' },
    { colorName: 'Charcoal', colorHex: '#3A3A3A' },
  ],
  [
    { colorName: 'Forest', colorHex: '#2D5A27' },
    { colorName: 'Sand', colorHex: '#C9B99A' },
    { colorName: 'Plum', colorHex: '#6B3FA0' },
  ],
];

const mockReviews = [
  { author: 'Priya S.', rating: 5, date: '2 weeks ago', body: 'Absolutely stunning quality. The fabric drapes beautifully and the fit is perfect. Received so many compliments at the event!' },
  { author: 'Ananya M.', rating: 4, date: '1 month ago', body: 'Great piece, very luxurious feel. Slightly long but easy to get altered. Packaging was lovely.' },
  { author: 'Shreya K.', rating: 5, date: '1 month ago', body: 'Worth every rupee. The craftsmanship is exquisite — you can tell this is premium.' },
  { author: 'Ritu V.', rating: 3, date: '2 months ago', body: 'Beautiful design but took longer than expected to arrive. Quality is good though.' },
];

export const productsToInsert: any[] = [];

function seededRand(seed: number, max: number): number {
  return ((seed * 1103515245 + 12345) & 0x7fffffff) % max;
}

for (const cat of categories) {
  for (let i = 0; i < 50; i++) {
    const seed = cat.slug.length * 1000 + i;
    const adj = adjectives[seededRand(seed, adjectives.length)];
    const mat = materials[seededRand(seed + 1, materials.length)];
    const nns = nouns[cat.slug];
    const noun = nns[seededRand(seed + 2, nns.length)];
    const name = `${adj} ${mat} ${noun}`.toUpperCase();

    const price = 2000 + seededRand(seed + 3, 15000);
    const op = price + 1000 + seededRand(seed + 4, 5000);

    const imgSeedA = `${cat.slug}-${i}-A`;
    const imgSeedB = `${cat.slug}-${i}-B`;
    const imgSeedC = `${cat.slug}-${i}-C`;

    const imgs = i === 0
      ? ['/pdp_hero_1.png', '/pdp_hero_2.png', '/pdp_hero_1.png']
      : i === 1
      ? ['/pdp_hero_2.png', '/pdp_hero_1.png', '/pdp_hero_2.png']
      : [
          `https://picsum.photos/seed/${imgSeedA}/800/1200`,
          `https://picsum.photos/seed/${imgSeedB}/800/1200`,
          `https://picsum.photos/seed/${imgSeedC}/800/1200`,
        ];

    const palette = colorPalettes[seededRand(seed + 5, colorPalettes.length)];
    const variants = palette.map((color, ci) => ({
      colorName: color.colorName,
      colorHex: color.colorHex,
      images: [imgs[0], imgs[1], imgs[2]],
      sizes: [
        { size: 'XS', stock: seededRand(seed + ci * 10, 15) },
        { size: 'S',  stock: seededRand(seed + ci * 10 + 1, 20) },
        { size: 'M',  stock: seededRand(seed + ci * 10 + 2, 10) },
        { size: 'L',  stock: seededRand(seed + ci * 10 + 3, 8) },
        { size: 'XL', stock: seededRand(seed + ci * 10 + 4, 5) },
      ],
    }));

    const avgRating = parseFloat((3.5 + seededRand(seed + 99, 3) * 0.5).toFixed(1));
    const reviewCount = 10 + seededRand(seed + 98, 200);
    const materialLabel = `${mat} Blend`;

    productsToInsert.push({
      _id: `${cat.slug}-${i}`,
      name,
      slug: `${cat.slug}-${i + 1}`,
      description: `A beautiful luxury piece crafted for elegance. Made from ${materialLabel}, this ${noun.toLowerCase()} combines premium quality with a modern silhouette. Perfect for any special occasion or editorial look.`,
      shortDescription: `Premium ${mat.toLowerCase()} fashion wear.`,
      category: cat.slug,
      subcategory: 'general',
      price: price * 100,
      originalPrice: op * 100,
      isFeatured: i < 3,
      isNewArrival: i < 5,
      material: `70% ${mat}, 20% Polyester, 10% Viscose`,
      careInstructions: 'Dry clean recommended. Do not wring. Store folded in a cool, dry place.',
      avgRating,
      reviewCount,
      reviews: mockReviews,
      variants,
    });
  }
}


