import React from 'react';
import FilterSidebar from '../../components/product/FilterSidebar';
import SortDropdown from '../../components/product/SortDropdown';
import ProductGrid from '../../components/product/ProductGrid';

export default function ProductsPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', paddingTop: '100px' }}>
      
      {/* Page Header */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '64px' }}>
        <h1 className="display-serif" style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-ink)', marginBottom: '16px' }}>
          The Collection
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--color-ink-muted)' }}>
          Discover our complete range of modern silhouettes and timeless traditions.
        </p>
      </div>

      <div className="container" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <FilterSidebar />
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <p style={{ fontSize: '13px', color: 'var(--color-ink-muted)' }}>Showing results</p>
            <SortDropdown />
          </div>
          
          <ProductGrid />
        </div>
      </div>
    </div>
  );
}
