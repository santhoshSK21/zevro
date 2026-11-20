'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import FilterSidebar from './FilterSidebar';
import SortDropdown from './SortDropdown';
import ProductGrid from './ProductGrid';
import { SlidersHorizontal, ChevronRight } from 'lucide-react';
import { useFilterStore } from '../../store/filterStore';

interface ProductListLayoutProps {
  initialCategory?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}

function ProductListLayoutInner({ initialCategory, eyebrow, title, description }: ProductListLayoutProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { category, sizes, colors, fabric, occasion, minPrice, maxPrice, clearFiltersOnly } = useFilterStore();

  const activeFiltersCount = 
    sizes.length + 
    colors.length + 
    fabric.length + 
    occasion.length + 
    (minPrice > 0 || (maxPrice > 0 && maxPrice < 50000) ? 1 : 0);

  const displayTitle = title || (category ? category.replace(/-/g, ' ').toUpperCase() : 'ALL CREATIONS');

  return (
    <div className="product-list-page">
      {/* Sleek, Modern E-Commerce Catalog Header (Compact, Zero Wasted Space) */}
      <div className="plist-compact-header">
        <div className="container plist-header-inner">
          
          {/* Top Line: Breadcrumb + Quick Category Switcher */}
          <div className="plist-header-top-row">
            <nav className="plist-breadcrumb" aria-label="Breadcrumb">
              <Link href="/" className="crumb-link">Home</Link>
              <ChevronRight size={11} className="crumb-sep" />
              <Link href="/products" className="crumb-link">Collections</Link>
              {category && (
                <>
                  <ChevronRight size={11} className="crumb-sep" />
                  <span className="crumb-current">{category.replace(/-/g, ' ')}</span>
                </>
              )}
            </nav>

            {/* Quick Department Switcher Pills */}
            <div className="plist-quick-dept-pills hide-mobile">
              {[
                { id: '', label: 'All Collections', href: '/products' },
                { id: 'new-in', label: 'New In', href: '/category/new-in' },
                { id: 'western-wear', label: 'Western Wear', href: '/category/western-wear' },
                { id: 'ethnic-wear', label: 'Ethnic Wear', href: '/category/ethnic-wear' },
                { id: 'indo-western', label: 'Indo-Western', href: '/category/indo-western' },
                { id: 'accessories', label: 'Accessories', href: '/category/accessories' },
              ].map((dept) => {
                const isActive = (category || '') === dept.id;
                return (
                  <Link
                    key={dept.id}
                    href={dept.href}
                    className={`plist-dept-pill ${isActive ? 'is-active' : ''}`}
                  >
                    {dept.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Main Title & Action Bar */}
          <div className="plist-header-main-row">
            <div className="plist-title-group">
              <h1 className="plist-title">{displayTitle}</h1>
            </div>

            <div className="plist-toolbar-actions hide-mobile">
              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={clearFiltersOnly}
                  className="plist-clear-all-btn"
                >
                  Clear Filters ({activeFiltersCount})
                </button>
              )}
              <div className="plist-sort-wrap">
                <SortDropdown hideLabel={false} />
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Main Content Area */}
      <div className="container plist-main-wrap">
        {/* Mobile Filter & Sort Toolbar */}
        <div className="plist-mobile-toolbar">
          <button 
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="plist-mobile-filter-btn"
          >
            <SlidersHorizontal size={13} />
            <span>FILTER {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>
          <div className="plist-mobile-sort">
            <SortDropdown />
          </div>
        </div>

        {/* Content Layout Row */}
        <div className="plist-layout-row">
          <div className="plist-sidebar-col">
            <FilterSidebar 
              isOpenMobile={mobileFilterOpen} 
              onCloseMobile={() => setMobileFilterOpen(false)} 
            />
          </div>
          
          <div className="plist-products-col">
            <ProductGrid initialCategory={initialCategory} />
          </div>
        </div>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .product-list-page {
          background-color: var(--color-bg, #FFFFFF);
          min-height: 100vh;
          padding-bottom: clamp(48px, 6vw, 76px);
        }

        .plist-compact-header {
          background: #FFFFFF;
          border-bottom: 1px solid var(--color-stone, #E5E7EB);
          padding: 14px 0 16px;
          margin-bottom: 22px;
        }

        .plist-header-inner {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .plist-header-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
          flex-wrap: wrap;
        }

        .plist-breadcrumb {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          color: var(--color-ink-muted, #595F69);
          overflow-x: auto;
          white-space: nowrap;
        }

        .crumb-link {
          color: var(--color-ink-muted, #595F69);
          text-decoration: none;
          transition: color 0.15s ease;
        }

        .crumb-link:hover {
          color: var(--color-ink, #111827);
        }

        .crumb-sep {
          color: var(--color-stone, #E5E7EB);
          flex-shrink: 0;
        }

        .crumb-current {
          color: var(--color-ink, #111827);
          font-weight: 600;
          text-transform: capitalize;
        }

        .plist-quick-dept-pills {
          display: flex;
          align-items: center;
          gap: 6px;
          flex-wrap: wrap;
        }

        .plist-dept-pill {
          padding: 4px 12px;
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 600;
          color: var(--color-ink-muted, #595F69);
          background: var(--color-surface, #F8F9FA);
          border: 1px solid var(--color-stone, #E5E7EB);
          border-radius: 9999px;
          text-decoration: none;
          transition: all 0.15s ease;
        }

        .plist-dept-pill:hover {
          border-color: var(--color-ink, #111827);
          color: var(--color-ink, #111827);
          background: #FFFFFF;
        }

        .plist-dept-pill.is-active {
          background: var(--color-ink, #111827);
          color: #FFFFFF;
          border-color: var(--color-ink, #111827);
        }

        .plist-header-main-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        .plist-title-group {
          display: flex;
          align-items: baseline;
          gap: 10px;
        }

        .plist-title {
          font-family: var(--font-display, serif);
          font-size: clamp(1.4rem, 2.5vw, 1.95rem);
          color: var(--color-ink, #111827);
          font-weight: 600;
          letter-spacing: -0.01em;
          margin: 0;
          line-height: 1.15;
          text-transform: uppercase;
        }

        .plist-toolbar-actions {
          display: flex;
          align-items: center;
          gap: 14px;
        }

        .plist-clear-all-btn {
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 600;
          color: #DC2626;
          background: none;
          border: none;
          cursor: pointer;
          text-decoration: underline;
          padding: 4px 6px;
        }

        .plist-sort-wrap {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .plist-main-wrap {
          width: 100%;
        }

        .plist-mobile-toolbar {
          display: none;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding: 8px 12px;
          background: #FFFFFF;
          border: 1px solid var(--color-stone, #E5E7EB);
          border-radius: 6px;
        }

        .plist-mobile-filter-btn {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          background: var(--color-ink, #111827);
          color: #FFFFFF;
          border: none;
          padding: 8px 16px;
          border-radius: 20px;
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          cursor: pointer;
        }

        .plist-mobile-sort {
          flex-shrink: 0;
        }

        .plist-layout-row {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: clamp(20px, 2.5vw, 32px);
          align-items: flex-start;
        }

        .plist-sidebar-col {
          position: sticky;
          top: 96px;
        }

        .plist-products-col {
          min-width: 0;
          width: 100%;
        }

        @media (max-width: 900px) {
          .plist-mobile-toolbar {
            display: flex;
          }
          .plist-layout-row {
            grid-template-columns: 1fr;
            gap: 16px;
          }
          .plist-sidebar-col {
            display: contents;
          }
        }
      `}} />
    </div>
  );
}

export default function ProductListLayout(props: ProductListLayoutProps) {
  return (
    <Suspense fallback={
      <div style={{ padding: '80px 20px', textAlign: 'center', backgroundColor: 'var(--color-bg, #FFFFFF)' }}>
        <p style={{ fontFamily: 'var(--font-display, serif)', fontStyle: 'italic', fontSize: '16px', color: 'var(--color-ink-muted, #595F69)' }}>
          Loading creations...
        </p>
      </div>
    }>
      <ProductListLayoutInner {...props} />
    </Suspense>
  );
}
