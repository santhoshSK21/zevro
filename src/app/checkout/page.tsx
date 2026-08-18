import React from 'react';
import Link from 'next/link';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import CheckoutSummary from '../../components/checkout/CheckoutSummary';

export default function CheckoutPage() {
  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '64px' }}>
          <Link href="/cart" className="label-caps" style={{ color: 'var(--color-ink-muted)', textDecoration: 'none' }}>
            ← BACK TO CART
          </Link>
          <h1 className="display-serif" style={{ fontSize: 'var(--text-3xl)', color: 'var(--color-ink)', marginTop: '24px', marginBottom: '24px' }}>
            Checkout
          </h1>
          <div style={{ width: '40px', height: '1px', backgroundColor: 'var(--color-ink)', margin: '0 auto' }} />
        </div>

        <div style={{ display: 'flex', gap: '64px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
          
          <div style={{ flex: '1 1 600px', minWidth: '320px' }}>
            <CheckoutForm />
          </div>

          <div style={{ flex: '0 0 400px', minWidth: '320px' }}>
            <CheckoutSummary />
          </div>

        </div>

      </div>
    </div>
  );
}
