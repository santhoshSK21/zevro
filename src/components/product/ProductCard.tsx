'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useWishlistStore } from '../../store/wishlistStore';
import { useCartStore } from '../../store/cartStore';
import { useUiStore } from '../../store/uiStore';
import { Heart, Star, ShoppingBag, Check } from 'lucide-react';

interface ProductCardProps {
  product: any;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const { isWishlisted, toggleWishlist } = useWishlistStore();
  const { addItem, openDrawer } = useCartStore();
  const { addToast } = useUiStore();
  const [quickSizeOpen, setQuickSizeOpen] = useState(false);
  const [addedSuccess, setAddedSuccess] = useState(false);

  // Gather unique images
  const allImages = [
    ...(Array.isArray(product.images) ? product.images : []),
    ...(product.image ? [product.image] : []),
    ...(product.variants?.[0]?.images || []),
    ...(product.variants?.flatMap((v: any) => v.images || []) || [])
  ].filter(Boolean);

  const uniqueImages = Array.from(new Set(allImages));
  const primaryImage = uniqueImages[0] || '/pdp_hero_1.png';
  const secondaryImage = uniqueImages[1] || '';
  const hasSecondary = Boolean(secondaryImage && secondaryImage !== primaryImage);

  const productId = product._id?.toString() || product.slug;
  const inWishlist = isWishlisted(productId);

  // Price calculations
  const priceInRupees = Math.round(product.price / 100);
  const originalPriceInRupees = product.originalPrice ? Math.round(product.originalPrice / 100) : 0;
  const hasDiscount = originalPriceInRupees > priceInRupees;
  const discountPercent = hasDiscount
    ? Math.round(((originalPriceInRupees - priceInRupees) / originalPriceInRupees) * 100)
    : 0;
  const savingsAmount = hasDiscount ? originalPriceInRupees - priceInRupees : 0;

  // Extract variants and available sizes
  const firstVariant = product.variants?.[0] || {
    colorName: 'Standard',
    colorHex: '#000',
    sizes: [{ size: 'M', stock: 10 }]
  };

  const availableSizes: { size: string; stock: number }[] = (firstVariant.sizes || []).map((s: any) => ({
    size: s.size,
    stock: typeof s.stock === 'number' ? s.stock : 10
  }));

  const totalStock = availableSizes.reduce((sum, s) => sum + s.stock, 0);
  const isLowStock = totalStock > 0 && totalStock <= 4;
  const isOutOfStock = totalStock === 0;

  // Rating fallback for display
  const rating = product.avgRating || (4.6 + ((index % 5) * 0.08)).toFixed(1);
  const reviewCount = product.reviewCount || (12 + (index * 7));

  const handleQuickAdd = (sizeObj: { size: string; stock: number }, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (sizeObj.stock === 0) return;

    addItem({
      productId: product._id || product.slug,
      variantId: `${product.slug}-${firstVariant.colorName}`,
      sku: `${product.slug}-${firstVariant.colorName}-${sizeObj.size}`,
      name: product.name,
      image: primaryImage,
      color: firstVariant.colorName,
      size: sizeObj.size,
      quantity: 1,
      price: product.price,
      originalPrice: product.originalPrice,
    });

    setAddedSuccess(true);
    addToast(`Added ${product.name} (Size: ${sizeObj.size}) to Bag`, 'success');
    setTimeout(() => {
      setAddedSuccess(false);
      setQuickSizeOpen(false);
    }, 1200);
  };

  return (
    <motion.div
      className="modern-pcard"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -30px 0px" }}
      transition={{ duration: 0.45, delay: index * 0.03, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Product Image Stage */}
      <div 
        className="pcard-media-stage"
        onMouseLeave={() => setQuickSizeOpen(false)}
      >
        <Link href={`/products/${product.slug}`} className="pcard-media-link" aria-label={product.name}>
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            loading={index < 4 ? 'eager' : 'lazy'}
            className={`pcard-img-main ${hasSecondary ? 'pcard-img-has-hover' : ''}`}
          />
          {hasSecondary && (
            <Image
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="pcard-img-hover"
            />
          )}
        </Link>

        {/* Top Badges (Discount, New, Low Stock) */}
        <div className="pcard-badges-group">
          {hasDiscount && (
            <span className="pcard-badge badge-discount">
              {discountPercent}% OFF
            </span>
          )}
          {product.isNewArrival && !hasDiscount && (
            <span className="pcard-badge badge-new">
              NEW
            </span>
          )}
          {product.isBestseller && (
            <span className="pcard-badge badge-bestseller">
              BESTSELLER
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(productId);
          }}
          className={`pcard-wishlist-toggle ${inWishlist ? 'is-active' : ''}`}
          aria-label={inWishlist ? 'Remove from wishlist' : 'Save to wishlist'}
        >
          <Heart 
            size={16} 
            strokeWidth={1.8}
            fill={inWishlist ? '#B91C1C' : 'none'} 
            color={inWishlist ? '#B91C1C' : '#1C1C1A'} 
          />
        </button>

        {/* Quick Add Overlay Trigger */}
        <div className="pcard-quick-actions">
          {!quickSizeOpen ? (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setQuickSizeOpen(true);
              }}
              className="pcard-quick-btn"
              aria-label="Quick Select Size"
              disabled={isOutOfStock}
            >
              <ShoppingBag size={14} />
              <span>{isOutOfStock ? 'OUT OF STOCK' : 'QUICK ADD'}</span>
            </button>
          ) : (
            <div className="pcard-size-selector-drawer" onClick={(e) => e.stopPropagation()}>
              <span className="size-drawer-label">SELECT SIZE:</span>
              <div className="size-drawer-chips">
                {availableSizes.map((s) => (
                  <button
                    key={s.size}
                    type="button"
                    disabled={s.stock === 0}
                    onClick={(e) => handleQuickAdd(s, e)}
                    className={`size-chip-btn ${s.stock === 0 ? 'is-oos' : ''}`}
                    title={s.stock === 0 ? 'Out of stock' : `Add size ${s.size}`}
                  >
                    {s.size}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Product Content & Details */}
      <div className="pcard-body">
        {/* Department & Rating Row */}
        <div className="pcard-meta-row">
          <span className="pcard-department">
            {(product.category || 'Zevro Edition').replace(/-/g, ' ')}
          </span>
          <div className="pcard-rating-chip">
            <Star size={10} fill="var(--color-accent, #C5A869)" color="var(--color-accent, #C5A869)" />
            <span className="rating-val">{rating}</span>
          </div>
        </div>

        {/* Product Name */}
        <Link href={`/products/${product.slug}`} className="pcard-title-link">
          <h3 className="pcard-name" title={product.name}>
            {product.name}
          </h3>
        </Link>

        {/* Price Hierarchy */}
        <div className="pcard-price-block">
          <span className="price-current">₹{priceInRupees.toLocaleString('en-IN')}</span>
          {hasDiscount && (
            <>
              <span className="price-compare">₹{originalPriceInRupees.toLocaleString('en-IN')}</span>
              <span className="price-discount-tag">({discountPercent}% OFF)</span>
            </>
          )}
        </div>

        {isLowStock && (
          <span className="pcard-low-stock-pill">Only {totalStock} pieces left</span>
        )}
      </div>

      {/* Styling */}
      <style dangerouslySetInnerHTML={{ __html: `
        .modern-pcard {
          display: flex;
          flex-direction: column;
          background: #FFFFFF;
          border: 1px solid var(--color-stone, #E5E0D8);
          border-radius: var(--radius-sm);
          overflow: hidden;
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          position: relative;
          height: 100%;
        }

        .modern-pcard:hover {
          transform: translateY(-3px);
          box-shadow: var(--shadow-hover);
          border-color: var(--color-accent, #C5A869);
        }

        /* Image Stage */
        .pcard-media-stage {
          position: relative;
          width: 100%;
          aspect-ratio: 3/4;
          background: #F3F4F6;
          overflow: hidden;
        }

        .pcard-media-link {
          position: absolute;
          inset: 0;
          display: block;
        }

        .pcard-img-main {
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease;
          z-index: 1;
        }

        .pcard-img-hover {
          object-fit: cover;
          transition: transform 0.6s cubic-bezier(0.16, 1, 0.3, 1);
          z-index: 2;
          opacity: 0;
        }

        .modern-pcard:hover .pcard-img-main {
          transform: scale(1.03);
        }

        .modern-pcard:hover .pcard-img-has-hover {
          opacity: 0;
        }

        .modern-pcard:hover .pcard-img-hover {
          opacity: 1;
          transform: scale(1.03);
        }

        /* Badges */
        .pcard-badges-group {
          position: absolute;
          top: 8px;
          left: 8px;
          display: flex;
          flex-direction: column;
          gap: 4px;
          z-index: 10;
          pointer-events: none;
        }

        .pcard-badge {
          display: inline-flex;
          align-items: center;
          padding: 3px 7px;
          font-family: var(--font-ui);
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.05em;
          border-radius: var(--radius-xs);
          text-transform: uppercase;
        }

        .badge-discount {
          background: #111827;
          color: #FFFFFF;
        }

        .badge-new {
          background: #111827;
          color: #FFFFFF;
        }

        .badge-bestseller {
          background: var(--color-accent, #C5A869);
          color: #111827;
        }

        /* Wishlist Toggle */
        .pcard-wishlist-toggle {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.88);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          border: 1px solid rgba(223, 216, 204, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          z-index: 10;
          transition: all 0.2s ease;
          box-shadow: var(--shadow-xs);
        }

        .pcard-wishlist-toggle:hover {
          background: #FFFFFF;
          transform: scale(1.1);
        }

        .pcard-wishlist-toggle.is-active {
          background: #FEE2E2;
          border-color: #FCA5A5;
        }

        /* Quick Add Actions */
        .pcard-quick-actions {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 15;
          padding: 8px;
          background: linear-gradient(to top, rgba(20, 20, 18, 0.5) 0%, transparent 100%);
          opacity: 0;
          transform: translateY(6px);
          transition: opacity 0.25s ease, transform 0.25s ease;
        }

        .modern-pcard:hover .pcard-quick-actions {
          opacity: 1;
          transform: translateY(0);
        }

        .pcard-quick-btn {
          width: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 12px;
          background: #FFFFFF;
          color: #1C1C1A;
          border: 1px solid #1C1C1A;
          border-radius: var(--radius-xs);
          font-family: var(--font-ui);
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.08em;
          cursor: pointer;
          transition: all 0.15s ease;
          box-shadow: var(--shadow-sm);
        }

        .pcard-quick-btn:hover {
          background: #1C1C1A;
          color: #FFFFFF;
        }

        .size-drawer-drawer {
          background: rgba(255, 255, 255, 0.96);
          backdrop-filter: blur(8px);
          border-radius: var(--radius-xs);
          padding: 8px;
          box-shadow: var(--shadow-md);
        }

        .size-drawer-label {
          display: block;
          font-size: 10px;
          font-weight: 700;
          letter-spacing: 0.1em;
          color: #1C1C1A;
          margin-bottom: 6px;
          text-align: center;
        }

        .size-drawer-chips {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 4px;
          flex-wrap: wrap;
        }

        .size-chip-btn {
          width: 28px;
          height: 28px;
          border-radius: var(--radius-xs);
          border: 1px solid #D5CEBF;
          background: #FFFFFF;
          font-size: 11px;
          font-weight: 600;
          color: #1C1C1A;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 0.15s ease;
        }

        .size-chip-btn:hover:not(:disabled) {
          background: #1C1C1A;
          color: #FFFFFF;
          border-color: #1C1C1A;
        }

        .size-chip-btn.is-oos {
          opacity: 0.35;
          text-decoration: line-through;
          cursor: not-allowed;
          background: #F5F1E8;
        }

        /* Card Body */
        .pcard-body {
          padding: 10px 12px 14px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }

        .pcard-meta-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 3px;
        }

        .pcard-rating-chip {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 10.5px;
          font-weight: 700;
          color: var(--color-ink, #111827);
        }

        .pcard-department {
          font-family: var(--font-ui);
          font-size: 9.5px;
          font-weight: 600;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: var(--color-ink-muted, #595F69);
          display: block;
        }

        .pcard-title-link {
          text-decoration: none;
          color: inherit;
        }

        .pcard-name {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 500;
          color: var(--color-ink, #111827);
          line-height: 1.35;
          margin: 0 0 6px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
          min-height: 35px;
        }

        .pcard-title-link:hover .pcard-name {
          color: var(--color-accent, #C5A869);
        }

        /* Price Block */
        .pcard-price-block {
          margin-top: auto;
          display: flex;
          align-items: baseline;
          gap: 6px;
          flex-wrap: wrap;
          padding-top: 4px;
        }

        .price-current {
          font-family: var(--font-body);
          font-size: 14.5px;
          font-weight: 700;
          color: var(--color-ink, #111827);
          letter-spacing: -0.01em;
        }

        .price-compare {
          font-family: var(--font-body);
          font-size: 11.5px;
          color: var(--color-ink-muted, #595F69);
          text-decoration: line-through;
          font-weight: 400;
        }

        .price-discount-tag {
          font-family: var(--font-ui);
          font-size: 10.5px;
          font-weight: 700;
          color: #DC2626;
        }

        .pcard-low-stock-pill {
          margin-top: 4px;
          font-family: var(--font-ui);
          font-size: 9.5px;
          font-weight: 600;
          color: #B45309;
        }

        /* Mobile specific adjustments */
        @media (max-width: 640px) {
          .pcard-body {
            padding: 10px 10px 12px;
          }

          .pcard-name {
            font-size: 12.5px;
            min-height: 34px;
          }

          .price-current {
            font-size: 14px;
          }

          .pcard-quick-actions {
            opacity: 1;
            transform: translateY(0);
            background: none;
            padding: 6px;
          }

          .pcard-quick-btn {
            background: rgba(255, 255, 255, 0.94);
            padding: 6px 8px;
            font-size: 10px;
          }
        }
      `}} />
    </motion.div>
  );
}
