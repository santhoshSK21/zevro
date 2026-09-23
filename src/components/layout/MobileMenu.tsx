'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useUiStore } from '@/store/uiStore';
import { useCartStore } from '@/store/cartStore';
import { useWishlistStore } from '@/store/wishlistStore';
import { useSession } from 'next-auth/react';
import { 
  X, 
  ChevronDown, 
  ShoppingBag, 
  Heart, 
  User, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

const CATEGORIES = [
  {
    id: 'western',
    name: 'WESTERN WEAR',
    slug: 'western-wear',
    subcategories: [
      { name: 'Dresses & Gowns', href: '/category/western-wear?sub=dresses' },
      { name: 'Co-ord Sets', href: '/category/western-wear?sub=co-ords' },
      { name: 'Tops & Shirts', href: '/category/western-wear?sub=tops' },
      { name: 'Trousers & Skirts', href: '/category/western-wear?sub=trousers' },
      { name: 'Blazers & Jackets', href: '/category/western-wear?sub=blazers' },
      { name: 'Jumpsuits', href: '/category/western-wear?sub=jumpsuits' }
    ]
  },
  {
    id: 'ethnic',
    name: 'ETHNIC WEAR',
    slug: 'ethnic-wear',
    subcategories: [
      { name: 'Sarees & Drapes', href: '/category/ethnic-wear?sub=sarees' },
      { name: 'Anarkali Suits', href: '/category/ethnic-wear?sub=anarkalis' },
      { name: 'Lehengas & Sets', href: '/category/ethnic-wear?sub=lehengas' },
      { name: 'Kurta Sets', href: '/category/ethnic-wear?sub=kurtis' },
      { name: 'Festive Dupattas', href: '/category/ethnic-wear?sub=dupattas' }
    ]
  },
  {
    id: 'indo-western',
    name: 'INDO-WESTERN',
    slug: 'indo-western',
    subcategories: [
      { name: 'Cape Gowns', href: '/category/indo-western?sub=cape-suits' },
      { name: 'Draped Dhoti Sets', href: '/category/indo-western?sub=dhoti-sets' },
      { name: 'Fusion Co-ords', href: '/category/indo-western?sub=fusion-sets' },
      { name: 'Crop Top & Skirt', href: '/category/indo-western?sub=indo-gowns' }
    ]
  },
  {
    id: 'accessories',
    name: 'ACCESSORIES',
    slug: 'accessories',
    subcategories: [
      { name: 'Jewelry & Kundan Sets', href: '/category/accessories?sub=jewellery' },
      { name: 'Handcrafted Clutches & Potlis', href: '/category/accessories?sub=bags' },
      { name: 'Belts & Embellishments', href: '/category/accessories?sub=belts' },
      { name: 'Footwear & Juttis', href: '/category/accessories?sub=footwear' }
    ]
  }
];

export default function MobileMenu() {
  const { isMobileMenuOpen, setMobileMenuOpen } = useUiStore();
  const { itemCount } = useCartStore();
  const { productIds } = useWishlistStore();
  const { data: session } = useSession();
  const [openCategory, setOpenCategory] = useState<string | null>(null);

  if (!isMobileMenuOpen) return null;

  const toggle = (cat: string) => setOpenCategory(c => c === cat ? null : cat);
  const close = () => setMobileMenuOpen(false);

  return (
    <div className="mobile-menu-overlay">
      
      {/* Header */}
      <div className="mobile-menu-header">
        <Link href="/" onClick={close} className="mobile-menu-brand">
          <img src="/logot.png" alt="Zevro" style={{ height: '32px', width: 'auto', objectFit: 'contain' }} />
        </Link>
        <button onClick={close} className="mobile-menu-close" aria-label="Close menu">
          <X size={22} />
        </button>
      </div>

      {/* Quick Action Bar (Account, Wishlist, Cart) */}
      <div className="mobile-menu-quickbar">
        <Link href={session ? "/account" : "/login"} onClick={close} className="quickbar-item">
          <User size={16} />
          <span>{session ? 'Account' : 'Login'}</span>
        </Link>
        <div className="quickbar-divider" />
        <Link href="/wishlist" onClick={close} className="quickbar-item">
          <Heart size={16} fill={productIds.length > 0 ? "currentColor" : "none"} />
          <span>Wishlist ({productIds.length})</span>
        </Link>
        <div className="quickbar-divider" />
        <Link href="/cart" onClick={close} className="quickbar-item">
          <ShoppingBag size={16} />
          <span>Bag ({itemCount})</span>
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="mobile-menu-nav">
        <div className="mobile-nav-list">
          
          {/* New In */}
          <Link href="/category/new-in" onClick={close} className="mobile-nav-link highlight">
            <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Sparkles size={16} color="#C5A880" />
              NEW ARRIVALS
            </span>
            <span className="badge-new">Drop 01</span>
          </Link>

          {/* Categories with Dropdown */}
          {CATEGORIES.map(cat => {
            const isOpen = openCategory === cat.id;
            return (
              <div key={cat.id} className="mobile-cat-group">
                <div 
                  className={`mobile-cat-header ${isOpen ? 'is-active' : ''}`}
                  onClick={() => toggle(cat.id)}
                >
                  <span className="mobile-cat-name">{cat.name}</span>
                  <ChevronDown 
                    size={16} 
                    style={{ 
                      transform: isOpen ? 'rotate(180deg)' : 'none', 
                      transition: 'transform 0.25s ease',
                      color: isOpen ? '#0F172A' : '#94A3B8'
                    }} 
                  />
                </div>

                {isOpen && (
                  <div className="mobile-subcat-list">
                    <Link 
                      href={`/category/${cat.slug}`} 
                      onClick={close} 
                      className="mobile-subcat-all"
                    >
                      <span>Explore All {cat.name}</span>
                      <ArrowRight size={13} />
                    </Link>
                    {cat.subcategories.map(sub => (
                      <Link 
                        key={sub.name} 
                        href={sub.href} 
                        onClick={close}
                        className="mobile-subcat-item"
                      >
                        {sub.name}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            );
          })}

          {/* All Collection */}
          <Link href="/products" onClick={close} className="mobile-nav-link">
            <span>ALL GARMENTS</span>
          </Link>

        </div>
      </nav>

      {/* Footer Support Links */}
      <div className="mobile-menu-footer">
        <div className="footer-links-grid">
          <Link href="/track" onClick={close}>Track Order</Link>
          <Link href="/faq" onClick={close}>FAQ & Help</Link>
          <Link href="/size-guide" onClick={close}>Size Guide</Link>
          <Link href="/returns" onClick={close}>Returns & Exchange</Link>
          <Link href="/contact" onClick={close}>Contact Us</Link>
          <Link href="/about" onClick={close}>Our Story</Link>
        </div>
        <p className="mobile-menu-copyright">
          © {new Date().getFullYear()} ZEVRO HAUTE COUTURE. ALL RIGHTS RESERVED.
        </p>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .mobile-menu-overlay {
          position: fixed;
          inset: 0;
          z-index: 3000;
          background-color: #FAF8F5;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          animation: menuSlideIn 0.28s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        .mobile-menu-header {
          padding: 16px 20px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 1px solid rgba(0,0,0,0.06);
          background-color: #FAF8F5;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .mobile-menu-close {
          background: transparent;
          border: none;
          color: #0F172A;
          cursor: pointer;
          display: flex;
          padding: 6px;
        }

        .mobile-menu-quickbar {
          display: flex;
          align-items: center;
          justify-content: space-around;
          padding: 14px 20px;
          background-color: #FFFFFF;
          border-bottom: 1px solid #ECEAE5;
        }

        .quickbar-item {
          display: flex;
          align-items: center;
          gap: 6px;
          text-decoration: none;
          color: #0F172A;
          font-family: var(--font-ui, sans-serif);
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.04em;
        }

        .quickbar-divider {
          width: 1px;
          height: 16px;
          background-color: #E2E8F0;
        }

        .mobile-menu-nav {
          padding: 20px 20px;
          flex: 1;
        }

        .mobile-nav-list {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .mobile-nav-link {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 14px 16px;
          background: #FFFFFF;
          border: 1px solid #ECEAE5;
          border-radius: 6px;
          text-decoration: none;
          color: #0F172A;
          font-family: var(--font-ui, sans-serif);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
        }

        .mobile-nav-link.highlight {
          background-color: #0F172A;
          color: #FAF8F5;
          border-color: #0F172A;
        }

        .badge-new {
          background-color: #C5A880;
          color: #0F172A;
          font-size: 10px;
          font-weight: 800;
          padding: 2px 8px;
          border-radius: 12px;
          letter-spacing: 0.06em;
        }

        .mobile-cat-group {
          background: #FFFFFF;
          border: 1px solid #ECEAE5;
          border-radius: 6px;
          overflow: hidden;
        }

        .mobile-cat-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px 16px;
          cursor: pointer;
          user-select: none;
        }

        .mobile-cat-name {
          font-family: var(--font-ui, sans-serif);
          font-size: 13px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #0F172A;
        }

        .mobile-subcat-list {
          padding: 8px 16px 16px;
          background-color: #FAF8F5;
          border-top: 1px solid #F1EFEA;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .mobile-subcat-all {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 8px 10px;
          background-color: rgba(197, 168, 128, 0.12);
          border-radius: 4px;
          text-decoration: none;
          color: #0F172A;
          font-family: var(--font-ui, sans-serif);
          font-size: 12px;
          font-weight: 700;
          letter-spacing: 0.04em;
        }

        .mobile-subcat-item {
          padding: 6px 10px;
          text-decoration: none;
          color: #64748B;
          font-family: var(--font-body, sans-serif);
          font-size: 13px;
        }

        .mobile-menu-footer {
          padding: 24px 20px;
          background-color: #F1EFEA;
          border-top: 1px solid #ECEAE5;
        }

        .footer-links-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 12px;
          margin-bottom: 20px;
        }

        .footer-links-grid a {
          text-decoration: none;
          color: #64748B;
          font-size: 12px;
          font-family: var(--font-body, sans-serif);
        }

        .mobile-menu-copyright {
          font-size: 10px;
          color: #94A3B8;
          text-align: center;
          margin: 0;
          letter-spacing: 0.06em;
        }

        @keyframes menuSlideIn {
          from { opacity: 0; transform: translateX(-100%); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}} />
    </div>
  );
}
