import React from 'react';
import FilterSidebar from '../../../components/product/FilterSidebar';
import SortDropdown from '../../../components/product/SortDropdown';
import ProductGrid from '../../../components/product/ProductGrid';

export default function CategoryPage({ params }: { params: { category: string } }) {
  const categoryName = params.category.replace('-', ' ').toUpperCase();

  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', paddingTop: '100px' }}>
      
      {/* Page Header */}
      <div className="container" style={{ textAlign: 'center', marginBottom: '40px' }}>
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--espresso)', letterSpacing: '0.1em', marginBottom: '16px' }}>
          {categoryName}
        </h1>
        <div className="gold-rule" style={{ margin: '0 auto' }} />
      </div>

      <div className="container" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
        <FilterSidebar />
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
            <p style={{ fontSize: '13px', color: 'var(--warm-grey)' }}>Showing results</p>
            <SortDropdown />
          </div>
          
          <ProductGrid initialCategory={params.category} />
        </div>
      </div>
    </div>
  );
}
