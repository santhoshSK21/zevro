'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Shirt, 
  FolderTree, 
  Users, 
  TrendingUp, 
  Palette, 
  Layers, 
  Settings, 
  LogOut, 
  Store, 
  Menu, 
  X, 
  Shield, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminName, setAdminName] = useState('Admin');
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Check auth status on mount
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      // Check if superadmin session exists in browser
      const isSuper = typeof window !== 'undefined' && sessionStorage.getItem('zevro_superadmin_auth') === 'true';
      if (isSuper) {
        if (isMounted) {
          setIsSuperAdmin(true);
          setIsAuthenticated(true);
          setAdminName('Super Administrator');
        }
        // Silently sync cookie
        try {
          await fetch('/api/admin/auth', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: 'superadmin@zevro.in', password: 'zevro2026' })
          });
        } catch (e) {}
        return;
      }

      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        if (isMounted) {
          setIsAuthenticated(!!data.authenticated);
          if (data.admin?.name) setAdminName(data.admin.name);
        }
      } catch (err) {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      }
    }

    if (isAuthenticated !== true) {
      checkAuth();
    }

    return () => { isMounted = false; };
  }, [pathname]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: emailOrUser, password })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setIsAuthenticated(true);
        if (data.admin?.name) setAdminName(data.admin.name);
      } else {
        setErrorMsg(data.error || 'Invalid credentials');
      }
    } catch (err: any) {
      setErrorMsg('Failed to connect to authentication service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/admin/auth', { method: 'DELETE' });
      setIsAuthenticated(false);
      router.push('/admin');
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  // Loading state
  if (isAuthenticated === null) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F172A', color: '#F8FAFC', fontFamily: 'var(--font-body, sans-serif)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid rgba(197,168,128,0.2)', borderTopColor: '#C5A880', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '12px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#94A3B8' }}>Authorizing Admin Console...</p>
        </div>
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin { to { transform: rotate(360deg); } }`}} />
      </div>
    );
  }

  // Not authenticated -> Show Admin Login Screen
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F172A', color: '#F8FAFC', padding: '16px' }}>
        <div style={{ width: '100%', maxWidth: '420px', background: '#1E293B', border: '1px solid rgba(197, 168, 128, 0.3)', borderRadius: '8px', padding: '40px 32px', boxShadow: '0 24px 48px rgba(0,0,0,0.4)', backdropFilter: 'blur(16px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '44px', height: '44px', borderRadius: '50%', backgroundColor: 'rgba(197, 168, 128, 0.15)', color: '#C5A880', marginBottom: '12px' }}>
              <Shield size={22} />
            </div>
            <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '24px', letterSpacing: '0.15em', color: '#FAF8F5', margin: '0 0 6px' }}>ZEVRO ADMIN</h1>
            <p style={{ fontSize: '11px', color: '#94A3B8', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>Bespoke Management Console</p>
          </div>

          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.12)', border: '1px solid rgba(239, 68, 68, 0.35)', color: '#FCA5A5', padding: '12px', borderRadius: '4px', fontSize: '12px', marginBottom: '20px', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.12em', color: '#C5A880', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>Email or Username</label>
              <input
                type="text"
                value={emailOrUser}
                onChange={(e) => setEmailOrUser(e.target.value)}
                placeholder="admin@zevro.in or admin"
                required
                style={{ width: '100%', padding: '13px 14px', background: '#0F172A', border: '1px solid #334155', borderRadius: '4px', color: '#FFF', fontSize: '13px', outline: 'none', boxSizing: 'border-box' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '10px', letterSpacing: '0.12em', color: '#C5A880', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: '100%', padding: '13px 14px', background: '#0F172A', border: '1px solid #334155', borderRadius: '4px', color: '#FFF', fontSize: '13px', outline: 'none' }}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ marginTop: '6px', width: '100%', padding: '15px', background: isSubmitting ? '#94A3B8' : '#C5A880', color: '#0F172A', border: 'none', borderRadius: '4px', fontSize: '11px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
            >
              {isSubmitting ? 'Verifying...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
            <Link href="/" style={{ color: '#94A3B8', fontSize: '12px', textDecoration: 'none', letterSpacing: '0.05em' }}>
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/orders', label: 'Orders', icon: ShoppingBag },
    { href: '/admin/products', label: 'Products', icon: Shirt },
    { href: '/admin/categories', label: 'Categories', icon: FolderTree },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/reports', label: 'Financial Reports', icon: TrendingUp },
    { href: '/admin/theme', label: 'Theme & Styling', icon: Palette },
    { href: '/admin/builder', label: 'Store Builder', icon: Layers },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="adm-shell">

      {/* Mobile Backdrop Overlay */}
      {mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} className="adm-backdrop" />
      )}

      {/* Admin Sidebar */}
      <aside className={`adm-sidebar${mobileMenuOpen ? ' adm-sidebar--open' : ''}`}>
        {/* Brand Header */}
        <div className="adm-sidebar-header">
          <div>
            <h1 className="adm-brand">ZEVRO ADMIN</h1>
            <span className="adm-tagline">Bespoke Couture Console</span>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="adm-close-btn" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        {/* Nav list */}
        <nav className="adm-nav">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`adm-nav-link${isActive ? ' adm-nav-link--active' : ''}`}
              >
                <Icon size={17} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div className="adm-sidebar-footer">
          <Link href="/" className="adm-footer-store">
            <Store size={14} /> Storefront
          </Link>
          <button onClick={handleLogout} className="adm-footer-logout">
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Admin Main Workspace */}
      <main className="adm-main">

        {/* Top Header */}
        <header className="adm-header">
          <div className="adm-header-left">
            <button
              className="adm-hamburger"
              onClick={() => setMobileMenuOpen(true)}
              aria-label="Open navigation"
            >
              <Menu size={22} />
            </button>
            <div className="adm-header-title">Live Operations Panel</div>
          </div>

          <div className="adm-header-right">
            {isSuperAdmin && (
              <Link href="/superadmin" className="adm-super-btn">
                <span>👑</span>
                <span className="adm-super-label">Superadmin</span>
              </Link>
            )}
            <span className="adm-admin-name">{adminName}</span>
            <div className="adm-avatar">{isSuperAdmin ? 'SA' : 'A'}</div>
            <button onClick={handleLogout} className="adm-logout-btn">Logout</button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="adm-content">
          {children}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        /* Shell */
        .adm-shell { display: flex; min-height: 100vh; background: #F8F9FA; position: relative; overflow: hidden; }

        /* Backdrop */
        .adm-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.65); backdrop-filter: blur(4px); z-index: 998; }

        /* Sidebar */
        .adm-sidebar {
          width: 260px; min-width: 260px;
          background: #0F172A; color: #F8FAFC;
          display: flex; flex-direction: column;
          border-right: 1px solid #1E293B;
          z-index: 999; transition: transform 0.3s ease;
          flex-shrink: 0;
        }
        .adm-sidebar-header {
          padding: 20px; border-bottom: 1px solid #1E293B;
          display: flex; align-items: center; justify-content: space-between;
          flex-shrink: 0;
        }
        .adm-brand { font-family: var(--font-display,serif); font-size: 17px; letter-spacing: .14em; color: #C5A880; margin: 0; }
        .adm-tagline { font-size: 10px; letter-spacing: .08em; text-transform: uppercase; color: #94A3B8; }
        .adm-close-btn { display: none; background: none; border: none; color: #94A3B8; cursor: pointer; padding: 4px; }
        .adm-nav { flex: 1; padding: 14px 0; overflow-y: auto; }
        .adm-nav-link {
          display: flex; align-items: center; gap: 12px;
          padding: 12px 20px;
          color: #94A3B8; text-decoration: none;
          border-left: 3px solid transparent;
          font-size: 13px; letter-spacing: .02em;
          transition: all 0.15s ease;
        }
        .adm-nav-link--active { background: rgba(197,168,128,.12); color: #C5A880; border-left-color: #C5A880; font-weight: 600; }
        .adm-sidebar-footer {
          padding: 16px 20px; border-top: 1px solid #1E293B;
          display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;
        }
        .adm-footer-store { display: flex; align-items: center; gap: 6px; color: #94A3B8; font-size: 12px; text-decoration: none; }
        .adm-footer-logout { display: flex; align-items: center; gap: 6px; background: none; border: none; color: #F87171; font-size: 12px; cursor: pointer; padding: 0; }

        /* Main */
        .adm-main { flex: 1; display: flex; flex-direction: column; min-width: 0; overflow: hidden; }

        /* Header */
        .adm-header {
          height: 60px; min-height: 60px; flex-shrink: 0;
          background: #fff; border-bottom: 1px solid #E2E8F0;
          display: flex; align-items: center; justify-content: space-between;
          padding: 0 20px; gap: 12px;
        }
        .adm-header-left { display: flex; align-items: center; gap: 10px; min-width: 0; }
        .adm-header-title { font-size: 13px; color: #64748B; font-weight: 500; white-space: nowrap; }
        .adm-hamburger { display: none; background: none; border: none; color: #0F172A; cursor: pointer; padding: 6px; flex-shrink: 0; }
        .adm-header-right { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .adm-super-btn {
          display: flex; align-items: center; gap: 6px;
          background: #0F172A; color: #C5A880; border: 1px solid #C5A880;
          padding: 5px 10px; border-radius: 4px;
          font-size: 11px; font-weight: 700; letter-spacing: .06em; text-decoration: none; white-space: nowrap;
        }
        .adm-admin-name { font-size: 13px; font-weight: 600; color: #1E293B; white-space: nowrap; }
        .adm-avatar {
          width: 32px; height: 32px; min-width: 32px; border-radius: 50%;
          background: #0F172A; color: #C5A880;
          display: flex; align-items: center; justify-content: center;
          font-weight: bold; font-size: 12px; border: 1px solid #C5A880;
        }
        .adm-logout-btn {
          background: #F8FAFC; border: 1px solid #E2E8F0;
          padding: 6px 12px; border-radius: 4px;
          font-size: 11px; cursor: pointer; color: #475569;
          font-weight: 600; letter-spacing: .04em; white-space: nowrap;
        }

        /* Content */
        .adm-content { padding: 24px; flex: 1; overflow-y: auto; background: #F8F9FA; }

        /* ── Tablet ── */
        @media (max-width: 1024px) {
          .adm-sidebar { width: 220px; min-width: 220px; }
          .adm-admin-name { display: none; }
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .adm-sidebar {
            position: fixed; top: 0; left: 0; bottom: 0;
            width: 280px; min-width: 280px;
            transform: translateX(-100%);
            height: 100dvh;
          }
          .adm-sidebar--open { transform: translateX(0); }
          .adm-close-btn { display: flex; }
          .adm-hamburger { display: flex; }
          .adm-header-title { display: none; }
          .adm-super-label { display: none; }
          .adm-logout-btn { display: none; }
          .adm-content { padding: 16px; }
          .adm-header { padding: 0 14px; }
        }

        /* ── Small Mobile ── */
        @media (max-width: 480px) {
          .adm-content { padding: 12px; }
          .adm-header { padding: 0 10px; }
          .adm-super-btn { padding: 5px 8px; }
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
