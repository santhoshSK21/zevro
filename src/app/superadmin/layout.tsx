'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passkey, setPasskey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Superadmin authentication check
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const isSuper = sessionStorage.getItem('zevro_superadmin_auth');
      if (isSuper === 'true') {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, []);

  const handleSuperLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Superadmin master key or default pass
    if (passkey === 'superadmin' || passkey === 'zevro2026' || passkey === 'admin') {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('zevro_superadmin_auth', 'true');
      }
      setIsAuthenticated(true);
    } else {
      setErrorMsg('Invalid Master Security Passkey');
    }
  };

  const handleSuperLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('zevro_superadmin_auth');
    }
    setIsAuthenticated(false);
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0A0A09', color: '#FAF8F5' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '44px', height: '44px', border: '2px solid rgba(212,175,55,0.2)', borderTopColor: '#D4AF37', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '12px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#D4AF37' }}>INITIALIZING SUPERADMIN CONSOLE...</p>
        </div>
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin { to { transform: rotate(360deg); } }`}} />
      </div>
    );
  }

  // Not authenticated -> Master Passkey Gate
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#090908', color: '#FAF8F5', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '440px', background: '#141412', border: '1px solid rgba(212, 175, 55, 0.35)', borderRadius: '12px', padding: '44px 36px', boxShadow: '0 32px 64px rgba(0,0,0,0.8)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(212, 175, 55, 0.12)', border: '1px solid #D4AF37', color: '#D4AF37', fontSize: '20px', marginBottom: '16px' }}>
              👑
            </div>
            <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '24px', letterSpacing: '0.16em', color: '#FAF8F5', margin: '0 0 6px' }}>
              SUPERADMIN PORTAL
            </h1>
            <p style={{ fontSize: '11px', color: '#B49A68', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
              Master Command Center & Global Governance
            </p>
          </div>

          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#FCA5A5', padding: '12px', borderRadius: '6px', fontSize: '12px', marginBottom: '20px', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSuperLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.14em', color: '#A0988E', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
                Master Security Passkey / Access Key
              </label>
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter superadmin key (e.g. superadmin)"
                required
                style={{ width: '100%', padding: '14px 16px', background: '#0A0A09', border: '1px solid #2B2B28', borderRadius: '6px', color: '#FFF', fontSize: '13px', outline: 'none' }}
                onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                onBlur={(e) => e.target.style.borderColor = '#2B2B28'}
              />
            </div>

            <button
              type="submit"
              style={{ padding: '15px', background: '#D4AF37', color: '#000', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.16em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Access Command Center
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <Link href="/admin" style={{ color: '#888', textDecoration: 'none' }}>
              ← Standard Admin
            </Link>
            <Link href="/" style={{ color: '#888', textDecoration: 'none' }}>
              Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const superAdminNav = [
    { href: '/superadmin', label: 'Command Center', icon: '👑' },
    { href: '/superadmin/admins', label: 'Admins & Access Info', icon: '👥' },
    { href: '/superadmin/analytics', label: 'Platform Analytics', icon: '📊' },
    { href: '/superadmin/audit', label: 'Audit & Activity Logs', icon: '🛡️' },
    { href: '/superadmin/system', label: 'System & DB Health', icon: '⚡' },
  ];

  const standardStoreNav = [
    { href: '/admin/orders', label: 'Orders', icon: '📦' },
    { href: '/admin/products', label: 'Products', icon: '👗' },
    { href: '/admin/categories', label: 'Categories', icon: '🗂️' },
    { href: '/admin/customers', label: 'Customers', icon: '👥' },
    { href: '/admin/reports', label: 'Financial Reports', icon: '📈' },
    { href: '/admin/theme', label: 'Store Theme & Colors', icon: '🎨' },
    { href: '/admin/builder', label: 'Store Builder', icon: '🧱' },
    { href: '/admin/settings', label: 'Global Settings', icon: '⚙️' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0D0D0C', color: '#FAF8F5', fontFamily: 'var(--font-body)' }}>
      
      {/* Superadmin Sidebar */}
      <aside style={{ width: '270px', backgroundColor: '#131311', borderRight: '1px solid rgba(212, 175, 55, 0.15)', display: 'flex', flexDirection: 'column' }}>
        
        {/* Logo & Superadmin Badge */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '20px' }}>👑</span>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '17px', letterSpacing: '0.14em', color: '#D4AF37', margin: 0 }}>
                ZEVRO SUPERADMIN
              </h1>
              <span style={{ fontSize: '9px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#888' }}>
                Master Governance Console
              </span>
            </div>
          </div>
        </div>

        {/* Navigation Sections */}
        <nav style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
          
          {/* Section 1: Superadmin Exclusives */}
          <div style={{ padding: '0 20px 8px 20px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#D4AF37' }}>
              PLATFORM GOVERNANCE
            </span>
          </div>

          <div style={{ marginBottom: '24px' }}>
            {superAdminNav.map(item => {
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '11px 20px',
                    backgroundColor: isActive ? 'rgba(212, 175, 55, 0.16)' : 'transparent',
                    color: isActive ? '#D4AF37' : '#C7C2BA',
                    textDecoration: 'none',
                    borderLeft: isActive ? '4px solid #D4AF37' : '4px solid transparent',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '15px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Section 2: Store Operations (Admin features) */}
          <div style={{ padding: '0 20px 8px 20px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#7E7870' }}>
              STORE OPERATIONS
            </span>
          </div>

          <div>
            {standardStoreNav.map(item => {
              const isActive = pathname.startsWith(item.href);
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 20px',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                    color: isActive ? '#FAF8F5' : '#9E978E',
                    textDecoration: 'none',
                    borderLeft: isActive ? '4px solid #888' : '4px solid transparent',
                    fontSize: '13px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <span style={{ fontSize: '14px' }}>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

        </nav>

        {/* Footer Actions */}
        <div style={{ padding: '20px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/admin" style={{ color: '#B49A68', fontSize: '12px', textDecoration: 'none' }}>
            ← Admin View
          </Link>
          <button 
            onClick={handleSuperLogout}
            style={{ background: 'none', border: 'none', color: '#E57373', fontSize: '12px', cursor: 'pointer', padding: 0 }}
          >
            Lock Console
          </button>
        </div>

      </aside>

      {/* Superadmin Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        
        {/* Top Header */}
        <header style={{ height: '64px', backgroundColor: '#131311', borderBottom: '1px solid rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#4CAF50', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4CAF50', display: 'inline-block' }} />
              Cluster Active • MongoDB Atlas Connected
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '11px', background: 'rgba(212, 175, 55, 0.15)', color: '#D4AF37', border: '1px solid rgba(212, 175, 55, 0.3)', padding: '4px 10px', borderRadius: '12px', fontWeight: 600, letterSpacing: '0.08em' }}>
              ROLE: ROOT SUPERADMIN
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#D4AF37', color: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px' }}>
              SA
            </div>
          </div>
        </header>

        {/* View Content */}
        <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>

      </main>

    </div>
  );
}
