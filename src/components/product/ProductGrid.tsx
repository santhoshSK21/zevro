'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { useFilterStore } from '../../store/filterStore';
import { motion, useReducedMotion } from 'framer-motion';

interface ProductGridProps {
  initialCategory?: string;
  eyebrow?: string;
  title?: string;
}

export default function ProductGrid({ initialCategory, eyebrow = 'Our Edit', title }: ProductGridProps) {
  const { category, minPrice, maxPrice, sizes, colors, sortBy, setFilter } = useFilterStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (initialCategory && !category) {
      setFilter('category', initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    setLoading(true);
    let url = '/api/products?';
    if (category) url += `category=${encodeURIComponent(category)}&`;
    if (sortBy) url += `sort=${encodeURIComponent(sortBy)}&`;

    fetch(url)
      .then(res => res.json())
      .then(data => {
        let filtered = Array.isArray(data) ? data : [];
        if (minPrice !== undefined) filtered = filtered.filter(p => p.price >= minPrice * 100);
        if (maxPrice !== undefined) filtered = filtered.filter(p => p.price <= maxPrice * 100);
        if (sizes && sizes.length > 0) {
          filtered = filtered.filter(p => p.variants?.[0]?.sizes?.some((s: any) => sizes.includes(s.size)));
        }
        if (colors && colors.length > 0) {
          filtered = filtered.filter(p => colors.includes(p.variants?.[0]?.colorName));
        }
        setProducts(filtered);
        setLoading(false);
      })
      .catch(() => {
        setProducts([]);
        setLoading(false);
      });
  }, [category, minPrice, maxPrice, sizes, colors, sortBy]);

  if (loading) {
    return (
      <div className="pgrid-skeleton">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="pgrid-skeleton-card" />
        ))}
        <style dangerouslySetInnerHTML={{__html: `
          .pgrid-skeleton {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: var(--grid-gap);
          }
          .pgrid-skeleton-card {
            aspect-ratio: 3/4;
            background: var(--color-surface);
            animation: shimmer 1.4s infinite;
            background: linear-gradient(90deg, var(--color-surface) 25%, #E8E5E0 50%, var(--color-surface) 75%);
            background-size: 200% 100%;
          }
          @media (max-width: 1024px) {
            .pgrid-skeleton { grid-template-columns: repeat(2, 1fr); }
          }
          @media (max-width: 480px) {
            .pgrid-skeleton { grid-template-columns: 1fr; }
          }
        `}} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="pgrid-empty">
        <p className="display-serif" style={{ fontSize: 'var(--text-lg)', color: 'var(--color-ink-muted)', marginBottom: 'var(--space-6)' }}>
          No products found matching your criteria.
        </p>
        <button onClick={() => useFilterStore.getState().clearAll()} className="btn-ghost">Clear Filters</button>
        <style dangerouslySetInnerHTML={{__html: `
          .pgrid-empty { text-align: center; padding: var(--space-24) 0; }
        `}} />
      </div>
    );
  }

  return (
    <div className="pgrid-wrapper">
      {/* Section header */}
      {(eyebrow || title) && (
        <div className="pgrid-header">
          {eyebrow && (
            <motion.p
              className="label-caps"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              {eyebrow}
            </motion.p>
          )}
          {title && (
            <motion.h2
              className="display-serif pgrid-title"
              initial={prefersReducedMotion ? false : { opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              {title}
            </motion.h2>
          )}
        </div>
      )}

      <div className="pgrid">
        {products.map((p, i) => (
          <ProductCard key={p.sku || p._id || i} product={p} index={i} />
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .pgrid-wrapper {
          padding: 0;
        }
        .pgrid-header {
          text-align: center;
          margin-bottom: var(--space-8);
          padding-top: var(--space-12);
        }
        .pgrid-title {
          font-size: var(--text-xl);
          color: var(--color-ink);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wider);
        }
        .pgrid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: var(--grid-gap, 1px);
          background-color: var(--color-stone);
        }
        .pgrid > * {
          background-color: var(--color-bg);
        }
        @media (max-width: 1200px) {
          .pgrid { grid-template-columns: repeat(3, 1fr); }
        }
        @media (max-width: 768px) {
          .pgrid { grid-template-columns: repeat(2, 1fr); }
        }
      `}} />
    </div>
  );
}
