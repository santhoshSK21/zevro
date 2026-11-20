'use client';

import React, { Suspense, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import ProductCard from '../../components/product/ProductCard';
import SortDropdown from '../../components/product/SortDropdown';
import { Search as SearchIcon, X, SlidersHorizontal, Sparkles, ArrowRight } from 'lucide-react';
import { useFilterStore } from '../../store/filterStore';

const POPULAR_SEARCH_TAGS = [
  'Silk Sarees',
  'Tuxedo',
  'Anarkali',
  'Gown',
  'Cape Set',
  'Choker',
  'Velvet',
  'Banarasi'
];

function SearchResults() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQuery = searchParams ? searchParams.get('q') || '' : '';
  
  const [queryInput, setQueryInput] = useState(initialQuery);
  const [results, setResults] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const { sortBy } = useFilterStore();

  useEffect(() => {
    setQueryInput(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    let isCancelled = false;
    if (initialQuery.trim()) {
      setLoading(true);
      const params = new URLSearchParams();
      params.set('q', initialQuery.trim());
      if (sortBy) params.set('sort', sortBy);

      fetch(`/api/products?${params.toString()}`)
        .then(res => res.json())
        .then(data => {
          if (isCancelled) return;
          const items = Array.isArray(data) ? data : (data.products || []);
          const total = typeof data.total === 'number' ? data.total : items.length;
          setResults(items);
          setTotalCount(total);
          setLoading(false);
        })
        .catch(() => {
          if (isCancelled) return;
          setResults([]);
          setTotalCount(0);
          setLoading(false);
        });
    } else {
      setResults([]);
      setTotalCount(0);
      setLoading(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [initialQuery, sortBy]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (queryInput.trim()) {
      router.push(`/search?q=${encodeURIComponent(queryInput.trim())}`);
    }
  };

  return (
    <main className="search-page-main">
      {/* Search Header Banner */}
      <section className="search-header-hero">
        <div className="container">
          <div className="search-hero-content">
            <h1 className="search-headline">
              {initialQuery ? (
                <>Search: <span className="query-highlight">"{initialQuery}"</span></>
              ) : (
                <>Search Collections</>
              )}
            </h1>

            {/* Refined Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="search-bar-form">
              <div className="search-input-wrapper">
                <SearchIcon size={17} className="search-bar-icon" />
                <input
                  type="text"
                  value={queryInput}
                  onChange={(e) => setQueryInput(e.target.value)}
                  placeholder="Search silhouettes, fabrics, colors, styles..."
                  className="search-bar-input"
                  aria-label="Search garments"
                />
                {queryInput && (
                  <button
                    type="button"
                    onClick={() => {
                      setQueryInput('');
                      router.push('/search');
                    }}
                    className="search-bar-clear-btn"
                    aria-label="Clear search"
                  >
                    <X size={15} />
                  </button>
                )}
                <button type="submit" className="search-bar-submit-btn">
                  SEARCH
                </button>
              </div>
            </form>

            {/* Quick Keyword Pills */}
            <div className="search-popular-tags">
              <span className="search-tags-label">POPULAR:</span>
              <div className="search-tags-scroll">
                {POPULAR_SEARCH_TAGS.map((tag) => (
                  <button
                    key={tag}
                    type="button"
                    onClick={() => {
                      setQueryInput(tag);
                      router.push(`/search?q=${encodeURIComponent(tag)}`);
                    }}
                    className="search-tag-chip"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Results Container */}
      <div className="container search-results-container">
        {/* Results Toolbar */}
        <div className="search-results-toolbar">
          <div className="search-count-pill">
            <span>
              {loading
                ? 'Searching catalog...'
                : `${totalCount} ${totalCount === 1 ? 'item' : 'items'} found`}
            </span>
          </div>

          <div className="search-toolbar-actions">
            <SortDropdown hideLabel={false} />
          </div>
        </div>

        {/* Content View */}
        {loading ? (
          <div className="search-skeleton-grid">
            {Array(8).fill(0).map((_, i) => (
              <div key={i} className="search-skeleton-card" />
            ))}
          </div>
        ) : results.length > 0 ? (
          <div className="search-products-grid">
            {results.map((product, idx) => (
              <ProductCard
                key={product._id || product.sku || idx}
                product={product}
                index={idx}
              />
            ))}
          </div>
        ) : (
          <div className="search-empty-state">
            <div className="search-empty-card">
              <span className="empty-sparkle">✦</span>
              <h2 className="empty-title">NO GARMENTS FOUND</h2>
              <p className="empty-subtitle">
                We couldn't find any creations matching "{initialQuery}". Try searching by garment type, artisanal fabric, or explore our premier departments.
              </p>
              
              <div className="empty-departments-grid">
                <Link href="/category/western-wear" className="empty-dept-card">
                  <span className="dept-name">WESTERN WEAR</span>
                  <span className="dept-action">EXPLORE <ArrowRight size={12} /></span>
                </Link>
                <Link href="/category/ethnic-wear" className="empty-dept-card">
                  <span className="dept-name">ETHNIC WEAR</span>
                  <span className="dept-action">EXPLORE <ArrowRight size={12} /></span>
                </Link>
                <Link href="/category/indo-western" className="empty-dept-card">
                  <span className="dept-name">INDO-WESTERN</span>
                  <span className="dept-action">EXPLORE <ArrowRight size={12} /></span>
                </Link>
                <Link href="/category/accessories" className="empty-dept-card">
                  <span className="dept-name">ACCESSORIES</span>
                  <span className="dept-action">EXPLORE <ArrowRight size={12} /></span>
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .search-page-main {
          background-color: var(--color-bg, #FFFFFF);
          min-height: 100vh;
          padding-bottom: clamp(48px, 6vw, 80px);
        }
        .search-header-hero {
          background: #FFFFFF;
          border-bottom: 1px solid var(--color-stone, #E5E7EB);
          padding: 24px 0 20px;
        }
        .search-hero-content {
          max-width: 680px;
          margin: 0 auto;
          text-align: center;
        }
        .search-headline {
          font-family: var(--font-display, serif);
          font-size: clamp(1.4rem, 2.8vw, 2rem);
          color: var(--color-ink, #111827);
          font-weight: 500;
          letter-spacing: -0.01em;
          margin: 0 0 16px 0;
          line-height: 1.2;
        }
        .query-highlight {
          color: var(--color-accent, #C5A869);
          font-style: italic;
        }
        .search-bar-form {
          width: 100%;
          margin-bottom: 16px;
        }
        .search-input-wrapper {
          position: relative;
          display: flex;
          align-items: center;
          background: var(--color-surface);
          border: 1px solid var(--color-stone);
          border-radius: 40px;
          padding: 6px 6px 6px 18px;
          box-shadow: 0 4px 16px rgba(20, 20, 18, 0.05);
          transition: border-color 0.2s, box-shadow 0.2s;
        }
        .search-input-wrapper:focus-within {
          border-color: var(--color-accent);
          box-shadow: 0 0 0 3px rgba(197, 168, 105, 0.2);
        }
        .search-bar-icon {
          color: var(--color-ink-muted);
          flex-shrink: 0;
          margin-right: 12px;
        }
        .search-bar-input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--color-ink);
          outline: none;
          min-width: 0;
        }
        .search-bar-input::placeholder {
          color: var(--color-ink-muted);
          font-style: italic;
        }
        .search-bar-clear-btn {
          background: transparent;
          border: none;
          color: var(--color-ink-muted);
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: color 0.15s;
        }
        .search-bar-clear-btn:hover {
          color: var(--color-ink);
        }
        .search-bar-submit-btn {
          background: #141412;
          color: #FAF7F2;
          border: none;
          padding: 10px 22px;
          border-radius: 30px;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          cursor: pointer;
          transition: background 0.2s, transform 0.15s;
          flex-shrink: 0;
        }
        .search-bar-submit-btn:hover {
          background: var(--color-accent);
          color: #141412;
        }
        .search-popular-tags {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .search-tags-label {
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.18em;
          color: var(--color-ink-muted);
          font-weight: 700;
          text-transform: uppercase;
        }
        .search-tags-scroll {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
          justify-content: center;
        }
        .search-tag-chip {
          background: var(--color-surface);
          border: 1px solid var(--color-stone);
          border-radius: 16px;
          padding: 4px 12px;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 500;
          color: var(--color-ink);
          cursor: pointer;
          transition: all 0.2s;
        }
        .search-tag-chip:hover {
          background: #141412;
          color: #FAF7F2;
          border-color: #141412;
        }
        .search-results-container {
          padding-top: clamp(24px, 3.5vw, 36px);
        }
        .search-results-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 24px;
          padding-bottom: 14px;
          border-bottom: 1px solid var(--color-stone);
          gap: 16px;
          flex-wrap: wrap;
        }
        .search-count-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          color: var(--color-ink);
          text-transform: uppercase;
        }
        .dot-gold {
          color: var(--color-accent);
          font-size: 10px;
        }
        .search-products-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(16px, 2.5vw, 28px);
        }
        .search-skeleton-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: clamp(16px, 2.5vw, 28px);
        }
        .search-skeleton-card {
          aspect-ratio: 3/4;
          background: linear-gradient(90deg, #F3ECE1 25%, #E8E0D2 50%, #F3ECE1 75%);
          background-size: 200% 100%;
          border-radius: 4px;
          animation: searchShimmer 1.4s infinite;
        }
        @keyframes searchShimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
        .search-empty-state {
          padding: 32px 0 48px;
        }
        .search-empty-card {
          background: var(--color-surface);
          border: 1px solid var(--color-stone);
          border-radius: 4px;
          padding: clamp(32px, 5vw, 56px) 24px;
          text-align: center;
          max-width: 800px;
          margin: 0 auto;
        }
        .empty-sparkle {
          color: var(--color-accent);
          font-size: 18px;
          display: block;
          margin-bottom: 12px;
        }
        .empty-title {
          font-family: var(--font-display);
          font-size: clamp(22px, 3vw, 28px);
          font-weight: 400;
          color: var(--color-ink);
          margin: 0 0 10px 0;
          letter-spacing: 0.04em;
        }
        .empty-subtitle {
          font-family: var(--font-body);
          font-size: 14px;
          color: var(--color-ink-muted);
          max-width: 520px;
          margin: 0 auto 32px;
          line-height: 1.6;
        }
        .empty-departments-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 14px;
        }
        .empty-dept-card {
          padding: 16px 12px;
          background: var(--color-bg);
          border: 1px solid var(--color-stone);
          border-radius: 4px;
          text-decoration: none;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          transition: all 0.25s ease;
        }
        .empty-dept-card:hover {
          background: #141412;
          border-color: #141412;
        }
        .empty-dept-card:hover .dept-name,
        .empty-dept-card:hover .dept-action {
          color: #FAF7F2;
        }
        .dept-name {
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          color: var(--color-ink);
        }
        .dept-action {
          font-family: var(--font-ui);
          font-size: 10px;
          color: var(--color-accent);
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-weight: 600;
        }
        @media (max-width: 1024px) {
          .search-products-grid,
          .search-skeleton-grid {
            grid-template-columns: repeat(3, 1fr);
          }
          .empty-departments-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        @media (max-width: 640px) {
          .search-products-grid,
          .search-skeleton-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
          .search-bar-submit-btn {
            padding: 8px 14px;
            font-size: 10px;
          }
          .search-popular-tags {
            justify-content: flex-start;
          }
          .search-tags-scroll {
            justify-content: flex-start;
            overflow-x: auto;
            flex-wrap: nowrap;
            width: 100%;
            padding-bottom: 4px;
          }
          .search-tag-chip {
            white-space: nowrap;
            flex-shrink: 0;
          }
        }
      `}} />
    </main>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div style={{ padding: '80px 20px', textAlign: 'center', backgroundColor: 'var(--color-bg)' }}>
          <p style={{ fontFamily: 'var(--font-display)', fontStyle: 'italic', fontSize: '16px', color: 'var(--color-accent)' }}>
            Searching the Atelier Archive...
          </p>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
