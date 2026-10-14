'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUiStore } from '../../store/uiStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useConfigStore } from '../../store/configStore';
import { useSession, signOut } from 'next-auth/react';
import { motion, useReducedMotion } from 'framer-motion';
import MegaMenu from './MegaMenu';

export default function Navbar() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { setSearchOpen, setMobileMenuOpen, announcementBarVisible } = useUiStore();
  const { itemCount, openDrawer } = useCartStore();
  const { productIds } = useWishlistStore();
  const { config } = useConfigStore();
  const prefersReducedMotion = useReducedMotion();

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const userDropdownRef = useRef<HTMLDivElement>(null);

  // Close user dropdown on outside click or route change
  useEffect(() => {
    setUserDropdownOpen(false);
  }, [pathname]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      
      if (currentScrollY > 30) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true);
      } else {
        setHidden(false);
      }
      setLastScrollY(currentScrollY);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  const links = [
    { label: 'NEW IN', href: '/category/new-in' },
    { label: 'WESTERN WEAR', href: '/category/western-wear' },
    { label: 'ETHNIC WEAR', href: '/category/ethnic-wear' },
    { label: 'INDO-WESTERN', href: '/category/indo-western' },
    { label: 'ACCESSORIES', href: '/category/accessories' },
  ];

  if (
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/superadmin') ||
    pathname?.startsWith('/seller')
  ) {
    return null;
  }

  const isHome = pathname === '/';
  const hasAnnouncement = announcementBarVisible && Boolean(config?.announcementText);
  const navClass = `zevro-nav ${isHome ? 'is-home' : ''} ${isHome && !scrolled ? 'is-transparent' : ''} ${scrolled ? 'is-glass' : ''} ${hasAnnouncement && !scrolled ? 'has-announcement' : ''}`;

  return (
    <>
      <motion.header
        className={navClass}
        onMouseLeave={() => setHoveredCategory(null)}
        initial={prefersReducedMotion ? false : { y: '-100%' }}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <div className="nav-logo-wrap">
          <Link href="/" className="nav-logo" aria-label="Zevro home">
            <img
              src="/logot.png"
              alt="Zevro logo"
              className="nav-logo-img"
            />
          </Link>
        </div>

        <nav className="nav-links">
          {links.map(link => (
            <div
              key={link.label}
              onMouseEnter={() => setHoveredCategory(link.label)}
              className="nav-link-wrap"
            >
              <Link href={link.href} className="nav-link">
                {link.label}
              </Link>
            </div>
          ))}
        </nav>

        <div className="nav-icons">
          <button onClick={() => setSearchOpen(true)} className="nav-icon-btn" aria-label="Search">
            <span className="icon-svg"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg></span>
          </button>
          
          <div className="nav-divider"></div>

          {/* User Profile / Logout Dropdown */}
          {session?.user ? (
            <div className="nav-user-dropdown-wrap hide-mobile" ref={userDropdownRef}>
              <button
                type="button"
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="nav-user-pill-btn"
                aria-label="User account menu"
                aria-expanded={userDropdownOpen}
              >
                <div className="nav-user-avatar">
                  {(session.user.name || session.user.email || 'U').charAt(0).toUpperCase()}
                </div>
                <span className="nav-user-name">
                  {session.user.name?.split(' ')[0] || 'My Account'}
                </span>
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ transform: userDropdownOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>
                  <path d="M6 9l6 6 6-6"/>
                </svg>
              </button>

              {userDropdownOpen && (
                <div className="nav-user-menu">
                  {/* Profile Header */}
                  <div className="user-menu-header">
                    <div className="user-menu-avatar-large">
                      {(session.user.name || session.user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <div className="user-menu-info">
                      <div className="user-menu-fullname">{session.user.name || 'Member'}</div>
                      <div className="user-menu-email">{session.user.email}</div>
                      <span className="user-menu-badge">
                        {session.user.role === 'seller' ? '🏷️ Verified Seller' : session.user.role === 'admin' ? '👑 Admin' : '✨ Member'}
                      </span>
                    </div>
                  </div>

                  {/* Menu Links */}
                  <div className="user-menu-links">
                    <Link
                      href="/account/settings"
                      onClick={() => setUserDropdownOpen(false)}
                      className="user-menu-item"
                    >
                      <span className="menu-item-icon">✏️</span>
                      <div>
                        <div className="menu-item-title">Edit Profile Details</div>
                        <div className="menu-item-sub">View & update account details</div>
                      </div>
                    </Link>

                    <Link
                      href="/account/orders"
                      onClick={() => setUserDropdownOpen(false)}
                      className="user-menu-item"
                    >
                      <span className="menu-item-icon">📦</span>
                      <div>
                        <div className="menu-item-title">My Orders</div>
                        <div className="menu-item-sub">Track order dispatches</div>
                      </div>
                    </Link>

                    {session.user.role === 'seller' && (
                      <Link
                        href="/seller"
                        onClick={() => setUserDropdownOpen(false)}
                        className="user-menu-item highlight-seller"
                      >
                        <span className="menu-item-icon">🏪</span>
                        <div>
                          <div className="menu-item-title">Seller Hub / Store</div>
                          <div className="menu-item-sub">Catalog, inventory & payouts</div>
                        </div>
                      </Link>
                    )}

                    {session.user.role === 'admin' && (
                      <Link
                        href="/admin"
                        onClick={() => setUserDropdownOpen(false)}
                        className="user-menu-item highlight-admin"
                      >
                        <span className="menu-item-icon">⚡</span>
                        <div>
                          <div className="menu-item-title">Admin Atelier</div>
                          <div className="menu-item-sub">Store management & builder</div>
                        </div>
                      </Link>
                    )}
                  </div>

                  {/* Footer Logout Button */}
                  <div className="user-menu-footer">
                    <button
                      type="button"
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        await signOut({ callbackUrl: '/' });
                      }}
                      className="user-menu-logout-btn"
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                      </svg>
                      <span>Sign Out / Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link href="/login" className="nav-login-btn hide-mobile" aria-label="Sign In">
              <span className="icon-svg">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
                </svg>
              </span>
              <span>Sign In</span>
            </Link>
          )}
          <Link href="/wishlist" className="nav-icon-btn hide-mobile" aria-label="Wishlist">
            <span className="icon-svg">
              <svg width="20" height="20" viewBox="0 0 24 24" fill={productIds.length > 0 ? "currentColor" : "none"} stroke="currentColor" strokeWidth="1.5">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
              {productIds.length > 0 && <span className="mobile-badge">{productIds.length}</span>}
            </span>
          </Link>
          <button onClick={openDrawer} className="nav-icon-btn" aria-label="Cart">
            <span className="icon-svg"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>{itemCount > 0 && <span className="mobile-badge">{itemCount}</span>}</span>
          </button>
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="nav-hamburger"
            aria-label="Open menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="3" y1="12" x2="21" y2="12" />
              <line x1="3" y1="6" x2="21" y2="6" />
              <line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </button>
        </div>

        {hoveredCategory && ['WESTERN WEAR', 'ETHNIC WEAR', 'INDO-WESTERN', 'ACCESSORIES'].includes(hoveredCategory) && (
          <div className="mega-menu-panel">
            <MegaMenu category={hoveredCategory} close={() => setHoveredCategory(null)} />
          </div>
        )}
      </motion.header>

      <style dangerouslySetInnerHTML={{__html: `
        .zevro-nav {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          height: 64px;
          background: var(--color-bg);
          color: var(--color-ink);
          display: grid;
          grid-template-columns: auto 1fr auto;
          align-items: center;
          padding: 0 var(--container-gutter);
          border-bottom: none;
          transition: background-color 0.3s ease, color 0.3s ease, backdrop-filter 0.3s ease, box-shadow 0.3s ease, top 0.3s ease;
        }
        .zevro-nav.is-home {
          position: fixed;
          top: 0;
        }
        .zevro-nav.is-home.has-announcement {
          top: 38px;
        }
        .zevro-nav.is-transparent {
          background: transparent;
          color: #FFF;
        }
        .zevro-nav.is-transparent .nav-logo-img {
          filter: brightness(0) invert(1);
        }
        .zevro-nav.is-glass {
          top: 0 !important;
          background: rgba(245, 241, 232, 0.95);
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
          border-bottom: 1px solid rgba(28, 28, 26, 0.08);
          box-shadow: 0 4px 24px rgba(28, 28, 26, 0.04);
          color: var(--color-ink);
        }
        .zevro-nav.is-glass .nav-logo-img {
          filter: none;
        }
        .nav-logo-wrap {
          text-align: left;
        }
        .nav-logo {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
        }
        .nav-logo-img {
          height: 36px;
          width: auto;
          display: block;
          transition: filter 0.4s ease;
        }
        .nav-links {
          display: flex;
          justify-content: center;
          gap: var(--space-8);
        }
        .nav-link-wrap {
          display: flex;
          align-items: center;
        }
        .nav-link {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .nav-icons {
          display: flex;
          justify-content: flex-end;
          align-items: center;
          gap: var(--space-6);
        }
        .nav-icon-btn {
          font-family: var(--font-ui);
          font-size: 11px;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: inherit;
          display: flex;
          align-items: center;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0;
        }
        .icon-svg {
          display: block;
          position: relative;
        }
        .nav-divider {
          width: 1px;
          height: 16px;
          background: currentColor;
          opacity: 0.3;
          margin: 0 4px;
        }
        .mobile-badge {
          position: absolute;
          top: -4px;
          right: -4px;
          background: var(--color-ink);
          color: var(--color-white);
          font-size: 9px;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .zevro-nav.is-transparent .mobile-badge {
          background: #FFF;
          color: var(--color-ink);
        }
        .nav-hamburger {
          display: none;
          background: none;
          border: none;
          color: inherit;
          cursor: pointer;
          padding: 0;
        }
        .mega-menu-panel {
          position: absolute;
          top: calc(100% + 6px);
          left: 50%;
          transform: translateX(-50%);
          z-index: 1100;
          background: transparent;
          border: none;
          color: inherit;
        }
        /* User Dropdown Pill & Menu */
        .nav-user-dropdown-wrap {
          position: relative;
        }
        .nav-user-pill-btn {
          display: flex;
          align-items: center;
          gap: 7px;
          background: rgba(28, 28, 26, 0.05);
          border: 1px solid rgba(28, 28, 26, 0.12);
          border-radius: 20px;
          padding: 3px 10px 3px 4px;
          color: inherit;
          cursor: pointer;
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.04em;
          transition: all 0.2s ease;
        }
        .nav-user-pill-btn:hover {
          background: rgba(28, 28, 26, 0.1);
          border-color: #B49A68;
        }
        .zevro-nav.is-transparent .nav-user-pill-btn {
          background: rgba(255, 255, 255, 0.15);
          border-color: rgba(255, 255, 255, 0.3);
          color: #FFFFFF;
        }
        .nav-user-avatar {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: #1C1C1A;
          color: #FAF8F5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
        }
        .zevro-nav.is-transparent .nav-user-avatar {
          background: #FAF8F5;
          color: #1C1C1A;
        }
        .nav-user-name {
          max-width: 90px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .nav-login-btn {
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          color: inherit;
          font-family: var(--font-ui, sans-serif);
          font-size: 11px;
          font-weight: 600;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 4px 10px;
          border-radius: 4px;
          transition: all 0.2s;
        }
        .nav-login-btn:hover {
          color: #B49A68;
        }
        .nav-user-menu {
          position: absolute;
          top: calc(100% + 12px);
          right: 0;
          width: 280px;
          background: #FFFFFF;
          border: 1px solid #E8E2D6;
          border-radius: 10px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
          overflow: hidden;
          z-index: 1200;
          animation: userMenuFade 0.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
          color: #1C1C1A;
        }
        @keyframes userMenuFade {
          from { opacity: 0; transform: translateY(-6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .user-menu-header {
          padding: 16px;
          background: #F8F6F0;
          border-bottom: 1px solid #E8E2D6;
          display: flex;
          align-items: center;
          gap: 12px;
        }
        .user-menu-avatar-large {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #1C1C1A;
          color: #FAF8F5;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 16px;
          font-weight: 700;
          flex-shrink: 0;
        }
        .user-menu-info {
          min-width: 0;
          flex: 1;
        }
        .user-menu-fullname {
          font-size: 13px;
          font-weight: 700;
          color: #1C1C1A;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .user-menu-email {
          font-size: 11px;
          color: #68645C;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          margin-bottom: 4px;
        }
        .user-menu-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 600;
          background: rgba(180, 154, 104, 0.15);
          color: #8A704C;
          padding: 2px 6px;
          border-radius: 4px;
        }
        .user-menu-links {
          padding: 8px;
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .user-menu-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 9px 12px;
          border-radius: 6px;
          text-decoration: none;
          color: #1C1C1A;
          transition: background 0.15s ease;
        }
        .user-menu-item:hover {
          background: #F5F1E8;
        }
        .user-menu-item.highlight-seller {
          background: #FAF6ED;
          border: 1px solid #EAE0CE;
        }
        .user-menu-item.highlight-admin {
          background: #F4F1EA;
          border: 1px solid #DDD6C8;
        }
        .menu-item-icon {
          font-size: 15px;
          flex-shrink: 0;
        }
        .menu-item-title {
          font-size: 12px;
          font-weight: 600;
          color: #1C1C1A;
        }
        .menu-item-sub {
          font-size: 10px;
          color: #68645C;
        }
        .user-menu-footer {
          padding: 8px;
          border-top: 1px solid #E8E2D6;
          background: #FAF8F5;
        }
        .user-menu-logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 9px 14px;
          border-radius: 6px;
          background: #FFF0F0;
          color: #B91C1C;
          border: 1px solid #FECACA;
          font-size: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .user-menu-logout-btn:hover {
          background: #FEE2E2;
          color: #991B1B;
        }

        @media (max-width: 1024px) {
          .zevro-nav {
            grid-template-columns: auto 1fr auto;
            height: 56px;
          }
          .nav-links { display: none; }
          .nav-hamburger { display: block; margin-left: var(--space-4); }
          .nav-icons .hide-mobile { display: none; }
          .nav-divider { display: none; }
          .nav-logo-img { height: 28px; }
        }
      `}} />
    </>
  );
}
