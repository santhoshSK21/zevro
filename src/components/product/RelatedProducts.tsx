'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { Sparkles } from 'lucide-react';

export default function RelatedProducts({ category }: { category?: string }) {
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    let isMounted = true;
    const url = category ? `/api/products?category=${encodeURIComponent(category)}&limit=8` : '/api/products?limit=8';
    fetch(url)
      .then(res => res.json())
      .then(data => {
        if (!isMounted) return;
        const list = Array.isArray(data) ? data : (data?.products || []);
        if (list.length > 0) {
          setProducts(list.slice(0, 4));
        }
      })
      .catch(() => {});

    return () => {
      isMounted = false;
    };
  }, [category]);

  if (products.length === 0) return null;

  return (
    <section className="related-products-section">
      <div className="container">
        <div className="related-header">
          <div className="related-badge-row">
            <Sparkles size={12} className="related-sparkle" />
            <span className="related-badge">COMPLETE THE ENSEMBLE</span>
            <Sparkles size={12} className="related-sparkle" />
          </div>
          <h2 className="related-title">YOU MAY ALSO COVET</h2>
          <div className="related-gold-line" />
        </div>

        <div className="related-grid">
          {products.map((p, i) => (
            <ProductCard key={p.slug || p._id || i} product={p} index={i} />
          ))}
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .related-products-section {
          padding: clamp(40px, 6vw, 64px) 0;
          border-top: 1px solid var(--color-stone);
          background-color: var(--color-bg);
        }
        .related-header {
          text-align: center;
          margin-bottom: clamp(28px, 4vw, 40px);
        }
        .related-badge-row {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .related-sparkle {
          color: var(--color-accent);
        }
        .related-badge {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: var(--color-accent);
          font-weight: 600;
        }
        .related-title {
          font-family: var(--font-display);
          font-size: clamp(20px, 2.8vw, 28px);
          font-weight: 400;
          letter-spacing: -0.01em;
          color: var(--color-ink);
          margin: 0;
        }
        .related-gold-line {
          width: 40px;
          height: 1px;
          background: var(--color-accent);
          margin: 12px auto 0;
        }
        .related-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(16px, 2.5vw, 28px);
        }
        @media (max-width: 1024px) {
          .related-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
        @media (max-width: 640px) {
          .related-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
      `}} />
    </section>
  );
}
