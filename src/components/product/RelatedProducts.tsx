'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';

export default function RelatedProducts({ category }: { category?: string }) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    const url = category ? `/api/products?category=${category}` : '/api/products';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setProducts(data.slice(0, 4));
        }
      })
      .catch(console.error);
  }, [category]);

  if (products.length === 0) return null;

  return (
    <section style={{ padding: '64px 0', borderTop: '1px solid var(--color-stone)' }}>
      <div className="container">
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '22px', fontWeight: 400, letterSpacing: '0.1em', textTransform: 'uppercase', textAlign: 'center', marginBottom: '48px', color: 'var(--color-ink)' }}>
          YOU MAY ALSO LIKE
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '32px' }}>
          {products.map((p, i) => (
            <ProductCard key={p.slug || p._id} product={p} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

