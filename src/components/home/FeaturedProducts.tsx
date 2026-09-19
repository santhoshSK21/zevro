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
          <Link href="/products?category=new-in" style={{ fontSize: '11px', letterSpacing: '0.1em', fontWeight: 500, color: 'var(--color-ink)', paddingBottom: '8px', borderBottom: '1px solid var(--color-ink)' }}>
            VIEW ALL
          </Link>
        </div>

        <div className="product-grid-4">
          {products.map((p) => (
             <div key={p.slug || p._id} style={{ background: 'var(--color-bg)' }}>
               <ProductCard product={p} />
             </div>
          ))}
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .product-grid-4 {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--grid-gap, 1px);
          background: var(--color-stone);
          border-top: 1px solid var(--color-stone);
          border-bottom: 1px solid var(--color-stone);
        }
        @media (max-width: 1024px) {
          .product-grid-4 {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .product-grid-4 {
            grid-template-columns: 1fr;
          }
        }
      `}} />
    </section>
  );
}
