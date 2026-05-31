'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

function OrderConfirmedContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--ivory)', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
      <div style={{ backgroundColor: 'var(--white)', padding: '64px 40px', textAlign: 'center', maxWidth: '600px', width: '100%', boxShadow: '0 4px 40px rgba(0,0,0,0.05)' }}>
        <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#E8F5E9', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', margin: '0 auto 24px' }}>
          ✓
        </div>
        
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '32px', color: 'var(--espresso)', marginBottom: '16px' }}>ORDER CONFIRMED</h1>
        <p style={{ color: 'var(--warm-grey)', marginBottom: '32px' }}>
          Thank you for shopping with ZEVRO. Your order has been successfully placed.
        </p>

        <div style={{ backgroundColor: 'var(--champagne)', padding: '24px', marginBottom: '40px' }}>
          <p style={{ fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--warm-grey)', marginBottom: '8px' }}>Order Number</p>
          <p className="order-id" style={{ fontSize: '24px', fontWeight: 600 }}>{orderId || 'ZEVRO-XXXXXX'}</p>
        </div>

        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href={`/track?orderId=${orderId}`} className="btn btn-primary">TRACK ORDER</Link>
          <Link href="/products" className="btn btn-outline-gold">CONTINUE SHOPPING</Link>
        </div>
      </div>
    </div>
  );
}

export default function OrderConfirmedPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmedContent />
    </Suspense>
  );
}
