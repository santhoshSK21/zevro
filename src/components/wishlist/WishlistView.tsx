'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { Heart, Trash2, ShoppingBag, ArrowRight, Sparkles, Check } from 'lucide-react';

export default function WishlistView() {
  const { productIds, removeFromWishlist } = useWishlistStore();
  const { addItem } = useCartStore();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [addedIds, setAddedIds] = useState<string[]>([]);
  const [bulkAdding, setBulkAdding] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadWishlistProducts() {
      if (productIds.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        const res = await fetch('/api/products?limit=50');
        const data = await res.json();
        const allProds = data.products || [];

        // Filter products matching productIds
        const matched = allProds.filter((p: any) => 
          productIds.includes(p._id?.toString()) || productIds.includes(p.slug)
        );

        if (isMounted) {
          // If some productIds were not in DB, create clean display entries if available
          setProducts(matched);
        }
      } catch (err) {
        console.error('Failed to load wishlist products:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadWishlistProducts();
    return () => { isMounted = false; };
  }, [productIds]);

  const handleAddToCart = (product: any) => {
    const primaryImg = product.images?.[0] || product.image || '/pdp_hero_1.png';
    const sku = product.variants?.[0]?.sizes?.[0]?.sku || product.sku || `${product._id}-w`;
    const prodId = product._id?.toString() || product.slug;

    addItem({
      productId: prodId,
      variantId: product.variants?.[0]?._id?.toString() || product.slug,
      sku,
      name: product.name,
      image: primaryImg,
      color: product.variants?.[0]?.color?.name || 'Classic',
      size: product.variants?.[0]?.sizes?.[0]?.size || 'One Size',
      quantity: 1,
      price: product.price,
      originalPrice: product.originalPrice || product.price
    });

    setAddedIds(prev => [...prev, prodId]);
    setTimeout(() => {
      setAddedIds(prev => prev.filter(id => id !== prodId));
    }, 2000);
  };

  const handleMoveAllToBag = () => {
    setBulkAdding(true);
    products.forEach(p => handleAddToCart(p));
    setTimeout(() => {
      setBulkAdding(false);
    }, 1200);
  };

  if (loading) {
    return (
      <div className="wishlist-loading-wrap">
        <div className="wishlist-spinner" />
        <p>Loading your saved pieces...</p>
      </div>
    );
  }

  if (productIds.length === 0 || products.length === 0) {
    return (
      <div className="wishlist-empty-card">
        <div className="wishlist-empty-icon-wrap">
          <Heart size={32} className="text-gold" />
        </div>
        <div className="wishlist-eyebrow">
          <Sparkles size={12} className="text-gold" />
          <span>YOUR SAVED PIECES</span>
        </div>
        <h2 className="wishlist-empty-title">Your wishlist is currently empty</h2>
        <p className="wishlist-empty-desc">
          Save pieces you adore while browsing our curated runways and revisit them when you are ready to curate your bespoke wardrobe.
        </p>
        <Link href="/products" className="wishlist-explore-btn">
          <span>EXPLORE ATELIER COLLECTION</span>
          <ArrowRight size={14} />
        </Link>
      </div>
    );
  }

  return (
    <div className="wishlist-container">
      {/* Top Header & Actions Bar */}
      <div className="wishlist-top-bar">
        <div>
          <div className="wishlist-eyebrow">
            <Sparkles size={12} className="text-gold" />
            <span>PERSONAL CURATION</span>
          </div>
          <h1 className="wishlist-main-title">Saved Garments ({products.length})</h1>
        </div>

        <button 
          onClick={handleMoveAllToBag} 
          disabled={bulkAdding}
          className="wishlist-move-all-btn"
        >
          <ShoppingBag size={14} />
          <span>{bulkAdding ? 'ADDING ALL...' : 'MOVE ALL TO BAG'}</span>
        </button>
      </div>

      {/* Grid of Wishlist Product Cards */}
      <div className="wishlist-grid">
        {products.map(product => {
          const prodId = product._id?.toString() || product.slug;
          const primaryImg = product.images?.[0] || product.image || '/pdp_hero_1.png';
          const isAdded = addedIds.includes(prodId);

          return (
            <div key={prodId} className="wishlist-card">
              {/* Image Container with Remove Trigger */}
              <div className="wishlist-img-box">
                <Link href={`/products/${product.slug || prodId}`} className="wishlist-img-link">
                  <Image
                    src={primaryImg}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="wishlist-img"
                  />
                </Link>

                <button
                  onClick={() => removeFromWishlist(prodId)}
                  className="wishlist-remove-btn"
                  title="Remove from wishlist"
                  aria-label="Remove item"
                >
                  <Trash2 size={15} />
                </button>

                {product.originalPrice > product.price && (
                  <div className="wishlist-badge-sale">
                    {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="wishlist-info">
                <span className="wishlist-cat">
                  {product.category?.replace(/-/g, ' ') || 'Haute Couture'}
                </span>
                
                <Link href={`/products/${product.slug || prodId}`} className="wishlist-title-link">
                  <h3 className="wishlist-prod-name">{product.name}</h3>
                </Link>

                <div className="wishlist-price-row">
                  <span className="wishlist-price">₹{(product.price / 100).toLocaleString('en-IN')}</span>
                  {product.originalPrice > product.price && (
                    <span className="wishlist-mrp">₹{(product.originalPrice / 100).toLocaleString('en-IN')}</span>
                  )}
                </div>

                <button
                  onClick={() => handleAddToCart(product)}
                  className={`wishlist-add-bag-btn ${isAdded ? 'added' : ''}`}
                >
                  {isAdded ? (
                    <>
                      <Check size={14} />
                      <span>ADDED TO BAG</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={14} />
                      <span>ADD TO BAG</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
        .wishlist-container {
          width: 100%;
          font-family: var(--font-body, system-ui, sans-serif);
        }
        .text-gold { color: #C5A880; }

        /* Loading */
        .wishlist-loading-wrap {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 80px 20px;
          gap: 16px;
          color: #777;
        }
        .wishlist-spinner {
          width: 32px;
          height: 32px;
          border: 2px solid rgba(197, 168, 128, 0.2);
          border-top-color: #C5A880;
          border-radius: 50%;
          animation: wspin 0.8s linear infinite;
        }
        @keyframes wspin { to { transform: rotate(360deg); } }

        /* Empty State */
        .wishlist-empty-card {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.08);
          border-radius: 12px;
          padding: 70px 24px;
          text-align: center;
          max-width: 580px;
          margin: 40px auto;
          box-shadow: 0 4px 24px rgba(0, 0, 0, 0.04);
        }
        .wishlist-empty-icon-wrap {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(197, 168, 128, 0.12);
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 20px;
        }
        .wishlist-empty-title {
          font-family: var(--font-display, serif);
          font-size: clamp(22px, 3vw, 28px);
          color: #121210;
          margin: 0 0 10px 0;
          font-weight: 500;
        }
        .wishlist-empty-desc {
          font-size: 14px;
          color: #666;
          line-height: 1.6;
          margin: 0 0 28px 0;
        }
        .wishlist-explore-btn {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          background: #121210;
          color: #FAF8F5;
          padding: 14px 32px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-decoration: none;
          transition: all 0.2s ease;
        }
        .wishlist-explore-btn:hover {
          background: #C5A880;
          color: #121210;
          transform: translateY(-1px);
        }

        /* Top Bar */
        .wishlist-top-bar {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          margin-bottom: 32px;
          gap: 16px;
          flex-wrap: wrap;
        }
        .wishlist-eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #C5A880;
          font-weight: 700;
          margin-bottom: 6px;
        }
        .wishlist-main-title {
          font-family: var(--font-display, serif);
          font-size: clamp(24px, 3.5vw, 32px);
          color: #121210;
          margin: 0;
          font-weight: 500;
          letter-spacing: 0.04em;
        }
        .wishlist-move-all-btn {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: #FAF8F5;
          border: 1px solid rgba(0, 0, 0, 0.15);
          color: #121210;
          padding: 10px 20px;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.12em;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .wishlist-move-all-btn:hover:not(:disabled) {
          background: #121210;
          color: #FAF8F5;
          border-color: #121210;
        }

        /* Grid */
        .wishlist-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 28px;
        }
        @media (max-width: 600px) {
          .wishlist-grid {
            grid-template-columns: repeat(2, 1fr);
            gap: 16px;
          }
        }

        /* Card */
        .wishlist-card {
          background: #FFFFFF;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 8px;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        .wishlist-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
        }

        .wishlist-img-box {
          position: relative;
          width: 100%;
          aspect-ratio: 3/4;
          background: #F4F1EC;
          overflow: hidden;
        }
        .wishlist-img-link {
          display: block;
          width: 100%;
          height: 100%;
        }
        .wishlist-img {
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .wishlist-card:hover .wishlist-img {
          transform: scale(1.04);
        }

        .wishlist-remove-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 10;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(6px);
          border: 1px solid rgba(0, 0, 0, 0.08);
          color: #666;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .wishlist-remove-btn:hover {
          background: #EF4444;
          color: #FFFFFF;
          border-color: #EF4444;
        }

        .wishlist-badge-sale {
          position: absolute;
          bottom: 10px;
          left: 10px;
          background: #121210;
          color: #FAF8F5;
          font-size: 10px;
          font-weight: 700;
          padding: 3px 8px;
          border-radius: 4px;
          letter-spacing: 0.06em;
        }

        .wishlist-info {
          padding: 16px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .wishlist-cat {
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #888;
          font-weight: 600;
          margin-bottom: 4px;
        }
        .wishlist-title-link {
          text-decoration: none;
          color: inherit;
        }
        .wishlist-prod-name {
          font-size: 14px;
          font-weight: 500;
          color: #121210;
          margin: 0 0 10px 0;
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 40px;
        }
        .wishlist-prod-name:hover {
          color: #C5A880;
        }
        .wishlist-price-row {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-bottom: 16px;
        }
        .wishlist-price {
          font-size: 15px;
          font-weight: 700;
          color: #121210;
          font-family: var(--font-ui, sans-serif);
        }
        .wishlist-mrp {
          font-size: 12px;
          color: #999;
          text-decoration: line-through;
        }

        .wishlist-add-bag-btn {
          margin-top: auto;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          width: 100%;
          padding: 11px;
          border-radius: 4px;
          background: #121210;
          color: #FAF8F5;
          border: 1px solid #121210;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.14em;
          cursor: pointer;
          transition: all 0.2s ease;
        }
        .wishlist-add-bag-btn:hover {
          background: #C5A880;
          border-color: #C5A880;
          color: #121210;
        }
        .wishlist-add-bag-btn.added {
          background: #16A34A;
          border-color: #16A34A;
          color: #FFFFFF;
        }
      `}} />
    </div>
  );
}
