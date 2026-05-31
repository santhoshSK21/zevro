import React from 'react';
import Link from 'next/link';

export default function AccountWishlistPage() {
  const wishlistItems = [
    {
      id: 'prod-2',
      name: 'Heavy Embroidered Anarkali in Ivory',
      price: 549900,
      image: 'https://images.unsplash.com/photo-1583391733956-6c78276477e2?w=400',
      slug: 'heavy-embroidered-anarkali-ivory'
    }
  ];

  return (
    <div>
      <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', marginBottom: '24px' }}>MY WISHLIST</h1>

      {wishlistItems.length === 0 ? (
        <div style={{ padding: '40px', textAlign: 'center', backgroundColor: 'var(--white)', border: '1px solid var(--linen)' }}>
          <p style={{ color: 'var(--warm-grey)', marginBottom: '16px' }}>Your wishlist is currently empty.</p>
          <Link href="/products" className="btn btn-primary">EXPLORE COLLECTIONS</Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '24px' }}>
          {wishlistItems.map(item => (
            <div key={item.id} className="product-card" style={{ position: 'relative' }}>
              <button style={{ position: 'absolute', top: '12px', right: '12px', zIndex: 10, background: 'var(--white)', border: 'none', width: '32px', height: '32px', borderRadius: '50%', cursor: 'pointer', color: 'var(--error)' }}>
                ✕
              </button>
              <div className="image-wrapper">
                <Link href={`/products/${item.slug}`}>
                  <img src={item.image} alt={item.name} />
                </Link>
              </div>
              <div className="card-info" style={{ padding: '12px 0' }}>
                <Link href={`/products/${item.slug}`}>
                  <h3 className="product-name" style={{ fontSize: '14px' }}>{item.name}</h3>
                  <div className="price">₹{(item.price / 100).toLocaleString('en-IN')}</div>
                </Link>
                <button className="btn btn-outline-gold btn-full btn-sm" style={{ marginTop: '12px' }}>ADD TO CART</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
