'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useUiStore } from '../../store/uiStore';
import { useCartStore } from '../../store/cartStore';
import { useWishlistStore } from '../../store/wishlistStore';
import { useConfigStore } from '../../store/configStore';
import { useSession, signOut } from 'next-auth/react';
import { 
  Search, 
  ShoppingBag, 
  Heart, 
  User, 
  Menu, 
  X, 
  ChevronDown, 
  Sparkles,
  ArrowRight,
  Truck,
  TrendingUp,
  Tag
} from 'lucide-react';
import MegaMenu from './MegaMenu';

const DEPARTMENTS = [
  { id: '', label: 'All Departments' },
  { id: 'western-wear', label: 'Western Wear' },
  { id: 'ethnic-wear', label: 'Ethnic Wear' },
  { id: 'indo-western', label: 'Indo-Western' },
  { id: 'accessories', label: 'Accessories' }
];

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const { data: session } = useSession();
  const { setMobileMenuOpen, setSearchOpen } = useUiStore();
  const { itemCount, getTotal, openDrawer } = useCartStore();
  const { productIds } = useWishlistStore();
  const { config } = useConfigStore();

  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [selectedDept, setSelectedDept] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileSearchQuery, setMobileSearchQuery] = useState('');

  const userDropdownRef = useRef<HTMLDivElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const leaveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Close dropdowns on route change
  useEffect(() => {
    setUserDropdownOpen(false);
    setSearchFocused(false);
    setHoveredCategory(null);
  }, [pathname]);

  // Click outside listener for dropdown & search suggestions
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (userDropdownRef.current && !userDropdownRef.current.contains(e.target as Node)) {
        setUserDropdownOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.set('q', searchQuery.trim());
      if (selectedDept) params.set('category', selectedDept);
      router.push(`/search?${params.toString()}`);
      setSearchFocused(false);
    }
  };

  const handleMobileSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (mobileSearchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(mobileSearchQuery.trim())}`);
    }
  };

  const handleQuickKeyword = (kw: string) => {
    setSearchQuery(kw);
    router.push(`/search?q=${encodeURIComponent(kw)}`);
    setSearchFocused(false);
  };

  const handleCategoryMouseEnter = (label: string) => {
    if (leaveTimerRef.current) {
      clearTimeout(leaveTimerRef.current);
      leaveTimerRef.current = null;
    }
    setHoveredCategory(label);
  };

  const handleCategoryMouseLeave = () => {
    leaveTimerRef.current = setTimeout(() => {
      setHoveredCategory(null);
    }, 180);
  };

  // Skip rendering on admin or seller routes
  if (
    pathname?.startsWith('/admin') ||
    pathname?.startsWith('/superadmin') ||
    pathname?.startsWith('/seller')
  ) {
    return null;
  }

  const navCategories = [
    { label: 'NEW IN', href: '/category/new-in' },
    { label: 'WESTERN WEAR', href: '/category/western-wear' },
    { label: 'ETHNIC WEAR', href: '/category/ethnic-wear' },
    { label: 'INDO-WESTERN', href: '/category/indo-western' },
    { label: 'ACCESSORIES', href: '/category/accessories' },
    { label: 'ALL COLLECTIONS', href: '/products' },
  ];

  const popularKeywords = [
    'Mulberry Silk',
    'Anarkali Suits',
    'Sarees & Drapes',
    'Velvet Blazers',
    'Co-ord Sets',
    'Kundan Jewelry'
  ];

  const cartTotal = getTotal();

  return (
    <header className="zevro-header" onMouseLeave={handleCategoryMouseLeave}>
      {/* Tier 1: Main Header (Logo, Matched Luxury Search Bar, Actions) */}
      <div className="header-primary-row">
        <div className="container header-primary-inner">
          
          {/* Left: Mobile Hamburger & Brand Logo */}
          <div className="header-left-col">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="header-hamburger-btn hide-desktop"
              aria-label="Open navigation menu"
            >
              <Menu size={22} />
            </button>

            <Link href="/" className="header-logo" aria-label="ZEVRO Home">
              <img
                src="/logot.png"
                alt="ZEVRO"
                className="header-logo-img"
              />
            </Link>
          </div>

          {/* Center: Matched Modern Luxury Search Bar */}
          <div className="header-search-col hide-mobile" ref={searchContainerRef}>
            <form onSubmit={handleSearchSubmit} className={`header-search-form ${searchFocused ? 'is-focused' : ''}`}>
              <Search size={16} className="search-leading-icon" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                placeholder="Search luxury sarees, anarkalis, dresses, lehengas, jewellery..."
                className="header-search-input"
                aria-label="Search catalog"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="search-clear-btn"
                  aria-label="Clear query"
                >
                  <X size={14} />
                </button>
              )}
              <button type="submit" className="header-search-submit-icon" aria-label="Execute search">
                <Search size={15} />
              </button>
            </form>

            {/* Live Auto-Suggest Dropdown */}
            {searchFocused && (
              <div className="header-search-dropdown">
                <div className="dropdown-section">
                  <div className="dropdown-popular-heading">
                    <Sparkles size={12} className="text-gold" />
                    <span>POPULAR SEARCHES</span>
                  </div>
                  <div className="dropdown-popular-chips">
                    {popularKeywords.map((kw) => (
                      <button
                        key={kw}
                        type="button"
                        onClick={() => handleQuickKeyword(kw)}
                        className="popular-chip-btn"
                      >
                        <TrendingUp size={11} className="chip-icon" />
                        <span>{kw}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="dropdown-dept-row">
                  <span className="dropdown-sub-label">DEPARTMENTS:</span>
                  <div className="dropdown-dept-links">
                    <Link href="/category/western-wear" onClick={() => setSearchFocused(false)} className="dept-quick-link">Western Wear</Link>
                    <span>•</span>
                    <Link href="/category/ethnic-wear" onClick={() => setSearchFocused(false)} className="dept-quick-link">Ethnic Wear</Link>
                    <span>•</span>
                    <Link href="/category/indo-western" onClick={() => setSearchFocused(false)} className="dept-quick-link">Indo-Western</Link>
                    <span>•</span>
                    <Link href="/category/accessories" onClick={() => setSearchFocused(false)} className="dept-quick-link">Accessories</Link>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Actions (Wishlist, Cart, Account) */}
          <div className="header-actions-col">
            
            {/* Wishlist Button */}
            <Link href="/wishlist" className="header-action-btn hide-mobile" aria-label="View Wishlist">
              <span className="action-icon-box">
                <Heart 
                  size={19} 
                  strokeWidth={1.6} 
                  fill={productIds.length > 0 ? "var(--color-accent, #C5A869)" : "none"} 
                  color={productIds.length > 0 ? "var(--color-accent, #C5A869)" : "var(--color-ink, #111827)"} 
                />
                {productIds.length > 0 && <span className="action-badge-dot">{productIds.length}</span>}
              </span>
              <span className="action-btn-label">Wishlist</span>
            </Link>

            {/* Cart Button */}
            <button 
              type="button" 
              onClick={openDrawer} 
              className="header-action-btn header-cart-action" 
              aria-label="Shopping Bag"
            >
              <span className="action-icon-box">
                <ShoppingBag size={19} strokeWidth={1.6} color="var(--color-ink, #111827)" />
                {itemCount > 0 && <span className="action-badge-dot">{itemCount}</span>}
              </span>
              <div className="cart-action-details hide-mobile">
                <span className="action-btn-label">Bag</span>
                {itemCount > 0 && (
                  <span className="cart-total-tag">₹{(cartTotal / 100).toLocaleString('en-IN')}</span>
                )}
              </div>
            </button>

            {/* User Account / Sign In */}
            {session?.user ? (
              <div className="nav-user-dropdown-wrap" ref={userDropdownRef}>
                <button
                  type="button"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="user-profile-trigger"
                  aria-label="User account"
                  aria-expanded={userDropdownOpen}
                >
                  <div className="user-avatar-circle">
                    {(session.user.name || session.user.email || 'U').charAt(0).toUpperCase()}
                  </div>
                  <span className="user-name-text hide-mobile">
                    {session.user.name?.split(' ')[0] || 'Account'}
                  </span>
                  <ChevronDown size={13} className={`chevron-indicator hide-mobile ${userDropdownOpen ? 'is-open' : ''}`} />
                </button>

                {userDropdownOpen && (
                  <div className="nav-user-menu">
                    <div className="user-menu-header">
                      <div className="user-menu-avatar-large">
                        {(session.user.name || session.user.email || 'U').charAt(0).toUpperCase()}
                      </div>
                      <div className="user-menu-info">
                        <div className="user-menu-fullname">{session.user.name || 'Member'}</div>
                        <div className="user-menu-email">{session.user.email}</div>
                        <span className="user-menu-badge">
                          {session.user.role === 'admin' ? '👑 Atelier Admin' : '✨ Privileged Client'}
                        </span>
                      </div>
                    </div>

                    <div className="user-menu-links">
                      <Link
                        href="/account/settings"
                        onClick={() => setUserDropdownOpen(false)}
                        className="user-menu-item"
                      >
                        <span className="menu-item-icon">✏️</span>
                        <div>
                          <div className="menu-item-title">Profile Settings</div>
                          <div className="menu-item-sub">Personal info & addresses</div>
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
                          <div className="menu-item-sub">Tracking & status history</div>
                        </div>
                      </Link>

                      {session.user.role === 'admin' && (
                        <Link
                          href="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="user-menu-item highlight-admin"
                        >
                          <span className="menu-item-icon">⚡</span>
                          <div>
                            <div className="menu-item-title">Admin Console</div>
                            <div className="menu-item-sub">Catalog, inventory & orders</div>
                          </div>
                        </Link>
                      )}
                    </div>

                    <div className="user-menu-footer">
                      <button
                        type="button"
                        onClick={async () => {
                          setUserDropdownOpen(false);
                          await signOut({ callbackUrl: '/' });
                        }}
                        className="user-menu-logout-btn"
                      >
                        <span>Sign Out</span>
                        <ArrowRight size={13} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link href="/login" className="header-action-btn header-signin-action hide-mobile" aria-label="Sign In">
                <span className="action-icon-box">
                  <User size={19} strokeWidth={1.6} color="var(--color-ink, #111827)" />
                </span>
                <span className="action-btn-label">Sign In</span>
              </Link>
            )}

          </div>

        </div>
      </div>

      {/* Mobile Prominent Search Bar (Amazon/Flipkart Mobile Experience) */}
      <div className="header-mobile-search-row hide-desktop">
        <div className="container">
          <form onSubmit={handleMobileSearchSubmit} className="mobile-search-form">
            <Search size={15} className="mobile-search-icon" />
            <input
              type="text"
              value={mobileSearchQuery}
              onChange={(e) => setMobileSearchQuery(e.target.value)}
              placeholder="Search sarees, anarkalis, dresses, silks..."
              className="mobile-search-input"
              aria-label="Search garments"
            />
            {mobileSearchQuery && (
              <button
                type="button"
                onClick={() => setMobileSearchQuery('')}
                className="mobile-clear-btn"
                aria-label="Clear search"
              >
                <X size={13} />
              </button>
            )}
            <button type="submit" className="mobile-search-btn">
              SEARCH
            </button>
          </form>
        </div>
      </div>

      {/* Tier 2: Category Navigation Strip (With Theme-Reactive Hover States) */}
      <div className="header-secondary-row hide-mobile">
        <div className="container header-secondary-inner">
          <nav className="header-cat-nav" aria-label="Department navigation">
            {navCategories.map((item) => {
              const isHovered = hoveredCategory === item.label;
              const hasDropdown = ['NEW IN', 'WESTERN WEAR', 'ETHNIC WEAR', 'INDO-WESTERN', 'ACCESSORIES'].includes(item.label);
              return (
                <div 
                  key={item.label}
                  onMouseEnter={() => handleCategoryMouseEnter(item.label)}
                  onMouseLeave={handleCategoryMouseLeave}
                  className={`header-cat-item-wrap ${isHovered ? 'is-active' : ''}`}
                >
                  <Link href={item.href} className="header-cat-link">
                    <span>{item.label}</span>
                    {hasDropdown && (
                      <ChevronDown size={11} className={`cat-arrow-icon ${isHovered ? 'is-rotated' : ''}`} />
                    )}
                  </Link>

                  {/* Option A: Sleek Single-Column Flyout Anchored Directly Under Hovered Tab */}
                  {isHovered && hasDropdown && (
                    <div 
                      className="cat-flyout-anchor"
                      onMouseEnter={() => handleCategoryMouseEnter(item.label)}
                      onMouseLeave={handleCategoryMouseLeave}
                    >
                      <MegaMenu category={item.label} close={() => setHoveredCategory(null)} />
                    </div>
                  )}
                </div>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        .zevro-header {
          position: sticky;
          top: 0;
          left: 0;
          right: 0;
          z-index: 1000;
          background: #FFFFFF;
          border-bottom: 1px solid var(--color-stone, #E5E7EB);
          transition: box-shadow 0.25s ease;
        }

        .text-gold {
          color: var(--color-accent, #C5A869);
        }

        /* Tier 1 Primary Row */
        .header-primary-row {
          padding: 12px 0;
          background: #FFFFFF;
          border-bottom: 1px solid var(--color-stone, #E5E7EB);
        }

        .header-primary-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 20px;
        }

        .header-left-col {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .header-logo {
          display: inline-flex;
          align-items: center;
          text-decoration: none;
        }

        .header-logo-img {
          height: 32px;
          width: auto;
          display: block;
        }

        .header-hamburger-btn {
          background: none;
          border: none;
          color: var(--color-ink, #141412);
          cursor: pointer;
          padding: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        /* Search Bar (Amazon / Luxury Commerce Matched Design) */
        .header-search-col {
          flex: 1;
          max-width: 780px;
          position: relative;
          margin: 0 16px;
        }

        .header-search-form {
          display: flex;
          align-items: center;
          height: 40px;
          background: #FFFFFF;
          border: 1px solid var(--color-stone, #E5E7EB);
          border-radius: var(--radius-full, 9999px);
          padding: 0 4px 0 14px;
          transition: all 0.2s ease;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.04);
        }

        .header-search-form:hover,
        .header-search-form.is-focused {
          border-color: var(--color-ink, #111827);
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.08);
        }

        .search-leading-icon {
          color: var(--color-ink-muted, #595F69);
          flex-shrink: 0;
          margin-right: 10px;
        }

        .header-search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-family: var(--font-body, sans-serif);
          font-size: 13px;
          color: var(--color-ink, #111827);
          outline: none;
          padding: 0;
          min-width: 0;
        }

        .header-search-input::placeholder {
          color: var(--color-ink-muted, #595F69);
          font-size: 12.5px;
        }

        .search-clear-btn {
          background: none;
          border: none;
          color: var(--color-ink-muted, #595F69);
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-right: 4px;
        }

        .search-clear-btn:hover {
          color: var(--color-ink, #111827);
        }

        .header-search-submit-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: var(--color-ink, #111827);
          color: #FFFFFF;
          border: none;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
          flex-shrink: 0;
        }

        .header-search-submit-icon:hover {
          background: var(--color-accent, #C5A869);
          transform: scale(1.05);
        }

        /* Search Dropdown */
        .header-search-dropdown {
          position: absolute;
          top: calc(100% + 8px);
          left: 0;
          right: 0;
          background: #FFFFFF;
          border: 1px solid var(--color-stone, #E5E7EB);
          border-radius: var(--radius-md, 8px);
          padding: 16px 18px;
          box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
          z-index: 1050;
        }
          background: var(--color-surface, #FAF7F2);
          border: 1px solid var(--color-stone, #DFD8CC);
          border-radius: var(--radius-md, 8px);
          padding: 18px 20px;
          box-shadow: 0 16px 40px rgba(20, 20, 18, 0.15);
          z-index: 1050;
        }

        .dropdown-popular-heading {
          display: flex;
          align-items: center;
          gap: 6px;
          font-family: var(--font-ui);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: var(--color-accent, #C5A869);
          margin-bottom: 12px;
          text-transform: uppercase;
        }

        .dropdown-popular-chips {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }

        .popular-chip-btn {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          background: var(--color-bg, #FAF7F2);
          border: 1px solid var(--color-stone, #DFD8CC);
          border-radius: var(--radius-full, 9999px);
          padding: 5px 12px;
          font-size: 12px;
          color: var(--color-ink, #141412);
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .chip-icon {
          color: var(--color-accent, #C5A869);
        }

        .popular-chip-btn:hover {
          background: var(--color-ink, #141412);
          color: #FAF7F2;
          border-color: var(--color-ink, #141412);
        }

        .popular-chip-btn:hover .chip-icon {
          color: var(--color-accent, #C5A869);
        }

        .dropdown-dept-row {
          display: flex;
          align-items: center;
          gap: 8px;
          padding-top: 10px;
          border-top: 1px dashed var(--color-stone, #DFD8CC);
          font-size: 11px;
        }

        .dropdown-sub-label {
          font-family: var(--font-ui);
          font-size: 9.5px;
          font-weight: 700;
          color: var(--color-ink-muted, #6E6A62);
          letter-spacing: 0.1em;
        }

        .dropdown-dept-links {
          display: flex;
          align-items: center;
          gap: 8px;
          flex-wrap: wrap;
        }

        .dept-quick-link {
          color: var(--color-ink, #141412);
          text-decoration: none;
          font-weight: 500;
        }

        .dept-quick-link:hover {
          color: var(--color-accent, #C5A869);
        }

        /* Mobile Search Bar Row */
        .header-mobile-search-row {
          padding: 8px 0;
          background: var(--color-surface, #FAF7F2);
          border-bottom: 1px solid var(--color-stone, #DFD8CC);
        }

        .mobile-search-form {
          display: flex;
          align-items: center;
          background: var(--color-bg, #FAF7F2);
          border: 1px solid var(--color-stone, #DFD8CC);
          border-radius: var(--radius-full, 9999px);
          padding: 2px 2px 2px 12px;
        }

        .mobile-search-icon {
          color: var(--color-accent, #C5A869);
          margin-right: 8px;
          flex-shrink: 0;
        }

        .mobile-search-input {
          flex: 1;
          border: none;
          background: transparent;
          font-size: 12.5px;
          color: var(--color-ink, #141412);
          outline: none;
          min-width: 0;
        }

        .mobile-clear-btn {
          background: none;
          border: none;
          color: var(--color-ink-muted, #6E6A62);
          padding: 4px;
        }

        .mobile-search-btn {
          background: var(--color-accent, #C5A869);
          color: var(--color-dark, #141412);
          border: none;
          border-radius: var(--radius-full, 9999px);
          padding: 6px 14px;
          font-family: var(--font-ui);
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        /* Right Actions - Sleek Luxury Fashion Navigation */
        .header-actions-col {
          display: flex;
          align-items: center;
          gap: 16px;
          flex-shrink: 0;
        }

        .header-action-btn {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          gap: 2px;
          text-decoration: none;
          color: var(--color-ink, #111827);
          cursor: pointer;
          background: none;
          border: none;
          padding: 2px 4px;
          transition: color 0.15s ease, transform 0.15s ease;
        }

        .header-action-btn:hover {
          color: var(--color-accent, #C5A869);
        }

        .action-icon-box {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
        }

        .action-badge-dot {
          position: absolute;
          top: -4px;
          right: -8px;
          background: var(--color-ink, #111827);
          color: #FFFFFF;
          font-family: var(--font-ui, sans-serif);
          font-size: 9px;
          font-weight: 700;
          min-width: 16px;
          height: 16px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 4px;
          line-height: 1;
        }

        .action-btn-label {
          font-family: var(--font-ui, sans-serif);
          font-size: 10px;
          font-weight: 600;
          letter-spacing: 0.04em;
          color: var(--color-ink, #111827);
        }

        .header-cart-action {
          display: inline-flex;
          flex-direction: row;
          align-items: center;
          gap: 7px;
          padding: 6px 14px;
          background: var(--color-surface, #F8F9FA);
          border: 1px solid var(--color-stone, #E5E7EB);
          border-radius: 9999px;
          transition: all 0.2s ease;
        }

        .header-cart-action:hover {
          border-color: var(--color-ink, #111827);
          background: #FFFFFF;
        }

        .cart-action-details {
          display: flex;
          align-items: center;
          gap: 6px;
        }

        .cart-total-tag {
          font-family: var(--font-body, sans-serif);
          font-size: 11px;
          font-weight: 700;
          color: var(--color-ink, #111827);
        }

        .header-signin-action {
          display: inline-flex;
          flex-direction: row;
          align-items: center;
          gap: 6px;
          padding: 6px 14px;
          border: 1px solid var(--color-stone, #E5E7EB);
          border-radius: 9999px;
          font-family: var(--font-ui, sans-serif);
          font-size: 11.5px;
          font-weight: 600;
          color: var(--color-ink, #111827);
          transition: all 0.2s ease;
        }

        .header-signin-action:hover {
          border-color: var(--color-ink, #111827);
          background: var(--color-surface, #F8F9FA);
        }

        .user-profile-trigger {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: var(--color-surface, #F8F9FA);
          border: 1px solid var(--color-stone, #E5E7EB);
          border-radius: var(--radius-full, 9999px);
          padding: 4px 10px 4px 6px;
          color: var(--color-ink, #111827);
          cursor: pointer;
        }

        .user-avatar-circle {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: var(--color-accent, #C5A869);
          color: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 11px;
          font-weight: 700;
        }

        .user-name-text {
          font-size: 12px;
          font-weight: 600;
        }

        .chevron-indicator {
          transition: transform 0.2s ease;
          color: var(--color-ink-muted, #595F69);
        }

        .chevron-indicator.is-open {
          transform: rotate(180deg);
        }

        /* Tier 2: Category Bar (Centered, Clean Luxury Navigation) */
        .header-secondary-row {
          background: #FFFFFF;
          padding: 9px 0;
          border-bottom: 1px solid var(--color-stone, #E5E7EB);
        }

        .header-secondary-inner {
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .header-cat-nav {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 32px;
        }

        .header-cat-item-wrap {
          position: relative;
          padding: 2px 8px;
          border-radius: 4px;
          transition: background-color 0.2s ease;
        }

        .header-cat-item-wrap.is-active,
        .header-cat-item-wrap:hover {
          background: color-mix(in srgb, var(--color-accent, #C5A869) 12%, transparent);
        }

        .header-cat-link {
          font-family: var(--font-ui);
          font-size: 11.5px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-ink, #141412);
          text-decoration: none;
          padding: 4px 0;
          position: relative;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          transition: color 0.15s ease;
        }

        .header-cat-link:hover,
        .header-cat-item-wrap.is-active .header-cat-link {
          color: var(--color-accent, #C5A869) !important;
        }

        .header-cat-link::after {
          content: '';
          position: absolute;
          bottom: -2px;
          left: 0;
          right: 0;
          height: 2px;
          background: var(--color-accent, #C5A869);
          transform: scaleX(0);
          transition: transform 0.2s ease;
        }

        .header-cat-link:hover::after,
        .header-cat-item-wrap.is-active .header-cat-link::after {
          transform: scaleX(1);
        }

        .cat-arrow-icon {
          color: var(--color-ink-muted, #6E6A62);
          transition: transform 0.2s ease, color 0.2s ease;
        }

        .header-cat-item-wrap.is-active .cat-arrow-icon,
        .header-cat-link:hover .cat-arrow-icon {
          color: var(--color-accent, #C5A869);
        }

        .cat-arrow-icon.is-rotated {
          transform: rotate(180deg);
        }

        .header-perk-badge {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          color: var(--color-ink-muted, #6E6A62);
          font-weight: 500;
        }

        /* Option A: Compact Single-Column Flyout Menu Anchored Below Tab */
        .cat-flyout-anchor {
          position: absolute;
          top: calc(100% + 4px);
          left: 0;
          z-index: 1200;
          pointer-events: auto;
        }

        /* Invisible bridge to prevent cursor dropout */
        .cat-flyout-anchor::before {
          content: '';
          position: absolute;
          top: -10px;
          left: 0;
          right: 0;
          height: 12px;
        }

        /* User Menu Dropdown */
        .nav-user-dropdown-wrap {
          position: relative;
        }

        .nav-user-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          width: 260px;
          background: var(--color-surface, #FAF7F2);
          border: 1px solid var(--color-stone, #DFD8CC);
          border-radius: var(--radius-md, 8px);
          box-shadow: 0 16px 40px rgba(20, 20, 18, 0.15);
          padding: 12px;
          z-index: 1050;
        }

        .user-menu-header {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-bottom: 12px;
          border-bottom: 1px solid var(--color-stone, #DFD8CC);
          margin-bottom: 8px;
        }

        .user-menu-avatar-large {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: var(--color-accent, #C5A869);
          color: var(--color-dark, #141412);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 700;
        }

        .user-menu-fullname {
          font-size: 13px;
          font-weight: 600;
          color: var(--color-ink, #141412);
        }

        .user-menu-email {
          font-size: 11px;
          color: var(--color-ink-muted, #6E6A62);
          word-break: break-all;
        }

        .user-menu-badge {
          display: inline-block;
          font-size: 10px;
          font-weight: 700;
          color: var(--color-accent, #C5A869);
          margin-top: 2px;
        }

        .user-menu-links {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .user-menu-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 8px 10px;
          border-radius: var(--radius-xs, 4px);
          text-decoration: none;
          color: var(--color-ink, #141412);
          transition: background 0.15s ease;
        }

        .user-menu-item:hover {
          background: var(--color-bg, #FAF7F2);
          color: var(--color-accent, #C5A869);
        }

        .menu-item-title {
          font-size: 12px;
          font-weight: 600;
        }

        .menu-item-sub {
          font-size: 10.5px;
          color: var(--color-ink-muted, #6E6A62);
        }

        .user-menu-footer {
          margin-top: 8px;
          padding-top: 8px;
          border-top: 1px solid var(--color-stone, #DFD8CC);
        }

        .user-menu-logout-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 8px 10px;
          font-size: 12px;
          font-weight: 600;
          color: #991B1B;
          background: none;
          border: none;
          border-radius: var(--radius-xs, 4px);
          cursor: pointer;
        }

        .user-menu-logout-btn:hover {
          background: #FEF2F2;
        }

        /* Responsive */
        .hide-mobile {
          display: flex;
        }

        .hide-desktop {
          display: none;
        }

        @media (max-width: 860px) {
          .hide-mobile {
            display: none !important;
          }

          .hide-desktop {
            display: flex !important;
          }

          .header-primary-row {
            padding: 8px 0;
            border-bottom: none;
          }
        }
      `}} />
    </header>
  );
}
