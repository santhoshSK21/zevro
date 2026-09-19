'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [adminName, setAdminName] = useState('Admin');
  const [emailOrUser, setEmailOrUser] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Check auth status on mount
  useEffect(() => {
    let isMounted = true;
    async function checkAuth() {
      try {
        const res = await fetch('/api/admin/auth');
        const data = await res.json();
        if (isMounted) {
          setIsAuthenticated(!!data.authenticated);
        }
      } catch (err) {
        if (isMounted) {
          setIsAuthenticated(false);
        }
      }
    }

    // Only run check if not already authenticated
    if (isAuthenticated !== true) {
      checkAuth();
    }

    return () => { isMounted = false; };
  }, []);

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
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0D0D0D', color: '#FAF8F5', fontFamily: 'var(--font-body)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '40px', height: '40px', border: '2px solid rgba(212,175,55,0.2)', borderTopColor: 'var(--color-gold, #D4AF37)', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 16px' }} />
          <p style={{ fontSize: '13px', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#A0988E' }}>Verifying Admin Security...</p>
        </div>
        <style dangerouslySetInnerHTML={{__html: `@keyframes spin { to { transform: rotate(360deg); } }`}} />
      </div>
    );
  }

  // Not authenticated -> Show Admin Login Screen
  if (!isAuthenticated) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#0D0D0D', color: '#FAF8F5', padding: '24px' }}>
        <div style={{ width: '100%', maxWidth: '420px', background: 'rgba(26, 26, 26, 0.95)', border: '1px solid rgba(212, 175, 55, 0.25)', borderRadius: '12px', padding: '40px 32px', boxShadow: '0 24px 48px rgba(0,0,0,0.6)', backdropFilter: 'blur(16px)' }}>
          <div style={{ textAlign: 'center', marginBottom: '32px' }}>
            <h1 style={{ fontFamily: 'var(--font-display, serif)', fontSize: '28px', letterSpacing: '0.15em', color: '#D4AF37', margin: '0 0 8px' }}>ZEVRO ADMIN</h1>
            <p style={{ fontSize: '12px', color: '#A0988E', letterSpacing: '0.08em', textTransform: 'uppercase', margin: 0 }}>Management Console Access</p>
          </div>

          {errorMsg && (
            <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.4)', color: '#FCA5A5', padding: '12px', borderRadius: '6px', fontSize: '13px', marginBottom: '20px', textAlign: 'center' }}>
              {errorMsg}
            </div>
          )}

          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', color: '#D4AF37', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>Email or Username</label>
              <input
                type="text"
                value={emailOrUser}
                onChange={(e) => setEmailOrUser(e.target.value)}
                placeholder="admin@zevro.in or admin"
                required
                style={{ width: '100%', padding: '14px 16px', background: '#141414', border: '1px solid #333', borderRadius: '6px', color: '#FFF', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '11px', letterSpacing: '0.12em', color: '#D4AF37', textTransform: 'uppercase', marginBottom: '8px', fontWeight: 600 }}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                style={{ width: '100%', padding: '14px 16px', background: '#141414', border: '1px solid #333', borderRadius: '6px', color: '#FFF', fontSize: '14px', outline: 'none', transition: 'border-color 0.2s' }}
                onFocus={(e) => e.target.style.borderColor = '#D4AF37'}
                onBlur={(e) => e.target.style.borderColor = '#333'}
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              style={{ marginTop: '8px', width: '100%', padding: '16px', background: isSubmitting ? '#99812A' : '#D4AF37', color: '#000', border: 'none', borderRadius: '6px', fontSize: '12px', fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', cursor: isSubmitting ? 'not-allowed' : 'pointer', transition: 'all 0.2s' }}
            >
              {isSubmitting ? 'Authenticating...' : 'Sign In to Dashboard'}
            </button>
          </form>

          <div style={{ marginTop: '24px', textAlign: 'center', borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '16px' }}>
            <Link href="/" style={{ color: '#888', fontSize: '12px', textDecoration: 'none', letterSpacing: '0.05em' }}>
              ← Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { href: '/admin', label: 'Dashboard', icon: '📊' },
    { href: '/admin/orders', label: 'Orders', icon: '📦' },
    { href: '/admin/products', label: 'Products', icon: '👗' },
    { href: '/admin/categories', label: 'Categories', icon: '🗂️' },
    { href: '/admin/customers', label: 'Customers', icon: '👥' },
    { href: '/admin/reports', label: 'Reports', icon: '📈' },
    { href: '/admin/theme', label: 'Theme & Styling', icon: '🎨' },
    { href: '/admin/builder', label: 'Store Builder', icon: '🧱' },
    { href: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#F8F9FA' }}>
      
      {/* Admin Sidebar */}
      <aside style={{ width: '250px', backgroundColor: '#1A1816', color: '#FAF8F5', display: 'flex', flexDirection: 'column' }}>
        <div style={{ padding: '24px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '20px', letterSpacing: '0.12em', color: '#D4AF37', margin: 0 }}>ZEVRO ADMIN</h1>
        </div>
        
        <nav style={{ flex: 1, padding: '24px 0' }}>
          {navItems.map(item => {
            const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
            return (
              <Link key={item.href} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '12px 24px',
                backgroundColor: isActive ? 'rgba(212, 175, 55, 0.15)' : 'transparent',
                color: isActive ? '#D4AF37' : '#E8E4DF',
                textDecoration: 'none',
                borderLeft: isActive ? '4px solid #D4AF37' : '4px solid transparent',
                transition: 'all 0.2s',
                fontWeight: isActive ? 600 : 400
              }}>
                <span>{item.icon}</span>
                <span style={{ fontSize: '14px' }}>{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div style={{ padding: '24px', borderTop: '1px solid rgba(255,255,255,0.1)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Link href="/" style={{ color: '#9E978E', fontSize: '13px', textDecoration: 'none' }}>← Storefront</Link>
          <button onClick={handleLogout} style={{ background: 'transparent', border: 'none', color: '#E57373', fontSize: '13px', cursor: 'pointer', padding: 0 }}>
            Sign Out
          </button>
        </div>
      </aside>

      {/* Admin Main Area */}
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <header style={{ height: '70px', backgroundColor: '#FFFFFF', borderBottom: '1px solid #E9ECEF', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 32px' }}>
          <div style={{ fontSize: '14px', color: '#6C757D', fontWeight: 500 }}>
            Console Session Active
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <span style={{ fontSize: '14px', fontWeight: 500, color: '#333' }}>{adminName}</span>
            <div style={{ width: '34px', height: '34px', borderRadius: '50%', backgroundColor: '#D4AF37', color: '#1A1816', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>A</div>
            <button onClick={handleLogout} style={{ marginLeft: '12px', background: '#F8F9FA', border: '1px solid #CED4DA', padding: '6px 12px', borderRadius: '4px', fontSize: '12px', cursor: 'pointer', color: '#495057' }}>
              Logout
            </button>
          </div>
        </header>
        
        <div style={{ padding: '32px', flex: 1, overflowY: 'auto' }}>
          {children}
        </div>
      </main>

    </div>
  );
}
