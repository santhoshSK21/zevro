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

  if (pathname?.startsWith('/admin') || pathname?.startsWith('/superadmin')) return null;

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

          <Link href={session ? "/account" : "/login"} className="nav-icon-btn hide-mobile" aria-label="Account">
            <span className="icon-svg"><svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></span>
          </Link>
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
