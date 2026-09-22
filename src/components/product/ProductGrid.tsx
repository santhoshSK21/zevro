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

export default function ProductGrid({ initialCategory, eyebrow = 'Our Edit', title }: ProductGridProps) {
  const searchParams = useSearchParams();
  const queryCategory = searchParams ? searchParams.get('category') : null;
  const querySub = searchParams ? searchParams.get('sub') : null;

  const { config } = useConfigStore();
  const batchSize = config?.catalogBatchSize || 16;

  const { category, minPrice, maxPrice, sizes, colors, sortBy, setFilter } = useFilterStore();
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
  }, [initialCategory, queryCategory]);

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
    if (maxPrice !== undefined && maxPrice < 50000) params.set('maxPrice', maxPrice.toString());
    if (sizes && sizes.length > 0) params.set('sizes', sizes.join(','));
    if (colors && colors.length > 0) params.set('colors', colors.join(','));
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
  }, [category, querySub, minPrice, maxPrice, sizes, colors, sortBy, batchSize]);

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
    if (maxPrice !== undefined && maxPrice < 50000) params.set('maxPrice', maxPrice.toString());
    if (sizes && sizes.length > 0) params.set('sizes', sizes.join(','));
    if (colors && colors.length > 0) params.set('colors', colors.join(','));
    params.set('page', nextPage.toString());
    params.set('limit', batchSize.toString());

    fetch(`/api/products?${params.toString()}`)
      .then(res => res.json())
      .then(data => {
        const nextItems = Array.isArray(data) ? data : (data.products || []);
        const more = typeof data.hasMore === 'boolean' ? data.hasMore : (products.length + nextItems.length < (data.total || 0));

        setProducts(prev => {
          // Avoid duplicate IDs
          const existingIds = new Set(prev.map(p => p._id?.toString() || p.slug));
          const uniqueNew = nextItems.filter((p: any) => !existingIds.has(p._id?.toString() || p.slug));
          return [...prev, ...uniqueNew];
        });
        setPage(nextPage);
        setHasMore(more);
        setLoadingMore(false);
      })
      .catch(() => {
        setLoadingMore(false);
      });
  }, [page, hasMore, loadingMore, initialLoading, category, querySub, sortBy, minPrice, maxPrice, sizes, colors, products.length]);

  // IntersectionObserver for automated infinite scroll trigger
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
        {Array(8).fill(0).map((_, i) => (
          <div key={i} className="pgrid-skeleton-card" />
        ))}
        <style dangerouslySetInnerHTML={{__html: `
          .pgrid-skeleton {
            display: grid;
            grid-template-columns: repeat(auto-fill, minmax(270px, 320px));
            gap: 28px;
            width: 100%;
          }
          .pgrid-skeleton-card {
            aspect-ratio: 3/4;
            background: var(--color-surface, #F5F1E8);
            border-radius: 4px;
            animation: shimmer 1.4s infinite;
            background: linear-gradient(90deg, #F5F1E8 25%, #EBE5DA 50%, #F5F1E8 75%);
            background-size: 200% 100%;
          }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }
          @media (max-width: 768px) {
            .pgrid-skeleton { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          }
          @media (max-width: 480px) {
            .pgrid-skeleton { grid-template-columns: 1fr; gap: 16px; }
          }
        `}} />
      </div>
    );
  }

  // Empty State
  if (products.length === 0) {
    return (
      <div className="pgrid-empty">
        <p className="display-serif" style={{ fontSize: 'var(--text-lg, 20px)', color: 'var(--color-ink-muted)', marginBottom: 'var(--space-6, 24px)' }}>
          No garments found matching your selected criteria.
        </p>
        <button 
          onClick={() => useFilterStore.getState().clearAll()} 
          className="btn-ghost"
          style={{ padding: '10px 24px', cursor: 'pointer', border: '1px solid var(--color-ink)', background: 'transparent', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase' }}
        >
          Clear Filters
        </button>
        <style dangerouslySetInnerHTML={{__html: `
          .pgrid-empty { text-align: center; padding: 60px 20px; }
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

      {/* Main Grid */}
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
              Showing <strong>{products.length}</strong> of <strong>{totalCount}</strong> couture garments
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
                <Loader2 size={16} className="spin-icon" />
                <span>REVEALING MORE PIECES...</span>
              </>
            ) : (
              <>
                <span>LOAD MORE GARMENTS</span>
                <ArrowDown size={14} />
              </>
            )}
          </button>
        ) : (
          totalCount > 16 && (
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
          margin-bottom: var(--space-8, 32px);
          padding-top: var(--space-12, 48px);
        }
        .pgrid-title {
          font-size: var(--text-xl, 24px);
          color: var(--color-ink, #0F172A);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wider, 0.08em);
        }
        .pgrid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(270px, 320px));
          gap: 28px;
          background-color: transparent;
          width: 100%;
        }
        .pgrid > * {
          background-color: transparent;
        }

        .pgrid-pagination-footer {
          margin-top: 56px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 18px;
          text-align: center;
        }

        .pgrid-progress-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
        }
        .pgrid-progress-text {
          font-family: var(--font-body, sans-serif);
          font-size: 13px;
          color: #64748B;
          margin: 0;
        }
        .pgrid-progress-bar-bg {
          width: 180px;
          height: 3px;
          background-color: #E2E8F0;
          border-radius: 2px;
          overflow: hidden;
        }
        .pgrid-progress-bar-fill {
          height: 100%;
          background-color: #0F172A;
          transition: width 0.3s ease;
        }

        .pgrid-load-more-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          padding: 14px 36px;
          background-color: #0F172A;
          color: #FAF8F5;
          border: 1px solid #C5A880;
          border-radius: 4px;
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: all 0.25s ease;
          box-shadow: 0 4px 16px rgba(15, 23, 42, 0.08);
        }
        .pgrid-load-more-btn:hover:not(:disabled) {
          background-color: #1E293B;
          border-color: #DFCAA5;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(15, 23, 42, 0.15);
        }
        .pgrid-load-more-btn:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        .pgrid-all-loaded-text {
          font-family: var(--font-display, serif);
          font-style: italic;
          font-size: 13px;
          color: #94A3B8;
          margin: 0;
          letter-spacing: 0.06em;
        }

        .spin-icon {
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        @media (max-width: 1200px) {
          .pgrid { grid-template-columns: repeat(auto-fill, minmax(240px, 300px)); gap: 20px; }
        }
        @media (max-width: 768px) {
          .pgrid { grid-template-columns: repeat(2, 1fr); gap: 16px; }
          .pgrid-load-more-btn { width: 100%; max-width: 320px; justify-content: center; }
        }
        @media (max-width: 480px) {
          .pgrid { grid-template-columns: 1fr; gap: 16px; }
        }
      `}} />
    </div>
  );
}
