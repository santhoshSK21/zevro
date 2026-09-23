import React from 'react';
import Link from 'next/link';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import CheckoutSummary from '../../components/checkout/CheckoutSummary';
import { Sparkles, ArrowLeft, ShieldCheck, Lock } from 'lucide-react';

export default function CheckoutPage() {
  return (
    <div className="checkout-page-wrapper">
      <div className="checkout-container">
        
        {/* Checkout Flow Steps */}
        <div className="checkout-flow-steps">
          <Link href="/cart" className="step-item completed">
            <span className="step-num">✓</span>
            <span className="step-label">Shopping Bag</span>
          </Link>
          <div className="step-divider active" />
          <div className="step-item active">
            <span className="step-num">02</span>
            <span className="step-label">Delivery & Shipping</span>
          </div>
          <div className="step-divider" />
          <div className="step-item">
            <span className="step-num">03</span>
            <span className="step-label">Payment</span>
          </div>
        </div>

        {/* Header */}
        <div className="checkout-header">
          <Link href="/cart" className="checkout-back-link">
            <ArrowLeft size={13} />
            <span>RETURN TO SHOPPING BAG</span>
          </Link>
          <div className="checkout-badge">
            <Lock size={12} className="text-gold" />
            <span>ENCRYPTED BESPOKE ATELIER CHECKOUT</span>
          </div>
          <h1 className="checkout-title">Finalize Your Order</h1>
        </div>

        <div className="checkout-content-grid">
          <div className="checkout-form-column">
            <CheckoutForm />
          </div>

          <div className="checkout-summary-column">
            <CheckoutSummary />
          </div>
        </div>

      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .checkout-page-wrapper {
          background-color: var(--color-bg, #FAF8F5);
          min-height: 100vh;
          padding-top: 40px;
          padding-bottom: 80px;
        }
        .checkout-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 0 24px;
        }
        .text-gold { color: #C5A880; }

        /* Flow steps */
        .checkout-flow-steps {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          margin-bottom: 36px;
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
          text-decoration: none;
          color: inherit;
        }
        .step-item.active {
          opacity: 1;
          color: #121210;
        }
        .step-item.completed {
          opacity: 0.85;
          color: #16A34A;
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
        .step-item.completed .step-num {
          background: #DCFCE7;
          color: #15803D;
          border-color: #15803D;
        }
        .step-divider {
          width: 40px;
          height: 1px;
          background: rgba(0, 0, 0, 0.15);
        }
        .step-divider.active {
          background: #121210;
        }

        /* Header */
        .checkout-header {
          text-align: center;
          margin-bottom: 36px;
        }
        .checkout-back-link {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #888;
          text-decoration: none;
          margin-bottom: 12px;
          transition: color 0.2s ease;
        }
        .checkout-back-link:hover {
          color: #121210;
        }
        .checkout-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 4px 12px;
          border-radius: 20px;
          background: rgba(197, 168, 128, 0.12);
          border: 1px solid rgba(197, 168, 128, 0.3);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #121210;
          font-weight: 600;
          margin-bottom: 10px;
        }
        .checkout-title {
          font-family: var(--font-display, serif);
          font-size: clamp(24px, 3.5vw, 32px);
          color: #121210;
          margin: 0;
          font-weight: 500;
          letter-spacing: 0.04em;
        }

        /* Content Grid */
        .checkout-content-grid {
          display: grid;
          grid-template-columns: 1fr 380px;
          gap: 40px;
          align-items: flex-start;
        }
        @media (max-width: 960px) {
          .checkout-content-grid {
            grid-template-columns: 1fr;
            gap: 32px;
          }
        }
        .checkout-form-column {
          width: 100%;
        }
        .checkout-summary-column {
          width: 100%;
        }
      `}} />
    </div>
  );
}

