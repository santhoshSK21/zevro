'use client';

import React from 'react';
import Link from 'next/link';

const MENUS: Record<string, { label: string; href: string; count?: string }[]> = {
  'WESTERN WEAR': [
    { label: 'Tops & Tees', href: '/category/western-wear?sub=tops' },
    { label: 'Dresses', href: '/category/western-wear?sub=dresses' },
    { label: 'Co-ord Sets', href: '/category/western-wear?sub=co-ords' },
    { label: 'Jumpsuits', href: '/category/western-wear?sub=jumpsuits' },
    { label: 'Trousers', href: '/category/western-wear?sub=trousers' },
    { label: 'Blazers', href: '/category/western-wear?sub=blazers' },
  ],
  'ETHNIC WEAR': [
    { label: 'Sarees', href: '/category/ethnic-wear?sub=sarees' },
    { label: 'Salwar Suits', href: '/category/ethnic-wear?sub=suits' },
    { label: 'Anarkalis', href: '/category/ethnic-wear?sub=anarkalis' },
    { label: 'Lehengas', href: '/category/ethnic-wear?sub=lehengas' },
    { label: 'Kurtis', href: '/category/ethnic-wear?sub=kurtis' },
    { label: 'Dupattas', href: '/category/ethnic-wear?sub=dupattas' },
  ],
  'INDO-WESTERN': [
    { label: 'Fusion Sets', href: '/category/indo-western?sub=fusion-sets' },
    { label: 'Indo Gowns', href: '/category/indo-western?sub=indo-gowns' },
    { label: 'Dhoti Sets', href: '/category/indo-western?sub=dhoti-sets' },
    { label: 'Cape Suits', href: '/category/indo-western?sub=cape-suits' },
  ],
  'ACCESSORIES': [
    { label: 'Bags & Clutches', href: '/category/accessories?sub=bags' },
    { label: 'Artisanal Jewellery', href: '/category/accessories?sub=jewellery' },
    { label: 'Luxury Footwear', href: '/category/accessories?sub=footwear' },
    { label: 'Belts & Scarves', href: '/category/accessories?sub=belts' },
  ]
};

export default function MegaMenu({ category, close }: { category: string; close: () => void }) {
  const links = MENUS[category];

  if (!links) return null;

  return (
    <div className="mega-glass-card" onMouseLeave={close}>
      <div className="mega-glass-header">
        <span className="mega-glass-title">{category}</span>
        <Link href={`/category/${category.toLowerCase().replace(/\s+/g, '-')}`} onClick={close} className="mega-view-all">
          View All →
        </Link>
      </div>

      <div className="mega-glass-grid">
        {links.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            onClick={close}
            className="mega-glass-item"
          >
            <span className="mega-item-dot" />
            <span className="mega-item-label">{link.label}</span>
          </Link>
        ))}
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .mega-glass-card {
          width: 440px;
          background: rgba(250, 248, 245, 0.88);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          padding: 20px 24px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12), 0 4px 12px rgba(0, 0, 0, 0.05);
          animation: megaFadeIn 0.22s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          color: #1A1816;
        }

        .mega-glass-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-bottom: 12px;
          margin-bottom: 12px;
          border-bottom: 1px solid rgba(0, 0, 0, 0.06);
        }

        .mega-glass-title {
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #1A1816;
        }

        .mega-view-all {
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: #99812A;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.2s ease;
        }
        .mega-view-all:hover {
          color: #D4AF37;
        }

        .mega-glass-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 6px 16px;
        }

        .mega-glass-item {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px 10px;
          border-radius: 6px;
          text-decoration: none;
          color: #2D2A26;
          transition: all 0.2s ease;
        }

        .mega-glass-item:hover {
          background: rgba(212, 175, 55, 0.12);
          color: #000;
          transform: translateX(3px);
        }

        .mega-item-dot {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #D4AF37;
          opacity: 0.6;
          transition: opacity 0.2s ease, transform 0.2s ease;
        }

        .mega-glass-item:hover .mega-item-dot {
          opacity: 1;
          transform: scale(1.4);
        }

        .mega-item-label {
          font-family: var(--font-body, sans-serif);
          font-size: 13px;
          font-weight: 500;
          letter-spacing: 0.02em;
        }

        @keyframes megaFadeIn {
          from {
            opacity: 0;
            transform: translateY(-6px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}} />
    </div>
  );
}
