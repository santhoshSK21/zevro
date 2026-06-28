'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import ProductCard from '../product/ProductCard';

export default function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data.filter(p => p.isNewArrival).slice(0, 4));
        }
      })
      .catch(console.error);
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
