'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCartStore } from '../../store/cartStore';
import { useConfigStore } from '../../store/configStore';

export default function CheckoutSummary() {
  const { items, total, savings, couponCode, couponDiscount, setCoupon } = useCartStore();
  const { config, fetchConfig } = useConfigStore();
  const [couponInput, setCouponInput] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    if (!config) fetchConfig();
  }, [config, fetchConfig]);

  const tax = total * 0.05; // 5%
  const shippingThreshold = config?.freeShippingThreshold ?? 99900;
  const shippingFee = config?.shippingCharge ?? 15000;
  const currencySymbol = config?.currencySymbol ?? '₹';
  
  const shipping = total > shippingThreshold ? 0 : shippingFee;
  const finalTotal = total + tax + shipping - couponDiscount;

  const applyCoupon = async () => {
    setValidatingCoupon(true);
    setCouponError('');
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: couponInput, cartValue: total })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid coupon');
      
      const discount = data.type === 'percent' 
        ? Math.min((total * data.value) / 100, data.maxDiscount || Infinity)
        : data.value;
        
      setCoupon(data.code, discount);
      setCouponInput('');
    } catch (e: any) {
      setCouponError(e.message);
    } finally {
      setValidatingCoupon(false);
    }
  };

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
              {currencySymbol}{((item.price * item.quantity) / 100).toLocaleString('en-IN')}
            </div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input 
            type="text" 
            placeholder="Discount Code" 
            value={couponInput} 
            onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
            style={{ flex: 1, padding: '12px', border: '1px solid var(--linen)', outline: 'none' }} 
          />
          <button 
            type="button" 
            onClick={applyCoupon}
            disabled={!couponInput || validatingCoupon}
            style={{ padding: '0 24px', backgroundColor: 'var(--espresso)', color: '#fff', border: 'none', cursor: (!couponInput || validatingCoupon) ? 'not-allowed' : 'pointer' }}
          >
            {validatingCoupon ? '...' : 'APPLY'}
          </button>
        </div>
        {couponError && <p style={{ color: 'var(--error)', fontSize: '12px' }}>{couponError}</p>}
        {couponCode && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 12px', backgroundColor: '#F8F9FA', border: '1px solid var(--linen)', fontSize: '13px' }}>
            <span><span style={{ fontWeight: 600 }}>{couponCode}</span> applied</span>
            <button onClick={() => setCoupon(null, 0)} style={{ background: 'none', border: 'none', color: 'var(--warm-grey)', cursor: 'pointer' }}>✕ Remove</button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: 'var(--warm-grey)' }}>Subtotal</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{currencySymbol}{(total / 100).toLocaleString('en-IN')}</span>
        </div>
        {savings > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: 'var(--success)' }}>
            <span>Discount {couponCode ? `(${couponCode})` : ''}</span>
            <span style={{ fontFamily: 'var(--font-mono)' }}>−{currencySymbol}{(savings / 100).toLocaleString('en-IN')}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: 'var(--warm-grey)' }}>Estimated GST (5%)</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{currencySymbol}{(tax / 100).toLocaleString('en-IN')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px' }}>
          <span style={{ color: 'var(--warm-grey)' }}>Shipping</span>
          <span style={{ fontFamily: 'var(--font-mono)' }}>{shipping === 0 ? 'FREE' : `${currencySymbol}${(shipping / 100).toLocaleString('en-IN')}`}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--linen)', paddingTop: '24px' }}>
        <span style={{ fontSize: '16px', fontWeight: 600 }}>Total</span>
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '24px', fontWeight: 600 }}>
          {currencySymbol}{(finalTotal / 100).toLocaleString('en-IN')}
        </span>
      </div>

    </div>
  );
}
