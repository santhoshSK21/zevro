'use client';

import React, { useEffect, useState, useRef, useCallback } from 'react';
import ProductCard from './ProductCard';
import { useFilterStore } from '../../store/filterStore';
import { motion, useReducedMotion } from 'framer-motion';
import { useSearchParams } from 'next/navigation';
import { Loader2, ArrowDown } from 'lucide-react';
import { useConfigStore } from '../../store/configStore';

interface ProductGridProps {
  initialCategory?: string;
  eyebrow?: string;
  title?: string;
}

// Curated Editorial Fallback Pieces (to avoid any dead empty void)
const CURATED_RECOMMENDATIONS = [
  {
    _id: 'rec-1',
    sku: 'ZEV-REC-01',
    name: 'Architectural Silk Trench Coat',
    slug: 'architectural-silk-trench-coat',
    category: 'western-wear',
    price: 1890000,
    originalPrice: 2450000,
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800&q=80',
      'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800&q=80',
    ],
    isFeatured: true,
  },
  {
    _id: 'rec-2',
    sku: 'ZEV-REC-02',
    name: 'Chanderi Zari Embroidered Anarkali',
    slug: 'chanderi-zari-embroidered-anarkali',
    category: 'ethnic-wear',
    price: 2650000,
    originalPrice: 3200000,
    images: [
      'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&q=80',
      'https://images.unsplash.com/photo-1583391733958-d69818b2c451?w=800&q=80',
    ],
    isFeatured: true,
  },
  {
    _id: 'rec-3',
    sku: 'ZEV-REC-03',
    name: 'Draped Asymmetric Fusion Cape Set',
    slug: 'draped-asymmetric-fusion-cape-set',
    category: 'indo-western',
    price: 1580000,
    originalPrice: 1980000,
    images: [
      'https://images.unsplash.com/photo-1509631179647-0c739ba73a16?w=800&q=80',
      'https://images.unsplash.com/photo-1621084288075-80252119eb49?w=800&q=80',
    ],
    isFeatured: true,
  },
  {
    _id: 'rec-4',
    sku: 'ZEV-REC-04',
    name: 'Heritage Kundan & Pearl Drops',
    slug: 'handcrafted-kundan-choker-pearl-drops',
    category: 'accessories',
    price: 890000,
    originalPrice: 1150000,
    images: [
      'https://images.unsplash.com/photo-1599643478524-fb66f70362f6?w=800&q=80',
      'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',
    ],
    isFeatured: true,
  },
];

export default function ProductGrid({ initialCategory, eyebrow, title }: ProductGridProps) {
  const searchParams = useSearchParams();
  const queryCategory = searchParams ? searchParams.get('category') : null;
  const querySub = searchParams ? searchParams.get('sub') : null;

  const { config } = useConfigStore();
  const batchSize = config?.catalogBatchSize || 16;

  const { category, minPrice, maxPrice, sizes, colors, fabric, occasion, sortBy, setFilter, clearFiltersOnly } = useFilterStore();
  const [products, setProducts] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const [initialLoading, setInitialLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  const observerTarget = useRef<HTMLDivElement>(null);

  // Sync category from route/URL
  useEffect(() => {
    if (initialCategory !== undefined) {
      setFilter('category', initialCategory);
    } else if (queryCategory) {
      setFilter('category', queryCategory);
    }
  }, [initialCategory, queryCategory, setFilter]);

  // Primary fetch when filters or sort change (resets to page 1)
  useEffect(() => {
    let isCancelled = false;
    setInitialLoading(true);
    setPage(1);

    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (querySub) params.set('sub', querySub);
    if (sortBy) params.set('sort', sortBy);
    if (minPrice !== undefined && minPrice > 0) params.set('minPrice', minPrice.toString());
    if (maxPrice !== undefined && maxPrice > 0 && maxPrice < 50000) params.set('maxPrice', maxPrice.toString());
    if (sizes && sizes.length > 0) params.set('sizes', sizes.join(','));
    if (colors && colors.length > 0) params.set('colors', colors.join(','));
    if (fabric && fabric.length > 0) params.set('fabrics', fabric.join(','));
    if (occasion && occasion.length > 0) params.set('occasions', occasion.join(','));
    params.set('page', '1');
    params.set('limit', batchSize.toString());

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        if (isCancelled) return;
        const items = Array.isArray(data) ? data : (data.products || []);
        const total = typeof data.total === 'number' ? data.total : items.length;
        const more = typeof data.hasMore === 'boolean' ? data.hasMore : items.length < total;

        setProducts(items);
        setTotalCount(total);
        setHasMore(more);
        setInitialLoading(false);
      })
      .catch(() => {
        if (isCancelled) return;
        setProducts([]);
        setTotalCount(0);
        setHasMore(false);
        setInitialLoading(false);
      });

    return () => {
      isCancelled = true;
    };
  }, [category, querySub, minPrice, maxPrice, sizes, colors, fabric, occasion, sortBy, batchSize]);

  // Load More function for Infinite Scroll
  const loadMore = useCallback(() => {
    if (loadingMore || !hasMore || initialLoading) return;

    setLoadingMore(true);
    const nextPage = page + 1;

    const params = new URLSearchParams();
    if (category && category !== 'all') params.set('category', category);
    if (querySub) params.set('sub', querySub);
    if (sortBy) params.set('sort', sortBy);
    if (minPrice !== undefined && minPrice > 0) params.set('minPrice', minPrice.toString());
    if (maxPrice !== undefined && maxPrice > 0 && maxPrice < 50000) params.set('maxPrice', maxPrice.toString());
    if (sizes && sizes.length > 0) params.set('sizes', sizes.join(','));
    if (colors && colors.length > 0) params.set('colors', colors.join(','));
    if (fabric && fabric.length > 0) params.set('fabrics', fabric.join(','));
    if (occasion && occasion.length > 0) params.set('occasions', occasion.join(','));
    params.set('page', nextPage.toString());
    params.set('limit', batchSize.toString());

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        const nextItems = Array.isArray(data) ? data : (data.products || []);
        const total = typeof data.total === 'number' ? data.total : totalCount;
        const newProducts = [...products, ...nextItems];
        
        setProducts(newProducts);
        setPage(nextPage);
        setTotalCount(total);
        setHasMore(typeof data.hasMore === 'boolean' ? data.hasMore : newProducts.length < total);
        setLoadingMore(false);
      })
      .catch(() => {
        setLoadingMore(false);
      });
  }, [category, querySub, sortBy, minPrice, maxPrice, sizes, colors, fabric, occasion, page, batchSize, hasMore, loadingMore, initialLoading, products, totalCount]);

  // Infinite Scroll Intersection Observer
  useEffect(() => {
    const target = observerTarget.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && hasMore && !loadingMore && !initialLoading) {
          loadMore();
        }
      },
      { rootMargin: '300px' }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMore, hasMore, loadingMore, initialLoading]);

  // Initial Loading Shimmer Skeleton
  if (initialLoading) {
    return (
      <div className="pgrid-skeleton">
        {Array(6).fill(0).map((_, i) => (
          <div key={i} className="pgrid-skeleton-card" />
        ))}
        <style dangerouslySetInnerHTML={{__html: `
          .pgrid-skeleton {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: clamp(16px, 2.5vw, 28px);
            width: 100%;
          }
          .pgrid-skeleton-card {
            aspect-ratio: 3/4;
            background: linear-gradient(90deg, #F3ECE1 25%, #E8E0D2 50%, #F3ECE1 75%);
            background-size: 200% 100%;
            border-radius: 3px;
            animation: pgridShimmer 1.4s infinite;
          }
          @keyframes pgridShimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @media (max-width: 1100px) {
            .pgrid-skeleton { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          }
          @media (max-width: 600px) {
            .pgrid-skeleton { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          }
        `}} />
      </div>
    );
  }

  // Refined Empty State (No Dead White Space)
  if (products.length === 0) {
    return (
      <div className="pgrid-empty-wrap">
        <div className="pgrid-empty-box">
          <span className="empty-star">✦</span>
          <h3 className="empty-title">NO GARMENTS MATCH THIS EXACT CRITERIA</h3>
          <p className="empty-desc">
            We curate limited artisanal batches. Clear active filters or discover our signature recommendations below.
          </p>
          <button 
            onClick={clearFiltersOnly} 
            className="empty-clear-btn"
          >
            RESET FILTERS
          </button>
        </div>

        {/* Curated Recommendations to fill the view beautifully */}
        <div className="empty-recommendations">
          <div className="rec-header">
            <span className="rec-tag">RECOMMENDED EDIT</span>
            <h4 className="rec-title">THE ATELIER SIGNATURE SELECTION</h4>
            <div className="rec-line" />
          </div>

          <div className="pgrid">
            {CURATED_RECOMMENDATIONS.map((p, i) => (
              <ProductCard key={p.sku || i} product={p} index={i} />
            ))}
          </div>
        </div>

        <style dangerouslySetInnerHTML={{__html: `
          .pgrid-empty-wrap {
            width: 100%;
            padding: 24px 0;
          }
          .pgrid-empty-box {
            text-align: center;
            padding: clamp(32px, 5vw, 48px) 24px;
            background: var(--color-surface);
            border: 1px solid var(--color-stone);
            border-radius: 4px;
            margin-bottom: 48px;
          }
          .empty-star {
            color: var(--color-accent);
            font-size: 16px;
            display: block;
            margin-bottom: 12px;
          }
          .empty-title {
            font-family: var(--font-display);
            font-size: clamp(18px, 2.4vw, 24px);
            color: var(--color-ink);
            font-weight: 400;
            margin: 0 0 10px 0;
            letter-spacing: 0.02em;
          }
          .empty-desc {
            font-family: var(--font-body);
            font-size: 13px;
            color: var(--color-ink-muted);
            max-width: 480px;
            margin: 0 auto 20px;
            line-height: 1.6;
          }
          .empty-clear-btn {
            display: inline-flex;
            align-items: center;
            background: #141412;
            color: #FAF7F2;
            border: none;
            padding: 11px 24px;
            border-radius: 20px;
            font-family: var(--font-ui);
            font-size: 11px;
            font-weight: 600;
            letter-spacing: 0.16em;
            cursor: pointer;
            transition: background 0.3s ease;
          }
          .empty-clear-btn:hover {
            background: #C5A869;
            color: #141412;
          }
          .empty-recommendations {
            width: 100%;
          }
          .rec-header {
            text-align: center;
            margin-bottom: 28px;
          }
          .rec-tag {
            font-family: var(--font-ui);
            font-size: 10px;
            letter-spacing: 0.22em;
            text-transform: uppercase;
            color: var(--color-accent);
            font-weight: 600;
            display: block;
            margin-bottom: 6px;
          }
          .rec-title {
            font-family: var(--font-display);
            font-size: clamp(20px, 2.8vw, 28px);
            color: var(--color-ink);
            font-weight: 400;
            margin: 0;
          }
          .rec-line {
            width: 36px;
            height: 1px;
            background: var(--color-accent);
            margin: 10px auto 0;
          }
          .pgrid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: clamp(16px, 2.5vw, 28px);
            width: 100%;
          }
          @media (max-width: 1100px) {
            .pgrid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          }
          @media (max-width: 600px) {
            .pgrid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
          }
        `}} />
      </div>
    );
  }

  const progressPercent = totalCount > 0 ? Math.min(100, Math.round((products.length / totalCount) * 100)) : 100;

  return (
    <div className="pgrid-wrapper">
      {/* Optional Editorial Header */}
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

      {/* Main Responsive Grid (Fills full width evenly) */}
      <div className="pgrid">
        {products.map((p, i) => (
          <ProductCard key={p.sku || p._id || i} product={p} index={i} />
        ))}
      </div>

      {/* Sentinel trigger element for automatic infinite scroll */}
      <div ref={observerTarget} style={{ height: '20px', margin: '20px 0' }} />

      {/* Load More & Progress Indicator */}
      <div className="pgrid-pagination-footer">
        {totalCount > 0 && (
          <div className="pgrid-progress-wrap">
            <p className="pgrid-progress-text">
              Displaying <strong>{products.length}</strong> of <strong>{totalCount}</strong> atelier pieces
            </p>
            <div className="pgrid-progress-bar-bg">
              <div 
                className="pgrid-progress-bar-fill" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}

        {hasMore ? (
          <button
            type="button"
            onClick={loadMore}
            disabled={loadingMore}
            className="pgrid-load-more-btn"
          >
            {loadingMore ? (
              <>
                <Loader2 size={15} className="spin-icon" />
                <span>REVEALING FURTHER PIECES...</span>
              </>
            ) : (
              <>
                <span>DISCOVER MORE CREATIONS</span>
                <ArrowDown size={13} />
              </>
            )}
          </button>
        ) : (
          totalCount > 8 && (
            <p className="pgrid-all-loaded-text">
              — You have viewed the entire collection —
            </p>
          )
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .pgrid-wrapper {
          padding: 0;
          width: 100%;
        }
        .pgrid-header {
          text-align: center;
          margin-bottom: 24px;
        }
        .pgrid-title {
          font-size: clamp(20px, 3vw, 28px);
          color: var(--color-ink);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          margin-top: 6px;
        }
        .pgrid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: clamp(16px, 2.5vw, 28px);
          width: 100%;
        }
        .pgrid > * {
          width: 100%;
        }
        .pgrid-pagination-footer {
          margin-top: clamp(36px, 5vw, 56px);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 16px;
          text-align: center;
        }
        .pgrid-progress-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
        }
        .pgrid-progress-text {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--color-ink-muted);
          margin: 0;
        }
        .pgrid-progress-bar-bg {
          width: 160px;
          height: 2px;
          background-color: var(--color-stone);
          overflow: hidden;
        }
        .pgrid-progress-bar-fill {
          height: 100%;
          background-color: var(--color-ink);
          transition: width 0.3s ease;
        }
        .pgrid-load-more-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 32px;
          background-color: #141412;
          color: #FAF7F2;
          border: 1px solid var(--color-accent);
          border-radius: 2px;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .pgrid-load-more-btn:hover:not(:disabled) {
          background-color: #C5A869;
          color: #141412;
          transform: translateY(-2px);
        }
        .pgrid-load-more-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }
        .pgrid-all-loaded-text {
          font-family: var(--font-display);
          font-style: italic;
          font-size: 13px;
          color: var(--color-ink-muted);
          margin: 0;
          letter-spacing: 0.04em;
        }
        .spin-icon {
          animation: spin 1s linear infinite;
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 1100px) {
          .pgrid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }
        @media (max-width: 600px) {
          .pgrid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .pgrid-load-more-btn {
            width: 100%;
            justify-content: center;
          }
        }
      `}} />
    </div>
  );
}
