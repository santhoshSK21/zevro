import React from 'react';
import Link from 'next/link';

export default function AccountWishlistPage() {
  const wishlistItems = [
    {
      id: 'prod-2',
      name: 'Heavy Embroidered Anarkali in Ivory',
      price: 549900,
      image: 'https://picsum.photos/seed/wishlist-1/400/533',
      slug: 'heavy-embroidered-anarkali-ivory'
    }
  ];

  return (
    <div>
      <h1 className="display-serif" style={{ fontSize: 'var(--text-2xl)', marginBottom: '32px', color: 'var(--color-ink)' }}>My Wishlist</h1>

      {wishlistItems.length === 0 ? (
        <div style={{ padding: '64px 24px', textAlign: 'center', backgroundColor: 'var(--color-bg)', border: '1px solid var(--color-stone)' }}>
          <p style={{ color: 'var(--color-ink-muted)', marginBottom: '24px' }}>Your wishlist is currently empty.</p>
          <Link href="/products" className="btn btn-outline-dark">EXPLORE COLLECTIONS</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '32px' }}>
          {wishlistItems.map(item => (
            <div key={item.id} className="product-card" style={{ position: 'relative' }}>
              <button style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-ink)' }}>
                ✕
              </button>
              <div className="image-wrapper" style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden', backgroundColor: 'var(--color-surface)' }}>
                <Link href={`/products/${item.slug}`}>
                  <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </Link>
              </div>
              <div className="card-info" style={{ paddingTop: '16px' }}>
                <Link href={`/products/${item.slug}`}>
                  <h3 className="product-name" style={{ fontFamily: 'var(--font-body)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', color: 'var(--color-ink)', marginBottom: '4px' }}>{item.name}</h3>
                  <div className="price" style={{ fontFamily: 'var(--font-ui)', fontSize: '14px', color: 'var(--color-ink-muted)' }}>₹{(item.price / 100).toLocaleString('en-IN')}</div>
                </Link>
                <button className="btn btn-outline-dark" style={{ width: '100%', marginTop: '16px', padding: '12px' }}>ADD TO BAG</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
