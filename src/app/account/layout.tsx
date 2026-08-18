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
    <div style={{ backgroundColor: 'var(--color-bg)', display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <div className="container" style={{ flex: 1, padding: '120px var(--container-gutter) 60px', maxWidth: 'var(--container-max)', margin: '0 auto', width: '100%', display: 'flex', gap: '64px' }}>
        
        {/* Sidebar */}
        <aside style={{ flex: '0 0 240px' }}>
          <h2 className="label-caps" style={{ marginBottom: '32px', color: 'var(--color-ink)' }}>Account</h2>
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {links.map(link => {
              const isActive = pathname === link.href;
              return (
                <Link key={link.href} href={link.href as any} style={{ 
                  textDecoration: 'none', 
                  color: isActive ? 'var(--color-ink)' : 'var(--color-ink-muted)',
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  textTransform: 'uppercase',
                  letterSpacing: 'var(--tracking-wider)',
                  paddingBottom: '8px',
                  borderBottom: isActive ? '1px solid var(--color-ink)' : '1px solid transparent',
                  transition: 'color 0.3s, border-color 0.3s'
                }}>
                  {link.label}
                </Link>
              );
            })}
            <button style={{ 
              textAlign: 'left', background: 'none', border: 'none', color: 'var(--color-ink-muted)', 
              fontFamily: 'var(--font-body)', fontSize: '13px', textTransform: 'uppercase', letterSpacing: 'var(--tracking-wider)', 
              paddingBottom: '8px', marginTop: '24px', cursor: 'pointer' 
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
