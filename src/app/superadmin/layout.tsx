'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  ShieldCheck, 
  Users, 
  BarChart3, 
  FileText, 
  Activity, 
  ShoppingBag, 
  Shirt, 
  FolderTree, 
  TrendingUp, 
  Palette, 
  Layers, 
  Settings, 
  Lock, 
  LogOut, 
  Store, 
  Menu, 
  X, 
  CheckCircle,
  Crown
} from 'lucide-react';

export default function SuperAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [passkey, setPasskey] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleSuperLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Superadmin master key or default pass
    const normalizedKey = (passkey || '').trim().toLowerCase();
    if (normalizedKey === 'superadmin' || normalizedKey === 'zevro2026' || normalizedKey === 'admin') {
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('zevro_superadmin_auth', 'true');
      }
      
      // Single Sign-On: Authenticate into admin session so clicking store pages never prompts for login
      try {
        await fetch('/api/admin/auth', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: 'superadmin@zevro.in', password: 'zevro2026' })
        });
      } catch (err) {
        console.warn('Admin SSO sync warning:', err);
      }

      setIsAuthenticated(true);
    } else {
      setErrorMsg('Invalid Master Security Passkey');
    }
  };

  const handleSuperLogout = async () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('zevro_superadmin_auth');
    }
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
    } catch (err) {}
    setIsAuthenticated(false);
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B1120', color: '#F8FAFC' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid rgba(197,168,128,0.2)', borderTopColor: '#C5A880', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '11px', letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C5A880' }}>INITIALIZING SUPERADMIN CONSOLE...</p>
        </div>
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin { to { transform: rotate(360deg); } }`}} />
      </div>
    );
  }

  // Not authenticated -> Master Passkey Gate
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0B1120', color: '#F8FAFC', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '440px', background: '#1E293B', border: '1px solid rgba(197, 168, 128, 0.35)', borderRadius: '8px', padding: '40px 32px', boxShadow: '0 32px 64px rgba(0,0,0,0.6)' }}>
          
          <div style={{ textAlign: 'center', marginBottom: '28px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '46px', height: '46px', borderRadius: '50%', background: 'rgba(197, 168, 128, 0.15)', border: '1px solid #C5A880', color: '#C5A880', marginBottom: '14px' }}>
              <Crown size={22} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '22px', letterSpacing: '0.14em', color: '#F8FAFC', margin: '0 0 6px' }}>
              SUPERADMIN PORTAL
            </h1>
            <p style={{ fontSize: '10px', color: '#94A3B8', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>
              Master Platform Governance
            </p>
          </div>

          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#FCA5A5', padding: '12px', borderRadius: '4px', fontSize: '12px', marginBottom: '20px', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleSuperLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.14em', color: '#C5A880', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>
                Master Security Passkey / Access Key
              </label>
              <input
                type="password"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
                placeholder="Enter superadmin key (e.g. superadmin)"
                required
                style={{ width: '100%', padding: '13px 14px', background: '#0F172A', border: '1px solid #334155', borderRadius: '4px', color: '#FFF', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              style={{ padding: '14px', background: '#C5A880', color: '#0F172A', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: 'pointer', transition: 'all 0.2s' }}
            >
              Access Command Center
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px', display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
            <Link href="/admin" style={{ color: '#94A3B8', textDecoration: 'none' }}>
              ← Standard Admin
            </Link>
            <Link href="/" style={{ color: '#94A3B8', textDecoration: 'none' }}>
              Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const superAdminNav = [
    { href: '/superadmin', label: 'Command Center', icon: Crown },
    { href: '/superadmin/admins', label: 'Admins & Access', icon: Users },
    { href: '/superadmin/analytics', label: 'Platform Analytics', icon: BarChart3 },
    { href: '/superadmin/audit', label: 'Audit & Activity Logs', icon: FileText },
    { href: '/superadmin/system', label: 'System & DB Health', icon: Activity },
  ];

  const standardStoreNav = [
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/products', label: 'Products', icon: Shirt },
    { href: '/admin/categories', label: 'Categories', icon: FolderTree },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/reports', label: 'Financial Reports', icon: TrendingUp },
    { href: '/admin/theme', label: 'Store Theme', icon: Palette },
    { href: '/admin/builder', label: 'Store Builder', icon: Layers },
    { href: '/admin/settings', label: 'Global Settings', icon: Settings },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#0B1120', color: '#F8FAFC', fontFamily: 'var(--font-body, sans-serif)' }}>
      
      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div 
          onClick={() => setMobileMenuOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(11, 17, 32, 0.7)',
            backdropFilter: 'blur(4px)',
            zIndex: 998
          }}
        />
      )}

      {/* Superadmin Sidebar */}
      <aside 
        className="superadmin-sidebar"
        style={{ 
          width: '270px', 
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
        
        {/* Logo & Superadmin Badge */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'rgba(197, 168, 128, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#C5A880' }}>
              <Crown size={18} />
            </div>
            <div>
              <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '15px', letterSpacing: '0.14em', color: '#C5A880', margin: 0 }}>
                ZEVRO MASTER
              </h1>
              <span style={{ fontSize: '9px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8' }}>
                Governance Console
              </span>
            </div>
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

        {/* Navigation Sections */}
        <nav style={{ flex: 1, padding: '18px 0', overflowY: 'auto' }}>
          
          {/* Section 1: Superadmin Exclusives */}
          <div style={{ padding: '0 20px 8px 20px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#C5A880' }}>
              PLATFORM GOVERNANCE
            </span>
          </div>

          <div style={{ marginBottom: '20px' }}>
            {superAdminNav.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '11px 20px',
                    backgroundColor: isActive ? 'rgba(197, 168, 128, 0.12)' : 'transparent',
                    color: isActive ? '#C5A880' : '#94A3B8',
                    textDecoration: 'none',
                    borderLeft: isActive ? '3px solid #C5A880' : '3px solid transparent',
                    fontSize: '13px',
                    fontWeight: isActive ? 600 : 400,
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={16} color={isActive ? '#C5A880' : '#94A3B8'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Section 2: Store Operations */}
          <div style={{ padding: '0 20px 8px 20px' }}>
            <span style={{ fontSize: '10px', fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: '#64748B' }}>
              STORE OPERATIONS
            </span>
          </div>

          <div>
            {standardStoreNav.map(item => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link 
                  key={item.href} 
                  href={item.href}
                  style={{
                    display: 'flex', alignItems: 'center', gap: '12px',
                    padding: '10px 20px',
                    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.05)' : 'transparent',
                    color: isActive ? '#FFFFFF' : '#64748B',
                    textDecoration: 'none',
                    borderLeft: isActive ? '3px solid #94A3B8' : '3px solid transparent',
                    fontSize: '13px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <Icon size={15} color={isActive ? '#FFFFFF' : '#64748B'} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

        </nav>

        {/* Footer Actions */}
        <div style={{ padding: '18px 20px', borderTop: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/admin" style={{ color: '#94A3B8', fontSize: '12px', textDecoration: 'none' }}>
            ← Admin View
          </Link>
          <button 
            onClick={handleSuperLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'none', border: 'none', color: '#F87171', fontSize: '12px', cursor: 'pointer', padding: 0 }}
          >
            <Lock size={13} /> Lock Console
          </button>
        </div>

      </aside>

      {/* Superadmin Main Content */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        
        {/* Top Header */}
        <header style={{ height: '64px', backgroundColor: '#0F172A', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile Hamburger Button */}
            <button 
              className="superadmin-mobile-toggle"
              onClick={() => setMobileMenuOpen(true)}
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                color: '#F8FAFC',
                cursor: 'pointer',
                padding: '6px'
              }}
            >
              <Menu size={22} />
            </button>

            <span style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', color: '#4ADE80', fontWeight: 600 }}>
              <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#4ADE80', display: 'inline-block' }} />
              Cluster Active • MongoDB Atlas Connected
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <span style={{ fontSize: '11px', background: 'rgba(197, 168, 128, 0.15)', color: '#C5A880', border: '1px solid rgba(197, 168, 128, 0.3)', padding: '4px 10px', borderRadius: '12px', fontWeight: 600, letterSpacing: '0.08em' }}>
              ROOT SUPERADMIN
            </span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#C5A880', color: '#0F172A', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '12px' }}>
              SA
            </div>
          </div>
        </header>

        {/* View Content */}
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto', backgroundColor: '#0B1120' }}>
          {children}
        </div>

      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .superadmin-sidebar {
            position: fixed !important;
            transform: ${mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)'};
          }
          .superadmin-mobile-toggle {
            display: inline-flex !important;
          }
        }
      `}} />

    </div>
  );
}
