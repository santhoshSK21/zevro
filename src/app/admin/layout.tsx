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

  const IDLE_TIMEOUT_MS = 15 * 60 * 1000; // 15 Minutes

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Handle logout
  const handleLogout = async (dueToTimeout = false) => {
    try {
      if (typeof window !== 'undefined') {
        sessionStorage.removeItem('zevro_superadmin_auth');
        localStorage.removeItem('zevro_admin_last_active');
      }
      await fetch('/api/admin/auth', { method: 'DELETE' });
      setIsAuthenticated(false);
      if (dueToTimeout) {
        setErrorMsg('Session timed out after 15 minutes of inactivity. Please sign in again.');
      }
      router.push('/admin');
    } catch (err) {
      setIsAuthenticated(false);
    }
  };

  // Check auth status on mount
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      // Check idle timeout from last recorded activity
      if (typeof window !== 'undefined') {
        const lastActiveStr = localStorage.getItem('zevro_admin_last_active');
        if (lastActiveStr) {
          const elapsed = Date.now() - Number(lastActiveStr);
          if (elapsed > IDLE_TIMEOUT_MS) {
            handleLogout(true);
            return;
          }
        }
      }

      // Check if superadmin session exists in browser
      const isSuper = typeof window !== 'undefined' && sessionStorage.getItem('zevro_superadmin_auth') === 'true';
      if (isSuper) {
        if (isMounted) {
          setIsSuperAdmin(true);
          setIsAuthenticated(true);
          setAdminName('Super Administrator');
          if (typeof window !== 'undefined') {
            localStorage.setItem('zevro_admin_last_active', String(Date.now()));
          }
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
          if (data.authenticated) {
            setIsAuthenticated(true);
            if (data.admin?.name) setAdminName(data.admin.name);
            if (typeof window !== 'undefined') {
              localStorage.setItem('zevro_admin_last_active', String(Date.now()));
            }
          } else {
            setIsAuthenticated(false);
          }
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

  // 15-Minute Inactivity Idle Detector
  useEffect(() => {
    if (!isAuthenticated) return;

    let throttleTimer: NodeJS.Timeout | null = null;

    const resetIdleTimer = () => {
      if (throttleTimer) return;
      throttleTimer = setTimeout(() => {
        if (typeof window !== 'undefined') {
          localStorage.setItem('zevro_admin_last_active', String(Date.now()));
        }
        throttleTimer = null;
      }, 2000); // Throttle writes to every 2 seconds
    };

    // Track user interaction events
    const activityEvents = ['mousedown', 'mousemove', 'keydown', 'scroll', 'touchstart', 'click'];
    activityEvents.forEach(evt => {
      window.addEventListener(evt, resetIdleTimer, { passive: true });
    });

    // Periodic check every 15 seconds to evaluate idle timeout
    const checkInterval = setInterval(() => {
      if (typeof window !== 'undefined') {
        const lastActiveStr = localStorage.getItem('zevro_admin_last_active');
        if (lastActiveStr) {
          const elapsed = Date.now() - Number(lastActiveStr);
          if (elapsed >= IDLE_TIMEOUT_MS) {
            handleLogout(true);
          }
        }
      }
    }, 15000);

    return () => {
      activityEvents.forEach(evt => {
        window.removeEventListener(evt, resetIdleTimer);
      });
      clearInterval(checkInterval);
      if (throttleTimer) clearTimeout(throttleTimer);
    };
  }, [isAuthenticated]);

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
        if (typeof window !== 'undefined') {
          localStorage.setItem('zevro_admin_last_active', String(Date.now()));
        }
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
          <button onClick={() => handleLogout(false)} className="adm-footer-logout">
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
            <button onClick={() => handleLogout(false)} className="adm-logout-btn">Logout</button>
          </div>
        </header>

        {/* Main Content Area */}
        <div className="adm-content">
          {children}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        /* Shell */
        .adm-shell {
          display: flex;
          min-height: 100vh;
          background: #0B0F19;
          color: #F8FAFC;
          position: relative;
          overflow: hidden;
          font-family: var(--font-body, system-ui, sans-serif);
        }

        /* Backdrop */
        .adm-backdrop {
          position: fixed;
          inset: 0;
          background: rgba(3, 7, 18, 0.75);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          z-index: 998;
        }

        /* Sidebar */
        .adm-sidebar {
          width: 270px;
          min-width: 270px;
          background: radial-gradient(circle at top left, #172033 0%, #0D1322 100%);
          color: #F8FAFC;
          display: flex;
          flex-direction: column;
          border-right: 1px solid rgba(197, 168, 128, 0.15);
          z-index: 999;
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
          flex-shrink: 0;
          box-shadow: 4px 0 24px rgba(0, 0, 0, 0.3);
        }
        .adm-sidebar-header {
          padding: 24px 20px;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-shrink: 0;
          background: rgba(255, 255, 255, 0.02);
        }
        .adm-brand {
          font-family: var(--font-display, serif);
          font-size: 19px;
          letter-spacing: 0.18em;
          background: linear-gradient(135deg, #FAF8F5 30%, #C5A880 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin: 0 0 2px 0;
          font-weight: 700;
        }
        .adm-tagline {
          font-size: 9px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #94A3B8;
          font-weight: 500;
        }
        .adm-close-btn {
          display: none;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: #94A3B8;
          cursor: pointer;
          padding: 6px;
        }
        .adm-nav {
          flex: 1;
          padding: 18px 12px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .adm-nav-link {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 11px 16px;
          color: #94A3B8;
          text-decoration: none;
          border-radius: 8px;
          font-size: 13px;
          letter-spacing: 0.03em;
          font-weight: 500;
          transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
          border: 1px solid transparent;
        }
        .adm-nav-link:hover {
          color: #FAF8F5;
          background: rgba(255, 255, 255, 0.04);
          transform: translateX(3px);
        }
        .adm-nav-link--active {
          background: linear-gradient(90deg, rgba(197, 168, 128, 0.18) 0%, rgba(197, 168, 128, 0.04) 100%);
          color: #E2C9A5;
          border: 1px solid rgba(197, 168, 128, 0.3);
          font-weight: 600;
          box-shadow: 0 4px 16px rgba(197, 168, 128, 0.08);
        }
        .adm-sidebar-footer {
          padding: 18px 20px;
          border-top: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-shrink: 0;
          background: rgba(0, 0, 0, 0.2);
        }
        .adm-footer-store {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #CBD5E1;
          font-size: 12px;
          text-decoration: none;
          padding: 6px 10px;
          border-radius: 6px;
          background: rgba(255, 255, 255, 0.04);
          border: 1px solid rgba(255, 255, 255, 0.06);
          transition: all 0.2s ease;
        }
        .adm-footer-store:hover {
          color: #C5A880;
          border-color: rgba(197, 168, 128, 0.3);
        }
        .adm-footer-logout {
          display: flex;
          align-items: center;
          gap: 6px;
          background: none;
          border: none;
          color: #F87171;
          font-size: 12px;
          cursor: pointer;
          padding: 6px;
          opacity: 0.85;
          transition: opacity 0.2s ease;
        }
        .adm-footer-logout:hover {
          opacity: 1;
        }

        /* Main */
        .adm-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          min-width: 0;
          overflow: hidden;
          background: #0B0F19;
        }

        /* Header */
        .adm-header {
          height: 66px;
          min-height: 66px;
          flex-shrink: 0;
          background: rgba(15, 23, 42, 0.75);
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 24px;
          gap: 16px;
          z-index: 10;
        }
        .adm-header-left {
          display: flex;
          align-items: center;
          gap: 14px;
          min-width: 0;
        }
        .adm-header-title {
          font-size: 13px;
          color: #94A3B8;
          font-weight: 500;
          white-space: nowrap;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .adm-header-title::before {
          content: '';
          width: 7px;
          height: 7px;
          border-radius: 50%;
          background: #10B981;
          box-shadow: 0 0 10px #10B981;
        }
        .adm-hamburger {
          display: none;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 6px;
          color: #FAF8F5;
          cursor: pointer;
          padding: 8px;
          flex-shrink: 0;
        }
        .adm-header-right {
          display: flex;
          align-items: center;
          gap: 14px;
          flex-shrink: 0;
        }
        .adm-super-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          background: linear-gradient(135deg, rgba(197, 168, 128, 0.25) 0%, rgba(197, 168, 128, 0.1) 100%);
          color: #FAF8F5;
          border: 1px solid rgba(197, 168, 128, 0.4);
          padding: 6px 12px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.06em;
          text-decoration: none;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .adm-super-btn:hover {
          border-color: #C5A880;
          box-shadow: 0 0 14px rgba(197, 168, 128, 0.25);
        }
        .adm-admin-name {
          font-size: 13px;
          font-weight: 500;
          color: #E2E8F0;
          white-space: nowrap;
        }
        .adm-avatar {
          width: 34px;
          height: 34px;
          min-width: 34px;
          border-radius: 50%;
          background: linear-gradient(135deg, #2A364F 0%, #151D2C 100%);
          color: #C5A880;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 700;
          font-size: 12px;
          border: 1px solid rgba(197, 168, 128, 0.4);
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        }
        .adm-logout-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #94A3B8;
          padding: 6px 14px;
          border-radius: 6px;
          font-size: 11px;
          cursor: pointer;
          font-weight: 600;
          letter-spacing: 0.05em;
          white-space: nowrap;
          transition: all 0.2s ease;
        }
        .adm-logout-btn:hover {
          color: #F87171;
          border-color: rgba(248, 113, 113, 0.3);
          background: rgba(248, 113, 113, 0.08);
        }

        /* Content */
        .adm-content {
          padding: 28px;
          flex: 1;
          overflow-y: auto;
          background: #0B0F19;
          color: #F8FAFC;
        }

        /* ── Tablet ── */
        @media (max-width: 1024px) {
          .adm-sidebar { width: 230px; min-width: 230px; }
          .adm-admin-name { display: none; }
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .adm-sidebar {
            position: fixed;
            top: 0;
            left: 0;
            bottom: 0;
            width: 280px;
            min-width: 280px;
            transform: translateX(-100%);
            height: 100dvh;
          }
          .adm-sidebar--open { transform: translateX(0); }
          .adm-close-btn { display: flex; }
          .adm-hamburger { display: flex; }
          .adm-header-title { display: none; }
          .adm-super-label { display: none; }
          .adm-logout-btn { display: none; }
          .adm-content { padding: 18px; }
          .adm-header { padding: 0 16px; }
        }

        /* ── Small Mobile ── */
        @media (max-width: 480px) {
          .adm-content { padding: 14px; }
          .adm-header { padding: 0 12px; }
          .adm-super-btn { padding: 5px 8px; }
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}} />
    </div>
  );
}
