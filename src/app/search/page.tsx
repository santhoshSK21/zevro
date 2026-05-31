'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Navbar from '../../components/layout/Navbar';
import Footer from '../../components/layout/Footer';
import ProductCard from '../../components/product/ProductCard';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  // Demo products (in a real app, this would be a fetch call to /api/products/search?q=query)
  const results = [
    {
      _id: '1',
      name: 'Banarasi Silk Saree in Deep Maroon',
      slug: 'banarasi-silk-saree-deep-maroon',
      price: 429900,
      originalPrice: 599900,
      variants: [{ images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600'] }]
    },
    {
      _id: '2',
      name: 'Heavy Embroidered Anarkali in Ivory',
      slug: 'heavy-embroidered-anarkali-ivory',
      price: 549900,
      originalPrice: 749900,
      variants: [{ images: ['https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=600'] }]
    }
  ];

  return (
    <main className="container" style={{ padding: '80px 24px', flex: 1 }}>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '16px', textAlign: 'center' }}>
        Search Results
      </h1>
      <p style={{ textAlign: 'center', color: 'var(--warm-grey)', marginBottom: '48px' }}>
        Showing {results.length} results for "{query}"
      </p>

      {results.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '32px' }}>
          {results.map(product => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <p style={{ color: 'var(--warm-grey)' }}>No products found matching your criteria.</p>
        </div>
      )}
    </main>
  );
}

export default function SearchPage() {
  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center' }}>Loading...</div>}>
        <SearchResults />
      </Suspense>
      <Footer />
    </div>
  );
}
