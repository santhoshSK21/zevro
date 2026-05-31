import React from 'react';
import Link from 'next/link';

export default function OrderConfirmedPage({ params }: { params: { id: string } }) {
  return (
    <div style={{ backgroundColor: 'var(--ivory)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '100px 24px' }}>
      <div style={{ backgroundColor: '#fff', padding: '64px 40px', textAlign: 'center', maxWidth: '600px', width: '100%', boxShadow: 'var(--shadow-sm)' }} className="fade-up">
        
        <div style={{ 
          width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--beige)', color: 'var(--gold)', 
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 32px' 
        }}>
          ✓
        </div>
        
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--espresso)', marginBottom: '16px' }}>
          ORDER CONFIRMED
        </h1>
        
        <p style={{ color: 'var(--warm-grey)', marginBottom: '32px', lineHeight: 1.6 }}>
          Thank you for your purchase. We've received your order and are getting it ready to be shipped. 
          You will receive an email confirmation shortly.
        </p>

        <div style={{ backgroundColor: 'var(--beige)', padding: '24px', marginBottom: '40px' }}>
          <p style={{ fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'var(--warm-grey)', marginBottom: '8px' }}>
            ORDER NUMBER
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', color: 'var(--espresso)', fontWeight: 600 }}>
            {params.id}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href={`/account/orders`} className="btn btn-primary" style={{ padding: '16px 32px' }}>
            TRACK ORDER
          </Link>
          <Link href="/products" className="btn btn-outline-gold" style={{ padding: '16px 32px' }}>
            CONTINUE SHOPPING
          </Link>
        </div>

      </div>
    </div>
  );
}
