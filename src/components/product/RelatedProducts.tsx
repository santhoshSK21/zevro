'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

export default function RelatedProducts({ category }: { category?: string }) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // In real app: fetch /api/products?category=...&limit=4
    setProducts([
      { sku: 'r1', slug: 'r1', name: 'Complementary Piece 1', price: 199900, originalPrice: 249900, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500' },
      { sku: 'r2', slug: 'r2', name: 'Complementary Piece 2', price: 299900, originalPrice: 349900, image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500' },
      { sku: 'r3', slug: 'r3', name: 'Complementary Piece 3', price: 149900, originalPrice: 149900, image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=500' },
      { sku: 'r4', slug: 'r4', name: 'Complementary Piece 4', price: 399900, originalPrice: 499900, image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=500' },
    ]);
  }, [category]);

  if (products.length === 0) return null;

  return (
    <section className="section bg-primary">
      <div className="container">
        <h2 className="section-title" style={{ textAlign: 'center', marginBottom: '48px' }}>YOU MAY ALSO LIKE</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '32px' }}>
          {products.map((p) => (
             <ProductCard key={p.sku} product={p} />
          ))}
        </div>
      </div>
    </section>
  );
}
