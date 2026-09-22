import React from 'react';
import Link from 'next/link';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import CheckoutSummary from '../../components/checkout/CheckoutSummary';

export default function CheckoutPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', paddingTop: '80px', paddingBottom: '80px' }}>
      <div className="container" style={{ padding: '0 20px' }}>
        
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <Link href="/cart" className="label-caps" style={{ color: 'var(--color-ink-muted)', textDecoration: 'none', fontSize: '11px' }}>
            ← BACK TO CART
          </Link>
          <h1 className="display-serif" style={{ fontSize: 'clamp(24px, 4vw, 34px)', color: 'var(--color-ink)', marginTop: '16px', marginBottom: '16px' }}>
            Checkout
          </h1>
          <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-ink)', margin: '0 auto' }} />
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
        .checkout-content-grid {
          display: flex;
          gap: 48px;
          align-items: flex-start;
          flex-wrap: wrap;
        }
        .checkout-form-column {
          flex: 1 1 540px;
          min-width: 280px;
          width: 100%;
        }
        .checkout-summary-column {
          flex: 1 1 360px;
          min-width: 280px;
          max-width: 440px;
          width: 100%;
        }
        @media (max-width: 900px) {
          .checkout-content-grid {
            flex-direction: column-reverse;
            gap: 32px;
          }
          .checkout-summary-column {
            max-width: 100%;
          }
        }
      `}} />
    </div>
  );
}
