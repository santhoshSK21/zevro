'use client';

import React, { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import ProductCard from '../product/ProductCard';

export interface FeaturedProductsProps {
  title?: string;
  subtitle?: string;
  limit?: number;
  category?: string;
}

// Curated Fallback Fashion Catalog (Guaranteed never to show blank white space)
const CURATED_EDITORIAL_PIECES = [
  {
    _id: 'curated-1',
    sku: 'ZEV-WS-001',
    name: 'Architectural Silk Trench Coat',
    slug: 'architectural-silk-trench-coat',
    category: 'western-wear',
    price: 1890000, // ₹18,900
    originalPrice: 2450000,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80',
    ],
    isNewArrival: true,
    isFeatured: true,
  },
  {
    _id: 'curated-2',
    sku: 'ZEV-ET-002',
    name: 'Chanderi Zari Embroidered Anarkali',
    slug: 'chanderi-zari-embroidered-anarkali',
    category: 'ethnic-wear',
    price: 2650000, // ₹26,500
    originalPrice: 3200000,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
      'https://images.unsplash.com/photo-1583391733958-d69818b2c451?w=800&q=80',
    ],
    isNewArrival: true,
    isFeatured: true,
  },
  {
    _id: 'curated-3',
    sku: 'ZEV-IW-003',
    name: 'Draped Asymmetric Fusion Cape Set',
    slug: 'draped-asymmetric-fusion-cape-set',
    category: 'indo-western',
    price: 1580000, // ₹15,800
    originalPrice: 1980000,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0c739ba73a16?w=800&q=80',
      'https://images.unsplash.com/photo-1621084288075-80252119eb49?w=800&q=80',
    ],
    isNewArrival: true,
    isFeatured: true,
  },
  {
    _id: 'curated-4',
    sku: 'ZEV-AC-004',
    name: 'Handcrafted Kundan Choker & Pearl Drops',
    slug: 'handcrafted-kundan-choker-pearl-drops',
    category: 'accessories',
    price: 890000, // ₹8,900
    originalPrice: 1150000,
    images: [
      'https://images.unsplash.com/photo-1599643478524-fb66f70362f6?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    ],
    isNewArrival: true,
    isFeatured: true,
  },
  {
    _id: 'curated-5',
    sku: 'ZEV-WS-005',
    name: 'Structured Charcoal Velvet Blazer',
    slug: 'structured-charcoal-velvet-blazer',
    category: 'western-wear',
    price: 1420000, // ₹14,200
    originalPrice: 1750000,
    images: [
      'https://images.unsplash.com/photo-1485230895905-ef4a5009a632?w=800&q=80',
      'https://images.unsplash.com/photo-1495385794356-15371f348c31?w=800&q=80',
    ],
    isNewArrival: true,
  },
  {
    _id: 'curated-6',
    sku: 'ZEV-ET-006',
    name: 'Artisanal Banarasi Silk Royal Saree',
    slug: 'artisanal-banarasi-silk-royal-saree',
    category: 'ethnic-wear',
    price: 3450000, // ₹34,500
    originalPrice: 4200000,
    images: [
      'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=800&q=80',
      'https://images.unsplash.com/photo-1617261314958-3759a224f8d5?w=800&q=80',
    ],
    isNewArrival: true,
  },
  {
    _id: 'curated-7',
    sku: 'ZEV-IW-007',
    name: 'Sculpted Monolith Corset & Drape Skirt',
    slug: 'sculpted-monolith-corset-drape-skirt',
    category: 'indo-western',
    price: 2190000, // ₹21,900
    originalPrice: 2600000,
    images: [
      'https://images.unsplash.com/photo-1624838612952-473d09a8eb6e?w=800&q=80',
      'https://images.unsplash.com/photo-1623864448259-c29013f9fec5?w=800&q=80',
    ],
    isNewArrival: true,
  },
  {
    _id: 'curated-8',
    sku: 'ZEV-AC-008',
    name: 'Bespoke Hand-Tooled Leather Belt Bag',
    slug: 'bespoke-hand-tooled-leather-belt-bag',
    category: 'accessories',
    price: 680000, // ₹6,800
    originalPrice: 850000,
    images: [
      'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?w=800&q=80',
      'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&q=80',
    ],
    isNewArrival: true,
  },
];

const CATEGORY_TABS = [
  { id: 'all', label: 'ALL PIECES' },
  { id: 'western-wear', label: 'WESTERN' },
  { id: 'ethnic-wear', label: 'ETHNIC' },
  { id: 'indo-western', label: 'INDO-WESTERN' },
  { id: 'accessories', label: 'ACCESSORIES' },
];

export default function FeaturedProducts({
  title = 'NEW ATELIER ARRIVALS',
  subtitle = 'Limited editions crafted for modern silhouettes and quiet luxury.',
  limit = 8,
  category = 'all',
}: FeaturedProductsProps = {}) {
  const [activeTab, setActiveTab] = useState(category || 'all');
  const [fetchedProducts, setFetchedProducts] = useState<any[]>([]);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    let isMounted = true;
    fetch('/api/products')
      .then((res) => res.json())
      .then((data) => {
        if (!isMounted) return;
        const list: any[] = Array.isArray(data) ? data : data?.products || [];
        if (list.length > 0) {
          setFetchedProducts(list);
        }
      })
      .catch(() => {
        // Fallback is maintained
      });
    return () => {
      isMounted = false;
    };
  }, []);

  // Compute final product list: merge API products with curated high-fashion fallback
  const allProducts = useMemo(() => {
    if (fetchedProducts.length > 0) {
      return fetchedProducts;
    }
    return CURATED_EDITORIAL_PIECES;
  }, [fetchedProducts]);

  // Filter by active category tab
  const displayedProducts = useMemo(() => {
    let filtered = allProducts;
    if (activeTab && activeTab !== 'all') {
      filtered = filtered.filter(
        (p) => p.category?.toLowerCase() === activeTab.toLowerCase()
      );
    }
    return filtered.slice(0, limit);
  }, [allProducts, activeTab, limit]);

  return (
    <section className="section bg-primary arrivals-section">
      <div className="container">
        {/* Editorial Section Header */}
        <div className="arrivals-header">
          <div className="arrivals-title-col">
            <div className="arrivals-tag-row">
              <span className="arrivals-star">✦</span>
              <span className="arrivals-eyebrow">CURATED EDITORIAL</span>
              <span className="arrivals-star">✦</span>
            </div>
            <h2 className="section-title">
              {title} <span className="serif-italic">Edit</span>
            </h2>
            <p className="section-subtitle">{subtitle}</p>
          </div>

          <Link
            href={activeTab !== 'all' ? `/category/${activeTab}` : '/products'}
            className="link-underline arrivals-view-all"
          >
            VIEW FULL COLLECTION →
          </Link>
        </div>

        {/* Category Pill Filter Tabs with Motion */}
        <div className="arrivals-tabs-row" role="tablist">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                role="tab"
                aria-selected={isActive}
                onClick={() => setActiveTab(tab.id)}
                className={`arrivals-tab-pill ${isActive ? 'is-active' : ''}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTabBadge"
                    className="arrivals-tab-bg"
                    transition={{ type: 'spring', bounce: 0.18, duration: 0.5 }}
                  />
                )}
                <span className="arrivals-tab-label">{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 4-Column High-Fashion Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            className="arrivals-grid"
            initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          >
            {displayedProducts.map((p, index) => (
              <ProductCard key={p.slug || p._id || index} product={p} index={index} />
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Bottom Editorial Quote Callout to prevent dead white space */}
        <div className="arrivals-bottom-strip">
          <span className="strip-dash">—</span>
          <span className="strip-text">
            Every ZEVRO creation is handcrafted in limited batches to preserve bespoke artisanal integrity
          </span>
          <span className="strip-dash">—</span>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .arrivals-section {
          position: relative;
          border-top: 1px solid var(--color-stone-light);
        }
        .arrivals-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: clamp(24px, 3.5vw, 36px);
          gap: 24px;
        }
        .arrivals-title-col {
          display: flex;
          flex-direction: column;
        }
        .arrivals-tag-row {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 6px;
        }
        .arrivals-star {
          color: var(--color-accent);
          font-size: 11px;
        }
        .arrivals-eyebrow {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.24em;
          text-transform: uppercase;
          color: var(--color-accent);
          font-weight: 600;
        }
        .arrivals-view-all {
          font-size: 11px;
          letter-spacing: 0.2em;
          white-space: nowrap;
        }
        .arrivals-tabs-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: clamp(28px, 4vw, 40px);
          overflow-x: auto;
          padding-bottom: 6px;
          scrollbar-width: none;
        }
        .arrivals-tabs-row::-webkit-scrollbar {
          display: none;
        }
        .arrivals-tab-pill {
          position: relative;
          padding: 8px 18px;
          border-radius: 24px;
          border: 1px solid var(--color-stone);
          background: transparent;
          cursor: pointer;
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.16em;
          font-weight: 600;
          color: var(--color-ink-muted);
          transition: color 0.3s ease, border-color 0.3s ease;
          white-space: nowrap;
        }
        .arrivals-tab-pill:hover {
          color: var(--color-ink);
          border-color: var(--color-accent);
        }
        .arrivals-tab-pill.is-active {
          color: #FAF7F2;
          border-color: var(--color-ink);
        }
        .arrivals-tab-bg {
          position: absolute;
          inset: 0;
          background: var(--color-ink);
          border-radius: 24px;
          z-index: 1;
        }
        .arrivals-tab-label {
          position: relative;
          z-index: 2;
        }
        .arrivals-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(14px, 2vw, 22px);
        }
        .arrivals-bottom-strip {
          margin-top: clamp(24px, 3vw, 36px);
          padding-top: 18px;
          border-top: 1px dashed var(--color-stone);
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
        }
        .strip-dash {
          color: var(--color-accent);
        }
        .strip-text {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 13.5px;
          letter-spacing: 0.02em;
          color: var(--color-ink-muted);
        }
        @media (max-width: 1200px) and (min-width: 769px) {
          .arrivals-grid {
            grid-template-columns: repeat(3, 1fr);
            gap: 16px;
          }
        }
        @media (max-width: 768px) {
          .arrivals-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
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
          .strip-text {
            font-size: 12px;
          }
        }
      `}} />
    </section>
  );
}
