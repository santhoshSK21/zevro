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
    <div className="sa-shell">

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} className="sa-backdrop" />
      )}

      {/* Superadmin Sidebar */}
      <aside className={`sa-sidebar${mobileMenuOpen ? ' sa-sidebar--open' : ''}`}>

        {/* Logo & Superadmin Badge */}
        <div className="sa-sidebar-header">
          <div className="sa-sidebar-brand">
            <div className="sa-logo-icon"><Crown size={18} /></div>
            <div>
              <h1 className="sa-brand">ZEVRO MASTER</h1>
              <span className="sa-tagline">Governance Console</span>
            </div>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="sa-close-btn" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        {/* Navigation Sections */}
        <nav className="sa-nav">

          {/* Section 1: Superadmin Exclusives */}
          <div className="sa-nav-section-label sa-nav-section-label--gold">PLATFORM GOVERNANCE</div>

          <div className="sa-nav-section">
            {superAdminNav.map(item => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`sa-nav-link${isActive ? ' sa-nav-link--active' : ''}`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Section 2: Store Operations */}
          <div className="sa-nav-section-label sa-nav-section-label--muted">STORE OPERATIONS</div>

          <div className="sa-nav-section">
            {standardStoreNav.map(item => {
              const Icon = item.icon;
              const isActive = pathname.startsWith(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`sa-nav-link sa-nav-link--store${isActive ? ' sa-nav-link--store-active' : ''}`}
                >
                  <Icon size={15} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

        </nav>

        {/* Footer Actions */}
        <div className="sa-sidebar-footer">
          <Link href="/admin" className="sa-footer-link">← Admin View</Link>
          <button onClick={handleSuperLogout} className="sa-footer-logout">
            <Lock size={13} /> Lock Console
          </button>
        </div>

      </aside>

      {/* Superadmin Main Content */}
      <main className="sa-main">

        {/* Top Header */}
        <header className="sa-header">

          <div className="sa-header-left">
            {/* Mobile Hamburger Button */}
            <button
              className="sa-hamburger"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>

            <span className="sa-cluster-status">
              <span className="sa-cluster-dot" />
              <span className="sa-cluster-text">Cluster Active • MongoDB Atlas Connected</span>
            </span>
          </div>

          <div className="sa-header-right">
            <span className="sa-root-badge">ROOT SUPERADMIN</span>
            <div className="sa-avatar">SA</div>
          </div>
        </header>

        {/* View Content */}
        <div className="sa-content">
          {children}
        </div>

      </main>

      <style dangerouslySetInnerHTML={{__html: `
        /* Shell */
        .sa-shell { display: flex; min-height: 100vh; background: #0B1120; color: #F8FAFC; font-family: var(--font-body,sans-serif); position: relative; overflow: hidden; }

        /* Backdrop */
        .sa-backdrop { position: fixed; inset: 0; background: rgba(11,17,32,0.75); backdrop-filter: blur(4px); z-index: 998; }

        /* Sidebar */
        .sa-sidebar {
          width: 270px; min-width: 270px; flex-shrink: 0;
          background: #0F172A; border-right: 1px solid #1E293B;
          display: flex; flex-direction: column;
          z-index: 999; transition: transform 0.3s ease;
        }
        .sa-sidebar-header {
          padding: 20px; border-bottom: 1px solid #1E293B;
          display: flex; align-items: center; justify-content: space-between; flex-shrink: 0;
        }
        .sa-sidebar-brand { display: flex; align-items: center; gap: 10px; }
        .sa-logo-icon {
          width: 32px; height: 32px; min-width: 32px; border-radius: 50%;
          background: rgba(197,168,128,.15);
          display: flex; align-items: center; justify-content: center; color: #C5A880;
        }
        .sa-brand { font-family: var(--font-display,serif); font-size: 15px; letter-spacing: .14em; color: #C5A880; margin: 0; }
        .sa-tagline { font-size: 9px; letter-spacing: .12em; text-transform: uppercase; color: #94A3B8; }
        .sa-close-btn { display: none; background: none; border: none; color: #94A3B8; cursor: pointer; padding: 4px; flex-shrink: 0; }

        /* Nav */
        .sa-nav { flex: 1; padding: 16px 0; overflow-y: auto; }
        .sa-nav-section-label {
          padding: 0 20px 8px 20px;
          font-size: 10px; font-weight: 700; letter-spacing: .14em; text-transform: uppercase;
        }
        .sa-nav-section-label--gold { color: #C5A880; }
        .sa-nav-section-label--muted { color: #64748B; margin-top: 8px; }
        .sa-nav-section { margin-bottom: 8px; }
        .sa-nav-link {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 20px;
          background: transparent; color: #94A3B8; text-decoration: none;
          border-left: 3px solid transparent;
          font-size: 13px; font-weight: 400;
          transition: all 0.15s ease;
        }
        .sa-nav-link--active { background: rgba(197,168,128,.12); color: #C5A880; border-left-color: #C5A880; font-weight: 600; }
        .sa-nav-link--store { color: #64748B; padding: 10px 20px; font-size: 13px; }
        .sa-nav-link--store-active { background: rgba(255,255,255,.05); color: #FFF; border-left-color: #94A3B8; }

        /* Sidebar Footer */
        .sa-sidebar-footer {
          padding: 18px 20px; border-top: 1px solid #1E293B;
          display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;
        }
        .sa-footer-link { color: #94A3B8; font-size: 12px; text-decoration: none; }
        .sa-footer-logout { display: flex; align-items: center; gap: 4px; background: none; border: none; color: #F87171; font-size: 12px; cursor: pointer; padding: 0; }

        /* Main */
        .sa-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }

        /* Header */
        .sa-header {
          height: 64px; min-height: 64px; flex-shrink: 0;
          background: #0F172A; border-bottom: 1px solid #1E293B;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 24px; gap: 12px;
        }
        .sa-header-left { display: flex; align-items: center; gap: 12px; min-width: 0; flex: 1; }
        .sa-hamburger { display: none; background: none; border: none; color: #F8FAFC; cursor: pointer; padding: 6px; flex-shrink: 0; }
        .sa-cluster-status { display: flex; align-items: center; gap: 6px; font-size: 12px; color: #4ADE80; font-weight: 600; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
        .sa-cluster-dot { width: 8px; height: 8px; min-width: 8px; border-radius: 50%; background: #4ADE80; display: inline-block; }
        .sa-cluster-text { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
        .sa-header-right { display: flex; align-items: center; gap: 14px; flex-shrink: 0; }
        .sa-root-badge {
          font-size: 11px; background: rgba(197,168,128,.15); color: #C5A880;
          border: 1px solid rgba(197,168,128,.3); padding: 4px 10px;
          border-radius: 12px; font-weight: 600; letter-spacing: .08em; white-space: nowrap;
        }
        .sa-avatar {
          width: 32px; height: 32px; min-width: 32px; border-radius: 50%;
          background: #C5A880; color: #0F172A;
          display: flex; align-items: center; justify-content: center;
          font-weight: bold; font-size: 12px;
        }

        /* Content */
        .sa-content { padding: 24px; flex: 1; overflow-y: auto; background: #0B1120; }

        /* ── Tablet ── */
        @media (max-width: 1024px) {
          .sa-sidebar { width: 230px; min-width: 230px; }
          .sa-root-badge { display: none; }
          .sa-cluster-text { max-width: 180px; }
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .sa-sidebar {
            position: fixed; top: 0; left: 0; bottom: 0;
            width: 290px; min-width: 290px;
            transform: translateX(-100%);
            height: 100dvh;
          }
          .sa-sidebar--open { transform: translateX(0); }
          .sa-close-btn { display: flex; }
          .sa-hamburger { display: flex; }
          .sa-cluster-text { display: none; }
          .sa-content { padding: 16px; }
          .sa-header { padding: 0 14px; }
        }

        /* ── Small Mobile ── */
        @media (max-width: 480px) {
          .sa-content { padding: 12px; }
          .sa-header { padding: 0 10px; height: 56px; min-height: 56px; }
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}} />

    </div>
  );
}
