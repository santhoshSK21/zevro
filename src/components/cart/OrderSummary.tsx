'use client';

import React from 'react';
import Link from 'next/link';
import { useCartStore } from '../../store/cartStore';

export default function OrderSummary() {
  const { getTotal, getSavings, getItemCount } = useCartStore();
  const total = getTotal();
  const savings = getSavings();
  const itemCount = getItemCount();

  if (itemCount === 0) return null;

  const tax = total * 0.05; // Dummy 5% GST
  const shipping = total > 99900 ? 0 : 15000;
  const finalTotal = total + tax + shipping;

  return (
    <div style={{ backgroundColor: '#fff', padding: '32px', boxShadow: 'var(--shadow-sm)', position: 'sticky', top: '100px' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '0.1em', marginBottom: '24px' }}>ORDER SUMMARY</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px', borderBottom: '1px solid var(--color-stone)', paddingBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: 'var(--color-ink-muted)' }}>Subtotal ({itemCount} items)</span>
          <span style={{ fontFamily: 'var(--font-ui)' }}>₹{(total / 100).toLocaleString('en-IN')}</span>
        </div>
        
        {savings > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#2A7A2A' }}>
            <span>Discount</span>
            <span style={{ fontFamily: 'var(--font-ui)' }}>−₹{(savings / 100).toLocaleString('en-IN')}</span>
          </div>
        )}
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: 'var(--color-ink-muted)' }}>Estimated GST (5%)</span>
          <span style={{ fontFamily: 'var(--font-ui)' }}>₹{(tax / 100).toLocaleString('en-IN')}</span>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: 'var(--color-ink-muted)' }}>Shipping</span>
          <span style={{ fontFamily: 'var(--font-ui)' }}>
            {shipping === 0 ? 'FREE' : `₹${(shipping / 100).toLocaleString('en-IN')}`}
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '32px' }}>
        <span style={{ fontSize: '16px', fontWeight: 600 }}>Total</span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '24px', fontWeight: 600 }}>
          ₹{(finalTotal / 100).toLocaleString('en-IN')}
        </span>
      </div>

      <Link href="/checkout" className="btn btn-primary btn-full" style={{ padding: '16px', display: 'flex', justifyContent: 'center' }}>
        PROCEED TO CHECKOUT
      </Link>

      <div style={{ marginTop: '24px', display: 'flex', gap: '16px', justifyContent: 'center' }}>
        {/* Payment Icons Placeholder */}
        <span style={{ fontSize: '24px', color: 'var(--color-ink-muted)' }}>💳</span>
        <span style={{ fontSize: '24px', color: 'var(--color-ink-muted)' }}>🏦</span>
        <span style={{ fontSize: '24px', color: 'var(--color-ink-muted)' }}>📱</span>
      </div>
    </div>
  );
}
