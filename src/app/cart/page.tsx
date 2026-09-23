'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '../../store/cartStore';
import CartItem from '../../components/cart/CartItem';
import OrderSummary from '../../components/cart/OrderSummary';
import UpsellCarousel from '../../components/cart/UpsellCarousel';
import { ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';

export default function CartPage() {
  const { items, updateQuantity, removeItem } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="cart-page-wrapper">
      <div className="cart-container">
        
        {/* Checkout Flow Steps */}
        <div className="cart-flow-steps">
          <div className="step-item active">
            <span className="step-num">01</span>
            <span className="step-label">Shopping Bag</span>
          </div>
          <div className="step-divider" />
          <div className="step-item">
            <span className="step-num">02</span>
            <span className="step-label">Delivery & Shipping</span>
          </div>
          <div className="step-divider" />
          <div className="step-item">
            <span className="step-num">03</span>
            <span className="step-label">Payment</span>
          </div>
        </div>

        {/* Page Header */}
        <div className="cart-header">
          <div className="cart-eyebrow">
            <Sparkles size={13} className="text-gold" />
            <span>CURATED BAG</span>
          </div>
          <h1 className="cart-title">Your Selected Garments</h1>
          <p className="cart-subtitle">Handcrafted couture tailored for modern distinction.</p>
        </div>

        {items.length === 0 ? (
          <div className="cart-empty-box">
            <div className="cart-empty-icon">👜</div>
            <h2 className="cart-empty-title">Your shopping bag is empty</h2>
            <p className="cart-empty-desc">
              Explore our latest Autumn / Winter runway collection and discover timeless silhouettes.
            </p>
            <Link href="/products" className="cart-btn-primary">
              EXPLORE THE COLLECTION
            </Link>
          </div>
        ) : (
          <div className="cart-content-grid">
            
            {/* Left: Cart Items */}
            <div className="cart-items-column">
              <div className="cart-table-heading">
                <span>GARMENT</span>
                <span>SUBTOTAL</span>
              </div>
              
              <div className="cart-items-list">
                {items.map(item => (
                  <CartItem 
                    key={item.sku} 
                    item={item} 
                    updateQuantity={updateQuantity} 
                    removeItem={removeItem} 
                  />
                ))}
              </div>

              {/* Atelier Guarantees */}
              <div className="cart-guarantees-grid">
                <div className="cart-guarantee-card">
                  <Truck size={18} className="text-gold" />
                  <div>
                    <p className="guarantee-title">Complimentary Shipping</p>
                    <p className="guarantee-desc">On all bespoke orders over ₹999 across India.</p>
                  </div>
                </div>
                <div className="cart-guarantee-card">
                  <RotateCcw size={18} className="text-gold" />
                  <div>
                    <p className="guarantee-title">7-Day Atelier Exchange</p>
                    <p className="guarantee-desc">Hassle-free size adjustment & return policy.</p>
                  </div>
                </div>
                <div className="cart-guarantee-card">
                  <ShieldCheck size={18} className="text-gold" />
                  <div>
                    <p className="guarantee-title">Artisan Quality Assurance</p>
                    <p className="guarantee-desc">Individually tailored in our private studio.</p>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '36px' }}>
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
        .cart-page-wrapper {
          background-color: var(--color-bg, #FAF8F5);
          min-height: 100vh;
          padding-top: 50px;
          padding-bottom: 80px;
        }
        .cart-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .text-gold {
          color: #C5A880;
        }

        /* Flow steps */
        .cart-flow-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 40px;
        }
        .step-item {
          display: flex;
          align-items: center;
          gap: 8px;
          opacity: 0.45;
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          font-weight: 600;
        }
        .step-item.active {
          opacity: 1;
          color: #121210;
        }
        .step-num {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          width: 22px;
          height: 22px;
          border-radius: 50%;
          border: 1px solid currentColor;
          font-size: 10px;
        }
        .step-item.active .step-num {
          background: #121210;
          color: #FAF8F5;
          border-color: #121210;
        }
        .step-divider {
          width: 40px;
          height: 1px;
          background: rgba(0, 0, 0, 0.15);
        }

        /* Header */
        .cart-header {
          text-align: center;
          margin-bottom: 40px;
        }
        .cart-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 10px;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: #C5A880;
          font-weight: 700;
          margin-bottom: 8px;
        }
        .cart-title {
          font-family: var(--font-display, serif);
          font-size: clamp(26px, 4vw, 36px);
          color: #121210;
          letter-spacing: 0.04em;
          margin: 0 0 8px 0;
          font-weight: 500;
        }
        .cart-subtitle {
          font-family: var(--font-body, sans-serif);
          font-size: 14px;
          color: #666;
          margin: 0;
        }

        /* Empty state */
        .cart-empty-box {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 12px;
          padding: 80px 24px;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.03);
        }
        .cart-empty-icon {
          font-size: 48px;
          margin-bottom: 20px;
        }
        .cart-empty-title {
          font-family: var(--font-display, serif);
          font-size: 24px;
          color: #121210;
          margin: 0 0 10px 0;
        }
        .cart-empty-desc {
          font-size: 14px;
          color: #777;
          margin: 0 0 28px 0;
          line-height: 1.6;
        }
        .cart-btn-primary {
          display: inline-block;
          background: #121210;
          color: #FAF8F5;
          padding: 14px 36px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .cart-btn-primary:hover {
          background: #C5A880;
          color: #121210;
        }

        /* Content Grid */
        .cart-content-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 40px;
          align-items: flex-start;
        }
        @media (max-width: 960px) {
          .cart-content-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
        .cart-table-heading {
          display: flex;
          justify-content: space-between;
          padding-bottom: 14px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.1);
          font-size: 11px;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: #888;
          font-weight: 600;
        }
        .cart-items-list {
          display: flex;
          flex-direction: column;
        }

        /* Guarantees */
        .cart-guarantees-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
          margin-top: 32px;
          padding-top: 24px;
          border-top: 1px solid rgba(0, 0, 0, 0.08);
        }
        .cart-guarantee-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 14px;
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.05);
          border-radius: 8px;
        }
        .guarantee-title {
          font-size: 12px;
          font-weight: 600;
          color: #121210;
          margin: 0 0 2px 0;
        }
        .guarantee-desc {
          font-size: 11px;
          color: #777;
          margin: 0;
          line-height: 1.4;
        }
      `}} />
    </div>
  );
}

