import React from 'react';
import Link from 'next/link';
import CheckoutForm from '../../components/checkout/CheckoutForm';
import CheckoutSummary from '../../components/checkout/CheckoutSummary';

export default function CheckoutPage() {
  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', paddingTop: '100px', paddingBottom: '100px' }}>
      <div className="container">
        
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <Link href="/cart" style={{ fontSize: '13px', color: 'var(--warm-grey)', textDecoration: 'none' }}>
            ← BACK TO CART
          </Link>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--espresso)', letterSpacing: '0.1em', marginTop: '16px', marginBottom: '16px' }}>
            CHECKOUT
          </h1>
          <div className="gold-rule" style={{ margin: '0 auto' }} />
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
