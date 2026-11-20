'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '../../store/cartStore';
import { X, Trash2, ShoppingBag, ShieldCheck, Truck, Sparkles, ArrowRight, Lock } from 'lucide-react';

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, getTotal, getSavings, updateQuantity, removeItem } = useCartStore();
  const total = getTotal();
  const savings = getSavings();

  if (!isDrawerOpen) return null;

  const FREE_SHIPPING_THRESHOLD = 99900; // ₹999.00 in paise
  const progressPercent = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));
  const amountRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);

  return (
    <>
      {/* Backdrop */}
      <div 
        onClick={closeDrawer}
        className="cart-drawer-backdrop"
      />
      
      {/* Drawer Panel */}
      <div className="cart-drawer-panel">
        {/* Header */}
        <div className="cart-drawer-header">
          <div className="cart-drawer-title-row">
            <ShoppingBag size={18} className="text-gold" />
            <h2 className="cart-drawer-title">
              SHOPPING BAG ({items.length})
            </h2>
          </div>
          <button 
            type="button"
            onClick={closeDrawer}
            className="cart-drawer-close"
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Free Shipping Progress Indicator */}
        {items.length > 0 && (
          <div className="cart-drawer-shipping-meter">
            <div className="meter-text-row">
              <Sparkles size={12} className="text-gold" />
              <span>
                {amountRemaining === 0 ? (
                  <strong className="text-free-ship">Unlocked: Complimentary Express Delivery!</strong>
                ) : (
                  <>Add <strong>₹{(amountRemaining / 100).toLocaleString('en-IN')}</strong> for Free Delivery</>
                )}
              </span>
            </div>
            <div className="meter-track">
              <div 
                className="meter-fill" 
                style={{ width: `${progressPercent}%` }} 
              />
            </div>
          </div>
        )}

        {/* Items Scroll List */}
        <div className="cart-drawer-items-list">
          {items.length === 0 ? (
            <div className="cart-drawer-empty">
              <div className="empty-bag-icon">
                <ShoppingBag size={36} strokeWidth={1.2} />
              </div>
              <h3 className="empty-bag-title">YOUR BAG IS EMPTY</h3>
              <p className="empty-bag-sub">
                Explore our curated collections of luxury silks and contemporary tailoring.
              </p>
              <button 
                type="button"
                onClick={closeDrawer} 
                className="empty-bag-btn"
              >
                DISCOVER CREATIONS
              </button>
            </div>
          ) : (
            items.map((item) => {
              const hasDiscount = item.originalPrice && item.originalPrice > item.price;
              const targetHref = item.productId ? `/products/${item.productId}` : '/products';
              return (
                <div key={item.sku} className="cart-drawer-item">
                  <div className="item-thumb-box">
                    <Link href={targetHref} onClick={closeDrawer}>
                      <Image 
                        src={item.image || '/pdp_hero_1.png'} 
                        alt={item.name} 
                        fill 
                        className="item-thumb-img"
                        sizes="72px"
                      />
                    </Link>
                  </div>

                  <div className="item-info-col">
                    <div className="item-header-row">
                      <Link href={targetHref} onClick={closeDrawer} className="item-title-link">
                        <h4 className="item-title">{item.name}</h4>
                      </Link>
                      <button 
                        type="button"
                        onClick={() => removeItem(item.sku)}
                        className="item-remove-btn"
                        aria-label={`Remove ${item.name}`}
                        title="Remove garment"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>

                    <div className="item-tags-row">
                      <span className="item-tag">{item.color}</span>
                      <span className="item-tag-sep">•</span>
                      <span className="item-tag">Size: {item.size}</span>
                    </div>

                    <div className="item-bottom-row">
                      {/* Quantity Stepper */}
                      <div className="item-qty-stepper">
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.sku, item.quantity - 1)}
                          className="qty-btn"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="qty-num">{item.quantity}</span>
                        <button 
                          type="button"
                          onClick={() => updateQuantity(item.sku, item.quantity + 1)}
                          className="qty-btn"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>

                      {/* Price Column */}
                      <div className="item-price-box">
                        <span className="item-price-main">
                          ₹{((item.price * item.quantity) / 100).toLocaleString('en-IN')}
                        </span>
                        {hasDiscount && (
                          <span className="item-price-mrp">
                            ₹{((item.originalPrice * item.quantity) / 100).toLocaleString('en-IN')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Actions */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div className="drawer-cost-breakdown">
              <div className="cost-row">
                <span className="cost-label">Subtotal</span>
                <span className="cost-val">₹{(total / 100).toLocaleString('en-IN')}</span>
              </div>
              {savings > 0 && (
                <div className="cost-row savings">
                  <span className="cost-label">Total Savings</span>
                  <span className="cost-val">−₹{(savings / 100).toLocaleString('en-IN')}</span>
                </div>
              )}
              <div className="cost-row tax-note">
                <span>Inclusive of all taxes & free shipping</span>
                <span className="text-gold">✦ Priority</span>
              </div>
            </div>

            <div className="drawer-actions-stack">
              <Link 
                href="/checkout" 
                onClick={closeDrawer} 
                className="drawer-checkout-btn"
              >
                <Lock size={14} />
                <span>PROCEED TO CHECKOUT</span>
              </Link>
              <Link 
                href="/cart" 
                onClick={closeDrawer} 
                className="drawer-viewbag-btn"
              >
                <span>VIEW COMPLETE BAG</span>
                <ArrowRight size={13} />
              </Link>
            </div>

            <div className="drawer-security-strip">
              <ShieldCheck size={14} className="text-gold" />
              <span>256-Bit SSL Encryption • 7-Day Doorstep Returns</span>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .cart-drawer-backdrop {
          position: fixed;
          inset: 0;
          z-index: 2500;
          background-color: rgba(20, 20, 18, 0.6);
          backdrop-filter: blur(4px);
          animation: drawerFadeIn 0.25s ease;
        }
        .cart-drawer-panel {
          position: fixed;
          top: 0;
          right: 0;
          bottom: 0;
          z-index: 2600;
          width: 100%;
          max-width: 420px;
          background-color: var(--color-bg);
          box-shadow: -8px 0 32px rgba(0, 0, 0, 0.18);
          display: flex;
          flex-direction: column;
          animation: drawerSlideIn 0.32s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .cart-drawer-header {
          padding: 20px 24px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid var(--color-stone);
          background: var(--color-surface);
        }
        .cart-drawer-title-row {
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .text-gold {
          color: var(--color-accent);
        }
        .cart-drawer-title {
          font-family: var(--font-ui);
          font-size: 12px;
          letter-spacing: 0.16em;
          color: var(--color-ink);
          font-weight: 700;
          margin: 0;
        }
        .cart-drawer-close {
          background: transparent;
          border: none;
          color: var(--color-ink-muted);
          cursor: pointer;
          display: flex;
          padding: 4px;
          transition: color 0.2s;
        }
        .cart-drawer-close:hover {
          color: var(--color-ink);
        }
        .cart-drawer-shipping-meter {
          padding: 12px 24px;
          background: var(--color-surface);
          border-bottom: 1px solid var(--color-stone);
        }
        .meter-text-row {
          display: flex;
          align-items: center;
          gap: 8px;
          font-family: var(--font-ui);
          font-size: 11px;
          color: var(--color-ink);
          margin-bottom: 8px;
        }
        .text-free-ship {
          color: #2E7D32;
        }
        .meter-track {
          width: 100%;
          height: 5px;
          background: var(--color-stone);
          border-radius: 3px;
          overflow: hidden;
        }
        .meter-fill {
          height: 100%;
          background: #C5A869;
          border-radius: 3px;
          transition: width 0.4s ease;
        }
        .cart-drawer-items-list {
          flex: 1;
          overflow-y: auto;
          padding: 20px 24px;
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .cart-drawer-empty {
          text-align: center;
          margin: auto;
          padding: 32px 0;
        }
        .empty-bag-icon {
          color: var(--color-ink-muted);
          margin-bottom: 16px;
        }
        .empty-bag-title {
          font-family: var(--font-display);
          font-size: 18px;
          color: var(--color-ink);
          margin: 0 0 8px 0;
        }
        .empty-bag-sub {
          font-family: var(--font-body);
          font-size: 13px;
          color: var(--color-ink-muted);
          line-height: 1.5;
          margin: 0 0 24px 0;
        }
        .empty-bag-btn {
          background: #141412;
          color: #FAF7F2;
          border: none;
          padding: 12px 24px;
          border-radius: 24px;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          cursor: pointer;
          transition: background 0.2s;
        }
        .empty-bag-btn:hover {
          background: var(--color-accent);
          color: #141412;
        }
        .cart-drawer-item {
          display: flex;
          gap: 14px;
          padding-bottom: 16px;
          border-bottom: 1px solid var(--color-stone);
        }
        .item-thumb-box {
          position: relative;
          width: 72px;
          aspect-ratio: 3/4;
          background: var(--color-surface);
          border-radius: 4px;
          overflow: hidden;
          flex-shrink: 0;
        }
        .item-thumb-img {
          object-fit: cover;
        }
        .item-info-col {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .item-header-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 8px;
        }
        .item-title-link {
          text-decoration: none;
          color: var(--color-ink);
        }
        .item-title {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          margin: 0;
          line-height: 1.3;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .item-title:hover {
          color: var(--color-accent);
        }
        .item-remove-btn {
          background: transparent;
          border: none;
          color: var(--color-ink-muted);
          cursor: pointer;
          padding: 2px;
          transition: color 0.15s;
          flex-shrink: 0;
        }
        .item-remove-btn:hover {
          color: #D32F2F;
        }
        .item-tags-row {
          display: flex;
          align-items: center;
          gap: 6px;
          margin-top: 4px;
          margin-bottom: 10px;
        }
        .item-tag {
          font-family: var(--font-ui);
          font-size: 11px;
          color: var(--color-ink-muted);
        }
        .item-tag-sep {
          color: var(--color-stone);
          font-size: 10px;
        }
        .item-bottom-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: auto;
        }
        .item-qty-stepper {
          display: inline-flex;
          align-items: center;
          border: 1px solid var(--color-stone);
          border-radius: 3px;
          background: var(--color-surface);
        }
        .qty-btn {
          width: 28px;
          height: 28px;
          background: transparent;
          border: none;
          color: var(--color-ink);
          font-size: 14px;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .qty-btn:hover {
          background: var(--color-stone-light);
        }
        .qty-num {
          width: 28px;
          text-align: center;
          font-family: var(--font-ui);
          font-size: 12px;
          font-weight: 600;
          color: var(--color-ink);
        }
        .item-price-box {
          text-align: right;
        }
        .item-price-main {
          font-family: var(--font-ui);
          font-size: 13px;
          font-weight: 700;
          color: var(--color-ink);
          display: block;
        }
        .item-price-mrp {
          font-family: var(--font-body);
          font-size: 11px;
          color: var(--color-ink-muted);
          text-decoration: line-through;
          display: block;
        }
        .cart-drawer-footer {
          padding: 20px 24px;
          background: var(--color-surface);
          border-top: 1px solid var(--color-stone);
        }
        .drawer-cost-breakdown {
          display: flex;
          flex-direction: column;
          gap: 6px;
          margin-bottom: 16px;
        }
        .cost-row {
          display: flex;
          justify-content: space-between;
          font-family: var(--font-ui);
          font-size: 12px;
          color: var(--color-ink);
        }
        .cost-row.savings {
          color: #2E7D32;
          font-weight: 600;
        }
        .cost-row.tax-note {
          font-size: 10px;
          color: var(--color-ink-muted);
          margin-top: 4px;
        }
        .cost-val {
          font-weight: 700;
        }
        .drawer-actions-stack {
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-bottom: 14px;
        }
        .drawer-checkout-btn {
          width: 100%;
          padding: 13px;
          background: #141412;
          color: #FAF7F2;
          border: none;
          border-radius: 4px;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          text-decoration: none;
          transition: background 0.2s;
        }
        .drawer-checkout-btn:hover {
          background: var(--color-accent);
          color: #141412;
        }
        .drawer-viewbag-btn {
          width: 100%;
          padding: 11px;
          background: transparent;
          color: var(--color-ink);
          border: 1px solid var(--color-stone);
          border-radius: 4px;
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          text-decoration: none;
          transition: all 0.2s;
        }
        .drawer-viewbag-btn:hover {
          border-color: var(--color-ink);
          background: #FFFFFF;
        }
        .drawer-security-strip {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          font-family: var(--font-ui);
          font-size: 10px;
          color: var(--color-ink-muted);
          letter-spacing: 0.04em;
        }
        @keyframes drawerFadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes drawerSlideIn {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}} />
    </>
  );
}
