import React from 'react';
import FilterSidebar from '../../../components/product/FilterSidebar';
import SortDropdown from '../../../components/product/SortDropdown';
import ProductGrid from '../../../components/product/ProductGrid';

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const categoryName = category.replace(/-/g, ' ').toUpperCase();

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', paddingTop: '100px' }}>
      
      {/* Page Header */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '64px' }}>
        <p className="label-caps" style={{ marginBottom: 'var(--space-2)' }}>Shop</p>
        <h1 className="display-serif" style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-ink)', marginBottom: '16px' }}>
          {categoryName}
        </h1>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: 'var(--text-base)', color: 'var(--color-ink-muted)' }}>
          Tradition in a modern light. Explore our curated selection.
        </p>
      </div>

      <div className="container" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <FilterSidebar />
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <p className="label-caps">Showing results</p>
            <SortDropdown />
          </div>
          
          <ProductGrid initialCategory={category} />
        </div>
      </div>
    </div>
  );
}
