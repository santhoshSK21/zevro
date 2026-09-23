'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useCartStore } from '../../store/cartStore';
import { useConfigStore } from '../../store/configStore';

export default function CheckoutSummary() {
  const { items, getTotal, getSavings, couponCode, couponDiscount, setCoupon } = useCartStore();
  const { config, fetchConfig } = useConfigStore();
  const [couponInput, setCouponInput] = useState('');
  const [validatingCoupon, setValidatingCoupon] = useState(false);
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    if (!config) fetchConfig();
  }, [config, fetchConfig]);

  const total = getTotal();
  const savings = getSavings();
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
    <div style={{ backgroundColor: 'var(--color-bg)', padding: '32px', border: '1px solid var(--color-stone)' }}>
      <h3 className="label-caps" style={{ color: 'var(--color-ink)', marginBottom: '32px' }}>Order Summary</h3>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px', marginBottom: '32px', borderBottom: '1px solid var(--color-stone)', paddingBottom: '32px' }}>
        {items.map(item => (
          <div key={item.sku} style={{ display: 'flex', gap: '16px' }}>
            <div style={{ position: 'relative', width: '64px', aspectRatio: '3/4', backgroundColor: 'var(--color-surface)', overflow: 'hidden' }}>
              <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
              <span style={{ position: 'absolute', top: 0, right: 0, backgroundColor: 'var(--color-ink)', color: 'var(--color-white)', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontFamily: 'var(--font-ui)' }}>
                {item.quantity}
              </span>
            </div>
            <div style={{ flex: 1 }}>
              <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '12px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: '4px' }}>{item.name}</h4>
              <p style={{ fontSize: '11px', color: 'var(--color-ink-muted)' }}>{item.color} | {item.size}</p>
            </div>
            <div style={{ fontFamily: 'var(--font-ui)', fontSize: '13px' }}>
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
            style={{ flex: 1, padding: '12px', border: '1px solid var(--color-stone)', background: 'transparent', outline: 'none', fontFamily: 'var(--font-body)', fontSize: '13px' }} 
          />
          <button 
            type="button" 
            onClick={applyCoupon}
            disabled={!couponInput || validatingCoupon}
            className="btn btn-primary"
            style={{ padding: '0 24px', border: 'none', cursor: (!couponInput || validatingCoupon) ? 'not-allowed' : 'pointer' }}
          >
            {validatingCoupon ? '...' : 'APPLY'}
          </button>
        </div>
        {couponError && <p style={{ color: 'var(--color-ink)', fontSize: '12px' }}>{couponError}</p>}
        {couponCode && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px', border: '1px solid var(--color-stone)', fontSize: '13px' }}>
            <span><span style={{ fontWeight: 500 }}>{couponCode}</span> applied</span>
            <button onClick={() => setCoupon(null, 0)} style={{ background: 'none', border: 'none', color: 'var(--color-ink-muted)', cursor: 'pointer' }}>✕</button>
          </div>
        )}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: 'var(--color-ink-muted)' }}>Subtotal</span>
          <span style={{ fontFamily: 'var(--font-ui)' }}>{currencySymbol}{(total / 100).toLocaleString('en-IN')}</span>
        </div>
        {savings > 0 && (
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--color-ink-muted)' }}>
            <span>Discount {couponCode ? `(${couponCode})` : ''}</span>
            <span style={{ fontFamily: 'var(--font-ui)' }}>−{currencySymbol}{(savings / 100).toLocaleString('en-IN')}</span>
          </div>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: 'var(--color-ink-muted)' }}>Estimated GST (5%)</span>
          <span style={{ fontFamily: 'var(--font-ui)' }}>{currencySymbol}{(tax / 100).toLocaleString('en-IN')}</span>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px' }}>
          <span style={{ color: 'var(--color-ink-muted)' }}>Shipping</span>
          <span style={{ fontFamily: 'var(--font-ui)' }}>{shipping === 0 ? 'FREE' : `${currencySymbol}${(shipping / 100).toLocaleString('en-IN')}`}</span>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--color-stone)', paddingTop: '24px' }}>
        <span className="label-caps">Total</span>
        <span style={{ fontFamily: 'var(--font-ui)', fontSize: '20px' }}>
          {currencySymbol}{(finalTotal / 100).toLocaleString('en-IN')}
        </span>
      </div>

    </div>
  );
}
