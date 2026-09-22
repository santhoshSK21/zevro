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
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="container" style={{ padding: '0 20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 'clamp(24px, 4vw, 32px)', color: 'var(--color-ink)', letterSpacing: '0.1em', marginBottom: '12px' }}>
            SHOPPING BAG
          </h1>
          <div className="divider" style={{ margin: '0 auto', maxWidth: '80px' }} />
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <h2 className="display-serif" style={{ fontSize: 'clamp(18px, 3vw, 24px)', marginBottom: '16px', color: 'var(--color-ink)' }}>YOUR BAG IS EMPTY</h2>
            <p style={{ color: 'var(--color-ink-muted)', marginBottom: '28px', fontFamily: 'var(--font-body)', fontSize: '14px' }}>
              Discover handcrafted couture and modern silhouettes curated for you.
            </p>
            <Link href="/products" className="btn btn-primary" style={{ padding: '14px 36px', display: 'inline-block' }}>
              EXPLORE COLLECTION
            </Link>
          </div>
        ) : (
          <div className="cart-content-grid">
            
            {/* Left: Cart Items */}
            <div className="cart-items-column">
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '14px', borderBottom: '1px solid var(--color-stone)' }}>
                <span className="label-caps" style={{ fontSize: '11px' }}>PRODUCT</span>
                <span className="label-caps" style={{ fontSize: '11px' }}>TOTAL</span>
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

              <div style={{ marginTop: '32px' }}>
                <UpsellCarousel />
              </div>
            </div>

            {/* Right: Order Summary */}
            <div className="cart-summary-column">
              <OrderSummary />
            </div>

          </div>
        )}

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .cart-content-grid {
          display: flex;
          gap: 48px;
          align-items: flex-start;
          flex-wrap: wrap;
        }
        .cart-items-column {
          flex: 1 1 560px;
          min-width: 280px;
          width: 100%;
        }
        .cart-summary-column {
          flex: 1 1 340px;
          min-width: 280px;
          max-width: 440px;
          width: 100%;
        }
        @media (max-width: 900px) {
          .cart-content-grid {
            flex-direction: column;
            gap: 32px;
          }
          .cart-summary-column {
            max-width: 100%;
          }
        }
      `}} />
    </div>
  );
}
