'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminControlLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  // Do not show sidebar on login or setup
  if (pathname.includes('/login') || pathname.includes('/setup')) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/adminControl/logout', { method: 'POST' });
    router.push('/adminControl/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/adminControl/dashboard' },
    { name: 'Orders', path: '/adminControl/orders' },
    { name: 'Products', path: '/adminControl/products' },
    { name: 'Categories', path: '/adminControl/categories' },
    { name: 'Coupons', path: '/adminControl/coupons' },
    { name: 'Customers', path: '/adminControl/customers' },
    { name: 'Settings', path: '/adminControl/settings' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--black)', color: 'var(--ivory)' }}>
      {/* Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#111', borderRight: '1px solid #333', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '32px 24px', borderBottom: '1px solid #333' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '24px', color: 'var(--gold)', margin: 0 }}>Zevro</h1>
          <p style={{ color: '#888', fontSize: '12px', marginTop: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>Operator Console</p>
        </div>
        
        <nav style={{ padding: '24px 0', flex: 1 }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {navItems.map((item) => {
              const isActive = pathname.startsWith(item.path);
              return (
                <li key={item.name}>
                  <Link href={item.path} style={{
                    display: 'block',
                    padding: '12px 24px',
                    color: isActive ? 'var(--gold)' : '#ccc',
                    textDecoration: 'none',
                    fontFamily: 'var(--font-body)',
                    fontWeight: isActive ? 600 : 400,
                    backgroundColor: isActive ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                    borderLeft: isActive ? '4px solid var(--gold)' : '4px solid transparent',
                    transition: 'all 0.2s'
                  }}>
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid #333' }}>
          <button onClick={handleLogout} style={{
            width: '100%',
            padding: '12px',
            backgroundColor: 'transparent',
            border: '1px solid var(--gold)',
            color: 'var(--gold)',
            cursor: 'pointer',
            transition: 'all 0.2s'
          }}>
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: '32px', backgroundColor: '#1a1a1a', overflowY: 'auto', height: '100vh' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
