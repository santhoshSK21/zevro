'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import { useWishlistStore } from '../../store/wishlistStore';

interface ProductCardProps {
  product: any;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const { isWishlisted, toggleWishlist } = useWishlistStore();

  // Gather all unique images from product top-level and variants
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

  return (
    <motion.div
      className="pcard"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.6, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="pcard-image-wrap">
        <Link href={`/products/${product.slug}`} className="pcard-link">
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              priority={index < 4}
              loading={index < 4 ? 'eager' : 'lazy'}
              className={`pcard-img-primary ${hasSecondary ? 'pcard-has-hover' : ''}`}
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          ) : (
            <div className="pcard-placeholder">
              <span className="label-caps">No Image</span>
            </div>
          )}

          {hasSecondary && (
            <Image
              src={secondaryImage}
              alt={`${product.name} alternate view`}
              fill
              className="pcard-img-secondary"
              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            />
          )}
        </Link>
        
        {/* Minimal Wishlist Button */}
        <button 
          className={`pcard-wishlist-btn ${inWishlist ? 'is-active' : ''}`}
          aria-label={inWishlist ? "Remove from wishlist" : "Add to wishlist"}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleWishlist(productId);
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill={inWishlist ? "var(--color-ink)" : "none"} stroke="var(--color-ink)" strokeWidth="1.5">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
          </svg>
        </button>
      </div>

      {/* Understated Editorial Product Info */}
      <div className="pcard-info">
        <Link href={`/products/${product.slug}`}>
          <span className="pcard-category">
            {product.category?.replace(/-/g, ' ') || 'Collection'}
          </span>
          <h3 className="pcard-name">{product.name}</h3>
          <div className="pcard-price-row">
            <span className="pcard-price">₹{(product.price / 100).toLocaleString('en-IN')}</span>
            {product.originalPrice > product.price && (
              <span className="pcard-mrp">
                ₹{(product.originalPrice / 100).toLocaleString('en-IN')}
              </span>
            )}
          </div>
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .pcard {
          position: relative;
          display: flex;
          flex-direction: column;
        }
        .pcard-image-wrap {
          position: relative;
          aspect-ratio: 3/4;
          width: 100%;
          overflow: hidden;
          background-color: var(--color-surface);
        }
        .pcard-link {
          display: block;
          position: absolute;
          inset: 0;
        }
        .pcard-img-primary {
          object-fit: cover;
          z-index: 2;
          transition: opacity 0.5s ease;
        }
        .pcard:hover .pcard-has-hover {
          opacity: 0;
        }
        .pcard-img-secondary {
          object-fit: cover;
          z-index: 1;
        }
        .pcard-placeholder {
          position: absolute;
          inset: 0;
          background: var(--color-surface);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pcard-wishlist-btn {
          position: absolute;
          top: 10px;
          right: 10px;
          z-index: 10;
          background: rgba(245, 241, 232, 0.85);
          border: none;
          width: 30px;
          height: 30px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: var(--color-ink);
          opacity: 0;
          transform: translateY(2px);
          transition: all 0.3s ease;
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
        }
        .pcard:hover .pcard-wishlist-btn,
        .pcard-wishlist-btn.is-active {
          opacity: 1;
          transform: translateY(0);
        }
        .pcard-info {
          padding-top: 12px;
          display: flex;
          flex-direction: column;
        }
        .pcard-category {
          font-family: var(--font-ui);
          font-size: 10px;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: var(--color-ink-muted);
          margin-bottom: 3px;
        }
        .pcard-name {
          font-family: var(--font-body);
          font-size: 12px;
          color: var(--color-ink);
          text-transform: uppercase;
          letter-spacing: 0.08em;
          font-weight: 500;
          margin: 0 0 6px 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .pcard-price-row {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        .pcard-price {
          font-family: var(--font-body);
          font-size: 13px;
          font-weight: 600;
          color: var(--color-ink);
        }
        .pcard-mrp {
          font-family: var(--font-body);
          font-size: 11px;
          color: var(--color-ink-muted);
          text-decoration: line-through;
        }
      `}} />
    </motion.div>
  );
}
