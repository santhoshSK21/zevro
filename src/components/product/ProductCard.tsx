'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';

interface ProductCardProps {
  product: any;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const prefersReducedMotion = useReducedMotion();

  const primaryImage = product.image || product.variants?.[0]?.images?.[0] || '';
  const secondaryImage = product.variants?.[0]?.images?.[1] || '';
  const hasSecondary = secondaryImage && secondaryImage !== primaryImage;

  return (
    <motion.div
      className="pcard"
      initial={prefersReducedMotion ? false : { opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay: index * 0.08, ease: [0.16, 1, 0.3, 1] }}
    >
      {/* Image Container */}
      <div className="pcard-image-wrap">
        <Link href={`/products/${product.slug}`}>
          {primaryImage ? (
            <Image
              src={primaryImage}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className="pcard-img-primary"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <div className="pcard-placeholder">
              <span className="label-caps" style={{ color: 'var(--color-stone)' }}>No Image</span>
            </div>
          )}

          {/* Secondary image on hover */}
          {hasSecondary && (
            <Image
              src={secondaryImage}
              alt={product.name}
              fill
              style={{ objectFit: 'cover' }}
              className="pcard-img-secondary"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </Link>

        {/* Wishlist icon — top right, hover only */}
        <button className="pcard-wishlist" aria-label="Add to wishlist">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="var(--color-ink)" strokeWidth="1.5">
            <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
          </svg>
        </button>

        {/* Quick-add button — slides up from bottom */}
        <button className="pcard-quick-add btn-primary">
          Add to Bag
        </button>

        {/* NEW badge */}
        {product.isNew && (
          <span className="pcard-badge label-caps">New</span>
        )}
      </div>

      {/* Product Info */}
      <div className="pcard-info">
        <Link href={`/products/${product.slug}`}>
          <p className="pcard-category label-caps">
            {product.category?.replace(/-/g, ' ') || 'Collection'}
          </p>
          <h3 className="pcard-name">{product.name}</h3>
          <div className="pcard-price-row">
            <span className="pcard-price">₹{(product.price / 100).toLocaleString('en-IN')}</span>
            {product.originalPrice > product.price && (
              <>
                <span className="pcard-mrp">
                  ₹{(product.originalPrice / 100).toLocaleString('en-IN')}
                </span>
                <span className="pcard-discount">
                  {Math.round((1 - product.price / product.originalPrice) * 100)}% Off
                </span>
              </>
            )}
          </div>
        </Link>
      </div>

      <style dangerouslySetInnerHTML={{__html: `
        .pcard {
          position: relative;
          cursor: pointer;
        }
        .pcard-image-wrap {
          position: relative;
          aspect-ratio: 3/4;
          overflow: hidden;
          background: var(--color-surface);
        }
        .pcard-img-primary {
          z-index: 2;
          transition: transform 0.9s var(--ease-out-expo);
        }
        .pcard:hover .pcard-img-primary {
          transform: scale(1.04);
        }
        .pcard-img-secondary {
          z-index: 3;
          opacity: 0;
          transition: opacity 0.5s var(--ease-in-out);
        }
        .pcard:hover .pcard-img-secondary {
          opacity: 1;
        }
        .pcard-placeholder {
          position: absolute;
          inset: 0;
          background: var(--color-surface);
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pcard-wishlist {
          position: absolute;
          top: var(--space-3);
          right: var(--space-3);
          z-index: 10;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          border: none;
          cursor: pointer;
          opacity: 0;
          transition: opacity 0.3s var(--ease-in-out);
        }
        .pcard:hover .pcard-wishlist {
          opacity: 1;
        }
        .pcard-wishlist.active svg {
          fill: var(--color-ink);
        }
        .pcard-quick-add {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 10;
          width: 100%;
          transform: translateY(100%);
          opacity: 0;
          transition: transform 0.4s var(--ease-out-expo), opacity 0.4s var(--ease-out-expo);
        }
        .pcard:hover .pcard-quick-add {
          transform: translateY(0);
          opacity: 1;
        }
        .pcard-badge {
          position: absolute;
          top: var(--space-3);
          left: var(--space-3);
          z-index: 10;
          background: var(--color-ink);
          color: var(--color-white);
          padding: var(--space-1) var(--space-3);
        }
        .pcard-info {
          padding-top: var(--space-3);
        }
        .pcard-category {
          margin-bottom: var(--space-1);
        }
        .pcard-name {
          font-family: var(--font-display);
          font-size: var(--text-md);
          font-weight: 400;
          color: var(--color-ink);
          margin-bottom: var(--space-1);
          line-height: 1.3;
        }
        .pcard-price-row {
          display: flex;
          align-items: center;
          gap: var(--space-2);
          flex-wrap: wrap;
        }
        .pcard-price {
          font-family: var(--font-ui);
          font-size: var(--text-sm);
          font-weight: 400;
          color: var(--color-ink);
        }
        .pcard-mrp {
          font-family: var(--font-ui);
          font-size: var(--text-xs);
          color: var(--color-ink-muted);
          text-decoration: line-through;
        }
        .pcard-discount {
          font-family: var(--font-ui);
          font-size: var(--text-xs);
          color: var(--color-error);
          font-weight: 500;
        }
      `}} />
    </motion.div>
  );
}
