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
    <section className="section bg-primary" style={{ borderTop: '1px solid var(--color-stone-light)' }}>
      <div className="container">
        
        {/* Editorial Section Header */}
        <div className="arrivals-header">
          <div>
            <span className="label-caps" style={{ color: 'var(--color-accent)', marginBottom: '6px', display: 'block' }}>
              CURATED SELECTION
            </span>
            <h2 className="section-title">NEW ARRIVALS</h2>
            <p className="section-subtitle">The latest pieces, carefully selected for the season.</p>
          </div>
          
          <Link href="/products?category=new-in" className="link-underline">
            VIEW ALL PIECES →
          </Link>
        </div>

        {/* Spacious 4-Column Product Grid */}
        <div className="arrivals-grid">
          {products.map((p, index) => (
            <ProductCard key={p.slug || p._id} product={p} index={index} />
          ))}
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .arrivals-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: var(--space-12);
          gap: 24px;
        }
        .arrivals-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 28px;
        }
        @media (max-width: 1024px) {
          .arrivals-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 20px;
          }
        }
        @media (max-width: 640px) {
          .arrivals-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 16px;
          }
          .arrivals-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 14px;
          }
        }
      `}} />
    </section>
  );
}
