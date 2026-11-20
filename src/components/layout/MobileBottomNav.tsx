'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useUiStore } from '../../store/uiStore';
import { useSession } from 'next-auth/react';
import { 
  Home, 
  LayoutGrid, 
  Search, 
  Heart, 
  ShoppingBag, 
  User 
} from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();
  const { itemCount, openDrawer } = useCartStore();
  const { productIds } = useWishlistStore();
  const { setSearchOpen, setMobileMenuOpen } = useUiStore();
  const { data: session } = useSession();

  // Hide on admin, superadmin, seller routes
  if (
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/superadmin') ||
    pathname?.startsWith('/adminControl') ||
    pathname?.startsWith('/seller')
  ) {
    return null;
  }

  const isHome = pathname === '/';
  const isWishlist = pathname === '/wishlist';
  const isAccount = pathname?.startsWith('/account');

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Bottom Navigation">
      <Link href="/" className={`bottom-nav-item ${isHome ? 'active' : ''}`}>
        <Home size={19} strokeWidth={isHome ? 2.2 : 1.7} />
        <span>Home</span>
      </Link>

      <button 
        type="button" 
        onClick={() => setMobileMenuOpen(true)} 
        className="bottom-nav-item"
        aria-label="Explore Categories"
      >
        <LayoutGrid size={19} strokeWidth={1.7} />
        <span>Categories</span>
      </button>

      <button 
        type="button" 
        onClick={() => setSearchOpen(true)} 
        className="bottom-nav-item"
        aria-label="Search Catalog"
      >
        <Search size={19} strokeWidth={1.7} />
        <span>Search</span>
      </button>

      <Link href="/wishlist" className={`bottom-nav-item ${isWishlist ? 'active' : ''}`}>
        <div className="bottom-nav-badge-wrap">
          <Heart size={19} strokeWidth={isWishlist ? 2.2 : 1.7} fill={productIds.length > 0 ? "currentColor" : "none"} />
          {productIds.length > 0 && <span className="bottom-nav-badge">{productIds.length}</span>}
        </div>
        <span>Wishlist</span>
      </Link>

      <button 
        type="button" 
        onClick={openDrawer} 
        className="bottom-nav-item"
        aria-label="Open Shopping Bag"
      >
        <div className="bottom-nav-badge-wrap">
          <ShoppingBag size={19} strokeWidth={1.7} />
          {itemCount > 0 && <span className="bottom-nav-badge">{itemCount}</span>}
        </div>
        <span>Bag</span>
      </button>

      <Link href={session?.user ? "/account/settings" : "/login"} className={`bottom-nav-item ${isAccount ? 'active' : ''}`}>
        <User size={19} strokeWidth={isAccount ? 2.2 : 1.7} />
        <span>{session?.user ? 'Account' : 'Sign In'}</span>
      </Link>

      <style dangerouslySetInnerHTML={{ __html: `
        .mobile-bottom-nav {
          display: none;
        }

        @media (max-width: 768px) {
          .mobile-bottom-nav {
            display: flex;
            align-items: center;
            justify-content: space-around;
            position: fixed;
            bottom: 0;
            left: 0;
            right: 0;
            height: 58px;
            background: rgba(250, 247, 242, 0.96);
            backdrop-filter: blur(16px);
            -webkit-backdrop-filter: blur(16px);
            border-top: 1px solid var(--color-stone);
            z-index: 1000;
            padding: 4px 6px env(safe-area-inset-bottom, 6px);
            box-shadow: 0 -4px 16px rgba(20, 20, 18, 0.05);
          }

          .bottom-nav-item {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 3px;
            background: transparent;
            border: none;
            color: var(--color-ink-muted);
            font-size: 10px;
            font-weight: 500;
            letter-spacing: 0.02em;
            padding: 4px 6px;
            min-width: 48px;
            min-height: 44px;
            cursor: pointer;
            text-decoration: none;
            transition: color 0.15s ease, transform 0.15s ease;
          }

          .bottom-nav-item:active {
            transform: scale(0.92);
          }

          .bottom-nav-item.active {
            color: var(--color-ink);
            font-weight: 700;
          }

          .bottom-nav-badge-wrap {
            position: relative;
            display: inline-flex;
            align-items: center;
            justify-content: center;
          }

          .bottom-nav-badge {
            position: absolute;
            top: -5px;
            right: -8px;
            background: #B45309;
            color: #FFFFFF;
            font-size: 9px;
            font-weight: 700;
            line-height: 1;
            padding: 2px 4px;
            border-radius: 999px;
            min-width: 14px;
            text-align: center;
          }
        }
      `}} />
    </nav>
  );
}

