import React from 'react';
import Link from 'next/link';

export default async function OrderConfirmedPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return (
    <div style={{ backgroundColor: 'var(--color-bg)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px' }}>
      <div style={{ backgroundColor: 'var(--color-white)', padding: '64px 40px', textAlign: 'center', maxWidth: '600px', width: '100%' }} className="fade-up">
        
        <div style={{ 
          width: '80px', height: '80px', 
          backgroundColor: 'var(--color-surface)', color: 'var(--color-ink)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 32px' 
        }}>
          ✓
        </div>
        
        <h1 className="display-serif" style={{ fontSize: 'var(--text-2xl)', color: 'var(--color-ink)', marginBottom: '16px' }}>
          Order Confirmed
        </h1>
        
        <p style={{ color: 'var(--color-ink-muted)', marginBottom: '32px', lineHeight: 1.6 }}>
          Thank you for your purchase. We've received your order and are getting it ready to be shipped. 
          You will receive an email confirmation shortly.
        </p>

        <div style={{ backgroundColor: 'var(--color-surface)', padding: '24px', marginBottom: '40px' }}>
          <p className="label-caps" style={{ marginBottom: '8px' }}>
            Order Number
          </p>
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: 'var(--text-xl)', color: 'var(--color-ink)', fontWeight: 500 }}>
            {id}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href={`/account/orders`} className="btn-primary" style={{ padding: '16px 32px' }}>
            Track Order
          </Link>
          <Link href="/products" className="btn-ghost" style={{ padding: '16px 32px' }}>
            Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}
