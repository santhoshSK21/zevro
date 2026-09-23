'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '../../store/cartStore';
import { Sparkles, Shield, ArrowRight, Tag, Check, X } from 'lucide-react';

export default function OrderSummary() {
  const { getTotal, getSavings, getItemCount, couponCode, couponDiscount, setCoupon } = useCartStore();
  const [promoCode, setPromoCode] = useState('');
  const [isValidating, setIsValidating] = useState(false);
  const [promoError, setPromoError] = useState('');

  const total = getTotal();
  const savings = getSavings();
  const itemCount = getItemCount();

  if (itemCount === 0) return null;

  const FREE_SHIPPING_THRESHOLD = 99900; // ₹999.00 in paise
  const progressPercent = Math.min(100, Math.round((total / FREE_SHIPPING_THRESHOLD) * 100));
  const amountRemaining = Math.max(0, FREE_SHIPPING_THRESHOLD - total);

  const tax = total * 0.05; // 5% GST
  const shipping = total >= FREE_SHIPPING_THRESHOLD ? 0 : 15000; // ₹150 if under ₹999
  const finalTotal = Math.max(0, total + tax + shipping - couponDiscount);

  const handleApplyPromo = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    if (!cleanCode) return;
    setPromoError('');
    setIsValidating(true);

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, cartValue: total })
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Invalid coupon code');
      }

      const discount = data.type === 'percent'
        ? Math.min(Math.round((total * data.value) / 100), data.maxDiscount || Infinity)
        : data.value;

      setCoupon(data.code, discount);
      setPromoCode('');
    } catch (err: any) {
      setPromoError(err.message || 'Failed to validate coupon');
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemovePromo = () => {
    setCoupon(null, 0);
    setPromoError('');
  };

  return (
    <div className="order-summary-card">
      {/* Free Shipping Progress Indicator */}
      <div className="shipping-meter-wrap">
        <div className="meter-label">
          <Sparkles size={13} className="text-gold" />
          <span>
            {amountRemaining === 0 ? (
              <strong className="text-success">You've unlocked Complimentary Express Shipping!</strong>
            ) : (
              <>Add <strong>₹{(amountRemaining / 100).toLocaleString('en-IN')}</strong> for Complimentary Shipping</>
            )}
          </span>
        </div>
        <div className="meter-track">
          <div className="meter-bar" style={{ width: `${progressPercent}%` }} />
        </div>
      </div>

      <h3 className="summary-title">ORDER SUMMARY</h3>
      
      {/* Cost Breakdown */}
      <div className="summary-breakdown">
        <div className="breakdown-row">
          <span className="row-label">Subtotal ({itemCount} {itemCount === 1 ? 'garment' : 'garments'})</span>
          <span className="row-val">₹{(total / 100).toLocaleString('en-IN')}</span>
        </div>
        
        {savings > 0 && (
          <div className="breakdown-row discount">
            <span className="row-label">Catalog Savings</span>
            <span className="row-val">−₹{(savings / 100).toLocaleString('en-IN')}</span>
          </div>
        )}

        {couponCode && couponDiscount > 0 && (
          <div className="breakdown-row discount">
            <span className="row-label">Promo ({couponCode})</span>
            <span className="row-val">−₹{(couponDiscount / 100).toLocaleString('en-IN')}</span>
          </div>
        )}
        
        <div className="breakdown-row">
          <span className="row-label">Estimated GST (5%)</span>
          <span className="row-val">₹{(tax / 100).toLocaleString('en-IN')}</span>
        </div>
        
        <div className="breakdown-row">
          <span className="row-label">Bespoke Courier</span>
          <span className="row-val">
            {shipping === 0 ? (
              <span className="badge-free">FREE</span>
            ) : (
              `₹${(shipping / 100).toLocaleString('en-IN')}`
            )}
          </span>
        </div>
      </div>

      {/* Promo Code Section */}
      {couponCode ? (
        <div className="promo-applied-badge">
          <div className="applied-info">
            <Check size={14} className="text-success" />
            <span><strong>{couponCode}</strong> applied (−₹{(couponDiscount / 100).toLocaleString('en-IN')})</span>
          </div>
          <button onClick={handleRemovePromo} className="promo-remove-btn" title="Remove coupon">
            <X size={14} />
          </button>
        </div>
      ) : (
        <form onSubmit={handleApplyPromo} className="promo-form">
          <div className="promo-input-wrap">
            <Tag size={13} className="promo-icon" />
            <input
              type="text"
              value={promoCode}
              onChange={(e) => setPromoCode(e.target.value.toUpperCase())}
              placeholder="Promotion Code (e.g. ZEVRO10)"
              className="promo-input"
              disabled={isValidating}
            />
            <button type="submit" className="promo-btn" disabled={isValidating || !promoCode.trim()}>
              {isValidating ? '...' : 'APPLY'}
            </button>
          </div>
          {promoError && <p className="promo-err">{promoError}</p>}
        </form>
      )}

      {/* Final Total */}
      <div className="summary-total-row">
        <div>
          <span className="total-label">Grand Total</span>
          <span className="total-tax-note">Includes all duties & taxes</span>
        </div>
        <span className="total-amount">
          ₹{(finalTotal / 100).toLocaleString('en-IN')}
        </span>
      </div>

      {/* Checkout CTA */}
      <Link href="/checkout" className="summary-checkout-btn">
        <span>PROCEED TO CHECKOUT</span>
        <ArrowRight size={15} />
      </Link>

      {/* Security note */}
      <div className="summary-security">
        <Shield size={13} className="text-gold" />
        <span>256-Bit SSL Encrypted & Protected Checkout</span>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .order-summary-card {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          padding: 28px 24px;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
          position: sticky;
          top: 100px;
        }
        .text-gold { color: #C5A880; }
        .text-success { color: #16A34A; }

        /* Free shipping meter */
        .shipping-meter-wrap {
          background: #FAF8F5;
          border: 1px solid rgba(197, 168, 128, 0.25);
          border-radius: 8px;
          padding: 12px 14px;
          margin-bottom: 24px;
        }
        .meter-label {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: #444;
          margin-bottom: 8px;
        }
        .meter-track {
          height: 5px;
          background: rgba(0, 0, 0, 0.08);
          border-radius: 10px;
          overflow: hidden;
        }
        .meter-bar {
          height: 100%;
          background: linear-gradient(90deg, #C5A880 0%, #D4AF37 100%);
          border-radius: 10px;
          transition: width 0.4s ease;
        }

        .summary-title {
          font-family: var(--font-display, serif);
          font-size: 18px;
          letter-spacing: 0.12em;
          color: #121210;
          margin: 0 0 20px 0;
          font-weight: 600;
        }

        .summary-breakdown {
          display: flex;
          flex-direction: column;
          gap: 12px;
          padding-bottom: 20px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.08);
          margin-bottom: 20px;
        }
        .breakdown-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 13px;
        }
        .row-label {
          color: #666;
        }
        .row-val {
          font-family: var(--font-ui, sans-serif);
          font-weight: 500;
          color: #121210;
        }
        .breakdown-row.discount .row-label,
        .breakdown-row.discount .row-val {
          color: #16A34A;
        }
        .badge-free {
          background: #DCFCE7;
          color: #15803D;
          font-size: 10px;
          font-weight: 700;
          padding: 2px 8px;
          border-radius: 4px;
          letter-spacing: 0.04em;
        }

        /* Promo */
        .promo-form {
          margin-bottom: 24px;
        }
        .promo-applied-badge {
          display: flex;
          align-items: center;
          justify-content: space-between;
          background: #F0FDF4;
          border: 1px solid #BBF7D0;
          border-radius: 6px;
          padding: 10px 14px;
          margin-bottom: 24px;
          font-size: 12px;
          color: #166534;
        }
        .applied-info {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .promo-remove-btn {
          background: none;
          border: none;
          color: #888;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 2px;
          transition: color 0.2s ease;
        }
        .promo-remove-btn:hover {
          color: #EF4444;
        }
        .promo-input-wrap {
          display: flex;
          border: 1px solid rgba(0, 0, 0, 0.12);
          border-radius: 6px;
          overflow: hidden;
          background: #FAF8F5;
          align-items: center;
          padding-left: 10px;
        }
        .promo-icon {
          color: #888;
        }
        .promo-input {
          flex: 1;
          border: none;
          background: transparent;
          padding: 10px 10px;
          font-size: 12px;
          outline: none;
          color: #121210;
        }
        .promo-btn {
          border: none;
          background: #121210;
          color: #FAF8F5;
          padding: 0 16px;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          cursor: pointer;
          height: 38px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s ease;
        }
        .promo-btn:hover:not(:disabled) {
          background: #C5A880;
          color: #121210;
        }
        .promo-err {
          font-size: 11px;
          color: #EF4444;
          margin: 6px 0 0 2px;
        }

        /* Total row */
        .summary-total-row {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 24px;
        }
        .total-label {
          display: block;
          font-size: 14px;
          font-weight: 600;
          color: #121210;
        }
        .total-tax-note {
          display: block;
          font-size: 11px;
          color: #888;
          margin-top: 2px;
        }
        .total-amount {
          font-family: var(--font-display, serif);
          font-size: 24px;
          font-weight: 700;
          color: #121210;
        }

        .summary-checkout-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          width: 100%;
          background: #121210;
          color: #FAF8F5;
          padding: 15px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-decoration: none;
          box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
          transition: all 0.2s ease;
        }
        .summary-checkout-btn:hover {
          background: #C5A880;
          color: #121210;
          transform: translateY(-1px);
        }
        .summary-security {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 16px;
          font-size: 11px;
          color: #888;
        }
      `}} />
    </div>
  );
}

