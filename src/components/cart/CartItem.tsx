'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface CartItemProps {
  item: any;
  updateQuantity: (sku: string, qty: number) => void;
  removeItem: (sku: string) => void;
}

export default function CartItem({ item, updateQuantity, removeItem }: CartItemProps) {
  const itemImage = item.image || '/pdp_hero_1.png';
  const targetHref = item.slug ? `/products/${item.slug}` : (item.productId ? `/products/${item.productId}` : `/products/${item.variantId || ''}`);

  return (
    <div style={{ display: 'flex', gap: '20px', padding: '20px 0', borderBottom: '1px solid rgba(0,0,0,0.06)', alignItems: 'center' }}>
      <div style={{ position: 'relative', width: '100px', minWidth: '100px', maxWidth: '100px', height: '133px', backgroundColor: '#F4F1EC', borderRadius: '6px', overflow: 'hidden', flexShrink: 0 }}>
        <Link href={targetHref}>
          <Image src={itemImage} alt={item.name} fill style={{ objectFit: 'cover' }} sizes="100px" />
        </Link>
      </div>

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div>
            <Link href={`/products/${item.variantId}`} style={{ textDecoration: 'none' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '18px', color: 'var(--espresso)', marginBottom: '4px' }}>
                {item.name}
              </h3>
            </Link>
            <p style={{ fontSize: '13px', color: 'var(--warm-grey)', marginBottom: '16px' }}>
              {item.color} | Size: {item.size} {item.material && `| ${item.material}`}
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ fontFamily: 'var(--font-mono)', fontSize: '16px', color: 'var(--espresso)' }}>
              ₹{(item.price / 100).toLocaleString('en-IN')}
            </p>
            {item.originalPrice > item.price && (
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '12px', color: 'var(--warm-grey)', textDecoration: 'line-through' }}>
                ₹{(item.originalPrice / 100).toLocaleString('en-IN')}
              </p>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', border: '1px solid var(--linen)', borderRadius: '2px' }}>
            <button 
              onClick={() => updateQuantity(item.sku, item.quantity - 1)}
              style={{ padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--warm-grey)' }}
            >
              −
            </button>
            <span style={{ padding: '8px 16px', fontSize: '14px', minWidth: '40px', textAlign: 'center' }}>
              {item.quantity}
            </span>
            <button 
              onClick={() => updateQuantity(item.sku, item.quantity + 1)}
              style={{ padding: '8px 12px', background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--warm-grey)' }}
            >
              +
            </button>
          </div>
          
          <button 
            onClick={() => removeItem(item.sku)}
            style={{ 
              background: 'transparent', border: 'none', 
              fontSize: '12px', color: 'var(--warm-grey)', textDecoration: 'underline',
              cursor: 'pointer'
            }}
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  );
}
