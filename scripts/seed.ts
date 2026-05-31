import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// We define the schema inline to avoid Next.js specific imports breaking the script
const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  description: String,
  shortDescription: String,
  category: {
    type: String, required: true,
    enum: ['western-wear','ethnic-wear','indo-western','accessories','new-in']
  },
  subcategory: String,
  occasion: [String],
  variants: [{
    colorName: String,
    colorHex: String,
    images: [String],
    sizes: [{
      size: String,
      stock: { type: Number, default: 0 },
      sku: String
    }]
  }],
  price: { type: Number, required: true },
  originalPrice: { type: Number, required: true },
  fabric: String,
  careInstructions: [String],
  features: [String],
  tags: [String],
  isFeatured: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isBestseller: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  weight: Number,
  gst: { type: Number, default: 5 },
}, { timestamps: true });

const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

const URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/zevro';

const LUXURY_ADJECTIVES = ['Ethereal', 'Opulent', 'Regal', 'Timeless', 'Exquisite', 'Luminous', 'Majestic', 'Imperial', 'Aura', 'Celestial'];
const COLORS = [
  { name: 'Ivory', hex: '#FFFFF0' }, { name: 'Gold', hex: '#FFD700' }, { name: 'Emerald', hex: '#50C878' }, 
  { name: 'Crimson', hex: '#DC143C' }, { name: 'Midnight Blue', hex: '#191970' }, { name: 'Rose Dust', hex: '#9E5B5B' },
  { name: 'Champagne', hex: '#F7E7CE' }, { name: 'Onyx Black', hex: '#353839' }
];
const SIZES = ['XS', 'S', 'M', 'L', 'XL'];
const CARE = ['Dry clean only', 'Do not bleach', 'Iron on low heat', 'Store in a cool, dry place'];
const IMAGES = [
  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
  'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
  'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80',
  'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=800&q=80'
];

const TYPES = [
  { cat: 'western-wear', sub: 'dresses', name: 'Gown', fabric: 'Silk Blend' },
  { cat: 'western-wear', sub: 'co-ords', name: 'Co-ord Set', fabric: 'Linen' },
  { cat: 'western-wear', sub: 'tops', name: 'Blouse', fabric: 'Chiffon' },
  { cat: 'ethnic-wear', sub: 'sarees', name: 'Saree', fabric: 'Pure Silk' },
  { cat: 'ethnic-wear', sub: 'kurta-sets', name: 'Kurta Set', fabric: 'Cotton Silk' },
  { cat: 'ethnic-wear', sub: 'lehengas', name: 'Lehenga', fabric: 'Velvet' },
  { cat: 'indo-western', sub: 'drape-sets', name: 'Drape Set', fabric: 'Georgette' },
  { cat: 'indo-western', sub: 'capes', name: 'Cape Set', fabric: 'Organza' },
  { cat: 'accessories', sub: 'jewelry', name: 'Necklace', fabric: 'Metal Alloy' },
  { cat: 'accessories', sub: 'bags', name: 'Clutch', fabric: 'Embroidered Silk' }
];

function generateProducts() {
  const products = [];
  for (let i = 1; i <= 80; i++) {
    const type = TYPES[i % TYPES.length];
    const adj = LUXURY_ADJECTIVES[i % LUXURY_ADJECTIVES.length];
    const color = COLORS[i % COLORS.length];
    const name = `${adj} ${color.name} ${type.name}`;
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + i;
    
    const price = 499900 + (Math.floor(Math.random() * 50) * 100000); // 4999 INR to ~100k INR
    const originalPrice = Math.floor(price * (1.1 + Math.random() * 0.3));

    const product = {
      name,
      slug,
      description: `Experience the epitome of luxury with our ${name}. Carefully crafted from premium ${type.fabric}, this piece embodies both tradition and contemporary elegance. Perfect for your special moments.`,
      shortDescription: `Premium ${type.fabric} ${type.name.toLowerCase()} in exquisite ${color.name}.`,
      category: type.cat,
      subcategory: type.sub,
      occasion: ['festive', 'wedding', 'evening'],
      variants: [{
        colorName: color.name,
        colorHex: color.hex,
        images: IMAGES,
        sizes: SIZES.map(s => ({
          size: s,
          stock: Math.floor(Math.random() * 20),
          sku: `ZEV-${type.cat.substring(0,2).toUpperCase()}-${i}-${s}`
        }))
      }],
      price,
      originalPrice,
      fabric: type.fabric,
      careInstructions: CARE,
      features: ['Handcrafted detailing', 'Premium finishing', 'Ethically sourced materials'],
      tags: ['luxury', type.cat, type.sub, color.name.toLowerCase()],
      isFeatured: i % 10 === 0,
      isNewArrival: i % 5 === 0,
      isBestseller: i % 8 === 0,
      isActive: true,
      weight: 500,
      gst: 5
    };
    products.push(product);
  }
  return products;
}

async function seed() {
  try {
    console.log('Connecting to MongoDB...', URI);
    let connectUri = URI;
    if (URI.includes('USERNAME:PASSWORD')) {
      console.log('MongoDB URI is a placeholder. Attempting to connect to local MongoDB (mongodb://127.0.0.1:27017/zevro)...');
      connectUri = 'mongodb://127.0.0.1:27017/zevro';
    }
    
    await mongoose.connect(connectUri);
    console.log('Connected to MongoDB.');

    await Product.deleteMany({});
    console.log('Cleared existing products.');

    const products = generateProducts();
    await Product.insertMany(products);
    console.log(`Successfully seeded ${products.length} products.`);

    process.exit(0);
  } catch (error) {
    console.error('Error seeding data:', error);
    process.exit(1);
  }
}

seed();
