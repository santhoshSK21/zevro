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

export const productsToInsert: any[] = [];

for (const cat of categories) {
  for (let i = 0; i < 50; i++) {
    const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
    const mat = materials[Math.floor(Math.random() * materials.length)];
    const nns = nouns[cat.slug];
    const noun = nns[Math.floor(Math.random() * nns.length)];
    const name = `${adj} ${mat} ${noun}`.toUpperCase();

    const price = Math.floor(Math.random() * 15000) + 2000;
    const op = price + Math.floor(Math.random() * 5000) + 1000;
    
    const imgs = [
      i === 0 ? '/pdp_hero_1.png' : i === 1 ? '/pdp_hero_2.png' : `https://picsum.photos/seed/${cat.slug}-${i}-A/800/1200`,
      i === 0 ? '/pdp_hero_2.png' : i === 1 ? '/pdp_hero_1.png' : `https://picsum.photos/seed/${cat.slug}-${i}-B/800/1200`
    ];
    
    productsToInsert.push({
      _id: `${cat.slug}-${i}`,
      name: name,
      slug: `${cat.slug}-${i + 1}-${Date.now()}`,
      description: 'A beautiful luxury piece crafted for elegance. Premium quality fabric ensuring a comfortable fit. Perfect for any special occasion or modern editorial look.',
      shortDescription: 'Premium fashion wear.',
      category: cat.slug,
      subcategory: 'general',
      price: price * 100, // keep price in paise
      originalPrice: op * 100,
      isFeatured: i < 3,
      isNewArrival: i < 5,
      variants: [
        {
          colorName: 'Standard',
          colorHex: '#000000',
          images: [imgs[0], imgs[0]],
          sizes: [
            { size: 'XS', stock: 10 },
            { size: 'S', stock: 15 },
            { size: 'M', stock: 10 },
            { size: 'L', stock: 5 }
          ]
        }
      ]
    });
  }
}
