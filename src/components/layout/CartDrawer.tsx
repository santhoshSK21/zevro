'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useCartStore } from '../../store/cartStore';

export default function CartDrawer() {
  const { isDrawerOpen, closeDrawer, items, total, savings, updateQuantity, removeItem } = useCartStore();

  if (!isDrawerOpen) return null;

  return (
    <>
      <div 
        onClick={closeDrawer}
        style={{
          position: 'fixed', inset: 0, zIndex: 1999,
          backgroundColor: 'rgba(5, 5, 5, 0.4)',
          animation: 'fadeIn 0.3s ease'
        }}
      />
      
      <div style={{
        position: 'fixed', top: 0, right: 0, bottom: 0, zIndex: 2000,
        width: '100%', maxWidth: '400px',
        backgroundColor: 'var(--ivory)',
        display: 'flex', flexDirection: 'column',
        animation: 'slideLeft 0.35s ease forwards',
        boxShadow: '-4px 0 24px rgba(0,0,0,0.1)'
      }}>
        <div style={{ padding: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--linen)' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '20px' }}>MY CART ({items.length})</h2>
          <button onClick={closeDrawer} style={{ fontSize: '24px' }}>✕</button>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', margin: 'auto' }}>
              <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛒</div>
              <p style={{ color: 'var(--warm-grey)', marginBottom: '24px' }}>Your cart is empty</p>
              <button onClick={closeDrawer} className="btn btn-outline-gold">SHOP NOW</button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.sku} style={{ display: 'flex', gap: '16px' }}>
                <div style={{ position: 'relative', width: '80px', height: '106px', backgroundColor: 'var(--beige)' }}>
                  <Image src={item.image} alt={item.name} fill style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <h4 style={{ fontSize: '14px', marginBottom: '4px' }}>{item.name}</h4>
                  <p style={{ fontSize: '12px', color: 'var(--warm-grey)', marginBottom: '8px' }}>
                    {item.color} | {item.size} {item.material ? `| ${item.material}` : ''}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 'auto' }}>
                    <div style={{ display: 'flex', border: '1px solid var(--linen)', borderRadius: '4px', overflow: 'hidden' }}>
                      <button onClick={() => updateQuantity(item.sku, item.quantity - 1)} style={{ padding: '4px 8px' }}>-</button>
                      <span style={{ padding: '4px 12px', fontSize: '13px' }}>{item.quantity}</span>
                      <button onClick={() => updateQuantity(item.sku, item.quantity + 1)} style={{ padding: '4px 8px' }}>+</button>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontFamily: 'var(--font-mono)', fontSize: '14px' }}>₹{(item.price / 100).toFixed(2)}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div style={{ padding: '24px', borderTop: '1px solid var(--linen)', backgroundColor: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
              <span style={{ color: 'var(--warm-grey)' }}>Subtotal</span>
              <span style={{ fontFamily: 'var(--font-mono)' }}>₹{(total / 100).toFixed(2)}</span>
            </div>
            {savings > 0 && (
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px', color: 'var(--success)' }}>
                <span>Savings</span>
                <span style={{ fontFamily: 'var(--font-mono)' }}>-₹{(savings / 100).toFixed(2)}</span>
              </div>
            )}
            <p style={{ fontSize: '11px', color: 'var(--warm-grey)', marginBottom: '20px', textAlign: 'center' }}>
              Shipping & taxes calculated at checkout
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <Link href="/cart" onClick={closeDrawer} className="btn btn-ghost-gold btn-full">VIEW CART</Link>
              <Link href="/checkout" onClick={closeDrawer} className="btn btn-primary btn-full">CHECKOUT →</Link>
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
