'use client';

import React, { useEffect, useState } from 'react';
import ProductCard from './ProductCard';
import { useFilterStore } from '../../store/filterStore';

interface ProductGridProps {
  initialCategory?: string;
}

export default function ProductGrid({ initialCategory }: ProductGridProps) {
  const { category, minPrice, maxPrice, sizes, colors, sortBy, setFilter } = useFilterStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (initialCategory && !category) {
      setFilter('category', initialCategory);
    }
  }, [initialCategory]);

  useEffect(() => {
    // Mock Fetch
    setLoading(true);
    setTimeout(() => {
      // Dummy data generated based on current filters
      const dummy = Array(12).fill(0).map((_, i) => ({
        sku: `prod-${i}`,
        slug: `product-${i}`,
        name: `${category ? category.replace('-', ' ') : 'Luxury'} Item ${i+1}`,
        price: 299900 + (i * 50000),
        originalPrice: 399900 + (i * 50000),
        image: i % 2 === 0 ? 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500' : 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=500',
        category: category || 'western-wear'
      }));
      setProducts(dummy);
      setLoading(false);
    }, 800);
  }, [category, minPrice, maxPrice, sizes, colors, sortBy]);

  if (loading) {
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '32px' }}>
        {Array(8).fill(0).map((_, i) => (
          <div key={i} style={{ animation: 'pulse 1.5s infinite ease-in-out', backgroundColor: 'var(--linen)', aspectRatio: '3/4' }} />
        ))}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes pulse {
            0% { opacity: 1; }
            50% { opacity: 0.5; }
            100% { opacity: 1; }
          }
        `}} />
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '64px 0' }}>
        <p style={{ fontSize: '18px', color: 'var(--warm-grey)', marginBottom: '16px' }}>No products found matching your criteria.</p>
        <button onClick={() => useFilterStore.getState().clearAll()} className="btn btn-outline-gold">CLEAR FILTERS</button>
      </div>
    );
  }

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '32px' }}>
      {products.map(p => (
        <ProductCard key={p.sku} product={p} />
      ))}
    </div>
  );
}
