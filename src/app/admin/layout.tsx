'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/orders', label: 'Orders', icon: '📦' },
    { href: '/admin/products', label: 'Products', icon: '👗' },
    { href: '/admin/categories', label: 'Categories', icon: '🗂️' },
    { href: '/admin/customers', label: 'Customers', icon: '👥' },
    { href: '/admin/builder', label: 'Store Builder', icon: '🎨' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      
      {/* Admin Sidebar */}
      <aside style={{ width: '250px', backgroundColor: 'var(--espresso)', color: 'var(--ivory)', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', letterSpacing: '0.1em' }}>ZEVRO ADMIN</h1>
        </div>
        
        <nav style={{ flex: 1, padding: '24px 0' }}>
          {navItems.map(item => {
            const isActive = pathname === item.href;
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 24px',
                backgroundColor: isActive ? 'rgba(255,255,255,0.1)' : 'transparent',
                color: isActive ? 'var(--gold)' : 'var(--ivory)',
                textDecoration: 'none',
                borderLeft: isActive ? '4px solid var(--gold)' : '4px solid transparent',
                transition: 'all 0.2s'
              }}>
                <span>{item.icon}</span>
                <span style={{ fontSize: '14px' }}>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
          <Link href="/" style={{ color: 'var(--warm-grey)', fontSize: '13px', textDecoration: 'none' }}>← Back to Store</Link>
        </div>
      </aside>

      {/* Admin Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '70px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E9ECEF', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500 }}>Admin User</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--gold)', color: 'var(--espresso)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
          </div>
        </header>
        
        <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>

    </div>
  );
}
