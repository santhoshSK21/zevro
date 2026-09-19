'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '../../store/cartStore';
import CartItem from '../../components/cart/CartItem';
import OrderSummary from '../../components/cart/OrderSummary';
import UpsellCarousel from '../../components/cart/UpsellCarousel';

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--color-ink)', letterSpacing: '0.1em', marginBottom: '16px' }}>
            SHOPPING BAG
          </h1>
          <div className="divider" style={{ margin: '0 auto', maxWidth: '100px' }} />
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <h2 className="display-serif" style={{ fontSize: 'var(--text-xl)', marginBottom: '16px', color: 'var(--color-ink)' }}>YOUR BAG IS EMPTY</h2>
            <p style={{ color: 'var(--color-ink-muted)', marginBottom: '32px', fontFamily: 'var(--font-body)' }}>
              Discover pieces curated for your wardrobe.
            </p>
            <Link href="/products" className="btn btn-primary" style={{ padding: '16px 48px' }}>
              SHOP NEW ARRIVALS
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '64px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            
            {/* Left: Cart Items */}
            <div style={{ flex: '1 1 600px', minWidth: '320px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--color-stone)' }}>
                <span className="label-caps">PRODUCT</span>
                <span className="label-caps">TOTAL</span>
              </div>
              
              <div>
                {items.map(item => (
                  <CartItem 
                    key={item.sku} 
                    item={item} 
                    updateQuantity={updateQuantity} 
                    removeItem={removeItem} 
                  />
                ))}
              </div>

              <UpsellCarousel />
            </div>

            {/* Right: Order Summary */}
            <div style={{ flex: '0 0 380px', minWidth: '320px' }}>
              <OrderSummary />
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
