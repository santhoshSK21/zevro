'use client';

import React, { useState, Suspense } from 'react';
import FilterSidebar from './FilterSidebar';
import SortDropdown from './SortDropdown';
import ProductGrid from './ProductGrid';
import { SlidersHorizontal } from 'lucide-react';
import { useFilterStore } from '../../store/filterStore';

interface ProductListLayoutProps {
  initialCategory?: string;
  eyebrow?: string;
  title?: string;
  description?: string;
}

function ProductListLayoutInner({ initialCategory, eyebrow, title, description }: ProductListLayoutProps) {
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const { category, sizes, colors, minPrice, maxPrice } = useFilterStore();

  const activeFiltersCount = (category ? 1 : 0) + 
    sizes.length + 
    colors.length + 
    (minPrice > 0 || maxPrice < 50000 ? 1 : 0);

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', paddingTop: '90px', paddingBottom: '80px' }}>
      
      {/* Page Header */}
      {(title || eyebrow) && (
        <div className="container" style={{ textAlign: 'center', marginBottom: '40px', padding: '0 20px' }}>
          {eyebrow && <p className="label-caps" style={{ marginBottom: '8px', color: '#C5A880' }}>{eyebrow}</p>}
          {title && (
            <h1 className="display-serif" style={{ fontSize: 'clamp(26px, 4vw, 38px)', color: 'var(--color-ink)', marginBottom: '12px' }}>
              {title}
            </h1>
          )}
          {description && (
            <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: 'var(--color-ink-muted)', maxWidth: '600px', margin: '0 auto' }}>
              {description}
            </p>
          )}
        </div>
      )}

      {/* Main Container */}
      <div className="container" style={{ padding: '0 20px' }}>
        
        {/* Mobile Filter & Sort Bar (Visible on mobile/tablet <= 900px) */}
        <div className="mobile-toolbar">
          <button 
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="mobile-filter-trigger"
          >
            <SlidersHorizontal size={14} />
            <span>FILTERS {activeFiltersCount > 0 && `(${activeFiltersCount})`}</span>
          </button>
          <div className="mobile-sort-wrap">
            <SortDropdown />
          </div>
        </div>

        {/* Content Layout Grid */}
        <div className="product-layout-row">
          <FilterSidebar 
            isOpenMobile={mobileFilterOpen} 
            onCloseMobile={() => setMobileFilterOpen(false)} 
          />
          
          <div className="product-main-area">
            {/* Desktop Sort & Result Count Header */}
            <div className="desktop-toolbar">
              <p className="label-caps" style={{ margin: 0, color: '#64748B' }}>
                {category ? `Category: ${category.replace(/-/g, ' ')}` : 'All Products'}
              </p>
              <SortDropdown />
            </div>
            
            <ProductGrid initialCategory={initialCategory} />
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .mobile-toolbar {
          display: none;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 24px;
          padding: 10px 14px;
          background: #FFFFFF;
          border: 1px solid #E2E8F0;
          border-radius: 6px;
        }

        .mobile-filter-trigger {
          display: flex;
          align-items: center;
          gap: 8px;
          background: #0F172A;
          color: #FAF8F5;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          cursor: pointer;
        }

        .product-layout-row {
          display: flex;
          gap: 36px;
          align-items: flex-start;
        }

        .product-main-area {
          flex: 1;
          min-width: 0;
        }

        .desktop-toolbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 28px;
        }

        @media (max-width: 900px) {
          .mobile-toolbar {
            display: flex;
          }
          .desktop-toolbar {
            display: none;
          }
          .product-layout-row {
            display: block;
          }
        }
      `}} />
    </div>
  );
}

export default function ProductListLayout(props: ProductListLayoutProps) {
  return (
    <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center' }}>Loading products...</div>}>
      <ProductListLayoutInner {...props} />
    </Suspense>
  );
}
