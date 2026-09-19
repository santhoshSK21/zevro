'use client';

import React from 'react';
import Link from 'next/link';
import ProductCard from '../../../components/product/ProductCard';

export default function AccountWishlistPage() {
  const wishlistItems = [
    {
      id: 'prod-2',
      name: 'Heavy Embroidered Anarkali in Ivory',
      price: 549900,
      image: 'https://picsum.photos/seed/wishlist-1/400/533',
      slug: 'ethnic-wear-sarees-1'
    }
  ];

  return (
    <div>
      <h1 className="display-serif" style={{ fontSize: 'var(--text-2xl)', marginBottom: '32px', color: 'var(--color-ink)' }}>My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div style={{ padding: '64px 24px', textAlign: 'center', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-stone)' }}>
          <p style={{ color: 'var(--color-ink-muted)', marginBottom: '24px' }}>Your wishlist is currently empty.</p>
          <Link href="/products" className="btn btn-ghost">EXPLORE COLLECTIONS</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '32px' }}>
          {wishlistItems.map(item => (
            <div key={item.id} style={{ position: 'relative' }}>
              <button style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 20, width: '32px', height: '32px', background: 'rgba(255,255,255,0.8)', backdropFilter: 'blur(4px)', borderRadius: '50%', border: 'none', cursor: 'pointer', color: 'var(--color-ink)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✕
              </button>
              <ProductCard product={item} />
              <button style={{ width: '100%', marginTop: '16px', background: 'transparent', border: '1px solid var(--color-ink)', color: 'var(--color-ink)', padding: '12px', fontFamily: 'var(--font-ui)', fontSize: '10px', letterSpacing: '0.15em', cursor: 'pointer', textTransform: 'uppercase', transition: 'all 0.2s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-ink)'; e.currentTarget.style.color = 'var(--color-white)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--color-ink)'; }}
              >
                ADD TO BAG
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
