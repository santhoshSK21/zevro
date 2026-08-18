'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '../../store/cartStore';

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, total, savings, updateQuantity } = useCartStore();

  if (!isDrawerOpen) return null;

  return (
    <>
      <div 
        onClick={closeDrawer}
        style={{
          position: 'fixed', inset: 0, zIndex: 1999,
          backgroundColor: 'rgba(0, 0, 0, 0.2)',
          animation: 'fadeIn 0.3s ease'
        }}
      />
      
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 2000,
        width: '100%', maxWidth: '400px',
        backgroundColor: 'var(--color-bg)',
        borderLeft: '1px solid var(--color-stone)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideLeft 0.35s ease forwards',
      }}>
        <div style={{ padding: '32px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--color-stone)' }}>
          <h2 className="label-caps" style={{ color: 'var(--color-ink)' }}>Cart ({items.length})</h2>
          <button onClick={closeDrawer} style={{ fontSize: '24px', color: 'var(--color-ink)', background: 'transparent', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto' }}>
              <p style={{ color: 'var(--color-ink-muted)', marginBottom: '24px' }}>Your cart is empty.</p>
              <button onClick={closeDrawer} className="btn btn-outline-dark">SHOP NOW</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.sku} style={{ display: 'flex', gap: '16px' }}>
                <div style={{ position: 'relative', width: '80px', aspectRatio: '3/4', backgroundColor: 'var(--color-surface)', overflow: 'hidden' }}>
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontFamily: 'var(--font-body)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', marginBottom: '4px' }}>{item.name}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--color-ink-muted)', marginBottom: '12px' }}>
                    {item.color} | {item.size}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <button onClick={() => updateQuantity(item.sku, item.quantity - 1)} style={{ background: 'transparent', border: 'none', fontSize: '16px', cursor: 'pointer' }}>-</button>
                      <span style={{ fontSize: '13px' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.sku, item.quantity + 1)} style={{ background: 'transparent', border: 'none', fontSize: '16px', cursor: 'pointer' }}>+</button>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontFamily: 'var(--font-ui)', fontSize: '13px' }}>₹{(item.price / 100).toLocaleString('en-IN')}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: '32px 24px', borderTop: '1px solid var(--color-stone)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span className="label-caps" style={{ color: 'var(--color-ink)' }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-ui)' }}>₹{(total / 100).toLocaleString('en-IN')}</span>
            </div>
            {savings > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--color-ink-muted)' }}>
                <span className="label-caps">Savings</span>
                <span style={{ fontFamily: 'var(--font-ui)' }}>-₹{(savings / 100).toLocaleString('en-IN')}</span>
              </div>
            )}
            <p style={{ fontSize: '11px', color: 'var(--color-ink-muted)', marginBottom: '24px', textAlign: 'center' }}>
              Shipping & taxes calculated at checkout
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <Link href="/cart" onClick={closeDrawer} className="btn btn-outline-dark" style={{ width: '100%' }}>VIEW CART</Link>
              <Link href="/checkout" onClick={closeDrawer} className="btn btn-primary" style={{ width: '100%' }}>CHECKOUT</Link>
            </div>
          </div>
        )}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideLeft {
          from { transform: translateX(100%); }
          to { transform: translateX(0); }
        }
      `}} />
    </>
  );
}
