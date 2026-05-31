'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { GiDress, GiSleevelessJacket, GiPoloShirt, GiLargeDress, GiSkirt, GiShoppingBag } from 'react-icons/gi';

export default function Footer() {
  const pathname = usePathname();
  if (pathname?.startsWith('/admin')) return null;

  const categoryIcons = [
    { name: 'DRESSES', icon: <GiDress size={24} />, href: '/products?category=western-wear&sub=dresses' },
    { name: 'TOPS', icon: <GiPoloShirt size={24} />, href: '/products?category=western-wear&sub=tops' },
    { name: 'KURTA SETS', icon: <GiSleevelessJacket size={24} />, href: '/products?category=ethnic-wear&sub=kurtis' },
    { name: 'SAREES', icon: <GiLargeDress size={24} />, href: '/products?category=ethnic-wear&sub=sarees' },
    { name: 'LEHENGAS', icon: <GiSkirt size={24} />, href: '/products?category=ethnic-wear&sub=lehengas' },
    { name: 'ACCESSORIES', icon: <GiShoppingBag size={24} />, href: '/products?category=accessories' }
  ];

  return (
    <footer style={{ backgroundColor: 'var(--black)', color: 'var(--ivory)' }}>
      {/* Category Icons Strip */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', padding: '32px 0' }}>
        <div className="container" style={{ display: 'flex', justifyContent: 'center', gap: '48px', flexWrap: 'wrap' }}>
          {categoryIcons.map((cat, i) => (
            <Link key={i} href={cat.href}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px', color: 'var(--gold)', cursor: 'pointer' }} className="footer-cat-icon">
                {cat.icon}
                <span style={{ fontSize: '10px', letterSpacing: '0.15em' }}>{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
      
      <div className="container footer-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '48px', marginBottom: '64px', paddingTop: '64px' }}>
        <div style={{ flex: 1.5 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '28px', letterSpacing: '0.15em', marginBottom: '16px' }}>ZEVRO</h2>
          <p style={{ fontSize: '12px', letterSpacing: '0.2em', color: 'var(--gold)', marginBottom: '24px' }}>WEAR TO INSPIRE</p>
          <p style={{ color: '#A0A0A0', fontSize: '14px', lineHeight: 1.6, marginBottom: '24px', maxWidth: '300px' }}>
            Crafting modern elegance with timeless traditions. Discover luxury fashion designed for the confident woman.
          </p>
          <div style={{ display: 'flex', gap: '16px' }}>
            <a href="#" style={{ color: '#fff', fontSize: '18px' }}>IN</a>
            <a href="#" style={{ color: '#fff', fontSize: '18px' }}>FB</a>
            <a href="#" style={{ color: '#fff', fontSize: '18px' }}>TW</a>
          </div>
        </div>

        <div>
          <h4 style={{ fontSize: '11px', letterSpacing: '0.15em', marginBottom: '24px', color: 'var(--gold)' }}>SHOP</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link href="/new-in" style={{ color: '#D0D0D0', fontSize: '14px' }}>New Arrivals</Link></li>
            <li><Link href="/western-wear" style={{ color: '#D0D0D0', fontSize: '14px' }}>Western Wear</Link></li>
            <li><Link href="/ethnic-wear" style={{ color: '#D0D0D0', fontSize: '14px' }}>Ethnic Wear</Link></li>
            <li><Link href="/indo-western" style={{ color: '#D0D0D0', fontSize: '14px' }}>Indo-Western</Link></li>
            <li><Link href="/accessories" style={{ color: '#D0D0D0', fontSize: '14px' }}>Accessories</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '11px', letterSpacing: '0.15em', marginBottom: '24px', color: 'var(--gold)' }}>HELP</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link href="/account" style={{ color: '#D0D0D0', fontSize: '14px' }}>My Account</Link></li>
            <li><Link href="/track" style={{ color: '#D0D0D0', fontSize: '14px' }}>Track Order</Link></li>
            <li><Link href="/returns" style={{ color: '#D0D0D0', fontSize: '14px' }}>Returns & Exchanges</Link></li>
            <li><Link href="/size-guide" style={{ color: '#D0D0D0', fontSize: '14px' }}>Size Guide</Link></li>
            <li><Link href="/faq" style={{ color: '#D0D0D0', fontSize: '14px' }}>FAQ</Link></li>
            <li><Link href="/contact" style={{ color: '#D0D0D0', fontSize: '14px' }}>Contact Us</Link></li>
          </ul>
        </div>

        <div>
          <h4 style={{ fontSize: '11px', letterSpacing: '0.15em', marginBottom: '24px', color: 'var(--gold)' }}>COMPANY</h4>
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <li><Link href="/about" style={{ color: '#D0D0D0', fontSize: '14px' }}>About Zevro</Link></li>
            <li><Link href="/careers" style={{ color: '#D0D0D0', fontSize: '14px' }}>Careers</Link></li>
            <li><Link href="/privacy-policy" style={{ color: '#D0D0D0', fontSize: '14px' }}>Privacy Policy</Link></li>
            <li><Link href="/terms" style={{ color: '#D0D0D0', fontSize: '14px' }}>Terms of Service</Link></li>
            <li><Link href="/shipping-policy" style={{ color: '#D0D0D0', fontSize: '14px' }}>Shipping Policy</Link></li>
          </ul>
        </div>

      </div>

      <div className="container">
        <div style={{ borderTop: '1px solid #222', paddingTop: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <p style={{ color: '#888', fontSize: '12px' }}>&copy; {new Date().getFullYear()} Zevro. All rights reserved. | Made in India 🇮🇳</p>
          <div style={{ display: 'flex', gap: '12px' }}>
            <span style={{ color: '#888', fontSize: '12px' }}>VISA</span>
            <span style={{ color: '#888', fontSize: '12px' }}>MASTERCARD</span>
            <span style={{ color: '#888', fontSize: '12px' }}>UPI</span>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .footer-cat-icon { transition: transform 0.3s; }
        .footer-cat-icon:hover { transform: translateY(-4px); }
        @media (max-width: 768px) {
          .footer-grid { padding-top: 40px !important; gap: 32px !important; margin-bottom: 40px !important; }
        }
      `}} />
    </footer>
  );
}
