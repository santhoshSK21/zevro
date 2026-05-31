'use client';

import React from 'react';
import Link from 'next/link';

interface ProductCardProps {
  product: any;
}

export default function ProductCard({ product }: ProductCardProps) {
  const primaryImage = product.image || product.variants?.[0]?.images?.[0] || 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=500';
  const secondaryImage = product.variants?.[0]?.images?.[1] || primaryImage;

  return (
    <div className="product-card">
      <div className="image-wrapper" style={{ position: 'relative', aspectRatio: '3/4', backgroundColor: 'var(--beige)', overflow: 'hidden' }}>
        <Link href={`/products/${product.slug}`}>
          <img 
            src={primaryImage} 
            alt={product.name} 
            style={{ 
              position: 'absolute', inset: 0, 
              zIndex: 2, width: '100%', height: '100%', objectFit: 'cover',
            }} 
            className="primary-image"
          />
          <img 
            src={secondaryImage} 
            alt={product.name} 
            style={{ position: 'absolute', inset: 0, zIndex: 1, width: '100%', height: '100%', objectFit: 'cover' }} 
            className="secondary-image"
          />
          <div className="hover-overlay" style={{ 
            position: 'absolute', inset: 0, zIndex: 3, 
            backgroundColor: 'rgba(5,5,5,0.2)', opacity: 0, transition: 'opacity 0.3s',
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <span className="btn btn-outline-gold" style={{ pointerEvents: 'none', backgroundColor: '#fff' }}>QUICK VIEW</span>
          </div>
        </Link>
        <button className="wishlist-btn" title="Add to Wishlist" style={{
          position: 'absolute', top: '16px', right: '16px', zIndex: 4,
          background: '#fff', border: 'none', borderRadius: '50%', width: '32px', height: '32px',
          display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          ❤
        </button>
        {product.isNew && (
          <span style={{ 
            position: 'absolute', top: '16px', left: '16px', zIndex: 4,
            backgroundColor: 'var(--gold)', color: '#fff', fontSize: '9px', letterSpacing: '0.1em',
            padding: '4px 8px', fontWeight: 600
          }}>
            NEW
          </span>
        )}
      </div>
      
      <div className="card-info" style={{ marginTop: '16px', textAlign: 'center' }}>
        <Link href={`/products/${product.slug}`}>
          <h3 style={{ fontSize: '14px', color: 'var(--espresso)', marginBottom: '8px', fontWeight: 500 }}>{product.name}</h3>
          <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', alignItems: 'center' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>₹{(product.price / 100).toLocaleString('en-IN')}</span>
            {product.originalPrice > product.price && (
              <>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '11px', color: 'var(--warm-grey)', textDecoration: 'line-through' }}>
                  ₹{(product.originalPrice / 100).toLocaleString('en-IN')}
                </span>
                <span style={{ fontSize: '10px', color: 'var(--success)' }}>
                  ({Math.round((1 - product.price / product.originalPrice) * 100)}% OFF)
                </span>
              </>
            )}
          </div>
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .product-card {
          cursor: pointer;
        }
        .product-card:hover .primary-image {
          opacity: 0;
        }
        .product-card:hover .secondary-image {
          transform: scale(1.05);
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .product-card:hover .hover-overlay {
          opacity: 1 !important;
        }
        .secondary-image {
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .primary-image {
          transition: opacity 0.4s ease;
        }
      `}} />
    </div>
  );
}
