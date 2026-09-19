import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '../../../lib/mongodb';
import { Product } from '../../../models/Product';
import { Category } from '../../../models/Category';
import { User } from '../../../models/User';
import { StoreConfig } from '../../../models/StoreConfig';

const baseProducts = [
  { name: 'LUXURY SILK ENSEMBLE', category: 'ethnic-wear', subcategory: 'sarees', price: 499900, op: 650000, img: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80' },
  { name: 'CRISP WHITE SHIRT', category: 'western-wear', subcategory: 'tops', price: 299900, op: 350000, img: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=800&q=80' },
  { name: 'PRINTED MAXI DRESS', category: 'western-wear', subcategory: 'dresses', price: 549900, op: 750000, img: 'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800&q=80' },
  { name: 'GEORGETTE ANARKALI', category: 'ethnic-wear', subcategory: 'kurtis', price: 899900, op: 1150000, img: 'https://images.unsplash.com/photo-1583391733958-d69818b2c451?w=800&q=80' },
  { name: 'INDO-WESTERN DRAPE', category: 'indo-western', subcategory: 'dresses', price: 799900, op: 999900, img: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80' },
  { name: 'KUNDAN NECKLACE', category: 'accessories', subcategory: 'jewelry', price: 149900, op: 200000, img: 'https://images.unsplash.com/photo-1599643478524-fb66f70362f6?w=800&q=80' }
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
    
    const productsToInsert = [];
    for (let i = 0; i < 24; i++) {
      const base = baseProducts[i % baseProducts.length];
      productsToInsert.push({
        name: `${base.name} - ${i + 1}`,
        slug: `${base.category}-${base.subcategory}-${i + 1}`,
        description: 'A beautiful luxury piece crafted for elegance. Premium quality fabric ensuring a comfortable fit. Perfect for high-fashion editorial events.',
        shortDescription: 'Premium fashion wear.',
        category: base.category,
        subcategory: base.subcategory,
        price: base.price,
        originalPrice: base.op,
        isActive: true,
        status: 'ACTIVE',
        isFeatured: i < 6, // first 6 featured
        isNewArrival: i % 3 === 0, // every 3rd new arrival
        variants: [
          {
            colorName: 'Standard',
            colorHex: '#000000',
            images: [base.img, 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800&q=80'],
            sizes: [
              { size: 'XS', stock: Math.floor(Math.random() * 10) + 5 },
              { size: 'S', stock: Math.floor(Math.random() * 15) + 5 },
              { size: 'M', stock: Math.floor(Math.random() * 10) + 5 },
              { size: 'L', stock: Math.floor(Math.random() * 5) + 5 }
            ]
          }
        ]
      });
    }

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
