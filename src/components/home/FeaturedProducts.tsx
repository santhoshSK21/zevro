'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '../product/ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // In real app: fetch /api/products?isNewArrival=true
    // Using dummy data to avoid fetch error without DB
    setProducts([
      { sku: '11', slug: 'p11', name: 'Emerald Velvet Gown', price: 699900, originalPrice: 899900, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500', category: 'indo-western', isNew: true },
      { sku: '12', slug: 'p12', name: 'Zari Border Saree', price: 459900, originalPrice: 550000, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500', category: 'ethnic-wear', isNew: true },
      { sku: '13', slug: 'p13', name: 'Linen Wide Trousers', price: 249900, originalPrice: 299900, image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500', category: 'western-wear', isNew: true },
      { sku: '14', slug: 'p14', name: 'Pearl Drop Earrings', price: 89900, originalPrice: 129900, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500', category: 'accessories', isNew: true },
    ]);
  }, []);

  if (products.length === 0) return null;

  return (
    <section className="section bg-primary">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '40px' }}>
          <div>
            <h2 className="section-title">NEW ARRIVALS</h2>
            <div className="gold-rule" />
          </div>
          <Link href="/new-in" style={{ fontSize: '11px', letterSpacing: '0.1em', fontWeight: 500, color: 'var(--espresso)', paddingBottom: '8px', borderBottom: '1px solid var(--espresso)' }}>
            VIEW ALL
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px' }}>
          {products.map((p) => (
             <ProductCard key={p.sku} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
