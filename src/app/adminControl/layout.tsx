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
    <div className="opr-shell">

      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div onClick={() => setMobileMenuOpen(false)} className="opr-backdrop" />
      )}

      {/* Sidebar */}
      <aside className={`opr-sidebar${mobileMenuOpen ? ' opr-sidebar--open' : ''}`}>
        <div className="opr-sidebar-header">
          <div>
            <h1 className="opr-brand">ZEVRO</h1>
            <p className="opr-tagline">Operator Console</p>
          </div>
          <button onClick={() => setMobileMenuOpen(false)} className="opr-close-btn" aria-label="Close menu">
            <X size={20} />
          </button>
        </div>

        <nav className="opr-nav">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname.startsWith(item.path);
            return (
              <Link
                key={item.name}
                href={item.path}
                onClick={() => setMobileMenuOpen(false)}
                className={`opr-nav-link${isActive ? ' opr-nav-link--active' : ''}`}
              >
                <Icon size={16} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="opr-sidebar-footer">
          <button onClick={handleLogout} className="opr-logout-btn">
            <LogOut size={14} />
            LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="opr-main">
        <header className="opr-header">
          <button
            className="opr-hamburger"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
          <span className="opr-header-title">Operator Workspace</span>
        </header>

        <div className="opr-content">
          <div className="opr-content-inner">
            {children}
          </div>
        </div>
      </main>

      <style dangerouslySetInnerHTML={{__html: `
        /* Shell */
        .opr-shell { display: flex; min-height: 100vh; background: #0F172A; color: #F8FAFC; position: relative; overflow: hidden; }

        /* Backdrop */
        .opr-backdrop { position: fixed; inset: 0; background: rgba(15,23,42,0.7); backdrop-filter: blur(4px); z-index: 998; }

        /* Sidebar */
        .opr-sidebar {
          width: 250px; min-width: 250px; flex-shrink: 0;
          background: #0F172A; border-right: 1px solid #1E293B;
          display: flex; flex-direction: column;
          z-index: 999; transition: transform 0.3s ease;
        }
        .opr-sidebar-header {
          padding: 20px; border-bottom: 1px solid #1E293B;
          display: flex; justify-content: space-between; align-items: center; flex-shrink: 0;
        }
        .opr-brand { font-family: var(--font-display,serif); font-size: 20px; color: #C5A880; margin: 0; }
        .opr-tagline { color: #94A3B8; font-size: 10px; text-transform: uppercase; letter-spacing: 1px; margin: 2px 0 0 0; }
        .opr-close-btn { display: none; background: none; border: none; color: #94A3B8; cursor: pointer; padding: 4px; }
        .opr-nav { padding: 16px 0; flex: 1; overflow-y: auto; }
        .opr-nav-link {
          display: flex; align-items: center; gap: 12px;
          padding: 11px 20px;
          color: #94A3B8; text-decoration: none;
          font-size: 13px; font-weight: 400;
          background: transparent;
          border-left: 3px solid transparent;
          transition: all 0.2s;
        }
        .opr-nav-link--active { color: #C5A880; font-weight: 600; background: rgba(197,168,128,.12); border-left-color: #C5A880; }
        .opr-sidebar-footer { padding: 20px; border-top: 1px solid #1E293B; flex-shrink: 0; }
        .opr-logout-btn {
          width: 100%; padding: 10px;
          background: transparent; border: 1px solid #C5A880;
          color: #C5A880; border-radius: 4px; cursor: pointer;
          font-size: 11px; font-weight: 700; letter-spacing: .1em;
          display: flex; align-items: center; justify-content: center; gap: 8px;
          transition: all 0.2s;
        }

        /* Main */
        .opr-main { flex: 1; display: flex; flex-direction: column; min-width: 0; background: #0B1120; overflow: hidden; }

        /* Header */
        .opr-header {
          height: 56px; min-height: 56px; flex-shrink: 0;
          border-bottom: 1px solid #1E293B;
          display: flex; align-items: center;
          padding: 0 20px; background: #0F172A; gap: 12px;
        }
        .opr-hamburger { display: none; background: none; border: none; color: #F8FAFC; cursor: pointer; padding: 4px; flex-shrink: 0; }
        .opr-header-title { font-size: 13px; color: #94A3B8; }

        /* Content */
        .opr-content { flex: 1; padding: 24px; overflow-y: auto; }
        .opr-content-inner { max-width: 1200px; margin: 0 auto; }

        /* ── Tablet ── */
        @media (max-width: 1024px) {
          .opr-sidebar { width: 210px; min-width: 210px; }
        }

        /* ── Mobile ── */
        @media (max-width: 768px) {
          .opr-sidebar {
            position: fixed; top: 0; left: 0; bottom: 0;
            width: 280px; min-width: 280px;
            transform: translateX(-100%);
            height: 100dvh;
          }
          .opr-sidebar--open { transform: translateX(0); }
          .opr-close-btn { display: flex; }
          .opr-hamburger { display: flex; }
          .opr-content { padding: 16px; }
          .opr-header { padding: 0 14px; }
        }

        /* ── Small Mobile ── */
        @media (max-width: 480px) {
          .opr-content { padding: 12px; }
          .opr-header { padding: 0 10px; }
        }
      `}} />

    </div>
  );
}
