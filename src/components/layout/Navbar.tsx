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
  const [lastScrollY, setLastScrollY] = useState(0);
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
      const currentScrollY = window.scrollY;
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
        className="zevro-nav"
        onMouseLeave={() => setHoveredCategory(null)}
        initial={prefersReducedMotion ? false : { y: '-100%' }}
        animate={{ y: hidden ? '-100%' : '0%' }}
        transition={{ duration: 0.3, ease: 'easeOut' }}
      >
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="nav-hamburger"
          aria-label="Open menu"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>

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

        <div className="nav-logo-wrap">
          <Link href="/" className="nav-logo" aria-label="Zevro home">
            <img
              src="/logot.png"
              alt="Zevro logo"
              className="nav-logo-img"
            />
          </Link>
        </div>

        <div className="nav-icons">
          <button onClick={() => setSearchOpen(true)} className="nav-icon-btn" aria-label="Search">
            SEARCH
          </button>
          <Link href={session ? "/account" : "/login"} className="nav-icon-btn" aria-label="Account">
            LOG IN
          </Link>
          <Link href="/account/wishlist" className="nav-icon-btn" aria-label="Wishlist">
            WISHLIST {productIds.length > 0 && `(${productIds.length})`}
          </Link>
          <button onClick={openDrawer} className="nav-icon-btn" aria-label="Cart">
            BAG {itemCount > 0 && `(${itemCount})`}
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
          grid-template-columns: 1fr auto 1fr;
          align-items: center;
          padding: 0 var(--container-gutter);
          border-bottom: none;
        }
        .nav-logo-wrap {
          text-align: center;
        }
        .nav-logo {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
        }
        .nav-logo-img {
          height: 48px;
          width: auto;
          display: block;
        }
        .nav-links {
          display: flex;
          gap: var(--space-6);
        }
        .nav-link-wrap {
          display: flex;
          align-items: center;
        }
        .nav-link {
          font-family: var(--font-ui);
          font-size: var(--text-xs);
          letter-spacing: var(--tracking-wider);
          text-transform: uppercase;
        }
        .nav-icons {
          display: flex;
          justify-content: flex-end;
          gap: var(--space-6);
        }
        .nav-icon-btn {
          font-family: var(--font-ui);
          font-size: var(--text-xs);
          letter-spacing: var(--tracking-wider);
          text-transform: uppercase;
          color: inherit;
        }
        .nav-hamburger {
          display: none;
        }
        .mega-menu-panel {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--color-bg);
          border-bottom: var(--border-hairline);
        }
        @media (max-width: 1024px) {
          .zevro-nav {
            grid-template-columns: auto 1fr auto;
            height: 56px;
          }
          .nav-links { display: none; }
          .nav-hamburger { display: block; margin-right: var(--space-4); }
          .nav-icons .nav-icon-btn { display: none; }
          .nav-icons .nav-icon-btn:last-child { display: block; } /* Show only BAG */
          .nav-logo-wrap { text-align: left; }
        }
      `}} />
    </>
  );
}
