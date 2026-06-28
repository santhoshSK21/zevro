'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUiStore } from '../../store/uiStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useConfigStore } from '../../store/configStore';
import { useSession } from 'next-auth/react';
import { motion, useReducedMotion } from 'framer-motion';
import MegaMenu from './MegaMenu';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { setSearchOpen, setMobileMenuOpen } = useUiStore();
  const { itemCount, openDrawer } = useCartStore();
  const { productIds } = useWishlistStore();
  const { config } = useConfigStore();
  const prefersReducedMotion = useReducedMotion();

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 80);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const links = [
    { label: 'HOME', href: '/' },
    { label: 'NEW IN', href: '/products?category=new-in' },
    { label: 'WESTERN WEAR', href: '/category/western-wear' },
    { label: 'ETHNIC WEAR', href: '/category/ethnic-wear' },
    { label: 'INDO-WESTERN', href: '/category/indo-western' },
    { label: 'ACCESSORIES', href: '/category/accessories' },
  ];

  if (pathname?.startsWith('/admin')) return null;

  return (
    <>
      <motion.header
        className={`zevro-nav ${scrolled ? 'nav--scrolled' : ''}`}
        onMouseLeave={() => setHoveredCategory(null)}
        initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="nav-hamburger"
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

        {/* LOGO */}
        <div className="nav-logo-wrap">
          <Link href="/" className="nav-logo">
            {config?.storeLogoUrl ? (
              <img src={config.storeLogoUrl} alt={config.storeName || 'ZEVRO'} style={{ height: '28px', objectFit: 'contain' }} />
            ) : (
              config?.storeName || 'ZEVRO'
            )}
          </Link>
        </div>

        {/* DESKTOP LINKS */}
        <nav className="nav-links">
          {links.map(link => (
            <div
              key={link.label}
              onMouseEnter={() => setHoveredCategory(link.label)}
              className="nav-link-wrap"
            >
              <Link
                href={link.href}
                className={`label-caps link-underline ${pathname === link.href ? 'active' : ''}`}
                style={{ color: 'inherit' }}
              >
                {link.label}
              </Link>
            </div>
          ))}
        </nav>

        {/* ICONS */}
        <div className="nav-icons">
          <button onClick={() => setSearchOpen(true)} className="nav-icon-btn" aria-label="Search">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="11" cy="11" r="7" />
              <line x1="16.5" y1="16.5" x2="21" y2="21" />
            </svg>
          </button>
          <Link href={session ? "/account" : "/login"} className="nav-icon-btn" aria-label="Account">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <circle cx="12" cy="8" r="4" />
              <path d="M4 21c0-4.418 3.582-8 8-8s8 3.582 8 8" />
            </svg>
          </Link>
          <Link href="/account/wishlist" className="nav-icon-btn" aria-label="Wishlist" style={{ position: 'relative' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
            </svg>
            {productIds.length > 0 && (
              <span className="nav-badge">{productIds.length}</span>
            )}
          </Link>
          <button onClick={openDrawer} className="nav-icon-btn" aria-label="Cart" style={{ position: 'relative' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M6 6h15l-1.5 9h-12z" />
              <circle cx="9" cy="20" r="1" />
              <circle cx="18" cy="20" r="1" />
              <path d="M6 6L5 2H2" />
            </svg>
            {itemCount > 0 && (
              <span className="nav-badge">{itemCount}</span>
            )}
          </button>
        </div>

        {/* Mega Menu Dropdown */}
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
          height: 72px;
          background: var(--color-bg);
          color: var(--color-ink);
          border-bottom: var(--border-hairline);
          display: flex;
          align-items: center;
          padding: 0 var(--container-gutter);
          transition: height 0.4s cubic-bezier(0.65, 0, 0.35, 1);
        }
        .zevro-nav.nav--scrolled {
          height: 56px;
        }
        .nav-logo-wrap {
          flex: 1;
          display: flex;
          align-items: center;
        }
        .nav-logo {
          font-family: var(--font-display);
          font-size: var(--text-xl);
          letter-spacing: var(--tracking-tight);
          font-weight: 500;
          text-transform: uppercase;
          text-decoration: none;
          color: inherit;
        }
        .nav-links {
          display: flex;
          gap: var(--space-8);
        }
        .nav-link-wrap {
          padding: 24px 0;
        }
        .nav-icons {
          flex: 1;
          display: flex;
          justify-content: flex-end;
          gap: var(--space-6);
          align-items: center;
        }
        .nav-icon-btn {
          color: inherit;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
        }
        .nav-badge {
          position: absolute;
          top: -6px;
          right: -8px;
          background: var(--color-ink);
          color: var(--color-white);
          font-size: 10px;
          font-family: var(--font-ui);
          width: 16px;
          height: 16px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 500;
        }
        .nav-hamburger {
          display: none;
          color: inherit;
          margin-right: var(--space-4);
        }
        .mega-menu-panel {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--color-bg);
          border-bottom: var(--border-hairline);
          animation: fadeUp 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        @media (max-width: 1024px) {
          .zevro-nav { padding: 0 16px; height: 60px; }
          .zevro-nav.nav--scrolled { height: 56px; }
          .nav-links { display: none !important; }
          .nav-hamburger { display: flex; }
        }
      `}} />
    </>
  );
}
