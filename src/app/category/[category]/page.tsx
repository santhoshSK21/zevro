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
      <div className="container" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <p className="label-caps" style={{ marginBottom: 'var(--space-4)' }}>Shop</p>
        <h1 className="display-serif" style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-ink)' }}>
          {categoryName}
        </h1>
        <div className="divider" style={{ width: '48px', margin: 'var(--space-6) auto 0' }} />
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
