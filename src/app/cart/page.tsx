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
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--espresso)', letterSpacing: '0.1em', marginBottom: '16px' }}>
            SHOPPING CART
          </h1>
          <div className="gold-rule" style={{ margin: '0 auto' }} />
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0' }}>
            <div style={{ fontSize: '64px', marginBottom: '24px' }}>🛒</div>
            <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '16px' }}>YOUR CART IS EMPTY</h2>
            <p style={{ color: 'var(--warm-grey)', marginBottom: '32px' }}>
              Looks like you haven't added anything to your cart yet.
            </p>
            <Link href="/products" className="btn btn-primary" style={{ padding: '16px 48px' }}>
              CONTINUE SHOPPING
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '64px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
            
            {/* Left: Cart Items */}
            <div style={{ flex: '1 1 600px', minWidth: '320px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '16px', borderBottom: '1px solid var(--espresso)' }}>
                <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em' }}>PRODUCT</span>
                <span style={{ fontSize: '12px', fontWeight: 600, letterSpacing: '0.1em' }}>TOTAL</span>
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
