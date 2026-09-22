'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Shirt, 
  FolderTree, 
  TicketPercent, 
  Users, 
  Settings, 
  LogOut, 
  Menu, 
  X 
} from 'lucide-react';

export default function AdminControlLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Do not show sidebar on login or setup
  if (pathname.includes('/login') || pathname.includes('/setup')) {
    return <>{children}</>;
  }

  const handleLogout = async () => {
    await fetch('/api/adminControl/logout', { method: 'POST' });
    router.push('/adminControl/login');
  };

  const navItems = [
    { name: 'Dashboard', path: '/adminControl/dashboard', icon: LayoutDashboard },
    { name: 'Orders', path: '/adminControl/orders', icon: ShoppingBag },
    { name: 'Products', path: '/adminControl/products', icon: Shirt },
    { name: 'Categories', path: '/adminControl/categories', icon: FolderTree },
    { name: 'Coupons', path: '/adminControl/coupons', icon: TicketPercent },
    { name: 'Customers', path: '/adminControl/customers', icon: Users },
    { name: 'Settings', path: '/adminControl/settings', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0F172A', color: '#F8FAFC' }}>
      
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.6)',
            backdropFilter: 'blur(4px)',
            zIndex: 998
          }}
        />
      )}

      {/* Sidebar */}
      <aside 
        className="operator-sidebar"
        style={{ 
          width: '250px', 
          backgroundColor: '#0F172A', 
          borderRight: '1px solid #1E293B', 
          display: 'flex', 
          flexDirection: 'column',
          position: mobileMenuOpen ? 'fixed' : 'relative',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 999,
          transition: 'transform 0.3s ease'
        }}
      >
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '20px', color: '#C5A880', margin: 0 }}>ZEVRO</h1>
            <p style={{ color: '#94A3B8', fontSize: '10px', marginTop: '2px', textTransform: 'uppercase', letterSpacing: '1px', margin: 0 }}>Operator Console</p>
          </div>
          {mobileMenuOpen && (
            <button 
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        <nav style={{ padding: '20px 0', flex: 1, overflowY: 'auto' }}>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.path);
              return (
                <li key={item.name}>
                  <Link 
                    href={item.path} 
                    onClick={() => setMobileMenuOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                      padding: '11px 20px',
                      color: isActive ? '#C5A880' : '#94A3B8',
                      textDecoration: 'none',
                      fontFamily: 'var(--font-body, sans-serif)',
                      fontSize: '13px',
                      fontWeight: isActive ? 600 : 400,
                      backgroundColor: isActive ? 'rgba(197, 168, 128, 0.12)' : 'transparent',
                      borderLeft: isActive ? '3px solid #C5A880' : '3px solid transparent',
                      transition: 'all 0.2s'
                    }}
                  >
                    <Icon size={16} color={isActive ? '#C5A880' : '#94A3B8'} />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div style={{ padding: '20px', borderTop: '1px solid #1E293B' }}>
          <button onClick={handleLogout} style={{
            width: '100%',
            padding: '10px',
            backgroundColor: 'transparent',
            border: '1px solid #C5A880',
            color: '#C5A880',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '11px',
            fontWeight: 700,
            letterSpacing: '0.1em',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s'
          }}>
            <LogOut size={14} />
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, backgroundColor: '#0B1120' }}>
        <header style={{ height: '56px', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', padding: '0 20px', backgroundColor: '#0F172A' }}>
          <button 
            className="operator-mobile-toggle"
            onClick={() => setMobileMenuOpen(true)}
            style={{
              display: 'none',
              background: 'transparent',
              border: 'none',
              color: '#F8FAFC',
              cursor: 'pointer',
              padding: '4px',
              marginRight: '12px'
            }}
          >
            <Menu size={20} />
          </button>
          <span style={{ fontSize: '13px', color: '#94A3B8' }}>Operator Workspace</span>
        </header>

        <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            {children}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .operator-sidebar {
            position: fixed !important;
            transform: ${mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)'};
          }
          .operator-mobile-toggle {
            display: inline-flex !important;
          }
        }
      `}} />

    </div>
  );
}
