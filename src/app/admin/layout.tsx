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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0F172A', color: '#F8FAFC', padding: '24px' }}>
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
                style={{ width: '100%', padding: '13px 14px', background: '#0F172A', border: '1px solid #334155', borderRadius: '4px', color: '#FFF', fontSize: '13px', outline: 'none' }}
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
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      
      {/* Mobile Backdrop Overlay */}
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

      {/* Admin Sidebar (English Oxford Navy & Antique Brass) */}
      <aside 
        className="admin-sidebar"
        style={{ 
          width: '260px', 
          backgroundColor: '#0F172A', 
          color: '#F8FAFC', 
          display: 'flex', 
          flexDirection: 'column',
          borderRight: '1px solid #1E293B',
          position: mobileMenuOpen ? 'fixed' : 'relative',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 999,
          transition: 'transform 0.3s ease',
        }}
      >
        {/* Brand Header */}
        <div style={{ padding: '24px 20px', borderBottom: '1px solid #1E293B', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '18px', letterSpacing: '0.14em', color: '#C5A880', margin: 0 }}>ZEVRO ADMIN</h1>
            <span style={{ fontSize: '10px', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94A3B8' }}>Bespoke Couture Console</span>
          </div>
          {mobileMenuOpen && (
            <button 
              onClick={() => setMobileMenuOpen(false)}
              style={{ background: 'transparent', border: 'none', color: '#94A3B8', cursor: 'pointer', padding: '4px' }}
            >
              <X size={20} />
            </button>
          )}
        </div>
        
        {/* Nav list with clean Lucide SVG icons */}
        <nav style={{ flex: 1, padding: '20px 0', overflowY: 'auto' }}>
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link 
                key={item.href} 
                href={item.href} 
                style={{
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px',
                  padding: '12px 20px',
                  backgroundColor: isActive ? 'rgba(197, 168, 128, 0.12)' : 'transparent',
                  color: isActive ? '#C5A880' : '#94A3B8',
                  textDecoration: 'none',
                  borderLeft: isActive ? '3px solid #C5A880' : '3px solid transparent',
                  transition: 'all 0.15s ease',
                  fontWeight: isActive ? 600 : 400,
                  fontSize: '13px',
                  letterSpacing: '0.02em'
                }}
              >
                <Icon size={17} color={isActive ? '#C5A880' : '#94A3B8'} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Sidebar Footer */}
        <div style={{ padding: '20px', borderTop: '1px solid #1E293B', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94A3B8', fontSize: '12px', textDecoration: 'none' }}>
            <Store size={14} /> Storefront
          </Link>
          <button 
            onClick={handleLogout} 
            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', color: '#F87171', fontSize: '12px', cursor: 'pointer', padding: 0 }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Admin Main Workspace */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0, overflow: 'hidden' }}>
        
        {/* Top Header */}
        <header style={{ height: '64px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E2E8F0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 24px' }}>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {/* Mobile Hamburger Button */}
            <button 
              className="admin-mobile-toggle"
              onClick={() => setMobileMenuOpen(true)}
              style={{
                display: 'none',
                background: 'transparent',
                border: 'none',
                color: '#0F172A',
                cursor: 'pointer',
                padding: '6px'
              }}
            >
              <Menu size={22} />
            </button>
            <div style={{ fontSize: '13px', color: '#64748B', fontWeight: 500 }}>
              Live Operations Panel
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            {isSuperAdmin && (
              <Link 
                href="/superadmin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  backgroundColor: '#0F172A',
                  color: '#C5A880',
                  border: '1px solid #C5A880',
                  padding: '5px 12px',
                  borderRadius: '4px',
                  fontSize: '11px',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textDecoration: 'none'
                }}
              >
                <span>👑 Superadmin Console</span>
              </Link>
            )}
            <span style={{ fontSize: '13px', fontWeight: 600, color: '#1E293B' }}>{adminName}</span>
            <div style={{ width: '32px', height: '32px', borderRadius: '50%', backgroundColor: '#0F172A', color: '#C5A880', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '13px', border: '1px solid #C5A880' }}>
              {isSuperAdmin ? 'SA' : 'A'}
            </div>
            <button onClick={handleLogout} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '6px 12px', borderRadius: '4px', fontSize: '11px', cursor: 'pointer', color: '#475569', fontWeight: 600, letterSpacing: '0.04em' }}>
              Logout
            </button>
          </div>
        </header>
        
        {/* Main Content Area */}
        <div style={{ padding: '24px', flex: 1, overflowY: 'auto', backgroundColor: '#F8F9FA' }}>
          {children}
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 768px) {
          .admin-sidebar {
            position: fixed !important;
            transform: ${mobileMenuOpen ? 'translateX(0)' : 'translateX(-100%)'};
          }
          .admin-mobile-toggle {
            display: inline-flex !important;
          }
        }
      `}} />

    </div>
  );
}
