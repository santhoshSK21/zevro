'use client';

import React from 'react';
import Link from 'next/link';

const MENUS: Record<string, any> = {
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
  ],
  'ACCESSORIES': [
    { label: 'Bags', href: '/category/accessories?sub=bags' },
    { label: 'Jewellery', href: '/category/accessories?sub=jewellery' },
    { label: 'Footwear', href: '/category/accessories?sub=footwear' },
  ]
};

export default function MegaMenu({ category, close }: { category: string, close: () => void }) {
  const links = MENUS[category];

  if (!links) return null;

  return (
    <div className="mega-editorial">
      <div className="mega-col">
        <ul className="mega-link-list">
          {links.map((link: any) => (
            <li key={link.label}>
              <Link href={link.href} onClick={close} className="mega-link">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .mega-editorial {
          padding: var(--space-12) var(--container-gutter);
          background: var(--color-bg);
          border-top: var(--border-hairline);
        }
        .mega-link-list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: var(--space-4);
        }
        .mega-link {
          font-family: var(--font-body);
          font-size: var(--text-sm);
          color: var(--color-ink);
          text-transform: uppercase;
          letter-spacing: var(--tracking-wider);
        }
        .mega-link:hover {
          color: var(--color-ink-muted);
        }
      `}} />
    </div>
  );
}
