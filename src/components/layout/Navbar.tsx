'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useUiStore } from '../../store/uiStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useSession } from 'next-auth/react';
import MegaMenu from './MegaMenu';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const { data: session } = useSession();
  const { setSearchOpen, setMobileMenuOpen } = useUiStore();
  const { itemCount, openDrawer } = useCartStore();
  const { productIds } = useWishlistStore();
  
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isHome = pathname === '/';
  const navBg = scrolled ? 'var(--ivory)' : (isHome ? 'transparent' : 'var(--ivory)');
  const navColor = (isHome && !scrolled && !hoveredCategory) ? '#FDFAF7' : 'var(--espresso)';
  const navShadow = scrolled ? 'var(--shadow-sm)' : 'none';
  const navHeight = scrolled ? 'var(--nav-height-sm)' : 'var(--nav-height)';
  
  // Luxury reference is always pitch black
  const finalBg = 'var(--black)';
  const finalColor = 'var(--ivory)';

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
      <header 
        className="nav-container"
        onMouseLeave={() => setHoveredCategory(null)}
        style={{
          position: 'sticky',
          top: 0,
          left: 0,
          right: 0,
          zIndex: 1000,
          height: navHeight,
          background: finalBg,
          color: finalColor,
          boxShadow: navShadow,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        {/* Mobile Hamburger */}
        <button 
          onClick={() => setMobileMenuOpen(true)}
          className="hide-desktop"
          style={{ color: 'inherit', fontSize: '24px', marginRight: '16px', display: 'none' }} // managed by CSS media queries
        >
          ☰
        </button>

        {/* LOGO */}
        <div style={{ flex: 1 }}>
          <Link href="/" style={{ 
            fontFamily: 'var(--font-display)', 
            fontSize: '22px', 
            letterSpacing: '0.15em',
            fontWeight: 500 
          }}>
            ZEVRO
          </Link>
        </div>

        {/* DESKTOP LINKS */}
        <nav className="desktop-nav" style={{ display: 'flex', gap: '32px' }}>
          {links.map(link => (
            <div 
              key={link.label}
              onMouseEnter={() => setHoveredCategory(link.label)}
              style={{ padding: '20px 0' }}
            >
              <Link href={link.href} className={`nav-link-underline ${pathname === link.href ? 'active' : ''}`} style={{
                fontFamily: 'var(--font-body)',
                fontSize: '10px',
                letterSpacing: '0.18em',
                fontWeight: 500,
                textTransform: 'uppercase',
                color: hoveredCategory === link.label ? 'var(--gold)' : 'inherit'
              }}>
                {link.label}
              </Link>
            </div>
          ))}
        </nav>

        {/* ICONS */}
        <div style={{ flex: 1, display: 'flex', justifyContent: 'flex-end', gap: '20px', alignItems: 'center' }}>
          <button onClick={() => setSearchOpen(true)} style={{ color: 'inherit', fontSize: '20px' }}>🔍</button>
          <Link href={session ? "/account" : "/login"} style={{ color: 'inherit', fontSize: '20px' }}>👤</Link>
          <Link href="/account/wishlist" style={{ color: 'inherit', fontSize: '20px', position: 'relative' }}>
            ❤
            {productIds.length > 0 && (
              <span style={{ position: 'absolute', top: '-6px', right: '-8px', background: 'var(--gold)', color: '#fff', fontSize: '9px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {productIds.length}
              </span>
            )}
          </Link>
          <button onClick={openDrawer} style={{ color: 'inherit', fontSize: '20px', position: 'relative' }}>
            🛒
            {itemCount > 0 && (
              <span style={{ position: 'absolute', top: '-6px', right: '-8px', background: 'var(--espresso)', color: '#fff', fontSize: '9px', width: '16px', height: '16px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {itemCount}
              </span>
            )}
          </button>
        </div>
        
        {/* Mega Menu Dropdown */}
        {hoveredCategory && ['WESTERN WEAR', 'ETHNIC WEAR', 'INDO-WESTERN', 'ACCESSORIES'].includes(hoveredCategory) && (
          <div style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            background: 'var(--ivory)',
            color: 'var(--espresso)',
            borderTop: '1px solid var(--gold)',
            boxShadow: 'var(--shadow-md)',
            animation: 'fadeUp 0.2s ease forwards'
          }}>
            <MegaMenu category={hoveredCategory} close={() => setHoveredCategory(null)} />
          </div>
        )}
      </header>

      <style dangerouslySetInnerHTML={{__html: `
        .nav-container { padding: 0 32px; }
        @media (max-width: 1024px) {
          .nav-container { padding: 0 16px; }
          .desktop-nav { display: none !important; }
          .hide-desktop { display: block !important; }
        }
      `}} />
    </>
  );
}
