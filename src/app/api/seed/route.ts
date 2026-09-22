import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/mongodb';
import { Product } from '../../../models/Product';
import { Category } from '../../../models/Category';
import { User } from '../../../models/User';
import { StoreConfig } from '../../../models/StoreConfig';

const luxuryProducts = [
  // Western Wear
  {
    name: 'Bespoke Mulberry Silk Trench',
    category: 'western-wear',
    subcategory: 'blazers-jackets',
    price: 1450000,
    op: 1850000,
    img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&auto=format&fit=crop&q=80',
    desc: 'An exquisite hand-tailored trench crafted from pure mulberry silk with horn buttons and satin lining.'
  },
  {
    name: 'Tailored Ivory Cashmere Blazer',
    category: 'western-wear',
    subcategory: 'blazers-jackets',
    price: 1250000,
    op: 1550000,
    img: 'https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=800&auto=format&fit=crop&q=80',
    desc: 'Double-breasted structured silhouette in ultra-soft ivory cashmere with brushed brass crest buttons.'
  },
  {
    name: 'Pleated Organza Maxi Shirtdress',
    category: 'western-wear',
    subcategory: 'dresses',
    price: 980000,
    op: 1200000,
    img: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800&auto=format&fit=crop&q=80',
    desc: 'Airy accordion-pleated silk organza dress featuring a mother-of-pearl button placket and cinched sash.'
  },
  {
    name: 'High-Waist Fluid Silk Trousers',
    category: 'western-wear',
    subcategory: 'pants-trousers',
    price: 740000,
    op: 920000,
    img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&auto=format&fit=crop&q=80',
    desc: 'Wide-leg tailored trousers cut from heavyweight crepe-de-chine silk for effortless movement.'
  },
  {
    name: 'Asymmetric Drape Poplin Shirt',
    category: 'western-wear',
    subcategory: 'tops-shirts',
    price: 590000,
    op: 750000,
    img: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?w=800&auto=format&fit=crop&q=80',
    desc: 'Architectural poplin shirt with relaxed drop shoulders and sculpted crossover cuffs.'
  },
  {
    name: 'Emerald Satin Slip Dress',
    category: 'western-wear',
    subcategory: 'dresses',
    price: 820000,
    op: 1050000,
    img: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=800&auto=format&fit=crop&q=80',
    desc: 'Bias-cut emerald green satin gown with cowl neckline and delicate adjustable crisscross back.'
  },

  // Ethnic Wear
  {
    name: 'Royal Banarasi Zari Silk Saree',
    category: 'ethnic-wear',
    subcategory: 'sarees-drapes',
    price: 2450000,
    op: 2950000,
    img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    desc: 'Handwoven in Varanasi with antique gold zari kadwa motifs and rich meenakari floral borders.'
  },
  {
    name: 'Chanderi Gold Thread Anarkali',
    category: 'ethnic-wear',
    subcategory: 'anarkali-suits',
    price: 1680000,
    op: 2100000,
    img: 'https://images.unsplash.com/photo-1583391733958-d69818b2c451?w=800&auto=format&fit=crop&q=80',
    desc: 'Flared floor-length anarkali in breathable Chanderi silk with gota patti hand embroidery.'
  },
  {
    name: 'Rose Gold Zardozi Bridal Lehenga',
    category: 'ethnic-wear',
    subcategory: 'lehengas-sets',
    price: 4800000,
    op: 5600000,
    img: 'https://images.unsplash.com/photo-1607083206869-4c7672e72a8a?w=800&auto=format&fit=crop&q=80',
    desc: 'Regal raw silk lehenga embellished with hand-carved sequins, dabka wires, and resham threadwork.'
  },
  {
    name: 'Mulmul Chikankari Kurta Set',
    category: 'ethnic-wear',
    subcategory: 'kurta-sets',
    price: 890000,
    op: 1150000,
    img: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
    desc: 'Artisanal Lucknowi chikankari handcrafted on ethereal soft mulmul cotton with matching palazzo.'
  },
  {
    name: 'Tussar Silk Brocade Dupatta',
    category: 'ethnic-wear',
    subcategory: 'festive-dupattas',
    price: 450000,
    op: 590000,
    img: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800&auto=format&fit=crop&q=80',
    desc: 'Heavy textured Tussar silk drape with intricate geometric geometric borders and hand-knotted tassels.'
  },

  // Indo-Western
  {
    name: 'Sculpted Cape Fusion Gown',
    category: 'indo-western',
    subcategory: 'cape-gowns',
    price: 1950000,
    op: 2400000,
    img: 'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=800&auto=format&fit=crop&q=80',
    desc: 'Pre-draped silhouette paired with a detachable hand-embroidered organza cape.'
  },
  {
    name: 'Draped Dhoti & Peplum Set',
    category: 'indo-western',
    subcategory: 'dhoti-sets',
    price: 1350000,
    op: 1700000,
    img: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?w=800&auto=format&fit=crop&q=80',
    desc: 'Modern cowl drape silk dhoti pants coordinated with a structured metallic-jacquard peplum jacket.'
  },
  {
    name: 'Brocade Blazer & Flared Trouser Co-ord',
    category: 'indo-western',
    subcategory: 'fusion-coords',
    price: 1550000,
    op: 1950000,
    img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&auto=format&fit=crop&q=80',
    desc: 'Tailored Western power-suit cut from Indian Banarasi brocade textile with notch lapel.'
  },
  {
    name: 'Mirrorwork Crop Top & Tiered Skirt',
    category: 'indo-western',
    subcategory: 'crop-top-skirt',
    price: 1180000,
    op: 1450000,
    img: 'https://images.unsplash.com/photo-1502716119720-b23a93e5fe1b?w=800&auto=format&fit=crop&q=80',
    desc: 'Contemporary cocktail ensemble combining mirror embellished bustier with high-slit tiered skirt.'
  },

  // Accessories
  {
    name: 'Heritage Jadau Kundan Choker',
    category: 'accessories',
    subcategory: 'jewelry',
    price: 1850000,
    op: 2250000,
    img: 'https://images.unsplash.com/photo-1599643478524-fb66f70362f6?w=800&auto=format&fit=crop&q=80',
    desc: '22k gold plated handcrafted choker set with uncut polki stones and freshwater pearl drops.'
  },
  {
    name: 'Zari Embroidered Velvet Potli',
    category: 'accessories',
    subcategory: 'clutches',
    price: 380000,
    op: 490000,
    img: 'https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=800&auto=format&fit=crop&q=80',
    desc: 'Plush midnight velvet potli bag with metallic bullion embroidery and pearl handle.'
  },
  {
    name: 'Bespoke Embellished Leather Juttis',
    category: 'accessories',
    subcategory: 'footwear',
    price: 420000,
    op: 550000,
    img: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80',
    desc: 'Genuine leather cushioned juttis hand-sequined by artisan shoemakers for royal comfort.'
  },
  {
    name: 'Antique Gold Waist Belt (Kamarbandh)',
    category: 'accessories',
    subcategory: 'belts',
    price: 520000,
    op: 680000,
    img: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&auto=format&fit=crop&q=80',
    desc: 'Filigree metal belt designed to accentuate sarees and fluid modern drapes.'
  }
];

export async function GET() {
  try {
    await dbConnect();
    
    // 1. Create Categories
    const categories = [
      { name: 'Western Wear', slug: 'western-wear', description: 'Contemporary luxury western outfits' },
      { name: 'Ethnic Wear', slug: 'ethnic-wear', description: 'Timeless traditional ethnic designs' },
      { name: 'Indo-Western', slug: 'indo-western', description: 'Modern fusion silhouettes' },
      { name: 'Accessories', slug: 'accessories', description: 'Curated artisanal jewelry and add-ons' }
    ];
    for (const cat of categories) {
      await Category.findOneAndUpdate({ slug: cat.slug }, cat, { upsert: true });
    }

    // 2. Create Products
    await Product.deleteMany({});
    
    const productsToInsert = luxuryProducts.map((item, i) => ({
      name: item.name,
      slug: item.name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      description: item.desc,
      shortDescription: item.desc.slice(0, 80) + '...',
      category: item.category,
      subcategory: item.subcategory,
      price: item.price,
      originalPrice: item.op,
      image: item.img,
      images: [item.img, 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80'],
      isActive: true,
      status: 'ACTIVE',
      isFeatured: i % 2 === 0,
      isNewArrival: i % 3 === 0,
      isBestseller: i % 4 === 0,
      variants: [
        {
          colorName: 'Primary Tone',
          colorHex: '#1C1C1A',
          images: [item.img, 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80'],
          sizes: [
            { size: 'XS', stock: 12, sku: `ZEV-${item.category.slice(0,2).toUpperCase()}-XS-${i+1}` },
            { size: 'S', stock: 18, sku: `ZEV-${item.category.slice(0,2).toUpperCase()}-S-${i+1}` },
            { size: 'M', stock: 25, sku: `ZEV-${item.category.slice(0,2).toUpperCase()}-M-${i+1}` },
            { size: 'L', stock: 14, sku: `ZEV-${item.category.slice(0,2).toUpperCase()}-L-${i+1}` },
            { size: 'XL', stock: 8, sku: `ZEV-${item.category.slice(0,2).toUpperCase()}-XL-${i+1}` }
          ]
        }
      ]
    }));

    await Product.insertMany(productsToInsert);


    // 3. Create Default Admin User if not existing
    const adminEmail = 'admin@zevro.in';
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const hashedPassword = await bcrypt.hash('adminpassword', 10);
      await User.create({
        name: 'Zevro Admin',
        email: adminEmail,
        passwordHash: hashedPassword,
        role: 'admin',
        isActive: true,
        emailVerified: true
      });
    }

    // 4. Create Initial Store Config if not existing
    const existingConfig = await StoreConfig.findOne();
    if (!existingConfig) {
      await StoreConfig.create({
        storeName: 'Zevro POC',
        storeEmail: 'support@zevro.in',
        currency: 'INR',
        currencySymbol: '₹',
        demoMode: true,
        freeShippingThreshold: 500000,
        shippingFee: 9900
      });
    }

    return NextResponse.json({
      success: true,
      message: 'Database seeded successfully with Categories, 24 Products, Admin User, and Store Configuration!',
      adminCredentials: {
        email: 'admin@zevro.in',
        password: 'adminpassword'
      }
    });
  } catch (error: any) {
    console.error('Database seed error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
