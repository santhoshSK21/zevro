'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { signOut } from 'next-auth/react';
import {
  LayoutDashboard,
  ShoppingBag,
  PackageCheck,
  Boxes,
  Landmark,
  Settings,
  LogOut,
  ExternalLink,
  Menu,
  X,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Edit3,
  User,
  BarChart3,
  UploadCloud,
  RotateCcw,
} from 'lucide-react';

const NAV_ITEMS = [
  { href: '/seller', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/seller/products', label: 'Products & Listings', icon: ShoppingBag },
  { href: '/seller/orders', label: 'Orders & Fulfillment', icon: PackageCheck },
  { href: '/seller/returns', label: 'Returns & Exchanges', icon: RotateCcw },
  { href: '/seller/inventory', label: 'Inventory Stock', icon: Boxes },
  { href: '/seller/analytics', label: 'Analytics & Insights', icon: BarChart3 },
  { href: '/seller/products/bulk', label: 'Bulk CSV & Editor', icon: UploadCloud },
  { href: '/seller/settlements', label: 'Payments & Payouts', icon: Landmark },
  { href: '/seller/settings', label: 'Store Settings', icon: Settings },
];

export default function SellerLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname === '/seller/login' || pathname === '/seller/register';

  const [mobileOpen, setMobileOpen] = useState(false);
  const [seller, setSeller] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Fetch seller profile
  useEffect(() => {
    if (isAuthPage) {
      setLoading(false);
      return;
    }
    let isMounted = true;
    async function loadSeller() {
      try {
        const res = await fetch('/api/seller/me');
        if (res.ok) {
          const data = await res.json();
          if (isMounted) setSeller(data.seller);
        }
      } catch (e) {
        console.error('Failed to load seller profile:', e);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    loadSeller();
    return () => {
      isMounted = false;
    };
  }, [isAuthPage]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/seller/login');
  };

  const storeName = seller?.storeName || 'Merchant Store';
  const isApproved = seller?.status === 'APPROVED';

  // Get active page title for header breadcrumb
  const currentNav = NAV_ITEMS.find((it) => it.href === pathname || (it.href !== '/seller' && pathname.startsWith(it.href)));
  const pageTitle = currentNav?.label || 'Seller Hub';

  return (
    <div
      style={{
        display: 'flex',
        minHeight: '100vh',
        backgroundColor: '#F8F6F0',
        color: '#1C1C1A',
        fontFamily: "Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.4)',
            zIndex: 40,
            backdropFilter: 'blur(3px)',
          }}
        />
      )}

      {/* Sidebar (Desktop + Mobile Slide-over) */}
      <aside
        style={{
          width: '260px',
          background: '#FFFFFF',
          borderRight: '1px solid #E8E2D6',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          bottom: 0,
          left: 0,
          zIndex: 50,
          transform: mobileOpen ? 'translateX(0)' : undefined,
          transition: 'transform 0.25s ease',
        }}
        className={mobileOpen ? 'seller-sidebar-open' : 'seller-sidebar'}
      >
        {/* Brand Logo Header */}
        <div
          style={{
            padding: '20px 22px',
            borderBottom: '1px solid #E8E2D6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <Link href="/seller" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span
              style={{
                fontFamily: "var(--font-display), 'Playfair Display', Georgia, serif",
                fontSize: '22px',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#1C1C1A',
              }}
            >
              ZEVRO
            </span>
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.08em',
                background: '#1C1C1A',
                color: '#FAF8F5',
                padding: '2px 7px',
                borderRadius: '4px',
                textTransform: 'uppercase',
              }}
            >
              Seller
            </span>
          </Link>

          <button
            onClick={() => setMobileOpen(false)}
            className="seller-mobile-close"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#68645C',
              display: 'none',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Store Profile Identity Card */}
        <div
          style={{
            padding: '14px 18px',
            borderBottom: '1px solid #E8E2D6',
            background: '#F8F6F0',
            margin: '12px 14px',
            borderRadius: '10px',
            border: '1px solid #E8E2D6',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '8px',
                background: '#1C1C1A',
                color: '#FAF8F5',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: 700,
                fontSize: '14px',
                flexShrink: 0,
              }}
            >
              {storeName.charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: '13px',
                  fontWeight: 600,
                  color: '#1C1C1A',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap',
                }}
              >
                {storeName}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '2px' }}>
                <span
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: isApproved ? '#2E7D32' : '#F57C00',
                  }}
                />
                <span style={{ fontSize: '11px', fontWeight: 500, color: '#68645C' }}>
                  {isApproved ? 'Verified Partner' : 'Under Review'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Items */}
        <nav style={{ flex: 1, padding: '8px 14px', display: 'flex', flexDirection: 'column', gap: '4px', overflowY: 'auto' }}>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href || (item.href !== '/seller' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '10px 14px',
                  borderRadius: '8px',
                  fontSize: '13px',
                  fontWeight: active ? 600 : 500,
                  textDecoration: 'none',
                  color: active ? '#1C1C1A' : '#68645C',
                  background: active ? '#EFEBE2' : 'transparent',
                  transition: 'all 0.15s ease',
                  position: 'relative',
                }}
              >
                <Icon size={17} color={active ? '#1C1C1A' : '#68645C'} />
                <span style={{ flex: 1 }}>{item.label}</span>
                {active && (
                  <span
                    style={{
                      width: '5px',
                      height: '5px',
                      borderRadius: '50%',
                      background: '#B49A68',
                    }}
                  />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Actions */}
        <div style={{ padding: '14px 16px', borderTop: '1px solid #E8E2D6', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {seller?.slug && (
            <Link
              href={`/store/${seller.slug}`}
              target="_blank"
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '9px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                color: '#B49A68',
                textDecoration: 'none',
                background: '#FDFBF7',
                border: '1px solid #E8D7B5',
              }}
            >
              <span>View Brand Storefront</span>
              <ExternalLink size={13} color="#B49A68" />
            </Link>
          )}

          <Link
            href="/"
            target="_blank"
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              padding: '9px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#1C1C1A',
              textDecoration: 'none',
              background: '#F8F6F0',
              border: '1px solid #E8E2D6',
            }}
          >
            <span>Visit Customer Store</span>
            <ExternalLink size={13} color="#68645C" />
          </Link>

          <button
            onClick={handleSignOut}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 12px',
              borderRadius: '6px',
              fontSize: '12px',
              fontWeight: 500,
              color: '#9E2A2B',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              textAlign: 'left',
            }}
          >
            <LogOut size={15} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Workspace */}
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column', minWidth: 0 }} className="seller-main-wrap">
        {/* Top Navbar */}
        <header
          style={{
            height: '64px',
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(8px)',
            borderBottom: '1px solid #E8E2D6',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 28px',
            position: 'sticky',
            top: 0,
            zIndex: 20,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setMobileOpen(true)}
              className="seller-hamburger"
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#1C1C1A',
                display: 'none',
                padding: '4px',
              }}
            >
              <Menu size={22} />
            </button>

            {/* Breadcrumb Path */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
              <Link href="/seller" style={{ color: '#68645C', textDecoration: 'none' }}>
                Seller Hub
              </Link>
              <ChevronRight size={14} color="#A8A29E" />
              <span style={{ fontWeight: 600, color: '#1C1C1A' }}>{pageTitle}</span>
            </div>
          </div>

          {/* Top Right Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <Link
              href="/seller/products"
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#FAF8F5',
                background: '#1C1C1A',
                padding: '7px 16px',
                borderRadius: '6px',
                textDecoration: 'none',
                boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
              }}
            >
              <span>+ Add Product</span>
            </Link>

            <div style={{ width: '1px', height: '22px', backgroundColor: '#E8E2D6' }} />

            {/* Store Identity & Edit Button */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div
                style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#1C1C1A',
                  color: '#FAF8F5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '13px',
                  fontWeight: 700,
                  fontFamily: 'var(--font-display, serif)',
                }}
              >
                {storeName.charAt(0).toUpperCase()}
              </div>
              <div className="seller-header-name" style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{ fontSize: '13px', fontWeight: 600, color: '#1C1C1A', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {storeName}
                </span>
                <span style={{ fontSize: '10px', color: '#68645C', fontWeight: 500 }}>
                  Merchant
                </span>
              </div>
            </div>

            {/* Edit Store Button */}
            <Link
              href="/seller/settings"
              title="Edit Store Profile"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: '#FFFFFF',
                color: '#1C1C1A',
                border: '1px solid #DDD6C8',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
                transition: 'all 0.2s',
              }}
            >
              <Edit3 size={13} color="#B49A68" />
              <span>Edit Store</span>
            </Link>

            {/* Logout Button */}
            <button
              onClick={handleSignOut}
              title="Sign Out of Seller Hub"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                padding: '6px 12px',
                backgroundColor: '#FFF0F0',
                color: '#9E2A2B',
                border: '1px solid #FECACA',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <LogOut size={13} />
              <span>Logout</span>
            </button>
          </div>
        </header>

        {/* Page Content Body */}
        <main style={{ flex: 1, padding: '28px' }}>{children}</main>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        @media (max-width: 900px) {
          .seller-sidebar {
            transform: translateX(-100%) !important;
          }
          .seller-sidebar-open {
            transform: translateX(0) !important;
          }
          .seller-main-wrap {
            margin-left: 0 !important;
          }
          .seller-hamburger {
            display: inline-flex !important;
          }
          .seller-mobile-close {
            display: inline-flex !important;
          }
        }
      `}} />
    </div>
  );
}
