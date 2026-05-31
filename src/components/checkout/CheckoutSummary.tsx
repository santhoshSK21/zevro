'use client';

import React from 'react';
import Image from 'next/image';
import { useCartStore } from '../../store/cartStore';

export default function CheckoutSummary() {
  const { items, total, savings } = useCartStore();

  const tax = total * 0.05; // 5%
  const shipping = total > 99900 ? 0 : 15000;
  const finalTotal = total + tax + shipping;

  return (
    <div style={{ backgroundColor: '#fff', padding: '40px', boxShadow: 'var(--shadow-sm)' }}>
      <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '32px' }}>ORDER SUMMARY</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px', borderBottom: '1px solid var(--linen)', paddingBottom: '32px' }}>
        {items.map(item => (
          <div key={item.sku} style={{ display: 'flex', gap: '16px' }}>
            <div style={{ position: 'relative', width: '64px', aspectRatio: '3/4', backgroundColor: 'var(--beige)' }}>
              <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
              <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: 'var(--espresso)', color: '#fff', width: '20px', height: '20px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px' }}>
                {item.quantity}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontSize: '13px', marginBottom: '4px' }}>{item.name}</h4>
              <p style={{ fontSize: '11px', color: 'var(--warm-grey)' }}>{item.color} | {item.size}</p>
            </div>
            <div style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }}>
              ₹{((item.price * item.quantity) / 100).toLocaleString('en-IN')}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: 'var(--warm-grey)' }}>Subtotal</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>₹{(total / 100).toLocaleString('en-IN')}</span>
        </div>
        {savings > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--success)' }}>
            <span>Discount</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>−₹{(savings / 100).toLocaleString('en-IN')}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: 'var(--warm-grey)' }}>Estimated GST (5%)</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>₹{(tax / 100).toLocaleString('en-IN')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: 'var(--warm-grey)' }}>Shipping</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{shipping === 0 ? 'FREE' : `₹${(shipping / 100).toLocaleString('en-IN')}`}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--linen)', paddingTop: '24px' }}>
        <span style={{ fontSize: '16px', fontWeight: 600 }}>Total</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 600 }}>
          ₹{(finalTotal / 100).toLocaleString('en-IN')}
        </span>
      </div>

    </div>
  );
}
