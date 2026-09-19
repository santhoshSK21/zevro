'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductCard from '../../components/product/ProductCard';

function SearchResults() {
  const searchParams = useSearchParams();
  const query = searchParams.get('q');
  
  const [results, setResults] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    if (query) {
      setLoading(true);
      fetch('/api/products?q=' + encodeURIComponent(query))
        .then(res => res.json())
        .then(data => {
          setResults(data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    } else {
      setResults([]);
      setLoading(false);
    }
  }, [query]);

  if (loading) return <div style={{ padding: '80px', textAlign: 'center' }}>Loading...</div>;

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
      <Suspense fallback={<div style={{ padding: '80px', textAlign: 'center' }}>Loading...</div>}>
        <SearchResults />
      </Suspense>
    </div>
  );
}
