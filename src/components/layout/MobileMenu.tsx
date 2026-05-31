'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useUiStore } from '@/store/uiStore';

export default function MobileMenu() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUiStore();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  if (!isMobileMenuOpen) return null;

  const toggle = (cat: string) => setOpenCategory(c => c === cat ? null : cat);

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 2000,
      backgroundColor: 'var(--ivory)',
      overflowY: 'auto',
      animation: 'slideRight 0.35s ease forwards',
      display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ padding: '20px 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--linen)' }}>
        <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ fontFamily: 'var(--font-display)', fontSize: '22px', letterSpacing: '0.15em' }}>
          ZEVRO
        </Link>
        <button onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '24px', color: 'var(--espresso)' }}>✕</button>
      </div>

      <nav style={{ padding: '24px', flex: 1 }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <li>
            <Link href="/" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '18px', fontWeight: 500, letterSpacing: '0.1em' }}>HOME</Link>
          </li>
          <li>
            <Link href="/new-in" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '18px', fontWeight: 500, letterSpacing: '0.1em' }}>NEW IN</Link>
          </li>
          <li>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => toggle('western')}>
              <span style={{ fontSize: '18px', fontWeight: 500, letterSpacing: '0.1em' }}>WESTERN WEAR</span>
              <span style={{ transform: openCategory === 'western' ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>▼</span>
            </div>
            {openCategory === 'western' && (
              <ul style={{ listStyle: 'none', paddingLeft: '16px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li><Link href="/products?category=western-wear" onClick={() => setMobileMenuOpen(false)}>Shop All Western</Link></li>
                <li><Link href="/products?category=western-wear&sub=tops" onClick={() => setMobileMenuOpen(false)}>Tops & Tees</Link></li>
                <li><Link href="/products?category=western-wear&sub=dresses" onClick={() => setMobileMenuOpen(false)}>Dresses</Link></li>
              </ul>
            )}
          </li>
          <li>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} onClick={() => toggle('ethnic')}>
              <span style={{ fontSize: '18px', fontWeight: 500, letterSpacing: '0.1em' }}>ETHNIC WEAR</span>
              <span style={{ transform: openCategory === 'ethnic' ? 'rotate(180deg)' : 'none', transition: '0.2s' }}>▼</span>
            </div>
            {openCategory === 'ethnic' && (
              <ul style={{ listStyle: 'none', paddingLeft: '16px', marginTop: '16px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <li><Link href="/products?category=ethnic-wear" onClick={() => setMobileMenuOpen(false)}>Shop All Ethnic</Link></li>
                <li><Link href="/products?category=ethnic-wear&sub=sarees" onClick={() => setMobileMenuOpen(false)}>Sarees</Link></li>
                <li><Link href="/products?category=ethnic-wear&sub=suits" onClick={() => setMobileMenuOpen(false)}>Salwar Suits</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </nav>

      <div style={{ padding: '24px', backgroundColor: 'var(--beige)' }}>
        <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
          <li><Link href="/account" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '14px' }}>My Account</Link></li>
          <li><Link href="/account/orders" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '14px' }}>Track Order</Link></li>
          <li><Link href="/faq" onClick={() => setMobileMenuOpen(false)} style={{ fontSize: '14px' }}>FAQ & Support</Link></li>
        </ul>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideRight {
          from { transform: translateX(-100%); }
          to { transform: translateX(0); }
        }
      `}} />
    </div>
  );
}
