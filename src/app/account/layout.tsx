'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const links = [
    { href: '/account', label: 'My Dashboard' },
    { href: '/account/orders', label: 'My Orders' },
    { href: '/account/wishlist', label: 'Wishlist' },
    { href: '/account/addresses', label: 'Addresses' },
    { href: '/account/settings', label: 'Account Settings' }
  ];

  return (
    <div style={{ backgroundColor: 'var(--ivory)', display: 'flex', flexDirection: 'column' }}>
      <div className="container" style={{ flex: 1, padding: '160px 24px 60px', maxWidth: '1200px', margin: '0 auto', width: '100%', display: 'flex', gap: '40px' }}>
        
        {/* Sidebar */}
        <aside style={{ flex: '0 0 250px' }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', marginBottom: '24px', color: 'var(--espresso)' }}>MY ACCOUNT</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {links.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href as any} style={{ 
                  textDecoration: 'none', 
                  color: isActive ? 'var(--espresso)' : 'var(--warm-grey)',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '14px',
                  padding: '8px 0',
                  borderBottom: '1px solid var(--linen)',
                  transition: 'color 0.3s'
                }}>
                  {link.label}
                </Link>
              );
            })}
            <button style={{ 
              textAlign: 'left', background: 'none', border: 'none', color: 'var(--error)', 
              fontSize: '14px', padding: '8px 0', marginTop: '24px', cursor: 'pointer' 
            }}>
              Logout
            </button>
          </nav>
        </aside>

        {/* Content */}
        <div style={{ flex: 1 }}>
          {children}
        </div>

      </div>
    </div>
  );
}
